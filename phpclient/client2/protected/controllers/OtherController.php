<?php

class OtherController extends Controller {
    public function actions() {
        return array(
            'index' => 'application.components.other.Other_Action',
            'tariffChanging' => 'application.components.other.Other_Tariff_Changing_Action'
        );
    }
    public function init() {
        parent::init();
        yii::import('application.components.dtv.*');
        yii::import('application.components.dtv.additional.*');
        yii::import('application.components.other.*');
        yii::import('application.components.antivirus.*');
        yii::import('application.components.internet.turbo.*');
        yii::import('application.components.tariff.*');
        yii::import('application.components.tariff.changing.*');
        yii::import('application.components.tariff.changing.date.*');
    }
}

?>
