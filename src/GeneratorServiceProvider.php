<?php
namespace Qsoftvn\Generator;

/**
 * @Author: Recycle Bin
 * @Date:   2016-05-27 23:32:22
 * @Last Modified by:   thedv
 * @Last Modified time: 2016-08-01 15:21:41
 */

use Illuminate\Contracts\Auth\Access\Gate as GateContract;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Routing\Router;

class GeneratorServiceProvider extends ServiceProvider
{
    protected $namespace = 'Qsoftvn\Generator\Http\Controllers';

    /**
     * Perform post-registration booting of services.
     *
     * @return void
     */
    public function boot(Router $router, GateContract $gate)
    {
        parent::boot($router);

        $this->registerPolicies($gate);

        $this->loadViewsFrom(__DIR__ . '/resources/views', 'qsoft');

        $this->publishes([
            __DIR__ . '/config' => config_path(),
            __DIR__ . '/assets' => public_path(),
        ]);

        $this->mapWebRoutes($router);
    }

    /**
     * Register any package services.
     *
     * @return void
     */
    public function register()
    {

    }

    /**
     * Define the "web" routes for the application.
     *
     * These routes all receive session state, CSRF protection, etc.
     *
     * @param  \Illuminate\Routing\Router  $router
     * @return void
     */
    protected function mapWebRoutes(Router $router)
    {
        $router->group([
            'namespace' => $this->namespace, 'middleware' => 'web',
        ], function ($router) {
            require __DIR__ . '/Http/routes.php';
        });
    }

}
