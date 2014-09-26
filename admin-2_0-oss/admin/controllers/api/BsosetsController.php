<?php
class BsosetsController extends Controller{

    public function actionList() {
        $this->success( yii::app()->japi->callAndSend("getBsoSets") );
    }
    
} ?>
