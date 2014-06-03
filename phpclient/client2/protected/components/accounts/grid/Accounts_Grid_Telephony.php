<?php

class Accounts_Grid_Telephony extends Accounts_Grid {
    public function tariffHistoryUrl($vgid) {
        return yii::app()->controller->createUrl('phone/tariffHistory', array(
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
