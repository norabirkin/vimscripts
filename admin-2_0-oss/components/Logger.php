<?php

class Logger extends CLogger {
    public function log($message,$level='info',$category='application') {
        if ($level == 'vardump') {
            $message = VarDumper::dumpAsString($message);
        }
        parent::log($message,$level,$category);
    }
    public static function getAliasOfPath($path) {
        $path = realpath($path);
        $application = realpath(yii::app()->getBasePath());
        $phpclient = realpath(dirname(__FILE__));
        $ext = realpath(yii::app()->getBasePath().DIRECTORY_SEPARATOR.'extensions');
        if (!self::replaceRoot($path, $phpclient, 'phpclient')) {
            if (!self::replaceRoot($path, $ext, 'ext')) {
                self::replaceRoot($path, $application, 'application');
            }
        }
        if (substr($path, strlen($path) - 4) == '.php') {
            $path = substr($path, 0, strlen($path) - 4);
        }
        return str_replace(DIRECTORY_SEPARATOR, '.', $path);
    }
    private static function replaceRoot(&$path, $substitute, $alias) {
        if (substr($path, 0, strlen($substitute)) == $substitute) {
            $path = $alias.substr($path, strlen($substitute));
            return true;
        } else {
            return false;
        }
    }
}

?>
