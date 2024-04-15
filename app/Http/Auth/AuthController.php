<?php

namespace App\Http\Auth;

use App\Http\Controllers\Controller;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller {
    public function iee(): \Symfony\Component\HttpFoundation\RedirectResponse|\Illuminate\Http\RedirectResponse{
        return Socialite::driver('iee')->redirect();
    }

    public function ieeRedirect() {
        dump(Socialite::driver('iee')->stateless()->user());
        return Socialite::driver('iee')->stateless()->user();
    }
}
