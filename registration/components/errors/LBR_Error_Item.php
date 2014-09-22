<?php

class LBR_Error_Item {
    private $detail;
    public function __construct($item) {
        if (
            !is_array($item) ||
            !isset($item['code']) ||
            ((int)$item['code']) <= 0 ||
            !isset($item['data'])
        ) {
            throw new CHttpException(500, 'Invalid exception config');
        }
        $this->detail = array(
            'code' => $this->getErrorCode($item['code']),
            'type' => $this->getType($item['code']),
            'data' => $item['data']
        );
    }
    private function getErrorCode($code) {
        $code = (int)$code;
        if ($code > 999) {
            throw new CHttpException(500, 'Invalid code');
        }
        return 'E'.str_pad($code, 3, '0', STR_PAD_LEFT);
    }
    private function getType($code) {
        $types = array(
            '1' => 'Validation error',
            '2' => 'Server error',
            '3' => 'Required field is empty',
            '4' => 'Connection error',
            '5' => 'Invalid JAPI response',
            '6' => 'JAPI error',
            '7' => 'Not authorized'
        );
        return $types[(string)((int)$code)];
    }
    public function getDetail() {
        return $this->detail;
    }
}

?>
