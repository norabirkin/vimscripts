<!-- BEGIN once_history -->
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=windows-1251">
<title>LANBilling v.1.8</title>
<LINK REL="StyleSheet" HREF="main.css" type="text/css">
</head>

<body>
  <table cellpadding="0" cellspacing="0" border="0" align="center" width="800">
    <tr>
     <th colspan="5" width="800" height="30" class="z11" style="border: solid 1px #c0c0c0;">
       <font class=z11>История списания средств по периодическим услугам учетной записи {VG_LOGIN}</font>
     </th>
    </tr>
    <tr>
        <th bgcolor="#e0e0e0" width="10%" height="25" class="z11" align="center" style="border-bottom: solid 1px #c0c0c0; border-right: solid 1px #c0c0c0; border-left: solid 1px #c0c0c0;">
        <font class="z11">Код</font>
        </th>
        <th bgcolor="#e0e0e0" width="40%" height="25" class="z11" align="center" style="border-bottom: solid 1px #c0c0c0; border-right: solid 1px #c0c0c0;">
        <font class="z11">Описание</font>
        </th>
        <th bgcolor="#e0e0e0" width="25%" height="25" class="z11" align="center" style="border-bottom: solid 1px #c0c0c0; border-right: solid 1px #c0c0c0;">
        <font class="z11">Каталог</font>
        </th>
        <th bgcolor="#e0e0e0" width="10%" height="25" class="z11" align="center" style="border-bottom: solid 1px #c0c0c0; border-right: solid 1px #c0c0c0;">
        <font class="z11">Сумма</font>
        </th>
        <th bgcolor="#e0e0e0" width="14%" height="25" class="z11" align="center" style="border-bottom: solid 1px #c0c0c0; border-right: solid 1px #c0c0c0;">
        <font class="z11">Дата</font>
        </th>
     </tr>
     <!-- BEGIN history_row -->
     <tr>
        <td width="10%" height="25" class="z11" align="center" style="border-bottom: solid 1px #c0c0c0; border-right: solid 1px #c0c0c0; border-left: solid 1px #c0c0c0;">
        <font class="z11">{KOD}</font>
        </td>
        <td width="40%" height="25 class="z11" align="center" style="border-bottom: solid 1px #c0c0c0; border-right: solid 1px #c0c0c0;">
        <font class="z11">&nbsp;{DESCR}</font>
        </td>
        <td width="25%" height="25 class="z11" align="center" style="border-bottom: solid 1px #c0c0c0; border-right: solid 1px #c0c0c0;">
        <font class="z11">&nbsp;{CAT_NAME}</font>
        </td>
        <td width="10%" height="25 class="z11" align="center" style="border-bottom: solid 1px #c0c0c0; border-right: solid 1px #c0c0c0;">
        <font class="z11">{PRICE}</font>
        </td>
        <td width="14%" height="25 class="z11" align="center" style="border-bottom: solid 1px #c0c0c0; border-right: solid 1px #c0c0c0;">
        <font class="z11">{DATE}</font>
        </td>
     </tr>
     <!-- END history_row -->
  </table>
  <br />
  <table cellpadding="0" cellspacing="0" border="0" align="center" width="800">
    <tr>
     <th width="80%" align="right" height="25" class="z11" style="border: solid 1px #c0c0c0;">
       <font class="z11">Общее кол-во услуг:&nbsp;&nbsp;</font>
     </th>
     <th  width="20%" align="center" height="25" class="z11" style="border: solid 1px #c0c0c0; border-left: none;">
       <font class="z11">&nbsp;&nbsp;{COMM_SERV}</font>
     </th>
    </tr>
    <tr>
     <th width="80%" align="right" height="25" class="z11" style="border: solid 1px #c0c0c0; border-top: none;">
       <font class="z11">Общая сумма:&nbsp;&nbsp;</font>
     </th>
     <th  width="19%" align="center" height="25" class="z11" style="border: solid 1px #c0c0c0; border-top: none; border-left: none;">
       <font class="z11">&nbsp;&nbsp;{COMM_SUMM}</font>
     </th>
    </tr>
  </table>
</body>
</html>
<!-- END once_history -->