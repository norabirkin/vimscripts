<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<link rel="StyleSheet" href="../main.css" type="text/css">
<script language="javaScript" type="text/javascript" src="../js/sbss_crm.js"></script>
<title>LANBilling</title>
</head>
<body align="center">
<!-- BEGIN validData -->
<form action="sbssCrmData.php" method="POST" id="_sbssForm" enctype="multipart/form-data">
<input type="hidden" name="submenu" value="{SUBMENU}">
<input type="hidden" name="page" value="{PAGEVALUE}">
<input type="hidden" name="uid" value="{CLIENTID}">
<!-- BEGIN fileEdit --><input type="hidden" name="editFileId" value="{FILEID}"><!-- END fileEdit -->
<table class="table_comm" width="850" align="center" cellpadding="0" cellspacing="0" style="border: none">
	<tr><td><table class="table_comm" width="100%">
	<tr><td class="td_head_ext">CRM</td></tr>
	<tr height=40>
		<td class="td_comm">
			&nbsp;
			<button type="button" class="img_button" onClick="sbssSubmitFor('_sbssForm', 'save', 1)"><img title="{SAVE}" name="create_new" border=0 src="../images1/create1.gif"></img></button>
			<b>{SAVE}</b>
			<!-- BEGIN attachData -->&nbsp;<button type="button" class="img_button" onClick="attachFormView('_UplFile')" title="{ATTACHFILE}"><img title="<%@ Attach file %>"  border="0" src="../images/attach.gif"></img></button>
			<b><%@ Attach file %></b><!-- END attachData -->
		</td>
	</tr></table>
	</td></tr>
	<tr height="22" class="empty_back"><td  style="border: none">&nbsp;</td></tr>
	
	<tr><td class="empty_back">
	<table class="MMenu empty_back" cellpadding="0" cellspacing="0">
		<tr>
			<!-- BEGIN subMenu -->
			<!-- BEGIN SelectedMenu -->
			<td class="MLCSelected"></td>
			<td class="MCSelected" width="{WIDTHVALUE}" onClick="document.forms[0].submenu.value='{SUBMENUSUBMIT}'; document.forms[0].submit();">{MENUNAME}</td>
			<td class="MRCSelected"></td>
			<td class="MMBreak"></td>
			<!-- END SelectedMenu -->
			<!-- BEGIN UnSelectedMenu -->
			<td class="MLCunSelected"></td>
			<td class="MCunSelected" width="{WIDTHVALUE}" onClick="document.forms[0].submenu.value='{SUBMENUSUBMIT}'; document.forms[0].submit();">{MENUNAME}</td>
			<td class="MRCunSelected"></td>
			<td class="MMBreak"></td>
			<!-- END UnSelectedMenu -->
			<!-- END subMenu -->
			<!-- BEGIN menuFreeSpace --><td>&nbsp;</td><!-- END menuFreeSpace -->
		</tr>
	</table>
	</td></tr>
	
	<tr height="15" bgcolor="#b0b0b0"><td>&nbsp;</td></tr>
</table>
<!-- BEGIN errorShow -->
<table class="table_comm" width="850" align="center" cellpadding="0" cellspacing="0" style="margin-bottom: 17px">
	<tr height="22"><td colspan="2" class="td_head">{WHILESAVEERROR}</tr>
	<!-- BEGIN erroRow --><tr height="22" style="color: red"><td class="td_comm" style="padding-left: 5px;">{ERRORMESSAGE}</td>
	<td class="td_comm" width="80" align="center">{ERROR}</td></tr><!-- END erroRow -->
</table>
<!-- END errorShow -->
<!-- BEGIN attachForm --><table class="table_comm" id="_UplFile" width="850" align="center" style="margin-bottom: 5px; margin-top: 5px; <!-- BEGIN attachHide -->display: none<!-- END attachHide -->">
<tr height="27"><td class="td_comm" width="440" style="padding-left: 5px">{HD_CRMFILE_DESCR}: <input type="text" name="fileDescr" style="width: 300px" value="{FILEDESCR}"></td>
<td class="td_comm" style="padding-left: 5px">{HD_CRMFILE}: <input type="file" name="attach" size="28"></td></tr></table><!-- END attachForm -->
<!-- BEGIN Data --><table class="table_comm" width="850" align="center">
	<tr height="22"><td colspan="8" class="td_comm" style="padding-left: 5px">{PAGES}: 
	<!-- BEGIN pBack --><a href="#" onClick="sbssSubmitFor('_sbssForm', 'page', '{PAGE}')" style="margin-right: 7px"><<</a><!-- END pBack -->
	<!-- BEGIN pages -->
	<!-- BEGIN pGoto --><a href="#" onClick="sbssSubmitFor('_sbssForm', 'page', '{PAGE}')" style="margin-right: 7px;">{PAGE}</a><!-- END pGoto -->
	<!-- BEGIN pSel --><span style="margin-right: 7px; font-weight: bold">{PAGE}</span><!-- END pSel -->
	<!-- END pages -->
	<!-- BEGIN pForWD --><a hewf="#" onClick="sbssSubmitFor('_sbssForm', 'page', '{PAGE}')" style="margin-right: 7px;">>></a><!-- END pForWD -->
	</td>
	<!-- BEGIN crmFileHead --><tr><td class="td_head" width="110">{CARDCREATED}</td><td class="td_head" width="110">{DATEOFEDIT}</td>
	<td class="td_head">{T_AUTHOR}</td><td class="td_head">{HD_CRMFILE_DESCR}</td>
	<td class="td_head" width="110">{HD_CRMFILE}</td><td class="td_head" width="80">{FILE_SIZE}</td>
	<td class="td_head" width="30">&nbsp;</td><td class="td_head" width="30">&nbsp;</td>
	</tr><!-- END crmFileHead -->
	<!-- BEGIN mailHead --><tr><td class="td_head" width="110">{CARDCREATED}</td><td class="td_head" width="160">{FROMWHOME}</td>
	<td class="td_head" width="160">{TOWHOME}</td><td class="td_head" width="110">{MANAGER_SINGLE}</td>
	<td class="td_head">{SUBJECT}</td><td class="td_head" width="80">{FILE_SIZE}</td>
	<td class="td_head" width="30">&nbsp;</td><td class="td_head" width="30">&nbsp;</td>
	</tr><!-- END mailHead -->
	<!-- BEGIN row --><tr height="29" align="center">
	<td class="td_comm">{THISDATE_1}</td>
	<td class="td_comm">{THISDATE_2}</td>
	<td class="td_comm">{THISCOL1}</td>
	<td class="td_comm">{THISCOL2}</td>
	<td class="td_comm"><a href="sbssFiles.php?for={THISMODE}&uid={CLIENTID}&fid={THISFILEID}" style="text-decoration: underline">{THISCOL3}<!-- BEGIN emptySubj --><span style="font-style: italic">{SUBJECTEMPTY}</span><!-- END emptySubj --></a></td>
	<td class="td_comm">{THIS_SIZE}</td>
	<td class="td_comm" width="30"><!-- BEGIN button1 --><button type="button" onClick="sbssSubmitFor('_sbssForm','editFileId','{THISFILEID}')" class="img_button"><img border="0" src="../images/edit16.gif"></button><!-- END button1 --></td>
	<td class="td_comm" width="30"><!-- BEGIN button2 --><button type="button" onClick="sbssSubmitFor('_sbssForm','dropFileId','{THISFILEID}')" class="img_button"><img border="0" src="../images1/delete.gif"></button><!-- END button2 --></td>
	</tr>
	<!-- END row -->
</table><!-- END Data -->
<!-- BEGIN noData --><tr><td>
<table class="table_comm" id="_UplFile" width="850" align="center" style="margin-bottom: 5px; margin-top: 5px;">
<tr align="center" height="30"><td class="td_comm">{NODATA}</td></tr></table>
</td></tr><!-- END noData -->
</form>
<!-- END validData -->
<!-- BEGIN noValidData -->
<table align=center class=accessDeny>
	<tr>
		<td rowspan=2 valign=center align=center width=100 height=50>
			<img src="../images/warning.png" border=0>
		</td>
		<td><a a href="javascript: window.close()" title="{WINCLOSE}">{MESSAGE}<a></td>
	</tr>
	<tr>
		<td><a href="#" onClick="window.close()" style="text-decoration: underline">{CLOSE}</a><td>
	</tr>
</table>
<!-- END noValidData -->
</body>
</html>