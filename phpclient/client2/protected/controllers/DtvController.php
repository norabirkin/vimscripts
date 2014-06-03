<?php
class DtvController extends Controller_SectionWithConnectionSubSection {

    /**
     * Phones menu. Main page.
     */
    public function actionIndex() {
        $this->output($this->getPage()->menu());
    }

    public function shouldHide($page) {
        return $page->route() != 'dtv/additional';
    }
    
    public function vgroupType() {
        return 'tv';
    }

    public function actions() {
        return array(
            'equipment' => 'application.components.dtv.equipment.DTV_Equipment_Action',
            'channels' => 'application.components.dtv.channels.DTV_Channels_Action',
            'additional' => 'application.components.dtv.additional.DTV_Additional_Action'
        );
    }
    public function init() {
        parent::init();
        yii::import('application.components.dtv.*');
        yii::import('application.components.dtv.additional.*');
        yii::import('application.components.vgroups.Vgroups_Grid');
        yii::import('application.components.dtv.equipment.*');
        yii::import('application.components.dtv.channels.*');
        yii::import('application.components.dtv.channels.helpers.*');
        yii::import('application.components.dtv.equipment.helpers.*');
        yii::import('application.components.tariff.Tariff_Type');
        yii::import('application.components.tariff.Tariff_Action');
    }
}
