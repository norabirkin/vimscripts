<?php
class OperatorsController extends Controller {
    
    public function actionList() {
        $this->success( yii::app()->japi->callAndSend("getAccounts", array(
            "category" => 1
        )));
    }
    
} ?>
