<?php

class LB_Form_Item {
    protected $params;
    private $ns;
    public function __construct($params) {
        $this->params = $params;
    }
    public function setParent(LB_Form_Item_Array $ns) {
        $this->ns = $ns;
        $ns->add($this);
    }
    public function getParent() {
        return $this->ns;
    }
    public function getParentName($name = array()) {
        if (!$this->getParent()) {
            return $name;
        }
        $name = $this->getParent()->getParentName($name);
        $name[] = $this->getParent()->get('name');
        return $name;
    }
    public function get($name, $default = null, $log = false ) {
        if ($log) {
            Dumper::dump(array(
                'name' => $name,
                'default' => $default
            ));
        }
        return isset($this->params[$name]) ? $this->params[$name] : $default;
    }
    public function isElement() {
        return false;
    }
    public function isArray() {
        return false;
    }
}

?>
