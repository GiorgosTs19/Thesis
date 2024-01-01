<?php

namespace App\Utility;

use App\Models\Author;

class Ids {
    const OrcId = 'orc_id';
    const OpenAlex = 'open_alex';
    const Scopus = 'scopus';
    const OrcId_Id = 'orc_id';
    const OpenAlex_Id = 'open_alex_id';
    const Scopus_Id = 'scopus_id';

    const OrcIdFilterPrefix = 'orcid:';
    const ScopusFilterPrefix = 'scopus:';

    /**
     * @param $id
     * @return string
     */
    public static function getIdType($id): string {
        // If the id contains '-', then OrcId id is used.
        if(str_contains($id, '-'))
            return self::OrcId;
        // If the id starts/contains 'A' or 'W', then OpenAlex id is used.
        elseif (str_starts_with($id, 'A') || str_starts_with($id, 'W') )
            return self::OpenAlex;
        // If the id is just numbers, then scopus is used.
        else return self::Scopus;
    }

    /**
     * @param $author
     * The author object to extract the ids from
     * @param string $asset_type
     * The type of the asset's origin ( OpenAlex api request => 'request', Local database => 'database' )
     * @return array
     * Am associative array of the ids extracted and parsed from the author object. This array can contain null values.
     */
    public static function extractIds($author, string $asset_type = Requests::Request_Asset): array {
        return match ($asset_type){
            Requests::Request_Asset =>
            [
                self::Scopus_Id =>property_exists($author,self::Scopus) ? self::parseScopusId($author->scopus) : null,
                self::OrcId_Id => property_exists($author,self::OrcId) ? self::parseOrcId($author->orcid) : null,
                self::OpenAlex_Id =>self::parseOpenAlexId($author->id)
            ],

            Requests::Database_Asset =>
            [
                self::Scopus_Id => property_exists($author,self::Scopus_Id) ? $author->scopus_id : null,
                self::OrcId_Id => property_exists($author,self::OrcId_Id) ? $author->orc_id : null,
                self::OpenAlex_Id => property_exists($author,self::OpenAlex_Id) ? $author->open_alex_id : null
            ]
        };
    }

    /**
     * @param $id
     * The id to be parsed
     * @return string|null
     * The parsed id.
     */
    public static function parseScopusId($id): ?string {
        if(strlen($id) === 0)
            return null;
        $parsed_id = explode('=', explode('&',$id)[0]);
        if(!is_array($parsed_id))
            return $parsed_id;
        if(sizeof($parsed_id) === 1)
            return $parsed_id[0];
        return $parsed_id[1];
    }

    /**
     * @param $id
     * The id to be parsed.
     * @return string|null
     */
    public static function parseOrcId($id): ?string {
        if(strlen($id) === 0) return null;
        $parsed_id = explode('/', parse_url($id, PHP_URL_PATH));
        if(!is_array($parsed_id))
            return $parsed_id;
        if(sizeof($parsed_id) === 1)
            return $parsed_id[0];
        return $parsed_id[1];
    }

    /**
     * @param $author
     * The author object to retrieve the id from.
     * @return string|null
     */
    public static function parseScopusIdFromObj($author): ?string {
        if(!$author) return null;
        return property_exists($author->ids, 'scopus')
            ? explode('=', explode('&',$author->ids->scopus)[0])[1]
            : null;
    }

    /**
     * @param $author
     * The author object to retrieve the id from.
     * @return string|null
     */

    public static function parseOrcIdFromObj($author): ?string {
        if(!$author) return null;
        return property_exists($author->ids, 'orcid')
            ? explode('/', parse_url($author->ids->orcid, PHP_URL_PATH))[1]
            : null;
    }

    /**
     * Given an Open Alex Author | Work url, extracts the id from the url.
     * @param $id
     * The id to be parsed
     * @return string|null
     * The id extracted from the url.
     */
    public static function parseOpenAlexId($id): ?string {
        if(strlen($id) === 0) return null;
        $parsed_id = explode('/', parse_url($id, PHP_URL_PATH));
        if(!is_array($parsed_id))
            return $parsed_id;
        if(sizeof($parsed_id) === 1)
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
    public static function parseOpenAlexIdFromObj($author): ?string {
        if(!$author) return null;
        return property_exists($author->ids, 'openalex') ?
            explode('/', parse_url($author->ids->openalex, PHP_URL_PATH))[1] :
            null;
    }
}
