<?php

class DTV_Additional extends LBWizardStep {
    public function output() {
        $services = new DTV_Services_Grid(array(
            'dtvtype' => 3,
            'wizard' => $this->wizard(),
            'periodic' => false,
            'title' => array(
                'active' => 'Active services',
                'idle' => 'Available services',
                'catdescr' => 'Service name'
            )
        ));
        return $services->active() .
        $services->idle();
    }
    public function title() {
        return 'Choose service';
    }
}

?>
