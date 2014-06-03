<?php

class Other_Confirm_Assign extends DTV_Confirm_Assign {
    public function __construct() {
        parent::__construct(array(
            'title' => 'Confirmation of service assign'
        ));
    }
    protected function common() {
        return $this->param('common');
    }
    protected function __form() {
        $form = parent::__form();
        $form->add(array(
            'type' => 'display',
            'label' => 'From',
            'value' => $this->date($this->param('dtfrom'))
        ));
        $form->add(array(
            'type' => 'display',
            'label' => 'To',
            'value' => $this->date($this->param('dtto'), $this->t('Unlimited')) 
        ));
        return $form;
    }
}

?>
