<?php
class CurrenciesController extends Controller{

    public function actionList() {
        $this->success( yii::app()->japi->callAndSend("getCurrencies") );
    }

    public function actionDelete() {
        $this->success( yii::app()->japi->callAndSend( 'delCurrency', array(
            "cur_id" => (int) $this->getRequest()->getParam('id', 0)
        )));
    }

    public function actionSave() {
        $this->success( yii::app()->japi->callAndSend('setCurrency', array(
            "code_okv"    => (int)$this->param( "code_okv" ),
            "cur_id"    => (int)$this->param( "cur_id" ),
            "is_def"    => (boolean)$this->param( "is_def" ),
            'name'      => (string) $this->param( "name" ),
            "symbol"     => (string)$this->param( "symbol" )
        )));
    }
} ?>
