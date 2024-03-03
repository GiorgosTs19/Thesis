<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ModifyMoreColumnsNullableInWorksTable extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::table('works', function (Blueprint $table) {
            // Modify the column 'orc_id_put_code' to be nullable
            $table->dateTime('last_updated_date')->nullable()->change();

            // Modify the column 'orc_id_url' to be nullable
            $table->dateTime('created_at')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::table('works', function (Blueprint $table) {
            // Revert the modification of 'orc_id_put_code' column to be non-nullable
            $table->integer('orc_id_put_code')->nullable(false)->change();

            // Revert the modification of 'orc_id_url' column to be non-nullable
            $table->string('orc_id_url')->nullable(false)->change();
        });
    }
}
