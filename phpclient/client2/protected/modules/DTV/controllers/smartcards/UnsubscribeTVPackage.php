<?php class UnsubscribeTVPackage extends UpdateDTVServices {
	protected function GetServicesDataModifier() {
		if (!$this->servicesDataModifier) {
			$this->servicesDataModifier = new ServicesDataModifier;
			$this->servicesDataModifier->setAttributes($_REQUEST);
			$this->servicesDataModifier->common = 1;
		}
		return $this->servicesDataModifier;
	}
	protected function RunOperation() {
		return $this->GetServicesDataModifier()->StopService();
	}
	protected function OnOperationSuccess() {
		$this->Success('PackageSuccessfullyUnsubscribed');
	}
	protected function OnOperationSoapError() {
		$this->Error('PackageUnsubscribeError');
	}
	protected function OnInvalidDataPassed($e) {
		$this->Error('PackageUnsubscribeError');
	}
} ?>