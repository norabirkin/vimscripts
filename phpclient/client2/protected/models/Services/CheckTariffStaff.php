<?php class CheckTariffStaff extends CValidator {
	private $model;
	private $currentTariffID;
	private $tariffChoosenForChangeID;
	
	protected function validateAttribute($object,$attribute) {
		$this->model = $object;
		$this->currentTariffID = $this->model->get_vgdata()->vgroup->tarifid;
		$this->tariffChoosenForChangeID = $this->model->tarid;
		if(!$this->canReturnFromTariffChoosenForChangeToCurrentTariff()) $this->setWarning();
	}
	
	private function canReturnFromTariffChoosenForChangeToCurrentTariff() {
		$canReturnFromTariffChoosenForChangeToCurrentTariff = false;
		foreach($this->getReplacementListOfTariffChoosenForChange() as $tariff) {
			if ($tariff->tarid == $this->currentTariffID) {
				$canReturnFromTariffChoosenForChangeToCurrentTariff = true;
				break;
			}
		}
		return $canReturnFromTariffChoosenForChangeToCurrentTariff;
	}
	
	private function getReplacementListOfTariffChoosenForChange() {
		$tariffChoosenForChangeData = $this->getTariffChoosenForChangeData();
		$params = array('filter' => array(
			'groupid' => (int) $tariffChoosenForChangeData->groupid,
			'grouptarid' => (int) $this->tariffChoosenForChangeID,
			'groupmoduleid' => (int) $tariffChoosenForChangeData->groupmoduleid,
			'tarid' => (int) $this->tariffChoosenForChangeID
		));
		return Arr::get_array(yii::app()->controller->lanbilling->get('getTarifsStaff',$params));
	}
	
	private function getTariffChoosenForChangeData() {
		$tariffChoosenForChangeData = NULL;
		foreach ($this->model->get_vgdata()->tarstaff as $tariff) {
			if ($tariff->tarid == $this->tariffChoosenForChangeID) {
				$tariffChoosenForChangeData = $tariff;
				break;
			}
		}
		return $tariffChoosenForChangeData;
	}
	
	private function setWarning() {
		Yii::app()->user->setFlash('error',Yii::t('tariffs_and_services', 'CantReturnToCurrentTariff'));
	}
} ?>
