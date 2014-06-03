<?php

class DTV_Equipment_Join_List extends LBWizardStep {
    public function display() {
        return array(
            array(
                'type' => 'display',
                'label' => 'Smartcard',
                'value' => $this->helper()->eq()->smartcard()->smartcard->name
            ),
            array(
                'type' => 'display',
                'label' => 'Account',
                'value' => $this->vgroup($this->helper()->eq()->smartcard()->smartcard->vgid)->vgroup->login
            ),
            array(
                'type' => 'display',
                'label' => 'Agreement',
                'value' => $this->agreement($this->vgroup($this->helper()->eq()->smartcard()->smartcard->vgid)->vgroup->agrmid)->number
            )
        );
    }
    public function output() {
        return $this->form(
            $this->display()
        )
        ->render() .
        $this->helper()
        ->eq()
        ->binded('none')
        ->output();
    }
    public function title() {
        return $this->t('Join equipment to smartcard {name}', array(
            '{name}' => $this->helper()->eq()->smartcard()->smartcard->name
        ));
    }
}

?>
