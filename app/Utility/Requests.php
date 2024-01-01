<?php

namespace App\Utility;

use Illuminate\Support\Facades\Http;

class Requests {
    const CREATE_ACTION = 'create';

    const UPDATE_ACTION = 'update';

    const DATABASE_ASSET = 'database';

    const REQUEST_ASSET = 'request';

    public static function get($url): \GuzzleHttp\Promise\PromiseInterface|\Illuminate\Http\Client\Response {
        return Http::withOptions(['verify' => false])->get($url);
    }
}
