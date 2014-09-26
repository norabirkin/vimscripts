<?php
class AddressareasController extends Controller{

    public function actionList() {
        $list = new OSSList( array("useSort" => false) );
        $list->get("getAddressAreas", $this->params(array(
            'region_id' => 'int',
            'name' => 'string'
        )));
    }

    public function actionUpdate() {
        $this->success(yii::app()->japi->callAndSend("setAddressArea", array(
            "name" => $this->param("name", 0),
            "record_id" => (int) $this->param("record_id", 0),
            "region_id" => (int) $this->param("region_id", 0),
            "short" => $this->param("short", 0),
        )));
    }

    public function actionCreate() {
        $this->success(yii::app()->japi->callAndSend("setAddressArea", array(
            "name" => $this->param("name", 0),
            "region_id" => (int) $this->param("region_id", 0),
            "short" => $this->param("short", 0),
        )));
    }
    
    public function actionDeletelist() {
        $this->deleteList( 'delAddressArea', 'record_id' );
    }

} ?>
