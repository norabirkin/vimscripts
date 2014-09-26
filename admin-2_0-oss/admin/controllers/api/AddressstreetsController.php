<?php
class AddressstreetsController extends Controller{

    public function actionList() {
        $list = new OSSList( array("useSort" => false) );
        $list->get("getAddressStreets", array(
            "region_id" => (int)$this->param("region_id", 0),
            "city_id" => (int)$this->param("city_id", 0), 
            "settl_id" => (int)$this->param("settle_id", 0),
            "name" => $this->param("name")
        ));
    }

    public function actionUpdate() {
        $this->success(yii::app()->japi->callAndSend("setAddressStreet", array(
            "name" => $this->param("name", 0),
            "record_id" => (int) $this->param("record_id", 0),
            "postcode" => (int) $this->param("postcode", 0),
            "short" => $this->param("short", 0),
            "city_id" => (int) $this->param("city_id", 0),
            "region_id" => (int) $this->param("region_id", 0),
            "settl_id" => (int) $this->param("settl_id", 0)
        )));
    }

    public function actionCreate() {
        $this->success(yii::app()->japi->callAndSend("setAddressStreet", array(
            "name" => $this->param("name", 0),
            "postcode" => (int) $this->param("postcode", 0),
            "short" => $this->param("short", 0),
            "city_id" => (int) $this->param("city_id", 0),
            "region_id" => (int) $this->param("region_id", 0),
            "settl_id" => (int) $this->param("settl_id", 0)
        )));
    }
    
    public function actionDeletelist() {
        $this->deleteList( 'delAddressStreet', 'record_id' );
    }

} ?>
