<?php

class Payment_Assist_Action extends LBWizardAction {
    public function __getWizard() {
        yii::import('application.components.payment.assist.*');
        yii::import('application.components.payment.*');
        return new LBWizard(array(
            'steps' => array(
                new Payment_Agreements(array(
                    'title' => 'Choose agreement',
                    'all' => false
                )),
                new Payment_Assist_Form
            ),
            'final' => new Payment_Assist_Pay
        ));
    }
}

?>
