<!-- BEGIN show_reports_load -->
<form name=reports_load action="config.php" method="POST" enctype="multipart/form-data">
<input type="hidden" name="name="MAX_FILE_SIZE"" value="200000">
<input type="hidden" name="devision" value=338>
<input type="hidden" name="whatpressed" value="{WHATPRESSED}"> 

<table cellpadding="0" cellspacing="0" border="0" width="985">

<!-- BEGIN reports_list -->
<tr>
  <th colspan=3 align="center" height=25 class=z11 bgcolor="#e0e0e0" width=985 style="border: solid 1px #c0c0c0;">
    <font class="z11">{SHOW_REP_LIST}</font>
  </th>
</tr>
<tr>
  <td align="center" class=z11 width="325" height="50" style="border-left: solid 1px #c0c0c0; border-bottom: solid 1px #c0c0c0;">
   <input type="submit" name=create class=z11 style="width: 100px;" value="Создать" onCLick="document.forms[1].whatpressed.value=1">
  </td>
  <td align="center" class=z11 width="330" style="border-bottom: solid 1px #c0c0c0;">
   <input type="submit" name=edit_r class=z11 style="width: 100px;" value="Редактировать" disabled onCLick="document.forms[1].whatpressed.value=2">
  </td>
  <td align="center" class=z11 width="330" style="border-right: solid 1px #c0c0c0; border-bottom: solid 1px #c0c0c0;">
   <input type="submit" name=delete_r class=z11 style="width: 100px;" value="Удалить" disabled onCLick="document.forms[1].whatpressed.value=3">
  </td>
</tr>
<tr><td colspan="3"><table cellpadding="0" cellspacing="0" border="0" width=985>
 <tr>
 <th width="30" class="z11" height="20" bgcolor="#e0e0e0" style="border-left: solid 1px #c0c0c0; border-bottom: solid 1px #c0c0c0;">
  &nbsp;
 </th>
 <th width="40" class="z11" height="20" bgcolor="#e0e0e0" style="border-bottom: solid 1px #c0c0c0;">
  <font class=z11>№</font>
 </th>
 <th width="300" class="z11" height="20" bgcolor="#e0e0e0" style="border-bottom: solid 1px #c0c0c0;">
  <font class=z11>Название</font>
 </th>
 <th class="z11" height="20" bgcolor="#e0e0e0" style="border-right: solid 1px #c0c0c0; border-bottom: solid 1px #c0c0c0;">
  <font class=z11>Описание</font>
 </th>
</tr>

<!-- BEGIN reports_entry -->
 <tr>
   <td width="30" align="center" class="z11" height="20" style="border-left: solid 1px #c0c0c0; border-bottom: solid 1px #c0c0c0;">
      <input type=radio name=report2edit value={REPORT2EDIT} class=z11 onClick="document.forms[1].edit_r.disabled=false; document.forms[1].delete_r.disabled=false;">
   </td>
   <td width="40" align="center" class="z11" height="20" style="border-left: solid 1px #c0c0c0; border-bottom: solid 1px #c0c0c0;">
      <font class=z11>{REPORT_NUM}</font>
   </td>
   <td width="300" align="left" class="z11" height="20" style="border-left: solid 1px #c0c0c0; border-bottom: solid 1px #c0c0c0;">
      &nbsp;&nbsp;&nbsp;<font class=z11>{REPORT_NAME}</font>
   </td>
   <td class="z11" align="left" height="20" style="border-left: solid 1px #c0c0c0; border-right: solid 1px #c0c0c0; border-bottom: solid 1px #c0c0c0;">
      &nbsp;&nbsp;&nbsp;<font class=z11>{REPORT_DESC}</font>
   </td>
 </tr>
<!-- END reports_entry -->

</table></td></tr>
<!-- END reports_list -->

<!-- BEGIN create_edit_report -->
<script language="JavaScript">
function check_name_field()
{
	var curr_name = new String;
	curr_name = document.forms["reports_load"].report_name.value;
	if(curr_name != "" && curr_name != " ")
	{
		document.forms["reports_load"].report_main_file.disabled = false;
	}
}

</script>

<input type="hidden" name="loaded_rep" value={LOADED_REP}>

<tr>
  <th bgcolor="#e0e0e0" colspan=3 width=985 height="25" class=z11 style="border: solid 1px #c0c0c0;">
   <font class="z11">{SHOW_REP_CREATE}</font>
  </th>
</tr>
<tr>
  <td align="left" class=z11 style="border: solid 1px #c0c0c0; border-top: none;" height=30 width=300>
   <font class=z11>&nbsp;&nbsp;Название отчета:</font> 
  </td>
  <td align="left" class=z11 
     style="border: solid 1px #c0c0c0; border-left: none; border-top: none;" height=30 width=300>
   &nbsp;&nbsp;
   <input type="text" name="report_name" class="z11" size="45" value="{REPORT_NAME}" 
     onchange="check_name_field()"> 
  </td>
  <td align="left" class=z11 
     style="border: solid 1px #c0c0c0; border-left: none; border-top: none;" height=30 width="385">
    &nbsp;&nbsp;&nbsp;&nbsp;
  </td>
</tr>
<tr>
  <td align="left" class=z11 style="border: solid 1px #c0c0c0; border-top: none;" height=70 width=300>
   <font class=z11>&nbsp;&nbsp;Описание отчета:</font> 
  </td>
  <td align="left" class=z11 
     style="border: solid 1px #c0c0c0; border-left: none; border-top: none;" height=30 width=300>
   &nbsp;&nbsp;
   <textarea class="z11" name="report_desc" cols="37" rows="2">{REPORT_DESC}</textarea>
  </td>
  <td align="left" class=z11 
     style="border: solid 1px #c0c0c0; border-left: none; border-top: none;" height=30 width="385">
    &nbsp;&nbsp;&nbsp;&nbsp;
  </td>
</tr>
<tr>
  <td align="left" class=z11 style="border: solid 1px #c0c0c0; border-top: none;" height=30 width=300>
   <font class=z11>&nbsp;&nbsp;Основной файл отчета:</font> 
  </td>
  <td align="left" class=z11 
     style="border: solid 1px #c0c0c0; border-left: none; border-top: none;" height=30 width=300>
   &nbsp;&nbsp;
   <input type="text" name="report_main_file" class="z11" size="45" readonly 
     value="{REPORT_MAIN_FILE}"> 
  </td>
  <td align="left" class=z11 
     style="border: solid 1px #c0c0c0; border-left: none; border-top: none;" height=30>
    &nbsp;&nbsp;
    <input type="file" name=m_file_name class="z11" size="35" style="height: 22px;">
  </td>
</tr>
<tr>
  <td align="left" class=z11 style="border: solid 1px #c0c0c0; border-top: none;" height=70 width=300>
   <font class=z11>&nbsp;&nbsp;Дополнительные файлы отчета:</font> 
  </td>
  <td align="left" class=z11 
     style="border: solid 1px #c0c0c0; border-left: none; border-top: none;" height=70 width=300>
   &nbsp;&nbsp;
   <select name=report_add_files[] class="z11" size="4" 
     style="width: 280px;" multiple onchange="document.forms[1].del_add_file.disabled=false;"> 
    <!-- BEGIN add_file_opt -->
    <option class=z11 value="{REPORT_ADD_FILE}">{REPORT_ADD_FILE}
    <!-- END add_file_opt -->
   </select>
  </td>
  <td align="center" class=z11 
     style="border: solid 1px #c0c0c0; border-left: none; border-top: none;" height=70>
    <input type="button" class="z11" name=load_add_file style="width: 100px;" value="Загрузить" 
     onclick="document.getElementById('load_a_file').style.display='block';">
    &nbsp;&nbsp;&nbsp;&nbsp;
    <input type="submit" class="z11" name=del_add_file style="width: 100px;" value="Удалить" disabled>
  </td>
</tr>

<tr>
<td colspan="3">
<table cellpadding="0" cellspacing="0" border="0" width="985">
<tr id=load_a_file style="display:none;">
  <td align="left" class=z11 style="border: solid 1px #c0c0c0; border-top: none;" height=30 width=298>
   <font class=z11>&nbsp;&nbsp;Дополнительный файл 1:</font> 
  </td>
  <td align="left" class=z11 
     style="border: solid 1px #c0c0c0; border-left: none; border-top: none;" width=300 height=30>
    &nbsp;&nbsp;
    <input type="file" name=a_file_name[0] class="z11" size="34" style="height: 22px;">
  </td>
  <td align="left" class=z11 
     style="border: solid 1px #c0c0c0; border-left: none; border-top: none;" width=385 height=30>
    &nbsp;&nbsp;
    <input type="button" class="z11" style="width:100px;" value="Еще файл" 
      onClick="document.getElementById('af2').style.display='block';">
  </td>
</tr>

<tr id=af2 style="display: none;">
  <td align="left" class=z11 style="border: solid 1px #c0c0c0; border-top: none;" height=30 width=298>
   <font class=z11>&nbsp;&nbsp;Дополнительный файл 2:</font> 
  </td>
  <td align="left" class=z11 
     style="border: solid 1px #c0c0c0; border-left: none; border-top: none;" width=300 height=30>
    &nbsp;&nbsp;
    <input type="file" name=a_file_name[1] class="z11" size="34" style="height: 22px;">
  </td>
  <td align="left" class=z11 
     style="border: solid 1px #c0c0c0; border-left: none; border-top: none;" width=385 height=30>
    &nbsp;&nbsp;
    <input type="button" class="z11" style="width:100px;" value="Еще файл" onClick="document.getElementById('af3').style.display='block';">
  </td>
</tr>

<tr id=af3 style="display: none;">
  <td align="left" class=z11 style="border: solid 1px #c0c0c0; border-top: none;" height=30 width=298>
   <font class=z11>&nbsp;&nbsp;Дополнительный файл 3:</font> 
  </td>
  <td align="left" class=z11 
     style="border: solid 1px #c0c0c0; border-left: none; border-top: none;" width=300 height=30>
    &nbsp;&nbsp;
    <input type="file" name=a_file_name[2] class="z11" size="34" style="height: 22px;">
  </td>
  <td align="left" class=z11 
     style="border: solid 1px #c0c0c0; border-left: none; border-top: none;" width=385 height=30>
    &nbsp;&nbsp;
    <input type="button" class="z11" style="width:100px;" value="Еще файл" onClick="document.getElementById('af4').style.display='block';">
  </td>
</tr>

<tr id=af4 style="display: none;">
  <td align="left" class=z11 style="border: solid 1px #c0c0c0; border-top: none;" height=30 width=298>
   <font class=z11>&nbsp;&nbsp;Дополнительный файл 4:</font> 
  </td>
  <td align="left" class=z11 
     style="border: solid 1px #c0c0c0; border-left: none; border-top: none;" width=300 height=30>
    &nbsp;&nbsp;
    <input type="file" name=a_file_name[3] class="z11" size="34" style="height: 22px;">
  </td>
  <td align="left" class=z11 
     style="border: solid 1px #c0c0c0; border-left: none; border-top: none;" width=385 height=30>
    &nbsp;&nbsp;
    <input type="button" class="z11" style="width:100px;" value="Еще файл" onClick="document.getElementById('af5').style.display='block';">
  </td>
</tr>

<tr id=af5 style="display: none;">
  <td align="left" class=z11 style="border: solid 1px #c0c0c0; border-top: none;" height=30 width=298>
   <font class=z11>&nbsp;&nbsp;Дополнительный файл 5:</font> 
  </td>
  <td align="left" class=z11 
     style="border: solid 1px #c0c0c0; border-left: none; border-top: none;" width=300 height=30>
    &nbsp;&nbsp;
    <input type="file" name=a_file_name[4] class="z11" size="34" style="height: 22px;">
  </td>
  <td align="left" class=z11 
     style="border: solid 1px #c0c0c0; border-left: none; border-top: none;" width=385 height=30>
    &nbsp;&nbsp;
    <input type="button" class="z11" style="width:100px;" value="Еще файл" onClick="document.getElementById('af6').style.display='block';">
  </td>
</tr>

<tr id=af6 style="display: none;">
  <td align="left" class=z11 style="border: solid 1px #c0c0c0; border-top: none;" height=30 width=298>
   <font class=z11>&nbsp;&nbsp;Дополнительный файл 6:</font> 
  </td>
  <td align="left" class=z11 
     style="border: solid 1px #c0c0c0; border-left: none; border-top: none;" width=300 height=30>
    &nbsp;&nbsp;
    <input type="file" name=a_file_name[5] class="z11" size="34" style="height: 22px;">
  </td>
  <td align="left" class=z11 
     style="border: solid 1px #c0c0c0; border-left: none; border-top: none;" width=385 height=30>
    &nbsp;&nbsp;
    <input type="button" class="z11" style="width:100px;" value="Еще файл" onClick="document.getElementById('af7').style.display='block';">
  </td>
</tr>

<tr id=af7 style="display: none;">
  <td align="left" class=z11 style="border: solid 1px #c0c0c0; border-top: none;" height=30 width=298>
   <font class=z11>&nbsp;&nbsp;Дополнительный файл 7:</font> 
  </td>
  <td align="left" class=z11 
     style="border: solid 1px #c0c0c0; border-left: none; border-top: none;" width=300 height=30>
    &nbsp;&nbsp;
    <input type="file" name=a_file_name[6] class="z11" size="34" style="height: 22px;">
  </td>
  <td align="left" class=z11 
     style="border: solid 1px #c0c0c0; border-left: none; border-top: none;" width=385 height=30>
    &nbsp;&nbsp;
    <input type="button" class="z11" style="width:100px;" value="Еще файл" onClick="document.getElementById('af8').style.display='block';">
  </td>
</tr>

<tr id=af8 style="display: none;">
  <td align="left" class=z11 style="border: solid 1px #c0c0c0; border-top: none;" height=30 width=298>
   <font class=z11>&nbsp;&nbsp;Дополнительный файл 8:</font> 
  </td>
  <td align="left" class=z11 
     style="border: solid 1px #c0c0c0; border-left: none; border-top: none;" width=300 height=30>
    &nbsp;&nbsp;
    <input type="file" name=a_file_name[7] class="z11" size="34" style="height: 22px;">
  </td>
  <td align="left" class=z11 
     style="border: solid 1px #c0c0c0; border-left: none; border-top: none;" width=385 height=30>
    &nbsp;&nbsp;
  </td>
</tr>
</table>
</td>
</tr>


<tr>
  <td colspan="3" align="center" class=z11 style="border: solid 1px #c0c0c0; border-top: none;" height=50>
  <input type="submit" class="z11" name=save_user_report style="width: 100px;" value="Сохранить">
    &nbsp;&nbsp;&nbsp;&nbsp;
  <input type="submit" class="z11" name=cansel_user_report style="width: 100px;" value="Отмена">
  </td>
</tr>
<!-- END create_edit_report -->



</table>
</form>
<!-- END show_reports_load -->
