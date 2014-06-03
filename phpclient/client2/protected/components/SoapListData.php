<?php class SoapListData extends CApplicationComponent {
	protected function SoapRequest($functionName,$params = array()) {
		return $this->ToArray(yii::app()->controller->lanbilling->get(
			$functionName,
			$params
		));
	}
	protected function ToArray($v) {
		if (!$v) return array();
		if (!is_array($v)) return array($v);
		else return $v;	
	}
} ?>