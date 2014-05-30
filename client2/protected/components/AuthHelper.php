<?php class AuthHelper extends CApplicationComponent {
	private $identity;
	private $authTTL = 360000;
	private $model;

	private function saveAuthCookie() {
		yii::app()->user->setState( "sessnum", yii::app()->lanbilling->getCookie('sessnum') );
	}

	private function getSavedAuthCookie() {
		return yii::app()->user->getState( "sessnum" );
	}

	private function setAuthCookie() {
		yii::app()->lanbilling->setCookie( 'sessnum', $this->getSavedAuthCookie() );
	}

	public function setAuthorizationState() {
		$this->setBaseSessionParams();
		if ($this->userIPChanged()) return $this->onError("Current connected client (" . yii::app()->lanbilling->clientIP . ") has different IP address as session remember (" . long2ip($this->getLastConnectionIP()) . ")");
		if (Yii::app()->user->isGuest) return false;
		if (!$this->getSavedAuthCookie()) return $this->onError("No auth cookie");
		if ($this->isLastLoginTimeExpired()) return $this->onError("Time expired");
		yii::app()->lanbilling->setUid(yii::app()->user->getId());
		$this->setAuthCookie();
		return true;
	}

	public function getRedirectUrl() {
		if ($url = $_COOKIE["returnUrl"]) {
			setcookie("returnUrl", "");
			return $url;
		} else return yii::app()->controller->createUrl("account/index");
	}

	private function onError($msg) {
		yii::app()->lanbilling->ErrorHandler(__FILE__, $msg, __LINE__);
		$this->logout();
		return false;
	}

	public function login( LoginForm $model ) {
		$this->model = $model;
		$this->identity = new UserIdentity( $model->login, $model->password );
		if(!$this->identity->authenticate()) return $this->loginFailed();
		else return $this->loginSuccessful();
	}

	private function setLastConnectionIP() {
		yii::app()->user->setState( "from", (int) ip2long(yii::app()->lanbilling->clientIP) );
	}

	public function getLastConnectionIP() {
		return yii::app()->user->getState("from", null);
	}
	
	public function setBaseSessionParams() {
		if ($this->getLastConnectionIP() === null) $this->setLastConnectionIP();
		if ($this->getLastLoginTime()) $this->setLastLoginTime();
	}

	public function userIPChanged() {
		return $this->getLastConnectionIP() != ip2long(yii::app()->lanbilling->clientIP);
	}

	private function loginSuccessful() {
		$this->logSuccess();
		Yii::app()->user->login($this->identity, 3600*24);
		$this->saveAuthCookie();
		$this->setAuthCookie();
		if ($this->isLastLoginTimeExpired()) $this->setLastLoginTime();
		return true;
	}

	private function getLastLoginTime() {
		return yii::app()->user->getState("last", 0);
	}	

	private function isLastLoginTimeExpired() {
		return ( (time() - $this->getLastLoginTime()) > $this->authTTL );
	}

	public function setLastLoginTime() {
		yii::app()->user->setState("last", time());
	}

	private function logSuccess() {
            if (Yii::app()->params['log_auth_success']) {
                $logMsg = 'Successfully logged in with login '.CHtml::encode($this->model->login).'; uid: '.CHtml::encode($this->identity->getId());
                Yii::log($logMsg, 'info', 'access');
            }
	}

	private function logError() {
            if (Yii::app()->params['log_auth_error']) {
                $logMsg = 'Cannot login with login "'.CHtml::encode($this->model->login).'"; password: "'.CHtml::encode($this->model->password).'"; client IP: "'.Yii::app()->request->getUserHostAddress().'";';
                Yii::log($logMsg, 'info', 'access');
            }
	}

	private function setReturlUrlCookie() {
		if (Yii::app()->user->returnUrl != Yii::app()->getRequest()->getScriptUrl()) setcookie('returnUrl', Yii::app()->user->returnUrl);
	}

	private function loginFailed() {
		$this->setReturlUrlCookie();
		$this->logError();
		$this->model->addError( 'password', Yii::t('login','IncorrectUsername') );
		return false;
	}

	public function logout($api = true) {
		Yii::app()->user->logout();
		if ($api) {
            yii::app()->lanbilling->get("Logout");
        }
		yii::app()->lanbilling->destroySession();
	}
} ?>
