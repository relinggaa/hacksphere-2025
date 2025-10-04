<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Passenger extends Model
{
    protected $fillable = [
        'passenger_group_id',
        'name',
        'nik'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function passengerGroup(): BelongsTo
    {
        return $this->belongsTo(PassengerGroup::class);
    }

    public function scopeForGroup($query, $groupId)
    {
        return $query->where('passenger_group_id', $groupId);
    }

    public function scopeByName($query, $name)
    {
        return $query->where('name', 'like', '%' . $name . '%');
    }
}
