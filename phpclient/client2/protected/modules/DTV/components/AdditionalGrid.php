<?php class AdditionalGrid extends BaseGrid {
	private $vgroups;
	protected $messagesCategory = 'DTVModule.additional';

	public function setVgroups($vgroups) {
		$this->vgroups = $vgroups;
	}

	private function getNextStepUrl( $vgid ) {
		$url = yii::app()->controller->getWizard()->getNextStepUrl( array( 
			'vgid' => $vgid
		));
		return array_merge( array( $url["route"] ), $url["params"] );
	}
	
	protected function AddData() {
		foreach ($this->vgroups as $vg) {
			$vgroup = $vg["vgroup_data"]->vgroup;
			$this->AddRow(array(
				"Login" => CHtml::link( $vgroup->login, $this->getNextStepUrl($vgroup->vgid) ),
				"Tariff" => $vgroup->tarifdescr,
				"Agent" => $vgroup->agentdescr
			));
		}
	}
} ?>
