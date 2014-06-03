<?php

class Payment_Moscow_Action extends LBWizardAction {
    public function __getWizard() {
        return new LBWizard(array(
            'steps' => array(
                new Payment_Agreements,
                new Payment_Moscow_Form
            ),
            'final' => new Payment_Moscow_Pay
        ));
    }
}

?>
