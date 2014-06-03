
<script language="javascript">
function listControl(form, is_value)
{
	if(!form) return false;

	if(is_value <= 0)
	{
		form.grp_list.disabled = true;
		form.usr_list.disabled = true;
	}
	if(is_value == 1)
	{
		form.grp_list.disabled = true;
		form.usr_list.disabled = false;
	}
	else if(is_value == 2)
	{
		form.usr_list.disabled = true;
		form.grp_list.disabled = false;
	}
}

function comboControl(form, is_value) 
{
	if(!form) return false;

	if(is_value == 2 || is_value == 1 || is_value == 7)
		form.documentperiod.disabled = false;
	else
		form.documentperiod.disabled = true;
}


function EnDisPeni(form, is_value)
{
	if(!form) return false;
	if(form.can_to_pay.checked == true){
		form.penaltyperiod.disabled    = false;
		form.penaltyinterval.disabled  = false;
		form.penaltyintervalval.disabled  = false;
		form.penaltycost.disabled      = false;
		form.penaltylimit_abs.disabled = false;
		document.getElementById("penaltylimit1").disabled = false;
		document.getElementById("penaltylimit2").disabled = false;
		document.getElementById("penaltylimit1").checked = true;
	}else{
		form.penaltyperiod.disabled    = true;
		form.penaltyinterval.disabled  = true;
		form.penaltyintervalval.disabled  = true;
		form.penaltycost.disabled      = true;
		form.penaltylimit_abs.disabled = true;
		document.getElementById("penaltylimit1").disabled = true;
		document.getElementById("penaltylimit2").disabled = true;

	}
}

function endisAbs(form, is_value){
	if(is_value == 1)
		form.penaltylimit_abs.disabled = true;
	else (is_value == 2)
		form.penaltylimit_abs.disabled = false;
}


</script>

<form action=config.php method=post name=documents>
<input type=hidden name=devision value=337>
<input type=hidden name=db_document value={DB_DOCUMENT}>
<input type=hidden name=what_do value=0>

<table class="table_comm" align="center" border="0" cellspacing="0" cellpadding="0" width="980">
	<tr height=25>
		<td align=center style="border: solid 1px #c0c0c0;" class=td_head_ext>
			<b>{TITLE}</b>
		</td>
	</tr>

	<!-- BEGIN create_return -->
	<tr height=35>
		<td style="border: solid 1px #c0c0c0; border-top: none; ">
		<span style="cursor: pointer; margin-left: 10px;" onClick="javascript: document.documents.db_document.value = 0; document.documents.submit();">
		<img src="images1/create1.gif" align="middle" height="25" hspace="0" vspace="0" width="25">
		<b>{ACTIONDESCR}</b>
		</span>
		</td>
	</tr>
	<!-- END create_return -->

	<!-- BEGIN save_return -->
	<tr height=35>
		<td style="border: solid 1px #c0c0c0; border-top: none;">
		<span style="cursor: pointer; margin-left: 10px;" onClick="document.documents.what_do.value = 1; document.documents.submit();">
		<img src="images1/create1.gif" align="middle" height="25" hspace="0" vspace="0" width="25">
		<b><%@ Save %></b>
		</span>
		<span style="cursor: pointer; margin-left: 10px;" onClick="javascript: document.documents.db_document.value = -1; document.documents.submit();">
		<img src="images1/list1.ico" align="middle" height="25" hspace="0" vspace="0" width="25">
		<b><%@ Go back to list %></b>
		</span>
		</td>
	</tr>
	
	<!-- END save_return -->

	<!-- BEGIN save_status -->
	<tr><td class="td_comm td_padding_l7 td_bold">{STATUS}</td></tr>
	<!-- END save_status -->

	<!-- BEGIN document_list -->
	<tr>
		<td>
		<table width=100% border=0 cellspacing=0 cellpadding=0>
		<!-- BEGIN line -->
		<tr height=22 {TRPROP}>

			<td width=4% align=center style="border-bottom: solid 1px #c0c0c0;">{ACTION_EDIT}</td>
			<td style="border-left: solid 1px #c0c0c0; border-bottom: solid 1px #c0c0c0;"><div style='margin-left:5px; {STYLE_BOLD}'>{DOC_ID}</div></td>
			<td style="border-left: solid 1px #c0c0c0; border-bottom: solid 1px #c0c0c0;"><div style='margin-left:5px; {STYLE_BOLD}'>{DOC_NAME}</div></td>
			<td style="border-left: solid 1px #c0c0c0; border-bottom: solid 1px #c0c0c0;"><div style='margin-left:5px; {STYLE_BOLD}'>{DOCUMENTISPAY}</div></td>
			<td style="border-left: solid 1px #c0c0c0; border-bottom: solid 1px #c0c0c0;"><div style='margin-left:5px; {STYLE_BOLD}'>{DOC_NDS}</div></td>
			<td style="border: solid 1px #c0c0c0; border-top: none;"><div style='margin-left:5px; {STYLE_BOLD}'>{DOC_GR}</div></td>
			<td width=4% align=center style="border-bottom: solid 1px #c0c0c0;">{ACTION_DROP}</td>
		</tr>
		<!-- END line -->
		</table>
		</td>
	</tr>
	<!-- END document_list -->

	<!-- BEGIN document_create_edit -->
	<tr>
		<td style="border-right: solid 1px #c0c0c0; border-left: solid 1px #c0c0c0;">
		<table width="100%" class="table_comm" style="border: none">
			<tr>
				<td class="td_comm td_padding_l7 td_bold"><%@ Hide %>:</td>
				<td class="td_comm td_padding_l7"><input type=checkbox name=hidden value="1" {HID_CHECKED} ></td>
			</tr>
			<tr>
				<td class="td_comm td_padding_l7 td_bold"><%@ Description %>:</td>
				<td class="td_comm td_padding_l7"><input type=text name=name value="{NAME_VALUE}" style="width: 300px;"></td>
			<tr>
				<td class="td_comm td_padding_l7 td_bold"><%@ Currency %>:</td>
				<td class="td_comm td_padding_l7"><select style="width: 200px" name="curid"><!-- BEGIN currOpt --><option value="{CUURID}" <!-- BEGIN currOptSel -->selected<!-- END currOptSel -->>{CURRNAME}</option><!-- END currOpt --></select></td>
			</tr>
			<tr>
				<td class="td_comm td_padding_l7 td_bold">{NDS_INSIDE}:</td>
				<td class="td_comm td_padding_l7"><input type="checkbox" name="nds_above" {NDS_CHECKED}></td>
			</tr>
			<tr>
				<td class="td_comm td_padding_l7 td_bold"><%@ Template %>:</td>
				<td class="td_comm td_padding_l7"><select name="template" style="width: 200px;"><!-- BEGIN doc_template --><option value="{TMP_VAL}" {TMP_SEL}>{TMP_OPT}</option><!-- END doc_template --></select></td>
			</tr>
			<tr>
				<td class="td_comm td_padding_l7 td_bold">{CATALOG_TOSAVE}:</td>
				<td class="td_comm td_padding_l7"><input type=text name=save_path value="{SAVE_PATH}" style="width: 300px;"></td>
			</tr>
			<tr>
				<td class="td_comm td_padding_l7 td_bold"><%@ Skip aggregated data %></>:</td>
				<td class="td_comm td_padding_l7"><input type="checkbox" name="detail" value="1" <!-- BEGIN skip_detail -->checked<!-- END skip_detail -->></td>
			</tr>
			<!-- BEGIN use_grouped_orders -->
			<tr>
				<td class="td_comm td_padding_l7 td_bold">{CATALOG_TOSAVE_GROUP}:</td>
				<td class="td_comm td_padding_l7"><input type="text" name="save_path_group" value="{SAVE_PATH_GROUP}" style="width: 300px;"></td>
			</tr>
			<tr>
				<td class="td_comm td_padding_l7 td_bold"><%@ Document file naming %>:</td>
				<td class="td_comm td_padding_l7">
					<select name="filenaming" style="width: 200px;">
					<option value="0" <!-- BEGIN filenaming_se_0 -->selected<!-- END filenaming_se_0 -->><%@ Document ID %></option>
					<option value="1" <!-- BEGIN filenaming_se_1 -->selected<!-- END filenaming_se_1 -->><%@ Postal index %></option>
					<option value="2" <!-- BEGIN filenaming_se_2 -->selected<!-- END filenaming_se_2 -->><%@ Agreement number %></option>
					</select>
				</td>
			</tr>
			<!-- END use_grouped_orders -->
			<tr>
				<td class="td_comm td_padding_l7 td_bold">{DOCUMENT_FOR}:</td>
				<td class="td_comm td_padding_l7">
					<table width="100%" class="table_comm" style="border: none">
						<tr height=25>
							<td><input type=radio name=group_type onClick='listControl(this.form, this.value)'  value=-1 {NO_CHECKED}></td>
							<td >{DOCUMENT_NOBODY}:</td>
							<td>&nbsp;</td>
						</tr>
						<tr height=25>
							<td><input type=radio name=group_type onClick='listControl(this.form, this.value)'  value=0 {ALL_CHECKED}></td>
							<td >{DOCUMENT_FORALL}:</td>
							<td>&nbsp;</td>
						</tr>
						<tr height=25>
							<td><input type=radio name=group_type onClick='listControl(this.form, this.value)'  value=1 {USR_CHECKED}></td>
							<td >{ACCOUNTGROUPS}:</td>
							<td>
								<select name=usr_list style="width: 300px; margin-left:7px;" {USR_DISABLED}>
								<!-- BEGIN doc_usr -->
								<option value="{USR_VAL}" {USR_SEL}>{USR_OPT}</option>
								<!-- END doc_usr -->
								</select>
							</td>
						</tr>
						<tr height=25>
							<td><input type=radio name=group_type onClick='listControl(this.form, this.value)'  value=2 {GRP_CHECKED}></td>
							<td >{MEN_UNIONS}:</td>
							<td>
								<select name=grp_list style="width: 300px; margin-left:7px;" {GRP_DISABLED}>
								<!-- BEGIN doc_grp -->
								<option value="{GRP_VAL}" {GRP_SEL}>{GRP_OPT}</option>
								<!-- END doc_grp -->
								</select>
							</td>
						</tr>
					</table>
				</td>
			</tr>
			<tr>
				<td class="td_comm td_padding_l7 td_bold"><%@ Document class %>:</td>
				<td class="td_comm td_padding_l7">
					<table width="100%" class="table_comm" style="border: none">
					
						<tr>
							<td>
								<select name="onfly" onChange='comboControl(this.form, this.value)'  style="width: 200px;">
									<option value="0" <!-- BEGIN onfly_se_0 -->selected<!-- END onfly_se_0 -->><%@ Accounting document %></option>
									<option value="1" <!-- BEGIN onfly_se_1 -->selected<!-- END onfly_se_1 -->><%@ User document %></option>
									<option value="2" <!-- BEGIN onfly_se_2 -->selected<!-- END onfly_se_2 -->><%@ Report document %></option>
									<option value="3" <!-- BEGIN onfly_se_3 -->selected<!-- END onfly_se_3 -->><%@ Receipt %></option>
									<option value="4" <!-- BEGIN onfly_se_4 -->selected<!-- END onfly_se_4 -->><%@ Application %></option>
									<option value="5" <!-- BEGIN onfly_se_5 -->selected<!-- END onfly_se_5 -->><%@ Info %></option>
									<option value="6" <!-- BEGIN onfly_se_6 -->selected<!-- END onfly_se_6 -->><%@ Account %></option>
									<option value="7" <!-- BEGIN onfly_se_7 -->selected<!-- END onfly_se_7 -->><%@ Report on payments %></option>
									
								</select>
							</td>
							<td ><%@ Interval generate %>:</td>
							<td >
								<select name="documentperiod" style="width: 200px;" {PERIOD_DISABLED}>
									<option value="0" <!-- BEGIN documentperiod_se_0 -->selected<!-- END documentperiod_se_0 -->><%@ Month %></option>
									<option value="1" <!-- BEGIN documentperiod_se_1 -->selected<!-- END documentperiod_se_1 -->><%@ Period %></option>
									<option value="2" <!-- BEGIN documentperiod_se_2 -->selected<!-- END documentperiod_se_2 -->><%@ Day %></option>
								</select>
							</td>
						</tr>
						
					</table>
					
				</td>
			</tr>
			
			
			<tr>
				<td class="td_comm td_padding_l7 td_bold">{DOCUMENT_ISPAY}:</td>
				<td class="td_comm td_padding_l7">
					<select name=payable style="width: 150px;">
					<!-- BEGIN payable -->
					<option value="{PB_VAL}" {PB_SEL}>{PB_OPT}</option>
					<!-- END payable -->
					</select>
				</td>
			</tr>
			<tr>
			<td class="td_comm td_padding_l7 td_bold">{DOCUMENT_UPLOAD_EXT}:</td>
			<td class="td_comm td_padding_l7">
				<select name=upload_ext style="width: 150px;">
				<!-- BEGIN upload_ext -->
				<option value="{EXT_VAL}" {EXT_SEL}>{EXT_OPT}</option>
				<!-- END upload_ext -->
				</select>
			</td>
			</tr>
			<tr>
			<td class="td_comm td_padding_l7 td_bold">{DOCUMENT_CL_ALLOWED}:</td>
			<td class="td_comm td_padding_l7"><input type=checkbox name=client_allowed {CL_ALLOWED} value=1></td>
			</tr>



			<!-- BEGIN penalty_settings -->
			<tr>
				<td class="td_comm td_padding_l7 td_bold"><%@ Use penalties %>:</td>
				<td class="td_comm td_padding_l7 td_bold">
					<table width="100%" class="table_comm" style="border: none">
						<tr height=25>
							<td width="190"><%@ Can pay %></td>
							<td><input type="checkbox" name="can_to_pay" {CAN_TO_PAY_CHK} value="1" onClick="EnDisPeni(this.form, this.value);"></td>
						</tr>

						<tr>
							<td class="td_comm" style="border: none"><%@ Time to pay invoice %>:</td>
							<td class="td_comm" style="border: none" nowrap>
								<select name="penaltyinterval" style="width: 80px;" {PENALTY_INTERVAL}>
									<option value="month" <!-- BEGIN penaltyinterval_se_month -->selected<!-- END penaltyinterval_se_month -->><%@ Month %></option>
									<option value="day" <!-- BEGIN penaltyinterval_se_day -->selected<!-- END penaltyinterval_se_day -->><%@ Day %></option>
								</select>
								<input type="text" name="penaltyintervalval" value="{PENALTY_INTERVAL_VAL}" {PENALTY_INTERVAL_DIS} size="12">
							</td>
						</tr>


						<tr>
							<td class="td_comm" style="border: none"><%@ Penalties cost %>:</td>
							<td class="td_comm" style="border: none" nowrap>
								<select name="penaltyperiod" style="width: 80px;" {PENALTY_PERIOD}>
									<option value="D" <!-- BEGIN penaltyperiod_se_D -->selected<!-- END penaltyperiod_se_D -->><%@ In day %></option>
									<option value="M" <!-- BEGIN penaltyperiod_se_M -->selected<!-- END penaltyperiod_se_M -->><%@ In month %></option>
								</select>
								<input type="text" name="penaltycost" value="{PENALTY_COST_VAL}" {PENALTY_COST_DIS} size="12">
								<!--<div class='info'>Указывается в процентах от суммы (%)</div>-->
							</td>
						</tr>
						<tr>
							<td>&nbsp;</td>
							<td><div class='info'><%@ Percentage tariffed %></div></td>
						</tr>
						<tr style="border-top: 1px solid #C0C0C0;">
							<td class="td_comm" style="border: none"><%@ penalties limit %>:</td>
							<td class="td_comm" style="border: none;">
								<table width="100%" class="table_comm" style="border: none;">
									<tr height=25>
										<td><input type="radio" onclick="endisAbs(this.form, this.value);" name="penaltylimit_radio" id="penaltylimit1" value="1" {PENALTY_LIMIT_CHECKED} {PENALTY_BILL_MAX}></td>
										<td><%@ Not more than bill sum %></td>
									</tr>
									<tr height=25>
										<td><input type="radio" onclick="endisAbs(this.form, this.value);" name="penaltylimit_radio" id="penaltylimit2" value="2" {PENALTY_LIMIT_ABS_CHECKED} {PENALTY_BILL_ABS}></td>
										<td >
											<input type="text" id="penaltylimit_abs" name="penaltylimit" value="{PENALTY_LIMIT_VAL}" {PENALTY_LIMIT_DIS} size="12" style="">
										</td>
									</tr>
									<tr>
										<td>&nbsp;</td>
										<td><div class='info'><%@Absolutely tariffed%></div></td>
									</tr>
								</table>
							</td>
						</tr>
					</table>
				</td>
			</tr>
			<!-- END penalty_settings -->


		</table>
		</td>
	</tr>
	<!-- END document_create_edit -->


</table>
</form>