<?php

class Payment_Paymaster_Action extends LBWizardAction {
    public function __getWizard() {
        yii::import('application.components.payment.paymaster.*');
        yii::import('application.components.payment.*');
        return new LBWizard(array(
            'steps' => array(
                new Payment_Agreements(array(
                    'title' => 'Choose agreement',
                    'all' => false
                )),
                new Payment_Paymaster_Form
            )
        ));
    }
}

?>
