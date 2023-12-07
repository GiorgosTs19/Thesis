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
            $table->id();
            $table->string('display_name');
            $table->string('orc_id')->nullable()->unique();
            $table->string('scopus_id')->nullable()->unique();
            $table->string('open_alex_id')->unique();
            $table->string('works_url')->unique();
            $table->boolean('is_user')->default(false);
            $table->integer('cited_by_count')->nullable();
            $table->dateTime('last_updated_date');
            $table->dateTime('created_date');
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
