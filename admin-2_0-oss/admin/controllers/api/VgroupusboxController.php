<?php

class VgroupusboxController extends Controller {
    public function actionList() {
        $list = new OSSList(array(
            'useSort' => false
        ));
        $list->get('getUsboxServices', array(
            'vg_id' => (int) $this->param('vg_id'),
            'common' => (int) $this->param('common')
        ));
    }
    public function actionUpdate() {
        $this->success(yii::app()->japi->callAndSend('setUsboxService', array(
            'activated' => ((int) $this->param('common')) ? ((string) $this->param('activated')) : null,
            'block_discount' => (float) $this->param('block_discount'),
            'cat_idx' => (int) $this->param('cat_idx'),
            'comment' => (string) $this->param('comment'),
            'discount' => (float) $this->param('discount'),
            'discount_time_from' => ((int) $this->param('common')) ? ((string) $this->param('discount_time_from')) : null,
            'discount_time_to' => ((int) $this->param('common')) ? ((string) $this->param('discount_time_to')) : null,
            'external_data' => (string) $this->param('external_data'),
            'installment_duration' => (int) $this->param('installment_duration'),
            'installment_first_payment' => (float) $this->param('installment_first_payment'),
            'mul' => (float) $this->param('mul'),
            //'noduplicate' => (int) $this->param('noduplicate'),
            'plan_id' => (int) $this->param('installment_plan_id'),
            'rate' => (float) $this->param('rate'),
            'serv_id' => (int) $this->param('id'),
            'tar_id' => (int) $this->param('tar_id'),
            'time_from' => (string) $this->param('time_from'),
            'time_to' => ((int) $this->param('common')) ? ((string) $this->param('time_to')) : null,
            'vg_id' => (int) $this->param('vg_id')
        )));
    }
    public function actionCreate() {
        $this->success(yii::app()->japi->callAndSend('setUsboxService', array(
            'activated' => (string) $this->param('activated'),
            'block_discount' => (float) $this->param('block_discount'),
            'cat_idx' => (int) $this->param('cat_idx'),
            'comment' => (string) $this->param('comment'),
            'discount' => (float) $this->param('discount'),
            'discount_time_from' => (string) $this->param('discount_time_from'),
            'discount_time_to' => (string) $this->param('discount_time_to'),
            'external_data' => (string) $this->param('external_data'),
            'installment_duration' => (int) $this->param('installment_duration'),
            'installment_first_payment' => (float) $this->param('installment_first_payment'),
            'mul' => (float) $this->param('mul'),
            //'noduplicate' => (int) $this->param('noduplicate'),
            'plan_id' => (int) $this->param('plan_id'),
            'rate' => (float) $this->param('rate'),
            'tar_id' => (int) $this->param('tar_id'),
            'time_from' => (string) $this->param('time_from'),
            'time_to' => (string) $this->param('time_to'),
            'vg_id' => (int) $this->param('vg_id')
        )));
    }
    public function actionDelete() {
        $this->success(yii::app()->japi->callAndSend('delUsboxService', array(
            'serv_id' => (int) $this->param('serv_id')
        )));
    }
}

?>
