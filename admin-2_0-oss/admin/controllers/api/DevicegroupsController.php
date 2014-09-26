<?php
class DevicegroupsController extends Controller{
    
    public function actionList() {
        $this->success( yii::app()->japi->callAndSend('getDeviceGroups') );
    }
    
}
