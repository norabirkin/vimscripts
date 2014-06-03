<script type="text/javascript" src="js/calendar.js"></script>
<script language="javascript">
function checkGenerateForm(form) { 
var struct = { prefix: '<%@ Please, specify %>: ', fields: ['cardgrp', 'amount', 'summ', 'valency', 'year', 'month', 'day'], values: new Array() };
Ext.each(struct.fields, function(item) { if(form[item].value*1 <= 0) { struct.values[struct.values.length] = Ext.get(item + '_T').dom.firstChild.nodeValue.replace(/:$/, '') } }); if(struct.values.length) { alert(struct.prefix + struct.values.join(', ')); return false; }
return true;
}
</script>
<form method="POST" action="config.php" id="_GenerateCards">
<input type="hidden" id="_devision_" name="devision" value="109">
<table align="center" width="800" class="table_comm">
	<tr><td class="td_head_ext" colspan="2"><%@ Activation cards %> / <%@ Pre-paid cards %></td></tr>
	<tr height="40">
		<td class="td_comm">
			&nbsp;
			<button type="button" title="<%@ Create %>" onClick="if(checkGenerateForm(this.form)) { submitForm(this.form.id, 'generate', 1) }"><img border=0 src="images/new22.gif"></img></button>
			<b><%@ Create %></b>
		</td>
	</tr>
</table>
<table align="center" width="800" class="table_comm" style="margin-top: 22px">
<!-- BEGIN doneWithError --><tr><td class="td_comm" colspan="2" style="color: red; font-weight: bold"><%@ There was an error while sending data to server %>! <%@ See logs for details %></tr><!-- END doneWithError -->
<!-- BEGIN doneWithOk --><tr><td class="td_comm" colspan="2" style="color: green; font-weight: bold"><%@ Request done successfully %></tr><!-- END doneWithOk -->
<tr>
	<td class="td_comm td_bold td_padding_l7" width="40%" id="cardgrp_T"><%@ Cards group %>:</td>
	<td class="td_comm" width="60%"><select name="cardgrp" style="width: 220px" onChange="this.form.submit()"><!-- BEGIN CardGrpOtp --><option value="{CARDGRPID}" <!-- BEGIN CardGrpOtpSel -->selected<!-- END CardGrpOtpSel -->>{CARDGRPNAME}</option><!-- END CardGrpOtp --></select></td>
</tr>
<tr>
	<td class="td_comm td_bold td_padding_l7"><%@ Activate %> <%@ till %>:</td>
	<td class="td_comm">
	<table class="table_comm" style="border: none;"><tr>
	<td class="td_comm" style="border: none" width="30"><button type="button" id='_cal_' onClick="Calendar(this.id, '_year_', '_month_', '_day_')"><img border="0" src="images/cal.gif"></button></td>
	<td class="td_comm" style="border: none"><select id="_year_" name="year" style="width: 80px"><!-- BEGIN yearOpt --><option value="{YEARID}" <!-- BEGIN yearOptSel -->selected<!-- END yearOptSel -->><%@ {YEARNAME} %></option><!-- END yearOpt --></select></td>
	<td class="td_comm" style="border: none"><select id="_month_" name="month" style="width: 80px"><!-- BEGIN monthOpt --><option value="{MONTHID}" <!-- BEGIN monthOptSel -->selected<!-- END monthOptSel -->><%@ {MONTHNAME} %></option><!-- END monthOpt --></select></td>
	<td class="td_comm" style="border: none"><select id="_day_" name="day" style="width: 80px"><!-- BEGIN dayOpt --><option value="{DAYID}" <!-- BEGIN dayOptSel -->selected<!-- END dayOptSel -->><%@ {DAYNAME} %></option><!-- END dayOpt --></select></td>
	</tr></table><span id="year_T" style="display: none"><%@ Year %></span><span id="month_T" style="display: none"><%@ Month %></span><span id="day_T" style="display: none"><%@ Day %></span>
	</td>
</tr>
<tr>
	<td class="td_comm td_bold td_padding_l7" id="amount_T"><%@ Number of cards %>:</td>
	<td class="td_comm"><input type="text" style="width: 120px" name="amount" value="{AMOUNT}"></td>
</tr>
<tr>
	<td class="td_comm td_bold td_padding_l7" id="summ_T"><%@ Face-value %>:</td>
	<td class="td_comm"><input type="text" style="width: 120px" name="summ" value="{SUMM}"><span style="margin-left: 10px">({CURRSYMB})</span></td>
</tr>
<tr>
	<td class="td_comm td_bold td_padding_l7" id="valency_T"><%@ Key length %> (4-32 <%@ symbols %>):</td>
	<td class="td_comm"><input type="text" style="width: 120px" name="valency" value="{VALENCY}"></td>
</tr>
<tr>
	<td class="td_comm td_bold td_padding_l7" id="usealpha_T"><%@ Use alphabet symbols %>:</td>
	<td class="td_comm"><input type="checkbox" name="usealpha" value="1" <!-- BEGIN useAlpha -->checked<!-- END useAlpha -->></td>
</tr>
</table>
</form>
