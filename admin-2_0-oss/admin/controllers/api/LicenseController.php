<?php
class LicenseController extends Controller {
    public function actionList() {
        $this->success(yii::app()->japi->callAndSend("getLicense"));
    }
    
    
    /**
     * Show content to turn on strict mode on the front end
     * 
     */
    public function actionStrict() {
        $config = array(
            "cloud" => false
        );
        
        header("Content-type: text/javascript");
        echo 'window.License = ' . CJSON::encode( $config ) . ';';
        Yii::app()->end();
    }
} ?>
