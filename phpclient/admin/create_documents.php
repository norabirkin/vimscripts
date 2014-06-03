<?php
/**
 * Start document generation
 *
 * Repository information:
 * $Date: 2009-12-21 13:18:55 $
 * $Revision: 1.12.2.12 $
 */

// There is background query
if(isset($_POST['async_call']))
{
	if(isset($_POST['generate'])) {
		startGenerate($lanbilling, $localize);
	}
}
// There is standard query
else
{
	define ("CURR_AUTH_MAN", intval($_SESSION['auth']['authperson']));

	$tpl = new HTML_Template_IT(TPLS_PATH);
	$tpl->loadTemplatefile("create_documents.tpl",true,true);
	$lanbilling->parseArrayUnit(date('Y') - 4, date('Y') + 1, "parsePeriodYear", $tpl, array(), array("key" => 0, "value" => "<%@ Year %>"));
	$lanbilling->parseMonths('parsePeriodMonth', $tpl, "Month");
	
	$tpl->setVariable("FULLDATE", date('Ymd', time()));
	$tpl->setVariable("DATEFULLVAL", date('d.m.Y', time()));
	
	$tpl->touchBlock('preCh');
	$tpl->touchBlock('preDsbl');

	if($_SESSION["auth"]["authperson"] == 0) {
		$tpl->touchBlock('ifAdmin');
		$tpl->touchBlock('forAllChk');
	}

	// Show templates list
	showDocumentsList($lanbilling, $tpl);
	// Show user groups list
	showUserGroup($lanbilling, $tpl);
	// Show opearotes list
	showOperators($lanbilling, $tpl);

	showGroupedOrders( $lanbilling, $tpl );

	$localize->compile($tpl->get(), true);
}


function showGroupedOrders( &$lanbilling, &$tpl ){
	if ($lanbilling->Option('use_grouped_orders')){
		$tpl->touchBlock('use_grouped_orders');
		$tpl->setCurrentBlock("use_grouped_orders");
		$tpl->syncBlockLocalize("use_grouped_orders");
		$tpl->parseCurrentBlock();
	}
}

/**
 * Parse draw on year
 * @param	integer, year value
 * @param	string, description
 * @param	object, template class
 */
function parseOnYear( &$val, $key, &$tpl )
{
	$tpl->setCurrentBlock("dateYear");
	$tpl->setVariable("DATEYEARVAL", $key);
	$tpl->setVariable("DATEYEARNAME", $val);
	$tpl->parseCurrentBlock();
} // end parseOnYear()


/**
 * Parse draw on month
 * @param	integer, month value
 * @param	string, description
 * @param	object, template class
 */
function parseOnMonth( &$val, $key, &$tpl )
{
	$tpl->setCurrentBlock("dateMonth");
	$tpl->setVariable("DATEMONTHVAL", $key);
	$tpl->setVariable("DATEMONTHNAME", $val);
	$tpl->parseCurrentBlock();
} // end parseOnMonth()


/**
 * Parse Turn on day
 * @param	integer, day value
 * @param	string, description
 * @param	object, template class
 */
function parseOnDay( &$val, $key, &$tpl )
{
	$tpl->setCurrentBlock("dateDay");
	$tpl->setVariable("DATEDAYVAL", $key);
	$tpl->setVariable("DATEDAYNAME", $val);
	$tpl->parseCurrentBlock();
} // end parseOnDay()


/**
 * Parse draw on period year
 * @param	integer, year value
 * @param	string, description
 * @param	object, template class
 */
function parsePeriodYear( &$val, $key, &$tpl )
{
	$tpl->setCurrentBlock("periodYear");
	$tpl->setVariable("PERIODYEARVAL", $key);
	$tpl->setVariable("PERIODYEARNAME", $val);
	$tpl->parseCurrentBlock();
} // end parsePeriodYear()


/**
 * Parse draw on period month
 * @param	integer, month value
 * @param	string, description
 * @param	object, template class
 */
function parsePeriodMonth( &$val, $key, &$tpl )
{
	$tpl->setCurrentBlock("periodMonth");
	$tpl->setVariable("PERIODMONTHVAL", $key);
	$tpl->setVariable("PERIODMONTHNAME", $val);
	$tpl->parseCurrentBlock();
} // end parsePeriodMonth()


/**
 * Create document list
 * @param	object, billing class
 * @param	object, template class
 */
function showDocumentsList( &$lanbilling, &$tpl )
{
	if( false != ($result = $lanbilling->get("getDocuments", array("flt" => array()))) )
	{
		if(!is_array($result)) {
			$result = array($result);
		}

		$first = null;

		$tpl->setCurrentBlock("templOpt");
		foreach($result as $item)
		{
			if(($item->payable < 1 && $item->payable > 2) || $item->hidden == 1) {
				continue;
			}

			if(is_null($first)) {
				$first = $item;
			}

			$tpl->setVariable("TEMPLID", $item->docid);
			$tpl->setVariable("TEMPLTYPE", $item->payable);
			$tpl->setVariable("TEMPLATENAME", $item->name);
			$tpl->parseCurrentBlock();
		}

		if(!is_null($first)) {
			$tpl->setVariable("TEMPLTYPE", $first->payable);
			if($first->payable != 2) {
				$tpl->touchBlock('prepayCtrl');
			}
		}
	}
} // end showDocumentsList()


/**
 * Build and show user groups list
 * @param	object, billing class
 * @param	object, template class
 */
function showUserGroup( &$lanbilling, &$tpl )
{
	if( false != ($result = $lanbilling->get("getUserGroups", array("flt" => array()))))
	{
		if(!is_array($result)) {
			$result = array($result);
		}

		$tpl->setCurrentBlock("usrGrpOpt");
		foreach($result as $item)
		{
			$tpl->setVariable("USRFRGPID", $item->usergroup->groupid);
			$tpl->setVariable("USRGRPNAME", $item->usergroup->name);
			$tpl->parse("usrGrpOpt");
		}
	}

	if($_SESSION["auth"]["authperson"] == 0) {
		$tpl->touchBlock('UsrGrpDis');
		$tpl->touchBlock('InclUsrGrpDis');
	}
	else $tpl->touchBlock('UsrGrpChk');
} // end  showUserGroup()


/**
 * Build and show operators list
 * @param	object, billing class
 * @param	object, template class
 */
function showOperators( &$lanbilling, &$tpl )
{
	if($lanbilling->useOperators == 1) {
		$tpl->touchBlock("operDef");
	}

	$result = $lanbilling->getOperators();

	if(!empty($result))
	{
		$tpl->setCurrentBlock("operOpt");
		foreach($result as $item)
		{
			$tpl->setVariable("OPERID", $item['uid']);
			$tpl->setVariable("OPERNAME", $item['name']);
			$tpl->parseCurrentBlock();
		}
	}
} // end showOperators()

function enqueueDocumentGeneration($val, $lanbilling, $flt) {
		
	require_once( dirname(__FILE__) . DIRECTORY_SEPARATOR . 'documentsQueueManager.php' );
	$documentsQueue = new documentsGenerationQueueManager(array('lanbilling' => $lanbilling, 'localize' => $lanbilling->localize));
	$documentsQueue->addDocumentGenerationTask(array(
		'val' => (object) $val, 
		'flt' => (object) $flt
	));
	
}


/**
 * Start generate process
 * @param	object, billing class
 */
function startGenerate( &$lanbilling, &$localize )
{
	$struct = array(
		"period" => sprintf("%04d%02d", $_POST['b_year'], $_POST['b_month']),
		"docid" => (integer)$_POST['docid'],
		"num" => (integer)$_POST['startnum'],
		"date" => 0,
		"summ" => 0,
		"grp" => 0,
		"ugrp" => 0,
		"uid" => 0,
		"oper" => (integer)$_POST['operid'],
		"comment" => $_POST['comment']
	);

	$_filter = array();
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

	if ($lanbilling->Option('use_grouped_orders')){
		if ($_POST['groupby'] = 1 && $_POST['groupcntval'] > 0 ){
			$struct['groupcnt'] = (integer)$_POST['groupcntval'];
		}else{
			$struct['groupidx'] = 1;
		}
	}

	$struct['date'] = $_POST['a_fulldate'];
	
	switch((integer)$_POST['docfor'])
	{
		case 1:
		{
			if (isset($_POST['include_group']) && (integer)$_POST['include_group'] == 1){
                $struct['ugrp'] = (integer)$_POST['usergroup']; 
            } else {
                $_filter['notgroups'] = (integer)$_POST['usergroup']; 
            }

			break;
		}

		case 3: $struct['uid'] = (integer)$_POST['userid'];
			if(isset($_POST['agrmid']) && (integer)$_POST['agrmid']) {
				if((integer)$_POST['agrmid'] > 0) {
					$struct['agrmid'] = (integer)$_POST['agrmid'];
				}
			}
			if(empty($struct['uid'])) {
				echo "({ success: false, errors: { reason: 'Unknown user id' } })";
				return false;
			}
		break;
	}

	if((integer)$_POST['doctype'] == 2 || (integer)$_POST['doctype'] == 3) {
		if((integer)$_POST['asrent'] == 0) {
			$struct['summ'] = (float)$_POST['orsum'];
		}
	}
	
	$lb = $lanbilling->cloneMain(array('query_timeout' => 580));
	
	if ($_POST["enqueueMode"]) return enqueueDocumentGeneration($struct, $lanbilling, $_filter);
	else {
		if( false == ($lb->save('genOrders', $struct, false, null, $_filter)) ) {
			$error = $lb->soapLastError();
			if(preg_match('/generation already started/i', $error->detail)) {
				$_by = explode(':', $error->detail);
				echo "({ success: false, errors: { reason: '" . $localize->get('Creating documents already begun') . ": " . $_by[1] . "' } })";
			}
			else {
				echo "({ success: false, errors: { reason: 'There was an error to start generation: ". $error->detail . ". Look server logs for detail' } })";
			}
		}
		else echo "({ success: true })";
	}
} // end sendDataToSocket()
