<?php

class VgroupmacaddressController extends Controller {
    public function actionList() {
        $this->success(yii::app()->japi->callAndSend('getVgMacAddrs', array(
            'vg_id' => (int) $this->param('vg_id')
        )));
    }
    public function actionDelete() {
        $this->success(yii::app()->japi->callAndSend('delVgMacAddr', array(
            'record_id' => $this->param('record_id')
        )));
    }
}

?>
