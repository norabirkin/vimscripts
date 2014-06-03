<?php class ServicesDataModifier extends CFormModel {
	public $servid = 0;
	public $vgid;
	public $catidx = 0;
	public $common = 0;
	public $timefrom;
	public $timeto = '';
	public function rules() {
		return array(
			array('vgid', 'required', 'on' => 'Assign'),
			array('servid', 'required', 'on' => 'Unsubscribe'),
			array('vgid,servid,common,catidx', 'numerical'),
			array('timefrom,timeto', 'FormattedDate'),
			array('vgid', 'CheckBalance', 'on' => 'Assign')
		);
	}
	public function CheckBalance() {
		$totalBalance = yii::app()->ServicesDataReader->GetTotalBalance($this->vgid);
		$serviceData =  yii::app()->ServicesDataReader->GetService($this->vgid,$this->catidx);
		if ($serviceData->above > $totalBalance) $this->addError('vgid', yii::t('DTVModule.smartcards','LowBalance'));
	}
	public function FormattedDate($attribute) {
		$pattern = '/[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}/';
		if ($this->$attribute AND !preg_match($pattern, $this->$attribute)) $this->addError($attribute, yii::t('tariffs_and_services','InvalidDateFormat'));
	}
	private function GetCurrentDate() {
		return yii::app()->controller->lanbilling->subDate('now', 0, 'day', 'Y-m-d 00:00:00');
	}
	private function stopUsboxService() {
		$struct = array(
        		"id" => $this->servid,
			"timeto" => ""
        	);
        	return yii::app()->controller->lanbilling->get("stopUsboxService", $struct, false, array("getVgroupServices"));
	}
	private function insupdClientUsboxService() {
		$struct = array(
         	"servid"    =>  (int) $this->servid,
            "vgid"      =>  (int) $this->vgid,
            "tarid"     =>  yii::app()->ServicesDataReader->GetTarifID($this->vgid),
            "catidx"    =>  (int) $this->catidx,
            "mul"       =>  1,
            'common' => (int) $this->common,
            "timefrom"  =>  $this->timefrom ? $this->timefrom : $this->GetCurrentDate(),
            "timeto" => $this->timeto,
            'rate' => 1
        );
		return yii::app()->controller->lanbilling->save( "insupdClientUsboxService", $struct, ($this->servid > 0) ? false : true, array("getVgroupServices"));
	}
	public function LogErrorMessage() {
		$errors = $this->getErrors();
		Dumper::log($this->getAttributes(),'error.ServicesDataModifier[ATTRIBUTES]');
		foreach ($errors as $attribute => $errorMessages) {
			foreach ($errorMessages as $message) Dumper::log($message,'error.ServicesDataModifier[WRONG_ATTRIBUTE='.$attribute.']');
		}
	}
	public function ValidateAndSave($methodName) {
		if ($this->validate()) {
			return $this->$methodName();
		} else {
			$this->LogErrorMessage();
			throw new Exception('Invalid data');
		}
	}
	public function AssignService() {
		$this->setScenario('Assign');
		return $this->ValidateAndSave('insupdClientUsboxService');
	}
	public function StopService() {
		$this->setScenario('Unsubscribe');
		return $this->ValidateAndSave("stopUsboxService");
	}
} ?>
