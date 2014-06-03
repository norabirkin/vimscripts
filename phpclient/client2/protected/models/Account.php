<?php
/**
 * Accounts data model
 */
class Account extends CFormModel {

	public $password;
    public $oldPassword;
	public $verifyPassword;

    public $vgid;
    public $vglogin;

	public function rules() {
		return array(
			array('password, verifyPassword, oldPassword', 'required', 'on' => 'changeVgPassword'),
			array('password', 'length', 'max'=>Yii::app()->params['vgroup_password_maxlength'], 'min' => Yii::app()->params['vgroup_password_minlength']),
			array('verifyPassword', 'compare', 'compareAttribute'=>'password', 'message' => Yii::t('Account',"Пароль и подтверждение не совпадают.")),
			array('password', 'passwordRegExp', 'message' => Yii::t('Account',"Пароль содержит недопустимые символы.")),
		);
	}

	public function attributeLabels() {
		return array(
			'oldPassword'    => Yii::t('Account',"Старый пароль"),
            'password'       => Yii::t('Account',"Пароль"),
			'verifyPassword' => Yii::t('Account',"Повтор пароля"),
		);
	}

	public function passwordRegExp() {
		$regExp = Yii::app()->controller->lanbilling->getOption("acc_pass_symb");
		if (!$regExp) return true;
		if (!preg_match( '/'.$regExp.'/', $this->password )) $this->addError(
			'password', 
			Yii::t('Account', 'Пароль содержит недопустимые символы. Пароль должен соответствовать регулярному выражению ' . $regExp
		));
		
	}

    public function changeVgPasswd() {
        $struct = array(
            "id" => Yii::app()->user->getId(),
            "vgid" => (integer)$this->vgid,
            "oldpass" => $this->oldPassword,
            "newpass" => $this->password
        );
        if( false == ($ret = Yii::app()->controller->lanbilling->get("updClientPass", $struct, true))) {

            if ($error = Yii::app()->controller->lanbilling->soapLastError()){
                if (preg_match('~Invalid old password~is',$error->detail)){
                    $this->addError('oldPassword', Yii::t('Account', 'Не верно указан старый пароль!'));
                    return FALSE;
                }else{
                    $this->addError('password', Yii::t('Account', 'Извините, Не могу сменить пароль!'));
                    return FALSE;
                }
            } else return FALSE;
        }
        else return TRUE;
    }



    /**
    * Convert an object to an array
    *
    * @param   object  $object The object to convert
    * @return  array
    *
    * @todo    Move to the main class
    */
    public function objectToArray( $object )
    {
        if( !is_object( $object ) && !is_array( $object ) ) {
            return $object;
        }
        if( is_object( $object ) ) {
            $object = get_object_vars( $object );
        }
        return array_map(array($this, __FUNCTION__), $object);
    }

}
