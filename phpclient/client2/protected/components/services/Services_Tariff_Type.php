<?php

class Services_Tariff_Type extends Tariff_Type {
    public function check($tariftype, $vgroup = null) {
        return $tariftype == 5;
    }
    public function getRent($vgroup) {
        $rent = 0;
        foreach ($this->usbox(array(
            'vgid' => $vgroup->vgroup->vgid
        ))
        ->active() as $category) {
           $rent += $category->above;
        }
        return $rent;
    }
}

?>
