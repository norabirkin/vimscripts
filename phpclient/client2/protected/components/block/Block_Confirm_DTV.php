<?php

class Block_Confirm_DTV extends Block_Confirm {
    protected function display() {
        $form = parent::display();
        $form->add(array(
            'type' => 'display',
            'label' => 'Following services will be stopped',
            'value' => $this->services()
        ));
        return $form;
    }
    public function services() {
        $descrs = array();
        foreach ($this->helper()->assignedServices_ThatCanBeKeptTurnedOn() as $service) {
            $descrs[] = $service->descr;
        }
        return implode(', ', $descrs);
    }
}

?>
