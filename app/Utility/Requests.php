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

    public static function get($url, $headers = []): PromiseInterface|Response {
        if (env('APP_ENV') === 'production')
            return Http::withHeaders($headers)->get($url);
        return Http::withoutVerifying()->withHeaders($headers)->get($url);
    }

    public static function success($message, $data = [], $code = 200): array {
        return ['success' => $message, 'code' => $code, 'data' => $data];
    }

    public static function clientError($message, $code = 400, $data = []): array {
        return ['error' => $message, 'code' => $code, 'data' => $data];
    }

    public static function serverError($message, $code = 500, $data = []): array {
        return ['error' => $message, 'code' => $code, 'data' => $data];
    }

    public static function getResponseBody($response) {
        return $response ? json_decode($response->body()) : null;
    }

    /**
     * @param $response
     * The response from which to extract the results
     * @param bool $singleEntity
     * A boolean indicating whether to return only the first entity of the result ( when targeting a single asset, or the whole results array )
     * defaults to false
     * @return mixed|null
     * The result data from the query, or the first entity of the data when $singleEntity is set to true
     */
    public static function getFilterResponseBody($response, bool $singleEntity = false): mixed {
        if (!$response)
            return null;
        $decoded_response = json_decode($response->body())->results;
        if (sizeof($decoded_response) === 0)
            return null;
        return $singleEntity ? $decoded_response[0] : $decoded_response;
    }
}
