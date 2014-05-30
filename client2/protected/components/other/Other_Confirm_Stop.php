<?php

class Other_Confirm_Stop extends DTV_Confirm_Stop {
    public function __construct() {
        parent::__construct(array(
            'title' => 'Confirmation of service stop'
        ));
    }
    protected function __form() {
        $form = parent::__form();
        $form->add(array(
            'type' => 'display',
            'label' => 'Date of stopping',
            'value' => $this->date($this->param('date'))
        ));
        return $form;
    }
}

?>
