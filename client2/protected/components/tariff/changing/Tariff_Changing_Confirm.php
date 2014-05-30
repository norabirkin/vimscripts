<?php

class Tariff_Changing_Confirm extends LBWizardStep {
    public function output() {
        return $this->fnext(array(
            array(
                'type' => 'display',
                'label' => 'Account',
                'value' => $this->vgroup()->vgroup->login
            ),
            array(
                'type' => 'display',
                'label' => 'Chosen tariff',
                'value' => $this->helper()->newTariff()->tarname
            ),
            array(
                'type' => 'display',
                'label' => 'Date of tariff plan changing',
                'value' => $this->time($this->param('changetime'))
            ),
            array(
                'type' => 'submit',
                'value' => 'Change'
            )
        ))->render();
    }
    public function title() {
        return 'Confirmation of tariff changing';
    }
}

?>
