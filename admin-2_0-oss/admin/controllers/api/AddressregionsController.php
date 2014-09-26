<?php
class AddressregionsController extends Controller{

    public function actionList() {
        $list = new OSSList( array("useSort" => false) );
        $list->get("getAddressRegions", $this->params(array(
            "country_id" => "int",
            "name" => "string"
        )));
    }

    public function actionUpdate() {
        $this->success(yii::app()->japi->callAndSend("setAddressRegion", array(
            "country_id" => (int) $this->param("country_id", 0),
            "name" => $this->param("name", 0),
            "record_id" => (int) $this->param("record_id", 0),
            "short" => $this->param("short", 0)
        )));
    }

    public function actionCreate() {
        $this->success(yii::app()->japi->callAndSend("setAddressRegion", array(
            "country_id" => (int) $this->param("country_id", 0),
            "name" => $this->param("name", 0),
            "short" => $this->param("short", 0)
        )));
    }
    
    public function actionDeletelist() {
        $this->deleteList( 'delAddressRegion', 'record_id' );
    }

} ?>
