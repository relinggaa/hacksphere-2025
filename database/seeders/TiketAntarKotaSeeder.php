<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TiketAntarKota;

class TiketAntarKotaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tikets = [
            [
                'nama_kereta' => 'Argo Bromo Anggrek',
                'kelas' => 'Eksekutif',
                'harga_termurah' => 450000.00,
                'jam' => '08:00',
                'tanggal' => '2025-10-15',
                'penumpang' => 2,
                'stasiun_asal' => 'Stasiun Gambir',
                'stasiun_tujuan' => 'Stasiun Gubeng'
            ],
            [
                'nama_kereta' => 'Taksaka',
                'kelas' => 'Eksekutif',
                'harga_termurah' => 350000.00,
                'jam' => '07:30',
                'tanggal' => '2025-10-16',
                'penumpang' => 1,
                'stasiun_asal' => 'Stasiun Gambir',
                'stasiun_tujuan' => 'Stasiun Lempuyangan'
            ],
            [
                'nama_kereta' => 'Gajayana',
                'kelas' => 'Eksekutif',
                'harga_termurah' => 400000.00,
                'jam' => '09:15',
                'tanggal' => '2025-10-17',
                'penumpang' => 3,
                'stasiun_asal' => 'Stasiun Gambir',
                'stasiun_tujuan' => 'Stasiun Malang'
            ],
            [
                'nama_kereta' => 'Turangga',
                'kelas' => 'Bisnis',
                'harga_termurah' => 250000.00,
                'jam' => '10:00',
                'tanggal' => '2025-10-18',
                'penumpang' => 2,
                'stasiun_asal' => 'Stasiun Pasar Senen',
                'stasiun_tujuan' => 'Stasiun Gubeng'
            ],
            [
                'nama_kereta' => 'Bima',
                'kelas' => 'Bisnis',
                'harga_termurah' => 280000.00,
                'jam' => '11:30',
                'tanggal' => '2025-10-19',
                'penumpang' => 1,
                'stasiun_asal' => 'Stasiun Pasar Senen',
                'stasiun_tujuan' => 'Stasiun Malang'
            ],
            [
                'nama_kereta' => 'Sancaka',
                'kelas' => 'Bisnis',
                'harga_termurah' => 220000.00,
                'jam' => '12:45',
                'tanggal' => '2025-10-20',
                'penumpang' => 4,
                'stasiun_asal' => 'Stasiun Lempuyangan',
                'stasiun_tujuan' => 'Stasiun Gubeng'
            ],
            [
                'nama_kereta' => 'Progo',
                'kelas' => 'Ekonomi',
                'harga_termurah' => 120000.00,
                'jam' => '06:00',
                'tanggal' => '2025-10-21',
                'penumpang' => 2,
                'stasiun_asal' => 'Stasiun Pasar Senen',
                'stasiun_tujuan' => 'Stasiun Lempuyangan'
            ],
            [
                'nama_kereta' => 'Bengawan',
                'kelas' => 'Ekonomi',
                'harga_termurah' => 100000.00,
                'jam' => '14:20',
                'tanggal' => '2025-10-22',
                'penumpang' => 1,
                'stasiun_asal' => 'Stasiun Pasar Senen',
                'stasiun_tujuan' => 'Stasiun Purwosari'
            ],
            [
                'nama_kereta' => 'Lodaya',
                'kelas' => 'Ekonomi',
                'harga_termurah' => 80000.00,
                'jam' => '15:45',
                'tanggal' => '2025-10-23',
                'penumpang' => 3,
                'stasiun_asal' => 'Stasiun Gambir',
                'stasiun_tujuan' => 'Stasiun Bandung'
            ],
            [
                'nama_kereta' => 'Ciremai',
                'kelas' => 'Ekonomi',
                'harga_termurah' => 60000.00,
                'jam' => '16:30',
                'tanggal' => '2025-10-24',
                'penumpang' => 2,
                'stasiun_asal' => 'Stasiun Gambir',
                'stasiun_tujuan' => 'Stasiun Cirebon'
            ],
            [
                'nama_kereta' => 'Fajar Utama',
                'kelas' => 'Ekonomi',
                'harga_termurah' => 110000.00,
                'jam' => '17:15',
                'tanggal' => '2025-10-25',
                'penumpang' => 1,
                'stasiun_asal' => 'Stasiun Pasar Senen',
                'stasiun_tujuan' => 'Stasiun Lempuyangan'
            ],
            [
                'nama_kereta' => 'Menoreh',
                'kelas' => 'Ekonomi',
                'harga_termurah' => 90000.00,
                'jam' => '18:00',
                'tanggal' => '2025-10-26',
                'penumpang' => 2,
                'stasiun_asal' => 'Stasiun Gambir',
                'stasiun_tujuan' => 'Stasiun Purwokerto'
            ],
            [
                'nama_kereta' => 'Argo Parahyangan',
                'kelas' => 'Eksekutif',
                'harga_termurah' => 320000.00,
                'jam' => '19:30',
                'tanggal' => '2025-10-27',
                'penumpang' => 2,
                'stasiun_asal' => 'Stasiun Gambir',
                'stasiun_tujuan' => 'Stasiun Bandung'
            ],
            [
                'nama_kereta' => 'Argo Lawu',
                'kelas' => 'Eksekutif',
                'harga_termurah' => 380000.00,
                'jam' => '20:15',
                'tanggal' => '2025-10-28',
                'penumpang' => 1,
                'stasiun_asal' => 'Stasiun Gambir',
                'stasiun_tujuan' => 'Stasiun Purwosari'
            ],
            [
                'nama_kereta' => 'Harina',
                'kelas' => 'Bisnis',
                'harga_termurah' => 240000.00,
                'jam' => '05:30',
                'tanggal' => '2025-10-29',
                'penumpang' => 3,
                'stasiun_asal' => 'Stasiun Pasar Senen',
                'stasiun_tujuan' => 'Stasiun Bandung'
            ]
        ];

        foreach ($tikets as $tiket) {
            TiketAntarKota::create($tiket);
        }
    }
}