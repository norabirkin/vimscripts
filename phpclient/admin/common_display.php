<?php
// +----------------------------------------------------------------------
// | PHP Source
// +----------------------------------------------------------------------
// | Copyright (C) 2005 by Diver <tilikov@lanbilling.ru>
// +----------------------------------------------------------------------
// |
// | Copyright: See COPYING file that comes with this distribution
// +----------------------------------------------------------------------
//

function showMenu($menu_ar, $menu_punkts, $logo=0)
{
   if($logo == 0) $padd = 100;
   else $padd=10;
   generateMenu($menu_ar, $menu_punkts);

   echo "<SCRIPT language=\"JavaScript\" src=\"js/menu_js.js\"></SCRIPT> \n";
   echo "<SCRIPT language=\"JavaScript\" src=\"js/time_funcs.js\"></SCRIPT> \n";
   echo "<TABLE cellpadding=\"0\" cellspacing=\"0\" style=\"position: absolute; top: ".($padd+20)."px; left: 4px; width: 990px; display: block;\"> \n <TR>\n";

   $iter = 1;
   foreach($menu_ar as $key=>$value)
   {
      $add_param = "";

      if(isset($menu_punkts[$key]) && is_array($menu_punkts[$key]))
      {
         $add_param = "onclick=\"CheckEvent($iter);\"";
      }
      else
      {
         $add_param = "onclick=\"smbClicked('$key');\"";
      }
      echo "<TD id=m$iter $add_param class=menu1 onmouseover=\"mOver($iter)\" onmouseout=\"mOut($iter)\">$value</TD>\n";
      $iter++;
   }
   echo "</TR></TABLE>\n";
   unset($iter);
   unset($add_param);

   $start_pad = 3;
   $iter1 = 1;
   foreach($menu_ar as $key=>$value)
   {
      if(isset($menu_punkts[$key]) && is_array($menu_punkts[$key]))
      {
         echo "<DIV id=sm$iter1 style=\"position: absolute; top: ".($padd+41)."px; left: ".$start_pad."px; width: 150px; display: none; z-index: 2000;\">
               <TABLE cellpadding=\"0\" cellspacing=\"0\" width=\"100%\">\n";

         $iter2 = 1;
         foreach($menu_punkts[$key] as $key=>$value)
         {
            echo "<TR>
                     <TD id=smb".$iter1.$iter2." class=\"sub_menu\" onmouseover=\"smbOver($iter2);\" onmouseout=\"smbOut($iter2);\" onclick=\"smbClicked('$key');\">&nbsp;&nbsp;&nbsp;$value</TD>
                  </TR>";
            $iter2++;
         }
         echo "</TABLE>\n</DIV>\n</form>";
      }
      $iter1++;
      $start_pad += 142;
   }
?>
   <DIV style="position: absolute; width: 991px; left: 4px; top: <?php echo $padd+60; ?>px;">

<?php

}

function showTimeLimit($st_pos, $fields, $dir)
//Данная функция выводит форму заполнения временного периода
//$st_pos-верхняя и левая координата выводимого блока
//$fields-имена полей,данных полям ввода
//0-year,1-month,2-day,3-hour,4-minute,5-secund
{
switch($_SESSION['time_limit'][$dir][$fields[1]])
{
   case '1':case '01': $month_name = JANUARY; break;
   case '2':case '02': $month_name = FEBRUARY; break;
   case '3':case '03': $month_name = MARCH; break;
   case '4':case '04': $month_name = APRIL; break;
   case '5':case '05': $month_name = MAY; break;
   case '6':case '06': $month_name = JUNE; break;
   case '7':case '07': $month_name = JULY; break;
   case '8':case '08': $month_name = AUGUST; break;
   case '9':case '09': $month_name = SEPTEMBER; break;
   case '10': $month_name = OCTOBER; break;
   case '11': $month_name = NOVEMBER; break;
   case '12': $month_name = DECEMBER; break;
   case -1: $month_name = MONTH;
}
if($_SESSION['time_limit'][$dir][$fields[0]] == -1) $year_n = YEAR;
else $year_n = $_SESSION['time_limit'][$dir][$fields[0]];
if($_SESSION['time_limit'][$dir][$fields[2]] == -1) $day_n = DAY;
else $day_n = $_SESSION['time_limit'][$dir][$fields[2]];
if($_SESSION['time_limit'][$dir][$fields[3]] == -1) $hour_n = N_HOUR;
else $hour_n = $_SESSION['time_limit'][$dir][$fields[3]];
if($_SESSION['time_limit'][$dir][$fields[4]] == -1) $minute_n = N_MINUTE;
else $minute_n = $_SESSION['time_limit'][$dir][$fields[4]];
if($_SESSION['time_limit'][$dir][$fields[5]] == -1) $secund_n = N_SECUND;
else $secund_n = $_SESSION['time_limit'][$dir][$fields[5]];

printf("<div name=time_div style=\"position: relative; top: %dpx; left: %dpx; display: block;\">
      <table>
      <tr>", $st_pos[0], $st_pos[1]);
printf("
   <td class=z11 align=right><input type=\"text\" size=7 id=%s name=%s class=z11 align=right readonly style=\"height: 19px; padding: 0; margin: 0;\" value='%s'></td>
   <td class=z11 align=left><img src=\"images/sel_open.gif\" height=19 name=\"i_%s\" onClick=\"checkClicked('%s')\" hspace=0></td>
   <td class=z11><input type=\"text\" size=7 id=%s name=%s class=z11 align=right readonly style=\"height: 19px; padding: 0; margin: 0;\" value='%s'></td>
   <td class=z11 align=left><img src=\"images/sel_open.gif\" height=19 name=\"i_%s\" onClick=\"checkClicked('%s')\" hspace=0></td>
   <td class=z11><input type=\"text\" size=7 id=%s name=%s class=z11 align=right readonly style=\"height: 19px; padding: 0; margin: 0;\" value='%s'></td>
   <td class=z11 align=left><img src=\"images/sel_open.gif\" height=19 name=\"i_%s\" onClick=\"checkClicked('%s')\" hspace=0></td>
</tr>
<tr>
   <td class=z11><input type=\"text\" size=7 id=%s name=%s class=z11 align=right readonly style=\"height: 19px; padding: 0; margin: 0;\" value='%s'></td>
   <td class=z11 align=left><img src=\"images/sel_open.gif\" height=19 name=\"i_%s\" onClick=\"checkClicked('%s')\" hspace=0></td>
   <td class=z11><input type=\"text\" size=7 id=%s name=%s class=z11 align=right readonly style=\"height: 19px; padding: 0; margin: 0;\" value='%s'></td>
   <td class=z11 align=left><img src=\"images/sel_open.gif\" height=19 name=\"i_%s\" onClick=\"checkClicked('%s')\" hspace=0></td>
   <td class=z11><input type=\"text\" size=7 id=%s name=%s class=z11 align=right readonly style=\"height: 19px; padding: 0; margin: 0;\" value='%s'></td>
   <td class=z11 align=left><img src=\"images/sel_open.gif\" height=19 name=\"i_%s\" onClick=\"checkClicked('%s')\" hspace=0></td>
</tr>
</table>",
$fields[0],$fields[0],$year_n,$fields[0],$fields[0],
$fields[1],$fields[1],$month_name,$fields[1],$fields[1],
$fields[2],$fields[2],$day_n,$fields[2],$fields[2],
$fields[3],$fields[3],$hour_n,$fields[3],$fields[3],
$fields[4],$fields[4],$minute_n,$fields[4],$fields[4],
$fields[5],$fields[5],$secund_n,$fields[5],$fields[5]);

printf("
<div id=\"f_%s\" style=\"position: absolute; top: 22px; left: 3px; display: none; background-color: #e0e0e0; width: 65px; border: solid 1px #e0e0e0; height: 197px; overflow: auto;\">
<table width=100%% cellpadding=0 cellspacing=0>
%s
</table>
</div>
<div id=\"f_%s\" style=\"position: absolute; top: 22px; left: 88px; display: none; background-color: #e0e0e0; width: 85px; border: solid 1px #e0e0e0; height: 197px; overflow: auto;\">
<table width=100%% cellpadding=0 cellspacing=0>
%s
</table>
</div>
<div id=\"f_%s\" style=\"position: absolute; top: 22px; left: 174px; display: none; background-color: #e0e0e0; width: 65px; border: solid 1px #e0e0e0; height: 197px; overflow: auto;\">
<table width=100%% cellpadding=0 cellspacing=0>
%s
</table>
</div>
<div id=\"f_%s\" style=\"position: absolute; top: 46px; left: 3px; display: none; background-color: #e0e0e0; width: 65px; border: solid 1px #e0e0e0; height: 197px; overflow: auto;\">
<table width=100%% cellpadding=0 cellspacing=0>
%s
</table>
</div>
<div id=\"f_%s\" style=\"position: absolute; top: 46px; left: 88px; display: none; background-color: #e0e0e0; width: 65px; border: solid 1px #e0e0e0; height: 197px; overflow: auto;\">
<table width=100%% cellpadding=0 cellspacing=0>
%s
</table>
</div>
<div id=\"f_%s\" style=\"position: absolute; top: 46px; left: 174px; display: none; background-color: #e0e0e0; width: 85px; border: solid 1px #e0e0e0; height: 197px; overflow: auto;\">
<table width=100%% cellpadding=0 cellspacing=0>
%s
</table>
</div>",
$fields[0], yearSel($fields[0]),$fields[1], monthSel($fields[1]), $fields[2], dhmsSel(1, $fields[2]),
$fields[3], dhmsSel(2, $fields[3]), $fields[4], dhmsSel(3, $fields[4]),
$fields[5], dhmsSel(4, $fields[5]));

printf("\n</div>\n");
}

function yearSel($fname, $asd="") //Генерация предела выборки года
{
$start_y = 2000;
$finish_y = 2010;
$result = "<TR><TD align=center bgcolor=#ffffff><A href=\"JavaScript: sel_clicked('".YEAR."', '$fname');\" class=sel_m>".YEAR."</A></TD></TR>\n";

for($i=$start_y; $i <= $finish_y; $i++)
{
   $result .= "<TR><TD align=center $asd bgcolor=#ffffff><A href=\"JavaScript: sel_clicked('$i', '$fname');\" class=sel_m>$i</A></TD></TR>\n";
}
return $result;
}

function monthSel($fname, $asd="") //Генерация предела выборки месяца
{
   $result = "<TR><TD align=center class=z11 style=\"width: 100%;\"><A href=\"JavaScript: sel_clicked('".MONTH."', '$fname');\" class=sel_m>".MONTH."</A></TD></TR>\n";

   $result .= "<TR><TD align=center bgcolor=#ffffff class=z11 style=\"width: 100%;\"><A href=\"JavaScript: sel_clicked('".JANUARY."', '$fname');\" class=sel_m>".JANUARY."</A></TD></TR>\n";
   $result .= "<TR><TD align=center bgcolor=#ffffff class=z11 style=\"width: 100%;\"><A href=\"JavaScript: sel_clicked('".FEBRUARY."', '$fname');\" class=sel_m>".FEBRUARY."</A></TD></TR>\n";
   $result .= "<TR><TD align=center bgcolor=#ffffff class=z11 style=\"width: 100%;\"><A href=\"JavaScript: sel_clicked('".MARCH."', '$fname');\" class=sel_m>".MARCH."</A></TD></TR>\n";
   $result .= "<TR><TD align=center bgcolor=#ffffff class=z11 style=\"width: 100%;\"><A href=\"JavaScript: sel_clicked('".APRIL."', '$fname');\" class=sel_m>".APRIL."</A></TD></TR>\n";
   $result .= "<TR><TD align=center bgcolor=#ffffff class=z11 style=\"width: 100%;\"><A href=\"JavaScript: sel_clicked('".MAY."', '$fname');\" class=sel_m>".MAY."</A></TD></TR>\n";
   $result .= "<TR><TD align=center bgcolor=#ffffff class=z11 style=\"width: 100%;\"><A href=\"JavaScript: sel_clicked('".JUNE."', '$fname');\" class=sel_m>".JUNE."</A></TD></TR>\n";
   $result .= "<TR><TD align=center bgcolor=#ffffff class=z11 style=\"width: 100%;\"><A href=\"JavaScript: sel_clicked('".JULY."', '$fname');\" class=sel_m>".JULY."</A></TD></TR>\n";
   $result .= "<TR><TD align=center bgcolor=#ffffff class=z11 style=\"width: 100%;\"><A href=\"JavaScript: sel_clicked('".AUGUST."', '$fname');\" class=sel_m>".AUGUST."</A></TD></TR>\n";
   $result .= "<TR><TD align=center bgcolor=#ffffff class=z11 style=\"width: 100%;\"><A href=\"JavaScript: sel_clicked('".SEPTEMBER."', '$fname');\" class=sel_m>".SEPTEMBER."</A></TD></TR>\n";
   $result .= "<TR><TD align=center bgcolor=#ffffff class=z11 style=\"width: 100%;\"><A href=\"JavaScript: sel_clicked('".OCTOBER."', '$fname');\" class=sel_m>".OCTOBER."</A></TD></TR>\n";
   $result .= "<TR><TD align=center bgcolor=#ffffff class=z11 style=\"width: 100%;\"><A href=\"JavaScript: sel_clicked('".NOVEMBER."', '$fname');\" class=sel_m>".NOVEMBER."</A></TD></TR>\n";
   $result .= "<TR><TD align=center bgcolor=#ffffff class=z11 style=\"width: 100%;\"><A href=\"JavaScript: sel_clicked('".DECEMBER."', '$fname');\" class=sel_m>".DECEMBER."</A></TD></TR>\n";

   return $result;
}

function dhmsSel($param, $fname)
//Генерация пределов выборки дня(1), часа(2), минут(3), секунд(4)
{
   if($param == 1) {$len = 31; $start=1; $first=DAY;}
   if($param == 2) {$len = 23; $start=0; $first=N_HOUR;}
   if($param == 3) {$len = 59; $start=0; $first=N_MINUTE;}
   if($param == 4) {$len = 59; $start=0; $first=N_SECUND;}

   $result = "<TR><TD align=center bgcolor=#ffffff><A href=\"JavaScript: sel_clicked('$first', '$fname');\" class=sel_m>$first</A></TD></TR>\n";

   for($i=$start; $i <= $len; $i++)
   {
     $result .= "<TR><TD align=center bgcolor=#ffffff><A href=\"JavaScript: sel_clicked('$i', '$fname');\" class=sel_m>$i</A></TD></TR>\n";
   }
   return $result;
}

function showTimeLimit2($st_pos, $fields, $dir, $add_var=1, $sub=0)
//Укороченный вариант (убраны поля минуты и секунды)
{
if($add_var == 2)
{
   $hour_display = "display: none;";
}
elseif($add_var == 3)
{
   $hour_display = "display: none;";
   $day_display = "display: none;";
}
else
{
   $hour_display = "";
   $day_display = "";
}

if($_POST['devision'] == 14)
{
   $month_switch = $_POST['month'];
}
elseif($_POST['devision'] == 14)
{
   $month_switch = $_POST['exp_rep1_month'];
}
else
   $month_switch=$_SESSION['time_limit'][$dir][$fields[1]];

switch($month_switch)
{
   case '1':case '01': $month_name = JANUARY; break;
   case '2':case '02': $month_name = FEBRUARY; break;
   case '3':case '03': $month_name = MARCH; break;
   case '4':case '04': $month_name = APRIL; break;
   case '5':case '05': $month_name = MAY; break;
   case '6':case '06': $month_name = JUNE; break;
   case '7':case '07': $month_name = JULY; break;
   case '8':case '08': $month_name = AUGUST; break;
   case '9':case '09': $month_name = SEPTEMBER; break;
   case '10': $month_name = OCTOBER; break;
   case '11': $month_name = NOVEMBER; break;
   case '12': $month_name = DECEMBER; break;
   case -1: $month_name = MONTH;
}
if($_SESSION['time_limit'][$dir][$fields[0]] == -1) $year_n = YEAR;
else $year_n = $_SESSION['time_limit'][$dir][$fields[0]];
if($_SESSION['time_limit'][$dir][$fields[2]] == -1) $day_n = DAY;
else $day_n = $_SESSION['time_limit'][$dir][$fields[2]];
if($_SESSION['time_limit'][$dir][$fields[3]] == -1) $hour_n = N_HOUR;
else $hour_n = $_SESSION['time_limit'][$dir][$fields[3]];

if($_POST['devision'] == 14)
{
   $year_n = $_POST['year'];
   $day_n = $_POST['day'];
}
if($_POST['devision'] == 90)
{
   $year_n = $_POST['exp_rep1_year'];
}

printf("<div name=time_div style=\"position: relative; top: %dpx; left: %dpx; display: block;\">
      <table bgcolor=#FFFFF cellpadding=0 cellspacing=0 border=0 height=25>
      <tr>", $st_pos[0], $st_pos[1]);
printf("
   <td class=z11 align=right><input type=\"text\" size=7 id=%s name=%s class=z11 align=right readonly style=\"height: 19px; padding: 0; margin: 0;\" value='%s'></td>
   <td class=z11 align=left><img src=\"images/sel_open.gif\" height=19 name=\"i_%s\" onClick=\"checkClicked('%s')\" hspace=0></td>
   <td class=z11><input type=\"text\" size=7 id=%s name=%s class=z11 align=right readonly style=\"height: 19px; padding: 0; margin: 0;\" value='%s'></td>
   <td class=z11 align=left><img src=\"images/sel_open.gif\" height=19 name=\"i_%s\" onClick=\"checkClicked('%s')\" hspace=0></td>
   <td class=z11 style=\"%s\"><input type=\"text\" size=7 id=%s name=%s class=z11 align=right readonly style=\"height: 19px; padding: 0; margin: 0; \" value='%s'></td>
   <td class=z11 align=left style=\"%s\"><img src=\"images/sel_open.gif\" height=19 name=\"i_%s\" onClick=\"checkClicked('%s')\" hspace=0></td>
   <td class=z11 style=\"%s\"><input type=\"text\" size=7 id=%s name=%s class=z11 align=right readonly style=\"height: 19px; padding: 0; margin: 0;\" value='%s'></td>
   <td class=z11 align=left style=\"%s\"><img src=\"images/sel_open.gif\" height=19 name=\"i_%s\" onClick=\"checkClicked('%s')\" hspace=0></td>
</tr>
</table>",
$fields[0],$fields[0],$year_n,$fields[0],$fields[0],
$fields[1],$fields[1],$month_name,$fields[1],$fields[1],
$day_display, $fields[2],$fields[2],$day_n,$day_display,$fields[2],$fields[2],
$hour_display,$fields[3],$fields[3],$hour_n,$hour_display,$fields[3],$fields[3]);

printf("
<div id=\"f_%s\" style=\"position: absolute; top: 22px; left: 1px; display: none; 
background-color: #e0e0e0; width: 65px; border: solid 1px #e0e0e0; height: 135px; overflow: auto;  z-index:
1000000;\">
<table width=100%% cellpadding=0 cellspacing=0 bgcolor=#FFFFF>
%s
</table>
</div>
<div id=\"f_%s\" style=\"position: absolute; top: 22px; left: 80px; display: none; 
background-color: #e0e0e0; width: 85px; border: solid 1px #e0e0e0; height: 135px; overflow: auto;  z-index: 1000000;\">
<table width=100%% cellpadding=0 cellspacing=0 bgcolor=#FFFFF>
%s
</table>
</div>
<div id=\"f_%s\" style=\"position: absolute; top: 22px; left: 162px; display: none; 
background-color: #e0e0e0; width: 65px; border: solid 1px #e0e0e0; height: 135px; overflow: auto;  z-index:
1000000;\">
<table width=100%% cellpadding=0 cellspacing=0 bgcolor=#FFFFF>
%s
</table>
</div>
<div id=\"f_%s\" style=\"position: absolute; top: 22px; left: 260px; display: none; 
background-color: #e0e0e0; width: 65px; border: solid 1px #e0e0e0; height: 140px; overflow: auto;  z-index:
1000000;\">
<table width=100%% cellpadding=0 cellspacing=0 bgcolor=#FFFFFF>
%s
</table>
</div>",
$fields[0], yearSel($fields[0]),$fields[1], monthSel($fields[1]), $fields[2], dhmsSel(1, $fields[2]),
$fields[3], dhmsSel(2, $fields[3]));

printf("\n</div>\n");
}

function statMethod()
//Вывод радио-буттонов для выбора способа вывода статистики
{
if(isset($_POST['stat_method']) && !empty($_POST['stat_method']))
   $stat_method = $_POST['stat_method'];
else
   $stat_method = 1;
$rad_names = array(S_FACTS,S_USERS,S_VGROUPS,S_ADDRESS);
$res_string = "<TABLE cellpadding=0 cellspacing=0 border=0><TR>";
for($i=1; $i<=4; $i++)
{
   if($i == $stat_method) $asd = "checked";
   elseif(($_POST['what_stat'] == 2 || $_POST['what_stat'] == 3 || $_POST['what_stat'] == 4) && $i==4)
    $asd = "disabled";
   else
    $asd = "";
   $res_string .= sprintf("<TD class=z11><input type=radio name=stat_method value=%d %s 
               onClick=\"document.forms[1].stat1_method.value=%d;
               document.forms[1].whatpressed.value=85;
               document.forms[1].submit();\">%s</TD>",$i, $asd, $i,$rad_names[$i-1]);
}

$res_string .= "</TR></TABLE>";
return $res_string;
}

function showPageValSel($mode=0)
//Вывод селекта для выбора кол-ва отображаемых записей на странице
{
   if($_POST['devision'] == 201)
      $for_predstav = " onChange=\"document.forms[1].submit();\"";
   else
      $for_predstav = "";

      if($mode==1) $ret_res = sprintf("<font class=z11>".MOVE_TO_DAY_START."</font>
         <input type=checkbox name=start_from_zero 
         onClick=\"activate_zero(this.form);\" %s>&nbsp;&nbsp;&nbsp;&nbsp;", 
         ($_POST['start_from_zero'])?"checked":"");
      else $ret_res = "";
   $current = $_SESSION['rows_on_page'];
   $arr = array(10, 25, 50, 100, 500);
   $ret_res .= "<font class=z11>".TOSHOW."&nbsp;".ZAPNASTR."&nbsp;</font>"."
   <select name=rows_on_page class=z11 $for_predstav>";
   for($i=0; $i<5; $i++)
   {
      if($arr[$i] == $current)
         $asd="selected";
      else
         $asd="";
      $ret_res .= "<option ".$asd." value=".$arr[$i]." class=z11>".$arr[$i];
   }
   if(100000 == $current)
         $asd="selected";
   else
         $asd="";
   $ret_res .= "<option ".$asd." value=100000 class=z11>".ALL;
      
   $ret_res .= "</select>";

   return $ret_res;

}


function show_predstav_sel($descriptor)
//Выводим список представителей (пока только в объединениях)
{
    $res_str = "<option class=z11 value=0>".DEF_PREDSTAV;
    $query = "select oper_id, name from operators";
    $result = mysql_query($query, $descriptor);
    $asd = "";

    while($row = mysql_fetch_row($result))
    {
      if(isset($_POST['predstav_l']) && $_POST['predstav_l'] == $row[0])
         $asd = "selected";
      else
         $asd = "";
      $res_str .= "<option class=z11 value=".$row[0]." ".$asd.">".$row[0].", ".$row[1];
    }

    return $res_str;

}


function show_predstav_sel2($descriptor)
//Выводим список представителей (пока только в объединениях)
{
      $qstring=sprintf("select oper_id from catalog where cat_id=$descriptor");
	  //echo $qstring;
      $result1=mysql_query($qstring);
      $table_row1=mysql_fetch_row($result1);
	  $predtav_id2=$table_row1[0];
    $res_str = "<option class=z11 value=0>".DEF_PREDSTAV;
    $query = "select oper_id, name from operators";
    $result = mysql_query($query);
    $asd = "";

    while($row = mysql_fetch_row($result))
    {
      if(isset($predtav_id2) && $predtav_id2 == $row[0])
         $asd = "selected";
      else
         $asd = "";
      $res_str .= "<option class=z11 value=".$row[0]." ".$asd.">".$row[0].", ".$row[1];
    }

    return $res_str;

}



function show_tarrifs_sel($descriptor, $used=0)
{
   $res_str = "<option class=z11 value=0>".DEF_PREDSTAV1;
   $query = "select tar_id, descr from tarifs where archive=0";
   $result = mysql_query($query, $descriptor);
   $asd = "";
   
    while($row = mysql_fetch_row($result))
    {
      if($used == $row[0])
         $asd = "selected";
      else
         $asd = "";
      $res_str .= "<option class=z11 value=".$row[0]." ".$asd.">".$row[0].". ".$row[1];
    }
      
   return $res_str;
}

function showTimeSelect($post_params)
{
   echo "<table cellpadding=0 cellspacing=0 border=0 align=center width=100%>";
   echo "<tr>";
   echo "<td class=z11 width=33% align=center>";
   printf("<select class=z11 name='%s' style=\"width: 80px;\">", $post_params[0]);
   printf("<option class=z11 value=-1>%s", YEAR);
   for($i=2005; $i<=2015; ++$i)
      printf("<option class=z11 value=%d>%04d\n", $i, $i);
   echo "</select>";
   echo "</td>";
   echo "<td class=z11 width=33% align=center>";
   printf("<select class=z11 name='%s' style=\"width: 80px;\">", $post_params[1]);
   printf("<option class=z11 value=-1>%s\n", MONTH);
   printf("<option class=z11 value='01'>%s\n", JANUARY);
   printf("<option class=z11 value='02'>%s\n", FEBRUARY);
   printf("<option class=z11 value='03'>%s\n", MARCH);
   printf("<option class=z11 value='04'>%s\n", APRIL);
   printf("<option class=z11 value='05'>%s\n", MAY);
   printf("<option class=z11 value='06'>%s\n", JUNE);
   printf("<option class=z11 value='07'>%s\n", JULY);
   printf("<option class=z11 value='08'>%s\n", AUGUST);
   printf("<option class=z11 value='09'>%s\n", SEPTEMBER);
   printf("<option class=z11 value='10'>%s\n", OCTOBER);
   printf("<option class=z11 value='11'>%s\n", NOVEMBER);
   printf("<option class=z11 value='12'>%s\n", DECEMBER);
   echo "</select>";
   echo "</td>";
   echo "<td class=z11 width=33% align=center>";
   printf("<select class=z11 name='%s' style=\"width: 80px;\">", $post_params[2]);
   printf("<option class=z11 value=-1>%s", DAY);
   for($i=1; $i<32; ++$i)
      printf("<option class=z11 value=%d>%02d\n", $i, $i);
   echo "</select>";
   echo "</td>";
   echo "</tr>";
   
   echo "<tr>";
   echo "<td class=z11 width=33% align=center>";
   printf("<select class=z11 name='%s' style=\"width: 80px;\">", $post_params[3]);
   printf("<option class=z11 value=-1>%s", HOUR);
   for($i=0; $i<=23; ++$i)
      printf("<option class=z11 value=%d>%02d\n", $i, $i);
   echo "</select>";
   echo "</td>";
   echo "<td class=z11 width=33% align=center>";
   printf("<select class=z11 name='%s' style=\"width: 80px;\">", $post_params[4]);
   printf("<option class=z11 value=-1>%s\n", MINUTE);
   for($i=0; $i<60; ++$i)
      printf("<option class=z11 value=%d>%02d\n", $i, $i);
   echo "</select>";
   echo "</td>";
   echo "<td class=z11 width=33% align=center>";
   printf("<select class=z11 name='%s' style=\"width: 80px;\">", $post_params[5]);
   printf("<option class=z11 value=-1>%s", SECOND);
   for($i=0; $i<60; ++$i)
      printf("<option class=z11 value=%d>%02d\n", $i, $i);
   echo "</select>";
   echo "</td>";
   echo "</tr>";
   echo "</table>";	
}

?>
