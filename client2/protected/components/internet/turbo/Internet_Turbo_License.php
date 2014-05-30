<?php

class Internet_Turbo_License extends LBWizardStep {
    public function output() {
        return yii::app()->controller->renderPartial('application.components.internet.views.license', array(
            'description' => $this->description(),
            'copyright' => $this->copyright(),
            'form' => $this->fnext(array(
                array(
                    'type' => 'submit',
                    'value' => 'Start',
                    'options' => array(
                        'id' => 'lbantivirus_confirm_submit',
                        'class' => 'disabled',
                        'disabled' => 'disabled'
                    )
                )
            ))->render()
        ), true);
    }
    private function text($text) {
        $path = yii::getPathOfAlias('application.components.internet.turbo.'.$text).'.txt';
        if (!file_exists($path)) {
            throw new Exception('No text');
        }
        return file_get_contents($path);
    }
    private function copyright() {
        return $this->text('copyright');
    }
    private function description() {
        return $this->text('description');
    }
    public function title() {
        return 'Turbo terms and conditions';
    }
}

?>
