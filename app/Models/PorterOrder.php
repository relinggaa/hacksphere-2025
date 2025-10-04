<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PorterOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'porter_id',
        'user_id',
        'pickup_location',
        'destination',
        'service_type',
        'notes',
        'scheduled_time',
        'price',
        'status',
    ];

    protected $casts = [
        'scheduled_time' => 'datetime',
    ];

    public function porter()
    {
        return $this->belongsTo(Porter::class, 'porter_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
