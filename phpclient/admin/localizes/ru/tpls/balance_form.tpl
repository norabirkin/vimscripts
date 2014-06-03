<input type="hidden" name=vg_old_balance value="{VG_OLD_BALANCE}">
<input type="hidden" name=vg_curr_balance value="{VG_CURR_BALANCE}">

<table width=100% cellpadding=0 cellspacing=0 align=center class=table_comm style="border: none;">
	<tr height=20 align=center style="border-top: solid 1px #c0c0c0;"> 
		<td class=td_head <!-- BEGIN uformb -->width=160<!-- END uformb --> <!-- BEGIN vgformb -->width=190<!-- END vgformb -->>{BALANCE} ({NAT_CUR})</td>
		<td class=td_head>{ENTER_PAY}</td>
		<td class=td_head <!-- BEGIN uform -->width=260<!-- END uform --> <!-- BEGIN vgform -->width=310<!-- END vgform -->>{SHORT_PAY_HISTORY} <!-- BEGIN ifPayList -->(<a href="#" onClick="active_ord1('./history_pay.php?vg={VG_HISTORY_ID}');">{MORE_MORE}...</a>)<!-- END ifPayList --></td>
	</tr>
	<tr>
		<td class=td_comm align=center>
			<font size="+3" <!-- BEGIN balanceLow -->color="red"<!-- END balanceLow -->>{VG_CURR_BALANCE_V}</font>
		</td>
		<td class=td_comm valign=top>
		<table cellpadding=0 cellspacing=0 width=100% class=table_comm style="border: none;">
			<!-- BEGIN nakl_num_error -->
			<tr height=27 align=center>
				<td class=td_comm style="border: none; color: red;" colspan=3>{NAKL_NUM_NO}</td>
			</tr>
			<!-- END nakl_num_error -->
			<tr height=27>
				<td align=right class=td_comm style="border: none;">
					<input type=text style="width: 90px; text-align: right;" value="0" name=vg_add_balance <!-- BEGIN disPayField -->disabled<!-- END disPayField -->> ({NAT_CUR})&nbsp;
				</td>
				<td width=50% class=td_comm style="border: none;">
					<input type=submit value="{MAKEPAYMENT}" name=vg_add_balance_b <!-- BEGIN disPay -->disabled<!-- END disPay -->>
				</td>
			</tr>
			<tr height=27>
				<td class=td_comm style="border: none;">&nbsp;{BILLDOCID}{COLON}</td>
				<td class=td_comm style="border: none;"><input type=text name=vg_plat_num value="{VG_PLAT_NUM}" style="width: 174px"></td>
			</tr>
			<tr height=27>
				<td class=td_comm style="border: none;">&nbsp;{COMMENTS}{COLON}</td>
				<td class=td_comm style="border: none;"><input type=text style="width: 174px" name=vg_plat_comment value="{VG_PLAT_COMMENT}"></td>
			</tr>
			<tr height=20>
				<td colspan=2 class=td_head style="border-right:none; border-top: solid 1px #c0c0c0;">{BALANCE}{COLON} {ADDITIONAL}</td>
			</tr>
			<tr height=27>
				<td class=td_comm style="border: none;">&nbsp;{ALLOWCREDIT_1}{COLON}</td>
				<td class=td_comm style="border: none;"><input type=text style="width: 120px" name=vg_depth value="{VG_DEPTH}" <!-- BEGIN ifPromiseAlert -->onClick="alert('{PROMISEADMINALERT}')"<!-- END ifPromiseAlert -->>&nbsp;({RE})</td>
			</tr>
		</table>
		</td>
		<td class=td_comm valign=top style="border-right: none;">
		<table cellpadding=0 cellspacing=0 width=100% class=table_comm style="border: none;">
			<tr height=20>
				<td class=td_head>{VG_PASSNUM}</td>
				<td class=td_head>{DATE}</td>
				<td class=td_head style="border-right: none;">{SUM}</td>
			</tr>
			<!-- BEGIN pay_item -->
			<tr height=20 align=center title="{COMMENTS}{COLON} {PDESCR}" <!-- BEGIN p_order -->color="green"<!-- END p_order --> <!-- BEGIN canceled_pay -->bgcolor=#f3d48a<!-- END canceled_pay -->>
				<td class=td_comm>{PNUM}</td>
				<td class=td_comm>{PDATE}</td>
				<td class=td_comm style="border-right: none;">{PVALUE}</td>
			</tr>
			<!-- END pay_item -->
			
			<!-- BEGIN promise_record -->
			<tr height=20>
				<td class=td_head colspan=3>{ALLOWPROMISEDPAY}</td>
			</tr>
			<tr height=20>
				<td class=td_head>{DATE}</td>
				<td class=td_head>{PROMISEDTRUETILL}</td>
				<td class=td_head style="border-right: none;">{SUM}</td>
			</tr>
			<!-- BEGIN prom_item -->
			<tr height=20 align=center style="background-color: #d5f3ff;">
				<td class=td_comm style="border-bottom: none;">{PRNUM}</td>
				<td class=td_comm style="border-bottom: none;">{PRDATE}</td>
				<td class=td_comm style="border: none;">{PRVALUE}</td>
			</tr>
			<!-- END prom_item -->
			<!-- END promise_record -->
		</table>
		</td>
	</tr>
</table>