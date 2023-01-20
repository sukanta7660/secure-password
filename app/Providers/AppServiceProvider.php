<?php

namespace App\Providers;

use App\Services\EnvService;
use App\Services\WebHook\Hooks;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(EnvService::class, EnvService::class);
        $this->app->singleton(Hooks::class, Hooks::class);
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Paginator::useBootstrapFive();
    }
}
