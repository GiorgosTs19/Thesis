<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Http;

class Controller extends BaseController {
    use AuthorizesRequests, ValidatesRequests;

    public function getArticle(Request $request, $oaurl = 'W2741809807') {
        $url = 'https://api.openalex.org/works/'.($oaurl ?? 'W2741809807');

        $response = Http::withOptions(['verify' => false])->get($url.'&mailto=it185302@it.teithe.gr');
        if($response->successful()) {
//            var_dump(json_decode($response->body()));

            // API Response Object
            $apiResponse = json_decode($response->body());

            // Article Information
            $id = $apiResponse->id;
            $doi = $apiResponse->doi;
            $title = $apiResponse->title;
            $display_name = $apiResponse->display_name;
            $publication_date = $apiResponse->publication_date;

            // Different Source IDs
            $openalex_id = $apiResponse->ids->openalex;
            $doi_id = $apiResponse->ids->doi;
            $mag_id = $apiResponse->ids->mag;

            $language = $apiResponse->language;

            // Primary Location
            $is_oa = $apiResponse->primary_location->is_oa;
            $landing_page_url = $apiResponse->primary_location->landing_page_url;
            $pdf_url = $apiResponse->primary_location->pdf_url;

            // Source
            $journal_id = $apiResponse->primary_location->source ? $apiResponse->primary_location->source->id : 'Empty Field';
            $journal_name = $apiResponse->primary_location->source ? $apiResponse->primary_location->source->display_name : 'Empty Field';
            $journal_issn = $apiResponse->primary_location->source ? $apiResponse->primary_location->source->issn[0] : 'Empty Field';
            $is_journal_oa = $apiResponse->primary_location->source ? $apiResponse->primary_location->source->is_oa : 'Empty Field';
            $is_in_doaj = $apiResponse->primary_location->source ? $apiResponse->primary_location->source->is_in_doaj : 'Empty Field';
            $host_organization = $apiResponse->primary_location->source ? $apiResponse->primary_location->source->host_organization : 'Empty Field';
            $host_organization_name = $apiResponse->primary_location->source ? $apiResponse->primary_location->source->host_organization_name : 'Empty Field';

            // License
            $license = $apiResponse->primary_location->license ?? 'Empty Field';
            $is_accepted = $apiResponse->primary_location->is_accepted ?? 'Empty Field';
            $is_published = $apiResponse->primary_location->is_published ?? 'Empty Field';

            // Article Type
            $type = $apiResponse->type;
            // Open Access
            $is_oa_status = $apiResponse->open_access->is_oa;
            $oa_url = $apiResponse->open_access->oa_url ?? 'Empty Field';
            $oa_status = $apiResponse->open_access->oa_status;
            $any_repository_has_fulltext = $apiResponse->open_access->any_repository_has_fulltext;

            return view('article', compact(
                'id',
                'doi',
                'title',
                'display_name',
                'publication_date',
                'openalex_id',
                'doi_id',
                'mag_id',
                'language',
                'is_oa',
                'landing_page_url',
                'pdf_url',
                'journal_id',
                'journal_name',
                'journal_issn',
                'is_journal_oa',
                'is_in_doaj',
                'host_organization',
                'host_organization_name',
                'license',
                'is_accepted',
                'is_published',
                'type',
                'is_oa_status',
                'oa_url',
            ));

        }
    }
}
