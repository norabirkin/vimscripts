<?php class PasswordController extends Controller {
	
    public function filters() {
        return CMap::mergeArray(parent::filters(),array(
            array(
                'application.filters.lbAccessControl',
                'page' => 'menu_password'
            )
        ));
    }

	public function actionIndex() {
	
		
		$errData = Yii::t('password_changing', 'After the password change you will be logged out');
		
		
		$err = Yii::app()->request->getParam('err', '');
	
		if($err == 1) {
			$this->message = Yii::t('password_changing', 'Wrong password');
		}
		if($err == 2) {
			$this->message = Yii::t('password_changing', 'Passwords not match');
		}
		if($err == 3) {
			$this->message = Yii::t('password_changing', 'Password is too short');
		}
		
		if (!empty($this->message)) {
			$errData = $this->message;
		}
		
		Yii::app()->user->setFlash('error', $errData);
		
		$html = $this->form(array(
		    array(
		        'type' => 'hidden',
		        'name' => 'r',
				'value' => 'password/settings'
		    ),
		    array(
		        'type' => 'password',
		        'name' => 'pass',
				'label' => 'Current password'
		    ),
		    array(
		        'type' => 'password',
		        'name' => 'newpass',
				'label' => 'New password'
		    ),
		    array(
		        'type' => 'password',
		        'name' => 'newpassconfirm',
				'label' => 'Confirm password'
		    ),
		    array(
		        'type' => 'submit',
		        'value' => 'Change',
		    )
		))->render();
		
		$this->output($html); 
		
	}
	
	public function actionSettings() {
		
		$currentPass = $this->lanbilling->clientInfo->account->pass;
		$values = array('userid' => $this->lanbilling->client);
		$keys = array('email', 'phone');
		
		if(Yii::app()->request->getParam('pass', '') != '' && Yii::app()->request->getParam('pass', '') != $currentPass) {
			$err = 1;
			$this->message = Yii::t('password_changing', 'Wrong password');
		}
		if (Yii::app()->request->getParam('newpass', '') != Yii::app()->request->getParam('newpassconfirm', '')) {
			$err = 2;
			$this->message = Yii::t('password_changing', 'Passwords not match');
		}
		if (Yii::app()->request->getParam('newpass', '') && strlen(Yii::app()->request->getParam('newpass', '')) < 6) {
			$err = 3;
			$this->message = Yii::t('password_changing', 'Password is too short');
		}		
		
		if (empty($this->message)) {
			
			if (Yii::app()->request->getParam('newpass', '')) {
				$keys[] = 'newpass';
			}
			
			foreach ($keys as $key) {
				if ($value = Yii::app()->request->getParam($key, '')) {
					$values[$key] = $value;
				}
				$values['pass'] = $values['newpass'];
			}
                  /* save account info */

			if ($this->lanbilling->save("setClientInfo", $values)) {
				foreach ($values as $key => $value) {
					if (isset($this->lanbilling->clientInfo->account->$key)) {
						$this->lanbilling->clientInfo->account->$key = $value;
					}
				}
				$this->message = Yii::t('app', 'AccountSaved');
				// params saved
				$this->lanbilling->flushCache(array("getClientAccount", "getClientMessageCategories"));
			} else {
				$this->message = Yii::t('app', 'AccountNotSaved');
				//params not saved
			}
			
			$this->redirect(array('site/logout'));
		} else {
			$this->redirect(array('password/index&err='.$err));
		}
		
	}
	
} ?>
