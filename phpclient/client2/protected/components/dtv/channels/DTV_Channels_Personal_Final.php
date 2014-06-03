<?php

class DTV_Channels_Personal_Final extends LBWizardFinalStep {
    public function execute() {
        foreach ($this->helper()->personal('stop') as $service) {
            if (!$this->usbox()->stop(array(
                'servid' => $service->service->servid
            ))) {
                return false;
            }
        }
        foreach ($this->helper()->personal('assign') as $service) {
            if (!$this->usbox()->schedule(array(
                'vgid' => $this->param('vgid'),
                'common' => 1,
                'catidx' => $service->catidx
            ))) {
                return false;
            }
        }
        return true;
    }
    protected function getSuccessMessage() {
        return 'List of channels was successfully update';
    }
    protected function getErrorMessage() {
        return 'Failed to update list of channels';
    }
}

?>
