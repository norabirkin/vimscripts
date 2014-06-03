<?php

class DTV_Equipment_Detach_Confirm extends LBWizardStep {
    public function init() {
        $this->subtitle();
    }
    public function output() {
        return $this->fnext(array(
            array(
                'type' => 'display',
                'label' => 'Smartcard',
                'value' => $this->smartcard()->smartcard->name
            ),
            array(
                'type' => 'display',
                'label' => 'Account',
                'value' => $this->vgroup()->vgroup->login
            ),
            array(
                'type' => 'display',
                'label' => 'Agreement',
                'value' => $this->agreement()->number
            ),
            array(
                'type' => 'display',
                'label' => 'Equipment',
                'value' => $this->equipment()->equipment->name
            ),
            array(
                'type' => 'submit',
                'value' => 'Confirm'
            )
        ))->render();
    }
    public function agreement() {
        return parent::agreement($this->vgroup()->vgroup->agrmid);
    }
    public function vgroup() {
        return parent::vgroup($this->smartcard()->smartcard->vgid);
    }
    public function smartcard() {
        return $this->helper()->eq()->smartcard($this->equipment()->equipment->cardid);
    }
    public function equipment() {
        return $this->helper()->eq()->equipment($this->param('equipid'));
    }
    public function title() {
        return 'Confirm equipment detach';
    }
}

?>
