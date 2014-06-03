<form method="POST" action="config.php" id="_CardGrp">
<input type="hidden" id="_devision_" name="devision" value="545">
<input type="hidden" id="_currency_" name="currency" value="{CURID}">
<!-- BEGIN cardGrpList -->
<table align="center" width="800" class="table_comm">
	<tr><td class="td_head_ext" colspan="2"><%@ Cards groups %></td></tr>
	<tr height="40">
		<td class="td_comm">
			&nbsp;
			<button type="submit" title="<%@ Create %>" onClick="createHidOrUpdate(this.form.id, 'cardgrp', 0)"><img border=0 src="images/new22.gif"></button>
			<b><%@ Create %></b>
		</td>
	</tr>
</table>

<table align="center" width="800" class="table_comm" style="margin-top: 22px">
<!-- BEGIN doneWithErrorList --><tr><td class="td_comm" colspan="8" style="color: red; font-weight: bold"><%@ There was an error while sending data to server %>! <%@ See logs for details %></tr><!-- END doneWithErrorList -->
<tr>
	<td class="td_head" width="30">&nbsp;</td>
	<td class="td_head" width="40">ID</td>
	<td class="td_head"><%@ Description %></td>
	<td class="td_head" width="130"><%@ Author %></td>
	<td class="td_head" width="100"><%@ Currency %></td>
	<td class="td_head" width="130"><%@ User %></td>
	<td class="td_head" width="70"><%@ Cards %></td>
	<td class="td_head" width="30">&nbsp;</td>
</tr>
<!-- BEGIN cardGrpEmpty --><tr align="center" height="40"><td class="td_comm" style="color: red; font-weight: bold" colspan="7" height="40"><%@ No data found %></td></tr><!-- END cardGrpEmpty -->
<!-- BEGIN cardsGrpItem -->
<tr align="center">
	<td class="td_comm"><button type="button" onclick="submitForm(this.form.id, 'cardgrp', '{CARDGRPID}')" title="<%@ Edit %>"><img border="0"  title="<%@ Edit %>" src="images1/edit_15.gif"></img></button></td>
	<td class="td_comm" width="40">{CARDGRPID}</td>
	<td class="td_comm">{CARDGRPDESCR}</td>
	<td class="td_comm" width="130">{CARDGRPAUTHOR}</td>
	<td class="td_comm" width="100">{CARDGRPCUR}</td>
	<td class="td_comm" width="130">{CARDGRPUSER}</td>
	<td class="td_comm" width="70">{CARDSCNT}</td>
	<td class="td_comm" width="30"><!-- BEGIN cardGrpDropNo -->-<!-- END cardGrpDropNo --><!-- BEGIN cardGrpDrop --><button onClick="submitForm(this.form.id, 'cardgrpdel', '{CARDGRPID}');" type="button" title="<%@ Remove %>"><img title="<%@ Remove %>" border="0" src="images1/delete.gif"></img></button><!-- END cardGrpDrop --></td>
</tr>
<!-- END cardsGrpItem -->
</table>
<!-- END cardGrpList -->

<!-- BEGIN cardGrpForm -->
<input type="hidden" id="_cardgrp_" name="cardgrp" value="{CARDSETID}">
<table align="center" width="800" class="table_comm">
	<tr><td class="td_head_ext" colspan="2"><%@ Cards groups %></td></tr>
	<tr height="40">
		<td class="td_comm">
			&nbsp;
			<button type="submit" title="<%@ Save %>" onClick="createHidOrUpdate(this.form.id, 'savecardset', 0)"><img border=0 src="images1/create1.gif"></button>
			<b><%@ Save %></b>
		</td>
	</tr>
</table>
<table align="center" width="800" class="table_comm" style="margin-top: 22px">
<!-- BEGIN doneWithError --><tr><td class="td_comm" colspan="2" style="color: red; font-weight: bold"><%@ There was an error while sending data to server %>! <%@ See logs for details %></tr><!-- END doneWithError -->
<tr>
	<td class="td_comm td_bold td_padding_l7" width="40%"><%@ Description %>:</td>
	<td class="td_comm" width="60%"><input type="text" name="setdescr" style="width: 250px" value="{SETDESCR}"></td>
</tr>
<tr>
	<td class="td_comm td_bold td_padding_l7"><%@ Currency %>:</td>
	<td class="td_comm"><select style="width: 180px" onChange="createHidOrUpdate(this.form, 'currency', this.value)" <!-- BEGIN currDis -->disabled<!-- END currDis -->><!-- BEGIN CurrOpt --><option value="{CURRID}" <!-- BEGIN currOptSel -->selected<!-- END currOptSel -->>{CURRNAME}</option><!-- END CurrOpt --></select></td>
</tr>
<tr>
	<td class="td_comm td_bold td_padding_l7"><%@ User template %>:</td>
	<td class="td_comm"><select name="acctpl" style="width: 250px"><!-- BEGIN AccTpl --><option value="{ACCID}" <!-- BEGIN AccTplSel -->selected<!-- END AccTplSel -->>{ACCNAME}</option><!-- END AccTpl --></select></td>
</tr>
<tr>
	<td class="td_comm td_bold td_padding_l7"><%@ Time to live after activation %>:</td>
	<td class="td_comm" style="padding: 0px">
	<table class="table_comm" style="border: none;"><tr>
	<td class="td_comm" style="border: none" width="20"><input type="checkbox" value="1" onClick="if(this.checked) { Ext.get('_ttlfield').setStyle('display', ''); Ext.get('_ttlunit').setStyle('display', '')} else { Ext.get('_ttlfield').setStyle('display', 'none'); Ext.get('_ttlunit').setStyle('display', 'none'); Ext.get('_ttl_').dom.value = 0 }" <!-- BEGIN useTtl -->checked<!-- END useTtl -->></td>
	<td class="td_comm" style="border: none; display: <!-- BEGIN ttlFld -->none<!-- END ttlFld -->" id="_ttlfield"><input type="text" id="_ttl_" name="ttl" style="width: 80px" value="{TTL}"></td>
	<td class="td_comm" style="border: none; display: <!-- BEGIN ttlUFld -->none<!-- END ttlUFld -->" id="_ttlunit"><select name="ttl_unit" style="width: 80px"><!-- BEGIN ttlOpt --><option value="{TTLID}" <!-- BEGIN ttlOptSel -->selected<!-- END ttlOptSel -->><%@ {TTLNAME} %></option><!-- END ttlOpt --></select></td>
	</tr></table>
	</td>
</tr>
</table>
<table align="center" width="800" class="table_comm" style="margin-top: 22px">
<tr>
	<td class="td_head" width="30">&nbsp;</td>
	<td class="td_head"><%@ Description %></td>
	<td class="td_head" width="130"><%@ Use common balance account %></td>
	<td class="td_head" width="190"><%@ Account template %></td>
	<td class="td_head" width="30">&nbsp;</td>
</tr>
<tr>
	<td class="td_comm" width="30"><button type="button" title="<%@ Add %> <%@ module %>" onClick="submitForm(this.form.id, 'addmodule', this.form.module.value)"><img border="0" title="<%@ Add %> <%@ module %>" src="images/edit_add.gif"></button></td>
	<td class="td_comm" style="border-right: none" colspan="3"><select style="width: 280px" id="_module_" name="module"><!-- BEGIN ModuleOpt --><option value="{FREEMODULEID}">{FREEMODULEDESCR}</option><!-- END ModuleOpt --></select></td>
	<td class="td_comm" width="30">&nbsp;</td>
</tr>
<!-- BEGIN cardGrpItemEmpty --><tr align="center" height="40"><td class="td_comm" style="color: red; font-weight: bold" colspan="5" height="40"><%@ No data found %></td></tr><!-- END cardGrpItemEmpty -->
<!-- BEGIN CardGrpItem -->
<tr align="center">
	<td class="td_comm" width="30">{MODULEID}</td>
	<td class="td_comm">{MODULEDESCR}</td>
	<td class="td_comm" width="130"><input type="checkbox" name="cardset[{MODULEID}][common]" value="1" <!-- BEGIN commCheck -->checked<!-- END commCheck -->></td>
	<td class="td_comm" width="190"><select style="width: 180px" name="cardset[{MODULEID}][vg_tpl]"><!-- BEGIN cardVgTpl --><option value="{VGID}" <!-- BEGIN cardVgTplSel -->selected<!-- END cardVgTplSel -->>{VGNAME}</option><!-- END cardVgTpl --></select></td>
	<td class="td_comm" width="30"><button type="button" onClick="submitForm(this.form.id, 'delmodule', '{MODULEID}')"><img border="0" src="images1/delete.gif"></button></td>
</tr>
<!-- END CardGrpItem -->
</table>
<!-- END cardGrpForm -->
</form>