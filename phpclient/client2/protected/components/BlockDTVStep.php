<?php class BlockDTVStep extends WizardStep {
	private function getDTVServicesGrid() {
		return new BlockDTVGrid(array( "services" => yii::app()->block->getAssignedDTVServices_ThatCanBeKeptTurnedOn() ));
	}
	public function getDescription() {
		return yii::t('tariffs_and_services', 'BlockDTV');
	}
	public function render() {
		$grid = $this->getDTVServicesGrid();
		$info = new LBForm(array(
			"items" => array(
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
				)
			)
		));
		$yes = yii::app()->controller->getWizard()->getNextStepUrl();
		$no = yii::app()->controller->getWizard()->getStepUrl(1);
		return yii::app()->controller->renderPartial( "blockDTV", array(
			"info" => $info->render(),
			"grid" => $grid->Render(),
			"descr" => yii::t('tariffs_and_services', 'DoYouWantToBlockDTVServices'),
			"yes" => CHtml::link(yii::t('tariffs_and_services', 'Yes'), array_merge(
				array( $yes["route"] ), 
				$yes["params"]
			), array( "class" => "input-submit block-link" )),
			"no" => CHtml::link(yii::t('tariffs_and_services', 'No'), array_merge(
				array( $no["route"] ),
				$no["params"]
			), array( "class" => "input-submit block-link" ))
		), true);
	}	
} ?>
