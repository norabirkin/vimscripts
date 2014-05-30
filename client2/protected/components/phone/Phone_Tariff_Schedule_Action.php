<?php

class Phone_Tariff_Schedule_Action extends Tariff_Schedule_Action {
    protected function __tariffType() {
        return new Phone_Tariff_Type;
    }
}

?>
