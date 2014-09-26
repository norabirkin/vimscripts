<?php
class TelclassController extends Controller {
    
    public function actionList() {
        $this->success( yii::app()->japi->callAndSend('getTelClasses') );
    }
    
    public function actionCreate() {
        $this->success( yii::app()->japi->callAndSend('setTelClass', array(
            "color" => (int) $this->param( "color" ),
            "extern_code" => $this->param( "extern_code" ),
            "name" => $this->param( "name" ),
            "descr" => $this->param( "descr" )
        )));
    }
    
    public function actionUpdate() {
        $this->success( yii::app()->japi->callAndSend('setTelClass', array(
            "id" => (int) $this->param("id"),
            "color" => (int) $this->param( "color" ),
            "extern_code" => $this->param( "extern_code" ),
            "name" => $this->param( "name" ),
            "descr" => $this->param( "descr" )
        )));
    }
    
    public function actionDelete() {
        $this->success( yii::app()->japi->callAndSend('delTelClass', array(
            "class_id" => (int) $this->param("id")
        )));
    }
    
    public function actionDeletelist() {
        $ids = explode( ".", $this->param("list", "") );
        if (!$ids) {
            return;
        }
        foreach ($ids as $id) {
            yii::app()->japi->call('delTelClass', array(
                "class_id" => (int) $id
            ));
        }
        yii::app()->japi->send( true );
        $this->success(true);
    }
    
} ?>
