<?php
/********************************************************************
        filename:         functions.inc
        modified:        November 04 2004 13:42:46.
        author:                LANBilling

        version:    LANBilling 1.8
*********************************************************************/
function exists_in_intset($temp,&$set)
{
$cur_temp_size=sizeof($temp);
for ($j=0;$j<sizeof($set);$j++)
        {
                $set_size=sizeof($set[$j]);
                        if($set_size != $cur_temp_size)
                                {
                                return 0;
                                }
                        elseif ($temp == $set[$j])
                                {
                                return 1;
                                }
        }
return 0;
}

function show_set(&$set)
{
for ($j=0;$j<sizeof($set);$j++)
        {
        printf("Set : %s<br>",$set[$j]);
        }
}

function getipmask($string)

{
                        $i=0;
                        $j=0;
                        $mask="";
                        do {
                        $mask=$mask.$string[$i];
                        if ($string[$i] == ".") {
                                                                        $j++;
                                                                        }
                        $i++;
                        }
                        while ($j !=3);
                        return ($mask);
}

function get_octets($ip,&$octet)
{
        $octet[0] = (integer)strtok($ip,"./");
        $i=0;
                while ($octet[$i] or $i<4) {
                        $i++;
                        $octet[$i] = (integer)strtok("./");
                }
}
function getmasksize($mask)
{
        $token=strtok($mask,"/");
        return (integer)strtok("/");
}
function belongs_to_mask($ip,$mask)   // 1 - принадлежит , 0 - не принадлежит
{
        get_octets($ip,$ip_tokens);
        get_octets($mask,$mask_tokens);
        $lo_ip_word=($ip_tokens[2]<<8)+$ip_tokens[3];
    $hi_ip_word=($ip_tokens[0]<<8)+$ip_tokens[1];
        $lo_mask_word=($mask_tokens[2]<<8)+$mask_tokens[3];
        $hi_mask_word=($mask_tokens[0]<<8)+$mask_tokens[1];
        $z=getmasksize($mask);
        if($z>16)
        {
        $a=$hi_ip_word^$hi_mask_word;
        //printf("<br> A = %d",$a);
        $shift_bytes=32-$z;
        $b=($lo_ip_word>>$shift_bytes)^($lo_mask_word>>$shift_bytes);
        //printf("<br> B = %d",$b);
        return !((bool)$a|(bool)$b);
        }
        else // <= 16
        {
        $shift_bytes=16-$z;
        $a=($hi_ip_word>>$shift_bytes)^($hi_mask_word>>$shift_bytes);
        return !((bool)$a);
        }
}
// Береш 255.255.255.0 получаешь 24
function getmaskbytes($mask)
{
get_octets($mask,$mask_tokens);
$masksize=0;
$lo_mask_word=(integer)(($mask_tokens[2]<<8)+$mask_tokens[3]);
$hi_mask_word=(integer)(($mask_tokens[0]<<8)+$mask_tokens[1]);
$lo_word=decbin($lo_mask_word);
$hi_word=decbin($hi_mask_word);
        $arr=count_chars($lo_word,1);
        $masksize=$arr[ord("1")];
        $arr=count_chars($hi_word,1);
        $masksize=$masksize+$arr[ord("1")];
return $masksize;
}
// Береш 192.168.10.0/24 получаешь 192.168.10.0
function get_netnum($netmask)
{
get_octets($netmask,$net_tokens);
$result=sprintf("%d.%d.%d.%d",$net_tokens[0],$net_tokens[1],$net_tokens[2],$net_tokens[3]);
return $result;
}

function symbol_mask($size)
        {
        if($size > 24) // Маска в пределах 25 - 32
        {
        $o1=255;
        $o2=255;
        $o3=255;
        $o4=255&(255<<(32-$size));
        }
        elseif($size > 16) // Маска в пределах 17 - 24
        {
        $o1=255;
        $o2=255;
        $o3=255&(255<<(24-$size));
        $o4=0;
        }
        elseif($size > 8) // Маска в пределах 9 - 16
        {
        $o1=255;
        $o2=255&(255<<(16-$size));
        $o3=0;
        $o4=0;
        }
        else // Маска в пределах 1 - 8
        {
        $o1=255&(255<<(8-$size));
        $o2=0;
        $o3=0;
        $o4=0;
        }
        $result = sprintf("%d.%d.%d.%d",$o1,$o2,$o3,$o4);
        return $result;
        }
        function bars($tit,$mode)
        {
        printf("<td align=right width=30%% bgcolor=ffffff style=\"border-bottom: solid 1px #c0c0c0;\"><font class=z11 size=-1>%s:&nbsp;</font></td>",$tit);

        if($mode == 0)
        printf("<td align=left style=\"border-bottom: solid 1px #c0c0c0;\"><font class=z11 size=-1 color=lime><b>&nbsp;&nbsp;OK</b></font></td></tr>");
        else
        printf("<td align=left style=\"border-bottom: solid 1px #c0c0c0;\"><font class=z11 size=-1 color=red><b>&nbsp;&nbsp;FAIL</b></font></td></tr>");
        return (0);

        }
function gen_opt($type, $exval)
{
                $months = array(JANUARY, FEBRUARY, MARCH, APRIL, MAY,
                JUNE, JULY, AUGUST, SEPTEMBER, OCTOBER, NOVEMBER, DECEMBER);
                $curr = time()+ 94608000;
                $ret;

                if($type == -2){
                        if ($exval == -1)
                        $ret .= sprintf("<option value=-1 selected>%s", YEAR);
                        else
                        $ret .= sprintf("<option value=-1>%s", YEAR);

                        for($i=date(Y)+2, $stop_for = (date(Y) - 10); $i > $stop_for; $i--){
                                if($exval != $i)
                                        $ret .= sprintf("<option value=%d>%d", $i, $i);
                                else
                                        $ret .= sprintf("<option value=%d selected>%d", $i, $i);
                        }
                        return($ret);
                }
                if($type == -1){
                        if ($exval == -1)
                        $ret .= sprintf("<option value=-1 selected>%s", YEAR);
                        else
                        $ret .= sprintf("<option value=-1>%s", YEAR);

                        for($i=date(Y), $stop_for = (date(Y) - 10); $i > $stop_for; $i--){
                                if($exval != $i)
                                        $ret .= sprintf("<option value=%d>%d", $i, $i);
                                else
                                        $ret .= sprintf("<option value=%d selected>%d", $i, $i);
                        }
                        return($ret);
                }
                if($type == 1){
                        if ($exval == -1)
                        $ret .= sprintf("<option value=-1 selected>%s", YEAR);
                        else
                        $ret .= sprintf("<option value=-1>%s", YEAR);

                        for($i = 2005; $i < 2016; $i++){
                                if($exval != $i)
                                        $ret .= sprintf("<option value=%d>%d", $i, $i);
                                else
                                        $ret .= sprintf("<option value=%d selected>%d", $i, $i);

                        }
                        return($ret);
                }
                if($type == 2){

                        if ($exval == -1)
                        $ret .= sprintf("<option value=-1 selected>%s", MONTH);
                        else
                        $ret .= sprintf("<option value=-1>%s", MONTH);

                        for($i = 0; $i < 12; $i++){
                                if($exval != $i+1)
                                {

                                        if($i < 9)
                                                $ret .= sprintf("<option value=0%d>%s", $i+1, $months[$i]);
                                        else
                                                $ret .= sprintf("<option value=%d>%s", $i+1, $months[$i]);
                                }
                                else
                                {
                                        if($i < 9)
                                                $ret .= sprintf("<option value=0%d selected>%s", $i+1, $months[$i]);
                                        else
                                                $ret .= sprintf("<option value=%d selected>%s", $i+1, $months[$i]);
                                }
                        }
                        return($ret);
                }
                if($type == 4){

                        if ($exval == -1)
                        $ret .= sprintf("<option value=-1 selected>%s", DAY);
                        else
                        $ret .= sprintf("<option value=-1>%s", DAY);

                        for($i = 1; $i <= 31; $i++){

                                if($exval != $i)
                                {
                                        if($i < 10)
                                                $ret .= sprintf("<option value=0%d>%d", $i, $i);
                                        else
                                                $ret .= sprintf("<option value=%d>%d", $i, $i);
                                }
                                else
                                {
                                        if($i < 10)
                                                $ret .= sprintf("<option value=0%d selected>%d", $i, $i);
                                        else
                                                $ret .= sprintf("<option value=%d selected>%d", $i, $i);
                                }
                        }
                        return($ret);
                }
                if($type == 5){

                        if ($exval == -1)
                        $ret .= sprintf("<option value=-1 selected>%s", HOUR);
                        else
                        $ret .= sprintf("<option value=-1>%s", HOUR);

                        for($i = 0; $i <= 23; $i++){
                                if($exval != $i || !isset($exval))
                                {
                                        if($i < 10)
                                                $ret .= sprintf("<option value=0%d>%d", $i, $i);
                                        else
                                                $ret .= sprintf("<option value=%d>%d", $i, $i);
                                }
                                else
                                {
                                        if(isset($exval)){
                                                if($i < 10)
                                                        $ret .= sprintf("<option value=0%d selected>%d", $i, $i);
                                                else
                                                        $ret .= sprintf("<option value=%d selected>%d", $i, $i);
                                        }
                                }
                        }
                        return($ret);
                }
                if($type == 6){

                        if ($exval == -1 )
                        $ret .= sprintf("<option value=-1 selected>%s", MINUTE);
                        else
                        $ret .= sprintf("<option value=-1>%s", MINUTE);

                        for($i = 0; $i <= 59; $i++){
                                if($exval != $i || !isset($exval))
                                {
                                        if($i < 10)
                                                $ret .= sprintf("<option value=0%d>%d", $i, $i);
                                        else
                                                $ret .= sprintf("<option value=%d>%d", $i, $i);
                                }
                                else
                                {
                                        if(isset($exval)){
                                                if($i < 10 )
                                                        $ret .= sprintf("<option value=0%d selected>%d", $i, $i);
                                                else
                                                        $ret .= sprintf("<option value=%d selected>%d", $i, $i);
                                        }
                                }
                        }
                        return($ret);
                }

                //Добавляем в условия фильтрации время с точноcтью до секунд
                if($type == 7)
                {
                   if ($exval == -1 )
                    $ret .= sprintf("<option value=-1 selected>%s", SECOND);
                  else
                    $ret .= sprintf("<option value=-1>%s", SECOND);

                  for($i = 0; $i <= 59; $i++)
                  {
                    if($exval != $i || !isset($exval))
                    {
                      if($i < 10)
                        $ret .= sprintf("<option value=0%d>%d", $i, $i);
                      else
                        $ret .= sprintf("<option value=%d>%d", $i, $i);
                    }
                    else
                    {
                      if(isset($exval))
                      {
                        if($i < 10 )
                          $ret .= sprintf("<option value=0%d selected>%d", $i, $i);
                        else
                          $ret .= sprintf("<option value=%d selected>%d", $i, $i);
                      }
                    }
                  }
                  return($ret);
                }
}

function check_nakl_format($format,$naklno)
{
// Constants
$alphanumerics = "ABCDEFJHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzАБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЭЮЯабвгдежзиклмнопрстуфхцчшщэюя0123456789";
$numerics = "0123456789";

$type_len = mb_strlen($format, 'utf8');
$nakllen  = mb_strlen($naklno, 'utf8');
if ($type_len != $nakllen) return(1);

for($i=0;$i<$type_len;$i++)
{
        if($format[$i] == 'A')
        {
		if(mb_strstr($alphanumerics,mb_substr($naklno, $i, 1, 'utf8'), false, 'utf8') === false) {
			return(1);
		}
        }
        elseif($format[$i] == '#')
        {
         if(mb_strstr($numerics,mb_substr($naklno, $i, 1, 'utf8'), false, 'utf8') === false) return(1);
        }
        else
        {
		if(mb_strstr($format[$i],mb_substr($naklno, $i, 1, 'utf8'), false, 'utf8') != $format[$i]) { 
			return(1);
		}
        }
}

return(0);
}

?>