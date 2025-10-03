<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cart_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cart_id')->constrained('carts')->onDelete('cascade');
            $table->unsignedBigInteger('train_id')->nullable();
            $table->string('nama_kereta')->nullable();
            $table->string('kelas')->nullable();
            $table->date('tanggal')->nullable();
            $table->string('jam', 10)->nullable();
            $table->string('stasiun_asal')->nullable();
            $table->string('stasiun_tujuan')->nullable();
            $table->decimal('harga', 12, 2)->default(0);
            $table->string('passenger_name')->nullable();
            $table->string('passenger_nik', 16);
            $table->timestamps();
            $table->index(['cart_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cart_items');
    }
};


