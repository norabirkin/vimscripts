<?php

class Payment_Cards_Action extends LBWizardAction {
    public function __getWizard() {
        return new LBWizard(array(
            'steps' => array(
                new Payment_Agreements(array(
                    'title' => 'Choose agreement',
                    'all' => false
                )),
                new Payment_Cards_Form
            ),
            'final' => new Payment_Cards_Pay
        ));
    }
}

?>
