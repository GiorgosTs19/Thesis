<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create('work_concept', function (Blueprint $table) {
            $table->id();
            $table->foreignId('work_id')->constrained()->onDelete('cascade')->onUpdate('cascade');
            $table->foreignId('concept_id')->constrained()->onDelete('cascade')->onUpdate('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::dropIfExists('work_concepts');
    }
};
