<?php
/**
 * View / create / edit operators int he billing system
 *
 */

// There is background query
if(isset($_POST['async_call']))
{
	if(isset($_POST['getmodules'])) {
		getModulesList($lanbilling);
	}
	
	if(isset($_POST['getoperstaff'])) {
		getOperatorStaff($lanbilling);
	}
	
	if(isset($_POST['getopertarifs'])) {
		getOperTarifs($lanbilling);
	}
	
	if(isset($_POST['gettarifs'])) {
		getTarifsList($lanbilling);
	}
}
else
{
	$tpl = new HTML_Template_IT(TPLS_PATH);
	$tpl->loadTemplatefile("operators.tpl", true, true);
	$tpl->touchBlock("__global__");
	
	if(isset($_POST['deloper']) && $_POST['deloper'] > 0) {
		deleteOperator($lanbilling);
	}
	
	if(isset($_POST['save'])) {
		if(checkData() == true) saveOperator($lanbilling);
	}
	
	if(!isset($_POST['operator']))
	{
		$tpl->touchBlock("CreateNew");
		showOperators($lanbilling, $tpl);
	}
	else
	{
		$tpl->touchBlock("SaveCurr");
		
		if($_POST['operator'] < 0) setDefaults();
		else
		{
			if(!isset($_POST['opername'])) restoreOperator($lanbilling);
		}
		
		showOperForm($lanbilling, $tpl);
	}
	
	$localize->compile($tpl->get(), true);
}


/**
 * Get operators list and build the table
 * @param	object, billing class
 * @param	object, template class
 */
function showOperators( &$lanbilling, &$tpl )
{
	$tpl->touchBlock("OperList");
	
	if(false == ($result = $lanbilling->get("getOperators")) )
	{
		$tpl->touchBlock("OperListEmpty");
		return false;
	}
	
	$tpl->touchBlock("OperHD");
	
	if(!is_array($result))
		$result = array($result);
	
	foreach($result as $obj)
	{
		$tpl->setCurrentBlock("OperListItem");
		$tpl->setVariable("ONAME", $obj->name);
		$tpl->setVariable("ODIR", $obj->gendir);
		$tpl->setVariable("ODESCR", $obj->descr);
		
		if($obj->operid > 0)
		{
			$tpl->setCurrentBlock("OperListItemDrop");
			$tpl->setVariable("OID", $obj->operid);
			$tpl->parseCurrentBlock();
		}
		else $tpl->touchBlock("OperListNoDrop");
		
		$tpl->setVariable("OID", $obj->operid);
		$tpl->parse("OperListItem");
	}
} // end showOperators()


/**
 * Restore operator data from DB
 * @param	object, billing class
 */
function restoreOperator( &$lanbilling )
{
	$result = $lanbilling->get("getOperator", array("id" => (integer)$_POST['operator']));
	
	$_POST['address1code'] = $result->oper->address1code;
	$_POST['address2code'] = $result->oper->address2code;
	$_POST['opername'] = $result->oper->name;
	$_POST['address1'] = $result->oper->address1;
	$_POST['address2'] = $result->oper->address2;
	$_POST['gendir'] = htmlspecialchars($result->oper->gendir, ENT_QUOTES, 'UTF-8');
	$_POST['buhgname'] = htmlspecialchars($result->oper->buhgname, ENT_QUOTES, 'UTF-8');
	$_POST['descr'] = htmlspecialchars($result->oper->descr, ENT_QUOTES, 'UTF-8');
	$_POST['bank'] =htmlspecialchars($result->oper->bank, ENT_QUOTES, 'UTF-8');
	$_POST['rs'] = $result->oper->rs;
	$_POST['korrs'] = $result->oper->korrs;
	$_POST['bik'] = $result->oper->bik;
	$_POST['inn'] = $result->oper->inn;
	$_POST['kpp'] = $result->oper->kpp;
} // end restoreOperator()


/**
 * Operator data edit
 * @param	object, billing class
 * @param	object, template class
 */
function showOperForm( &$lanbilling, &$tpl )
{
	$tpl->setCurrentBlock("OperForm");
	
	if(defined("DATAERROR"))
	{
		$tpl->SetCurrentBlock("OperFormError");
		$tpl->setVariable("FORMERROR", DATAERROR);
		$tpl->setVariable("FORMERRORDETAIL", ERRORDETAIL);
		$tpl->parseCurrentBlock();
	}
	
	$tpl->setVariable("OPERATOR", $_POST['operator']);
	$tpl->setVariable("ADDRESS1CODE", $_POST['address1code']);
	$tpl->setVariable("ADDRESS2CODE", $_POST['address2code']);
	$tpl->setVariable("OPERNAME", htmlspecialchars($lanbilling->stripMagicQuotes($_POST['opername']), ENT_QUOTES, 'UTF-8'));
	$tpl->setVariable("ADDRESS1_SHT_TEXT", $lanbilling->clearAddress($_POST['address1']));
	$tpl->setVariable("ADDRESS1_FULLTEXT", $_POST['address1']);
	$tpl->setVariable("ADDRESS2_SHT_TEXT", $lanbilling->clearAddress($_POST['address2']));
	$tpl->setVariable("ADDRESS2_FULLTEXT", $_POST['address2']);
	$tpl->setVariable("GENDIR", $_POST['gendir']);
	$tpl->setVariable("BUHGNAME", $_POST['buhgname']);
	$tpl->setVariable("DESCR", $_POST['descr']);
	$tpl->setVariable("BANK", $_POST['bank']);
	$tpl->setVariable("RS", $_POST['rs']);
	$tpl->setVariable("KORRS", $_POST['korrs']);
	$tpl->setVariable("BIK", $_POST['bik']);
	$tpl->setVariable("INN", $_POST['inn']);
	$tpl->setVariable("KPP", $_POST['kpp']);
	$tpl->parseCurrentBlock();
} // end showOperForm()


/**
 * Set default values to the form fields
 *
 */
function setDefaults()
{
	$_POST['address1code'] = '';
	$_POST['address2code'] = '';
	$_POST['opername'] = '';
	$_POST['address1'] = '';
	$_POST['address2'] = '';
	$_POST['gendir'] = '';
	$_POST['buhgname'] = '';
	$_POST['descr'] = '';
	$_POST['bank'] = '';
	$_POST['rs'] = '00000000000000000000';
	$_POST['korrs'] = '00000000000000000000';
	$_POST['bik'] = '000000000';
	$_POST['inn'] = '0000000000';
	$_POST['kpp'] = '000000000';
} // end setDefaults()


/**
 * Check recieved data from client befor save
 * 
 */
function checkData()
{
	if(empty($_POST['opername'])) {
		define("DATAERROR", "Empty field");
		define("ERRORDETAIL", "Organization name");
		return false;
	}
	
	if(empty($_POST['gendir'])) {
		define("DATAERROR", "Empty field");
		define("ERRORDETAIL", "Director");
		return false;
	}
	
	if(empty($_POST['buhgname'])) {
		define("DATAERROR", "Empty field");
		define("ERRORDETAIL", "Chief accountant");
		return false;
	}
	
	return true;
} // end checkData()


/**
 * Save operator data
 * @param	object, billing class
 */
function saveOperator( &$lanbilling )
{
	$struct['oper'] = array("operid" => (integer)$_POST['operator'], "name" => $_POST['opername'], 
		"address1code" => $_POST['address1code'], 
		"address2code" => $_POST['address2code'], 
		"address1" => '', 
		"address2" => "", 
		"gendir" => $_POST['gendir'], "buhgname" => $_POST['buhgname'], 
		"descr" => $_POST['descr'], "bank" => $_POST['bank'], "rs" => $_POST['rs'], 
		"korrs" => $_POST['korrs'], "bik" => $_POST['bik'], "inn" => $_POST['inn'], 
		"kpp" => $_POST['kpp']);
		
	if(isset($_POST['opertrunks'])) {		
		foreach($_POST['opertrunks'] as $arr) {
			$struct['operstaff'][] = array( 
				"recordid" => (integer)$arr['recordid'],
				"id" => (integer)$arr['aid'],
				"operid" => $_POST['operator'],
				"tokentype" => (integer)$arr['tokentype'],
				"trunk" => $arr['trunk']);
		}
	}
	
	if(isset($_POST['opercost'])) {
		foreach($_POST['opercost'] as $arr) {
			if(empty($arr['tarid'])) continue;
			$struct['opertarifs'][] = array(
				"operid" => $_POST['operator'], 
				"id" => $arr['id'],
				"tarid" => $arr['tarid']);
		}
	}
	
	if( false == $lanbilling->save("insupdOperator", $struct, ((integer)$_POST['operator'] < 0) ? true : false, array("getOperator", "getOperators")) )
	{
		define("DATAERROR", "Error");
		define("ERRORDETAIL", "There was an error while sending data to server"); 
	}
	else unset($_POST['operator']);
} // end saveOperator()


/**
 * Remove existing operator
 * @param	object, billing class
 */
function deleteOperator( &$lanbilling )
{
	$lanbilling->delete("delOperator", array("id" => (integer)$_POST['deloper']), "getOperators");
} // end deleteOperator()


/**
 * Get Modules list to set operator sign
 * @param	object, billing class
 */
function getModulesList( &$lanbilling )
{
	$_tmp = array();
	if( false != ($result = $lanbilling->get("getAgentsExt")) )
	{
		if(!is_array($result)) {
			$result = array($result);
		}
		
		array_walk($result, create_function('&$obj, $key, $_tmp','if($obj->agent->type > 6){ $_tmp[0][] = array("id" => $obj->agent->id, "name" => $obj->agent->descr); }'), array(&$_tmp));
	}
	
	if(sizeof($_tmp) > 0)
		echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
	else echo "({ results: '' })";
} // end getModulesList()


/**
 * Get operator prime cost tarifs
 * @param	object, billing class
 */
function getOperTarifs( &$lanbilling )
{
	$_tmp = array();
	if( false != ($result = $lanbilling->get("getAgentsExt")) )
	{
		if(!is_array($result)) {
			$result = array($result);
		}
		
		$_cost = array();
		if( false != ($cost = $lanbilling->get("getOperator", array("id" => (integer)$_POST['getopertarifs'])))) {
			if(!empty($cost->opertarifs)) {
				if(!is_array($cost->opertarifs)) {
					$cost->opertarifs = array($cost->opertarifs);
				}
				
				array_walk($cost->opertarifs, create_function('$obj, $key, $_tmp','$_tmp[0][$obj->id] = $obj->tarid;'), array(&$_cost));
			}
		}
		
		array_walk($result, create_function('&$obj, $key, $_tmp','$_tmp[0][] = array("id" => $obj->agent->id, "type" => $obj->agent->type, "name" => $obj->agent->descr, "tarid" => isset($_tmp[1][$obj->agent->id]) ? $_tmp[1][$obj->agent->id] : 0);'), array(&$_tmp, &$_cost));
	}
	
	if(sizeof($_tmp) > 0)
		echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
	else echo "({ results: '' })";
} // end getModulesList()


/**
 * Get operator staff values
 * @param	object, billing class
 */
function getOperatorStaff( &$lanbilling )
{
	$_tmp = array();
	if( false != ($result = $lanbilling->get("getOperator", array("id" => (integer)$_POST['getoperstaff']))) )
	{
		if(isset($result->operstaff)) {
			if(!is_array($result->operstaff)) {
				$result->operstaff = array($result->operstaff);
			}
			
			array_walk($result->operstaff, create_function('&$obj, $key, $_tmp','$_tmp[0][] = array("recordid" => $obj->recordid, "aid" => $obj->id, "operid" => $obj->operid, "tokentype" => $obj->tokentype, "trunk" => $obj->trunk);'), array(&$_tmp));
		}
	}
	
	if(sizeof($_tmp) > 0)
		echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
	else echo "({ results: '' })";
} // end getOperatorStaff()


/**
 * Get tarifs list form the prime cost grid
 * @param	object, billing class
 */
function getTarifsList( &$lanbilling )
{
	$_tmp = array();
	if( false != ($result = $lanbilling->get("getTarifsExt", array("archive" => 0, "unavail" => -1, "common" => -1))) )
	{
		if(!is_array($result)) {
			$result = array($result);
		}
		
		array_walk($result, create_function('&$obj, $key, $_tmp','$_tmp[0][] = array("id" => $obj->tarif->tarid, "name" => $obj->tarif->descr, "type" => $obj->tarif->type);'), array(&$_tmp));
	}
	
	if(sizeof($_tmp) > 0)
		echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
	else echo "({ results: '' })";
} // end getTarifsList()
?>
