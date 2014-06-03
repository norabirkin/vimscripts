<?php

class Phone_Tariff_Changing_Action extends Tariff_Changing_Action {
    protected function __tariffType() {
        return new Phone_Tariff_Type;
    }
}

?>
