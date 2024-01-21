<?php

namespace App\Http\Controllers;

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
            ->searchOrcId($query)
            ->get();

        // Search works
        $workResults = Work::searchTitle($query)
            ->searchDOI($query)
            ->searchOpenAlex($query)
            ->get();

        // Combine and return the results
        $results = [
            'query' => $query,
            'authors' => $authorResults,
            'works' => $workResults,
        ];

        return redirect()->back()->with(['searchResults' => $results]);
    }
}
