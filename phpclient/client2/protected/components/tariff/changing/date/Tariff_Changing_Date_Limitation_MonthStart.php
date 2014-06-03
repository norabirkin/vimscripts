<?php

class Tariff_Changing_Date_Limitation_MonthStart extends Tariff_Changing_Date_Limitation {
    protected function __minDate() {
        return $this->nextMonthFirstDay($this->min());
    }
    public function strict() {
        return false;
    }
    protected function __message() {
        return 'Attention! Tariff plan changing allowed not early than 1-st day of next month after last planned tariff changing!';
    }
}

?>
