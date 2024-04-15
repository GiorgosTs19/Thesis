<?php namespace App\Http\Auth;

use App\Models\User;
use App\Utility\Requests;
use App\Utility\ULog;
use Laravel\Socialite\Two\AbstractProvider;
use Laravel\Socialite\Two\ProviderInterface;
//use Str;

class IeeProvider extends AbstractProvider implements ProviderInterface  {
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
     * @param  string $state
     * @return string
     */
    protected function getAuthUrl($state)
    {
        return $this->buildAuthUrlFromBase('https://login.iee.ihu.gr/authorization', $state);
    }

    /**
     * Get the token URL for the provider.
     *
     * @return string
     */
    protected function getTokenUrl()
    {
        return 'https://login.iee.ihu.gr/token';
    }

    /**
     * Get the raw user for the given access token.
     *
     * @param  string $token
     * @return array
     */
    protected function getUserByToken($token) {

        $userUrl = 'https://api.iee.ihu.gr/profile?access_token=' . $token;
        $response = Requests::getResponseBody(Requests::get($userUrl));
//        dd($response,1);

//        $user = $response;

//        return $response;
    }

    /**
     * Map the raw user array to a Socialite User instance.
     *
     * @param array $user
     * @return \Laravel\Socialite\Two\User|User
     */
    protected function mapUserToObject(array $user): \Laravel\Socialite\Two\User|User{
        dump($user);
        return User::findOrUpdate($user);
    }
}
