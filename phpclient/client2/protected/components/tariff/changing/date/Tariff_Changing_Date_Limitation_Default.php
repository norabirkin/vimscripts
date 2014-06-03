<?php

class Tariff_Changing_Date_Limitation_Default extends Tariff_Changing_Date_Limitation {
    protected function __message() {
        return null;
    }
    public function strict() {
        return false;
    }
    protected function __minDate() {
        return $this->min() + ($this->tarrasp() ? 86400 : 0);
    }
}

?>
