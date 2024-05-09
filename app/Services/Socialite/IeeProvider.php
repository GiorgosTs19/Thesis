<?php

namespace App\Services\Socialite;

use App\Utility\Auth;
use App\Utility\Requests;
use Laravel\Socialite\Two\AbstractProvider;
use Laravel\Socialite\Two\ProviderInterface;
use Laravel\Socialite\Two\User;

class IeeProvider extends AbstractProvider implements ProviderInterface {
    const STAFF_AFFILIATION_NAME = 'staff';
    protected $scopes = ['profile']; // Define the scopes required by your OAuth provider

    protected function getAuthUrl($state): string {
        return $this->buildAuthUrlFromBase(env('AUTHORIZATION_URL'), $state);
    }

    protected function getTokenUrl(): string {
        return env('TOKEN_BASE_URL');
    }

    protected function getUserByToken($token): array {
        $user_url = env('IEE_PROFILE_URL') . $token;
        $user = Requests::getResponseBody(Requests::get($user_url));
        return Auth::resourceToArray($user);
    }

    protected function mapUserToObject(array $user): User {
        return (new User())->setRaw($user)->map([
            'id' => $user['id'],
            'first_name' => $user['first_name'],
            'last_name' => $user['last_name'],
            'email' => $user['email'],
            'display_name' => $user['display_name'],
            'is_staff' => $user['role'] === self::STAFF_AFFILIATION_NAME,
        ]);
    }
}
