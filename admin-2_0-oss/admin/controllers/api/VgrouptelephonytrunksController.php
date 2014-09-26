<?php

class VgrouptelephonytrunksController extends Controller {
    public function actionList() {
        $list = new OSSList;
        $list->get('getVgTrunks', array(
            'vg_id' => (int) $this->param('vg_id')
        ));
    }
    public function actionUpdate() {
        $this->success(yii::app()->japi->callAndSend('setVgTrunk', array(
            'check_duplicate' => (bool) $this->param('check_duplicate'),
            'comment' => (string) $this->param('comment'),
            'number' => (string) $this->param('number'),
            'record_id' => (int) $this->param('id'),
            'time_from' => (string) $this->param('time_from'),
            'time_to' => (string) $this->param('time_to'),
            'vg_id' => (int) $this->param('vg_id')
        )));
    }
    public function actionDelete() {
        $this->success(yii::app()->japi->callAndSend('delVgTrunk', array(
            'record_id' => (int) $this->param('record_id')
        )));
    }

}

?>
