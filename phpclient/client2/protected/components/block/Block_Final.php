<?php

class Block_Final extends LBWizardFinalStep {
    public function execute() {
        if (!$this->param('date')) {
            throw new Exception('No date');
        }
        $struct = array(
            'id' => $this->vgroup()->vgroup->agentid,
            'vgid' => $this->param('vgid'),
            'blkreq' => $this->param('blkreq'),
            'requestby' => $this->lb()->client
        );
        if ($this->param('date') != date('Y-m-d')) {
            $struct['changetime'] = $this->param('date');
        }
        return $this->s('insBlkRasp', $struct, true);
    }
    protected function getSuccessMessage() {
        switch ($this->param('blkreq')) {
            case Block_Helper::ACTIVE:
                return array('Account {vgroup} is unlocked', array(
                    '{vgroup}' => $this->vgroup()->vgroup->login
                ));
            case Block_Helper::SWITCHED_OFF_BY_USER:
                return array('Account {vgroup} is locked', array(
                    '{vgroup}' => $this->vgroup()->vgroup->login
                ));
            default:
                throw new Exception('Invalid state');
        }
    }
    protected function getErrorMessage() {
        switch ($this->param('blkreq')) {
            case Block_Helper::ACTIVE:
                return array('Failed to unlock account {vgroup}', array(
                    '{vgroup}' => $this->vgroup()->vgroup->login
                ));
            case Block_Helper::SWITCHED_OFF_BY_USER:
                return array('Failed to lock account {vgroup}', array(
                    '{vgroup}' => $this->vgroup()->vgroup->login
                ));
            default:
                throw new Exception('Invalid state');
        }
    }
}

?>
