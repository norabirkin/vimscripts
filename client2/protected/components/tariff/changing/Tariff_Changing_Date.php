<?php

class Tariff_Changing_Date extends LBWizardStep {
    private $vgroup;
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
                'type' => 'info',
                'value' => $this->helper()->dateLimitation()->message()
            ),
            $this->dateField(),
            array(
                'type' => 'submit',
                'value' => 'Change'
            )
        ))->render();
    }
    private function dateField() {
        $date = $this->helper()->dateLimitation()->minDate();
        if ($this->helper()->dateLimitation()->strict()) {
            return array(
                'type' => 'text',
                'name' => 'changetime',
                'label' => 'Date of tariff plan changing',
                'value' => $date,
                'options' => array(
                    'readonly' => true,
                    'style' => 'width: 90px;'
                )
            );
        } else {
            return array(
                'type' => 'date',
                'label' => 'Date of tariff plan changing',
                'name' => 'changetime',
                'note' => '(yyyy-mm-dd).',
                'value' => $date,
                'min' => $date
            );
        }
    }
    public function title() {
        return 'Choose date of tariff changing';
    }
}

?>
