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

    /**
     * Get the passenger group that owns the passenger.
     */
    public function passengerGroup(): BelongsTo
    {
        return $this->belongsTo(PassengerGroup::class);
    }

    /**
     * Scope to filter by passenger group
     */
    public function scopeForGroup($query, $groupId)
    {
        return $query->where('passenger_group_id', $groupId);
    }

    /**
     * Scope to search by name
     */
    public function scopeByName($query, $name)
    {
        return $query->where('name', 'like', '%' . $name . '%');
    }
}
