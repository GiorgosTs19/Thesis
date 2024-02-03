<?php

namespace App\Http\Controllers;

use App\Http\Resources\AuthorResource;
use App\Http\Resources\UserResource;
use App\Http\Resources\WorkResource;
use App\Models\Author;
use App\Models\Group;
use App\Models\User;
use App\Models\Work;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;


class SearchController extends Controller {
    /**
     * @param Request $request
     * @return Response
     */

    public function search(Request $request): Response {
        $query = $request->input('query');

        // Search authors
        $authorResults = Author::searchName($query)
            ->searchOpenAlex($query)
            ->searchScopus($query)
            ->searchOrcId($query)->limit(5)
            ->get();

        // Search works
        $workResults = Work::searchTitle($query)
            ->searchDOI($query)
            ->searchOpenAlex($query)->limit(5)
            ->get();

        // Combine and return the results
        $results = [
            'query' => $query,
            'authors' => AuthorResource::collection($authorResults),
            'works' => WorkResource::collection($workResults),
            'users' => [],
            'error' => null
        ];

        return redirect()->back()->with(['searchResults' => $results]);
    }

    public function searchUsers(Request $request): RedirectResponse {
        $query = $request->input('query');
        $userResults = User::searchOpenAlex($query)->searchOrcId($query)->searchScopus($query)->searchName($query)->searchEmail($query)->limit(5)->get();

        $results = [
            'query' => $query,
            'authors' => [],
            'works' => [],
            'users' => UserResource::collection($userResults),
            'error' => null
        ];

        return redirect()->back()->with(['searchResults' => $results]);
    }

    public function searchAuthorUsers(Request $request): RedirectResponse {
        $query = $request->input('query');

        $authorResults = Author::user()->searchName($query)
            ->searchOpenAlex($query)
            ->searchScopus($query)
            ->searchOrcId($query)->limit(5)
            ->get();

        $results = [
            'query' => $query,
            'authors' => AuthorResource::collection($authorResults),
            'works' => [],
            'users' => [],
            'error' => null
        ];

        return redirect()->back()->with(['searchResults' => $results]);
    }

    public function searchWhereNotInGroup(Request $request): RedirectResponse {
        $query = $request->input('query');
        $group_id = $request->input('group');

        // If there's no valid group id just return an empty array.
        if (!$group_id) {
            return redirect()->back()->with(['searchResults' => [
                'query' => $query,
                'authors' => [],
                'works' => [],
                'users' => [],
                'error' => 'The group id parameter is'
            ]]);
        }

        // Make sure to exclude the authors who are already members of that group
        $authors_to_exclude = Group::find($group_id)->members()->pluck('author_id');

        $authorResults = Author::user()->whereNotIn('id', $authors_to_exclude)->searchName($query)
            ->searchOpenAlex($query)
            ->searchScopus($query)
            ->searchOrcId($query)->limit(5)
            ->get();

        $results = [
            'query' => $query,
            'authors' => AuthorResource::collection($authorResults),
            'works' => [],
            'users' => [],
            'error' => null
        ];

        return redirect()->back()->with(['searchResults' => $results]);
    }


}
