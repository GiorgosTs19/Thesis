<?php

namespace App\Http\Controllers;

use App\Utility\Ids;
use App\Utility\Requests;
use Illuminate\Support\Facades\Config;

class DOIAPI {
    private static string $acceptJson;

    public static function init(): void {
        self::$acceptJson = Config::get('DOI.accept_json');
    }

    /**
     * Fires a request to CrossRef / DOI to retrieve data about a work, using its doi url.
     * @param $doi - The DOI url of the work to be retrieved.
     * @return mixed|null
     */
    public static function workRequest($doi): mixed {
        return Requests::getResponseBody(Requests::get(Ids::toDxDoiUrl($doi), ['Accept' => self::$acceptJson]));
    }
}
