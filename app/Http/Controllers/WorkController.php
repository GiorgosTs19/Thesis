<?php

namespace App\Http\Controllers;

use App\Http\Requests\WorkFilterRequest;
use App\Http\Resources\PaginatedWorkCollection;
use App\Http\Resources\WorkResource;
use App\Models\AuthorWork;
use App\Models\Type;
use App\Models\User;
use App\Models\Work;
use App\Utility\Requests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class WorkController extends Controller {
    public function index(Request $request, $id): Response {
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
        $sources = array_key_exists('sources', $params) && sizeof($params['sources']) ? $params['sources'] : [Work::$aggregateSource];
        $type_filter = array_key_exists('type_filter', $params) ? $params['type_filter'] : null;
        $work_types = array_key_exists('work_types', $params) ? $params['work_types'] : [];
        $from_pub_year = array_key_exists('from_pub_year', $params) ? $params['from_pub_year'] : null;
        $to_pub_year = array_key_exists('to_pub_year', $params) ? $params['to_pub_year'] : null;
        $min_citations = array_key_exists('min_citations', $params) ? $params['min_citations'] : null;
        $max_citations = array_key_exists('max_citations', $params) ? $params['max_citations'] : null;
        $with = array_key_exists('with', $params) ? $params['with'] : [];
        $sort_by = array_key_exists('sort_by', $params) ? $params['sort_by'] : 'title';
        $sort_direction = array_key_exists('sort_direction', $params) ? $params['sort_direction'] : 'asc';
        $filter_visibility = $params['filter_visibility'];
        // For now, always load the versions
        $with_versions = in_array('versions', $with) || in_array(Work::$aggregateSource, $sources);

        $relationships = in_array('versions', $with) ? array_diff($with, ['versions']) : $with;


        // Load the relationships that were requested
        $works_query = Work::with($relationships);
        // Check if the author_ids is set and only get the works that are associated with these authors.
        if (sizeof($authors_ids) > 0)
            $works_query = $works_query->whereHas('authors', function ($query) use ($authors_ids, $filter_visibility) {
                $query->whereIn('author_id', $authors_ids)->when($filter_visibility, function ($query) {
                    return $query->where('visibility', true);
                });
            });

        $works_query = $works_query->minCitations($min_citations)->maxCitations($max_citations)->fromPublicationYear($from_pub_year)
            ->toPublicationYear($to_pub_year)->sources($sources)->types($work_types)->customType($type_filter)->order($sort_by, $sort_direction);

        return new PaginatedWorkCollection($works_query->paginate($per_page)->appends(request()->query()), $with_versions);
    }

    public function getMetadata(Request $request) {
        $work_Types = array_map(function ($string) {
            return ucwords(str_replace('-', ' ', $string));
        }, Work::distinct()->pluck('type')->toArray());

        return ['minYear' => Work::min('publication_year'), 'maxYear' => Work::max('publication_year'),
            'minCitations' => Work::min('is_referenced_by_count'), 'maxCitations' => Work::max('is_referenced_by_count'),
            'customTypes' => Type::all(['name', 'id']),
            'workTypes' => $work_Types];
    }

    /**
     * Hides a work and its versions from an author's profile.
     * @param Request $request
     * @return JsonResponse
     */
    public function hideWork(Request $request): JsonResponse {
        if (!$request->has('id'))
            return Requests::missingParameterError('id');

        $work_id = $request->only(['id'])['id'];

        if (!$work_id) {
            return Requests::missingParameterError('id');
        }

        if (!Auth::check())
            return Requests::authenticationError();

        $author_id = User::with(['author'])->find(Auth::user()->id)->author->id;

        if (!AuthorWork::isAuthor($author_id, $work_id))
            return Requests::authorizationError();

        if (AuthorWork::hideWork($author_id, $work_id))
            return Requests::success('Works hidden successfully');

        return Requests::serverError('Something went wrong.');
    }
}
