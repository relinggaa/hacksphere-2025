<?php

namespace Database\Seeders;

use App\Models\TiketBandara;
use App\Models\Kereta;
use Illuminate\Database\Seeder;

class TiketBandaraSeeder extends Seeder
{
    public function run(): void
    {
        $keretas = Kereta::limit(3)->get();

        if ($keretas->isEmpty()) {
            $keretas = collect([
                ['nama_kereta' => 'Airport Express Jakarta', 'kelas' => 'Ekonomi'],
                ['nama_kereta' => 'Airport Express Bandung', 'kelas' => 'Ekonomi'],
                ['nama_kereta' => 'Airport Express Surabaya', 'kelas' => 'Ekonomi']
            ])->map(function ($item) {
                return Kereta::create($item);
            });
        }

        $tikets = [
            [
                'nama_kereta' => 'Airport Express Jakarta',
                'harga_termurah' => '15000',
                'jam' => '05:30',
                'tanggal' => '2024-01-15 05:30:00',
                'penumpang' => 2,
                'stasiun_asal' => 'Manggarai',
                'stasiun_tujuan' => 'Soekarno-Hatta',
            ],
            [
                'nama_kereta' => 'Airport Express Jakarta',
                'harga_termurah' => '20000',
                'jam' => '07:45',
                'tanggal' => '2024-01-15 07:45:00',
                'penumpang' => 1,
                'stasiun_asal' => 'Gambir',
                'stasiun_tujuan' => 'Soekarno-Hatta',
            ],
            [
                'nama_kereta' => 'Airport Express Bandung',
                'harga_termurah' => '18000',
                'jam' => '06:15',
                'tanggal' => '2024-01-16 06:15:00',
                'penumpang' => 3,
                'stasiun_asal' => 'Bandung',
                'stasiun_tujuan' => 'Husein Sastranegara',
            ],
            [
                'nama_kereta' => 'Airport Express Jakarta',
                'harga_termurah' => '25000',
                'jam' => '16:30',
                'tanggal' => '2024-01-16 16:30:00',
                'penumpang' => 2,
                'stasiun_asal' => 'Soekarno-Hatta',
                'stasiun_tujuan' => 'Manggarai',
            ],
            [
                'nama_kereta' => 'Airport Express Surabaya',
                'harga_termurah' => '12000',
                'jam' => '08:00',
                'tanggal' => '2024-01-17 08:00:00',
                'penumpang' => 4,
                'stasiun_asal' => 'Surabaya Gubeng',
                'stasiun_tujuan' => 'Juanda',
            ]
        ];

        foreach ($tikets as $tiket) {
            TiketBandara::create($tiket);
        }
    }
}