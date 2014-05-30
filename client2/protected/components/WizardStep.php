<?php abstract class WizardStep {
	abstract public function getDescription();
	abstract public function render();
	protected function createForm( $conf ) {
		return yii::app()->controller->getWizard()->createForm($conf);
	}
	protected function lb() {
		return yii::app()->controller->lanbilling;
	}
} ?>
