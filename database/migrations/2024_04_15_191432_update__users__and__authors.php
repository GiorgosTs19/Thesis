<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::table('users', function (Blueprint $table) {
            // Change the type of the id column and make it primary
            $table->dropPrimary('id');
            $table->string('id')->primary()->change();

            // Add a new column
            $table->string('display_name')->after('email');

            // Rename isAdmin column to is_admin
            $table->renameColumn('isAdmin', 'is_admin');

            // Add a new column is_staff and set its default value to true
            $table->boolean('is_staff')->default(true);
        });
        Schema::table('authors', function (Blueprint $table) {
            // Change the type of the id column and make it primary
            $table->foreignId('user_id')->unique()->constrained()->nullOnDelete()->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::table('users', function (Blueprint $table) {
            // Reverse the changes made in the "up" method
            $table->bigIncrements('id')->change();
            $table->dropColumn('display_name');
            $table->renameColumn('is_admin', 'isAdmin');
            $table->dropColumn('is_staff');
        });
        Schema::table('authors', function (Blueprint $table) {
            $table->dropColumn('user_id');
        });
    }
};
