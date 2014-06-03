<script language="JavaScript" src="js/calendar.js"></script>
<script>
var Calendar = new DHTMLCalendar.init();
Calendar.initWeekDayNames("{MONDAY}","{TUESDAY}","{WEDNESDAY}","{THURSDAY}","{FRIDAY}","{SATURDAY}","{SUNDAY}");
Calendar.initMonthNames("{JANUARY}","{FEBRUARY}","{MARCH}","{APRIL}","{MAY}","{JUNE}","{JULY}","{AUGUST}","{SEPTEMBER}","{OCTOBER}","{NOVEMBER}","{DECEMBER}");

function addService( form )
{
	if(!form) form = document.forms[1];
	
	var url = "ivox_service_add.php";
	form.action = url;
	form.target = "_child";
	
	var childWin = window.open(url, "_child", "width=700, height=600, resizable=yes, status=no, menubar=no, scrollbars=yes, screenX=100, screenY=100");
	form.submit();
	childWin.focus();
	
	form.action = "";
	form.target = "";
}

function setValue( id, value )
{
	if(!document.getElementById(id)) return false;
	document.getElementById(id).value = value;
}

function rowsReorder(form)
{
	if(!form) form = document.forms[1];
	if(form.c_p_n1) form.c_p_n1.value = 1;
	form.submit();
}
</script>

<form method=post name=service_control>
<input type=hidden name=devision value=106>
<input type=hidden id="imode" name=mode value="{MODEVALUE}">
<input type=hidden id="itype" name=ivox_service_type value="{ITYPE}">
<input type=hidden id="vgid" name=vg_id value=0>
<input type=hidden id="tarid" name=tar_id value=0>

<table cellspacing=0 cellpadding=0 align=center width=960 class=table_comm>
	<tr height=25 class=th_comm>
		<th class=td_head colspan={COLSPAN}>{MEN_SERVICES}</th>
	</tr>
	
	<tr height=40>
		<!-- BEGIN btn_list -->
		<td width=25% class=<!-- BEGIN list_comm -->td_comm<!-- END list_comm --><!-- BEGIN list_bott -->td_bott<!-- END list_bott -->>
			&nbsp;<button class=img_button onclick="setValue('itype',0); setValue('imode',0);" type=submit><img title="{BACK_2_LIST}" name="create_new" border=0 src="images1/add_1.gif"></img></button>
			<b>{BACK_2_LIST}</b>
			
		</td><!-- END btn_list -->
		<!-- BEGIN btn_add -->
		<td class=<!-- BEGIN add_comm -->td_comm<!-- END add_comm --><!-- BEGIN add_bott -->td_bott<!-- END add_bott -->>
			&nbsp;<button class=img_button <!-- BEGIN call_add -->onClick="document.forms[1].vg_id.value='0'; addService();" type=button<!-- END call_add --><!-- BEGIN call_vgList -->onClick="setValue('imode', 1);" type=submit<!-- END call_vgList --> title="{SERVICEADDTOGROUP}" id=gr2srv><img title="{SERVICEADDTOGROUP}" name="create_new" border=0 <!-- BEGIN def_add_img -->src="images1/create1.gif"<!-- END def_add_img --> <!-- BEGIN acc_list_add -->src="images1/acclist.gif"<!-- END acc_list_add -->></img></button>
			<b>{SERVICEADDTOGROUP}</b>
		</td><!-- END btn_add -->
	</tr>
	<!-- BEGIN filter -->
	<tr>
		<td colspan={COLSPAN} class=td_comm>
		<!-- BEGIN filter_timer -->
		<table width=100% class=table_comm style="border: none;" border=0>
			<tr align=center height=30>
			<td class=td_head width=30>{TIMEFROM}</td>
			<td class=td_bott width=40><button id="tmf" class=img_button onClick="Calendar.show(this,'yf','mf','df'); return false;"><img src="images/cal.gif" border=0></button></td>
			<td class=td_bott width=110><select id="yf" name=yearfrom style="width: 100px;">{OPTIONYEARFROM}</select></td>
			<td class=td_bott width=110><select id="mf" name=monthfrom style="width: 100px;">{OPTIONMONTHFROM}</select></td>
			<td class=td_comm width=110><select id="df" name=dayfrom style="width: 100px;">{OPTIONDAYFROM}</select></td>
			<td class=td_head width=30>{TIMETO}</td>
			<td class=td_bott width=40><button id="tmt" class=img_button onClick="Calendar.show(this,'yt','mt','dt'); return false;"><img src="images/cal.gif" border=0></button></td>
			<td class=td_bott width=110><select id="yt" name=yearto style="width: 100px;">{OPTIONYEARTO}</select></td>
			<td class=td_bott width=110><select id="mt" name=monthto style="width: 100px;">{OPTIONMONTHTO}</select></td>
			<td class=td_bott width=110><select id="dt" name=dayto style="width: 100px;">{OPTIONDAYTO}</select></td>
			<td class=td_bott align=right><button type=submit name=show_list class=img_button title="{SEARCH}"><img src="images/search.png" title="{SEARCH}"></button></td>
			</tr>
		</table>
		<!-- END filter_timer -->
		<table width=100% class=table_comm style="border: none;" border=0>
			<!-- BEGIN filter_usr_prop -->
			<tr height=30>
			<td width=20%>
				<select name=sch_opt_1[] style="width: 170px;">
				<!-- BEGIN sel_sch_opt_1 --><option value="{SEARCHOPT_VAL_1}" {SEARCHOPT_SEL_1}>{SEARCHOPT_DESC_1}</option><!-- END sel_sch_opt_1 -->
				</select>
			</td>
			<td width=30%><input type=text name=sch_opt_1[] style="width: 250px;" value="{SCHOPT_1_VALUE}"></td>
			<td>{GROUPBYTARIF}{COLON}</td>
			<td>
				<select name=group_by_tarif style="width: 300px;" onChange="javascript: if(this.value <= 0 && document.getElementById('gr2srv')) { document.getElementById('gr2srv').parentNode.innerHTML = '&nbsp;' }">
				<!-- BEGIN bytarif --><option value="{GRTARIFVALUE}" {GRTARIFSELECTED}>{GRTARIFNAME}</option><!-- END bytarif -->
				</select>
			</td>
			<!-- BEGIN show_list_2 --><td align=right><button type=submit name=show_list class=img_button title="{SEARCH}"><img src="images/search.png" title="{SEARCH}"></button></td><!-- END show_list_2 -->
			</tr>
			<!-- END filter_usr_prop -->
			<!-- BEGIN filter_cat_prop -->
			<tr>
			<td width=20%>
				<select name=sch_opt_2[] style="width: 170px;">
				<!-- BEGIN sel_sch_opt_2 --><option value="{SEARCHOPT_VAL_2}" {SEARCHOPT_SEL_2}>{SEARCHOPT_DESC_2}</option><!-- END sel_sch_opt_2 -->
				</select>
			</td>
			<td width=30%><input type=text name=sch_opt_2[] style="width: 250px;" value="{SCHOPT_2_VALUE}"></td>
			<td colpsna=2>&nbsp;</td>
			</tr>
			<!-- END filter_cat_prop -->
		</table>
		</td>
	</tr>
	<!-- END filter -->
</table>

<!-- BEGIN messages -->
<table class=table_comm width=960 align=center style="margin-top: 17px;">
	<!-- BEGIN messages_item -->
	<tr height=22 style="font-weight:none;<!-- BEGIN warn -->color:red;<!-- END warn --><!-- BEGIN ok -->color:green;<!-- END ok -->">
	<td class=td_comm>{MESSAGE_TEXT}</td><td class=td_comm width=70 align=center>{MESSAGE_STATUS}</td>
	</tr>
	<!-- END messages_item -->
</table>
<!-- END messages -->

<!-- BEGIN quickSrv_lines -->
<input type=hidden id="sch_1" name=sch_opt_1[]>
<input type=hidden id="sch_2" name=sch_opt_1[]>
<input type=hidden id="yf" name=yearfrom>
<input type=hidden id="mf" name=monthfrom>
<input type=hidden id="df" name=dayfrom>
<table class=table_comm width=960 align=center style="margin-top: 17px;">
	<tr height=25 class=th_comm>
		<th class=td_head colspan=2>{IVOXSERVICELAST}</th>
	</tr>
	<tr height=22 style="text-align: center;">
		<td class=td_head width=50%>{CAT_TYPE_3} (<span style="cursor: pointer;" onmouseover="this.style.textDecoration='underline'; this.style.color='red';" onmouseout="this.style.textDecoration=''; this.style.color=''" onclick="setValue('imode', 2); setValue('itype', 1); document.forms[1].submit();" href="#">{MORE_MORE}...</span>)</td>
		<td class=td_head>{CAT_TYPE_4} <span style="cursor: pointer;" onmouseover="this.style.textDecoration='underline'; this.style.color='red';" onmouseout="this.style.textDecoration=''; this.style.color=''" onclick="setValue('imode', 2); setValue('itype', 2); document.forms[1].submit();" href="#">({MORE_MORE}...)</span></td>
	</tr>
	<tr>
		<td class=td_comm>
		<table cellpadding=0 cellspacing=0 border=0 width=100% class=table_comm>
			<tr align=center style="font-weight: bold;">
			<td class=td_comm width=80>{ISDATE}</td>
			<td class=td_comm>{ISUSER}</td>
			<td class=td_comm>{AGENTUSER}</td>
			<td class=td_comm width=50>{COUNTSERVICE}</td>
			</tr>
			<!-- BEGIN onceSrv_line --><tr align=center>
			<td class=td_comm>&nbsp;<!-- BEGIN onceSrv_line_date --><span style="cursor: pointer; text-decoration: underline;" onmouseover="this.style.color='red';" onmouseout="this.style.color=''" onClick="setValue('sch_1',1); setValue('sch_2','{ONCEUSERACCOUNT}'); setValue('yf','{HYEAR}'); setValue('mf','{HMONTH}'); setValue('df','{HDAY}'); setValue('itype', 1); setValue('imode', 2);  document.forms[1].submit()">{ONCEUSERDATE}</span><!-- END onceSrv_line_date --></td>
			<td class=td_comm>{ONCEUSERNAME}</td>
			<td class=td_comm>&nbsp;<!-- BEGIN onceSrv_line_acc --><span style="cursor: pointer; text-decoration: underline;" onmouseover="this.style.color='red';" onmouseout="this.style.color=''" onClick="setValue('sch_1',1); setValue('sch_2','{ONCEUSERACCOUNT}'); setValue('itype', 1); setValue('imode', 2); document.forms[1].submit()">{ONCEUSERACCOUNT}</span><!-- END onceSrv_line_acc --></td>
			<td class=td_comm>{ONCEUSERCOUNT}</td>
			</tr><!-- END onceSrv_line -->
		</table>
		</td>
		<td class=td_comm>
		<table cellpadding=0 cellspacing=0 border=0 width=100% class=table_comm>
			<tr align=center style="font-weight: bold;">
			<td class=td_comm width=80>{ISDATE}</td>
			<td class=td_comm>{ISUSER}</td>
			<td class=td_comm>{AGENTUSER}</td>
			<td class=td_comm width=50>{COUNTSERVICE}</td>
			</tr>
			<!-- BEGIN periodSrc_line --><tr align=center>
			<td class=td_comm>&nbsp;<!-- BEGIN periodSrc_line_date --><span style="cursor: pointer; text-decoration: underline;" onmouseover="this.style.color='red';" onmouseout="this.style.color=''" onClick="setValue('sch_1',1); setValue('sch_2','{PERIODACCOUNT}'); setValue('yf','{HYEAR}'); setValue('mf','{HMONTH}'); setValue('df','{HDAY}'); setValue('itype', 2); setValue('imode', 2);  document.forms[1].submit()">{PERIODUSERDATE}</span><!-- END periodSrc_line_date --></td>
			<td class=td_comm>{PERIODUSERNAME}</td>
			<td class=td_comm>&nbsp;<!-- BEGIN periodSrc_line_acc --><span style="cursor: pointer; text-decoration: underline;" onmouseover="this.style.color='red';" onmouseout="this.style.color=''" onClick="setValue('sch_1',1); setValue('sch_2','{PERIODACCOUNT}'); setValue('itype', 2); setValue('imode', 2); document.forms[1].submit()">{PERIODACCOUNT}</span><!-- END periodSrc_line_acc --></td>
			<td class=td_comm>{PERIODUSERCOUNT}</td>
			</tr><!-- END periodSrc_line -->
		</table>
		</td>
	</tr>
</table>
<!-- END quickSrv_lines -->

<!-- BEGIN onceSrv_list -->
<table class=table_comm width=960 align=center style="margin-top: 17px;">
	<tr height=25 class=th_comm>
		<th class=td_head colspan=8>{THISDETAILS}{COLON} {CAT_TYPE_3}</th>
	</tr>
	<!-- BEGIN onceSrv_list_none -->
	<tr height=40>
	<td class=td_comm style="color: red; text-align: center;">{NODATA}</td>
	</tr>
	<!-- END onceSrv_list_none -->
	<!-- BEGIN onceSrv_list_head -->
	<tr height=22>
		<td class=td_comm style="padding-left: 10px" colspan=8>
		<table width=100%>
		<tr><td width=50%>{CPNVALUE}</td>
		<td align=right width=50%>{PAGESELECTOR}</td></tr>
		</table></td>
	</tr>
	<tr height=20>
		<td class=td_head width=120>{ISDATE}</td>
		<td class=td_head width=150>{USER}</td>
		<td class=td_head width=110>{AGENTUSER}</td>
		<td class=td_head>{SERVICENAME}</td>
		<td class=td_head>{SERVICEQUANTITY}</td>
		<td class=td_head>{COMMENTS}</td>
		<td class=td_head width=130>{THISMADEBY}</td>
		<td class=td_head width=40>&nbsp;</td>
	</tr>
	<!-- END onceSrv_list_head -->
	<!-- BEGIN onceSrv_list_item -->
	<tr height=20 align=center>
		<td class=td_bott>{COL1}</td>
		<td class=td_bott>{COL2}</td>
		<td class=td_bott><span style="cursor: pointer; text-decoration: underline;" onmouseover="this.style.color='red';" onmouseout="this.style.color=''" onClick="document.forms[1].tar_id.value='{TARID}'; document.forms[1].vg_id.value='{VGID}'; addService();">{COL3}</span></td>
		<td class=td_bott title="{CATALOG}{COLON} {COL4TITLE1} / {TAR_ONE}{COLON} {COL4TITLE2}">{COL4}</td>
		<td class=td_bott>{COL5}</td>
		<td class=td_bott>{COL6}</td>
		<td class=td_bott>{COL7}</td>
		<td class=td_comm>
		<!-- BEGIN onceSrv_drop --><button type=submit class=img_button title="{DELETE3}" name=drop_this[{RECORD_VGID}][{RECORD_DATE}][{RECORD_LINE}]><img title="{DELETE3}" border=0 src="images1/delete.gif"></button><!-- END onceSrv_drop -->
		<!-- BEGIN onceSrv_none_drop -->-<!-- END onceSrv_none_drop -->
		</td>
	</tr>
	<!-- END onceSrv_list_item -->
</table>
<!-- END onceSrv_list -->

<!-- BEGIN periodSrv_list -->
<table class=table_comm width=960 align=center style="margin-top: 17px;">
	<tr height=25 class=th_comm>
		<th class=td_head colspan=8>{THISDETAILS}{COLON} {CAT_TYPE_4}</th>
	</tr>
	<!-- BEGIN periodSrv_list_none -->
	<tr height=40>
	<td class=td_comm style="color: red; text-align: center;">{NODATA}</td>
	</tr>
	<!-- END periodSrv_list_none -->
	<!-- BEGIN periodSrv_list_head -->
	<tr height=22>
		<td class=td_comm style="padding-left: 10px" colspan=8>
		<table width=100%>
		<tr><td width=50%>{CPNVALUE}</td>
		<td align=right width=50%>{PAGESELECTOR}</td></tr>
		</table></td>
	</tr>
	<tr height=20>
		<td class=td_head width=140>{ISDATE}</td>
		<td class=td_head width=150>{USER}</td>
		<td class=td_head width=110>{AGENTUSER}</td>
		<td class=td_head>{SERVICENAME}</td>
		<td class=td_head>{SERVICEQUANTITY}</td>
		<td class=td_head>{SCENERY}</td>
		<td class=td_head width=130>{THISMADEBY}</td>
		<td class=td_head width=40>&nbsp;</td>
	</tr>
	<!-- END periodSrv_list_head -->
	<!-- BEGIN periodSrv_list_item -->
	<tr height=20 align=center>
		<td class=td_bott>
			<table class=table_comm style="border: none;" cellpadding=0 cellspacing=0 width=100%>
			<tr><td width=25>{TIMEFROM}</td><td>{COL1}</td></tr>
			<tr><td width=25>{TIMETO}</td><td>{COLTILL}</td></tr>
			</table>
		</td>
		<td class=td_bott>{COL2}</td>
		<td class=td_bott><span style="cursor: pointer; text-decoration: underline;" onmouseover="this.style.color='red';" onmouseout="this.style.color=''" onClick="document.forms[1].tar_id.value='{TARID}'; document.forms[1].vg_id.value='{VGID}'; addService();">{COL3}</span></td>
		<td class=td_bott title="{CATALOG}{COLON} {COL4TITLE1} / {TAR_ONE}{COLON} {COL4TITLE2}">{COL4}</td>
		<td class=td_bott>{COL7}</td>
		<td class=td_bott>{COL5}</td>
		<td class=td_bott>{COL6}</td>
		<td class=td_comm>
		<!-- BEGIN periodSrv_drop --><button type=submit class=img_button title="{DELETE3}"  name=drop_this[{RECORD_VGID}][{RECORD_DATE}][{RECORD_LINE}]><img title="{DELETE3}" border=0 src="images1/delete.gif"></button><!-- END periodSrv_drop -->
		<!-- BEGIN periodSrv_none_drop -->-<!-- END periodSrv_none_drop -->
		</td>
	</tr>
	<!-- END periodSrv_list_item -->
</table>
<!-- END periodSrv_list -->

<!-- BEGIN ivox_vgList -->
<table class=table_comm width=960 align=center style="margin-top: 17px;">
	<tr height=25 class=th_comm>
		<th class=td_head colspan=10>{GROUPS}</th>
	</tr>
	<!-- BEGIN ivox_vgList_none -->
	<tr height=40>
	<td class=td_comm style="color: red; text-align: center;">{NODATA}</td>
	</tr>
	<!-- END ivox_vgList_none -->
	<!-- BEGIN ivox_vgList_head -->
	<tr height=22>
		<td class=td_comm style="padding-left: 10px" colspan=10>
		<table width=100% class=table_comm style="border: none;">
		<tr><td width=50%>{CPNVALUE}</td>
		<td align=right width=50%>{TOSHOW}&nbsp;{ZAPNASTR}&nbsp;
		<select name=rows_on_page onChange="rowsReorder(this.form)">
		<!-- BEGIN rowsonpage --><option value="{ROWSVALUE}" {ROWSSELECTED}>{ROWSDISPL}</option><!-- END rowsonpage -->
		</select></td></tr>
		</table></td>
	</tr>
	<tr height=22>
		<td class=td_head width=40>{CATTYPESHORTONCE}</td>
		<td class=td_head width=40>{CATTYPESHORTPER}</td>
		<td class=td_head width=180>{ISUSER}</td>
		<td class=td_head width=125>{AGENTUSER}</td>
		<td class=td_head width=75>{COUNTSERVICE}</td>
		<td class=td_head width=40>{CATTYPESHORTONCE}</td>
		<td class=td_head width=40>{CATTYPESHORTPER}</td>
		<td class=td_head width=180>{ISUSER}</td>
		<td class=td_head width=125>{AGENTUSER}</td>
		<td class=td_head>{COUNTSERVICE}</td>
	</tr>
	<!-- END ivox_vgList_head -->
	<!-- BEGIN ivox_vgList_row -->
	<tr align=center height=23>
		<td class=td_comm width=40><!-- BEGIN ivox_b_1 -->&nbsp;<!-- END ivox_b_1 -->
		<!-- BEGIN ivox_row_once_1 --><button type=button onClick="setValue('tarid','{TARID}'); setValue('vgid', '{VGID}'); setValue('itype',1); addService();" class=img_button title="{CAT_TYPE_3}"><img title="{CAT_TYPE_3}" name="edit" border=0 src="images1/edit_15.gif"></img></button><!-- END ivox_row_once_1 -->
		</td>
		<td class=td_comm width=40><!-- BEGIN ivox_b_2 -->&nbsp;<!-- END ivox_b_2 -->
		<!-- BEGIN ivox_row_period_1 --><button type=button onClick="setValue('tarid','{TARID}'); setValue('vgid', '{VGID}'); setValue('itype',2); addService();" class=img_button title="{CAT_TYPE_4}"><img title="{CAT_TYPE_4}" name="edit" border=0 src="images1/edit_15.gif"></img></button><!-- END ivox_row_period_1 -->
		</td>
		<td class=td_comm width=180>{COL_1}</td>
		<td class=td_comm width=130>{COL_2}</td>
		<td class=td_comm width=70>{COL_3}</td>
		<td class=td_comm width=40><!-- BEGIN ivox_b_3 -->&nbsp;<!-- END ivox_b_3 -->
		<!-- BEGIN ivox_row_once_2 --><button type=button class=img_button title="{CAT_TYPE_3}" onClick="setValue('tarid','{TARID}'); setValue('vgid', '{VGID}'); setValue('itype',1); addService();"><img title="{CAT_TYPE_3}" name="edit" border=0 src="images1/edit_15.gif"></img></button><!-- END ivox_row_once_2 -->
		</td>
		<td class=td_comm width=40><!-- BEGIN ivox_b_4 -->&nbsp;<!-- END ivox_b_4 -->
		<!-- BEGIN ivox_row_period_2 --><button type=button onClick="setValue('tarid','{TARID}'); setValue('vgid', '{VGID}'); setValue('itype',2); addService();" class=img_button title="{CAT_TYPE_4}"><img title="{CAT_TYPE_4}" name="edit" border=0 src="images1/edit_15.gif"></img></button><!-- END ivox_row_period_2 -->
		</td>
		<td class=td_comm width=180>{COL_4}</td>
		<td class=td_comm width=130>{COL_5}</td>
		<td class=td_comm>{COL_6}</td>
	</tr>
	<!-- END ivox_vgList_row -->
</table>
<!-- END ivox_vgList -->
</form>