<form action=config.php method=post name="netagents_form">
<input type=hidden name=devision value="10">
<input type=hidden name=id value="">
<table align=center width=960 class=table_comm>
	<tr height=25 class=th_comm>
		<td class=td_head colspan=2>{CONFIGURINGNETWORKAGENTS}</td>
	</tr>
	
	<tr height=40>
		<td class=td_comm colspan=2 >
			&nbsp;
			<button class=button type="submit" name="create" onclick="this.form.devision.value=1" title="{NEWENTRY}"><img  border=0 src="images1/create1.gif"></button><b>{NEWENTRY}</b>
		</td>
	</tr>
</table>
<table align=center cellpadding=0 cellspacing=0 width=960 class=table_comm style="margin-top: 17px;">
	<!-- BEGIN messages -->
	<tr>
		<td class=td_comm colspan=11>
			<table width=90% class=table_comm style="border: none; margin-left:5px; color:red;">
				<!-- BEGIN message_line -->
				<tr><td>{MESSAGE_TEXT}</td></tr>
				<!-- END message_line -->
			</table>
		</td>
	</tr>
	<!-- END messages -->
	<tr height=25>
		<td class=td_head width=50>&nbsp;</td>
		<td class=td_head width=50>&nbsp;</td>
		<td class=td_head width=50>&nbsp;</td>
		<td class=td_head width=50>ID</td>
		<td class=td_head width=70>{TYPE}</td>
		<td class=td_head>{DESCRIPTION}</td>
		<td class=td_head width=106>{IPADDRESS}</td>
		<td class=td_head width=80>{TOTALVG}</td>
		<td class=td_head width=80>{SESSIONS_TOTAL}</td>
		<td class=td_head width=50>{ACTIVITY}</td>
		<td class=td_head width=50>&nbsp;</td>
	</tr>
	<!-- BEGIN list_item -->
	<tr height=22 style="text-align: center;">
		<td class=td_comm>
		<button class=img_button onclick="this.form.devision.value=1; this.form.id.value={AGID}" type="submit" title="{EDITENTRY}" name="edit1"><img border=0 src="images1/edit_15.gif"></img></button>
		</td>
		<td class=td_comm><!-- BEGIN empty_num -->-<!-- END empty_num --><!-- BEGIN num --><button class=img_button type="submit" onclick="this.form.devision.value=68; this.form.id.value={AGID}" border=0 name="replace_number" title="{PHONE_AGENT}"><img src="images/phone_subst.gif" border=0></img></button><!-- END num --></td>
		<td class=td_comm><!-- BEGIN empty_dic -->-<!-- END empty_dic --><!-- BEGIN dic --><button class=img_button type="submit" onclick="this.form.devision.value=69; this.form.id.value={AGID}" name="dictionary" title="{RADIUS_A_CONTROL}"><img src="images/dict.gif" border=0></img></button><!-- END dic --></td>
		<td class=td_comm>{AGID}</td>
		<td class=td_comm>{AGTYPE}</td>
		<td class=td_comm>{AGDESCR}</td>
		<td class=td_comm>{AGIP}</td>
		<td class=td_comm>{AGVG}</td>
		<td class=td_comm>{AGSES}</td>
		<td class=td_comm>
		<!-- BEGIN isoff --><img src="images/no.png" border=0><!-- END isoff -->
		<!-- BEGIN ison --><img src="images/yes.png" border=0><!-- END ison -->
		</td>
		<td class=td_comm><!-- BEGIN empty_drop -->-<!-- END empty_drop --><!-- BEGIN drop --><button class=img_button onclick="this.form.devision.value=11; this.form.id.value={AGID}" type="submit" title="{DELETE3}" name="delete1"><img border=0 src="images1/delete.gif"></img></button><!-- END drop --></td>
	</tr>
	<!-- END list_item -->
	<!-- BEGIN empty_item -->
	<tr height=32 style="text-align: center; color:red;font-weight: bold;">
		<td class=td_comm colspan=11>{NOAGENTSAVAILABLE}</td>
	</tr>
	<!-- END empty_item -->
</table>
</form>