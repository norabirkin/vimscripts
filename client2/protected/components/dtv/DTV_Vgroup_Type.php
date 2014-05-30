<?php

class DTV_Vgroup_Type extends Services_Tariff_Type {
    public function check($tariftype, $vgroup = null) {
        return $vgroup->vgroup->tariftype == 5 AND $vgroup->vgroup->usecas == 1;
    }
}

?>
