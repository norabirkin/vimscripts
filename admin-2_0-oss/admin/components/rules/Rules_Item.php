<?php

class Rules_Item {
    private $leaf = true;
    private $parent;
    private $name;
    private $data;
    private $children;
    public function __construct($data) {
        $this->name = $data['name'];
        $path = explode('.', $data['name']);
        if (count($path) > 1) {
            $path = $path;
            unset($path[count($path) - 1]);
            $this->parent = implode('.', $path);
        }
        $this->data = $data;
        $this->children = new Rules_Children;
    }
    public function getName() {
        return $this->name;
    }
    public function setChild(Rules_Item $item) {
        $this->children->add($item);
        $this->leaf = false;
    }
    public function getParent() {
        return $this->parent;
    }
    public function getData() {
        return $this->data;
    }
    public function getLeaf() {
        return $this->leaf;
    }
    public function getChildren() {
        return $this->children->getChildren();
    }
}

?>
