<?php

class Internet_MAC_Form extends LBWizardStep {
    public function output() {
        return $this->fnext(array(
            array(
                'type' => 'display',
                'label' => 'Account',
                'value' => $this->vgroup()->vgroup->login
            ),
            array(
                'type' => 'ip',
                'label' => 'MAC-address',
                'value' => $this->helper()->mac()->mac,
                'name' => 'mac'
            ),
            array(
                'type' => 'submit',
                'text' => 'Save'
            )
        
        ))->render();
    }
    public function title() {
        return 'MAC-address';
    }
}

?>
