<?php
class ManagersrolesController  extends Controller {
    
    public function actionList() {
        $this->success( yii::app()->japi->callAndSend('getRoles') );
    }

    public function actionDelete() {
        $this->success( yii::app()->japi->callAndSend( 'delRole', array(
            "record_id" => (int) $this->getRequest()->getParam('record_id')
        )));
    }

    public function actionSave() { 
        $params = array(
            "record_id"                 => (int)$this->param("record_id"), 
            "name"                    => (string)$this->param("name"),
            "descr"                     => (string)$this->param("descr")
        );
        $this->success( yii::app()->japi->callAndSend('setRole', $params)); 
    }
      
    
} ?>
