<?php

class LBP_Payment_Pay extends LBPage {
    protected function getRoute() {
        return 'payment/pay';
    }
    protected function getTitle() {
        return 'BalanceRefill';
    }
    protected function getLocalizationFile() {
        return 'payment';
    }
}

?>
