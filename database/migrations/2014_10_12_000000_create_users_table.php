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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('display_name');
            $table->string('external_id');
            $table->string('email')->unique();
            $table->string('is_admin')->default(false);
            $table->string('is_staff')->default(false);
            $table->string(Ids::ORC_ID_ID)->nullable()->unique();
            $table->string(Ids::SCOPUS_ID)->nullable()->unique();
            $table->string(Ids::OPEN_ALEX_ID)->nullable()->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::dropIfExists('users');
    }
};
