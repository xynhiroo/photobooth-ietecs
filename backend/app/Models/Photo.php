<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Photo extends Model
{
    protected $fillable = [
        'user_id',
        'image_url',
        'public_id',
        'filters_used',
        'share_token'
    ];

    protected $casts = [
        'filters_used' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
