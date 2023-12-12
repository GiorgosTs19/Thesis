<?php

namespace App\Http\Controllers;

use App\Models\Work;
use App\Models\Author;
use Illuminate\Support\Arr;
use App\Iterators\WorksIterator;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Config;
use function App\Providers\rocketDump;

class APIController {
    private static string $perPage;
    private static string $mailTo;
    private static string $author_works_base_url;
    private static string $author_base_url;
    private static string $work_base_url;
    private static array $required_work_fields;
    private static array $required_author_fields;
    private static array $required_author_update_fields;
    private static array $required_work_update_fields;

    // Load the urls and meta required for the request, from the openAlex.php config file.
    public static function init(): void {
        self::$perPage = '&per-page='.Config::get('openAlex.perPage');
        self::$mailTo = '&mailto='.Config::get('openAlex.mailTo');
        self::$author_works_base_url = Config::get('openAlex.author_works_base_url');
        self::$author_base_url = Config::get('openAlex.author_base_url');
        self::$work_base_url = Config::get('openAlex.work_base_url');
        self::$required_work_fields = Config::get('openAlex.required_work_fields');
        self::$required_work_update_fields = Config::get('openAlex.required_work_update_fields');
        self::$required_author_fields = Config::get('openAlex.required_author_fields');
        self::$required_author_update_fields = Config::get('openAlex.required_author_update_fields');
    }

    public static function authorWorksRequest($open_alex_id, $page, $ignore_field_selection = false): array {
        $base_url = self::$author_works_base_url.$open_alex_id.
            self::$mailTo.self::$perPage.'&page='.$page;
        $url = $base_url.(!$ignore_field_selection ? self::getFieldsToFetch(Work::class) : '' );
        $works_response = self::getResponseBody(Http::withOptions(['verify' => false])->get($url));

        return [new WorksIterator($works_response->results), $works_response->meta, sizeof($works_response->results)];
    }

    private static function getFieldsToFetch($request_type, $action = 'create'): string {
        $fields_string = match ($request_type) {
            Author::class => match ($action) {
                'create' => Arr::join(self::$required_author_fields, ','),
                'update' => Arr::join(self::$required_author_update_fields, ',')},
            Work::class => match ($action) {
                'create' => Arr::join(self::$required_work_fields, ','),
                'update' => Arr::join(self::$required_work_update_fields, ',')},
        };
        return "&select=$fields_string";
    }

    private static function getResponseBody($response) {
        return json_decode($response->body());
    }

    public static function workRequest($id, $ignore_field_selection = false) {
        // Retrieve a work's data from the OpenAlex api
        $url = self::$work_base_url.$id.self::$mailTo.(!$ignore_field_selection ? self::getFieldsToFetch(Work::class) : '' );
        $author_response = Http::withOptions(['verify' => false])->get($url);
        return self::getResponseBody($author_response);
    }

    public static function workUpdateRequest($id) {
        // Retrieve a work's data that is required for their update from the OpenAlex api
        $base_url = self::$work_base_url . $id . self::$mailTo;
        $url = $base_url.self::getFieldsToFetch(Work::class, 'update');
        $work_update_response = Http::withOptions(['verify' => false])->get($url);
        return self::getResponseBody($work_update_response);
    }

    public static function authorRequest($id,$id_type = 'orc_id', $ignore_field_selection = false) {
        // Retrieve all the author's data from the OpenAlex api
        $base_url = match ($id_type) {
            'orc_id' => self::$author_base_url . 'orcid:' . $id . self::$mailTo,
            'open_alex' => self::$author_base_url . $id . self::$mailTo,
        };
        $url = $base_url.(!$ignore_field_selection ? self::getFieldsToFetch(Author::class) : '');
//        rocketDump($url, 'info', [__FUNCTION__,__FILE__,__LINE__]);
        $author_response = Http::withOptions(['verify' => false])->get($url);

        return self::getResponseBody($author_response);
    }

    public static function authorUpdateRequest($id) {
        // Retrieve the author's data that is required for their update from the OpenAlex api
        $base_url = self::$author_base_url . $id . self::$mailTo;
        $url = $base_url.self::getFieldsToFetch(Author::class, 'update');
        $author_update_response = Http::withOptions(['verify' => false])->get($url);
        return self::getResponseBody($author_update_response);
    }
}
