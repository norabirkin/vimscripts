<?php
class UserFormController extends Controller{
    
    private function clearAddress( $address ) {
        $address = explode( ",", trim($address) );
        foreach ($address as $k => $v) {
            if ( !($address[$k] = trim($v)) ) { 
                unset($address[$k]); 
            }
        }
        $result = implode( ",", $address );
        return $result;
    }
    
    public function actionAgreementsList() {

        $params = array(
            "pg_size" => (int) $this->param('pg_size'),
            "pg_num" => (int) $this->param('pg_num'),
            "uid" => (int) $this->param('uid')
        );

        if ( !($result = yii::app()->japi->callAndSend( 'getAgreements', $params )) ) {
            $this->success(array());
        }
        $this->success($result);
    }
    
    public function actionVgroupsList() {
        $pg_size = 25;

        $params = array(
            "pg_size" => (int) $this->param('pg_size'),
            "pg_num" => (int) $this->param('pg_num'),
            "agrm_id" => (int) $this->param('agrm_id')
        );
        
        if((int) $this->param('agrm_id') == 0) {
             $this->success('');
        } 
        
        if ( !($result = yii::app()->japi->callAndSend( 'getVgroups', $params )) ) {
            $this->success(array());
        }
        $this->success($result);
    }
    
    public function actionGetUserData() {

        $params = array(
            "uid" => (int) $this->param('uid')
        );

        $result = yii::app()->japi->call('getAccount', $params);
        $permissions = UserIdentity::getPermissions();
        $manager = yii::app()->japi->call('getManagers', array(
            'person_id' => $permissions['person_id']
        ));
        yii::app()->japi->send(true);
        $manager = $manager->getResult();
        $result = $result->getResult();
        if (!($result)) {
            $this->success(array());
        }

        $result["inn_" . $result["type"]] = $result['inn'];
        
        foreach($result['addresses'] as $address) {
            if ($a = $this->clearAddress($address["address"])) {
                $result["address_" . ($address["type"] + 1)] = $a;
            }
            $result["address_code_" . ($address["type"] + 1)] = trim($address["code"]);
            $result["address_descr_" . ($address["type"] + 1)] = trim($address["address"]);
        }
        unset($result['addons'], $result['agreements'], $result['inn']);
        $result = FakePassword::get($result, $manager[0]);
        $this->success($result);
    }

    public function actionSaveUser() {
        $data = $this->params();
        
        $data['inn'] = $data["inn_" . $data["type"]];
        unset($data["inn_" . $data["type"]]);
        
        $result =  yii::app()->japi->callAndSend('setAccount', array(
            'abonent_name' => $this->param("abonent_name"),
            'abonent_patronymic' => $this->param("abonent_patronymic"),
            'abonent_surname' => $this->param("abonent_surname"),
            'act_on_what' => $this->param("act_on_what"),
            'bank_name' => $this->param("bank_name"),
            'bik' => $this->param("bik"),
            'bill_delivery' => (int)$this->param("bill_delivery"),
            'birth_date' => date('Y-m-d', strtotime($this->param("birth_date"))),
            'birth_place' => $this->param("birth_place"),
            'branch_bank_name' => $this->param("branch_bank_name"),
            'category' => (int)$this->param("category"),
            'corr' => $this->param("corr"),
            'descr' => $this->param("descr"),
            'email' => $this->param("email"),
            'fax' => $this->param("fax"),
            'gen_dir_u' => $this->param("gen_dir_u"),
            'gl_buhg_u' => $this->param("gl_buhg_u"),
            'inn' => ((int)$this->param("type") > 1) ? $this->param("inn_2") : $this->param("inn_1"),
            'ip_access' => (bool)$this->param("ip_access"),
            'is_template' => (int)$this->param("is_template"),
            'kont_person' => $this->param("kont_person"),
            'kpp' => $this->param("kpp"),
            'login' => $this->param("login"),
            'mobile' => $this->param("mobile"),
            'name' => $this->param("name"),
            'ogrn' => $this->param("ogrn"),
            'okato' => $this->param("okato"),
            'okpo' => $this->param("okpo"),
            'oksm' => (int)$this->param("oksm"),
            'okved' => $this->param("okved"),
            'pass' => FakePassword::passParam(),
            'pass_issue_date' => date('Y-m-d', strtotime($this->param("pass_issue_date"))),
            'pass_issue_dep' => $this->param("pass_issue_dep"),
            'pass_issue_place' => $this->param("pass_issue_place"),
            'pass_no' => $this->param("pass_no"),
            'pass_sernum' => $this->param("pass_sernum"),
            'phone' => $this->param("phone"),
            'settl' => $this->param("settl"),
            'treasury_account' => $this->param("treasury_account"),
            'treasury_name' => $this->param("treasury_name"),
            'type' => (int)$this->param("type"),
            'uid' => (int)$this->param("uid"),
            'uuid' => $this->param("uuid"),
            'wrong_active' => (int)$this->param("wrong_active")
        ));


        if($this->param("address_code_1") != '') {
            $this->setUserAddress( $this->param("address_code_1"), 0, $result);
        }
        
        if($this->param("address_code_2") != '') {
            $this->setUserAddress( $this->param("address_code_2"), 1, $result);
        }

        if($this->param("address_code_3") != '') {
            $this->setUserAddress( $this->param("address_code_3"), 2, $result);
        }
    
        $this->success($result);
    }
    
    
    public function setUserAddress ($code, $type, $uid) {
        $params = array(
            'code' => $code,
            'type' => (int)$type,
            'uid' => (int)$uid
        );
        $result = yii::app()->japi->callAndSend( 'setAddress', $params );
    }
    
    
    public function actionDeleteUserAddress () {
        $params = array(
            'type' => (int)$this->param("type"),
            'uid' => (int)$this->param("uid")
        );
        $result = yii::app()->japi->callAndSend( 'delAddress', $params );
        $this->success($result);
    }
    
    
    public function actionOperatorsList () {
        $params = array(
            "category" => 1
        );
        $result = yii::app()->japi->callAndSend( 'getAccounts', $params );
        $this->success($result);
    }

    public function actionOwnerOperatorsList () {
        $params = array(
            "category" => 1
        );
        $result = yii::app()->japi->callAndSend( 'getAccounts', $params );
        $result[] = array (
            'uid' => 0,
            'name' => yii::t('messages', "Default")
        );
        $this->success($result);
    }
    
    public function actionOrdersList() {
        $list = new OSSList(array(
            "useSort" => true
        ));
        
        $params = array(
            "pg_size" => (int) $this->param('pg_size'),
            "pg_num" => (int) $this->param('pg_num'),
            "uid" => (int) $this->param('uid')
        );
        if(!is_array($result)) {
            $result = array($result);
        }
        $result = $list->getList( 'getOrders', $params );
        
        $data = $result["result"]->getResult();
        $total = $result["total"]->getResult();
        
        $this->success($data, $total);
    }
    
    
    public function actionAddDocument() {
        $data = $this->params();
        
        $month = ($this->param('period_month') == '') ? '01' : $this->param('period_month');
        $period = $this->param('period_year') . $month;
        
        if($this->param('doc_per') == 2) {
            $period = date('Ym');
            $date = date('Ymd', strtotime($this->param('date')));
        } 
        
        if($this->param('apCbox') != 1) {
            $summ = $this->param('sum');
        }
            
        $params = array(
            'val' => array(
                'period' => (int)$period,
                'doc_id' => (int)$this->param('doc_id'),
                'agrm_id' => (int)$this->param('agrm_id'),
                'num' => (int)$this->param('startnum'),
                'date' => (int)$date,
                'summ' => (float)$summ,
                'grp' => 0,
                'uid' => (int)$this->param('uid'),
                'oper' => (int)$this->param('oper_id'),
                'comment' => $this->param('comment'),
                'groupcnt' => 0,
                'groupidx' => 0,
                'ugrp' => 0
            ),
            'flt' => array(
                'dtfrom' => (string)$this->param('period_since'),
                'dtto' => (string)$this->param('period_till'),
                'ugroups' => 0,
                'notgroups' => 0,
                'searchtempl' => null
            )
        );
        
        $result =  yii::app()->japi->callAndSend('startGenOrders', $params);
        
        $this->success($result);
    }
    
    
    public function actionAllowGenPassword() {
        $result = Yii::app()->options->getValue('generate_pass');
        $this->success((bool)$result);
    }    
    
    public function actionGenPassword() {
        $genPass = Yii::app()->options->getValue('generate_pass');
        $passLength = Yii::app()->options->getValue('pass_length');
        $onlyNumbers = Yii::app()->options->getValue('pass_numbers');
        
        if($genPass > 0) {
            $password = $this->genRandomString($onlyNumbers, $passLength);
        }
        $this->success($password);
    }
    
    
    public function genRandomString( $onlyNumbers = 0, $length = 0 )
    {
        $symbols = "01234567890abcdefghjkmnopqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ";

        for ($i = 0; $i < $length; $i++) {
            if($onlyNumbers > 0) {
                $result .= mt_rand(0, 9);
            } else {
                $result .= $symbols[mt_rand(0, strlen($symbols)-1)];
            }
        }
        return $result;
    }
    
    
} ?>
