<?php

namespace App\Http\Controllers;

use App\Models\Photo;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PhotoController extends Controller
{
    public function index(Request $request)
    {
        $photos = $request->user()->photos()->orderBy('created_at', 'desc')->get();
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

        $photo = Photo::create([
            'user_id' => $request->user()->id,
            'image_url' => asset('storage/' . $filePath),
            'public_id' => $fileName,
            'filters_used' => $request->input('filters', []),
            'share_token' => null,
        ]);

        return response()->json(['success' => true, 'photo' => $photo], 201);
    }

    public function destroy(Request $request, $id)
    {
        $photo = $request->user()->photos()->findOrFail($id);
        
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
        $photo = $request->user()->photos()->findOrFail($id);
        
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
        
        return response()->json([
            'photo' => $photo,
            'user' => $photo->user()->select('name')->first()
        ]);
    }
}
