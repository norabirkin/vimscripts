<!-- BEGIN reports_list -->
<script language="JavaScript">
function form_report(mode)
{
	var str = new String;
	str = 'reports/report'+mode+'.php';
	document.forms['reportsform'].action = str;
	document.forms['reportsform'].submit();
}

function form_report_user()
{
   var form = document.forms['reportsform'];
   for(var i=0;i<form.length;i++)
   {
      if(form.elements[i].type == "radio" && form.elements[i].name == "user_report" && form.elements[i].checked)
         form.action = form.elements[i].value;
   }
   form.submit();
}

function show_filter_block()
{
	if(document.forms[1].additional_filter.value == 0)
	{
		document.forms[1].additional_filter.value = 1;
		document.getElementById('filter_add').style.display = 'block';
	}
	else
	{
		document.forms[1].additional_filter.value = 0;
		document.getElementById('filter_add').style.display = 'none';
	}
	return;
}

function showReportHelp(manID)
{
	if(typeof manID == 'undefined' || manID == null) return false;
	window.open('help/help.php?dvsn=' + document.forms[1].devision.value + '&ID=' + manID,'HELP','width=640,height=610,resizable=yes,status=no,menubar=no,scrollbars=yes,screenX=260,screenY=100');
}
</script>

<form action=config.php method=post name=reportsform target=\"_rep\">

<input type=hidden name=devision value=107>
<input type=hidden name=exp_rep2_on value=0>
<input type=hidden name=actuality value={ACTUALITY}>
<input type=hidden name=det_rep value=0>
<input type=hidden name=additional_filter value=0>

<table class="table_comm" width=980  align=center>

   <tr>
     <td width="100%" align="center">
       <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border: solid 1px #c0c0c0; border-left:none;border-top:none;">
        <tr>
          <td  align="center" colspan=6 width="100%"  class="td_head_ext" style="border: none; border-bottom: solid 1px #c0c0c0;">
           <font class="z11"><b>{MONTH_REPORTS}</b></font>
          </td>
        </tr>
<!--
        <tr>
          <td width="350" height=40 class="z11" align="left" style="padding-left: 10px; margin-left: 10px; border-bottom: solid 1px #c0c0c0;">
            <img src="images1/ask.gif" vspace=0 hspace=0 align=middle style="visibility: hidden;">
            &nbsp;&nbsp;
            <font class="z11">{MF_1}</font>
          </td>
          <td width="40" height=40 class="z11" align="center" style="border-bottom: solid 1px #c0c0c0;">
            <font class="z11">{ZA}</font>
          </td>
          <td width="130" height=40 class="z11" align="center" style="border-bottom: solid 1px #c0c0c0;">
             <select name="year_1" class="z11" style="width: 120px;" disabled>
               {YEAR}
             </select>
          </td>
          <td width="130" height=40 class="z11" align="center" style="border-bottom: solid 1px #c0c0c0;">
             <select name="month_1" class="z11" style="width: 120px;" disabled>
               {MONTH}
             </select>
          </td>
          <td width="180" height=40 class="z11" align="center" style="border-bottom: solid 1px #c0c0c0;">
             <font class="z11">{IN}</font>
             <select name="type_1" class="z11" style="width: 120px;" disabled>
               <option class="z11" value="win">{NEW_WINDOW}
               <option class="z11" value="exl">{EXCEL}
             </select>
          </td>
          <td width="150" height=40 class="z11" align="left"
             style="padding-left: 10px; margin-left: 10px; border-bottom: solid 1px #c0c0c0;">
            <span>
            <img src="images1/execute1_15.gif" vspace=0 hspace=0 align=middle>&nbsp;
            <font class="z11"><b>{EXECUTE}</b></font>
            </span>
          </td>
        </tr>
-->
        <tr>
          <td width="350" height=40 class="z11" align="left" style="padding-left: 10px; margin-left: 10px; border-bottom: solid 1px #c0c0c0;">
            <img src="images1/ask.gif" vspace=0 hspace=0 align=middle onClick="javascript: showReportHelp('001');" style="cursor: help;">
            &nbsp;&nbsp;
            <font class="z11">{MF_2}</font>
          </td>
          <td width="40" height=40 class="z11" align="center" style="border-bottom: solid 1px #c0c0c0;">
            <font class="z11">{ZA}</font>
          </td>
          <td width="130" height=40 class="z11" align="center" style="border-bottom: solid 1px #c0c0c0;">
             <select name="year_2" class="z11" style="width: 120px;">
             {YEAR}
             </select>
          </td>
          <td width="130" height=40 class="z11" align="center" style="border-bottom: solid 1px #c0c0c0;">
             <select name="month_2" class="z11" style="width: 120px;">
               {MONTH}
             </select>
          </td>
          <td width="180" height=40 class="z11" align="center" style="border-bottom: solid 1px #c0c0c0;">
          <font class="z11">{IN}</font>
             <select name="type_2" class="z11" style="width: 120px;">
               <option class="z11" value="win">{NEW_WINDOW}
               <option class="z11" value="exl">{EXCEL}
             </select>
          </td>
          <td width="150" height=40 class="z11" align="left"
             style="padding-left: 10px; margin-left: 10px; border-bottom: solid 1px #c0c0c0;">
            <span onclick="form_report(2);" style="cursor: pointer;">
            <img src="images1/execute1_15.gif" vspace=0 hspace=0 align=middle>&nbsp;
            <font class="z11"><b>{EXECUTE}</b></font>
            </span>
          </td>
        </tr>
<!--
        <tr>
          <td width="350" height=40 class="z11" align="left" style="padding-left: 10px; margin-left: 10px; border-bottom: solid 1px #c0c0c0;">
            <img src="images1/ask.gif" vspace=0 hspace=0 align=middle style="visibility: hidden;">
            &nbsp;&nbsp;
            <font class="z11">{MF_3}</font>
          </td>
          <td width="40" height=40 class="z11" align="center" style="border-bottom: solid 1px #c0c0c0;">
            <font class="z11">{ZA}</font>
          </td>
          <td width="130" height=40 class="z11" align="center" style="border-bottom: solid 1px #c0c0c0;">
             <select name="year_3" class="z11" style="width: 120px;" disabled>
               {YEAR}
             </select>
          </td>
          <td width="130" height=40 class="z11" align="center" style="border-bottom: solid 1px #c0c0c0;">
             <select name="month_3" class="z11" style="width: 120px;" disabled>
               {MONTH}
             </select>
          </td>
          <td width="180" height=40 class="z11" align="center" style="border-bottom: solid 1px #c0c0c0;">
          <font class="z11">{IN}</font>
             <select name="type_3" class="z11" style="width: 120px;" disabled>
               <option class="z11" value="win">{NEW_WINDOW}
               <option class="z11" value="exl">{EXCEL}
             </select>
          </td>
          <td width="150" height=40 class="z11" align="left"
             style="padding-left: 10px; margin-left: 10px; border-bottom: solid 1px #c0c0c0;">
            <span>
            <img src="images1/execute1_15.gif" vspace=0 hspace=0 align=middle>&nbsp;
            <font class="z11"><b>{EXECUTE}</b></font>
            </span>
          </td>
        </tr>
-->
        <tr>
          <td width="350" height=40 class="z11" align="left" style="padding-left: 10px; margin-left: 10px; border-bottom: solid 1px #c0c0c0;">
            <img src="images1/ask.gif" vspace=0 hspace=0 align=middle onClick="javascript: showReportHelp('002');"  style="cursor: help;">
            &nbsp;&nbsp;
            <font class="z11">{MF_4}</font>
          </td>
          <td width="40" height=40 class="z11" align="center" style="border-bottom: solid 1px #c0c0c0;">
            <font class="z11">{ZA}</font>
          </td>
          <td width="130" height=40 class="z11" align="center" style="border-bottom: solid 1px #c0c0c0;">
             <select name="year_4" class="z11" style="width: 120px;">
               {YEAR}
             </select>
          </td>
          <td width="130" height=40 class="z11" align="center" style="border-bottom: solid 1px #c0c0c0;">
             <select name="month_4" class="z11" style="width: 120px;">
               {MONTH}
             </select>
          </td>
          <td width="180" height=40 class="z11" align="center" style="border-bottom: solid 1px #c0c0c0;">
          <font class="z11">{IN}</font>
             <select name="type_4" class="z11" style="width: 120px;">
               <option class="z11" value="win">{NEW_WINDOW}
               <option class="z11" value="exl">{EXCEL}
             </select>
          </td>
          <td width="150" height=40 class="z11" align="left"
             style="padding-left: 10px; margin-left: 10px; border-bottom: solid 1px #c0c0c0;"">
            <span onclick="form_report(4);" style="cursor: pointer;">
            <img src="images1/execute1_15.gif" vspace=0 hspace=0 align=middle>&nbsp;
            <font class="z11"><b>{EXECUTE}</b></font>
            </span>
          </td>
        </tr>

        <tr>
          <td width="350" height=40 class="z11" align="left" style="padding-left: 10px; margin-left: 10px; border-bottom: solid 1px #c0c0c0;">
            <img src="images1/ask.gif" vspace=0 hspace=0 align=middle style="cursor: help;" onClick="javascript: showReportHelp('005');">
            &nbsp;&nbsp;
            <font class="z11">{MF_5}</font>
          </td>
          <td width="40" height=40 class="z11" align="center" style="border-bottom: solid 1px #c0c0c0;">
            <font class="z11">{ZA}</font>
          </td>
          <td width="130" height=40 class="z11" align="center" style="border-bottom: solid 1px #c0c0c0;">
             <select name="year_5" class="z11" style="width: 120px;">
               {YEAR}
             </select>
          </td>
          <td width="130" height=40 class="z11" align="center" style="border-bottom: solid 1px #c0c0c0;">
             <select name="month_5" class="z11" style="width: 120px;">
               {MONTH}
             </select>
          </td>
          <td width="180" height=40 class="z11" align="center" style="border-bottom: solid 1px #c0c0c0;">
          <font class="z11">{IN}</font>
             <select name="type_5" class="z11" style="width: 120px;">
               <option class="z11" value="win">{NEW_WINDOW}
               <option class="z11" value="exl">{EXCEL}
             </select>
          </td>
          <td width="150" height=40 class="z11" align="left"
             style="padding-left: 10px; margin-left: 10px; border-bottom: solid 1px #c0c0c0;"">
            <span onclick="form_report(5);" style="cursor: pointer;">
            <img src="images1/execute1_15.gif" vspace=0 hspace=0 align=middle>&nbsp;
            <font class="z11"><b>{EXECUTE}</b></font>
            </span>
          </td>
        </tr>

	<tr>
		<td width="350" height=40 class="z11" align="left" style="padding-left: 10px; margin-left: 10px; border-bottom: solid 1px #c0c0c0;">
		<img src="images1/ask.gif" vspace=0 hspace=0 align=middle style="cursor: help;" onClick="javascript: showReportHelp('006');">&nbsp;&nbsp;
		<font class="z11">{MF_6}</font>
		</td>

		<td width="40" height=40 class="z11" align="center" style="border-bottom: solid 1px #c0c0c0;"><font class="z11">{ZA}</font></td>

		<td width="130" height=40 class="z11" align="center" style="border-bottom: solid 1px #c0c0c0;"><select name="year_6" class="z11" style="width: 120px;">{YEAR}</select></td>

		<td width="130" height=40 class="z11" align="center" style="border-bottom: solid 1px #c0c0c0;"><select name="month_6" class="z11" style="width: 120px;">{MONTH}</select></td>

		<td width="180" height=40 class="z11" align="center" style="border-bottom: solid 1px #c0c0c0;"><font class="z11">{IN}</font><select name="type_6" class="z11" style="width: 120px;">
		<option class="z11" value="win">{NEW_WINDOW}
		<option class="z11" value="exl">{EXCEL}
		</select>
		</td>

		<td width="150" height=40 class="z11" align="left" style="padding-left: 10px; margin-left: 10px; border-bottom: solid 1px #c0c0c0;"><span onclick="form_report(6);" style="cursor: pointer;">
		<img src="images1/execute1_15.gif" vspace=0 hspace=0 align=middle>&nbsp;<font class="z11"><b>{EXECUTE}</b></font></span>
		</td>
	</tr>

	<tr>
		<td width="350" height=40 class="z11" align="left" style="padding-left: 10px; margin-left: 10px; border-bottom: solid 1px #c0c0c0;">
		<img src="images1/ask.gif" vspace=0 hspace=0 align=middle style="cursor: help;" onClick="javascript: showReportHelp('007');">&nbsp;&nbsp;
		<font class="z11">{PROMISEDPAYREPORT}</font>
		</td>

		<td width="40" height=40 class="z11" align="center" style="border-bottom: solid 1px #c0c0c0;"><font class="z11">{ZA}</font></td>

		<td width="130" height=40 class="z11" align="center" style="border-bottom: solid 1px #c0c0c0;"><select name="year_7" class="z11" style="width: 120px;">{YEAR}</select></td>

		<td width="130" height=40 class="z11" align="center" style="border-bottom: solid 1px #c0c0c0;"><select name="month_7" class="z11" style="width: 120px;">{MONTH}</select></td>

		<td width="180" height=40 class="z11" align="center" style="border-bottom: solid 1px #c0c0c0;"><font class="z11">{IN}</font><select name="type_7" class="z11" style="width: 120px;">
		<option class="z11" value="win">{NEW_WINDOW}
		<option class="z11" value="exl">{EXCEL}
		</select>
		</td>

		<td width="150" height=40 class="z11" align="left" style="padding-left: 10px; margin-left: 10px; border-bottom: solid 1px #c0c0c0;"><span onclick="form_report(7);" style="cursor: pointer;">
		<img src="images1/execute1_15.gif" vspace=0 hspace=0 align=middle>&nbsp;<font class="z11"><b>{EXECUTE}</b></font></span>
		</td>
	</tr>

	<tr>
		<td width="350" height=40 class="z11" align="left" style="padding-left: 10px; margin-left: 10px; border-bottom: solid 1px #c0c0c0;">
		<img src="images1/ask.gif" vspace=0 hspace=0 align=middle style="cursor: help;" onClick="javascript: showReportHelp('008');">&nbsp;&nbsp;
		<font class="z11">{REPORTTARIFSRASP}</font>
		</td>

		<td width="40" height=40 class="z11" align="center" style="border-bottom: solid 1px #c0c0c0;"><font class="z11">{ZA}</font></td>

		<td width="130" height=40 class="z11" align="center" style="border-bottom: solid 1px #c0c0c0;"><select name="year_8" class="z11" style="width: 120px;">{YEAR1}</select></td>

		<td width="130" height=40 class="z11" align="center" style="border-bottom: solid 1px #c0c0c0;"><select name="month_8" class="z11" style="width: 120px;">{MONTH}</select></td>

		<td width="180" height=40 class="z11" align="center" style="border-bottom: solid 1px #c0c0c0;"><font class="z11">{IN}</font><select name="type_8" class="z11" style="width: 120px;">
		<option class="z11" value="win">{NEW_WINDOW}
		<option class="z11" value="exl">{EXCEL}
		</select>
		</td>

		<td width="150" height=40 class="z11" align="left" style="padding-left: 10px; margin-left: 10px; border-bottom: solid 1px #c0c0c0;"><span onclick="form_report(8);" style="cursor: pointer;">
		<img src="images1/execute1_15.gif" vspace=0 hspace=0 align=middle>&nbsp;<font class="z11"><b>{EXECUTE}</b></font></span>
		</td>
	</tr>

	<tr>
		<td width="350" height=40 class="z11" align="left" style="padding-left: 10px; margin-left: 10px; border-bottom: solid 1px #c0c0c0;">
		<img src="images1/ask.gif" vspace=0 hspace=0 align=middle style="cursor: help;" onClick="javascript: showReportHelp('009');">&nbsp;&nbsp;
		<font class="z11">{PLANEDOFFLINEVGROUPS}</font>
		</td>

		<td width="40" height=40 class="z11" align="center" style="border-bottom: solid 1px #c0c0c0;"><font class="z11">{ZA}</font></td>

		<td width="130" height=40 class="z11" align="center" style="border-bottom: solid 1px #c0c0c0;"><select name="year_9" class="z11" style="width: 120px;">{YEAR1}</select></td>

		<td width="130" height=40 class="z11" align="center" style="border-bottom: solid 1px #c0c0c0;"><select name="month_9" class="z11" style="width: 120px;">{MONTH}</select></td>

		<td width="180" height=40 class="z11" align="center" style="border-bottom: solid 1px #c0c0c0;"><font class="z11">{IN}</font><select name="type_9" class="z11" style="width: 120px;">
		<option class="z11" value="win">{NEW_WINDOW}
		<option class="z11" value="exl">{EXCEL}
		</select>
		</td>

		<td width="150" height=40 class="z11" align="left" style="padding-left: 10px; margin-left: 10px; border-bottom: solid 1px #c0c0c0;"><span onclick="form_report(9);" style="cursor: pointer;">
		<img src="images1/execute1_15.gif" vspace=0 hspace=0 align=middle>&nbsp;<font class="z11"><b>{EXECUTE}</b></font></span>
		</td>
	</tr>

	<tr>
		<td width="350" height=40 class="z11" align="left" style="padding-left: 10px; margin-left: 10px;">
		<img src="images1/ask.gif" vspace=0 hspace=0 align=middle style="cursor: help;" onClick="javascript: showReportHelp('010');">&nbsp;&nbsp;
		<font class="z11">{DEPTORS}</font>
		</td>

		<td width="40" height=40 class="z11" align="center"><font class="z11">{ZA}</font></td>

		<td width="130" height=40 class="z11" align="center"><select name="year_10" class="z11" style="width: 120px;">{YEAR}</select></td>

		<td width="130" height=40 class="z11" align="center"><select name="month_10" class="z11" style="width: 120px;">{MONTH}</select></td>

		<td width="180" height=40 class="z11" align="center"><font class="z11">{IN}</font><select name="type_10" class="z11" style="width: 120px;">
		<option class="z11" value="win">{NEW_WINDOW}
		<option class="z11" value="exl">{EXCEL}
		</select>
		</td>

		<td width="150" height=40 class="z11" align="left" style="padding-left: 10px; margin-left: 10px;"><span onclick="form_report(10);" style="cursor: pointer;">
		<img src="images1/execute1_15.gif" vspace=0 hspace=0 align=middle>&nbsp;<font class="z11"><b>{EXECUTE}</b></font></span>
		</td>
	</tr>
       </table>
     </td>
   </tr>


   <tr>
     <td width="100%" align="center">
       <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border: solid 1px #c0c0c0; border-left:none;border-top:none;">
	   <tr>
	     <td align="center" colspan=6 width="100%" class="td_head_ext" style="border: none; border-bottom: solid 1px #c0c0c0;">
           <font class="z11"><b>{DETAIL_REPORTS}</b></font>
          </td>
	   </tr>
	   <tr>
           <td colspan=6 width="100%" align="center" style="border: solid 1px #c0c0c0; border-top: none; border-left: none; border-right: none;">
           <!-- INCLUDE full_date.tpl -->
           </td>
         </tr>
         <tr>
	     <td width="40" class="z11" align="center" style="border: none;">
             <img src="images1/ask.gif" vspace=0 hspace=0 align=middle onClick="alert('Here will be help!');" style="cursor: pointer;">
           </td>
           <td width="60" class="z11" align="center" style="border: none;">
             <img src="images1/filter.gif" vspace=0 hspace=0 align=middle onClick="show_filter_block();" style="cursor: pointer;">
           </td>

           <td width="550">&nbsp;</td>

           <td width="180" height=40 class="z11" align="center">
           <font class="z11">{IN}</font>
             <select name="user_report_type" class="z11" style="width: 120px;">
               <option class="z11" value="win">{NEW_WINDOW}
               <option class="z11" value="exl">{EXCEL}
             </select>
           </td>
           <td width="150" height=40 class="z11" align="left"
             style="padding-left: 10px; margin-left: 10px;">
            <span onclick="form_report_user();" style="cursor: pointer;">
            <img src="images1/execute1_15.gif" vspace=0 hspace=0 align=middle>&nbsp;
            <font class="z11"><b>{EXECUTE}</b></font>
            </span>
          </td>
	   </tr>
       </table>
     </td>
   </tr>
   <tr>
     <td width="100%" class="z11" align="center">
       <table id=filter_add width=100% bgcolor=#FFFFFF cellpadding=0 cellspacing=0 border=0
       align=center style="display: none; border: none; border-left:none;
                            border-right: solid 1px #c0c0c0; border-bottom: solid 1px #c0c0c0; ">
         <tr>
           <td colspan=4 align=center bgcolor=#f5f5f5 height=25
                 style="border-bottom: solid 1px #c0c0c0; border-top:none;">
           <font class=z11><b>Дополнительный фильтр записей</b></font>
           </td>
         </tr>
         <tr>
           <td width=200 class=z11 align=left
                 style="border-right: solid 1px #c0c0c0; border-bottom: solid 1px #c0c0c0; margin-left: 25px; padding-left: 25px;">
           <font class=z11>Строка запроса: </font>
           </td>
           <td width=200 class=z11 align=left
                 style="border-right: solid 1px #c0c0c0; border-bottom: solid 1px #c0c0c0; margin-left: 25px; padding-left: 25px;">
           <font class=z11>Фильтр записей по: </font>
           </td>
           <td width=200 class=z11 align=left
                 style="border-left: none; border-right: solid 1px #c0c0c0; border-bottom: solid 1px #c0c0c0; margin-left: 25px; padding-left: 25px;">
           <font class=z11>Сетевой агент: </font>
           </td>
           <td width="380" class=z11 align="center">
           <font class=z11>Для отдельных {CONV_OR_NOT}: </font>
           <input type=checkbox name=choose_groups onClick="show_only_groups();">
           </td>
         </tr>
         <tr>
           <td width=200 height=30 class=z11 align=left valign="top"
                 style="border-right: solid 1px #c0c0c0; margin-left: 25px; padding-left: 25px; margin-top: 5px; padding-top: 5px;">
           <input type="text" class=z11 style="width: 150px;" name=report_filter_text size=15>
           </td>
           <td width=200 height=30 class=z11 align=left valign="top"
                 style="border-right: solid 1px #c0c0c0; margin-left: 25px; padding-left: 25px; margin-top: 5px; padding-top: 5px;">
           <select name=report_filter class=z11 style="width: 150px;">
              <!-- BEGIN rep_attr_row -->
              <option class=z11 value='{ATTR_ID}'>{ATTR_NAME}
              <!-- END rep_attr_row -->
           </select>
           </td>
           <td width=200 height=30 class=z11 align=left  valign="top"
                 style="border-left: none; border-right: solid 1px #c0c0c0; margin-left: 25px; padding-left: 25px; margin-top: 5px; padding-top: 5px;">
           <select name=report_agent style="width: 150px;" class=z11>
              <!-- BEGIN rep_ag_row -->
              <option class=z11 value='{AG_ID}'>{AG_ID}, {AG_NAME}
              <!-- END rep_ag_row -->
           </select>
           </td>
           <td width="380" class=z11 align="center" style="margin-top: 5px; padding-top: 5px;">
           <select name=only_groups[] multiple class=z11 id=only_groups size=4 style="width: 340px; " disabled>
              <!-- BEGIN rep_user_row -->
              <option class=z11 value='{USER_ID}'>{USER_ID}, {USER_NAME}
              <!-- END rep_user_row -->
           </select>
           <br />&nbsp;
           </td>
         </tr>
      </table>

     </td>
   </tr>
   <tr>
     <td width="100%" class="z11" align="center">
       <table width=100% bgcolor=#FFFFFF cellpadding=0 cellspacing=0 border=0
       align=center style="border: none; border-left: none;
                            border-right: solid 1px #c0c0c0; border-bottom: solid 1px #c0c0c0; ">
         <tr>
           <th width="10%" height="25" class="z11" align="center" bgcolor="#f5f5f5" style="border-bottom: solid 1px #c0c0c0;">&nbsp;

           </th>
           <td width="40%" height="25" class="z11" align="center" bgcolor="#f5f5f5" style="border-bottom: solid 1px #c0c0c0;">
             <font class="z11"><b>Название отчета</b></font>
           </td>
           <td width="50%" height="25" class="z11" align="center" bgcolor="#f5f5f5" style="border-bottom: solid 1px #c0c0c0;">
             <font class="z11"><b>Описание отчета</b></font>
           </td>
         </tr>
         <!-- BEGIN user_rep_list -->
         <tr>
           <td width="10%" height="30" class="z11" align="center">
             <input type="radio" name="user_report" value="{USER_REP_FILE}" class="z11">
           </td>
           <td width="40%" height="30" class="z11" align="left">
             &nbsp;&nbsp;<font class="z11">{USER_REP_NAME}</font>
           </td>
           <td width="50%" height="30" class="z11" align="left">
             &nbsp;&nbsp;<font class="z11">{USER_REP_DESC}</font>
           </td>
         </tr>
         <!-- END user_rep_list -->

       </table>
     </td>
   </tr>

</table>

<!-- END reports_list -->