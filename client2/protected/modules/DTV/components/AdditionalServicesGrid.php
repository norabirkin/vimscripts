<?php class AdditionalServicesGrid extends BaseGrid {
	private $services;
	protected $messagesCategory = 'DTVModule.additional';
	protected $title = "AvailableAdditionalServices";
	private $act;

	public function setAct($act) {
		if ( ((int)$act) == 0 ) $this->act = 0;
		else $this->act = 1;
	}

	public function setServices($services) {
		$this->services = $services;
	}

	private function getNextStepUrl( $service ) {
		$params = array(
			"catidx" => $service["data1"]->catidx,
			"act" => $this->act
		);
		if ($this->act == 0) $params["servid"] = $service["data1"]->servid;
		$url = yii::app()->controller->getWizard()->getNextStepUrl($params);
		return array_merge( array( $url["route"] ), $url["params"] );
	}
	
	private function getActionLink( $service ) {
		$text = $this->act ? "Assign" : "Stop";
		return CHtml::link( yii::t('DTVModule.additional', $text), $this->getNextStepUrl($service) );
	}

	protected function AddData() {
		foreach ($this->services as $service) {
			$this->AddRow(array(
				"ServiceTitle" => $service["data1"]->catdescr,
				"Tariff" => $service["data1"]->tardescr,
				"Amount" => Yii::app()->NumberFormatter->formatCurrency($service["data1"]->above, "RUB"),
				"Action" => $this->getActionLink($service)
			));
		}
	}
} ?>
