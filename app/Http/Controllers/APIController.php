<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class APIController extends Controller {
    // Limits the number of works that will be fetched for each author
    protected static int $perPage = 200;
    // Basically retrieve the first $perPage number of works ( based on a default sorting )
    protected static int $page = 1;
    // An email is required for the OpenAlex api to function correctly.
    protected static string $mailTo = 'it185302@it.teithe.gr';

    protected static function getResponseBody($response) {
        return json_decode($response->body());
    }

    // Base URL to fire an OpenAlex getAuthorWorks api request
    protected static string $author_works_base_url = "https://api.openalex.org/works?filter=author.id:";
    public static function authorWorksRequest($open_alex_id, $page) {
        $url = self::$author_works_base_url.$open_alex_id.
            self::$mailTo.'&per-page='.self::$perPage.'&page='.$page;
        $works_response = Http::withOptions(['verify' => false])->get($url);
        return self::getResponseBody($works_response);
    }

    // Base URL to fire an OpenAlex getAuthor api request
    protected static string $author_base_url = 'https://api.openalex.org/authors/orcid:';
    public static function authorRequest($professor) {
        // Retrieve all the author's data from the OpenAlex api
        $url = self::$author_base_url.$professor['id'].self::$mailTo;
        $author_response = Http::withOptions(['verify' => false])->get($url);
        return self::getResponseBody($author_response);
    }
}
