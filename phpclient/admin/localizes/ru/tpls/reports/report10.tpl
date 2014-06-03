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
		<td class="hd2" colspan="{COLSPAN}">{DEPTORS}: {ISMONTH} {ISYEAR} - {NOWMONTH} {NOWYEAR}</td>
	</tr>
	<tr class="hd2">
		<td>{USER}</td>
		<td>{AGREEMENT}</td>
		<!-- BEGIN noneConvergent --><td>{AGENTUSER}</td><!-- END noneConvergent -->
		<td>{CURRENTBALANCE} ({IS_NATCURRENCYSYMBOL})</td>
	</tr>
	<!-- BEGIN vgListItem --><tr>
		<td>{THISUSER}</td>
		<td>{THISAGRM}</td>
		<!-- BEGIN noneConvergentItem --><td>{THISAGENTUSER}</td><!-- END noneConvergentItem -->
		<td class="num">{THISBALANCE}</td>
	</tr><!-- END vgListItem -->
	<!-- BEGIN totalLine --><tr><td colspan="{COLSPAN}" class="hd3">{TOTAL}</td><td class="num1">{TOTALSUM}</td></tr><!-- END totalLine -->
	<!-- BEGIN vgNoData --><tr height="50">
		<td colspan="{COLSPAN}" class="hd1">{DATANOTFOUND}</td>
	</tr><!-- END vgNoData -->
</table>
</body>
</html>