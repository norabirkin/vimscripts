<?php

class Controller extends LBController {
    protected function defaultResponse() {
        return new LBRJsonResponse;
    }
    protected function processError($error) {
        if ($detail = UserIdentity::getAuthorizeError($error)) {
            $this->_error['status'] = $detail['code'];
            $detail = new LBR_Error_Item(array(
                'code' => 7,
                'data' => array(
                    'message' => $detail['message']
                )
            ));
            yii::app()->user->logout();
        } elseif ($error instanceof JAPIConnectionError) {
            $detail = new LBR_Error_Item(array(
                'code' => 4,
                'data' => array(
                    'message' => $error->getMessage()
                )
            ));
        } elseif ($error instanceof JAPIDataError) {
            $detail = new LBR_Error_Item(array(
                'code' => 5,
                'data' => array(
                    'message' => $error->getMessage()
                )
            ));
        } elseif ($error instanceof JAPIResponseError) {
            $detail = new LBR_Error_Item(array(
                'code' => 6,
                'data' => array(
                    'message' => $error->getMessage()
                )
            ));
        } elseif ($error instanceof LBR_Error) {
            $detail = $error->getDetail();
        } else {
            $detail = new LBR_Error_Item(array(
                'code' => 2,
                'data' => array(
                    'type' => $this->_error['type'],
                    'message' => $this->_error['message']
                )
            ));
        }
        if ($detail instanceof LBR_Error_Item) {
            $this->_error['detail'] = array(
                $detail->getDetail()
            );
        } else {
            $this->_error['detail'] = $detail;
        }
        unset($this->_error['type']);
        unset($this->_error['message']);
    }
}

?>
