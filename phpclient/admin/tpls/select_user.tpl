<!-- BEGIN select_user -->
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=windows-1251">
<title>{TITLE}</title>
<LINK REL="StyleSheet" HREF="main.css" type="text/css">
</head>

<body>
<script language="JavaScript">
function set_user_params(uidd, fio)
{
	parent.opener.document.forms[1].uid.value = uidd;
	parent.opener.document.forms[1].vg_user.value = uidd;
	parent.opener.document.forms[1].vg_user_fio.value = fio;
	document.getElementById('user_changed').style.visibility = "visible";
};
</script>

<form action="select_user.php" method="POST" name="ttt">
</form>

<form action="select_user.php" method="POST" name="user_form">
<input type="hidden" name="whatpressed" value=0>

<table class="z11" cellpadding="0" cellspacing="0" border="0" width="600" align="center">
	<tr>
	      <td width="450" align="center" class="z11" height="30">
			&nbsp;
			<span id="user_changed" style="visibility: hidden;">
				<font class="z11"><b>Параметры учетной записи изменены</b></font>
			</span>
		</td>
		<td width="150" align="right" class="z11" height="30">
			<a href="JavaScript: window.close();"><font class="z11">{CLOSE_WIND}</font></a>&nbsp;&nbsp;
		</td>
	</tr>
</table>

<table class="z11" cellpadding="0" cellspacing="0" border="0" width="600" align="center">
   <tr>
   	<th class="z11" width="200" height="30" bgcolor="e0e0e0"
		style="border: solid 1px #c0c0c0; border-right: none;">
   	  <font class="z11">{TABLE_TITLE}&nbsp;{USERS_NUM}</font>
   	</th>
   	<th colspan="2" class="z11" width="400" height="30" bgcolor="e0e0e0" align="right"
		style="border: solid 1px #c0c0c0; border-left: none;">
   	<font class="z11">{REC_PO}</font>&nbsp;
   	<select class="z11" name="rows_on_page" style="width: 60px;" onChange="document.forms['user_form'].submit();">
   	  <option class="z11" value="25" {ACT_25}>25</option><br>
	  <option class="z11" value="50" {ACT_50}>50</option>
	  <option class="z11" value="100" {ACT_100}>100</option>
	  <option class="z11" value="500" {ACT_500}>500</option>
	  <option class="z11" value="100000" {ACT_100000}>{REC_ALL}</option>
   	</select>&nbsp;
   	<font class="z11">{RECORDS}</font>&nbsp;&nbsp;
   	</th>
   </tr>
   <tr>
   	<td class="z11" width="250" height="50" align="center" style="border: none; border-bottom: solid 1px #c0c0c0; border-left: solid 1px #c0c0c0;">
   	<input type="text" name="search_text" class="z11" style="width: 200px;" value="{SEARCH_TEXT}">
   	</td>
   	<td class="z11" width="200" height="50" align="center" style="border: none; border-bottom: solid 1px #c0c0c0;">
   	<select class="z11" name="search_type" style="width: 170px;">
   	<option class="z11" value="-1">{SEARCH_NOT}</option>
   	<!-- BEGIN search_type_row -->
   	<option class="z11" value="{USER_S_VAL}" {USER_S_SEL}>{USER_S_OPT}</option>
   	<!-- END search_type_row -->
   	</select>
   	</td>
   	<td class="z11" width="150" height="50" align="center" style="border: none; border-bottom: solid 1px #c0c0c0; border-right: solid 1px #c0c0c0;">
   	<input type="submit" class="z11" name="search_start" style="width: 100px;" value="{SEARCH_BUT}">
   	</td>
   </tr>
   <tr><td colspan="3" height="20" width="600">&nbsp;</td></tr>
</table>
<!-- BEGIN show_user_rows -->
<table class="z11" cellpadding="0" cellspacing="0" border="0" width="600" align="center">

	<tr>
	   <td colspan="3" class="z11" width="600" align="left" height="25" bgcolor="e0e0e0" 
		style="border: solid 1px #c0c0c0;">
	   &nbsp;&nbsp;{PAGES_TIT}:&nbsp;
	   <font class="z11">{PAGES_STR}</font>
	   </td> 
	</tr>
	<tr>
	   <th class="z11" width="70" align="center" height="25" bgcolor="e0e0e0" style="border: solid 1px #c0c0c0; border-top: none;">
	   <font class="z11">{U_NUM_Z}</font>
	   </th> 
	   <th class="z11" width="350" align="center" height="25" bgcolor="e0e0e0" style="border: solid 1px #c0c0c0; border-left: none; border-top: none;">
	   <font class="z11">{U_FIO_Z}</font>
	   </th> 
	   <th class="z11" width="180" align="center" height="25" bgcolor="e0e0e0" style="border: solid 1px #c0c0c0; border-left: none; border-top: none;">
	   <font class="z11">{U_LOGIN_Z}</font>
	   </th> 
	</tr>
	
	<!-- BEGIN user_curr_row -->
	<tr id={U_UID} onmouseover="document.getElementById({U_UID}).style.background = '#f5f5f5';"
	    onmouseout="document.getElementById({U_UID}).style.background = '#ffffff';" 
	    onclick="set_user_params({U_UID}, '{U_FIO}');"
	    style="cursor: pointer;">
	   <td class="z11" width="70" align="center" height="25" style="border: solid 1px #c0c0c0; border-top: none;">
	   <font class="z11">{U_NUM}</font>
	   </td> 
	   <td class="z11" width="350" align="center" height="25" style="border: solid 1px #c0c0c0; border-left: none; border-top: none;">
	   <font class="z11">{U_FIO}</font>
	   </td> 
	   <td class="z11" width="180" align="center" height="25" style="border: solid 1px #c0c0c0; border-left: none; border-top: none;">
	   <font class="z11">{U_LOGIN}</font>
	   </td> 
	</tr>
	<!-- END user_curr_row -->
</table>
<!-- END show_user_rows -->
<table class="z11" cellpadding="0" cellspacing="0" border="0" width="600" align="center">
	<tr>
		<td width="600" align="right" class="z11" height="30">
			<a href="JavaScript: window.close();"><font class="z11">{CLOSE_WIND}</font></a>&nbsp;&nbsp;
		</td>
	</tr>
</table>

</form>
</body>
</html>

<!-- END select_user -->