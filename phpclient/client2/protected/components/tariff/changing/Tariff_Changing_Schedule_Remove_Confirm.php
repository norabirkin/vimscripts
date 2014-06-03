<?php

class Tariff_Changing_Schedule_Remove_Confirm extends LBWizardStep {
    private $record;
    public function output() {
        return $this->fnext(array(
            array(
                'type' => 'display',
                'label' => 'Account',
                'value' => $this->record()->vglogin
            ),
            array(
                'type' => 'display',
                'label' => 'Chosen tariff',
                'value' => $this->record()->tarnewname
            ),
            array(
                'type' => 'display',
                'label' => 'Date of tariff plan changing',
                'value' => $this->time($this->record()->changetime),
            ),
            array(
                'type' => 'submit',
                'value' => 'Confirm'
            )
        ))->render();
    }
    private function record() {
        if (!$this->record) {
            foreach ($this->helper()->schedule()->data() as $record) {
                if ($record->recordid == $this->param('recordid')) {
                    $this->record = $record;
                }
            }
            if (!$this->record) {
                throw new Exception('Record not found');
            }
        }
        return $this->record;
    }
    public function title() {
        return 'Confirmation of canceling tariff change';
    }
}

?>
