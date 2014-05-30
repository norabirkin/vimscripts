<?php

abstract class Tariff_Type extends LBWizardItem {
    abstract public function check($tariftype, $vgroup = null);
    public function getRent($vgroup) {
        return $vgroup->vgroup->servicerent;
    }
}

?>
