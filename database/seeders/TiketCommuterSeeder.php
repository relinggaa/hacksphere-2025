<?php

namespace Database\Seeders;

use App\Models\TiketCommuter;
use Illuminate\Database\Seeder;

class TiketCommuterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tikets = [
            [
                'nama_kereta' => 'KRL Commuter Line',
                'kelas' => 'Ekonomi',
                'harga_murah' => 3000,
                'harga_normal' => 5000,
                'jam_operasional' => '06:00-22:00',
                'stasiun_asal' => 'Jakarta Kota',
                'stasiun_tujuan' => 'Jakarta Kota',
                'interval_jam' => 15,
                'kapasitas_kursi' => 300,
            ],
            [
                'nama_kereta' => 'KRL Commuter Line',
                'kelas' => 'Ekonomi',
                'harga_murah' => 3000,
                'harga_normal' => 5000,
                'jam_operasional' => '06:00-22:00',
                'stasiun_asal' => 'Manggarai',
                'stasiun_tujuan' => 'Bogor',
                'interval_jam' => 20,
                'kapasitas_kursi' => 300,
            ],
            [
                'nama_kereta' => 'KRL Commuter Line',
                'kelas' => 'Ekonomi',
                'harga_murah' => 3000,
                'harga_normal' => 5000,
                'jam_operasional' => '05:30-24:00',
                'stasiun_asal' => 'Depok',
                'stasiun_tujuan' => 'Jakarta Kota',
                'interval_jam' => 12,
                'kapasitas_kursi' => 280,
            ],
            [
                'nama_kereta' => 'KRL Commuter Line',
                'kelas' => 'Ekonomi',
                'harga_murah' => 4000,
                'harga_normal' => 6000,
                'jam_operasional' => '06:00-22:00',
                'stasiun_asal' => 'Bekasi',
                'stasiun_tujuan' => 'Jakarta Kota',
                'interval_jam' => 18,
                'kapasitas_kursi' => 300,
            ],
            [
                'nama_kereta' => 'KRL Commuter Line',
                'kelas' => 'Ekonomi',
                'harga_murah' => 3500,
                'harga_normal' => 5500,
                'jam_operasional' => '06:00-22:00',
                'stasiun_asal' => 'Serpong',
                'stasiun_tujuan' => 'Jakarta Kota',
                'interval_jam' => 20,
                'kapasitas_kursi' => 300,
            ]
        ];

        foreach ($tikets as $tiket) {
            TiketCommuter::create($tiket);
        }
    }
}