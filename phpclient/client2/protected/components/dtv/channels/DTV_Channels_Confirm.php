<?php

class DTV_Channels_Confirm extends LBWizardStep {
    public function init() {
        $this->subtitle();
    }
    public function output() {
        if (!$service = $this->service()) {
            throw new Exception('Service not found');
        }
        return $this->fnext(array(
            array(
                'type' => 'display',
                'label' => 'Account',
                'value' => $this->vgroup($this->param('vgid'))->vgroup->login
            ),
            array(
                'type' => 'display',
                'label' => 'Channel name',
                'value' => $service->descr
            ),
            array(
                'type' => 'display',
                'label' => 'Above',
                'value' => $this->price($service->above)
            ),
            array(
                'type' => 'submit',
                'value' => 'Confirm'
            )
        ))->render();
    }
}

?>
