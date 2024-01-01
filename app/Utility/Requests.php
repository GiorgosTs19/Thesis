<?php

namespace App\Utility;

use Illuminate\Support\Facades\Http;

class Requests {
    const Create_Action = 'create';

    const Update_Action = 'update';

    const Database_Asset = 'database';

    const Request_Asset = 'request';

    public static function get($url): \GuzzleHttp\Promise\PromiseInterface|\Illuminate\Http\Client\Response {
        return Http::withOptions(['verify' => false])->get($url);
    }
}
