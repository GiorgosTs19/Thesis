<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create('works', function (Blueprint $table) {
            $table->id();
            $table->string('doi')->nullable()->unique();
            $table->string('title');
            $table->date('publication_date');
            $table->unsignedSmallInteger('publication_year');
            $table->integer('referenced_works_count');
            $table->string('language');
            $table->string('type');
            $table->boolean('is_oa');
            $table->string('open_alex_url')->unique();
            $table->string('open_alex_id')->unique();
            $table->string('cites_url')->nullable();
            $table->dateTime('last_updated_date');
            $table->dateTime('created_date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::dropIfExists('works');
    }
};
