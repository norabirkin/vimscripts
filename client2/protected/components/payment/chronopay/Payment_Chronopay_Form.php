<?php

class Payment_Chronopay_Form extends Payment_Form {
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
                'name' => 'sum'
            ),
            array(
                'type' => 'submit',
                'value' => 'Pay'
            )
        ))->render();
    }
    public function title() {
        return yii::t('main', 'ChronoPay payment form');
    }
}

?>
