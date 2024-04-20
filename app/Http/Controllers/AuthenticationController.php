<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\Routing\ResponseFactory;
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
        $user = User::findOrUpdate(Socialite::driver('iee')->user()->attributes);
        Auth::login($user, true);
        return redirect(route('Success.Authentication'));
    }

    public function success(Request $request) {
        return Inertia::render('Routes/SuccessfulLogin/SuccessfulLogin', ['authenticatedUser' => new UserResource(Auth::user())]);
    }

    public function logout(Request $request): RedirectResponse {
        Auth::logout();
        return to_route('Home.Page');
    }

    public function check(Request $request): \Illuminate\Foundation\Application|Response|Application|ResponseFactory {
        return response(['check' => Auth::check(), 'user' => new UserResource(Auth::user())]);
    }
}
