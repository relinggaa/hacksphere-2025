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
            // Jakarta & Sekitarnya (15 stasiun)
            ['nama_stasiun' => 'Gambir', 'kota' => 'Jakarta'],
            ['nama_stasiun' => 'Pasar Senen', 'kota' => 'Jakarta'],
            ['nama_stasiun' => 'Tanah Abang', 'kota' => 'Jakarta'],
            ['nama_stasiun' => 'Manggarai', 'kota' => 'Jakarta'],
            ['nama_stasiun' => 'Cikini', 'kota' => 'Jakarta'],
            ['nama_stasiun' => 'Gondangdia', 'kota' => 'Jakarta'],
            ['nama_stasiun' => 'Juanda', 'kota' => 'Jakarta'],
            ['nama_stasiun' => 'Sawah Besar', 'kota' => 'Jakarta'],
            ['nama_stasiun' => 'Kemayoran', 'kota' => 'Jakarta'],
            ['nama_stasiun' => 'Rajawali', 'kota' => 'Jakarta'],
            ['nama_stasiun' => 'Kampung Bandan', 'kota' => 'Jakarta'],
            ['nama_stasiun' => 'Ancol', 'kota' => 'Jakarta'],
            ['nama_stasiun' => 'Tanjung Priok', 'kota' => 'Jakarta'],
            ['nama_stasiun' => 'Bekasi', 'kota' => 'Bekasi'],
            ['nama_stasiun' => 'Bogor', 'kota' => 'Bogor'],

            // Jawa Barat (20 stasiun)
            ['nama_stasiun' => 'Bandung', 'kota' => 'Bandung'],
            ['nama_stasiun' => 'Kiaracondong', 'kota' => 'Bandung'],
            ['nama_stasiun' => 'Cimahi', 'kota' => 'Cimahi'],
            ['nama_stasiun' => 'Padalarang', 'kota' => 'Bandung Barat'],
            ['nama_stasiun' => 'Purwakarta', 'kota' => 'Purwakarta'],
            ['nama_stasiun' => 'Cikampek', 'kota' => 'Karawang'],
            ['nama_stasiun' => 'Karawang', 'kota' => 'Karawang'],
            ['nama_stasiun' => 'Cirebon', 'kota' => 'Cirebon'],
            ['nama_stasiun' => 'Cirebon Prujakan', 'kota' => 'Cirebon'],
            ['nama_stasiun' => 'Indramayu', 'kota' => 'Indramayu'],
            ['nama_stasiun' => 'Haurgeulis', 'kota' => 'Indramayu'],
            ['nama_stasiun' => 'Kroya', 'kota' => 'Cilacap'],
            ['nama_stasiun' => 'Banjar', 'kota' => 'Banjar'],
            ['nama_stasiun' => 'Tasikmalaya', 'kota' => 'Tasikmalaya'],
            ['nama_stasiun' => 'Garut', 'kota' => 'Garut'],
            ['nama_stasiun' => 'Sukabumi', 'kota' => 'Sukabumi'],
            ['nama_stasiun' => 'Cianjur', 'kota' => 'Cianjur'],
            ['nama_stasiun' => 'Subang', 'kota' => 'Subang'],
            ['nama_stasiun' => 'Sumedang', 'kota' => 'Sumedang'],
            ['nama_stasiun' => 'Majalengka', 'kota' => 'Majalengka'],

            // Jawa Tengah (25 stasiun)
            ['nama_stasiun' => 'Semarang Poncol', 'kota' => 'Semarang'],
            ['nama_stasiun' => 'Semarang Tawang', 'kota' => 'Semarang'],
            ['nama_stasiun' => 'Solo Balapan', 'kota' => 'Solo'],
            ['nama_stasiun' => 'Solo Jebres', 'kota' => 'Solo'],
            ['nama_stasiun' => 'Purwosari', 'kota' => 'Solo'],
            ['nama_stasiun' => 'Klaten', 'kota' => 'Klaten'],
            ['nama_stasiun' => 'Yogyakarta Tugu', 'kota' => 'Yogyakarta'],
            ['nama_stasiun' => 'Lempuyangan', 'kota' => 'Yogyakarta'],
            ['nama_stasiun' => 'Wojo', 'kota' => 'Yogyakarta'],
            ['nama_stasiun' => 'Maguwo', 'kota' => 'Yogyakarta'],
            ['nama_stasiun' => 'Purwokerto', 'kota' => 'Purwokerto'],
            ['nama_stasiun' => 'Kroya', 'kota' => 'Cilacap'],
            ['nama_stasiun' => 'Cilacap', 'kota' => 'Cilacap'],
            ['nama_stasiun' => 'Maos', 'kota' => 'Cilacap'],
            ['nama_stasiun' => 'Kebumen', 'kota' => 'Kebumen'],
            ['nama_stasiun' => 'Gombong', 'kota' => 'Kebumen'],
            ['nama_stasiun' => 'Kutoarjo', 'kota' => 'Purworejo'],
            ['nama_stasiun' => 'Purworejo', 'kota' => 'Purworejo'],
            ['nama_stasiun' => 'Magelang', 'kota' => 'Magelang'],
            ['nama_stasiun' => 'Salatiga', 'kota' => 'Salatiga'],
            ['nama_stasiun' => 'Ambarawa', 'kota' => 'Semarang'],
            ['nama_stasiun' => 'Tegal', 'kota' => 'Tegal'],
            ['nama_stasiun' => 'Pemalang', 'kota' => 'Pemalang'],
            ['nama_stasiun' => 'Pekalongan', 'kota' => 'Pekalongan'],
            ['nama_stasiun' => 'Weleri', 'kota' => 'Kendal'],

            // Jawa Timur (25 stasiun)
            ['nama_stasiun' => 'Surabaya Gubeng', 'kota' => 'Surabaya'],
            ['nama_stasiun' => 'Surabaya Pasar Turi', 'kota' => 'Surabaya'],
            ['nama_stasiun' => 'Wonokromo', 'kota' => 'Surabaya'],
            ['nama_stasiun' => 'Sidoarjo', 'kota' => 'Sidoarjo'],
            ['nama_stasiun' => 'Malang', 'kota' => 'Malang'],
            ['nama_stasiun' => 'Malang Kotalama', 'kota' => 'Malang'],
            ['nama_stasiun' => 'Blitar', 'kota' => 'Blitar'],
            ['nama_stasiun' => 'Tulungagung', 'kota' => 'Tulungagung'],
            ['nama_stasiun' => 'Kediri', 'kota' => 'Kediri'],
            ['nama_stasiun' => 'Nganjuk', 'kota' => 'Nganjuk'],
            ['nama_stasiun' => 'Madiun', 'kota' => 'Madiun'],
            ['nama_stasiun' => 'Caruban', 'kota' => 'Madiun'],
            ['nama_stasiun' => 'Ngawi', 'kota' => 'Ngawi'],
            ['nama_stasiun' => 'Magetan', 'kota' => 'Magetan'],
            ['nama_stasiun' => 'Ponorogo', 'kota' => 'Ponorogo'],
            ['nama_stasiun' => 'Jember', 'kota' => 'Jember'],
            ['nama_stasiun' => 'Probolinggo', 'kota' => 'Probolinggo'],
            ['nama_stasiun' => 'Pasuruan', 'kota' => 'Pasuruan'],
            ['nama_stasiun' => 'Bangil', 'kota' => 'Pasuruan'],
            ['nama_stasiun' => 'Mojokerto', 'kota' => 'Mojokerto'],
            ['nama_stasiun' => 'Lamongan', 'kota' => 'Lamongan'],
            ['nama_stasiun' => 'Bojonegoro', 'kota' => 'Bojonegoro'],
            ['nama_stasiun' => 'Tuban', 'kota' => 'Tuban'],
            ['nama_stasiun' => 'Cepu', 'kota' => 'Blora'],
            ['nama_stasiun' => 'Banyuwangi Baru', 'kota' => 'Banyuwangi'],

            // Sumatra (10 stasiun)
            ['nama_stasiun' => 'Medan', 'kota' => 'Medan'],
            ['nama_stasiun' => 'Binjai', 'kota' => 'Binjai'],
            ['nama_stasiun' => 'Tebing Tinggi', 'kota' => 'Tebing Tinggi'],
            ['nama_stasiun' => 'Pematang Siantar', 'kota' => 'Pematang Siantar'],
            ['nama_stasiun' => 'Rantau Prapat', 'kota' => 'Labuhanbatu'],
            ['nama_stasiun' => 'Padang', 'kota' => 'Padang'],
            ['nama_stasiun' => 'Bukittinggi', 'kota' => 'Bukittinggi'],
            ['nama_stasiun' => 'Payakumbuh', 'kota' => 'Payakumbuh'],
            ['nama_stasiun' => 'Palembang', 'kota' => 'Palembang'],
            ['nama_stasiun' => 'Bandar Lampung', 'kota' => 'Bandar Lampung'],

            // Kalimantan (3 stasiun)
            ['nama_stasiun' => 'Banjarmasin', 'kota' => 'Banjarmasin'],
            ['nama_stasiun' => 'Martapura', 'kota' => 'Banjar'],
            ['nama_stasiun' => 'Balikpapan', 'kota' => 'Balikpapan'],

            // Sulawesi (2 stasiun)
            ['nama_stasiun' => 'Makassar', 'kota' => 'Makassar'],
            ['nama_stasiun' => 'Parepare', 'kota' => 'Parepare']
        ];

        foreach ($stasiuns as $stasiun) {
            Stasiun::create($stasiun);
        }
    }
}