<?php
class CurrenciesCodesController extends Controller{

    public function actionList() {
        $this->success( yii::app()->japi->callAndSend("getDictOkv"), array());
    }
} ?>
