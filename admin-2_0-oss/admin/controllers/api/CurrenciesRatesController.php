<?php
class CurrenciesRatesController extends Controller{

    public function actionList() {
        $currencyRates = new CurrencyRates;
        $this->success( $currencyRates->getList() ); 
    }


    public function actionSave() {
        $this->success( yii::app()->japi->callAndSend('setCurrencyRate', array(
            "cur_id"    => (int)$this->param( "cur_id" ),
            "date"        => $this->param( "date" ),
            'date_till' => $this->param( "date_till" ),
            "rate"         => (double)$this->param( "rate" )
        )));
    }

} ?>

