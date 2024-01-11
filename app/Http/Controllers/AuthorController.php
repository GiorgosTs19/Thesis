<?php

namespace App\Http\Controllers;

use App\Http\Resources\AuthorResource;
use App\Models\Author;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuthorController extends Controller {

    public function showAuthorPage(Request $request, $id) {
        $author = Author::with(['works.authors', 'statistics'])->openAlex($id)->first();
        if(!$author)
            return '404';
        // TODO Implement a 404 error page to show in case an asset is not found.


        return Inertia::render('Author/Author',['author'=>new AuthorResource($author)]);
    }
}

