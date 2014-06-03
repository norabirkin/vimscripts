<?php

class Other_Helper extends LBWizardItem {
    public function dateField(LB_Form $form) {
        $form->add(array(
            'type' => 'date',
            'label' => 'Date',
            'name' => 'date',
            'min' => date('Y-m-d'),
            'value' => date('Y-m-d')
        ));
        return $form;
    }
    public function dateDisplay(LB_Form $form) {
        $form->add(array(
            'type' => 'display',
            'label' => 'Date',
            'value' => $this->date($this->param('date'))
        ));
        return $form;
    }
    public function dateConfig() {
        return array(
            'title' => 'Choose date'
        );
    }
}

?>
