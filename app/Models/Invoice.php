<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    protected $fillable = [
        'member_id',
        'invoice_number',
        'amount',
        'status',
        'due_date',
        'paid_at',
    ];

    public function member()
    {
        return $this->belongsTo(Member::class);
    }
}
