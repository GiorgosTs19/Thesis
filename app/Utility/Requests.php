<?php

namespace App\Utility;

use GuzzleHttp\Promise\PromiseInterface;
use Illuminate\Http\Client\Response;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;

class Requests {
    private static int $callCount = 0;
    const CREATE_ACTION = 'create';

    const UPDATE_ACTION = 'update';

    const DATABASE_ASSET = 'database';

    const REQUEST_ASSET = 'request';

    public static function get($url, $headers = []): PromiseInterface|Response {
        $calls = ++self::$callCount;

        if (env('APP_ENV') === 'production')
            return Http::withHeaders($headers)->get($url);
        return Http::withoutVerifying()->withHeaders($headers)->get($url);
    }

    public static function success($message, $data = [], $code = 200): JsonResponse {
        return response()->json(['ok' => true, 'success' => $message, 'code' => $code, 'data' => $data], $code);
    }

    public static function clientError($message, $code = 400, $data = []): JsonResponse {
        return response()->json(['ok' => false, 'error' => $message, 'code' => $code, 'data' => $data], $code);
    }

    public static function serverError($message, $code = 500, $data = []): JsonResponse {
        return response()->json(['ok' => false, 'error' => $message, 'code' => $code, 'data' => $data], $code);
    }

    public static function missingParameterError($parameter): JsonResponse {
        return response()->json(['ok' => false, 'error' => "Parameter $parameter is marked as required", 'code' => 400, 'data' => []], 401);
    }

    /**
     * Returns an Authentication Error response.
     * @return JsonResponse.
     */
    public static function authenticationError(): JsonResponse {
        return response()->json(['ok' => false, 'error' => 'You need to be logged in to perform this action.', 'code' => 401, 'data' => []], 401);
    }

    public static function authorizationError(): JsonResponse {
        return response()->json(['ok' => false, 'error' => 'You are not authorized to perform this action.', 'code' => 403, 'data' => []], 403);
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
