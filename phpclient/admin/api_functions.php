<?php
/********************************************************************
        filename:         api_functions.php
        modified:        October 14 2004 18:41:06.
        author:                LANBilling

        version:    LANBilling 1.8
*********************************************************************/
function make_cards($param1,$param2,$param3,$exp_year,$exp_month,$exp_day,$znachnost,$ac,$address,$set_id,$alive)
{

        //error_reporting (E_ALL);

        printf("<table  bgcolor=ffffff align=center cellspacing=0 cellpadding=0 border=0  width=750 style=\"border: solid 1px #c0c0c0;border-bottom:0px;\">
                        <tr><td colspan=3 align=center bgcolor=e0e0e0 style=\"border-bottom: solid 1px #c0c0c0;\" height=25><font class=z11 size=-1><b>%s</b></font></td></tr>\n", APICONNECT.API_F1);

        /* Get the port for the LANBilling service. */
        $service_port = 34010;

        /* Create a TCP/IP socket. */
        printf("<tr><td height=20 align=left width=50%% bgcolor=ffffff style=\"border-bottom: solid 1px #c0c0c0;\"><font class=z11 size=-1>&nbsp;&nbsp;&nbsp;%s</font></td>\n", MKSOCKET);
        $socket = socket_create (AF_INET, SOCK_STREAM, 0);
        if ($socket < 0)
        {
        bars("socket_create",1);
        echo "socket_create() failed: reason: " . socket_strerror ($socket) . "\n";
        } else
        {
        bars("socket_create",0);
        }

        // echo "Attempting to connect to '$address' on port '$service_port'...";
        printf("<tr><td height=20 align=left width=50%% bgcolor=ffffff style=\"border-bottom: solid 1px #c0c0c0;\"><font class=z11 size=-1>&nbsp;&nbsp;&nbsp;%s %s%s%s</font></td>\n", TRY2CONNECT,$address,COLON,$service_port);
        $result = socket_connect ($socket, $address, $service_port);

        if ($result <= 0)
        {
        bars("socket_connect",1);
        // printf("socket_connect() failed. Reason: (%d) %s \n",$result,socket_strerror($result));
        }
        else
        {
        bars("socket_connect",0);
        }

        $fid = 1;
        $out = '';

        $message = sprintf("%d:%d:%d:%d:%d:%d:%d:%d:%d:%d:%ld<FIN>\n",
        $fid,$param1,$param2,$param3,$exp_year,$exp_month,$exp_day,$znachnost,$ac,$set_id,$alive);

        // printf("Sending function id ... %d<br>",$message);
        printf("<tr><td height=20 align=left width=50%% bgcolor=ffffff style=\"border-bottom: solid 1px #c0c0c0;\"><font class=z11 size=-1>&nbsp;&nbsp;&nbsp;%s%s %d</font></td>\n", ACT_REQUEST,COLON,$fid);
        $result = socket_write ($socket,$message, strlen ($message));

        if ($result <= 0)
        {
        bars("socket_write",1);
        // printf("socket_write() failed. Reason: (%d) %s \n",$result);
        }
        else
        {
        bars("socket_write",0);
        }

        // echo "Reading response:\n\n";
        $out = socket_read ($socket, 2);
        printf("<tr><td height=20 align=left width=50%% bgcolor=ffffff style=\"border-bottom: solid 1px #c0c0c0;\"><font class=z11 size=-1>&nbsp;&nbsp;&nbsp;%s%s %d</font></td>\n", API_RESPONSE,COLON,$out);
        bars("socket_read",0);

        printf("<tr><td height=20 align=left width=50%% bgcolor=ffffff style=\"border-bottom: solid 1px #c0c0c0;\"><font class=z11 size=-1>&nbsp;&nbsp;&nbsp;%s</font></td>\n",SOCK_CLOSE);
        // echo "Closing socket...";
        socket_close ($socket);
        bars("socket_close",0);

        if ( $result > 0)
        printf("<tr><td colspan=3 align=center bgcolor=e0e0e0 style=\"border-bottom: solid 1px #c0c0c0;\" height=25><font class=z11 size=-1><b>%s %d</b></font></td></tr>\n",CARDSCREATEDOK.COLON,$param1);
        else
        printf("<tr><td colspan=3 align=center bgcolor=e0e0e0 style=\"border-bottom: solid 1px #c0c0c0;\" height=25><font class=z11 size=-1><b>%s</b></font></td></tr>\n",CARDSCREATEDFAIL);

        printf("</table>");

}
// Make cards ended

// Start export_reports
function export_report1($year,$month,$type,$address,$fid, $date_in=0, $add_str=""){

//error_reporting(E_ALL);
printf("<table  bgcolor=ffffff align=center cellspacing=0 cellpadding=0 border=0  width=750 style=\"border: solid 1px #c0c0c0;border-bottom:0px;\">
                        <tr><td colspan=3 align=center bgcolor=e0e0e0 style=\"border-bottom: solid 1px #c0c0c0;\" height=25><font class=z11 size=-1><b>%s</b></font></td></tr>\n", APICONNECT.API_F2);


/* Get the port for the WWW service. */
$service_port = 34010;

/* Create a TCP/IP socket. */
printf("<tr><td height=20 align=left width=50%% bgcolor=ffffff style=\"border-bottom: solid 1px #c0c0c0;\"><font class=z11 size=-1>&nbsp;&nbsp;&nbsp;%s</font></td>\n", MKSOCKET);
$socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);

if ($socket < 0)
        {
        bars("socket_create",1);
        echo "socket_create() failed: reason: " . socket_strerror ($socket) . "\n";
        } else
        {
        bars("socket_create",0);
        }

printf("<tr><td height=20 align=left width=50%% bgcolor=ffffff style=\"border-bottom: solid 1px #c0c0c0;\"><font class=z11 size=-1>&nbsp;&nbsp;&nbsp;%s %s%s%s</font></td>\n", TRY2CONNECT,$address,COLON,$service_port);

$result = socket_connect($socket, $address, $service_port);
        if ($result <= 0)
        {
        bars("socket_connect",1);
        // printf("socket_connect() failed. Reason: (%d) %s \n",$result,socket_strerror($result));
        }
        else
        {
        bars("socket_connect",0);
        }

$out = '';

if($fid == 4)
{
   //echo $year."<br />";
    $in = sprintf("%d:%s<FIN>\n",
        $fid,$add_str);
}
else 
{
   $in = sprintf("%d:%d:%d:%d<FIN>\n",
        $fid,$year,$month,$type);
}

if($fid==3)
{
        if($type=='0')$type=D_TYPE_1C;
        if($type=='1')$type=D_TYPE_PARUS;
}
else if($fid==4)
{
        $months = array(JANUARY, FEBRUARY, MARCH, APRIL, MAY,
                JUNE, JULY, AUGUST, SEPTEMBER, OCTOBER, NOVEMBER, DECEMBER);
        if($type=='0')$type=D_TYPE_BAL_1;
        if($type=='1')$type=D_TYPE_BAL_2.$months[$month-1].' '.$year;
}

printf("<tr><td height=20 align=left width=50%% bgcolor=ffffff style=\"border-bottom: solid 1px #c0c0c0;\"><font class=z11 size=-1>&nbsp;&nbsp;&nbsp;%s%s %d</font></td>\n", ACT_REQUEST,COLON,$fid);
$result = socket_write($socket, $in, strlen($in));
if ($result <= 0)
        {
        bars("socket_write",1);
        // printf("socket_write() failed. Reason: (%d) %s \n",$result);
        }
        else
        {
        bars("socket_write",0);
        }

        $out = socket_read ($socket, 2048);
        printf("<tr><td height=20 align=left width=50%% bgcolor=ffffff style=\"border-bottom: solid 1px #c0c0c0;\"><font class=z11 size=-1>&nbsp;&nbsp;&nbsp;%s%s %d</font></td>\n", API_RESPONSE,COLON,$out);
        if((integer)$out==1)
        {
                bars("socket_read",0);
        }
        else
        {
                bars("socket_read",1);
        }


        printf("<tr><td height=20 align=left width=50%% bgcolor=ffffff style=\"border-bottom: solid 1px #c0c0c0;\"><font class=z11 size=-1>&nbsp;&nbsp;&nbsp;%s</font></td>\n",SOCK_CLOSE);
        // echo "Closing socket...";
        socket_close ($socket);
        bars("socket_close",0);

        if($fid==3)
        {
                if ( $result > 0 && (integer)$out==1)
                printf("<tr><td colspan=3 align=center bgcolor=e0e0e0 style=\"border-bottom: solid 1px #c0c0c0;\" height=25><font class=z11 size=-1><b>%s %s</b></font></font></td></tr>\n",EXPORTREPOK.COLON,$type);
                else
                printf("<tr><td colspan=3 align=center bgcolor=e0e0e0 style=\"border-bottom: solid 1px #c0c0c0;\" height=25><font class=z11 size=-1><b>%s</b></font></td></tr>\n",EXPORTREPFAIL);
        }

        if($fid==4)
        {
                if ( $result > 0 && (integer)$out==1)
                printf("<tr><td colspan=3 align=center bgcolor=e0e0e0 style=\"border-bottom: solid 1px #c0c0c0;\" height=25><font class=z11 size=-1><b>%s</b></font></font></td></tr>\n",GENREPOK);
                else
                printf("<tr><td colspan=3 align=center bgcolor=e0e0e0 style=\"border-bottom: solid 1px #c0c0c0;\" height=25><font class=z11 size=-1><b>%s</b></font></td></tr>\n",EXPORTREPFAIL);

        }
        
        if($fid != 4) printf("<tr><td colspan=3 align=center bgcolor=e0e0e0 style=\"border-bottom: solid 1px #c0c0c0;\" height=25><a href='download_1c.php' target=\"blank\"><font class=z11 size=+1><b>%s</b></font></a></td></tr>", SAVE_TO_DISK);

        printf("</table>");


//Проверка на прочность
//if($out == "3<FIN>/n")echo "OK.";
        //error_reporting(E_NONE);
}
//Reports ended...
//Оплата счетов...
function pay_invoice($vg_id,$sum,$address,$inv_no, $issuedate){

//error_reporting(E_ALL);
printf("<table  bgcolor=ffffff cellspacing=0 cellpadding=0 border=0  width=750 style=\"border: solid 1px #c0c0c0;border-bottom:0px;\">
                        <tr><td colspan=3 align=center bgcolor=e0e0e0 style=\"border-bottom: solid 1px #c0c0c0;\" height=25><font class=z11 size=-1><b>%s</b></font></td></tr>\n", APICONNECT.API_F5);


/* Get the port for the WWW service. */
$service_port = 34010;

/* Create a TCP/IP socket. */
printf("<tr><td height=20 align=left width=50%% bgcolor=ffffff style=\"border-bottom: solid 1px #c0c0c0;\"><font class=z11 size=-1>&nbsp;&nbsp;&nbsp;%s</font></td>\n", MKSOCKET);
$socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);

if ($socket < 0)
        {
        bars("socket_create",1);
        echo "socket_create() failed: reason: " . socket_strerror ($socket) . "\n";
        } else
        {
        bars("socket_create",0);
        }

printf("<tr><td height=20 align=left width=50%% bgcolor=ffffff style=\"border-bottom: solid 1px #c0c0c0;\"><font class=z11 size=-1>&nbsp;&nbsp;&nbsp;%s %s%s%s</font></td>\n", TRY2CONNECT,$address,COLON,$service_port);

$result = socket_connect($socket, $address, $service_port);
        if ($result <= 0)
        {
        bars("socket_connect",1);
        // printf("socket_connect() failed. Reason: (%d) %s \n",$result,socket_strerror($result));
        }
        else
        {
        bars("socket_connect",0);
        }

$out = '';

$in = sprintf("5:%d:%d:%s\n",
        $vg_id,$issuedate,$inv_no);

printf("<tr><td height=20 align=left width=50%% bgcolor=ffffff style=\"border-bottom: solid 1px #c0c0c0;\"><font class=z11 size=-1>&nbsp;&nbsp;&nbsp;%s%s %d</font></td>\n", ACT_REQUEST,COLON,5);
$result = socket_write($socket, $in, strlen($in));
if ($result <= 0)
        {
        bars("socket_write",1);
        // printf("socket_write() failed. Reason: (%d) %s \n",$result);
        }
        else
        {
        bars("socket_write",0);
        }

        $out = socket_read ($socket, 2048);
        printf("<tr><td height=20 align=left width=50%% bgcolor=ffffff style=\"border-bottom: solid 1px #c0c0c0;\"><font class=z11 size=-1>&nbsp;&nbsp;&nbsp;%s%s %d</font></td>\n", API_RESPONSE,COLON,$out);
        if((integer)$out==1 || (integer)$out==2 || (integer)$out==3)
        {
                bars("socket_read",0);
        }
        else
        {
                bars("socket_read",1);
        }


        printf("<tr><td height=20 align=left width=50%% bgcolor=ffffff style=\"border-bottom: solid 1px #c0c0c0;\"><font class=z11 size=-1>&nbsp;&nbsp;&nbsp;%s</font></td>\n",SOCK_CLOSE);
        // echo "Closing socket...";
        socket_close ($socket);
        bars("socket_close",0);


        if ( $result > 0 && (integer)$out==1)
                printf("<tr><td colspan=3 align=center bgcolor=e0e0e0 style=\"border-bottom: solid 1px #c0c0c0;\" height=25><font class=z11 size=-1><b>%s</b></font></font></td></tr>\n",APIFUNC5ENDED3);
        elseif ( $result > 0 && (integer)$out==0)
                printf("<tr><td colspan=3 align=center bgcolor=e0e0e0 style=\"border-bottom: solid 1px #c0c0c0;\" height=25><font class=z11 size=-1><b>%s</b></font></font></td></tr>\n",APIFUNC5ENDED1);

        printf("</table>");

//Проверка на прочность
//if($out == "3<FIN>/n")echo "OK.";

        return (integer)$out;

}

function oper_export($address,$oper_id,$group_id){

//error_reporting(E_ALL);
printf("<table align=center bgcolor=ffffff cellspacing=0 cellpadding=0 border=0  width= 991 style=\"border: solid 1px #c0c0c0;border-bottom:0px;\">
                        <tr><td colspan=3 align=center bgcolor=e0e0e0 style=\"border-bottom: solid 1px #c0c0c0;\" height=25><font class=z11 size=-1><b>%s</b></font></td></tr>\n", APICONNECT.API_F6);


/* Get the port for the WWW service. */
$service_port = 34010;

/* Create a TCP/IP socket. */
printf("<tr><td height=20 align=left width=50%% bgcolor=ffffff style=\"border-bottom: solid 1px #c0c0c0;\"><font class=z11 size=-1>&nbsp;&nbsp;&nbsp;%s</font></td>\n", MKSOCKET);
$socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);

if ($socket < 0)
        {
        bars("socket_create",1);
        echo "socket_create() failed: reason: " . socket_strerror ($socket) . "\n";
        } else
        {
        bars("socket_create",0);
        }

printf("<tr><td height=20 align=left width=50%% bgcolor=ffffff style=\"border-bottom: solid 1px #c0c0c0;\"><font class=z11 size=-1>&nbsp;&nbsp;&nbsp;%s %s%s%s</font></td>\n", TRY2CONNECT,$address,COLON,$service_port);

$result = socket_connect($socket, $address, $service_port);
        if ($result <= 0)
        {
        bars("socket_connect",1);
        // printf("socket_connect() failed. Reason: (%d) %s \n",$result,socket_strerror($result));
        }
        else
        {
        bars("socket_connect",0);
        }

$out = '';

$in = sprintf("6:%d:%d:\n",
        $oper_id,$group_id);

printf("<tr><td height=20 align=left width=50%% bgcolor=ffffff style=\"border-bottom: solid 1px #c0c0c0;\"><font class=z11 size=-1>&nbsp;&nbsp;&nbsp;%s%s %d</font></td>\n", ACT_REQUEST,COLON,6);
$result = socket_write($socket, $in, strlen($in));
if ($result <= 0)
        {
        bars("socket_write",1);
        // printf("socket_write() failed. Reason: (%d) %s \n",$result);
        }
        else
        {
        bars("socket_write",0);
        }

        $out = socket_read ($socket, 2048);
        printf("<tr><td height=20 align=left width=50%% bgcolor=ffffff style=\"border-bottom: solid 1px #c0c0c0;\"><font class=z11 size=-1>&nbsp;&nbsp;&nbsp;%s%s %d</font></td>\n", API_RESPONSE,COLON,$out);
        if((integer)$out>=0)
        {
                bars("socket_read",0);
        }
        else
        {
                bars("socket_read",1);
        }


        printf("<tr><td height=20 align=left width=50%% bgcolor=ffffff style=\"border-bottom: solid 1px #c0c0c0;\"><font class=z11 size=-1>&nbsp;&nbsp;&nbsp;%s</font></td>\n",SOCK_CLOSE);
        // echo "Closing socket...";
        socket_close ($socket);
        bars("socket_close",0);


        if($result>0)
        {
          switch((integer)$out)
          {
            case -1: $msg = APIFUNC6ENDED2;break;
            case -2: $msg = APIFUNC6ENDED3;break;
            case -3: $msg = APIFUNC6ENDED4;break;
            case -4: $msg = APIFUNC6ENDED5;break;
            case -5: $msg = APIFUNC6ENDED5;break;
            default: $msg = APIFUNC6ENDED1.(integer)$out;
          }
          printf("<tr><td colspan=3 align=center bgcolor=e0e0e0 style=\"border-bottom: solid 1px #c0c0c0;\" height=25><font class=z11 size=-1><b>%s</b></font></font></td></tr>\n",$msg);
        }
        
        printf("</table><br><br>");
        return (integer)$out;

}


/**
 * Проверка переменной на не совпадение по типичным признакам
 *
 */
function checkThisVariable( $variable, $var_isset = 0, $var_empty = 0, $var_min_0 = 0, $var_max_0 = 0 )
{
	if($var_isset == 1 && !isset($variable)) return false;
	if($var_empty == 1 && empty($variable)) return false;
	if($var_min_0 == 1 && $variable < 0) return false;
	if($var_max_0 == 1 && $variable > 0) return false;
	
	return true;
} // end sendDataToSocket()

?>
