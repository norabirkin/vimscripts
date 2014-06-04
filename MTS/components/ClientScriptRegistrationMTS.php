<?php class ClientScriptRegistrationMTS extends ClientScriptRegistration {
	public function RegisterScripts() {
		Yii::app()->clientScript->registerLinkTag("shortcut icon","image/x-icon",Yii::app()->theme->baseUrl . '/i/favicon.ico');
		Yii::app()->clientScript->registerCssFile(Yii::app()->theme->baseUrl.'/css/layout.css');
		parent::RegisterScripts();
	}
} ?>
