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
use App\Utility\ULog;
use Exception;
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
     * Filters works based on various criteria provided in the request.
     *
     * @param WorkFilterRequest $request The request object containing filter criteria.
     *
     * @param array $author_ids An array of author IDs to filter works by authorship.
     * @param array $sources An array of source strings to filter works by their source.
     * @param int $from_pub_year The starting publication year to filter works by.
     * @param int $to_pub_year The ending publication year to filter works by.
     * @param int $min_citations The minimum number of citations to filter works by.
     * @param int $max_citations The maximum number of citations to filter works by.
     * @param array $work_types An array of type strings to filter works by their type (journals, articles, etc.).
     * @param array $type_filter An array of custom type IDs to filter works by their custom type.
     * @param bool $with_versions Indicates whether to include work versions in the results.
     * @param string $sort_by The attribute to sort the results by.
     * @param string $sort_direction The direction to sort the results in ('asc' or 'desc').
     * @param bool $filter_visibility Filter works based on their visibility status.
     *
     * @return PaginatedWorkCollection|JsonResponse
     */
    public function filterWorks(WorkFilterRequest $request) {
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

        try {
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
        } catch (Exception $error) {
            ULog::error($error->getMessage() . ", file: " . $error->getFile() . ", line: " . $error->getLine());
            return Requests::serverError("Something went wrong");
        }
    }

    /**
     * Retrieves metadata related to works, including min/max publication year,
     * min/max citations, custom types, and work types.
     *
     * @param Request $request The request object.
     *
     * @return array|JsonResponse
     * @return int $minYear The minimum publication year of works.
     * @return int $maxYear The maximum publication year of works.
     * @return int $minCitations The minimum number of citations a work has received.
     * @return int $maxCitations The maximum number of citations a work has received.
     * @return array $customTypes An array of custom types with their names and IDs.
     * @return array $workTypes An array of distinct work types.
     */
    public function getMetadata(Request $request) {
        try {
            $work_Types = array_map(function ($string) {
                return ucwords(str_replace('-', ' ', $string));
            }, Work::distinct()->pluck('type')->toArray());

            return ['minYear' => Work::min('publication_year'), 'maxYear' => Work::max('publication_year'),
                'minCitations' => Work::min('is_referenced_by_count'), 'maxCitations' => Work::max('is_referenced_by_count'),
                'customTypes' => Type::all(['name', 'id']),
                'workTypes' => $work_Types];
        } catch (Exception $error) {
            ULog::error($error->getMessage() . ", file: " . $error->getFile() . ", line: " . $error->getLine());
            return Requests::serverError('Something went wrong.');
        }
    }

    /**
     * Toggles the visibility of a work and its versions for an author's profile.
     *
     * @param Request $request The request object containing the work ID and visibility status.
     *
     * @param int $id The ID of the work to toggle visibility for.
     * @param bool $visibility The visibility status to set for the work (true or false).
     *
     * @return JsonResponse A JSON response indicating the result of the operation.
     */
    public function toggleWorkVisibility(Request $request): JsonResponse {
        if (!$request->has('id'))
            return Requests::missingParameterError('id');
        if (!$request->has('visibility')) {
            return Requests::missingParameterError('visibility');
        }

        $work_id = $request->only(['id'])['id'];
        $visibility = $request->only(['visibility'])['visibility'];

        if (empty($work_id)) {
            return Requests::missingParameterError('id');
        }

        if (is_null($visibility)) {
            return Requests::missingParameterError('visibility');
        }

        if (!Auth::check())
            return Requests::authenticationError();

        $author_id = User::with(['author'])->find(Auth::user()->id)->author->id;

        if (!AuthorWork::isAuthor($author_id, $work_id))
            return Requests::authorizationError();

        if (AuthorWork::toggleWorkVisibility($author_id, $work_id, $visibility))
            return Requests::success('Operation successful.');

        return Requests::serverError('Something went wrong.');
    }

    /**
     * Retrieves hidden works for the authenticated author.
     *
     * @param Request $request The request object.
     *
     * @return JsonResponse A JSON response containing a paginated collection of hidden works.
     */
    public function getHiddenAuthorWorks(Request $request): JsonResponse {
        if (!Auth::check()) {
            return Requests::authenticationError();
        }

        $user = User::with('author')->find(Auth::user()->id);

        if (!$user->author) {
            return Requests::authorizationError();
        }

        try {
            return Requests::success('Hidden Works retrieved successfully', ['works' =>
                new PaginatedWorkCollection(Work::source(Work::$aggregateSource)->whereHas('authors', function ($query) use ($user) {
                    $query->where('author_id', $user->author->id)->where('visibility', false);
                })->paginate(10))]);
        } catch (Exception $error) {
            ULog::error($error->getMessage() . ", file: " . $error->getFile() . ", line: " . $error->getLine());
            return Requests::serverError('Something went wrong.');
        }
    }
}
