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
        // Remove kereta_id from tiket_lrt table
        Schema::table('tiket_lrt', function (Blueprint $table) {
            $table->dropForeign(['kereta_id']);
            $table->dropColumn('kereta_id');
        });

        // Remove kereta_id from tiket_bandara table
        Schema::table('tiket_bandara', function (Blueprint $table) {
            $table->dropForeign(['kereta_id']);
            $table->dropColumn('kereta_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Add back kereta_id to tiket_lrt table
        Schema::table('tiket_lrt', function (Blueprint $table) {
            $table->unsignedBigInteger('kereta_id');
            $table->foreign('kereta_id')->references('train_id')->on('keretas')->onDelete('cascade');
        });

        // Add back kereta_id to tiket_bandara table
        Schema::table('tiket_bandara', function (Blueprint $table) {
            $table->unsignedBigInteger('kereta_id');
            $table->foreign('kereta_id')->references('train_id')->on('keretas')->onDelete('cascade');
        });
    }
};