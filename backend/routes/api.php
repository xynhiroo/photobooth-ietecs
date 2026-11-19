<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PhotoController;

// Public & Kiosk Photobooth API Endpoints
Route::get('/photos', [PhotoController::class, 'index']);
Route::post('/photos/upload', [PhotoController::class, 'upload']);
Route::delete('/photos/{id}', [PhotoController::class, 'destroy']);
Route::post('/photos/{id}/share', [PhotoController::class, 'generateShareLink']);
Route::get('/shared/{token}', [PhotoController::class, 'getSharedPhoto']);

// Print Queue & Emergency Reprint (Hot Folder Bridge)
Route::post('/photos/print-queue', [PhotoController::class, 'queuePrint']);
Route::post('/photos/reprint-last', [PhotoController::class, 'reprintLast']);
