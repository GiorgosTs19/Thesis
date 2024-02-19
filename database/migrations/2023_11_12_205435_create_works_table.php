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
        Schema::create('works', function (Blueprint $table) {
            $table->id();
            $table->string('doi')->nullable()->unique();
            $table->text('title');
            $table->text('abstract')->nullable();
            $table->date('publication_date');
            $table->string('source_title')->nullable();
            $table->unsignedSmallInteger('publication_year');
            $table->integer('referenced_works_count');
            $table->integer('is_referenced_by_count')->nullable();
            $table->string('language');
            $table->string('type');
            $table->string('subtype')->nullable();
            $table->string('event')->nullable();
            $table->boolean('is_oa');
            $table->string('open_alex_url')->unique();
            $table->string(Ids::OPEN_ALEX_ID)->unique();
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
