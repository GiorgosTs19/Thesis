<?php

namespace App\Http\Controllers;

use App\Http\Resources\AuthorResource;
use App\Http\Resources\WorkResource;
use App\Models\Author;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuthorController extends Controller {

    public function showAuthorPage(Request $request, $id) {
        $author = Author::with(['works.authors', 'statistics'])->openAlex($id)->first();
        if(!$author)
            abort(404);

        $works = $author->works()->with('authors')->paginate(9);

        return Inertia::render('Author/AuthorPage',['author'=>new AuthorResource($author),'works' => WorkResource::collection($works)]);
    }
}

