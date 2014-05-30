<?php

class Payment_Assist_Result extends LBWizardStep {
    private $response;
    public function output() {
        if (!$this->confirm()) {
            throw new Exception('Payment confirmation failed');
        }
        yii::app()->user->setFlash('success', $this->request()->param('message'));
        $params = array();
        foreach (array(
            'firstname',
            'lastname',
            'middlename',
            'email',
            'amount',
            //'comment',
            'orderdate',
            'cardholder',
            'meantypename',
            'meannumber',
            'issuebank',
            'bankcountry',
        ) as $param) {
            $params[] = array(
                'type' => 'display',
                'label' => $this->request()->descr($param),
                'value' => $this->request()->param($param)
            );
        }
        return $this->form($params)->render();
    }
    public function title() {
        return yii::t('main', 'Payment confirmed');
    }
    private function confirm() {
        return $this->g('confirmPrePayment', array(
            'recordid' => $this->param('ordernumber'),
            'receipt' => $this->param('billnumber')
        ));
    }
    private function query() {
        $params = array( 
            "billnumber" => $this->param('billnumber'),
            "Merchant_ID" => yii::app()->params["assist"]["Merchant_ID"],
            "Login" => yii::app()->params["assist"]["Login"],
            "Password" => yii::app()->params["assist"]["Password"]
        );
        return http_build_query($params);
    }
    private function nocurl() {
        $url = yii::app()->params["assist"]["confirm_url"] . "?" . $this->query();
        return file_get_contents( $url );
    }
    private function useCurl() {
        $c = curl_init();
        curl_setopt($c, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($c, CURLOPT_POST, true);
        curl_setopt($c, CURLOPT_POSTFIELDS, $this->query( $billnumber ));
        curl_setopt($c, CURLOPT_URL, yii::app()->params["assist"]["confirm_url"]);
        $response = curl_exec($c);
        curl_close($c);
        return $response;
    }
    public function request() {
        if (!$this->response) {
            if (function_exists("curl_init")) $response = $this->useCurl();
            else $response = $this->nocurl();
            $this->response = new Payment_Assist_Response($response);
            if ($this->response->error()) {
                throw new Exception($this->response->errorType().': "'.$this->response->errorDetail().'"');
            }
        }
        return $this->response;
    }
}

?>
