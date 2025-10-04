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
        Schema::create('porter_orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('porter_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('pickup_location');
            $table->string('destination');
            $table->enum('service_type', ['baggage', 'luggage', 'assistance'])->default('baggage');
            $table->text('notes')->nullable();
            $table->timestamp('scheduled_time')->nullable();
            $table->enum('status', ['pending', 'accepted', 'in_progress', 'completed', 'cancelled'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('porter_orders');
    }
};
