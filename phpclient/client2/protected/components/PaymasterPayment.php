<?php class PaymasterPayment extends PaymentType{
	protected $Title = 'WebMoneyPaymaster';
	protected $PaymentTypeConfigParam = 'payment_paymaster';
	protected $paymentTypeCode = 'pm';
	protected function GetPaymentDescription() {
		return base64_encode(Yii::t('payment', 'PaymentByAgreement') . ' ' . $this->GetSelectedAgreementNumber());
	}
	protected function GetHiddenInputsData() {
		return array(
			'LMI_MERCHANT_ID' => yii::app()->params['paymaster']['LMI_MERCHANT_ID'],
			'LMI_PAYMENT_DESC_BASE64' => $this->GetPaymentDescription(),
			'LMI_PAYMENT_NO' => '1234',
			'LMI_SIM_MODE' => yii::app()->params['paymaster']['LMI_SIM_MODE'],
			'LB_CONTRACT_NUMBER' => $this->GetSelectedAgreementNumber(),
			'LMI_CURRENCY' => 'RUB'
		); 
	}
	protected function GetFormRowsData() {
		return array(
			'LMI_PAYMENT_AMOUNT' => array(
				'type' => 'text',
				'label' => 'PaymentSum',
				'description' => 'RUB'
			),
			'submit' => array(
				'type' => 'submitButton',
				'label' => 'Pay'
			)
		);
	}
	protected function RenderContent() {
		return $this->RenderForm();
	}
} ?>
