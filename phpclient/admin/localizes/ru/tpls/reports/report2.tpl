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
<table border=0 cellpadding=0 cellspacing=0 width=980 style='empty-cells: show'>
	<tr>
		<td class=hd2 colspan=10>{DISCARDING}{COLON} {ISMONTH} {ISYEAR}</td>
	</tr>
	<tr class=hd2>
		<td>{USER}</td>
		<td>{ACCOUNTINGNAME}</td>
		<td>{TARPLAN}</td>
		<td>{RENT} ({UNIT})</td>
		<td>{INCLUDEDFORRENT}</td>
		<td>{OVERCOST2} ({UNIT})</td>
		<td>{OVERCOST2}</td>
		<td>{REPORTTOTAL} ({UNIT})</td>
	</tr>
	<!-- BEGIN item -->
	<tr>
		<!-- BEGIN rowspan --><td rowspan="{SPAN}">{UNAME}</td><!-- END rowspan -->
		<td>{LOGIN}</td>
		<td>{TARIF}</td>
		<td class=num>{RENTA}</td>
		<td align=center>{RENTC}</td>
		<td class=num>{OVERA}</td>
		<td align=center>{OVERC}</td>
		<td class=num>{TOTALA}</td>
	</tr>
	<!-- END item -->
	<!-- BEGIN item_total -->
	<tr>
		<td colspan=3>{TOTAL}</td>
		<td class=num1>{RENT_T}</td>
		<td>&nbsp;</td>
		<td class=num1>{OVER_T}</td>
		<td>&nbsp;</td>
		<td class=num1>{TOTAL_T}</td>
	<!-- END item_total -->
	<!-- BEGIN nodata -->
	<tr height=50>
		<td colspan=10 class=hd1>{DATANOTFOUND}</td>
	</tr>
	<!-- END nodata -->
	<tr>
		<td colspan=10 style="font-size: 9px;">* {REPORT2INFO1}</td>
	</tr>
</table>
</body>
</html>