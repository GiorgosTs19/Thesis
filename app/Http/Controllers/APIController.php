<?php

namespace App\Http\Controllers;

use App\Models\Work;
use App\Utility\Ids;
use App\Models\Author;
use App\Utility\Requests;
use Illuminate\Support\Arr;
use App\Iterators\WorksIterator;
use Illuminate\Support\Facades\Config;

class APIController {
    private static string $perPage;
    private static string $mailTo;
    private static string $author_works_base_url;
    private static string $author_base_url;
    private static string $author_base_filter_url;
    private static string $work_base_url;
    private static string $work_base_filter_url;
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
        self::$author_base_filter_url = Config::get('openAlex.author_base_filter_url');
        self::$work_base_url = Config::get('openAlex.work_base_url');
        self::$work_base_filter_url = Config::get('openAlex.work_base_filter_url');
        self::$required_work_fields = Config::get('openAlex.required_work_fields');
        self::$required_work_update_fields = Config::get('openAlex.required_work_update_fields');
        self::$required_author_fields = Config::get('openAlex.required_author_fields');
        self::$required_author_update_fields = Config::get('openAlex.required_author_update_fields');
    }

    /**
     * @param $open_alex_id
     * The OpenAlex id of the author
     * @param int $page
     * The number of the result's page
     * @param bool $ignore_field_selection
     * A boolean to indicate whether the fields ( specified in openAlex.php config file ) should be ignored.
     * This will cause the query to return all the fields of the associated assets.
     * @param array $additional_filters
     * An associative array of extra filters to be added to the query e.g ['publication_year'=>2023]
     * @return array
     * The author's works assets ( if the id provided is valid and present in openAlex's database )
     */
    public static function authorWorksRequest($open_alex_id, int $page = 1, bool $ignore_field_selection = false, array $additional_filters = []): array {
        $base_url = self::$author_works_base_url . $open_alex_id . self::addAdditionalFilters($additional_filters).
            self::$mailTo.self::$perPage.'&page='.$page;
        $url = $base_url . (!$ignore_field_selection ? self::getFieldsToFetch(Work::class) : '' );
        $works_response = self::getResponseBody(Requests::get($url));

        return [new WorksIterator($works_response->results), $works_response->meta, sizeof($works_response->results)];
    }

    private static function addAdditionalFilters($additional_filters): string {
        if(sizeof($additional_filters) === 0)
            return '';

        $result = '';

        foreach ($additional_filters as $key => $value) {
            $result .= $key . ':' . $value . ',';
        }

        return rtrim($result, ',');
    }

    private static function getFieldsToFetch($request_type, $action = Requests::Create_Action): string {
        $fields_string = match ($request_type) {
            Author::class => match ($action) {
                Requests::Create_Action => Arr::join(self::$required_author_fields, ','),
                Requests::Update_Action  => Arr::join(self::$required_author_update_fields, ',')},
            Work::class => match ($action) {
                Requests::Create_Action => Arr::join(self::$required_work_fields, ','),
                Requests::Update_Action => Arr::join(self::$required_work_update_fields, ',')},
        };
        return "&select=$fields_string";
    }

    private static function getResponseBody($response) {
        return $response ? json_decode($response->body()) : null;
    }

    public static function workRequest($id, $ignore_field_selection = false) {
        // Retrieve a work's data from the OpenAlex api
        $url = self::$work_base_url . $id .self::$mailTo .(!$ignore_field_selection ? self::getFieldsToFetch(Work::class) : '' );
        $author_response = Requests::get($url);
        return self::getResponseBody($author_response);
    }

    public static function workUpdateRequest($id) {
        // Retrieve a work's data that is required for their update from the OpenAlex api
        $base_url = self::$work_base_url . $id . self::$mailTo;
        $url = $base_url.self::getFieldsToFetch(Work::class, Requests::Update_Action);
        $work_update_response = Requests::get($url);
        return self::getResponseBody($work_update_response);
    }

    public static function authorRequest($id,$ignore_field_selection = false) {
        $id_type = Ids::getIdType($id);
        // Retrieve all the author's data from the OpenAlex api
        $base_url = match ($id_type) {
            Ids::OrcId => self::$author_base_url . Ids::OrcIdFilterPrefix . $id . self::$mailTo,
            Ids::OpenAlex => self::$author_base_url . $id . self::$mailTo,
            Ids::Scopus => self::$author_base_filter_url . Ids::ScopusFilterPrefix . $id . self::$mailTo
        };
        $url = $base_url.(!$ignore_field_selection ? self::getFieldsToFetch(Author::class) : '');
        $author_response = Requests::get($url);

        return self::getResponseBody($author_response);
    }

    /**
     * @param $id
     * The author's id
     * @param bool $ignore_field_selection
     * A boolean to indicate whether the fields ( specified in openAlex.php config file ) should be ignored.
     * * This will cause the query to return all the fields of the associated assets.
     * @param bool $singleEntity
     *  A boolean indicating whether to return only the first entity of the result ( when targeting a single asset, or the whole results array )
     *  defaults to false
     * @param array $additional_filters
     *  An associative array of extra filters to be added to the query e.g ['publication_year'=>2023]
     * @return mixed|null
     * The author asset ( if the id provided is valid and present in openAlex's database )
     */
    public static function authorFilterRequest($id,
        bool $ignore_field_selection = false, bool $singleEntity = false, array $additional_filters = []): mixed {
        $id_type = Ids::getIdType($id);
        // Retrieve all the author's data from the OpenAlex api
        $base_url = match ($id_type) {
            Ids::OrcId => self::$author_base_filter_url . Ids::OrcIdFilterPrefix . $id .self::addAdditionalFilters($additional_filters).self::$mailTo,
            Ids::Scopus => self::$author_base_filter_url . Ids::ScopusFilterPrefix . $id . self::addAdditionalFilters($additional_filters).self::$mailTo
        };
        $url = $base_url.(!$ignore_field_selection ? self::getFieldsToFetch(Author::class) : '');
        $author_response = Requests::get($url);

        return self::getFilterResponseBody($author_response, $singleEntity);
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
    private static function getFilterResponseBody($response, bool $singleEntity = false): mixed {
        if(!$response)
            return null;
        $decoded_response = json_decode($response->body())->results;
        if(sizeof($decoded_response) === 0)
            return null;
        return $singleEntity ? $decoded_response[0] : $decoded_response;
    }

    public static function authorUpdateRequest($id) {
        // Retrieve the author's data that is required for their update from the OpenAlex api
        $base_url = self::$author_base_url . $id . self::$mailTo;
        $url = $base_url.self::getFieldsToFetch(Author::class, Requests::Update_Action);
        $author_update_response = Requests::get($url);
        return self::getResponseBody($author_update_response);
    }
}
