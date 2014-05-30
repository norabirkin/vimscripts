<?php

class LB_Plugins {
    public static function attachPlugins() {
        $path = yii::getPathOfAlias('webroot.plugins.plugins').'.php';
        if (!file_exists($path)) {
            return;
        }
        $plugins = require_once($path);
        foreach ($plugins as $alias) {
            self::attachPlugin($alias);
        }
    }

    private static function attachPlugin($alias) {
        yii::import('webroot.plugins.'.$alias);
        $alias = explode('.', $alias);
        end($alias);
        $className = current($alias);
        $plugin = new $className;
        $plugin->init();
    }
}

?>
