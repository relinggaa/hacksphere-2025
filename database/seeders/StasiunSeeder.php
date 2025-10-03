<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Stasiun;

class StasiunSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing data
        Stasiun::truncate();

        $stasiuns = [
            // Jakarta & Sekitarnya (4 stasiun)
            ['nama_stasiun' => 'Gambir', 'kota' => 'Jakarta'],
            ['nama_stasiun' => 'Pasar Senen', 'kota' => 'Jakarta'],
            ['nama_stasiun' => 'Manggarai', 'kota' => 'Jakarta'],
            ['nama_stasiun' => 'Bekasi', 'kota' => 'Bekasi'],

            // Jawa Barat (3 stasiun)
            ['nama_stasiun' => 'Bandung', 'kota' => 'Bandung'],
            ['nama_stasiun' => 'Cirebon', 'kota' => 'Cirebon'],
            ['nama_stasiun' => 'Purwakarta', 'kota' => 'Purwakarta'],

            // Jawa Tengah & Yogyakarta (2 stasiun)
            ['nama_stasiun' => 'Yogyakarta', 'kota' => 'Yogyakarta'],
            ['nama_stasiun' => 'Semarang Tawang', 'kota' => 'Semarang'],

            // Jawa Timur (1 stasiun)
            ['nama_stasiun' => 'Surabaya Gubeng', 'kota' => 'Surabaya']
        ];

        foreach ($stasiuns as $stasiun) {
            Stasiun::create($stasiun);
        }
    }
}