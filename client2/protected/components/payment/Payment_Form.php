<?php

class Payment_Form extends LBWizardStep {
    protected function agrmnum($agrmid = null) {
        if (!$agrmid) {
            $agrmid = $this->param('agrmid');
        }
        if (!$this->lb()->agreements[$agrmid]) {
            throw new Exception('Agreement not found');
        }
        return $this->lb()->agreements[$agrmid]->number;
    }
    protected function desc() {
        return base64_encode($this->t('Payment by agreement') . ' ' . $this->agrmnum());
    }
}

?>
