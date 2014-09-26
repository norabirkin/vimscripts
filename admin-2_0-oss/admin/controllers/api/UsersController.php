<?php
class UsersController extends Controller{

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

    public function actionSetadress() {
        $this->success(yii::app()->japi->callAndSend( 'setAddress', $this->params(array(
            //'address' => 'string',
            'code' => 'string',
            'type' => 'int',
            'uid' => 'int'
        ))));
    }
    
    public function actionDeletelist() {
        $this->deleteList( 'delAccount', 'uid' );
    }

    public function actionList() {
        $params = array(
            "category" => (int) $this->param('category', -1)
        );
        if ((int) $this->param("usergroup")) {
            $params["in_group"] = (int) $this->param("usergroup");
        }
        if ($this->param('search_template') AND $this->param('use_search_template')) {
            $params["search_templ"] = CJSON::decode( $this->param('search_template') );
        }
        if ($this->param('property') AND $this->param('search')) {
            $params[$this->param('property')] = $this->param('search');
        }
        if ($this->param('property') AND $this->param('value')) {
            $params[$this->param('property')] = $this->param('value');
        }
        if ($this->param('query') || $this->param('value')) {
            $params['name'] = ($this->param('query') == '' && !$this->param('property')) ? $this->param('value') : $this->param('query');
        }

        $list = new OSSList(array(
            "useSort" => true
        ));
        
        if($this->param('stype') != '') {
            $params[$this->param('stype')] = $this->param('svalue');
        }

        $result = $list->getList( 'getAccounts', $params );
        $total = $result["total"]->getResult();
        if (( $total == 0)) {
            $this->success(array(), 0);
        }
        
        $accounts = array();
        $i = 0;
        foreach ($result["result"]->getResult() as $account) {
            $accounts[] = yii::app()->japi->call( 'getAccount', array(
                "uid" => $account["uid"]
            ));
            $i ++;
        }
        yii::app()->japi->send( true );

        $data = array();
        foreach ($accounts as $account) {
            $account = $account->getResult();
            $data[] = $this->processUser($account);
        }

        $this->success($data, $total);
    }
    public function processUser($account) {
        $fullName = $account["abonent_surname"] . ' ' .  $account["abonent_name"] . ' ' .  $account["abonent_patronymic"];
        $item = array(
            "uid" => $account["uid"],
            "istemplate" => 1,
            "name" => ($account["name"] == 2) ? $fullName : $account["name"],
            "abonentsurname" => $account["abonent_surname"],
            "abonentname" => $account["abonent_name"],
            "abonentpatronymic" => $account["abonent_patronymic"],
            "descr" => $account["descr"],
            "email" => $account["email"],
            "phone" => $account["phone"],
            "mobile" => $account["mobile"],
            "vgcnt" => 0,
            "login" => $account["login"],
            "type" => $account["type"],
            "category" => $account["category"],
            "address_1" => "", 
            "address_2" => "", 
            "address_3" => "",
            "address_code_1" => "",
            "address_code_2" => "",
            "address_code_3" => "",
            "address_descr_1" => "",
            "address_descr_2" => "",
            "address_descr_3" => ""
        ); 
        if ( $account["addresses"] ) {
            foreach ($account["addresses"] as $address) { 
                if ($a = $this->clearAddress($address["address"])) {
                    $item["address_" . ($address["type"] + 1)] = $a;
                }
                $item["address_code_" . ($address["type"] + 1)] = trim($address["code"]);
                $item["address_descr_" . ($address["type"] + 1)] = trim($address["address"]);
            }
        }
        return $item;
    }
    public function actionGet() {
        $this->success($this->processUser(
            yii::app()->japi->callAndSend('getAccount', array(
                'uid' => (int) $this->param('id')
            ))
        ));
    }

    public function actionGetDefaultOperator() {
        $this->success(yii::app()->options->getValue( "default_operator" ));
    }

} ?>
