<?php

class Payment_Promised_Form extends LBWizardStep {
    private $settings;
    public function __construct($settings) {
        $this->settings = $settings;
    }
    private function daysToSeconds($days) {
        return $days * 86400;
    }
    public function dayWhenYouShouldPay() {
        $daysLeftForPay = $this->settings->promisetill;
        return $this->date(time() + $this->daysToSeconds($daysLeftForPay));
    }
    public function output() {
        return $this->fnext(array(
            array(
                'type' => 'display',
                'label' => 'Promised payment limit',
                'value' => $this->price($this->settings->promisemax)
            ),
            array(
                'type' => 'display',
                'label' => 'Day when you should pay',
                'value' => $this->dayWhenYouShouldPay()
            ),
            array(
                'type' => 'display',
                'label' => 'Minimal payment sum',
                'value' => $this->price($this->settings->promisemin)
            ),
            array(
                'type' => 'number',
                'name' => 'sum',
                'label' => 'Sum'
            ),
            array(
                'type' => 'submit',
                'value' => 'Pay'
            )
        ))->render();
    }
    public function title() {
        return yii::t('main', 'Promised payment form');
    }
}

?>
