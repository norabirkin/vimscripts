<?php
class PaymentsController extends Controller{

    public function actionFormat() {
        $format = new PaymentFormatRegExp;
        $this->success($format->get(
            (string) $this->param('payment_format')
        ));
    }

    public function actionRecomended() {
        $this->success(yii::app()->japi->callAndSend('getRecommendedPayment', $this->params(array("agrm_id" => "int")) ));
    }

    private function getHistory() {
        $list = new OSSList( array("useSort" => false) );
        $payments = $list->getList( "getPayments", array(
            'date_from' => str_replace('T00:00:00', '', $this->param('date_from')) . ' 00:00:00',
            'date_to' => str_replace('T00:00:00', '', $this->param('date_to')) . ' 00:00:00',
            'pay_history' => 1,
            'agrm_id' => (int) $this->param('agrm_id')
        ));

        $result = $payments["result"]->getResult();
        $bsos = array();
        foreach ($result as $k => $v) {
            if ( $v["bso_id"] ) {
                $result[$k]["bso"] = yii::app()->japi->call( "getBsoDocs", array (
                    'record_id' => $v["bso_id"] 
                ));
                $bsos[] = $k;
            }
        }
        if ($bsos) {
            yii::app()->japi->send( true );
            foreach ($bsos as $k) {
                $bso = $result[$k]["bso"]->getResult();
                $result[$k]["bso"] = $bso[0]["set_number"] . "/" . $bso[0]["number"];
            }
        }
        $total = $payments["total"] ? $payments["total"]->getResult() : null;
        return array( "result" => $result, "total" => $total );
    }

    public function actionList() {
        $history = $this->getHistory();
        $this->success( $history["result"], $history["total"] );
    }

    public function actionSalescheck() {
        $salesCheck = new SalesCheck;
        $this->success( $salesCheck->create(array(
            "agrmid" => (int) $this->param("agrmid"),
            "ptype" => (int) $this->param("ptype"),
            "payment_type" => (int) $this->param("payment_type"),
            "payment_sum" => (float) $this->param("payment_sum"),
            "pay_id" => (int) $this->param("pay_id")
        )));
    }

    public function actionExport() {
        $columns = CJSON::decode($this->param('columns'), true);
        $this->downloadAction();
        $data = array($columns["names"]);
        $history = $this->getHistory();
        foreach ($history["result"] as $payment) {
            $item = array();
            foreach ($columns["fields"] as $column) {
                $item[$column] = $payment[$column];
            }
            $data[] = $item;
        }
        $csv = new CSV;
        $csv->sendCSVHeaders('payments.csv');
        echo $csv->arrayToCSV( $data );
    }

    public function actionCreate() {
        $permissions = UserIdentity::getPermissions();
        $agreement = yii::app()->japi->callAndSend( "getAgreements", array( 
            "agrm_id" => (int) $this->param('agrm_id') 
        ));
        $params = array(
            'mod_person' => ((int) $this->param('person_id')) < 0 ? $permissions['person_id'] : ((int) $this->param('person_id')), 
            'curr_id' => (int) $agreement[0]['cur_id'],
            'class_id' => (int) $this->param('classid'),
            'amount' => (float) $this->param('payment_sum'),
            'receipt' => (string) $this->param('payment_number'),
            'payment_order_num' => (string) $this->param('payment_order_num'),
            'comment' => $this->param('payment_comment', '')
        );
        if ( $this->param("from_agrm_id") ) {
            $params["from_agrm_id"] = (int) $this->param("agrm_id");
            $params["agrm_id"] = (int) $this->param("from_agrm_id");
        } else {
            $params["agrm_id"] = (int) $this->param("agrm_id");
        }
        $pay_now = false;
        foreach (yii::app()->japi->callAndSend('getOptions') as $option) {
            if ($option["name"] == "payments_cash_now" AND $option["value"]) {
                $pay_now = true;
            }
        }
        if (!$pay_now) {
            $params["pay_date"] = $this->param("pay_date") . " " . date("H:i:s");
        }
        $payment = yii::app()->japi->callAndSend("Payment" , $params);
        $bso_error = 0;
        if ( $this->param('docid') ) {
            $result = yii::app()->japi->call("setPaymentBso", array(
                "payment_id" => (int) $payment,
                "bso_doc_id" => (int) $this->param("docid")
            ));
            yii::app()->japi->send();
            if ($result->isError()) {
                $bso_error = $result->getErrorMessage();
            }
        }
        $this->success(array( 
            "pay_id" => $payment,
            "bso_error" => $bso_error
        ));
    }
    /*****************************************************
    **  Методы для работы формы "Свойства" -> "Платежи"
    ******************************************************/ 
    
    public function actionShowPaymentsAccountsList() {
        $params = array(
            'pg_num' => (int)$this->param('page'),
            'pg_size' => (int)$this->param('limit'),
            'get_full' => (boolean) true
        );

        if ($this->param('search_field') && $this->param('search_field_value')) {
            $params[$this->param('search_field')] = (string) $this->param('search_field_value');
        }

        $result = yii::app()->japi->callAndSend('getAccounts', $params);

        if (empty($result)) {
            $this->success(array());
        }
        
        foreach ($result as $res) {
            if (empty($res['agreements'])) {
                continue;
            }
            
            foreach ($res['agreements'] as $item) {
                $record = array(
                    'agrm_id' => $item['agrm_id'],
                    'agrm_num' => $item['agrm_num'],
                    'balance' => number_format($item['balance'], 2),
                    'formatted_balance' => number_format($item['balance'],2,","," "),
                    'close_date' => $item['close_date'],
                    'create_date' => $item['create_date'],
                    'oper_name' => $item['oper_name'],
                    'pay_code' => $item['pay_code'],
                    'ppdebt' => $item['ppdebt'],
                    'symbol' => $item['symbol'],
                    'uid' => $res['uid'],
                    'name' => $res['name']
                );
                $data[] = $record;
            }

        }
    $this->success($data);
    }
    
    public function actionCorrectPayment() {
        switch((integer)$this->param("corrtype")){
            case 1: // перевод платежа - существующего, просто смена счета
                $addon_params = array(
                    "record_id" => (integer)$this->param('record_id') ,
                    "agrm_id" => (int) $this->param('new_agrm_id') ,
                    "amount" => (float)$this->param('amount'),
                );
            break;
            case 2: // Исправление платежа
                $addon_params = array(
                    "record_id" => (integer)$this->param('record_id') ,
                    "agrm_id" => (int) $this->param('agrm_id') ,
                    "amount" => (float)$this->param('new_amount')
                );
            break;
            case 3: // перевод произвольной суммы
                if (isset($_POST['transf_classid'])) {
                    $_POST['classid'] = $_POST['transf_classid'];
                }
                $addon_params = array(
                    "fromagrmid" => (integer)$_POST['transferFromAgrm'],
                    "from_agrm_id" => (integer)$_POST['transferAgrmId'],
                    "amount" => (float)$this->param('new_amount'),
                );
                $_POST['currid'] = 1;
            break;
            case 4: // Аннулирование платежа
                $addon_params = array(
                    "record_id" => (integer)$this->param('record_id') ,
                    "agrm_id" => (int) $this->param('agrm_id') ,
                    "amount" => 0.0
                );
            break;
            case 5: // Восстановление аннулированного платежа
                $addon_params = array(
                    "recordid" => (integer)$this->param('record_id') ,
                    "agrm_id"   => (int) $this->param('agrm_id') ,
                    "amount"   =>(float)$_POST['orig_payment']
                );
            break;
            default:
                echo '({ success: false, error: { reason: "Unknown correct type" } })';
                return false;
        }

        $agreement = yii::app()->japi->callAndSend( "getAgreements", array( 
            "agrm_id" => (int) $this->param('agrm_id') 
        ));
        $session = Yii::app()->session;
        
        $struct = array(
            'mod_person' => (int) $session['permissions']['person_id'],
            'curr_id' => (int) $agreement[0]['cur_id'],
            'class_id' => (int) $this->param('class_id'),
            'receipt' => (string) $this->param('receipt'),
            'comment' => $this->param('comment', '')
        );
        //if($lanbilling->Option('payments_cash_now') != 1) $struct["paydate"] = $_POST['pay_date'];  
        $struct = array_merge($struct, $addon_params);
        $payment = yii::app()->japi->callAndSend("Payment" , $struct );
        $this->success($payment);
    }
    
} ?>
