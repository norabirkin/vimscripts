<?php

class DTV_Additional_Assign extends LBWizardFinalStep {
    private $multiple = false;
    public function __construct($multiple = false) {
        $this->multiple = (bool) $multiple;
    }
    public function execute() {
        return $this->usbox()->schedule(array(
            'vgid' => $this->param('vgid'),
            'timefrom' => $this->param('dtfrom'),
            'timeto' => $this->param('dtto'),
            'catidx' => $this->param('catidx')
        ), $this->multiple);
    }
    protected function getSuccessMessage() {
        return 'Service successfully assigned';
    }
    protected function getErrorMessage() {
        return 'Failed to assign servie';
    }
}

?>
