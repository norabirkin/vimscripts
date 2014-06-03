<?php

class LB_Usbox_Error {
    static public function available($service) {
        if (!$service->available) {
            return 'Service is not available';
        } else {
            return false;
        }
    }
    static public function balance($service) {
        if ($service->lowbalance) {
            return 'Low balance';
        } else {
            return false;
        }
    }
    static public function lock($service) {
        if ($service->blocked) {
            return 'Account is blocked';
        } else {
            return false;
        }
    }
}

?>
