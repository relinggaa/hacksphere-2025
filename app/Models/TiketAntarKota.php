<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TiketAntarKota extends Model
{
    protected $table = 'tiket_antar_kotas';
    
    protected $fillable = [
        'nama_kereta',
        'kelas',
        'harga_termurah',
        'jam',
        'tanggal',
        'penumpang',
        'stasiun_asal',
        'stasiun_tujuan'
    ];

    protected $casts = [
        'tanggal' => 'date',
        'harga_termurah' => 'decimal:2'
    ];
}
