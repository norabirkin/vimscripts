<?php

class LB_Google_Analitics {
    private static $instance;
    private $enabled = false;
    private $config;
    private $meta_ga_region;
    private $meta_ga_section;
    private $head = array();
    private $body = array();
    private $routes = array();
    private $ga_subsection;
    public function getInstance() {
        if (!self::$instance) {
            self::$instance = new self;
        }
        return self::$instance;
    }
    public function __construct() {
        $this->configure($this->config());
        if (!$this->ga_subsection()) {
            $this->setEnabled(false);
        }
    }
    private function config() {
        if (!$this->config) {
            $this->config = require_once(yii::getPathOfAlias('application.config').'/google.analitics.config.php');
        }
        return $this->config;
    }
    private function configure($config) {
        foreach ($config as $k => $v) {
            $method = 'set'.ucfirst($k);
            if (!method_exists($this, $method)) {
                throw new Exception('Invalid param ['.$method.']');
            }
            $this->$method($v);
        }
    }
    public function head() {
        if (!$this->enabled) {
            return array();
        }
        return $this->head;
    }
    public function body() {
        if (!$this->enabled) {
            return array();
        }
        return $this->body;
    }
    public function meta() {
        if (!$this->enabled) {
            return array();
        }
        $meta = array(
            'ga_region' => $this->meta_ga_region,
            'ga_section' => $this->meta_ga_section
        );
        if ($this->ga_subsection()) {
            $meta['ga_subsection'] = $this->ga_subsection();
        }
        return $meta;
    }
    private function ga_subsection() {
        if ($this->ga_subsection === null) {
            if (!in_array(yii::app()->controller->route,$this->routes)) {
                $this->ga_subsection = false;
            } else {
                $this->ga_subsection = yii::app()->controller->getPage()->title();
            }
        }
        return $this->ga_subsection;
    }
    private function setEnabled($value) {
        if ($value) {
            $this->enabled = true;
        } else {
            $this->enabled = false;
        }
    }
    private function setMeta_ga_region($value) {
        $this->option('meta_ga_region', $value);
    }
    private function setMeta_ga_section($value) {
        $this->option('meta_ga_section', $value);
    }
    private function setHead($head) {
        $this->strArr('head', $head);
    }
    private function setBody($body) {
        if (yii::app()->request->getIsSecureConnection()) {
            $body = $this->arr($body, 'https');
        } else {
            $body = $this->arr($body, 'http');
        }
        $this->strArr('body', $body);
    }
    private function setLookup($value) {
        foreach ($this->arr($value) as $k => $v) {
            if ($v) {
                $this->routes[] = $this->value($k);
            }
        }
    }
    private function strArr($name, $value) {
        foreach ($this->arr($value) as $item) {
            array_push($this->$name, $this->value($item));
        }
    }
    private function arr($value, $key = null) {
        $arr = $this->value($value, 'is_array');
        if (!$key) {
            return $arr;
        }
        if (!isset($arr[$key])) {
            new Exception('Key dont exists');
        }
        return $arr[$key];
    }
    private function option($name, $value, $type = 'is_string') {
        return $this->$name = $this->value($value, $type);
    }
    private function value($value, $type = 'is_string') {
        if (!$type($value)) {
            throw new Exception('invalid type ['.$value.']');
        }
        return $value;
    }
}

?>
