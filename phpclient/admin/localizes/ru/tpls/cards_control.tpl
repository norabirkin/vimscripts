
<!-- BEGIN main_body_generate_cards -->
<form action=config.php method=post name=cards_form>
<input type=hidden name=whatpressed value=0>
<input type=hidden name=devision value=103>
<input type=hidden name=workmode value=11>

<table class="table_comm" align="center"  width="980" style="border: solid 1px #c0c0c0;">
	<!-- BEGIN create_new_cards -->
	<tr class=table_header>
		<td  align="left"  style="border-bottom: solid 1px #c0c0c0;padding-left:7px;" height="25">
        		<b>{PAYCARDSMENU}</b>
          </td>
		<td  align="right" colspan="2"   style="border-bottom: solid 1px #c0c0c0;padding-right:7px;" height="25">
        		{SHOWONPAGE}
         </td>
	</tr>
	
    <tr >
    	<td width=50%> <table style="margin:7px;">      		
				<tr><td>{GENCARDS} </td><td><input  type=text name=cardsamount size=8 value={CARDSUM_VALUE}></td></tr>
				<tr><td>{CARDPRICE}&nbsp;({SHOWINUE})</td><td><input  type=text name=nominal size=8 value={CARDPRICE_VALUE}></td></tr>
				<tr><td>{ZNACHNOST}</td><td><input  type=text name=znachnost size=8 value={ZNACHNOST_VALUE}></td></tr>
                </table>
        </td>
        
        <td width=50%><table style="margin:7px;">    
        		<tr><td>{USE_AC} </td><td><input  type="checkbox" name=ac {AC_CHECKED}></td></tr>
				<tr><td>{CARDSET_NAME}</td><td><select   name="card_sets" style="width: 150px;">{CARDSET_LIST}</select></td></tr>
                <tr><td> {CARDALIVE}</td><td><input  type="checkbox" name=card_alive_on onclick="javascript: if(this.checked==true) document.getElementById('1').style.display='';
                					 else document.getElementById('1').style.display='none';" {CARDALIVE_CHECKED}></td></tr>
                </table>                     
        </td>
    </tr>
    
    <tr id=1 style="display: none;">
		<td height="22">&nbsp;</td>
		<td height="22">
			<input  type=text name=card_alive size=8 value=''>
			<select  name=alive_unit style="width: 85px; margin-left: 20px;">	
			<!-- BEGIN card_alive_option -->
			<option value={ALIVE_OP_VALUE}>{ALIVE_OP}</option>
			<!-- END card_alive_option -->	
			</select>
		</td>
		</tr>
	  
    
	<tr>
	<td colspan = 3 >
	<table class="table_comm"   width="980"  height="35" style="border-left:none;" border="0">
		<tr>
			<td  align="center"><b>{EXP_D_COL}&nbsp;</b><select  name=year style="width: 85px;">{YEAR_OP}</select>&nbsp;
            																	<select  name=month style="width: 85px;">{MONTH_OP}</select>&nbsp;
                                                                                <select  name=day style="width: 85px;">{DAY_OP}</select>&nbsp;    
                                                                                <input  name=gencards onclick="check_reqs()" type=button value="{CREATE2}" {BUTTON_STATUS} style="width: 90px;">
            </td>			
		</tr>
	</table>
	</td>
	</tr>
	<!-- END create_new_cards -->

</table>
</form>
<!-- END main_body_generate_cards -->


<!-- BEGIN main_body_cards_list -->
<script language="javascript">
function searchFormElementsOnOff(myElemID, gotParams)
{
	if(typeof gotParams == 'object' && (gotParams.join))
	for(var keys in gotParams)
	{
		if(document.getElementById(gotParams[keys]))
		document.getElementById(gotParams[keys]).disabled = (myElemID == true) ? false : true;
	}

	else
		if(document.getElementById(gotParams))
		document.getElementById(gotParams).disabled = (myElemID == true) ? false : true;
}

function ShowFilter(form)
{
	if(!form) return false;
	if(form.filter.value < 1)
	{
		document.getElementById('1').style.display='';
		form.filter.value=1;
		if(form.to_show.value < 2) document.getElementById('3').style.display='none';
		else document.getElementById('3').style.display='';
	}
	else
	{
		document.getElementById('1').style.display='none'; form.filter.value=0;
	}
}

function UnitBoxList()
{
	var form = document.forms[1];
	if(form.filter_unit_select.value == -1) form.filter_unit_select.options[0].selected=true;
	if(form.filter_unit_select.value > -1)
	{
		form.filter_unit_value.value=''; 
		document.getElementById('2').style.display='none';
	}
	if(form.filter_unit_select.value < -1)
	{
		document.getElementById('2').style.display='';
	}
}

function ResetPage(form)
{
	if(!form) return false;
	form.c_p_n1.value=1;
	
	if(form.to_show.value < 2)
	{
		document.getElementById('3').style.display='none';
		form.sort_activ_on.checked = false;
	}
	else document.getElementById('3').style.display='';
}
</script>

<form action=config.php method=post>
<input type=hidden name=devision value=103>
<input type=hidden name=filter value={FILTERONOFF}>
<input type=hidden name=order_by value={ORDER_BY}>
<input type=hidden name=c_p_n1 value={C_P_N1}>
<table class="table_comm" align=center border=0 cellspacing=0 cellpadding=0 width=980 style="border: solid 1px #c0c0c0;">
	<tr>
	<td class=table_header width=600 align=right  style="border-bottom: solid 1px #c0c0c0;" >
		<b>{PAYCARDSMENU_LIST}</b>
	</td>
	<td class=table_header align=right   style="border-bottom: solid 1px #c0c0c0;padding-right:5px;" ><span onclick="ResetPage(document.forms[1])">{SHOWONPAGE_LIST}</span></td>
	</tr>
	
	<tr>
	<td align=left height=30>
	<table>
	<tr>
	<td align=center width=40>
		<button type="button" style="border:0; background:transparent;" onclick="ShowFilter(this.form)"><img src="images/filter_im1.gif" border=0 style="border: solid 1px #A0A0A0;"></button>
	</td>
	<td width=250>
		<select name=to_show  style="width: 180px;" onchange="javascript: ResetPage(this.form)">
		<!-- BEGIN to_show_op -->
		<option value={TOSHOWVALUE}>{TOSHOWNAME}</option>
		<!-- END to_show_op -->
		</select>
	</td>
	<td align=left>
		<input  type=button value='{CONTINUE}' onclick="javascript: this.form.submit();">
	</td>
	<tr>
	</table>
	</td>
	<td>&nbsp;</td>
	</tr>
	
	<tr id=1 style="display: {FILTERVISBL}">
	<td  style="padding-bottom:10px;">
	<table width=100% >
	<tr  >
		<td align=center width=40>
			<input type=checkbox name=sort_created_on onClick="javascript: searchFormElementsOnOff(this.checked, Array('f_1_1', 'f_1_2', 'f_1_3')); ResetPage(this.form);" {SORTSTART}>
		</td>
		<td width=250 >{CARDCREATED}</td>
		<td >
		<select id="f_1_1"  name=c_year {F_1}>{SELECT_C_1}</select>&nbsp;&nbsp;&nbsp;
		<select id="f_1_2"  name=c_month {F_1}>{SELECT_C_2}</select>&nbsp;&nbsp;&nbsp;
		<select id="f_1_3"  name=c_day {F_1}>{SELECT_C_3}</select>&nbsp;
		</td>
	</tr>
	<tr id=3 style="display: {SHOWHIDE_ACTIVATED}">
		<td align=center width=40>
			<input type=checkbox name=sort_activ_on onclick="searchFormElementsOnOff(this.checked, Array('f_2_1', 'f_2_2', 'f_2_3')); ResetPage(this.form);" {SORTACTIV}></td>
		<td >{CARDACTIVATED}</td>
		<td>
		<select id="f_2_1"  name=a_year {F_2}>{SELECT_A_1}</select>&nbsp;&nbsp;&nbsp;
		<select id="f_2_2"  name=a_month {F_2}>{SELECT_A_2}</select>&nbsp;&nbsp;&nbsp;
		<select id="f_2_3"  name=a_day {F_2}>{SELECT_A_3}</select>&nbsp;
		</td>
	</tr>
	<tr >
		<td align=center width=40>
			<input type=checkbox name=sort_byunit_on onclick="searchFormElementsOnOff(this.checked, Array('f_3_1', '2')); ResetPage(this.form);" {SORTUNIT}></td>
		<td >
		<select id="f_3_1" name=filter_unit_select style="width: 180px;" onchange="UnitBoxList()"  {F_3}>
			<!-- BEGIN filter_unit -->
			<option value={FILTERUNITVALUE}>{FILTERUNITNAME}</option>
			<!-- END filter_unit -->
		</select>
		</td>
		<td>
			<input type=text id=2 name=filter_unit_value style="width: 180px; display: {F_DISPL};" value='{F_VALUE}' {F_3}>
		</td>
	</tr>
	</table>
	</td>
	<td>&nbsp;</td>
	</tr>
</table>
</form>

<!-- BEGIN start_list -->
<table class="table_comm" align=center border=0 cellspacing=0 cellpadding=0 width=980 style="border: solid 1px #c0c0c0;border-top:none;">
   <tr><td colspan=9 align=center  bgcolor=#e0e0e0 style="border-bottom: solid 1px #c0c0c0;" height=25><b>{CARDLISTNAME}</b></td></tr>
   <tr><td colspan=9 align=left  bgcolor=#e0e0e0 style="border-bottom: solid 1px #c0c0c0;" height=25>&nbsp;&nbsp;&nbsp;{COUNTPAGES}&nbsp;</td></tr>
<!-- END start_list -->
<!-- END main_body_cards_list -->

<!-- BEGIN main_body_row -->
	<tr>
	<!-- BEGIN col_parse -->
	<td align=center  height=20 style="border-bottom: 1px solid #c0c0c0;" {COL_LIST_PROP}>
		{COLVALUE}
	</td>
	<!-- END col_parse -->
	</tr>
<!-- END main_body_row -->
