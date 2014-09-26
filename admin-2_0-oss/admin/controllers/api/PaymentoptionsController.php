<?php
class PaymentoptionsController extends Controller {
    
    private $options;
    
    public function actionList() {
        $this->success( $this->options->getOptions( "payment" ) );
    }
    
    public function actionUpdate() {
        $this->success( $this->options->setOptions( "payment" ) );
    }
    
    public function init() {
        parent::init();
        $this->options = new Options;
    }
    
} ?>
