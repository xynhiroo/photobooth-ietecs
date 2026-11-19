<?php

namespace App\Http\Controllers;

use App\Models\Photo;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PhotoController extends Controller
{
    public function index(Request $request)
    {
        $photos = Photo::orderBy('created_at', 'desc')->get();
        return response()->json($photos);
    }

    public function upload(Request $request)
    {
        $request->validate([
            'image' => 'required|string', // Assuming base64 image from canvas
            'filters' => 'nullable|array'
        ]);

        $base64Image = $request->input('image');
        
        // Remove data URI scheme (e.g., "data:image/jpeg;base64,")
        if (preg_match('/^data:image\/(\w+);base64,/', $base64Image, $type)) {
            $base64Image = substr($base64Image, strpos($base64Image, ',') + 1);
            $type = strtolower($type[1]); // jpg, png, etc.
            
            if (!in_array($type, ['jpg', 'jpeg', 'png', 'webp'])) {
                return response()->json(['error' => 'Invalid image type'], 400);
            }
        } else {
            return response()->json(['error' => 'Invalid image string'], 400);
        }

        $base64Image = str_replace(' ', '+', $base64Image);
        $imageData = base64_decode($base64Image);

        if ($imageData === false) {
            return response()->json(['error' => 'Base64 decode failed'], 400);
        }

        $fileName = 'photo_' . time() . '_' . Str::random(10) . '.' . $type;
        $filePath = 'photos/' . $fileName;

        \Storage::disk('public')->put($filePath, $imageData);

        $shareToken = Str::random(32);

        $userId = $request->user() ? $request->user()->id : 1;

        $photo = Photo::create([
            'user_id' => $userId,
            'image_url' => asset('storage/' . $filePath),
            'public_id' => $fileName,
            'filters_used' => $request->input('filters', []),
            'share_token' => $shareToken,
        ]);

        return response()->json([
            'success' => true, 
            'photo' => $photo,
            'share_token' => $shareToken,
            'share_url' => url('/share/' . $shareToken)
        ], 201);
    }

    public function destroy(Request $request, $id)
    {
        $photo = Photo::findOrFail($id);
        
        // Extract file path from url
        $filePath = str_replace(asset('storage/'), '', $photo->image_url);
        
        if (\Storage::disk('public')->exists($filePath)) {
            \Storage::disk('public')->delete($filePath);
        }

        $photo->delete();

        return response()->json(['success' => true]);
    }

    public function generateShareLink(Request $request, $id)
    {
        $photo = Photo::findOrFail($id);
        
        if (!$photo->share_token) {
            $photo->share_token = Str::random(32);
            $photo->save();
        }

        return response()->json([
            'share_url' => url('/share/' . $photo->share_token),
            'share_token' => $photo->share_token
        ]);
    }

    public function getSharedPhoto($token)
    {
        $photo = Photo::where('share_token', $token)->firstOrFail();
        $user = $photo->user ? $photo->user()->select('name')->first() : (object)['name' => 'HMTI Fair Booth'];
        
        return response()->json([
            'photo' => $photo,
            'user' => $user
        ]);
    }

    public function queuePrint(Request $request)
    {
        $request->validate([
            'image' => 'required|string',
            'copies' => 'nullable|integer|min:1|max:5',
            'filters' => 'nullable|array'
        ]);

        $base64Image = $request->input('image');
        $copies = $request->input('copies', 1);

        if (preg_match('/^data:image\/(\w+);base64,/', $base64Image, $type)) {
            $base64Image = substr($base64Image, strpos($base64Image, ',') + 1);
            $type = strtolower($type[1]);
            if (!in_array($type, ['jpg', 'jpeg', 'png', 'webp'])) {
                $type = 'jpg';
            }
        } else {
            $type = 'jpg';
        }

        $base64Image = str_replace(' ', '+', $base64Image);
        $imageData = base64_decode($base64Image);

        if ($imageData === false) {
            return response()->json(['error' => 'Base64 decode failed'], 400);
        }

        $timestamp = time();
        $random = Str::random(8);
        $fileName = 'HMTI_FAIR_' . $timestamp . '_' . $random . '.' . $type;
        $metaFileName = 'HMTI_FAIR_' . $timestamp . '_' . $random . '.json';

        // 1. Hot Folder Print Queue
        $printQueueDir = 'C:\\Photobooth_PrintQueue';
        if (!file_exists($printQueueDir)) {
            @mkdir($printQueueDir, 0777, true);
        }
        @file_put_contents($printQueueDir . DIRECTORY_SEPARATOR . $fileName, $imageData);
        @file_put_contents($printQueueDir . DIRECTORY_SEPARATOR . $metaFileName, json_encode([
            'image' => $fileName,
            'copies' => $copies,
            'timestamp' => $timestamp,
            'status' => 'pending'
        ]));

        // 2. Archive Folder
        $archiveDir = 'C:\\Photobooth_Archive';
        if (!file_exists($archiveDir)) {
            @mkdir($archiveDir, 0777, true);
        }
        @file_put_contents($archiveDir . DIRECTORY_SEPARATOR . $fileName, $imageData);

        // 3. Web Storage & DB Record
        $filePath = 'photos/' . $fileName;
        \Storage::disk('public')->put($filePath, $imageData);

        $shareToken = Str::random(32);
        $userId = $request->user() ? $request->user()->id : 1;

        $photo = Photo::create([
            'user_id' => $userId,
            'image_url' => asset('storage/' . $filePath),
            'public_id' => $fileName,
            'filters_used' => $request->input('filters', []),
            'share_token' => $shareToken,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Foto dikirim ke antrean cetak (' . $copies . ' lembar) dan siap di-scan!',
            'photo' => $photo,
            'copies' => $copies,
            'file_name' => $fileName,
            'share_token' => $shareToken,
            'share_url' => url('/share/' . $shareToken),
        ], 201);
    }

    public function reprintLast(Request $request)
    {
        $archiveDir = 'C:\\Photobooth_Archive';
        $printQueueDir = 'C:\\Photobooth_PrintQueue';

        if (!file_exists($archiveDir)) {
            return response()->json(['error' => 'Folder arsip belum dibuat'], 404);
        }

        $files = glob($archiveDir . DIRECTORY_SEPARATOR . '*.{jpg,jpeg,png}', GLOB_BRACE);
        if (empty($files)) {
            return response()->json(['error' => 'Belum ada foto yang tersimpan di arsip'], 404);
        }

        usort($files, function($a, $b) {
            return filemtime($b) - filemtime($a);
        });

        $lastFile = $files[0];
        $baseName = basename($lastFile);
        $reprintName = 'REPRINT_' . time() . '_' . $baseName;

        if (!file_exists($printQueueDir)) {
            @mkdir($printQueueDir, 0777, true);
        }

        copy($lastFile, $printQueueDir . DIRECTORY_SEPARATOR . $reprintName);
        @file_put_contents($printQueueDir . DIRECTORY_SEPARATOR . pathinfo($reprintName, PATHINFO_FILENAME) . '.json', json_encode([
            'image' => $reprintName,
            'copies' => 1,
            'timestamp' => time(),
            'is_reprint' => true
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Foto terakhir berhasil dikirim ulang ke antrean printer: ' . $baseName
        ]);
    }
}
