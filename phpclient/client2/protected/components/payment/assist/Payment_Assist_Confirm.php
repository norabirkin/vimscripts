<?php

class Payment_Assist_Confirm extends Payment_Form {
    private $prepayment;
    private function prepayment() {
        if ($this->prepayment === null) {
            $this->prepayment = $this->g('getPrePayments', array(
                'flt' => array(
                    'recordid' => yii::app()->request->getParam('ordernumber')
                )
            ));
        }
        return $this->prepayment;
    }
    public function output() {
        return $this->fnext(array(
            array(
                'type' => 'display',
                'label' => 'Selected agreement',
                'value' => $this->agrmnum($this->prepayment()->agrmid)
            ),
            array(
                'type' => 'display',
                'label' => 'Sum',
                'value' => $this->price($this->prepayment()->amount)
            ),
            array(
                'type' => 'submit',
                'value' => 'Confirm'
            )
        ))->hidden(array(
            'payerdenial' => yii::app()->request->getParam('payerdenial'),
            'ordernumber' => yii::app()->request->getParam('ordernumber'),
            'billnumber' => yii::app()->request->getParam('billnumber')
        ))->render();
    }
    public function title() {
        return yii::t('main', 'Confirm "Assist" payment');
    }
}

?>
