<?PHP
/********************************************************************
   filename:    save_discounts.php
   modified:   February 01 2005 19:42:17.
   author:      LANBilling

   version:    LANBilling 1.8
*********************************************************************/
   if (!session_is_registered("auth"))
{
   exit;
}
      printf("<table  bgcolor=ffffff align=center cellspacing=0 cellpadding=0 border=0  width=750 style=\"border: solid 1px #c0c0c0;\">
         <tr><td colspan=3 align=center bgcolor=e0e0e0 style=\"border-bottom: solid 1px #c0c0c0;\" height=25><b>%s</b></td></tr>", SAVELG);

      // Установление связи с БД
      $descriptor=mysql_connect($serveraddress,$mysqluser,$mysqlpassword);
      mysql_select_db($mysqldatabase,$descriptor);

      $cur_id = $_POST['id'];
      $clone = 0;
      // Если тариф кому-либо присвоен, то изменение является клинорованием
      $qstring = sprintf("select distinct vgroups.login,vgroups.descr,vgroups.id from
      vgroups,tarifs where vgroups.tar_id = tarifs.tar_id and vgroups.tar_id = %d",$_POST['id']);
      $qresult = mysql_query($qstring);

      if (mysql_fetch_row($qresult) != false)
      {
         // сравнение
         for($i=0;$i<sizeof((array)$_POST['vdis_saved']);$i++)
         {
            $saved_vdis_vol   = "vdis_vol_".$_POST['vdis_saved'][$i];
            $saved_vdis_pcnt    = "vdis_pcnt_".$_POST['vdis_saved'][$i];
            $saved_vdis_rate    = "vdis_rate_".$_POST['vdis_saved'][$i];
            $saved_vdis_bonus    = "vdis_bonus_".$_POST['vdis_saved'][$i];
            if(isset($_POST[$saved_vdis_rate]))$_POST[$saved_vdis_pcnt] = -1;else$_POST[$saved_vdis_rate] = -1;
            if(!isset($_POST[$saved_vdis_bonus]))$_POST[$saved_vdis_bonus] = 0;
            $qstring=sprintf("select * from discounts where tar_id=%d and amount=%d and discount=%0.2f and rate = %d and dis_id = %d and bonus = %d",
            $cur_id,$_POST[$saved_vdis_vol],$_POST[$saved_vdis_pcnt],$_POST[$saved_vdis_rate],
            $_POST['vdis_saved'][$i],$_POST[$saved_vdis_bonus]);
            $result=mysql_query($qstring);
            if(mysql_fetch_row($result) == false)$clone = 1;
         }
         for($i=0;$i<sizeof((array)$_POST['tdis_saved']);$i++)
         {
            $saved_tdis_hf="tdis_hourfrom_".$_POST['tdis_saved'][$i];
            $saved_tdis_ht="tdis_hourto_".$_POST['tdis_saved'][$i];
            $saved_tdis_mf="tdis_minfrom_".$_POST['tdis_saved'][$i];
            $saved_tdis_mt="tdis_minto_".$_POST['tdis_saved'][$i];
            $saved_tdis_pcnt = "tdis_pcnt_".$_POST['tdis_saved'][$i];
            $saved_tdis_rate = "tdis_rate_".$_POST['tdis_saved'][$i];
            $timefrom = sprintf("%s:%s:00",$_POST[$saved_tdis_hf],$_POST[$saved_tdis_mf]);
            $timeto = sprintf("%s:%s:00",$_POST[$saved_tdis_ht],$_POST[$saved_tdis_mt]);
            if(isset($_POST[$saved_tdis_rate]))$_POST[$saved_tdis_pcnt] = -1;else$_POST[$saved_tdis_rate] = -1;
            $qstring=sprintf("select * from bonuses where tar_id=%d and timefrom='%s' and timeto = '%s' and discount=%0.2f and rate = %d and bonus_id = %d ",
            $cur_id,$timefrom,$timeto,$_POST[$saved_tdis_pcnt],$_POST[$saved_tdis_rate],$_POST['tdis_saved'][$i]);
            $result=mysql_query($qstring);
            if(mysql_fetch_row($result) == false)$clone = 1;
         }
         if(isset($_POST['we_percent_dis']))$_POST['we_abs_dis'] = -1;
         elseif (isset($_POST['we_abs_dis']))$_POST['we_percent_dis'] = -1;
         else $no_webonus = 1;
         if($no_webonus != 1)
         {
            $qstring=sprintf("select * from we_bonus where tar_id=%d and discount=%0.2f and rate = %d",$cur_id,$_POST['we_percent_dis'],$_POST['we_abs_dis']);
            $result=mysql_query($qstring);
            if(mysql_fetch_row($result) == false)$clone = 1;
         }
      }

      if($clone == 1)
      {
         // клонирование
         $array = mysql_fetch_assoc(mysql_query(sprintf("select * from tarifs where tar_id =%d",$_POST['id'])));
         $array['descr'] .= sprintf(" (%s)",CLONED);
         unset($array['tar_id']);
         $string = "insert into tarifs set ";
         foreach ($array as $key=>$value)
         {
            $string .= sprintf(" %s = '%s',",$key,$value);
         }
         $string = substr($string,0,strlen($string)-1);
         mysql_query($string);
         $cur_id = mysql_insert_id();
         if($_POST['reassign_val'] == 1)
         {
            $query = sprintf("insert into tarifs_rasp select NULL,vg_id,'%s','%s','0','0','0' from vgroups where tar_id=%s",date("YmdHis"),$cur_id,$_POST['id']);
            //echo $query ;
            mysql_query($query);
         }         
      }
      // Начало транзакции
      $qstring=sprintf("begin");
      $result=mysql_query($qstring);

      printf("<tr><td colspan=3 align=left bgcolor=ffffff style=\"border-bottom: solid 1px #c0c0c0;\"><b><font class=z11 size=-1>&nbsp;&nbsp;&nbsp;%s %s</font></b></td></tr>", TRANSACTIONINNODB.COLON, BIGINNING);

      printf("<tr><td align=left width=65%% bgcolor=ffffff style=\"border-bottom: solid 1px #c0c0c0;\"><b><font class=z11 size=-1>&nbsp;&nbsp;&nbsp;%s %s</font></b></td>", VDISENGL.COLON, DELETEDIS);
      $qstring=sprintf("delete from discounts where tar_id=%d",$cur_id);
   echo $qsting;
      $result=mysql_query($qstring);

      if(mysql_errno() != 0)
      {
      bars("remove",1);
      $qstring=sprintf("rollback");
      $qresult=mysql_query($qstring);
      die("<tr><td colspan=3 align=center bgcolor=f5f5f5 height=25 style=\"border-bottom: solid 1px #c0c0c0;\"><b><font color=\"#FF0000\">".ERRORTRANSACTION."</font></b></td></tr>");
      }
      else
      bars("remove",0);

      // Volume discounts - сохранение всех объемных скидок

      for($i=0;$i<sizeof((array)$_POST['vdis_saved']);$i++)
      {
         $saved_vdis_vol="vdis_vol_".$_POST['vdis_saved'][$i];
         $saved_vdis_pcnt = "vdis_pcnt_".$_POST['vdis_saved'][$i];
         $saved_vdis_rate = "vdis_rate_".$_POST['vdis_saved'][$i];
         $saved_vdis_bonus = "vdis_bonus_".$_POST['vdis_saved'][$i];
         
         if(!empty($_POST[$saved_vdis_rate]) && $_POST[$saved_vdis_rate] != -1 && $_POST[$saved_vdis_rate] != 0)
         {
         $_POST[$saved_vdis_pcnt] = -1;
         }
         else
         $_POST[$saved_vdis_rate] = -1;
         
         if(!isset($_POST[$saved_vdis_bonus]))
         $_POST[$saved_vdis_bonus] = 0;

         printf("<tr><td align=left width=65%% bgcolor=ffffff style=\"border-bottom: solid 1px #c0c0c0;\"><b><font class=z11 size=-1>&nbsp;&nbsp;&nbsp;%s %s</font></b></td>", VDISENGL.COLON, SAVERVDIS);
         $qstring=sprintf("insert into discounts set tar_id=%d, amount=%d, discount=%0.2f,
         rate = %d, dis_id = %d, bonus = %d",
         $cur_id,
         $_POST[$saved_vdis_vol],
         $_POST[$saved_vdis_pcnt],
         $_POST[$saved_vdis_rate],
         $_POST['vdis_saved'][$i],
         $_POST[$saved_vdis_bonus]);
         $result=mysql_query($qstring);

         if(mysql_errno() != 0)
         {
         bars("insert",1);
         $qstring=sprintf("rollback");
         $qresult=mysql_query($qstring);
      die("<tr><td colspan=3 align=center bgcolor=f5f5f5 height=25 style=\"border-bottom: solid 1px #c0c0c0;\"><b><font color=\"#FF0000\">".ERRORTRANSACTION."</font></b></td></tr>");
         }
         else
         bars("insert",0);
      }   // Конец сохранения объемных скидок

      printf("<tr><td align=left width=65%% bgcolor=ffffff style=\"border-bottom: solid 1px #c0c0c0;\"><b><font class=z11 size=-1>&nbsp;&nbsp;&nbsp;%s %s</font></b></td>", TDISENGL.COLON, DELETEDIS);
      $qstring=sprintf("delete from bonuses where tar_id=%d",$cur_id);
      $result=mysql_query($qstring);

      if(mysql_errno() != 0)
      {
      bars("remove",1);
      $qstring=sprintf("rollback");
      $qresult=mysql_query($qstring);
      die("<tr><td colspan=3 align=center bgcolor=f5f5f5 height=25 style=\"border-bottom: solid 1px #c0c0c0;\"><b><font color=\"#FF0000\">".ERRORTRANSACTION."</font></b></td></tr>");
      }
      else
      bars("remove",0);

      // Time discounts - сохранение всех временных скидок

      for($i=0;$i<sizeof((array)$_POST['tdis_saved']);$i++)
      {

         $saved_tdis_hf="tdis_hourfrom_".$_POST['tdis_saved'][$i];
         $saved_tdis_ht="tdis_hourto_".$_POST['tdis_saved'][$i];
         $saved_tdis_mf="tdis_minfrom_".$_POST['tdis_saved'][$i];
         $saved_tdis_mt="tdis_minto_".$_POST['tdis_saved'][$i];

         $saved_tdis_pcnt = "tdis_pcnt_".$_POST['tdis_saved'][$i];
         $saved_tdis_rate = "tdis_rate_".$_POST['tdis_saved'][$i];

         $timefrom = sprintf("%s:%s:00",
         $_POST[$saved_tdis_hf],
         $_POST[$saved_tdis_mf]);

         $timeto = sprintf("%s:%s:00",
         $_POST[$saved_tdis_ht],
         $_POST[$saved_tdis_mt]);

         if(floatval($_POST[$saved_tdis_rate]) && $_POST[$saved_tdis_rate] > 0)
         $_POST[$saved_tdis_pcnt] = -1;
         else
         $_POST[$saved_tdis_rate] = -1;

         printf("<tr><td align=left width=65%% bgcolor=ffffff style=\"border-bottom: solid 1px #c0c0c0;\"><b><font class=z11 size=-1>&nbsp;&nbsp;&nbsp;%s %s</font></b></td>", TDISENGL.COLON, SAVERTDIS);
         $qstring=sprintf("insert into bonuses set tar_id=%d, timefrom='%s',
         timeto = '%s', discount=%0.2f, rate = %d, bonus_id = %d ",
         $cur_id,
         $timefrom,
         $timeto,
         $_POST[$saved_tdis_pcnt],
         $_POST[$saved_tdis_rate],
         $_POST['tdis_saved'][$i]);

         $result=mysql_query($qstring);

         if(mysql_errno() != 0)
         {
         bars("insert",1);
         $qstring=sprintf("rollback");
         $qresult=mysql_query($qstring);
      die("<tr><td colspan=3 align=center bgcolor=f5f5f5 height=25 style=\"border-bottom: solid 1px #c0c0c0;\"><b><font color=\"#FF0000\">".ERRORTRANSACTION."</font></b></td></tr>");
         }
         else
         bars("insert",0);

      }   // Конец сохранения временных скидок

      // Удаление информации о скидке выходного дня из таблицы

      printf("<tr><td align=left width=65%% bgcolor=ffffff style=\"border-bottom: solid 1px #c0c0c0;\"><b><font class=z11 size=-1>&nbsp;&nbsp;&nbsp;%s %s</font></b></td>", WEDISENGL.COLON, DELETEDIS);
      $qstring=sprintf("delete from we_bonus where tar_id=%d",$cur_id);
      $result=mysql_query($qstring);

      if(mysql_errno() != 0)
      {
      bars("remove",1);
      $qstring=sprintf("rollback");
      $qresult=mysql_query($qstring);
      die("<tr><td colspan=3 align=center bgcolor=f5f5f5 height=25 style=\"border-bottom: solid 1px #c0c0c0;\"><b><font color=\"#FF0000\">".ERRORTRANSACTION."</font></b></td></tr>");
      }
      else
      bars("remove",0);

      // Начало сохранения скидки выходного дня

      if(isset($_POST['we_percent_dis']) && $_POST['we_percent_dis']>0)
      $_POST['we_abs_dis'] = -1;
      elseif (isset($_POST['we_abs_dis']) && $_POST['we_abs_dis']>0)
      $_POST['we_percent_dis'] = -1;
      else
      $no_webonus = 1;

      if($no_webonus != 1)
      {
      printf("<tr><td align=left width=65%% bgcolor=ffffff style=\"border-bottom: solid 1px #c0c0c0;\"><b><font class=z11 size=-1>&nbsp;&nbsp;&nbsp;%s %s</font></b></td>", WEDISENGL.COLON, SAVEWEDIS);
      $qstring=sprintf("insert into we_bonus set tar_id=%d, discount=%0.2f,
      rate = %d",
      $cur_id,
      $_POST['we_percent_dis'],
      $_POST['we_abs_dis']);

      $result=mysql_query($qstring);

      if(mysql_errno() != 0)
      {
      bars("insert",1);
      $qstring=sprintf("rollback");
      $qresult=mysql_query($qstring);
      die("<tr><td colspan=3 align=center bgcolor=f5f5f5 height=25 style=\"border-bottom: solid 1px #c0c0c0;\"><b><font color=\"#FF0000\">".ERRORTRANSACTION."</font></b></td></tr>");
      }
      else
      bars("insert",0);
      // Окончание сохранения скидки выходного дня, сохраняется только если заданы
      // скидки выходного дня, одна из двух (или 'we_percent_dis' или 'we_abs_dis')
      }

      // Окончание транзакции
      printf("<tr><td align=left width=65%% bgcolor=ffffff style=\"border-bottom: solid 1px #c0c0c0;\"><b><font class=z11 size=-1>&nbsp;&nbsp;&nbsp;%s %s</font></b></td>", TRANSACTIONINNODB.COLON, COMPLETION);
      $qstring=sprintf("commit");
      $result=mysql_query($qstring);

      if(mysql_errno() != 0)
      {
      bars("committing",1);
      $qstring=sprintf("rollback");
      $qresult=mysql_query($qstring);
      die("<tr><td colspan=3 align=center bgcolor=f5f5f5 height=25 style=\"border-bottom: solid 1px #c0c0c0;\"><b><font color=\"#FF0000\">".ERRORTRANSACTION."</font></b></td></tr>");
      }
      else
      bars("committing",0);

      printf("<tr><td colspan=3 align=center bgcolor=e8e8e8 height=25><b>%s</b></td></tr></table>",DISCOUNTSSAVED);
      // Завершение работы с БД
      mysql_close($descriptor);
?>
