<?php

class TarCatDiscountsController extends Controller {
    public function actionList() {
        $data = array();
        foreach (yii::app()->japi->callAndSend('getTarCategoryDiscount', array(
            'tar_id' => (int)$this->param('tar_id'),
            'cat_idx' => (int)$this->param('cat_idx') 
        )) as $item) {
            foreach($item['discounts'] as $discount) {
                $data[] = $this->process($item, $discount);
            }
        }
        $this->success($data);
    }
    public function actionDeletelist() {
        $discounts = array();
        foreach (explode('.', $this->param('list', '')) as $id) {
            $discounts[] = array(
                'record_id' => (int) $id
            );
        }
        $this->success(
            yii::app()->japi->callAndSend('delTarCategoryDiscount', array(
                'tar_id' => (int)$this->param('tar_id'),
                'cat_idx' => (int)$this->param('cat_idx'),
                'discounts' => $discounts
            ))
        );
    }
    public function actionUpdate() {
        $this->save(array(
            'record_id'=> (int) $this->param('id')
        ));
    }
    public function actionCreate() {
        $this->save();
    }
    private function process($item, $discount) {
        unset($item['discounts']);
        return array_merge($item, $discount);
    }
    private function save($params = array()) {
        $this->success(
            yii::app()->japi->callAndSend('setTarCategoryDiscount', array(
                'tar_id' => (int) $this->param('tar_id'),
                'cat_idx' => (int) $this->param('cat_idx'),
                'object' => (int) $this->param('object'),
                'discounts' => array(
                    array_merge($params, array(
                        'count'=> (int) $this->param('count'),
                        'rate'=> (float) $this->param('rate')
                    ))
                )
            ))
        );
    }
}

?>
