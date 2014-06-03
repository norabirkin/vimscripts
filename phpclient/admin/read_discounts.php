<?PHP
/********************************************************************
   filename:    read_discounts.php
   modified:   November 04 2004 20:38:36.
   author:      LANBilling

   version:    LANBilling 1.8
*********************************************************************/
if (!session_is_registered("auth"))
{
   exit;
}
         // Óñòàíîâëåíèå ñâÿçè ñ ÁÄ
         $descriptor=mysql_connect($serveraddress,$mysqluser,$mysqlpassword);
         mysql_select_db($mysqldatabase,$descriptor);

         // ×òåíèå ïàğàìåòğîâ äëÿ îáúåìíûõ ñêèäîê
         $qstring=sprintf("select amount,discount,rate,dis_id,bonus from discounts
         where tar_id=%d order by dis_id",$_POST['id']);
         $result=mysql_query($qstring);

         for($p=0;$p<mysql_affected_rows();$p++)
         {
         $cur_row=mysql_fetch_row($result);

         $_POST['vdis_saved'][] = $cur_row[3];

         $saved_vdis_vol="vdis_vol_".$cur_row[3];
         $saved_vdis_pcnt = "vdis_pcnt_".$cur_row[3];
         $saved_vdis_rate = "vdis_rate_".$cur_row[3];
         $saved_vdis_bonus = "vdis_bonus_".$cur_row[3];

         $_POST[$saved_vdis_vol] = $cur_row[0];
         $_POST[$saved_vdis_pcnt] = $cur_row[1];
         $_POST[$saved_vdis_rate] = $cur_row[2];
         $_POST[$saved_vdis_bonus] = $cur_row[4];

         }
         // Îêîí÷àíèå ÷òåíèÿ ïàğàìåòğîâ äëÿ îáúåìíûõ ñêèäîê

         // ×òåíèå ïàğàìåòğîâ âğåìåííûõ ñêèäîê
         $qstring=sprintf("select HOUR(timefrom),MINUTE(timefrom),HOUR(timeto),MINUTE(timeto),
         discount,rate,bonus_id from bonuses
         where tar_id=%d order by bonus_id",$_POST['id']);
         $result=mysql_query($qstring);

            for($p=0;$p<mysql_affected_rows();$p++)
            {
            $cur_row=mysql_fetch_row($result);

            $_POST['tdis_saved'][] = $cur_row[6];

            $saved_tdis_hf="tdis_hourfrom_".$cur_row[6];
            $saved_tdis_ht="tdis_hourto_".$cur_row[6];
            $saved_tdis_mf="tdis_minfrom_".$cur_row[6];
            $saved_tdis_mt="tdis_minto_".$cur_row[6];

            $saved_tdis_pcnt = "tdis_pcnt_".$cur_row[6];
            $saved_tdis_rate = "tdis_rate_".$cur_row[6];

            $_POST[$saved_tdis_hf] = $cur_row[0];
            $_POST[$saved_tdis_mf] = $cur_row[1];
            $_POST[$saved_tdis_ht] = $cur_row[2];
            $_POST[$saved_tdis_mt] = $cur_row[3];


            $_POST[$saved_tdis_pcnt] = $cur_row[4];
            $_POST[$saved_tdis_rate] = $cur_row[5];

            }
         // Îêîí÷àíèå ÷òåíèÿ ïàğàìåòğîâ âğåìåííûõ ñêèäîê

         // ×òåíèå çíà÷åíèÿ äëÿ ñêèäêè âûõîäíîãî äíÿ
         $qstring=sprintf("select discount,rate from we_bonus where tar_id=%d",$_POST['id']);
         $result=mysql_query($qstring);
         if (mysql_affected_rows() > 0)
         {

         $cur_row=mysql_fetch_row($result);
         $_POST['we_percent_dis'] = $cur_row[0];
         $_POST['we_abs_dis'] = $cur_row[1];
         $_POST['weekend_flag'] = 1;
         }
         // Îêîí÷àíèå ÷òåíèÿ ñêèäêè âûõîäíîãî äíÿ

         // ×òåíèå êàëåíäàğÿ òåêóùåãî ìåñÿöà

         $time2view = mktime(0,0,0,date("m",time()),1,date("Y",time()) );
         $_POST['calendar_month'] = date("m",$time2view);
         $_POST['calendar_year'] = date("Y",$time2view);

         // Ñêîëüêî äíåé â òåêóùåì ìåñÿöå
         $read_month = date("m",$time2view);
         $read_year = date("Y",$time2view);

         $thismonth = mktime (0,0,0,$read_month+1,0,$read_year);
         $thismonth = (strftime ("%d",$thismonth));


         $qstring=sprintf("select DATE_FORMAT(date,'%%d'),we_flag from weekends where date >= '%s' and date <= '%s'",
         date("Ymd",$time2view), date("Ymd",mktime(0,0,0,date("m",$time2view),$thismonth,date("Y",$time2view) )) );
         $result=mysql_query($qstring);

         for($p=0;$p<mysql_affected_rows();$p++)
            {
            $cur_row=mysql_fetch_row($result);

            $var_name = sprintf("weim_%d",$cur_row[0]);

            if($cur_row[1] == 1) $_POST[$var_name] = $cur_row[1];

            }

         // Îêîí÷àíèå ÷òåíèÿ êàëåíäàğÿ

         // Çàâåğøåíèå ğàáîòû ñ ÁÄ
         mysql_close($descriptor);

?>
