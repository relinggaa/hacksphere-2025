<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tiket_antar_kotas', function (Blueprint $table) {
            $table->id();
            $table->string('nama_kereta'); // Nama kereta dari dropdown
            $table->string('kelas'); // Kelas kereta
            $table->decimal('harga_termurah', 10, 2); // Harga termurah
            $table->string('jam'); // Jam keberangkatan
            $table->date('tanggal'); // Tanggal keberangkatan
            $table->integer('penumpang'); // Jumlah penumpang
            $table->string('stasiun_asal'); // Stasiun asal dari dropdown
            $table->string('stasiun_tujuan'); // Stasiun tujuan dari dropdown
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tiket_antar_kotas');
    }
};
