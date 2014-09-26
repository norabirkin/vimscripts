<?php
class LoginController extends Controller {
    public function actionAuthorize() {
        $identity = new UserIdentity(
            $this->param('login', ''),
            $this->param('password', '')
        );
        if (!$identity->authenticate()) {
            Yii::app()->user->logout();
            $this->sendResponse(401, array(
                "success" => false,
                "details" => yii::t('messages', 'Wrong login or password')
            ));
        } else {
            Yii::app()->user->login($identity, 373575377);              
            $this->success();
        }
    }

    public function actionLogout() {
        Yii::app()->user->logout();
        $this->sendResponse(401, array(
            "success" => true
        ));
    }

    public function actionIdentity() {
        if (!UserIdentity::isAuthorized()) {
            $this->sendResponse(401, array(
                'success' => false,
                'details' => yii::t('errors', 'Manager is not authorized')
            ));
        }
        $permissions = UserIdentity::getPermissions();
        $options = yii::app()->japi->call('getOptions');
        $currencies = yii::app()->japi->call('getCurrencies');
        $manager = yii::app()->japi->call('getManagers', array(
            'person_id' => $permissions['person_id']
        ));
        yii::app()->japi->send();
        foreach ($options->getResult() as $item) {
            if (in_array($item['name'], array(
                    'zkh_configuration',
                    'default_operator',
                    'change_usertype',
                    'payment_format',
                    'default_transfer_classid',
                    'acc_pass_symb',
                    'user_pass_symb'
                ))) {
                $permissions['profile'][$item['name']] = $item['value'];
            }
        }
        $format = new PaymentFormatRegExp;
        $permissions['profile']['payment_format_regexp'] = $format->get($permissions['profile']['payment_format']);
        foreach ($currencies->getResult() as $item) {
            if ($item['is_def']) {
                $permissions['profile']['default_currency'] = $item['cur_id'];
            }
        }
        $manager = $manager->getResult();
        if ($manager) {
            $permissions['profile']['open_pass'] = $manager[0]['open_pass'];
            $permissions['profile']['pay_class_id'] = $manager[0]['pay_class_id'];
        }
        $this->success($permissions);
    }
}
