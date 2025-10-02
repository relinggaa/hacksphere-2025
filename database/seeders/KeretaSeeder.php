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
            // Kereta Eksekutif (25 kereta)
            ['nama_kereta' => 'Argo Bromo Anggrek', 'kelas' => 'Eksekutif'],
            ['nama_kereta' => 'Argo Lawu', 'kelas' => 'Eksekutif'],
            ['nama_kereta' => 'Argo Parahyangan', 'kelas' => 'Eksekutif'],
            ['nama_kereta' => 'Gajayana', 'kelas' => 'Eksekutif'],
            ['nama_kereta' => 'Taksaka', 'kelas' => 'Eksekutif'],
            ['nama_kereta' => 'Argo Jati', 'kelas' => 'Eksekutif'],
            ['nama_kereta' => 'Argo Sindoro', 'kelas' => 'Eksekutif'],
            ['nama_kereta' => 'Argo Muria', 'kelas' => 'Eksekutif'],
            ['nama_kereta' => 'Argo Dwipangga', 'kelas' => 'Eksekutif'],
            ['nama_kereta' => 'Argo Wilis', 'kelas' => 'Eksekutif'],
            ['nama_kereta' => 'Argo Anggrek', 'kelas' => 'Eksekutif'],
            ['nama_kereta' => 'Argo Bromo', 'kelas' => 'Eksekutif'],
            ['nama_kereta' => 'Argo Semeru', 'kelas' => 'Eksekutif'],
            ['nama_kereta' => 'Argo Tengger', 'kelas' => 'Eksekutif'],
            ['nama_kereta' => 'Argo Kencana', 'kelas' => 'Eksekutif'],
            ['nama_kereta' => 'Argo Gede', 'kelas' => 'Eksekutif'],
            ['nama_kereta' => 'Argo Salak', 'kelas' => 'Eksekutif'],
            ['nama_kereta' => 'Argo Pangrango', 'kelas' => 'Eksekutif'],
            ['nama_kereta' => 'Argo Merapi', 'kelas' => 'Eksekutif'],
            ['nama_kereta' => 'Argo Merbabu', 'kelas' => 'Eksekutif'],
            ['nama_kereta' => 'Argo Sumbing', 'kelas' => 'Eksekutif'],
            ['nama_kereta' => 'Argo Slamet', 'kelas' => 'Eksekutif'],
            ['nama_kereta' => 'Argo Ciremai', 'kelas' => 'Eksekutif'],
            ['nama_kereta' => 'Argo Ceremai', 'kelas' => 'Eksekutif'],
            ['nama_kereta' => 'Argo Galunggung', 'kelas' => 'Eksekutif'],

            // Kereta Bisnis (30 kereta)
            ['nama_kereta' => 'Turangga', 'kelas' => 'Bisnis'],
            ['nama_kereta' => 'Bima', 'kelas' => 'Bisnis'],
            ['nama_kereta' => 'Sancaka', 'kelas' => 'Bisnis'],
            ['nama_kereta' => 'Harina', 'kelas' => 'Bisnis'],
            ['nama_kereta' => 'Matarmaja', 'kelas' => 'Bisnis'],
            ['nama_kereta' => 'Wijayakusuma', 'kelas' => 'Bisnis'],
            ['nama_kereta' => 'Kamandaka', 'kelas' => 'Bisnis'],
            ['nama_kereta' => 'Sembrani', 'kelas' => 'Bisnis'],
            ['nama_kereta' => 'Majapahit', 'kelas' => 'Bisnis'],
            ['nama_kereta' => 'Singasari', 'kelas' => 'Bisnis'],
            ['nama_kereta' => 'Brawijaya', 'kelas' => 'Bisnis'],
            ['nama_kereta' => 'Kertajaya', 'kelas' => 'Bisnis'],
            ['nama_kereta' => 'Airlangga', 'kelas' => 'Bisnis'],
            ['nama_kereta' => 'Jayabaya', 'kelas' => 'Bisnis'],
            ['nama_kereta' => 'Gajahwong', 'kelas' => 'Bisnis'],
            ['nama_kereta' => 'Prambanan', 'kelas' => 'Bisnis'],
            ['nama_kereta' => 'Borobudur', 'kelas' => 'Bisnis'],
            ['nama_kereta' => 'Mendut', 'kelas' => 'Bisnis'],
            ['nama_kereta' => 'Pawon', 'kelas' => 'Bisnis'],
            ['nama_kereta' => 'Dieng', 'kelas' => 'Bisnis'],
            ['nama_kereta' => 'Sikidang', 'kelas' => 'Bisnis'],
            ['nama_kereta' => 'Telaga Warna', 'kelas' => 'Bisnis'],
            ['nama_kereta' => 'Arjuno', 'kelas' => 'Bisnis'],
            ['nama_kereta' => 'Welirang', 'kelas' => 'Bisnis'],
            ['nama_kereta' => 'Penanggungan', 'kelas' => 'Bisnis'],
            ['nama_kereta' => 'Kawi', 'kelas' => 'Bisnis'],
            ['nama_kereta' => 'Kelud', 'kelas' => 'Bisnis'],
            ['nama_kereta' => 'Wilis', 'kelas' => 'Bisnis'],
            ['nama_kereta' => 'Anjasmoro', 'kelas' => 'Bisnis'],
            ['nama_kereta' => 'Raung', 'kelas' => 'Bisnis'],

            // Kereta Ekonomi (35 kereta)
            ['nama_kereta' => 'Gaya Baru Malam Selatan', 'kelas' => 'Ekonomi'],
            ['nama_kereta' => 'Jayabaya Ekonomi', 'kelas' => 'Ekonomi'],
            ['nama_kereta' => 'Progo', 'kelas' => 'Ekonomi'],
            ['nama_kereta' => 'Bengawan', 'kelas' => 'Ekonomi'],
            ['nama_kereta' => 'Lodaya', 'kelas' => 'Ekonomi'],
            ['nama_kereta' => 'Ciremai Ekonomi', 'kelas' => 'Ekonomi'],
            ['nama_kereta' => 'Fajar Utama', 'kelas' => 'Ekonomi'],
            ['nama_kereta' => 'Menoreh', 'kelas' => 'Ekonomi'],
            ['nama_kereta' => 'Logawa', 'kelas' => 'Ekonomi'],
            ['nama_kereta' => 'Kutojaya Utara', 'kelas' => 'Ekonomi'],
            ['nama_kereta' => 'Kutojaya Selatan', 'kelas' => 'Ekonomi'],
            ['nama_kereta' => 'Jaka Tingkir', 'kelas' => 'Ekonomi'],
            ['nama_kereta' => 'Kahuripan', 'kelas' => 'Ekonomi'],
            ['nama_kereta' => 'Rapih Dhoho', 'kelas' => 'Ekonomi'],
            ['nama_kereta' => 'Sri Tanjung', 'kelas' => 'Ekonomi'],
            ['nama_kereta' => 'Probowangi', 'kelas' => 'Ekonomi'],
            ['nama_kereta' => 'Pasundan', 'kelas' => 'Ekonomi'],
            ['nama_kereta' => 'Siliwangi', 'kelas' => 'Ekonomi'],
            ['nama_kereta' => 'Pangrango Ekonomi', 'kelas' => 'Ekonomi'],
            ['nama_kereta' => 'Pakuan', 'kelas' => 'Ekonomi'],
            ['nama_kereta' => 'Galunggung Ekonomi', 'kelas' => 'Ekonomi'],
            ['nama_kereta' => 'Sangkuriang', 'kelas' => 'Ekonomi'],
            ['nama_kereta' => 'Mutiara Utara', 'kelas' => 'Ekonomi'],
            ['nama_kereta' => 'Mutiara Selatan', 'kelas' => 'Ekonomi'],
            ['nama_kereta' => 'Kertanegara', 'kelas' => 'Ekonomi'],
            ['nama_kereta' => 'Penataran', 'kelas' => 'Ekonomi'],
            ['nama_kereta' => 'Malabar', 'kelas' => 'Ekonomi'],
            ['nama_kereta' => 'Serayu', 'kelas' => 'Ekonomi'],
            ['nama_kereta' => 'Brantas', 'kelas' => 'Ekonomi'],
            ['nama_kereta' => 'Kaliurang', 'kelas' => 'Ekonomi'],
            ['nama_kereta' => 'Prameks', 'kelas' => 'Ekonomi'],
            ['nama_kereta' => 'Joglosemar', 'kelas' => 'Ekonomi'],
            ['nama_kereta' => 'Kaligung', 'kelas' => 'Ekonomi'],
            ['nama_kereta' => 'Cirebon Ekspres', 'kelas' => 'Ekonomi'],
            ['nama_kereta' => 'Cipunagara', 'kelas' => 'Ekonomi'],

            // Kereta Lokal/Commuter (10 kereta)
            ['nama_kereta' => 'KRL Commuter Line Jakarta', 'kelas' => 'Ekonomi'],
            ['nama_kereta' => 'KRL Commuter Line Bekasi', 'kelas' => 'Ekonomi'],
            ['nama_kereta' => 'KRL Commuter Line Tangerang', 'kelas' => 'Ekonomi'],
            ['nama_kereta' => 'KRL Commuter Line Serpong', 'kelas' => 'Ekonomi'],
            ['nama_kereta' => 'KA Lokal Bandung Raya', 'kelas' => 'Ekonomi'],
            ['nama_kereta' => 'KA Lokal Surabaya', 'kelas' => 'Ekonomi'],
            ['nama_kereta' => 'KA Lokal Yogyakarta', 'kelas' => 'Ekonomi'],
            ['nama_kereta' => 'KA Lokal Solo', 'kelas' => 'Ekonomi'],
            ['nama_kereta' => 'KA Lokal Semarang', 'kelas' => 'Ekonomi'],
            ['nama_kereta' => 'KA Lokal Malang', 'kelas' => 'Ekonomi']
        ];

        foreach ($keretas as $kereta) {
            Kereta::create($kereta);
        }
    }
}