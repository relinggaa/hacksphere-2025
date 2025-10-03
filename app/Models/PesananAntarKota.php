<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PesananAntarKota extends Model
{
    protected $fillable = [
        'user_id', 'train_id', 'nama_kereta', 'kelas', 'tanggal', 'jam',
        'stasiun_asal', 'stasiun_tujuan', 'harga', 'passenger_name', 'passenger_nik',
        'status', 'booking_code'
    ];

    protected $casts = [
        'tanggal' => 'date',
        'harga' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}


