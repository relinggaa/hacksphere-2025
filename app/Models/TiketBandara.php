<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TiketBandara extends Model
{
    use HasFactory;

    protected $table = 'tiket_bandara';
    
    protected $fillable = [
        'nama_kereta',
        'harga_termurah',
        'jam',
        'tanggal',
        'penumpang',
        'stasiun_asal',
        'stasiun_tujuan'
    ];

    protected $casts = [
        'tanggal' => 'datetime',
        'harga_termurah' => 'string', // Sesuai schema bahwa harga_termurah adalah string
        'penumpang' => 'integer'
    ];
}
