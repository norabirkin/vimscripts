<?php

class LBP_Payment_History extends LBPage {
    protected function getRoute() {
        return 'payment/history';
    }
    protected function getTitle() {
        return 'Payment history';
    }
    protected function getLocalizationFile() {
        return 'payment';
    }
}

?>
