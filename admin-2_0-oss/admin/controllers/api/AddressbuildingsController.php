<?php
class AddressbuildingsController extends Controller{

    public function actionList() {
        $list = new OSSList( array("useSort" => false) );
        $buildings = $list->getList("getAddressBuildings", $this->params(array(
            'region_id' => 'int',
            'city_id' => 'int',
            'settl_id' => 'int',
            'street_id' => 'int',
            'name' => 'string'
        )));
        $result = $buildings['result']->getResult();
        foreach ($result as $k => $v) {
            $result[$k]['descr'] = $v["short"] . " " . $v["name"] . ( trim($v["block"]) ? " / " . trim($v["block"]) : "" );
        }
        $this->success( $result, $buildings['total']->getResult() );
    }

    public function actionUpdate() {
        $this->success(yii::app()->japi->callAndSend("setAddressBuilding", array(
            'block' => $this->param('block', ''),
            'city_id' => (int) $this->param('city_id', 0),
            'conn_type' => (int) $this->param('conn_type', 0),
            'flats' => (int) $this->param('flats', 0),
            'name' => $this->param('name', ''),
            'postcode' => (int) $this->param('postcode', 0),
            'record_id' => (int) $this->param('record_id', 0),
            'region_id' => (int) $this->param('region_id', 0),
            'settl_id' => (int) $this->param('settl_id', 0),
            'short' => $this->param('short', ''),
            'street_id' => (int) $this->param('street_id', 0),
        )));
    }

    public function actionCreate() {
        $this->success(yii::app()->japi->callAndSend("setAddressBuilding", array(
            'block' => $this->param('block', ''),
            'city_id' => (int) $this->param('city_id', 0),
            'conn_type' => (int) $this->param('conn_type', 0),
            'flats' => (int) $this->param('flats', 0),
            'name' => $this->param('name', ''),
            'postcode' => (int) $this->param('postcode', 0),
            'region_id' => (int) $this->param('region_id', 0),
            'settl_id' => (int) $this->param('settl_id', 0),
            'short' => $this->param('short', ''),
            'street_id' => (int) $this->param('street_id', 0),
        )));
    }
    
    public function actionDeletelist() {
        $this->deleteList( 'delAddressBuilding', 'record_id' );
    }

} ?>
