<!-- BEGIN ivox_once -->
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=windows-1251">
<title>LANBilling v.1.8</title>
<LINK REL="StyleSheet" HREF="main.css" type="text/css">
</head>

<body>
<form name="ivox_once_form" method="POST" action="ivox_once_serv_act.php?vg_id={VG_ID}">
<input type="hidden" name="curr_page" value="{CURR_PAGE}">
<!-- Форма поиска кода -->
{ADD_MESSAGE}
<table cellpadding="0" cellspacing="0" border="0" align="center" width="800">
 <tr>
  <th colspan="3" bgcolor="#e0e0e0" height="25" style="border: solid 1px #c0c0c0; border-right: none;">
    <font class=z11>Выбор и назначение услуги</font>
  </th>
  <td bgcolor="#e0e0e0" align="right" height="25" style="border: solid 1px #c0c0c0; border-left: none;">
    <font class=z11>Показывать записей на странице &nbsp;&nbsp;</font>
    <select class=z11 name="rows_on_page" style="width: 60px;" onchange="document.forms['ivox_once_form'].submit();">
      <option class="z11" value=25 {ROWS_25}>25</option>
      <option class="z11" value=50 {ROWS_50}>50</option>
      <option class="z11" value=100 {ROWS_100}>100</option>
      <option class="z11" value=100000 {ROWS_100000}>Все</option>
    </select>&nbsp;&nbsp;
  </td>
 </tr>
 <tr>
  <td width="200" height="40" align="center" class="z11" style="border-left: solid 1px #c0c0c0;border-bottom: solid 1px #c0c0c0;">
   <input type="text" name="search_serv_param" value="{SEARCH_SERV_PARAM}" class="z11" style="width: 170px">
  </td>
  <td  width="200" height="40" align="center" class="z11" style="border-bottom: solid 1px #c0c0c0;">
   <select name="search_serv_sel" class="z11" style="width: 170px;">
    <option class="z11" value=1 {SEARCH_1}>Код услуги</option>
    <option class="z11" value=2 {SEARCH_2}>Описание</option>
   </select>
  </td>
  <td width="50" height="40" align="center" class="z11" style="border-bottom: solid 1px #c0c0c0;">
   <img src="images1/zoom.gif" vspace="0" hspace="0" width="25" height="25" 
    onclick="document.forms['ivox_once_form'].search_serv.click();"
    style="cursor: pointer;">
  </td>
  <td width="350" height="40" align="right" class="z11" style="border-bottom: solid 1px #c0c0c0;border-right: solid 1px #c0c0c0;">
    <input type="submit" name="search_serv" value="__" style="visibility: hidden;">
    <input type="submit" class="z11" style="width: 150px;" value="Назначить выбранные" name="ivox_serv_act">
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  </td>
 </tr>
</table>
<!-- //////////////////  -->
<br />
<table cellpadding="0" cellspacing="0" border="0" align="center" width="800">
 <tr>
  <th colspan="4" height="25" bgcolor="#e0e0e0" width="800" style="border: solid 1px #c0c0c0;">
    <font class="z11">Список услуг, доступных для назначения (каталог "{CAT_NAME}")</font>
  </th>
 </tr>
 <tr>
  <td colspan="4" height="25" align="left" width="800" style="border: solid 1px #c0c0c0; border-top: none;">
    &nbsp;&nbsp;&nbsp;
    <font class="z11">Страницы:</font>
    &nbsp;&nbsp;
    <!-- BEGIN page_num -->
    <a href="JavaScript: document.forms['ivox_once_form'].curr_page.value={PAGE_NUM}; document.forms['ivox_once_form'].submit();">
    <font class="z11" color="{PAGE_COLOR}">{PAGE_NUM}</font>
    </a>
    <!-- END page_num -->
  </td>
 </tr>
 <tr>
   <th width="50" height="25" bgcolor="#e0e0e0" class="z11" style="border-bottom: solid 1px #c0c0c0;border-left: solid 1px #c0c0c0;">
     <font class="z11">&nbsp;</font>
   </th>
   <th width="150" height="25" bgcolor="#e0e0e0" class="z11" style="border-bottom: solid 1px #c0c0c0;">
     <font class="z11">Код услуги</font>
   </th>
   <th width="450" height="25" bgcolor="#e0e0e0" class="z11" style="border-bottom: solid 1px #c0c0c0;">
     <font class="z11">Описание</font>
   </th>
   <th width="150" height="25" bgcolor="#e0e0e0" class="z11" style="border-bottom: solid 1px #c0c0c0;border-right: solid 1px #c0c0c0;">
     <font class="z11">Стоимость</font>
   </th>
 </tr>
 
 <!-- BEGIN service_row -->
 <tr>
   <td width="50" height="25" class="z11" align="center" style="border-bottom: solid 1px #c0c0c0;border-left: solid 1px #c0c0c0;">
     <input type="checkbox" name=serv_checked[] value={SERV_ID} {IS_CHECKED}>
   </td>
   <td width="150" height="25" class="z11" align="center" style="border-bottom: solid 1px #c0c0c0;">
     <font class="z11">&nbsp;{NAME}</font>
   </td>
   <td width="450" height="25" class="z11" align="center" style="border-bottom: solid 1px #c0c0c0;">
     <font class="z11">&nbsp;{DESCR}</font>
   </td>
   <td width="150" height="25" class="z11" align="center" style="border-bottom: solid 1px #c0c0c0;border-right: solid 1px #c0c0c0;">
     <font class="z11">&nbsp;{PRICE}</font>
   </td>
 </tr>
 <!-- END service_row -->
 <!-- BEGIN no_serv_rows -->
 <tr>
  <th colspan="4" height="50" width="800" style="border: solid 1px #c0c0c0; border-top: none;">
    <font class="z11">{TEMP}У данного каталога нет доступных сервисов для назначения <br />
                      либо поиск не дал результатов.</font>
  </th>
 </tr>
 <!-- END no_serv_rows -->
</table>

</form>
</body>
</html>

<!-- END ivox_once -->