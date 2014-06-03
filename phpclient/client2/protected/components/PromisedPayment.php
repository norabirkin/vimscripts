<?php class PromisedPayment extends PromisedPaymentLogic{
	protected $TypeName = 'promised';
	protected $Title = 'PromisedPayment';
	protected $Description;
	protected $PaymentTypeConfigParam = 'payment_promised';
	protected $paymentTypeCode = 'pr';
    public function init() {
        ClientScriptRegistration::addScript( "maskRe" );
        ClientScriptRegistration::addScript( "promised_payment" );
        $this->Description = yii::app()->params["promised_payment_text"];
        parent::init();
    }
	protected function GetAgreementBlockParams($agrmid) {
		$agreementBlock = new PromisedPaymentAgreementBlock($this, $agrmid);
		return $agreementBlock->GetParams();
	}
	public function GetSelectedAgreementID() {
		return $this->agrmid;
	}
	protected function GetAgreementIDs() {
		return array_keys(yii::app()->controller->lanbilling->agreements);
	}
	protected function RenderContent() {
		$html = '';
		foreach ($this->GetAgreementIDs() as $agrmid) {
			$html .= $this->Render('PromisedPaymentAgreementBlock',$this->GetAgreementBlockParams($agrmid) ,true);
		}
		return $html;
	}
} ?>
