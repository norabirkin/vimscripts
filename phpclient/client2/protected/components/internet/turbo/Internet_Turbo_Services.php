<?php

class Internet_Turbo_Services extends LBWizardStep {
    public function output() {
        $turbo = new Internet_Turbo_Active;
        $services = new DTV_Services_Grid($this->wizard());
        return $services->idle(array(
            'title' => $this->title(),
            'data' => $this->helper()->services()
        )).
        $turbo->output();
    }
    public function title() {
        return 'Selecting service';
    }
}

?>
