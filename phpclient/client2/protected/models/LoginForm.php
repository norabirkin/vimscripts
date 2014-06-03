<?php class LoginForm extends CFormModel {
	public $login;
	public $password;
	public $captcha;

	public function rules() {
		return array(
			array('login, password', 'required'),
			array('captcha', 'validateCaptcha')
		);
	}
	
	public function validateCaptcha() {
		if( !yii::app()->params["use_captcha"] ) return true;
	 	if( $this->captcha != yii::app()->user->getState("captcha") ) {
			$this->addError('captcha', yii::t('login', 'IncorrectCaptcha'));
			error_log( 'incorrect captcha [' . $this->captcha . '] [' . yii::app()->user->getState("captcha") . ']'  );
		}
	}

	public function attributeLabels() {
		return array(
			'login' => Yii::t('login', 'Login'),
			'password' => Yii::t('login', 'Password'),
			'captcha' => Yii::t('login', 'Captcha')
		);
	}
} ?>
