<?php class UserIdentity extends CUserIdentity {
	private $id;
	private function authRequest() {
		return Yii::app()->lanbilling->get(
            		'ClientLogin',
            		array(
                		'login' => $this->username,
                		'pass'  => $this->password,
                		'ip' => Yii::app()->lanbilling->getClientIP()
            		)
        	);	
	}
    	public function authenticate() {
		if (!($this->id = $this->authRequest())) $this->errorCode = self::ERROR_USERNAME_INVALID;
		else $this->errorCode = self::ERROR_NONE;
		return $this->errorCode == self::ERROR_NONE;
    	}
    	public function getId() {
        	return $this->id;
    	}
}
