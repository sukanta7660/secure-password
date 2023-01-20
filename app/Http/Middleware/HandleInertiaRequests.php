<?php

namespace App\Http\Middleware;

use App\Helper\FrontEndHelper;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tightenco\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    public function version(Request $request)
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function share(Request $request)
    {
        return array_merge(parent::share($request), [
            'search' => $request->search,
            'auth' => [
                'user' => $request->user(),
            ],
            'sidebar_navigation' => FrontEndHelper::getSidebarNavigation(),

            'toast' => $this->getToast(),
            'ziggy' => function () use ($request) {
                return array_merge((new Ziggy)->toArray(), [
                    'location' => $request->url(),
                ]);
            },
        ]);
    }

    public function getToast(): ?array
    {
        if (session()->has('toast.message')) {
            return [
                'message' => session()->get('toast.message'),
                'type' => session()->get('toast.type'),
            ];
        }

        if (session()->has('errors')) {
            return [
                'message' => session()->get('errors')->first(),
                'type' => 'error',
            ];
        }

        return null;
    }
}
