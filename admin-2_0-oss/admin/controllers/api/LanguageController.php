<?php
class LanguageController extends Controller {
        
    public function actionUpdate() {
        return;
    }
    
    public function actionGet() {
        return;
    }
    
    public function actionList() {
        return;
    }
    
    public function actionCreate() {
        return;
    }
    
    public function actionDelete() {
        return;
    }

    protected function startSession() {
    }

    public function actionLocalize() {
        $messages = Yii::app()->getMessages()->getContent('messages');
        
        header("Content-type: text/javascript");
        echo 'var Localize = ' . CJSON::encode( $messages ) . ';';
        Yii::app()->end();
    }
    
    public function actionSet() {
        if (!$lang = Yii::app()->request->getParam('lang', NULL)) {
            return;
        }
        
        $this->setLanguageCookie();
        
        $this->sendResponse(200, array(
            "success" => true,
            'result' => $lang
        ));
    }
}

?>
