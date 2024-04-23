<?php

namespace App\Http\Controllers;

use App\Http\Resources\AuthorResource;
use App\Http\Resources\WorkCollection;
use App\Models\Author;
use App\Models\Work;
use Inertia\{Inertia, Response};

class HomeController extends Controller {

    public function showHomePage(): Response {
        $most_cites_users = AuthorResource::collection(Author::mostCitations(5)->user()->get());
        $most_works_users = AuthorResource::collection(Author::mostWorks(5)->user()->get());
        $most_cites_works = new WorkCollection(Work::with('authors')->source(Work::$openAlexSource)->mostCitations(5));
        return Inertia::render('Routes/Home/HomePage', ['mostCitationsUsers' => $most_cites_users,
            'mostWorksUsers' => $most_works_users, 'mostCitationsWorks' => $most_cites_works,]);
    }
}
