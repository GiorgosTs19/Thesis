<?php

namespace App\Utility;

use GuzzleHttp\Promise\PromiseInterface;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;

class Requests {
    const CREATE_ACTION = 'create';

    const UPDATE_ACTION = 'update';

    const DATABASE_ASSET = 'database';

    const REQUEST_ASSET = 'request';

    public static function get($url): PromiseInterface|Response {
        if (env('APP_ENV') === 'production')
            return Http::get($url);
        return Http::withoutVerifying()->get($url);
    }

    public static function success($message, $code = 200) {
        return ['success' => $message, 'code' => $code];
    }

    public static function clientError($message, $code = 400) {
        return ['error' => $message, 'code' => $code];
    }

    public static function serverError($message, $code = 500) {
        return ['error' => $message, 'code' => $code];
    }
}
