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
        return '2025_10_02_214118_create_tiket_bandara_table';
    }

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tiket_bandara', function (Blueprint $table) {
            $table->id();
            $table->string('nama_kereta'); // Nama kereta bandara dari dropdown
            $table->string('harga_termurah'); // Harga termurah bandara (sesuai schema string)
            $table->string('jam'); // Jam keberangkatan
            $table->datetime('tanggal'); // Tanggal keberangkatan
            $table->integer('penumpang'); // Jumlah penumpang
            $table->string('stasiun_asal'); // Stasiun asal dari dropdown
            $table->string('stasiun_tujuan'); // Stasiun tujuan dari dropdown
            $table->unsignedBigInteger('kereta_id'); // Foreign Key ke tabel keretas
            $table->foreign('kereta_id')->references('train_id')->on('keretas')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tiket_bandara');
    }
};