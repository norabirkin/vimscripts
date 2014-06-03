<?php

class DTV_Additional_Stop extends LBWizardFinalStep {
    public function execute() {
        return $this->usbox()->stop(array(
            'servid' => $this->param('servid')
        ));
    }
    protected function getSuccessMessage() {
        return 'Service successfully stopped';
    }
    protected function getErrorMessage() {
        return 'Failed to stop service';
    }
}

?>
