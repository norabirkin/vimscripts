<?php

class LBPage {
    private $items;
    private $parent;
    private $config;
    public function __construct($params, $parent = null) {
        if ($parent) {
            $this->setParent($parent);
        }
        $this->setParams(
            array(
                'controller',
                'param',
                'action',
                'localize',
                'title',
                'description',
                'hidden'
            ),
            $params,
            array(
                'description' => '',
                'localize' => 'main',
                'hidden' => false,
                'param' => ''
            ),
            array(
                'hidden' => 'is_bool'
            )
        );
        $this->setItems($params['items']);
    }
    public function swithedOff() {
        return $this->param('param') AND !yii::app()->params[$this->param('param')];
    }
    private function setParams($names, $params, $default = array(), $types = array()) {
        foreach ($names as $name) {
            $this->setParam($name, $params[$name], $default[$name], $types[$name]);
        }
    }
    private function setParent(LBPage $parent) {
        $this->parent = $parent;
    }
    private function setItems($value) {
        $this->items = new LBPages($this);
        if (!$value) {
            return;
        }
        if (!is_array($value)) {
            throw new Exception('not array');
        }
        $this->items->config($value);
    }
    public function setParam($name, $value, $default = null, $type = null) {
        if (!$type) {
            $type = 'is_string';
        }
        if (!$value) {
            if ($this->parent) {
                $value = $this->parent->param($name);
            }
        }
        if (!$value) {
            if ($default !== null) {
                $value = $default;
            } else {
                throw new Exception('empty');
            }
        }
        if (!$type($value)) {
            throw new Exception('invalid_type');
        }
        $this->config[$name] = $value;
        $this->$name = $value;
    }
    public function param($param) {
        return $this->config[$param];
    }
    private function t($msg, $params = array()) {
        return yii::t($this->param('localize'), $msg, $params);
    }
    public function title() {
        return $this->t($this->param('title'));
    }
    public function description() {
        return $this->t($this->param('description'));
    }
    public function route() {
        $action = $this->param('action');
        $controller = $this->param('controller');
        return $controller . '/' . $action;
    }
    public function url() {
        return Yii::app()->createUrl($this->route());
    }
    public function items() {
        return $this->items;
    }
    public function breadcrumbs() {
        if ($this->parent) {
            $result = $this->parent->breadcrumbs();
        } else {
            $result = array();
        }
        $result[$this->title()] = $this->url();
        return $result;
    }
    public function addMenuItem($page, &$items) {
        $items[] = array(
            'title' => $page->title(),
            'url' => $page->url(),
            'description' => $page->description()
        );
    }
    public function menu() {
        $items = array();
        $this->items()->eachPages('addMenuItem', $this, $items);
        return yii::app()->controller->renderPartial('application.views.menuPage', array('items' => $items), true);
    }
    public function isCurrent() {
        return $this->route() == yii::app()->controller->route;
    }
    public function isDescendantOfCurrent() {
         if (!$this->isChildOfCurrent()) {
             if (!$this->parent) {
                 return false;
             }
             return $this->parent->isDescendantOfCurrent();
         } else {
             return true;
         }
    }
    public function isChildOfCurrent() {
        if (!$this->parent) {
            return false;
        }
        return $this->parent->isCurrent();
    }
    public function isCurrentOrDescendantOfCurrent() {
        return $this->isCurrent() OR $this->isDescendantOfCurrent();
    }
    public function isAncestorOfCurrent() {
        foreach ($this->items()->getPages() as $item) {
            if ($item->isCurrent() OR $item->isAncestorOfCurrent()) {
                return true;
            }
        }
        return false;
    }
    public function isCurrentOrAncestorOfCurrent() {
        return $this->isCurrent() OR $this->isAncestorOfCurrent();
    }
}

?>
