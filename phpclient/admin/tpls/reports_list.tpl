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
</script>

<form action=config.php method=post name=reportsform target=\"_rep\">

<input type=hidden name=devision value=107>
<input type=hidden name=exp_rep2_on value=0>
<input type=hidden name=actuality value={ACTUALITY}>
<input type=hidden name=det_rep value=0>
<input type=hidden name=additional_filter value=0>

<table width=980 border=0 cellspacing=0 cellpadding=0 align=center bgcolor=White>

   <tr>
     <td width="100%" align="center">
       <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border: solid 1px #c0c0c0;">
        <tr>
          <th colspan=6 width="100%" height="25" class="z11" bgcolor="#f5f5f5" style="border: none; border-bottom: solid 1px #c0c0c0;">
           <font class="z11">{MONTH_REPORTS}</font>
          </th>
        </tr>
        
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
        
        <tr>
          <td width="350" height=40 class="z11" align="left" style="padding-left: 10px; margin-left: 10px; border-bottom: solid 1px #c0c0c0;">
            <img src="images1/ask.gif" vspace=0 hspace=0 align=middle
             onClick="alert('Here will be help!');" style="cursor: pointer;">
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
               <!-- <option class="z11" value="exl">{EXCEL} -->
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
        
        <tr>
          <td width="350" height=40 class="z11" align="left" style="padding-left: 10px; margin-left: 10px;">
            <img src="images1/ask.gif" vspace=0 hspace=0 align=middle
             onClick="alert('Here will be help!');"  style="cursor: pointer;">
            &nbsp;&nbsp;
            <font class="z11">{MF_4}</font>
          </td>
          <td width="40" height=40 class="z11" align="center">
            <font class="z11">{ZA}</font>
          </td>
          <td width="130" height=40 class="z11" align="center">
             <select name="year_4" class="z11" style="width: 120px;">
               {YEAR}
             </select>
          </td>
          <td width="130" height=40 class="z11" align="center">
             <select name="month_4" class="z11" style="width: 120px;">
               {MONTH}
             </select>
          </td>
          <td width="180" height=40 class="z11" align="center">
          <font class="z11">{IN}</font>
             <select name="type_4" class="z11" style="width: 120px;">
               <option class="z11" value="win">{NEW_WINDOW}
               <option class="z11" value="exl">{EXCEL}
             </select>
          </td>
          <td width="150" height=40 class="z11" align="left" 
             style="padding-left: 10px; margin-left: 10px;">
            <span onclick="form_report(4);" style="cursor: pointer;">
            <img src="images1/execute1_15.gif" vspace=0 hspace=0 align=middle>&nbsp;
            <font class="z11"><b>{EXECUTE}</b></font>
            </span>
          </td>
        </tr>
       </table>
     </td>
   </tr>

   <tr>
   
   </tr>
     <td width="100%" align="center">
     &nbsp;
     </td>
   <tr>
     <td width="100%" align="center">
       <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border: solid 1px #c0c0c0;">
	   <tr>
	     <th colspan=6 width="100%" height="25" class="z11" bgcolor="#f5f5f5" style="border: none; border-bottom: solid 1px #c0c0c0;">
           <font class="z11">{DETAIL_REPORTS}</font>
          </th>
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
       align=center style="display: none; border: none; border-left: solid 1px #c0c0c0;
                            border-right: solid 1px #c0c0c0; border-bottom: solid 1px #c0c0c0; ">
         <tr>
           <th colspan=4 align=center bgcolor=#f5f5f5 height=25 
                 style="border-bottom: solid 1px #c0c0c0; border-top:none;">
           <font class=z11>Дополнительный фильтр записей</font>
           </th>
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
       align=center style="border: none; border-left: solid 1px #c0c0c0;
                            border-right: solid 1px #c0c0c0; border-bottom: solid 1px #c0c0c0; ">
         <tr>
           <th width="10%" height="25" class="z11" align="center" bgcolor="#f5f5f5" style="border-bottom: solid 1px #c0c0c0;">
             &nbsp;
           </th>
           <th width="40%" height="25" class="z11" align="center" bgcolor="#f5f5f5" style="border-bottom: solid 1px #c0c0c0;">
             <font class="z11">Название отчета</font>
           </th>
           <th width="50%" height="25" class="z11" align="center" bgcolor="#f5f5f5" style="border-bottom: solid 1px #c0c0c0;">
             <font class="z11">Описание отчета</font>
           </th>
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