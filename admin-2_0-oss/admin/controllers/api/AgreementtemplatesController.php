<?php
class AgreementtemplatesController extends Controller {
    
    public function actionList() {
        $options = yii::app()->japi->callAndSend("getOptions");
        $result = array();
        foreach ($options as $option) {
            if (preg_match('/^agrmnum_template_([0-9]*)$/', $option['name'])) {
                $result[] = $option;
            }
        }
        $this->success( $result );
    }
    
    public function actionSave() {
        $params = array(
            'descr' => (string)$this->param("descr", ""),
            'value' => (string)$this->param("value", "")
        );
        if ($this->param("name") != "") {
            $params["name"] = (string)$this->param("name");
        }
        $this->success( yii::app()->japi->callAndSend("addAgrmTemplate", $params));
    }

    public function actionDelete() {
        $this->success( yii::app()->japi->callAndSend("delAgrmTemplates", array(
            "name" => (string) $this->param("name", '')
        )));
    }
    
} ?>
