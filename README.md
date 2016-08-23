## Laravel generator package

## How to install

```shell
	composer require qsoft/generator
```

### Provider
```php
	Qsoft\Generator\GeneratorServiceProvider::class,
	Chumper\Zipper\ZipperServiceProvider::class,
```

### Alias

```php
    'Zipper'    => Chumper\Zipper\Zipper::class,
```

### Publish template and config

```shell
	php artisan vendor:publish --provider="Qsoft\Generator\GeneratorServiceProvider"
```
### Add except for `api`
```php
	/**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array
     */
    protected $except = [
        '/api/*',
    ];
```