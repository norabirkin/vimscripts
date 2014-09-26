<?php

class CatmodifiersController extends Controller {
    public function actionCreate() {
        $data = array();
        foreach (CJSON::decode($this->param('modifiers'), true) as $item) {
            $data[] = array(
                'cat_idx' => (int) $item['cat_idx'],
                'class_id' => (int) $item['class_id'],
                'discount' => (float) $item['discount'],
                'includes' => (int) $item['includes'],
                'rate' => (float) $item['rate']
            );
        }
        $this->success( yii::app()->japi->callAndSend('setVgModifiers', array(
            'tar_id_new' => (int) $this->param('tar_id_new'),
            'vg_id' => (int) $this->param('id'),
            'cat_discounts' => $data
        )));
    }
    public function actionGet() {
        $list = new OSSList;
        $list->get('getCategoryModifiers', array(
            'record_id' => (int) $this->param('id')
        ));
    }
}

?>
