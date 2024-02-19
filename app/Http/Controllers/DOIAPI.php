<?php

namespace App\Http\Controllers;

use App\Utility\Ids;
use App\Utility\Requests;
use Illuminate\Support\Facades\Config;

class DOIAPI {
    private static string $ACCEPT_JSON;

    public static function init(): void {
        self::$ACCEPT_JSON = Config::get('DOI.accept_json');
    }

    public static function DOIRequest($doi) {
        return Requests::getResponseBody(Requests::get(Ids::toDxDoiUrl($doi), ['Accept' => self::$ACCEPT_JSON]));
    }
}
