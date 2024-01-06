<?php

namespace App\Providers;

use App\Http\Controllers\APIController;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider {

    /**
     * Register any application services.
     */

    public function register(): void {
        // Instantiate the APIController
        APIController::init();
    }


    /**
     * Bootstrap any application services.
     */
    public function boot(): void {
    }
}
