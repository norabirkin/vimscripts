<?php

class LBWizardAction extends CAction {
    public function getWizard() {
        foreach ($this->import() as $item) {
            yii::import($item);
        }
        if ($wizard = $this->__getWizard()) {
            if ($wizard instanceof LBWizard) {
                $wizard->setAction($this);
                return $wizard;
            }
        }
        throw new Exception('no wizard');
    }
    protected function import() {
        return array();
    }
    public function lb() {
        return yii::app()->lanbilling;
    }
    public function g($fn, $params = array()) {
        return yii::app()->lanbilling->get($fn, $params);
    }
    public function a($fn, $params = array()) {
        return yii::app()->lanbilling->getRows($fn, $params);
    }
    protected function __getWizard() {
        throw new Exception('define __getWizard method');
    }
    public function run() {
        yii::app()->controller->output($this->getWizard()->run());
    }
    public function getRent($vgroup) {
        return $vgroup->vgroup->servicerent;
    }
}

?>
