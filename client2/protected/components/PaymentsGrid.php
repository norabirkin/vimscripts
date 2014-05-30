<?php class PaymentsGrid {
	private $data;
	function __construct($data) {
		$this->data = $data;
	}
	private function GetColumns() {
		return array(
			'promdate' => Yii::t('payment', 'PaymentPromisedRequested'),
			'promtill' => Yii::t('payment', 'PaymentPromisedTill'),
			'amount' => Yii::t('payment', 'PaymentSum'),
			'status' => Yii::t('payment', 'PaymentPromisedPaid')
		);		
	}
	protected function GetPaymentStatus($id) {
		if ( $id == -1 ) return yii::t('payment','Exceed');
		elseif ( $id == 0 ) return yii::t('payment','Active');
		elseif ( $id > 0 ) return yii::t('payment','PaymentPromisedPaid');
	}
	protected function GetProcessedData() {
		$result = array();
		foreach ($this->data as $payment) {
			$item = array(
				'promdate' => yii::app()->controller->formatDateWithTime($payment->promdate),
				'promtill' => yii::app()->controller->formatDateWithTime($payment->promtill),
				'amount' => Yii::app()->NumberFormatter->formatCurrency($payment->amount, Yii::app()->params["currency"]),
				'status' => $this->GetPaymentStatus($payment->payid)
			);
			$result[] =$item;
		}
		return $result;
	}
	public function Render() {
		return yii::app()->grid->get_grid($this->GetProcessedData(),$this->GetColumns());
	}
} ?>