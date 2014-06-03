<?php class BlockCancelFinalStep extends WizardFinalStep {
	public function getRedirectUrl() {
		$url = yii::app()->controller->getWizard()->getStepUrl(1);
		return yii::app()->controller->createUrl( $url["route"], $url["params"] );
	}
	private function getBlockRasp() {
		return yii::app()->block->getVgroup()->blockrasp;
	}
	public function execute() {
		return $this->lb()->delete("delBlkRasp", array(
            		"id" => $this->getBlockRasp()->recordid
        	));
	}
	protected function getSuccessMessage() {
		$text = ( $this->getBlockRasp()->blkreq == 2 ) ? 'BlockCanceled' : 'UnblockCanceled';
		return yii::t('tariffs_and_services', $text, array(
			'{vgroup}' => yii::app()->block->getVgroup()->vgroup->login
		));
	}
	protected function getErrorMessage() {
		$text = ( $this->getBlockRasp()->blkreq == 2 ) ? 'BlockCancelingError' : 'UnblockCancelingError';
		return yii::t('tariffs_and_services', $text, array(
			'{vgroup}' => yii::app()->block->getVgroup()->vgruop->login
		));
	}
} ?>
