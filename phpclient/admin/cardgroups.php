<?php
/**
 * To manupulate card groups and there settings
 *
 */


// There is background query
if(isset($_POST['async_call']))
{
	if(isset($_POST['getcardsets']))
		getCardSets($lanbilling);
}
// There is standart query
else
{
	$tpl = new HTML_Template_IT(TPLS_PATH);
	$tpl->loadTemplatefile("cardgroups.tpl", true, true);
	
	if(isset($_POST['cardgrpdel'])) deleteCardset($lanbilling);
	if(isset($_POST['savecardset'])) saveCardset($lanbilling);
	
	if(isset($_POST['cardgrp']))
	{
		cardGroupForm($lanbilling, $tpl);
	}
	else showCardGrpList($lanbilling, $tpl);
	
	$localize->compile($tpl->get(), true);
}


/**
 * Show cards groups list
 * @param	object, billing class
 * @param	object, template class
 */
function showCardGrpList( &$lanbilling, &$tpl )
{
	$tpl->touchBlock("cardGrpList");
	
	if(defined("SAVEERROR")) $tpl->touchBlock("doneWithErrorList");
	
	if( false != ($result = $lanbilling->get("getCardSets")) )
	{
		if(!is_array($result)) {
			$result = array($result);
		}
		
		$lanbilling->parseArrayUnit(0, 0, 'printCardsGrpItem', $tpl, $result);
	}
	else $tpl->touchBlock("cardGrpEmpty");
} // end showCardGrpList()


/**
 * Print cards groups item
 * @param	string, key value
 * @param	integer, array key
 * @param	object, template class
 */
function printCardsGrpItem($value, $key, &$tpl)
{
	$tpl->setCurrentBlock("cardsGrpItem");
	if($value->cardscnt == 0) {
		$tpl->setCurrentBlock("cardGrpDrop");
		$tpl->setvariable("CARDGRPID", $value->setid);
		$tpl->parseCurrentBlock();
	}
	else $tpl->touchBlock("cardGrpDropNo");
	
	$tpl->setVariable("CARDGRPID", $value->setid);
	$tpl->setVariable("CARDGRPDESCR", $value->setdescr);
	$tpl->setVariable("CARDGRPAUTHOR", $value->createdbyname);
	$tpl->setVariable("CARDGRPCUR", $value->currname);
	$tpl->setVariable("CARDGRPUSER", $value->accname);
	$tpl->setVariable("CARDSCNT", $value->cardscnt);
	$tpl->parse("cardsGrpItem");
} // end 


/**
 * Create / Edit Card group
 * @param	object, billing class
 * @param	object, template class
 */
function cardGroupForm( &$lanbilling, &$tpl )
{
	$tpl->touchBlock("cardGrpForm");
	
	if(defined("SAVEERROR")) $tpl->touchBlock("doneWithError");
	
	$tpl->setVariable("CARDSETID", $_POST['cardgrp']);
	
	if(!isset($_POST['setdescr']) && (integer)$_POST['cardgrp'] > 0) {
		if( false != ($result = $lanbilling->get("getCardSet", array("id" => (integer)$_POST['cardgrp']))))
		{
			$_POST['setdescr'] = $result->cardset->setdescr;
			$_POST['ttl'] = convertExpiredSeconds($result->cardset->expireperiod);
			$_POST['currency'] = $result->cardset->curid;
			$_POST['acctpl'] = $result->cardset->acctpl;
			
			if(!empty($result->list))
			{
				if(!is_array($result->list)) {
					$result->list = array($result->list);
				}
				
				// Temporary function to build post array while initializing cardset
				function pushToPost($value, $key)
				{
					$_POST['cardset'][$value->vgtplid]['vg_tpl'] = $value->vgtpl;
					$_POST['cardset'][$value->vgtplid]['common'] = $value->common;
				}
				
				// Walk array
				$lanbilling->parseArrayUnit(0, 0, 'pushToPost', null, $result->list);
			}
		}
	}
	
	// Add module properties
	if(isset($_POST['addmodule']) && $_POST['addmodule'] > 0) {
		if(!isset($_POST['cardset'])) {
			$_POST['cardset'] = array($_POST['addmodule'] => array('common' => 0, 'vg_tpl' => 0));
		}
		else {
			if(!isset($_POST['cardset'][$_POST['addmodule']])) {
				$_POST['cardset'][$_POST['addmodule']] = array('common' => 0, 'vg_tpl' => 0);
			}
		}
	}
	
	// Remove module properties
	if(isset($_POST['delmodule']) && $_POST['delmodule'] > 0 && isset($_POST['cardset'][$_POST['delmodule']])) {
		unset($_POST['cardset'][$_POST['delmodule']]);
	}
	
	if(!empty($_POST['ttl']))
	{
		$tpl->touchBlock("useTtl");
		$tpl->setVariable("TTL", (integer)$_POST['ttl']);
	}
	else
	{
		$tpl->touchBlock("ttlFld");
		$tpl->touchBlock("ttlUFld");
	}
	
	// Get currencies list and parse it to DOM
	if( false != ($currency = $lanbilling->get("getCurrencies")) )
	{
		if(!is_array($currency)) {
			$currency = array($currency);
		}
		
		foreach($currency as $item)
		{
			if($item->id == 0) {
				continue;
			}
			
			$tpl->setCurrentBlock("CurrOpt");
			if((integer)$_POST['currency'] > 0 ) {
				if($item->id == $_POST['currency']) {
					$tpl->touchBlock("currOptSel");
					$_POST['currency'] = $item->id;
				}
			}
			else {
				if($item->def == 1) {
					$_POST['currency'] = $item->id;
					$tpl->touchBlock("currOptSel");
				}
			}
			
			$tpl->setVariable("CURRID", $item->id);
			$tpl->setVariable("CURRNAME", $item->name . " (" . $item->symbol . ")");
			$tpl->parseCurrentBlock();
		}
		
		$tpl->setVariable("CURID", $_POST['currency']);
	}
	
	// Get users templates list and parse is to DOM
	$usfilter = $lanbilling->soapFilter(array("istemplate" => 1));
	if( false != ($acclist = $lanbilling->get("getAccounts", array("flt" => $usfilter, "md5" => $lanbilling->controlSum($usfilter)))) )
	{
		if(!is_array($acclist)) {
			$acclist = array($acclist);
		}
		
		$lanbilling->parseArrayUnit(0, 0, 'showUserUnits', $tpl, $acclist);
	}
	
	// Get tarifs list according to the selected currency
	$_tallowed = array();
	if( false != ($tarifs = $lanbilling->get("getTarifsExt", array("archive" => 0, "unavail" => 0, "common" => -1))) ) {
		if(!is_array($tarifs)) {
			$tarifs = array($tarifs);
		}
		
		foreach($tarifs as $item) {
			if($item->tarif->curid == $_POST['currency']) {
				$_tallowed[$item->tarif->tarid] = $item->tarif->curid;
			}
		}
	}
	
	// Get accounts templates list
	$vgfilter = $lanbilling->soapFilter(array("istemplate" => 1));
	if( false != ($vglist = $lanbilling->get("getVgroups", array("flt" => $vgfilter, "md5" => $lanbilling->controlSum($vgfilter)))) )
	{
		if(!is_array($vglist)) {
			$vglist = array($vglist);
		}
	}
	
	$lanbilling->parseArrayUnit(0, 0, 'showTTLUnits', $tpl, array(1 => "Seconds", 2 => "Minutes", 3 => "Hours", 4 => "Days"));
	$tpl->setVariable("SETDESCR", $_POST['setdescr']);
	
	$tpl->setCurrentBlock("ModuleOpt");
	$tpl->setVariable("FREEMODULEID", 0);
	$tpl->setVariable("FREEMODULEDESCR", "<%@ Agents %>");
	$tpl->parseCurrentBlock();
	
	if( false != ($modules = $lanbilling->get("getAgentsExt")) )
	{
		if(!is_array($modules)) {
			$modules = array($modules);
		}
		
		foreach($modules as $obj)
		{
			$tpl->setCurrentBlock("ModuleOpt");
			$tpl->setVariable("FREEMODULEID", $obj->agent->id);
			$tpl->setVariable("FREEMODULEDESCR", $obj->agent->descr);
			$tpl->parseCurrentBlock();
			
			$ModList[$obj->agent->id] = $obj->agent->descr;
		}
	}
	
	if(isset($_POST['cardset']) && sizeof($_POST['cardset']) > 0)
	{
		// Disable currency selector
		$tpl->touchBlock('currDis');
		
		foreach($_POST['cardset'] as $key => $data)
		{
			if($data['common'] == 1) $tpl->touchBlock("commCheck");
			
			$_POST['currModule'] = $key;
			$lanbilling->parseArrayUnit(0, 0, 'showVgUnits', array( &$tpl, &$_tallowed ), $vglist, array("key" => -1, "value" => "<%@ Undefined %>"));
			
			$tpl->setVariable("MODULEDESCR", $ModList[$key]);
			$tpl->setVariable("MODULEID", $key);
			$tpl->parse("CardGrpItem");
		}
	}
	else $tpl->touchBlock("cardGrpItemEmpty");
} // end cardGroupForm()


/**
 * Show month options
 * @param	string, key value
 * @param	integer, array key
 * @param	object, template class
 */
function showTTLUnits($value, $key, &$tpl)
{
	$tpl->setCurrentBlock("ttlOpt");
	if(isset($_POST['ttl_unit'])) {
		if($key == $_POST['ttl_unit']) $tpl->touchBlock("ttlOptSel");
	}
	else {
		if($key == 4) $tpl->touchBlock("ttlOptSel");
	}
	$tpl->setVariable("TTLID", $key);
	$tpl->setVariable("TTLNAME", $value);
	$tpl->parseCurrentBlock();
} // end showMonths()


/**
 * Show user template options
 * @param	string, key value
 * @param	integer, array key
 * @param	object, template class
 */
function showUserUnits($value, $key, &$tpl)
{
	$tpl->setCurrentBlock("AccTpl");
	if(isset($_POST['acctpl'])) {
		if($value->account->uid == $_POST['acctpl']) $tpl->touchBlock("AccTplSel");
	}
	$tpl->setVariable("ACCID", $value->account->uid);
	$tpl->setVariable("ACCNAME", empty($value->account->name) ? $value->account->descr : $value->account->name);
	$tpl->parseCurrentBlock();
} // end showUserUnits()


/**
 * Parse accounts template for each module
 * @param	string, key value
 * @param	integer, array key
 * @param	object, template class
 */
function showVgUnits($value, $key, $params)
{
	if(is_object($value) && $_POST['currModule'] != $value->id) return true;
	if($key > -1 && !isset($params[1][$value->tarid])) return true;
	$params[0]->setCurrentBlock("cardVgTpl");
	if(is_object($value) && $_POST['cardset'][$value->id]['vg_tpl'] == $value->vgid) $params[0]->touchBlock("cardVgTplSel");
	$params[0]->setVariable("VGID", is_object($value) ? $value->vgid : $key);
	$params[0]->setVariable("VGNAME", is_object($value) ? $value->descr : $value);
	$params[0]->parseCurrentBlock();
} // end showVgUnits()


/**
 * Save configured data of the cardset to DB
 * @param	object, lanbilling class
 */
function saveCardset( &$lanbilling )
{
	$struct = array("cardset" => array( 
			"setid" => (integer)$_POST['cardgrp'], "createdby" => (integer)$_SESSION['auth']['authperson'],
			"curid" => (integer)$_POST['currency'], "acctpl" => (integer)$_POST['acctpl'],
			"expireperiod" => converTimeUnit((integer)$_POST['ttl'], $_POST['ttl_unit'], true),
			"cardscnt" => 0, "setdescr" => $_POST['setdescr'], "createdbyname" => '', "currname" => '',
			"accname" => ''), "list" => array());
	
	if(isset($_POST['cardset']) && sizeof($_POST['cardset']) > 0)
	{
		foreach($_POST['cardset'] as $key => $value)
		{
			$struct['list'][] = array( "setid" => (integer)$_POST['cardgrp'], 
					"vgtpl" => ((integer)$_POST['cardset'][$key]['vg_tpl'] < 0) ? 0 : (integer)$_POST['cardset'][$key]['vg_tpl'],
					"common" => (integer)$_POST['cardset'][$key]['common'],
					"vgtplid" => 0, "vglogin" => '');
		}
	}
	else unset($struct['list']);
	
	if( false == ($lanbilling->save("insupdCardSet", $struct, ((integer)$_POST['cardgrp'] == 0) ? true : false, array("getCardSet", "getCardSets", "getPaycards"))) )
	{
		define("SAVEERROR", true);
	}
	else unset($_POST['cardgrp']);
} // end saveCardset()


/**
 * Delete cardset from DB
 * @param	object, lanbilling class
 */
function deleteCardset( &$lanbilling )
{
	if((integer)$_POST['cardgrpdel'] > 0)
	{
		if( false == ($lanbilling->delete("delCardSet", array("id" => (integer)$_POST['cardgrpdel']), array("getCardSet", "getCardSets"))) )
		{
			define("SAVEERROR", true);
		}
	}
} // end deleteCardset()


/**
 * Convert unit to seconds
 * @param	integer, value to convert
 * @param	integer, unit type: 1 => Seconds, 2 => Minutes, 3 => Hours, 4 => Days
 */
function converTimeUnit( $value = 0, $unit = 1 )
{
	switch((integer)$unit)
	{
		case 4: return ($value * 86400);
		case 3: return ($value * 3600);
		case 2: return ($value * 60);
		default: return $value;
	}
} // end converTimeUnit()


/**
 * Convert expired value to simple value
 * @param	integer, value to convert
 */
function convertExpiredSeconds( $value )
{
	if((integer)$value == 0) return $value;
	
        if((integer)$value < 60) {
		$_POST['ttl_unit'] = 1;
		return $value;
	}
	
        if((integer)$value > 60)
        {
                $iter = 1;
                while($value > 60 && $iter < 4)
                {
                        $value = (integer)($value / (($iter < 3) ? 60 : 24));
                        $iter++;
                }
                
                $_POST['ttl_unit'] = $iter;
                return $value;
        }
} // end ConvertExpiredSeconds()


/**
 * Get card groups list and return them in JSON format
 * @param	object, lanbilling class
 */
function getCardSets( &$lanbilling )
{
	if( false != ($result = $lanbilling->get("getCardSets")) )
	{
		if(!is_array($result)) {
			$result = array($result);
		}
		
		$_tmp = array();
		foreach($result as $obj)
		{
			$_tmp[] = array("setid" => $obj->setid, "createdby" => $obj->createdby,
				"curid" => $obj->curid, "acctpl" => $obj->acctpl, "expireperiod" => $obj->expireperiod,
				"cardscnt" => $obj->cardscnt, "setdescr" => $obj->setdescr, "createdbyname" => $obj->createdbyname,
				"currname" => $obj->currname, "accname" => $obj->accname);
		}
		
		if(sizeof($_tmp) > 0)
			echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
		else echo "({ results: '' })";
	}
	else echo "({ results: '' })";
} // end getCardSets()
?>
