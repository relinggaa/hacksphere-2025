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
        $stasiuns = [
            // Jakarta variations
            [
                'nama_stasiun' => 'Stasiun Gambir',
                'kota' => 'Jakarta'
            ],
            [
                'nama_stasiun' => 'Stasiun Pasar Senen',
                'kota' => 'DKI Jakarta'
            ],
            [
                'nama_stasiun' => 'Stasiun Tanah Abang',
                'kota' => 'Betawi'
            ],
            
            // Yogyakarta variations - untuk testing NLS
            [
                'nama_stasiun' => 'Stasiun Tugu Yogyakarta',
                'kota' => 'Yogyakarta'
            ],
            [
                'nama_stasiun' => 'Stasiun Lempuyangan',
                'kota' => 'Jogja'
            ],
            [
                'nama_stasiun' => 'Stasiun Wojo',
                'kota' => 'Yogya'
            ],
            [
                'nama_stasiun' => 'Stasiun Maguwo',
                'kota' => 'DIY'
            ],
            
            // Surabaya variations
            [
                'nama_stasiun' => 'Stasiun Gubeng',
                'kota' => 'Surabaya'
            ],
            [
                'nama_stasiun' => 'Stasiun Pasar Turi',
                'kota' => 'Suroboyo'
            ],
            [
                'nama_stasiun' => 'Stasiun Wonokromo',
                'kota' => 'SBY'
            ],
            
            // Bandung variations
            [
                'nama_stasiun' => 'Stasiun Bandung',
                'kota' => 'Bandung'
            ],
            [
                'nama_stasiun' => 'Stasiun Kiaracondong',
                'kota' => 'Kota Kembang'
            ],
            [
                'nama_stasiun' => 'Stasiun Cimahi',
                'kota' => 'BDG'
            ],
            
            // Solo variations
            [
                'nama_stasiun' => 'Stasiun Solo Balapan',
                'kota' => 'Solo'
            ],
            [
                'nama_stasiun' => 'Stasiun Purwosari',
                'kota' => 'Surakarta'
            ],
            [
                'nama_stasiun' => 'Stasiun Klaten',
                'kota' => 'Kota Batik'
            ],
            
            // Other cities
            [
                'nama_stasiun' => 'Stasiun Malang',
                'kota' => 'Malang'
            ],
            [
                'nama_stasiun' => 'Stasiun Blitar',
                'kota' => 'Kota Apel'
            ],
            [
                'nama_stasiun' => 'Stasiun Semarang Poncol',
                'kota' => 'Semarang'
            ],
            [
                'nama_stasiun' => 'Stasiun Tawang',
                'kota' => 'Kota Lumpia'
            ]
        ];

        foreach ($stasiuns as $stasiun) {
            Stasiun::create($stasiun);
        }
    }
}