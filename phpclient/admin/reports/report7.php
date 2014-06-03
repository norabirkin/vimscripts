<?php
/**
 * Отчет по абонентским обещаным платежам за месяц
 * 
 */

// Параметры отоборажения ошибок
ini_set("display_errors", true);
error_reporting(E_ALL^E_NOTICE);

// Передача параметров сессии
if(strpos($_SERVER['HTTP_USER_AGENT'], 'MSIE')) {
	session_cache_limiter("public");
}

session_start();
// Проверка авторизации
if(!isset($_SESSION['auth'])) die("Authorization required!");

// Загрузка дополнительных модулей
require_once('../localize.php');
require_once('../IT.php');

// Проверка и форматирование интевала
intervalsCheck();

// Подключение к БД
if( !$descriptor )
{
	if( !isset($serveraddress) || !isset($mysqluser) || !isset($mysqlpassword) || !isset($mysqldatabase))
		include("../confparser.inc");
	
	$descriptor = connect($serveraddress, $mysqluser, $mysqlpassword, $mysqldatabase);
}

// Настройки АСР и массив агентов
$settings = load_settings();

$tpl = new HTML_Template_IT("../".TPLS_PATH."/reports");
$tpl->loadTemplatefile("report7.tpl", true, true);
$tpl->syncBlockLocalize("__global__");
$tpl->setVariable("ISMONTH",$settings["mon_names"][sprintf("%d",$_POST["month_7"]) - 1]);
$tpl->setVariable("ISYEAR",$_POST["year_7"]);

if(IS_CONVERGENT) convergentList($tpl);
else noneConvergentList($tpl);

// Отправка заголовка на выгрузку в excel
if($_POST["type_7"]=="exl")
{
	header ("Content-type: application/octet-stream; charset=cp1251");
	header ("Content-Disposition: attachment; filename=" . $_POST["year_7"] . $_POST["month_7"] . ".xls" );
}
$tpl->show();


/**
 * Подключение К MySQL
 *
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
 * Проверка временных интервалов
 *
 */
function intervalsCheck()
{
	// Массив ключей для проверки и установки в значение по-умолчанию
	$_arr = array(
		"year_7" => date("Y"),
		"month_7" => date("m")
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
 * Настройки АСР
 *
 */
function load_settings()
{
	$_arr = array();
	
	// Названия месяцев
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
	
	// Агенты телефонии
	if( false != ($sql_query = mysql_query("SELECT id, descr, na_ip, na_db, na_username, na_pass FROM settings")) )
	{
		while($row = mysql_fetch_assoc($sql_query))
		{
			$_arr["ag"][] = $row;
			$_arr["ag_id"][] = $row["id"];
		}
	}
	else die( "#2 " . mysql_error() );
	
	// Курс валюты
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
 * Отображение информации в отчете для конвергентного режима
 *
 */
function convergentList( &$tpl )
{

	if( false == ($sql_query = mysql_query(sprintf("SELECT a.name, pp.amount, pp.prom_date, pp.prom_till, pp.debt 
						FROM promise_payments AS pp 
						LEFT JOIN accounts AS a ON (a.uid = pp.uid) 
						WHERE pp.prom_date >= '%04d-%02d-01 00:00:00' 
						AND pp.prom_date <= '%04d-%02d-31 00:00:00' 
						%s 
						GROUP BY pp.record_id 
						ORDER BY pp.prom_date", 
						$_POST["year_7"], $_POST["month_7"], 
						$_POST["year_7"], $_POST["month_7"], 
						($_SESSION["auth"]["authperson"] > 0) ? sprintf("AND a.uid IN (%s)", implode(",",array_unique(array_merge($_SESSION['permissions']['ro_usergroups'],$_SESSION['permissions']['rw_usergroups'])))) : ""))) )
	{
		showNoData($tpl);
		return;
	}
	
	if(mysql_num_rows($sql_query) == 0)
	{
		showNoData($tpl);
		return;
	}
	
	$tpl->setCurrentBlock("for_convergent");
	$tpl->syncBlockLocalize("for_convergent");
	
	// Сумма обещаных
	$_psum = 0;
	// Сумма не погашенных
	$_psum_rest = 0;
	
	while($row = mysql_fetch_row($sql_query))
	{
		$_psum += $row[1];
		$_psum_rest += (($row[4] > 0) ? $row[4] : 0) ;
		
		$tpl->setCurrentBlock("for_convergent_item");
		$tpl->setVariable("IS_USERNAME", $row[0]);
		$tpl->setVariable("IS_PAYMENTSUM", number_format(sprintf("%.2f", ($row[1] / IS_BILL_MULTIPLY) * IS_RATE), 2, ",", " "));
		$tpl->setVariable("IS_PAYMENTDATE", $row[2]);
		$tpl->setVariable("IS_PROMISEDTRUETILL", $row[3]);
		
		if($row[4] > 0)
		{
			$tpl->touchBlock("rest_num");
			$tpl->setVariable("IS_REST", number_format(sprintf("%.2f", ($row[4] / IS_BILL_MULTIPLY) * IS_RATE), 2, ",", " "));
		}
		else
		{
			$tpl->touchBlock("rest_free");
			$tpl->setVariable("IS_REST", PROMISEDPAYED);
		}
		$tpl->parseCurrentBlock();
	}
	
	if(mysql_num_rows($sql_query) > 0)
	{
		$tpl->setCurrentBlock("for_convergent_sum");
		$tpl->syncBlockLocalize("for_convergent_sum");
		$tpl->setVariable("IS_TOTALSUM", number_format(sprintf("%.2f", ($_psum / IS_BILL_MULTIPLY) * IS_RATE), 2, ",", " "));
		$tpl->setVariable("IS_TOTALREST", number_format(sprintf("%.2f", ($_psum_rest / IS_BILL_MULTIPLY) * IS_RATE), 2, ",", " "));
		$tpl->parseCurrentBlock();
	}
	
	$tpl->parse("for_convergent");
} // end 


/**
 * Отображение информации в отчете для конвергентного режима
 *
 */
function noneConvergentList( &$tpl )
{
	if( false == ($sql_query = mysql_query(sprintf("SELECT a.uid, a.name, v.login, pp.amount, pp.prom_date, pp.prom_till, pp.debt 
						FROM promise_payments AS pp 
						LEFT JOIN accounts AS a ON (a.uid = pp.uid) 
						LEFT JOIN vgroups AS v ON (v.vg_id = pp.vg_id) 
						WHERE pp.prom_date >= '%04d-%02d-01 00:00:00' 
						AND pp.prom_date <= '%04d-%02d-31 00:00:00' 
						AND pp.vg_id > 0 
						%s 
						GROUP BY pp.record_id 
						ORDER BY pp.prom_date", 
						$_POST["year_7"], $_POST["month_7"], 
						$_POST["year_7"], $_POST["month_7"], 
						($_SESSION["auth"]["authperson"] > 0) ? sprintf("AND a.uid IN (%s)", implode(",",array_unique(array_merge($_SESSION['permissions']['ro_usergroups'],$_SESSION['permissions']['rw_usergroups'])))) : ""))) )
	{
		showNoData($tpl);
		return;
	}
	
	if(mysql_num_rows($sql_query) == 0)
	{
		showNoData($tpl);
		return;
	}
	
	$_list = array();
	while($row = mysql_fetch_row($sql_query))
	{
		$_list[$row[0]][] = $row;
	}
	
	$tpl->setCurrentBlock("for_Nconvergent");
	$tpl->syncBlockLocalize("for_Nconvergent");
	
	// Сумма обещаных
	$_psum = 0;
	// Сумма не погашенных
	$_psum_rest = 0;
	
	foreach($_list as $_row)
	{
		foreach($_row as $_key => $_item)
		{
			$_psum += $_item[3];
			$_psum_rest += (($_item[6] > 0) ? $_item[6] : 0) ;
			
			$tpl->setCurrentBlock("for_Nconvergent_item");
			
			if($_key == 0)
			{
				$tpl->setCurrentBlock("rowspan");
				$tpl->setVariable("ROWSPAN", sizeof($_row));
				$tpl->setVariable("IS_USERNAME", $_item[1]);
				$tpl->parseCurrentBlock();
			}
			
			$tpl->setVariable("IS_VGNAME", $_item[2]);
			$tpl->setVariable("IS_PAYMENTSUM", number_format(sprintf("%.2f", ($_item[3] / IS_BILL_MULTIPLY) * IS_RATE), 2, ",", " "));
			$tpl->setVariable("IS_PAYMENTDATE", $_item[4]);
			$tpl->setVariable("IS_PROMISEDTRUETILL", $_item[5]);
	
			if($_item[6] > 0)
			{
				$tpl->touchBlock("Nrest_num");
				$tpl->setVariable("IS_REST", number_format(sprintf("%.2f", ($_item[6] / IS_BILL_MULTIPLY) * IS_RATE), 2, ",", " "));
			}
			else
			{
				$tpl->touchBlock("Nrest_free");
				$tpl->setVariable("IS_REST", PROMISEDPAYED);
			}
			
			$tpl->parse("for_Nconvergent_item");
		}
	}
	
	if(mysql_num_rows($sql_query) > 0)
	{
		$tpl->setCurrentBlock("for_Nconvergent_sum");
		$tpl->syncBlockLocalize("for_Nconvergent_sum");
		$tpl->setVariable("IS_TOTALSUM", number_format(sprintf("%.2f", ($_psum / IS_BILL_MULTIPLY) * IS_RATE), 2, ",", " "));
		$tpl->setVariable("IS_TOTALREST", number_format(sprintf("%.2f", ($_psum_rest / IS_BILL_MULTIPLY) * IS_RATE), 2, ",", " "));
		$tpl->parseCurrentBlock();
	}
	
	$tpl->parse("for_Nconvergent");
} // end noneConvergentList()


/**
 * Сообщение об отсутствующих данных
 * @param	ссылка на объект работы с шаблонами
 */
function showNoData( &$tpl )
{
	$tpl->setCurrentBlock("nodata");
	$tpl->syncBlockLocalize("nodata");
	$tpl->parseCurrentBlock();
} // end showNoData()
?>