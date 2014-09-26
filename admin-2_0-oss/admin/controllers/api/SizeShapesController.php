<?php

class SizeShapesController extends Controller {
    public function actionList() {
        $this->success(yii::app()->japi->callAndSend('getTarSizeShapes', array(
            'tar_id' => (int) $this->param('tar_id')
        )));
    }
    public function actionDeletelist() {
        $this->deleteList('delTarSizeShape', 'id');
    }
    public function actionUpdate() {
        $this->save(array(
            'id' => (int) $this->param('id')
        ));
    }
    public function actionCreate() {
        $this->save();
    }
    public function save($params = array()) {
        $this->success(yii::app()->japi->callAndSend('setTarSizeShape', array_merge($params, array(
            'amount' => (int) $this->param('amount'),
            'shape_rate' => (int) $this->param('shape_rate'),
            'tar_id' => (int) $this->param('tar_id')
        ))));
    }
}

?>
