<?php
/**
 * LANBilling autoload
 */
class lbException extends Exception {}

set_include_path(__DIR__.PATH_SEPARATOR.__DIR__.'/helpers/');
spl_autoload_register('lbAutoload');

function lbAutoload($class)
{
    $paths = explode(PATH_SEPARATOR, get_include_path());
    while($path = array_shift($paths))
    {
        $filename = $path.'/'.$class.'.php';
        if(file_exists($filename)) {
            require_once $filename;
            return true;
        }
    }
    throw new lbException("# class {$class} not found \n");
}
