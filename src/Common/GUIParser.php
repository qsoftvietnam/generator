<?php
/**
 * @Author: thedv
 * @Date:   2016-08-01 14:15:47
 * @Last Modified by:   thedv
 * @Last Modified time: 2016-08-01 14:37:03
 */
namespace Qsoft\Generator\Common;

class GUIParser
{

    protected $fields = [];

    public function parse($data)
    {
        if (isset($data['fields'])) {
            foreach ($data['fields'] as $key => $value) {
                if ($value['ref']['foreign']) {
                    $ref = $value['ref'];

                    $this->addField($value);

                    $this->addForeign($value, $ref);
                    continue;
                } else {
                    $this->addField($value);
                }
            }
            return $this->fields;
        }

    }

    private function addField($data)
    {
        if (isset($data['ref'])) {
            unset($data['ref']);
        }

        array_push($this->fields, $data);
    }

    private function addForeign($data, $options)
    {
        if (isset($options['foreign'])) {
            unset($options['foreign']);
        }
        foreach ($options as $key => $value) {
            $options[$key] = "'" . $value . "'";
        }

        $data['key']     = 'foreign';
        $data['options'] = $options;
        array_push($this->fields, $data);
    }
}
