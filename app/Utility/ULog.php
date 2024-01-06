<?php

namespace App\Utility;

use Illuminate\Support\Facades\Log;

class ULog {
    const META = [__FUNCTION__, __FILE__, __LINE__];


    /**
     * Logs the given message, and displays it on the console.
     * @param object|string|array|null $message
     * The message to be logged and displayed.
     * @param array $metadata
     * An array that contains information about the function that fired the log,
     * the line that was called on and the file on which said function was used.
     * @return void
     * Display the message to the console and also log it ( if it is a string ).
     */
    static function log(object|string|array|null $message, array $metadata = []): void  {
        $meta = '';
        $display_meta_data = sizeof($metadata) !== 0;
        if($display_meta_data) {
            $meta = self::parseMetaData($metadata);
        }

        if(is_string($message)) {
            $logMessage = $message.($display_meta_data ? $meta : '');
            Log::info($logMessage);
            dump("🚀 ~ $logMessage");
        } else dump("🚀 ~ ", $meta , $message);
    }

    private static function parseMetaData($metadata): string {
        $function_name = $metadata[0];
        $file_path = $metadata[1];
        $file_line = "line $metadata[2]";
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

        return "$file_path, $file_line, $function_name(),";
    }

    /**
     * @return void
     * Logs and displays current memory usage to the console.
     */
    public static function memory(): void {
        self::log(number_format(memory_get_usage() * (10 ** -6), 1)."MB / ".ini_get('memory_limit'));
    }

    /**
     * Logs the given error message, and displays it on the console.
     * @param string $error
     * The error message to be logged and displayed.
     * @param array $metadata
     * An array that contains information about the function that fired the error log,
     * the line that was called on and the file on which said function was used.
     * @return void
     * Display the message to the console and also log it ( if it is a string ).
     */
    public static function error(string $error, array $metadata = []): void {
        $meta = '';
        $display_meta_data = sizeof($metadata) !== 0;
        if($display_meta_data) {
            $meta = self::parseMetaData($metadata);
        }

            $logMessage = $error.($display_meta_data ? $meta : '');
            Log::error($logMessage);
            dump("🚀 ~ $logMessage");
    }
}
