<?php

class LB_Usbox_Array implements ArrayAccess, Iterator, Countable {
    protected $container = array();
    private $position = 0;
    public function __construct($data = array()) {
        $this->container = (array) $data;
    }
    public function count() {
        return count($this->container);
    }
    public function offsetSet($offset, $value) {
        if (is_null($offset)) {
            $this->container[] = $value;
        } else {
            $this->container[$offset] = $value;
        }
    }
    public function offsetExists($offset) {
        return isset($this->container[$offset]);
    }
    public function offsetUnset($offset) {
        unset($this->container[$offset]);
    }
    public function offsetGet($offset) {
        return isset($this->container[$offset]) ? $this->container[$offset] : null;
    }
    public function get($params) {
        $servid = (is_numeric($params)) ? $params : (int) $params['servid']; 
        if (!$servid) {
            throw new Exception('No service ID');
        }
        if (!is_object($this->container[$servid])) {
            throw new Exception('Service not found');
        }
        return clone $this->container[$servid];
    }
    public function first() {
        $keys = $this->keys();
        if (isset($keys[0])) {
            return $this->container[$keys[0]];
        } else {
            return null;
        }
    }
    public function isPagingRequest() {
        return false;
    }
    public function keys() {
        return array_keys($this->container);
    }
    public function rewind() {
        $this->position = 0;
    }
    public function current() {
        return $this->container[$this->key()];
    }
    public function key() {
        $keys = $this->keys();
        return $keys[$this->position];
    }
    public function next() {
        ++ $this->position;
    }
    public function valid() {
        $keys = $this->keys();
        return isset($keys[$this->position]);
    }
    public function data() {
        return $this->container;
    }
}

?>
