<?php

class LBRJsonResponse extends JsonResponse {
    public function getErrorMessage($status){
        return array(
            'error' => array(
                'title' => yii::t(
                    'errors',
                    $this->getStatusCodeMessage($status)
                )
            )
        );
    }
}

?>
