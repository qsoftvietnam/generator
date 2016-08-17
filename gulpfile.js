var elixir = require('laravel-elixir');
require('./tasks/angular');
require('./tasks/templates');

elixir.config.sourcemaps = false;


/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */

var angular = [
	'resources/angular/scripts/main.js',
	'resources/angular/scripts/config.js',
	'resources/angular/**/*.js',
	'.tmp/templates.js'
];
elixir(function(mix) {
	mix.sass('app.scss');
	mix.templates();
	mix.angular();

	mix.scripts([
		'jquery/dist/jquery.min.js',
		'lodash/dist/lodash.min.js',
		'slug/slug.js',
		'datatables/media/js/jquery.dataTables.min.js',
		'angular/angular.min.js',
		'angular-ui-router/release/angular-ui-router.min.js',
		'restangular/dist/restangular.min.js',
		'angular-datatables/dist/angular-datatables.min.js',
		'angular-toastr/dist/angular-toastr.min.js',
		'angular-toastr/dist/angular-toastr.tpls.min.js',
		'angular-animate/angular-animate.min.js',
		'angular-loading-bar/build/loading-bar.min.js',
	], 'public/js/vendor.js', 'bower_components');

	mix.styles([
		'bulma/css/bulma.css',
		'datatables/media/css/jquery.dataTables.min.css',
		'angular-datatables/dist/css/angular-datatables.min.css',
		'font-awesome/css/font-awesome.min.css',
		'angular-toastr/dist/angular-toastr.min.css',
		'angular-loading-bar/build/loading-bar.min.css',
	], 'public/css/vendor.css', 'bower_components');


	mix.copy(['bower_components/font-awesome/fonts'], 'public/fonts');
	mix.copy(['bower_components/datatables/media/images'], 'public/images');
});