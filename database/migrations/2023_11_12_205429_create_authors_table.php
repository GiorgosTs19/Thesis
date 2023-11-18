<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create('authors', function (Blueprint $table) {
            $table->uuid('id');
            $table->string('Name');
            $table->string('OrcId');
            $table->string('ScopusId');
            $table->string('OpenAlexId');
            $table->integer('Cited_By_Count');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::dropIfExists('authors');
    }
};
