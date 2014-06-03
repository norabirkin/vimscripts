<?php class AdditionalSevricesStep extends WizardStep {
	public function getDescription() {
		return yii::t('DTVModule.additional', 'ChooseService');
	}
	private function getNextStepUrl( $service, $act ) {
		$params = array(
			"catidx" => $service["data1"]->catidx,
			"act" => $act
		);
		if ($act == 0) $params["servid"] = $service["data1"]->servid;
		$url = yii::app()->controller->getWizard()->getNextStepUrl($params);
		return array_merge( array( $url["route"] ), $url["params"] );
	}
	private function getActionLink( $service, $act ) {
		$text = $act ? "Assign" : "Stop";
		return CHtml::link( yii::t('DTVModule.additional', $text), $this->getNextStepUrl($service, $act) );
	}
	private function processGridData( $services, $act ) {
		$data = array();
		foreach ($services as $service) {
			$data[] = array(
				"title" => $service["data1"]->catdescr,
				"tariff" => $service["data1"]->tardescr,
				"amount" => Yii::app()->NumberFormatter->formatCurrency($service["data1"]->above, "RUB"),
				"action" => $this->getActionLink( $service, $act )
			);
		}
		return $data;
	}
	private function getGridConfig( $data, $title ) {
		return array(
			"title" => $title,
			"columns" => array( "title", "tariff", "amount", "action" ),
			"localize" => 'DTVModule.additional',
			"data" => $data
		);
	}
	public function render() {
		$main = new Additional;
		$vg = $main->getVGData( yii::app()->controller->getWizard()->getParam("vgid") );
		$assigned = $main->getAssignedServices($vg);
		$available = $main->getAvailableServices($vg);

		$group = new GridGroup;

		$data = $this->processGridData( $available, 1 );
		$group->addGrid( $this->getGridConfig($data, "AvailableAdditionalServices") );

		$data = $this->processGridData( $assigned, 0 );
		$group->addGrid( $this->getGridConfig($data, "AssignedAdditionalServices") );

		return $group->render();
	}	
} ?>
