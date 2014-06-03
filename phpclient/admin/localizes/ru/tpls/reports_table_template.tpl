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

<!-- BEGIN start_form -->
<form method=post action="{FORM_ACTION}" target="{FORM_TARGET}" id="{FORM_ID}">

<!-- BEGIN form_hidden -->
<input type=hidden name={HIDDEN_NAME} value='{HIDDEN_VALUE}'>
<!-- END form_hidden -->

<!-- END start_form -->

<!-- BEGIN short_form -->
</form>
<!-- END short_form -->

<!-- BEGIN table_main -->
<table border=0 {TABLE_PROP}>
	<!-- BEGIN line -->
	<tr {TR_PROP}>
		<!-- BEGIN col -->
		<td {TD_PROP}>
		{COL_VAL}
		
		<!-- BEGIN table_inner -->
		<table border=0 {TP}>
			<!-- BEGIN line_inner -->
			<tr {TRP}>
				<!-- BEGIN col_inner -->
				<td {TDP}>{INNVAL}</td>
				<!-- END col_inner -->
			</tr>
			<!-- END line_inner -->
		</table>
		<!-- END table_inner -->
		
		</td>
		<!-- END col -->
	</tr>
	<!-- END line -->
</table>
<!-- END table_main -->

<!-- BEGIN full_form -->
</form>
<!-- END full_form -->

</body>
</html>