<?php

class Payment_Yandex_Pay extends Payment_Pay {
    public function execute() {
        if (
            !((float) $this->param('sum')) OR
            !((int) $this->param('agrmid'))
        ) {
            throw new Exception('Invalid data');
        }
        $params = array(
            'shopId' => $this->conf('shopId'),
            'scid' => $this->conf('scid'),
            'sum' => (float) $this->param('sum'),
            'customerNumber' => $this->param('agrmid'),
            'shopSuccessURL' => $this->absUrl('payment/success'),
            'shopFailURL' => $this->absUrl('payment/fail'),
            'paymentType' => $this->param('paymentType'),
        );
        if ($this->param('cps_provider')) {
            $params['cps_provider'] = $this->param('cps_provider');
        }
        if ($this->client('email')) {
            $params['cps_email'] = $this->client('email');
        }
        if ($this->phone()) {
            $params['cps_phone'] = $this->phone();
        }
        $this->post($params, $this->conf('operatorURL'));
    }
    public function makeNumreic($str) {
        $digits = '';
        for ($i = 0; $i < strlen($str); $i ++) {
            if (is_numeric($str[$i])) {
                $digits .= $str[$i];
            }
        }
        return $digits;
    }
    private function phone() {
        return $this->makeNumreic($this->client('phone'));
    }
    private function client($param) {
        return yii::app()->controller->lanbilling->clientInfo->account->$param;
    }
    private function conf($name) {
        return yii::app()->params['yandexMoney'][$name];
    }
}

?>
