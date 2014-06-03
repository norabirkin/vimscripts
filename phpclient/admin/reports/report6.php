<?php
/**
 * Отчет по направлениям каталога. Не учитывает трафик прошедший вне зон...
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

if(!isset($_SESSION['auth'])) die("Authorization required!");

// Загрузка дополнительных модулей
require_once('../localize.php');
require_once('../IT.php');

// Подключение к БД
if( !$descriptor )
{
	if( !isset($serveraddress) || !isset($mysqluser) || !isset($mysqlpassword) || !isset($mysqldatabase))
		include("../confparser.inc");
	
	$descriptor = connect($serveraddress, $mysqluser, $mysqlpassword, $mysqldatabase);
}

// Настройки АСР и массив агентов
$settings = load_settings($descriptor);
// Построение информационного массива
$stat = buildList($settings, $descriptor);


$tpl = new HTML_Template_IT("../".TPLS_PATH."/reports");
$tpl->loadTemplatefile("report6.tpl",true,true);
$tpl->syncBlockLocalize("__global__");
$tpl->setVariable("UNIT",$settings["share"]["natcurrencysymbol"]);
$tpl->setVariable("ISMONTH",$settings["mon_names"][sprintf("%d",$_POST["month_6"]) - 1]);
$tpl->setVariable("ISYEAR",$_POST["year_6"]);
if($settings["share"]["convergent"] == 1)
{
	$tpl->setCurrentBlock("hd_user_kod");
	$tpl->syncBlockLocalize("hd_user_kod");
	$tpl->parseCurrentBlock();
}
else
{
	$tpl->setCurrentBlock("hd_vg_kod");
	$tpl->syncBlockLocalize("hd_vg_kod");
	$tpl->parseCurrentBlock();
}


if(empty($stat))
{
	$tpl->setCurrentBlock("nodata");
	$tpl->syncBlockLocalize("nodata");
	$tpl->parseCurrentBlock();
}
else
{
	$iter = 0;
	$total_summ = array(0,0);
	foreach($stat as $ukey => $data)
	{
		$curr_summ = array(0,0);
		
		$tpl->setVariable("ITER", $iter);
		$tpl->setVariable("USERNAME", $data["name"]);
		$tpl->setVariable("AGRMNUM", $data["agrm"]);
		if($settings["share"]["convergent"] == 1)
		{
			$tpl->setCurrentBlock("user_kod");
			$tpl->setVariable("ROWSPAN", ($data["row"] + 2));
			$tpl->setVariable("KOD", $data["kod"]);
			$tpl->parseCurrentBlock();
		}
		$tpl->setVariable("ROWSPAN", ($data["row"] + 2));
		$tpl->parse("user_info");
		
		foreach($data["det"] as $vkey => $val)
		{
			$tpl->setvariable("VGLOGIN", $val["login"]);
			$tpl->setVariable("ROWSPAN", $val["row"]);
			$tpl->parse("vg_login");
			
			if($settings["share"]["convergent"] != 1)
			{
				$tpl->setvariable("VGKOD", $val["kod"]);
				$tpl->setVariable("ROWSPAN", $val["row"]);
				$tpl->parse("vg_kod");
			}
			
			foreach($val["det"] as $catnum => $catarr)
			{
				foreach($catarr as $catidx => $catval)
				{
					$tpl->setVariable("CATNAME", $settings["catidx"][$catnum][$catidx]);
					$tpl->setVariable("ZONENAME", $settings["catid"][$catnum]);
					$tpl->setVariable("TRAFVAL", convert($catval[0], 2, $settings));
					$tpl->setVariable("AMOUNT", convert($catval[1], 1, $settings));
					$tpl->parse("cat_traf");
					$tpl->parse("row");
					
					$curr_summ[0] += $catval[0];
					$curr_summ[1] += $catval[1];
				}
			}
		}
		
		$tpl->syncBlockLocalize("row_total");
		$tpl->setVariable("COLSPAN", 3);
		$tpl->setVariable("USERTRAFTOTAL", convert($curr_summ[0], 2, $settings));
		$tpl->setVariable("USERAMOUNTTOTAL", convert($curr_summ[1], 1, $settings));
		$tpl->parse("row_total");
		$tpl->parse("row");
		
		$total_summ[0] += $curr_summ[0];
		$total_summ[1] += $curr_summ[1];
		$iter++;
	}

	$tpl->setCurrentBlock("total");
	$tpl->syncBlockLocalize("total");
	$tpl->setVariable("COLSPAN", 7);
	$tpl->setVariable("USERTRAFTOTAL", convert($total_summ[0], 2, $settings));
	$tpl->setVariable("USERAMOUNTTOTAL", convert($total_summ[1], 1, $settings));
	$tpl->parse("total");
}


// Отправка заголовка на выгрузку в excel
if($_POST["type_6"]=="exl")
{
	header ("Content-type: application/octet-stream; charset=cp1251");
	header ("Content-Disposition: attachment; filename=" . $_POST["year_6"] . $_POST["month_6"] . ".xls" );
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
		"year_6" => date("Y"),
		"month_6" => date("m")
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
function load_settings( &$descriptor )
{
	$_arr = array();
	
	// Названия месяцев
	$_arr["mon_names"] = array(JANUARY, FEBRUARY, MARCH, APRIL, MAY, JUNE, JULY, AUGUST, SEPTEMBER, OCTOBER, NOVEMBER, DECEMBER);
	
	if( false != ($sql_query = mysql_query("SELECT assetshowformat, 
						natcurrencysymbol, 
						bill_multiply, 
						multiply, 
						convergent, 
						use_operators FROM share LIMIT 1", $descriptor)) )
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
	
	// Агенты телефонии
	if( false != ($sql_query = mysql_query("SELECT id, descr, na_ip, na_db, na_username, na_pass FROM settings", $descriptor)) )
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
						ORDER BY date DESC LIMIT 1", $descriptor)))
	{
		$sql_query = mysql_fetch_row($sql_query);
		$_arr["rate"] = $sql_query[0];
	}
	else $rate = 1;
	
	return $_arr;
} // end load_settings()


/**
 * Построение информационного массива для вывода в таблицу
 *
 */
function buildList( &$settings, &$descriptor )
{
	if( false == ($sql_query = mysql_query(sprintf("SHOW TABLES LIKE 'report%d%02d'", $_POST["year_6"], $_POST["month_6"]), $descriptor)) )
	{
		die("Look fo table report" . $_POST["year_6"] . $_POST["month_6"] . " " . mysql_error());
	}
	
	if(mysql_num_rows($sql_query) == 0 || date("Ym") == $_POST["year_6"] . $_POST["month_6"])
	{
		include_once("../socket.class.php");
		$_send = array(sprintf("%d%02d", $_POST["year_6"], $_POST["month_6"]), 0, 0, 0, 1, 0, 0, 0);
		$socket = new DataTo_SOCKET();
		$socket->initData(4,$_send);
		$socket->writeSocket();
		$socket->readSocket();
		$socket->closeSocket();
	}
	
	$_arr = array();
	$_cat = array();
	
	if( false == ($sql_query = mysql_query(sprintf("SELECT r.uid, r.vg_id, a.name, v.login, 
							GROUP_CONCAT(DISTINCT agrm.number SEPARATOR ', '), 
							a.kod_1c, v.kod_1c, 
							r.cat_num, r.cat_idx, SUM(r.volume), SUM(r.amount) 
							FROM report%d%02d AS r 
							LEFT JOIN accounts AS a ON (a.uid=r.uid) 
							LEFT JOIN agreements_list AS agrm ON (agrm.uid=a.uid) 
							LEFT JOIN vgroups AS v ON (v.vg_id=r.vg_id) 
							LEFT JOIN settings AS s ON (s.id = v.id) 
							WHERE cat_num > 0 AND cat_idx > 0 AND s.type IN (0,1,5) %s
							GROUP BY r.uid, r.vg_id, r.cat_num, r.cat_idx
							ORDER BY r.uid", 
							$_POST["year_6"], $_POST["month_6"], 
							($_SESSION["auth"]["authperson"] > 0) ? sprintf("AND r.uid IN (%s)", implode(",",array_unique(array_merge($_SESSION['permissions']['ro_usergroups'],$_SESSION['permissions']['rw_usergroups'])))) : ""), $descriptor)) )
	{
		die("Build list: " . mysql_error($descriptor));
	}
	
	while($row = mysql_fetch_row($sql_query))
	{
		if(!isset($_arr[$row[0]]))
		{
			$_arr[$row[0]] = array("name" => $row[2], 
						"kod" => $row[5],
						"agrm" => $row[4], 
						"row" => 0,
						"det" => array());
		}
		
		if(!isset($_arr[$row[0]]["det"][$row[1]]))
		{
			$_arr[$row[0]]["det"][$row[1]] = array("login" => $row[3],
								"kod" => $row[6],
								"row" => 0,
								"det" => array());
		}
		
		if(!isset($_arr[$row[0]]["det"][$row[1]]["det"][$row[7]]))
			$_arr[$row[0]]["det"][$row[1]]["det"][$row[7]] = array($row[8] => array($row[9], $row[10]));
		
		if(!isset($_arr[$row[0]]["det"][$row[1]]["det"][$row[7]][$row[8]]))
		{
			$_arr[$row[0]]["det"][$row[1]]["det"][$row[7]][$row[8]] = array($row[9], $row[10]);
			$_arr[$row[0]]["det"][$row[1]]["row"]++;
		}
		else
		{
			$_arr[$row[0]]["det"][$row[1]]["det"][$row[7]][$row[8]] = array($row[9], $row[10]);
			$_arr[$row[0]]["det"][$row[1]]["row"]++;
		}
		
		$_arr[$row[0]]["row"]++;
		
		if(!isset($_cat[$row[7]]))
			$_cat[$row[7]] = array($row[8]);
		
		$_cat[$row[7]][] = $row[8];
	}
	
	if(!empty($_cat))
	{
		if( false == ($sql_query = mysql_query(sprintf("SELECT cat_id, cat_name 
								FROM catalog WHERE cat_id IN (%s)", implode(",", array_keys($_cat))))) )
		{
			die("Can't get catalog list: " . mysql_error($descriptor));
		}
		
		$settings["catid"] = array();
		$settings["catidx"] = array();
		while($row = mysql_fetch_row($sql_query))
			$settings["catid"][$row[0]] = $row[1];
		
		foreach($_cat as $_key => $data)
		{
			if( false == ($sql_query = mysql_query(sprintf("SELECT cat_idx, cat_descr 
									FROM cat_%d_idx 
									WHERE cat_idx IN (%s)", $_key, implode(",", $data)), 
									$descriptor)) )
			
			if(!isset($settings["catidx"][$_key]))
				$settings["catidx"][$_key] = array();
			
			while($row = mysql_fetch_row($sql_query))
				$settings["catidx"][$_key][$row[0]] = $row[1];
		}
	}
	
	return $_arr;
} // end buildList()


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