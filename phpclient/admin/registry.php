<?php
/**
 * Registry backend
 */
if(isset($_POST['async_call']))
{
	if(isset($_POST['getAgentAccounts'])) {
		getAgentAccounts($lanbilling);
	}
	if(isset($_POST['getregistrypayments'])) {
		getRegistryPayments($lanbilling);
	}
	if(isset($_POST['registryControl'])) {
		registryControl($lanbilling, $localize);
	}
	if(isset($_POST['saveRegistry'])) {
		saveRegistry($lanbilling, $localize);
	}

	if(isset($_POST['getRegistry'])) {
		getRegistry($lanbilling);
	}

	if(isset($_POST['getRegPayments'])) {
		getRegPayments($lanbilling);
	}

	if(isset($_POST['makeManualData'])) {
		makeManualData($lanbilling);
	}
}
else
{
	$tpl = new HTML_Template_IT(TPLS_PATH);
	$tpl->loadTemplatefile("registry.tpl", true, true);
	$tpl->setVariable('CURRENTMANAGERNAME', $_SESSION['auth']['authname']);
	$tpl->touchBlock('__global__');
	$localize->compile($tpl->get(), true);
}

function makeManualData($lanbilling) {
    $string = $_POST['makeManualData'];
    if (!empty($string)){
		
		
        //$regexp = $lanbilling->option('skaner_regexp');
        /*
               1-5   Постоянное значение «01142»
               6     Резерв
            [1]7-14  Сумма (в копейках)
            [2]15-25 Номер лицевого счета (номер абонентского договора)
            [3]26-32 Номер квитанции

            Example: 01142011111111000000004673333333
        */
        
        // Отключена проверка в связи с нестабильностью формата штрах-кода
        //if (preg_match('~'.$regexp.'~is',$string,$mtch)){
			
            $_filter = array(
                //'agrmnum' => $mtch[2] // проверка формата отключена
				'agrmnum' => (integer)$string
            );           

			$_order = array(
				'name' => 'o_order_num + 0',
				'ascdesc' => 0
			);
								
			$_filter2 = array(
				"orderid" => (integer)$string,
				"payed" => 0
				);

				if( false != ($result2 = $lanbilling->get("getOrders", array("flt" => $_filter2, "ord" => $_order))) )
				{
					if(!is_array($result2)) {
						$result2 = array($result2);
					}
					array_walk($result2, create_function('$item, $key, $_tmp', '$_tmp[0][] = (array)$item;'), array( &$_tmp ));
				}
					
			if(false === ($result = $lanbilling->get("getAgreements", array("flt" => $_filter)))) {
                throw new Exception($lanbilling->soapLastError()->detail);
            } else {
                if ($result !== null){
                    $res = array(
                        'agrm'  => $result[0]->number,
                        'sum'   => round($_tmp[0]['resumm'], 2), // округляем-с
                        'order' => ($_tmp[0]['ordernum'] == 0) ? '' : $_tmp[0]['ordernum']
                    );
				
                    echo '({success: true, "results": ' . JEncode($res, $lanbilling) . '})';
                } else {
                    echo '({ success: false,  errors: {reason: "Agreement not found"} })'; return;
                }
            }
            
        //}else{
            //echo '({ success: false,  errors: {reason: "Не распознан формат Штрих-Кода. Введите данные вручную."} })';
        //}
    }
}


function getRegPayments($lanbilling){
	$data = array(
		'rid' => $_POST['getRegPayments']
	);
	if (isset($_POST['getRegPayments']) &&  $_POST['unpassage'] == 1) {
		$data['unpassage'] = 1;
	}
	if( false != ($result = $lanbilling->get('getRegistryPayments', $data))){
		if (!isset($result->payments)) {
			$result->payments = array();
		}
		if(!is_array($result->payments)) { $result->payments = array($result->payments); }
        array_walk($result->payments, create_function('$item, $key, $_tmp','
			$_tmp[0][] = array(
				"recordid"  => $item->recordid,
				"number"    => $item->number,
				"paydate"   => $item->paydate,
				"amount"    => $item->amount,
				"receipt"   => $item->receipt,
                "ordernum"  => $item->ordernum,
                "paymentid" => $item->paymentid,
                "localdate" => $item->localdate,
                "status"    => $item->status,
                "more"    	=> $item->more,
        		"comment"   => $item->comment,
        		"paymentordernumber"   => $item->paymentordernumber
			);
        '), array( &$_tmp ));
		if(sizeof($_tmp) > 0) {
			echo '({"total": ' . count($_tmp) . ', "results": ' . JEncode($_tmp, $lanbilling) . '})';
		}
		else echo '({ "total": 0, "results": "" })';
	}else{
		$error = $lanbilling->soapLastError();
		echo '({ success: false,  errors: {reason: "'.$error->detail.'"} })';
		return false;
	}

}

/**
 * Получение списка агентов
 */
function getAgentAccounts($lanbilling){
	$_tmp    = array();
	$_filter = array(
		'archive'  => 0,
		'category' => 6
	);
	$count = $lanbilling->get("Count", array("flt" => $_filter, "procname" => "getAccounts"));
	if( false != ($result = $lanbilling->get('getAccounts', array('flt'=>$_filter)))){
		if(!is_array($result)) { $result = array($result); }
		$count = count($result);

		foreach($result as $obj) {
			$_arr = array(
				"uid"   => $obj->account->uid,
				"login" => $obj->account->login,
				"name"  => $obj->account->name,
				"descr" => $obj->account->descr
			);
			$_tmp[] = $_arr;
		}
		if(sizeof($_tmp) > 0) {
			echo '({"total": ' . $count . ', "results": ' . JEncode($_tmp, $lanbilling) . '})';
		}
		else echo '({ "total": 0, "results": "" })';
	}else{
		$error = $lanbilling->soapLastError();
		echo '({ success: false,  errors: {reason: "'.$error->detail.'"} })';
		return false;
	}
}

/**
 * Поиск платежа для загрузки реестров
 */
function getRegistryPayments($lanbilling){
	if((integer)$_POST['getregistrypayments'] < 0) {
		echo '({ success: false, errors: { reason: "Error while loading payments list" } })';
		return false;
	}

	$_filter = array(
		"userid" => (integer)$_POST['getregistrypayments'],
		"hasregistry" => 0
	);

	if(false != ($result=$lanbilling->get("getPayments",array("flt"=>$_filter))))
	{
		if(!is_array($result)) {
			$result = array($result);
		}

        array_walk($result, create_function('$obj, $key, $_tmp', '
			$_tmp[0][] = array(
				"amount"     => $obj->pay->amount,
				"currid"     => $obj->pay->currid,
				"classid"    => $obj->pay->classid,
				"classname"  => $obj->pay->classname,
				"symbol"     => $obj->currsymb,
				"ordernum"   => $obj->ordernum,
				"date"       => $obj->pay->paydate,
				"localdate"  => $obj->pay->localdate,
				"recipe"     => $obj->pay->receipt,
				"comment"    => $obj->pay->comment,
				"mgr"        => $obj->mgr,
				"recordid"   => $obj->pay->recordid,
				"uid"        => $obj->uid,
				"revno"      => $obj->pay->revno,
				"revisions"  => $obj->pay->revisions,
				"fromagrmid" => $obj->pay->fromagrmid,
				"canceldate" => $obj->pay->canceldate,
				"agrmid"     => $obj->pay->agrmid
				);
			'), array(&$_tmp));

		$count = $lanbilling->get("Count", array("flt" => $_filter, "procname" => "getPayments"));

		if(sizeof($_tmp) > 0) {
			echo '({"total": ' . (integer)$count . ', "results": ' . JEncode($_tmp, $lanbilling) . '})';
		}
		else {
			echo '({ "total": 0, "results": ""})';
		}
	} else {
		echo '({ success: false,  errors: { reason: "Error with resiving payment data!" } })';
		return false;
	}
}


/**
 * Контроль реестра
 */
function registryControl($lanbilling, $localize, $localUse = false){
	if ($_POST['payments']){
		$function = 'registryControl';
		$data = json_decode($_POST['payments']);
		$payment_id = ($data->payment_id) ? $data->payment_id : 0;
		if(!is_array($data->payments)) { $data->payments = array($data->payments); }
        array_walk($data->payments, create_function('$item, $key, $_tmp','
			$_tmp[0][] = array(
				"agreement" => $item->agrm,
				"receipt"   => $item->recipe,
				"date"      => $item->pay_date,
				"sum"       => $item->pay_sum,
				"order"     => $item->order,
				"more"      => str_replace(array("\r\n", "\n", "\r"), "<BR/>", $item->more),
        		"comment"	=> $item->comment,
        		"paymentordernumber"   => $item->paymentordernumber,
        		"recordid"   => $item->recordid
			);
        '), array( &$_tmp ));
		$registry = (count($_tmp) > 0) ? $_tmp : array();
		/**
		 * Заголовок (1-я строка) файла реестра
		 */
		$registry_header = array(
			"receipt"      => $data->searchPaymentRecipe,
			"date"         => $data->searchPaymentDate,
			"sum"          => $data->searchPaymentSum,
			"devisionCode" => $data->divisionCode,
			"order"        => ''
		);
		$registry = arr2csv::arr_to_csv(array_merge(array($registry_header), $registry));
	}
	else
	{
		$function = 'registryControl2';
		if( false == ($files = $lanbilling->UploadCheck('upcontent')) ) {
			echo "({ success: false, errors: { reason: 'File upload error' } })";
			return false;
		}
		//$registry = $lanbilling->csvFileToArray($files[0]['tmp_name'], 5, array('agreement', 'receipt', 'date', 'sum', 'order'));
		//$registry = file_get_contents($files[0]['tmp_name']);
		
		$registry = base64_encode(file_get_contents($files[0]['tmp_name']));
	}

	$struct = array(
		'uid' => ( ($_POST['saveRegistry']) ? (integer)$_POST['saveRegistry'] : (integer)$_POST['registryControl']),
		'pid' => $payment_id,
		'filename' => $files[0]['name'],
		'registry' => $registry
	);
	if( false == ($result = $lanbilling->get($function, $struct) ) ) {
		$error = $lanbilling->soapLastError();
		if (strstr($error->detail, 'Unrecognized datetime value')) {
			$error->detail = $localize->get("Wrong format of registry date");
		}
		if ($localUse)
			return false;
		else
			echo "({ success: false,  errors: {reason: " . JEncode($error, $lanbilling) . "}})";
	}else{
        if (!is_array($result->payments) && is_object($result->payments))
            $result->payments = array($result->payments);
        
		if ($localUse)
			return $result;
		else
			echo "({ success: true, result: " . JEncode($result, $lanbilling) . "})";
	}
}

function saveRegistry( &$lanbilling, $localize)
{
	$data = array(
		"val" => registryControl($lanbilling, $localize, true)
	);
	if ((integer) $_POST['repassage'] == 1) {
		$data["val"]->repassage = 1;
		$data["val"]->registryid = $_POST['registryid'];
	}
	if( false == ($result = $lanbilling->get("insRegistry", $data) ) ) {
		$error = $lanbilling->soapLastError();
		echo "({ success: false,  errors: {reason: " . JEncode($error, $lanbilling) . "}})";
	}else{
		echo "({ success: true, result: " . JEncode($result, $lanbilling) . "})";
	}

}

/**
 * @category SYSTEM
 * Парсим CSV в массив
 */
class arr2csv
{
	static public function arr_to_csv_line($arr) {
		$line = array();
		foreach ($arr as $v) {
			$line[] = is_array($v) ? self::arr_to_csv_line($v) : str_replace('"', '""', $v);
		}
		return implode(";", $line);
	}
	static public function arr_to_csv($arr) {
		$lines = array();
		foreach ($arr as $k=>$v) {
			$lines[] = self::arr_to_csv_line($v).(($k==0) ? '' : ';');
		}

		return implode("\n", $lines);
	}
}


/**
 * История реестров
 */
function getRegistry($lanbilling){

	if(!isset($_POST['datetill']) || empty($_POST['datefrom'])) {
		$_POST['datetill'] = $lanbilling->subDate(date('Y-m') . '-01', 1, 'month', 'Y-m-d');
	}
	if(!isset($_POST['datefrom']) || empty($_POST['datetill'])) {
		$_POST['datefrom'] = $lanbilling->subDate(date('Y-m') . '-01', -1, 'month', 'Y-m-d');
	}
	$dtfrom = $lanbilling->formatDate($_POST['datefrom'] . " 00:00:00", 'Y-m-d H:i:s');
	$dtto = $lanbilling->formatDate($_POST['datetill'] . " 00:00:00", 'Y-m-d H:i:s');
	$_filter = array(
		"dtfrom" => $dtfrom,
		"dtto"   => $dtto,
		"pgnum" => $lanbilling->linesAsPageNum((((integer)$_POST['limit'] <= 0) ? 100 : $_POST['limit']), (integer)$_POST['start'] + 1),
		"pgsize" => ((integer)$_POST['downtype'] == 0) ? (((integer)$_POST['limit'] <= 0) ? 100 : $_POST['limit']) : (isset($_POST['limit']) ? $_POST['limit'] : ""),
		'userid' => $_POST['getRegistry']
	);
	if( false != ($result = $lanbilling->get('getRegistry', array('flt'=>$_filter)))){
		if(!is_array($result)) { $result = array($result); }
		$count = count($result);
		$_tmp = $result;

		if(sizeof($_tmp) > 0) {
			echo '({"total": ' . $count . ', "results": ' . JEncode($_tmp, $lanbilling) . '})';
		}
		else echo '({ "total": 0, "results": "" })';
	}else{
		$error = $lanbilling->soapLastError();
		echo '({ success: false,  errors: {reason: "'.$error->detail.'" }})';
		return false;
	}
}

function get_encoding($str){
	$cp_list = array('utf-8', 'windows-1251');
	foreach ($cp_list as $k=>$codepage){
		if (md5($str) === md5(iconv($codepage, $codepage, $str))){
			return $codepage;
		}
	}
	return null;
}
