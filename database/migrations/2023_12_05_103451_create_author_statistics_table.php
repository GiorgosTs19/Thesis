<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create('author_statistics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('author_id');
            $table->unsignedSmallInteger('year');
            $table->unsignedSmallInteger('works_count');
            $table->integer('cited_count');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::dropIfExists('author_statistics');
    }
};
