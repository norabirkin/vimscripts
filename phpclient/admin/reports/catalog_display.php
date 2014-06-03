<?php
// +----------------------------------------------------------------------
// | PHP Source
// +----------------------------------------------------------------------
// | Copyright (C) 2005 by  <diver@diver>
// +----------------------------------------------------------------------
// |
// | Copyright: See COPYING file that comes with this distribution
// +----------------------------------------------------------------------
//

function show_cat_top($catalog_object,$cat_list,$operators_list)
//Верхняя часть страницы каталога - $catalog_object передается для отображения его свойств в заголовке
{
echo '
<SCRIPT language="JavaScript" src="js/catalog.js"></SCRIPT>
<form action="config.php" name="catalog" method="post">
<input type=hidden name=devision value=17>
<input type=hidden name=ed_cat_n value=0>
<input type=hidden name=cat_id value='.$_POST['cat_id'].'>
<input type=hidden name=catPage2Show value='.$_POST['catPage2Show'].'>
<input type=hidden name=page2show value='.$_POST['page2show'].'>
<input type=hidden name=category value='.$_POST['category'].'>
<input type=hidden name=button_pressed value='.$_POST['button_pressed'].'>
<input type=hidden name=save_ch value=0>
<input type=hidden name=abon_pl value='.$_POST['abon_pl'].'>
<input type=hidden name=code_selected value='.$_POST['code_selected'].'>
<input type=hidden name=code_selected_c value=0>
<input type=hidden name=code_selected2 value=0>
<input type=hidden name=cat2copy value=-1>
<input type=hidden name=commitChange value=0>
<input type=hidden name=showDeleted_1 value='.$_POST['showDeleted_1'].'>';
echo '<input type=hidden name=category_id value="'.$_POST['category_id'].'">';
echo '<input type=hidden name=category_id1 value="'.$_POST['category_id1'].'">';
echo '
<table width=970 cellpading=0 cellspacing=0>';

// Заголовок формы работы с каталогом
printf("
<tr>
<td colspan=2 bgcolor=#e0e0e0 align = left><font class=z11>&nbsp<strong>%s</strong> %s <strong>%s</strong> %s <strong>%s</strong> %d <strong>%s</strong> %d</font></td>
</tr>",CATALOG.COLON,$cat_list[$catalog_object->catalog_id][0],
OWNER.COLON,$operators_list[$catalog_object->oper_catalog_owner]->operator_name,
RECORDS_TOTAL.COLON,$catalog_object->codes_num,
CATEGORIES_TOTAL.COLON,$catalog_object->cat_num);


//Поле с основными кнопками и полями для параметров поиска
echo '
<tr>
 <td align=center width=730>
   <table border = 0 width=750 cellpadding=0 cellspacing=0 style="margin-top: 0; padding-top: 0;">';

//Кнопки для работы с каталогами (создание, удаление, модификация каталогов)
echo '
   <tr>
     <td><table width=100% style="border: solid 1px #c0c0c0;border-bottom: none;"><tr>
     <td width=200 align=center class=z11><input type=button name=new_cat value="'.CREATE_CAT.'" class=z11 style="width: 130px;" onClick="btnCl(1);"></td>
     <td width=200 align=center class=z11><input type=button name=del_cat value="'.DELETE_CAT.'" class=z11 style="width: 130px;" onClick="btnCl(2);"></td>
     <td width=200 align=center class=z11><input type=button name=edit_cat value="'.EDIT_CAT.'" class=z11 style="width: 130px;" onClick="btnCl(3);"></td>
   </tr>
  </table>
 </td>
</tr>';

// Кнопки для работы с кодами
if(isset($_SESSION['code_selected'])) $but_dis = "";
else $but_dis = "disabled";
echo '
<tr>
 <td>
  <table width=100% style="border: solid 1px #c0c0c0; border-bottom: none;">
   <tr>
     <td width=200 align=center class=z11><input type=button name=new_dir value="'.CREATE2.'" class=z11 style="width: 130px;" onClick="btnCl(4);"></td>
     <td width=200 align=center class=z11><input type=button name=del_dir value="'.DELETE3.'" class=z11 style="width: 130px;" disabled onClick="btnCl(5);"></td>
     <td width=200 align=center class=z11><input type=button name=edit_dir value="'.CHANGE.'" class=z11 style="width: 130px;" '.$but_dis.' onClick="btnCl(6);"></td>
   </tr>
  </table>
 </td>
</tr>';

}

function catalog_fields($vals, $ex_cats, $descriptor)
// Выводит поля и кнопки для создания-редактирования каталогов
{
   if($vals[2] == 0)
   {
      $header = "<b>".NEW_CAT_CREATION."</b>";
      $mode = 1;
      $mode2 = 1;
   }
   else
   {
      $header = "<b>".CAT_EDITION."</b>";
      $mode = 3;
      $mode2 = 2;
   }
   echo "<td align=center colspan=6 width=745 bgcolor=#e0e0e0 style=\"border-bottom: solid 1px #c0c0c0;\"><font class=z11>$header</font></td></tr>";
   
   echo '<tr>';
   echo '<td align=center colspan=6 width=745>';
   
   echo '<table width=745 cellpadding=0 cellspacing=0 border=0 align=center>';
   
   // Верхняя строчка заголовка (описание редактируемых свойств каталога)
   
   printf("<tr>
   <td>&nbsp</td>
   <td align = center ><font class=z11>%s</font></td>
   <td align = center ><font class=z11>%s</font></td>
   <td align = center ><font class=z11>%s</font></td>
   <td align = center ><font class=z11>%s</font></td>
   </tr>",CAT_NAME_NAME,CATOWNER,CAT_TYPE_T,USE4FILLING );
   
   echo '<tr>';
   echo '<td width=80 align=center><input type=button name=save value="'.SAVE.'" class=z11 onClick="saveBtn('.$mode.', '.$mode2.');"></td>';
   echo "<td width=170 align=center><input type=text class=z11 name=catalog_name value=\"".$vals[0]."\" style=\"width: 160px;\"></td>";
   
   // Вывод списка возможных владельцев - операторов
   
   printf("<td width=170 align=center><select name=oper_owner class=z11 style=\"width: 155px;\">");
   
   get_oper_list($descriptor,$vals[1]);
   
   
   printf("</select></td>");
   // echo "<td width=170 align=center><input type=text class=z11 name=catalog_desc value=\"".$vals[1]."\" style=\"width: 160px;\"></td>";
   
   
   echo "<td align=center width=160><select name=catalog_t class=z11 onchange=\"cr_cat(1);\" ".$vals[3]." style=\"width: 155px;\">";
   echo "     <option value=-1 class=z11>".CAT_TYPE_SELECTION."</option>";
   echo "     <option value=0 class=z11>".PHONECAT."</option>";
   echo "     <option value=1 class=z11>".IPCATALOG."</option>";
   echo "     <option value=2 class=z11>".ASCATALOG."</option>";
   echo "     <option value=3 class=z11>".CAT_TYPE_3."</option>";
   echo "     <option value=4 class=z11>".CAT_TYPE_4."</option>";
   echo "</select></td>";
   echo "<td width=165 align=center><select name=catalog2copy class=z11 onchange=\"cr_cat(2);\" ".$vals[3]." style=\"width: 155px;\">";
   echo "     <option value=-1 class=z11>".COPY_CATALOG."</option>";
   foreach($ex_cats as $key=>$value)
   {
      echo "     <option value=".$key." class=z11>".$value[0]."&nbsp;".$value[1]."</option>";
   }
   echo "</select></td></tr></table></td></tr>";
}

function category_fields($vals, $c_type, $bon_array=0, $time_array=0, $we_array=0)
//Вывод полей для создания / изменения категории
{
   if($vals[5] == 1)
   {
      $header = "<b>".NEW_CTG_CREATION."</b>";
      $mode = 8; $mode2 = 1;
   }
   else
   {
      $header = "<b>".CTG_EDITION."</b>";
      $mode = 10; $mode2 = 2;
   }
   
   
   printf("<td width=100%% colspan = 2 bgcolor=#e0e0e0 align=left class=z11 style=\"border-bottom: solid 1px #c0c0c0;>\"
   <font class=z11>%s</font></td></tr>",
   $header);
   
   // Общие свойства 
   printf("<tr><td width = 50%%> 
   <fieldset>
   <legend><font color=\"#000000;\" class=z11 size=-1><strong>%s</strong>&nbsp;</font></legend>",GENOPT);
   
   printf("
   <table width=100%% cellspacing = 0 cellpadding = 0>
	<tr><td width = 180><font color=\"#000000;\" class=z11>%s</font></td><td><input type=text class=z11 name=cat_code value = \" %d \" style=\"width: 180 px;\"></td></tr> 	
	<tr><td></td><td></td></tr>	
	<tr><td></td><td></td></tr>
	",CODE,$vals[0]);
	
	printf("
	<tr><td></td><td></td></tr>
	<tr><td></td><td></td></tr>
	<tr><td></td><td></td></tr>	
   </table>	
   </fieldset>
   </td>");
   
   
  // и скидка выходного дня если требуется 
   printf("<td width= 50%%>Скидка выходного дня:</td></tr>");
   
   // Заголовок скидки по времени если требуется
   printf("<tr><td colspan = 2 bgcolor=#e0e0e0 align=left class=z11 style=\"border-bottom: solid 1px #c0c0c0;>\"
   <font class=z11><strong>Скидка по времени:</strong></font></td></tr>");
   
   // Скидка по времени (отбражение полей)
   printf("<tr><td>С: По:</td><td>Значения:</td></tr>");   
   
   
   

    if($c_type == 1)
    {
    // showBonuses($bon_array, $time_array, $we_array);
    }

}

function codes_fields($vals, $c_type, $w, $tar_zone=0)
//Поля для работы с кодами
{
   if(isset($_SESSION['code_selected']))
   {
      $gr_dis = "disabled";
   }
   else
      $gr_dis = "";

   if($w == 1)
   {
      $header = "<b>".NEW_CODE_CREATION."</b>";
      $mode = 4; $mode2 = 1;
   }
   else
   {
      $header = "<b>".CODE_EDITION."</b>";
      $mode = 6; $mode2 = 2;
   }

   if($c_type != 0)
   {
      echo '<tr><th width=100% colspan=6 bgcolor=#e0e0e0 align=center class=z11 style="border-bottom: solid 1px #c0c0c0;">'.$header.'</th>';
      echo '<tr>
            <th bgcolor=#e0e0e0 class=z11>&nbsp;</th>
            <th bgcolor=#e0e0e0 class=z11>'.CODE.'</th>';
    if($c_type == 1)
    {
      echo '<th width=210 bgcolor=#e0e0e0 class=z11>'.CATEGORY1.'</th>';
    }
    else
      echo '<th width=210 bgcolor=#e0e0e0 class=z11>'.INSIDE_ABON.'</th>';
    if($c_type == 1)
    {
      echo '<th bgcolor=#e0e0e0 class=z11>'.REGION.'</th>';
    }
    else
      echo '<th bgcolor=#e0e0e0 class=z11>'.PRICE.' ('.RE.')</th>';

      echo '<th bgcolor=#e0e0e0 class=z11>'.DESCRIPTION.'</th>';
      echo '</tr>';
      echo '<tr>
            <td class=z11 style="border: solid 1px #c0c0c0; border-right: none; border-left: none;">
            <input class=z11 type=button name=save value="'.SAVE.'" onClick="saveBtn('.$mode.','.$mode2.')"></td>
            <td class=z11 style="border: solid 1px #c0c0c0; border-right: none;">
            <input type=text align=right name=code value="'.$vals[0].'" '.$gr_dis.'></td>';
    if($c_type == 1)
    {
      echo '<td class=z11 align=center style="border: solid 1px #c0c0c0; border-right: none;">';
      echo '<select class=z11 name=ch_cat style="width: 80px;">';
      echo '<option class=z11 value=0 onClick="document.forms[1].category_id1.value=0">0,No cat.</option>';
      foreach($vals[1] as $value)
      {
         if($tar_zone == $value[0]) $asd="selected";
         else  $asd = "";
         echo '<option class=z11 value='.$value[0].' onClick="document.forms[1].category_id1.value='.$value[0].';" '.$asd.'>'.$value[0].','.$value[1].'</option>';
      }
      echo '</select>';
      echo '</td>';
    }
    else
    {
        if($vals[1] == 0) $asd="";
        else $asd="checked";

        echo '<td class=z11 align=center style="border: solid 1px #c0c0c0; border-right: none;">';
        echo '<input type=checkbox name=cat_ap '.$asd.' onChange="ab_plata();"></td>';
    }
      echo '<td class=z11 style="border: solid 1px #c0c0c0; border-right: none;">
            <input type=text align=right name=region value="'.$vals[3].'" style="width: 200px;" '.$gr_dis.'></td>';

      echo '<td align=center class=z11 style="border: solid 1px #c0c0c0; border-right: none;">
            <input type=text name=describe value="'.$vals[2].'" style="width: 210px;" '.$gr_dis.'></td>
            </tr>';
   }
   elseif($c_type == 0)
   {
      echo '<tr><th width=100% colspan=6 bgcolor=#e0e0e0 align=center class=z11 style="border-bottom: solid 1px #c0c0c0;">'.$header.'</th>';
      echo '<tr>
            <th bgcolor=#e0e0e0 class=z11>&nbsp;</th>
            <th width=200 bgcolor=#e0e0e0 class=z11>IP</th>';
      echo '<th width=200 bgcolor=#e0e0e0 class=z11>'.NETWORKMASK.'</th>';
      echo '<th width=50 bgcolor=#e0e0e0 class=z11>'.CATEGORY1.'</th>';
      echo '<th width=230 bgcolor=#e0e0e0 class=z11>'.DESCRIPTION.'</th>';
      echo '</tr>';
      echo '<tr>
            <td class=z11 style="border: solid 1px #c0c0c0; border-right: none; border-left: none;">
            <input class=z11 type=button name=save value="'.SAVE.'" onClick="saveBtn('.$mode.','.$mode2.')"></td>
            <td class=z11 align=center style="border: solid 1px #c0c0c0; border-right: none;">&nbsp;
            <input type=text class=z11 align=right name=ip1 value="'.$vals[0].'" size=2 '.$gr_dis.'>.
            <input type=text class=z11 align=right name=ip2 value="'.$vals[1].'" size=2 '.$gr_dis.'>.
            <input type=text class=z11 align=right name=ip3 value="'.$vals[2].'" size=2 '.$gr_dis.'>.
            <input type=text class=z11 align=right name=ip4 value="'.$vals[3].'" size=2 '.$gr_dis.'>&nbsp;</td>';
      echo '<td class=z11 align=center style="border: solid 1px #c0c0c0; border-right: none;">&nbsp;
            <input type=text class=z11 align=right name=mask1 value="'.$vals[4].'" size=2 '.$gr_dis.'>.
            <input type=text class=z11 align=right name=mask2 value="'.$vals[5].'" size=2 '.$gr_dis.'>.
            <input type=text class=z11 align=right name=mask3 value="'.$vals[6].'" size=2 '.$gr_dis.'>.
            <input type=text class=z11 align=right name=mask4 value="'.$vals[7].'" size=2 '.$gr_dis.'>&nbsp;</td>';
      echo '<td class=z11 align=center style="border: solid 1px #c0c0c0; border-right: none;">';
      echo '<select name=ch_cat class=z11 style="width: 70px;">';
      echo '<option class=z11 value=0 onClick="document.forms[1].category_id1.value=0">0,No cat.</option>';

      foreach($vals[8] as $value)
      {
         if($tar_zone == $value[0]) $asd="selected";
         else  $asd = "";
         echo '<option class=z11 value='.$value[0].' onClick="document.forms[1].category_id1.value='.$value[0].'"'.$asd.'>'.$value[0].','.$value[1].'</option>';
      }
      echo '</select>';
      echo '</td>';
      echo '<td align=center class=z11 style="border: solid 1px #c0c0c0; border-right: none; width: 60px;">
            <input type=text class=z11 name=describe value="'.$vals[9].'" style="width: 200px;" '.$gr_dis.'></td>
            </tr>';
   }
}

function showBonuses($bon_array, $time_array=0, $we_array=0)
//Поля для задания скидок для конкретной категории
{
   if($bon_array != 0 && is_array($bon_array) && !isset($_POST['val_bon_num']))
   {
      $_POST['val_bon_num']=0;
      $i = 0;
      foreach($bon_array as $value)
      {
        $i++;
        $_POST['val_bon_num']++;
        $_POST['val_val'][$i] = $value[0];
        $_POST['val_percent_'.$i] = $value[1];
        $_POST['val_mone_'.$i] = $value[2];
        $_POST['val_bonus'][$i] = $value[3];
      }
      $_POST['val_bon_num1'] = $_POST['val_bon_num'];
   }
   if(isset($_POST['val_bon_num']) && $_POST['val_bon_num']>=1 && $_POST['val_bon_num1']>=1)
   {
      $v_ch2 = "checked";
      if(isset($_POST['deleted']))
         $_SESSION['deleted_val'][] = $_POST['deleted'];
   }
   else
   {
      $v_ch2 = "";
      unset($_SESSION['deleted_val']);
   }

   if($time_array != 0 && is_array($time_array) && !isset($_POST['time_bon_num']))
   {
      $_POST['time_bon_num']=0;
      $i = 0;
      foreach($time_array as $value)
      {
        $i++;
        $time1 = explode(':', $value[0]);
        $time2 = explode(':', $value[1]);
        $_POST['hour1_'.$i] = $time1[0];
        $_POST['hour2_'.$i] = $time2[0];
        $_POST['minute1_'.$i] = $time1[1];
        $_POST['minute2_'.$i] = $time2[1];
        $_POST['time_bon_num']++;
        $_POST['time_percent_'.$i] = $value[2];
        $_POST['time_mone_'.$i] = $value[3];
      }
      $_POST['time_bon_num1'] = $_POST['time_bon_num'];
   }
   if(isset($_POST['time_bon_num']) && $_POST['time_bon_num']>=1 && $_POST['time_bon_num1']>=1)
   {
      $t_ch2 = "checked";
      if(isset($_POST['deleted1']))
         $_SESSION['deleted_val1'][] = $_POST['deleted1'];
   }
   else
   {
      $t_ch2 = "";
      unset($_SESSION['deleted_val1']);
   }
   if($we_array != 0 && is_array($we_array) && !isset($_POST['week_op']))
   {
      $_POST['week_ch']=1;
      $_POST['week_op']=1;
      $_POST['we_percent'] = sprintf("%0.2f", $we_array[0]);
      $_POST['we_mone'] = $we_array[1];
   }

   if(isset($_POST['week_ch']) && $_POST['week_ch'] == 1) $we_ch = "checked";
   else $we_ch = "";

//Хиддены для работы со скидками**********************************
?>
<input type=hidden name="val_bon_num" value=<?php echo $_POST['val_bon_num'];?>>
<input type=hidden name="val_bon_num1" value=<?php echo $_POST['val_bon_num1'];?>>
<input type=hidden name=deleted>
<input type=hidden name=deleted1>
<input type=hidden name="time_bon_num" value=<?php echo $_POST['time_bon_num'];?>>
<input type=hidden name="time_bon_num1" value=<?php echo $_POST['time_bon_num1'];?>>
<input type=hidden name="week_ch" value=<?php echo $_POST['week_ch'];?>>
<input type=hidden name="week_op" value=<?php echo $_POST['week_op'];?>>

<tr><th colspan=6 height=15><font class=z11>&nbsp;</font></th></tr>
<tr><th colspan=6 bgcolor="#e0e0e0" height=15 style="border-bottom: solid 1px #c0c0c0; border-top: solid 1px #c0c0c0;">
<font class=z11 size=-1><?php echo BONUS_CAT; ?></font>
</th></tr>
<?php 
//Экранируем объемные скидки
?>
<input type=hidden name=value_bon>
<?php
/*
<tr><td colspan=5 align=left style="border-bottom: solid 1px #c0c0c0;">
&nbsp;&nbsp;&nbsp;
<input type=checkbox name=value_bon class=z11 onClick="showBon(1)" <?php echo $v_ch2;?>><font class=z11><?php echo VOLDIS;?></font>
</td>
<td align=right style="border-bottom: solid 1px #c0c0c0;">
<input type=button name="add_val_bon" class=z11 style="width: 45px;" value="Add" OnClick="document.forms[1].val_bon_num.value++; document.forms[1].val_bon_num1.value++;document.forms[1].submit();">
</td>
</tr>
<?php
if(isset($_POST['val_bon_num']) && $_POST['val_bon_num']>=1 && $_POST['val_bon_num1']>=1)
{
?>
<tr><td colspan=6>
<table width=100% id=block_val cellpadding="0" cellspacing="0" border="0">
<tr>
<th width=50 style="border-bottom: solid 1px #c0c0c0;" height=15><font class=z11><?php echo P_ID;?></th>
<th width=150 style="border-bottom: solid 1px #c0c0c0;" height=15><font class=z11><?php echo VOL_CAT;?></font></th>
<th width=150 style="border-bottom: solid 1px #c0c0c0;" height=15><font class=z11><?php echo VOL_PER;?></font></th>
<th width=70 style="border-bottom: solid 1px #c0c0c0;" height=15>&nbsp;</th>
<th width=150 style="border-bottom: solid 1px #c0c0c0;" height=15><font class=z11><?php echo VOL_MON;?></font></th>
<th width=150 style="border-bottom: solid 1px #c0c0c0;" height=15><font class=z11><?php echo VOL_BON;?></font></th>
<th width=55 style="border-bottom: solid 1px #c0c0c0;" height=15>&nbsp;</th>
</tr>
<?php
   show_val_bonuses();
?>
</table></td></tr>
<?php
}
*/
?>

<tr><td colspan=5 align=left style="border-bottom: solid 1px #c0c0c0;">
&nbsp;&nbsp;&nbsp;
<input type=checkbox name=time_bon class=z11 onClick="showBon(2)" <?php echo $t_ch2; ?>>
<font class=z11><?php echo TIMEDIS;?></font>
</td>
<td align=right style="border-bottom: solid 1px #c0c0c0;">
<input type=button name="add_val_bon" class=z11 style="width: 45px;" value="Add" OnClick="document.forms[1].time_bon_num.value++; document.forms[1].time_bon_num1.value++;document.forms[1].submit();">
</td>
</tr>
<?php
if(isset($_POST['time_bon_num']) && $_POST['time_bon_num']>=1 && $_POST['time_bon_num1']>=1)
{
?>
<tr><td colspan=6>
<table width=100% id=block_time cellpadding="0" cellspacing="0" border="0">
<tr>
<th width=50 style="border-bottom: solid 1px #c0c0c0;" height=15><font class=z11><?php echo P_ID;?></font></th>
<th width=200 style="border-bottom: solid 1px #c0c0c0;" height=15><font class=z11><?php echo TIMEFROM;?></font></th>
<th width=200 style="border-bottom: solid 1px #c0c0c0;" height=15><font class=z11><?php echo TIMETO;?></font></th>
<th width=100 style="border-bottom: solid 1px #c0c0c0;" height=15><font class=z11><?php echo VOL_PER;?></font></th>
<th width=70 style="border-bottom: solid 1px #c0c0c0;" height=15>&nbsp;</th>
<th width=100 style="border-bottom: solid 1px #c0c0c0;" height=15><font class=z11><?php echo VOL_MON;?></font></th>
<th width=55 style="border-bottom: solid 1px #c0c0c0;" height=15><font class=z11>&nbsp;</font></th>
</tr>
<?php
   show_time_bonuses();
?>
</table></td></tr>
<?php
}
?>

<tr><td colspan=6 align=left style="border-bottom: solid 1px #c0c0c0;">
&nbsp;&nbsp;&nbsp;
<input type=checkbox name=we_bon class=z11 onClick="showBon(3)" <?php echo $we_ch; ?>>
<font class=z11><?php echo WEEKENDDIS;?></font>
<?php

if(isset($_POST['week_ch']) && $_POST['week_ch']==1)
{
?>
<tr><td colspan=6>
<table width=100% id=block_time cellpadding="0" cellspacing="0" border="0">
<tr>
<th width=50 style="border-bottom: solid 1px #c0c0c0;" height=15><font class=z11><?php echo P_ID;?></font></th>
<th width=400 style="border-bottom: solid 1px #c0c0c0;" height=15><font class=z11>&nbsp;</font></th>
<th width=100 style="border-bottom: solid 1px #c0c0c0;" height=15><font class=z11><?php echo VOL_PER;?></font></th>
<th width=70 style="border-bottom: solid 1px #c0c0c0;" height=15>&nbsp;</th>
<th width=100 style="border-bottom: solid 1px #c0c0c0;" height=15><font class=z11><?php echo VOL_MON;?></font></th>
<th width=55 style="border-bottom: solid 1px #c0c0c0;" height=15><font class=z11>&nbsp;</font></th>
</tr>
<?php
   show_we_bonuses();
?>
</table></td></tr>
<?php
}

?>
</td></tr>
<?php
}

function show_we_bonuses()
{
?>
<tr>
<td align=center width=50 style="border-bottom: solid 1px #c0c0c0;" height=15>
<font class=z11>1</font>
</td>
<td align=center width=400 style="border-bottom: solid 1px #c0c0c0;" height=15>
&nbsp;
</td>
<td align=center width=100 style="border-bottom: solid 1px #c0c0c0;" height=15>
<input type=text size=8 name=we_percent value="<?php echo $_POST['we_percent']; ?>">
</td>
<td align=center width=70 style="border-bottom: solid 1px #c0c0c0;" height=15>
<input type=button name=val_type value="<< >>" onClick="change_val_type(this.form.we_percent,
this.form.we_mone);">
</td>
<td align=center width=100 style="border-bottom: solid 1px #c0c0c0;" height=15>
<input type=text size=8 name=we_mone value="<?php echo $_POST['we_mone']; ?>">
</td>
<td width=55 align=right style="border-bottom: solid 1px #c0c0c0;" height=15>
&nbsp;
</td>
</tr>
<?php
}

function show_time_bonuses()
{
$iter = 1;
   for($i = 1; $i <= $_POST['time_bon_num']; $i++)
   {
      if(isset($_SESSION['deleted_val1']) && is_array($_SESSION['deleted_val1']))
           if(in_array($i, $_SESSION['deleted_val1']))
              continue;
      $array = array($_POST['hour1_'.$i], $_POST['minute1_'.$i],
      $_POST['hour2_'.$i], $_POST['minute2_'.$i],
      $_POST['time_percent_'.$i], $_POST['time_mone_'.$i]);
      show_time_bonuses2($i, $iter, $array);
      $iter++;
   }
}

function show_time_bonuses2($num, $num2, $array)
{
?>
<tr>
<td align=center width=50 style="border-bottom: solid 1px #c0c0c0;" height=15>
<font class=z11><?php echo $num2; ?></font>
</td>
<td width=200 align=center style="border-bottom: solid 1px #c0c0c0;" height=15>
<select name=hour1_<?php echo $num; ?> class=z11 style="width: 60px;">
<?php
   show_opt_time($array[0], 1);
?>
</select>
<select name=minute1_<?php echo $num; ?> class=z11 style="width: 60px;">
<?php
   show_opt_time($array[1], 2);
?>
</select>
</td>
<td width=200 align=center style="border-bottom: solid 1px #c0c0c0;" height=15>
<select name=hour2_<?php echo $num; ?> class=z11 style="width: 60px;">
<?php
   show_opt_time($array[2], 1);
?>
</select>
<select name=minute2_<?php echo $num; ?> class=z11 style="width: 60px;">
<?php
   show_opt_time($array[3], 2);
?>
</select>

</td>
<td width=100 align=center style="border-bottom: solid 1px #c0c0c0;" height=15>
<input type=text size=8 name=time_percent_<?php echo $num; ?> value="<?php printf("%0.2f", $array[4]); ?>">
</td>
<td width=70 align=center style="border-bottom: solid 1px #c0c0c0;" height=15>
<input type=button name=time_type value="<< >>" onClick="change_val_type(this.form.time_percent_<?php echo $num; ?>,
this.form.time_mone_<?php echo $num; ?>);">
</td>
<td width=100 align=center style="border-bottom: solid 1px #c0c0c0;" height=15>
<input type=text size=8 name=time_mone_<?php echo $num; ?> value="<?php echo $array[5]; ?>">
</td>
<td width=55 align=right style="border-bottom: solid 1px #c0c0c0;" height=15>
<input class=z11 type=button name=del_time_bon value="Del" style="width: 45px;"
onClick="document.forms[1].deleted1.value=<?php echo $num; ?>; document.forms[1].time_bon_num1.value--;document.forms[1].submit();">
</td>
</tr>
<?php
}

function show_opt_time($time, $type)
{
   if($type == 1)
   {
      $lim = 23;
      if(!isset($time)) $asd = "selected";
      else $asd = "";
      echo "<option class=z11 value='".HOURS2."' ".$asd.">".HOURS2;
   }
   elseif($type == 2)
   {
      $lim = 59;
      if(!isset($time)) $asd = "selected";
      else $asd = "";
      echo "<option class=z11 value='".MINUTES."' ".$asd.">".MINUTES;
   }

   for($i=0; $i <= $lim; $i++)
   {
      if(strlen($i) < 2) $c_l = '0'.$i;
      else $c_l = $i;

      if($c_l == $time) $asd = "selected";
      else $asd = "";
      echo "<option class=z11 value='".$c_l."' ".$asd.">".$c_l;
   }
}

function show_val_bonuses()
{
$iter = 1;
   for($i = 1; $i <= $_POST['val_bon_num']; $i++)
   {
      if(isset($_SESSION['deleted_val']) && is_array($_SESSION['deleted_val']))
           if(in_array($i, $_SESSION['deleted_val']))
              continue;
      $array = array($_POST['val_val'][$i], $_POST['val_percent_'.$i],
      $_POST['val_mone_'.$i], $_POST['val_bonus'][$i]);
      show_val_bonuses2($i, $iter, $array);
      $iter++;
   }
}

function show_val_bonuses2($num, $num2, $array)
{
?>
<tr>
<td align=center width=50 style="border-bottom: solid 1px #c0c0c0;" height=15>
<font class=z11><?php echo $num2; ?></font>
</td>
<td align=center width=150 style="border-bottom: solid 1px #c0c0c0;" height=15>
<input type=text size=8 name=val_val[<?php echo $num; ?>] value="<?php echo $array[0]; ?>">
</td>
<td align=center width=150 style="border-bottom: solid 1px #c0c0c0;" height=15>
<input type=text size=8 name=val_percent_<?php echo $num; ?> value="<?php printf("%0.2f", $array[1]); ?>">
</td>
<td align=center width=70 style="border-bottom: solid 1px #c0c0c0;" height=15>
<input type=button name=val_type value="<< >>" onClick="change_val_type(this.form.val_percent_<?php echo $num; ?>,
this.form.val_mone_<?php echo $num; ?>);">
</td>
<td align=center width=150 style="border-bottom: solid 1px #c0c0c0;" height=15>
<input type=text size=8 name=val_mone_<?php echo $num; ?> value="<?php echo $array[2]; ?>">
</td>
<td align=center width=150 style="border-bottom: solid 1px #c0c0c0;" height=15>
<input type=text size=8 name=val_bonus[<?php echo $num; ?>] value="<?php echo $array[3]; ?>">
</td>
<td width=55 align=right style="border-bottom: solid 1px #c0c0c0;" height=15>
<input class=z11 type=button name=del_val_bon value="Del" style="width: 45px;"
onClick="document.forms[1].deleted.value=<?php echo $num; ?>; document.forms[1].val_bon_num1.value--;document.forms[1].submit();">
</td>
</tr>
<?php
}


function get_oper_list($descriptor,$chkd)
{
$qs = "SELECT oper_id, name FROM operators;";
$qresult = mysql_query($qs, $descriptor);
	if($qresult != false)
	{
	   if(mysql_num_rows($qresult) > 0)
	   {
	      while($cur_row = mysql_fetch_row($qresult))
	      {
		  	if ($cur_row[0] == $chkd) $cd = "selected";
			else
			$cd = "";
		  	printf("<option value=%d class=z11 %s> %s </option>",$cur_row[0],$cd,$cur_row[1]);
	      }
	   }
	   else
	   {
	   		printf("<option value=-1 class=z11> %s </option>",NO_OPERATORS_AVAILABLE);
	   }
	
	}
}

?>
