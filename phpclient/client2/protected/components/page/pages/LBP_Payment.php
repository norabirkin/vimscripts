<?php class LBP_Payment extends LBPage {
    protected function getRoute() {
        return 'payment/index';
    }
    protected function getTitle() {
        return 'ServicePayment';
    }
    protected function getLocalizationFile() {
        return 'payment';
    }
    protected function getChildrenNames() {
        return array(
            'payment.LBP_Payment_History',
            'payment.LBP_Payment_Pay'
        );
    }
} ?>
