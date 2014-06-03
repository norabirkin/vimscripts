<form action="config.php" method="POST" id="_ModulesList">
<input type="hidden" name="devision" value="1">
<input type="hidden" name="module" id="_module_" value="">
<table align=center width=960 class=table_comm>
	<tr><td class="td_head_ext" colspan="2"><%@ Modules settings %></td></tr>
	
	<tr height="40">
		<td class="td_comm">
			&nbsp;
			<button type="submit" name="create" title="<%@ Create %> <%@ new %> <%@ module %>"><img border="0" src="images/new22.gif"></img></button>
			<b><%@ Create %> <%@ new %> <%@ module %></b>
		</td>
	</tr>
</table>
<table align="center" cellpadding="0" cellspacing="0" width="960" class="table_comm" style="margin-top: 17px;">
	<!-- BEGIN messages -->
	<tr>
		<td class="td_comm" colspan="11">
			<table width=90% class="table_comm" style="border: none; margin-left:5px; color:red;">
				<!-- BEGIN message_line -->
				<tr><td><%@ {MESSAGE_TEXT} %></td></tr>
				<!-- END message_line -->
			</table>
		</td>
	</tr>
	<!-- END messages -->
	<tr height=25>
		<td class="td_head" width="50">&nbsp;</td>
		<td class="td_head" width="50">&nbsp;</td>
		<td class="td_head" width="50">&nbsp;</td>
		<td class="td_head" width="50">ID</td>
		<td class="td_head" width="96"><%@ Type %></td>
		<td class="td_head"><%@ Description %></td>
		<td class="td_head" width="80">IP-<%@ Address %></td>
		<td class="td_head" width="80"><%@ Accounts %></td>
		<td class="td_head" width="80"><%@ Active sessions %></td>
		<td class="td_head" width="50">&nbsp;</td>
		<td class="td_head" width="50">&nbsp;</td>
	</tr>
	<!-- BEGIN list_item -->
	<tr style="text-align: center;">
		<td class="td_comm">
		<button onclick="submitForm(this.form.id, 'module', '{AGID}')" type="button" title="<%@ Edit %>"><img border="0" title="<%@ Edit %>" src="images1/edit_15.gif"></img></button>
		</td>
		<td class=td_comm><!-- BEGIN empty_num -->-<!-- END empty_num --><!-- BEGIN num --><button type="button" onClick="createHidOrUpdate(this.form.id, 'devision', 68); submitForm(this.form.id, 'module', '{AGID}')" border="0" title="<%@ Billing mediation %>"><img src="images/phone_subst.gif" border="0" title="<%@ Billing mediation %>"></img></button><!-- END num --></td>
		<td class=td_comm><!-- BEGIN empty_dic -->-<!-- END empty_dic --><!-- BEGIN dic --><button type="button" onClick="createHidOrUpdate(this.form.id, 'devision', 69); submitForm(this.form.id, 'module', '{AGID}')" title="<%@ RADIUS-attributes dictionary %>"><img src="images/dict.gif" border="0" title="<%@ RADIUS-attributes dictionary %>"></img></button><!-- END dic --></td>
		<td class=td_comm>{AGID}</td>
		<td class=td_comm>{AGTYPE}</td>
		<td class=td_comm>{AGDESCR}</td>
		<td class=td_comm>{AGIP}</td>
		<td class=td_comm>{AGVG}</td>
		<td class=td_comm>{AGSES}</td>
		<td class=td_comm>
		<!-- BEGIN isoff --><img src="images/no.png" border=0><!-- END isoff -->
		<!-- BEGIN ison --><img title="{LASTCONTACT}" src="images/yes.png" border=0><!-- END ison -->
		</td>
		<td class=td_comm><!-- BEGIN empty_drop -->-<!-- END empty_drop --><!-- BEGIN drop --><button onClick="createHidOrUpdate(this.form.id, 'delete', 1); createHidOrUpdate(this.form.id, 'module', '{AGID}')" type="submit" title="<%@ Remove %>"><img title="<%@ Remove %>" border="0" src="images1/delete.gif"></img></button><!-- END drop --></td>
	</tr>
	<!-- END list_item -->
	<!-- BEGIN empty_item -->
	<tr height="40" style="text-align: center; color:red; font-weight: bold;">
		<td class=td_comm colspan=11><%@ No records found %></td>
	</tr>
	<!-- END empty_item -->
</table>
</form>