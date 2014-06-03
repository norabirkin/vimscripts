<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=windows-1251">
<title>LANBilling v.1.8</title>
<style>
*  { font-family: verdana,tahoma,arial,lucida,helvetica,sans-serif; font-size: 11px; }
td { padding: 4px; border-right: solid 1px #c0c0c0; border-bottom: solid 1px #c0c0c0; }
table { border-left: solid 1px #c0c0c0; border-top: solid 1px #c0c0c0; }
td.hd1 { font-weight: bold; font-size: 11px; text-align: center; }
.hd2 { font-weight: bold; font-size: 11px; text-align: center; background-color: #e0e0e0; }
td.hd3 { font-weight: bold; font-size: 11px; }
td.num { font-size: 11px; text-align: right; }
td.num1 { font-weight: bold; font-size: 11px; text-align: right; }
</style>
</head>

<body>
<table width="950" cellpadding="0" cellspacing="0" style='empty-cells: show'>
	<tr height="25">
		<td class="hd2" colspan="9">{INTER_SERV}, {CATALOGTRAFF}{COLON} {ISMONTH} {ISYEAR}</td>
	</tr>
	<tr class="hd2">
		<td width="50">№№</td>
		<td width="220">{USER}</td>
		<td>{AGREEMENT}</td>
		<!-- BEGIN hd_user_kod --><td>{KOD_1C}</td><!-- END hd_user_kod -->
		<td>{AGENTUSER}</td>
		<!-- BEGIN hd_vg_kod --><td>{KOD_1C}</td><!-- END hd_vg_kod -->
		<td>{N_DIRECT}</td>
		<td>{CATALOG}</td>
		<td width="60">{TRAFFIC}</td>
		<td width="90">{CHARGEHISTORY} ({UNIT})</td>
	</tr>

	<!-- BEGIN row -->
	<tr>
		<!-- BEGIN user_info -->
		<td rowspan="{ROWSPAN}">{ITER}</td>
		<td rowspan="{ROWSPAN}">{USERNAME}</td>
		<td rowspan="{ROWSPAN}">{AGRMNUM}</td>
		<!-- BEGIN user_kod --><td rowspan="{ROWSPAN}">{KOD}</td><!-- END user_kod -->
		<!-- END user_info -->
		
		<!-- BEGIN vg_login --><td rowspan="{ROWSPAN}">{VGLOGIN}</td><!-- END vg_login -->
		<!-- BEGIN vg_kod --><td rowspan="{ROWSPAN}">{VGKOD}</td><!-- END vg_kod -->
		
		<!-- BEGIN cat_traf -->
		<td>{CATNAME}</td>
		<td>{ZONENAME}</td>
		<td class="num">{TRAFVAL}</td>
		<td class="num">{AMOUNT}</td>
		<!-- END cat_traf -->
		
		<!-- BEGIN row_total -->
		<tr>
			<td class="hd3" colspan="{COLSPAN}">{TOTAL}:</td>
			<td class="num1">{USERTRAFTOTAL}</td>
			<td class="num1">{USERAMOUNTTOTAL}</td>
		</tr>
		<!-- END row_total -->
	</tr>
	<!-- END row -->
	
	<!-- BEGIN total -->
	<tr>
		<td class="hd3" colspan="{COLSPAN}">{TOTAL}:</td>
		<td class="num1">{USERTRAFTOTAL}</td>
		<td class="num1">{USERAMOUNTTOTAL}</td>
	</tr>
	<!-- END total -->
	
	<!-- BEGIN nodata -->
	<tr height=50>
		<td colspan="9" class="hd1">{DATANOTFOUND}</td>
	</tr>
	<!-- END nodata -->
</table>
</body>
</html>