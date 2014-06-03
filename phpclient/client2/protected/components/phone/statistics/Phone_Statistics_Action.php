<?php

class Phone_Statistics_Action extends Tariff_Action {
    public function __getWizard() {
        return new LBWizard(array(
            'steps' => array(
                new Vgroups_Grid,
                new Phone_Statistics_Detail
            )
        ));
    }
    protected function __tariffType() {
        return new Phone_Tariff_Type;
    }
}

?>
