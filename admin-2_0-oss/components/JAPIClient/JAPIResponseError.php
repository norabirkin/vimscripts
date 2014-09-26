<?php

class JAPIResponseError extends JAPIError {
    private $JAPITransaction;
    public function __construct($status, $message=null, JAPITransaction $JAPITransaction) {
        $this->JAPITransaction = $JAPITransaction;
        parent::__construct($status, $message, 0);
    }
    public function getTypeDescription() {
        return yii::t('errors', 'JAPI error');
    }
    public function getJAPITransaction() {
        return $this->JAPITransaction;
    }
}

?>
