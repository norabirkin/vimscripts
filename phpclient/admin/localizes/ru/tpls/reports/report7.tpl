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
<table border=0 cellpadding=0 cellspacing=0 width=800 style='empty-cells: show'>
	<tr>
		<td class=hd2 colspan=10>{PROMISEDPAYREPORT}{COLON} {ISMONTH} {ISYEAR}</td>
	</tr>
	
	<!-- BEGIN for_convergent -->
	<tr class=hd2>
		<td>{USER}</td>
		<td>{PAYMENTSUM} ({IS_NATCURRENCYSYMBOL})</td>
		<td>{PAYMENTDATE}</td>
		<td>{PROMISEDTRUETILL}</td>
		<td>{PROMISEDNOTPAYED} ({IS_NATCURRENCYSYMBOL})</td>
	</tr>
	
	<!-- BEGIN for_convergent_item -->
	<tr>
		<td>{IS_USERNAME}</td>
		<td class=num>{IS_PAYMENTSUM}</td>
		<td align=center>{IS_PAYMENTDATE}</td>
		<td align=center>{IS_PROMISEDTRUETILL}</td>
		<td <!-- BEGIN rest_num -->class=num<!-- END rest_num --> <!-- BEGIN rest_free -->align=center<!-- END rest_free -->>{IS_REST}</td>
	</tr>
	<!-- END for_convergent_item -->
	
	<!-- BEGIN for_convergent_sum -->
	<tr>
		<td>{TOTAL}{COLON}</td>
		<td class=num1>{IS_TOTALSUM}</td>
		<td colspan=2>&nbsp;</td>
		<td class=num1>{IS_TOTALREST}</td>
	</tr>
	<!-- END for_convergent_sum -->
	
	<!-- END for_convergent -->
	
	<!-- BEGIN for_Nconvergent -->
	<tr class=hd2>
		<td>{USER}</td>
		<td>{GROUP}</td>
		<td>{PAYMENTSUM} ({IS_NATCURRENCYSYMBOL})</td>
		<td>{PAYMENTDATE}</td>
		<td>{PROMISEDTRUETILL}</td>
		<td>{PROMISEDNOTPAYED} ({IS_NATCURRENCYSYMBOL})</td>
	</tr>
	
	<!-- BEGIN for_Nconvergent_item -->
	<tr>
		<!-- BEGIN rowspan --><td rowspan={ROWSPAN}>{IS_USERNAME}</td><!-- END rowspan -->
		<td>{IS_VGNAME}</td>
		<td class=num>{IS_PAYMENTSUM}</td>
		<td align=center>{IS_PAYMENTDATE}</td>
		<td align=center>{IS_PROMISEDTRUETILL}</td>
		<td <!-- BEGIN Nrest_num -->class=num<!-- END Nrest_num --> <!-- BEGIN Nrest_free -->align=center<!-- END Nrest_free -->>{IS_REST}</td>
	</tr>
	<!-- END for_Nconvergent_item -->
	
	<!-- BEGIN for_Nconvergent_sum -->
	<tr>
		<td>{TOTAL}{COLON}</td>
		<td>&nbsp;</td>
		<td class=num1>{IS_TOTALSUM}</td>
		<td colspan=2>&nbsp;</td>
		<td class=num1>{IS_TOTALREST}</td>
	</tr>
	<!-- END for_Nconvergent_sum -->
	
	<!-- END for_Nconvergent -->
	
	<!-- BEGIN nodata -->
	<tr height=50>
		<td colspan=10 class=hd1>{DATANOTFOUND}</td>
	</tr>
	<!-- END nodata -->
</table>
</body>
</html>
