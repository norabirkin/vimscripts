<?php

class Internet_Statistics_Action extends Tariff_Action {
    public function __getWizard() {
        return new LBWizard(array(
            'steps' => array(
                new Vgroups_Grid,
                new Internet_Tariff_Statistics_Detail
            ),
            'helper' => new Internet_Statistics_Helper
        ));
    }
    protected function __tariffType() {
        return new Internet_Tariff_Type;
    }
}

?>
