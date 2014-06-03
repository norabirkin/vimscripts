<?php class ZKHTabs extends BaseTabs {
	protected $tabContentTemplate = 'agreement';
	protected function getAgreements() {
		$zkh = new ZKH;
		return $zkh->getAgreements();
	}
	protected function getVgroups($vgroups) {
		$html = '';
		foreach ($vgroups as $vgroup) {
			$ZKHServicesGrid = new ZKHServicesGrid;
			$ZKHServicesGrid->setServices($vgroup["services"]);
			$html .= yii::app()->controller->renderPartial('vgroup', array(
				'title' => $vgroup["login"],
				'serial' => $vgroup["serial"] ? $vgroup["serial"] : yii::t('ZKH','NoSerial'),
				'services' => $ZKHServicesGrid->Render()
			), true);
		}
		return $html;
	}
	protected function AddData() {
		foreach ($this->getAgreements() as $agreement) {
			$this->AddTab(array(
				'title' => $agreement["number"],
            	'params' => array(
            		"vgroups" => $this->getVgroups($agreement['vgroups'])
				)
			));
		}
	}
} ?>