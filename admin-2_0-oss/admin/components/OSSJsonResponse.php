<?php

class OSSJsonResponse extends JsonResponse {
    public function getErrorMessage($status){
        return array(
            'error' => array(
                'code' => $status,
                'title' => yii::t(
                    'errors',
                    $this->getStatusCodeMessage($status)
                ),
                'message' => yii::t(
                    'errors',
                    $this->getStatusCodeMessage($status, false)
                )
            )
        );
    }
}

?>
