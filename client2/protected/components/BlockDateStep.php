<?php class BlockDateStep extends WizardStep {
	public function getDescription() {
		$text = (yii::app()->controller->getWizard()->getParam('action')) ? $text = 'ChooseUnblockDate' : 'ChooseBlockDate';
		return yii::t( 'tariffs_and_services', $text );
	}
	public function render() {
		$url = yii::app()->controller->getWizard()->getStepUrl(1);
		$form = $this->createForm(array(
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
					"type" => "date",
					"label" => yii::t('tariffs_and_services', 'Date'),
					"name" => 'date',
					"minDate" => date( "Y-m-d", yii::app()->block->getMinDate() ),
					"value" => date( "Y-m-d", yii::app()->block->getMinDate() )
				),
				array(
					"type" => "submit",
					"back" => yii::app()->controller->createUrl( $url["route"], $url["params"] )
				)
			)
		));
		return $form->render();
	}	
} ?>
