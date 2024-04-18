<?php

namespace App\Providers;

// use Illuminate\Support\Facades\Gate;
use App\Models\Group;
use App\Policies\GroupPolicy;
use App\Services\Socialite\IeeProvider;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider {
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Group::class => GroupPolicy::class
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void {
        $this->socialiteIeeServiceProvider();
    }

    private function socialiteIeeServiceProvider(): void {
        $socialite = $this->app->make('Laravel\Socialite\Contracts\Factory');
        $socialite->extend(
            'iee',
            function ($app) use ($socialite) {
                $config = $app['config']['services.iee'];
                return $socialite->buildProvider(IeeProvider::class, $config);
            }
        );
    }
}
