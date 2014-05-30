<?php

class DTV_Equipment_Join_Confirm extends LBWizardStep {
    public function init() {
        $this->subtitle();
    }
    public function output() {
        $display = $this->prev()->display();
        $display[] = array(
            'type' => 'display',
            'label' => 'Equipment',
            'value' => $this->helper()
               ->eq()
               ->equipment(
                   $this->param('equipid')
               )
               ->equipment
               ->name
        );
        $display[] = array(
            'type' => 'submit',
            'value' => 'Confirm'
        );
        return $this->fnext($display)->render();
    }
    public function title() {
        return 'Confirm equipment join';
    }
}

?>
