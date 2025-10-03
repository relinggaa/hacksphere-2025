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
        Schema::table('users', function (Blueprint $table) {
            // Status ONLINE/OFFLINE untuk porter
            $table->enum('status', ['ONLINE', 'OFFLINE'])->default('OFFLINE')->after('role');
            // Key login porter (akan juga di-hash sebagai password)
            $table->string('keylogin')->nullable()->after('status');
            // Nomor telepon porter
            $table->string('no_telepon')->nullable()->after('keylogin');
            // Nomor identitas porter (KTP/SIM/dll)
            $table->string('no_identitas')->nullable()->after('no_telepon');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['status', 'keylogin', 'no_telepon', 'no_identitas']);
        });
    }
};