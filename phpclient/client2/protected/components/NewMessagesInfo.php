<?php class NewMessagesInfo extends NewItemsInfo {
	protected function GetMessagesCount() {
		return yii::app()->controller->newmessages;
	}
	protected function GetDetailsUrl() {
		return yii::app()->controller->createUrl('/support/index', array('status'=>'new'));
	}
	protected function GetLocalizationKey() {
		return 'NewMessage';
	}
} ?>