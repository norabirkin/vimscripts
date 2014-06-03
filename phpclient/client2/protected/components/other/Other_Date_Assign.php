<?php

class Other_Date_Assign extends DTV_Confirm_Assign {
    public function __construct() {
        parent::__construct(array(
            'title' => 'Choose date of service assgnment'
        ));
    }
    protected function common() {
        return $this->param('common');
    }
    protected function __form() {
        $form = parent::__form();
        $form->add(array(
            'type' => 'servicePeriod',
            'label' => 'Period of service activity',
            'min' => date('Y-m-d'),
            'dtfrom' => date('Y-m-d'),
            'dtto' => ''
        ));
        return $form;
    }
}

?>
