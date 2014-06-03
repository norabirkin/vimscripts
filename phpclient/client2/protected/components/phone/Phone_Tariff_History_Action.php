<?php

class Phone_Tariff_History_Action extends Tariff_History_Action {
    protected function __tariffType() {
        return new Phone_Tariff_Type;
    }
}

?>
