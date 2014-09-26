<?php

class TimeDiscountsController extends Controller {
    public function actionDeletelist() {
        $this->deleteList('delTarCatTimeDiscount', 'dis_id');
    }
    public function actionList() {
        yii::import('application.components.tariffs.Tariffs_Week');
        $week = new Tariffs_Week;
        $results = array();
        foreach (($discounts = yii::app()->japi->callAndSend('getTarCatTimeDiscounts', array(
            'tar_id' => (int) $this->param('tar_id'),
            'cat_idx' => (int) $this->param('cat_idx')
        ))) as $item) {
            $results[] = array(
                'cat_idx' => $item['cat_idx'],
                'dis_id' => $item['dis_id'],
                'discount' => $item['discount'],
                'tar_id' => $item['tar_id'],
                'time_from' => $item['time_from'],
                'time_to' => $item['time_to'],
                'type' => $item['type'],
                'use_weekend' => (int) $item['use_weekend'],
                'inline' => $week->weekInline($item['week'])
            );
        }
        $this->success($results);
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
        yii::import('application.components.tariffs.Tariffs_Week');
        $week = new Tariffs_Week;
        $this->success(yii::app()->japi->callAndSend('setTarCatTimeDiscount', array_merge(array(
            'cat_idx' => (int) $this->param('cat_idx'),
            'discount' => (float) $this->param('discount'),
            'tar_id' => (int) $this->param('tar_id'),
            'time_from' => (string) $this->param('time_from'),
            'time_to' => (string) $this->param('time_to'),
            'type' => (int) $this->param('type'),
            'use_weekend' => (bool) $this->param('use_weekend'),
            'week' => $week->weekExploded((string) $this->param('inline'))
        ), $params)));
    }
}

?>
