<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Stasiun extends Model
{
    protected $table = 'stasiuns';
    protected $primaryKey = 'station_id';
    
    protected $fillable = [
        'nama_stasiun',
        'kota'
    ];
}
