<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pesanan_antar_kotas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->unsignedBigInteger('train_id')->nullable();
            $table->string('nama_kereta');
            $table->string('kelas')->nullable();
            $table->date('tanggal');
            $table->string('jam', 10)->nullable();
            $table->string('stasiun_asal');
            $table->string('stasiun_tujuan');
            $table->decimal('harga', 12, 2)->default(0);
            $table->string('passenger_name')->nullable();
            $table->string('passenger_nik', 16);
            $table->string('status', 20)->default('dibuat');
            $table->string('booking_code', 20);
            $table->timestamps();
            $table->index(['user_id', 'tanggal']);
            $table->unique('booking_code');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pesanan_antar_kotas');
    }
};


