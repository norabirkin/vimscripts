<?php

class Other_Date_Stop extends DTV_Confirm_Stop {
    public function __construct() {
        parent::__construct(array(
            'title' => 'Choose date of service stopping'
        ));
    }
    protected function __form() {
        $form = parent::__form();
        $form->add(array(
            'type' => 'date',
            'label' => 'Date of stopping',
            'name' => 'date',
            'min' => date('Y-m-d'),
            'value' => date('Y-m-d')
        ));
        return $form;
    }
}

?>
