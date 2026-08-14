<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pricing_rules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('court_id')->constrained()->cascadeOnDelete();
            $table->string('name'); // e.g. "Weekday Morning", "Weekend Peak"
            $table->enum('day_type', ['weekday', 'weekend', 'all'])->default('all');
            $table->time('start_time');
            $table->time('end_time');
            $table->unsignedInteger('price_per_hour'); // in IDR
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pricing_rules');
    }
};
