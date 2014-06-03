<script type="text/javascript" src="js/address.js"></script>
<script type="text/javascript" src="js/operators.js"></script>
<script language="javascript">
	var Localize = { Add: '<%@ Add %>', Search: '<%@ Search %>', Undefined: '<%@ Undefined %>', WindowHead: '<%@ Add %> <%@ agreement %>', UseTemplate: '<%@ Use template %>', AgrmNum: '<%@ Agreement number %>', AgrmNums: '<%@ Agreements %>', isDate: '<%@ Date %>', ButtAdd: '<%@ Add %>', SelectTemplate: '<%@ Select %> <%@ template %>', UName: '<%@ User %>', Address: '<%@ Address %>', AddressBook: '<%@ Address book %>', Country: '<%@ Country %>', Region: '<%@ Region %>', District: '<%@ District %>', City: '<%@ City %>', Settlement: '<%@ Area %>', Save: '<%@ Save %>', Name: '<%@ Name %>', Type: '<%@ Type %>', WldAdd: '<%@ Whould You like to add %>', Street: '<%@ Street %>', Building: '<%@ Building %>', Block: '<%@ Block %>', PostCode: '<%@ Post code %>', Flat: '<%@ Flat %>', Office: '<%@ Office %>', Cancel: '<%@ Cancel %>', Add: '<%@ Add %>', NewEntry: '<%@ New entry %>', NoMatch: '<%@ There is no matches for %>', Undefined: '<%@ Undefined %>', TraceOper: '<%@ Trace operator in initial data %>', OperSign: '<%@ Operator sign %>', Module: '<%@ Module %>', Type: '<%@ Type %>', LineId: '<%@ Line identifier %>', Route: '<%@ Route %>', Tarif: '<%@ Tarif %>', Description: '<%@ Description %>', PrimeCost: '<%@ Prime cost %>', Choose: '<%@ Choose %>', StreetY: '<%@ Street-y %>', Edit: '<%@ Edit %>', CountryY: '<%@ Country-y %>', FlatY: '<%@ Flat-y %>', AddNewRecord: '<%@ Add new record %>', Countries: '<%@ Countries %>', Regions: '<%@ Regions %>', Districts: '<%@ Districts %>', Cities: '<%@ Cities %>', Settlements: '<%@ Areas %>', Streets: '<%@ Streets %>', Buildings: '<%@ Buildings %>', Flats: '<%@ Flats %>', Offices: '<%@ Offices %>', SendingData: '<%@ Sending data %>', Connecting: '<%@ Connecting %>' }
</script>
<form method="POST" action="config.php" id="_Operators">
<input type="hidden" name="devision" value="201">
<table class="table_comm" width="900" align="center" cellpadding="0" cellspacing="0">
	<tr><td class="td_head_ext" height="22" colspan="2"><%@ Operators settings %></td></tr>
	<tr height=40>
		<!-- BEGIN CreateNew --><td width="150" class="td_comm" style="border-right: none">
			&nbsp;
			<button type="button" onClick="submitForm(this.form.id, 'operator', -1)" title="<%@ Create %>"><img border="0" title="<%@ Create %>" src="images1/edit.gif"></button>
			<b><%@ Create %></b>
		</td><!-- END CreateNew -->
		<!-- BEGIN SaveCurr --><td width="150" class="td_comm" style="border-right: none">
			&nbsp;
			<button type="button" title="<%@ Save %>" onClick="Extract(this.form, ['opertrunks', 'opercost'])"><img border="0" title="<%@ Save %>" src="images1/edit.gif"></button>
			<b><%@ Save %></b>
		</td><!-- END SaveCurr -->
		<td class="td_comm">&nbsp;</td>
	</tr>
</table>
<!-- BEGIN OperList -->
<table class="table_comm" width="900" align="center" cellpadding="0" cellspacing="0" style="border-top: none; margin-top: 22px">
<tr><td class="td_head_ext" colspan="6"><%@ Operators %></td></tr>
<!-- BEGIN OperHD -->
<tr>
	<td class="td_head" width="30">&nbsp;</td>
	<td class="td_head" width="30">ID</td>
	<td class="td_head" width="250"><%@ Name %></td>
	<td class="td_head" width="180"><%@ Director %></td>
	<td class="td_head"><%@ Description %></td>
	<td class="td_head" width="30">&nbsp;</td>
</tr>
<!-- END OperHD -->
<!-- BEGIN OperListItem --><tr align="center">
	<td class="td_comm" width="30"><button type="button" onClick="submitForm(this.form.id, 'operator', '{OID}')" title="<%@ Edit %>"><img border="0" title="<%@ Edit %>" src="images1/edit_15.gif"></button></td>
	<td class="td_comm" width="30">{OID}</td>
	<td class="td_comm" width="250">{ONAME}</td>
	<td class="td_comm" width="180">{ODIR}</td>
	<td class="td_comm">{ODESCR}</td>
	<td class="td_comm" width="30"><!-- BEGIN OperListItemDrop --><button type="button" onClick="submitForm(this.form.id, 'deloper', '{OID}')" title="<%@ Remove %>"><img border="0" title="<%@ Remove %>" src="images1/delete.gif"></button><!-- END OperListItemDrop --><!-- BEGIN OperListNoDrop -->-<!-- END OperListNoDrop --></td>
</tr><!-- END OperListItem -->
<!-- BEGIN OperListEmpty --><tr align="center"><td class="td_comm td_bold" style="height: 40px; color: red" colspan="6"><%@ No data found %></td></tr><!-- END OperListEmpty -->
</table>
<!-- END OperList -->
<!-- BEGIN OperForm -->
<input type="hidden" name="operator" id="_operator_" value="{OPERATOR}">
<input type="hidden" name="address1code" id="_address1code_" value="{ADDRESS1CODE}">
<input type="hidden" name="address2code" id="_address2code_" value="{ADDRESS2CODE}">
<table class="table_comm" width="900" align="center" cellpadding="0" cellspacing="0" style="margin-top: 22px">
<!-- BEGIN OperFormError --><tr><td class="td_comm td_padding_l7 td_bold" style="color:red" colspan="2"><%@ {FORMERROR} %> <%@ {FORMERRORDETAIL} %></td></tr><!-- END OperFormError -->
<tr>
	<td width="50%" class="td_comm" style="border: none" valign="top">
		<fieldset>
			<legend><%@ Common %></legend>
			<table class="table_comm" style="border: none" width="100%">
				<tr>
					<td width="31%" class="td_comm" style="border: none"><%@ Organization name %>:</td>
					<td width="69%" class="td_comm" style="border: none"><input type="text" value="{OPERNAME}" name="opername" style="width: 285px"></td>
				</tr>
				<tr>
					<td class="td_comm" style="border: none"><%@ Legal address %>:</td>
					<td class="td_comm" style="border: none"><input type="hidden" id="adr1-str" value="{ADDRESS1_FULLTEXT}"><input type="text" value="{ADDRESS1_SHT_TEXT}" id="address1-str" style="width: 245px" readonly>
					<button type='button' onclick='address(apply, {code: Ext.get("_address1code_").dom.value, string: Ext.get("adr1-str").dom.value }, { codeEl: Ext.get("_address1code_").dom, stringEl: Ext.get("adr1-str").dom, stringElSh: Ext.get("address1-str").dom });'><img src='images1/list3_15.gif'></button></td>
				</tr>
				<tr>
					<td class="td_comm" style="border: none"><%@ Post address %>:</td>
					<td class="td_comm" style="border: none"><input type="hidden" id="adr2-str" value="{ADDRESS2_FULLTEXT}"><input type="text" value="{ADDRESS2_SHT_TEXT}" id="address2-str" style="width: 245px" readonly>
					<button type='button' onclick='address(apply, {code: Ext.get("_address2code_").dom.value, string: Ext.get("adr2-str").dom.value }, { codeEl: Ext.get("_address2code_").dom, stringEl: Ext.get("adr2-str").dom, stringElSh: Ext.get("address2-str").dom });'><img src='images1/list3_15.gif'></td>
				</tr>
				<tr>
					<td class="td_comm" style="border: none"><%@ Director %>:</td>
					<td class="td_comm" style="border: none"><input type="text" value="{GENDIR}" name="gendir" style="width: 285px"></td>
				</tr>
				<tr>
					<td class="td_comm" style="border: none"><%@ Chief accountant %>:</td>
					<td class="td_comm" style="border: none"><input type="text" value="{BUHGNAME}" name="buhgname" style="width: 285px"></td>
				</tr>
				<tr>
					<td class="td_comm" style="border: none"><%@ Description %>:</td>
					<td class="td_comm" style="border: none"><input type="text" value="{DESCR}" name="descr" style="width: 285px"></td>
				</tr>
			</table>
		</fieldset>
	</td>
	<td width="50%" class="td_comm" style="border-bottom: none" valign="top">
		<fieldset>
			<legend><%@ Bank details %></legend>
			<table class="table_comm" style="border: none" width="100%">
				<tr>
					<td class="td_comm" style="border: none"><%@ Bank name %>:</td>
					<td class="td_comm" style="border: none"><input type="text" value="{BANK}" name="bank" style="width: 285px"></td>
				</tr>
				<tr>
					<td width="31%" class="td_comm" style="border: none"><%@ Charge account %>:</td>
					<td width="69%" class="td_comm" style="border: none"><input type="text" value="{RS}" name="rs" id="_rs_" style="width: 285px"></td>
				</tr>
				<tr>
					<td class="td_comm" style="border: none"><%@ Correspondent account %>:</td>
					<td class="td_comm" style="border: none"><input type="text" value="{KORRS}" name="korrs" id="_korrs_" style="width: 285px"></td>
				</tr>
				<tr>
					<td class="td_comm" style="border: none"><%@ BIK %>:</td>
					<td class="td_comm" style="border: none"><input type="text" value="{BIK}" name="bik" id="_bik_" style="width: 285px"></td>
				</tr>
				<tr>
					<td class="td_comm" style="border: none"><%@ TIN %>:</td>
					<td class="td_comm" style="border: none"><input type="text" value="{INN}" name="inn" id="_inn_" style="width: 285px"></td>
				</tr>
				<tr>
					<td class="td_comm" style="border: none"><%@ KPP %>:</td>
					<td class="td_comm" style="border: none"><input type="text" value="{KPP}" name="kpp" id="_kpp_" style="width: 285px"></td>
				</tr>
			</table>
		</fieldset>
	</td>
</tr>
<tr>
	<td class="td_comm" style="border-right: none" valign="top" id="OperProp"></td>
	<td class="td_comm" valign="top" id="PrimeCost"></td>
</tr>
</table>
<!-- END OperForm -->
</form>