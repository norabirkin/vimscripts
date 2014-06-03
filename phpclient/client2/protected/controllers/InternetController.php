<?php

class InternetController extends Controller_SectionWithConnectionSubSection {
    public function init() {
        parent::init();
        yii::import('application.components.dtv.*');
        yii::import('application.components.internet.*');
        yii::import('application.components.internet.turbo.*');
        yii::import('application.components.statistics.*');
        yii::import('application.components.tariff.*');
        yii::import('application.components.internet.mac.*');
        yii::import('application.components.tariff.changing.*');
        yii::import('application.components.tariff.changing.date.*');
        yii::import('application.components.vgroups.*');
        yii::import('application.components.tariff.schedule.*');
        yii::import('application.components.tariff.history.*');
        yii::import('application.components.statistics.*');
        yii::import('application.components.internet.statistics.*');
        yii::import('application.components.internet.statistics.helpers.*');
        yii::import('application.components.internet.tariff.changing.*');
        yii::import('application.components.internet.tariff.history.*');
    }
    public function actions() {
        return array(
            'tariffChanging' => 'application.components.internet.Internet_Tariff_Changing_Action',
            'tariffSchedule' => 'application.components.internet.Internet_Tariff_Schedule_Action',
            'tariffHistory' => 'application.components.internet.Internet_Tariff_History_Action',
            'statistics' => 'application.components.internet.statistics.Internet_Statistics_Action',
            'turbo' => 'application.components.internet.turbo.Internet_Turbo_Action',
            'mac' => 'application.components.internet.Internet_MAC_Action'
        );
    }
    public function vgroupType() {
        return 'internet';
    }
    public function actionIndex() {
        $this->output($this->getPage()->menu());
    }
    public function actionTariff() {
        $this->output($this->getPage()->menu());
    }
}

?>
