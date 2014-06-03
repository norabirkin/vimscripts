<?php
// There is background query
if(isset($_POST['async_call']))
{

    if(isset($_POST['repeatSalesCheck'])) {
        repeatSalesCheck($lanbilling, $localize);
    }

    if(isset($_POST['getpayhistory'])) {
        getPayHistory($lanbilling, $localize);
    }

    if(isset($_POST['commit_payment'])) {
        commitPayment($lanbilling, $localize);
    }

    if(isset($_POST['commit_promised'])) {
        commitPromised($lanbilling, $localize);
    }

    if(isset($_POST['getreceipt'])) {
        printReceipt($lanbilling);
    }

    if(isset($_POST['getdoctpls'])) {
        getDocTemplates($lanbilling);
    }

    if(isset($_POST['getrcptfile'])) {
        downloadReceiptFile($lanbilling);
    }

    if(isset($_POST['getcorrected'])) {
        getCorrectedHistory($lanbilling);
    }

    if(isset($_POST['correctType'])) {
        correctPayment($lanbilling, $localize);
    }

    if(isset($_POST['getDefaultPClass'])) {
        getDefaultPClass($lanbilling);
    }
	
	if(isset($_POST['getDefaultManClass'])) {
        getDefaultManClass($lanbilling);
    }
	
	if(isset($_POST['getpromhist'])) {
        getPromisedHistory($lanbilling, $localize);
    }

}
else
{
    // Parse HTML template to start Panel rendering
    $tpl = new HTML_Template_IT(TPLS_PATH);
    $tpl->loadTemplatefile("payments.tpl", true, true);
    $tpl->touchBlock("__global__");
    $tpl->setVariable('AUTOLOAD', (integer)$lanbilling->Option('autoload_accounts'));
    $localize->compile($tpl->get(), true);
}


/**
 * Функция получени категории по-умолчанию для формы перевода средств со счета на счет.
 * Берется опция default_transfer_classid из таблицы options
 */
function getDefaultPClass($lanbilling){
    $defClass = 0;
    try {
        if( false === ($defClass = $lanbilling->Option('default_transfer_classid')) )
        {
            throw new Exception ($lanbilling->soapLastError()->detail);
        }
    }
    catch(Exception $error) {
        $_response = array(
            "results" => $defClass,
            "success" => false,
            "error" => $error->getMessage()
        );
    }
    if(!$_response) {
        $_response = array(
            "results" => $defClass,
            "success" => true,
            "error" => null
        );
    }
    echo "(" . JEncode($_response, $lanbilling) . ")";
}


/**
 * Функция получения категории по умолчанию в форме "Платежи" для текущего менеджера
 */
function getDefaultManClass($lanbilling){
    $defClass = 0;
	
    try {
    	$getMan = ($_POST['parenttemplate']) ? (integer)$_POST['parenttemplate'] : (integer)$_POST['getman'];
    	if($getMan == 0) {
    		$getMan = $lanbilling->manager;
    	}
		if((integer)$getMan >= 0)
		{
			if( false != ($result = $lanbilling->get("getManager", array("id" => (integer)$getMan))) )
			{
				$defClass = $result->manager->payclassid;
				$_response = array(
		            "results" => $defClass,
		            "success" => true,
		            "error" => null
		    	);		
			}
		}
    }
    catch(Exception $error) {
        $_response = array(
            "results" => $defClass,
            "success" => false,
            "error" => $error->getMessage()
        );
    }
    if(!$_response) {
        $_response = array(
            "results" => $defClass,
            "success" => true,
            "error" => null
        );
    }
    echo "(" . JEncode($_response, $lanbilling) . ")";
}

/**
 * Внутренняя функция для получения данных договора по UID
 */
function getAgrmDetail($uid){
    global $lanbilling;
    $user = $lanbilling->get("getAgreements", array( "flt" => array("agrmid" => $uid)));
    return $user->number;
}


/**
 * Создание массива платежей для истории корректировок
 * @param $arr
 */
function makePaymentsArray($v){
    $return = array(
        'paydate'        => $v->pay->paydate,
        'amount'         => $v->pay->amount,
        'receipt'        => $v->pay->receipt,
        'mgr'            => $v->mgr,
        'canceldate'   => $v->pay->canceldate,
        'comment'        => $v->pay->comment,
        'fromagrmname' => ($v->pay->fromagrmid > 0) ? getAgrmDetail($v->pay->fromagrmid) : '',
        'fromagrmid'   => $v->pay->fromagrmid,
        'revisions'       => $v->pay->revisions,
        'revno'        => $v->pay->revno,
        'curagrmname'  => $v->agrm,
        'amountcurr'   => $v->amountcurr,
        'paymentordernumber'   => $v->pay->paymentordernumber
    );
  return $return;
}

/**
 * @TODO: DEBUG!
 * без даты, т.к. корректировок должно быть очень мало на 1 платеж
 * Будет показан весь список
 *
 */
function getCorrectedHistory(&$lanbilling){

    if($lanbilling->getAccess('cashonhand') < 1) {
        echo '({ success: false, reason: "' . $localize->get('Access is restricted to this section') . '" })';
        return false;
    }
    if((integer)$_POST['recordid'] <= 0) { echo '({ "total": 0, "results": "" })'; return false; }

    if(false != ($result=$lanbilling->get("getPayments",array("flt"=>array("payhistory"=>(($_POST['recordid']) ? $_POST['recordid'] : 1),"recordid"=>$_POST['recordid'])))))
    {
        if(!is_array($result)) {
            $result = array($result);
        }
        if(sizeof($result) > 0) {
            foreach ($result as $k=>$v){
                $returnCorrections[] = makePaymentsArray($v);
            }
            echo '({"total": ' . count($returnCorrections) . ', "results": ' . JEncode($returnCorrections, $lanbilling) . '})';
        }
        else { echo '({ "total": 0, "results": "" })'; }
    }
    else
    {
        echo '({ success: false, error: { reason: "Error with resiving payment data!" } })';
        return false;
    }

}


/**
 * Commit passed promised payment for thr selected agreement from simple form
 * It's placed in user form and accounts form
 * @param    object, billing class
 */
function commitPromised( &$lanbilling, &$localize )
{
    if($lanbilling->getAccess('cashonhand') < 2) {
        echo '({ success: false, error: { reason: "' . $localize->get('Access is restricted to this section') . '" } })';
        return false;
    }

    if((integer)$_POST['commit_promised'] == 0) {
        echo '({ success: false, error: { reason: "Unknown agreement" } })';
        return false;
    }

    $struct = array(
        "agrm" => $_POST['commit_promised'],
        "summ" => (float)$_POST['promised_sum']
    );

    if( false != $lanbilling->get("PromisePayment", $struct, true, true) ) {
        $lanbilling->flushCache(array("getAccount"));
        echo '({ success: true })';
    }
    else {
        $error = $lanbilling->soapLastError();
        if(strstr($error->detail, "Promise payments already assigned"))
			echo '({ success: false, error: { reason: "' . $localize->get('Promise payments already assigned') . '" } })';
		else if(strstr($error->detail, "Promise payment is not available, agreement lifetime is less than 10 days"))
			echo '({ success: false, error: { reason: "' . $localize->get('Promise payment is not available, agreement lifetime is less than 10 days') . '" } })';
		else if(strstr($error->detail, "Promise payment is not available, last payment is overdue"))
			echo '({ success: false, error: { reason: "' . $localize->get('Promise payment is not available, last payment is overdue') . '" } })';
		else if(strstr($error->detail, "No promise payments settings available for uid"))
			echo '({ success: false, error: { reason: "' . $localize->get('No promised payments settings available for this user') . '" } })';
		else
			echo '({ success: false, error: { reason: "There was an error while commiting payment: ' . $error->detail . '. Look server logs for details" } })';
    }
} // end commitPromised()


/**
 * correct payments functions
 */
function correctPayment( &$lanbilling, &$localize ){
    if($lanbilling->getAccess('cashonhand') < 2) {
        echo '({ success: false, error: { reason: "' . $localize->get('Access is restricted to this section') . '" } })';
        return false;
    }
    /**
     * Дополнительные параметры для различных типов корректировок
     */
    switch($_POST['correctType']){
        case 1: // перевод платежа - существующего, просто смена счета
            $addon_params = array(
                "recordid" => (integer)$_POST['recordid'],
                "agrmid" => (integer)$_POST['pay_agrmid'],
                "amount" => $lanbilling->float($_POST['amount'])
            );
        break;
        case 2: // Исправление платежа
            $addon_params = array(
                "recordid" => (integer)$_POST['recordid'],
                "agrmid" => (integer)$_POST['agrmid'],
                "amount" => $lanbilling->float($_POST['pay_sumcorrected'])
            );
        break;
        case 3: // перевод произвольной суммы
            if (isset($_POST['transf_classid'])) {
                $_POST['classid'] = $_POST['transf_classid'];
            }
            $addon_params = array(
                "fromagrmid" => (integer)$_POST['transferFromAgrm'],
                "agrmid" => (integer)$_POST['transferAgrmId'],
                "amount" => $lanbilling->float($_POST['transferSum'])
            );
            $_POST['currid'] = 1;
        break;
        case 4: // Аннулирование платежа
            $addon_params = array(
                "recordid" => (integer)$_POST['recordid'],
                "agrmid" => (integer)$_POST['agrmid'],
                "amount" => 0
            );
        break;
        case 5: // Восстановление аннулированного платежа
            $addon_params = array(
                "recordid" => (integer)$_POST['recordid'],
                "agrmid"   => (integer)$_POST['agrmid'],
                "amount"   => $lanbilling->float($_POST['orig_payment'])
            );
        break;
        default:
            echo '({ success: false, error: { reason: "Unknown correct type" } })';
            return false;
    }
    $struct = array(
        "modperson" => $lanbilling->manager,
        "comment"   => $_POST['pay_comment'],
        "currid"    => $_POST['currid'], // Валюта платежа
        "classid"   => $_POST['classid'],
        "receipt"     => $_POST['recipe'],
        "paymentordernumber"     => $_POST['paymentordernumber']
    );
    $struct = array_merge($struct, $addon_params);

    if($lanbilling->Option('payments_cash_now') != 1) $struct["paydate"] = $_POST['pay_date'];

    if( false != $lanbilling->save("Payment", $struct, false, array("getAccount", "getPayments")) ) {
        if((integer)$lanbilling->saveReturns->ret > 0) {
            $result = $lanbilling->get("getPayments", array( "flt" => array("recordid" => (integer)$lanbilling->saveReturns->ret) ));
        }
        $_data = array(
            'sum' => $lanbilling->float($struct['amount']),
            'extid' => $_SESSION['auth']['cashregister']['id'],
            'registerfolder' => $_SESSION['auth']['cashregister']['folder'],
            'authname' => $_SESSION['auth']['authname'],
            'pmid' => (integer)$lanbilling->saveReturns->ret,
            'agrmnum' => ((integer)$lanbilling->saveReturns->ret > 0) ?  $result->agrm : ''
        );
        echo '({ success: true, "data": ' . JEncode($_data, $lanbilling) . ' })';
    }
    else {
        $msg = $lanbilling->soapLastError()->detail;
        if(strstr($msg, 'No confirmative') || strstr($msg, 'not specified a required field: receipt / payment_order_num')) {
        	$msg = $localize->get('No confirmative document');
        	echo '({ success: false, error: { reason: "' . $msg . '" } })';
        }
        else if(strstr($msg, 'trasfer payment to the same agreement')) {
        	$msg = $localize->get('Unable to transfer payment to the same agreement');
        	echo '({ success: false, error: { reason: "' . $msg . '" } })';
        }
        else {
        	echo '({ success: false, error: { reason: "There was an error while commiting payment: ' . $msg . '. Look server logs for details" } })';
        }
    }
}


function repeatSalesCheck($lanbilling, $localize){
    $pmId = $_POST['repeatSalesCheck'];
    if( false != ($result = $lanbilling->get("getPayments", array( "flt" => array("recordid" => (integer)$pmId) )) )){

        $_data = array(
            'sum' => $lanbilling->float($result->amountcurr),
            'extid' => $_SESSION['auth']['cashregister']['id'],
            'registerfolder' => $_SESSION['auth']['cashregister']['folder'],
            'authname' => $result->mgr,
            'pmid' => (integer)$pmId,
            'agrm' =>$result->agrm
        );
        echo '({ success: true, "data": ' . JEncode($_data, $lanbilling) . ' })';

    }else{
        echo '({ success: false, "reason": "Unknown payment ID" })';
    }

}



/**
 * Commit passed payment for the selected agreement from simple form
 * It's placed in user form and accounts form
 * @param    object, billing class
 */
function commitPayment( &$lanbilling, &$localize )
{
    if($lanbilling->getAccess('cashonhand') < 2) {
        echo '({ success: false, error: { reason: "' . $localize->get('Access is restricted to this section') . '" } })';
        return false;
    }

    if((integer)$_POST['commit_payment'] == 0) {
        echo '({ success: false, error: { reason: "' . $localize->get('Unknown agreement') . '" } })';
        return false;
    }

    if($lanbilling->Option('payments_cash_now') != 1) {
        if(!preg_match('/\d{4}\-\d{2}-\d{2}/', $_POST['formattedDate'])) {
            $_POST['formattedDate'] = date('Y-m-d');
        }
    }

    //agrmid

    if ((integer)$_POST['commit_payment']){
        $curId = ( false != ($agrmDetail = $lanbilling->get("getAgreements", array( "flt" => array("agrmid" => (integer)$_POST['commit_payment']) )))) ? $agrmDetail->curid : 1;
    }

    $struct = array(
        "recordid" => 0,
        "status" => 0,
        "localdate" => '',
        "canceldate" => '',
        "agrmid" => (integer)$_POST['commit_payment'],
        "modperson" => $_POST['personid'],//$lanbilling->manager, 
        "currid" => $curId,
        "orderid" => 0,
        "classid" => (integer)$_POST['classid'],
        "amount" => $lanbilling->float($_POST['payment_sum']),
        "receipt" => $_POST['payment_number'],
        "comment" => $_POST['payment_comment'],
        "paymentordernumber" => $_POST['paymentordernumber']
    );

    if($lanbilling->Option('payments_cash_now') != 1) $struct["paydate"] = $lanbilling->formatDate($_POST['formattedDate'], 'Y-m-d') . ' ' . date('H:i:s');

    if( false != $lanbilling->save("Payment", $struct, false, array("getAccount", "getPayments")) ) {
        if((integer)$lanbilling->saveReturns->ret > 0) {
            $result = $lanbilling->get("getPayments", array( "flt" => array("recordid" => (integer)$lanbilling->saveReturns->ret) ));
        }
        $_data = array(
            'sum' => $lanbilling->float($_POST['payment_sum']),
            'extid' => $_SESSION['auth']['cashregister']['id'],
            'registerfolder' => $_SESSION['auth']['cashregister']['folder'],
            'authname' => $_SESSION['auth']['authname'],
            'pmid' => (integer)$lanbilling->saveReturns->ret,
            'agrmnum' => ((integer)$lanbilling->saveReturns->ret > 0) ?  $result->agrm : ''
        );

        /**
         * Обновление информации в документе БСО (Номер платежа)
         */

        $bsoerr = 0;
        if ((integer)$lanbilling->saveReturns->ret > 0){
        if ($_POST['bso_set_id'] != 0 && $_POST['bso_doc_id'] != 0){
            $r = array(
                "payid" => (integer)$lanbilling->saveReturns->ret,
                "bsoid" => $_POST['bso_doc_id']
            );
                if ( false == $lanbilling->get("setPaymentBSO", $r, false)){
                    $error = $lanbilling->soapLastError();
                    if (preg_match('~.*Existing\sdate\s(\d{4}-\d{2}-\d{2}).*\s(\d{4}-\d{2}-\d{2})~',$error->detail,$mtch)){
                        $bsoerr = '<br/>' . $localize->get('Unable to bind strict reporting form') . ', ' . $localize->get('date should be') . ' ' . $mtch[1];
                    } elseif (preg_match('~.*Pay\sdate\s(\d{4}-\d{2}-\d{2}).*BSO.*\s(\d{4}-\d{2}-\d{2})~is',$error->detail,$mtch)) {
                        $bsoerr = '<br/>' . $localize.get('Unable to bind strict reporting form') . ', (' . $mtch[1] . ') ' . $localize->get('date should be less then date creation') . ' ('. $mtch[2] . ')';
                    } else {
                        $bsoerr = '<br/>' . $localize.get('Unable to bind strict reporting form');
                    }
                }
            }
        }
        echo '({ success: true, bsoerr: "'.$bsoerr.'", "data": ' . JEncode($_data, $lanbilling) . ' })';
    }
    else {
        $error = $lanbilling->soapLastError();
        if (preg_match("~^There is period lock.*\s(\d{4}-\d{2}-\d{2})$~is",$error->detail, $mtch)){
            $msg = '<br/>' . $localize->get('Period is locked') . '. ' . $localize->get('You cannot recieve payment before then') . ' <b>'.$mtch[1].'</b>.';
        } elseif(strstr($error->detail, "Duplicate entry") || strstr($error->detail, "already used")) {
            $msg = '<br/>' . $localize->get('Receipt already exist');
        }elseif(strstr($error->detail, "No confirmative document") || strstr($error->detail, 'not specified a required field: receipt / payment_order_num')) {
            $msg = '<br/>' . $localize->get('No confirmative document');
        } else {
            $msg = '<br/>' . $localize->get($error->detail);
        }
        echo '({ success: false, error: { reason: "' . $localize->get('Payment error') . '. ' . $msg . '" } })';
    }
} // end commitPayment()

/**
 * Get payments history for the selected agreement
 * @param    object, billing class
 * @param    object, localize class
 */
function getPayHistory( &$lanbilling, &$localize )
{
    if($lanbilling->getAccess('cashonhand') < 1) {
        echo '({ success: false, reason: "' . $localize->get('Access is restricted to this section') . '" })';
        return false;
    }

    if((integer)$_POST['getpayhistory'] <= 0) {
        echo '({ "total": 0, "results": "" })';
        return;
    }

    $_tmp = array();

    if(!isset($_POST['datetill']) || empty($_POST['datefrom'])) {
        $_POST['datetill'] = $lanbilling->subDate(date('Y-m') . '-01', 1, 'month', 'Y-m-d');
    }

    if(!isset($_POST['datefrom']) || empty($_POST['datetill'])) {
        $_POST['datefrom'] = $lanbilling->subDate(date('Y-m') . '-01', -1, 'month', 'Y-m-d');
    }

    $dtfrom = $lanbilling->formatDate($_POST['datefrom'] . " 00:00:00", 'YmdHis');
    $dtto = $lanbilling->formatDate($_POST['datetill'] . " 00:00:00", 'YmdHis');

    $_filter = array(
        "payhistory" => 1,
        "agrmid" => (integer) $_POST['getpayhistory'],
        "dtfrom" => $dtfrom,
        "dtto" => $dtto,
        "pgnum" => $lanbilling->linesAsPageNum((((integer)$_POST['limit'] <= 0) ? 100 : $_POST['limit']), (integer)$_POST['start'] + 1),
        "pgsize" => ((integer)$_POST['downtype'] == 0) ? (((integer)$_POST['limit'] <= 0) ? 100 : $_POST['limit']) : (isset($_POST['limit']) ? $_POST['limit'] : "")
    );

    if( false != ($result = $lanbilling->get("getPayments", array("flt" => $_filter, "md5" => $lanbilling->controlSum($_filter)) )) )
    {
        if(!is_array($result)) {
            $result = array($result);
        }
        array_walk($result, create_function('$obj, $key, $_tmp', '
            global $lanbilling;
            if ($obj->bsodoc > 0){
                $bsoD = $lanbilling->get("getBsoDocs", array("flt"=>array("recordid"=>$obj->bsodoc)));
                $bsodoc = array(
                    "recordid"  => $bsoD->recordid,
                    "number"    => $bsoD->number,
                    "setnumber" => $bsoD->setnumber
                );
            }else{
                $bsodoc = array(
                    "recordid"  => 0,
                    "number"    => "",
                    "setnumber" => ""
                );
            }
            $_tmp[0][] = array(
                "amount" => $obj->pay->amount,
                "currid" => $obj->pay->currid,
                "classid" => $obj->pay->classid,
                "classname" => $obj->pay->classname,
                "symbol" => $obj->currsymb,
                "ordernum" => $obj->ordernum,
                "date" => $obj->pay->paydate,
                "localdate" => $obj->pay->localdate,
                "recipe" => $obj->pay->receipt,
                "comment" => $obj->pay->comment,
                "mgr" => $obj->mgr,
                "recordid" => $obj->pay->recordid,
                "uid" => $obj->uid,
                "lock_period" => "'.$lanbilling->Option('lock_period').' 00:00:00",
                "revno" => $obj->pay->revno,
                "revisions" => $obj->pay->revisions,
                "fromagrmid" => $obj->pay->fromagrmid,
                "canceldate" => $obj->pay->canceldate,
                "agrmid" => $obj->pay->agrmid,
                "orig_payment" => getOrigPaymentAmount($obj->pay->recordid),
                "orig_agrm" => $_POST["getpayhistory"],
                "bsodoc" => $bsodoc,
                "registries" => $obj->pay->registries,
                "use_bso" => '.$_SESSION['auth']['access']['bso'].',
                "fromagrmnumber" => $obj->pay->fromagrmnumber,
                "uprsinfo" => "(" . json_encode($obj->pay->uprs) . ")",
                "isuprs" => isset($obj->pay->uprs) ? 1 : 0,
                "paymentordernumber" => $obj->pay->paymentordernumber
                );
            '), array(&$_tmp));

            /**
             * Сортировка списка истории платежей
             * @todo Перенести на сторону Lbcore или БД
             */
            if (is_array($_tmp)){
                usort($_tmp, 'paySort');
            }

        if(isset($_POST['download'])) {
            if(!empty($_POST['clm'])) {
                $clms = explode(';', $_POST['clm']);
            }
            else {
                $clms = array();
            }
            compileData($lanbilling, $_tmp, $clms);
            if(!empty($_POST['clmnames'])) {
                array_unshift($_tmp, prepareCSVFileHeader($lanbilling, $_POST['clmnames']));
            }
        }
        else {
            $count = $lanbilling->get("Count", array("flt" => $_filter, "procname" => "getPayments", "md5" => $_md5));
        }
    }

    if(isset($_POST['download'])) {
        if(sizeof($_tmp) > 0) {
            $lanbilling->Download('', 'payment.csv', implode("\r\n", $_tmp));
        }
    }
    else {
        if(sizeof($_tmp) > 0) {
            echo '({"total": ' . (integer)$count . ', "results": ' . JEncode($_tmp, $lanbilling) . '})';
        }
        else {
            echo '({ "total": 0, "results": ""})';
        }
    }
} // end getPayHistory()


function paySort($a, $b) {
    if (strtotime($a['date']) == strtotime($b['date'])){
        if ($a['recordid'] == $b['recordid']){
            return ($a['revno'] > $b['revno']) ? 1 : -1;
        } else return 0;
    }
    elseif (strtotime($a['date']) < strtotime($b['date'])) return 1;
    else return -1;
}

function getOrigPaymentAmount($recid){
    global $lanbilling;
    if( false != ($res = $lanbilling->get("getPayments", array("flt" => array("recordid"=>$recid) ) )) ) {
        return $res->pay->amount;
    }else return 0;
}

/**
 * Simple function to return payment order number templates
 * @param    object, billing class
 */
function getOrderTpl( &$lanbilling )
{
    class format {
        private $items = array();

        private $last = array("char" => '', "posn" => 0);

        public function __construct() {
            $this->last = (object)$this->last;
        }

        public function get() {
            $_str = "";

            foreach($this->items as $item) {
                $_str .= $item['tpl'];

                if((integer)$item['count'] > 1) {
                    $_str .= '\\x7B'.$item['count'].'\\x7D';
                }
            }

            return $_str;
        }

        public function push($A, $B, $C, $D = false) {
            if($D == true) {
                $this->add($C, $B);
                $this->setLast($A, $B);
            }
            else {
                if($this->last->char == $A) {
                    $this->update($this->last->posn);
                }
                else {
                    $this->add($C, $B);
                    $this->setLast($A, $B);
                }
            }
        }

        private function add($A, $B) {
            $this->items[$B] = array("tpl" => $A, "count" => 1);
        }

        private function update($A) {
            $this->items[$A]["count"]++;
        }

        private function setLast($A, $B) {
            $this->last->char = $A;
            $this->last->posn = $B;
        }
    }

    $_format = new format;
    $_lb_format = $lanbilling->Option('payment_format');

    if($_lb_format != false && !empty($_lb_format))
    {
        for($i=0, $off=mb_strlen($_lb_format, 'utf8'); $i<$off; $i++)
        {
            switch( true )
            {
                case ($_lb_format[$i] == 'A'):
                    $_format->push($_lb_format[$i], $i, '[A-z\\u0410-\\u044f]');
                break;

                case ($_lb_format[$i] == '#'):
                    $_format->push($_lb_format[$i], $i, '[0-9]');
                break;

                default: $_format->push($_lb_format[$i], $i, $_lb_format[$i], true);
            }
        }
    }
    else {
        $_format->push('*', 0, '.*', true);
    }

    return array('pordernum' => $_lb_format, 'pordertpl' => $_format->get());
} // end getOrderTpl()


/**
 * Get document templates to create receipt
 * @param    object, billing class
 */
function getDocTemplates( &$lanbilling )
{
    $_tmp = array();
    $_filter = array("onfly" => (integer)$_POST['getdoctpls']);

    if( false != ($result = $lanbilling->get("getDocuments", array("flt" => $_filter, "md5" => $lanbilling->controlSum($_filter)))) )
    {
        if(!is_array($result)) {
            $result = array($result);
        }

        array_walk($result, create_function('$item, $key, $_tmp', 'if($item->hidden < 1) { $_tmp[0][] = (array)$item; };'), array(&$_tmp));
    }

    if(sizeof($_tmp) > 0) {
        echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
    }
    else echo '({ "results": "" })';
} // end getDocTemplates()


/**
 * Print receipt on call
 * @param    object, billing class
 */
function printReceipt( &$lanbilling )
{
    if((integer)$_POST['getreceipt'] == 0) {
        echo "({ success: false, error: { reason: Unknown document template } })";
    }

    $struct = array(
        "period" => $lanbilling->formatDate($_POST['receiptdate'], 'Ym'),
        "docid" => (integer)$_POST['getreceipt'],
        "num" => $_POST['receiptnum'],
        "date" => 0,
        "summ" => (float)$_POST['receiptsum'],
        "grp" => 0,
        "ugrp" => 0,
        "uid" => (integer)$_POST['receiptuid'],
        "agrmid" => (integer)$_POST['receiptagrm'],
        "oper" => 0
    );

    // Let us send record id information for the server
    $filter = array(
        'recordid' => (integer)$_POST['receiptid']
    );

    if( false != ($lanbilling->save("genOrderGetFile", $struct, true, array(), $filter)) ) {
        // Store file for future request to download with specific headers
        $fuid = substr(md5($lanbilling->manager . date('mdHis')), 0, 12);
        $handler = fopen($lanbilling->systemTemporary() . '/lb_rcpt_' . $fuid, 'wb');
        fwrite($handler, $lanbilling->saveReturns->ret);
        fclose($handler);

        echo "({ success: true, fileid: '" . $fuid . "', docid: " . (integer)$_POST['getreceipt'] . " })";
    }
    else {
        $error = $lanbilling->soapLastError();
        echo "({ success: false, errors: { reason: '" . $error->detail . "' } })";
    }
} // end printReceipt()


/**
 * Start to down load saved file
 * @param    object, billing class
 */
function downloadReceiptFile( &$lanbilling )
{
    $file = $lanbilling->systemTemporary() . '/lb_rcpt_' . $_POST['getrcptfile'];
    if(file_exists($file))
    {
        $_filter = array("docid" => (integer)$_POST['docid']);
        if( false != ($result = $lanbilling->get("getDocuments", array('flt' => $_filter, 'md5' => $lanbilling->controlSum($_filter)))) )
        {
            $_tmp = explode('.', $result->doctemplate);
            $_tmp[0] = date('Ymd');

            if( false == $lanbilling->Download($file, implode('.', $_tmp), '', $result->docuploadext) )
            {
                getFileError($lanbilling, $localize, 1, $file);
            }
        }
    }
} // end downloadReceiptFile()


/**
 * Cut and prepare array data to send as CSV
 * @param    object, billing class
 * @param    array, data
 * @param    array, fields to use as keys
 * @param    function, use this function instead of array key intersection
 */
function compileData( &$lanbilling, &$data, $keys = array(), $callback = false )
{
    if(!empty($keys)) {
        if(!in_array('curr_id', $keys)) {
            array_push($keys, 'curr_id');
        }
        $keys = array_flip($keys);
    }
    else $keys = false;

    // Get character set from options to export data
    if(false == ($out_encoding = $lanbilling->Option('export_character'))) {
        $out_encoding = $lanbilling->encodingName('UTF8');
    }
    else {
        $out_encoding = $lanbilling->encodingName($out_encoding);
    }

    // Sums array
    $_sums = array();

    foreach($data as $i => $item)
    {
        $line = array();

        if($keys != false) {
            if($callback != false) {
                $line = $callback($item, $keys);
            }
            else $line = array_intersect_key($item, $keys);
            $_tmp_line = array();
        }
        else $line = $item;

        foreach($line as $key => $val) {
            if(is_string($val)) {
                $str_encoding = mb_detect_encoding($val, $lanbilling->encodingName('UTF8, CP1251, KOI8R, ASCII'), true);
                if($str_encoding != $out_encoding) {
                    $val = iconv($str_encoding, $out_encoding, $val);
                }

                $val = str_replace('"', '\"', $lanbilling->stripMagicQuotes($val));
            }

            if($key == 'amount' || $key == 'amount_in' || $key == 'amount_out') {
                $val = number_format((float)$val, 2, ",", " ");
            }

            if($keys != false) {
                $_tmp_line[$keys[$key]] = sprintf('"%s"', $val);
            }
            else {
                $line[$key] = sprintf('"%s"', $val);
            }
        }

        if($keys != false) {
            ksort($_tmp_line);
            $line = $_tmp_line;
        }

        $data[$i] = implode(';', $line);
    }
} // end compileData()


/**
 * Compile header line for the download file
 * @param    object, billing class
 * @param    string, header line
 */
function prepareCSVFileHeader( &$lanbilling, $line ) {
    $line = explode(';', $line);

    // Get character set from options to export data
    if(false == ($out_encoding = $lanbilling->Option('export_character'))) {
        $out_encoding = $lanbilling->encodingName('UTF8');
    }
    else {
        $out_encoding = $lanbilling->encodingName($out_encoding);
    }

    foreach($line as $key => $val) {
        if(empty($val)){
            $val = '';
        }
        else {
            $str_encoding = mb_detect_encoding($val, $lanbilling->encodingName('UTF8, CP1251, KOI8R, ASCII'), true);
            if($str_encoding != $out_encoding) {
                $val = iconv($str_encoding, $out_encoding, $val);
            }
        }

        $val = str_replace('"', '\"', $lanbilling->stripMagicQuotes($val));
        $line[$key] = sprintf('"%s"', $val);
    }

    return implode(';', $line);
} // end prepareCSVFileHeader



function getPromisedHistory( &$lanbilling, &$localize )
{
    if($lanbilling->getAccess('cashonhand') < 1) {
        echo '({ success: false, reason: "' . $localize->get('Access is restricted to this section') . '" })';
        return false;
    }

    $_tmp = array();

    $_filter = array(
        "agrmid" => (int)$_POST['agrmid'],
        "dtfrom" => $_POST['dtfrom'],
        "dtto" => $_POST['dtto'],
        "pgnum" => $lanbilling->linesAsPageNum((((integer)$_POST['limit'] <= 0) ? 100 : $_POST['limit']), (integer)$_POST['start'] + 1),
        "pgsize" => ((integer)$_POST['downtype'] == 0) ? (((integer)$_POST['limit'] <= 0) ? 100 : $_POST['limit']) : (isset($_POST['limit']) ? $_POST['limit'] : "")
    );

    if( false != ($result = $lanbilling->get("getPromisePayments", array("flt" => $_filter, "md5" => $lanbilling->controlSum($_filter)) )) )
    {

        if(!is_array($result)) {
            $result = array($result);
        }

		$count = $lanbilling->get("Count", array("flt" => $_filter, "procname" => "getPromisePayments", "md5" => $_md5));
		
    }
	if(sizeof($result) > 0) {
		echo '({"total": ' . (integer)$count . ', "results": ' . JEncode($result, $lanbilling) . '})';
	}
	else {
		echo '({ "total": 0, "results": ""})';
	}
} // end getPayHistory()
