<?php

class Block_Confirm extends LBWizardStep {
    protected $submit = 'Confirm';
    public function output() {
        $form = $this->display();
        $form->add(array(
            'type' => 'submit',
            'value' => $this->submit
        ));
        return $form->render();
    }
    protected function display() {
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
                'type' => 'display',
                'label' => 'Date',
                'value' => $this->date($this->blockDate())
            )
        ));
    }
    protected function blockDate() {
        if (!$this->param('date')) {
            throw new Exception('No date');
        }
        return $this->param('date');
    }
    public function title() {
        switch ($this->param('blkreq')) {
            case Block_Helper::ACTIVE:
                return 'Confirm unlock';    
            case Block_Helper::SWITCHED_OFF_BY_USER:
                return 'Confirm lock';    
            default:
                throw new Exception('Invalid state');
        }
    }
}

?>
