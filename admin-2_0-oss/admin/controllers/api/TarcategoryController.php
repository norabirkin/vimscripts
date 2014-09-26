<?php

class TarcategoryController extends Controller {
    
    public function actionList() {
        $this->success( yii::app()->japi->callAndSend('getTarCategory', array(
            'tar_id' =>  (int) $this->getRequest()->getParam('tar_id', 0),
            'common' => (int) $this->param('common')
        )));
    }
    
    public function actionGet() {
        $this->success( yii::app()->japi->callAndSend('getTarCategory', array(
            "catidx" => (int) $this->getRequest()->getParam('id', 0),
            "tarid" => (int) $this->getRequest()->getParam('tarid', 0)
        )));
    }
    
    public function actionDelete() {
        $this->success( yii::app()->japi->callAndSend('delTarCategory', array(
            "catidx" => (int) $this->getRequest()->getParam('id', 0),
            "tarid" => (int) $this->getRequest()->getParam('tarid', 0)
        )));
    }

    public function actionRate() {
        $this->success(yii::app()->japi->callAndSend('getTarCategoryRate', array(
            'cat_idx' => (int) $this->param('cat_idx'),
            'tar_id' => (int) $this->param('tar_id'),
            'vg_id' => (int) $this->param('vg_id')
        )));
    }
    
}

?>
