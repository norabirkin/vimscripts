<?PHP
/********************************************************************
   filename:    readug_values.php
   modified:   November 04 2004 20:38:48.
   author:      LANBilling

   version:    LANBilling 1.8
*********************************************************************/
   if (!session_is_registered("auth"))
{
   exit;
}

   $_POST['formmode'] = 1;
   // Проверка выбран ли идентификатор агента
   printf("<input type=hidden name=usergroup_id value=%d>",$_POST['usergroup_id']);

   // Восстановление описания объединения
   $qstring=sprintf("select description, name, tar_id, user_type from groups where group_id='%s'",$_POST['ug_id']);
   $qresult=mysql_query($qstring);

   $cur_row = mysql_fetch_row($qresult);
   $_POST['ug_descr'] = $cur_row[0];
   $_POST['ug_name'] = $cur_row[1];
   $_POST['tariffs_ug'] = $cur_row[2];
   $_POST['user_type_ug'] = $cur_row[3];
   
   if($_POST['tariffs_ug'] > 0 && $_POST['user_type_ug'] == 0)
   {
   	$qstring = sprintf("SELECT vg_id, id, login, id FROM vgroups WHERE tar_id='%d' and archive=0", $_POST['tariffs_ug']);
   }
   elseif($_POST['tariffs_ug'] == 0 && $_POST['user_type_ug'] > 0)
   {
   	$qstring = sprintf("SELECT v.vg_id, v.id, v.login, v.id FROM vgroups as v, agreements as a, accounts as c 
   	                    WHERE c.type='%d' AND a.uid=c.uid AND a.agrm_id=v.agrm_id AND v.archive=0", $_POST['user_type_ug']);
   }
   elseif($_POST['tariffs_ug'] == 0 && $_POST['user_type_ug'] == 0)
   {
   	// Восстановление старых присвоенных виртуальных групп
   	$qstring=sprintf("select gr_staff.vg_id,vgroups.id,vgroups.login,vgroups.id from gr_staff,vgroups
  		 where gr_staff.group_id=%d and gr_staff.vg_id = vgroups.vg_id AND vgroups.archive=0 order by vgroups.id",
   		 $_POST['ug_id']);
   }
   
   $qresult=mysql_query($qstring);
   do {
      $cur_row=mysql_fetch_row($qresult);
         if ($cur_row != false)
         $_POST['active_set'][] = sprintf("Agent № %d, ID: %d, %s",$cur_row[1],$cur_row[0],stripslashes($cur_row[2]));
      }
   while ($cur_row !=false);

   
?>
