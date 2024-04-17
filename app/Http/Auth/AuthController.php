<?php

namespace App\Http\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use GuzzleHttp\Exception\BadResponseException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller {

    public function index() {
        return Inertia::render('Routes/Login/Login');
    }

    public function iee(Request $request): \Symfony\Component\HttpFoundation\RedirectResponse|RedirectResponse {
        dump(Session::isStarted());
        return Socialite::driver('iee')->redirect();
    }

    public function ieeRedirect(Request $request): RedirectResponse {
        $this->login(Socialite::driver('iee')->user()->attributes);
        dump(Auth::user());
        dump(Auth::check());
        return redirect()->intended(route('Home.Page'));
    }

    public function login(array $socialiteUser): void {
        $user = null;
        try {
            // Get user and then try to log in and sent notification
            $user = User::findOrUpdate($socialiteUser);
            Auth::login($user, true);
            Auth::authenticate();
            Session::regenerate();
            Session::save();
        } catch (BadResponseException $e) {
            dump($e);
            // If an error occurs log user out and clear the session
            Auth::logout();
        }
    }
}
