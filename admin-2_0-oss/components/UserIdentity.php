<?php

class UserIdentity extends CUserIdentity {
    private $_id;

    private function request($login, $password) {
        $response = yii::app()->japi->call('Login', array(
            'login' => $this->username,
            'password' => $this->password
        ));
        yii::app()->japi->send(true);
        return $response;
    }
    
    public function authenticate() {
        $this->request($login, $password);
        $this->_id = Yii::app()->session->getSessionID();
        return true;
    }

    public function getId() {
        return $this->_id;
    }

    public static function isAuthorized() {
        return yii::app()->session->isAuthorized();
    }

    public static function getPermissions() {
        if (!yii::app()->session['permissions']) {
            yii::app()->session['permissions'] = yii::app()
                ->japi
                ->callAndSend(
                    'getSessionRules'
                );
        }
        return yii::app()->session['permissions'];
    }

    public function getAuthorizeError($error) {
        if (!($error instanceof JAPIResponseError)) {
            return false;
        }
        $body = $error->getJAPITransaction()->getResponse()->getBody();
        if (
            strpos($body['template'], 'Invalid login/pass. Manager login: ') === 0 OR
            $error->getMessage() == yii::t('errors', 'Manger or Client not authorized') OR
            $error->getMessage() == yii::t('errors', 'Manager not authorized') OR
            $body['values'][2] == 'No logged person'
        ) {
            return array(
                'status' => 401,
                'message' => $error->getMessage()
            );
        } else {
            return false;
        }
    }
}

?>
