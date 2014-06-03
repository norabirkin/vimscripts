<?php

class Payment_Moscow_Pay extends Payment_Pay {
    public function data() {
        $order = $this->randStr('0.1.2.3.4.5.6.7.8.9', 6);
        $data = array(
            'AMOUNT' => $this->param('AMOUNT'),
            'CURRENCY' => 'RUR',
            'ORDER' => $order,
            'DESC' => yii::app()->params['MoscowBank']['DESC'],
            'MERCH_NAME' => yii::app()->params['MoscowBank']['MERCH_NAME'],
            'MERCH_URL' => yii::app()->params['MoscowBank']['MERCH_URL'],
            'MERCHANT' => yii::app()->params['MoscowBank']['MERCHANT'],
            'TERMINAL' => yii::app()->params['MoscowBank']['TERMINAL'],
            'EMAIL' => yii::app()->controller->lanbilling->clientInfo->account->email,
            'TRTYPE' => 1,
            'COUNTRY' => yii::app()->params['MoscowBank']['COUNTRY'],
            'MERCH_GMT' => $this->timezone(),
            'TIMESTAMP' => gmdate('YmdHis'),
            'NONCE' => $this->randStr('0.1.2.3.4.5.6.7.8.9.A.B.C.D.E.F', 16),
            'BACKREF' => $this->absUrl('payment/moscow'),
            'PAYMENT_TEXT' => $this->param('agrmid'),
            'LANG' => yii::app()->params['MoscowBank']['LANG']
        );
        $data['P_SIGN'] = $this->mac($data);
        return $data;
    }
    private function timezone() {
        $timezone = new DateTimeZone(date_default_timezone_get());
        $date = new DateTime('now', $timezone);
        $offset = $timezone->getOffset($date) / 3600;
//         if ($offset > 0) {
//             $offset = '+'.$offset;
//         }
        return $offset;
    }
    private function mac($data) {
        $mac = '';
        foreach ($data as $k => $v) {
            if ($k == 'PAYMENT_TEXT' OR $k == 'LANG') {
                continue;
            }
            $mac .= strlen($v).($v ? $v : '-');
        }
        return hash_hmac('sha1', $mac, pack('H*', yii::app()->params['MoscowBank']['key']));
    }
    private function randStr($chars, $length) {
        $str = '';
        $characters = explode('.', $chars);
        $count = count($characters);
        for ( $i = 0; $i < $length; $i++ ){
            $str .= $characters[mt_rand(0, ($count - 1))];
        }
        return $str;
    }
    public function execute() {
        $data = $this->data();
        $this->post($this->data(), yii::app()->params['MoscowBank']['acquirer_url']);
    }
}

?>
