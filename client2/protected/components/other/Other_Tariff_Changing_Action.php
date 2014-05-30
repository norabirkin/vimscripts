<?php

class Other_Tariff_Changing_Action extends Tariff_Changing_Action {
    protected function __tariffType() {
        return new Services_Tariff_Type;
    }
}

?>
