<?php

class Accounts_Grid_Internet extends Accounts_Grid {
    protected function addColumns($data, $VG, $vgroup) {
    }
    public function tariffHistoryUrl($vgid) {
        return yii::app()->controller->createUrl('internet/tariffHistory', array(
            'step' => 2,
            'params' => array(
                2 => array(
                    'vgid' => $vgid
                )
            )
        ));
    }
}

?>
