<?php

class LB_Form_Item_Default extends LB_Form_Item {
    private $element = false;
    public function __construct($params, $element = false) {
        parent::__construct($params);
        $this->element = (bool) $element;
    }
    public function isElement() {
        return $this->element;
    }
    private function getName() {
        if (!isset($this->params['name'])) {
            return '';
        }
        $result = '';
        $name = $this->getParentName();
        $name[] = $this->params['name'];
        $first = true;
        foreach ($name as $item) {
            if (!$first) {
                $item = "[$item]";
            }
            $result .= $item;
            $first = false;
        }
        return $result;
    }
    public function set($name, $value) {
        $this->params[$name] = $value;
    }
    public function get($name, $default = null) {
        if ($name == 'name') {
            return $this->getName();
        } else {
            return parent::get($name, $default);
        }
    }
    public function element($params) {
        $params = new self($params, true);
        if ($this->getParent()) {
            $params->setParent($this->getParent());
        }
        return $params;
    }
}

?>
