<?php

class Payment_Assist_Confirm_Action extends LBWizardAction {
    public function __getWizard() {
        yii::import('application.components.payment.assist.*');
        yii::import('application.components.payment.*');
        return new LBWizard(array(
            'steps' => array(
                new Payment_Assist_Confirm,
                new Payment_Assist_Result
            )
        ));
    }
}

?>
