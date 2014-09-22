<?php

class SiteController extends Controller {
    public function init() {
        yii::import('application.models.User');
        parent::init();
    }
    public function actionRegister() {
        $this->authorize();
        yii::app()->db->createCommand()->createTable('users', array(
            'name' => 'string',
            'surname' => 'string',
            'patronymic' => 'string',
            'pass_sernum' => 'integer',
            'pass_no' => 'integer',
            'email' => 'string',
            'phone' => 'string',
            'pass_issuedate' => 'string',
            'pass_issuedep' => 'string',
            'pass_issueplace' => 'string',
            'code' => 'varchar(255) NOT NULL PRIMARY KEY'
        ));
        $user = new User;
        $user->attributes = $this->params();
        if (!$user->validate()) {
            $data = array();
            foreach ($user->getErrors() as $attribute => $errors) {
                foreach ($errors as $index => $error) {
                    $data[] = array(
                        'code' =>
                            $user->isRequiredError($attribute, $index) ?
                            3 :
                            1,
                        'data' => array(
                            'attribute' => $attribute,
                            'message' => $error
                        )
                    );
                }
            }
            throw new LBR_Error($data);
        } else {
            $user->code = $this->code(70, serialize($this->params()).time());
            $user->save();
        }
        $this->mail(array(
            'attributes' => $user->attributes,
            'tpl' => 'confirmation',
            'subject' => 'Confirm LANBilling registration',
            'params' => array(
                'url' => $this->absUrl('site/confirm', array(
                    'code' => $user->code
                ))
            )
        ));
        $this->success($user->code);
    }
    public function actionConfirm($code) {
        $this->authorize();
        if (!($user = User::model()->findByPk($code))) {
            throw new CHttpException('Invalid confirmation code');
        }
        $attributes = $user->attributes;
        $user->delete();
        $cards = yii::app()->japi->callAndSend('getPayCards', array(
            'set_id' => yii::app()->params['set_id'],
            'is_activated' => false
        ));
        $card = $cards[0];
        if (!$card) {
            throw new CHttpException(500, 'Card not found');
        }
        $uid = yii::app()->japi->call('actPayCard', array(
            'card_key' => $card['card_key'],
            'email' => $attributes['email'],
            'name' => $attributes['name'],
            'pass_issuedate' => $attributes['pass_issuedate'],
            'pass_issuedep' => $attributes['pass_issuedep'],
            'pass_issueplace' => $attributes['pass_issueplace'],
            'pass_no' => $attributes['pass_no'],
            'pass_sernum' => $attributes['pass_sernum'],
            'patronymic' => $attributes['patronymic'],
            'phone' => $attributes['phone'],
            'ser_no' => $card['ser_no'],
            'surname' => $attributes['surname']
        ));
        yii::app()->japi->send();
        $uid = $uid->getResult(6);
        $account = yii::app()->japi->callAndSend('getAccount', array(
            'uid' => $uid
        ));
        $this->mail(array(
            'attributes' => $attributes,
            'tpl' => 'access',
            'subject' => 'LANBilling access',
            'params' => array(
                'login' => $account['login'],
                'password' => $account['pass'],
            )
        ));
        $this->success($attributes);
    }
    private function mail($params) {
        yii::app()->japi->callAndSend('sendMail', array_merge(
            yii::app()->params['email'],
            array(
                'email_to' => $params['attributes']['email'],
                'subject' => $params['subject'],
                'message' => $this->message($params['tpl'], array_merge(
                    $params['attributes'],
                    $params['params']
                ))
            )
        ));
    }
    private function message($tpl, $params) {
        $data = array();
        $tpl = file_get_contents(
            yii::getPathOfAlias('application.views.'.$tpl).'.html'
        );
        foreach ($params as $k => $v) {
            $data['{'.$k.'}'] = $v;
        }
        return trim(strtr($tpl, $data));
    }
    private function authorize() {
        if (UserIdentity::isAuthorized()) {
            return;
        }
        $identity = new UserIdentity(
            yii::app()->params['login'],
            yii::app()->params['password']
        );
        $identity->authenticate();
        yii::app()->user->login($identity, 373575377);              
    }
    private function code($length = 70, $solt = null) {
        $chars = array('a','b','c','d','e','f','d','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','D','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',1,2,3,4,5,6,7,8,9,0);
        $code = '';
        for ( $i = 0; $i < $length; $i ++ ) {
            $code .= $chars[rand( 0, ( count($chars) - 1 ) )];
        }
        if(!is_null($solt)) {
            $code = $code . '$$' . substr(md5($solt), 0, 8);
        }
        return $code;
    }
    private function absUrl($route, $params = array()) {
        return (
            yii::app()->request->getIsSecureConnection()?
            'https'
            :
            'http'
        ).
        '://'.
        $_SERVER['HTTP_HOST'].
        yii::app()->controller->createUrl($route, $params);
    }
}

?>
