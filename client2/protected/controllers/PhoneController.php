<?php
class PhoneController extends Controller_SectionWithConnectionSubSection {

    /**
     * Phones menu. Main page.
     */
    public function actionIndex() {
        $this->output($this->getPage()->menu());
    }

    public function vgroupType() {
        return 'telephony';
    }
    
    public function actions() {
        return array(
            'tariffChanging' => 'application.components.phone.Phone_Tariff_Changing_Action',
            'tariffSchedule' => 'application.components.phone.Phone_Tariff_Schedule_Action',
            'tariffHistory' => 'application.components.phone.Phone_Tariff_History_Action',
            'statistics' => 'application.components.phone.statistics.Phone_Statistics_Action'
        );
    }
    public function actionTariff() {
        $this->output($this->getPage()->menu());
    }
    public function init() {
        parent::init();
        yii::import('application.components.phone.*');
        yii::import('application.components.statistics.*');
        yii::import('application.components.phone.statistics.*');
        yii::import('application.components.tariff.*');
        yii::import('application.components.tariff.changing.*');
        yii::import('application.components.tariff.changing.date.*');
        yii::import('application.components.vgroups.*');
        yii::import('application.components.tariff.schedule.*');
        yii::import('application.components.tariff.history.*');
    }
}
