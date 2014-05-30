<?php

class Block_Cancel_Final extends LBWizardFinalStep {
    public function execute() {
        return $this->d('delBlkRasp', array(
            'id' => $this->vgroup()->blockrasp->recordid
        ));
    }
    protected function getSuccessMessage() {
        switch ($this->vgroup()->blockrasp->blkreq) {
            case Block_Helper::ACTIVE:
                return array('Unlocking of account {vgroup} is canceled', array(
                    '{vgroup}' => $this->vgroup()->vgroup->login
                ));
            case Block_Helper::SWITCHED_OFF_BY_USER:
                return array('Locking of account {vgroup} is canceled', array(
                    '{vgroup}' => $this->vgroup()->vgroup->login
                ));
            default:
                throw new Exception('Invalid state');
        }
    }
    protected function getErrorMessage() {
        switch ($this->vgroup()->blockrasp->blkreq) {
            case Block_Helper::ACTIVE:
                return array('Failed to cancel unlocking', array(
                    '{vgroup}' => $this->vgroup()->vgroup->login
                ));
            case Block_Helper::SWITCHED_OFF_BY_USER:
                return array('Failed to cancel locking', array(
                    '{vgroup}' => $this->vgroup()->vgroup->login
                ));
            default:
                throw new Exception('Invalid state');
        }
    }
}

?>
