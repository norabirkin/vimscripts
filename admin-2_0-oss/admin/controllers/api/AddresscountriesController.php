<?php
class AddresscountriesController extends Controller{

    public function actionList() {
        $list = new OSSList( array("useSort" => false) );
        $list->get("getAddressCountries", $this->params(array( "name" => "string" ), true));
    }

    public function actionUpdate() {
        $this->success(yii::app()->japi->callAndSend("setAddressCountry", array(
            "name" => $this->param("name", ""),
            "record_id" => (int) $this->param("record_id", 0)
        )));
    }

    public function actionCreate() {
        $this->success(yii::app()->japi->callAndSend("setAddressCountry", array(
            "name" => $this->param("name", "")
        )));
    }

    public function actionDeletelist() {
        $this->deleteList( 'delAddressCountry', 'record_id' );
    }
    
} ?>
