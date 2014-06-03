<?php

class Payment_Paymaster_Form extends Payment_Form {
    public function output() {
        return $this->form(array(
            array(
                'type' => 'display',
                'label' => 'Selected agreement',
                'value' => $this->agrmnum()
            ),
            array(
                'type' => 'number',
                'name' => 'LMI_PAYMENT_AMOUNT',
                'label' => 'Sum'
            ),
            array(
                'type' => 'submit',
                'value' => 'Pay'
            )
        ))
        ->action(yii::app()->params['paymaster']['merchant_url'])
        ->hidden(array(
			'LMI_MERCHANT_ID' => yii::app()->params['paymaster']['LMI_MERCHANT_ID'],
            'LMI_PAYMENT_DESC_BASE64' => $this->desc(),
            'LMI_PAYMENT_NO' => '1234',
            'LMI_SIM_MODE' => yii::app()->params['paymaster']['LMI_SIM_MODE'],
            'LB_CONTRACT_NUMBER' => $this->agrmnum(),
			'LMI_CURRENCY' => 'RUB'
        ))
        ->render();
    }
    public function title() {
        return yii::t('main', 'PayMaster payment form');
    }
}

?>
