<?php

namespace App\Utility;

class OrcId {

    /**
     * Extracts, parses and returns the doi url from a work object from an OrcId api response, if doi is defined.
     *
     * @param $work - The work object from the OrcId api response.
     * @return string|null - The doi url if doi is defined, otherwise null.
     */
    public static function extractWorkDoi($work): ?string {
        $work_doi_object = collect(data_get($work, 'external-ids'))->filter(function ($item) {
            if (is_null($item) || sizeof($item) === 0)
                return false;
            return data_get($item[0], 'external-id-type') === 'doi';
        })->first();

        if (!$work_doi_object)
            return null;

        $work_doi_parsed = data_get($work_doi_object[0], 'external-id-value');

        if (!$work_doi_parsed)
            return null;

        return Ids::formDoiUrl($work_doi_parsed);
    }
}