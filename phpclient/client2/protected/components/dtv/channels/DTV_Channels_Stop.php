<?php

class DTV_Channels_Stop extends LBWizardFinalStep {
    public function execute() {
        return $this->usbox()->stop(array(
            'servid' => $this->param('servid')
        ));
    }
    protected function getSuccessMessage() {
        return 'Channel successfully stopped';
    }
    protected function getErrorMessage() {
        return 'Failed to stop channel';
    }
}

?>
