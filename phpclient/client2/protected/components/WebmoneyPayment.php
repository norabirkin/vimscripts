<?php class WebmoneyPayment extends PaymentType{
	protected $Title = 'WebMoney';
	protected $PaymentTypeConfigParam = 'payment_webmoney';
	protected $paymentTypeCode = 'wm';
	protected function GetPaymentDescription() {
		return base64_encode(Yii::t('payment', 'PaymentByAgreement') . ' ' . $this->GetSelectedAgreementNumber());
	}
	protected function GetHiddenInputsData() {
		return array(
			'LMI_PAYEE_PURSE' => yii::app()->params['webmoney']['LMI_PAYEE_PURSE'],
			'LMI_PAYMENT_DESC_BASE64' => $this->GetPaymentDescription(),
			'LMI_PAYMENT_NO' => '1234',
			'LMI_SIM_MODE' => yii::app()->params['webmoney']['LMI_SIM_MODE'],
			'LB_CONTRACT_NUMBER' => $this->GetSelectedAgreementNumber()
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
