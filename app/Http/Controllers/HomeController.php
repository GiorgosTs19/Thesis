<?php

namespace App\Http\Controllers;

use App\Http\Resources\AuthorResource;
use App\Http\Resources\WorkResource;
use App\Models\Author;
use App\Models\Work;
use App\Utility\WorkUtils;
use Illuminate\Http\Request;
use Inertia\{Inertia, Response};

class HomeController extends Controller {

    public function showHomePage(Request $request): Response {
        $most_cites_users = AuthorResource::collection(Author::mostCitations(5)->user()->get());
        $most_works_users = AuthorResource::collection(Author::mostWorks(5)->user()->get());
        $most_cites_works = WorkResource::collection(Work::with('authors')->source(Work::$openAlexSource)->mostCitations(5));
        $works_by_type = WorkUtils::getDynamicTypes();
        $authors_count = Author::all()->count();
        $works_by_type = [['type' => 'Author', 'count' => $authors_count], ...$works_by_type];
        return Inertia::render('Routes/Home/HomePage', ['mostCitationsUsers' => $most_cites_users,
            'mostWorksUsers' => $most_works_users, 'mostCitationsWorks' => $most_cites_works, 'worksByType' => $works_by_type]);
    }
}
