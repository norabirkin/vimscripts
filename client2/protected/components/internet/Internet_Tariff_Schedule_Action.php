<?php

class Internet_Tariff_Schedule_Action extends Tariff_Schedule_Action {
    protected function __tariffType() {
        return new Internet_Tariff_Type;
    }
}

?>
