<?php class AssignTVPackage extends UpdateDTVServices {
	protected function GetServicesDataModifier() {
		if (!$this->servicesDataModifier) {
			$this->servicesDataModifier = new ServicesDataModifier;
			$this->servicesDataModifier->setAttributes($_REQUEST);
			$this->servicesDataModifier->common = 1;
		}
		return $this->servicesDataModifier;
	}
	protected function RunOperation() {
		return $this->GetServicesDataModifier()->AssignService();
	}
	protected function OnOperationSuccess() {
		$this->Success('PackageSuccessfullySubscribed', $this->GetThankYouPageURL());
	}
	protected function OnOperationSoapError() {
		$this->Error('PackageSubscribeError');
	}
	protected function OnInvalidDataPassed($e) {
		$this->Error('PackageSubscribeError');
	}
	protected function GetThankYouPageURL() {
		return yii::app()->controller->createUrl(
    		"/DTV/Smartcards/Thanks", 
    		array( 
    			"tab" => yii::app()->request->getParam('tab',0),
    			"vgid" => yii::app()->request->getParam('vgid',0)
			)
		);
	}
} ?>