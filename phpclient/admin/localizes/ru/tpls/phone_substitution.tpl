<script type="text/javascript" src="js/phonesubst.js"></script>
<script type="text/javascript" language="javascript">
	var Localize = { IntAtsNum: '<%@ Internal ATS number %>', CliNum: '<%@ Telephone subscriber number %>', NumA: '<%@ Number %> <%@ A %>', NumB: '<%@ Number %> <%@ B %>', NumAB: '<%@ Number %> <%@ A %> <%@ and %> <%@ B %>', GrpSubst: '<%@ Group substitution %>', Substitute: '<%@ Substitute %>', Prefix: '<%@ Prefix %>', Length: '<%@ Length %>', Save: '<%@ Save %>', Cancel: '<%@ Cancel %>', SendingData: '<%@ Sending data %>', Connecting: '<%@ Connecting %>', Change: '<%@ Change %>', Create: '<%@ Create %>', PrefixLengthCut: '<%@ Prefix length to cut %>', prefix: '<%@ prefix %>', Add: '<%@ Add %>', IntAtsNumTempl: '<%@ Internal ATS number template %>', ExtraSymbols: '<%@ Extra symbols %>', Choose: '<%@ Choose %>', Direction: '<%@ Direction %>', Duration: '<%@ Duration %>', TrunkIn: '<%@ Incoming %> <%@ Trunk %>', TrunkOut: '<%@ Outgoing %> <%@ Trunk %>', Cause: '<%@ Cause %>', Parameter: '<%@ Parameter %>', Condition: '<%@ Condition %>', Equal: '<%@ equal %>', More: '<%@ more than %>', Less: '<%@ less than %>', NotEqual: '<%@ not %> <%@ equal %>', Value: '<%@ Value %>', Logic: '<%@ Logic %>', And: '<%@ AND %>', Or: '<%@ OR %>', BillingMediation: '<%@ Billing mediation %>',  Remove: '<%@ Remove %>', Save: '<%@ Save %>', Match: '<%@ match %>', NotMatch: '<%@ not match %>'}
	Ext.onReady(function() { 
		Filter.showFilterForm();
	})
</script>
<form action="config.php" method="POST" id="_PhSubst">
<input type="hidden" name="devision" id="_devision_" value="68">
<input type="hidden" name="module" id="_module_" value="{MODULEID}">
<table align="center" width="860" class="table_comm">
	<tr><td class="td_head_ext" colspan="3"><%@ Phone numbers substitution %>. <%@ Module %>: ID {MODULEID}, {MODULEINFO}</td></tr>
	<tr height="40">
		<td class="td_comm" style="border-right: none">
			&nbsp;
			<button type="button" title="<%@ Create %>" onClick="substForm()"><img border="0" src="images/new22.gif" title="<%@ Create %>"></button>
			<b><%@ Create %></b>
		</td>
	</tr>
</table>
<table align="center" width="860" class="table_comm" style="border: none;">
<tr><td class="td_head_ext" colspan="7"><%@ Numbers %></td></tr>
	<tr>
		<td class="td_head" width="30">&nbsp;</td>
		<td class="td_head" width="220"><%@ Internal ATS number %> / <%@ Internal ATS number template %></td>
		<td class="td_head"><%@ Telephone subscriber number %></td>
		<td class="td_head" width="140"><%@ Substitute %></td>
		<td class="td_head" width="80"><%@ Prefix length to cut %></td>
		<td class="td_head" width="120"><%@ Prefix %></td>
		<td class="td_head" width="30">&nbsp;</td>
	</tr>
	<!-- BEGIN substRow  -->
	<tr align="center">
		<td class="td_comm" width="30"><button onclick="substForm('{RECORDID}')" type="button" title="<%@ Edit %>"><img border="0" title="<%@ Edit %>" src="images1/edit_15.gif"></img></button></td>
		<td class="td_comm">{INTATSNUM}</td>
		<td class="td_comm">{CLINUM}<!-- BEGIN cliGroup --><%@ Group substitution %><!-- END cliGroup --></td>
		<td class="td_comm"><!-- BEGIN substNum_0 --><%@ Calling station number %><!-- END substNum_0 --><!-- BEGIN substNum_1 --><%@ Dialed number %><!-- END substNum_1 --><!-- BEGIN substNum_2 --><%@ Both numbers %><!-- END substNum_2 --></td>
		<td class="td_comm">{LENGTH}</td>
		<td class="td_comm">{PREFIX}</td>
		<td class="td_comm" width="30"><button type="button" title="<%@ Remove %>" onClick="submitForm(this.form.id, 'delete', '{RECORDID}')"><img border="0" title="<%@ Remove %>" src="images1/delete.gif"></button></td>
	</tr>
	<!-- END substRow  -->
</table>
<table align="center" width="860" style="margin-top: 12px;">
	<tr>
		<td id="_filter_"></td>
	</tr>
</table>
</form>