<?php

/**
 * @Author: Recycle Bin
 * @Date:   2016-05-27 23:36:08
 * @Last Modified by:   thedv
 * @Last Modified time: 2016-08-01 11:40:41
 */
return array(

    /**
     *
     * Url app generator
     *
     */
    'url'                => 'generator',

    /**
     *
     *
     */
    'server_path'        => base_path('/generator/server'),

    /**
     *
     *
     */
    'client_path'        => base_path('/generator/client'),

    /**
     *
     *
     * Model save to folder
     *
     *
     */
    'model_path'         => app_path(),

    /**
     *
     *
     * Migration save to folder
     *
     *
     */
    'migration_path'     => database_path('migrations'),

    /**
     *
     *
     * Folder controller generator
     *
     *
     */
    'controller_path'    => app_path('Http/Controllers'),

    /**
     *
     *
     * Angular service module name
     *
     *
     */
    'angular_service'    => 'qsoft.services',

    /**
     *
     *
     * Angular controller module name
     *
     *
     */
    'angular_controller' => 'qsoft.controllers',

    /**
     *
     * Angular route module name
     *
     */
    'angular_route'      => 'qsoft.routes',

    /**
     * Path download generator file
     *
     */
    'download_path'      => storage_path('generator'),
);
