<?php

namespace App\Http\Controllers;

use App\Utility\Ids;
use App\Utility\Requests;
use Illuminate\Support\Facades\Config;
use stdClass;

class OrcIdAPI {
    const WORK_ASSET = 'WORK';
    const AUTHOR_ASSET = 'AUTHOR';
    private static string $BASE_URL;
    private static string $ACCEPT_JSON;
    private static array $AUTHOR_FIELDS;

    public static function init(): void {
        self::$BASE_URL = Config::get('orcId.base_url');
        self::$ACCEPT_JSON = Config::get('orcId.accept_json');
        self::$AUTHOR_FIELDS = Config::get('orcId.author_fields');
    }

    /**
     * @param $orcId_id - The OrcId id of the author
     * @return stdClass|null
     * The author's works assets ( if the id provided is valid and present in OrcId's database )
     */
    public static function authorRequest($orcId_id): ?stdClass {
        $url = self::$BASE_URL . $orcId_id;
        return self::extractFields(Requests::getResponseBody(Requests::get($url, ['Accept' => self::$ACCEPT_JSON])),
            self::AUTHOR_ASSET);
    }

    /**
     * @param $path - The OrcId path to the work.
     * @return mixed
     * The work asset ( if the path provided is valid and present in OrcId's database )
     */
    public static function workRequest($path): mixed {
        return Requests::getResponseBody(Requests::get(Ids::formOrcIdUrl($path), ['Accept' => self::$ACCEPT_JSON]));
    }

    /**
     * @param $response - The api response.
     * @param $asset_type - The type of asset response passed to the function ( Author, Work )
     * @return stdClass|null - A new object containing only the required properties ( extracted from the response object )
     */
    private static function extractFields($response, $asset_type): ?stdClass {
        return match ($asset_type) {
            self::AUTHOR_ASSET => !$response ? null :
                self::createStdClassFromArray(self::$AUTHOR_FIELDS, $response)
        };
    }

    /**
     * @param array $properties - The array of properties to extract from the source object.
     * An associative array of key=>value pairs, the keys being the names of the properties for the new object,
     * and the values being the dot notation paths to the source object's properties.
     * @param stdClass $sourceObject - The source object to extract the required properties and map them to a new object.
     * @return stdClass - The newly created object containing the properties extracted from the source object.
     */
    private static function createStdClassFromArray(array $properties, stdClass $sourceObject): stdClass {
        $newObject = new stdClass();
        foreach ($properties as $propertyName => $propertyPath) {
            $newObject->$propertyName = data_get($sourceObject, $propertyPath);
        }
        return $newObject;
    }
}

