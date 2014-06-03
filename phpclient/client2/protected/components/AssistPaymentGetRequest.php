<?php class AssistPaymentGetRequest extends AssistPaymentRequest {
	public function SendRequest() {
		yii::app()->controller->redirect($this->GetQueryString());
	}
	private function GetQueryString() {
		$queryString = http_build_query($this->GetRequestData());
		if (strpos($this->merchant_url, '?')) $queryString = $this->merchant_url . '&' . $queryString;
		else $queryString = $this->merchant_url . '?' . $queryString;
		return $queryString;
	}
} ?>