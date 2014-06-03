<?php
/**
 * Отчет по списаниям средст за объемные услуги
 * Используется отчетная таблица для формирования данных reportXXXXXX
 */

// Режим отладки
ini_set("display_errors", true);
error_reporting(E_ALL^E_NOTICE);

// Изменение типа кэша для браузеров MS
if(strpos($_SERVER["HTTP_USER_AGENT"], "MSIE"))
{
    session_cache_limiter("public");
}
session_start();

// Проверка авторизованой сессии
if(!isset($_SESSION["auth"])) die("Authorization required!");

// Подключение необходимых библиотек
include_once("../localize.php");
include_once("../IT.php");

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
// Построение информационного массива
$stat = buildList($settings);

$tpl = new HTML_Template_IT("../".TPLS_PATH."/reports");
$tpl->loadTemplatefile("report4.tpl", true, true);
$tpl->syncBlockLocalize("__global__");
$tpl->setVariable("UNIT",$settings["share"]["natcurrencysymbol"]);
$tpl->setVariable("ISMONTH",$settings["mon_names"][sprintf("%d",$_POST["month_4"]) - 1]);
$tpl->setVariable("ISYEAR",$_POST["year_4"]);

// Суммарные данные о денежных списаниях
$rent = 0;
$over = 0;

foreach($stat as $_uid => $_uid_arr)
{
	$rowSpan = count($_uid_arr);
	$count = 0;
	foreach($_uid_arr as $_vgid => $_vgid_arr)
	{
		$rent += $_vgid_arr["RENTA"];
		$over += $_vgid_arr["OVERA"];
		
		$_vgid_arr["RENTA"] = convert($_vgid_arr["RENTA"], 1, $settings);
		$_vgid_arr["OVERA"] = convert($_vgid_arr["OVERA"], 1, $settings);
		$_vgid_arr["TOTALA"] = convert($_vgid_arr["TOTALA"], 1, $settings);
		
		switch($_vgid_arr["TTYPE"])
		{
			case 0:
			case 1: $tpl->setVariable("USEDC", convert(($_vgid_arr["RENTC"] + $_vgid_arr["OVERC"]), 2, $settings));
			break;
			
			case 2:
			case 3:
			case 5:
			case 6: $tpl->setVariable("USEDC", convert(($_vgid_arr["RENTC"] + $_vgid_arr["OVERC"]), 3, $settings));
			break;
		}
		
		$tpl->setCurrentBlock("item");
		
		if($count == 0)
		{
			$tpl->setCurrentBlock("rowspan");
			$tpl->setVariable("SPAN", $rowSpan);
			$tpl->setvariable("UNAME",$_vgid_arr["USRNAME"]);
			$tpl->parseCurrentBlock();
		}
		
		foreach($_vgid_arr as $_tpl_key => $_tpl_val)
		{
			if($_tpl_val == "") $_vgid_arr[$_tpl_key] = "&nbsp;";
		}
		
		$tpl->setVariable($_vgid_arr);
		$count++;
		$tpl->parse("item");
	}
}

if(count($stat) > 0)
{
	$tpl->setCurrentBlock("item_total");
	$tpl->syncBlockLocalize("item_total");
	$tpl->setVariable("RENT_T", convert($rent, 1, $settings));
	$tpl->setVariable("OVER_T", convert($over, 1, $settings));
	$tpl->setVariable("TOTAL_T", convert(($rent + $over), 1, $settings));
	$tpl->parseCurrentBlock();
}
else
{
	$tpl->setCurrentBlock("nodata");
	$tpl->syncBlockLocalize("nodata");
	$tpl->parseCurrentBlock();
}

// Отправка заголовка на выгрузку в excel
if($_POST["type_4"]=="exl")
{
	header ("Content-type: application/octet-stream; charset=cp1251");
	header ("Content-Disposition: attachment; filename=" . $_POST["year_4"] . $_POST["month_4"] . ".xls" );
}
$tpl->show();


/**
 * Формирование отчетного списка по использованию услуг интернет
 * 
 */
function buildList( &$settings )
{
	if( false == ($sql_query = mysql_query(sprintf("SHOW TABLES LIKE 'report%d%02d'", $_POST["year_4"], $_POST["month_4"]))) )
	{
		die("Look fo table report" . $_POST["year_4"] . $_POST["month_4"] . " " . mysql_error());
	}
	
	if(mysql_num_rows($sql_query) == 0 || date("Ym") == $_POST["year_4"] . $_POST["month_4"])
	{
		include_once("../socket.class.php");
		$_send = array(sprintf("%d%02d", $_POST["year_4"], $_POST["month_4"]), 0, 0, 0, 1, 0, 0, 0);
		$socket = new DataTo_SOCKET();
		$socket->initData(4,$_send);
		$socket->writeSocket();
		$socket->readSocket();
		$socket->closeSocket();
	}
	
	$_arr = array();
	if( false == ($sql_query = mysql_query(sprintf("SELECT r.uid, a.name, 
							r.vg_id, v.login, 
							a.kod_1c, v.kod_1c, 
							r.tar_id, t.descr, 
							r.rent, 
							IF(r.type IS NULL, 0, r.type), 
							SUM(r.volume), SUM(r.amount),
							t.type 
							FROM report%d%02d AS r 
							LEFT JOIN accounts AS a ON (a.uid=r.uid) 
							LEFT JOIN vgroups AS v ON (v.vg_id=r.vg_id) 
							LEFT JOIN tarifs AS t ON (t.tar_id=r.tar_id) 
							WHERE r.tar_id IN (%s) 
							%s
							GROUP BY r.vg_id, r.rent, r.type 
							ORDER BY r.uid", $_POST["year_4"], $_POST["month_4"], 
							implode(",", array_keys($settings["tarifs"])), 
							($_SESSION["auth"]["authperson"] > 0) ? sprintf("AND r.uid IN (%s)", implode(",",array_unique(array_merge($_SESSION['permissions']['ro_usergroups'],$_SESSION['permissions']['rw_usergroups'])))) : ""))) )
	{
		die( "Build list: " . mysql_error() );
	}
	
	while($row = mysql_fetch_row($sql_query))
	{
		if(isset($_arr[$row[0]][$row[2]]))
		{
			if($row[8] == 1)
			{
				$_arr[$row[0]][$row[2]]["RENTA"] += $row[11];
				$_arr[$row[0]][$row[2]]["RENTC"] += $row[10];
			}
			else
			{
				$_arr[$row[0]][$row[2]]["OVERA"] += $row[11];
				$_arr[$row[0]][$row[2]]["OVERC"] += $row[10];
			}
			
			$_arr[$row[0]][$row[2]]["TOTALA"] = $_arr[$row[0]][$row[2]]["RENTA"] + $_arr[$row[0]][$row[2]]["OVERA"];
		}
		else
		{
			$_arr[$row[0]][$row[2]] = array(
							"USRNAME" => $row[1],
							"TTYPE" => $row[12],
							"LOGIN" => $row[3],
							"KOD1C" => ($settings["share"]["convergent"] == 1) ? $row[4] : $row[5],
							"RENTA" => (($row[8] == 1) ? $row[11] : 0),
							"RENTC" => (($row[8] == 1) ? (($row[9] == 0) ? 0 : $row[10]) : 0),
							"OVERA" => (($row[8] == 1) ? 0 : $row[11]),
							"OVERC" => (($row[8] == 1) ? 0 : $row[10]),
							"TOTALA" => 0);
			
			$_arr[$row[0]][$row[2]]["TOTALA"] = $_arr[$row[0]][$row[2]]["RENTA"] + $_arr[$row[0]][$row[2]]["OVERA"];
		}
	}
	
	return $_arr;
} // end buildList()


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
		"year_4" => date("Y"),
		"month_4" => date("m")
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
		$_arr["share"]["assetshowformat"] = $row[0];
		$_arr["share"]["natcurrencysymbol"] = $row[1];
		$_arr["share"]["bill_multiply"] = $row[2];
		$_arr["share"]["multiply"] = $row[3];
		$_arr["share"]["convergent"] = $row[4];
		$_arr["share"]["operators"] = $row[5];
	}
	else die( "#1 " . mysql_error );
	
	// Кабельные агенты
	if( false != ($sql_query = mysql_query("SELECT id, descr, na_ip, na_db, na_username, na_pass FROM settings WHERE type IN (0,1,2,5)")) )
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
		$_arr["rate"] = $sql_query[0];
	}
	else $rate = 1;
	
	// Тарифы по интернет услугам
	if( false != ($sql_query = mysql_query("SELECT tar_id, descr FROM tarifs WHERE type IN (0,1,6) GROUP BY tar_id")) )
	{
		while($row = mysql_fetch_row($sql_query))
		{
			$_arr["tarifs"][$row[0]] = $row[1];
		}
	}
	else die( "#3" . mysql_error() );
	
	return $_arr;
} // end load_settings()


/**
 * Преобразование величин взависимости от типа тарификации
 * @param	величина
 * @param	тип: 1 - денежная, 2 - Мб, 3 - времнная
 * @param	ссылка на массив с настройками АСР
 */
function convert( $unit = 0, $_type = 0, &$_set)
{
	switch($_type)
	{
		case 1: $unit = number_format(sprintf("%.2f", ($unit / $_set["share"]["bill_multiply"]) * $_set["rate"]), 2, ",", " ");
		break;
		
		case 2: $unit = sprintf("%.3f", $unit / $_set["share"]["multiply"] / $_set["share"]["multiply"]);
		break;
		
		case 3: $_tmp = array();
			if(empty($unit)) $_tmp = array("00","00","00");
			else if($unit < 60) $_tmp = array("00","00",$unit);
			else
			{
				$_tmp[] = ($unit >= 3600) ? sprintf("%02d", $unit  / 3600) : "00";
				$_tmp[] = ($unit >= 60) ? sprintf("%02d", ($unit - ($_tmp[0] * 3600)) / 60) : "00";
				$_tmp[] = ($unit >= 60) ? sprintf("%02d", ($unit - $_tmp[0] * 3600) - $_tmp[1] * 60) : "00";
			}
			
			$unit = implode(":",$_tmp);
		break;
	}
	return $unit;
} // end convert()
?>