<?php class BlockVGStep extends WizardStep {
	public function getDescription() {
		return yii::t('tariffs_and_services', 'ChooseVGroup');
	}
	public function getVGGrids() {
		$grids = array();
		foreach( $this->lb()->getRows('getClientVgroups') as $vgroup ) {
			if(!isset( $grids[$vgroup->vgroup->agrmid] )) $grids[$vgroup->vgroup->agrmid] = new BlockVGGrid(array(
				"title" => $this->getAgreementNumber( $vgroup->vgroup->agrmid ),
				"vgroups" => array() 
			));
			$grids[$vgroup->vgroup->agrmid]->addVgroup( $vgroup );
		}
		return $grids;
	}
	public function getAgreementNumber( $id ) {
		return $this->lb()->agreements[ $id ]->number;
	}
	public function render() {
		$html = '';
		foreach( $this->getVGGrids() as $grid ) $html .= $grid->Render();
		return $html;
	}	
} ?>
