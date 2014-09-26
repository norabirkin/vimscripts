<?php
class AddresscitiesController extends Controller{

    public function actionList() {
        $list = new OSSList( array("useSort" => false) );
        $list->get("getAddressCities", $this->params(array(
            'region_id' => 'int',
            'area_id' => 'int',
            'name' => 'string'
        )));
    }

    public function actionUpdate() {
        $this->success(yii::app()->japi->callAndSend("setAddressCity", array(
            'region_id' => (int) $this->param('region_id', 0),
            'area_id' => (int) $this->param('area_id', 0),
            "name" => $this->param("name", 0),
            "record_id" => (int) $this->param("record_id", 0),
            "short" => $this->param("short", 0),
        )));
    }

    public function actionCreate() {
        $this->success(yii::app()->japi->callAndSend("setAddressCity", array(
            'region_id' => (int) $this->param('region_id', 0),
            'area_id' => (int) $this->param('area_id', 0),
            "name" => $this->param("name", 0),
            "short" => $this->param("short", 0),
        )));
    }
    
    public function actionDeletelist() {
        $this->deleteList( 'delAddressCity', 'record_id' );
    }
    
} ?>
