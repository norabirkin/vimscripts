<?PHP
/********************************************************************
   filename:    read_calendar.php
   modified:   November 04 2004 20:38:30.
   author:      LANBilling

   version:    LANBilling 1.8
*********************************************************************/
if (!session_is_registered("auth"))
{
   exit;
}

         for($i=1;$i<=31;$i++)
         {
         $var_name = sprintf("weim_%d",$i);
         unset($_POST[$var_name]);
         }

         $qstring=sprintf("select DATE_FORMAT(date,'%%d'),we_flag from weekends where date >= '%s' and date <= '%s'",
         date("Ymd",$time2view), date("Ymd",mktime(0,0,0,date("m",$time2view),$daysinmonth,date("Y",$time2view) )) );
         $result=mysql_query($qstring);

         if(mysql_num_rows($result) > 0)
         {
            for($p=0;$p<mysql_num_rows($result);$p++)
            {
            $cur_row=mysql_fetch_row($result);

            $var_name = sprintf("weim_%d",$cur_row[0]);
            if($cur_row[1] == 1) $_POST[$var_name] = $cur_row[1];
            }
            $is_month_saved = 1;
         }
         else 
            $is_month_saved = 0;


?>
