<!-- BEGIN trusted_hosts -->
<script language="JavaScript">
function check_create()
{
	if(document.forms['th_form'].th_ip1.value >= 0 ||
	   document.forms['th_form'].th_ip2.value >= 0 ||
	   document.forms['th_form'].th_ip3.value >= 0 ||
	   document.forms['th_form'].th_ip4.value >= 0 ||
	   document.forms['th_form'].th_mask1.value >= 0 ||
	   document.forms['th_form'].th_mask2.value >= 0 ||
	   document.forms['th_form'].th_mask3.value >= 0 ||
	   document.forms['th_form'].th_mask4.value >= 0)
	   {
	   	document.forms['th_form'].th_save.value = 1;
	   	document.forms['th_form'].submit();
	   }
	 else
	 	alert("{WRONG_NEW_PARAMS}"); 
};
</script>

<form name="th_form" method="POST" action="config.php">
<input type="hidden" name="devision" value="501">
<input type="hidden" name="th_save" value=0>
<table  class="table_comm" width="980" align="center" border="0" >
	<tr>
		<td colspan="4"  class="td_head_ext" align="center" 
			style="border: solid 1px #c0c0c0;">
		<b>{TH_TITLE}</b>
		</td>
	</tr>
	<tr>
		<td colspan="4"  height="50" align="right" style=" border: solid 1px #c0c0c0; border-top: none; padding-right:40px;">
			<input type="submit" name="th_create" class="z11" value="{TH_CREATE}"
				style="width: 100px;">
			
		</td>
	</tr>
	<tr>
		<td width="250" height="25" class="z11" align="center" bgcolor="#e0e0e0"
			style=" border: solid 1px #c0c0c0; border-top: none; border-right: none;">
		<font class="z11"><b>{TH_IP}</b></font>
		</td>	
		<td width="250" height="25" class="z11" align="center" bgcolor="#e0e0e0"
			style=" border: solid 1px #c0c0c0; border-top: none; border-right: none;">
		<font class="z11"><b>{TH_MASK}</b></font>
		</td>	
		<td width="300" height="25" class="z11" align="center" bgcolor="#e0e0e0"
			style=" border: solid 1px #c0c0c0; border-top: none; border-right: none;">
		<font class="z11"><b>{TH_DESCR}</b></font>
		</td>	
		<td width="180" height="25" class="z11" align="center" bgcolor="#e0e0e0"
			style=" border: solid 1px #c0c0c0; border-top: none;">
		<font class="z11">&nbsp;</font>
		</td>	
	</tr>
	<!-- BEGIN th_message -->
	<tr>
		<td colspan="4" class="z11" height="60" 
			style="border: solid 1px #c0c0c0; border-top: none;">
		<font class="z11">{TH_MESSAGE}</font>
		</td>
	</tr>
	<!-- END th_message -->
	
	<!-- BEGIN th_row -->
	<tr>
		<td width="250" height="30" class="z11" align="center"
			style=" border: solid 1px #c0c0c0; border-top: none; border-right: none;">
		<input type="text" size="3" maxlength="3" name=th_ip1 value="127" class="z11"><font class="z11">.</font>
		<input type="text" size="3" maxlength="3" name=th_ip2 value="0" class="z11"><font class="z11">.</font>
		<input type="text" size="3" maxlength="3" name=th_ip3 value="0" class="z11"><font class="z11">.</font>
		<input type="text" size="3" maxlength="3" name=th_ip4 value="1" class="z11">
		</td>	
		<td width="250" height="30" class="z11" align="center"
			style=" border: solid 1px #c0c0c0; border-top: none; border-right: none;">
		<input type="text" size="3" maxlength="3" name=th_mask1 value="255" class="z11"><font class="z11">.</font>
		<input type="text" size="3" maxlength="3" name=th_mask2 value="255" class="z11"><font class="z11">.</font>
		<input type="text" size="3" maxlength="3" name=th_mask3 value="255" class="z11"><font class="z11">.</font>
		<input type="text" size="3" maxlength="3" name=th_mask4 value="255" class="z11">
		</td>	
		<td width="300" height="30" class="z11" align="center" 
			style=" border: solid 1px #c0c0c0; border-top: none; border-right: none;">
		<input type="text" name=th_descr maxlength="250" class="z11" style="width: 260px;">
		</td>	
		<td width="180" height="30" class="z11" align="center" 
			style=" border: solid 1px #c0c0c0; border-top: none;">
		{CURR_ID}
		</td>	
	</tr>
	<!-- END th_row -->
	
	<!-- BEGIN th_row_db -->
	<tr>
		<td width="250" height="30" class="z11" align="center"
			style=" border: solid 1px #c0c0c0; border-top: none; border-right: none;">
		<font class="z11">{TH_IP_C}&nbsp;</font>
		</td>	
		<td width="250" height="30" class="z11" align="center"
			style=" border: solid 1px #c0c0c0; border-top: none; border-right: none;">
		<font class="z11">{TH_MASK_C}&nbsp;</font>
		</td>	
		<td width="300" height="30" class="z11" align="center" 
			style=" border: solid 1px #c0c0c0; border-top: none; border-right: none;">
		<font class="z11">{TH_DESCR_C}&nbsp;</font>
		</td>	
		<td width="180" height="30" class="z11" align="center" 
			style=" border: solid 1px #c0c0c0; border-top: none;">
		<input type="submit" name=th_del_curr[{CURR_ID}] class="z11" style="width: 100px;" value="{TH_DEL}">
		</td>	
	</tr>
	<!-- END th_row_db -->
	
	<tr>
		<td colspan="4" class="z11" height="50" align="center"
			style=" border: solid 1px #c0c0c0; border-top: none;">
			<input type="button" name="th_save1" class="z11" value="{TH_SAVE}"
				style="width: 100px;" {TH_SAVE_DIS} onclick="check_create();">
		</td>
	</tr>
</table>
</form>

<!-- END trusted_hosts -->