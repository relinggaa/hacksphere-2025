<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Kereta;

class KeretaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $keretas = [
            // Kereta Eksekutif
            [
                'nama_kereta' => 'Argo Bromo Anggrek',
                'kelas' => 'Eksekutif'
            ],
            [
                'nama_kereta' => 'Argo Lawu',
                'kelas' => 'Eksekutif'
            ],
            [
                'nama_kereta' => 'Argo Parahyangan',
                'kelas' => 'Eksekutif'
            ],
            [
                'nama_kereta' => 'Gajayana',
                'kelas' => 'Eksekutif'
            ],
            [
                'nama_kereta' => 'Taksaka',
                'kelas' => 'Eksekutif'
            ],
            
            // Kereta Bisnis
            [
                'nama_kereta' => 'Turangga',
                'kelas' => 'Bisnis'
            ],
            [
                'nama_kereta' => 'Bima',
                'kelas' => 'Bisnis'
            ],
            [
                'nama_kereta' => 'Sancaka',
                'kelas' => 'Bisnis'
            ],
            [
                'nama_kereta' => 'Harina',
                'kelas' => 'Bisnis'
            ],
            [
                'nama_kereta' => 'Matarmaja',
                'kelas' => 'Bisnis'
            ],
            
            // Kereta Ekonomi
            [
                'nama_kereta' => 'Gaya Baru Malam Selatan',
                'kelas' => 'Ekonomi'
            ],
            [
                'nama_kereta' => 'Jayabaya',
                'kelas' => 'Ekonomi'
            ],
            [
                'nama_kereta' => 'Progo',
                'kelas' => 'Ekonomi'
            ],
            [
                'nama_kereta' => 'Bengawan',
                'kelas' => 'Ekonomi'
            ],
            [
                'nama_kereta' => 'Lodaya',
                'kelas' => 'Ekonomi'
            ],
            [
                'nama_kereta' => 'Ciremai',
                'kelas' => 'Ekonomi'
            ],
            [
                'nama_kereta' => 'Fajar Utama',
                'kelas' => 'Ekonomi'
            ],
            [
                'nama_kereta' => 'Menoreh',
                'kelas' => 'Ekonomi'
            ],
            
            // Kereta Lokal/Commuter
            [
                'nama_kereta' => 'KRL Commuter Line',
                'kelas' => 'Ekonomi'
            ],
            [
                'nama_kereta' => 'KA Lokal Bandung Raya',
                'kelas' => 'Ekonomi'
            ],
            [
                'nama_kereta' => 'Prameks',
                'kelas' => 'Ekonomi'
            ],
            [
                'nama_kereta' => 'Joglosemar',
                'kelas' => 'Ekonomi'
            ]
        ];

        foreach ($keretas as $kereta) {
            Kereta::create($kereta);
        }
    }
}