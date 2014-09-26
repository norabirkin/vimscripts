<?php

class Rules {
    private $items;
    private $root;
    public function __construct($items) {
        $this->root = new Rules_Item(array(
            'name' => ''
        ));
        foreach ($items as $item) {
            $this->add($item);
        }
        foreach ($this->items as $v) {
            $parent = $v->getParent();
            if ($parent) {
                $parent = $this->items[$parent];
            }
            if (!$parent) {
                $parent = $this->root;
            }
            $parent->setChild($v);
        }
    }
    private function processItem($item) {
        $params = $item->getData();
        return array(
            'text' => $params['descr'],
            'record_id' => $params['record_id'],
            'children' => array(),
            'leaf' => $item->getLeaf(),
            'name'  => $params['name'],
            'max_value_create' => $params['max_value_create'],
            'max_value_delete' => $params['max_value_delete'],
            'max_value_read' => $params['max_value_read'],
            'max_value_update' => $params['max_value_update'],
            'enabled' => $params['enabled'],
            'value_create' => $params['value_create'],
            'value_delete' => $params['value_delete'],
            'value_read' => $params['value_read'],
            'value_update' => $params['value_update']
        );
    }
    public function getData($root = null) {
        $data = array();
        if (!$root) {
            $root = $this->root;
        }
        foreach ($root->getChildren() as $item) {
            $params = $this->processItem($item);
            if (!$item->getLeaf()) {
                $params['children'] = $this->getData($item);
            }
            $data[] = $params;
        }
        return $data;
    }
    public function add($item) {
        $item = new Rules_Item($item);
        $this->items[$item->getName()] = $item;
    }
}

?>
