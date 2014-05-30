<?php class ServicesMultipleModifier extends ServicesDataModifier {
	private $balanceChecked = false;
	private function GetTotalAmount() {
		$amount = 0;
		foreach(yii::app()->request->getParam('assign',array()) as $service) {
			$amount += yii::app()->ServicesDataReader->GetService($this->vgid,$service['catidx'])->above;
		}
		return $amount;
	}
	private function LogLowBalanceError() {
		$this->addError('vgid', yii::t('DTVModule.smartcards','LowBalance'));
		$this->LogErrorMessage();
		throw new Exception('LowBalance');
	}
	private function GetTotalBalance() {
		return yii::app()->ServicesDataReader->GetTotalBalance($this->vgid);
	}
	public function CheckBalance() {
		if (!$this->balanceChecked) {
			if ($this->GetTotalAmount() > $this->GetTotalBalance()) $this->LogLowBalanceError();
			else $this->balanceChecked = true;
		} else return true;
	}
	private function MultipleUpdate($methodName,$param) {
		$services = yii::app()->request->getParam($param,array());
		if (!$services) return true;
		foreach ($services as $service) {
			$this->catidx = $service['catidx'];
			$this->servid = $service['servid'];
			$success = $this->$methodName();
			if (!$success) return false;
		}
		return true;
	}
	public function MultipleAssign() {	
		return $this->MultipleUpdate('AssignService','assign');
	}
	public function MultipleStop() {
		return $this->MultipleUpdate('StopService','stop');
	}
} ?>