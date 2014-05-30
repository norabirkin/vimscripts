<?php class BlockFinalStep extends WizardFinalStep {
	private $action;
	private $vgid;
	private $date;
	public function getRedirectUrl() {
		$url = yii::app()->controller->getWizard()->getStepUrl(1);
		return yii::app()->controller->createUrl( $url["route"], $url["params"] );
	}
	private function setParams() {
		$this->action = (int) yii::app()->controller->getWizard()->getParam("action");
		$this->vgid = (int) yii::app()->controller->getWizard()->getParam("vgid");
		$this->date = (string) yii::app()->controller->getWizard()->getParam("date");
		yii::app()->block->getVgroup()->vgroup;
		yii::app()->block->validateDate( $this->date );
	}
	public function execute() {
		$this->setParams();
		return yii::app()->block->changeVGState();
	}
	protected function getSuccessMessage() {
		$text = ($this->action) ? 'VGroupUnblocked' : 'VGroupBlocked';
		return yii::t('tariffs_and_services', $text, array(
			'{vgroup}' => yii::app()->block->getVgroup()->vgroup->login
		));
	}
	protected function getErrorMessage() {
		$text = ($this->action) ? 'CantUnblockVGroup' : 'CantBlockVGroup';
		return yii::t('tariffs_and_services', $text, array(
			'{vgroup}' => yii::app()->block->getVgroup()->vgruop->login
		));
	}
} ?>
