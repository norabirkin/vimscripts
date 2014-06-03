<?php

class Obj {
    public static function get($arr) {
        $obj = new stdClass;
        foreach ($arr as $k => $v) {
            $obj->$k = $v;
        }
        return $obj;
    }
}

?>
