<?php

namespace App\Http\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use GuzzleHttp\Exception\BadResponseException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller {
    public function iee(Request $request): \Symfony\Component\HttpFoundation\RedirectResponse|RedirectResponse {
        if (!$request->session()->isStarted()) {
            $request->session()->start();
        }
        return Socialite::driver('iee')->redirect();
    }

    public function ieeRedirect(Request $request): RedirectResponse {
        $this->login(Socialite::driver('iee')->user()->attributes);
        return to_route('Home.Page');
    }

    public function login(array $socialiteUser) {
        try {
            // Get user and then try to log in and sent notification
            $user = User::findOrUpdate($socialiteUser);
            Auth::login($user, true);
            session(['user' => $user]);
        } catch (BadResponseException $e) {
            // If an error occurs log user out and clear the session
            Auth::logout();
            // Depending on the error code sent the appropriate message
            if ($e->getCode() === 400) {
                return response()->json('Invalid request', $e->getCode());
            } else if ($e->getCode() === 401) {
                return response()->json('Invalid credentials', 401);
            }

            return response()->json('Something went wrong on the server.', $e->getCode());
        }
    }
}
