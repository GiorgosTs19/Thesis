<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Laravel\Socialite\Facades\Socialite;

class AuthenticationController extends Controller {
    public function toIEELogin(): \Symfony\Component\HttpFoundation\RedirectResponse|RedirectResponse {
        return Socialite::driver('iee')->redirect();
    }

    public function handleIEECallback(): \Illuminate\Foundation\Application|Redirector|RedirectResponse|Application {
        Auth::login(User::findOrUpdate(Socialite::driver('iee')->user()->attributes));
        Session::save();
        return redirect(route('Home.Page'))->with(['user' => 'rtrw']);
    }
}
