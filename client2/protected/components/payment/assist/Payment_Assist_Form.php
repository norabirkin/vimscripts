<?php

class Payment_Assist_Form extends Payment_Form {
    public function output() {
        return $this->fnext(array(
            array(
                'type' => 'display',
                'label' => 'Selected agreement',
                'value' => $this->agrmnum()
            ),
            array(
                'type' => 'number',
                'label' => 'Sum',
                'name' => 'OrderAmount',
                'note' => 'RUB'
            ),
            array(
                'type' => 'textarea',
                'label' => 'Comment',
                'name' => 'Comment'
            ),
            array(
                'type' => 'submit',
                'value' => 'Pay'
            )
        ))->render();
    }
    public function title() {
        return yii::t('main', 'Assist payment form');
    }
}

?>
