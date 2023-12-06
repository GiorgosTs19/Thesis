<?php

namespace App\Providers;

use Illuminate\Support\Facades\Log;
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
        function rocketDump($message, $callingFunction, $log_case='info', $display_meta_data = true): void  {
            $file_path = $callingFunction[1];
            $function_name = $callingFunction[0];
            $file_line = $callingFunction[2];

            // Find the last occurrence of needle in the path
            $lastThesisIndex = strrpos($file_path, 'Thesis_Project\\');

            // If needle was found in the path
            if ($lastThesisIndex !== false) {
                // Extract the part of the path after the needle
                $file_path = substr($file_path, $lastThesisIndex + strlen('Thesis_Project\\'));
            }

            if($display_meta_data)
                $logMessage = "$function_name(), $file_path, $file_line, $message ";
            else
                $logMessage = $message;

            $validLogCases = ['info', 'error', 'warning', 'debug'];

            if (in_array($log_case, $validLogCases)) {
                if ($log_case === 'error') {
                    // Use red color for the error message
                    Log::error("\033[0;31m$logMessage\033[0m");
                } else {
                    // Use default color for other log cases
                    Log::$log_case($logMessage);
                }
            }

            dump("🚀 ~ $logMessage");
        }
    }


    /**
     * Bootstrap any application services.
     */
    public function boot(): void {
    }
}
