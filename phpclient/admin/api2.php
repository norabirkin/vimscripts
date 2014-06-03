<?php


   function generateMenu(&$menu, &$menu_punkts)
   {
      if($_SESSION['menuaccess']['agents']  == 0) unset($menu_punkts['objects']['agents']);
      if($_SESSION['menuaccess']['options'] == 0)
      {
         unset($menu_punkts['options']);
         $menu_punkts['options']['empty'] = MENU_NOT_ALLOWED;
      }
      if($_SESSION['menuaccess']['tars'] == 0) unset($menu_punkts['properties']['tars']);
      if($_SESSION['menuaccess']['gen_tolink'] == 0) unset($menu_punkts['actions']['gen_tolink']);
      if($_SESSION['menuaccess']['groups']     == 0) unset($menu_punkts['objects']['groups']);
      if($_SESSION['menuaccess']['managers']   == 0) unset($menu_punkts['objects']['managers']);
      if($_SESSION['menuaccess']['rate']       == 0) unset($menu_punkts['objects']['rate']);
      if($_SESSION['menuaccess']['usergroups'] == 0) unset($menu_punkts['objects']['unions']);
      if($_SESSION['menuaccess']['catalog']    == 0) unset($menu_punkts['properties']['catalog']);
      if($_SESSION['menuaccess']['logs']       == 0) unset($menu_punkts['reports']['logs']);
      if($_SESSION['menuaccess']['users']      == 0) unset($menu_punkts['objects']['users']);
      if($_SESSION['menuaccess']['accounts']   == 0) unset($menu_punkts['objects']['accounts']);
      if($_SESSION['menuaccess']['vol_stat']   == 0 &&
         $_SESSION['menuaccess']['time_stat']  == 0 &&
         $_SESSION['menuaccess']['per_stat']   == 0 &&
         $_SESSION['menuaccess']['once_stat']  == 0) unset($menu_punkts['reports']['statistic']);
      if($_SESSION['menuaccess']['orders']     == 0) unset($menu_punkts['reports']['schet']);
      if($_SESSION['menuaccess']['documes']    == 0) unset($menu_punkts['reports']['documes']);
      if($_SESSION['menuaccess']['gen_card']   == 0) unset($menu_punkts['actions']['gen_card']);
      if($_SESSION['menuaccess']['gen_ords']   == 0) unset($menu_punkts['actions']['gen_schet']);
      if($_SESSION['menuaccess']['gen_reps']   == 0) unset($menu_punkts['actions']['gen_report']);
      if($_SESSION['menuaccess']['exp_ords']   == 0) unset($menu_punkts['actions']['export_schet']);
      if($_SESSION['menuaccess']['cards']      == 0) unset($menu_punkts['objects']['pay_card']);
      if($_SESSION['menuaccess']['operator']   == 0) unset($menu_punkts['reports']['oper_schet']);
      if($_SESSION['menuaccess']['recalc']     == 0) unset($menu_punkts['actions']['recalc']);
      if($_SESSION['menuaccess']['platezi']    == 0) unset($menu_punkts['properties']['payments2']);
      if($_SESSION['menuaccess']['calendar']   == 0) unset($menu_punkts['properties']['politics']);

      if($_SESSION['menuaccess']['hd'] == 0)
      {
          unset($menu_punkts['hd']['hd_c']);
          unset($menu_punkts['hd']['hd_create']);
          unset($menu_punkts['hd']['hd_statuses']);
      }
   }

/**
 * Перекодировка месяца из строчного вида в цифровой
 */
function antiConvertMonth($month_name)
{
   if(!isset($month_name) || $month_name == MONTH)
      return date("m");

   if($month_name == JANUARY) return 1;
   if($month_name == FEBRUARY) return 2;
   if($month_name == MARCH) return 3;
   if($month_name == APRIL) return 4;
   if($month_name == MAY) return 5;
   if($month_name == JUNE) return 6;
   if($month_name == JULY) return 7;
   if($month_name == AUGUST) return 8;
   if($month_name == SEPTEMBER) return 9;
   if($month_name == OCTOBER) return 10;
   if($month_name == NOVEMBER) return 11;
   if($month_name == DECEMBER) return 12;

   return $month_name;
}

function checkPost()
{
        if(isset($_POST['month'])) $_POST['month'] = antiConvertMonth($_POST['month']);
        if(isset($_POST['year'])     && $_POST['year'] == YEAR)        $_POST['year'] = -1;
        if(isset($_POST['day'])      && $_POST['day'] == DAY)          $_POST['day'] = -1;
        if(isset($_POST['hour'])     && $_POST['hour'] == HOURS2)      $_POST['hour'] = -1;
        if(isset($_POST['minute'])   && $_POST['minute'] == MINUTES)   $_POST['minute'] = -1;
        if(isset($_POST['secund'])   && $_POST['secund'] == SECONDS)   $_POST['secund'] = -1;
        if(isset($_POST['t_month'])) $_POST['t_month'] = antiConvertMonth($_POST['t_month']);
        if(isset($_POST['t_year'])   && $_POST['t_year'] == YEAR)      $_POST['t_year'] = -1;
        if(isset($_POST['t_day'])    && $_POST['t_day'] == DAY)        $_POST['t_day'] = -1;
        if(isset($_POST['t_hour'])   && $_POST['t_hour'] == HOURS2)    $_POST['t_hour'] = -1;
        if(isset($_POST['t_minute']) && $_POST['t_minute'] == MINUTES) $_POST['t_minute'] = -1;
        if(isset($_POST['t_secund']) && $_POST['t_secund'] == SECONDS) $_POST['t_secund'] = -1;

   if($_POST['month'] < 10 && strlen($_POST['month']) < 2) $_POST['month'] = '0'.$_POST['month'];
   if($_POST['day'] < 10 && strlen($_POST['day']) < 2) $_POST['day'] = '0'.$_POST['day'];
   if($_POST['hour'] < 10 && strlen($_POST['hour']) < 2) $_POST['hour'] = '0'.$_POST['hour'];
   if($_POST['minute'] < 10 && strlen($_POST['minute']) < 2) $_POST['minute'] = '0'.$_POST['minute'];
   if($_POST['secund'] < 10 && strlen($_POST['secund']) < 2) $_POST['secund'] = '0'.$_POST['secund'];
   if($_POST['t_month'] < 10 && strlen($_POST['t_month']) < 2) $_POST['t_month'] = '0'.$_POST['t_month'];
   if($_POST['t_day'] < 10 && strlen($_POST['t_day']) < 2) $_POST['t_day'] = '0'.$_POST['t_day'];
   if($_POST['t_hour'] < 10 && strlen($_POST['t_hour']) < 2) $_POST['t_hour'] = '0'.$_POST['t_hour'];
   if($_POST['t_minute'] < 10 && strlen($_POST['t_minute']) < 2) $_POST['t_minute'] = '0'.$_POST['t_minute'];
   if($_POST['t_secund'] < 10 && strlen($_POST['t_secund']) < 2) $_POST['t_secund'] = '0'.$_POST['t_secund'];
}

function generatePass(&$lanbilling)
//Функция для генерации пароля
{
   if( false == ($query = mysql_query(sprintf("select name, value from options WHERE name IN ('pass_length', 'pass_numbers', 'generate_pass')"), $lanbilling->descriptor)) )
   {
	$lanbilling->ErrorHandler(__FILE__, "Query Error: " . mysql_error($lanbilling->descriptor), __LINE__);
   }
   else
   {
	while($row = mysql_fetch_row($query))
		switch($row[0])
		{
			case 'pass_length': $length = $row[1]; break;
			case 'pass_numbers': $numbers = $row[1]; break;
			case 'generate_pass': $gen_pass = $row[1]; break;
		}
   }

   $password = "";
   $length = rand($length, 10);

   if($gen_pass == 1) $what_field = "text";
   else $what_field = "password";

   if($numbers == 1) //Если только цифровой пароль
   {
      for($i=0; $i < $length; $i++)
      {
         $password .= ((rand()+10)%10);
      }
   }
   else //Пароль с цифрами, латиницей, подчеркиванием
   {
     for($i=0; $i < $length; $i++)
     {
      $group = ((rand()+9)%9)+2;
      switch($group)
      {
         case 1: $password .= $password .= chr(rand(97, 122));
           break;
         case 2: case 5: $password .= chr(rand(48, 57));
           break;
         case 3: case 6: case 8: $password .= chr(rand(65, 90));
           break;
         case 4: case 7: case 9: $password .= chr(rand(97, 122));
           break;
         default: $password .= chr(rand(97, 122));
      }
     }
   }

   return array($password, $what_field);
}

function gen_date($start=1, $finish=31, $checked=0)
{
   $asd = "";
   $result = "";
   for($i=$start; $i<=$finish; $i++)
   {
       if($i < 10) $val = '0'.$i;
       else $val = $i;
       if($val == $checked) $asd = " selected";
       else $asd = "";

       $result .= "<option class=z11 value='$val' $asd>$val ";
   }

   return $result;
}

function gen_month($checked=0)
{
   $month_arr = array('01'=>JANUARY, '02'=>FEBRUARY, '03'=>MARCH, '04'=>APRIL, '05'=>MAY,
                      '06'=>JUNE, '07'=>JULY, '08'=>AUGUST, '09'=>SEPTEMBER, '10'=>OCTOBER,
                      '11'=>NOVEMBER, '12'=>DECEMBER);
   $asd="";
   $result = "";
   foreach($month_arr as $key=>$value)
   {
      if($checked == $key)
         $asd = " selected";
      else
         $asd = "";

      $result .= "<option class=z11 value='$key' $asd>$value ";
   }

   return $result;
}

function my_sort($array, $f_num)
{
   unset($key_arr);
   $key_arr = array();
   foreach($array as $key=>$value)
       $key_arr[$key] = $value[$f_num];

   asort($key_arr);

   unset($new_array);
   $new_array = array();
   $counter = 0;
   foreach($key_arr as $key1=>$value1)
   {
      $new_array[$counter] = $array[$key1];
      ++$counter;
   }

   unset($array);
   unset($key_arr);

   return $new_array;

}
