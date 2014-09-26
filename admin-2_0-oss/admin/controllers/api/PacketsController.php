<?php
class PacketsController extends Controller{
    
    public function actionList() {
        $filter['pg_num'] = (integer)$this->param('start');
        $filter['pg_size'] = (integer)$this->param('limit');
        $this->success( yii::app()->japi->callAndSend('getPackets'), $filter ); 
    }
} ?>
