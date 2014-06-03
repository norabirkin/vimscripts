<?php

function show_year_select($checked=0)
{
	$return_str = "<option class=z11 value=-1>".YEAR."\n";
	for($i=2005; $i <= 2015; ++$i)
	{
		if($checked == $i) $asd = "selected";
		else $asd = "";
		
		$return_str	.= sprintf("<option class=z11 value=%d %s>%04d\n", $i, $asd, $i);
	}
	
	return  $return_str;
}

function show_month_select($checked=0)
{
   $return_str = sprintf("<option class=z11 value=-1>%s\n", MONTH);
   $return_str .= sprintf("<option class=z11 value='01' %s>%s\n", (intval($checked) == 1)?"selected":"", JANUARY);
   $return_str .= sprintf("<option class=z11 value='02' %s>%s\n", (intval($checked) == 2)?"selected":"", FEBRUARY);
   $return_str .= sprintf("<option class=z11 value='03' %s>%s\n", (intval($checked) == 3)?"selected":"", MARCH);
   $return_str .= sprintf("<option class=z11 value='04' %s>%s\n", (intval($checked) == 4)?"selected":"", APRIL);
   $return_str .= sprintf("<option class=z11 value='05' %s>%s\n", (intval($checked) == 5)?"selected":"", MAY);
   $return_str .= sprintf("<option class=z11 value='06' %s>%s\n", (intval($checked) == 6)?"selected":"", JUNE);
   $return_str .= sprintf("<option class=z11 value='07' %s>%s\n", (intval($checked) == 7)?"selected":"", JULY);
   $return_str .= sprintf("<option class=z11 value='08' %s>%s\n", (intval($checked) == 8)?"selected":"", AUGUST);
   $return_str .= sprintf("<option class=z11 value='09' %s>%s\n", (intval($checked) == 9)?"selected":"", SEPTEMBER);
   $return_str .= sprintf("<option class=z11 value='10' %s>%s\n", (intval($checked) == 10)?"selected":"", OCTOBER);
   $return_str .= sprintf("<option class=z11 value='11' %s>%s\n", (intval($checked) == 11)?"selected":"", NOVEMBER);
   $return_str .= sprintf("<option class=z11 value='12' %s>%s\n", (intval($checked) == 12)?"selected":"", DECEMBER);
   
   return $return_str;
}

function show_day_select($checked=0)
{
	$return_str = "<option class=z11 value=-1>".DAY."\n";
	for($i=1; $i <= 31; ++$i)
	{
		if(intval($checked) == $i) $asd = "selected";
		else $asd = "";
		
		$return_str	.= sprintf("<option class=z11 value=%d %s>%02d\n", $i, $asd, $i);
	}
	
	return  $return_str;
}

function show_hour_select($checked=-3)
{
	$return_str = "<option class=z11 value=-1>".N_HOUR."\n";
	for($i=0; $i <= 23; ++$i)
	{
		if(intval($checked) == $i) $asd = "selected";
		else $asd = "";
		
		$return_str	.= sprintf("<option class=z11 value=%d %s>%02d\n", $i, $asd, $i);
	}
	
	return  $return_str;
}

function show_minute_select($checked=-3)
{
	$return_str = "<option class=z11 value=-1>".N_MINUTE."\n";
	for($i=0; $i <= 59; ++$i)
	{
		if(intval($checked) == $i) $asd = "selected";
		else $asd = "";
		
		$return_str	.= sprintf("<option class=z11 value=%d %s>%02d\n", $i, $asd, $i);
	}
	
	return  $return_str;
}

function show_secund_select($checked=-3)
{
	$return_str = "<option class=z11 value=-1>".N_SECUND."\n";
	for($i=0; $i <= 59; ++$i)
	{
		if(intval($checked) == $i) $asd = "selected";
		else $asd = "";
		
		$return_str	.= sprintf("<option class=z11 value=%d %s>%02d\n", $i, $asd, $i);
	}
	
	return  $return_str;
}

?>