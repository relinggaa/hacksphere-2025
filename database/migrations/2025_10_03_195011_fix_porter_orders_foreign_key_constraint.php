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
        Schema::table('porter_orders', function (Blueprint $table) {
            // Drop the existing foreign key constraint
            $table->dropForeign(['porter_id']);
            
            // Add new foreign key constraint to porters table
            $table->foreign('porter_id')->references('id')->on('porters')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('porter_orders', function (Blueprint $table) {
            // Drop the foreign key constraint
            $table->dropForeign(['porter_id']);
            
            // Restore the original foreign key constraint to users table
            $table->foreign('porter_id')->references('id')->on('users')->onDelete('cascade');
        });
    }
};