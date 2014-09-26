<?php
class DatastoringController extends Controller {
    
    private $options;
    
    public function actionList() {
        $this->success( $this->options->getOptions( "datastoring" ) );
    }
    
    public function actionUpdate() {
        $this->success( yii::app()->japi->callAndSend("setOption", array(
            "name" => $this->param( "name" ),
            "value" => $this->param( "value" )
        )));
    }
    
    public function init() {
        parent::init();
        $this->options = new Options;
    }
    
} ?>
