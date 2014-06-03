<?php

class Invoice_Charges_Action extends LBWizardAction {
    public function __getWizard() {
        return new LBWizard(array(
            'steps' => array(
            	new Invoice_Charges_Info
            )
        ));
    }
}

?>
