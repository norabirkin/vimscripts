<?php class BlockCancelConfirm extends WizardStep {	
	public function getDescription() {
		return yii::app()->block->getCancelChangeStateText( yii::app()->block->getVgroup() );
	}
	public function getDate() {
		$date = yii::app()->block->getVgroup()->blockrasp->changetime;
		return yii::app()->controller->formatDate(strtotime($date));
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
					"type" => "display",
					"label" => yii::t('tariffs_and_services', 'Date'),
					"text" => $this->getDate()
				),
				array(
					"type" => "submit",
					"text" => yii::t("tariffs_and_services", "Cancel"),
					"back" => yii::app()->controller->createUrl( $url["route"], $url["params"] )
				)
			)
		));
		return $form->render();
	}
} ?>
