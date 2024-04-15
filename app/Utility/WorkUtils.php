<?php

namespace App\Utility;

use App\Http\Controllers\DOIAPI;
use App\Http\Controllers\OrcIdAPI;
use App\Models\Author;
use App\Models\AuthorWork;
use App\Models\Statistic;
use App\Models\Type;
use App\Models\Work;
use Exception;

class WorkUtils {
    const TYPES = [
        'CONFERENCE_PROCEEDINGS_WITH_REVIEWERS' => 'Papers in conference proceedings with reviewers',
        'CONFERENCE_PROCEEDINGS_WITHOUT_REVIEWERS' => 'Papers in conference proceedings without reviewers',
        'BOOKS_MONOGRAPHS' => 'Books/Monographs',
        'BOOK_REVIEW_BY_DEPARTMENT_MEMBERS' => 'Book review authored by department members',
        'SCIENTIFIC_JOURNAL_ARTICLES_WITH_REVIEWERS' => 'Articles in scientific journals with reviewers',
        'SCIENTIFIC_JOURNAL_ARTICLES_WITHOUT_REVIEWERS' => 'Articles in scientific journals without reviewers',
        'CHAPTERS_IN_COLLECTIVE_VOLUMES' => 'Chapters in collective volumes',
        'BOOK_TRANSLATIONS' => 'Book translations',
        'CONFERENCES_UNDER_THE_AEGIS_OF_THE_ACADEMIC_UNIT' => 'Conferences under the aegis of the academic unit',
        'BOOK_EDITOR' => 'Editor of scientific book',
        'JOURNAL_EDITOR' => 'Editor of scientific journal',
        'CONFERENCE_PROCEEDINGS_EDITOR' => 'Editor of conference proceedings'
    ];

    public static function createTypes(): void {
        foreach (self::TYPES as $key => $value) {
            $new_type = new Type(['name' => $value]);
            $new_type->save();
        }
    }

    const ARTICLE = 'article';
    const BOOK = 'book';
    const EDITORIAL = 'editorial';
    const CHAPTER = 'chapter';
    const CONFERENCE = 'conference';

    public static function getCustomType(string $type): int {
        if (strstr($type, self::ARTICLE)) {
            return 1;
        } elseif (strstr($type, self::BOOK)) {
            return 3;
        } elseif (strstr($type, self::EDITORIAL)) {
            return 8;
        } elseif (strstr($type, self::CHAPTER)) {
            return 7;
        } elseif (strstr($type, self::CONFERENCE)) {
            return 9;
        } else {
            return 1;
        }
    }

    public static function createAggregatedWork(Work $work): Work {
        $aggregated_work = $work->replicate();
        $aggregated_work->source = Work::$aggregateSource;
        $aggregated_work->external_id = null;
        $aggregated_work->source_url = null;
        $aggregated_work->is_referenced_by_count = null;
        $aggregated_work->type_id = self::getCustomType($aggregated_work->type);
        $aggregated_work->save();
        return $aggregated_work;
    }

    /**
     * @param $works - The works object form the ORCID response.
     * @param int $author_id - The author's id with whom the work will be associated.
     * @return void
     */
    public static function syncWorksOrcId($works, int $author_id): void {
        foreach ($works as $work) {
            $work_doi = OrcId::extractWorkDoi($work);

            $orc_id_path = OrcIdAPI::extractWorkPath($work);

            if (!$work_doi || !$orc_id_path)
                continue;

            WorkUtils::createNewOIWork($orc_id_path, $work_doi, $author_id);
            WorkUtils::createDOIWork($work_doi, $author_id);
        }
    }

    /**
     * Creates a new work from an orc id api response.
     *
     * @param string $work_path - The work's ORCID path.
     * @param string $doi - The work's doi.
     * @param int $author_id - The author's id, with whom the work will be associated.
     * @return void
     * The newly created work.
     */
    public static function createNewOIWork(string $work_path, string $doi, int $author_id): void {
        if (Work::where('doi', $doi)->source(Work::$orcIdSource)->exists())
            return;

        try {
            $orc_id_work = OrcIdAPI::workRequest($work_path);

            $new_work = new Work;
            $new_work->doi = $doi;
            $new_work->title = data_get($orc_id_work, 'title.title.value') ?? '';
            $new_work->publication_year = data_get($orc_id_work, 'publication-date.year.value');
            $new_work->source_title = data_get($orc_id_work, 'journal-title.value');
            $new_work->language = data_get($orc_id_work, 'language-code') ?? Work::$unknownLanguageCode;
            $new_work->type = property_exists($orc_id_work, 'type') ? $orc_id_work->type : 'Unknown';
            $new_work->event = null;
            $new_work->is_oa = property_exists($orc_id_work, 'visibility') && $orc_id_work->visibility === 'public';
            $new_work->external_id = $work_path;
            $new_work->source_url = $doi;
            $new_work->is_referenced_by_count = null;
            $new_work->last_updated_date = null;
            $new_work->subtype = null;
            $new_work->created_date = null;
            $new_work->type_id = self::getCustomType($new_work->type);
            $new_work->source = Work::$orcIdSource;
            $new_work->save();

            $aggregated_work = $new_work->getAggregateVersion();
            $parse_authors = false;
            if (!$aggregated_work) {
                $parse_authors = true;
                $aggregated_work = WorkUtils::createAggregatedWork($new_work);
            }


            $db_work_authors = AuthorWork::where('work_id', Work::where('doi', $doi)->source(Work::$openAlexSource)->first()?->id)->get();

            if (sizeof($db_work_authors) > 0) {
                foreach ($db_work_authors as $author_entry) {
                    $author = Author::find($author_entry->author_id)->associateToWork($new_work, $author_entry->position);
                    if ($parse_authors) $author->associateToWork($aggregated_work, $author_entry->position);
                }
            } else {
                AuthorWork::create(['author_id' => $author_id, 'work_id' => $new_work->id, 'position' => 1]);

                $authors_array = data_get($orc_id_work, 'contributors.contributor');
                $authors_string = '';
                foreach ($authors_array as $author) {
                    $authors_string .= data_get($author, 'credit-name.value') . ', ';
                }
                $authors_string = rtrim($authors_string, ',');
                $new_work->authors_string = $authors_string;
                $aggregated_work->authors_string = $authors_string;
            }
        } catch (Exception $error) {
            ULog::error($error->getMessage() . ", file: " . $error->getFile() . ", line: " . $error->getLine());
        }
    }

    /**
     * Creates a new work.
     *
     * @param $work
     * A work object straight from an OpenAlex API call response.
     * @return void
     * The newly created work.
     */
    public static function createNewOAWork($work): void {
        $work_open_access = $work->open_access;
        $work_url = $work->ids->doi ?? $work_open_access->oa_url;
        if (Work::doi($work_url)->exists())
            return;

        $new_work = new Work;
        try {
            $new_work->doi = $work_url;
            $new_work->title = $work->title ?? '';
            $new_work->publication_year = $work->publication_year;
            $new_work->is_referenced_by_count = $work->cited_by_count;
            $new_work->language = $work->language ?? Work::$unknownLanguageCode;
            $new_work->type = $work->type;
            $new_work->is_oa = $work_open_access->is_oa;
            $new_work->external_id = Ids::parseOpenAlexId($work->ids->openalex);
            $new_work->source_url = $work->ids->openalex;
            $new_work->last_updated_date = $work->updated_date;
            $new_work->created_date = $work->created_date;
            $new_work->type_id = self::getCustomType($new_work->type);
            $new_work->source = Work::$openAlexSource;
            $new_work->save();


            // Generate the counts_by_year statics for the work
            Statistic::generateStatistics($new_work->id, $work->counts_by_year, Work::class);

            // Associate all authors from the array with the work being processed
            $new_work->parseAuthors($work->authorships);

            // Create a new "aggregated" work that will include information from all the available sources.
            // Associate the "aggregated" version of the work with the same authors.
            WorkUtils::createAggregatedWork($new_work)->parseAuthors($work->authorships);

        //  Disable the generation of Concepts since they are not to be used in the upcoming release.
        //  $new_work->generateConcepts($work->concepts);
        } catch (Exception $error) {
            ULog::error($error->getMessage() . ", file: " . $error->getFile() . ", line: " . $error->getLine());
        }
    }


    /**
     * @param string $doi - The doi identifier of the object to retrieve its information from Crossref
     * @param int $author_id - The author with whom the work will be associated.
     * @return Work|null - The newly created work if doi was defined and the work was successfully created, otherwise null.
     */
    public static function createDOIWork(string $doi, int $author_id): ?Work {
        $doi_object = DOIAPI::doiRequest($doi);

        if (!$doi_object)
            return null;

        $new_work = new Work();
        $new_work->doi = $doi;
        $new_work->title = $doi_object->title;
        $new_work->type = $doi_object->type;
        $new_work->publication_year = null;
        $new_work->source_title = null;
        $new_work->source_url = Ids::toDxDoiUrl($doi);
        $new_work->external_id = Ids::extractDoiFromUrl($doi);
        $new_work->is_oa = false;
        $new_work->language = $doi_object->language ?? Work::$unknownLanguageCode;
        $new_work->abstract = isset($doi_object->abstract) ? (string)simplexml_load_string($doi_object->abstract, null, LIBXML_NOERROR, 'jats', true) : null;
        $new_work->subtype = $doi_object->type ?? null;
        $new_work->event = $doi_object->event ?? null;
        $new_work->type_id = self::getCustomType($new_work->type);
        $new_work->is_referenced_by_count = data_get($doi_object, 'is-referenced-by-count') ?? null;
        $new_work->source = Work::$crossRefSource;
        $new_work = self::parseCRefAuthors($doi_object, $new_work);
        $new_work->save();
        AuthorWork::create(['author_id' => $author_id, 'work_id' => $new_work->id, 'position' => 1]);

        $aggregated_work = $new_work->getAggregateVersion();
        $aggregated_work->abstract = isset($doi_object->abstract) ? (string)simplexml_load_string($doi_object->abstract, null, LIBXML_NOERROR, 'jats', true) : null;
        $aggregated_work->subtype = $doi_object->type ?? null;
        $aggregated_work->save();

        return $new_work;
    }

    public static function parseCRefAuthors($doi_object, $work) {
        $authors_string = '';
        if (!property_exists($doi_object, 'author')) {
            $work->authors_string = 'Authors not available for this version of the work.';
            return $work;
        }

        foreach ($doi_object->author as $author) {
            $authors_string .= $author->given . ' ' . $author->family . ', ';
        }
        $authors_string = rtrim($authors_string, ',');
        $work->authors_string = $authors_string;
        return $work;

    }

    public static function getDynamicTypes(int $threshold = 3) {
        $works_by_type = Work::countByType()->get();

        $total_works = $works_by_type->sum('count');

        // Filter types based on the threshold percentage
        $filtered_types = $works_by_type->filter(function ($type) use ($total_works, $threshold) {
            return ($type->count / $total_works) * 100 >= $threshold;
        });

        // Sum the count of types that do not pass the threshold
        $other_count = $works_by_type->whereNotIn('type', $filtered_types->pluck('type')->toArray())->sum('count');

        // Create a new collection with the filtered types and 'Other'
        $filtered_types->push(['type' => 'Other', 'count' => $other_count]);

        return $filtered_types;
    }
}
