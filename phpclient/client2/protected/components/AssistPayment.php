<?php class AssistPayment extends PaymentType{
	protected $Title = 'CreditCard';
	protected $PaymentTypeConfigParam = 'payment_assist';
	protected $paymentTypeCode = 'as';
	
	protected function GetHiddenInputsData() {
		return array( 'AgreementID' => $this->GetAgrmid() );
	}
	protected function GetFormRowsData() {
		return array(
			'OrderAmount' => array(
				'type' => 'text',
				'label' => 'PaymentSum',
				'description' => 'RUB'
			),
			'Comment' => array(
				'type' => 'textarea',
				'label' => 'Comment'
			),
			'Submit' => array(
				'type' => 'submitButton',
				'label' => 'Pay'
			)
		);
	}
	protected function RenderContent() {
		return $this->RenderForm();
	}
} ?>