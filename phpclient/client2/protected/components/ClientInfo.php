<?php class ClientInfo extends CWidget {
	private function GetUserName() {
		return yii::app()->controller->lanbilling->clientInfo->account->abonentsurname ? 
		       yii::app()->controller->lanbilling->clientInfo->account->abonentsurname . ' ' . 
		       yii::app()->controller->lanbilling->clientInfo->account->abonentname . ' ' . 
		       yii::app()->controller->lanbilling->clientInfo->account->abonentpatronymic : 
		       yii::app()->controller->lanbilling->clientInfo->account->name;
	}
	public function getEditor($property) {
		return $this->widget('ext.LB.widgets.Edit',array(
        	'id' => $property, 
            'route' => 'editform/updateaccount',
            'data' => array(
                'property' => $property
            ),
            'hint' => yii::app()->params['editing_client_info'][$property] ? '' : yii::app()->params['client_info_editors_hint'],
            'script' => $this->getEditorScript($property)
        ),true);
	}
    public function getEditorScript($property) {
        if ($property == 'phone') {
            return Profile_PhoneMask::script();
        } else {
            return '';
        }
    }
    public function getPropertyValue($property) {
        return yii::app()->controller->lanbilling->clientInfo->account->$property;
    }
    public function editors() {
        return array(
            array(
                'property' => 'phone',
                'title' => 'Phone'
            ),
            array(
                'property' => 'email',
                'title' => 'E-Mail'
            )
        );
    }
	public function run() {
        $infoblock = new Infoblock;
		$this->render('ClientInfo', array(
			'clientName' => $this->GetUserName(),
			'login' => yii::app()->controller->lanbilling->clientInfo->account->login,
			'paymentUrl' => yii::app()->controller->createUrl('/payment/index'),
			'userbalance' => yii::app()->controller->userbalance,
			'newmessages' => yii::app()->controller->widget('NewMessagesInfo', array(), true),
			'unpaidorders' => yii::app()->controller->widget('NewUnpayedOrdersInfo', array(), true),
            'infoblock' => $infoblock
		));
	}
} ?>
