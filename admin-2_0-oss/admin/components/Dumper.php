<?php
class Dumper extends CVarDumper {
    public static function dump($var,$depth=10,$highlight=true){
        echo self::dumpAsString($var,$depth,$highlight);
    }
    public static function log($var, $level = 'info', $category = 'dev') {
        if (is_bool($var)) {
            if ($var) {
                $dump = "TRUE";
            } else {
                $dump = "FALSE";
            }
        } else {
            ob_start();
            var_dump($var);
            //print_r($var);
            $dump = ob_get_contents();
            ob_end_clean();
        }
        yii::log($dump, $level, $category);
    }
} ?>
