<?php

class Internet_MAC_Final extends LBWizardFinalStep {
    public function execute() {
        $mac = $this->helper()->mac();
        $mac->mac = $this->param('mac');
        return $this->s('insupdMacStaff', (array) $mac, false);
    }
    protected function getSuccessMessage() {
        return 'MAC-address is successfully updated';
    }
    protected function getErrorMessage() {
        return 'Failed to update MAC-address';
    }
}

?>
