<?php
class AgrmgroupsController extends Controller{

    public function actionList() {
        $this->success( yii::app()->japi->callAndSend("getAgrmGroups") );
    }
    
} ?>
