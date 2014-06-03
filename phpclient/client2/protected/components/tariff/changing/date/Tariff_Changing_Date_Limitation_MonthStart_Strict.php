<?php

class Tariff_Changing_Date_Limitation_MonthStart_Strict extends Tariff_Changing_Date_Limitation_MonthStart {
    public function strict() {
        return true;
    }
    protected function __message() {
        return 'Attention! Tariff plan changing allowed only for 1-st day of next month after last planned tariff changing!';
    }
}

?>
