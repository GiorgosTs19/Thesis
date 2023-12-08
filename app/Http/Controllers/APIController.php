<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Http;
use function App\Providers\rocketDump;

class APIController extends Controller {
    private static function getFieldsToFetch($request_type): string {
        $fields_string = match ($request_type) {
            'author' => Arr::join(self::$required_author_fields,','),
            'work' => Arr::join(self::$required_work_fields,','),
        };
        return "&select=$fields_string";
    }
    // Limits the number of works that will be fetched for each author
    private static int $perPage = 200;
    // Basically retrieve the first $perPage number of works ( based on a default sorting )
    private static int $page = 1;
    // An email is required for the OpenAlex api to function correctly.
    private static string $mailTo = 'it185302@it.teithe.gr';
    // Base URL to fire an OpenAlex getAuthorWorks api request
    private static string $author_works_base_url = "https://api.openalex.org/works?filter=author.id:";
    // Base URL to fire an OpenAlex getAuthor api request
    private static string $author_base_url = 'https://api.openalex.org/authors/';
    // Base URL to fire an OpenAlex getWork api request
    private static string $work_base_url = 'https://api.openalex.org/works/';

    private static function getResponseBody($response) {
        return json_decode($response->body());
    }

    private static array $required_work_fields = ['ids','open_access','title',
        'publication_date', 'publication_year', 'referenced_works_count', 'language',
        'type','updated_date', 'created_date','cited_by_api_url','authorships'];

    public static function authorWorksRequest($open_alex_id, $page) {
        $base_url = self::$author_works_base_url.$open_alex_id.
            self::$mailTo.'&per-page='.self::$perPage.'&page='.$page;
        $url = $base_url.self::getFieldsToFetch('work');
        $works_response = Http::withOptions(['verify' => false])->get($url);
        return self::getResponseBody($works_response);
    }

    public static function workRequest($id) {
        // Retrieve a work's data from the OpenAlex api
        $url = self::$work_base_url . $id . self::$mailTo;
        $author_response = Http::withOptions(['verify' => false])->get($url);
        return self::getResponseBody($author_response);
    }

    private static array $required_author_fields = ['ids','display_name','cited_by_count',
        'works_count', 'counts_by_year', 'works_api_url', 'updated_date', 'created_date'];

    public static function authorRequest($id,$id_type = 'orc_id') {
        // Retrieve all the author's data from the OpenAlex api
        $base_url = match ($id_type) {
            'orc_id' => self::$author_base_url . 'orcid:' . $id . self::$mailTo,
            'open_alex' => self::$author_base_url . $id . self::$mailTo,
        };
        $url = $base_url.self::getFieldsToFetch('author');
        $author_response = Http::withOptions(['verify' => false])->get($url);

        return self::getResponseBody($author_response);
    }
}
