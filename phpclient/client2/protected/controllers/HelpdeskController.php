<?php

class HelpdeskController extends Controller {
    public function actions() {
        return array(
            'index' => 'application.components.sbss.Sbss_Action'
        );
    }
    public function actionDownload($id, $originalname) {
        $sbss = new Sbss_Tickets;
        $sbss->download($id, $originalname);
    }
    public function init() {
        parent::init();
        yii::import('application.components.sbss.*');
    }
    public function actionKbdownload($id, $originalname) {
        $knowledges = new Sbss_Knowledges;
        $knowledges->download($id, $originalname);
    }
    public function actionKb() {
        $knowledges = new Sbss_Knowledges;
        $this->render('kb', array(
            "data" => $knowledges->getKnowledges()
        ));
    }
}

?>
