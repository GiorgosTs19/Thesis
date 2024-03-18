<?php

namespace App\Utility;

use Illuminate\Support\Facades\Log;

class ULog {
    /**
     * Logs the given message, and displays it on the console.
     * @param object|string|array|null $message
     * The message to be logged and displayed.
     * @return void
     * Display the message to the console and also log it ( if it is a string ).
     */
    static function log(object|string|array|null $message): void {
        if (is_string($message)) {
            Log::info($message);
            dump("🚀 ~ $message");
        } else dump("🚀 ~ ", $message);
    }

    /**
     * @return void
     * Logs and displays current memory usage to the console.
     */
    public static function memory(): void {
        self::log(number_format(memory_get_usage() * (10 ** -6), 1) . "MB / " . ini_get('memory_limit'));
    }

    /**
     * Logs the given error message, and displays it on the console.
     * @param string $error
     * The error message to be logged and displayed.
     * @return void
     * Display the message to the console and also log it ( if it is a string ).
     */
    public static function error(string $error): void {
        Log::error($error);
        dump("🚀 ~ $error");
    }
}
