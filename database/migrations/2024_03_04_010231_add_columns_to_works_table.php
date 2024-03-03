<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnsToWorksTable extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::table('works', function (Blueprint $table) {
            $table->integer('orc_id_put_code')->nullable();
            $table->string('orc_id_url')->nullable();
            $table->string('source')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::table('works', function (Blueprint $table) {
            $table->dropColumn('orc_id_put_code');
            $table->dropColumn('orc_id_url');
            $table->dropColumn('source');
        });
    }
}
