<?php

namespace App\Utility;

use Illuminate\Support\Facades\Config;

class Ids {
    /**
     * ID type string for OrcId ids.
     */
    const ORC_ID = 'orc_id';

    /**
     * ID type string for Open Alex ids.
     */
    const OPEN_ALEX = 'open_alex';

    /**
     * ID type string for Scopus ids.
     */
    const SCOPUS = 'scopus';

    /**
     * ID field string for OrcId ids.
     */
    const ORC_ID_ID = 'orc_id';

    /**
     * ID field string for Open Alex ids.
     */
    const OPEN_ALEX_ID = 'open_alex_id';

    /**
     * ID field string for Scopus ids.
     */
    const SCOPUS_ID = 'scopus_id';

    /**
     * ID filter prefix for OrcId ids.
     */
    const ORC_ID_FILTER_PREFIX = 'orcid:';

    /**
     * ID filter prefix for Scopus ids.
     */
    const SCOPUS_FILTER_PREFIX = 'scopus:';

    private static string $doiBaseUrl;
    private static string $orcIdBaseUrl;
    private static string $dxBaseUrl;

    public static function init(): void {
        self::$doiBaseUrl = Config::get('DOI.base_url');
        self::$dxBaseUrl = Config::get('DOI.dx_base_url');
        self::$orcIdBaseUrl = Config::get('orcId.base_url');
    }

    /**
     * @param string $id
     * The id to check.
     * @return string
     * The type of the id passed to the function ( Ids::OrcId || Ids::OpenAlex || Ids::Scopus )
     */
    public static function getIdType(string $id): string {
        // If the id contains '-', then OrcId id is used.
        if (str_contains($id, '-'))
            return self::ORC_ID;
        // If the id starts/contains 'A' or 'W', then OpenAlex id is used.
        elseif (str_starts_with($id, 'A') || str_starts_with($id, 'W'))
            return self::OPEN_ALEX;
        // If the id is just numbers, then scopus is used.
        else return self::SCOPUS;
    }

    /**
     * @param $author
     * The author object to extract the ids from
     * @param string $asset_type
     * The type of the asset's origin ( OpenAlex api request => 'request', Local database => 'database' )
     * @return array
     * Am associative array of the ids extracted and parsed from the author object. This array can contain null values.
     */
    public static function extractIds($author, string $asset_type = Requests::REQUEST_ASSET): array {
        return match ($asset_type) {
            Requests::REQUEST_ASSET =>
            [
                self::SCOPUS_ID => property_exists($author, self::SCOPUS) ? self::parseScopusId($author->scopus) : null,
                self::ORC_ID_ID => property_exists($author, self::ORC_ID) ? self::parseOrcId($author->orcid) : null,
                self::OPEN_ALEX_ID => self::parseOpenAlexId($author->id)
            ],

            Requests::DATABASE_ASSET =>
            [
                self::SCOPUS_ID => property_exists($author, self::SCOPUS_ID) ? $author->scopus_id : null,
                self::ORC_ID_ID => property_exists($author, self::ORC_ID_ID) ? $author->orc_id : null,
                self::OPEN_ALEX_ID => property_exists($author, self::OPEN_ALEX_ID) ? $author->open_alex_id : null
            ]
        };
    }

    /**
     * @param string $id
     * The id to be parsed
     * @return string|null
     * The parsed Scopus id.
     */
    public static function parseScopusId(string $id): ?string {
        if (strlen($id) === 0)
            return null;
        $parsed_id = explode('=', explode('&', $id)[0]);
        if (is_string($parsed_id))
            return $parsed_id;
        if (sizeof($parsed_id) === 1)
            return $parsed_id[0];
        return $parsed_id[1];
    }

    /**
     * @param string $id
     * The id to be parsed.
     * @return string|null
     * The parsed OrcId id.
     */
    public static function parseOrcId(string $id): ?string {
        if (strlen($id) === 0) return null;
        $parsed_id = explode('/', parse_url($id, PHP_URL_PATH));
        if (is_string($parsed_id))
            return $parsed_id;
        if (sizeof($parsed_id) === 1)
            return $parsed_id[0];
        return $parsed_id[1];
    }

    /**
     * Given an Open Alex Author | Work object, extracts the id from the object.
     * @param $author
     * The author object to retrieve the id from;
     * @return string|null
     * The id extracted from the object ( if it is present ).
     */
    public static function parseScopusIdFromObj($author): ?string {
        if (!$author) return null;
        return property_exists($author->ids, 'scopus')
            ? explode('=', explode('&', $author->ids->scopus)[0])[1]
            : null;
    }

    /**
     * Given an Open Alex Author | Work object, extracts the id from the object.
     * @param $author
     * The author object to retrieve the id from;
     * @return string|null
     * The id extracted from the object ( if it is present ).
     */

    public static function parseOrcIdFromObj($author): ?string {
        if (!$author) return null;
        return property_exists($author->ids, 'orcid')
            ? explode('/', parse_url($author->ids->orcid, PHP_URL_PATH))[1]
            : null;
    }

    /**
     * Given an Open Alex Author | Work url, extracts the id from the url.
     * @param string $id
     * The id to be parsed
     * @return string|null
     * The id extracted from the url.
     */
    public static function parseOpenAlexId(string $id): ?string {
        if (strlen($id) === 0) return null;
        $parsed_id = explode('/', parse_url($id, PHP_URL_PATH));
        if (is_string($parsed_id))
            return $parsed_id;
        if (sizeof($parsed_id) === 1)
            return $parsed_id[0];
        return $parsed_id[1];
    }

    /**
     * Given an Open Alex Author | Work object, extracts the id from the object.
     * @param $author
     * The author object to retrieve the id from;
     * @return string|null
     * The id extracted from the object ( if it is present ).
     */
    public static function parseOAIdFromObj($author): ?string {
        if (!$author) return null;
        return property_exists($author->ids, 'openalex') ?
            explode('/', parse_url($author->ids->openalex, PHP_URL_PATH))[1] :
            null;
    }

    public static function extractDoiFromUrl($url): array|string {
        return str_replace(self::$doiBaseUrl, '', $url);
    }

    public static function toDxDoiUrl($url): array|string {
        return str_replace(self::$doiBaseUrl, self::$dxBaseUrl, $url);
    }

    /**
     * Generates a DOI url using the DOI id of a work.
     * @param $doi - The DOI id to be used to generate the url.
     * @return string - The generated DOI url.
     */
    public static function formDoiUrl($doi): string {
        return self::$doiBaseUrl . $doi;
    }

    /**
     * Generates an OrcId url using a path from an OrcId api response.
     * @param string $path - The path from the OrcId api response to be used to create the url.
     * @param bool $removeTrailingSlash - A boolean indicating whether the trailing slash from the base url should be trimmed or not. ( defaults to true )
     * @return string - The generated OrcId url.
     */
    public static function formOrcIdUrl(string $path, bool $removeTrailingSlash = true): string {
        return ($removeTrailingSlash ? rtrim(self:: $orcIdBaseUrl, '/') : self:: $orcIdBaseUrl) . $path;
    }
}
