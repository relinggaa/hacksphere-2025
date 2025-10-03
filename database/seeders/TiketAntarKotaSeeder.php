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
        // Clear existing data to prevent duplicates on re-run
        TiketAntarKota::truncate();

        $tikets = [
            // ===== RUTE JAKARTA - BANDUNG =====
            [
                'nama_kereta' => 'ARGO PARAHYANGAN (104)',
                'kelas' => 'Eksekutif',
                'harga_termurah' => 550000.00,
                'jam' => '08:30',
                'tanggal' => '2025-10-02',
                'penumpang' => 1,
                'stasiun_asal' => 'Pasar Senen',
                'stasiun_tujuan' => 'Bandung'
            ],
            [
                'nama_kereta' => 'JAKA TINGKIR (256)',
                'kelas' => 'Ekonomi',
                'harga_termurah' => 400000.00,
                'jam' => '11:50',
                'tanggal' => '2025-10-02',
                'penumpang' => 1,
                'stasiun_asal' => 'Pasar Senen',
                'stasiun_tujuan' => 'Bandung'
            ],
            [
                'nama_kereta' => 'CIPER (142)',
                'kelas' => 'Bisnis',
                'harga_termurah' => 350000.00,
                'jam' => '14:20',
                'tanggal' => '2025-10-02',
                'penumpang' => 1,
                'stasiun_asal' => 'Pasar Senen',
                'stasiun_tujuan' => 'Bandung'
            ],
            [
                'nama_kereta' => 'HARINA (120)',
                'kelas' => 'Bisnis',
                'harga_termurah' => 320000.00,
                'jam' => '06:15',
                'tanggal' => '2025-10-02',
                'penumpang' => 1,
                'stasiun_asal' => 'Pasar Senen',
                'stasiun_tujuan' => 'Bandung'
            ],
            [
                'nama_kereta' => 'LODAYA (160)',
                'kelas' => 'Ekonomi',
                'harga_termurah' => 180000.00,
                'jam' => '16:45',
                'tanggal' => '2025-10-02',
                'penumpang' => 1,
                'stasiun_asal' => 'Pasar Senen',
                'stasiun_tujuan' => 'Bandung'
            ],

            // Data untuk tanggal lain (Jakarta - Bandung)
            [
                'nama_kereta' => 'ARGO PARAHYANGAN (104)',
                'kelas' => 'Eksekutif',
                'harga_termurah' => 560000.00,
                'jam' => '08:30',
                'tanggal' => '2025-10-03',
                'penumpang' => 1,
                'stasiun_asal' => 'Pasar Senen',
                'stasiun_tujuan' => 'Bandung'
            ],
            [
                'nama_kereta' => 'JAKA TINGKIR (256)',
                'kelas' => 'Ekonomi',
                'harga_termurah' => 420000.00,
                'jam' => '11:50',
                'tanggal' => '2025-10-04',
                'penumpang' => 1,
                'stasiun_asal' => 'Pasar Senen',
                'stasiun_tujuan' => 'Bandung'
            ],
            [
                'nama_kereta' => 'CIPER (142)',
                'kelas' => 'Bisnis',
                'harga_termurah' => 360000.00,
                'jam' => '14:20',
                'tanggal' => '2025-10-04',
                'penumpang' => 1,
                'stasiun_asal' => 'Pasar Senen',
                'stasiun_tujuan' => 'Bandung'
            ],
            [
                'nama_kereta' => 'HARINA (120)',
                'kelas' => 'Bisnis',
                'harga_termurah' => 330000.00,
                'jam' => '06:15',
                'tanggal' => '2025-10-04',
                'penumpang' => 1,
                'stasiun_asal' => 'Pasar Senen',
                'stasiun_tujuan' => 'Bandung'
            ],

            // ===== RUTE JAKARTA - YOGYAKARTA =====
            [
                'nama_kereta' => 'TAKSAKA (1)',
                'kelas' => 'Eksekutif',
                'harga_termurah' => 450000.00,
                'jam' => '07:30',
                'tanggal' => '2025-10-02',
                'penumpang' => 1,
                'stasiun_asal' => 'Gambir',
                'stasiun_tujuan' => 'Yogyakarta'
            ],
            [
                'nama_kereta' => 'GAJAYANA (2)',
                'kelas' => 'Eksekutif',
                'harga_termurah' => 480000.00,
                'jam' => '09:15',
                'tanggal' => '2025-10-02',
                'penumpang' => 1,
                'stasiun_asal' => 'Gambir',
                'stasiun_tujuan' => 'Yogyakarta'
            ],
            [
                'nama_kereta' => 'BENGAWAN (11)',
                'kelas' => 'Ekonomi',
                'harga_termurah' => 150000.00,
                'jam' => '14:20',
                'tanggal' => '2025-10-02',
                'penumpang' => 1,
                'stasiun_asal' => 'Gambir',
                'stasiun_tujuan' => 'Yogyakarta'
            ],

            // Data untuk tanggal lain (Jakarta - Yogyakarta)
            [
                'nama_kereta' => 'TAKSAKA (1)',
                'kelas' => 'Eksekutif',
                'harga_termurah' => 460000.00,
                'jam' => '07:30',
                'tanggal' => '2025-10-14',
                'penumpang' => 1,
                'stasiun_asal' => 'Gambir',
                'stasiun_tujuan' => 'Yogyakarta'
            ],
            [
                'nama_kereta' => 'GAJAYANA (2)',
                'kelas' => 'Eksekutif',
                'harga_termurah' => 490000.00,
                'jam' => '09:15',
                'tanggal' => '2025-10-15',
                'penumpang' => 1,
                'stasiun_asal' => 'Gambir',
                'stasiun_tujuan' => 'Yogyakarta'
            ],

            // ===== RUTE JAKARTA - SURABAYA =====
            [
                'nama_kereta' => 'ARGO BROMO ANGGREK (6)',
                'kelas' => 'Eksekutif',
                'harga_termurah' => 650000.00,
                'jam' => '08:00',
                'tanggal' => '2025-10-02',
                'penumpang' => 1,
                'stasiun_asal' => 'Gambir',
                'stasiun_tujuan' => 'Surabaya Gubeng'
            ],
            [
                'nama_kereta' => 'ARGO BROMO ANGGREK (6)',
                'kelas' => 'Eksekutif',
                'harga_termurah' => 660000.00,
                'jam' => '08:00',
                'tanggal' => '2025-10-15',
                'penumpang' => 1,
                'stasiun_asal' => 'Gambir',
                'stasiun_tujuan' => 'Surabaya Gubeng'
            ],

            // ===== RUTE JAKARTA - SEMARANG =====
            [
                'nama_kereta' => 'ARGO MURIA (10)',
                'kelas' => 'Eksekutif',
                'harga_termurah' => 380000.00,
                'jam' => '07:15',
                'tanggal' => '2025-10-02',
                'penumpang' => 1,
                'stasiun_asal' => 'Gambir',
                'stasiun_tujuan' => 'Semarang Tawang'
            ],
            [
                'nama_kereta' => 'BENGAWAN (11)',
                'kelas' => 'Ekonomi',
                'harga_termurah' => 120000.00,
                'jam' => '06:00',
                'tanggal' => '2025-10-02',
                'penumpang' => 1,
                'stasiun_asal' => 'Gambir',
                'stasiun_tujuan' => 'Semarang Tawang'
            ],

            // ===== RUTE JAKARTA - CIREBON =====
            [
                'nama_kereta' => 'BENGAWAN (11)',
                'kelas' => 'Ekonomi',
                'harga_termurah' => 80000.00,
                'jam' => '16:30',
                'tanggal' => '2025-10-02',
                'penumpang' => 1,
                'stasiun_asal' => 'Gambir',
                'stasiun_tujuan' => 'Cirebon'
            ],

            // ===== DATA UNTUK PENUMPANG BERBEDA =====
            [
                'nama_kereta' => 'JAKA TINGKIR (256)',
                'kelas' => 'Ekonomi',
                'harga_termurah' => 400000.00,
                'jam' => '11:50',
                'tanggal' => '2025-10-02',
                'penumpang' => 2,
                'stasiun_asal' => 'Pasar Senen',
                'stasiun_tujuan' => 'Bandung'
            ],
            [
                'nama_kereta' => 'ARGO PARAHYANGAN (104)',
                'kelas' => 'Eksekutif',
                'harga_termurah' => 550000.00,
                'jam' => '08:30',
                'tanggal' => '2025-10-02',
                'penumpang' => 3,
                'stasiun_asal' => 'Pasar Senen',
                'stasiun_tujuan' => 'Bandung'
            ],
            [
                'nama_kereta' => 'CIPER (142)',
                'kelas' => 'Bisnis',
                'harga_termurah' => 350000.00,
                'jam' => '14:20',
                'tanggal' => '2025-10-02',
                'penumpang' => 4,
                'stasiun_asal' => 'Pasar Senen',
                'stasiun_tujuan' => 'Bandung'
            ],

            // ===== DATA UNTUK TANGGAL BERBEDA (14-20 Oktober 2025) =====
            [
                'nama_kereta' => 'JAKA TINGKIR (256)',
                'kelas' => 'Ekonomi',
                'harga_termurah' => 410000.00,
                'jam' => '11:50',
                'tanggal' => '2025-10-14',
                'penumpang' => 1,
                'stasiun_asal' => 'Pasar Senen',
                'stasiun_tujuan' => 'Bandung'
            ],
            // Rute terbalik untuk Bandung → Pasar Senen
            [
                'nama_kereta' => 'ARGO PARAHYANGAN (104)',
                'kelas' => 'Eksekutif',
                'harga_termurah' => 550000.00,
                'jam' => '09:00',
                'tanggal' => '2025-10-14',
                'penumpang' => 1,
                'stasiun_asal' => 'Bandung',
                'stasiun_tujuan' => 'Pasar Senen'
            ],
            [
                'nama_kereta' => 'CIPER (142)',
                'kelas' => 'Bisnis',
                'harga_termurah' => 420000.00,
                'jam' => '15:30',
                'tanggal' => '2025-10-14',
                'penumpang' => 1,
                'stasiun_asal' => 'Bandung',
                'stasiun_tujuan' => 'Pasar Senen'
            ],
            [
                'nama_kereta' => 'ARGO PARAHYANGAN (104)',
                'kelas' => 'Eksekutif',
                'harga_termurah' => 560000.00,
                'jam' => '08:30',
                'tanggal' => '2025-10-15',
                'penumpang' => 1,
                'stasiun_asal' => 'Pasar Senen',
                'stasiun_tujuan' => 'Bandung'
            ],
            [
                'nama_kereta' => 'CIPER (142)',
                'kelas' => 'Bisnis',
                'harga_termurah' => 360000.00,
                'jam' => '14:20',
                'tanggal' => '2025-10-16',
                'penumpang' => 1,
                'stasiun_asal' => 'Pasar Senen',
                'stasiun_tujuan' => 'Bandung'
            ],
            [
                'nama_kereta' => 'HARINA (120)',
                'kelas' => 'Bisnis',
                'harga_termurah' => 330000.00,
                'jam' => '06:15',
                'tanggal' => '2025-10-17',
                'penumpang' => 1,
                'stasiun_asal' => 'Pasar Senen',
                'stasiun_tujuan' => 'Bandung'
            ],
            [
                'nama_kereta' => 'LODAYA (160)',
                'kelas' => 'Ekonomi',
                'harga_termurah' => 190000.00,
                'jam' => '16:45',
                'tanggal' => '2025-10-18',
                'penumpang' => 1,
                'stasiun_asal' => 'Pasar Senen',
                'stasiun_tujuan' => 'Bandung'
            ],
            [
                'nama_kereta' => 'ARGO PARAHYANGAN (104)',
                'kelas' => 'Eksekutif',
                'harga_termurah' => 570000.00,
                'jam' => '08:30',
                'tanggal' => '2025-10-19',
                'penumpang' => 1,
                'stasiun_asal' => 'Pasar Senen',
                'stasiun_tujuan' => 'Bandung'
            ],
            [
                'nama_kereta' => 'JAKA TINGKIR (256)',
                'kelas' => 'Ekonomi',
                'harga_termurah' => 430000.00,
                'jam' => '11:50',
                'tanggal' => '2025-10-20',
                'penumpang' => 1,
                'stasiun_asal' => 'Pasar Senen',
                'stasiun_tujuan' => 'Bandung'
            ]
        ];

        foreach ($tikets as $tiket) {
            TiketAntarKota::create($tiket);
        }
    }
}