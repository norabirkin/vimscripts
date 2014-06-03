<?php

class Payment_Chronopay_Action extends LBWizardAction {
    public function __getWizard() {
        yii::import('application.components.payment.chronopay.*');
        yii::import('application.components.payment.*');
        return new LBWizard(array(
            'steps' => array(
                new Payment_Agreements(array(
                    'title' => 'Choose agreement',
                    'all' => false
                )),
                new Payment_Chronopay_Form
            ),
            'final' => new Payment_Chronopay_Pay
        ));
    }
}

?>
