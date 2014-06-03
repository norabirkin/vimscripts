<?PHP
/********************************************************************
   filename:    saveedited_ug.php
   modified:   August 17 2004 20:46:08.
   author:      LANBilling

   version:    LANBilling 1.8
*********************************************************************/

   printf("<table  bgcolor=ffffff align=center cellspacing=0 cellpadding=0 border=0  width=750 style=\"border: solid 1px #c0c0c0;border-bottom:0px;\">
         <tr><td colspan=3 align=center bgcolor=e0e0e0 style=\"border-bottom: solid 1px #c0c0c0;\" height=25><b>%s</b></td></tr>", SAVINGEDITEDUNION);



   $cur_ugid = $_POST['ug_id'];

   printf("<tr><td colspan=3 align=left bgcolor=e8e8e8 style=\"border-bottom: solid 1px #c0c0c0;\" height=15><b><font class=z11 size=-1>&nbsp;&nbsp;&nbsp;%s %s</font></b></td></tr>", TRANSACTIONINNODB.COLON, BIGINNING);

   $qstring = sprintf("begin");
   $qresult = mysql_query($qstring);


   printf("<tr><td align=left width=50%% bgcolor=ffffff style=\"border-bottom: solid 1px #c0c0c0;\"><b><font class=z11 size=-1>&nbsp;&nbsp;&nbsp;%s %s</font></b></td>", USERGROUPSENGLISH.COLON, MODIFYBEHAVIOURUG);
   $qstring = sprintf("update groups set description = '%s',name='%s', tar_id='%d', user_type='%d' where group_id = %d",
   $_POST['ug_descr'],
   $_POST['ug_name'],
   $_POST['tariffs_ug'],
   $_POST['user_type_ug'],
   $cur_ugid);

   // printf("%s<br>",$qstring);
   $qresult = mysql_query($qstring);
   if(mysql_errno() != 0)
   {
   bars("update",1);
   $qstring=sprintf("rollback");
   $qresult=mysql_query($qstring);
   die("<tr><td colspan=3 align=center bgcolor=f5f5f5 height=15 style=\"border-bottom: solid 1px #c0c0c0;\"><b><font class=z11 size=-1 color=\"#FF0000\">".ERRORTRANSACTION."</font></b></td></tr>");
   }
   else
   bars("update",0);


   printf("<tr><td align=left width=50%% bgcolor=ffffff style=\"border-bottom: solid 1px #c0c0c0;\"><b><font class=z11 size=-1>&nbsp;&nbsp;&nbsp;%s %s</font></b></td>", UGSTAFFENGLISH.COLON, STRUCTUREUG);
   $qstring=sprintf("delete from gr_staff where group_id=%d",$cur_ugid);
   $qresult=mysql_query($qstring);

   if(mysql_errno() != 0)
   {
   bars("remove",1);
   $qstring=sprintf("rollback");
   $qresult=mysql_query($qstring);
      die("<tr><td colspan=3 align=center bgcolor=f5f5f5 height=25 style=\"border-bottom: solid 1px #c0c0c0;\"><b><font class=z11 size=-1 color=\"#FF0000\">".ERRORTRANSACTION."</font></b></td></tr>");
   }
   else
   bars("remove",0);


   /*
   // Если выбрано объединение по типу пользователя - делаем соответствующие манипуляции
   if($_POST['user_type_ug'] > 0)
   {
   	$u_t_query = sprintf("SELECT v.vg_id FROM vgroups as v, accounts as a, acc_list as acc WHERE 
   	                      a.type='%d' AND acc.uid=a.uid AND v.vg_id=acc.vg_id", $_POST['user_type_ug']);
   	
   	$u_t_res = mysql_query($u_t_query);
   	while( ($u_t_row = mysql_fetch_row($u_t_res)))
   	{
   	    	$u_t_query2 = sprintf("INSERT INTO gr_staff SET group_id='%d', vg_id='%d'", $cur_ugid, $u_t_row[0]);
   	    	mysql_query($u_t_query2);
   	}
   	$_POST['active_set'] = false;
   }
   
   /////////////////////////////////////////////////////////////////////////////////////
   */
   
   // printf("VG_ID = %d<br>",$cur_vgid);

   printf("<tr><td align=left width=50%% bgcolor=ffffff style=\"border-bottom: solid 1px #c0c0c0;\"><b><font class=z11 size=-1>&nbsp;&nbsp;&nbsp;%s %s</font></b></td>", UGSTAFFENGLISH.COLON, SAVEVGINUG);

   unset($vg_arr);
   $vg_arr = array();
   
   
   for($i=0;$i<sizeof($_POST['active_set']);$i++)
      {
      	list($agent_id,$vg_id,$vg_login) = sscanf($_POST['active_set'][$i],"Agent № %d, ID: %d, %s");

      	if($_POST['tariffs_ug'] == 0 && $_POST['user_type_ug'] == 0)
      	{
      		$qstring=sprintf("insert into gr_staff set group_id = %d, vg_id = %d",
      		$cur_ugid,
      		$vg_id);

      		$qresult=mysql_query($qstring);
      	}
      	
         // В том случае если активированы общие опции - апдейтим параметры учетки
         if(!empty($_POST['show_options']))
         {
         	$vg_arr[$i] = $vg_id; 
         }
      }


   if(!empty($_POST['show_options']))
   {
	$options_query = save_common_options($vg_arr, $_POST);
	
	if($options_query[0])
	   mysql_query($options_query[0], $descriptor);
	if($options_query[1])
	   mysql_query($options_query[1], $descriptor);
   }
   
   if(mysql_errno() != 0)
   {
   bars("insert",1);
   $qstring=sprintf("rollback");
   $qresult=mysql_query($qstring);
      die("<tr><td colspan=3 align=center bgcolor=f5f5f5 height=15 style=\"border-bottom: solid 1px #c0c0c0;\"><b><font class=z11 size=-1 color=\"#FF0000\">".ERRORTRANSACTION."</font></b></td></tr>");
   }
   else
   bars('insert',0);

   // удаление/сохранение списка тарифов
   printf("<tr><td align=left width=50%% bgcolor=ffffff style=\"border-bottom: solid 1px #c0c0c0;\"><b><font class=z11 size=-1>&nbsp;&nbsp;&nbsp;%s %s</font></b></td>", UGSTAFFENGLISHTAR.COLON, MODIFYTARIFSSTAFF);
   $qstring=sprintf("DELETE FROM tarifs_staff WHERE group_id=%d",$cur_ugid);
   $qresult=mysql_query($qstring);

   if(mysql_errno() != 0)
   {
   bars("remove",1);
   $qstring=sprintf("rollback");
   $qresult=mysql_query($qstring);
      die("<tr><td colspan=3 align=center bgcolor=f5f5f5 height=25 style=\"border-bottom: solid 1px #c0c0c0;\"><b><font class=z11 size=-1 color=\"#FF0000\">".ERRORTRANSACTION."</font></b></td></tr>");
  }
   else
   bars("remove",0);

   if(is_array($_POST['tars']) && count($_POST['tars']) > 0)
   {
	printf("<tr><td align=left width=50%% bgcolor=ffffff style=\"border-bottom: solid 1px #c0c0c0;\"><b><font class=z11 size=-1>&nbsp;&nbsp;&nbsp;%s %s</font></b></td>", UGSTAFFENGLISHTAR.COLON, MODIFYTARIFSSTAFF);
	$qstring="INSERT INTO tarifs_staff SET group_id= %d, tar_id = %d";
	foreach($_POST['tars'] as $tar_id)
		$qresult=@mysql_query(sprintf($qstring, $cur_ugid, $tar_id));

	if(mysql_errno() != 0)
	{
	bars("insert",1);
	$qstring=sprintf("rollback");
	$qresult=mysql_query($qstring);
		die("<tr><td colspan=3 align=center bgcolor=f5f5f5 height=25 style=\"border-bottom: solid 1px #c0c0c0;\"><b><font class=z11 size=-1 color=\"#FF0000\">".ERRORTRANSACTION."</font></b></td></tr>");
	}
	else
	bars("insert",0);
   }

   printf("<tr><td align=left width=50%% bgcolor=ffffff style=\"border-bottom: solid 1px #c0c0c0;\"><b><font class=z11 size=-1>&nbsp;&nbsp;&nbsp;%s %s</font></b></td>", TRANSACTIONINNODB.COLON, COMPLETION);
   $qstring = sprintf("commit");
   $qresult = mysql_query($qstring);

   if(mysql_errno() != 0)
   {
   bars("committing",1);
   $qstring=sprintf("rollback");
   $qresult=mysql_query($qstring);
      die("<tr><td colspan=3 align=center bgcolor=f5f5f5 height=25 style=\"border-bottom: solid 1px #c0c0c0;\"><b><font color=\"#FF0000\">".ERRORTRANSACTION."</font></b></td></tr>");
   }
   else
   bars("committing",0);

   printf("</table>");

?>
