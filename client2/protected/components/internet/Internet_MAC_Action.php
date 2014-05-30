<?php

class Internet_MAC_Action extends Tariff_Action {
    public function __getWizard() {
        return new LBWizard(array(
            'steps' => array(
                new Internet_MAC_Vgroups,
                new Internet_MAC_Grid,
                new Internet_MAC_Form
            ),
            'style' => 'steps',
            'final' => new Internet_MAC_Final,
            'helper' => new Internet_MAC_Helper
        ));
    }
    protected function __tariffType() {
        return new Internet_Tariff_Type;
    }
}

?>
