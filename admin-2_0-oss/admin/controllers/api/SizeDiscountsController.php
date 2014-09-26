<?php

class SizeDiscountsController extends Controller {
    public function actionDeletelist() {
        $this->deleteList('delTarCatSizeDiscount', 'dis_id');
    }
    public function actionList() {
        $this->success(yii::app()->japi->callAndSend('getTarCatSizeDiscounts', array(
            'tar_id' => (int) $this->param('tar_id'),
            'cat_idx' => (int) $this->param('cat_idx')
        )));
    }
    public function actionUpdate() {
        $this->save(array(
            'dis_id' => (int) $this->param('id')
        ));
    }
    public function actionCreate() {
        $this->save();
    }
    private function save($params = array()) {
        $this->success(yii::app()->japi->callAndSend('setTarCatSizeDiscount', array_merge(array(
            'amount' => (int) $this->param('amount'),
            'bonus' => (float) $this->param('bonus'),
            'cat_idx' => (int) $this->param('cat_idx'),
            'dis_id' => (int) $this->param('dis_id'),
            'discount' => (float) $this->param('discount'),
            'tar_id' => (int) $this->param('tar_id'),
            'type' => (int) $this->param('type')
        ), $params)));
    }
}

?>
