<?php class PromisedPaymentLogic extends PaymentType {
	protected $agrmid = 0;
	protected $sum = 0;
	public static function GetFirstAgreementID() {
		return array_shift(array_keys(yii::app()->controller->lanbilling->agreements));
	}
	public static function GetSumAndAgrmidFromRequest() {
		$sum = NULL;
		foreach (Yii::app()->request->getParam("promised_sum", array()) as $key => $s) {
        	if ($s) {
        		$sum = $s;
                $agrmidsArray= Yii::app()->request->getParam("promised_agrm", array());
                $agrmid = $agrmidsArray[$key];
            }
        }
		if ($sum === NULL) $agrmid = self::GetFirstAgreementID();
		return array('sum' => $sum, 'agrmid' => $agrmid);
	}
	public function init() {
		parent::init();
		$parameters = self::GetSumAndAgrmidFromRequest();
		$this->sum = $parameters['sum'];
		$this->agrmid = $parameters['agrmid'];
	}
} ?>