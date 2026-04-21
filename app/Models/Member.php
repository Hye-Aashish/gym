<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Member extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'plan',
        'status',
        'join_date',
        'expire_date',
    ];

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }
}
