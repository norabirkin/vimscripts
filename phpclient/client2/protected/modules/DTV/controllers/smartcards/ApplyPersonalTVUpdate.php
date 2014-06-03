<?php class ApplyPersonalTVUpdate extends UpdateDTVServices {
	protected function GetServicesDataModifier() {
		if (!$this->servicesDataModifier) {
			$this->servicesDataModifier = new ServicesMultipleModifier;
			$this->servicesDataModifier->vgid = yii::app()->request->getParam('vgid',0);
			$this->servicesDataModifier->common = 1;
		}
		return $this->servicesDataModifier;
	}
	protected function RunOperation() {
		return $this->GetServicesDataModifier()->MultipleAssign() AND
			   $this->GetServicesDataModifier()->MultipleStop();
	}
	protected function OnOperationSuccess() {
		$this->Success('ChannelsListUpdated');
	}
	protected function OnOperationSoapError() {
		$this->Error('ChannelsListUpdateError');
	}
	protected function OnInvalidDataPassed($e) {
		if ($e->getMessage() == 'LowBalance') $this->Error('LowBalance',$this->GetBackUrl());
		else $this->Error('ChannelsListUpdateError');
	}
	private function GetBackUrl() {
		return yii::app()->controller->createUrl(
			'/DTV/Smartcards/PersonalTV', 
			array(
				'tab' => yii::app()->request->getParam('tab',0),
				'vgid' => yii::app()->request->getParam('vgid',0)
			)
		);
	}
} ?>