<?
/********************************************************************
   filename:   reports.php
   modified:   January 27 2005 20:35:18.
   author:     LANBilling

   version:    LANBilling 1.8
*********************************************************************/
include ("localize.php");

if (!session_is_registered("auth"))
{
   exit;
}

include_once('ip_stat_api.php');

$temp_time_array = ($_SESSION['time_limit']);
unset($_SESSION['time_limit']);
checkPost();

if(!isset($_SESSION['time_limit'])) time_init();

   $qstring = sprintf("select actuality from share");
   $qresult=mysql_query($qstring);

   $table_row=mysql_fetch_row($qresult);
   $actuality=time()-$table_row[0]*86400;
    mysql_free_result ( $result );
?>
<script language="JavaScript">
var w1=window;
var xcel=0;
window.onfocus = function()
{
   if(w1.closed == true)
   {
   // w1.close();
   // if(xcel == 1)
   // {
      for(var i=0;i<document.forms[1].pokazat.length;i++)
      document.forms[1].pokazat[i].disabled = false;
   // xcel=0;
   // }
   }
}
function active_rep ( url, repnum )
{
   if(repnum == 1)
   {
      if(document.forms[1].rep_typ1.value == '<?PHP echo NEW_WINDOW?>' || document.forms[1].rep_typ1.value == '<?PHP echo EXCEL?>')
      {
         w1=window.open ('','_rep','width=1535,height=600,resizable=yes,status=no,menubar=yes,scrollbars=yes');
         w1.focus();
         document.forms[1].action = 'report.php';
      }
      else
      {
         document.forms[1].target = "_self";
      }
   document.forms[1].submit();
   return;
   }
   else if(repnum == 2)
   {
      if(document.forms[1].rep_typ2.value == '1' || document.forms[1].rep_typ2.value == '2')
      {
         w1=window.open ('','_rep','width=740,height=600,resizable=yes,status=no,menubar=yes,scrollbars=yes');
         w1.focus();
         document.forms[1].det_rep.value = 1;
         document.forms[1].action = 'report2.php';
      }
         else
      {
         document.forms[1].target = "_self";
      }
   document.forms[1].submit();
   return;
   }
   else if(repnum == 3)
   {
   if(document.forms[1].rep_typ3.value == '<?PHP echo NEW_WINDOW?>' || document.forms[1].rep_typ3.value == '<?PHP echo EXCEL?>')
      {
         w1=window.open ('','_rep','width=740,height=600,resizable=yes,status=no,menubar=yes,scrollbars=yes');
         w1.focus();
         document.forms[1].action = 'report3.php';
      }
      else
      {
         document.forms[1].target = "_self";
      }
   document.forms[1].submit();
   return;
   }
   else if(repnum == 4)
   {
   document.forms[1].target = '_self';
   document.forms[1].submit();
   return;
   }
   else if(repnum == 5)
   {
   document.forms[1].exp_rep2_on.value = '1';
   document.forms[1].target = '_self';
   document.forms[1].submit();
   return;
   }
   else if(repnum == 6)
   {
   if(document.forms[1].rep_typ6.value == '<?PHP echo NEW_WINDOW?>' || document.forms[1].rep_typ6.value == '<?PHP echo EXCEL?>')
      {
         w1=window.open ('','_rep','width=740,height=600,resizable=yes,status=no,menubar=yes,scrollbars=yes');
         w1.focus();
         document.forms[1].action = 'report4.php';
      }
      else
      {
         document.forms[1].target = "_self";
      }
   document.forms[1].submit();
   return;
   }
   else if(repnum == 7)
   {
      document.forms[1].exp_rep2_on.value = '2';
      document.forms[1].target = '_self';
      document.forms[1].submit();      
   }
   else if(repnum == 8)
   { 
      document.forms[1].exp_rep2_on.value = '3';
      document.forms[1].target = '_self';
      document.forms[1].submit();      
   }     
   else
   {
   document.forms[1].target = '_self';
   document.forms[1].submit();
   return;
   }
}

</script>
<?php

if(isset($_POST['exp_rep1_month'])) $_POST['exp_rep1_month'] = antiConvertMonth($_POST['exp_rep1_month']);
else $_POST['exp_rep1_month'] = 0;
if($_POST['exp_rep1_month'] < 10 && strlen($_POST['exp_rep1_month']) < 2) $_POST['exp_rep1_month'] = '0'.$_POST['exp_rep1_month'];
if(isset($_POST['exp_rep1_year']) && $_POST['exp_rep1_year'] == YEAR) $_POST['exp_rep1_year'] = -1;
elseif (!isset($_POST['exp_rep1_year'])) $_POST['exp_rep1_year'] = -1;
if($_POST['exp_prog'] == D_TYPE_PARUS) $_POST['exp_prog'] =2;
else $_POST['exp_prog'] = 1;

if(isset($_POST['exp_rep2_month'])) $_POST['exp_rep2_month'] = antiConvertMonth($_POST['exp_rep2_month']);
else $_POST['exp_rep2_month'] = 0;
if($_POST['exp_rep2_month'] < 10 && strlen($_POST['exp_rep2_month']) < 2) $_POST['exp_rep2_month'] = '0'.$_POST['exp_rep2_month'];
if(isset($_POST['exp_rep2_year']) && $_POST['exp_rep2_year'] == YEAR) $_POST['exp_rep2_year'] = -1;
elseif (!isset($_POST['exp_rep2_year'])) $_POST['exp_rep2_year'] = -1;
if($_POST['exp_type'] == ONBEGIN) $_POST['exp_type'] =1;
else $_POST['exp_type'] = 0;

if(isset($_POST['rep1_month'])) $_POST['rep1_month'] = antiConvertMonth($_POST['rep1_month']);
else $_POST['rep1_month'] = 0;
if($_POST['rep1_month'] < 10 && strlen($_POST['rep1_month']) < 2) $_POST['rep1_month'] = '0'.$_POST['rep1_month'];
if(isset($_POST['rep1_year']) && $_POST['rep1_year'] == YEAR) $_POST['rep1_year'] = -1;
elseif (!isset($_POST['rep1_year'])) $_POST['rep1_year'] = -1;
if($_POST['rep_typ1'] == NEW_WINDOW) $_POST['rep_typ1'] =1;
else $_POST['rep_typ1'] = 2;

if(isset($_POST['rep6_month'])) $_POST['rep6_month'] = antiConvertMonth($_POST['rep6_month']);
else $_POST['rep6_month'] = 0;
if($_POST['rep6_month'] < 10 && strlen($_POST['rep6_month']) < 2) $_POST['rep6_month'] = '0'.$_POST['rep6_month'];
if(isset($_POST['rep6_year']) && $_POST['rep6_year'] == YEAR) $_POST['rep6_year'] = -1;
elseif (!isset($_POST['rep6_year'])) $_POST['rep6_year'] = -1;
if($_POST['rep_typ6'] == NEW_WINDOW) $_POST['rep_typ6'] =1;
else $_POST['rep_typ6'] = 2;

if(isset($_POST['rep3_month'])) $_POST['rep3_month'] = antiConvertMonth($_POST['rep3_month']);
else $_POST['rep3_month'] = 0;
if($_POST['rep3_month'] < 10 && strlen($_POST['rep3_month']) < 2) $_POST['rep3_month'] = '0'.$_POST['rep3_month'];
if(isset($_POST['rep3_year']) && $_POST['rep3_year'] == YEAR) $_POST['rep3_year'] = -1;
elseif (!isset($_POST['rep3_year'])) $_POST['rep3_year'] = -1;
if($_POST['rep_typ3'] == NEW_WINDOW) $_POST['rep_typ3'] =1;
else $_POST['rep_typ3'] = 2;

// генерируем счета за отчетный пероид
if($_POST['exp_rep2_on']==1)
   {
         $YYY = date("Y");
         $MMM = date("m");
         $DDD = date("d");
   
         if($_POST['year'] == -1 || $_POST['year'] == YEAR || $_POST['month'] == 0 || $_POST['day'] == DAY)
         {
            $date_in = 0;
         }
         else 
         {            
            $date_in = $_POST['year'].$_POST['month'].$_POST['day'];
         }
        
      $al->log_action(66,0,0);
      if($_POST['exp_rep2_year']!='-1' && $_POST['exp_rep2_month']!='-1')
      {
      
         $cmd_str = sprintf(" -D %s%s -P 1 -M 2 ", $_POST['exp_rep2_year'],$_POST['exp_rep2_month']);
         if($date_in != 0) $cmd_str .= " -O ".$date_in;
         
         //echo $cmd_str."<br />";
         export_report1($_POST['exp_rep2_year'],$_POST['exp_rep2_month'],$_POST['exp_type'],$serveraddress,4, $date_in, $cmd_str);
      }
      else
      {
         die("<center><font clas=z11>".ORDER_CREATING_ERR1."</font></center>");
      }
   }
   else if($_POST['exp_rep2_on'] == 2) // Генерируем акты
   {
      $act_gen_status = 0;
      
      if($_POST['act_gen_year'] == YEAR || $_POST['act_gen_month'] == MONTH) 
          die("<center><font class=z11>".ERR_GEN_ACT_FILL."</font></center><br />");
      $act_gen_month = antiConvertMonth($_POST['act_gen_month']);
      if(intval($_POST['act_gen_year'].(($act_gen_month < 10 && strlen($act_gen_month) == 1) ? '0'.$act_gen_month : $act_gen_month)) >= date("Ym"))
          die("<center><font class=z11>".ERR_GEN_ACT_MONTH."</font></center><br />");
          if(strlen($act_gen_month) != 2) $act_gen_month = '0'.$act_gen_month;
               
          $cmd_line = sprintf(" -D %04d%02d -M 2 -P 3 ", $_POST['act_gen_year'], $act_gen_month);
          
          export_report1(0,0,$_POST['exp_type'],$serveraddress,4, $date_in, $cmd_line);

   }
   else if($_POST['exp_rep2_on'] == 3) // Генерируем счета-фактуры
   {
      $fact_gen_status = 0;

      if($_POST['gen_fact_year'] == YEAR || $_POST['gen_fact_month'] == MONTH) 
          die("<center><font class=z11>".ERR_GEN_FACT_FILL."</font></center><br />");
      $fact_gen_month = antiConvertMonth($_POST['gen_fact_month']);
      if($fact_gen_month >= date("m") && $_POST['gen_fact_year'] > date("Y"))
          die("<center><font class=z11>".ERR_GEN_FACT_MONTH."</font></center><br />");
      
      
      if(strlen($fact_gen_month) < 2) $fact_gen_month = '0'.$fact_gen_month;
      $order_date1 = $_POST['gen_fact_year'].$fact_gen_month;

      $fact_gen_month1 = $fact_gen_month; //+1;  
      if(strlen($fact_gen_month1) != 2) $fact_gen_month1 = '0'.$fact_gen_month1;
      $order_date2 = $_POST['gen_fact_year'].($fact_gen_month1);    
      
      if($_POST['t_year'] == YEAR || $_POST['t_month'] == 0 || $_POST['t_day'] == DAY || $_POST['t_year'] == -1)
          $facture_date = 0;
      else 
      {          
          $facture_date = $_POST['t_year'].'-'.$_POST['t_month'].'-'.$_POST['t_day'];  
      }
    
      if($facture_date == 0) $facture_date1="";
      else $facture_date1 = " -F ".$facture_date." ";
      $cmd_string = sprintf(" -D %s -M 2 -P 2 %s -o %d", 
                            $order_date2, 
			    $facture_date1, 
			    (!empty($_POST['gen_facts']))?intval($_POST['gen_facts']):0 
			    );
       
      
      export_report1($_POST['exp_rep2_year'],$_POST['exp_rep2_month'],$_POST['exp_type'],$serveraddress,4, $date_in, $cmd_string);           

      
   }
//экспорт  в 1С
else if($_POST['exp_rep1_year']!='-1' && $_POST['exp_rep1_month']!='-1' &&
   isset($_POST['exp_rep1_year']) && isset($_POST['exp_rep1_month']) && $_POST['exp_prog']==1)
   {
      $al->log_action(45,0,0);
      export_report1($_POST['exp_rep1_year'],$_POST['exp_rep1_month'],0,$serveraddress,3);
   }
//экспорт в парус
else if($_POST['exp_rep1_year']!='-1' && $_POST['exp_rep1_month']!='-1' &&
   isset($_POST['exp_rep1_year']) && isset($_POST['exp_rep1_month']) && $_POST['exp_prog']==2)
   {
      $al->log_action(46,0,0);
      export_report1($_POST['exp_rep1_year'],$_POST['exp_rep1_month'],1,$serveraddress,3);
   }

else
{
if($_POST["devision"] == 107)
{
   printf("<table width=990 border=0 cellspacing=0 cellpadding=0 align=center bgcolor=White
    style=\"border: solid 1px #c0c0c0; border-bottom:0px;\">");

printf("
   <tr height=20>
    <td height=20 width=100%% align=center bgcolor=#E0E0E0 style=\"border-bottom: solid 1px #c0c0c0;\">
    <b><font class=z11 size=-1>%s</font></b>
    </td>
</tr>",ORDINARY_REPORTS);

printf("<TR>
      <TD style=\"BORDER-BOTTOM: #c0c0c0 1px solid\" align=middle bgColor=#e0e0e0 height=20>
         <TABLE height=25 cellSpacing=0 cellPadding=0 width=990 align=center bgColor=#ffffff border=0>
        <TR>
        <TD align=left width=510><font class=z11 size=-1>&nbsp;&nbsp;%s</font></TD>
          <TD align=right width=25><font class=z11 size=-1>%s</font></TD>
          <TD>", REPORT1, ZA);

   $f_names = array('rep1_year', 'rep1_month', 'rep_typ1', 'pokazat');
   $values = array(NEW_WINDOW, EXCEL);
   $top = 42;
   $left = array(553, 650, 760);
   $action = "try{this.disabled=true;active_rep('report1.php',1);}catch(e){;}";

   selForSchet($f_names, $values, $action, $top, $left);
echo "</TD></TR>";

printf("<TR>
      <TD style=\"BORDER-BOTTOM: #c0c0c0 1px solid\" align=middle bgColor=#e0e0e0 height=20>
         <TABLE height=25 cellSpacing=0 cellPadding=0 width=990 align=center bgColor=#ffffff border=0>
        <TR>
        <TD align=left width=510><font class=z11 size=-1>&nbsp;&nbsp;%s</font></TD>
          <TD align=right width=25><font class=z11 size=-1>%s</font></TD>
          <TD>", REPORT3, ZA);
   $f_names = array('rep3_year', 'rep3_month', 'rep_typ3', 'pokazat');
   $values = array(NEW_WINDOW, EXCEL);
   $top = 67;
   $left = array(553, 650, 760);
   $action = "try{this.disabled=true;active_rep('report3.php',3);}catch(e){;}";

   selForSchet($f_names, $values, $action, $top, $left);
echo "</TD></TR>";

printf("<TR>
      <TD style=\"BORDER-BOTTOM: #c0c0c0 1px solid\" align=middle bgColor=#e0e0e0 height=20>
         <TABLE height=25 cellSpacing=0 cellPadding=0 width=990 align=center bgColor=#ffffff border=0>
        <TR>
        <TD align=left width=510><font class=z11 size=-1>&nbsp;&nbsp;%s</font></TD>
          <TD align=right width=25><font class=z11 size=-1>%s</font></TD>
          <TD>", REPORT4, ZA);
   $f_names = array('rep6_year', 'rep6_month', 'rep_typ6', 'pokazat');
   $values = array(NEW_WINDOW, EXCEL);
   $top = 92;
   $left = array(553, 650, 760);
   $action = "try{this.disabled=true;active_rep('report4.php',6);}catch(e){;}";

   selForSchet($f_names, $values, $action, $top, $left);
echo "</TD></TR><tr><td>";

## Month Report

printf("<table width=992 cellpadding=0 cellspacing=0 border=0>");
printf("<tr><th colspan=4 bgcolor=#e0e0e0 style=\"border: solid 1px #c0c0c0; border-top: none;\"><font class=z11>%s</font></th></tr>", INTER_SERV);
printf("<tr><td class=z11 width=20 style=\"border-bottom: solid 1px #c0c0c0; border-left: solid 1px #c0c0c0; border-right: none;\">&nbsp;</td>
        <td align=left width=600 height=50 style=\"border-bottom: solid 1px #c0c0c0;\">&nbsp;
        <select name=inter_year class=z11 style=\"width: 120px;\">
        %s
        </select>&nbsp;&nbsp;
        <select name=inter_month class=z11 style=\"width: 120px;\">
        %s
        </select>       
        </td>
        <td align=right width=450 style=\"border: solid 1px #c0c0c0; border-top: none; border-right: none;  border-left: none;\">
        <input type=button name=inter_serv OnCLick=\"inter_report();\" class=z11 style=\"width: 100px;\" value=\"%s\">
        </td><td class=z11 width=18 style=\"border-bottom: solid 1px #c0c0c0;  border-left: none; border-right: solid 1px #c0c0c0;\">&nbsp;</td></tr>
       ", gen_opt(1, $_POST['inter_year']),  gen_opt(2, $_POST['inter_month']),  FORMATE);

printf("</table></td></tr>");

##

printf("
   <tr height=20>
    <td height=20 align=center bgcolor=#E0E0E0 style=\"border-bottom: solid 1px #c0c0c0;\">
    <b><font class=z11 size=-1>%s</font></b>
    </td>
</tr>",DETAILED_REPORTS);

printf("<tr><td colspan=2 align=center bgcolor=#ffffff style=\"border-bottom: solid 1px #c0c0c0;\">
                     <table align=center cellspacing=0 cellpadding=0 border=0  width=100%%>
                     <tr>");

        echo "       <TD width=\"380\" align=\"center\">
                     <TABLE width=\"380\" cellspacing=0 cellpadding=0 border=0 
                     style=\"border-right: 1px solid #c0c0c0;\">";
        echo "<tr>
        <td align=center class=z11 width=20 bgcolor=\"#e0e0e0\" style=\"border-right: solid 1px #c0c0c0;\">C:</td>
        <td align=center width=360>";
        $fields = array('year','month','day','hour','minute','secund');
        showTimeSelect($fields);
        unset($fields);
        echo "</td></tr></TABLE></TD>";
        echo "         <TD width=\"380\" align=\"center\">
                            <TABLE width=\"380\" cellspacing=0 cellpadding=0 border=0>";
        echo "<tr>
        <td align=center class=z11 width=20 bgcolor=\"#e0e0e0\" style=\"border-right: solid 1px #c0c0c0;\">".PO_BIG.":</td>
        <td width=360 style=\"border-bottom: none;\">";
        $fields = array('t_year','t_month','t_day','t_hour','t_minute','t_secund');
        showTimeSelect($fields);
        unset($fields);
        printf("</td></tr></table></td>
                     <td align=right style=\"border-left: solid 1px #c0c0c0;\">
                     <font class=z11 size=-1>%s&nbsp;</font><input type=radio name=fi value=m onclick=set_fixed_universal_seconds_new(4,this.form)><br />
                     <font class=z11 size=-1>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;%s&nbsp;</font><input type=radio name=fi value=d onclick=set_fixed_universal_seconds_new(3,this.form)>
                     </td>
                     <td align=right>
                     <font class=z11 size=-1>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;%s&nbsp;</font><input type=radio name=fi value=w onclick=set_fixed_universal_seconds_new(2,this.form)>&nbsp;&nbsp;<br />
                     <font class=z11 size=-1>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;%s&nbsp;</font><input type=radio name=fi value=h onclick=set_fixed_universal_seconds_new(1,this.form)>&nbsp;&nbsp;
                     </td><tr>", MONTH, WEEK, DAY, HOUR);
        echo "</table></td></tr>";

    
        
 printf("<tr><td colspan=2 style=\"BORDER-BOTTOM: #c0c0c0 1px solid\">
         <table cellpadding=0 cellspacing=0 border=0>");
 
 printf("</table></td></tr>");
 printf("<TR>
      <TD colspan=2 style=\"BORDER-BOTTOM: #c0c0c0 1px solid; \" align=middle bgColor=#e0e0e0 height=30>
         <TABLE height=30 cellSpacing=0 cellPadding=0 width=990 align=center bgColor=#ffffff border=0>
        <TR>
        <TD align=left width=510 style=\"border-left:none;\"><font class=z11 size=-1>&nbsp;&nbsp;%s
        (<span class=rep_filter onClick=\"show_filter_block();\">
        <font class=z11>".ADD_FILTER_BL."...</font></span>)
        </font>        
        </TD>
          <TD align=middle width=323><font class=z11 size=-1>&nbsp;</font></TD>
        <TD align=right width=100>
        <font class=z11 size=-1>".IN_B.":&nbsp;</font></TD>", REPORT2);
 echo "
   <td class=z11 align=left>
   <select name=rep_typ2 class=z11 align=center>
   <option class=z11 value=1 ".(($_POST['rep_typ2'] == 1)?"selected":"").">".NEW_WINDOW."
   <option class=z11 value=2 ".(($_POST['rep_typ2'] == 2)?"selected":"").">".EXCEL."
   </select>
   </td>
   <td class=z11 width=50>
   &nbsp;
   </td>
";
printf("<TD align=right>
        <input type=button name=pokazat class=z11 value=%s
          onClick=\"try{this.disabled=true;active_rep('report2.php',2);}catch(e){;}\"></TD>
          <td width=20>&nbsp;</td>
          </TR></table></td></tr>", FORMATE);


// Пользовательские отчеты
$query = sprintf("SELECT DISTINCT r.report_id, r.report_name, f.filename FROM user_reports as r,
                  user_reports_files as f WHERE f.report_id=r.report_id AND r.report_act=1 AND f.is_main=1");
$result = mysql_query($query, $descriptor) or die(mysql_error());

while( ($row = mysql_fetch_row($result)))
{
 printf("<tr><td colspan=2 style=\"BORDER-BOTTOM: #c0c0c0 1px solid\">
         <table cellpadding=0 cellspacing=0 border=0>");
 
 printf("</table></td></tr>");
 printf("<TR>
      <TD colspan=2 style=\"BORDER-BOTTOM: #c0c0c0 1px solid; \" align=middle bgColor=#e0e0e0 height=30>
         <TABLE height=30 cellSpacing=0 cellPadding=0 width=990 align=center bgColor=#ffffff border=0>
        <TR>
        <TD align=left width=510 style=\"border-left:none;\"><font class=z11 size=-1>&nbsp;&nbsp;%s       
        </TD>
          <TD align=middle width=323><font class=z11 size=-1>&nbsp;</font></TD>
        <TD align=right width=100>
        <font class=z11 size=-1>".IN_B.":&nbsp;</font></TD>", stripslashes($row[1]));
 echo "
   <td class=z11 align=left>
   <select name=rep_typ".$row[0]." class=z11 align=center>
   <option class=z11 value=1 ".(($_POST['rep_typ'.$row[0]] == 1)?"selected":"").">".NEW_WINDOW."
   <option class=z11 value=2 ".(($_POST['rep_typ'.$row[0]] == 2)?"selected":"").">".EXCEL."
   </select>
   </td>
   <td class=z11 width=50>
   &nbsp;
   </td>
";
printf("<TD align=right>
        <input type=button name=pokazat%d class=z11 value=%s style=\"width: 100px; border-right: none;\"
          onClick=\"
          w1=window.open ('','_rep','width=740,height=600,resizable=yes,status=no,menubar=yes,scrollbars=yes');
          w1.focus();
          document.forms[1].action = '%s';
          document.forms[1].submit();\"></TD>
          <td width=20>&nbsp;</td>
          </TR></TABLE></TD></TR>
      ", $row[0], GEN_REP, "./users_reports/".stripslashes($row[2]));
}
// Конец пользовательских отчетов

echo "</table>";

// Дополнительный фильтр для отчета по платежам 

// Читаем доступных агентов
$query = sprintf("SELECT id, descr FROM settings");
$result = mysql_query($query, $descriptor);

$agent_arr[0] = array(0, DEF_PREDSTAV);
while( ($row = mysql_fetch_row($result)))
   $agent_arr[] = array(intval($row[0]), substr($row[1], 0, 20));

// Заполняем массив аттрибутов
$attrib_arr[0] = array(1, "login");
$attrib_arr[1] = array(2, DESCRIPTION);
$attrib_arr[2] = array(3, FIO);
$attrib_arr[3] = array(4, AGREEMENT);
$attrib_arr[4] = array(5, IPADDRESS);
$attrib_arr[5] = array(6, VG_OWN_NUMBERS);
$attrib_arr[6] = array(7, KOD_1C);

// Читаем группы пользователей либо объединения
unset($groups_arr);

if($IS_CONVERGENT)
   $query = "SELECT DISTINCT group_id, name FROM usergroups";
else 
   $query = "SELECT DISTINCT group_id, name FROM groups";
   
$result = mysql_query($query, $descriptor);
while( ($row = mysql_fetch_row($result)))
   $groups_arr[] = array($row[0], substr($row[1], 0, 40));
///////////////////////////////////////////////////////////
echo "
<script language=\"JavaScript\">
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
";

echo "<input type=hidden name=additional_filter value=0>";

echo "
       <table id=filter_add width=994 bgcolor=#FFFFFF cellpadding=0 cellspacing=0 border=0 
       align=center style=\"display: none; border: none; border-left: solid 1px #c0c0c0;
                            border-right: solid 1px #c0c0c0; border-bottom: solid 1px #c0c0c0; \">";
echo "<tr><th colspan=3 align=center bgcolor=#f5f5f5 height=25 style=\"border-bottom: solid 1px #c0c0c0; border-top:none;\">
          <font class=z11>".ADD_FILTER_BL2."</font>
          </th></tr>";

echo "<tr><td width=180 height=30 class=z11 align=left style=\"border-left: none; border-right: solid 1px #c0c0c0;\">
      <font class=z11>&nbsp;&nbsp;".NETWORKAGENT.": </font></td>";
echo "<td width=320 class=z11 align=left style=\"border-right: solid 1px #c0c0c0;\">
       &nbsp;&nbsp;<select name=report_agent style=\"width: 150px;\">";
foreach($agent_arr as $value)
      printf("<option class=z11 value=%d>%d. %s", $value[0], $value[0], $value[1]);
echo "</select></td>";

echo "<td width=494 rowspan=3 height=100 class=z11 align=left>
      &nbsp;&nbsp;&nbsp;&nbsp;<font class=z11>".FOR_DIFFERENT.(($IS_CONVERGENT)?F_GROUPS:F_UNIONS).": </font>";
echo " &nbsp;&nbsp;
       <input type=checkbox name=choose_groups onClick=\"show_only_groups();\"><br />
      ";

echo "
       &nbsp;&nbsp;&nbsp;&nbsp;<select name=only_groups[] multiple id=only_groups size=8 style=\"width: 400px; \" disabled>";
foreach($groups_arr as $value)
      printf("<option class=z11 value=%d>%d. %s", $value[0], $value[0], $value[1]);
echo "</select></td></tr>";

echo "<tr><td width=180 height=30 class=z11 align=left style=\"border-right: solid 1px #c0c0c0;\">
      <font class=z11>&nbsp;&nbsp;".RECORDSFILTERBY.": </font></td>";
echo "<td width=320 class=z11 align=left style=\"border-right: solid 1px #c0c0c0;\">
       &nbsp;&nbsp;<select name=report_filter style=\"width: 150px;\">";
foreach($attrib_arr as $value)
      printf("<option class=z11 value=%d>%s", $value[0], $value[1]);
echo "</select></td></tr>";

echo "<tr><td width=180 height=30 class=z11 align=left style=\"border-right: solid 1px #c0c0c0;\">
      <font class=z11>&nbsp;&nbsp;".STRINGQUERY.": </font></td>";
echo "<td width=320 class=z11 align=left style=\"border-right: solid 1px #c0c0c0;\">
      &nbsp;&nbsp;<input type=\"text\" name=report_filter_text size=15></td></tr>";

echo "<tr>
      <td class=z11 style=\"border-right: solid 1px #c0c0c0;\">&nbsp;</td>
      <td class=z11 style=\"border-right: solid 1px #c0c0c0;\">&nbsp;</td>
      <td class=z11>&nbsp;</td>
      </tr>";
echo "</table>";
// ////////////////////////////////////////////////////////////////
}
elseif($_POST["devision"] == 90)
{
	printf("<form action=config.php method=post name=reportsform target=\"_rep\">

   <input type=hidden name=devision value=%d>
   <input type=hidden name=exp_rep2_on value=0>
   <input type=hidden name=actuality value=%d>
   <input type=hidden name=det_rep value=0>",$_POST["devision"],$actuality);
	
if(!isset($_POST['exp_rep1_month']) ||
   empty($_POST['exp_rep1_month']) ||
   $_POST['exp_rep1_month'] == -1 ||
   $_POST['exp_rep1_month'] == '00') $_POST['exp_rep1_month'] = MONTH;


if(isset($_POST['exp_rep1_year']) && $_POST['exp_rep1_year'] == -1) $_POST['exp_rep1_year'] = YEAR;
elseif (!isset($_POST['exp_rep1_year'])) $_POST['exp_rep1_year'] = YEAR;
if($_POST['exp_prog'] == 2) $_POST['exp_prog'] = D_TYPE_PARUS;
elseif(!isset($_POST['exp_prog']) || empty($_POST['exp_prog']) || $_POST['exp_prog'] == 1) $_POST['exp_prog'] = D_TYPE_1C;

printf("<table width=990 border=0 cellspacing=0 cellpadding=0 align=center bgcolor=White
    style=\"border: solid 1px #c0c0c0; border-bottom:0px;\">");

printf("
   <tr height=20>
    <td height=20  width=990 align=center bgcolor=#E0E0E0 style=\"border-bottom: solid 1px #c0c0c0;\">
    <b><font class=z11 size=-1>%s</font></b>
    </td>
    </tr>",EXPORT_REPORTS);
printf("<tr><td align=right style=\"border-bottom: solid 1px #c0c0c0;\" height=15>
        <table align=right cellspacing=0 cellpadding=0 style=\"border: 1px solid #c0c0c0;\"
width=990 height=25>
        <tr>");
echo "
   <td width=20>&nbsp;</td>
   <td class=z11 align=left><input type=\"text\" size=25 id=exp_prog name=exp_prog class=z11 align=center readonly style=\"height: 19px; padding: 0; margin: 0; text-align: center;\" value='".$_POST['exp_prog']."'></td>
   <td class=z11 align=left width=650><img src=\"images/sel_open.gif\" height=19 name=\"i_exp_prog\" onClick=\"checkClicked('exp_prog')\" hspace=0></td>
";
echo "<td class=z11>".ON_ON.":</td>";
echo "
   <td class=z11 align=right width=140><input type=\"text\" size=15 id=exp_rep1_year name=exp_rep1_year class=z11 align=right readonly style=\"height: 19px; padding: 0; margin: 0;\" value='".$_POST['exp_rep1_year']."'></td>
   <td class=z11 align=left><img src=\"images/sel_open.gif\" height=19 name=\"i_exp_rep1_year\" onClick=\"checkClicked('exp_rep1_year')\" hspace=0></td>
";
echo "
   <td class=z11 align=left><input type=\"text\" size=15 id=exp_rep1_month name=exp_rep1_month class=z11 align=right readonly style=\"height: 19px; padding: 0; margin: 0;\" value='".$_POST['exp_rep1_month']."'></td>
   <td class=z11 align=left width=200><img src=\"images/sel_open.gif\" height=19 name=\"i_exp_rep1_month\" onClick=\"checkClicked('exp_rep1_month')\" hspace=0></td>
";
echo "<td>
      <input type=button name=exp_rep1 value=\"".EXPORTBTN."\" onClick=\"active_rep('report4.php'),4\">
      </td><td width=20>&nbsp;</td>";
printf("</table></tr>");

printf("
<table cellpadding=0 cellspacing=0 id=\"f_exp_prog\" style=\"position: absolute; top: 42px; left: 13px; display: none; background-color: #e0e0e0; width: 170px; border: solid 1px #e0e0e0; overflow: auto;\">
   <TR>
    <TD align=center style=\"width: 170px;\">
     <A href=\"JavaScript: sel_clicked('".EXPORT_REPORT_1S."', 'exp_prog');\" class=sel_m>".EXPORT_REPORT_1S."</A>
    </TD>
   </TR>
   <TR>
    <TD align=center style=\"width: 170px;\">
     <A href=\"JavaScript: sel_clicked('".EXPORT_REPORT_PARUS."', 'exp_prog');\" class=sel_m>".EXPORT_REPORT_PARUS."</A>
    </TD>
   </TR>
</table>
<div id=\"f_exp_rep1_year\" 
style=\"z-index: 1000000; position: absolute; top: 42px; left: 511px; 
display: none; background-color: #e0e0e0; width: 102px; 
border: solid 1px #e0e0e0; height: 157px; overflow: auto;\">
<table width=100%% cellpadding=0 cellspacing=0>
%s
</table>
</div>
<div id=\"f_exp_rep1_month\" style=\"z-index: 1000000; 
position: absolute; top: 42px; left: 627px; display: none; 
background-color: #e0e0e0; width: 102px; border: solid 1px #e0e0e0; height: 157px; overflow: auto;\">
<table width=100%% cellpadding=0 cellspacing=0>
%s
</table>
</div>",
yearSel("exp_rep1_year"), monthSel("exp_rep1_month"));

}
elseif($_POST["devision"] == 108)
{
	printf("<form action=config.php method=post name=reportsform target=\"_rep\">

   <input type=hidden name=devision value=%d>
   <input type=hidden name=exp_rep2_on value=0>
   <input type=hidden name=actuality value=%d>
   <input type=hidden name=det_rep value=0>",$_POST["devision"],$actuality);
	
if(!isset($_POST['exp_rep2_month']) ||
   empty($_POST['exp_rep2_month']) ||
   $_POST['exp_rep2_month'] == -1 ||
   $_POST['exp_rep2_month'] == '00') $_POST['exp_rep2_month'] = MONTH;

if(isset($_POST['exp_rep2_year']) && $_POST['exp_rep2_year'] == -1) $_POST['exp_rep2_year'] = YEAR;
elseif (!isset($_POST['exp_rep2_year'])) $_POST['exp_rep2_year'] = YEAR;
if($_POST['exp_type'] == 1) $_POST['exp_type'] = ONBEGIN;
elseif(!isset($_POST['exp_type']) || empty($_POST['exp_type']) || $_POST['exp_type'] == 0) $_POST['exp_type'] = CURRENT;

printf("<table width=970 border=0 cellspacing=0 cellpadding=0 align=center bgcolor=White
    style=\"border: solid 1px #c0c0c0; border-bottom:0px;\">");
printf("
   <tr height=20>
    <td height=20 align=center bgcolor=#E0E0E0 style=\"border-bottom: solid 1px #c0c0c0;\">
    <b><font class=z11 size=-1>%s</font></b>
    </td>
    </tr>",GENERATEBILLS);
printf("<tr><td align=right style=\"border-bottom: solid 1px #c0c0c0;\" height=15>
        <table align=right cellspacing=0 cellpadding=0 width=970 height=25>
        <tr>");
   echo "<td width=20 style=\"border-bottom: solid 1px #c0c0c0;\">&nbsp;</td>
        <td style=\"border-bottom: solid 1px #c0c0c0;\" width=100><font class=z11>".ORDER_GEN_DATE1.":</font></td>";
   echo "<td colspan=8 style=\"border-bottom: solid 1px #c0c0c0;
padding-left: 0px;\" >";
        $from_pos[0] = 0;
        $from_pos[1] = 55;
        $fields = array('year','month','day');
        showTimeLimit2($from_pos, $fields, "from", 2);
        unset($fields);
   echo "</td></tr>";
   /*
echo "<tr>
   <td width=20>&nbsp;</td>
   <td class=z11 align=left width=100><input type=\"text\" size=25 id=exp_type name=exp_type class=z11 align=center readonly style=\"height: 19px; padding: 0; margin: 0; text-align: center;\" value='".$_POST['exp_type']."'></td>
   <td class=z11 align=left width=320><img src=\"images/sel_open.gif\" height=19 name=\"i_exp_type\" onClick=\"checkClicked('exp_type')\" hspace=0></td>
";
*/
   
echo "<tr>
   <td width=20>&nbsp;</td>
   <td class=z11 align=left width=140>&nbsp;</td>
   <td class=z11 align=left width=320>&nbsp;</td>
";

echo "<td class=z11 width=20>".ON_ON.":</td>";
echo "
   <td class=z11 align=right width=90><input type=\"text\" size=15 id=exp_rep2_year name=exp_rep2_year class=z11 align=right readonly style=\"height: 19px; padding: 0; margin: 0;\" value='".$_POST['exp_rep2_year']."'></td>
   <td class=z11 align=left width=20><img src=\"images/sel_open.gif\" height=19 name=\"i_exp_rep2_year\" onClick=\"checkClicked('exp_rep2_year')\" hspace=0></td>
";
echo "
   <td class=z11 align=right width=90><input type=\"text\" size=15 id=exp_rep2_month name=exp_rep2_month class=z11 align=right readonly style=\"height: 19px; padding: 0; margin: 0;\" value='".$_POST['exp_rep2_month']."'></td>
   <td class=z11 align=left width=20><img src=\"images/sel_open.gif\" height=19 name=\"i_exp_rep2_month\" onClick=\"checkClicked('exp_rep2_month')\" hspace=0></td>
";
echo "<td width=240 align=right>
      <input type=button name=exp_rep2 value=\"=".GENERATE."=\" onClick=\"active_rep('',5);\">
      </td><td width=20>&nbsp;</td>";
printf("</table></tr>");

printf("
<table cellpadding=0 cellspacing=0 id=\"f_exp_type\" style=\"position: absolute; top: 65px; left: 13px; display: none; background-color: #e0e0e0; width: 170px; border: solid 1px #e0e0e0; overflow: auto;\">
   <TR>
    <TD align=center style=\"width: 170px;\">
     <A href=\"JavaScript: sel_clicked('".CURRENT."', 'exp_type');\" class=sel_m>".CURRENT."</A>
    </TD>
   </TR>
   <TR>
    <TD align=center style=\"width: 170px;\">
     <A href=\"JavaScript: sel_clicked('".ONBEGIN."', 'exp_type');\" class=sel_m>".ONBEGIN."</A>
    </TD>
   </TR>
</table>
<div id=\"f_exp_rep2_year\" style=\"z-index: 1000000; 
position: absolute; top: 69px; left: 498px; display: none; 
background-color: #e0e0e0; width: 102px; border: solid 1px #e0e0e0; height: 185px; overflow: auto; z-index: 1000;\">
<table width=100%% cellpadding=0 cellspacing=0>
%s
</table>
</div>
<div id=\"f_exp_rep2_month\" style=\"z-index: 1000000; position: absolute; top: 69px; left:
615px; display: none; background-color: #e0e0e0; width: 102px; border: solid 1px #e0e0e0; height: 187px; overflow: auto; z-index: 1000;\">
<table width=100%% cellpadding=0 cellspacing=0>
%s
</table>
</div>",
yearSel("exp_rep2_year"), monthSel("exp_rep2_month"));

//*****************************************************************************************************
//*****************         Генерация актов              **********************************************
//*****************************************************************************************************

$act_query = mysql_query(sprintf("select max(act_num+1) from user_acts"), $descriptor);
$act_max_num = mysql_fetch_row($act_query);

if(!$act_max_num[0] || $act_max_num[0] == NULL || empty($act_max_num[0]))
   $act_max_num = 1;
else $act_max_num = $act_max_num[0];

printf("<br />
    <table width=970 border=0 cellspacing=0 cellpadding=0 align=center bgcolor=White
    style=\"border: solid 1px #c0c0c0; border-bottom:0px;\">");
printf("
   <tr height=20>
    <td height=20 align=center bgcolor=#E0E0E0 style=\"border-bottom: solid 1px #c0c0c0;\">
    <b><font class=z11 size=-1>%s</font></b>
    </td>
    </tr>",GENERATEACTS);
printf("<tr><td align=right style=\"border-bottom: solid 1px #c0c0c0;\" height=15>
        <table align=right cellspacing=0 cellpadding=0 width=970 height=25>
        <tr>");

echo "
   <td width=20>&nbsp;</td>
   <td width=208><font class=z11>&nbsp;</font></td>
   <td class=z11 align=left width=257 align=left>
   &nbsp;</td>
";
echo "<td class=z11 width=20>".ON_ON.":</td>";
echo "
   <td class=z11 align=right width=90><input type=\"text\" size=15 id=act_gen_year name=act_gen_year class=z11 align=right readonly style=\"height: 19px; padding: 0; margin: 0;\" value='".$_POST['exp_rep2_year']."'></td>
   <td class=z11 align=left width=20><img src=\"images/sel_open.gif\" height=19 name=\"i_act_gen_year\" onClick=\"checkClicked('act_gen_year')\" hspace=0></td>
";
echo "
   <td class=z11 align=right width=90><input type=\"text\" size=15 id=act_gen_month name=act_gen_month class=z11 align=right readonly style=\"height: 19px; padding: 0; margin: 0;\" value='".$_POST['exp_rep2_month']."'></td>
   <td class=z11 align=left width=20><img src=\"images/sel_open.gif\" height=19 name=\"i_act_gen_month\" onClick=\"checkClicked('act_gen_month')\" hspace=0></td>
";
echo "<td align=right width=240>
      <input type=button name=act_gen_but value=\"=".GENERATE."=\" onClick=\"active_rep('',7);\">
      </td><td width=20>&nbsp;</td>";
printf("</table></tr>");

printf("
<table cellpadding=0 cellspacing=0 id=\"f_act_num_start\" style=\"position: absolute; top: 114px; left: 13px; display: none; background-color: #e0e0e0; width: 170px; border: solid 1px #e0e0e0; overflow: auto;\">
   <TR>
    <TD align=center style=\"width: 170px;\">
     <A href=\"JavaScript: sel_clicked('".CURRENT."', 'act_num_start');\" class=sel_m>".CURRENT."</A>
    </TD>
   </TR>
   <TR>
    <TD align=center style=\"width: 170px;\">
     <A href=\"JavaScript: sel_clicked('".ONBEGIN."', 'act_num_start');\" class=sel_m>".ONBEGIN."</A>
    </TD>
   </TR>
</table>
<div id=\"f_act_gen_year\" style=\"z-index: 1000000; position: absolute; top: 135px; left: 498px; display: none; background-color: #e0e0e0; width: 102px; border: solid 1px #e0e0e0; height: 197px; overflow: auto; z-index: 1000;\">
<table width=100%% cellpadding=0 cellspacing=0>
%s
</table>
</div>
<div id=\"f_act_gen_month\" style=\"z-index: 1000000; position: absolute; top: 135px; left:
615px; display: none; background-color: #e0e0e0; width: 102px; border: solid 1px #e0e0e0; height: 197px; overflow: auto; z-index: 1000;\">
<table width=100%% cellpadding=0 cellspacing=0>
%s
</table>
</div>",
yearSel("act_gen_year"), monthSel("act_gen_month"));
//*************************************************************************************************************

//*****************************************************************************************************
//*****************         Генерация счетов-фактур      **********************************************
//*****************************************************************************************************
printf("<br />
    <table width=970 border=0 cellspacing=0 cellpadding=0 align=center bgcolor=White
    style=\"border: solid 1px #c0c0c0; border-bottom:0px;\">");
printf("
   <tr height=20>
    <td height=20 align=center bgcolor=#E0E0E0 style=\"border-bottom: solid 1px #c0c0c0;\">
    <b><font class=z11 size=-1>%s</font></b>
    </td>
    </tr>",GENERATEFACTS);
printf("<tr><td align=right style=\"border-bottom: solid 1px #c0c0c0;\" height=15>
        <table align=right cellspacing=0 cellpadding=0 width=970 height=25>
        <tr>");
   echo "<td width=20 style=\"border-bottom: solid 1px #c0c0c0;\">&nbsp;</td>
   <td style=\"border-bottom: solid 1px #c0c0c0;\"><font class=z11>".FACTS_GEN_DATE1.":</font></td>";
   echo "<td colspan=8 style=\"border-bottom: solid 1px #c0c0c0; z-index:
100;\" >";
        $from_pos[0] = 0;
        $from_pos[1] = 0;
        $fields = array('t_year','t_month','t_day');
        showTimeLimit2($from_pos, $fields, "to", 2);
        unset($fields);
   echo "</td>
   </tr>";

$fact_query = mysql_query(sprintf("select max(fact_id+1) from orders"), $descriptor);
$fact_max_num = mysql_fetch_row($fact_query);

if(!$fact_max_num[0] || $fact_max_num[0] == NULL || empty($fact_max_num[0]))
   $fact_max_num = 1;
else $fact_max_num = $fact_max_num[0];

echo "<tr>
   <td width=20>&nbsp;</td>
   <td width=200><font class=z11>".FACTS_GEN_START_NUM."</font></td>
   <td class=z11 align=left width=257 style=\"padding-left: 3px;\">
   <input type=\"text\" size=25 id=gen_facts name=gen_facts class=z11 style=\"height: 19px; padding: 0; margin: 0;\"
value='".$fact_max_num."'></td>
";
echo "<td class=z11 width=20>".ON_ON.":</td>";
echo "
   <td class=z11 align=right width=90><input type=\"text\" size=15 id=gen_fact_year name=gen_fact_year class=z11 align=right readonly style=\"height: 19px; padding: 0; margin: 0;\" value='".$_POST['exp_rep2_year']."'></td>
   <td class=z11 align=left width=20><img src=\"images/sel_open.gif\" height=19 name=\"i_gen_fact_year\" onClick=\"checkClicked('gen_fact_year')\" hspace=0></td>
";
echo "
   <td class=z11 align=right width=90><input type=\"text\" size=15 id=gen_fact_month name=gen_fact_month class=z11 align=right readonly style=\"height: 19px; padding: 0; margin: 0;\" value='".$_POST['exp_rep2_month']."'></td>
   <td class=z11 align=left width=20><img src=\"images/sel_open.gif\" height=19 name=\"i_gen_fact_month\" onClick=\"checkClicked('gen_fact_month')\" hspace=0></td>
";
echo "<td align=right width=240>
      <input type=button name=gen_fact_but value=\"=".GENERATE."=\" onClick=\"active_rep('',8);\">
      </td><td width=20>&nbsp;</td>";
printf("</table></tr>");

printf("
<table cellpadding=0 cellspacing=0 id=\"f_gen_fact\" style=\"position: absolute; top: 42px; left: 13px; display: none; background-color: #e0e0e0; width: 170px; border: solid 1px #e0e0e0; overflow: auto;\">
   <TR>
    <TD align=center style=\"width: 170px;\">
     <A href=\"JavaScript: sel_clicked('".CURRENT."', 'exp_type');\" class=sel_m>".CURRENT."</A>
    </TD>
   </TR>
   <TR>
    <TD align=center style=\"width: 170px;\">
     <A href=\"JavaScript: sel_clicked('".ONBEGIN."', 'exp_type');\" class=sel_m>".ONBEGIN."</A>
    </TD>
   </TR>
</table>
<div id=\"f_gen_fact_year\" style=\"z-index: 1000000; position: absolute; top: 228px; left:
498px; display: none; background-color: #e0e0e0; width: 102px; border: solid 1px #e0e0e0; height: 197px; overflow: auto; z-index: 1000\">
<table width=100%% cellpadding=0 cellspacing=0>
%s
</table>
</div>
<div id=\"f_gen_fact_month\" style=\"z-index: 1000000; position: absolute; top: 228px; left:
615px; display: none; background-color: #e0e0e0; width: 102px; border: solid 1px #e0e0e0; height: 197px; overflow: auto;\">
<table width=100%% cellpadding=0 cellspacing=0>
%s
</table>
</div>",
yearSel("gen_fact_year"), monthSel("gen_fact_month"));
//*************************************************************************************************************

}
printf("</TABLE></FORM>");

?>
<script language="JavaScript">
</script>
<?php
}

$_SESSION['time_limit'] = $temp_time_array;


function selForSchet($f_names, $value, $action, $top, $left)
//Функция для вывода окошек селектов для счетов, отчетов и тд
{
if(!isset($_POST[$f_names[1]]) ||
   empty($_POST[$f_names[1]]) ||
   $_POST[$f_names[1]] == -1 ||
   $_POST[$f_names[1]] == '00') $_POST[$f_names[1]] = MONTH;

switch($_POST[$f_names[1]])
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


if(isset($_POST[$f_names[0]]) && $_POST[$f_names[0]] == -1) $_POST[$f_names[0]] = YEAR;
elseif (!isset($_POST[$f_names[0]])) $_POST[$f_names[0]] = YEAR;
if($_POST[$f_names[2]] == 1) $_POST[$f_names[2]] = $value[0];
elseif(!isset($_POST[$f_names[2]]) || empty($_POST[$f_names[2]]) || $_POST[$f_names[2]] == 2) $_POST[$f_names[2]] = $value[1];

$asd = "style=\"width: 80px;\"";
printf("<table align=right cellspacing=0 cellpadding=0 style=\"border: none;\" height=25>
        <tr>");
printf("
   <td width=20>&nbsp;</td>
   <td class=z11 align=left><input type=\"text\" size=10 id=%s name=%s class=z11 align=center readonly style=\"height: 19px; padding: 0; margin: 0; text-align: center;\" value='%s'></td>
   <td class=z11 align=left><img src=\"images/sel_open.gif\" height=19 name=\"i_%s\" onClick=\"checkClicked('%s')\" hspace=0></td>
", $f_names[0], $f_names[0], $_POST[$f_names[0]], $f_names[0], $f_names[0]);

printf("
   <td class=z11 align=right><input type=\"text\" size=10 id=%s name=%s class=z11 align=right readonly style=\"height: 19px; padding: 0; margin: 0;\" value='%s'></td>
   <td class=z11 align=left><img src=\"images/sel_open.gif\" height=19 name=\"i_%s\" onClick=\"checkClicked('%s')\" hspace=0></td>
", $f_names[1], $f_names[1], $_POST[$f_names[1]], $f_names[1], $f_names[1]);
echo "<td class=z11>&nbsp;".IN_B.":&nbsp;</td>";
printf("
   <td class=z11 align=left><input type=\"text\" size=10 id=%s name=%s class=z11 align=right readonly style=\"height: 19px; padding: 0; margin: 0;\" value='%s'></td>
   <td class=z11 align=left><img src=\"images/sel_open.gif\" height=19 name=\"i_%s\" onClick=\"checkClicked('%s')\" hspace=0></td>
", $f_names[2], $f_names[2], $_POST[$f_names[2]], $f_names[2], $f_names[2]);
printf("<td width=150 align=right>
      <input type=button class=z11 name=%s value=\"".FORMATE."\" onClick=\"%s\">
      </td><td width=20>&nbsp;</td>", $f_names[3], $action);
printf("</table></tr>");

printf("
<table cellpadding=0 cellspacing=0 id=\"f_%s\" style=\"position: absolute; top: %dpx; left: %dpx; display: none; background-color: #e0e0e0; width: 80px; border: solid 1px #e0e0e0; height: 85px; overflow: auto; z-index: 10000;\">
%s
</table>
<div id=\"f_%s\" style=\"z-index: 1000000; position: absolute; top: %dpx; left: %dpx; display: none; background-color: #e0e0e0; width: 100px; border: solid 1px #e0e0e0; height: 80px; overflow: auto; z-index: 10000;\">
<table cellpadding=0 cellspacing=0 width=100%%>
%s
</table>
</div>
<table cellpadding=0 cellspacing=0 id=\"f_%s\" style=\"z-index: 1000000;position: absolute; top: %dpx; left: %dpx; display: none; background-color: #e0e0e0; width: 80px; border: solid 1px #e0e0e0; overflow: auto; z-index: 10000;\">
   <TR>
    <TD align=center style=\"width: 80px;\">
     <A href=\"JavaScript: sel_clicked('%s', '%s');\" class=sel_m>%s</A>
    </TD>
   </TR>
   <TR>
    <TD align=center style=\"width: 80px;\">
     <A href=\"JavaScript: sel_clicked('%s', '%s');\" class=sel_m>%s</A>
    </TD>
   </TR>
</table>",
$f_names[0],$top, $left[0],
yearSel($f_names[0], $asd),
$f_names[1],$top, $left[1],
monthSel($f_names[1]),
$f_names[2],$top, $left[2], $value[0], $f_names[2], $value[0],
$value[1], $f_names[2], $value[1]);
}
?>

