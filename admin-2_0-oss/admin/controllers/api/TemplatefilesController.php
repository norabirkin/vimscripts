<?php
class TemplatefilesController extends Controller{
 
    public function actionList() {
        if ( !($result = yii::app()->japi->callAndSend( 'getTemplates')) ) {
            $this->success(array());
        }
        $this->success($result);
    }

} ?>
