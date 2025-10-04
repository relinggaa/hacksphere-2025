<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Kereta;

class KeretaSeeder extends Seeder
{
    public function run(): void
    {
        Kereta::truncate();

        $keretas = [
            [
                'nama_kereta' => 'ARGO PARAHYANGAN (104)',
                'kelas' => 'Eksekutif',
            ],
            [
                'nama_kereta' => 'JAKA TINGKIR (256)',
                'kelas' => 'Ekonomi',
            ],
            [
                'nama_kereta' => 'CIPER (142)',
                'kelas' => 'Bisnis',
            ],
            [
                'nama_kereta' => 'HARINA (120)',
                'kelas' => 'Bisnis',
            ],
            [
                'nama_kereta' => 'LODAYA (160)',
                'kelas' => 'Ekonomi',
            ],
            [
                'nama_kereta' => 'TAKSAKA (1)',
                'kelas' => 'Eksekutif',

            ],
            [
                'nama_kereta' => 'GAJAYANA (2)',
                'kelas' => 'Eksekutif',
            ],
            [
                'nama_kereta' => 'ARGO BROMO ANGGREK (6)',
                'kelas' => 'Eksekutif',
            ],
            [
                'nama_kereta' => 'ARGO MURIA (10)',
                'kelas' => 'Eksekutif',
            ],
            [
                'nama_kereta' => 'BENGAWAN (11)',
                'kelas' => 'Ekonomi',
            ]
        ];

        foreach ($keretas as $kereta) {
            Kereta::create($kereta);
        }
    }
}