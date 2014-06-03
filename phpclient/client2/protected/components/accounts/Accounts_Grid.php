<?php

class Accounts_Grid {
    public function tariffHistoryUrl($vgroup) {
        if (Vgroup_Type::check($vgroup, 'internet')) {
            $controller = 'internet';
        } elseif (Vgroup_Type::check($vgroup, 'telephony')) {
            $controller = 'phone';
        } else {
            return null;
        }
        return yii::app()->controller->createUrl($controller.'/tariffHistory', array(
            'step' => 2,
            'params' => array(
                2 => array(
                    'vgid' => $vgroup->vgroup->vgid
                )
            )
        ));
    }
    public function data($VG, $vgroup) {
        return array(
            'login' => $VG->getLoginColumnData($this),
            'tarifdescr' => $this->tarifdescr($vgroup),
            'rent' => LB_Style::price($vgroup->vgroup->servicerent),
            'services' => $VG->getServicesColumnData(),
            'state' => $VG->getStateColumnData()
        );
    }
    private function tarifdescr($vgroup) {
        if (!Vgroup_Type::check($vgroup, 'internet')) {
            return $vgroup->vgroup->tarifdescr;
        }
        yii::import('application.components.internet.Internet_Shape');
        $shape = new Internet_Shape;
        return array(
            'descr' => $vgroup->vgroup->tarifdescr,
            'shape' => $shape->getShape($vgroup)
        );
    }
    public function headers() {
        return array(
            yii::t('account', 'Account'),
            yii::t('account', 'Tariff'),
            yii::t('main', 'Rent'),
            yii::t('account', 'Assigned services'),
            yii::t('account', 'State')
        );
    }
}

?>
