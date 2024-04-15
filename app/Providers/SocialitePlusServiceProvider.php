<?php

namespace App\Providers;

use Laravel\Socialite\SocialiteServiceProvider;
use Laravel\Socialite\SocialiteManager;

class SocialitePlusServiceProvider extends SocialiteServiceProvider {
    /**
     * Register services.
     */
    public function register(): void {
        // Register our own custom Socialite Provider
        $this->app->bind('Laravel\Socialite\Contracts\Factory', function ($app) {
            $socialiteManager = new SocialiteManager($app);

            $socialiteManager->extend('iee', function() use ($socialiteManager) {
                $config = $this->app['config']['services.iee'];

                return $socialiteManager->buildProvider(
                    'App\Auth\Social\Two\IeeProvider', $config
                );
            });
            return $socialiteManager;
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
