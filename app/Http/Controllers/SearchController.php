<?php

namespace App\Http\Controllers;

use App\Http\Resources\AuthorResource;
use App\Http\Resources\WorkResource;
use App\Models\Author;
use App\Models\Group;
use App\Models\Work;
use App\Utility\Requests;
use App\Utility\ULog;
use Exception;
use Illuminate\Contracts\Database\Query\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;


class SearchController extends Controller {
    /**
     * @param Request $request
     * @return Response
     */

    public function search(Request $request): Response {
        try {
            $query = $request->input('query');

            // Search authors
            $author_results = Author::searchName($query)
                ->searchOpenAlex($query)
                ->searchScopus($query)
                ->searchOrcId($query)->limit(5)
                ->get();

            // Search works
            $work_results = Work::searchTitle($query)
                ->searchDOI($query)
                ->searchOpenAlex($query)->limit(5)
                ->get();

            // Combine and return the results
            $results = [
                'query' => $query,
                'authors' => AuthorResource::collection($author_results),
                'works' => WorkResource::collection($work_results),
            ];
        } catch (Exception $error) {
            ULog::error($error->getMessage() . ", file: " . $error->getFile() . ", line: " . $error->getLine());
            return Requests::serverError('Something went wrong');
        }

        return Requests::success('Success',
            ['searchResults' => $results]);
    }

    public function searchAuthorsByIdentifiers(Request $request): JsonResponse {
        try {
            $orc_id = $request->input('orc_id');
            $open_alex = $request->input('open_alex');
            $scopus = $request->input('scopus');

            if (empty($orc_id) && empty($open_alex) && empty($scopus))
                return Requests::success('Success',
                    ['searchResults' => $results = [
                        'orc_id' => $orc_id,
                        'open_alex' => $open_alex,
                        'scopus' => $scopus,
                        'authors' => [],
                    ]]);

            $author_results = Author::when(!empty($open_alex), function (Builder $query) use ($open_alex) {
                $query->searchOpenAlex($open_alex, true);
            })->when(!empty($scopus), function (Builder $query) use ($scopus) {
                $query->searchScopus($scopus, true);
            })->when(!empty($orc_id), function (Builder $query) use ($orc_id) {
                $query->searchOrcId($orc_id, true);
            })->get();

            $results = [
                'orc_id' => $orc_id,
                'open_alex' => $open_alex,
                'scopus' => $scopus,
                'authors' => AuthorResource::collection($author_results)
            ];
        } catch (Exception $error) {
            ULog::error($error->getMessage() . ", file: " . $error->getFile() . ", line: " . $error->getLine());
            return Requests::serverError('Something went wrong', 500, ['error' => $error]);
        }

        return Requests::success('Success',
            ['searchResults' => $results]);
    }

    public function searchWhereNotInGroup(Request $request): JsonResponse {
        try {
            $query = $request->query('query');
            $group_id = $request->query('group');

            // If there's no valid group id just return an empty array.
            if (!$group_id) {
                return Requests::missingParameterError('group_id');
            }

            // Make sure to exclude the authors who are already members of that group
            $authors_to_exclude = Group::find($group_id)->members()->pluck('author_id');

            if (!$query) {
                $author_results = Author::users()->whereNotIn('id', $authors_to_exclude)->get();
            } else {
                $author_results = Author::users()->whereNotIn('id', $authors_to_exclude)->searchName($query)
                    ->searchOpenAlex($query)
                    ->searchScopus($query)
                    ->searchOrcId($query)->limit(5)
                    ->get();
            }
        } catch (Exception $error) {
            ULog::error($error->getMessage() . ", file: " . $error->getFile() . ", line: " . $error->getLine());
            return Requests::serverError('Something went wrong');
        }

        return
            Requests::success('Group retrieved successfully',
                ['searchResults' => [
                    'query' => $query,
                    'authors' => AuthorResource::collection($author_results)]
                ]);
    }
}

//public function searchUsers(Request $request): JsonResponse {
//    $query = $request->input('query');
//    $userResults = User::searchOpenAlex($query)->searchOrcId($query)->searchScopus($query)->searchName($query)->searchEmail($query)->limit(5)->get();
//
//    $results = [
//        'query' => $query,
//        'authors' => [],
//        'works' => [],
//        'users' => UserResource::collection($userResults),
//        'error' => null
//    ];
//
//    return Requests::success('Success',
//        ['searchResults' => $results]);
//}
//