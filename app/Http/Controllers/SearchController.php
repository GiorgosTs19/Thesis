<?php

namespace App\Http\Controllers;

use App\Http\Resources\AuthorResource;
use App\Http\Resources\WorkResource;
use App\Models\Author;
use App\Models\Work;
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
        ];

        return redirect()->back()->with(['searchResults' => $results]);
    }
}
