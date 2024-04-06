<?php

namespace App\Http\Controllers;

use App\Http\Requests\WorkFilterRequest;
use App\Http\Resources\PaginatedWorkCollection;
use App\Http\Resources\WorkResource;
use App\Models\Work;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WorkController extends Controller {
    public function showWorkPage(Request $request, $id): Response {
        $work = Work::with(['authors', 'statistics'])->find($id);

        return Inertia::render('Routes/Work/WorkPage', [
            'work' => new WorkResource($work),
            'workVersions' => WorkResource::collection($work->versions())
        ]);
    }

    /**
     * Params : author_ids - Array of author ids to filter works by authorships,
     * sources - Array of source strings to filter works by their source,
     * from_pub_year, to_pub_year - Numbers used to filter works by their publication year,
     * min_citations, max_citations - Numbers used to filter works by their citations count,
     * work_types - Array of type strings to filter works by their type ( journals, articles, etc. )
     * type_filter - Array of custom_types ids to filter works by their custom type,
     * with_versions - A boolean to indicate whether the works should also have their versions loaded.
     * @param WorkFilterRequest $request
     * @return PaginatedWorkCollection
     */
    public function filterWorks(WorkFilterRequest $request): PaginatedWorkCollection {
        $params = $request->safe()->all();
        $per_page = array_key_exists('per_page', $params) ? $params['per_page'] : 10;
        $authors_ids = array_key_exists('author_ids', $params) ? $params['author_ids'] : [];
        $sources = array_key_exists('sources', $params) ? $params['sources'] : [];
        $type_filters = array_key_exists('type_filters', $params) ? $params['type_filters'] : [];
        $work_types = array_key_exists('work_types', $params) ? $params['work_types'] : [];
        $from_pub_year = array_key_exists('from_pub_year', $params) ? $params['from_pub_year'] : null;
        $to_pub_year = array_key_exists('to_pub_year', $params) ? $params['to_pub_year'] : null;
        $min_citations = array_key_exists('min_citations', $params) ? $params['min_citations'] : null;
        $max_citations = array_key_exists('max_citations', $params) ? $params['max_citations'] : null;
        $with_versions = array_key_exists('with_versions', $params) ? $params['with_versions'] : false;
        $sort_by = array_key_exists('sort_by', $params) ? $params['sort_by'] : 'id';
        $sort_direction = array_key_exists('sort_direction', $params) ? $params['sort_direction'] : 'asc';

        $works_query = Work::with(['authors']);
        // Check if the author_ids is set and only get the works that are authored by these authors.
        if (sizeof($authors_ids) > 0)
            $works_query = $works_query->whereHas('authors', function ($query) use ($authors_ids) {
                $query->whereIn('author_id', $authors_ids);
            });

        $works_query = $works_query->minCitations($min_citations)->maxCitations($max_citations)->fromPublicationYear($from_pub_year)
            ->toPublicationYear($to_pub_year)->sources($sources)->types($work_types)->customTypes($type_filters)->order($sort_by, $sort_direction);

        return new PaginatedWorkCollection($works_query->paginate($per_page), $with_versions);
    }
}
