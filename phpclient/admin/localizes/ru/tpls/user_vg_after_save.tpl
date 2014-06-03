<input type=hidden name=uid1>
<input type=hidden name=edit_user>
<input type=hidden name=vg_whatdo>
<input type=hidden name=uid>
<input type=hidden name=vg_id>

<!-- BEGIN ifVGError -->
<input type=hidden name={POSTKEYNAME} value="{POSTKEYVALUE}">
<!-- END ifVGError -->

<table width=750 class=table_comm align=center style="margin-top: 10px">
	<tr>
		<td colspan=3 class=td_comm align=center>
		<!-- BEGIN justSave -->
		<table width=75% class=table_comm style="border: none; margin-left: 130px;">
			<tr>
				<td>
					<button type=submit class=img_button onClick="this.form.devision.value=22"><img src="images1/acclist.gif" border=0 title="{USER_LIST_TITLE}"></button>
					<b>{USER_LIST_TITLE}</b>
				</td>
				<td>
					<button type=submit class=img_button onClick="this.form.uid1.value='{USERID}'; this.form.devision.value=22; this.form.edit_user.value=1;" style="margin-left: 4px;"><img src="images1/edit.gif" border=0 title="{USER_EDIT_Q}"></button>
					<b>{USER_EDIT_Q}</b>
				</td>
			</tr>
			<tr>
				<td>
					<button type=submit class=img_button onClick="this.form.devision.value=7;"><img src="images1/user_vgs.gif" border=0 title="{RAD_VG_LIST}"></button>
					<b>{RAD_VG_LIST}</b>
				</td>
				<td>
					<!-- BEGIN ifUG -->
					<button type=submit class=img_button onClick="this.form.devision.value=7; this.form.vg_whatdo.value='create'; this.form.uid.value={USERID}"><img src="images1/create1.gif" border=0 title="{VG_CREATE_V}"></button>
					<b>{VG_CREATE_V}</b>
					<!-- END ifUG -->
					
					<!-- BEGIN ifVGEdit -->
					<button type=submit class=img_button onClick="this.form.uid1.value='{USERID}';  this.form.uid.value=this.form.uid1.value; this.form.devision.value=7; <!-- BEGIN VGEdit -->this.form.vg_id.value='{CURVGID}'; this.form.vg_whatdo.value='edit';<!-- END VGEdit -->" style="margin-left: 4px;"><img src="images1/edit.gif" border=0 title="{VG_EDITION}"></button>
					<b>{VG_EDITION}</b>
					<!-- END ifVGEdit -->
				</td>
			</tr>
			<!-- BEGIN createMoreVg -->
			<tr>
				<td>
					<button type=submit class=img_button onClick="this.form.devision.value=7; this.form.vg_whatdo.value='create'; this.form.uid.value='{USERID}'"><img src="images1/create1.gif" border=0 title="{VG_CREATE_V}"></button>
					<b>{VG_CREATE_V}</b>
				</td>
				<td>&nbsp;</td>
			</tr>
			<!-- END createMoreVg -->
		</table>
		<!-- END justSave -->
		<!-- BEGIN justDrop -->
		<table width=75% class=table_comm style="border: none; margin-left: 130px;">
			<tr>
				<td>
					<button type=submit class=img_button onClick="this.form.devision.value=22"><img src="images1/acclist.gif" border=0 title="{USER_LIST_TITLE}"></button>
					<b>{USER_LIST_TITLE}</b>
				</td>
				<td>
					<button type=submit class=img_button onClick="this.form.devision.value=7;"><img src="images1/user_vgs.gif" border=0 title="{RAD_VG_LIST}"></button>
					<b>{RAD_VG_LIST}</b>
				</td>
			</tr>
		</table>
		<!-- END justDrop -->
		</td>
	</tr>
	<!-- BEGIN blockList -->
	<tr height=22>
		<td class=td_head colspan=3>{USER_VGS_LIST} <!-- BEGIN showUname -->({CURR_USER_NAME})<!-- END showUname --></td>
	</tr>
	<!-- BEGIN accList_empty -->
	<tr height=22 align=center>
		<td class=td_comm colspan=3 style="color: red;">{USER_VGS_LIST_NO}</td>
	</tr>
	<!-- END accList_empty -->
	
	<!-- BEGIN accList -->
	<tr align=center>
		<td class=td_comm width=25%>&nbsp;<!-- BEGIN ifAllowEdit --><a href="#" onClick="document.forms[1].devision.value=7; document.forms[1].uid1.value={USERID}; document.forms[1].uid.value=document.forms[1].uid1.value; document.forms[1].vg_id.value={VGID}; document.forms[1].vg_whatdo.value='edit'; document.forms[1].submit();" style="text-decoration: underline;">{VGLOGIN}</a><!-- END ifAllowEdit -->{VGLOGIN_NOGRANT}&nbsp;</td>
		<td class=td_comm width=37%>&nbsp;{VGDESCR}&nbsp;</td>
		<td class=td_comm>&nbsp;{VGTYPEDESCR}&nbsp;</td>
	</tr>
	<!-- END accList -->
	<!-- END blockList -->
</table>
</form>