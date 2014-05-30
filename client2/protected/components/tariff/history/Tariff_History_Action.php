<?php

class Tariff_History_Action extends Tariff_Action {
    public function __getWizard() {
        return new LBWizard(array(
            'steps' => array(
                $this->getTariffHistoryVgroupsStep(),
                new Tariff_History_Detail
            ),
            'helper' => new Tariff_Helper
        ));
    }
    protected function getTariffHistoryVgroupsStep() {
        return new Vgroups_Grid;
    }
}

?>
