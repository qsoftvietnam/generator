<?php

use App\FieldType;
use Illuminate\Database\Seeder;

class FieldTypeSeed extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $datas = array([
            'name' => 'Big Increments',
            'key'  => 'bigIncrements',
        ], [
            'name' => 'Big Integer',
            'key'  => 'bigInteger',
        ], [
            'name' => 'Binary',
            'key'  => 'binary',
        ], [
            'name' => 'Boolean',
            'key'  => 'boolean',
        ], [
            'name' => 'Char',
            'key'  => 'char',
        ], [
            'name' => 'Date',
            'key'  => 'date',
        ], [
            'name' => 'DateTime',
            'key'  => 'dateTime',
        ], [
            'name' => 'Decimal',
            'key'  => 'decimal',
        ], [
            'name' => 'Double',
            'key'  => 'double',
        ], [
            'name' => 'Enum',
            'key'  => 'enum',
        ], [
            'name' => 'Float',
            'key'  => 'float',
        ], [
            'name' => 'Increments',
            'key'  => 'increments',
        ], [
            'name' => 'Integer',
            'key'  => 'integer',
        ], [
            'name' => 'Json',
            'key'  => 'json',
        ], [
            'name' => 'Jsonb',
            'key'  => 'jsonb',
        ], [
            'name' => 'LongText',
            'key'  => 'longText',
        ], [
            'name' => 'MediumInteger',
            'key'  => 'mediumInteger',
        ], [
            'name' => 'Medium Text',
            'key'  => 'mediumText',
        ], [
            'name' => 'Morphs',
            'key'  => 'morphs',
        ], [
            'name' => 'Small Integer',
            'key'  => 'smallInteger',
        ], [
            'name' => 'String',
            'key'  => 'string',
        ], [
            'name' => 'Text',
            'key'  => 'text',
        ], [
            'name' => 'Time',
            'key'  => 'time',
        ], [
            'name' => 'Tiny Integer',
            'key'  => 'tinyInteger',
        ], [
            'name' => 'Timestamp',
            'key'  => 'timestamp',
        ], [
            'name' => 'uuid',
            'key'  => 'uuid',
        ]);

        foreach ($datas as $value) {
            $field       = new FieldType;
            $field->name = $value['name'];
            $field->key  = $value['key'];
            $field->save();
        }
    }
}
