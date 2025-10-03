<?php

namespace Database\Seeders;

use App\Models\TiketLrt;
use App\Models\Kereta;
use Illuminate\Database\Seeder;

class TiketLrtSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ambil beberapa kereta dari database yang sudah ada
        $keretas = Kereta::limit(3)->get();

        if ($keretas->isEmpty()) {
            // Jika belum ada kereta, buat sample kereta untuk LRT
            $keretas = collect([
                ['nama_kereta' => 'LRT Jakarta', 'kelas' => 'Ekonomi'],
                ['nama_kereta' => 'LRT Bandung', 'kelas' => 'Ekonomi'],
                ['nama_kereta' => 'LRT Surabaya', 'kelas' => 'Ekonomi']
            ])->map(function ($item) {
                return Kereta::create($item);
            });
        }

        $tikets = [
            [
                'nama_kereta' => 'LRT Jakarta',
                'harga_termurah' => '8000',
                'jam' => '06:00',
                'tanggal' => '2024-01-15 06:00:00',
                'penumpang' => 2,
                'stasiun_asal' => 'Lebak Bulus',
                'stasiun_tujuan' => 'Dukuh Atas',
            ],
            [
                'nama_kereta' => 'LRT Jakarta',
                'harga_termurah' => '12000',
                'jam' => '08:30',
                'tanggal' => '2024-01-15 08:30:00',
                'penumpang' => 1,
                'stasiun_asal' => 'Cawang',
                'stasiun_tujuan' => 'Rawamangun',
            ],
            [
                'nama_kereta' => 'LRT Bandung',
                'harga_termurah' => '10000',
                'jam' => '07:15',
                'tanggal' => '2024-01-16 07:15:00',
                'penumpang' => 3,
                'stasiun_asal' => 'Cileunyi',
                'stasiun_tujuan' => 'Bandung',
            ],
            [
                'nama_kereta' => 'LRT Jakarta',
                'harga_termurah' => '15000',
                'jam' => '17:45',
                'tanggal' => '2024-01-16 17:45:00',
                'penumpang' => 2,
                'stasiun_asal' => 'Velodrome',
                'stasiun_tujuan' => 'Kampung Rambutan',
            ],
            [
                'nama_kereta' => 'LRT Surabaya',
                'harga_termurah' => '9000',
                'jam' => '09:00',
                'tanggal' => '2024-01-17 09:00:00',
                'penumpang' => 4,
                'stasiun_asal' => 'Surabaya Gubeng',
                'stasiun_tujuan' => 'Surabaya Kota',
            ]
        ];

        foreach ($tikets as $tiket) {
            TiketLrt::create($tiket);
        }
    }
}