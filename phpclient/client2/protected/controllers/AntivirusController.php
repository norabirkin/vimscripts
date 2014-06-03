<?php

class AntivirusController extends Controller {
    public function actions() {
        return array(
            'index' => 'application.components.antivirus.Antivirus_Action'
        );
    }
    public function init() {
        parent::init();
        yii::import('application.components.antivirus.*');
        yii::import('application.components.tariff.*');
        yii::import('application.components.services.*');
        yii::import('application.components.dtv.*');
        yii::import('application.components.dtv.additional.*');
    }
    public function actionFail() {
        $this->output();
    }
}

?>
