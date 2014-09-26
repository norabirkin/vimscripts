<?php

class VgrouptelephonynumbersController extends Controller {
    public function actionList() {
        $list = new OSSList;
        $list->get('getVgPhones', array(
            'vg_id' => (int) $this->param('vg_id')
        ));
    }
    public function actionUpdate() {
        $this->success(yii::app()->japi->callAndSend('setVgPhone', array(
            'record_id' => (int) $this->param('id'),
            'vg_id' => (int) $this->param('vg_id'),
            'device' => (int) $this->param('device'),
            'number' => (string) $this->param('number'),
            'time_from' => (string) $this->param('time_from'),
            'time_to' => (string) $this->param('time_to'),
            'comment' => (string) $this->param('comment'),
            'check_duplicate' => (bool) $this->param('check_duplicate')
        )));
    }
    public function actionDelete() {
        $this->success(yii::app()->japi->callAndSend('delVgPhone', array(
            'record_id' => (int) $this->param('record_id')
        )));
    }
}

?>
