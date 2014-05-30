<?php class ZKHModel extends CFormModel {
	
	public $registrationDate;
	public $registration;
	public $vgid;
	public $catidx;
	private $lastRegistration;
	private $zkh;
	
	public function rules() {
		return array(
			array('registrationDate,registration,vgid,catidx', 'required'),
			array('registrationDate', 'type', 'type' => 'date', 'message' => yii::t('ZKH', 'InvalidDate'), 'dateFormat' => 'yyyy-MM-dd 00:00:00'),
			array('registration,vgid,catidx', 'numerical'),
		 	array('registration', 'moreThanLastRegistration')
		);
	}
	
	public function moreThanLastRegistration() {
		$lastRegistration = $this->getLastRegistration();
		if (!$lastRegistration) $this->addError('catidx', yii::t('ZKH', 'InvalidRequest'));
		if ($lastRegistration["lastvalue"] > $this->registration) {
			$this->addError('registration', yii::t('ZKH', 'InvalidRegistration', array(
				'{currentvalue}' => $this->registration, 
				'{lastvalue}' => $lastRegistration["lastvalue"])
			));
		}
	}
	
	private function getZKHRegistrationComponent() {
		if (!$this->zkh) $this->zkh = new ZKHRegistration;
		return $this->zkh;
	}
	
	private function getLastRegistration() {
		if (!$this->lastRegistration) {
			$this->lastRegistration = $this->getZKHRegistrationComponent()->setVGroupID($this->vgid)->setCategoryID($this->catidx)->getRegistration(); 
		}
		return $this->lastRegistration;
	}
	
	private function getDelta() {
		$lastRegistration = $this->getLastRegistration();
		if ($lastRegistration["lastvalue"]) return $this->registration - $lastRegistration["lastvalue"];
		else return $this->registration;
	}
	
	private function getSum() {
		$lastRegistration = $this->getLastRegistration();
		return $this->getDelta() * $lastRegistration["cost"];
	}
	
	public function getDataToConfirm() {
		$lastRegistration = $this->getLastRegistration();
		$VGroupData = $this->getZKHRegistrationComponent()->getVGroupData();
		return array(
			"vgid" => $this->vgid,
			"device" => $lastRegistration["device"],
			"serial" => $lastRegistration["serial"],
			'catidx' => $this->catidx,
			"sum" => $this->getSum(),
			"servicename" => $lastRegistration["servicename"],
			"lastvalue" => (int) $lastRegistration["lastvalue"],
			"currentvalue" => $this->registration,
			'currentRegistrationDate' => $this->registrationDate,
			"consumption" => $this->registration - ((int) $lastRegistration["lastvalue"]),
			"cost" => $lastRegistration["cost"]
		);
	}
	
	public function save() {
		$lastRegistration = $this->getLastRegistration();
		$VGroupData = $this->getZKHRegistrationComponent()->getVGroupData();
		return yii::app()->controller->lanbilling->save("insupdClientUsboxService",  array(
	     	"vgid" => $this->vgid,
			"tarid" => $VGroupData->vgroup->tarifid,
			"catidx" => $this->catidx,
			"mul" => $this->getDelta(),
			"timefrom" => $this->registrationDate,
			'timeto' => $this->registrationDate,
			"externaldata" => $this->registration,
			"rate" => 1
		), true);
	}
	
} ?>
