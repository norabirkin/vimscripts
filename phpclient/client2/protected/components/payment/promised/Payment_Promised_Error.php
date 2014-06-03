<?php

class Payment_Promised_Error extends Payment_Form {
    public function __construct($error) {
        yii::app()->user->setFlash('error', yii::t('main', $error));
    }
    public function output() {
        return $this->form(array(
            array(
                'type' => 'submit',
                'value' => 'Back'
            )
        ))->hidden(array('r' => 'payment/promised'))->render();
    }
    public function title() {
        return yii::t('main', 'Promised payment error on agreement {number}', array(
            '{number}' => $this->agrmnum()
        ));
    }
}

?>
