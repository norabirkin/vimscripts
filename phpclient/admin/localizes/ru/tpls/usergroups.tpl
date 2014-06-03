
<script language="javascript">
	function checkElmGroup( Elem, form )
	{
		if(!form) return false;
		
		if(Elem.checked) reOrder(form,Elem.id);
		else reOrder(form,Elem.id);
	}
	
	function reOrder( form, handle )
	{
		if(!form) return false;
		var idLen = handle.length;
		for(var i=0; i<form.length; i++)
		{
			var eId = form.elements[i].id;
			if(eId.length > 0 && eId.substring(0,idLen) == handle && eId != handle)
			{
				if(form.elements[i].disabled) form.elements[i].disabled = false;
				else form.elements[i].disabled = true;
			}
		}
	}
</script>
<form action=config.php method=post name=ug>
<input type=hidden name=devision value="23">
<input type=hidden name=ugid value="{UGID}">
<input type=hidden name=do_action value=0>
<input type=hidden name=db_restore value=0>

<table align=center width=960 class=table_comm>
	<tr height=25 class=th_comm>
		<th class=td_head_ext colspan=2>{ACCOUNTGROUPS}</th>
	</tr>
	
	<tr height=40>
		<td width=150 class=td_bott>
			&nbsp;
			<!-- BEGIN btn_create -->
			<button class=img_button onclick="this.form.do_action.value={ACTION_VALUE}; this.form.submit();"><img title="{NEWENTRY}" name="create_new" border=0 src="images1/create1.gif"></img></button>
			<b>{NEWENTRY}</b>
			<!-- END btn_create -->
		</td>
		
		<td class=td_comm>
			&nbsp;
			<!-- BEGIN btn_list -->
			<button class=img_button onclick="this.form.action.value=0; this.form.submit();"><img title="{BACK_2_LIST}" name="create_new" border=0 src="images1/add_1.gif"></img></button>
			<b>{BACK_2_LIST}</b>
			<!-- END btn_list -->
		</td>
	</tr>
</table>

<!-- BEGIN rl_list -->
<table class=table_comm width=960 align=center style="margin-top: 17px;">
	<tr height=25>
		<td colspan=6 class=td_head_ext>{USERDEFINEDUSERGROUPS}</td>
	</tr>
	<tr height=25>
		<td class=td_head width=50>&nbsp;</td>
		<td class=td_head width=50>ID</td>
		<td class=td_head width=120>{USEOV}</td>
		<td class=td_head width=350>{NAM}</td>
		<td class=td_head>{DESCRIPTION}</td>
		<td class=td_head width=50>&nbsp;</td>
	</tr>
	
	<!-- BEGIN rl_list_items -->
	<tr height=22 style="text-align: center; <!-- BEGIN isPromised -->background-color: #ddf8dd;<!-- END isPromised -->">
		<td class=td_comm>
		<!-- BEGIN block_edit -->
		<img name="edit" border=0 src="images1/edit_15_grey.gif">
		<!-- END block_edit -->
		<!-- BEGIN allow_edit -->
		<button class=img_button onclick="this.form.do_action.value=1; this.form.db_restore.value=1; this.form.ugid.value='{UG_ID}'; this.form.submit();"><img title="{EDITENTRY}" name="edit" border=0 src="images1/edit_15.gif"></img></button>
		<!-- END allow_edit -->
		</td>
		<td class=td_comm>{UG_ID}</td>
		<td class=td_comm>{UG_CNT}</td>
		<td class=td_comm>{UG_NAME}</td>
		<td class=td_comm>{UG_DESCR}</td>
		<td class=td_comm>
		<!-- BEGIN block_drop -->
		<img src="images1/delete_grey.gif" border=0>
		<!-- END block_drop -->
		<!-- BEGIN allow_drop -->
		<button class=img_button onclick="if(confirm('{ASKIFDELETERECORD}')){ this.form.do_action.value=3; this.form.ugid.value='{UG_ID}'; this.form.submit(); } else {return false;}"><img title="{DELETE3}" name="drop" border=0 src="images1/delete.gif"></img></button>
		<!-- END allow_drop -->
		</td>
	</tr>
	<!-- END rl_list_items -->
</table>
<!-- END rl_list -->

<!-- BEGIN editor -->
<!-- BEGIN active_hid -->
<input type=hidden name=active_set[{SETID}] value="{SETVALUE}">
<!-- END active_hid -->
<table align=center cellpadding=0 cellspacing=0 width=960 class=table_comm style="margin-top: 17px;">
	<!-- BEGIN messages -->
	<tr>
		<td class=td_comm>
			<table width=90% class=table_comm style="border: none; margin-left:5px; color:{MESSAGE_COLOR};">
				<!-- BEGIN message_line -->
				<tr><td>{MESSAGE_TEXT}</td></tr>
				<!-- END message_line -->
			</table>
		</td>
	</tr>
	<!-- END messages -->
	<tr><td class=td_head_ext>{UPDATEUSERGROUP}</td></tr>
	<tr>
		<td class=td_comm>
			<table width=100% class=table_comm style="border: none;">
				<tr height=30>
					<td><span style="margin-left: 5px; margin-right: 15px;">{NAM}</span></td>
					<td ><input type=text style="width: 290px;" name="name" value="{VAL_NAME}"></td>
					<td width=360 rowspan=2>
						<textarea name=description style="width: 350px; height: 60px">{VAL_DESCRIPTION}</textarea>
					</td>
				</tr>
				<!-- BEGIN if_not_convergent -->
				<tr>
					<td>&nbsp;</td>
					<td>&nbsp;</td>
				</tr>
				<!-- END if_not_convergent -->
				<!-- BEGIN if_convergent -->
				<tr height=22>
					<td><span style="margin-left: 5px;">{SERVEDBY}</span></td>
					<td>
						<select name=predstav_id style="width: 290px;">
						<!-- BEGIN oper_opt -->
						<option value="{OPER_ID}" {OPER_SELECTED}>{OPER_NAME}</option>
						<!-- END oper_opt -->
						</select>
					</td>
				</tr>
				<!-- END if_convergent -->
			</table>
		</td>
	</tr>
	<tr>
		<td class=td_comm>
			<table cellpadding=3 width=100% class=table_comm style="border: none;">
			<tr>
				<td valign=top>
					<table class=table_comm width=100%>
					<tr>
						<td class=td_head_ext style="border-right: none;">{ASSIGNEDUSERS}</td>
						<td class=td_head_ext style="border-right: none;">&nbsp;</td>
						<td class=td_head_ext>{FREEUSERS}</td>
					</tr>
					<tr height=249>
						<td align=center style="border-bottom: 1px solid #c0c0c0;">
							<select style="width: 290px; height: 220px;" multiple name=gr2drop[]>
							<!-- BEGIN active_gr_opt -->
							<option value="{A_GRID}">ID # {A_GRID}, {A_GRNAME}</option>
							<!-- END active_gr_opt -->
							</select>
						</td>
						<td align=center style="border-bottom: 1px solid #c0c0c0;">
							<button type=submit name=add_uids class=img_button onclick="this.form.do_action.value=1;"><img src="images/left.gif" border=0></img></button><br><br>
							<button type=submit name=drop_uids class=img_button onclick="this.form.do_action.value=1;"><img src="images/right.gif" border=0></img></button>
						</td>
						<td align=center class=td_comm>
							<select style="width: 290px; height: 220px;" multiple name=gr2sign[]>
							<!-- BEGIN free_gr_opt -->
							<option value="{B_GRID}">ID # {B_GRID}, {B_GRNAME}</option>
							<!-- END free_gr_opt -->
							</select>
						</td>
					</tr>
					</table>
				</td>
				<td valign=top width=290>
					<table  border="0" width="300" class=table_comm  style="margin-left:5px; padding-left:2px;">
						<tr>
							<td class=td_head_ext colspan=2>{FILTER}{COLON}</td>
						</tr>
						<tr>
							<td width=27 style="padding-left:5px;"><input type=checkbox id="type_" name=usrtype value=1 onClick="checkElmGroup(this, this.form)" {USRTYPE_CHECKED}></td>
							<td class=td_comm style="border-bottom: none;">{USEUSERTYPE}{COLON}</td>
						</tr>
						<tr>
							<td>&nbsp;</td>
							<td class=td_comm style="border-bottom: none;">
								<select name=usrtype_by id="type_1" style="width: 230px;" {USRTYPE_DISABLED}>
								<option value=1 {USRTYPE_SEL1}>{USERTYPE1}</option>
								<option value=2 {USRTYPE_SEL2}>{USERTYPE2}</option>
								</select>
							</td>
						</tr>
						<tr>
							<td style="padding-left:5px;"><input type=checkbox id="usrl_" name=usrl value=1 onClick="checkElmGroup(this, this.form)" {USRL_CHECKED}></td>
							<td class=td_comm style="border-bottom: none;">{USERLOGIN}{COLON}</td>
						</tr>
						<tr>
							<td>&nbsp;</td>
							<td class=td_comm style="border-bottom: none;"><input id="usrl_1" style="width: 230px;" name=usrl_by value="{USRL_VALUE}" {USRL_DISABLED}></td>
						</tr>
						<tr>
							<td style="padding-left:5px;"><input type=checkbox id="usragrm_" name=usragrm value=1 onClick="checkElmGroup(this, this.form)" {USRAGRM_CHECKED}></td>
							<td class=td_comm style="border-bottom: none;">{AGREEMENT}{COLON}</td>
						</tr>
						<tr>
							<td>&nbsp;</td>
							<td class=td_comm style="border-bottom: none;"><input id="usragrm_1" style="width: 230px;" name=usragrm_by value="{USRAGRM_VALUE}" {USRAGRM_DISABLED}></td>
						</tr>
						<tr>
							<td style="padding-left:5px;"><input type=checkbox id="postaddr_" name=postaddr value=1 onClick="checkElmGroup(this, this.form)" {POSTADDR_CHECKED} disabled></td>
							<td class=td_comm style="border-bottom: none;">{ADDR_2}{COLON}</td>
						</tr>
						<tr>
							<td>&nbsp;</td>
							<td class=td_comm style="border-bottom: none;">
								<textarea id="postaddr_1" style="width: 230px; height: 60px" name=postaddr_by {POSTADDR_DISABLED}>{POSTADDR_VALUE}</textarea>
							</td>
						</tr>
						<tr align=center>
							<td colspan=2 class=td_comm><input type=submit name=fl_apply value="{PRIMEN}" onclick="this.form.do_action.value=1;"></td>
						</tr>
					</table>
				</td>
			</tr>
			</table>
		</td>
	</tr>
	<tr>
		<td>
			<table width=100% cellpadding=3 class=table_comm style="border: none; ">
			<tr><td width=40 class=td_head_ext style=" border-right:none;"><input type=checkbox name=promise_allow value=1 onClick="this.form.do_action.value=1; this.form.submit();" {PROMISE_ALLOW_CHECKED}></td>
			<td class=td_head_ext style="border-right: none;">{ALLOWPROMISEDPAY}</td></tr></table>
		</td>
	</tr>
	<!-- BEGIN promised -->
	<tr align="center">
		<td class=td_comm>
			<table cellpadding=3 class=table_comm style="border: none;">
				<tr  height="22">
					<td width=200>{MAXPAYMENTSUM}</td>
					<td  width=80><input type=text name=promise_max value="{VAL_PROMISE_MAX}" style="width: 75px;"></td>
					<td  width=60>({RE})</td>
					<td  width=200>{PROMISEDDEBT}</td>
					<td  width=80><input type=text name=promise_limit value="{VAL_PROMISE_LIMIT}" style="width: 75px;"></td>
					<td width=60>({RE})</td>
				</tr>
				<tr  height="22">
					<td>{PROMISELIKEABON}</td>
					<td ><input type=checkbox name=promise_rent value=1 {PROMISE_RENT_CHECKED} <!-- BEGIN ifNconv -->onClick="if(this.checked != false) alert('{PROMISEDRENTALERT}')"<!-- END ifNconv -->></td>
					<td >&nbsp;</td>
					<td>{PROMISEDINDAYS}</td>
					<td><input type=text name=promise_till value="{VAL_PROMISE_TILL}" style="width: 75px;"></td>
					<td>({N_DAYS})</td>
				</tr>
				<tr  height="22">
					<td >{MINPAYMENTSUM}</td>
					<td ><input type=text name=promise_min value="{VAL_PROMISE_MIN}" style="width: 75px;"></td>
					<td >({RE})</td>
					<td colspan=3>&nbsp;</td>
				</tr>
			</table>
		</td>
	</tr>
	<!-- END promised -->
</table>
<!-- END editor -->
</form>