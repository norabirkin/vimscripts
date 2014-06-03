<?php
/**
 * @descr Return month name by month number
 * @param $month_num
 */
function lb_month_name($month_num)
{
	$month_num = intval($month_num);
	$return_str = "";
	switch($month_num) {
		case 1: $return_str = JANUARY; break;
		case 2: $return_str = FEBRUARY; break;
		case 3: $return_str = MARCH; break;
		case 4: $return_str = APRIL; break;
		case 5: $return_str = MAY; break;
		case 6: $return_str = JUNE; break;
		case 7: $return_str = JULY; break;
		case 8: $return_str = AUGUST; break;
		case 9: $return_str = SEPTEMBER; break;
		case 10: $return_str = OCTOBER; break;
		case 11: $return_str = NOVEMBER; break;
		case 12: $return_str = DECEMBER; break;
	}
	return $return_str;
}