<?php
/**
 * @Author: thedv
 * @Date:   2016-07-29 15:45:39
 * @Last Modified by:   thedv
 * @Last Modified time: 2016-07-29 15:46:16
 */
namespace Qsoftvn\Generator;

class GeneratorException extends \Exception
{
    /**
     * The exception description.
     *
     * @var string
     */
    protected $message = 'Could not determine what you are trying to do. Sorry! Check your migration name.';
}
