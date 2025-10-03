<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Get the migration's codebase_index_filename for PHPUnit tests.
     */
    protected function codebase_index_filename(): string
    {
        return '2025_10_02_210543_create_tiket_commuters_table';
    }

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tiket_commuters', function (Blueprint $table) {
            $table->id();
            $table->string('nama_kereta'); // Nama kereta commuter dari dropdown
            $table->string('kelas'); // Kelas kereta commuter
            $table->decimal('harga_murah', 10, 2); // Harga murah commuter
            $table->decimal('harga_normal', 10, 2); // Harga normal commuter
            $table->string('jam_operasional'); // Jam operasional (misal: 06:00-22:00)
            $table->string('stasiun_asal'); // Stasiun asal dari dropdown
            $table->string('stasiun_tujuan'); // Stasiun tujuan dari dropdown (sama dengan asal untuk commuter)
            $table->integer('interval_jam'); // Interval jam keberangkatan (dalam menit)
            $table->integer('kapasitas_kursi'); // Kapasitas kursi per gerbong
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tiket_commuters');
    }
};