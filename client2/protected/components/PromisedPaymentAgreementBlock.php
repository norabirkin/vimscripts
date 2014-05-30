<?php class PromisedPaymentAgreementBlock {
	protected $promisedPayment;
	protected $promisedPaymentSettings;
	protected $agrmid;
	protected $agreementData;
	function __construct(PromisedPayment $promisedPayment, $agrmid) {
		$this->agrmid = (int) $agrmid;
		$this->promisedPayment = $promisedPayment;
		$this->promisedPaymentSettings = yii::app()->controller->lanbilling->psettings[$this->agrmid];
		$this->agreementData = yii::app()->controller->lanbilling->agreements[$this->agrmid];
	}
	public function DaysToSeconds($days) {
		return $days * 86400;
	}
	public function IsAgreementAgeAllowable() {
		$minimalAgreementAge = $this->DaysToSeconds($this->promisedPaymentSettings->promiseondays);
		$agreementConclusionDate = yii::app()->controller->lanbilling->agreements[$this->agrmid]->date;
		$agreementConclusionDateInSeconds = strtotime($agreementConclusionDate);
		if (!$agreementConclusionDateInSeconds AND $this->promisedPaymentSettings->promiseondays) return false;
		$agreementAge = time() - $agreementConclusionDateInSeconds;
		return $agreementAge >= $minimalAgreementAge;
	}
	public function IsPaymentLimitsSet() {
		return (@$this->promisedPaymentSettings->promisemin AND @$this->promisedPaymentSettings->promisemax);
	}		
	public function isPromisePaymentBlocked() {
		return @$this->promisedPaymentSettings->promiseavailable == 0;
	}
	public function IsPromisePaymentAvailable() {
		return $this->IsPaymentLimitsSet() AND $this->IsAgreementAgeAllowable();
	}
	public function IsAllowableDebt() {
		$balance = $this->agreementData->balance;
		$allowableDebt = $this->promisedPaymentSettings->promiselimit;
		return ($balance <= 0 && abs($balance) <= $allowableDebt) || ( $balance > 0 );
	} 
	public function IsNotAllowableDebt() {
		$balance = $this->agreementData->balance;
		$allowableDebt = $this->promisedPaymentSettings->promiselimit;
		return $balance < 0 AND abs($balance) >= $allowableDebt;
	}
	public function GetPaymentsGrid() {
		$paymentsGrid = new PaymentsGrid($this->promisedPaymentSettings->payments);
		return $paymentsGrid->Render();
	}
	public function DefaultType() {
		return '';
	}
	public function PromisedPaymentsGrid() {
		return yii::app()->controller->renderPartial(
			'PromisedPaymentsGrid',
			array('grid' => $this->GetPaymentsGrid()),
			true
		);
	}
	public function GetLastPaymentDay() {
		$DaysLeftForPay = $this->promisedPaymentSettings->promisetill;
		return yii::app()->controller->formatDate((time()+$this->DaysToSeconds($DaysLeftForPay)));
	}
	public function PromisedPaymentForm() {
		return yii::app()->controller->renderPartial('PromisedPaymentForm',array(
			'maximalAmount' => Yii::app()->NumberFormatter->formatCurrency($this->promisedPaymentSettings->promisemax, Yii::app()->params["currency"]),
			'lastPaymentDay' => $this->GetLastPaymentDay(),
			'minimalAmount' => Yii::app()->NumberFormatter->formatCurrency($this->promisedPaymentSettings->promisemin, Yii::app()->params["currency"]),
			'agreementNumber' => $this->agreementData->number,
			'sum' => '',
			'currencySymbol' => $this->promisedPaymentSettings->symbol,
			'agrmid' => $this->agrmid
		),true);
	}
	public function DebtIsNotAllowableMessage() {
		return yii::app()->controller->renderPartial('PromisedPaymentMessage',array('message' => yii::t('payment','DebtIsNotAllowable')),true);
	}
	public function PromisedPaymentIsNotAvailableMessage() {
		return yii::app()->controller->renderPartial('PromisedPaymentMessage',array('message' => yii::t('payment','PromisedPaymentIsNotAllowable')),true);
	}
	public function AgreementAgeIsNotAllowable() {
		return yii::app()->controller->renderPartial('PromisedPaymentMessage',array('message' => yii::t('payment','AgreementAgeIsNotAllowable')),true);
	}
	public function GetBlockContent() {
		if (!$this->IsPaymentLimitsSet()) return $this->PromisedPaymentIsNotAvailableMessage();
		elseif (!$this->IsAgreementAgeAllowable()) return $this->AgreementAgeIsNotAllowable();
		elseif ($this->promisedPaymentSettings->payments AND $this->isPromisePaymentBlocked() ) return $this->PromisedPaymentsGrid();
		elseif ($this->IsNotAllowableDebt()) return $this->DebtIsNotAllowableMessage();
		elseif ($this->IsAllowableDebt()) return $this->PromisedPaymentForm();
		else return $this->DefaultType();
	}
	public function GetParams() {
		$params = array(
			'agrmid' => $this->agrmid,
			'agreementNumber' => yii::app()->controller->lanbilling->agreements[$this->agrmid]->number,
			'styleForHiddingAgreement' => $this->promisedPayment->GetSelectedAgreementID() != $this->agrmid ? ' style="display:none"' : '',
			'content' => $this->GetBlockContent()
		);
		return $params;
	}
} ?>
