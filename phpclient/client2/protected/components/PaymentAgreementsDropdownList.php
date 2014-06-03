<?php class PaymentAgreementsDropdownList extends CWidget {
	private $agreementsData = array();
	private $agrmid;
	private $arrearsOfAgreement = array();
	private $balancesOfAgreements = array();
	private $balanceOfCurrentAgreement;
	
	public function init() {
		$agreements = yii::app()->controller->lanbilling->agreements;
		$this->agrmid = $this->GetSelectedAgreementID();
		$this->balanceOfCurrentAgreement = Yii::app()->NumberFormatter->formatCurrency($agreements[$this->agrmid]->balance, Yii::app()->params["currency"]);
		foreach ($agreements as $agrmid => $agreement) {
			$this->AddAgreementData($agreement, $agrmid);
			$this->AddBalanceOfAgreement($agreement, $agrmid);
			$this->AddArrearsOfAgreement($agreement, $agrmid);
		}
	}
	public function AddBalanceOfAgreement($agreement, $agrmid) {
		$this->balancesOfAgreements[$agrmid] = Yii::app()->NumberFormatter->formatCurrency($agreement->balance, Yii::app()->params["currency"]);
	}
	public function AddArrearsOfAgreement($agreement, $agrmid) {
		if ($agreement->balance < 0) $this->arrearsOfAgreement[$agrmid] = round(( (-1) * $agreement->balance ), 2);
		else $this->arrearsOfAgreement[$agrmid] = 0;
	}
	public function AddAgreementData($agreement, $agrmid) {
		$operatorName = yii::app()->controller->lanbilling->Operators[$agreement->operid]['name'];
		$agreementNumber =  $agreement->number;
		$this->agreementsData[html_entity_decode($operatorName)][$agrmid] = $agreementNumber;
	}
	public function GetSelectedAgreementID() {
		$sumAndAgrmid = PromisedPaymentLogic::GetSumAndAgrmidFromRequest();
		return $sumAndAgrmid['agrmid'];
	}
	public function CreateJsArray($array) {
		$code = '{ ';
		$items = array();
		foreach ($array as $k => $v) {
			$items[] = "'".$k."':'".$v."'";
		}
		$code .= implode(',',$items);
		$code .= ' }';
		return $code;
	}
	public function AddScript() {
		$code = '';
		$n = '
';
		$code .= '<script type="text/javascript">';
		$code .=  '$("#payment-agreement")[0].agreement_balances = ' . $this->CreateJsArray($this->balancesOfAgreements). ';' .$n;
		$code .=  '$("#payment-agreement")[0].agreement_arrears = ' . $this->CreateJsArray($this->arrearsOfAgreement). ';' .$n;
		$code .=  '$("#payment-agreement")[0].cur_agreement = ' . $this->agrmid . ';';
		$code .=  '</script>';
		return $code;
	}
	public function run() {
		yii::app()->controller->renderPartial('PaymentAgreementDropdownList', array(
			'dropdownList' => CHtml::dropdownList(NULL,$this->agrmid,$this->agreementsData,array('id' => 'payment-agreement')),
			'script' => $this->AddScript(),
			'balance' => $this->balanceOfCurrentAgreement
		));
	}
} ?>
