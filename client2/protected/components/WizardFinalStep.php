<?php abstract class WizardFinalStep {
	abstract public function getRedirectUrl();
	abstract public function execute();
	public function getMessage( $success ) {
		if ($success) yii::app()->user->setFlash( "success", $this->getSuccessMessage() );
		else yii::app()->user->setFlash( "error", $this->getErrorMessage() );
	}
	abstract protected function getSuccessMessage();
	abstract protected function getErrorMessage();
} ?>
