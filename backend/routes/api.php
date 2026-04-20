<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PhotoController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/shared/{token}', [PhotoController::class, 'getSharedPhoto']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    
    Route::get('/photos', [PhotoController::class, 'index']);
    Route::post('/photos/upload', [PhotoController::class, 'upload']);
    Route::delete('/photos/{id}', [PhotoController::class, 'destroy']);
    Route::post('/photos/{id}/share', [PhotoController::class, 'generateShareLink']);
});
