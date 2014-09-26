<?php
class AddresssettlesController extends Controller{

    public function actionList() {
        $list = new OSSList( array("useSort" => false) );
        $list->get("getAddressSettles", $this->params(array(
            'region_id' => 'int',
            'area_id' => 'int',
            'city_id' => 'int',
            'name' => 'string'
        )));
    }

    public function actionUpdate() {
        $this->success(yii::app()->japi->callAndSend("setAddressSettle", array(
            "name" => $this->param("name", 0),
            "record_id" => (int) $this->param("record_id", 0),
            "short" => $this->param("short", 0),
            "area_id" => (int) $this->param("area_id", 0),
            "city_id" => (int) $this->param("city_id", 0),
            "region_id" => (int) $this->param("region_id", 0),
        )));
    }

    public function actionCreate() {
        $this->success(yii::app()->japi->callAndSend("setAddressSettle", array(
            "name" => $this->param("name", 0),
            "short" => $this->param("short", 0),
            "area_id" => (int) $this->param("area_id", 0),
            "city_id" => (int) $this->param("city_id", 0),
            "region_id" => (int) $this->param("region_id", 0),
        )));
    }
    
    public function actionDeletelist() {
        $this->deleteList( 'delAddressSettle', 'record_id' );
    }

} ?>
