<?php

class VgrouplocksController extends Controller {
    public function actionList() {
        $list = new OSSList(array(
            'sortProperties' => array(
                'change_time' => 'change_time'
            )
        ));
        $list->get('getVgBlockList', array(
            'vg_id' => (int) $this->param('vg_id')
        ));
    }
    public function actionDelete() {
        $this->success(yii::app()->japi->callAndSend('delVgBlockSchedule', array(
            'record_id' => (int) $this->param('record_id')
        )));
    }
    public function actionCreate() {
        $this->success(yii::app()->japi->callAndSend('setVgBlockSchedule', array(
            'blk_req' => (int) $this->param('blk_req'),
            'change_time' => (string) $this->param('change_time'),
            'vg_id' => (int) $this->param('vg_id')
        )));
    }
}

?>
