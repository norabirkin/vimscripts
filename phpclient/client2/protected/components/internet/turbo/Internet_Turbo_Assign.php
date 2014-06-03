<?php

class Internet_Turbo_Assign extends LBWizardFinalStep {
    public function execute() {
        return $this->usbox()->schedule(array(
            'vgid' =>  $this->helper()->service()->vgid,
            'catidx' => $this->param('catidx'),
            'mul' => $this->param('mul'),
            'comment' => $this->param('vgid')
        ), true);
    }
    protected function getSuccessMessage() {
        return 'Turbo service successfully assigned';
    }
    protected function getErrorMessage() {
        return 'Failed to assign turbo service';
    }
    public function getRedirectUrl() {
        return $this->url(5, array('done' => 1));
    }
}

?>
