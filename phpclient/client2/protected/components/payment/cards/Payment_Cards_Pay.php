<?php

class Payment_Cards_Pay extends LBWizardFinalStep {
    public function execute() {
        return $this->g('actClientCard', array(
            "agrm"   => $this->param('agrmid'),
            "key"    => $this->param('card_code'),
            "serial" => $this->param('card_serial')
        ));
    }
    protected function getSuccessMessage() {
        return 'Payment card accepted';
    }
    protected function getErrorMessage() {
        return 'Payment card is not accepted';
    }
}

?>
