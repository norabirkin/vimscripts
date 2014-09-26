<?php

class JAPIConnectionError extends JAPIError {
    public function getTypeDescription() {
        return yii::t('errors', 'Connection error');
    }
}

?>
