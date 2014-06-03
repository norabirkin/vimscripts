<script type="text/javascript" src="js/create_documents.js"></script>
<script language="javascript">
	var OnFly = 0;
</script>
<script type="text/javascript" src="js/documents_generation_queue.js"></script>
<script type="text/javascript" src="js/calendar.js"></script>
<script type="text/javascript" src="js/searchtemplate.js"></script>
<script language="javascript">
var Localize = { Add: '<%@ Add %>', Search: '<%@ Search %>', Undefined: '<%@ Undefined %>', AgrmNum: '<%@ Agreement number %>', AgrmNums: '<%@ Agreements %>', Address: '<%@ Address %>', Consistent: '<%@ Consistent-s %> <%@ users %>', AddressBook: '<%@ Address book %>', Name: '<%@ Name %>', Type: '<%@ Type %>', Cancel: '<%@ Cancel %>', Users: '<%@ Users %>', NoMatch: '<%@ There is no matches for %>', Undefined: '<%@ Undefined %>', Agreement: '<%@ Agreement %>', PersonFullName: '<%@ Person full name %>', UserType: '<%@ User type %>', Legal: '<%@ Legal person %>', Physic: '<%@ Physical person %>', EmptyField: '<%@ Empty field %>', Period: '<%@ Period %>', Template: '<%@ Documents templates %>', UserGroup: '<%@ User group %>', Sum: '<%@ Sum %>', ServerErr: '<%@ Server error %>', UServerErr: '<%@ Unknown server error %>', SendingData: '<%@ Sending data %>', Connecting: '<%@ Connecting %>', Success: '<%@ Request done successfully %>', Error: '<%@ Error %>', GoView: '<%@ Go to view accounting report documents %>' }
</script>
<form method="POST" action="config.php" id="DocsList"></form>
<form method="POST" action="config.php" id="CreateDoc">
<input type="hidden" name="enqueueMode" value="0" />
<input type="hidden" name="devision" id="_devision_" value="108">
<input type="hidden" name="doctype" id="_doctype_" value="{TEMPLTYPE}">
<input type="hidden" name="a_fulldate" id="fulldate" value="{FULLDATE}">
<table class="table_comm" align=center width="960">
	<tr><td colspan="2" class="td_head_ext"><%@ Create printing forms %></td></tr>
	<tr height="40"><td class="td_comm" colspan="2">
			<button type="button" title="<%@ Start %>" onClick="advSearch(true)"><img border="0" src="images/new22.gif" title="<%@ Start %>"></button><b><%@ Start %></b>
			<button type="button" title="<%@ Enqueue %>" onClick="advSearch(true, false, true)"><img border="0" src="images/new22.gif" title="<%@ Enqueue %>"></button><b><%@ Enqueue %></b>
		</td>
	</tr>
	<tr>
		<td class="td_comm td_padding_l7 td_bold" width="35%"><%@ Draw on date %>:</td>
		<td class="td_comm">
			<button type="button" id="cal1" onClick="Calendar(this.id, 'drawYear', 'drawMonth', 'drawDay', 'drawDate', 'fulldate')"><img border="0" src="images/cal.gif"></button>
			<span id="drawDate">{DATEFULLVAL}</span>
		</td>
	</tr>
	<tr>
		<td class="td_comm td_padding_l7 td_bold"><%@ Start from number %>:</td>
		<td class="td_comm"><input type="text" id="firstDoc" name="startnum" style="margin-left: 7px; width: 190px;"></td>
	</tr>
	<tr>
		<td class="td_comm td_padding_l7 td_bold"><%@ Period %>:</td>
		<td class="td_comm">
			<button type="button" id="cal2" onClick="Calendar(this.id, 'periodYear', 'periodMonth', 'periodDay')"><img border="0" src="images/cal.gif"></button>
			<select id="periodYear" name="b_year" style="margin-left: 7px; width: 85px;"><!-- BEGIN periodYear --><option value="{PERIODYEARVAL}">{PERIODYEARNAME}</option><!-- END periodYear --></select>
			<select id="periodMonth" name="b_month" style="margin-left: 7px; width: 85px;"><!-- BEGIN periodMonth --><option value="{PERIODMONTHVAL}"><%@ {PERIODMONTHNAME} %></option><!-- END periodMonth --></select><input type="hidden" id="periodDay" value="1">
		</td>
	</tr>
	<tr id="prepayctrl" <!-- BEGIN prepayCtrl -->style="display: none;"<!-- END prepayCtrl -->>
		<td class="td_comm td_padding_l7 td_bold"><%@ Rent value %>:</td>
		<td class="td_comm">
			<table style="border: none; margin-left: 7px;" class="table_comm">
			<tr>
				<td class="td_comm" style="border: none"><input type="checkbox" id="userent" name="asrent" valign="middle" value="1" onClick="if(this.checked) this.form.sum.disabled=true; else this.form.sum.disabled=false" <!-- BEGIN preCh -->checked<!-- END preCh -->></td>
				<td class="td_comm" style="border: none; padding-left: 10px"><input type="text" id="sum" name="orsum" style='width: 100px;' <!-- BEGIN preDsbl -->disabled<!-- END preDsbl -->></td>
			</tr></table>
		</td>
	</tr>
	<tr>
		<td class="td_comm td_padding_l7 td_bold"><%@ Documents templates %>:</td>
		<td class="td_comm"><select id="tplid" name="docid" style="margin-left: 7px; width: 220px;" onChange="docType(this, this.form)"><!-- BEGIN templOpt --><option value="{TEMPLID}" type="{TEMPLTYPE}">{TEMPLATENAME}</option><!-- END templOpt --></select></td>
	</tr>
	<tr>
		<td class="td_comm td_padding_l7 td_bold"><%@ Advanced filter %>:</td>
		<td class="td_comm"><div style="margin-left: 7px; width: 220px;" id="AFilterPlace"></div></td>
	</tr>
	<tr>
		<td class="td_comm td_padding_l7 td_bold"><%@ Create documents %>:</td>
		<td class="td_comm">
			<table width="100%" class="table_comm" style="border: none">
				<!-- BEGIN ifAdmin -->
				<tr><td class="td_comm" style="border: none"><input type="radio" id="docfor_1" name="docfor" onClick="Control('ugroup'); Control('include_group')" style="margin-left:7px;" value="0" <!-- BEGIN forAllChk -->checked<!-- END forAllChk -->></td><td class="td_comm" style="border: none"><%@ For all %></td><td class="td_comm" style="border: none">&nbsp;</td></tr>
				<!-- END ifAdmin -->
				<tr>
					<td class="td_comm" style="border: none"><input type="radio" id="docfor_2" name="docfor" onClick="Control(null, 'ugroup'); Control(null, 'include_group')" style="margin-left:7px;" value="1" <!-- BEGIN UsrGrpChk -->checked<!-- END UsrGrpChk -->></td>
					<td class="td_comm" style="border: none"><%@ User group %></td>
					<td class="td_comm" style="border: none;">
						<select id="include_group" name="include_group" style="width: 210px;" 
							<!-- BEGIN InclUsrGrpDis -->disabled<!-- END InclUsrGrpDis -->>
								<option value="1" selected><%@ Include %></option>
								<option value="2"><%@ Exclude %></option> 
						</select>	
					</td>
					<td class="td_comm" style="border: none;">
						<select id="ugroup" name="usergroup" style="width: 210px;" 
							<!-- BEGIN UsrGrpDis -->disabled<!-- END UsrGrpDis -->>
							<!-- BEGIN usrGrpOpt -->
								<option value="{USRFRGPID}">{USRGRPNAME}</option> 
							<!-- END usrGrpOpt -->
						</select>
					</td>
					
					
					
					
					
					
				</tr>
				<tr>
					<td class="td_comm" style="border: none"><input type="radio" id="docfor_3" name="docfor" onClick="Control('ugroup'); Control('include_group')" style="margin-left:7px;" value="3"></td>
					<td class="td_comm" style="border: none"><%@ User %></td>
					<td class="td_comm" style="border: none">
						<input type="hidden" name="userid" id="userid" value="0">
						<a href="#" id="userhrefname" onClick="showUsers({callbackok: setUserValue, showdefault: 1})"><%@ Undefined %></a>
						<div id="agrmDocBloc" style="display:none;">
							<input type="hidden" name="agrmid" id="agrmid" value="0">
							<%@ Agreement %>:&nbsp;<a href="javascript:void(0)" onClick="selectDocAgrm(this, {userid: document.getElementById('userid').value});"><%@ All %></a>
						</div>
					</td>
				</tr>
			</table>
		</td>
	</tr>
	<tr>
		<td class="td_comm td_padding_l7 td_bold"><%@ Operators %>:</td>
		<td class="td_comm">
			<select id="operator" name="operid" style="margin-left: 7px; width: 300px;">
				<!-- BEGIN operDef --><option value="0"><%@ For all %></option><!-- END operDef -->
				<!-- BEGIN operOpt --><option value="{OPERID}">{OPERNAME}</option><!-- END operOpt -->
			</select>
		</td>
	</tr>

	<!-- BEGIN use_grouped_orders -->
	<!--- радио + текстовое поле "кол-во документов для группировки", передается при вызове как val.groupcnt-->
	<!--- радио "группировать по индексу", передается при вызове как val.groupidx-->
	<tr>
		<td class="td_comm td_padding_l7 td_bold"><%@ Groupping %>:</td>
		<td class="td_comm">
			<table width="100%" class="table_comm" style="border: none;">
				<tr>
					<td class="td_comm" style="border: none;width:30px;">
						<input type="radio" checked id="groupcnt" name="groupby" style="margin-left:7px;" value="1">
					</td>
					<td class="td_comm" style="border: none;width:250px;">
						<%@ Documents amount for groupping %>
					</td>
					<td class="td_comm" style="border: none; text-align:left;">
						<input type="text" size="6" id="groupcntval" name="groupcntval" value="0" style="margin-left: 7px;">
					</td>
				</tr>
				<tr>
					<td class="td_comm" style="border: none"><input type="radio" id="groupidx" name="groupby" style="margin-left:7px;" value="2"></td>
					<td class="td_comm" style="border: none"><%@ Group by index %></td>
					<td>&nbsp;</td>
				</tr>
			</table>
		</td>
	</tr>
	<!-- END use_grouped_orders -->

	<tr>
		<td class="td_comm td_padding_l7 td_bold"><%@ Comment %>:</td>
		<td class="td_comm">
			<textarea cols="54" rows="5" name="comment"></textarea>
		</td>
	</tr>
	
	<tr><td class="td_head_ext" colspan="2"><%@ Document generation queue %></td></tr>
	<tr><td id="queueGrid" colspan="2"></td></tr>
</table>
</form>
