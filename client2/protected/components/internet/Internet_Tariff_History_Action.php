<?php

class Internet_Tariff_History_Action extends Tariff_History_Action {
    protected function __tariffType() {
        return new Internet_Tariff_Type;
    }
    protected function getTariffHistoryVgroupsStep() {
        return new Internet_Tariff_History_Vgroups;
    }
}

?>
