<?php

class HelpdeskController extends Controller {
    public function actions() {
        return array(
            'index' => 'application.components.sbss.Sbss_Action'
        );
    }
    public function init() {
        parent::init();
        yii::import('application.components.sbss.*');
    }
}

?>
