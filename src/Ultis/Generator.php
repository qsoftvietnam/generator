<?php
/**
 * @Author: thedv
 * @Date:   2016-07-29 16:18:52
 * @Last Modified by:   thedv
 * @Last Modified time: 2016-08-01 15:13:51
 */
namespace Qsoft\Generator\Ultis;

use Carbon\Carbon;
use File;
use Illuminate\Console\AppNamespaceDetectorTrait;
use Qsoft\Generator\Common\GUIParser;
use Qsoft\Generator\Common\MigrationBuilder;
use Qsoft\Generator\Common\SchemaParser;
use Twig_Autoloader;
use Twig_Environment;
use Twig_Loader_Filesystem;
use Zipper;

class Generator
{
    use AppNamespaceDetectorTrait;

    /**
     * [$namespace description]
     * @var [type]
     */
    protected $namespace;

    /**
     * [$migration description]
     * @var [type]
     */
    protected $migration;

    /**
     * [$model description]
     * @var [type]
     */
    protected $model;

    /**
     * [$controller description]
     * @var [type]
     */
    protected $controller;

    /**
     * [$route description]
     * @var [type]
     */
    protected $route;

    /**
     * [$angular description]
     * @var [type]
     */
    protected $angular;

    /**
     * [$angularController description]
     * @var [type]
     */
    protected $angularController;

    /**
     * [$angularService description]
     * @var [type]
     */
    protected $angularService;

    /**
     * [$angularRouter description]
     * @var [type]
     */
    protected $angularRouter;

    /**
     * [$angularView description]
     * @var [type]
     */
    protected $angularView;

    /**
     * [$angularForm description]
     * @var [type]
     */
    protected $angularForm;

    /**
     * [$angularDetail description]
     * @var [type]
     */
    protected $angularDetail;

    /**
     * [$serverPath description]
     * @var [type]
     */
    protected $serverPath;

    /**
     * [$clientPath description]
     * @var [type]
     */
    protected $clientPath;

    /**
     * [$generatorPath description]
     * @var [type]
     */
    protected $generatorPath;

    /**
     * [__construct description]
     */
    public function __construct()
    {

        Twig_Autoloader::register();

        $php                     = new Twig_Loader_Filesystem(__DIR__ . '/../templates/server');
        $angular                 = new Twig_Loader_Filesystem(__DIR__ . '/../templates/angular');
        $server                  = new Twig_Environment($php);
        $this->angular           = new Twig_Environment($angular);
        $this->angularController = $this->angular->loadTemplate('controller.js.twig');
        $this->angularService    = $this->angular->loadTemplate('service.js.twig');
        $this->angularRouter     = $this->angular->loadTemplate('router.js.twig');
        $this->angularView       = $this->angular->loadTemplate('list-view.html.twig');
        $this->angularForm       = $this->angular->loadTemplate('form.html.twig');
        $this->angularDetail     = $this->angular->loadTemplate('detail.html.twig');
        $this->migration         = new MigrationBuilder;
        $this->model             = $server->loadTemplate('model.php.twig');
        $this->controller        = $server->loadTemplate('controller.php.twig');
        $this->route             = $server->loadTemplate('route.php.twig');
        $this->generatorPath     = config('qsoft-generator.generator_path');
        $this->namespace         = $this->getAppNamespace();

    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function create($data)
    {

        if (isset($data['type']) && $data['type'] === 1) {
            $parse          = new SchemaParser;
            $data['fields'] = $parse->parse($data['schema']);

        } else {
            $parser         = new GUIParser;
            $data['fields'] = $parser->parse($data);
        }
        $this->initDirectory($data);
        $this->generateServer($data);
        $this->generateClient($data);
        $file = $this->zip($data);
        if ($file) {
            return $file;
        } else {
            return false;
        }

    }

    /**
     * [generateClient description]
     * @param  [type] $data [description]
     * @return [type]       [description]
     */
    public function generateClient($data)
    {
        $this->generateAngularController($data);
        $this->generateAngularService($data);
        $this->generateAngularRoute($data);
        $this->generateAngularView($data);
        $this->generateAngularForm($data);
        $this->generateAngularDetail($data);
    }

    /**
     * [generateServer description]
     * @param  [type] $data [description]
     * @return [type]       [description]
     */
    public function generateServer($data)
    {
        $this->generateMigration($data);
        $this->generateModel($data);
        $this->generateController($data);
        $this->generateRoute($data);
    }

    /**
     * [generateMigration description]
     * @param  Request $request [description]
     * @return [type]           [description]
     */
    protected function generateMigration($request)
    {
        $table_name = $request['table_name'] ? $request['table_name'] : snake_case(str_plural($request['name']));

        $stub = File::get(__DIR__ . '/../templates/server/migration.stub');

        $schema = $this->migration->create($request['fields'], [
            'action' => 'create',
            'table'  => $table_name,
            'type'   => $request['type'],
        ]);

        $className = 'Create' . studly_case(str_plural($request['name'])) . 'Table';
        $stub      = str_replace(['{{schema_up}}', '{{schema_down}}'], $schema, $stub);
        $stub      = str_replace('{{table}}', $table_name, $stub);
        $stub      = str_replace('{{class}}', $className, $stub);

        $time = Carbon::now()->format('Y_m_d_His');
        $name = $time . '_create_' . snake_case(str_plural($request['name'])) . '_table.php';
        File::put($this->serverPath . '/' . $name, $stub);
        return $stub;
    }

    /**
     * [generateModel description]
     * @param  Request $request [description]
     * @return [type]           [description]
     */
    protected function generateModel($request)
    {
        //$table_name = $request->has('table_name') ? $request->table_name : snake_case(str_plural($request['name']));
        $table_name = $request['table_name'] ? $request['table_name'] : false;
        $model      = $this->model->render([
            'model' => [
                'namespace'  => $this->namespace,
                'name'       => studly_case(str_singular($request['name'])),
                'table_name' => $table_name,
                'fields'     => $request['fields'],
            ],
        ]);

        $modelName = studly_case(str_singular($request['name'])) . '.php';
        File::put($this->serverPath . '/' . $modelName, $model);
        return $model;
    }

    /**
     * [generateController description]
     * @param  Request $request [description]
     * @return [type]           [description]
     */
    public function generateController($request)
    {
        $controller = $this->controller->render([
            'model' => [
                'namespace'      => $this->namespace,
                'controllerName' => studly_case(str_singular($request['name'])),
                'modelName'      => studly_case(str_singular($request['name'])),
                'fields'         => $request['fields'],
            ],
        ]);

        $controllerName = studly_case(str_singular($request['name'])) . 'Controller.php';
        File::put($this->serverPath . '/' . $controllerName, $controller);
        return $controller;
    }

    /**
     * [generateController description]
     * @param  Request $request [description]
     * @return [type]           [description]
     */
    public function generateRoute($request)
    {
        $route = $this->route->render([
            'model' => [
                'controllerName' => studly_case(str_singular($request['name'])),
                'prefix'         => str_slug($request['name'], '-'),
                'fields'         => $request['fields'],
            ],
        ]);

        $routeName = 'routes.php';
        File::put($this->serverPath . '/' . $routeName, $route);
        return $route;
    }

    /**
     * [generateAngularController description]
     * @param  [type] $request [description]
     * @return [type]          [description]
     */
    protected function generateAngularController($request)
    {
        $angularController = $this->angularController->render([
            'model' => [
                'controllerModule' => config('qsoft-generator.angular_controller'),
                'controllerName'   => studly_case(str_singular($request['name'])),
                'serviceName'      => camel_case($request['name']),
                'name'             => studly_case(str_singular($request['name'])),
                'table_name'       => snake_case(str_plural($request['name'])),
                'prefix'           => str_slug($request['name'], '-'),
                'fields'           => $request['fields'],
            ],
        ]);

        File::put($this->clientPath . '/' . str_slug($request['name'], '-') . '.controller.js', $angularController);
        return $angularController;
    }

    /**
     * [generateAngularService description]
     * @param  Request $request [description]
     * @return [type]           [description]
     */
    protected function generateAngularService($request)
    {
        $angularService = $this->angularService->render([
            'model' => [
                'serviceName' => config('qsoft-generator.angular_service'),
                'name'        => camel_case($request['name']),
                'prefix'      => str_slug($request['name'], '-'),
                'fields'      => $request['fields'],
            ],
        ]);

        File::put($this->clientPath . '/' . str_slug($request['name'], '-') . '.service.js', $angularService);
        return $angularService;
    }

    /**
     * [generateAngularRoute description]
     * @return [type] [description]
     */
    protected function generateAngularRoute($request)
    {
        $route         = $request['router'] ? $request['router'] : str_slug($request['name'], '-');
        $angularRouter = $this->angularRouter->render([
            'model' => [
                'routeModel'     => config('qsoft-generator.angular_route'),
                'serviceName'    => camel_case($request['name']),
                'controllerName' => studly_case(str_singular($request['name'])),
                'name'           => $request['name'],
                'url'            => $route,
                'prefix'         => str_slug($request['name'], '-'),
                'fields'         => $request['fields'],
            ],
        ]);

        File::put($this->clientPath . '/' . str_slug($request['name'], '-') . '.route.js', $angularRouter);
        return $angularRouter;
    }

    /**
     * [generateAngularView description]
     * @param  Request $request [description]
     * @return [type]           [description]
     */
    private function generateAngularView($request)
    {
        $angularView = $this->angularView->render([
            'model' => [
                'routeModel'     => config('qsoft-generator.angular_route'),
                'serviceName'    => camel_case($request['name']),
                'controllerName' => studly_case($request['name']),
                'name'           => $request['name'],
                'prefix'         => str_slug($request['name'], '-'),
                'fields'         => $request['fields'],
            ],
        ]);

        File::put($this->clientPath . '/index.tpl.html', $angularView);
        return $angularView;
    }

    /**
     * [generateAngularForm description]
     * @param  Request $request [description]
     * @return [type]           [description]
     */
    private function generateAngularForm($request)
    {
        $angularForm = $this->angularForm->render([
            'model' => [
                'routeModel'     => config('qsoft-generator.angular_route'),
                'serviceName'    => camel_case($request['name']),
                'controllerName' => studly_case($request['name']),
                'name'           => $request['name'],
                'prefix'         => str_slug($request['name'], '-'),
                'fields'         => $request['fields'],
            ],
        ]);

        File::put($this->clientPath . '/form.tpl.html', $angularForm);
        return $angularForm;
    }

    private function generateAngularDetail($request)
    {
        $angularDetail = $this->angularDetail->render([
            'model' => [
                'name' => $request['name'],
            ],
        ]);

        File::put($this->clientPath . '/detail.tpl.html', $angularDetail);
        return $angularDetail;
    }

    /**
     * [makeClientDirectory description]
     * @param  Request $request [description]
     * @return [type]           [description]
     */
    private function makeClientDirectory($request)
    {
        $path = $this->clientPath . '/' . str_slug($request['name'], '-');
        if (!File::exists($path)) {
            File::makeDirectory($path, null, true, true);
        }
        return $path;
    }

    /**
     * [makeServerDirectory description]
     * @param  Request $request [description]
     * @return [type]           [description]
     */
    private function makeServerDirectory($request)
    {
        $path = $this->serverPath . '/' . str_slug($request['name'], '-');
        if (!File::exists($path)) {
            File::makeDirectory($path, null, true, true);
        }

        return $path;
    }

    /**
     * [initDirectory description]
     * @param  Request $request [description]
     * @param  boolean $mode    [description]
     * @return [type]           [description]
     */
    public function initDirectory($request, $mode = true)
    {
        $generatorPath    = $this->generatorPath . '/' . str_slug($request['name'], '-');
        $this->serverPath = $generatorPath . '/server_' . str_slug($request['name'], '-');
        $this->clientPath = $generatorPath . '/' . str_slug($request['name'], '-');
        if (File::exists($generatorPath)) {
            File::deleteDirectory($generatorPath, $mode);
        }

        File::makeDirectory($this->serverPath, null, true, true);
        File::makeDirectory($this->clientPath, null, true, true);
        //return $generatorPath;
        return $this;

    }

    /**
     * [zip description]
     * @param  Request $request [description]
     * @return [type]           [description]
     */
    private function zip($request)
    {

        $fileName = Carbon::now()->format('Y_m_d_His') . '_' . str_slug($request['name'], '-') . '.zip';
        $file     = config('qsoft-generator.download_path') . '/' . $fileName;
        $folder   = $this->generatorPath . '/' . str_slug($request['name'], '-');
        if (File::exists($folder)) {
            Zipper::make($file)->add($folder);
            return $fileName;
        } else {
            return false;
        }

    }
}
