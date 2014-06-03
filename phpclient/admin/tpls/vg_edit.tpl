<!--
{VG_ACTION_TITLE} - Заголовок, в зависимости от того редактируем или создаем уч запись будет разным
{VG_LOGIN}        - Логин уч записи 
{VG_DESCR}        - Описание уч записи
{VG_PASS}         - Пароль уч записи
{VG_AG_VAL}       - id агента
{VG_AG_SEL}       - selected либо ""
{VG_AG_NAME}      - Название агента
{VG_USER_VAL}     - uid пользователя
{VG_USER_SEL}     - selected либо ""
{VG_USER_NAME}    - Название пользователя
{VG_USER_SEARCH}  - Значение в поле поиска по пользователю
{VG_PLAT_COMMENT} - Описание платежа
-->

<!-- BEGIN vg_edit_tab -->
<script language="JavaScript">
var is_mac_shown=0;

function show_mac_addr()
{
	if(is_mac_shown == 0)
	{
		is_mac_shown = 1;
		document.getElementById("mac_addr_div").style.display = "block";	
	}
	else
	{
		is_mac_shown = 0;
		hide_mac_addr();
	}
};

function hide_mac_addr()
{
	document.getElementById("mac_addr_div").style.display = "none";	
};

function select_user_win()
{
	w1=window.open ("select_user.php",'_sel_user','width=670,height=450,resizable=yes,status=no,menubar=no,scrollbars=yes');
      w1.focus();
};
</script>


 
<script>
function active_ord1 ( url )
{
    w1=window.open (url,'_cat','width=550,height=350,resizable=yes,status=no,menubar=no,scrollbars=yes,screenX=260,screenY=100');
   w1.focus();
};

function active_ord2 ( url )
{
    w1=window.open (url,'_cat','width=880,height=500,resizable=yes,status=no,menubar=no,scrollbars=yes,screenX=100,screenY=100');
   w1.focus();
};
</script>

<input type="hidden" name="whatmode" value="{WHATMODE}"> 
<input type="hidden" name="vg_id" value="{VG_TO_EDIT}"> 
<INPUT type="hidden" name="first_on_page" value="{F_ON_P}">
<table align="center" cellpadding="0" cellspacing="0" border="0" width="980">
<!-- Заголовок -->
 <tr>
  <th colspan=3 height=30 bgcolor="#e0e0e0" style="border: solid 1px #c0c0c0;" class=z11>
  <!-- BEGIN vg_title -->
   <font class=z11>{VG_ACTION_TITLE}</font>
  <!-- END vg_title -->
  </th>
 </tr>
 
 <tr>
  <th colspan=3 $height=10 class=z11>&nbsp;</th>
 </tr>
 <tr>
  <th colspan=3 bgcolor="#e0e0e0" style="border: solid 1px #c0c0c0;" class=z11>
  <font class=z11>Основные параметры</font>
  </th>
 </tr>
  
<!-- Данные об уч записи (пароль, логин, описание) -->
 <tr>
  <th width=25% class=z11 style="border: solid 1px #c0c0c0; border-top: none;">
   <font class=z11>Логин</font>
  </th>
  <th width=25% class=z11 style="border: solid 1px #c0c0c0; border-top: none; border-left: none;">
   <font class=z11>Пароль</font>
  </th>
  <th width=50% class=z11 style="border: solid 1px #c0c0c0; border-top: none; border-left: none;">
   <font class=z11>Описание</font>
  </th>
 </tr>
 <tr>
 <!-- BEGIN vg_attrs -->
  <td width=25% align="center" height=30 class=z11 style="border: solid 1px #c0c0c0; border-top: none;">
   <input type="text" class=z11 name=vg_login size="31" value='{VG_LOGIN}'>
  </td>
  <td width=25% align="center" height=30 class=z11 style="border: solid 1px #c0c0c0; border-top: none; border-left: none;">
   <input type="{FIELD_TYPE}" class=z11 name=vg_pass size="31" value='{VG_PASS}'>
  </td>
  <td width=50% align="center" height=30 class=z11 style="border: solid 1px #c0c0c0; border-top: none; border-left: none;">
   <input type="text" class=z11 name=vg_desc size="65" value='{VG_DESCR}'>
  </td>
 <!-- END vg_attrs -->
 </tr>

<!-- Выбор агента и пользователя которому принадлежит данная уч запись -->
 <tr>
  <th width=25% class=z11 style="border: solid 1px #c0c0c0; border-top: none;">
   <font class=z11>Сетевой агент</font>
  </th>
  <th width=75% class=z11 style="border: solid 1px #c0c0c0; border-top: none; border-left: none;" colspan=2>
   <font class=z11>Принадлежит пользователю:</font>
   <!-- BEGIN go_to_user -->
   <input type="hidden" name="edit_user" value="1">
   <input type="hidden" name="uid" value="{CURR_UID}">
   <!-- END go_to_user -->
  </th>
 </tr>
 <tr>
  <td width=25% align="center" class=z11 height="30" style="border: solid 1px #c0c0c0; border-top: none;">
  <!-- BEGIN vg_ag_list -->
   <select name=vg_agent style="width: 200px;" class=z11 onChange="document.forms[1].submit();">
   <!-- BEGIN vg_ag_opt -->
    <option class=z11 value='{VG_AG_VAL}' {VG_AG_SEL}>{VG_AG_NAME}
   <!-- END vg_ag_opt -->
   </select>
  <!-- END vg_ag_list -->
  </td>
  <!-- BEGIN vg_user_list -->
  <td  height="30" style="border: solid 1px #c0c0c0; border-top: none; border-left: none; border-right: none;" align="center">
   <span class="z11" style="cursor: pointer;" onclick="select_user_win();" title="Перейти к редактированию пользователя">
   <font class="z11">
   <b>&nbsp;Изменить пользователя&nbsp;</b>
   </font>
   </span>
  </td>
  <td align="center" class=z11 height="30" style="border: solid 1px #c0c0c0; border-top: none; border-left: none;">
  
   <input type="hidden" name="vg_user" value="{CURR_UID}">
   <input type="text" class=z11 readonly value="{VG_USER_NAME}" 
   name='vg_user_fio' style="border: none; width: 250px; cursor: pointer; text-align: center;" onclick="document.forms[1].devision.value=22;
   document.forms[1].submit();"  title="Перейти к редактированию пользователя">   
  
  </td>
  <!-- END vg_user_list -->
 </tr>

 <!-- BEGIN vg_balance -->
  <tr>
 <td colspan=3>&nbsp;</td>
 </tr>
 <tr>
  <th colspan=3 bgcolor="#e0e0e0" style="border: solid 1px #c0c0c0;" class=z11>
  <font class=z11>Операции с балансом</font>
  </th>
 </tr>
 <tr> 
  <th style="border: solid 1px #c0c0c0; border-top: none;" class=z11>
   <font class=z11>Баланс ({NAT_CUR})</font>
  </th>
  <th colspan=2 style="border: solid 1px #c0c0c0; border-top: none; border-left: none;" class=z11>
   <font class=z11>Платеж ({NAT_CUR})</font>
  </th>
 </tr>

 <input type="hidden" name=vg_old_balance value="{VG_OLD_BALANCE}">
 <input type="hidden" name=vg_curr_balance value="{VG_CURR_BALANCE}">
  <tr>
  <td align="center" style="border: solid 1px #c0c0c0; border-top: none;" class=z11>
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
      &nbsp;&nbsp;<input type="text" size=20 name="vg_add_balance" class=z11>&nbsp;({NAT_CUR})&nbsp;&nbsp;
      <input type="submit" name=vg_add_balance_b value="Внести" {IS_BALAN_ADD_ACT} class=z11 style="width:100px;">&nbsp;&nbsp;&nbsp;
      <input type="submit" name=vg_act_balance_b value="Активировать" class=z11 style="width:100px;" {VG_ACT_BALANCE_D}>     
     </td>
     <td rowspan=4 class=z11 width=40% align=right valign="top">
      <table cellpadding="0" cellspacing="0" border="1" width=250 height=80 align="center">
        <tr>
         <th class=z11 width=70 style="border-right: none;">
           <font class=z11>Номер</font>
         </th>
         <th class="z11" width=90 style="border-right: none;">
          <font class=z11>Дата</font>
         </th>
         <th class="z11" width=90>
          <font class=z11>Сумма</font>
         </th>
        </tr>
        <!-- BEGIN vg_bill_history -->
        <tr>
         <td class=z11 width=70 style="border-top: none; border-right: none;" align="center">
           <font class=z11 color="{VG_BILL_COLOR}">{VG_BILL_NUM}</font>
         </td>
         <td class="z11" width=90 style="border-top: none; border-right: none;" align="center">
          <font class=z11 color="{VG_BILL_COLOR}">{VG_BILL_DATE}</font>
         </td>
         <td class="z11" width=90 style="border-top: none;" align="center">
          <font class=z11 color="{VG_BILL_COLOR}">{VG_BILL_SUMM}</font>
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
      <input type="text" name="vg_plat_num" class=z11 size=21 value="{VG_PLAT_NUM}">
     </td>    
    </tr>
    <tr>
     <td height=30 class=z11>
      <font class=z11>&nbsp;&nbsp;Комментарий:</font>
     </td> 
     <td>
      <input type="text" name="vg_plat_comment" class=z11 size="39" value="{VG_PLAT_COMMENT}">
     </td>    
    </tr>    
   </table>
  </td>  
  </tr>
 <!-- END vg_balance -->
 
 <!-- BEGIN vg_options -->
 <input type="hidden" name=vg_conn_db value="{VG_CONN_DB}">
 <tr>
 <td colspan=3>&nbsp;</td>
 </tr>
 <tr>
  <th colspan=3 bgcolor="#e0e0e0" style="border: solid 1px #c0c0c0;" class=z11>
  <font class=z11>Опции</font>
  </th>
 </tr> 
 <tr>
  <td colspan=3 class=z11>
   <table cellpadding="0" cellspacing="0" border="0" align="center" width="100%">
   <!-- BEGIN vg_opt_row -->
   <tr>
     <!-- BEGIN vg_opt_col -->
     <td class=z11 height=30 width="25%" style="border: solid 1px #c0c0c0; border-top: none;">
      &nbsp;&nbsp;<font class=z11>{VG_OPT_NAME}</font>
     </td>
     <td class=z11 height=30 width="25%" style="border: solid 1px #c0c0c0; border-top: none; border-left: none;">
      &nbsp;&nbsp;{VG_OPT_VAL}
     </td>
     <!-- END vg_opt_col -->
   </tr>
   <!-- END vg_opt_row -->
   </table>
  </td>
 </tr>
 <!-- END vg_options -->
 
 <!-- BEGIN vg_plane_date -->
 <tr>
 <td colspan=3>&nbsp;</td>
 </tr>
 <tr>
  <th colspan=3 bgcolor="#e0e0e0" style="border: solid 1px #c0c0c0;" class=z11>
  <font class=z11>{VG_DATE_TIT}</font>
  </th>
 </tr>
 <tr>
  <td colspan=3 style="border: solid 1px #c0c0c0; border-top: none;" class=z11>
    <table cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
       <td width="50%" height="40" class="z11">
       &nbsp;&nbsp;<font class="z11">Дата подключения:</font>&nbsp;&nbsp;
       <select name=pl_year class=z11 style="width: 60px;">
    	 <option class=z11 value=-1>Год
    	 <!-- BEGIN vg_pd_year -->
    	 <option class=z11 value={VG_YEAR} {VG_PL_YEAR_SEL}>{VG_YEAR}
    	 <!-- END vg_pd_year -->
    	 </select>
    	 &nbsp;&nbsp;
    	 <select name=pl_month class=z11 style="width: 120px;">
   	 <option class=z11 value=-1>Месяц
   	 <!-- BEGIN vg_pd_month -->
   	 <option class=z11 value=1 {VG_PL_MONTH_SEL_1}>Январь
   	 <option class=z11 value=2 {VG_PL_MONTH_SEL_2}>Февраль
   	 <option class=z11 value=3 {VG_PL_MONTH_SEL_3}>Март
   	 <option class=z11 value=4 {VG_PL_MONTH_SEL_4}>Апрель
    	 <option class=z11 value=5 {VG_PL_MONTH_SEL_5}>Май
    	 <option class=z11 value=6 {VG_PL_MONTH_SEL_6}>Июнь
    	 <option class=z11 value=7 {VG_PL_MONTH_SEL_7}>Июль
    	 <option class=z11 value=8 {VG_PL_MONTH_SEL_8}>Август
    	 <option class=z11 value=9 {VG_PL_MONTH_SEL_9}>Сентябрь
    	 <option class=z11 value=10 {VG_PL_MONTH_SEL_10}>Октябрь
    	 <option class=z11 value=11 {VG_PL_MONTH_SEL_11}>Ноябрь
    	 <option class=z11 value=12 {VG_PL_MONTH_SEL_12}>Декабрь
    	 <!-- END vg_pd_month -->
    	 </select>
       &nbsp;&nbsp;    
    	 <select name=pl_date class=z11 style="width: 60px;">
    	 <option class=z11 value=-1>День
    	 <!-- BEGIN vg_pd_day -->
    	 <option class=z11 value={VG_DAY} {VG_PL_DAY_SEL}>{VG_DAY}
    	 <!-- END vg_pd_day -->
    	 </select>
       </td>
       <td width="50%" height="40" class="z11">
       &nbsp;&nbsp;<font class="z11">Комментарий:</font>&nbsp;&nbsp;
       <input type="text" class="z11" size="50" name="plane_comment" value="{PLANE_COMMENT_V}">
       </td>
      </tr>
    </table>
  </td> 
 </tr>
 <!-- END vg_plane_date -->
 
 
 <!-- BEGIN vg_base_tarif -->
 
 <!-- BEGIN vg_rasp_list -->
 <input type="hidden" name=vg_tar_rasp_list[{R_N}][0] value="{R_VAL0}">
 <input type="hidden" name=vg_tar_rasp_list[{R_N}][1] value="{R_VAL1}">
 <input type="hidden" name=vg_tar_rasp_list[{R_N}][2] value="{R_VAL2}">
 <input type="hidden" name=vg_tar_rasp_list[{R_N}][3] value="{R_VAL3}">
 <!-- END vg_rasp_list -->
  <!-- BEGIN vg_rasp_list1 -->
 <input type="hidden" name=vg_tar_rasp_list1[{R_N}][0] value="{R_VAL10}">
 <input type="hidden" name=vg_tar_rasp_list1[{R_N}][1] value="{R_VAL11}">
 <input type="hidden" name=vg_tar_rasp_list1[{R_N}][2] value="{R_VAL12}">
 <input type="hidden" name=vg_tar_rasp_list1[{R_N}][3] value="{R_VAL13}">
 <!-- END vg_rasp_list1 -->
 <tr>
 <td colspan=3>&nbsp;</td>
 </tr>
 <tr>
  <th colspan=3 bgcolor="#e0e0e0" style="border: solid 1px #c0c0c0;" class=z11>
  <font class=z11>{B_TAR}</font>
  </th>
 </tr> 
 
 <tr>
  <th class=11 style="border: solid 1px #c0c0c0; border-top: none; border-right: none;"><font class=z11>Базовый тариф</font></th>
  <th colspan="2" class=11 style="border: solid 1px #c0c0c0; border-top: none;"><font class=z11>Расписание смены тарифов</font></th>
 </tr>
 
 <script language="JavaScript">
 
 function select_base_tar()
 {
	for(i=0;i<document.forms[1].length;i++)
	{
	if(document.forms[1].elements[i].name == "vg_save")
	{		
 		if(document.forms[1].vg_base_tarif.value == -1)
 		{
 			document.forms[1].vg_save.disabled = 'true';
 		}
 		else
 		{
 			document.forms[1].vg_save.disabled = false;
 		}
	}
	}	
 }

function check_phone_ins(form){
 var error;
 if(form.vg_new_tel_num.value==""){ error=1 }
 for(i=0;i<form.vg_assigned_nums.length;i++)
 {
 if(form.vg_assigned_nums.options[i].value==form.vg_new_tel_num.value){ error=2 }
 }
 if(error==1){ alert('Phone number empty'); return false; }
 if(error==2){ alert('Phone number already exists'); return false; }
}
 
 </script>
 <tr>
  <td class=z11 align="center" height="50" style="border: solid 1px #c0c0c0; border-top: none; border-right: none;">
   <select class=z11 name=vg_base_tarif  style="width: 200px;" onChange="select_base_tar();">
   <option class=z11 value=-1>Не задан!
   <!-- BEGIN vg_base_tarif_opt -->
     <option class=z11 value="{VG_BASE_TAR_UID}" {VG_BASE_TAR_SEL}>{VG_BASE_TAR_NAME}
   <!-- END vg_base_tarif_opt -->
   </select>
  </td>
  <td colspan=2 height="50" class=z11 style="border: solid 1px #c0c0c0; border-top: none;">
   <table width="100%" cellpadding="0" cellspacing="0" border="0">
   <tr>
    <td class=z11 height=30 align="center" width="70">
    <select name=tar_year class=z11 style="width: 60px;">
    <option class=z11 value=-1>Год
    <option class=z11 value=2005>2005<option class=z11 value=2006>2006<option class=z11 value=2007>2007
    <option class=z11 value=2008>2008<option class=z11 value=2009>2009<option class=z11 value=2010>2010
    <option class=z11 value=2011>2011<option class=z11 value=2012>2012<option class=z11 value=2013>2013
    <option class=z11 value=2014>2014<option class=z11 value=2015>2015<option class=z11 value=2016>2016
    </select>
    </td>
    <td class=z11 height=30 align="center" width="130">
    <select name=tar_month class=z11 style="width: 120px;">
    <option class=z11 value=-1>Месяц<option class=z11 value=1>Январь<option class=z11 value=2>Февраль<option class=z11 value=3>Март<option class=z11 value=4>Апрель
    <option class=z11 value=5>Май<option class=z11 value=6>Июнь<option class=z11 value=7>Июль<option class=z11 value=8>Август<option class=z11 value=9>Сентябрь
    <option class=z11 value=10>Октябрь<option class=z11 value=11>Ноябрь<option class=z11 value=12>Декабрь
    </select>
    </td>    
    <td class=z11 height=30 align="center" width="70">    
    <select name=tar_day class=z11 style="width: 60px;">
    <option class=z11 value=-1>День<option class=z11 value=1>01<option class=z11 value=2>02<option class=z11 value=3>03<option class=z11 value=4>04<option class=z11 value=5>05
    <option class=z11 value=6>06<option class=z11 value=7>07<option class=z11 value=8>08<option class=z11 value=9>09<option class=z11 value=10>10<option class=z11 value=11>11
    <option class=z11 value=12>12<option class=z11 value=13>13<option class=z11 value=14>14<option class=z11 value=15>15<option class=z11 value=16>16<option class=z11 value=17>17
    <option class=z11 value=18>18<option class=z11 value=19>19<option class=z11 value=20>20<option class=z11 value=21>21<option class=z11 value=22>22<option class=z11 value=23>23
    <option class=z11 value=24>24<option class=z11 value=25>25<option class=z11 value=26>26<option class=z11 value=27>27<option class=z11 value=28>28<option class=z11 value=29>29
    <option class=z11 value=30>30<option class=z11 value=31>31
    </select>
    </td>    
    <td class=z11 height=30 align="center" width="60">
    <select name=tar_hour class=z11 style="width: 50px;">
    <option class=z11 value=-1>Час<option class=z11 value=0>00<option class=z11 value=1>01<option class=z11 value=2>02<option class=z11 value=3>03<option class=z11 value=4>04
    <option class=z11 value=5>05<option class=z11 value=6>06<option class=z11 value=7>07<option class=z11 value=8>08<option class=z11 value=9>09<option class=z11 value=10>10
    <option class=z11 value=11>11<option class=z11 value=12>12<option class=z11 value=13>13<option class=z11 value=14>14<option class=z11 value=15>15<option class=z11 value=16>16
    <option class=z11 value=17>17<option class=z11 value=18>18<option class=z11 value=19>19<option class=z11 value=20>20<option class=z11 value=21>21<option class=z11 value=22>22
    <option class=z11 value=23>23
    </select>
    </td>    
    <td class=z11 height=30 align="center" width="60">
    <select name=tar_minute class=z11 style="width: 50px;">
    <option class=z11 value=-1>Мин<option class=z11 value=0>00<option class=z11 value=1>01<option class=z11 value=2>02<option class=z11 value=3>03<option class=z11 value=4>04
    <option class=z11 value=5>05<option class=z11 value=6>06<option class=z11 value=7>07<option class=z11 value=8>08<option class=z11 value=9>09<option class=z11 value=10>10
    <option class=z11 value=11>11<option class=z11 value=12>12<option class=z11 value=13>13<option class=z11 value=14>14<option class=z11 value=15>15<option class=z11 value=16>16
    <option class=z11 value=17>17<option class=z11 value=18>18<option class=z11 value=19>19<option class=z11 value=20>20<option class=z11 value=21>21<option class=z11 value=22>22
    <option class=z11 value=23>23<option class=z11 value=24>24<option class=z11 value=24>25<option class=z11 value=26>26<option class=z11 value=27>27<option class=z11 value=28>28
    <option class=z11 value=29>29<option class=z11 value=30>30<option class=z11 value=31>31<option class=z11 value=32>32<option class=z11 value=33>33<option class=z11 value=34>34
    <option class=z11 value=35>35<option class=z11 value=36>36<option class=z11 value=37>37<option class=z11 value=38>38<option class=z11 value=39>39<option class=z11 value=40>40
    <option class=z11 value=41>41<option class=z11 value=42>42<option class=z11 value=43>43<option class=z11 value=44>44<option class=z11 value=45>45<option class=z11 value=46>46
    <option class=z11 value=47>47<option class=z11 value=48>48<option class=z11 value=49>49<option class=z11 value=50>50<option class=z11 value=51>51<option class=z11 value=52>52
    <option class=z11 value=53>53<option class=z11 value=54>54<option class=z11 value=55>55<option class=z11 value=56>56<option class=z11 value=57>57<option class=z11 value=58>58
    <option class=z11 value=59>59
    </select>
    </td>  
    <td class=z11 width=100 align="center">
     <input type="submit" name=vg_add_tar_rasp class="z11" value="Добавить">
    </td> 
    <td class=z11 align="center">
     <select class=z11 name=vg_base_tarif_rasp style="width: 200px;">
     <!-- BEGIN vg_base_tarif_opt_r -->
       <option class=z11 value="{VG_BASE_TAR_UID}" {VG_BASE_TAR_SEL}>{VG_BASE_TAR_NAME}
     <!-- END vg_base_tarif_opt_r -->
     </select>    
    </td>
   </tr>
   <!-- BEGIN vg_show_rasp -->
   <input type="hidden" name="tar_to_delete" value="0">
   <script language="JavaScript">
   function reload_after_delete(tar_id)
   {
   	document.forms[1].tar_to_delete.value = tar_id;
   	document.forms[1].submit();
   };
   
   function confirm_delete_tarif(tar_name, tar_id)
   {
   	var text = new String();
   	text = "{TAR_RASP1} "+tar_name+"{TAR_RASP2}";
   	temp = window.confirm(text);
   	window.status=(temp) ? reload_after_delete(tar_id) : 'Если false';
   };
   
   
   </script>
   
   <tr>    
    <td colspan="7" class=z11>
     <table cellpadding="0" cellspacing="0" border="0" align="center" width="100%" class=z11>
       <!-- BEGIN vg_show_rasp_row -->
       <tr>
        <td class=z11 width="80" height="25" style="border: solid 1px #c0c0c0; border-bottom: none; border-right: none; border-left: none;" align="center">
         <font class=z11>{R_LIST_NUM}</font>
        </td>
        <td class=z11 width="160" height="25" style="border: solid 1px #c0c0c0; border-bottom: none; border-right: none;" align="center">
         <font class=z11>{R_LIST_DATE}</font>
        </td>
        <td class=z11 height="25" style="border: solid 1px #c0c0c0;  border-bottom: none; border-right: none;">
         <font class=z11>&nbsp;&nbsp;{R_LIST_NAME}</font>
        </td> 
        <td class=z11 width="80" align="center" height="25" style="border: solid 1px #c0c0c0;  border-bottom: none; border-right: none;">
         <a href="JavaScript: confirm_delete_tarif('{R_LIST_NAME}', {R_LIST_NUM});">
         <font class=z11><b>Удалить</b></font>
         </a>
        </td>       
       </tr>
       <!-- END vg_show_rasp_row -->
     </table>
    </td>
   </tr>
   <!-- END vg_show_rasp-->
   </table>
  </td>
 </tr>
 <!-- END vg_base_tarif -->
 
 
 <!-- BEGIN vg_tel_nums -->
 
 <!-- BEGIN del_tel_nums -->
 <input type="hidden" name=vg_deleted_tels[] value="{DEL_TELS}"> 
 <!-- END del_tel_nums -->
 
 <!-- BEGIN vg_tel_hiddens -->
 <input type="hidden" name=vg_assigned_n[{AS_N_I}][0] value="{AS_N_VAL}">
 <input type="hidden" name=vg_assigned_n[{AS_N_I}][1] value="{AS_N_COMMENT}">
 <input type="hidden" name=vg_assigned_n[{AS_N_I}][2] value="{AS_N_ID}">
 <input type="hidden" name=vg_assigned_n1[{AS_N_I1}][0] value="{AS_N_VAL1}">
 <input type="hidden" name=vg_assigned_n1[{AS_N_I1}][1] value="{AS_N_COMMENT1}"> 
 <input type="hidden" name=vg_assigned_n1[{AS_N_I1}][2] value="{AS_N_ID1}"> 
 <!-- END vg_tel_hiddens -->
 <tr>
 <td colspan=3>&nbsp;</td>
 </tr>
 <tr>
  <th colspan=3 bgcolor="#e0e0e0" style="border: solid 1px #c0c0c0;" class=z11>
  <font class=z11>{VG_TEL_TITLE}</font>
  </th>
 </tr>  
 <tr>
  <td class=z11 align="center" height="120" style="border-bottom: solid 1px #c0c0c0; border-left: solid 1px #c0c0c0;">
   <select class="z11" name=vg_assigned_nums style="width: 200px;" size=7>
    <!-- BEGIN vg_tel_nums_opt -->
    <option class=z11 value='{VG_TEL_NUM_VAL}'>{VG_TEL_NUM_VAL} {AS_N_COMMENT1}
    <!-- END vg_tel_nums_opt -->
   </select>
  </td>
  
  <td align="center" class="z11" style="border-bottom: solid 1px #c0c0c0;">
   <input type="submit" name="vg_add_tel_num" class=z11 value="Добавить" style="width: 100px;" onclick="return check_phone_ins(this.form)"><br /><br />
   <input type="submit" name="vg_del_tel_num" class=z11 value="Удалить" style="width: 100px;">
  </td>
  
  <td class=z11 style="border-bottom: solid 1px #c0c0c0; border-right: solid 1px #c0c0c0;">
   &nbsp;&nbsp;<font class=z11>Новый номер</font><br />&nbsp;&nbsp;<input type="text" class=z11 size="30" name="vg_new_tel_num"><br /><br />
   &nbsp;&nbsp;<font class=z11>Комментарий</font><br />&nbsp;&nbsp;<input type="text" class=z11 size="30" name="vg_new_tel_num_coment">
  </td>
 </tr>
 <!-- END vg_tel_nums -->
 
 <!-- BEGIN vg_ip_staff -->
 
  <!-- BEGIN del_tel_nums -->
 <input type="hidden" name=vg_deleted_tels[] value="{DEL_TELS}"> 
 <!-- END del_tel_nums -->
 
 <!-- BEGIN vg_active_set_v -->
 <input type="hidden" name=vg_active_set[{VG_ACTIVE_IP_IT}] value="{VG_ACTIVE_IP_V}">
 <!-- END vg_active_set_v -->
 
 <tr>
 <td colspan=3>&nbsp;</td>
 </tr>
 <tr>
  <th colspan=3 bgcolor="#e0e0e0" style="border: solid 1px #c0c0c0;" class=z11>
  <font class=z11>{VG_IP_STAFF_TITLE}</font>
  </th>
 </tr>
 <tr>
  <td class=z11 height=140 width="250" align="center" valign="top" style="border-bottom: solid 1px #c0c0c0; border-left: solid 1px #c0c0c0;">
   <font class="z11">Присвоенные </font><br />
   <select  class="z11" name=vg_assigned_ip style="width: 200px;" size=8>
   <!-- BEGIN vg_active_ip --> 
     <option class="z11" value="{VG_ACTIVE_IP_VAL}" >{VG_ACTIVE_IP_VAL}
   <!-- END vg_active_ip -->   
   </select>
  </td>
  <td class=z11 colspan="2" align="center" valign="top">
   <table cellpadding="0" cellspacing="0" border="0" class="z11" width="100%">
   <tr>
    <td class=z11 width=100 height=140 align="center" valign="top" style="border-bottom: solid 1px #c0c0c0;">
     <br /><br />
     <input type="submit" name=vg_add_ip value="Добавить"  class=z11 style="width:80px;"><br /><br />
     <input type="submit" name=vg_del_ip value="Удалить"  class=z11 style="width:80px;">
    </td>
    <td class=z11 width=250 align="center" valign="top" style="border-bottom: solid 1px #c0c0c0;">
     <font class="z11">Доступные</font><br />
     <select  class="z11" name=vg_allowed_ip style="width: 200px;" size=8>
      <!-- BEGIN vg_allow_ip11 -->
        <option class="z11" value="{VG_ALLOW_IP_VAL}" >{VG_ALLOW_IP_VAL}
      <!-- END vg_allow_ip11 -->
     </select>
    </td>
    <td class=z11 align="center" valign="top" style="border-bottom: solid 1px #c0c0c0; border-right: solid 1px #c0c0c0;">
     <table cellpadding="0" cellspacing="0" border="0" class="z11">
     <tr>
       <td class="z11" colspan="2" align="center">
      <font class="z11">Выбрать из:</font>
      </td>
      </tr>
      <tr>
      <td class="z11" height="40">
      <br /><br />
      <font class="z11">Сегмент: &nbsp;&nbsp;</font>
      </td>
      <td class="z11" height="40">
      <br /><br />
      <select class="z11" name=vg_selected_seg style="width: 150px;" onChange="document.forms[1].submit();">
       <!-- BEGIN vg_all_segs -->
        <option class="z11" value="{VG_ALL_SEG_VAL}" {VG_ALL_SEG_SEL}>{VG_ALL_SEG_VAL}     
       <!-- END vg_all_segs -->
      </select>
      &nbsp;&nbsp;&nbsp;&nbsp;<font class="z11">Маска: &nbsp;&nbsp;</font>
      <input type="text" class="z11" name=masksize size="5" onchange="document.forms[1].submit();" value="{VG_MASK}">
      </td>
      </tr>
     </table>
    </td>
   </tr>
   </table>  
  </td>
  <td class=z11></td>   
 </tr>
 
 <input type="hidden" name="cabel_agent" value="1">
<!-- BEGIN vg_tel_hiddens -->
 <input type="hidden" name=vg_assigned_n[{AS_N_I}][0] value="{AS_N_VAL}">
 <input type="hidden" name=vg_assigned_n[{AS_N_I}][1] value="{AS_N_COMMENT}">
 <input type="hidden" name=vg_assigned_n[{AS_N_I}][2] value="{AS_N_ID}">
 <input type="hidden" name=vg_assigned_n1[{AS_N_I1}][0] value="{AS_N_VAL1}">
 <input type="hidden" name=vg_assigned_n1[{AS_N_I1}][1] value="{AS_N_COMMENT1}"> 
 <input type="hidden" name=vg_assigned_n1[{AS_N_I1}][2] value="{AS_N_ID1}"> 
 <!-- END vg_tel_hiddens -->
 <tr>
 <td colspan=3 width="100%">&nbsp;</td>
 </tr>
 <tr>
   <td colspan="3" width="100%">
     <table cellpadding="0" cellspacing="0" border="0" align="center" width="100%">   

 <tr>
  <th colspan=3 bgcolor="#e0e0e0" style="border: solid 1px #c0c0c0;" class=z11>
  <font class=z11>Адреса транспортной сети</font>
  </th>
 </tr>  
 <tr>
  <td class=z11 width="245" align="center" height="120" style="border-bottom: solid 1px #c0c0c0; border-left: solid 1px #c0c0c0;">
   <select class="z11" name=vg_assigned_nums style="width: 200px;" size=7>
    <!-- BEGIN vg_mac_nums_opt -->
    <option class=z11 value='{VG_TEL_NUM_VAL}'>{VG_TEL_NUM_VAL}  ({ASS_MAC_IP})
    <!-- END vg_mac_nums_opt -->
   </select>
  </td>
  
  <td width=100 align="center" class="z11" style="border-bottom: solid 1px #c0c0c0;">
   <input type="submit" name="vg_add_tel_num" class=z11 value="Добавить" style="width: 80px;"><br /><br />
   <input type="submit" name="vg_del_tel_num" class=z11 value="Удалить" style="width: 80px;">
  </td>
  
  <td class=z11 width="635" align="left" style="border-bottom: solid 1px #c0c0c0; border-right: solid 1px #c0c0c0;">
   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font class=z11>Новый</font><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
   <input type="text" class=z11 size="30" name="vg_new_tel_num"><br /><br />
   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
   <font class=z11>Привязать к IP</font><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
   <select class="z11" name=vg_new_tel_num_coment style="width: 175px;">
     <option value=0 class="z11">Не привязывать к IP</option>
     <!-- BEGIN mac_to_ip_row -->
     <option class="z11" value="{MAC_TO_IP}">{MAC_TO_IP}</option>
     <!-- END mac_to_ip_row -->
   </select>
  </td>
 </tr>
 </table>
 </td>
 </tr>
 <!-- END vg_ip_staff -->
 
 <!-- BEGIN ivox_services -->
 <tr>
  <tr>
 <td colspan=3>&nbsp;</td>
 </tr>
 <tr>
  <th colspan=3 bgcolor="#e0e0e0" style="border: solid 1px #c0c0c0;" class=z11>
  <font class=z11>{IVOX_SERVICES}</font>
  </th>
 </tr>
 <tr>
  <td colspan=3 style="border: solid 1px #c0c0c0; border-top: none;" class=z11>
   <table cellpadding="0" cellspacing="0" border="0" class="z11" width="100%" align="center">
    <tr>
     <td class="z11" width="50%" height="25" style="border-right: solid 1px #c0c0c0;" valign="top">
      <table cellpadding="0" cellspacing="0" border="0" class="z11" width="100%" align="center">
       <tr>
        <th colspan="3" class="z11" height="30">
        <font class="z11">Разовые услуги</font>
        <a href="JavaScript: active_ord2('ivox_once_history.php?vg_id={IO_VG_ID}');"><font class="z11">&nbsp;(подробнее...)</font></a>
        </th>
        <th class="z11" align="right" height="30">
        <a href="JavaScript: active_ord2('ivox_once_serv_act.php?vg_id={IO_VG_ID}');"><font class="z11">&nbsp;Назначить</font></a>&nbsp;&nbsp;&nbsp;
        </th>
       </tr>
       <tr>
        <th bgcolor="#e0e0e0" width="15%" class="z11" align="center" style="border-top: solid 1px #c0c0c0; border-right: solid 1px #c0c0c0;">
        <font class="z11">Код</font>
        </th>
        <th bgcolor="#e0e0e0" width="45%" class="z11" align="center" style="border-top: solid 1px #c0c0c0; border-right: solid 1px #c0c0c0;">
        <font class="z11">Описание</font>
        </th>
        <th bgcolor="#e0e0e0" width="15%" class="z11" align="center" style="border-top: solid 1px #c0c0c0; border-right: solid 1px #c0c0c0;">
        <font class="z11">Цена</font>
        </th>
        <th bgcolor="#e0e0e0" width="25%" class="z11" align="center" style="border-top: solid 1px #c0c0c0;">
        <font class="z11">Дата</font>
        </th>
       </tr>
       <!-- BEGIN ivox_once_serv -->
       <tr>
        <td width="15%" class="z11" align="center" style="border-top: solid 1px #c0c0c0; border-right: solid 1px #c0c0c0;">
        <font class="z11">{IO_KOD}</font>
        </td>
        <td width="45%" class="z11" align="center" style="border-top: solid 1px #c0c0c0; border-right: solid 1px #c0c0c0;">
        <font class="z11">&nbsp;{IO_DESCR}</font>
        </td>
        <td width="15%" class="z11" align="center" style="border-top: solid 1px #c0c0c0; border-right: solid 1px #c0c0c0;">
        <font class="z11">{IO_SUMM}</font>
        </td>
        <td width="25%" class="z11" align="center" style="border-top: solid 1px #c0c0c0;">
        <font class="z11">{IO_DATE}</font>
        </td>
       </tr>
       <!-- END ivox_once_serv -->
      </table>
     </td>
     <td class="z11" width="50%" height="25" valign="top">
      <table cellpadding="0" cellspacing="0" border="0" class="z11" width="100%" align="center">
       <tr>
        <th colspan="3" class="z11" height="30">
        <font class="z11">Периодические услуги</font>
        <a href="JavaScript: active_ord2('ivox_per_history.php?vg_id={IO_VG_ID}');"><font class="z11">&nbsp;(история списаний...)</font></a>
        </th>
        <th class="z11" align="right" height="30">
        <a href="JavaScript: active_ord2('ivox_per_serv_act.php?vg_id={IO_VG_ID}');"><font class="z11">&nbsp;Назначить/Удалить</font></a>&nbsp;&nbsp;&nbsp;
        </th>
       </tr>
       <tr>
        <th bgcolor="#e0e0e0" width="15%" class="z11" align="center" style="border-top: solid 1px #c0c0c0; border-right: solid 1px #c0c0c0;">
        <font class="z11">Код</font>
        </th>
        <th bgcolor="#e0e0e0" width="45%" class="z11" align="center" style="border-top: solid 1px #c0c0c0; border-right: solid 1px #c0c0c0;">
        <font class="z11">Описание</font>
        </th>
        <th bgcolor="#e0e0e0" width="15%" class="z11" align="center" style="border-top: solid 1px #c0c0c0; border-right: solid 1px #c0c0c0;">
        <font class="z11">Сценарий</font>
        </th>
        <th bgcolor="#e0e0e0" width="25%" class="z11" align="center" style="border-top: solid 1px #c0c0c0;">
        <font class="z11">Дата начала</font>
        </th>
       </tr>
       <!-- BEGIN ivox_per_serv -->
       <tr>
        <td width="15%" class="z11" align="center" style="border-top: solid 1px #c0c0c0; border-right: solid 1px #c0c0c0;">
        <font class="z11">{IP_KOD}</font>
        </td>
        <td width="45%" class="z11" align="center" style="border-top: solid 1px #c0c0c0; border-right: solid 1px #c0c0c0;">
        <font class="z11">&nbsp;{IP_DESCR}</font>
        </td>
        <td width="15%" class="z11" align="center" style="border-top: solid 1px #c0c0c0; border-right: solid 1px #c0c0c0;">
        <font class="z11">{IP_SCEN}</font>
        </td>
        <td width="25%" class="z11" align="center" style="border-top: solid 1px #c0c0c0;">
        <font class="z11">{IP_DATE}</font>
        </td>
       </tr>
       <!-- END ivox_per_serv -->
      </table>     
     </td>
    </tr>
   </table>
  </td>
 </tr>
 </tr>
 <!-- END ivox_services -->
 
 <tr>
 <td colspan=3>&nbsp;</td>
 </tr> 
  <tr>
   <td colspan=3 align="center" height="50" style="border: solid 1px #c0c0c0;">
    {DO_ACTION}
    <input type="submit" name="vg_cancel" class="z11" value="Отмена" style="width: 120px; ">
   </td>
  </tr>
</table>
 <script language="JavaScript">
 select_base_tar();
 </script>
<!-- END vg_edit_tab -->
