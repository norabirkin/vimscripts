<?php

class Internet_Tariff_Type extends Tariff_Type {
    public function check($tariftype, $vgroup = null) {
        return $tariftype < 3;
    }
}

?>
