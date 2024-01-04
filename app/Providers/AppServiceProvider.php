<?php

namespace App\Providers;

use App\Utility\SystemManager;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\APIController;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider {

    /**
     * Register any application services.
     */

    public function register(): void {
        // Instantiate the APIController
        APIController::init();
        /**
         * Logs the given message, and displays it on the console.
         * @param object|string|array $message
         * The message to be logged and displayed.
         * @param array $callingFunctionInfo
         * An array that contains information about the function that fired the log,
         * the line that was called on and the file on which said function was used.
         * @param string $log_case
         * The type of log to use, can be one of ['info', 'error', 'warning', 'debug'].
         * @return void
         */
        function _log(object|string|array|null $message, string $log_case = SystemManager::INFO_LOG, array $callingFunctionInfo = []): void  {
            $meta = '';
            $display_meta_data = sizeof($callingFunctionInfo) === 3;
            if($display_meta_data) {
                $function_name = $callingFunctionInfo[0];
                $file_path = $callingFunctionInfo[1];
                $file_line = $callingFunctionInfo[2];
                // Find the last occurrence of needle in the path
                $lastThesisProjectIndex = strrpos($file_path, 'Thesis_Project\\');
                $lastThesisIndex = strrpos($file_path, 'Thesis\\');

                // If needle was found in the path
                if ($lastThesisProjectIndex !== false) {
                    // Extract the part of the path after the needle
                    $file_path = substr($file_path, $lastThesisProjectIndex + strlen('Thesis_Project\\'));
                }
                if ($lastThesisIndex !== false) {
                    // Extract the part of the path after the needle
                    $file_path = substr($file_path, $lastThesisIndex + strlen('Thesis\\'));
                }

                $meta = "$function_name(), $file_path, $file_line ";
            }

            if(is_string($message)) {
                if($display_meta_data)
                    $logMessage = $meta.$message;
                else
                    $logMessage = $message;

                $validLogCases = [SystemManager::INFO_LOG, SystemManager::ERROR_LOG, SystemManager::WARNING_LOG, SystemManager::DEBUG_LOG];

                if (in_array($log_case, $validLogCases)) {
                    if ($log_case === SystemManager::ERROR_LOG) {
                        // Use red color for the error message
                        Log::error($logMessage);
                    } else {
                        // Use default color for other log cases
                        Log::$log_case($logMessage);
                    }
                }
                dump("🚀 ~ $logMessage");
            } else dump("🚀 ~ ", $meta , $message);
        }

        function logMemory(): void {
            _log(number_format(memory_get_usage() * (10 ** -6), 1)."MB / ".ini_get('memory_limit'));
        }
    }


    /**
     * Bootstrap any application services.
     */
    public function boot(): void {
    }
}
