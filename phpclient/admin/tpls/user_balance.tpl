 <!-- BEGIN vg_balance -->
<table width="100%" cellpadding="0" cellspacing="0" border="0" align="center">
  <tr>
 <td colspan=3>&nbsp;</td>
 </tr>
 <tr>
  <th colspan=3 bgcolor="#e0e0e0" style="border: solid 1px #c0c0c0; border-left: none; border-right: none;" class=z11>
  <font class=z11>Операции с балансом</font>
  </th>
 </tr>
 <tr> 
  <th style="border: solid 1px #c0c0c0; border-top: none; border-left: none;" class=z11 width=150>
   <font class=z11>Баланс ({NAT_CUR})</font>
  </th>
  <th colspan=2 width=600 style="border: solid 1px #c0c0c0; border-top: none; border-left: none; border-right: none;" class=z11>
   <font class=z11>Платеж ({NAT_CUR})</font>
  </th>
 </tr>

 <input type="hidden" name=vg_old_balance value="{VG_OLD_BALANCE}">
 <input type="hidden" name=vg_curr_balance value="{VG_CURR_BALANCE}">
  <tr>
  <td align="center" style="border: solid 1px #c0c0c0; border-top: none; border-left: none" class=z11>
   <font size="+3" color="Red">{VG_CURR_BALANCE_V}</font>
  </td>
  <td colspan=2 height=30 style="border: solid 1px #c0c0c0; border-top: none; border-left: none;" class=z11>
   <table cellpadding="0" cellspacing="0" border="0" width="100%">
    <tr>
     <td width=60% colspan=2 class=z11>
      &nbsp;
     </td>
     <td class=z11 width=40% align=center>
      <font class=z11>История платежей (<a href="JavaScript: active_ord1('{VG_HISTORY_HREF}');" class=z11>подробнее...</a>)</font>
     </td>
    </tr>
    <tr>
     <td width=60% colspan=2 class=z11>
      &nbsp;&nbsp;<input type="text" size=15 name="vg_add_balance" class=z11>&nbsp;({NAT_CUR})&nbsp;&nbsp;
      <input type="submit" name=vg_add_balance_b value="Внести" {IS_BALAN_ADD_ACT} class=z11 style="width:80px;">&nbsp;&nbsp;
      <input type="submit" name=vg_act_balance_b value="Активировать" class=z11 style="width:80px;" {VG_ACT_BALANCE_D}>     
     </td>
     <td rowspan=4 class=z11 width=240 align=right valign="top">
      <table cellpadding="0" cellspacing="0" border="1" width=240 height=80 align="center">
        <tr>
         <th class=z11 width=70 style="border-right: none;">
           <font class=z11>Номер</font>
         </th>
         <th class="z11" width=85 style="border-right: none;">
          <font class=z11>Дата</font>
         </th>
         <th class="z11" width=85>
          <font class=z11>Сумма</font>
         </th>
        </tr>
        <!-- BEGIN vg_bill_history -->
        <tr>
         <td class=z11 width=70 style="border-top: none; border-right: none;" align="center">
           <font class=z11>{VG_BILL_NUM}</font>
         </td>
         <td class="z11" width=90 style="border-top: none; border-right: none;" align="center">
          <font class=z11>{VG_BILL_DATE}</font>
         </td>
         <td class="z11" width=90 style="border-top: none;" align="center">
          <font class=z11>{VG_BILL_SUMM}</font>
         </td>
        </tr>        
        <!-- END vg_bill_history -->
      </table>
     </td>     
    </tr>
    <tr><td colspan=2 align="center">&nbsp;{CHECK_BALAN_MESS}</td></tr>
    <tr>
     <td height=30 class=z11>
      <font class=z11>&nbsp;&nbsp;Номер платежного документа&nbsp;&nbsp;</font>
     </td>   
     <td height=30 class=z11>
      <input type="text" name="vg_plat_num" class=z11 size=15 value="{VG_PLAT_NUM}">
     </td>    
    </tr>
    <tr>
     <td height=30 class=z11>
      <font class=z11>&nbsp;&nbsp;Комментарий:</font>
     </td> 
     <td>
      <input type="text" name="vg_plat_comment" class=z11 size="25" value="{VG_PLAT_COMMENT}">
     </td>    
    </tr>    
   </table>
   </td></tr>
</table>
 <!-- END vg_balance -->