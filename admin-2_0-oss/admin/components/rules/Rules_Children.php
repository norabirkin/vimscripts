<?php

class Rules_Children {
    private $data = array();
    public function add(Rules_Item $item) {
        $this->data[] = $item;
    }
    public function getChildren() {
        return $this->data;
    }
}

?>
