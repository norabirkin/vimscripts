<?php
class AddressmeaningsController extends Controller{

    public function actionList() {
        $this->success(yii::app()->japi->callAndSend("getAddressMeanings", array(
            'level' => (int) $this->param('level', 0)
        )));
    }
    
} ?>
