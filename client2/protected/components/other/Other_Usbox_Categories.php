<?php

class Other_Usbox_Categories extends LB_Usbox_Categories {
    protected function errors() {
        $errors = array();
        foreach (parent::errors() as $method) {
            if ($method != 'lock') {
                $errors[] = $method;
            }
        }
        return $errors;
    }
}

?>
