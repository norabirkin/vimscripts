<?php

class Payment_Promised_Pay extends LBWizardFinalStep {
    private $settings;
    private $error;
    public function __construct($settings) {
        $this->settings = $settings;
    }
    public function execute() {
        if ($this->param('sum') < $this->settings->promisemin) {
            $this->error = yii::t('payment', 'Sum must be more than') . ' ' . $this->settings->promisemin;
            return false;
        } elseif ($this->param('sum') > $this->settings->promisemax) {
            $this->error = yii::t('payment', 'Sum must be less than') . " " . $this->settings->promisemax;
            return false;
        }
        return $this->g('ClientPromisePayment', array(
            "agrm" => $this->param('agrmid'),
            "summ" => $this->param('sum')
        ));
    }
    protected function getSuccessMessage() {
        return 'Promised payment successfully done';
    }
    protected function getErrorMessage() {
        if ($this->error) {
            return $this->error;
        } else {
            return 'Promised payment error';
        }
    }
}

?>
