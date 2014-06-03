<?PHP
/********************************************************************
   filename:    create_ug.php
   modified:   November 04 2004 20:34:08.
   author:      LANBilling

   version:    LANBilling 1.8
*********************************************************************/
   if (!session_is_registered("auth"))
{
   exit;
}

   // Режим работы формы - создание новой или модификация

   if ($_POST['formmode'] == 1)
   {
   $add_name = "mod_add_vg";
   $del_name = "mod_del_vg";
   $savemode = "update_ug";
   printf("<input type=hidden name=ug_id value=%s>",$_POST['ug_id']);
   printf("<input type=hidden name=formmode value=1>");
   }
   else
   {
   $add_name = "add_vg";
   $del_name = "del_vg";
   $savemode = "ug_add";
   }

   // Создать общий список групп в системе
   $qstring="select distinct login,vg_id,id from vgroups order by id,vg_id";
   $qresult=mysql_query($qstring);
   do {
      $cur_row=mysql_fetch_row($qresult);
      if ($cur_row != false)
      $all_vgroups[]=sprintf("Agent № %d, ID: %d, %s",$cur_row[2],$cur_row[1],$cur_row[0]);
   }
   while ($cur_row !=false);
   // Конец создания списка уникальных групп в системе

   // Удаление группы из объединения
   if(isset($_POST['active_set']) && isset($_POST['vg2ug_assignd']) && isset($_POST[$del_name]))
      {

       for($i=0;$i<sizeof($_POST['active_set']);$i++)
         {
         $bypass=0;
         for($j=0;$j<sizeof($_POST['vg2ug_assignd']);$j++)
            if(strcmp(trim($_POST['active_set'][$i]),trim($_POST['vg2ug_assignd'][$j]))==0)
            {
                if($_POST['formmode'] == 1)
                 $_POST['deleted_set'][] = $_POST['active_set'][$i];

            $_POST['active_set'][$i]="";
            $bypass=1;
            }
            if ($bypass!=1)
            {
            printf("<input type=hidden name=active_set[] value=\"%s\">",$_POST['active_set'][$i]);
            }
         }
      }
   // Присвоение новой группы в объединение
   elseif (isset($_POST['vg2ug_av']) && !isset($_POST['active_set']) && isset($_POST[$add_name]))
         for($i=0;$i<sizeof($_POST['vg2ug_av']);$i++)
            {
            printf("<input type=hidden name=active_set[] value=\"%s\">",$_POST['vg2ug_av'][$i]);
            $_POST['active_set'][]=$_POST['vg2ug_av'][$i];
            }

   // Присвоение новой группы в объединение когда там были уже записи
   elseif(isset($_POST['active_set']) && isset($_POST['vg2ug_av']) && isset($_POST[$add_name]))
   {
      for($i=0;$i<sizeof($_POST['active_set']);$i++)
         printf("<input type=hidden name=active_set[] value=\"%s\">",$_POST['active_set'][$i]);
      for($i=0;$i<sizeof($_POST['vg2ug_av']);$i++)
         {
         $_POST['active_set'][]=$_POST['vg2ug_av'][$i];
         printf("<input type=hidden name=active_set[] value=\"%s\">",$_POST['vg2ug_av'][$i]);
         }
   }
   // Банальное хранение, текущих объединений
   elseif (isset($_POST['active_set']))
         for($i=0;$i<sizeof($_POST['active_set']);$i++)
            printf("<input type=hidden name=active_set[] value=\"%s\">",$_POST['active_set'][$i]);



   // Хранение удаленного сета виртуальных групп
   if(isset($_POST['deleted_set']))
   {
   for($i=0;$i<sizeof($_POST['deleted_set']);$i++)
   printf("<input type=hidden name=deleted_set[] value=\"%s\">",$_POST['deleted_set'][$i]);
   }

	if(!isset($_POST['operator_id'])) $_POST['operator_id'] = -1;
	// Составление массива операторов существующих в системе
	
	// Установка счетчика операторов имеющихся в АСР
	$oper_counter = 0;
	$qs = "SELECT oper_id, name FROM operators";
	
	$qresult = mysql_query($qs, $descriptor);
		if($qresult != false)
		{
			if(mysql_num_rows($qresult) > 0)
			{
				if($oper_counter == 0) $operators_list[-1] = DEF_PREDSTAV;
					
				while($cur_row = mysql_fetch_row($qresult))
				{
					$operators_list[$cur_row[0]] = $cur_row[1];
					$oper_counter++;
				}
			}
			else
			{
					$operators_list[0] = NO_OPERATORS_AVAILABLE;
			}
		
		}

   printf("<table align=center class=table_comm width=800 style=\"border: solid 1px #c0c0c0;\" >

         <tr>
         <td class=td_head_ext align=center colspan=3 style=\"border-bottom: solid 1px #c0c0c0;\"
        ><font class=z11 >%s</font></td></tr>",$wm);
         
/*         
         
printf("<tr bgcolor=f5f5f5>
   <td align=left height=25 style=\"border-bottom: solid 1px #c0c0c0;\">
   <font class=z11 >&nbsp;&nbsp;&nbsp;&nbsp;%s&nbsp;&nbsp;&nbsp;</font>
   <input type=text class=z11 size=30 name=ug_name value = \"%s\">
   </td>
   ",
   NAM.COLON,
   $_POST['ug_name']);
   
   		 
      $qstring=sprintf("select use_operators,convergent from share");
      $result1=mysql_query($qstring);
      $table_row1=mysql_fetch_row($result1);
//echo "table_row1[0]=".$table_row1[0];

      if ($table_row1[0]==0&&$table_row1[1]==0) 
	  { 
	  
   // Основная форма работы с объединениями
   
   printf("<td colspan=2 align=right height=25 style=\"border-bottom: solid 1px #c0c0c0;\">
   <font class=z11>%s</font>&nbsp;
   <select name=predstav_list class=z11 style=\"width: 150px;\">
   %s
   </select></td>
   ",SHOW_PREDSTAV.COLON, show_predstav_sel($descriptor));
} else
{
  echo "<td colspan=2 align=right height=25 style=\"border-bottom: solid 1px #c0c0c0;\">
   <font class=z11></font>&nbsp;
   </td>
   ";
}
echo "
   </tr>";
   
   
*/  
	// Основная форма работы с объединениями
	printf("<tr><td align=center colspan=3 bgcolor=e0e0e0 style=\"border-bottom: solid 1px #c0c0c0;\">");
	
	printf("<table class=table_comm width=100%% style=\"border-top:none;border-left:none;\" border = 0>");

	printf("<tr>	
	<td  style=\"padding-left:10px;border-bottom:none;\" class=td_comm align=left width=300><font class=z11 >%s <input type=text class=z11 size=35 name=ug_name value = \"%s\"></font></td>",
	NAM.COLON, $_POST['ug_name']);	
	// Для объединений признак квитанции для физ. лиц перенесен в группы пользователей.
	 printf("<td style=\"padding-left:10px;border-bottom:none;border-right:none;\" class=td_comm  align=left  style=\"border-bottom: solid 1px #c0c0c0;\">
   <font class=z11 >%s</font><textarea  name=ug_descr style=\"width: 430px; height: 60px;\">%s</textarea>
   </td>",DESCRIPTION.COLON, $_POST['ug_descr']);	
	printf("</tr></table>"); // Окончание таблицы внутри
	
	printf("</td></tr>"); // Ячейка содержащая таблицу внутри
   
 
  


   $yur_vis = ''; $fis_vis='';
   if($_POST['tariffs_ug'] > 0 && $_POST['user_type_ug'] == 0)
   {
       $vg_ass = "disabled";
       $vg_1 = "disabled";
       $vg_2 = "disabled";
       $vg_av = "disabled";
       $ut_vis = "disabled";
   }
   else if($_POST['tariffs_ug'] == 0 && $_POST['user_type_ug'] == 0)
   {
       $vg_ass = "";
       $vg_1 = "";
       $vg_2 = "";
       $vg_av = "";  
       $ut_vis = "";
   }
   else if($_POST['tariffs_ug'] == 0 && $_POST['user_type_ug'] > 0)
   {
       $vg_ass = "disabled";
       $vg_1 = "disabled";
       $vg_2 = "disabled";
       $vg_av = "disabled";
       $tar_vis = "disabled";
       if($_POST['user_type_ug'] == 1) $yur_vis='selected';
       else $fis_vis='selected';
          
   }
   
   printf("
   <tr>
     <td colspan=3 class=td_head  style=\"border-top:none;\" class=table_header>
     <font class=z11 >".GLOBAL_UNIONS."</font>
     </td> </tr>
   ");
   
   printf("
  
   <tr height=30>
   <td width=350 align=center style=\"border-bottom: solid 1px #c0c0c0;\" >
   <font class=z11>%s</font>&nbsp;
   <select name=tariffs_ug id=t_ug_id class=z11 style=\"width: 180px;\" onChange=\"tarif_union(); this.form.devision.value=16; this.form.workmode.value=1; this.form.submit()\" %s>
   %s
   </select>&nbsp;&nbsp;  
   <td colspan=2  align=center style=\"border-bottom: solid 1px #c0c0c0;\">
   <font class=z11>".USER_TYPE_UNIONS."&nbsp;</font>
   <select name=user_type_ug id=u_t_id class=z11 style=\"width: 180px;\" onChange=\"utype_union();\" %s>
   <option value=0 class=z11>".NOT_SET."
   <option value=1 class=z11 %s>".YUR_PERSON."
   <option value=2 class=z11 %s>".FIZ_PERSON."
   </select> 
   </td></tr>
   
   ", TARIFFUSERGROUPS1, $tar_vis, show_tarrifs_sel($descriptor, $_POST['tariffs_ug']), $ut_vis, $yur_vis, $fis_vis);
   
   printf("<tr><td class=td_head style=\"border-bottom: solid 1px #c0c0c0;border-right:none;\" width=360 align=center height=22><font class=z11 >%s</font></td>
   <td class=td_head style=\"border-bottom: solid 1px #c0c0c0;border-right:none;\" width=31 height=22 align=center>&nbsp;</td>
   <td class=td_head style=\"border-bottom: solid 1px #c0c0c0;border-right:none;\" width=359 height=22 align=center ><font class=z11 >%s</font></td></tr>",
   ASSIGNEDVG,
   FREEVG);
   
   printf("<tr bgcolor=ffffff>
   <td width=360 align=center height=190>
   <select class=z11 style=\" width: 340px \" multiple  id=vg_ass name=vg2ug_assignd[] size=12 %s>
   %s
   </select>
   </td>

   <td width=31 height=190 align=center>
   <input type=submit %s name=%s value=\"<-\" id=vg_1 onclick=\"document.forms[1].devision.value=16; document.forms[1].workmode.value = 0;\"><br><br>
   <input type=submit %s name=%s value=\"->\" id=vg_2 onclick=\"document.forms[1].devision.value=16; document.forms[1].workmode.value = 0;\">
   </td>

   <td width=359 height=190 align=center>
   <select class=z11 style=\" width: 340px \" multiple name=vg2ug_av[]  id=vg_av size=12 %s>%s</select>
   </td>
   </tr>",
   $vg_ass, show_assigned($_POST['active_set']),
   $vg_1, $add_name,
   $vg_2, $del_name,
   $vg_av, gen_av_groups_new($all_vgroups,$_POST['active_set'],$_POST['deleted_set'])
   );

	// Блок позволяющий назначить доступный список тарифов по расписанию в пользовательском интерфейсе
	assignedTars();
	printf( "<tr>
			<td  colspan=3 align=center class=td_head_ext style='border-top: solid 1px #c0c0c0; border-bottom: solid 1px #c0c0c0;'>%s</td>
		 </tr>
		 <tr>
			<td class=td_head align=center  style='border-bottom: solid 1px #c0c0c0; border-right:none;'>%s</td>
			<td class=td_head align=center style='border-bottom: solid 1px #c0c0c0; border-right:none;'>&nbsp;</td>
			<td class=td_head align=center  style='border-bottom: solid 1px #c0c0c0;border-right:none;'>%s</td>
		 </tr>
		 <tr>
		 	<td width=360 align=center height=190>
		 	%s
		 	%s
		 	<select class=z11 style='width: 340px' multiple  id=tarifs_st name=tar_st_sg[] size=12>
		 	%s
		 	</select>
			</td>
		 	
			<td>
		 	<input type=submit name=tars_to_add value='<-' onclick='document.forms[1].devision.value=16; document.forms[1].workmode.value = 0;'><br><br>
		 	<input type=submit name=tars_to_del value='->' onclick='document.forms[1].devision.value=16; document.forms[1].workmode.value = 0;'>
			</td>
		 	
			<td width=359 height=190 align=center>
			<select class=z11 style='width: 340px' multiple name=tar_st_av[] size=12>
			%s
			</select>
			</td>
		 </tr>
		",
		TARIFSFORCLIENTS, 
		ASSIGN, 
		ACCESSIBLE, 
		buildTarsElements(0,"tars"), 
		buildTarsElements(0,"tars_del"), 
		buildTarsElements(1), 
		freeTars());
	
	
   //print_r($_POST['active_set']);
   
   // Редактируем опции - общие для всех учеток в объединении 
   
   // ФОрмируем массив общих опций
       unset($vg_options_arr);
       $opt_flags = array(1,1,1,1,1,1,1,1,1,1,1,1,1);
         	 
  	 $tmp_str = sprintf("<input type=checkbox name=vg_connected class=z11 value='%d' %s>", isset($_POST['vg_connected'])?1:0, isset($_POST['vg_connected'])?"checked":"");
  	 $vg_options_arr['VG_CONNECTED']=    array($_POST['vg_connected'], VGLINKED, $tmp_str);
  	 
  	 $tmp_str = sprintf("<input type=checkbox name=vg_auto_disc class=z11 value='%d' %s>", isset($_POST['vg_auto_disc'])?1:0, isset($_POST['vg_auto_disc'])?"checked":"");
  	 $vg_options_arr['VG_AUTO_DISC']=    array($_POST['vg_auto_disc'], AUTODISCONNECT, $tmp_str);
  	 
  	 $tmp_str = sprintf("<input type=checkbox name=vg_rem_balance class=z11 value='%d' %s>", isset($_POST['vg_rem_balance'])?1:0, isset($_POST['vg_rem_balance'])?"checked":"");
  	 $tmp_str .= sprintf("&nbsp;&nbsp;&nbsp;<input type=text size=15 class=z11 name=vg_balance_less value='%s'>", $_POST['vg_balance_less']);
  	 $vg_options_arr['VG_REM_BALANCE']=  array($_POST['vg_rem_balance'], NOTIFY.BALANCE_LIMIT, $tmp_str);
  	 
  	 $tmp_str = sprintf("<input type=checkbox name=vg_user_block class=z11 value='%d' %s>", isset($_POST['vg_user_block']) ? 1 : 0, isset($_POST['vg_user_block']) ? "checked" : "");
  	 $vg_options_arr['VG_USER_BLOCK']=    array($_POST['vg_user_block'], USERBLOCKALLOW, $tmp_str);
  	 
  	 $tmp_str = sprintf("<input type=checkbox name=vg_resurs class=z11 value='%d' %s>", isset($_POST['vg_resurs'])?1:0, isset($_POST['vg_resurs'])?"checked":"");  	 
       $vg_options_arr['VG_RESURS']=       array($_POST['vg_resurs'], CONSIDERINGRESOURCE, $tmp_str);
     
  	 $tmp_str = sprintf("<input type=checkbox name=vg_service class=z11 value='%d' %s>", isset($_POST['vg_service'])?1:0, isset($_POST['vg_service'])?"checked":"");     
   	 $vg_options_arr['VG_SERVICE']=      array($_POST['vg_service'], CONSIDERINGSERVICE, $tmp_str);
   	 
   	 $tmp_str = sprintf("<font class=z11>IN&nbsp;</font><input type=radio class=z11 name=vg_traff_dir value=1 %s>&nbsp;&nbsp;&nbsp;", $_POST['vg_traff_dir']==1?"checked":"");
   	 $tmp_str .= sprintf("<font class=z11>OUT&nbsp;</font><input type=radio class=z11 name=vg_traff_dir value=2 %s>&nbsp;&nbsp;&nbsp;", $_POST['vg_traff_dir']==2?"checked":"");   	 
   	 $tmp_str .= sprintf("<font class=z11>".SUM."&nbsp;</font><input type=radio class=z11 name=vg_traff_dir value=3 %s>&nbsp;&nbsp;&nbsp;", $_POST['vg_traff_dir']==3?"checked":"");   	 
   	 $vg_options_arr['VG_TRAFF_DIR']=    array($_POST['vg_traff_dir'], FLOWDIR, $tmp_str);
   	 
   	 $tmp_str = sprintf("<input type='text' name='vg_stream_val' class=z11 style=\"width: 100px;\">");
   	 $vg_options_arr['VG_STREAM_VAL']=   array($_POST['vg_stream_val'], SHAPE, $tmp_str);
   	 
   	 $tmp_str = sprintf("<input type=checkbox name=vg_vpn_ip class=z11 value='%d' %s>", isset($_POST['vg_vpn_ip'])?1:0, isset($_POST['vg_vpn_ip'])?"checked":""); 
   	 $vg_options_arr['VG_VPN_IP']=       array($_POST['vg_vpn_ip'], ALLOWVPN, $tmp_str);
   	 
   	 $tmp_str = sprintf("<input type=text size=15 class=z11 name=vg_sessions value='%s'>", $_POST['vg_sessions']);
   	 $vg_options_arr['VG_SESSIONS']=     array($_POST['vg_sessions'], MAX_SESSION_VAL1." ".MAX_SESSION_VAL2, $tmp_str);
   	 
   	 $tmp_str = sprintf("<input type=text size=15 class=z11 name=vg_allow_credit value='%s'>", $_POST['vg_allow_credit']);
   	 $vg_options_arr['VG_ALLOW_CREDIT']= array($_POST['vg_allow_credit'], ALLOWCREDIT.UNTIL, $tmp_str);
   	 
   	 $tmp_str = sprintf("<input type=checkbox name=vg_aon_use class=z11 value='%d' %s>&nbsp;&nbsp;&nbsp;", isset($_POST['vg_aon_use'])?1:0, isset($_POST['vg_aon_use'])?"checked":"");
   	 $tmp_str .= sprintf("<input type=text size=15 class=z11 name=vg_aon value='%s'>", $_POST['vg_aon']);
   	 $vg_options_arr['VG_AON']=          array($_POST['vg_aon'], AUTH_AON_ON, $tmp_str);
   	 
   	 $tmp_str = sprintf("<input type=text size=15 class=z11 name=vg_pin value='%s'>", $_POST['vg_pin']);
   	 $vg_options_arr['VG_PIN']=          array($_POST['vg_pin'], PIN, $tmp_str);
   	 
   
   //////////////////////////////////////////////////////////////////////////
   
   for($i=0;$i<sizeof($_POST['active_set']);$i++)
   {
      list($agent_id,$vg_id,$vg_login) = sscanf($_POST['active_set'][$i],"Agent № %d, ID: %d, %s");

      $tmp_query = sprintf("SELECT type FROM settings where id='%d' LIMIT 1", $agent_id);
      $tmp_result = mysql_fetch_row(mysql_query($tmp_query, $descriptor));
      
      $CURR_AGENT_TYPE = $tmp_result[0];
      
      unset($tmp_result);
      
      if($CURR_AGENT_TYPE == 0 || $CURR_AGENT_TYPE == 1 || $CURR_AGENT_TYPE == 5)
   	 {
   	 	unset($vg_options_arr['VG_AON']);
   	 	unset($vg_options_arr['VG_PIN']);
   	 	$opt_flags[11] = $opt_flags[11] = 0;
   	 }

   	 if($CURR_AGENT_TYPE == 2)
   	 {
   	 	unset($vg_options_arr['VG_AON']);
   	 	unset($vg_options_arr['VG_PIN']);
   	 	unset($vg_options_arr['VG_RESURS']);   
   	 	unset($vg_options_arr['VG_SERVICE']);
   	 	unset($vg_options_arr['VG_TRAFF_DIR']);
   	 	$opt_flags[11] = $opt_flags[12] = $opt_flags[4] = $opt_flags[5] = $opt_flags[6] = 0;
   	 }
   	 
   	 if($CURR_AGENT_TYPE == 4 || $CURR_AGENT_TYPE == 3)
   	 {
   	 	unset($vg_options_arr['VG_AON']);
   	 	unset($vg_options_arr['VG_RESURS']);   
   	 	unset($vg_options_arr['VG_SERVICE']);
   	 	unset($vg_options_arr['VG_TRAFF_DIR']);	    	
   	 	unset($vg_options_arr['VG_SESSIONS']);   
   	 	unset($vg_options_arr['VG_VPN_IP']);
   	 	unset($vg_options_arr['VG_STREAM_VAL']);
   	 	$opt_flags[11] =  $opt_flags[4] = $opt_flags[5] = $opt_flags[6] = $opt_flags[9] = $opt_flags[8] = 0;
   	 }
   	 
   	 if($CURR_AGENT_TYPE == 7)
   	 {
   	 	unset($vg_options_arr['VG_PIN']);
   	 	unset($vg_options_arr['VG_RESURS']);   
   	 	unset($vg_options_arr['VG_SERVICE']);
   	 	unset($vg_options_arr['VG_TRAFF_DIR']);	  
   	 	unset($vg_options_arr['VG_VPN_IP']);
   	 	unset($vg_options_arr['VG_STREAM_VAL']);
   	 	$opt_flags[12] =  $opt_flags[4] = $opt_flags[5] = $opt_flags[6] = $opt_flags[8] = $opt_flags[7] = 0;
   	 }
   	 
   	 if($CURR_AGENT_TYPE == 6)
   	 {
   	 	unset($vg_options_arr['VG_AON']);
   	 	unset($vg_options_arr['VG_RESURS']);   
   	 	unset($vg_options_arr['VG_SERVICE']);
   	 	unset($vg_options_arr['VG_TRAFF_DIR']);	    	
   	 	unset($vg_options_arr['VG_SESSIONS']);   
   	 	unset($vg_options_arr['VG_VPN_IP']);
   	 	unset($vg_options_arr['VG_STREAM_VAL']);
   	 	unset($vg_options_arr['VG_ALLOW_CREDIT']);  	
   	 	$opt_flags[11] =  $opt_flags[4] = $opt_flags[5] = $opt_flags[6] = $opt_flags[8] = $opt_flags[7] = $opt_flags[9] = $opt_flags[10] = 0;	
   	 }
   }
   /*
   echo "<pre>";
   print_r($vg_options_arr);
   echo "</pre>";
   */
   
   
   // Вывод формы опций
   printf("<tr>
               <td colspan=3 align=center class=td_head style=\"border-top: solid 1px #c0c0c0; border-bottom: solid 1px #c0c0c0;\">
               <input type=checkbox name=show_options 
               onClick=\"document.forms[1].devision.value=16; document.forms[1].workmode.value = 11; 
                         document.forms[1].submit();\" %s>
               &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
               <font class=z11>".COMMONOPTIONS."</font></td>
               </tr>
   ", (!empty($_POST['show_options']))?"checked":"");  
   /////////////////////////////////////////////////////////////////////////////////////
   
   if(!empty($_POST['show_options']))
   {
   	$tpl = new HTML_Template_IT(TPLS_PATH); 

	$tpl->loadTemplatefile("ug_options.tpl", true, true); 
	
	foreach($opt_flags as $key=>$value)
	{
		printf("<input type=hidden name=opt_flags[%d] value=%d>", $key, $value);	
	}
	
	$it = 0;
	foreach($vg_options_arr as $key=>$value)
	{
		$tpl->setCurrentBlock("vg_opt_col");
    		$tpl->setVariable("VG_OPT_NAME", $value[1]);
    		$tpl->setVariable("VG_OPT_VAL", $value[2]);
     		if($it==0) $tpl->setVariable("VG_OPT_BORD", " border-right: solid 1px #c0c0c0;");
      	else $tpl->setVariable("VG_OPT_BORD", " ");
		$tpl->parseCurrentBlock("vg_opt_col");
		++$it;
		if($it == 2)
		{
			$tpl->setCurrentBlock("vg_opt_row");
			$tpl->parseCurrentBlock("vg_opt_row");
			$it=0;
		}
	}

	if($it == 1)
	{
		$tpl->setCurrentBlock("vg_opt_col");
    		$tpl->setVariable("VG_OPT_NAME", "&nbsp;");
    		$tpl->setVariable("VG_OPT_VAL", "&nbsp;");
    		$tpl->setVariable("VG_OPT_BORD", " ");
		$tpl->parseCurrentBlock("vg_opt_col");	
		$tpl->setCurrentBlock("vg_opt_row");
		$tpl->parseCurrentBlock("vg_opt_row");
	}
	
	$tpl->setCurrentBlock("vg_options");
	$tpl->parseCurrentBlock("vg_options");
	
	$tpl->show();
   }
   /////////////////////////////////////////////////////////////////////////////////////
   
   // Окончание основной формы
     printf("<tr><td colspan=3 align=center style=\"\">
         <table align=center bgcolor=ffffff cellspacing=0 cellpadding=0 border=0 width=748><tr>
          <td align=center><br>
         <input class=z11 type=submit name=%s value=\"%s\" style=\"width: 100px\"
         onclick=\"document.forms[1].devision.value=16;\">
         <input class=z11 type=submit name=man_cancel value=\"%s\" style=\"width: 100px\"><br><br>
         </td>
         </tr></table>

         </td></tr>",$savemode, SAVE, CANCELLATION);

   printf("</table>");
   
   
/**
 * Список присвоеных тарифных планов данного объединения
 * @var		Массив со идентификаторами назначеных тарифов
 */
function assignedTars()
{
	// Добавление новых значений в массив с присвоеными тарифами в объединении
	if(isset($_POST['tars_to_add']) && is_array($_POST['tar_st_av']) && count($_POST['tar_st_av']) > 0)
	{
		foreach($_POST['tar_st_av'] as $_arr_val)
			$_POST['tars'][] = $_arr_val;
			
		if(is_array($_POST['tars_del']) && count($_POST['tars_del']) > 0) 
			$_POST['tars_del'] = array_diff($_POST['tars_del'], $_POST['tars']);
	}
	
	// Удаление существующих значений из массива присвоеных тарифов
	if(isset($_POST['tars_to_del']) && is_array($_POST['tar_st_sg']) && count($_POST['tar_st_sg']) > 0)
	{
		foreach($_POST['tar_st_sg'] as $_arr_val)
		{
			if(is_array($_POST['tars_del']) && count($_POST['tars_del']) > 0)
			{
				$search = array_search($_arr_val, $_POST['tars_del']);
				if(strlen($search) > 0 && $search >= 0) continue;
			}
			
			$_POST['tars_del'][] = $_arr_val;
		}
	}
	
	// Востановление значений из СУБД
	$sql_assign_query = sprintf("SELECT group_id, tar_id FROM tarifs_staff WHERE group_id = %d", $_POST['ug_id']);
	$assign_query = @mysql_query($sql_assign_query);
	
	if($assign_query != false && @mysql_num_rows($assign_query) > 0)
	{
		while($assign = mysql_fetch_row($assign_query))
		{
			if(is_array($_POST['tars']) && count($_POST['tars']) > 0)
			{
				$search = array_search($assign[1], $_POST['tars']);
				if(strlen($search) > 0 && $search >= 0) continue;
			}
			
			$_POST['tars'][] = $assign[1];
		}
	}
	
	if(is_array($_POST['tars_del']) && count($_POST['tars_del']) > 0) $_POST['tars'] = array_diff($_POST['tars'], $_POST['tars_del']);
	
} // end assignedTars()


/**
 * Построение эелементов из массива $_POST['tars']
 * @var		0 - hidden, 1 - option
 * @var		Имя hidden
 */
function buildTarsElements( $element = 0, $hid_el = "tars" )
{
	switch($element)
	{
	case 1: if(count($_POST['tars']) == 0) return;
		$tar_ids = implode(",", $_POST['tars']);
		$sql_tar_name_query = sprintf("SELECT tar_id, descr FROM tarifs WHERE tar_id IN (%s) AND archive = 0", $tar_ids);
		$tar_name_query = @mysql_query($sql_tar_name_query);
		if(!$tar_name_query || @mysql_num_rows($tar_name_query) == 0) return;
		
		while($tar_name = mysql_fetch_row($tar_name_query))
			$options .= sprintf("<option value=%d>ID: %d, %s</option>", $tar_name[0], $tar_name[0], $tar_name[1]);
		
		return $options;
		
		break;
		
	default:if(count($_POST[$hid_el]) == 0) return;
		foreach($_POST[$hid_el] as $_arr_val)
			$hiddens .= sprintf("<input type=hidden name=%s[] value=%d>", $hid_el, $_arr_val);
		
		return $hiddens;
		
	}
} // end buildTarsElements()


/**
 * Тарифы доступные для назначение в объединеннии
 *
 */
function freeTars()
{
	$sql_tarifs_query = sprintf("SELECT t1.tar_id, t1.descr FROM tarifs as t1 %s
			WHERE t1.archive = 0 AND t1.unavaliable = 0 %s GROUP BY t1.tar_id", 
			($_POST['tariffs_ug'] > 0) ? sprintf("LEFT JOIN tarifs as t2 ON (t2.tar_id = %d)", $_POST['tariffs_ug']) : "", 
			($_POST['tariffs_ug'] > 0) ? "AND t1.type = t2.type" : "");
			
	$tarifs_query = @mysql_query($sql_tarifs_query);
	
	if($tarifs_query != false && @mysql_num_rows($tarifs_query) > 0)
	{
		$options;
		
		while($tarifs = mysql_fetch_row($tarifs_query))
		{
			if(is_array($_POST['tars']) && count($_POST['tars']) > 0)
			{
				$search = array_search($tarifs[0], $_POST['tars']);
				if(strlen($search) > 0 && $search >= 0) continue;
			}
			
			$options .= sprintf("<option value=%d>ID: %d, %s</option>", $tarifs[0], $tarifs[0], $tarifs[1]);
		}
		
		return $options;
	}
} // end freeTars()

?>
