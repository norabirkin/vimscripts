<?php

class LB_Usbox_Array_Categories extends LB_Usbox_Array {
    public function get($params) {
        if (is_numeric($params)) {
            $catidx = $params; 
        } else {
            if (!isset($params['catidx'])) {
                throw new Exception('No category ID');
            }
            $catidx = (int) $params['catidx']; 
        }
        if (!$this->container[$catidx]) {
            return null;
        }
        return clone $this->container[$catidx];
    }
}

?>
