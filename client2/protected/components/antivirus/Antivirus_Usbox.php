<?php

class Antivirus_Usbox extends LB_Usbox_Categories {
    protected function errors() {
        $errors = array();
        foreach (parent::errors() as $method) {
            if ($method != 'balance') {
                $errors[] = $method;
            }
        }
        return $errors;
    }
}

?>
