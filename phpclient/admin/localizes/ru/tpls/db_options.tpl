<script language="javascript">
function dbOptionsFields(element, ifFocus)
{
	if(!element) return;
	if(isNaN(element.value) || element.value == "") element.value = 0;
	
	if(ifFocus == 1)
	{
		if(element.value == 0) element.value = "{ALWAYSSTORE}";
	}
}
</script>

<table class="table_comm" width="750" style="margin-top: 17px;" align="center">
	<tr height=22><td colspan=2 class=td_head_ext>{CLEAR_HISTORY}</td></tr>
	<tr>
		<td width=432 class=td_comm>{CLEAR_1H_HISTORY}{COLON}</td>
		<td class=td_comm><input type=text name="options_clear[1h]" value="{OPT_1H}" onFocus="dbOptionsFields(this)" onBlur="dbOptionsFields(this,1)" style="width: 70px; "></td>
	</tr>
	<tr>
		<td class=td_comm>{CLEAR_DAY_HISTORY}{COLON}</td>
		<td class=td_comm><input type=text name="options_clear[day]" value="{OPT_DAY}" onFocus="dbOptionsFields(this)" onBlur="dbOptionsFields(this,1)" style="width: 70px; "></td>
	</tr>
	<tr>
		<td class=td_comm>{CLEAR_MONTH_HISTORY}{COLON}</td>
		<td class=td_comm><input type=text name="options_clear[month]" value="{OPT_MONTH}" onFocus="dbOptionsFields(this)" onBlur="dbOptionsFields(this,1)" style="width: 70px; "></td>
	</tr>
	<tr>
		<td class=td_comm>{CLEAR_VGBLOCKS_HISTORY}{COLON}</td>
		<td class=td_comm><input type=text name="options_clear[vg_blocks]" value="{OPT_VG_BLOCKS}" onFocus="dbOptionsFields(this)" onBlur="dbOptionsFields(this,1)" style="width: 70px; "></td>
	</tr>
	<tr>
		<td class=td_comm>{CLEAR_ADMINLOG_HISTORY}{COLON}</td>
		<td class=td_comm><input type=text name="options_clear[admin_log]" value="{OPT_ADMIN_LOGS}" onFocus="dbOptionsFields(this)" onBlur="dbOptionsFields(this,1)" style="width: 70px; "></td>
	</tr>
	<tr>
		<td class=td_comm>{CLEAR_BALANCES_HISTORY}{COLON}</td>
		<td class=td_comm><input type=text name="options_clear[balances]" value="{OPT_BALANCES}" onFocus="dbOptionsFields(this)" onBlur="dbOptionsFields(this,1)"style="width: 70px; "></td>
	</tr>
	<tr>
		<td class=td_comm>{CLEAR_BILLS_HISTORY}{COLON}</td>
		<td class=td_comm><input type=text name="options_clear[bills]" value="{OPT_BILLS}" onFocus="dbOptionsFields(this)" onBlur="dbOptionsFields(this,1)" style="width: 70px; "></td>
	</tr>
	<tr>
		<td class=td_comm>{CLEAR_ORDERS_HISTORY}{COLON}</td>
		<td class=td_comm><input type=text name="options_clear[orders]" value="{OPT_ORDERS}" onFocus="dbOptionsFields(this)" onBlur="dbOptionsFields(this,1)" style="width: 70px; "></td>
	</tr>
	<tr>
		<td class=td_comm>{CLEAR_RENTCHARGE_HISTORY}{COLON}</td>
		<td class=td_comm><input type=text name="options_clear[rentcharge]" value="{OPT_RENTCHARGE}" onFocus="dbOptionsFields(this)" onBlur="dbOptionsFields(this,1)" style="width: 70px; "></td>
	</tr>
	<tr>
		<td class=td_comm>{CLEAR_PAYCARDS_HISTORY}{COLON}</td>
		<td class=td_comm><input type=text name="options_clear[pay_cards]" value="{OPT_PAY_CARDS}" onFocus="dbOptionsFields(this)" onBlur="dbOptionsFields(this,1)" style="width: 70px; "></td>
	</tr>
</table>

<input type="hidden" name="dropArgmANumIndex" value="">
<table class="table_comm" width=750 style="margin-top: 17px;" align=center>
	<tr height=22><td colspan=2 class="td_head_ext" style="border-right: none;">{AGRM_AUTONUM_TEMPLATE}</td>
	<td width="30" class="td_head_ext"><button type="submit" class="img_button" title="{NASADD}" name="newAgrmANum" onclick="document.forms[1].devision.value={DEVISIONVALUE}"><img title="{NASADD}" src="images/edit_add.gif"></button></tr>
	<tr height=22>
		<td class="td_head">{DESCRIPTION}</td>
		<td class="td_head" style="border-right: none;">{ISTEMPLATE}</td>
		<td class="td_head" width="30"></td>
	</tr>
	<!-- BEGIN agrm_row -->
	<tr align="center" height="22">
		<td class="td_comm"><input type="text" name="agrmANum[{AGRM_AINDEX}][0]" value="{AGRM_ADESCR}" style="width: 250px"></td>
		<td class="td_comm"><input type="text" name="agrmANum[{AGRM_AINDEX}][1]" value="{AGRM_AVALUE}" style="width: 250px"></td>
		<td class="td_comm" width="30"><button type="submit" class="img_button" name="dropAgrmANum" onClick="document.forms[1].devision.value={DEVISIONVALUE}; this.form.dropArgmANumIndex.value='{AGRM_AINDEX}'">
			<img src="images/cancel.gif">
		</button></td>
	</tr>
	<!-- END agrm_row -->
	<!-- BEGIN agrm_empty -->
	<tr height="30"><td colspan="3" class="td_comm" align="center">{NODATA}</td></tr>
	<!-- END agrm_empty -->
</table>

<table class="table_comm" width=750 style="margin-top: 17px;" align=center>
	<tr height=30>
		<td class=td_comm align=center><input type=submit name=save_opt value="{SAVE}" onclick="document.forms[1].devision.value={DEVISIONVALUE}"></td>
	</tr>
</table>