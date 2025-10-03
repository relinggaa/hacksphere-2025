<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TiketCommuter extends Model
{
    use HasFactory;

    protected $table = 'tiket_commuters';
    
    protected $fillable = [
        'nama_kereta',
        'kelas',
        'harga_murah',
        'harga_normal',
        'jam_operasional',
        'stasiun_asal',
        'stasiun_tujuan',
        'interval_jam',
        'kapasitas_kursi'
    ];

    protected $casts = [
        'harga_murah' => 'decimal:2',
        'harga_normal' => 'decimal:2'
    ];
}
