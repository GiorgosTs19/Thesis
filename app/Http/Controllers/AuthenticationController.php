<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\Author;
use App\Models\User;
use App\Utility\Requests;
use App\Utility\ULog;
use Exception;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Routing\Redirector;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Laravel\Socialite\Facades\Socialite;

class AuthenticationController extends Controller {
    public function toIEELogin(): \Symfony\Component\HttpFoundation\RedirectResponse|RedirectResponse {
        return Socialite::driver('iee')->redirect();
    }

    public function handleIEECallback(): \Illuminate\Foundation\Application|Redirector|RedirectResponse|Application {
        $user = User::createOrUpdate(Socialite::driver('iee')->user()->attributes);
        Auth::login($user, true);
        if ($user->missingAllIdentifiers() && !$user->isAdmin())
            return redirect(route('Auth.Verify.Author'));
        return redirect(route('Success.Authentication'));
    }

    public function success(Request $request) {
        return Inertia::render('Routes/SuccessfulLogin/SuccessfulLogin', ['authenticatedUser' => new UserResource(Auth::user())]);
    }

    public function logout(Request $request) {
        try {
            Auth::logout();
        } catch (Exception $error) {
            ULog::error($error->getMessage() . ", file: " . $error->getFile() . ", line: " . $error->getLine());
            return Requests::serverError('Something went wrong while trying to log you out.');
        }
        return to_route('Home.Page');
//        return Requests::success('Successfully logged out');
    }

    public function check(Request $request): \Illuminate\Foundation\Application|Response|Application|ResponseFactory {
        return response(['check' => Auth::check(), 'user' => Auth::check() ? new UserResource(User::with('author')->find(Auth::user()->id)) : null]);
    }

    public function showUserIdentifiers(Request $request) {
        return Inertia::render('Routes/SuccessfulLogin/VerifyAuthorIdentifiers');
    }

    public function claimAuthor(Request $request): RedirectResponse|JsonResponse {
        $author_id = $request->input(['id']);
        if (!$author_id) {
            return Requests::missingParameterError('id');
        }

        if (!Auth::check()) {
            return Requests::authenticationError();
        }

        $user = User::with('author')->find(Auth::user()->id);
        $author = Author::find($author_id);

        if (!$author) {
            return Requests::clientError('No author with this id exists.');
        }

        if (!$user->isStaff()) {
            return Requests::authorizationError();
        }

        if ($user->author) {
            return Requests::authorizationError('This user is already associated with an author.');
        }

        $user->orc_id = $author->orc_id;
        $user->open_alex_id = $author->open_alex_id;
        $user->scopus_id = $author->scopus_id;
        $user->author_id = $author_id;
        $user->save();

        return to_route('Author.Page', ['id' => $author->open_alex_id]);
    }
}
