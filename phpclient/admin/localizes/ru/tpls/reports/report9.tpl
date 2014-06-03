<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=windows-1251">
<title>LANBilling v.1.8</title>
<style>
*  { font-family: verdana,tahoma,arial,lucida,helvetica,sans-serif; font-size: 11px; }
td { padding: 4px; border-right: solid 1px #c0c0c0; border-bottom: solid 1px #c0c0c0; }
table { border-left: solid 1px #c0c0c0; border-top: solid 1px #c0c0c0; }
.hd1 { font-weight: bold; font-size: 11px; text-align: center; }
.hd2 { font-weight: bold; font-size: 11px; text-align: center; background-color: #e0e0e0; }
.hd3 { font-weight: bold; font-size: 11px; }
.hd4 { font-weight: bold; text-align: center; padding: 0px; font-size: 11px; }
.num { font-size: 11px; text-align: right; }
.num1 { font-weight: bold; font-size: 11px; text-align: right; }
.link { text-decoration: underline; color: red; cursor: pointer; text-align: right; }
.link1 { font-weight: bold; text-decoration: underline; cursor: pointer; text-align: center; }
</style>
</head>
<body>
<table border=0 cellpadding="0" cellspacing="0" width="800" style="empty-cells: show">
	<tr>
		<td class="hd2" colspan="6">{PLANEDOFFLINEVGROUPS}: {ISMONTH} {ISYEAR}</td>
	</tr>
	<tr class="hd2">
		<td>{N_DATE}</td>
		<td>{USER}</td>
		<td>{AGREEMENT}</td>
		<td>{AGENTUSER}</td>
		<td>{STATUS}</td>
	</tr>
	<!-- BEGIN listBlock -->
	<!-- BEGIN agentName --><td colspan="5" class="hd3">{THISAGENT}</td><!-- END agentName -->
	<!-- BEGIN vgListItem --><tr>
		<td>{THISDATE}</td>
		<td>{THISUSER}</td>
		<td>{THISAGRM}</td>
		<td>{THISAGENTUSER}</td>
		<td>{THISSTATUS}</td>
	</tr><!-- END vgListItem -->
	<!-- END listBlock -->
	<!-- BEGIN vgNoData --><tr height="50">
		<td colspan="5" class="hd1">{DATANOTFOUND}</td>
	</tr><!-- END vgNoData -->
</table>
</body>
</html>