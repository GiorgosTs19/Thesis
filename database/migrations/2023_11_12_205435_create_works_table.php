<?php

use App\Models\Work;
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
            $table->string('source_title')->nullable();
            $table->unsignedSmallInteger('publication_year');
            $table->integer('referenced_works_count');
            $table->integer('is_referenced_by_count')->nullable();
            $table->string('language');
            $table->string('type');
            $table->string('subtype')->nullable();
            $table->string('event')->nullable();
            $table->boolean('is_oa')->default(false);
            $table->string('open_alex_url')->nullable()->unique();
            $table->string(Ids::OPEN_ALEX_ID)->nullable()->unique();
            $table->string('orc_id_url')->nullable()->unique();
            $table->string('orc_id_put_code')->nullable()->unique();
            $table->string('cites_url')->nullable();
            $table->dateTime('last_updated_date')->nullable();
            $table->dateTime('created_date')->nullable();
            $table->boolean(Work::$CROSSREF_SOURCE_FIELD)->default(false);
            $table->boolean(Work::$ORCID_SOURCE_FIELD)->default(false);
            $table->boolean(Work::$OPEN_ALEX_SOURCE_FIELD)->default(false);
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
