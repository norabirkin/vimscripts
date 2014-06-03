<?php

class LB_Cache {
    private static $data = array();
    private function key($fn, $params = array()) {
        return md5(serialize($params)).$fn;
    }
    public function get($fn, $params = null) {
        return self::$data[$this->key($fn, $params)];
    }
    public function set($fn, $params, $value) {
        self::$data[$this->key($fn, $params)] = $value;
    }
    public function index($index, $data, $callback = null) {
        $result = array();
        $index = explode('.', $index);
        if (!is_array($data)) {
            throw new Exception('Invalid data');
        }
        foreach ($data as $item) {
            $prop = $item;
            foreach ($index as $key) {
                if (!property_exists($prop, $key)) {
                    throw new Exception('Invalid property');
                }
                $prop = $prop->$key;
            }
            $this->call($callback, $item);
            $result[$prop] = $item;
        }
        return $result;
    }
    public function call($callback, $data) {
        if (!$callback) {
            return;
        }
        if (!is_array($callback) OR !is_object($callback[0]) OR !is_string($callback[1]) OR !method_exists($callback[1], $callback[0])) {
            throw new Exception('Invalid callback');
        }
        $obj = $callback[0];
        $method = $callback[1];
        $obj->$method($data);
    }
}

?>
