<?php

class Block_Date extends LBWizardStep {
    public function output() {
        return $this->fnext(array(
            array(
                'type' => 'display',
                'label' => 'Agreement',
                'value' => $this->agreement()->number
            ),
            array(  
                'type' => 'display',
                'label' => 'Account',
                'value' => $this->vgroup()->vgroup->login
            ),
            array(
                'type' => 'date',
                'label' => 'Date',
                'name' => 'date',
                'min' => date('Y-m-d', $this->helper()->minDate()),
                'value' => date('Y-m-d', $this->helper()->minDate())
            ),
            array(
                'type' => 'submit',
                'value' => 'Apply'
            )
        ))->render();
    }
    public function title() {
        switch ($this->param('blkreq')) {
            case Block_Helper::ACTIVE:
                return 'Choose date for unlocking account';
                break;
            case Block_Helper::SWITCHED_OFF_BY_USER:
                return 'Choose date for locking account';
                break;
            default: 
                throw new Exception('Invalid state');
                break;
        }
    }
}

?>
