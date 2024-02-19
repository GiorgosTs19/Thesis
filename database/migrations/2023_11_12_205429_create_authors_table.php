<?php

use App\Utility\Ids;
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
            $table->string(Ids::OPEN_ALEX_ID)->unique();
            $table->string(Ids::ORC_ID_ID)->nullable()->unique();
            $table->string(Ids::SCOPUS_ID)->nullable()->unique();
            $table->string('display_name');
            $table->text('biography')->nullable();
            $table->string('works_url')->nullable()->unique();
            $table->boolean('is_user')->default(false);
            $table->integer('cited_by_count')->nullable();
            $table->integer('works_count')->nullable();
            $table->dateTime('created_date')->nullable();
            $table->dateTime('last_updated_date')->nullable();
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
