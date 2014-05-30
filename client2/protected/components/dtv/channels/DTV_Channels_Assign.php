<?php

class DTV_Channels_Assign extends LBWizardFinalStep {
    public function getRedirectUrl() {
        return $this->url(3, array(
            'done' => 1
        ));
    }
    public function execute() {
        return $this->usbox()->schedule(array(
            'vgid' => $this->param('vgid'),
            'common' => 1,
            'catidx' => $this->param('catidx')
        ));
    }
    protected function getSuccessMessage() {
        return 'Channel successfully assigned';
    }
    protected function getErrorMessage() {
        return 'Failed to assign channel';
    }
}

?>
