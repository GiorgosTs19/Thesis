<?php

use App\Models\Work;
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
            $table->string('doi')->nullable();
            $table->text('title');
            $table->text('abstract')->nullable();
            $table->string('source_title')->nullable();
            $table->unsignedSmallInteger('publication_year')->nullable();
            $table->integer('is_referenced_by_count')->nullable();
            $table->string('source_url')->nullable();
            $table->string('external_id')->nullable();
            $table->string('language');
            $table->string('type');
            $table->string('subtype')->nullable();
            $table->foreignId('type_id')->constrained()->onUpdate('cascade')->restrictOnDelete();
            $table->string('event')->nullable();
            $table->boolean('is_oa')->default(false);
            $table->text('authors_string')->nullable();
            $table->dateTime('last_updated_date')->nullable();
            $table->dateTime('created_date')->nullable();
            $table->enum('source', [Work::$orcIdSource, Work::$openAlexSource, Work::$crossRefSource, Work::$aggregateSource]);
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
