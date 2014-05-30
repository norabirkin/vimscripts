<?php

class Internet_Tariff_Changing_Action extends Tariff_Changing_Action {
    protected function __tariffType() {
        return new Internet_Tariff_Type;
    }
    protected function getTariffChangingVgroupsStep() {
        return new Internet_Tariff_Changing_Vgroups;
    }
}

?>
