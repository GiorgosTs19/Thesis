<?php

namespace App\Http\Controllers;

use App\Http\Resources\AuthorResource;
use App\Http\Resources\WorkResource;
use App\Models\Author;
use App\Models\Work;
use Illuminate\Http\Request;
use Inertia\{Inertia, Response};

class HomeController extends Controller {

    public function showHomePage(Request $request): Response {
        $most_works_authors = AuthorResource::collection(Author::mostWorks(5)->get());
        $most_works_users = AuthorResource::collection(Author::mostWorks(5)->user()->get());
        $most_citations_works = WorkResource::collection(Work::with('authors')->mostCitations(6));
        $works_by_type = Work::getDynamicTypesList();
        $authors_count = Author::all()->count();
        $works_by_type = [['type' => 'Author', 'count' => $authors_count], ...$works_by_type];
        return Inertia::render('Routes/Home/HomePage', ['mostWorksAuthors' => $most_works_authors,
            'mostWorksUsers' => $most_works_users, 'mostCitationsWorks' => $most_citations_works, 'worksByType' => $works_by_type]);
    }
}
