<?php
class DocumentsController extends Controller {
    public function actionList() {
        
        $onFly = explode(',' , $this->param('on_fly'));
        foreach($onFly as $k=>$item) {
            $onFly[$k] = (int)$item;
        }
        $result = Yii::app()->japi->callAndSend("getDocuments", array(
            'name' => (string) $this->param('query'),
            'on_fly' => $onFly
        ));
        $this->success($result);
    }
}
?>
