<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider {
    /**
     * Register any application services.
     */
    public function register(): void {
        /**
         * @param $message
         * The message to be logged and displayed.
         * @param $callingFunction
         * Information about the function that fired the log,
         * the line that was called on and the file on which the function exists.
         * @return void
         * Logs the given message, and displays it on the console.
         */
        function rocketDump($message, $callingFunction): void  {
            $file_path = $callingFunction[1];
            $function_name = $callingFunction[0];
            $file_line = $callingFunction[2];

            // Find the last occurrence of needle in the path
            $lastThesisIndex = strrpos($file_path, 'Thesis');

            // If needle was found in the path
            if ($lastThesisIndex !== false) {
                // Extract the part of the path after the needle
                $file_path = substr($file_path, $lastThesisIndex + strlen('Thesis'));
            }

            $logMessage = "🚀 ~ $function_name(), $file_path, $file_line, $message ";

            dump($logMessage);
        }
    }


    /**
     * Bootstrap any application services.
     */
    public function boot(): void {
    }
}
