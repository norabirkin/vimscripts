<script language="javascript">
	var Localize = { User: '<%@ User %>', Accounts: '<%@ Accounts list %>', Blocking: '<%@ Blocking %>', Balance: '<%@ Balance %>', Login: '<%@ Login %>' , Agreement: '<%@ Agreement %>', Device: '<%@ Device %>', Port: '<%@ Port %>', Status: '<%@ Status %>', Addr: '<%@ Address %>' }
</script>
<script language="javaScript" type="text/javascript" src="js/sbss_crm.js"></script>
<form method="POST" id="_sbssForm" action="config.php">
<input type="hidden" name="devision" value="1001">
<input type="hidden" name="searchClientId" value="0">
<table width="950" class="table_comm" align="center" cellpadding="0" cellspacing="0">
<tr height=35>
	<td class="td_comm" colspan="10">
		<table class="table_comm" cellpadding="5" style="border: none" >
		<tr>
			<td width="60" class="td_comm" style="border: none;">{SEARCH}:</td>
			<td width="270" class="td_comm" style="border: none">
			<select  class="select_comm" id="srch_list" name="srchKey" style="width:260px" onChange="searchCheck(this.id, 'fastsearch','_manForType')">
				<option value="-1" <!-- BEGIN searchSel-1 -->selected<!-- END searchSel-1 -->>{EVERYWHERE}</option>
				<option value="-2" <!-- BEGIN searchSel-2 -->selected<!-- END searchSel-2 -->>{USER_S_FIO}</option>
				<option value="-3" <!-- BEGIN searchSel-3 -->selected<!-- END searchSel-3 -->>&nbsp</option>
				<!-- BEGIN searchByMan --><option value="{SRCHMANID}" <!-- BEGIN searchSelMan -->selected<!-- END searchSelMan -->>{SRCHMANNAME}</option><!-- END searchByMan -->
			</select>
			</td>
			<td width="300" class="td_comm" style="border: none">
				<input class="input_comm" type="text" autocomplete="off" id="fastsearch" style="width: 290px; <!-- BEGIN stringNone -->display: none;<!-- END stringNone -->" name="string" value="{STRINGVALUE}" <!-- BEGIN stringDisable -->disabled<!-- END stringDisable -->>
				<select class="select_comm" id="_manForType" name="manForType" style="width: 150px; <!-- BEGIN manForNone -->display: none;<!-- END manForNone -->" <!-- BEGIN manForDisabled -->disabled<!-- END manForDisabled -->>
				<option value="1" <!-- BEGIN manForSel-1 -->selected<!-- END manForSel-1 -->>{HD_CHANGE_MAN}</options>
				<option value="2" <!-- BEGIN manForSel-2 -->selected<!-- END manForSel-2 -->>{T_AUTHOR}</options>
				</select>
			</td>
			<td class="td_comm" style="border: none">
				&nbsp;
				<button type="button" class="img_button" onClick="sbssSubmitFor('_sbssForm','search',1)" title="{SEARCH}"><img title="{SEARCH}" border=0 src="images/find22.gif"></button>
				&nbsp;
				<!-- BEGIN newTicket --><button type="button" class="img_button" onClick="sbssSubmitFor('_sbssForm','ticketId',0)" title="{HD_CREATE_TIKET}"><img title="{HD_CREATE_TIKET}" border=0 src="images/new22.gif"></button><!-- END newTicket -->
			</td>
		</tr>
		</table>
	</td>
</tr>
<!-- BEGIN StatusNone --><tr height="40"><td colspan="10" class="td_comm" align="center" style="color: red">{HD_NO_STATUSES}</td></tr><!-- END StatusNone -->
<!-- BEGIN StatusAndGroups -->
<tr>
	<td colspan="10" class="td_comm">
		<table class="table_comm" cellpadding="5" style="border: none" >
		<tr>
			<td width="170" class="td_comm" style="border: none">{STATUSSHOWHIDE}:</td>
			<td width="50" class="td_comm" style="border: none"><input type=checkbox name="stat_show" onClick="sbssShowStatuses(this, 'stat_field')" <!-- BEGIN statusBlockChecked -->checked<!-- END statusBlockChecked -->></td>
			<td width="170" class="td_comm" style="border: none">{GROUPBYREQUESTCLASSES}:</td>
			<td width="40" class="td_comm" style="border: none"><input type=checkbox name="group_class" value="{GROUPCLASSVALUE}" onClick="this.form.submit()" <!-- BEGIN groupClChecked -->checked<!-- END groupClChecked -->></td>
		</tr>
		</table>
	</td>
</tr>
<tr id="stat_field" <!-- BEGIN staus_visible --> style="display: none;"<!-- END staus_visible -->>
	<td colspan="10" class="td_comm">
		<table class="table_comm" cellpadding="5" style="border: none" width="100%">
		<!-- BEGIN status_col --><tr>
				<!-- BEGIN status_cell --><td width="22" height="20" class="table_comm" style="border: none;padding-left:2px;">
				<input type="checkbox" value="{THISSTATUSID}" name="status_id2show[]" onClick="this.form.submit()" <!-- BEGIN status_checked -->checked<!-- END status_checked -->></td>
				<td width=260>{THISSTATUSNAME}</td><!-- END status_cell -->
		</tr><!-- END status_col -->
		</table>
	</td>

</tr>
<!-- END StatusAndGroups -->
<!-- BEGIN tickets_groups -->
<!-- BEGIN tickets_groups_title -->
<tr bgcolor="#{THISGROUPCOLOR}" height="22">
	<td colspan="11" class="td_comm">
		<table width="100%" cellpadding="5" class="table_comm" style="border: none" >
		<tr>
			<td width="50%" class="td_comm" style="border: none"><a href="#" onClick="expandGroup(document.forms[1],'{THISCLASSID}');" style="font-weight: bold;">{THISGROUPNAME}</a></td>
			<td class="td_comm" style="border: none">{HD_CHANGE_MAN}&nbsp;{THISMANNAME}</td>
		</tr>
		</table>
	</td>
</tr>
<!-- END tickets_groups_title -->

<!-- BEGIN tickets_list_title -->
<tr height="22">
	<td colspan="8" class="td_comm" style="border-right: none; padding-left: 5px">{PAGES}: 
	<!-- BEGIN pBack --><a href="#" onClick="sbssSubmitFor('_sbssForm', 'page', '{PAGE}')" style="margin-right: 7px"><<</a><!-- END pBack -->
	<!-- BEGIN pages -->
	<!-- BEGIN pGoto --><a href="#" onClick="sbssSubmitFor('_sbssForm', 'page', '{PAGE}')" style="margin-right: 7px;">{PAGE}</a><!-- END pGoto -->
	<!-- BEGIN pSel --><span style="margin-right: 7px; font-weight: bold">{PAGE}</span><!-- END pSel -->
	<!-- END pages -->
	<!-- BEGIN pForWD --><a hewf="#" onClick="sbssSubmitFor('_sbssForm', 'page', '{PAGE}')" style="margin-right: 7px;">>></a><!-- END pForWD -->
	</td>
	<td colspan="2" class="td_comm" align="right" style="padding-right: 5px">{TICKETS_OPENED}: <b>{COUNTOPENED}</b></td>
</tr>
<tr height="22">
	<td class="td_head" width="40">#</td>
	<td class="td_head" width="110">{STATUS}</td>
	<td class="td_head">{T_TITLE}</td>
	<td class="td_head" width="120">{T_AUTHOR}</td>
	<td class="td_head" style="border-right: none" width="30">&nbsp;</td>
	<td class="td_head" style="border-right: none" width="30">&nbsp;</td>
	<td class="td_head" width="30">&nbsp;</td>
	<td class="td_head" width="60">{HD_VAL}</td>
	<td class="td_head" width="120">{HD_LAST}</td>
	<td class="td_head" width="120">{HD_CHANGE_MAN}</td>
</tr>
<!-- END tickets_list_title -->
<!-- BEGIN ticket_item -->
<tr height="37" id="tid_{THISTID}" bgcolor="#{TRCOLOR}" align="center">
	<td class="td_comm" style="border-right: none" width="40">{THISTID}</td>
	<td class="td_comm" style="border-right: none" width="110"><font color="#{STATUSCOLOR}">{THISSTATUS}</font></td>
	<td class="td_comm" style="border-right: none"><a href="#" onClick="sbssSubmitFor('_sbssForm', 'ticketId', '{THISTID}')">{THISTITLE}</a></td>
	<td class="td_comm" style="border-right: none" width="120"><!-- BEGIN userInfo --><a href="#" onclick="getUserInfo({THISUSERID}, '{THISAUTHOR}')"><!-- END userInfo -->{THISAUTHOR}</a><br>{THISAUTHORTIME}</td>
	<td class="td_comm" style="border-right: none" width="30"><!-- BEGIN man_lock --><img src="images/locked.gif" title="{TICKETVIEWBY}: {MANVIEW}"><!-- END man_lock --><!-- BEGIN none_man_lock -->&nbsp;<!-- END none_man_lock --></td>
	<td class="td_comm" style="border-right: none" width="30"><button type="button" class="img_button" title="{MAILTOAUTHOR}" <!-- BEGIN authorEMail -->onClick="document.location.href='mailto:{AUTHORMAIL}'"<!-- END authorEMail -->><img border="0" title="{MAILTOAUTHOR}" src="images/mailto.gif"></button></td>
	<td class="td_comm" style="border-right: none" width="30"><button type="button" class="img_button" onClick="sbssSubmitFor('_sbssForm','<!-- BEGIN authorManager -->manId<!-- END authorManager --><!-- BEGIN authorClient -->clientId<!-- END authorClient -->','{THISPERSONID}')" title="{GROUPBYAUTHOR}"><img border="0" title="{GROUPBYAUTHOR}" src=images/contact_group.gif></button></td>
	<td class="td_comm" style="border-right: none" width="60">{THISREPLIES} <!-- BEGIN ticket_item_att -->({THISATTACHEDCOUNT})<!-- END ticket_item_att --></td>
	<td class="td_comm" style="border-right: none" width="120">{THISANSWERNAME}<br/>{THISANSWERTIME}</td>
	<td class="td_comm" width="120">{THISRESPONSIBLE}</td>
</tr>
<!-- END ticket_item -->
<!-- BEGIN ticket_item_empty -->
<tr height="37">
	<td class="td_comm" colspan="10" style="color: red;" valign="center"  align="center">{NODATA}</td>
</tr>
<!-- END ticket_item_empty -->
<!-- END tickets_groups -->
</table>
</form>
