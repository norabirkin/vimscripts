<?php
class PromisedController extends Controller{

    public function actionSettings() {
        $settings = yii::app()->japi->call('getPromisePaymentsSettings', array(
            'agrm_id' => (int) $this->param('agrm_id')
        ));
        $payments = yii::app()->japi->call('getPromisePayments', array(
            'payed' => 3, 
            'agrm_id' => (int) $this->param('agrm_id')
        ));
        yii::app()->japi->send( true );
        $settings = $settings->getResult();
        $settings['promised_exists'] = ( count($payments->getResult()) > 0 );
        $this->success( $settings );
    }
    
    public function actionList() {
        $list = new OSSList( array("useSort" => false) );
        $list->get("getPromisePayments", array(
            'date_from' => '2012-01-01 00:00:00', //$this->formatDate($this->param('date_from', $this->lastMonth(date('Y-m')))),
            'date_to' => $this->formatDate($this->param('date_to', $this->nextMonth(date('Y-m')))),
            'agrm_id' => (int) $this->param('agrm_id')
        ));
    }

    public function actionCreate() {
        $this->success(yii::app()->japi->callAndSend("PromisePayment", array(
            "agrm_id" => (int) $this->param('agrm_id'),
            "summ" => (float) $this->param('promised_sum')
        )));
    }

} ?>

