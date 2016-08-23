<?php
/**
 * @Author: Recycle Bin
 * @Date:   2016-05-27 23:47:42
 * @Last Modified by:   thedv
 * @Last Modified time: 2016-07-29 15:31:08
 */
Route::group(['middleware' => 'api'], function () {

    Route::get('download', 'DownloadController@download');

    Route::group(['prefix' => 'api/v1'], function () {
        Route::resource('generator', 'GenerateController');

        Route::group(['namespace' => 'Api'], function () {
            Route::resource('field-type-migration', 'FieldTypeController');
        });
    });

    Route::get(config('qsoft-generator.url'), function () {
        return view('qsoft::layouts.app');
    });

    Route::resource('schema', 'SchemaGenerateController');
});
