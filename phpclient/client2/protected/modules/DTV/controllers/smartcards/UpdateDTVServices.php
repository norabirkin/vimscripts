<?php class UpdateDTVServices extends CAction {
	protected $servicesDataModifier;
	protected function GetMainPageURL() {
		return yii::app()->controller->createUrl('smartcards/index',array('tab' => yii::app()->request->getParam('tab',0)));
	}
	private function SetMessageAndRedirect($message, $category, $redirectURL = NULL) {
		if (!$redirectURL) $redirectURL = $this->GetMainPageURL();
		Yii::app()->user->setFlash($category,Yii::t('DTVModule.smartcards', $message));
		yii::app()->controller->redirect($redirectURL);
	}
	protected function Success($message,$redirectURL = NULL) {
		$this->SetMessageAndRedirect($message, 'success', $redirectURL);
	}
	protected function Error($message,$redirectURL = NULL) {
		$this->SetMessageAndRedirect($message, 'error', $redirectURL);
	}
	public function run() {
		try {
			if ($this->RunOperation()) $this->OnOperationSuccess();
			else $this->OnOperationSoapError();
		} catch (Exception $e) {
			$this->OnInvalidDataPassed($e);
		}
	}
} ?>