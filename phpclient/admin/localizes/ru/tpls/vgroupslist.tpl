<script type="text/javascript" src="js/charges.js"></script>
<script type="text/javascript" src="js/searchtemplate.js"></script>
<script type="text/javascript" src="js/vgroups.js"></script>
<script type="text/javascript" language="javascript">
	var Localize = { Modules: '<%@ Agents %>', Module: '<%@ Module %>', Tarif: '<%@ Tarif %>', PersonFullName: '<%@ Person full name %>', Description: '<%@ Description %>', Balance: '<%@ Balance %>', Symbol: '<%@ Symbol %>', Agreement: '<%@ Agreement %>', Address: '<%@ Address %>', Phone: '<%@ Phone %>', Login: '<%@ Login %>', Search: '<%@ Search %>', VgTpl: '<%@ Account template %>', Template: '<%@ Template %>', EditAccount: '<%@ Edit account %>', DeleteUser: '<%@ Delete user %>', Status: '<%@ Status %>', Date: '<%@ Date %>', Change: '<%@ Change %>', BlockUp: '<%@ Block up %>', Cancel: '<%@ Cancel %>', TurnOff: '<%@ Turn off %>', TurnOn: '<%@ Turn on %>', IPAddress: 'IP <%@ address %>', All: '<%@ All %>', Blocked: '<%@ Blocked %>', ByClient: '<%@ by client %>', ByMan: '<%@ by manager %>', ByBalance: '<%@ by balance %>', ByTraf: '<%@ by traffic %>', SendingData: '<%@ Sending data %>', FilterRecords: '<%@ Filter of records %>', Users: '<%@ Users %>', Operators: '<%@ Operators %>', Dealers: '<%@ Dealers %>', AccessRestricted: '<%@ Access is restricted to this section %>', Info: '<%@ Info %>', RequestDone: '<%@ Request done successfully %>', Type: '<%@ Type %>', DeleteField: '<%@ Remove %> <%@ field %>', EditField: '<%@ Edit %> <%@ field %>', Field: '<%@ Field %>', Text: '<%@ Text %>', List: '<%@ List %>', DefinedValues: '<%@ Defined values %>', AddNewRecord: '<%@ Add new record %>', Save: '<%@ Save %>', Error: '<%@ Error %>', AddFieldsInVg: '<%@ Additional fields in account %>'  };
	var AUTOLOAD = {AUTOLOAD};
</script>
<form method="POST" action="config.php" id="_Vgroups" usecerber="{IFUSECERBER}">
<input type="hidden" id="_devision_" name="devision" value="7">
<table align="center" width="980" class="table_comm">
	<tr><td class="td_head_ext"><%@ Accounts %></td></tr>
	<tr height="40">
		<td class="td_comm" style="border-right: none">
			<button type="button" title="<%@ Create account %>" onClick="submitForm(this.form.id, 'vgid', 0)"><img border="0" src="images/new22.gif" title="<%@ Create account %>"></button>
			<b><%@ Create account %></b>
			<button type="button" style="margin-left: 25px" title="<%@ Create account template %>" onClick="createHidOrUpdate(this.form.id, 'vgid', 0); submitForm(this.form.id, 'templ', 1)"><img border=0 src="images/new22.gif" title="<%@ Create account template %>"></button>
			<b><%@ Create account template %></b>
			&nbsp;
			<button type="button" title="<%@ Additional user form fields %>" onClick="vgroupFormFields()"><img border=0 src="images/newfield.gif" title="<%@ Additional fields in account %>"></button>
			<b><%@ Additional fields in account %></b>
		</td>
	</tr>
</table>
<table align="center" width="980" class="table_comm" style="border: none; margin-top: 22px; background: none"><tr><td class="td_comm" id="_UsersList" style="border: none"></td></tr></table>
</form>