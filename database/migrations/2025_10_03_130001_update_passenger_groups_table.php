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
        Schema::table('passenger_groups', function (Blueprint $table) {
            // Remove individual passenger fields since they will be in passengers table
            $table->dropColumn(['passenger_name', 'nik']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('passenger_groups', function (Blueprint $table) {
            $table->string('passenger_name')->after('group_name');
            $table->string('nik', 16)->after('passenger_name');
        });
    }
};
