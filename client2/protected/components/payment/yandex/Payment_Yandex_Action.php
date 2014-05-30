<?php

class Payment_Yandex_Action extends LBWizardAction {
    public function __getWizard() {
        return new LBWizard(array(
            'steps' => array(
                new Payment_Agreements,
                new Payment_Yandex_Form
            ),
            'final' => new Payment_Yandex_Pay
        ));
    }
}

?>
