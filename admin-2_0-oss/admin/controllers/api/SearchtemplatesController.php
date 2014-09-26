<?php
class SearchtemplatesController extends Controller {

    public function actionCreate() {
        $this->success(yii::app()->japi->callAndSend("setSearchTemplate", array(
            'tpl_name' => $this->param('tpl_name'),
            'rules' => CJSON::decode($this->param('rules'))
        )));
    }

    private function process($tpls) {
        foreach ($tpls as $k => $v) {
            $tpls[$k] = array(
                "tpl_name" => $v["tpl_name"],
                "rules" => CJSON::encode($v["rules"])
            );
        }
        return $tpls;
    }

    public function actionList() {
        $this->success($this->process(yii::app()->japi->callAndSend('getSearchTemplates')));
    }

} ?>
