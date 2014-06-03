<script language="javaScript" type="text/javascript" src="js/sbss_crm.js"></script>
<form method="POST" id="_sbssForm" action="config.php">
<input type="hidden" name="devision" value="1002">
<input type="hidden" name="searchClientId" value="0">
<table width="950" class="table_comm" align="center" cellpadding="0" cellspacing="0">
<tr height=35>
	<td class="td_comm" colspan="5">
		<table class="table_comm" cellpadding="5" style="border: none">
		<tr>
			<td width="60" class="td_comm" style="border: none">{SEARCH}:</td>
			<td width="270" class="td_comm" style="border: none">
			<select id="srch_list" name="srchKey" style="width:260px" onChange="searchCheck(this.id, 'fastsearch','_manForType')">
				<option value="-1" <!-- BEGIN searchSel-1 -->selected<!-- END searchSel-1 -->>{EVERYWHERE}</option>
				<option value="-3" <!-- BEGIN searchSel-3 -->selected<!-- END searchSel-3 -->>&nbsp</option>
				<!-- BEGIN searchByMan --><option value="{SRCHMANID}" <!-- BEGIN searchSelMan -->selected<!-- END searchSelMan -->>{SRCHMANNAME}</option><!-- END searchByMan -->
			</select>
			</td>
			<td width="300" class="td_comm" style="border: none">
				<input type="text" autocomplete="off" id="fastsearch" style="width: 290px; <!-- BEGIN stringNone -->display: none;<!-- END stringNone -->" name="string" value="{STRINGVALUE}" <!-- BEGIN stringDisable -->disabled<!-- END stringDisable -->>
				<select id="_manForType" name="manForType" style="width: 150px; <!-- BEGIN manForNone -->display: none;<!-- END manForNone -->" <!-- BEGIN manForDisabled -->disabled<!-- END manForDisabled -->>
				<option value="2" <!-- BEGIN manForSel-2 -->selected<!-- END manForSel-2 -->>{T_AUTHOR}</options>
				</select>
			</td>
			<td class="td_comm" style="border: none">
				&nbsp;
				<button type="button" class="img_button" onClick="sbssSubmitFor('_sbssForm','search',1)" title="{SEARCH}"><img title="{SEARCH}" border=0 src="images/find22.gif"></button>
				&nbsp;
				<!-- BEGIN newTicket --><button type="button" class="img_button" onClick="sbssSubmitFor('_sbssForm','itemId',0)" title="{NEWKNOWLEDGE}"><img title="{NEWKNOWLEDGE}" border=0 src="images/new22.gif"></button><!-- END newTicket -->
			</td>
		</tr>
		</table>
	</td>
</tr>
<!-- BEGIN ClassNone --><tr height="40"><td colspan="5" class="td_comm" align="center" style="color: red">{HD_NO_CLASSES}</td></tr><!-- END ClassNone -->
<!-- BEGIN StatusAndGroups -->
<tr>
	<td colspan="5" class="td_comm">
		<table class="table_comm" cellpadding="5" style="border: none">
		<tr>
			<td width="170" class="td_comm" style="border: none">{GROUPBYREQUESTCLASSES}:</td>
			<td width="40" class="td_comm" style="border: none"><input type=checkbox name="group_class" value="{GROUPCLASSVALUE}" onClick="this.form.submit()" <!-- BEGIN groupClChecked -->checked<!-- END groupClChecked -->></td>
		</tr>
		</table>
	</td>
</tr>
<!-- END StatusAndGroups -->
<!-- BEGIN groups -->
<!-- BEGIN groups_title -->
<tr bgcolor="#{THISGROUPCOLOR}" height="22">
	<td colspan="5" class="td_comm">
		<table width="100%" cellpadding="5" class="table_comm" style="border: none">
		<tr>
			<td width="50%" class="td_comm" style="border: none"><a href="#" onClick="expandGroup(document.forms[1],'{THISCLASSID}');" style="font-weight: bold;">{THISGROUPNAME}</a></td>
			<td class="td_comm" style="border: none">{HD_CHANGE_MAN}&nbsp;{THISMANNAME}</td>
		</tr>
		</table>
	</td>
</tr>
<!-- END groups_title -->

<!-- BEGIN list_title -->
<tr height="22">
	<td colspan="3" class="td_comm" style="border-right: none; padding-left: 5px">{PAGES}: 
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
	<td class="td_head">{SUBJECT}</td>
	<td class="td_head" width="170">{T_AUTHOR}</td>
	<td class="td_head">{HD_REQUESTCLASS}</td>
	<td class="td_head" width="170">{HD_LAST}</td>
</tr>
<!-- END list_title -->
<!-- BEGIN item -->
<tr height="37" id="tid_{THISTID}" bgcolor="#{TRCOLOR}" align="center">
	<td class="td_comm" style="border-right: none" width="40">{THISTID}</td>
	<td class="td_comm" style="border-right: none"><a href="#" onClick="sbssSubmitFor('_sbssForm', 'itemId', '{THISTID}')">{THISTITLE}</a></td>
	<td class="td_comm" style="border-right: none" width="170">{THISAUTHOR}<br>{THISAUTHORTIME}</td>
	<td class="td_comm" style="border-right: none">{THISCLASSNAME}</td>
	<td class="td_comm" width="170">{THISANSWERNAME}<br/>{THISANSWERTIME}</td>
</tr>
<!-- END item -->
<!-- BEGIN item_empty -->
<tr height="37">
	<td class="td_comm" colspan="5" style="color: red;" valign="center"  align="center">{NODATA}</td>
</tr>
<!-- END item_empty -->
<!-- END groups -->
</table>
</form>