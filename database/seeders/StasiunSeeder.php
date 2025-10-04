<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Stasiun;

class StasiunSeeder extends Seeder
{
    public function run(): void
    {
        Stasiun::truncate();

        $stasiuns = [
            ['nama_stasiun' => 'Gambir', 'kota' => 'Jakarta'],
            ['nama_stasiun' => 'Pasar Senen', 'kota' => 'Jakarta'],
            ['nama_stasiun' => 'Manggarai', 'kota' => 'Jakarta'],
            ['nama_stasiun' => 'Bekasi', 'kota' => 'Bekasi'],
            ['nama_stasiun' => 'Bandung', 'kota' => 'Bandung'],
            ['nama_stasiun' => 'Cirebon', 'kota' => 'Cirebon'],
            ['nama_stasiun' => 'Purwakarta', 'kota' => 'Purwakarta'],
            ['nama_stasiun' => 'Yogyakarta', 'kota' => 'Yogyakarta'],
            ['nama_stasiun' => 'Semarang Tawang', 'kota' => 'Semarang'],
            ['nama_stasiun' => 'Surabaya Gubeng', 'kota' => 'Surabaya']
        ];

        foreach ($stasiuns as $stasiun) {
            Stasiun::create($stasiun);
        }
    }
}