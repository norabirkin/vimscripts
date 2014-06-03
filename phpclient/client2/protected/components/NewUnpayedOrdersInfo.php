<?php class NewUnpayedOrdersInfo extends NewItemsInfo {
	protected function GetMessagesCount() {
		return yii::app()->controller->unpaidorders;
	}
	protected function GetDetailsUrl() {
		return yii::app()->controller->createUrl('/documents/list', array('unpayed'=>1));
	}
	protected function GetLocalizationKey() {
		return 'NewBill';
	}
} ?>