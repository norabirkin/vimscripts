<?php class LBWizardFinalStep extends LBWizardItem {
	public function getRedirectUrl() {
		$url = $this->wizard->getStepUrl(1);
		return yii::app()->controller->createUrl( $url["route"], $url["params"] );
	}
    public function getMessage( $success ) {
        if ($success) yii::app()->user->setFlash( "success", $this->t($this->getSuccessMessage()) );
        else yii::app()->user->setFlash( "error", $this->t($this->getErrorMessage()) );
    }
    public function execute() {
        throw new Exception('define method');
    }
    protected function getSuccessMessage() {
        throw new Exception('define method');
    }
    protected function getErrorMessage() {
        throw new Exception('define method');
    }
} ?>
