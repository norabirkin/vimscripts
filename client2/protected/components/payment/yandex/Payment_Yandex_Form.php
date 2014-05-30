<?php

class Payment_Yandex_Form extends LBWizardStep {
    public function init() {
        $this->subtitle();
    }
    public function output() {
        array(
            'paymentType' => $this->param('paymentType')
        );
        return '<br/>'.$this->fnext(array(
            array(
                'type' => 'select',
                'label' => 'Payment type',
                'data' => array(
                    'PC' => $this->t('Pay with yandex Money'),
                    'AC' => $this->t('Pay with bank card'),
                    'GP' => $this->t('Pay with terminal'),
                    'MC' => $this->t('Pay with mobile phone')
                ),
                'options' => array(
                    'style' => 'width:340px;'
                ),
                'name' => 'paymentType'
            ),
            array(
                'type' => 'select',
                'label' => 'Payment details',
                'name' => 'cps_provider',
                'data' => array(
                    'SVZNY' => $this->t('Pay with "Sviaznoy" terminal'),
                    'EURST' => $this->t('Pay with "Evroset"'),
                    'OTHER' => $this->t('Other terminal')
                ),
                'options' => array(
                    'style' => 'width:340px;'
                ),
                'showIf' => array(
                    'paymentType' => 'GP'
                )
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
        return 'Payment form';
    }
}

?>
