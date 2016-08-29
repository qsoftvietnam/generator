<?php
/**
 * @Author: thedv
 * @Date:   2016-07-29 15:06:45
 * @Last Modified by:   thedv
 * @Last Modified time: 2016-08-01 10:46:58
 */
namespace Qsoftvn\Generator\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Filesystem\Filesystem;
use Qsoftvn\Generator\Common\MigrationBuilder;
use Qsoftvn\Generator\Common\SchemaParser;
use Qsoftvn\Generator\Ultis\Generator;

class SchemaGenerateController extends Controller
{
    protected $files;
    protected $parse;
    protected $builder;

    public function __construct(Filesystem $files, SchemaParser $parse, MigrationBuilder $builder)
    {
        $this->parse   = $parse;
        $this->builder = $builder;
        $this->files   = $files;
    }

    public function index()
    {
        $schema = 'username:string:unique:nullable,email:string(100):unique:default("hello")';

        $gen = new Generator;

        //$this->files->put($path, $this->compileMigrationStub());

        $stub = $this->files->get(__DIR__ . '/../../stubs/migration.stub');

        $schema = $this->parse->parse($schema);

        $data = [
            'name'       => 'Post',
            'table_name' => 'posts',
            'router'     => 'post',
            'fields'     => $schema,
            'options'    => [],
        ];

        $gen->initDirectory($data);
        $gen->generateClient($data);
        $gen->generateServer($data);
        dd($schema);
    }

}
