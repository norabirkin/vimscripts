<!--
{VG_ACTION_TITLE} - Заголовок, в зависимости от того редактируем или создаем уч запись будет разным
{VG_LOGIN}        - Логин уч записи 
{VG_DESCR}        - Описание уч записи
{VG_PASS}         - Пароль уч записи
{VG_AG_VAL}       - id агента
{VG_AG_SEL}       - selected либо ""
{VG_AG_NAME}      - Название агента
{VG_USER_VAL}     - uid пользователя
{VG_USER_SEL}     - selected либо ""
{VG_USER_NAME}    - Название пользователя
{VG_USER_SEARCH}  - Значение в поле поиска по пользователю
{VG_PLAT_COMMENT} - Описание платежа
-->

<!-- BEGIN vg_edit_tab -->
<link rel="stylesheet" type="text/css" href="resources/extjs/resources/css/ext-all.css">
<link rel="stylesheet" type="text/css" href="resources/extjs/resources/css/xtheme-gray-extend.css">
<script type="text/javascript" src="resources/extjs/adapter/ext/ext-base.js"></script>
<script type="text/javascript" src="resources/extjs/ext-all.js"></script>
<script language="JavaScript">
var is_mac_shown=0;
var field_is_empty = '{FIELDISEMPTY}';
var record_exists = '{RECORDALREADYSETTOLIST}';
var Localize = { Status: '{STATUS}', Title: '{T_TITLE}', Last: '{HD_LAST}', Responsible: '{HD_CHANGE_MAN}', PanelTitle: '{REQUESTFORTHISVGID}' }

function show_mac_addr()
{
	if(is_mac_shown == 0)
	{
		is_mac_shown = 1;
		document.getElementById("mac_addr_div").style.display = "block";	
	}
	else
	{
		is_mac_shown = 0;
		hide_mac_addr();
	}
};

function hide_mac_addr()
{
	document.getElementById("mac_addr_div").style.display = "none";	
};

function select_user_win()
{
	w1=window.open ("select_user.php",'_sel_user','width=670,height=450,resizable=yes,status=no,menubar=no,scrollbars=yes');
      w1.focus();
};

function modifyBlkReq(form)
{
	if(!form) return false;
	if(form.acc_onflag.value == 0) return false;
	
	var now = new Date();
	var onn = new Date();
	if(form.pl_year.value > 0) onn.setYear( form.pl_year.value );
	if(form.pl_month.value > 0) onn.setMonth( form.pl_month.value - 1 );
	if(form.pl_date.value > 0) onn.setDate( form.pl_date.value );
	
	var off = new Date();
	if(document.getElementById("plan_off_0").value > 0) off.setYear( document.getElementById("plan_off_0").value );
	if(document.getElementById("plan_off_1").value > 0) off.setMonth( document.getElementById("plan_off_1").value - 1 );
	if(document.getElementById("plan_off_2").value > 0) off.setDate( document.getElementById("plan_off_2").value );
	
}

function showVgIDRent( vgId )
{
	if(typeof vgId == 'undefined') return false;
	
	var vgIdDataStore;
	var vgIdColumnModel;
	var vgIdListingEditorGrid;
	var vgIdListingWindow;
	
	vgIdDataStore = new Ext.data.Store({
		id: 'vgIdDataStore',
		proxy: new Ext.data.HttpProxy({
			url: 'config.php',
			method: 'POST'
		}),
		baseParams:{async_call: 4, vgid: vgId},
		reader: new Ext.data.JsonReader({
			root: 'results',
			totalProperty: 'total',
			id: 'id'
		},[ 
			{name: 'date', type: 'date', mapping: 'date'},
			{name: 'amount', type: 'float', mapping: 'amount'},
			{name: 'tarif', type: 'string', mapping: 'tarif'}, 
			{name: 'rentcode', type: 'int', mapping: 'rentcode'} 
		]),
		sortInfo:{field: 'date', direction: "ASC"}
	});
	
	vgIdColumnModel = new Ext.grid.ColumnModel(
		[{
			header: '{N_DATE}',
			readOnly: true,
			dataIndex: 'date',
			width: 160,
			hidden: false,
			renderer: Ext.util.Format.dateRenderer('Y-m-d')
		},{
			header: '{DISCARDING}',
			dataIndex: 'amount',
			width: 180,
			readOnly: true
		},{
			header: '{TARPLAN}',
			dataIndex: 'tarif',
			width: 220,
			readOnly: true
		},{
			header: '{SCENERYCODE}',
			dataIndex: 'rentcode',
			width: 100,
			readOnly: true
		}]
	);
	
	vgIdColumnModel.defaultSortable= true;
	
	vgIdListingEditorGrid = new Ext.grid.EditorGridPanel({
		id: 'vgIdListingEditorGrid',
		store: vgIdDataStore,
		cm: vgIdColumnModel,
		enableColLock: false,
		clicksToEdit:1,
		selModel: new Ext.grid.RowSelectionModel({singleSelect:false}),
		bbar: new Ext.PagingToolbar({
			pageSize: 50,
			store: vgIdDataStore,
			displayInfo: true
		})
	});
	
	vgIdListingWindow = new Ext.Window({
		id: 'vgIdListingWindow',
		title: '{CHARGEHISTORY0} {USERSPAYMENTSHORT0}',
		closable:true,
		width:720,
		height:350,
		plain:true,
		layout: 'fit',
		items: vgIdListingEditorGrid
	});
	
	vgIdDataStore.reload({params: {start: 0, limit: 50}});
	vgIdListingWindow.show();
	
	<!-- BEGIN showMess -->Ext.MessageBox.alert('{MESSAGE}', '{NOTAVALIABLESCENARIES_34}');<!-- END showMess -->
}
</script>


 
<script>
function active_ord1 ( url )
{
    w1=window.open (url,'_cat','width=550,height=350,resizable=yes,status=no,menubar=no,scrollbars=yes,screenX=260,screenY=100');
   w1.focus();
};

function active_ord2 ( url )
{
    w1=window.open (url,'_cat','width=880,height=500,resizable=yes,status=no,menubar=no,scrollbars=yes,screenX=100,screenY=100');
   w1.focus();
};
</script>

<input type="hidden" name="whatmode" value="{WHATMODE}"> 
<input type="hidden" name="vg_id" value="{VG_TO_EDIT}"> 
<input type="hidden" name="first_on_page" value="{F_ON_P}">
<input type="hidden" name="restore_db" value="1">
<input type="hidden" name="blk_req" value="0">
<input type="hidden" name="acc_onflag" value="{ACC_ONFLAG}">
<table class="table_comm" align="center" width="980" style="border-left:none; ">
<!-- Заголовок -->
 <tr>
  <td colspan=4 height=30 bgcolor="#e0e0e0" style="border: solid 1px #c0c0c0;border-right: solid 1px #c0c0c0;" >
  <table width="100%" ><tr><td align='center' class=z11><!-- BEGIN vg_title --><b>{VG_ACTION_TITLE}<b><!-- END vg_title --></td>
  <!-- BEGIN rentChargeHist --><td width="30">&nbsp;</td><!-- END rentChargeHist -->
  
  </tr>
   </table>
  </td>
 </tr>
 
 <tr>
  <th class="empty_back" colspan=4 height=10 >&nbsp;</th>
 </tr>

<!-- BEGIN crmPanelShow -->
 <tr>
  <td colspan=3 $height=10 class=z11 id='crmPanel'></td>
 </tr>
 <tr>
  <th  class="empty_back" colspan=3 height=10 class=z11>&nbsp;</th>
 </tr>
<script language="javaScript" type="text/javascript" src="js/sbss_crm.js"></script>
<script language="javascript">sbssVgroupLinked('crmPanel', '{CRMVGID}');</script>
<!-- END crmPanelShow -->

 <tr height="22"><td colspan=3 bgcolor="#e0e0e0" style="border: solid 1px #c0c0c0; text-align: center" class=z11><b>Основные параметры</b></td></tr>
  
<!-- Данные об уч записи (пароль, логин, описание) -->
 <tr height="22" align='center'>
  <td width=25% class=z11 style="border: solid 1px #c0c0c0; border-top: none;"><b>Логин</b></td>
  <td width=25% class=z11 style="border: solid 1px #c0c0c0; border-top: none; border-left: none;"><b>Пароль</b></td>
  <td width=50% class=z11 style="border: solid 1px #c0c0c0; border-top: none; border-left: none;"><b>Описание</b></td>
 </tr>
 <tr>
 <!-- BEGIN vg_attrs -->
  <td width=25% align="center" height=30 class=z11 style="border: solid 1px #c0c0c0; border-top: none;">
   <input type="text" class=z11 name=vg_login size="31" value='{VG_LOGIN}'>
  </td>
  <td width=25% align="center" height=30 class=z11 style="border: solid 1px #c0c0c0; border-top: none; border-left: none;">
   <input type="{FIELD_TYPE}" class=z11 name=vg_pass size="31" value='{VG_PASS}' onfocus="javascript: if(this.type == 'password') { this.value=''; document.forms['vgroup'].vg_pass_chg.value=1; }">
  </td>

  <!-- BEGIN vg_pass_java -->
  <input type=hidden name=pass_hide value=1>
  <input type=hidden name=vg_pass_chg value=0>
  <script language="javascript">
    for(var i=0;i<={VG_PASS_JV};i++) document.forms['vgroup'].vg_pass.value = document.forms['vgroup'].vg_pass.value + '*';
  </script>
  <!-- END vg_pass_java -->

  <td width=50% align="center" height=30 class=z11 style="border: solid 1px #c0c0c0; border-top: none; border-left: none;">
   <input type="text" class=z11 name=vg_desc size="65" value='{VG_DESCR}'>
  </td>
 <!-- END vg_attrs -->
 </tr>

<!-- Выбор агента и пользователя которому принадлежит данная уч запись -->
 <tr height="22" align='center'>
  <td width=25% class=z11 style="border: solid 1px #c0c0c0; border-top: none;"><b>Сетевой агент</b></td>
  <td width=75% class=z11 style="border: solid 1px #c0c0c0; border-top: none; border-left: none;" colspan=2><b>Принадлежит пользователю:</b>
   <!-- BEGIN go_to_user -->
   <input type="hidden" name="edit_user" value="1">
   <input type="hidden" name="uid" value="{CURR_UID}">
   <!-- END go_to_user -->
  </td>
 </tr>
 <tr>
  <td width=25% align="center" class=z11 height="30" style="border: solid 1px #c0c0c0; border-top: none;">
  <!-- BEGIN vg_ag_list -->
   <select name=vg_agent style="width: 200px;" class=z11 onChange="document.forms['vgroup'].submit();">
   <!-- BEGIN vg_ag_opt -->
    <option class=z11 value='{VG_AG_VAL}' {VG_AG_SEL}>{VG_AG_NAME}
   <!-- END vg_ag_opt -->
   </select>
  <!-- END vg_ag_list -->
  </td>
  <!-- BEGIN vg_user_list -->
  <td  height="30" style="border: solid 1px #c0c0c0; border-top: none; border-left: none; border-right: none;" align="center">
   <span class="z11" style="cursor: pointer;" onclick="select_user_win();" title="Перейти к редактированию пользователя">
   <font class="z11"><b id="_vg_user_fio_">{VG_USER_NAME}</b></font>
   <input type="hidden" name="vg_user_fio" value="{VG_USER_NAME}">
   </span>
  </td>
  <td align="center" class=z11 height="30" style="border: solid 1px #c0c0c0; border-top: none; border-left: none;">
  
   <input type="hidden" name="vg_user" value="{CURR_UID}">
 <!-- BEGIN Agrms --><select name="agrm_id" style="width: 200px"><!-- BEGIN agrmOpt --><option value="{AGRMID}" {AGRMSEL}>{AGRMNUM}</option><!-- END agrmOpt --></select> <!-- END Agrms -->
  </td>
  <!-- END vg_user_list -->
 </tr>

<!-- BEGIN vg_balance -->
<tr><td  colspan=3>&nbsp;</td></tr>
<tr><td colspan=3 style="border-left: solid 1px #c0c0c0; border-right: solid 1px #c0c0c0;">{BALANCE_FORM}</td></tr>
<!-- END vg_balance -->
 
 <!-- BEGIN vg_options -->
 <input type="hidden" name=vg_conn_db value="{VG_CONN_DB}">
 <tr>
 <td class="empty_back" colspan=4>&nbsp;</td>
 </tr>
 <tr height="22" align='center'><td colspan=4 bgcolor="#e0e0e0" style="border: solid 1px #c0c0c0;" class=z11><b>Опции</b></td></tr> 
 <tr>
  <td colspan=4 class=z11>
   <table cellpadding="0" cellspacing="0" border="0" align="center" width="100%">
   <!-- BEGIN vg_opt_row -->
   <tr>
     <!-- BEGIN vg_opt_col -->
     <td class=z11 height=30 width="25%" style="border: solid 1px #c0c0c0; border-top: none;">
      &nbsp;&nbsp;<font class=z11>{VG_OPT_NAME}</font>
     </td>
     <td class=z11 height=30 width="25%" style="border: solid 1px #c0c0c0; border-top: none; border-left: none;">
      &nbsp;&nbsp;{VG_OPT_VAL}
     </td>
     <!-- END vg_opt_col -->
   </tr>
   <!-- END vg_opt_row -->
   </table>
  </td>
 </tr>
 <!-- END vg_options -->
 
 <!-- BEGIN vg_plane_date -->
 <tr>
 <td class="empty_back" colspan=4>&nbsp;</td>
 </tr>
 <tr height="22" align="center"><td colspan=3 bgcolor="#e0e0e0" style="border: solid 1px #c0c0c0;" class=z11><b>{CONNECT_VG} / {DISCONNECT_VG}</b></td></tr>
 <tr>
  <td colspan=3 style="border: solid 1px #c0c0c0; border-top: none;" class=z11>
    <table cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr height=30>
	<td width=150 class="z11" style="padding-left: 9px; border-bottom: solid 1px #c0c0c0;">{VGLINKEDDATE}:</td>
	<td width=70 style="border-bottom: solid 1px #c0c0c0;">
		<select name=pl_year class=z11 style="width: 60px;">
		<option class=z11 value=-1>{YEAR}</option>
		<!-- BEGIN vg_pd_year -->
		<option class=z11 value={VG_YEAR} {VG_PL_YEAR_SEL}>{VG_YEAR}
		<!-- END vg_pd_year -->
		</select>
	</td>
	<td width=130 style="border-bottom: solid 1px #c0c0c0;">
		<select name=pl_month class=z11 style="width: 120px;">
		<option class=z11 value=-1>{MONTH}</option>
		<!-- BEGIN vg_pd_month -->
		<option class=z11 value="{VGPLMONTH}" <!-- BEGIN monthon_sel -->selected<!-- END monthon_sel -->>{VGPLMONTHNAME}</option>
		<!-- END vg_pd_month -->
		</select>
	</td>
	<td width=70 style="border-bottom: solid 1px #c0c0c0;">
		<select name=pl_date class=z11 style="width: 60px;">
		<option class=z11 value=-1>{DAY}</option>
		<!-- BEGIN vg_pd_day -->
		<option class=z11 value={VG_DAY} {VG_PL_DAY_SEL}>{VG_DAY}
		<!-- END vg_pd_day -->
		</select>
	</td>
	<td width="70" style="border-bottom: solid 1px #c0c0c0;">&nbsp;</td>
	<td style="border-bottom: solid 1px #c0c0c0;" colspan="2">&nbsp;</td>
	</tr>
	<tr height=30>
	<td class="z11" style="padding-left: 9px;">{OFFDATE}:</td>
	<td>
		<select id="plan_off_0" name="plan_dateoff[0]" class=z11 style="width: 60px;">
		<option class=z11 value=-1>Год
		<!-- BEGIN vg_pdoff_year -->
		<option class=z11 value="{VGPDOFFYEAR}" <!-- BEGIN yearoff_sel -->selected<!-- END yearoff_sel -->>{VGPDOFFYEAR}</option>
		<!-- END vg_pdoff_year -->
		</select>
	</td>
	<td>
		<select id="plan_off_1" name=plan_dateoff[1] class=z11 style="width: 120px;">
		<option class=z11 value=-1>{MONTH}</option>
		<!-- BEGIN vg_pdoff_month -->
		<option class=z11 value="{VGPDOFFMONTH}" <!-- BEGIN monthoff_sel -->selected<!-- END monthoff_sel -->>{VGPDOFFMONTHNAME}</option>
		<!-- END vg_pdoff_month -->
		</select>
	</td>
	<td>
		<select id="plan_off_2" name=plan_dateoff[2] class=z11 style="width: 60px;">
		<option class=z11 value=-1>{DAY}</option>
		<!-- BEGIN vg_pdoff_day -->
		<option class=z11 value="{VGPDOFFDAY}" <!-- BEGIN dayoff_sel -->selected<!-- END dayoff_sel -->>{VGPDOFFDAY}</option>
		<!-- END vg_pdoff_day -->
		</select>
	</td>
	<td>
		<select id="plan_off_3" name=plan_dateoff[3] class=z11 style="width: 60px;">
		<option class=z11 value=-1>{HOUR}</option>
		<!-- BEGIN vg_pdoff_hour -->
		<option class=z11 value="{VGPDOFFHOUR}" <!-- BEGIN houroff_sel -->selected<!-- END houroff_sel -->>{VGPDOFFHOUR}</option>
		<!-- END vg_pdoff_hour -->
		</select>
	</td>
	<td>
		<select id="plan_off_4" name=plan_dateoff[4] class=z11 style="width: 70px;">
		<option class=z11 value=-1>{MINUTE}</option>
		<!-- BEGIN vg_pdoff_minute -->
		<option class=z11 value="{VGPDOFFMINUTE}" <!-- BEGIN minuteoff_sel -->selected<!-- END minuteoff_sel -->>{VGPDOFFMINUTE}</option>
		<!-- END vg_pdoff_minute -->
		</select>
       </td>
      </tr>
    </table>
  </td> 
 </tr>
 <!-- END vg_plane_date -->
 
 <!-- BEGIN vg_base_tarif -->
 
 <!-- BEGIN vg_rasp_list -->
 <input type="hidden" name=vg_rasp[{RID}][0] value="{RRECORD}">
 <input type="hidden" name=vg_rasp[{RID}][1] value="{RDATE}">
 <input type="hidden" name=vg_rasp[{RID}][2] value="{RTARID}">
 <!-- END vg_rasp_list -->

 <!-- BEGIN vg_rasp_list_no -->
 <input type="hidden" name=vg_rasp_no[{RNRECORD}] value="{RNDATE}">
 <!-- END vg_rasp_list_no -->

<tr height=22>
	<td class="empty_back" colspan=4>&nbsp;</td>
</tr>
<tr height=22 align="center">
	<td colspan=4 bgcolor="#e0e0e0" style="border: solid 1px #c0c0c0;" class=z11><b>{TARIFFS}</b></td>
</tr>
<tr height="22" align="center">
	<td class=z11 style="border: solid 1px #c0c0c0; border-top: none; border-right: none;"><b>{CURRENTTARIF}</b></td>
	<td colspan="2" class=z11 style="border: solid 1px #c0c0c0; border-top: none;"><b>{TARIFSDUTY}</b></td>
</tr>

<script language="JavaScript">
function select_base_tar( value )
{
	var inputs = document.getElementsByTagName("input");
	var found = false;
	var reg = new RegExp("vg_rasp\\[[0-9]+\\]\\[2\\]");
	for(var i=0; i<inputs.length; i++)
		if(reg.test(inputs[i].name) && inputs[i].value != 0)
		{
			found = true;
		}
	
	if(!found)
	{
		alert('{RASPALERT_3}');
		return false;
	}
}

function check_rasp( form )
{
	if(!form)
	{
		alert("Object form not found!");
		return false;
	}
	
	var _now = new Date();
	if(form.tar_year.value < (_now.getYear() - 1) || (form.tar_month.value * 1) < 1 || (form.tar_day.value * 1) < 1)
	{
		alert('{RASPALERT_1}');
		return false;
	}
	
	var _hour = (form.tar_hour.value * 1 < 0) ? "00" : form.tar_hour.value;
	var _minute = (form.tar_minute.value * 1 < 0) ? "00" : form.tar_minute.value;
	var _setDate = new String(form.tar_year.value + "-" + form.tar_month.value + "-" + form.tar_day.value + " " + _hour + ":" + _minute + ":00");
	var tds = form.getElementsByTagName("td");
	for(var i=0; i<tds.length; i++)
		if(tds[i].id == "rasp_signed" && tds.item(i).firstChild.nodeValue == _setDate)
		{
			alert(_setDate + '{RASPALERT_2}');
			return false;
		}
}

function check_phone_ins( form )
{
	var error;
	if(form.vg_new_tel_num.value=="") error=1;
	
	for(i=0;i<form.vg_assigned_nums.length;i++)
	{
		if(form.vg_assigned_nums.options[i].value==form.vg_new_tel_num.value) error=2;
	}
	
	if(error==1)
	{
		alert(field_is_empty);
		return false;
	}
	
	if(error==2)
	{
		alert(record_exists);
		return false;
	}
	
	if(!error) document.forms['vgroup'].vg_tel_num_modify.value++;
}

</script>

<tr>
	<td align="center" style="border: solid 1px #c0c0c0; border-top: none; border-right: none;">
		<input type="hidden" name="vg_base_tarif" value="{VG_BASE_TAR_ID}">
		<span style="margin-top: 10px; font-weight: bold; font-size: 13px">{VG_BASE_TAR}</span>
	</td>
	<td colspan=2>
		<table width="100%" cellpadding="0" cellspacing="0" border="0" class=table_comm style="border-top: none;">
		<tr height=30>
			<td class=td_bott  align="center" width="70"><select name=tar_year class=z11 style="width: 60px;">{RASP_YEAR}</select></td>
			<td class=td_bott align="center" width="110"><select name=tar_month class=z11 style="width: 100px;">{RASP_MONTH}</select></td>
			<td class=td_bott align="center" width="70"><select name=tar_day class=z11 style="width: 60px;">{RASP_DAY}</select></td>
			<td class=td_bott align="center" width="60"><select name=tar_hour class=z11 style="width: 50px;">{RASP_HOUR}</select></td>
			<td class=td_bott align="center" width="80"><select name=tar_minute class=z11 style="width: 70px;">{RASP_MINUTE}</select></td>
			<td class=td_bott width=100 align="center"><input type="submit" name=vg_add_rasp value="Добавить" onclick="return check_rasp(this.form)"></td>
			<td class=td_comm align="center"><select name=vg_base_tarif_rasp style="width: 200px;">
				<!-- BEGIN vg_base_tarif_opt_r -->
				<option class=z11 value="{VG_BASE_TAR_UID}" {VG_BASE_TAR_SEL}>{VG_BASE_TAR_NAME}
				<!-- END vg_base_tarif_opt_r -->
				</select>
			</td>
		</tr>

<!-- BEGIN vg_show_rasp -->
<input type=hidden name=rasp_to_drop value="0">
	<!-- BEGIN vg_rasp_history -->
	<tr>
		<td colspan="7">
		<table cellpadding="0" cellspacing="0" border="0" width="100%" class=table_comm style="border: none;">
		<tr height=22>
			<td colspan=4 class=td_head>{LASTCHANGEDTARIFS}</td>
		</tr>
	
		<!-- BEGIN vg_rasp_history_row -->
		<tr height=25 <!-- BEGIN vg_rasp_usr_def -->title="{USERMADERASP}" style="background-color:#edf2ff"<!-- END vg_rasp_usr_def -->>
			<td class=td_comm width=160 align=center>{RHDATE}</td>
			<td class=td_comm style="padding-left: 4px;">{RHTNAME}</td>
			<td class=td_comm width=100 align=center>{RHGROUP}</td>
			<td class=td_comm width=50 align=center>&nbsp;-&nbsp;</td>
		</tr>
		<!-- END vg_rasp_history_row -->
		</table>
		</td>
	</tr>
	<!-- END vg_rasp_history -->
	
	<!-- BEGIN vg_rasp_curr -->
	<tr>
		<td colspan="7">
		<table cellpadding="0" cellspacing="0" border="0" width="100%" class=table_comm style="border: none;">
		<tr height=22>
			<td colspan=4 class=td_head>{FUTURECHANGEDTARIFS}</td>
		</tr>
	
		<!-- BEGIN vg_rasp_curr_row -->
		<tr height=25 <!-- BEGIN vg_rasp_usr_def -->title="{USERMADERASP}" style="background-color:#edf2ff"<!-- END vg_rasp_usr_def -->>
			<td class=td_comm width=160 align=center id="rasp_signed">{RCDATE}</td>
			<td class=td_comm style="padding-left: 4px;">{RCNAME}</td>
			<td class=td_comm width=100 align=center>{RCGROUP}</td>
			<td class=td_comm width=50 align=center>
				<!-- BEGIN vg_rasp_curr_active --><button type=submit class=img_button title="{DELETE3}" name="vg_drop_rasp" onClick="if(confirm('{ASKIFDELETERECORD}')) this.form.rasp_to_drop.value='{RINDEX}'; else return false;"><img border=0 src="images1/delete.gif"></img></button><!-- END vg_rasp_curr_active -->
				<!-- BEGIN vg_rasp_curr_passive --><img src="images1/delete_grey.gif" border=0><!-- END vg_rasp_curr_passive -->
			</td>
		</tr>
		<!-- END vg_rasp_curr_row -->
		</table>
		</td>
	</tr>
	<!-- END vg_rasp_curr -->

	</table>
	</td>
</tr>
 <!-- END vg_base_tarif -->
 
 
 <!-- BEGIN vg_tel_nums -->
 
 <!-- BEGIN del_tel_nums -->
 <input type="hidden" name=vg_deleted_tels[] value="{DEL_TELS}"> 
 <!-- END del_tel_nums -->
 
 <!-- BEGIN vg_tel_hiddens -->
 <input type="hidden" name=vg_assigned_n[{AS_N_I}][0] value="{AS_N_VAL}">
 <input type="hidden" name=vg_assigned_n[{AS_N_I}][1] value="{AS_N_COMMENT}">
 <input type="hidden" name=vg_assigned_n[{AS_N_I}][2] value="{AS_N_ID}">
 <input type="hidden" name=vg_assigned_n[{AS_N_I}][3] value="{AS_N_DEV}">
 <input type="hidden" name=vg_assigned_n[{AS_N_I}][4] value="{AS_N_LDSERV}">
 <input type="hidden" name=vg_assigned_n1[{AS_N_I1}][0] value="{AS_N_VAL1}">
 <input type="hidden" name=vg_assigned_n1[{AS_N_I1}][1] value="{AS_N_COMMENT1}"> 
 <input type="hidden" name=vg_assigned_n1[{AS_N_I1}][2] value="{AS_N_ID1}">
 <input type="hidden" name=vg_assigned_n1[{AS_N_I1}][3] value="{AS_N_DEV1}">
 <input type="hidden" name=vg_assigned_n1[{AS_N_I1}][4] value="{AS_N_LDSERV1}">
 <!-- END vg_tel_hiddens -->
<tr>
	<td colspan=3>&nbsp;</td>
</tr>
<tr height="22" align="center"><td colspan=3 bgcolor="#e0e0e0" style="border: solid 1px #c0c0c0;" class=z11><b>{VG_TEL_TITLE}</b></td></tr>

<tr>
 <td colspan=3 hieght=150 style="border: solid 1px #c0c0c0; border-top: none;">

 <input type=hidden name="vg_tel_num_modify" value=>

 <table width="100%">
 <tr>
  <td class=z11 align="right" height="150" width="450">
   <select class="z11" name=vg_assigned_nums style="width: 300px; margin: 6px;" size=7>
    <!-- BEGIN vg_tel_nums_opt -->
    <option class=z11 value='{VG_TEL_NUM_VAL}'>{VG_TEL_NUM_VAL} {AS_N_COMMENT1}
    <!-- END vg_tel_nums_opt -->
   </select>
  </td>
  
  <td align="center" class="z11" width="80">
   <input type="image" src="images/left.gif" name="vg_add_tel_num" onclick="return check_phone_ins(this.form);"><br /><br />
   <input type="image" src="images/right.gif" name="vg_del_tel_num" onclick="javascript: document.forms['vgroup'].vg_tel_num_modify.value=-1;">
  </td>
  
  <td class=z11 width="450">
   &nbsp;&nbsp;<font class=z11>Новый номер:</font>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="text" class=z11 size="30" name="vg_new_tel_num" style="margin-left: 1px;"><br /><br />
   &nbsp;&nbsp;<font class=z11>Комментарий:</font>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="text" class=z11 size="30" name="vg_new_tel_num_coment"><br /><br />
   &nbsp;&nbsp;<font class=z11>Тип устройства:</font>&nbsp;&nbsp;
   <select class=z11 style="margin-left: 1px;" name="vg_new_tel_dev">

   <!-- BEGIN vg_tel_devices -->
   <option value={TEL_DEVICES_VALUE}>{TEL_DEVICES_TEXT}</option>
   <!-- END vg_tel_devices -->

   </select><br /><br />
   &nbsp;&nbsp;<font class=z11>Выход МГ/МН:</font>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="checkbox" name="vg_new_ldserv" checked>
  </td>
 </tr>
 </table>

 </td>
 </tr>
 <!-- END vg_tel_nums -->
 
 <!-- BEGIN vg_ip_staff -->
 
  <!-- BEGIN del_tel_nums -->
 <input type="hidden" name=vg_deleted_tels[] value="{DEL_TELS}"> 
 <!-- END del_tel_nums -->
 
 <!-- BEGIN vg_active_set_v -->
 <input type="hidden" name=vg_active_set[{VG_ACTIVE_IP_IT}] value="{VG_ACTIVE_IP_V}">
 <!-- END vg_active_set_v -->

 <input type=hidden name=vg_ip_as_reset value=0>

 <tr>
 <td class="empty_back" colspan=4>&nbsp;</td>
 </tr>
 <tr>
  <td colspan=3 bgcolor="#e0e0e0" style="border: solid 1px #c0c0c0;">
   <table cellpadding="0" cellspacing="0" border="0" width="100%" class=z11>
     <tr height=22>
       <!-- BEGIN adv_ip_on -->
       <td class=z11 width=25 align="center"><input type=checkbox name=ip_adv value=1 {IP_ADV_CHECKED} onclick="javascript: document.forms['vgroup'].submit()"></td>
       <td width=100>{ADVANCED_TITLE}</td>
       <!-- END adv_ip_on -->

       <!-- BEGIN no_adv_ip -->
       <td width=125>{EMPTY_SET}</td>
       <!-- END no_adv_ip -->

       <td class=z11 align="center"><b>{VG_IP_STAFF_TITLE}</b></td>
       <td class=z11 width=125>&nbsp;</td>
     </tr>
   </table>
  </td>
 </tr>

 <!-- BEGIN ip_block_control -->
<script language="javascript">
function freeIPSubmit(form)
{
	if(form.vg_selected_seg.value == "") return false;
	
	if(form.ip_adv.checked == false)
	{
		var nets = form.vg_selected_seg.value.split("/");
		if(nets[1] != "" && form.masksize.value < nets[1] * 1) return false;
	}
	
	return true;
}
</script>
 <tr>
  <td class=z11 height=140 width="250" align="center" valign="top" style="border-bottom: solid 1px #c0c0c0; border-left: solid 1px #c0c0c0;">
   <font class="z11">Присвоенные </font><br />
    <select  class="z11" name=vg_assigned_ip[] multiple style="width: 200px;" size=8>
   <!-- BEGIN vg_active_ip --> 
     <option class="z11" value="{VG_ACTIVE_IP_VAL}" >{VG_ACTIVE_IP_VAL}
   <!-- END vg_active_ip -->   
   </select>
  </td>
  <td class=z11 colspan="2" align="center" valign="top">
   <table cellpadding="0" cellspacing="0" border="0" class="z11" width="100%">
   <tr>
    <td class=z11 width=110 height=140 align="center" valign="top" style="border-bottom: solid 1px #c0c0c0;">
     <br /><br />
     <input type="submit" name=vg_add_ip value="{ADDBUTT}"  class=z11 style="width:80px;" onClick="return freeIPSubmit(this.form)"><br /><br />
     <input type="submit" name=vg_del_ip value="Удалить"  class=z11 style="width:80px;">
    </td>

    <!-- BEGIN ip_allow_expert -->
    <td class=z11 width=250 align="center" valign="top" style="border-bottom: solid 1px #c0c0c0;">
     <font class="z11">{ACCESSIBLE}</font><br />
     <select  id="vgAllowedIP" class="z11" name=vg_allowed_ip[] multiple style="width: 200px;" size=8>
      <!-- BEGIN vg_allow_ip11 -->
        <option class="z11" value="{VG_ALLOW_IP_VAL}" >{VG_ALLOW_IP_VAL}
      <!-- END vg_allow_ip11 -->
     </select>
    </td>
    <!-- END ip_allow_expert -->

    <td class=z11 align="center" valign="top" style="border-bottom: solid 1px #c0c0c0; border-right: solid 1px #c0c0c0;">
     <table cellpadding="0" cellspacing="0" border="0" class="z11" align=left style="margin-left: 10px;">
     <tr>
       <td class="z11" colspan="2" align="center">
      <font class="z11">Выбрать из:</font>
      </td>
      </tr>
      <tr>
      <td class="z11" height="40">
      <br /><br />
      <font class="z11">Сегмент: &nbsp;&nbsp;</font>
      </td>
      <td class="z11" height="40">
      <br /><br />
      <select class="z11" name=vg_selected_seg style="width: 150px;" {SUBMIT_THIS_FORM}>
       <!-- BEGIN vg_all_segs -->
        <option class="z11" value="{VG_ALL_SEG_VAL}" {VG_ALL_SEG_SEL}>{VG_ALL_SEG_VAL}     
       <!-- END vg_all_segs -->
      </select>
      &nbsp;&nbsp;&nbsp;&nbsp;<font class="z11">Маска: &nbsp;&nbsp;</font>
      <input type=hidden name=ip_adv_list value={IP_ADV_LIST_TO}>
      <input type="text" class="z11" name=masksize size="5" {SUBMIT_THIS_FORM} value="{VG_MASK}">
      </td>
      </tr>
     </table>
    </td>
   </tr>
   </table>  
  </td>
  <td class=z11></td>   
 </tr>
 <!-- END ip_block_control -->

 <!-- BEGIN as_block_control -->
 <tr>
  <td class=z11 height=140 width="250" align="center" valign="top" style="border-bottom: solid 1px #c0c0c0; border-left: solid 1px #c0c0c0;">
   <font class="z11">Присвоенные </font><br>
   <select  class="z11" name=vg_assigned_ip style="width: 200px;" size=8>
   <!-- BEGIN vg_active_as -->
     <option class="z11" value="{VG_ACTIVE_AS_VAL}" >{VG_ACTIVE_AS_VAL}
   <!-- END vg_active_as -->
   </select>
  </td>
  <td class=z11 colspan="2" align="center" valign="top" style="border-right: solid 1px #c0c0c0;">
   <table cellpadding="0" cellspacing="0" border="0" class="z11" width="100%">
    <tr>
     <td class=z11 width=100 height=140 align="center" valign="top" style="border-bottom: solid 1px #c0c0c0;"><br><br><br>
       <input type="submit" name=vg_add_ip value="Добавить"  class=z11 style="width:80px;" onclick="javascript: var templ=/^\d+$/; if(!templ.test(document.forms['vgroup'].vg_allowed_ip.value)) return false;"><br><br>
       <input type="submit" name=vg_del_ip value="Удалить"  class=z11 style="width:80px;">
     </td>
     <td class=z11 align=left valign="middle" style="border-bottom: solid 1px #c0c0c0;">
       <div style='margin-left: 32px;'>
       <font class="z11">{ASYSCODE}</font><br>
       <input type=text name=vg_allowed_ip class=z11 size=30>
       </div>
     </td>
    </tr>
   </table>
  </td>
 </tr>
 <!-- END as_block_control -->
 
 <input type="hidden" name="cabel_agent" value="1">
<!-- BEGIN vg_tel_hiddens -->
 <input type="hidden" name=vg_assigned_n[{AS_N_I}][0] value="{AS_N_VAL}">
 <input type="hidden" name=vg_assigned_n[{AS_N_I}][1] value="{AS_N_COMMENT}">
 <input type="hidden" name=vg_assigned_n[{AS_N_I}][2] value="{AS_N_ID}">
 <input type="hidden" name=vg_assigned_n[{AS_N_I}][3] value="{AS_N_DEV}">
 <input type="hidden" name=vg_assigned_n[{AS_N_I}][4] value="{AS_N_LDSERV}">
 <input type="hidden" name=vg_assigned_n1[{AS_N_I1}][0] value="{AS_N_VAL1}">
 <input type="hidden" name=vg_assigned_n1[{AS_N_I1}][1] value="{AS_N_COMMENT1}"> 
 <input type="hidden" name=vg_assigned_n1[{AS_N_I1}][2] value="{AS_N_ID1}">
 <input type="hidden" name=vg_assigned_n1[{AS_N_I1}][3] value="{AS_N_DEV1}">
 <input type="hidden" name=vg_assigned_n1[{AS_N_I1}][4] value="{AS_N_LDSERV1}">
 <!-- END vg_tel_hiddens -->
 <tr>
 <td  class="empty_back" colspan=4 width="100%">&nbsp;</td>
 </tr>
 <tr>
   <td colspan="3" width="100%">
     <table cellpadding="0" cellspacing="0" border="0" align="center" width="100%">   

 <tr height="22" align="center"><td colspan=3 bgcolor="#e0e0e0" style="border: solid 1px #c0c0c0;" class=z11><b>Адреса транспортной сети</b></td></tr>  
 <tr>
  <td width="245" class=z11 align="center" height="120" style="border-bottom: solid 1px #c0c0c0; border-left: solid 1px #c0c0c0;">
   <select class="z11" name=vg_assigned_nums style="width: 200px;" size=7>
    <!-- BEGIN vg_mac_nums_opt -->
    <option class=z11 value='{VG_TEL_NUM_VAL}'>{VG_TEL_NUM_VAL}  ({ASS_MAC_IP})
    <!-- END vg_mac_nums_opt -->
   </select>
  </td>

  <input type=hidden name="vg_tel_num_modify" value="">
  
  <td width="100" align="center" class="z11" style="border-bottom: solid 1px #c0c0c0;">
   <input type="submit" name="vg_add_tel_num" onclick="return check_phone_ins(this.form);" class=z11 value="Добавить" style="width: 80px;"><br /><br />
   <input type="submit" name="vg_del_tel_num" onclick="javascript: document.forms['vgroup'].vg_tel_num_modify.value=-1;" class=z11 value="Удалить" style="width: 80px;">
  </td>
  
  <td width="635" class=z11 align="left" style="border-bottom: solid 1px #c0c0c0; border-right: solid 1px #c0c0c0;">
   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font class=z11>Новый</font><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
   <input type="text" class=z11 size="30" name="vg_new_tel_num"><br /><br />
   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
   <font class=z11>Привязать к IP</font><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
   <select class="z11" name=vg_new_tel_num_coment style="width: 175px;">
     <option value=0 class="z11">Не привязывать к IP</option>
     <!-- BEGIN mac_to_ip_row -->
     <option class="z11" value="{MAC_TO_IP}">{MAC_TO_IP}</option>
     <!-- END mac_to_ip_row -->
   </select>
  </td>
 </tr>
 </table>
 </td>
 </tr>
 <!-- END vg_ip_staff -->
 
<!-- BEGIN ivox_services -->
<script language="javascript">
function addService( form )
{
	if(!form) form = document.forms['vgroup'];
	
	var url = "ivox_service_add.php";
	var childWin = window.open(url, "_child", "width=700, height=600, resizable=yes, status=no, menubar=no, scrollbars=yes, screenX=100, screenY=100");
	form.action = url;
	form.target = "_child";
	form.submit();
	
	form.action = "";
	form.target = "";
}
</script>
<input type=hidden id="itype" name=ivox_service_type value="1">
<tr>
	<td colspan=3>&nbsp;</td>
</tr>
<tr height="22" align="center">
	<td colspan=3 bgcolor="#e0e0e0" style="border: solid 1px #c0c0c0; border-bottom:none;" class=z11><b>{IVOX_SERVICES_BOTH}</b></td>
</tr>
<tr>
	<td colspan=3>
	<table celspacing=0 celpadding=0 class=table_comm width=100%>
	<tr>
		<td class=td_comm>
		<table celspacing=0 celpadding=0 class=table_comm width=100% style="border: none;">
		<tr style="font-weight:bold; text-align: center;" height=22><td>{CAT_TYPE_3}</td>
		<td width=100>&nbsp;<!-- BEGIN ivox_set_once --><span style="cursor: pointer; text-decoration: underline;" onmouseover="this.style.color='red';" onmouseout="this.style.color=''" onClick="document.forms['vgroup'].ivox_service_type.value=1; addService();">{NOMINATE}</span><!-- END ivox_set_once --></td></tr>
		</table></td>
		<td class=td_comm>
		<table celspacing=0 celpadding=0 class=table_comm width=100% style="border: none;">
		<tr style="font-weight:bold; text-align: center;" height=22><td>{CAT_TYPE_4}</td>
		<td width=100>&nbsp;<!-- BEGIN ivox_set_period --><span style="cursor: pointer; text-decoration: underline;" onmouseover="this.style.color='red';" onmouseout="this.style.color=''" onClick="document.forms['vgroup'].ivox_service_type.value=2; addService();">{NOMINATE}</span><!-- END ivox_set_period --></td></tr>
		</table></td>
	</tr>
	<tr>
		<td width=50% class=td_comm valign=top>
		<table celspacing=0 celpadding=0 class=table_comm width=100%>
		<!-- BEGIN ivox_once_head -->
		<tr>
			<td class=td_head width=120>{ISDATE}</td>
			<td class=td_head>{SERVICENAME}</td>
			<td class=td_head width=90>{PRICE}</td>
			<td class=td_head width=90>{SERVICEQUANTITY}</td>
		</tr>
		<!-- END ivox_once_head -->
		<!-- BEGIN ivox_once_item -->
		<tr align=center>
			<td class=td_comm>{ONCEDATE}</td>
			<td class=td_comm>{ONCENAME}</td>
			<td class=td_comm>{ONCEPRICE}</td>
			<td class=td_comm>{ONCEMULTIPLY}</td>
		</tr>
		<!-- END ivox_once_item -->
		</table>
		</td>
		<td width=50% class=td_comm>
		<table celspacing=0 celpadding=0 class=table_comm width=100%>
		<!-- BEGIN ivox_period_head -->
		<tr align=center>
			<td class=td_head width=100>{ISDATE}</td>
			<td class=td_head>{SERVICENAME}</td>
			<td class=td_head>{SCENERY}</td>
			<td class=td_head width=90>{PRICE}</td>
			<td class=td_head width=90>{SERVICEQUANTITY}</td>
		</tr>
		<!-- END ivox_period_head -->
		<!-- BEGIN ivox_period_item -->
		<tr align=center>
			<td class=td_comm align=left><!-- BEGIN ivox_period_dateEmpty -->&nbsp;<!-- END ivox_period_dateEmpty -->
			<!-- BEGIN ivox_period_date -->
			<table class=table_comm style="border: none;" cellpadding=0 cellspacing=0 width=100%>
			<tr><td width=25>{TIMEFROM}</td><td>{PERIOD_STARTDATE}</td></tr>
			<tr><td width=25>{TIMETO}</td><td>{PERIOD_ENDDATE}</td></tr>
			</table>
			<!-- END ivox_period_date -->
			</td>
			<td class=td_comm>{PERIOD_NAME}</td>
			<td class=td_comm>{PERIOD_SCENERY}</td>
			<td class=td_comm width=90>{PERIOD_PRICE}</td>
			<td class=td_comm width=90>{PERIODMULTIPLY}</td>
		</tr>
		<!-- END ivox_period_item -->
		</table>
		</td>
	</tr>
	</table>
	</td>
</tr>
<!-- END ivox_services -->
 
 <tr>
 <td class="empty_back" colspan=3>&nbsp;</td>
 </tr> 
  <tr>
   <td colspan=3 align="center" height="50" style="border: solid 1px #c0c0c0;">
    <!-- BEGIN allow_to_save --><input type="submit" name="vg_save" class="z11" value="{SAVE}" style="width: 120px; " onClick="modifyBlkReq(this.form); <!-- BEGIN ifVGNEW -->return select_base_tar();<!-- END ifVGNEW -->">&nbsp;&nbsp;&nbsp;&nbsp;<!-- END allow_to_save -->
    <input type="submit" name="vg_cancel" class="z11" value="Отмена" style="width: 120px; ">
   </td>
  </tr>
</table>
<!-- END vg_edit_tab -->
