<?php
/********************************************************************
   filename:   tolink.php
   modified:   8/13/2005
   author:     Maria Basmanova
*********************************************************************/

include ("localize.php");
include ("template_func.inc");

if (!session_is_registered("auth"))
{
   exit;
}

if ($_POST["gen_tolink"] == 1)	//generate report
{
	$dd = $_POST["dd"];
	$mm = $_POST["mm"]+1;
	$yyyy = $_POST["yyyy"];

	$max_page_size = $_POST['max_page_size'];
	if (!is_numeric($max_page_size) || $max_page_size < 0)
		$max_page_size = 0;
	elseif ($max_page_size % 2 == 1)
		$max_page_size++;

	// Определим текст шаблона и значение параметра "Максимальное кол-во записей на странице"
	$template_data = GetTemplateX();
	$template = $template_data['template'];
	//$max_page_size = $template_data['max_page_size'];
	
	// В целях оптимизации определим какие ключевые слова используются 
	// предполагая, что используется либо полный адрес %address% либо отдельные части адреса.
	$keywords = array("{country}", "{city}", "{street}", "{house}", "{building}", "{apt}", "{address_comments}");
	$full_address_used = false;	//TRUE если используется полный адрес %address%
	$used_keywords = array();	// Массив индексов ключевых слов в массиве $keywords, которые используются в шаблоне
	$used_keywords_cnt = 0;		// Размер массива $used_keywords

	if (strpos($template, "{address}") !== false)	//используется полный адрес
	{
		$full_address_used = true;
	}
	
	if(1)	//используются отдельные части адреса
	{
		$j=0;
		//print_r($keywords);
		for ($i=0; $i<count($keywords); $i++)
		{
			if (strpos($template, $keywords[$i]) !== false)
				$used_keywords[$j++] = $i;
		}
		$used_keywords_cnt = $j;
	}
	
	$acc_onplandate_ts = mktime(0, 0, 0, $mm, $dd, $yyyy);
	$acc_onplandate = date("d.m.Y", $acc_onplandate_ts);
	$date_curr = date("Y-m-d", $acc_onplandate_ts);
	/*
		vgroups.acc_onplandate- Дата подключения
		accounts.agrm_num - Номер договора
		accounts.name - ФИО абонента
		- Почтовый адрес
		accounts.phone - Телефон
		vgroups.comments- Примечание
		accounts.login - Логин
		accounts.pass - Пароль
	*/

	$account_type = $_POST['account_type'];
	$agent_id = $_POST['agent_id'];

	if (!is_numeric($account_type))
		$account_type = 0;

	if (!is_numeric($agent_id))	
		$agent_id = 0;
	
	$where = "";
	if ($account_type)
	{
		$where .= sprintf(" and a.type='%d' ", $account_type);
		$account_type_name = ($account_type == 1) ? USERTYPE1 : USERTYPE2;
	}
	else
		$account_type_name = ANY;

	if ($agent_id)
	{		
		// Выберем имя агента из БД, заодно проверим, что анент с таким ID существует
		$query = sprintf("select descr from settings where id=%d", $agent_id);
		$res = mysql_query($query, $descriptor);
		if ($res)
		{
			if (mysql_num_rows($res) == 1)
			{
				if ($row = mysql_fetch_object($res))
				{	
					$agent_name = $row->descr;
					$where .= sprintf(" and v.id='%d' ", $agent_id);
				}
			}
		}
		else
		{
			printf("MySQL error %d: %s", mysql_errno(), mysql_error());
			exit;
		}
	}
	else
		$agent_name = ANY;
	

?>
<table class="table_comm" width=700  align=left  style="border: solid 1px #c0c0c0; border-bottom:0px;">
	<tr height=20>
    <td height=20 align=center bgcolor=#E0E0E0 style="border-bottom: solid 1px #c0c0c0;">
			<b><font class=z11><?PHP printf("%s (%s: %s, %s: %s)", sprintf(TOLINKLIST, $acc_onplandate), AGENT, $agent_name, ACCOUNT_TYPE, $account_type_name) ?></font></b>
    </td>
	</tr>
	<tr>
		<td align=right style="border-bottom: solid 1px #c0c0c0;" height=15>
<?php

	echo "<table cellpadding='5' cellspacing='5' align='center' width='100%' bgcolor='#e0e0e0' border=1>";
	
	$query = sprintf("select GROUP_CONCAT(DISTINCT agrm.number SEPARATOR ', ') agrm_num, 
			a.name, a.phone, 
			a.type,
			a.country, a.city, a.street, a.bnum as house, a.bknum as building, a.apart as apt, a.addr as address_comments,
			v.login, v.pass, 
			if(!v.acc_onplandate, unix_timestamp(NOW()), unix_timestamp(v.acc_onplandate)) as acc_onplandate_ts, 
			v.comments, DATE_FORMAT(v.acc_ondate, '%%Y%%m%%d%%H%%i%%s')
		from accounts a LEFT JOIN agreements AS agrm ON (agrm.uid = a.uid), vgroups v 
		where a.uid=agrm.uid and v.agrm_id=agrm.agrm_id 
			and blocked = 10 and acc_ondate <= '%s' and v.archive=0 %s
		GROUP BY v.vg_id 
		order by acc_ondate", 
		$date_curr, $where); 
		
		//echo $query; 
		
	$res = mysql_query($query, $descriptor);
	if($res){
		$i=0;
		while ($row=mysql_fetch_assoc($res))
		{
			if ($i && $max_page_size && ($i % $max_page_size == 0))	// нужно начать новую таблицу=страницу
			{
				echo "</table><br /><table style='page-break-before: always' cellpadding='5' cellspacing='5' align='center' width='100%' bgcolor='#e0e0e0' border=1>";
			}
			
			$entry = str_replace("{contract_no}", $row["agrm_num"], $template);
			$entry = str_replace("{fio}", $row["name"], $entry);

			if ($full_address_used)
			{
				$address = FormatAddress($row, "");
				/*
				if ($row["type"] == 2)	//физ лицо
					$address = sprintf("%s, %s, %s, %s, %s, %s", $row->city, $row->street, $row->bnum, $row->bknum, $row->apart, $row->addr);
				else	//юр лицо
					$address = sprintf("%s, %s, %s, %s, %s, %s", $row->city_u, $row->street_u, $row->bnum_u, $row->bknum_u, $row->apart_u, $row->addr_u);
				*/

				$entry = str_replace("{address}", $address, $entry);			
			}
			
			if(1)
			{
				/*
				if ($row["type"] == 2)	//физ лицо
					$address_data = array($row->country, $row->city, $row->street, $row->bnum, $row->bknum, $row->apart, $row->addr);
				else	//юр лицо
					$address_data = array($row->country_u, $row->city_u, $row->street_u, $row->bnum_u, $row->bknum_u, $row->apart_u, $row->addr_u);
				*/
				for ($j=0; $j<$used_keywords_cnt; $j++)
				{
					$curr_keyword = trim($keywords[$used_keywords[$j]], "{}");
					$entry = str_replace($keywords[$used_keywords[$j]], $row[$curr_keyword], $entry);						
				}
			}

			$entry = str_replace("{phone}", $row["phone"], $entry);
			$entry = str_replace("{comments}", str_replace("\n", "<br/>", htmlspecialchars($row["comments"])), $entry);
			$entry = str_replace("{login}", $row["login"], $entry);
			$entry = str_replace("{password}", $row["pass"], $entry);
			$entry = str_replace("{linkdate}", date("d.m.y", $row["acc_onplandate_ts"]), $entry);

			//echo $i."<br />";
			if ($i % 2 == 0)
				echo "<tr>";			
			printf("<td bgcolor='#ffffff' width='50%%' class=z11>%s</td>", $entry);
			if ($i % 2 == 1)
				echo "</tr>";

			$i++;
		}
		if ($i % 2 == 1)
			echo "<td bgcolor='#ffffff' width='50%' class=z11>&nbsp;</td></tr>";
	}
	else{
		printf("MySQL error %d: %s", mysql_errno(), mysql_error());
		exit;
	}

	echo "</table>";
?>
	</td></tr>
</table>	
<?php	
}
else	//display launch form
{

	// формируем список агентов
	$agent_select = "<select class=z11 name='agent_id' style=\"width: 200px;\"><option value='0'>".ANY."</option>";
	$query = "select id, descr from settings order by descr";
	$res = mysql_query($query, $descriptor);
	if($res){
		while ($row=mysql_fetch_object($res))
		{
			$agent_select .= "<option value='".$row->id."'".($row->id == $agent_id ? " selected" : "").">".$row->descr."</option>";
		}
	}
	else{
		printf("MySQL error %d: %s", mysql_errno(), mysql_error());
		exit;
	}
	$agent_select .= "</select>";


	// определяем значение параметра "Макс. кол-во уч. записей на странице"
	$max_page_size=10;
	$query = sprintf("select document_type from templates where template_name='%s'", TEMPLATEX_NAME);
	$res = mysql_query($query, $descriptor);
	if ($res)
	{
		if (mysql_num_rows($res) == 1)
		{
			if ($row = mysql_fetch_row($res))
			{	
				$max_page_size = $row[0];
			}
		}
	}
	else
	{
		printf("MySQL error %d: %s", mysql_errno(), mysql_error());
		exit;
	}

?>
<script language="JavaScript">
var months = Array('январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь');
var weekdays = Array('пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс');

var objSelectedTD;
var objForm;
function SelectDate(objTD)
{
	if (objSelectedTD)
		objSelectedTD.bgColor = "#ffffff";
	objTD.bgColor = "red";
	objSelectedTD = objTD;

	objForm.dd.value = objTD.innerHTML;
}

function DisplayCalendar(F, m, y)
{
	var d = document;
	var dt = new Date();
	var day, month, year;
	var weekday;

	//create calendar div if it doesn't exisit yet
	var cal;
	cal = document.all.calendar;
	if (!cal)	
	{		
		//add hidden form fields
		objForm = F;
		d.write("<input type='hidden' name='dd'>");
		d.write("<input type='hidden' name='mm'>");
		d.write("<input type='hidden' name='yyyy'>");
		d.write("<div id='calendar'>");
	}
	
	var calHtml="";
	
	day = dt.getDate();
	month = dt.getMonth();
	year = dt.getFullYear();

	var newMonth, newYear, newDay;
	if (m != undefined)
	{
		newMonth = parseInt(m);
		if (isNaN(newMonth))
			newMonth = -2;
	}

	if (y != undefined)
	{
		newYear = parseInt(y);
		if (isNaN(newYear))
			newYear = -2;
	}

	if (newYear > 0)
	{
		if (newMonth < -1)
			newMonth = 0;
	}
	else if (newMonth > -2)
	{
		newYear = year;
	}
	
	if (newMonth > -2)
	{
		dt = new Date(newYear, newMonth, 1);

		day = dt.getDate();
		month = dt.getMonth();
		year = dt.getFullYear();
	}

	objForm.mm.value = month;
	objForm.yyyy.value = year;

	//get weekday for 1dt day of the month
	dt.setDate(1);
	weekday = dt.getDay();

	var i;
	
	//adjust weekday so that Sunday is the last day of week
	if (weekday == 0) weekday = 7;
	
	calHtml += "<table cellspacing='1' cellpadding='0' bgcolor='#E0E0E0' width='200' style='text-align: center' id='cal_table'>";

	//print header
	calHtml += "<tr>";
	
	//link to previous month
	calHtml += "<td class=z11><a href='javascript:DisplayCalendar(null, " + (month-1) + ", " + year + ")' title='" + months[(month-1)%12] + "'>&lt;&lt;</a></td>";
	
	//current month and year
	calHtml += "<td class=z11 colspan='5' align='center'>" + months[month] + " " + year + "</td>";
	
	//link to next month
	calHtml += "<td class=z11><a href='javascript:DisplayCalendar(null, " + (month+1) + ", " + year + ")' title='" + months[(month+1)%12] + "'>&gt;&gt;</td>";
	
	calHtml += "</tr>";

	//print weekdays names
	calHtml += "<tr>";
	for (i=0; i<7; i++)
		calHtml += "<td class=z11 bgcolor='#ffffff'>" + weekdays[i] + "</td>";
	calHtml += "</tr>";

	//print empty cells for first days of first week before 1st date of current month
	calHtml += "<tr>";
	for (i=1; i<weekday; i++)
		calHtml += "<td bgcolor='#ffffff'>&nbsp;</td>";

	//get number of days in this month
	dt.setMonth(month+1);
	dt.setDate(0);
	var numOfDays = dt.getDate();

	for (i=1; i<=numOfDays; i++)
	{
		if (i > 1 && (i+weekday-1) % 7 == 1)
			calHtml += "<tr>";
		calHtml += "<td class=z11 bgcolor='#ffffff' onClick='SelectDate(this)'>" + i + "</td>";
		if ((i+weekday-1) % 7 == 0)
			calHtml += "</tr>";
	}
	
	//print empty cells for remaining days of last week
	i = (weekday+numOfDays-1) % 7;
	if (i>0)
	{
		for (i; i<7; i++)
			calHtml += "<td bgcolor='#ffffff'>&nbsp;</td>";
	}

	calHtml += "</table>";

	if (cal)
	{
		cal.innerHTML = calHtml;
	}
	else
	{
		d.write(calHtml);
		d.write("</div>");
	}

	if (!objSelectedTD)	// Выберем текущую дату
	{
		today = new Date();
		today_day = today.getDate();
		today_month = today.getMonth();
		today_year = today.getFullYear();

		if (today_month == month && today_year == year)	// Если отображается текущий месяц
		{
			// определим ячейку таблицы в которой расположена текущая дата

			// определим день недели

			today_weekday = today.getDay();
			if (today_weekday == 0) today_weekday = 7;

			col = today_weekday-1;
			row = (weekday + today_day)%7;

			objTable = d.getElementById("cal_table");
			objTD = objTable.childNodes[0].childNodes[row].childNodes[col];
			//alert(row + "," + col + "," + objTD.innerHTML);
			SelectDate(objTD);
		}
	}
}
function SubmitToLinkForm(F)
{
	var d;

	d = parseInt(F.dd.value);
	if (isNaN(d))
	{
		alert("Пожалуйста, выберите дату!");
		return;
	}

	F.submit();
}
</script>
<table class="table_comm" width=990   align=center  style="border: solid 1px #c0c0c0; border-bottom:0px;">
	<tr >
    <td height="27" align=center bgcolor=#E0E0E0 style="border-bottom: solid 1px #c0c0c0;">
			<b><font class=z11 ><?PHP echo GENERATETOLINK?></font></b>
    </td>
	</tr>
	<tr>
		<td align=right >
			<form action="config.php" method="post" style="margin: 0" name="tolinkform" target="_blank">
				<input type="hidden" name="show_empty_header" value="1" />
				<input type=hidden name="devision" value=110>
				<input type=hidden name="gen_tolink" value=1>
				<table align=center cellspacing=0 cellpadding=5 width=990 height=25 >
					<tr class="z11" height="22" bgcolor="#f5f5f5"  >
						<td class="td_comm" align="center"  width="300"><?PHP echo SELECTLINKDATE?></td>
						<td  class="td_comm" align="center" ><?PHP echo AGENT?></td>
						<td class="td_comm"  align="center" ><?PHP echo ACCOUNT_TYPE?></td>						
						<td  class="td_comm" align="center"  width=120 ><?PHP echo MAX_PAGE_SIZE?></td>
						<td class="td_comm" align="center"  style="border-right:none;">&nbsp;</td>
					</tr>
                    
					<tr>
						<td class="td_comm" align=center style="padding:10px;"><script language="JavaScript">DisplayCalendar(document.forms.tolinkform);</script></td>
						<td class="td_comm" align=center><?PHP echo $agent_select?></td>
						<td class="td_comm" class=z11 align=left>
							<input type="radio" name="account_type" value="0" id="account_type_0" checked="">
								<label for="account_type_0"><?PHP echo ANY?></label><br/>
							<input type="radio" name="account_type" value="1" id="account_type_1">
								<label for="account_type_1"><?PHP echo USERTYPE1?></label><br/>								
							<input type="radio" name="account_type" value="2" id="account_type_2">
								<label for="account_type_2"><?PHP echo USERTYPE2?></label>
						</td>
						<td class="td_comm" align=center><input class=z11 type="text" name="max_page_size" value="<?PHP echo $max_page_size?>" size="10" /></td>
						<td class="td_comm" align=center style="border-right:none;"><input type=button class=z11 value="<?PHP echo EXP_REP?>" onClick="SubmitToLinkForm(this.form)" ></td>
					</tr>
				</table>
			</form>
		</td>
	</tr>
</table>
<?php
}	//end of if ($_POST["gen_tolink"] == 1)
?>