<?php
/**
 * Generate cards for the selected card group
 *
 */

// There is background query
if(isset($_POST['async_call']))
{

}
else 
{
	$tpl = new HTML_Template_IT(TPLS_PATH);
	$tpl->loadTemplatefile("generatecards.tpl", true, true);
	$tpl->touchBlock("__global__");
	
	if(isset($_POST['generate'])) generateCards($lanbilling, $tpl);
	
	if( false != ($result = $lanbilling->get("getCardSets")) )
	{
		if(!is_array($result)) {
			$result = array($result);
		}
	}
	
	if(isset($_POST['cardgrp']))
	{
		$tpl->setVariable("AMOUNT", (integer)$_POST['amount']);
		$tpl->setVariable("SUMM", (float)$_POST['summ']);
		$tpl->setVariable("VALENCY", (integer)$_POST['valency']);
		
		if($_POST['usealpha']) $tpl->touchBlock("useAlpha");
	}
	else
	{
		$tpl->setVariable("AMOUNT", 10);
		$tpl->setVariable("SUMM", 0);
		$tpl->setVariable("VALENCY", 8);
	}
	
	$lanbilling->parseArrayUnit(0, 0, 'showCardGroups', $tpl, $result, array("key" => -1, "value" => "<%@ Undefined %>"));
	$lanbilling->parseArrayUnit(date('Y'), (date('Y') + 5), 'showYears', $tpl, array(), array("key" => 0, "value" => "Year"));
	$lanbilling->parseMonths('showMonths', $tpl, "Month");
	$lanbilling->parseArrayUnit(1, 31, 'showDays', $tpl, array(), array("key" => 0, "value" => "Day"));
	
	$localize->compile($tpl->get(), true);
}


/**
 * Show years options
 * @param	string, key value
 * @param	integer, array key
 * @param	object, template class
 */
function showYears($value, $key, &$tpl)
{
	$tpl->setCurrentBlock("yearOpt");
	if($_POST['year'] == $key) $tpl->touchBlock("yearOptSel");
	$tpl->setVariable("YEARID", $key);
	$tpl->setVariable("YEARNAME", $value);
	$tpl->parseCurrentBlock();
} // end showYears()


/**
 * Show month options
 * @param	string, key value
 * @param	integer, array key
 * @param	object, template class
 */
function showMonths($value, $key, &$tpl)
{
	$tpl->setCurrentBlock("monthOpt");
	if($_POST['month'] == $key) $tpl->touchBlock("monthOptSel");
	$tpl->setVariable("MONTHID", $key);
	$tpl->setVariable("MONTHNAME", $value);
	$tpl->parseCurrentBlock();
} // end showYears()


/**
 * Show day options
 * @param	string, key value
 * @param	integer, array key
 * @param	object, template class
 */
function showDays($value, $key, &$tpl)
{
	$tpl->setCurrentBlock("dayOpt");
	if($_POST['day'] == $key) $tpl->touchBlock("dayOptSel");
	$tpl->setVariable("DAYID", $key);
	$tpl->setVariable("DAYNAME", $value);
	$tpl->parseCurrentBlock();
} // end showDays()


/**
 * Show cards groups
 * @param	string, key value
 * @param	integer, array key
 * @param	object, template class
 */
function showCardGroups($value, $key, &$tpl)
{
	$tpl->setCurrentBlock("CardGrpOtp");
	if(is_object($value) && $value->setid == $_POST['cardgrp'])
	{
		$tpl->touchBlock("CardGrpOtpSel");
		$tpl->setVariable("CURRSYMB", empty($value->currname) ? "<%@ c.u. %>" : $value->currname);
	}
	$tpl->setVariable("CARDGRPID", is_object($value) ? $value->setid : $key);
	$tpl->setVariable("CARDGRPNAME", is_object($value) ? $value->setdescr : $value);
	$tpl->parseCurrentBlock();
} // end showMonths()


/**
 * Send information to start generation
 * @param	object, template class
 * @param	object, template class
 */
function generateCards( &$lanbilling, &$tpl )
{
	$struct = array("amount" => (integer)$_POST['amount'], 
			"person" => $_SESSION['auth']['authperson'], 
			"setid" => (integer)$_POST['cardgrp'],
			"valency" => ((integer)$_POST['valency'] < 4) ? 4 : (((integer)$_POST['valency'] > 32) ? 32 : $_POST['valency']),
			"usealpha" => (integer)$_POST['usealpha'],
			"summ" => (float)$_POST['summ'],
			"acttil" => sprintf("%04d%02d%02d", $_POST['year'], $_POST['month'], $_POST['day']));
	
	if( false == $lanbilling->save("genCards", $struct, false, array("getCardSets", "getPaycards")))
		$tpl->touchBlock("doneWithError");
	else $tpl->touchBlock("doneWithOk");
} // end generateCards()
?>