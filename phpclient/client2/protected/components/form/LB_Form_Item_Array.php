<?php

class LB_Form_Item_Array extends LB_Form_Item {
    public function isArray() {
        return true;
    }
    public function add($item) {
        if (!$this->params['items'] OR !is_array($this->params['items'])) {
            $this->params['items'] = array();
        }
        $this->params['items'][] = $item;
    }
}

?>
