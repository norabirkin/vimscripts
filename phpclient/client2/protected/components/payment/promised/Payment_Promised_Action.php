<?php

class Payment_Promised_Action extends LBWizardAction {
    private $settings;
    private $error;
    private $payments;
    private $agrmid;
    public function __getWizard() {
        yii::import('application.components.payment.promised.*');
        yii::import('application.components.payment.*');
        $wizard = new LBWizard(array(
            'steps' => array(
                new Payment_Agreements(array(
                    'title' => 'Choose agreement',
                    'all' => false,
                    'description' => yii::app()->params['promised_payment_text']
                ))
            )
        ));
        if ($this->agrmid = $wizard->param('agrmid')) {
            $this->data();
            $wizard->setFinalStep(new Payment_Promised_Pay($this->settings));
            $wizard->setStepComponent($this->secondStep());
        }
        return $wizard;
    }
    private function data() {
        $this->settings = $this->g("getClientPPSettings", array(
            "agrm" => $this->agrmid
        ));
        $this->error = $this->lb()->soapLastError();
        $this->payments = $this->a('getClientPromisePayments');
    }
    private function areLimitsSet() {
        return $this->settings->promisemax AND $this->settings->promisemin;
    }
    private function isAgreementAgeAllowable() {
        if ($this->settings OR $this->error->type != 'Promise payment is not available, agreement lifetime is less than $1 days') {
            return true;
        } else {
            return false;
        }
    }
    private function isPromisePaymentBlocked() {
        if ($this->settings OR $this->error->type != 'Promise payments already assigned') {
            return false;
        } else {
            return true;
        }
    }
    private function isNotAllowableDebt() {
        $balance = $this->lb()->agreements[$this->agrmid]->balance;
        $allowableDebt = $this->settings->promiselimit;
        return $balance < 0 AND abs($balance) >= $allowableDebt;
    }
    private function isAllowableDebt() {
        $balance = $this->lb()->agreements[$this->agrmid]->balance;
        $allowableDebt = $this->settings->promiselimit;
        return ($balance <= 0 && abs($balance) <= $allowableDebt) || ( $balance > 0 );
    } 
    private function secondStep() {
        if (!$this->isAgreementAgeAllowable()) {
            return new Payment_Promised_Error('Agreement age is less than needed');
        } elseif ($this->payments AND $this->isPromisePaymentBlocked()) {
            return new Payment_Promised_Grid($this->payments);
        } elseif (!$this->areLimitsSet()) {
            return new Payment_Promised_Error('Invalid promised payment configuration. Please contact manager.');
        } elseif ($this->isNotAllowableDebt()) {
            return new Payment_Promised_Error('Dept is more than allowable');
        } elseif ($this->isAllowableDebt()) {
            return new Payment_Promised_Form($this->settings);
        }
    }
}

?>
