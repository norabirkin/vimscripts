<?php

class FakePassword {
    public static function get($data, $manager) {
        $data['fake_pass'] = '';
        if (!$manager['open_pass']) {
            $characters = explode(',', '1,2,3,4,5,6,7,8,9,0,a,b,c,d,e,f,g,h,i,j,k,l,m,n,A,B,C,D,E,F,G,H,I,J,K,L,N,O,P');
            for ($i = 0; $i < strlen($data['pass']); $i++) {
                $data['fake_pass'] .= $characters[rand(0, (count($characters) - 1))];
            }
            $data['pass'] = '';
        }
        return $data;
    }
    public static function passParam() {
        $permissions = UserIdentity::getPermissions();
        $manager = yii::app()->japi->callAndSend('getManagers', array(
            'person_id' => $permissions['person_id']
        ));
        $manager = $manager[0];
        if (!$manager['open_pass']) {
            $pass = ((string) yii::app()->controller->param('fake_pass')) == ((string) yii::app()->controller->param('pass')) ? null : ((string) yii::app()->controller->param('pass'));
        } else {
            $pass = (string) yii::app()->controller->param('pass');
        }
        return $pass;
    }
}

?>
