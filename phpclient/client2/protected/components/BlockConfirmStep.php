<?php class BlockConfirmStep extends WizardStep {
	public function getDescription() {
		$text = (yii::app()->controller->getWizard()->getParam( "action" )) ? 'UnblockConfirm' : 'BlockConfirm';
		return yii::t('tariffs_and_services', $text);
	}
	private function getDTVInfo() {
		if (yii::app()->controller->getWizard()->getParam( "action")) return null;
		$servicesToStop = $this->getServicesToStop();
		if (!$servicesToStop) return null;
		return array(
			"type" => "display",
			"label" => yii::t('tariffs_and_services', "DTVServicesToStop"),
			"text" => $servicesToStop
		);
	}
	private function getServicesToStop() {
		$result = array();
		$services = yii::app()->block->getAssignedDTVServices_ThatCanBeKeptTurnedOn();
		foreach( $services as $service ) $result[] = $service->catdescr; 
		return implode(', ', $result);
	}
	public function render() {
		$url = yii::app()->controller->getWizard()->getStepUrl(1);
		$items = array(
			array(
				"type" => "display",
				"label" => yii::t('tariffs_and_services', 'Agreement'),
				"text" => yii::app()->block->getAgreement()
			),
			array(	
				"type" => "display",
				"label" => yii::t('tariffs_and_services', 'VGroup'),
				"text" => yii::app()->block->getVgroup()->vgroup->login
			),
			array(
				"type" => "display",
				"label" => yii::t('tariffs_and_services', 'Date'),
				"text" => yii::app()->block->getDate()
			),
		);
		if ($item = $this->getDTVInfo()) $items[] = $item;
		$items[] = array(
			"type" => "submit",
			"back" => yii::app()->controller->createUrl( $url["route"], $url["params"] )
		);
		$info = $this->createForm(array(
			"items" => $items 
		));
		return $info->render();
	}
} ?>
