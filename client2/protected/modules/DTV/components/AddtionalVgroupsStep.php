<?php class AddtionalVgroupsStep extends WizardStep {
	private $main;
	public function getDescription() {
		return yii::t('tariffs_and_services', 'ChooseVGroup');
	}
	private function getNextStepUrl( $vgid ) {
		$url = yii::app()->controller->getWizard()->getNextStepUrl( array( 
			'vgid' => $vgid
		));
		return array_merge( array( $url["route"] ), $url["params"] );
	}
	public function getAgreementVgroups( $agrmid ) {
		$data = $this->getMainComponent()->getData();
		$data = $data[$agrmid]["vgroups"];
		$vgroups = array();
		foreach ( $data as $vgroup ) {
			$vgroup = $vgroup["vgroup_data"]->vgroup;
			$vgroups[] = array(
				"login" => CHtml::link( $vgroup->login, $this->getNextStepUrl($vgroup->vgid) ),
				"tariff" => $vgroup->tarifdescr,
				"agent" => $vgroup->agentdescr
			);
		}
		return $vgroups;
	}
	public function getMainComponent() {
		if( !$this->main ) $this->main = new Additional;
		return $this->main;
	}
	public function render() {
		$data = $this->getMainComponent()->getData();
		if ($data) {
			$group = new GridGroup;
			foreach ($data as $k => $v) {
				$group->addGrid(array(
					"title" => $data[$k]["number"],
					"data" => $this->getAgreementVgroups($k),
					"localize" => 'DTVModule.additional',
					"columns" => array( "login", "tariff", "agent" )
				));
			}
			return $group->render();
		}
		else return yii::t("DTVModule.additional", "VgroupsNotFound");
	}	
} ?>
