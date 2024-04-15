<?php namespace App\Http\Auth;

use App\Utility\Auth;
use App\Utility\Requests;
use Laravel\Socialite\Two\AbstractProvider;
use Laravel\Socialite\Two\ProviderInterface;
use Laravel\Socialite\Two\User;

//use Str;

class IeeProvider extends AbstractProvider implements ProviderInterface {
    const STAFF_AFFILIATION_NAME = 'staff';
    /**
     * Login Iee Ihu API endpoint
     *
     * @var string
     */
    protected $apiUrl = 'api.iee.ihu.gr';

    /**
     * The scopes being requested
     *
     * @var array
     */
    protected $scopes = ['profile'];

    /**
     * Get the authentication URL for the provider.
     *
     * @param string $state
     * @return string
     */
    protected function getAuthUrl($state) {
        return $this->buildAuthUrlFromBase('https://login.iee.ihu.gr/authorization', $state);
    }

    /**
     * Get the token URL for the provider.
     *
     * @return string
     */
    protected function getTokenUrl() {
        return 'https://login.iee.ihu.gr/token';
    }

    /**
     * Get the raw user for the given access token.
     *
     * @param string $token
     * @return array
     */
    protected function getUserByToken($token): array {
        $userUrl = 'https://api.iee.ihu.gr/profile?access_token=' . $token;
        $user = Requests::getResponseBody(Requests::get($userUrl));

        return Auth::resourceToArray($user);
    }

    /**
     * Map the raw user array to a Socialite User instance.
     *
     * @param array $user
     * @return User
     */
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
