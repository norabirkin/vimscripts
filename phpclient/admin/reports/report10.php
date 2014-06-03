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
$tpl->loadTemplatefile("report10.tpl", true, true);
$tpl->syncBlockLocalize("__global__");
$tpl->setVariable("ISMONTH",$settings["mon_names"][sprintf("%02d",$_POST["month_10"]) - 1]);
$tpl->setVariable("ISYEAR",$_POST["year_10"]);
$tpl->setVariable("NOWMONTH",$settings["mon_names"][date('m') - 1]);
$tpl->setVariable("NOWYEAR",date('Y'));

if(!IS_CONVERGENT)
{
	$tpl->setCurrentBlock("noneConvergent");
	$tpl->syncBlockLocalize("noneConvergent");
	$tpl->parseCurrentBlock();
}


// Main function
deptors($tpl, $settings);

// Send header if there was request for the xls file
if($_POST["type_10"]=="exl")
{
	header ("Content-type: application/octet-stream; charset=cp1251");
	header ("Content-Disposition: attachment; filename=" . $_POST["year_10"] . $_POST["month_10"] . ".xls" );
}
$tpl->setVariable("COLSPAN", (IS_CONVERGENT) ? 3 : 4);
$tpl->show();


/**
 * Build and show deptor list for the selected period
 * @param	object, template class
 * @param	array settings
 */
function deptors( &$tpl, &$settings )
{
	if($_SESSION["auth"]["authperson"] > 0)
	{
		if(IS_CONVERGENT)
		{
			$access = implode(",",array_unique(array_merge($_SESSION['permissions']['ro_usergroups'], $_SESSION['permissions']['rw_usergroups'])));
			$access = sprintf("AND uid IN (%s)", (sizeof($access) > 0) ? $access : "NULL");
		}
		else
		{
			$access = implode(",",array_unique(array_merge($_SESSION['permissions']['ro_groups'], $_SESSION['permissions']['rw_groups'])));
			$access = sprintf("AND vg_id IN (%s)", (sizeof($access) > 0) ? $access : "NULL");
		}
	}
	
	// Get all who minor
	if( false == ($sql_query = mysql_query(sprintf("SELECT %s, sum(balance) FROM balances WHERE date >= %04d%02d01  
					%s
					GROUP BY %s", 
					(IS_CONVERGENT) ? "uid" : "vg_id", 
					$_POST['year_10'], $_POST['month_10'], 
					($_SESSION["auth"]["authperson"] > 0) ? $access : "",
					(IS_CONVERGENT) ? "uid" : "vg_id"))) )
	{
		showNoData($tpl, "vgNoData");
		return false;
	}
	
	if(mysql_num_rows($sql_query) == 0)
	{
		showNoData($tpl, "vgNoData");
		return false;
	}
	
	$data = array();
	while($row = mysql_fetch_row($sql_query))
	{
		if($row[1] < 0 && !empty($row[0])) $data[$row[0]] = $row[0];
	}
	
	// Get all who didn't sent any pay
	if( false == ($sql_query = mysql_query(sprintf("SELECT vg_id, sum FROM bills WHERE pay_date >= %04d%02d01000000 AND vg_id IN(%s)", 
				$_POST['year_10'], $_POST['month_10'],
				(sizeof($data) > 0) ? implode(",", $data) : "NULL"))) )
	{
		showNoData($tpl, "vgNoData");
		return false;
	}
	
	while($row = mysql_fetch_row($sql_query))
	{
		if(isset($data[$row[0]]) && $row[1] > 0) unset($data[$row[0]]);
	}
	
	// There is no deptors
	if(sizeof($data) == 0)
	{
		showNoData($tpl, "vgNoData");
		return false;
	}
	
	// Initialize deptors array as persons
	if( false == ($sql_query = mysql_query(sprintf("SELECT ac.name, 
					GROUP_CONCAT(DISTINCT agrm.number SEPARATOR ', '), 
					ac.balance, vg.login, 
					vg.balance
					FROM acc_list AS ls 
					INNER JOIN vgroups AS vg ON (ls.vg_id = vg.vg_id) 
					INNER JOIN accounts AS ac ON (ac.uid = ls.uid) 
					LEFT JOIN agreements_list AS agrm ON (agrm.uid=ac.uid) 
					WHERE vg.archive = 0 AND %s IN (%s) GROUP BY %s ORDER BY %s, ac.uid", 
					(IS_CONVERGENT) ? "ac.uid" : "vg.vg_id", 
					(sizeof($data) > 0) ? implode(",", $data) : "NULL", 
					(IS_CONVERGENT) ? "ac.uid" : "vg.vg_id, ac.uid", 
					(IS_CONVERGENT) ? "ac.balance" : "vg.balance"))) )
	{
		showNoData($tpl, "vgNoData");
		return false;
	}
	
	if(mysql_num_rows($sql_query) == 0)
	{
		showNoData($tpl, "vgNoData");
		return false;
	}
	
	$total = 0;
	while($row = mysql_fetch_row($sql_query))
	{
		$tpl->setVariable("THISUSER", $row[0]);
		$tpl->setVariable("THISAGRM", $row[1]);
		
		if(!IS_CONVERGENT)
		{
			$tpl->setCurrentBlock("noneConvergentItem");
			$tpl->setVariable("THISAGENTUSER", $row[3]);
			$tpl->parseCurrentBlock();
		}
		
		if(IS_CONVERGENT)
		{
			$tpl->setVariable("THISBALANCE", number_format(sprintf("%.2f", ($row[2] / IS_BILL_MULTIPLY) * IS_RATE), 2, ",", " "));
			$total+=$row[2];
		}
		else
		{
			$tpl->setVariable("THISBALANCE", number_format(sprintf("%.2f", ($row[4] / IS_BILL_MULTIPLY) * IS_RATE), 2, ",", " "));
			$total+=$row[4];
		}
		
		$tpl->parse("vgListItem");
	}
	
	$tpl->setCurrentBlock("totalLine");
	$tpl->syncBlockLOcalize("totalLine");
	$tpl->setVariable("TOTALSUM", number_format(sprintf("%.2f", ($total / IS_BILL_MULTIPLY) * IS_RATE), 2, ",", " "));
	$tpl->setVariable("COLSPAN", (IS_CONVERGENT) ? 2 : 3);
	$tpl->parseCurrentBlock();
} // end deptors()


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
		"year_10" => date("Y"),
		"month_10" => date("m")
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
	$tpl->setVariable("COLSPAN", (IS_CONVERGENT) ? 3 : 4);
	$tpl->parseCurrentBlock();
} // end showNoData()
?>