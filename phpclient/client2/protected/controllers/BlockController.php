<?php

class BlockController extends Controller {
    public function actions() {
        return array(
            'managing' => 'application.components.block.Block_Action',
            'history' => 'application.components.block.history.Block_History_Action'
        );
    }
    public function actionIndex() {
        $this->output($this->getPage()->menu());
    }
    public function init() {
        parent::init();
        yii::import('application.components.statistics.Statistics_Page');
        yii::import('application.components.block.history.*');
        yii::import('application.components.block.*');
        yii::import('application.components.block.helpers.*');
        yii::import('application.components.dtv.DTV_Services_Grid');
    }
}

?>
