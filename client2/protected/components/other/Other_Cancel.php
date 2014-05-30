<?php

class Other_Cancel extends LBWizardFinalStep {
    public function execute() {
        return $this->usbox()->cancel($this->param('servid'));
    }
    protected function getSuccessMessage() {
        return 'Service assigning is successfully cancelled';
    }
    protected function getErrorMessage() {
        return 'Failed to cancel service assigning';
    }
}

?>
