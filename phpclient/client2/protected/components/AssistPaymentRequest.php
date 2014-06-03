<?php class AssistPaymentRequest {
	protected $nameParts = NULL;
	protected $OrderAmount;
	protected $Comment;
	protected $agrmid;
	protected $merchant_url;
	function __construct() {
		$this->OrderAmount = yii::app()->request->getParam('OrderAmount',0);
		if (!$this->OrderAmount OR !is_numeric($this->OrderAmount)) throw new Exception('NoSum');
		$this->agrmid = yii::app()->request->getParam('AgreementID',0);
		if (!$this->agrmid) throw new Exception('SomeError');
		$this->Comment = yii::app()->request->getParam('Comment','');
		$this->merchant_url = yii::app()->params['assist']['merchant_url'];
		if (!$this->merchant_url) throw new Exception('SomeError');
	}
	protected function GetRequestData() {
		return array(
			'Merchant_ID' => yii::app()->params['assist']['Merchant_ID'],
			'OrderNumber' => $this->GetOrderNumber(),
			'Delay' => 1,
			'OrderCurrency' => 'RUB',
			'FirstName' => $this->GetFirstName(),
			'LastName' => $this->GetLastName(),
			'Email' => yii::app()->controller->lanbilling->clientInfo->account->email,
			'OrderAmount' => $this->OrderAmount,
			'Comment' => $this->Comment,
			'TestMode' => (int) yii::app()->params['assist']['TestMode'],
			'URL_RETURN' => 'http://' . $_SERVER["HTTP_HOST"] . yii::app()->controller->createUrl('payment/index'),
			'URL_RETURN_OK' => 'http://' . $_SERVER["HTTP_HOST"] . yii::app()->controller->createUrl('payment/assist')
		);
	}
	public static function run() {
		if (yii::app()->params['assist']['requestMethod'] == 'get') $assistRequestManager = new AssistPaymentGetRequest;
		elseif (yii::app()->params['assist']['requestMethod'] == 'post') $assistRequestManager = new AssistPaymentPostRequest;
		else throw new Exception('SomeError');
		$assistRequestManager->SendRequest();
	}
	protected function GetOrderNumber() {
		$orderNumber = yii::app()->controller->lanbilling->get('insPrePayment', array(
			"isInsert" => 1,
			"val" => array(
				"agrmid" => $this->agrmid,
				"amount" => $this->OrderAmount,
				"curname" => 'RUR'
			)
		));
		return $orderNumber;
	}
	protected function GetNamePart($index) {
		if ($this->nameParts === NULL) {
			$NameString = yii::app()->controller->lanbilling->clientInfo->account->name;
			$this->nameParts = explode(' ', $NameString);
		}
		return $this->nameParts[$index];
	}
	protected function GetFirstName() {
		return $this->GetNamePart(1);
	}
	protected function GetLastName() {
		return $this->GetNamePart(0);
	}
} ?>
