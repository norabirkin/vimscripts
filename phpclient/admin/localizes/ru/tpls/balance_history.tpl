<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=windows-1251">
<title>LANBilling v.1.8</title>
<link rel="StyleSheet" href="main.css" type="text/css">
<script language="JavaScript" type="text/javascript" src="js/protofunctions.js"></script>
<body>
<!-- BEGIN details -->
<table align="center" width="400" class="table_comm">
	<tr class="th_comm" height="25">
		<td class="td_head" colspan="4">{BALANCEHISTORY} ({FORWHOME})</td>
	</tr>
	<!-- BEGIN row -->
	<tr>
		<td class="td_comm" style="text-align: center; width: 25%;">{DATE_1}</td>
		<td class="td_comm" style="text-align: right; width: 25%;">{BALN_1}</td>
		<td class="td_comm" style="text-align: center; width: 25%;">{DATE_2}</td>
		<td class="td_comm" style="text-align: right; width: 25%;">{BALN_2}</td>
	</tr>
	<!-- END row -->
</table>
<!-- END details -->
<!-- BEGIN unauthorized -->
<table align="center" width="400" class="table_comm">
	<tr height="50">
		<td class="td_head">{YOUMUSTACCESS}</td>
	</tr>
</table>
<!-- END unauthorized -->
</body>