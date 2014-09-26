<?php
class VlansController extends Controller{
    
    public function actionList() {
        $this->success( yii::app()->japi->callAndSend('getVlans') );
    }

}
