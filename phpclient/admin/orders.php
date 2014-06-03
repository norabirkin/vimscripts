<?php
/**
 * Financial documents viewer
 *
 * Repository information:
 * $Date: 2009-12-21 13:22:01 $
 * $Revision: 1.57.2.26 $
 */

// There is background query
if(isset($_POST['async_call']))
{
	if(isset($_POST['getdoctypes'])) {
		getDocuments($lanbilling);
	}

	if(isset($_POST['getugroups'])) {
		getUserGroups($lanbilling);
	}

	if(isset($_POST['getoperators'])) {
		getOperators($lanbilling);
	}

	if(isset($_POST['getdocument'])) {
		getOrders($lanbilling);
	}

	if(isset($_POST['getsingleord'])) {
		getSingleFile($lanbilling, $localize);
	}

	if(isset($_POST['getmultiord'])) {
		getMultiOrder($lanbilling);
	}

	if(isset($_POST['getmultifile'])) {
		getMultiFile($lanbilling, $localize);
	}

	if(isset($_POST['getpordertpl'])) {
		getOrderTpl($lanbilling);
	}

	if(isset($_POST['saveorderpaid'])) {
		MakePayment($lanbilling);
	}

	if(isset($_POST['deldocid'])) {
		RemoveDocument($lanbilling);
	}

	if(isset($_POST['sendbyemail'])) {
		SendByEmail($lanbilling);
	}
}
// There is standart query
else
{
	$tpl = new HTML_Template_IT(TPLS_PATH);
	$tpl->loadTemplatefile("orders.tpl", true, true);
	$tpl->touchBlock('__global__');
	$payMask = getOrderTemplate($lanbilling);
	$tpl->setVariable("OP_PAY_MASK", $payMask['pordertpl']);
	$tpl->setVariable("OP_PAYFORMAT_LENGTH", strlen($lanbilling->Option('payment_format')));

	if(isset($_POST['defaultview']) && is_array($_POST['defaultview']) && sizeof($_POST['defaultview'])) {
		$tpl->setCurrentBlock('DefaultView');
		$tpl->setVariable("DEFVIEWITEMS", JEncode($_POST['defaultview'], $lanbilling));
		$tpl->parseCurrentBlock();
	}

	$localize->compile($tpl->get(), true);
}


/**
 * Get documents templates list avaliable to view generated reports
 * @param	object, billing class
 */
function getDocuments( &$lanbilling )
{
	$_tmp = array();

	if( false != ($result = $lanbilling->get("getDocuments", array("flt" => array(), "md5" => ""))) )
	{
		if(!is_array($result)) {
			$result = array($result);
		}

		array_walk($result, create_function('$item, $key, $_tmp', 'if($item->hidden < 1){ $_tmp[0][] = array("id" => $item->docid, "name" => $item->name, "type" => $item->payable); };'), array( &$_tmp ));
	}
	if(sizeof($_tmp) > 0) {
		echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
	}
	else echo '({ "results": "" })';
} // end getDocuments()


/**
 * Get users groups
 * @param	object, billing class
 */
function getUserGroups( &$lanbilling )
{
	$_tmp = array();

	if( false != ($result = $lanbilling->get("getUserGroups", array("flt" => array()))) )
	{
		if(!is_array($result)) {
			$result = array($result);
		}

		array_walk($result, create_function('$item, $key, $_tmp', '$_tmp[0][] = array("id" => $item->usergroup->groupid, "name" => $item->usergroup->name, "descr" => $item->usergroup->description);'), array( &$_tmp ));
	}

	if(sizeof($_tmp) > 0) {
		echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
	}
	else echo '({ "results": "" })';
} // end getUserGroups()


/**
 * Get billing system operators
 * @param	object, billing class
 */
function getOperators( &$lanbilling )
{
	$_tmp = array();

	$result = $lanbilling->getOperators();

	if(!empty($result)) {
		array_walk($result, create_function('$item, $key, $_tmp', '$_tmp[0][] = array("id" => $item["uid"], "name" => $item["name"]);'), array( &$_tmp ));
	}

	if(sizeof($_tmp) > 0) {
		echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
	}
	else echo '({ "results": "" })';
} // end getOperators()


/**
 * Get orders list
 * Available filter
 * docid - document id
 * dtfrom - report period
 * operid - operator id
 * name - user name
 * agrmnum - agreement number
 * vglogin - account login
 * ugroups - users groups
 * payed - 0: all, 1: paid, 2: not paid
 * dtactivated - date when document was paid
 *
 * Sort Order fields:
 * o_order_num, o_curr_summ, o_period, o_order_date, o_pay_date, a_name, p_receipt
 *
 * @param	object, billing class
 */
function getOrders( &$lanbilling, $silent = false )
{
	if(sizeof(explode('-', $_POST['datefor'])) == 3) {
		$_d = explode('-', $_POST['datefor']); unset($_d[2]);
		$_POST['datefor'] = implode('-', $_d); unset($_d);
	}

	$dtfrom = $lanbilling->formatDate($_POST['datefor'] . '-01 00:00:00', 'YmdHis');

	// $_POST['paidgroup'] in the filter parameter 'payed' should be:
	// if show all = -1
	// if show only free for pay = 0
	// if show only for payed = 1

	$_filter = array(
		"docid" => (integer)$_POST['getdocument'],
		"dtfrom" => $dtfrom,
		"operid" => (integer)$_POST['operid'],
		"ugroups" => (integer)$_POST['ugroup'],
		"payed" => ((integer)$_POST['paidgroup'] == 2) ? 0 : (((integer)$_POST['paidgroup'] == 1) ? 1 : -1)
	);

	if($silent == false) {
		$_filter["pgnum"] = ((integer)$_POST['downtype'] == 0) ? $lanbilling->linesAsPageNum((((integer)$_POST['limit'] <= 50) ? 100 : $_POST['limit']), (integer)$_POST['start'] + 1) : 0;
		$_filter["pgsize"] = $_POST['limit'];
	}
	if ($_POST['postmanId']) $_filter['postmanid'] = $_POST['postmanId'];

	// Advanced search
	if(isset($_POST['searchtpl']) && !empty($_POST['searchtpl'])) {
		foreach($_POST['searchtpl'] as $item) {
			$t = explode('.', $item['property']);
			$_filter['searchtempl'][] = array(
				"tplname" => '',
				"tablename" => $t[0],
				"field" => $t[1],
				"condition" => $item['condition'],
				"value" => $item['value'],
				"logic" => $item['logic']
			);
		}
	}

	// Search filter
	if((integer)$_POST['vgid'] == 0)
	{
		switch((integer)$_POST['searchtype'])
		{
			case 1: $_filter['agrmnum'] = $_POST['searchfield'];
				$_filter['name'] = '';
				$_filter['vglogin'] = '';
			break;

			case 0: $_filter['agrmnum'] = '';
				$_filter['name'] = $_POST['searchfield'];
				$_filter['vglogin'] = '';
			break;

			default:
				$_filter['agrmnum'] = '';
				$_filter['name'] = '';
				$_filter['vglogin'] = $_POST['searchfield'];
		}
	}

	$_order = array(
		'name' => 'o_order_num + 0',
		'ascdesc' => 0
	);

	switch($_POST['sortfield'])
	{
		case 'username': $_order['name'] = 'a_name'; break;
		case 'currsumm': $_order['name'] = 'o_curr_summ'; break;
		case 'paydate': $_order['name'] = 'o_pay_date'; break;
		case 'payreceipt': $_order['name'] = 'p_receipt'; break;
	}

	if(strcasecmp($_POST['sortdir'], 'desc') == 0) {
		$_order['ascdesc'] = 1;
	}

	if((integer)$_POST['paidgroup'] == 1) {
		if(isset($_POST['paiddate']) && !empty($_POST['paiddate'])) {
			if(sizeof(explode('-', $_POST['paiddate'])) < 3) {
				$_POST['paiddate'] = $_POST['paiddate'] . '-01';
			}
			$_filter['dtactivated'] = $lanbilling->formatDate($_POST['paiddate'] . ' 00:00:00', 'YmdHis');
		}
	}

	$_tmp = array();

	// In case we chose getting exact order id we have to set this order id into filter
	if(isset($_POST['exactorderid']) && !empty($_POST['exactorderid']) && $_POST['exactorderid'] > 0 )
	$_filter = array(
		"orderid" => (integer)$_POST['exactorderid'],
		"payed" => 0
	);

	$lb = $lanbilling->cloneMain(array('query_timeout' => 380));
	if( false != $count = $lb->get("Count", array("flt" => $_filter, "procname" => "getOrders"), true) )
	{
		if($silent == false) {
			if($_filter['pgsize'] == 0) $_filter['pgsize'] = (int)$count; // if select SHOW ALL
		}
		
		if( false != ($result = $lb->get("getOrders", array("flt" => $_filter, "ord" => $_order))) )
		{
			if(!is_array($result)) {
				$result = array($result);
			}
			if($silent == true) {
				return $result;
			}
			array_walk($result, create_function('$item, $key, $_tmp', '$_tmp[0][] = (array)$item;'), array( &$_tmp ));
		}
	}
	else {
		if($silent == true) {
			return array();
		}
	}

	
	if(sizeof($_tmp) > 0) {
		echo '({"total": ' . (integer)$count . ', "results": ' . JEncode($_tmp, $lanbilling) . '})';
	}
	else echo '({ "results": "" })';
} // end getOrders()


/**
 * Get direct single file
 * @param	object, billing class
 */
function getSingleFile( &$lanbilling, &$localize )
{
	if( false != ($item = $lanbilling->get("getOrders", array("flt" => array("orderid" => (integer)$_POST['getsingleord'])), true)) )
	{
		$_tmp = explode('.', $item->doctemplate);
		$_tmp[0] = $item->orderid;
		$_file = $_tmp[0] . "-" .$lanbilling->formatDate($item->period, 'Ymd') . "." . $_tmp[1];// $lanbilling->formatDate($item->period, 'Ymd') . "." . $_tmp[1];
		
		if(!empty($_POST['getExt']) && $item->docuploadext != "application/octet-stream") {
			$ext = LBDownloadHelper::getExtensionByMimeType($item->docuploadext);			
			$_file = $_tmp[0]. '-'. $lanbilling->formatDate($item->period, 'Ymd') . "." . $ext;
		}
		
		if(empty($_POST['filename'])) {
			$ff = $lanbilling->inCorePath($item->docsavepath) . sprintf("/%d/", $lanbilling->formatDate($item->period, 'Ym')) .	implode('.', $_tmp);
		} else {
			$ff = $_POST['filename'];
		}
		
		if( false == $lanbilling->Download($ff, $_file, '', $item->docuploadext) )
		{
			getFileError($lanbilling, $localize, 1, $lanbilling->inCorePath($item->docsavepath) .
				sprintf("/%d/", $lanbilling->formatDate($item->period, 'Ym')) .
				implode('.', $_tmp), $_file);
		}
	} else getFileError($lanbilling, $localize, 3, $localize->get( 'Report is not found' ));
} // end getSingleFile()


/**
 * Try to download create file
 * @param	object, billing class
 * @param	object, localize class
 */
function getMultiOrder( &$lanbilling )
{
	$_list = array();

	if(!empty($_POST['filesarray']))
	{
		$_POST['getdocument'] = (integer)$_POST['getmultiord'];
		$result = getOrders($lanbilling, true);
		$doctemplate = '';
		$filename = '';
		$extention = '';

		foreach($result as $item)
		{
			
			if(!in_array($item->orderid, $_POST['filesarray'])) {
				continue;
			}

			$_tmp = explode('.', $item->doctemplate);

			if(empty($doctemplate)) {
				$doctemplate = $_tmp[0];
			}

			if(empty($filename)) {
				$filename = $lanbilling->formatDate($item->period, 'Ymd') . "." . $_tmp[1];
			}

			if(empty($extention)) {
				$extention = $item->docuploadext;
			}

			$_tmp[0] = $item->orderid;
			
			if(empty($item->filename)) {
				$_list[] = $lanbilling->inCorePath($item->docsavepath) . sprintf("/%d/", $lanbilling->formatDate($item->period, 'Ym')) .	implode('.', $_tmp);
			} else {
				$_list[] = $item->filename;
			}
		}

		if(!empty($_list))
		{
			$_uname = 'lborders-' . substr(md5(uniqid(rand(), true)), 2, 8);
			$_tmpname = sprintf("%s%s%s.", $lanbilling->systemTemporary(), $lanbilling->MSWin ? "\\\\\\" : '/', $_uname);

			foreach($_list as $item)
			{
				if(file_put_contents($_tmpname . 'in', sprintf("\"%s\"\n", $item), FILE_APPEND) === false) {
					$lanbilling->ErrorHandler(__FILE__, "Cannot write concat files list data to: " . $_tmpname . 'in', __LINE__);
				}
			}

			if($lanbilling->MSWin) {
				system( sprintf("cmd.exe /Q /C \"\"%s\\%s.concat\" \"%s\" \"%s\"\"",
					$lanbilling->inCorePath($lanbilling->Option("templates_dir")), $doctemplate,
					$_tmpname . 'in', $_tmpname . 'out') );
			}
			else {
				system( sprintf("%s/%s.concat \"%s\" \"%s\"",
						$lanbilling->inCorePath($lanbilling->Option("templates_dir")),
						$doctemplate,
						$_tmpname . 'in',
						$_tmpname . 'out'
					)
				);
			}

			@unlink($_tmpname . 'in');
		}
	}

	echo '({ success: true, file: { file: "' . $_uname . '.out", name: "' . $filename . '", ext: "' . $extention . '"} })';
} // end getMultiOrder()


/**
 * Get full file path from
 * @param	object, billing class
 * @param	object, localize class
 */
function getMultiFile( &$lanbilling, &$localize )
{
	if(!preg_match("/^lborders\-.*\.out$/", $_POST['getmultifile'])) {
		getFileError($lanbilling, $localize, 1, sprintf("%s%s%s.", $lanbilling->systemTemporary(), $lanbilling->MSWin ? "\\\\\\" : '/', $_POST['getmultifile']), $_POST['name']);
	}

	if( false == $lanbilling->Download(sprintf("%s%s%s", $lanbilling->systemTemporary(), $lanbilling->MSWin ? "\\\\\\" : '/', $_POST['getmultifile']), $_POST['name'], '', $_POST['ext']) ) {
		getFileError($lanbilling, $localize, 1, sprintf("%s%s%s.", $lanbilling->systemTemporary(), $lanbilling->MSWin ? "\\\\\\" : '/', $_POST['getmultifile']), $_POST['name']);
	}
} // end getMultiFile()


/**
 * Simple function to return payment order number templates
 * @param	object, billing class
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

				if($item['count'] > 1) {
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
					$_format->push($_lb_format[$i], $i, '[A-z0-9\\u0410-\\u044f]');
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

	echo '({ success: true, data: { pordernum: "' . $_lb_format . '", pordertpl: "' . $_format->get() . '" } })';
} // end getOrderTpl()


/**
 * Register payment order as in the bills
 * @param	object, billing class
 */
function MakePayment( &$lanbilling )
{
	if((integer)$_POST['saveorderpaid'] == 0) {
		echo "({ success: false, errors: { reason: 'There was send and empty order id', code: 0 } })";
		return false;
	}

    $result = $lanbilling->get("getCurrencies");
    if(!is_array($result)) {
        $result = array($result);
    }
    array_walk($result, create_function('$item, $key, $_cid', 'if($item->def == 1){ $_cid[0] = $item->id; } '), array( &$_cid ));
	$def_currency = ($_cid >= 0) ? $_cid : 0;


	if( false != ($result = $lanbilling->get("getOrders", array("flt" => array("orderid" => (integer)$_POST['saveorderpaid'])), true)) )
	{
		$struct = array(
			"agrmid" => (integer)$result->agrmid,
			"orderid" => (integer)$result->orderid,
			"amount" => (float)$result->currsumm,
			"receipt" => $_POST['payreceipt'],
			"modperson" => $_SESSION["auth"]["authperson"],
			"recordid" => 0, "status" => 0, "localdate" => '', "canceldate" => '',
			"currid" => $def_currency, "paydate" => '', "comment" => '');
	}

	if ( !empty($_POST['formattedDate'])) $struct['paydate'] = $lanbilling->formatDate($_POST['formattedDate'], 'Y-m-d') . ' ' . date('H:i:s');

	// $lanbilling->ErrorHandler(__FILE__, "MakePayment: Entered [POST FormattedDate]:".$_POST['formattedDate'], __LINE__);
	// $lanbilling->ErrorHandler(__FILE__, "MakePayment: Entered [After Format]:".$lanbilling->formatDate($_POST['formattedDate'], 'Y-m-d') . ' ' . date('H:i:s'), __LINE__);

	if( false == $lanbilling->save("Payment", $struct, true, array("getOrders")) ) {
		if (strstr((string)$lanbilling->soapLastError()->detail, 'Document is not payable'))
			echo "({ success: false, errors: { reason: 'Document is not payable', code: 2 } })";
		else
		    echo "({ success: false, errors: { reason: 'There was an error to make payment. Look server logs for detail', code: 1 } })";
		
	}
	else echo "({ success: true })";
} // end MakePayment


/**
 * Remove document
 * @param	object, billing class
 * @param	object, template class
 */
function RemoveDocument( &$lanbilling, &$tpl = null )
{
	if((integer)$_POST['deldocid'] > 0) {
		if( false == $lanbilling->delete("delOrder", array("id" => $_POST['deldocid']))) {
			echo "({ success: false, errors: { reason: 'There was an error to remove payment order. Look server logs for detail'  } })";
		}
		else echo "({ success: true })";
	}
	else echo "({ success: false, errors: { reason: 'Unknown document id' } })";
} // end RemoveDocument()


/**
 * Send Email task to server on specified documents list
 * @param	object, billing class
 */
function SendByEmail( &$lanbilling )
{
	$_tmp = explode(',', $_POST['sendbyemail']);

	array_walk($_tmp, create_function('$item, $key, $_tmp', '$_tmp[0][$key] = array("val" => $item);'), array( &$_tmp ));

	if( false != $lanbilling->save("sendOrders", array('orders' => $_tmp)) ) {
		echo '({ success: true })';
	}
	else {
		$error = $lanbilling->soapLastError();
		echo '({ success: false, errors: { reason: "' . $error->detail . '" }})';
	}
} // end SendByEmail()

/**
 * Simple function to return payment order number templates
 * @param	object, billing class
 */
function getOrderTemplate( &$lanbilling )
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
