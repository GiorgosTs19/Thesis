<?php

use App\Models\Work;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ModifyTablesForNextPatch extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(): void {
        Schema::table('works', function (Blueprint $table) {
            // Add orc_id_put_code column to the works table
            $table->integer('orc_id_put_code')->nullable();
            // Add orc_id_url column to the works table
            $table->string('orc_id_url')->nullable();
            // Add source column to the works table
            $table->enum('source', [Work::$openAlexSource, Work::$orcIdSource])->nullable();
            // Change open_alex_url column to be nullable
            $table->string('open_alex_url')->nullable()->change();
            // Change open_alex_id column to be nullable
            $table->string('open_alex_id')->nullable()->change();
            // Change last_updated_date column to be nullable
            $table->dateTime('last_updated_date')->nullable()->change();
            // Change created_at column to be nullable
            $table->dateTime('created_at')->nullable()->change();
            // Change is_oa column to default to false ( if nothing is provided )
            $table->boolean('is_oa')->default(false)->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void {
        Schema::table('works', function (Blueprint $table) {
            $table->dropColumn('orc_id_put_code');
            $table->dropColumn('orc_id_url');
            $table->dropColumn('source');
            $table->integer('orc_id_put_code')->nullable(false)->change();
            $table->string('orc_id_url')->nullable(false)->change();
            $table->integer('orc_id_put_code')->nullable(false)->change();
            $table->string('orc_id_url')->nullable(false)->change();
            $table->boolean('is_oa')->change();
        });
    }
}
