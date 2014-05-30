<?php 

class AssistResponse {
	private $data;
	private $isError = false;
	private $error;
	private $assistDictionary1 = null;
	private $assistDictionary2 = null;
	private $assistDictionary3 = null;
	private $result;
	public function __construct( $data ) {
		$this->data = $data;
		if (substr( $this->data, 0, 5 ) == "ERROR") {
			$this->isError = true;
			$this->error = substr( $this->data, 6 );
			$this->error = explode( ";", trim($this->error) );
			$this->error = explode( ":", trim($this->error[1]) );
			$this->assistDictionary1 = require("assistDictionary1.php");
			$this->assistDictionary2 = require("assistDictionary2.php");
		} else {
			$this->assistDictionary3 = require("assistDictionary3.php");
			$data = array();
			$array = str_getcsv( $this->data, ";" );
			foreach ($array as $item) {
				if (!$item) continue;
				$item = explode( ":", $item );
				$data[ $item[0] ] = $item[1];
			}
			$this->result = $data;
		}
	}
	public function getParamDescr( $paramName ) {
		return $this->assistDictionary3[$paramName];
	}
	public function getParam( $paramName ) {
		return $this->result[$paramName];
	}
	public function getResult() {
		return $this->result;
	}
	public function isError() {
		return $this->isError;
	}
	public function getErrorType() {
		return $this->assistDictionary1[ $this->error[0] ];
	}
	public function getErrorDetail() {
		return $this->assistDictionary2[ $this->error[1] ];
	}
}

class AssistConfirm {
	private function getRequestBody( $billnumber ) {
		$params = array( 
			"billnumber" => $billnumber,
			"Merchant_ID" => yii::app()->params["assist"]["Merchant_ID"],
			"Login" => yii::app()->params["assist"]["Login"],
			"Password" => yii::app()->params["assist"]["Password"]
		);
		return http_build_query($params);
	}
	private function getHost() {
		return yii::app()->params["assist"]["confirm_url"];
	}
	private function nocurlRequest( $billnumber ) {
		$url = $this->getHost() . "?" . $this->getRequestBody( $billnumber );
		return file_get_contents( $url );
	}
	private function curlRequest( $billnumber ) {
		$c = curl_init();
		curl_setopt($c, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($c, CURLOPT_POST, true);
		curl_setopt($c, CURLOPT_POSTFIELDS, $this->getRequestBody( $billnumber ));
		curl_setopt($c, CURLOPT_URL, $this->getHost());
		$response = curl_exec($c);
		curl_close($c);
		return $response;
	}
	public function request( $billnumber ) {
		if ( function_exists("curl_init") ) $response = $this->curlRequest( $billnumber );
		else $response = $this->nocurlRequest( $billnumber );
		return new AssistResponse( $response );
	}
} ?>
