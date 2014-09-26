<?php

class JAPIDataError extends JAPIError {
    public function getTypeDescription() {
        return yii::t('errors', 'Invalid JAPI response');
    }
}

?>
