## Laravel generator package

## How to install

```shell
	composer require qsoft/generator:dev-master
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
	php artisan vendor:publish
```