<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>{TITLE}</title>
<link REL="StyleSheet" HREF="main.css" type="text/css">
</head>

<script language="javascript">

var docs_arr = new Array();

function setVariableValue(unit_id, fio)
{
	var lnk_src = parent.opener.document;
	lnk_src.getElementById('g4u').innerHTML = fio;
	lnk_src.forms[1].gr_type_id.value = unit_id;
	lnk_src.forms[1].gr_type_name.value = fio;
	
	if(!docs_arr['selected']) docs_arr['selected'] = unit_id;
	else
	{
		if(document.getElementById(docs_arr['selected']))
			document.getElementById(docs_arr['selected']).style.color = "black";
		
		docs_arr['selected'] = unit_id;
	}
	
	if(document.getElementById(docs_arr['selected']))
		document.getElementById(docs_arr['selected']).style.color = "red";

}
</script>

<body>

<form action="search_user_account.php" method="POST" name="empty_form">
</form>

<form action="search_user_account.php" method="POST" name="user_form">
<table class="table_comm" cellpadding="0" cellspacing="0" border="0" width="600" align="center">
	<tr height=35>
		<td clazz=z11 align=right style="font-weight: bold;"><span style="cursor: pointer; margin-right: 7px;" onClick="javascript: window.close();">{WIN_CLOSE}</span></td>
	</tr>
	<tr>
		<td>
		<table cellpadding=0 cellspacing=0 border=0 width=100%>
			<tr>
				<td class=z11 width=50% height=30 bgcolor="e0e0e0" style="border: solid 1px #c0c0c0; border-right: none;">
					<span style="margin-left: 7px; font-weight: bold;">{TABLE_TITLE}&nbsp;{USERS_NUM}</span></td>
				<td class=z11 height=30 bgcolor="e0e0e0" align="right" style="border: solid 1px #c0c0c0; border-left: none;">
					<span style="margin-right: 7px; font-weight: bold;">{REC_PO}&nbsp;
					<select class="z11" name="rows_on_page" style="width: 60px;" onChange="this.form.submit();">
					<!-- BEGIN rows_opt -->
					<option value={ROWS_VAL} {ROWS_SEL}>{ROWS_OPT}</option>
					<!-- END rows_opt -->
					</select>
					&nbsp;{RECORDS}&nbsp;&nbsp;
					</span>
				</td>
			</tr>
		</table>
		</td>
	</tr>
	<tr height=40>
		<td style="border: solid 1px #c0c0c0; border-top: none;">
		<table cellpadding=0 cellspacing=0 border=0 width=100%>
			<tr>
				<td>
					<input type="text" name="search_text" class="z11" style="margin-left: 7px; width: 200px;" value="{SEARCH_TEXT}">
				</td>
				<td>
					<select class="z11" name="search_type" style="width: 210px;">
					<!-- BEGIN search_type_row -->
					<option value="{SRC_VAL}" {SRC_SEL}>{SRC_OPT}</option>
					<!-- END search_type_row -->
					</select>
				</td>
				<td>
					<input type="submit" class="z11" name="search_start" style="width: 70px;" value="{SEARCH_BUT}">
				</td>
			</tr>
		</table>
		</td>
	</tr>
	<tr height=20><td>&nbsp;</td></tr>
	
	<!-- BEGIN usr_list -->
	<tr>
		<td class="z11" align="left" height="25" bgcolor="e0e0e0" style="border: solid 1px #c0c0c0;">
			<span style="margin-left: 7px;">{PAGES_TIT}:&nbsp;{PAGES_STR}</span></font>
		</td> 
	</tr>
	<tr>
		<td style="border-left: solid 1px #c0c0c0;">
		<!-- BEGIN is_conv -->
		<table cellpadding=0 cellspacing=0 border=0 width=100%>
			<!-- BEGIN is_conv_line -->
			<tr id={IS_TR_ID} height=25 {IS_TR_PROP} onClick="setVariableValue({IS_TR_ID}, '{IS_ABOUT_USER}')">
				<td align=center class=z11 style="border: none; border-bottom: solid 1px #c0c0c0; border-right: solid 1px #c0c0c0;">
					<span style="margin-left: 7px; {STYLE_IS_CONV}">{IS_VAL_1}&nbsp;</span>
				</td>
				<td align=center class=z11 style="border: none; border-bottom: solid 1px #c0c0c0; border-right: solid 1px #c0c0c0;">
					<span style="margin-left: 7px; {STYLE_IS_CONV}">{IS_VAL_2}&nbsp;</span>
				</td>
				<td align=center class=z11 style="border: none; border-bottom: solid 1px #c0c0c0; border-right: solid 1px #c0c0c0;">
					<span style="margin-left: 7px; {STYLE_IS_CONV}">{IS_VAL_3}&nbsp;</span>
				</td>
			</tr>
			<!-- END is_conv_line -->
		</table>
		<!-- END is_conv -->
		
		<!-- BEGIN none_conv -->
		<table cellpadding=0 cellspacing=0 border=0 width=100%>
			<!-- BEGIN none_conv_line -->
			<tr height=25 bgcolor=#f0f0f0>
				<td align=center class=z11 style="border: none; border-bottom: solid 1px #c0c0c0; border-right: solid 1px #c0c0c0;">
					<span style="margin-left: 7px; {STYLE_NONE_CONV}">{NONE_VAL_1}&nbsp;</span>
				</td>
				<td align=center class=z11 style="border: none; border-bottom: solid 1px #c0c0c0; border-right: solid 1px #c0c0c0;">
					<span style="margin-left: 7px; {STYLE_NONE_CONV}">{NONE_VAL_2}&nbsp;</span>
				</td>
				<td align=center class=z11 style="border: none; border-bottom: solid 1px #c0c0c0; border-right: solid 1px #c0c0c0;">
					<span style="margin-left: 7px; {STYLE_NONE_CONV}">{NONE_VAL_3}&nbsp;</span>
				</td>
			</tr>

			<!-- BEGIN accounts -->
			<tr id={NONE_TR_ID} height=20 style="cursor: pointer;" onMouseOver="this.style.backgroundColor='#e0e0e0'" onMouseOut="this.style.backgroundColor='#ffffff'" onClick="setVariableValue({NONE_TR_ID}, '{NONE_ABOUT_USER}')">
				<td align=center class=z11 style="border: none; border-bottom: solid 1px #c0c0c0;">
					<span style="margin-left: 7px;">&nbsp;</span>
				</td>
				<td align=center class=z11 style="border: none; border-bottom: solid 1px #c0c0c0;">
					<span style="margin-left: 7px;">{ACCOUNT_LOGIN}&nbsp;</span>
				</td>
				<td align=center class=z11 style="border: none; border-bottom: solid 1px #c0c0c0; border-right: solid 1px #c0c0c0;">
					<span style="margin-left: 7px;">{ACCOUNT_SERVICE}&nbsp;</span>
				</td>
			</tr>
			<!-- END accounts -->
			
			<!-- END none_conv_line -->
		</table>
		<!-- END none_conv -->
		</td>
	</tr>
	<!-- END usr_list -->
	<tr height=35>
		<td clazz=z11 align=right style="font-weight: bold;"><span style="cursor: pointer; margin-right: 7px;" onClick="javascript: window.close();">{WIN_CLOSE}</span></td>
	</tr>
</table>
</form>
</body>
</html>