<?php

class Payment_Assist_Pay extends Payment_Pay {
    private $name;
    private function data() {
        return array(
            'Merchant_ID' => yii::app()->params['assist']['Merchant_ID'],
            'OrderNumber' => $this->prepayment(
                $this->param('agrmid'),
                $this->param('OrderAmount')
            ),
            'Delay' => 1,
            'OrderCurrency' => 'RUB',
            'FirstName' => $this->FirstName(),
            'LastName' => $this->LastName(),
            'Email' => yii::app()->controller->lanbilling->clientInfo->account->email,
            'OrderAmount' => $this->param('OrderAmount'),
            'Comment' => $this->param('Comment'),
            'TestMode' => (int) yii::app()->params['assist']['TestMode'],
            'URL_RETURN' => $this->absUrl('payment/assist'),
            'URL_RETURN_OK' => $this->absUrl('payment/assistconfirm')
        );
    }
    private function name($index) {
        if ($this->name=== NULL) {
            $this->name = explode(' ', yii::app()->controller->lanbilling->clientInfo->account->name);
        }
        return $this->name[$index];
    }
    private function FirstName() {
        return $this->name(1);
    }
    private function LastName() {
        return $this->name(0);
    }
    private function get() {
        if (strpos(yii::app()->params['assist']['merchant_url'], '?')) {
            $url = yii::app()->params['assist']['merchant_url'] . '&' . http_build_query($this->data());
        } else {
            $url = yii::app()->params['assist']['merchant_url'] . '?' . http_build_query($this->data());
        }
        yii::app()->controller->redirect($url);
    }
    public function execute() {
        $this->post($this->data(), yii::app()->params['assist']['merchant_url']);
    }
}

?>
