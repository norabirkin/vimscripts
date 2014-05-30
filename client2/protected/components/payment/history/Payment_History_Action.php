<?php

class Payment_History_Action extends LBWizardAction {
    public function __getWizard() {
        return new LBWizard(array(
            'steps' => array(
                new Payment_History_Detail
            )
        ));
    }
    public function import() {
        return array(
            'application.components.payment.history.*',
            'application.components.statistics.*',
            'application.components.payment.*'
        );
    }
}

?>
