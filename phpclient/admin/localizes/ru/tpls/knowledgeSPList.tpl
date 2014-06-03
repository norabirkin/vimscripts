<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<link rel="StyleSheet" href="../main.css" type="text/css">
<script language="javaScript" type="text/javascript" src="../js/sbss_crm.js"></script>
<title>LANBilling v.1.8</title>
</head>
<body align="center">
<!-- BEGIN validData -->
<form action="kbList.php" method="POST" id="_sbssForm">
<table class="table_comm" width="650" align="center" cellpadding="0" cellspacing="0">
<tr height="22"><td class="td_head" colspan="2">{MEN_KB_SHOW}</td></tr>
<tr height="22"><td class="td_comm" style="padding-left: 5px; border-right: none"><a href="#" style="text-decoration: underline" onClick="copyToKnowledge('_sbssForm', '0', document.getElementById('_kbName').value, '_kbName')">{NEWKNOWLEDGE}</a>:</td>
<td class="td_comm"><input type="text" style="width: 400px" id="_kbName"></td></tr>
</table>
<!-- BEGIN Data -->
<table class="table_comm" width="650" align="center" cellpadding="0" cellspacing="0" style="margin-top: 17px">
<tr height="25"><td class="td_comm" colspan="3"><table width="100%" class="table_comm" style="border: none">
<tr><td style="padding-left: 5px" width="9%">{SEARCH}:</td>
<td><input type="text" style="width: 400px" name="string"></td>
<td width="27%"><button type="button" class="img_button" onClick="sbssSubmitFor('_sbssForm', 'search', 1)"><img border="0" src="../images/find22.gif"></button></td></tr>
</table></td></tr>
<tr height="22"><td colspan="3" class="td_comm" style="padding-left: 5px">{PAGES}: 
	<!-- BEGIN pBack --><a href="#" onClick="sbssSubmitFor('_sbssForm', 'page', '{PAGE}')" style="margin-right: 7px"><<</a><!-- END pBack -->
	<!-- BEGIN pages -->
	<!-- BEGIN pGoto --><a href="#" onClick="sbssSubmitFor('_sbssForm', 'page', '{PAGE}')" style="margin-right: 7px;">{PAGE}</a><!-- END pGoto -->
	<!-- BEGIN pSel --><span style="margin-right: 7px; font-weight: bold">{PAGE}</span><!-- END pSel -->
	<!-- END pages -->
	<!-- BEGIN pForWD --><a hewf="#" onClick="sbssSubmitFor('_sbssForm', 'page', '{PAGE}')" style="margin-right: 7px;">>></a><!-- END pForWD -->
	</td>
</tr>
<tr height="22">
<td class="td_head" width="80">#</td>
<td class="td_head">{SUBJECT}</td>
<td class="td_head" width="200">{HD_REQUESTCLASS}</td>
</tr>
<!-- BEGIN row --><tr height="22" align="center" <!-- BEGIN classColor -->bgcolor="#{CLASSCOLOR}"<!-- END classColor -->>
<td class="td_comm">{THISID}</td>
<td class="td_comm"><a href="#" onClick="copyToKnowledge('_sbssForm', '{THISID}', '{THISSUBJECT}', '_kbName')">{THISSUBJECT}</a></td>
<td class="td_comm">{THISCLASSNAME}</td>
</tr><!-- END row -->
<!-- BEGIN noData --><tr align="center" height="30"><td class="td_comm" colspan="3">{NODATA}</td></tr><!-- END noData -->
<!-- END Data -->
</table>
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
