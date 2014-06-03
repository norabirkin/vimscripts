<?php
/**
 * Report for the changes of the tarifs during month
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
$tpl->loadTemplatefile("report8.tpl", true, true);
$tpl->syncBlockLocalize("__global__");

buildOnlyVgroups($tpl, $settings);

// Send header if there was request for the xls file
if($_POST["type_8"]=="exl")
{
	header ("Content-type: application/octet-stream; charset=cp1251");
	header ("Content-Disposition: attachment; filename=" . $_POST["year_8"] . $_POST["month_8"] . ".xls" );
}
$tpl->show();


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
		"year_8" => date("Y"),
		"month_8" => date("m")
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
 * Build list on only for the vgid's, ingnore groups and agent changes
 * @param	object template
 */
function buildOnlyVgroups( &$tpl, &$settings )
{
	$tpl->setCurrentBlock("vgTable");
	$tpl->setVariable("ISMONTH",$settings["mon_names"][sprintf("%d",$_POST["month_8"]) - 1]);
	$tpl->setVariable("ISYEAR",$_POST["year_8"]);
	$tpl->syncBlockLocalize("vgTable");
	
	if($_SESSION["auth"]["authperson"] > 0)
	{
		$access = implode(",",array_unique(array_merge($_SESSION['permissions']['ro_groups'], $_SESSION['permissions']['rw_groups'])));
		$access = sprintf(" AND rasp.vg_id IN (%s)", (sizeof($access) > 0) ? $access : "NULL");
	}
	
	if( false == ($sql_query = mysql_query(sprintf("SELECT rasp.vg_id, vg.login, 
					DATE_FORMAT(rasp.time, '%%Y-%%m-%%d %%H:%%i'), 
					tarnew.descr, rasp.request_by, tarold.descr, acc.name 
					FROM tarifs_rasp AS rasp
					LEFT JOIN vgroups AS vg ON (rasp.vg_id = vg.vg_id) 
					LEFT JOIN tarifs AS tarnew ON (rasp.tariff_id = tarnew.tar_id) 
					LEFT JOIN accounts AS acc ON (acc.uid = rasp.request_by) 
					LEFT JOIN tarifs AS tarold ON (rasp.old_tariff_id = tarold.tar_id) 
					WHERE rasp.time LIKE '%04d-%02d%%' AND rasp.id = 0 AND rasp.group_id = 0 
					AND rasp.vg_id > 0 AND rasp.changed > 0 
					%s 
					GROUP BY rasp.record_id ORDER BY rasp.time", 
					$_POST["year_8"], $_POST["month_8"], 
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
	
	$_vgids = array();
	while($row = mysql_fetch_row($sql_query))
		$_vgids[$row[0]] = $row[0];
	
	mysql_data_seek($sql_query, 0);
	// Get user list using vgid's list
	if( false != ($sql_users = mysql_query(sprintf("SELECT acc.name, list.vg_id FROM accounts AS acc 
					INNER JOIN acc_list AS list ON (list.uid = acc.uid) 
					WHERE list.vg_id IN (%s)", (sizeof($_vgids) > 0) ? implode(",", $_vgids): "NULL"))) )
	{
		while($Urow = mysql_fetch_row($sql_users))
			$_vgids[$Urow[1]] = $Urow[0];
	}
	
	while($row = mysql_fetch_row($sql_query))
	{
		$tpl->setCurrentBlock("vgListItem");
		$tpl->setVariable("THISDATE", $row[2]);
		$tpl->setVariable("THISUSER", $_vgids[$row[0]]);
		$tpl->setVariable("THISAGENTUSER", $row[1]);
		$tpl->setVariable("THISTARPLAN", $row[3]);
		$tpl->setVariable("THISOLDTARIF", $row[5]);
		
		if($row[4] > 0) $tpl->setVariable("THISTHISMADEBY", $row[6]);
		else $tpl->setVariable("THISTHISMADEBY", MANAGER_SINGLE);
		
		$tpl->parseCurrentBlock();
	}
	
	$tpl->parse("vgTable");
} // end buildOnlyVgroups()


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