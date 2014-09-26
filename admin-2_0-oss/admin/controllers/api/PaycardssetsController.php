<?php
class PaycardssetsController extends Controller{
    
    public function actionList() {
        $this->success( yii::app()->japi->callAndSend('getCardSets') ); 
    }
    
} ?>
