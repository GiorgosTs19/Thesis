<?php

namespace App\Providers;

use App\Http\Controllers\DOIAPI;
use App\Http\Controllers\OpenAlexAPI;
use App\Http\Controllers\OrcIdAPI;
use App\Utility\Ids;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider {

    /**
     * Register any application services.
     */

    public function register(): void {
        // Instantiate the OpenAlex API Controller
        OpenAlexAPI::init();
        // Instantiate the OrcId API Controller
        OrcIdAPI::init();
        // Instantiate the DOI API Controller
        DOIAPI::init();
        // Instantiate the Ids Utility Class
        Ids::init();
    }


    /**
     * Bootstrap any application services.
     */
    public function boot(): void {
        JsonResource::withoutWrapping();
    }
}
