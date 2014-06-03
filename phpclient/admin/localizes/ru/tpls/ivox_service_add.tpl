<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=windows-1251">
<title></title>
<link rel="StyleSheet" href="main.css" type="text/css">
<script language="JavaScript" src="js/protofunctions.js"></script>
<script language="JavaScript" src="js/calendar.js"></script>
</head>
<script language="javascript">
var Calendar = new DHTMLCalendar.init();
Calendar.initMonthNames("{JANUARY}","{FEBRUARY}","{MARCH}","{APRIL}","{MAY}","{JUNE}","{JULY}","{AUGUST}","{SEPTEMBER}","{OCTOBER}","{NOVEMBER}","{DECEMBER}");
function rowsReorder(form)
{
	if(!form) form = document.forms[1];
	if(form.c_p_n1) form.c_p_n1.value = 1;
	form.submit();
}

function reloadParent( reload )
{
	if(reload != 1) return;
	if(window.opener.document.forms[1].show_list) window.opener.document.forms[1].show_list.click();
	else window.opener.document.forms[1].submit();
}
</script>
<body onunload="reloadParent({RELOAD})">
<form name=empty method=post></form>
<form method=post name=service_add>
<input type=hidden name=ivox_service_type value="{MODEVALUE}">
<input type=hidden name=tar_id value="{TARID}">
<input type=hidden name=vg_id value="{VGID}">
<input type=hidden name=reload value="{RELOAD}">

<table cellspacing=0 cellpadding=0 align=center width=660 class=table_comm border=0>
	<tr height=25 class=th_comm>
		<th class=td_head>{MEN_SERVICES}</th>
	</tr>
	<tr height=40>
		<td width=150 class=td_comm>
			&nbsp;
			<!-- BEGIN btn_create -->
			<button class=img_button type=submit name=save_srv><img title="{SAVE}" name="create_new" border=0 src="images1/create1.gif"></img></button>
			<b>{SAVE}</b>
			<!-- END btn_create -->
		</td>
	</tr>
	<tr height=30>
		<td class=td_comm>
		<table class=table_comm style="border: none; margin-left: 4px;" border=0>
		<tr>
			<td width=190>
				<select name=cat_opt[] style="width: 170px;">
				<!-- BEGIN sel_sch_opt --><option value="{SEARCHOPT_VAL}" {SEARCHOPT_SEL}>{SEARCHOPT_DESC}</option><!-- END sel_sch_opt -->
				</select>
			</td>
			<td width=30%><input type=text name=cat_opt[] style="width: 250px;" value="{SCHOPT_VALUE}"></td>
			<td><button type=submit name=show_list class=img_button><img src="images/search.png"></button></td>
		</tr>
		</table>
		</td>
	</tr>
</table>

<!-- BEGIN if_once_saved -->
<table class=table_comm width=660 align=center style="margin-top: 17px;">
	<!-- BEGIN if_once_saved_item -->
	<tr style="font-weight:none;<!-- BEGIN warn -->color:red;<!-- END warn --><!-- BEGIN ok -->color:green;<!-- END ok -->">
		<td class=td_comm>{ONCESAVED_1}</td>
		<td width=70 align=center class=td_comm>{ONCESAVED_2}</td>
	</tr>
	<!-- END if_once_saved_item -->
</table>
<!-- END if_once_saved -->

<!-- BEGIN if_once -->
<script language="javascript">
function showTime( stat )
{
	for(var i=1; i<5; i++)
		if(document.getElementById("tt_" + i)) {
			document.getElementById("tt_" + i).style.display = (stat.checked) ? "none" : "";
		}
}
</script>
<table class=table_comm width=660 align=center style="margin-top: 17px;">
	<tr>
	<td class=td_comm colspan=4>
		<table width=100% class=table_comm style="border: none;" border=0>
			<tr height=30>
			<td width=190>{SERVICECURRENTTIME}{COLON}</td>
			<td width=40><input type=checkbox name=set_now onClick="showTime(this)" value=1 {SETNOWCHECK}></td>
			<td id="tt_1" style="width:40px; {SETNOTNOWVISIBLE}"><button id="tmf" class=img_button onClick="Calendar.show(this,'yf','mf','df'); return false;"><img src="images/cal.gif" border=0></button></td>
			<td id="tt_2" style="width:110px; {SETNOTNOWVISIBLE}"><select id="yf" name=year style="width: 100px;">{OPTIONYEARFROM}</select></td>
			<td id="tt_3" style="width: 110px; {SETNOTNOWVISIBLE}"><select id="mf" name=month style="width: 100px;">{OPTIONMONTHFROM}</select></td>
			<td id="tt_4" style="width:110px; {SETNOTNOWVISIBLE}"><select id="df" name=day style="width: 100px;">{OPTIONDAYFROM}</select></td>
			<td>&nbsp;</td>
			</tr>
		</table>
		
		<table width=100% class=table_comm style="border: none;" border=0>
			<tr height=30>
			<td width=190>{SERVICEONDUPLICATE}{COLON}</td>
			<td width=290><input type=checkbox name=onduplicate value=1 {ONDUPLICATE}></td>
			</tr>
			<tr height=30>
			<td width=190>{SERVICEQUANTITY}{COLON}</td>
			<td width=290><input type=text name=param3 style="width: 150px;"></td>
			</tr>
			<tr>
			<td>{COMMENTS}{COLON}</td>
			<td><input type=text name=param4 style="width: 320px;"></td>
			</tr>
		</table>
	</td>
	</tr>
	<tr height=22>
		<td class=td_comm style="padding-left: 10px" colspan=4>
		<table width=100% class=table_comm style="border: none;">
		<tr><td width=50%>{CPNVALUE}</td>
		<td align=right width=50%>{TOSHOW}&nbsp;{ZAPNASTR}&nbsp;
		<select name=rows_on_page onChange="rowsReorder(this.form)">
		<!-- BEGIN rowsonpage --><option value="{ROWSVALUE}" {ROWSSELECTED}>{ROWSDISPL}</option><!-- END rowsonpage -->
		</select>
		</td></tr>
		</table></td>
	</tr>
	<tr height=22>
		<td class=td_head width=40>&nbsp;</td>
		<td class=td_head width=120>{SERVICECODE}</td>
		<td class=td_head>{SERVICENAME}</td>
		<td class=td_head width=120>{PRICE} ({SYMBOL})</td>
	</tr>
	<!-- BEGIN if_once_item -->
	<tr height=22 align=center>
		<td class=td_bott width=40><input type=checkbox name=zonenum[] value="{ZONEID}"></td>
		<td class=td_bott width=120>{ZONENUM}</td>
		<td class=td_bott>{ZONENAME}</td>
		<td class=td_comm width=120>{ZONEPRICE}</td>
	</tr>
	<!-- END if_once_item -->
</table>
<!-- END if_once -->

<!-- BEGIN if_period -->
<script language="javascript">
function showTime( stat )
{
	if(stat.name == "set_now") {
		for(var i=1; i<5; i++)
			if(document.getElementById("tt_" + i)) {
				document.getElementById("tt_" + i).style.display = (stat.checked) ? "none" : "";
			}
	}
	
	if(stat.name == "set_stop") {
		for(var i=1; i<5; i++)
			if(document.getElementById("ttl_" + i)) {
				document.getElementById("ttl_" + i).style.display = (stat.checked) ? "none" : "";
			}
		
		if(document.getElementById("ttl_0")) {
			document.getElementById("ttl_0").style.display = (stat.checked) ? "" : "none";
		}
	}
}
</script>
<table class=table_comm width=660 align=center style="margin-top: 17px;">
	<tr>
	<td class=td_comm colspan=4>
		<table width=100% class=table_comm style="border: none;" border=0>
			<tr height=30>
			<td width=190>{SERVICECURRENTTIME}{COLON}</td>
			<td width=40><input type=checkbox name=set_now onClick="showTime(this)" value=1 {SETNOWCHECK}></td>
			<td id="tt_1" style="width:40px; {SETNOTNOWVISIBLE}"><button id="tmf" class=img_button onClick="Calendar.show(this,'yf','mf','df'); return false;"><img src="images/cal.gif" border=0></button></td>
			<td id="tt_2" style="width:110px; {SETNOTNOWVISIBLE}"><select id="yf" name=year style="width: 100px;">{OPTIONYEARFROM}</select></td>
			<td id="tt_3" style="width: 110px; {SETNOTNOWVISIBLE}"><select id="mf" name=month style="width: 100px;">{OPTIONMONTHFROM}</select></td>
			<td id="tt_4" style="width:110px; {SETNOTNOWVISIBLE}"><select id="df" name=day style="width: 100px;">{OPTIONDAYFROM}</select></td>
			<td>&nbsp;</td>
			</tr>
			<tr height=30>
			<td width=190>{SERVICETOSTOP}{COLON}</td>
			<td width=40><input type=checkbox name=set_stop onClick="showTime(this)" value=1 title="{SERVICETIMEUNLIM}" {SETSTOPCHECK}></td>
			<td id="ttl_1" style="width:40px; {STOPVISIBLE}"><button id="tmt" class=img_button onClick="Calendar.show(this,'yt','mt','dt'); return false;"><img src="images/cal.gif" border=0></button></td>
			<td id="ttl_2" style="width:110px; {STOPVISIBLE}"><select id="yt" name=year_stop style="width: 100px;">{OPTIONYEARTILL}</select></td>
			<td id="ttl_3" style="width: 110px; {STOPVISIBLE}"><select id="mt" name=month_stop style="width: 100px;">{OPTIONMONTHTILL}</select></td>
			<td id="ttl_4" style="width:110px; {STOPVISIBLE}"><select id="dt" name=day_stop style="width: 100px;">{OPTIONDAYTILL}</select></td>
			<td>&nbsp;<span id="ttl_0" style="{STOPDESCRVISIBLE}">({SERVICETIMEUNLIM})</span></td>
			</tr>
		</table>
		
		<table width=100% class=table_comm style="border: none;" border=0>
			<tr height=30>
			<td width=190>{SERVICEONDUPLICATE}{COLON}</td>
			<td><input type=checkbox name=onduplicate value=1 {ONDUPLICATE}></td>
			</tr>
			<tr height=30>
			<td width=190>{SERVICEQUANTITY}{COLON}</td>
			<td><input type=text name=mul style="width: 150px;"></td>
			</tr>
			<tr height=30>
			<td width=190>{SCENERY}{COLON}</td>
			<td><select name=rent_mode style="width: 220px;">
				<option value=-1>{HD_NOT_CHOOSE}</option>
				<option value=0>1. {IVOXRENTMODE_0}</option>
				<option value=1>2. {IVOXRENTMODE_1}</option>
				<option value=2>3. {IVOXRENTMODE_2}</option>
				<option value=3>4. {IVOXRENTMODE_3}</option>
				<option value=4>5. {IVOXRENTMODE_4}</option>
			</select>
			</td>
			</tr>
		</table>
	</td>
	</tr>
	<tr height=22>
		<td class=td_comm style="padding-left: 10px" colspan=4>
		<table width=100% class=table_comm style="border: none;">
		<tr><td width=50%>{CPNVALUE}</td>
		<td align=right width=50%>{TOSHOW}&nbsp;{ZAPNASTR}&nbsp;
		<select name=rows_on_page onChange="rowsReorder(this.form)">
		<!-- BEGIN rowsonpage --><option value="{ROWSVALUE}" {ROWSSELECTED}>{ROWSDISPL}</option><!-- END rowsonpage -->
		</select>
		</td></tr>
		</table></td>
	</tr>
	<tr height=22>
		<td class=td_head width=40>&nbsp;</td>
		<td class=td_head width=120>{SERVICECODE}</td>
		<td class=td_head>{SERVICENAME}</td>
		<td class=td_head width=120>{PRICE} ({SYMBOL})</td>
	</tr>
	<!-- BEGIN if_period_item -->
	<tr height=22 align=center>
		<td class=td_bott width=40><input type=checkbox name=zonenum[] value="{ZONEID}"></td>
		<td class=td_bott width=120>{ZONENUM}</td>
		<td class=td_bott>{ZONENAME}</td>
		<td class=td_comm width=120>{ZONEPRICE}</td>
	</tr>
	<!-- END if_period_item -->
</table>
<!-- END if_period -->
</form>
</body>
</html>