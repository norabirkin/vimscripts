<!-- BEGIN report2_tpl -->
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
   <html>
   <head>
   <title>LANBilling v.1.8</title>
   <LINK REL="StyleSheet" HREF="../main.css" type="text/css">
   </head>
<body>
<table cellpadding="0" cellspacing="0" border="0" align="center" class="z11" width="100%">
   <tr>
   	<th colspan="7" height="40" width="100%" align="center" class="z11">
   	   <font class="z11">{REPORT2_TITLE}</font>
   	</th>
   </tr>
   <tr>
      <th width="12%" height="25" class="z11" bgcolor="#f5f5f5" style="border: solid 1px #c0c0c0;">
         <font class="z11">Пользователь</font>
      </th>
      <th width="12%" height="25" class="z11" bgcolor="#f5f5f5" style="border: solid 1px #c0c0c0; border-left: none;">
         <font class="z11">Уч. запись</font>
      </th>
      <th width="15%" height="25" class="z11" bgcolor="#f5f5f5" style="border: solid 1px #c0c0c0; border-left: none;">
         <font class="z11">Описание уч. зап.</font>
      </th>
      <th width="21%" height="25" class="z11" bgcolor="#f5f5f5" style="border: solid 1px #c0c0c0; border-left: none;">
         <font class="z11">Тариф</font>
      </th>
      <th width="20%" height="25" class="z11" bgcolor="#f5f5f5" style="border: solid 1px #c0c0c0; border-left: none;">
         <font class="z11">Категория</font>
      </th>
      <th width="10%" height="25" class="z11" bgcolor="#f5f5f5" style="border: solid 1px #c0c0c0; border-left: none;">
         <font class="z11">Скидка</font>
      </th>
      <th width="10%" height="25" class="z11" bgcolor="#f5f5f5" style="border: solid 1px #c0c0c0; border-left: none;">
         <font class="z11">Сумма</font>
      </th>
   </tr>
   <!-- BEGIN report2_row -->
   <tr>
      <td width="12%" height="25" align="center" class="z11" style="border: solid 1px #c0c0c0; border-top: none;">
         <font class="z11">{UID}&nbsp;</font>
      </td>
      <td width="12%" height="25" align="center" class="z11" style="border: solid 1px #c0c0c0; border-left: none; border-top: none;">
         <font class="z11">{VG}&nbsp;</font>
      </td>
      <td width="15%" height="25" align="center" class="z11" style="border: solid 1px #c0c0c0; border-left: none; border-top: none;">
         <font class="z11">{VG_DESC}&nbsp;</font>
      </td>
      <td width="21%" height="25" align="center" class="z11" style="border: solid 1px #c0c0c0; border-left: none; border-top: none;">
         <font class="z11">{TAR}&nbsp;</font>
      </td>
      <td width="20%" height="25" align="center" class="z11" style="border: solid 1px #c0c0c0; border-left: none; border-top: none;">
         <font class="z11">{CAT}&nbsp;</font>
      </td>
      <td width="10%" height="25" align="center" class="z11" style="border: solid 1px #c0c0c0; border-left: none; border-top: none;">
         <font class="z11">{BONUS}&nbsp;</font>
      </td>
      <td width="10%" height="25" align="center" class="z11" style="border: solid 1px #c0c0c0; border-left: none; border-top: none;">
         <font class="z11">{SUMM}&nbsp;</font>
      </td>
   </tr>
   <!-- END report2_row -->
</table>
</body>
</html>
<!-- END report2_tpl -->