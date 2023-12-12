<?php

namespace App\Http\Controllers;

use App\Http\Resources\AuthorResource;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use function App\Providers\rocketDump;

class SignUpController extends Controller {
    /**
     * @param Request $request
     * @return Response
     */
    public function checkAuthorExists(Request $request): Response {
        $input = $request->only(['authorId','id_type']);
        $author_id = 'A'.$input['authorId'];
        $id_type = $input['id_type'];
        $author = APIController::authorRequest($author_id, $id_type);
        $author_exists = !is_null($author);
        return Inertia::render('Sign Up/SignUp',['author' => $author_exists ? $author : null,
            'exists' => $author_exists,]);
    }
}
