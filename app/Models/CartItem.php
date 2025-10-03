<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CartItem extends Model
{
    protected $fillable = [
        'cart_id',
        'train_id',
        'nama_kereta',
        'kelas',
        'tanggal',
        'jam',
        'stasiun_asal',
        'stasiun_tujuan',
        'harga',
        'passenger_name',
        'passenger_nik',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'harga' => 'decimal:2',
    ];

    public function cart(): BelongsTo
    {
        return $this->belongsTo(Cart::class);
    }
}


