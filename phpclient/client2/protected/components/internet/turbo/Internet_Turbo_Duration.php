<?php

class Internet_Turbo_Duration extends Internet_Turbo_Form {
    protected function getForm() {
        $form = $this->baseForm();
        $form->add(array(
            'type' => 'number',
            'name' => 'mul',
            'label' => 'Duration of service activity (hours)',
            'min' => yii::app()->params['turbo']['minDuration'],
            'max' => yii::app()->params['turbo']['maxDuration'],
            'value' => yii::app()->params['turbo']['minDuration']
        ));
        return $form;
    }
    public function title() {
        return 'Selecting duration';
    }
}

?>
