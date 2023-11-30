<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider {
    /**
     * Register any application services.
     */
    public function register(): void {
        function rocketDump($message, $callingFunction): void  {

            $logMessage = "🚀 ~ $callingFunction, $message ";

            dump($logMessage);
        }
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void {
    }
}
