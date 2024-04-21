<?php

namespace App\Http\Controllers;

use App\Http\Resources\AuthorResource;
use App\Models\{Author, Work};
use Illuminate\Http\Request;
use Inertia\{Inertia, Response};

class AuthorController extends Controller {

    public function showAuthorPage(Request $request, $id): Response {
        $author = Author::with(['statistics'])->openAlex($id)->firstOrFail();

        $orc_id_works = $author->works()->where('source', '=', Work::$orcIdSource)->count();
        $open_alex_works = $author->works()->where('source', '=', Work::$openAlexSource)->count();
        $crossref_works = $author->works()->where('source', '=', Work::$crossRefSource)->count();

        return Inertia::render('Routes/Author/AuthorPage', [
            'author' => new AuthorResource($author),
            'uniqueWorksCounts' => [Work::$openAlexSource => $open_alex_works, Work::$orcIdSource => $orc_id_works, Work::$crossRefSource => $crossref_works],
        ]);
    }
}

