<?php
class AddressfloorsController extends Controller{

    public function actionList() {
        $list = new OSSList( array("useSort" => false) );
        $list->get("getAddressFloors", $this->params(array(
            'region_id' => 'int',
            'building_id' => 'int',
            'name' => 'string'
        )));
    }

    public function actionUpdate() {
        $this->success(yii::app()->japi->callAndSend("setAddressFloor", array(
            'building_id' => (int) $this->param('building_id', 0),
            'name' => $this->param('name', ''),
            'record_id' => (int) $this->param('record_id', 0),
            'region_id' => (int) $this->param('region_id', 0),
            'short' => $this->param('short', '')
        )));
    }

    public function actionCreate() {
        $this->success(yii::app()->japi->callAndSend("setAddressFloor", array(
            'building_id' => (int) $this->param('building_id', 0),
            'name' => $this->param('name', ''),
            'region_id' => (int) $this->param('region_id', 0),
            'short' => $this->param('short', '')
        )));
    }
    
    public function actionDeletelist() {
        $this->deleteList( 'delAddressFloor', 'record_id' );
    }

} ?>
