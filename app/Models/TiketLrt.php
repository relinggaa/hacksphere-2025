<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TiketLrt extends Model
{
    use HasFactory;

    protected $table = 'tiket_lrt';
    
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
        'harga_termurah' => 'string',
        'penumpang' => 'integer'
    ];
}
