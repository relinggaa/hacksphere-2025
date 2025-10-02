<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kereta extends Model
{
    protected $table = 'keretas';
    protected $primaryKey = 'train_id';
    
    protected $fillable = [
        'nama_kereta',
        'kelas'
    ];
}
