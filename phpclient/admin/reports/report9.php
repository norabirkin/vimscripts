<?php
/**
 * Show offline users or planed to be off on selected Year Month
 * 
 */

// Errors reporting
ini_set("display_errors", true);
error_reporting(E_ALL^E_NOTICE);

// Make public session if there is MSIE
if(strpos($_SERVER['HTTP_USER_AGENT'], 'MSIE')) {
	session_cache_limiter("public");
}

session_start();
// Check Authorization
if(!isset($_SESSION['auth'])) die("Authorization required!");

// Include more helpful files
require_once('../localize.php');
require_once('../IT.php');

// Check date
intervalsCheck();
// Connect to DB
if( !$descriptor )
{
	if( !isset($serveraddress) || !isset($mysqluser) || !isset($mysqlpassword) || !isset($mysqldatabase))
		include("../confparser.inc");
	
	$descriptor = connect($serveraddress, $mysqluser, $mysqlpassword, $mysqldatabase);
}

// Get billing settings
$settings = load_settings();
// Load template
$tpl = new HTML_Template_IT("../".TPLS_PATH."/reports");
$tpl->loadTemplatefile("report9.tpl", true, true);
$tpl->syncBlockLocalize("__global__");
$tpl->setVariable("ISMONTH",$settings["mon_names"][sprintf("%d",$_POST["month_9"]) - 1]);
$tpl->setVariable("ISYEAR",$_POST["year_9"]);

// Main function
buildOfflineVgroups($tpl, $settings);

// Send header if there was request for the xls file
if($_POST["type_9"]=="exl")
{
	header ("Content-type: application/octet-stream; charset=cp1251");
	header ("Content-Disposition: attachment; filename=" . $_POST["year_9"] . $_POST["month_9"] . ".xls" );
}
$tpl->show();


/**
 * Build main list ofline vgroups
 * @param	object, template class
 * @param	array
 */
function buildOfflineVgroups( &$tpl, &$settings )
{
	if($_SESSION["auth"]["authperson"] > 0)
	{
		$access = implode(",",array_unique(array_merge($_SESSION['permissions']['ro_usergroups'], $_SESSION['permissions']['rw_usergroups'])));
		$access = sprintf(" AND ac.uid IN (%s)", (sizeof($access) > 0) ? $access : "NULL");
	}
	
	if( false == ($sql_query = mysql_query(sprintf("SELECT vg.id, st.descr, vg.vg_id, vg.login, 
					ac.name, 
					GROUP_CONCAT(DISTINCT agrm.number SEPARATOR ', '), 
					DATE_FORMAT(vg.acc_offdate, '%%Y-%%m-%%d %%H:%%i'), vg.acc_on 
					FROM vgroups AS vg 
					INNER JOIN acc_list AS al ON (al.vg_id = vg.vg_id) 
					INNER JOIN accounts AS ac ON (ac.uid = al.uid) 
					LEFT JOIN agreements_list AS agrm ON (agrm.uid=ac.uid) 
					INNER JOIN settings AS st ON (st.id = vg.id) 
					WHERE vg.archive = 0 AND vg.acc_offdate LIKE '%04d-%02d%%' 
					%s 
					GROUP BY vg.id, ac.uid, vg.vg_id ORDER BY vg.id", 
					$_POST["year_9"], $_POST["month_9"], 
					($_SESSION["auth"]["authperson"] > 0) ? $access : ""))) )
	{
		showNoData($tpl, "vgNoData");
		return;
	}
	
	if(mysql_num_rows($sql_query) == 0)
	{
		showNoData($tpl, "vgNoData");
		return;
	}
	
	$data = array();
	while($row = mysql_fetch_row($sql_query))
	{
		if(!isset($data[$row[0]]))
			$data[$row[0]] = array("descr" => $row[1], "data" => array());
		
		$data[$row[0]]["data"][$row[2]] = array("date" => $row[6], 
							"name" => $row[4], 
							"vglogin" => $row[3], 
							"agrm" => $row[5],
							"status" => $row[7]);
	}
	
	foreach($data as $aId => $agentGroup)
	{
		$tpl->setCurrentBlock("agentName");
		$tpl->setVariable("THISAGENT", AGENT . ": " . $aId . ". " . $agentGroup["descr"]);
		$tpl->parseCurrentBlock();
		
		foreach($agentGroup["data"] as $vgId => $acc)
		{
			$tpl->setCurrentBlock("vgListItem");
			$tpl->setVariable("THISDATE", $acc["date"]);
			$tpl->setVariable("THISUSER", $acc["name"]);
			$tpl->setVariable("THISAGRM", $acc["agrm"]);
			$tpl->setVariable("THISAGENTUSER", $acc["vglogin"]);
			
			if($acc["status"] == 1) $tpl->setVariable("THISSTATUS", ACTIVEGROUPS);
			else $tpl->setVariable("THISSTATUS", OFFLINE);
			
			$tpl->parseCurrentBlock();
		}
		$tpl->parse("listBlock");
	}
} // end buildOfflineVgroups()


/**
 * MySQL Connection
 * @param	string DB address
 * @param	string DB user
 * @param	string DB password
 * @param	string DB name
 */
function connect($m_addr, $m_user, $m_pass, $m_db = "")
{
	$descriptor = mysql_connect($m_addr, $m_user, $m_pass, true) or die(mysql_error());
	
	if( !empty($m_db) )
	{
		mysql_select_db($m_db, $descriptor);
	}
	
	return $descriptor;
} // end connect()


/**
 * Check date interval in the post
 *
 */
function intervalsCheck()
{
	// Массив ключей для проверки и установки в значение по-умолчанию
	$_arr = array(
		"year_9" => date("Y"),
		"month_9" => date("m")
	);
	
	foreach( $_arr as $_key => $_val )
	{
		if( !isset($_POST[$_key]) || $_POST[$_key] == "" || $_POST[$_key] <= -1 )
		{
			$_POST[$_key] = $_val;
		}
		
		if( strlen($_POST[$_key]) < 4 )
			$_POST[$_key] = sprintf("%02d", $_POST[$_key]);
	}
} // end intervalsCheck()


/**
 * Return billing settings
 *
 */
function load_settings()
{
	$_arr = array();
	
	// Month's array names
	$_arr["mon_names"] = array(JANUARY, FEBRUARY, MARCH, APRIL, MAY, JUNE, JULY, AUGUST, SEPTEMBER, OCTOBER, NOVEMBER, DECEMBER);
	
	if( false != ($sql_query = mysql_query("SELECT assetshowformat, 
						natcurrencysymbol, 
						bill_multiply, 
						multiply, 
						convergent, 
						use_operators FROM share LIMIT 1")) )
	{
		$row = mysql_fetch_row($sql_query);
		define ("IS_ASSETSHOWFORMAT", $row[0]);
		define ("IS_NATCURRENCYSYMBOL", $row[1]);
		define ("IS_BILL_MULTIPLY", $row[2]);
		define ("IS_CONVERGENT", $row[4]);
	}
	else die( "#1 " . mysql_error );
	
	// Rate curency
	if( false != ($sql_query = mysql_query("SELECT rate, DATE_FORMAT(date, '%Y%m%d') 
						FROM rate 
						WHERE DATE_FORMAT(date,'%Y%m%d') <= DATE_FORMAT(NOW(), '%Y%m%d') 
						ORDER BY date DESC LIMIT 1")))
	{
		$sql_query = mysql_fetch_row($sql_query);
		define ("IS_RATE", $sql_query[0]);
	}
	else define ("IS_RATE", 1);
	
	return $_arr;
} // end load_settings()


/**
 * No data message
 * @param	object template class
 */
function showNoData( &$tpl, $blockName )
{
	$tpl->setCurrentBlock($blockName);
	$tpl->syncBlockLocalize($blockName);
	$tpl->parseCurrentBlock();
} // end showNoData()
?>