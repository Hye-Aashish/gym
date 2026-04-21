<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    protected $fillable = [
        'name',
        'duration',
        'price',
        'features',
        'recommended',
    ];

    protected $casts = [
        'features' => 'array',
        'recommended' => 'boolean',
    ];
}
