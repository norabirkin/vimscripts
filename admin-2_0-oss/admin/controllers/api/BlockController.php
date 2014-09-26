<?php
class BlockController extends Controller{

    private function getVgroups() {
        if ($this->param("vgroups")) {
            return CJSON::decode($this->param("vgroups", true));
        }
        if (!$this->param("agrm_id")) {
            throw new CHttpException(500, "Vgroups not found");
        }
        return yii::app()->japi->callAndSend('getVgroups', array(
            "agrm_id" => (int) $this->param( "agrm_id", 0 )
        ));
    }

    public function actionCreate() {
        $calls = array();
        if ((string) $this->param('vgroups')) {
            foreach (CJSON::decode((string) $this->param('vgroups'), true) as $vgroup) {
                yii::app()->japi->call('setVgBlock', array(
                    'state' => (string) $this->param('state'),
                    'vg_id' => $vgroup["vg_id"]
                ));
            }
        }
        if ((int) $this->param('agrm_id')) {
            yii::app()->japi->call('setVgBlock', array(
                'vg_id' => 0,
                'agrm_id' => (int) $this->param('agrm_id'),
                'state' => (string) $this->param('state')
            ));
        }
        yii::app()->japi->send(true);
        $this->success();
    }
    
} ?>
