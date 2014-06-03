<?php
/********************************************************************
  filename:   showgroups.php
  modified: %MODIFIED%
  author:   LANBilling

*********************************************************************/
  if (!session_is_registered("auth"))
{
  exit;
}

  $counter=0;

  $balance_query = " agreements.balance "; 
  ////////////
  
  if(!isset($_POST['start_page'][$_POST['na_vg2show']]))$_POST['start_page'][$_POST['na_vg2show']] = 1;
  if(!isset($_POST['show_on_page']))$_POST['show_on_page'] = 10;
  if($_POST['page2show'][$_POST['na_vg_2show']] == "")$_POST['page2show'][$_POST['na_vg_2show']] = 1;

  if($_POST['dropdown'] == -1) {
    $show_dsbld = " and template = 1 ";
  }
  elseif ($_POST['dropdown'] == 2)
  $show_dsbld = " and blocked > 0 ";
  elseif ( $_POST['dropdown'] == 3 )
  {
    if (!isset($_POST['search_parm']))
	  $_POST['search_parm'] = 0;

      $tl_stf = "";
      switch ($_POST['search_parm'])
      {
        case 0:
            $show_dsbld = sprintf(" and vgroups.login LIKE '%%%s%%'",trim($_POST['search_key']));
            break;
        case 1:
            $show_dsbld = sprintf(" and vgroups.descr LIKE '%%%s%%'",trim($_POST['search_key']));
            break;
        case 2:
            $show_dsbld = sprintf(" and accounts.email LIKE '%%%s%%'",trim($_POST['search_key']));
            break;
      case 3:
          $show_dsbld = sprintf(" and accounts.name LIKE '%%%s%%'",trim($_POST['search_key']));
            break;
/*      case 4:
            $show_dsbld = sprintf(" AND CONCAT_WS(\" \", accounts.b_index, accounts.country_b, accounts.city_b, accounts.region_b, 
            			accounts.district_b, accounts.settle_area_b, accounts.street_b, accounts.bnum_b, accounts.bknum_b, 
            			accounts.apart_b, accounts.addr_b, accounts.fa_index, accounts.country, accounts.city, accounts.street,
            			accounts.bnum, accounts.bknum, accounts.apart, accounts.addr, accounts.region, accounts.district,
            			accounts.settle_area, accounts.yu_index, accounts.country_u, accounts.city_u, accounts.street_u,
            			accounts.bnum_u, accounts.bknum_u, accounts.apart_u, accounts.addr_u, accounts.region_u, accounts.district_u,
            			accounts.settle_area_u) LIKE '%%%s%%'",trim($_POST['search_key']));
            break;*/
      case 5:
            $show_dsbld = sprintf(" and agreements.number LIKE '%%%s%%'",trim($_POST['search_key']));
            break;
      case 6:
            $show_dsbld = sprintf(" and ((inet_aton('%s') & staff.netmask) = staff.segment OR inet_ntoa(staff.segment) LIKE '%%%s%%') and staff.vg_id=vgroups.vg_id ",trim($_POST['search_key']), trim($_POST['search_key']));
            break;
      case 7:
            $show_dsbld = sprintf(" and tel_staff.phone_number LIKE '%%%s%%' and tel_staff.vg_id=vgroups.vg_id ", trim($_POST['search_key']));
            $tl_stf = ",tel_staff";
            break;
      case 8:
		  $show_dsbld = sprintf(" and agreements.kod_1c LIKE '%%%s%%' ",trim($_POST['search_key']));
            break;      
      }
  }
  else
  $show_dsbld = "";
  $d2s1="";
  $d2s2="";
  $d2s3="";
  $d2s4="";
  switch ($_POST['des2show'][$_POST['na_vg_2show']])
      {
        case 2:
            $d2s = "accounts.name";
        $d2s2="selected";
            break;
/*      case 3:
          $d2s = "concat_ws(\", \",accounts.country,accounts.city,accounts.street,accounts.bnum,accounts.bknum,accounts.apart,accounts.addr)";
        $d2s3="selected";
            break;*/
      case 4:
            $d2s = "agreements.number";
        $d2s4="selected";
            break;
      default:
            $d2s = "vgroups.descr";
        $d2s1="selected";
            break;
      }

  unset($vg2show_idx_temp);
  unset($vg2show);$stop=0;

  if(isset($_POST['page2show_new']) && isset($_POST['page2show_new_id']) && $_POST['page2show_new_id']!="" && $_POST['page2show_new'] != "")$_POST['page2show'][$_POST['page2show_new_id']] = $_POST['page2show_new'];
  printf("<input type=hidden name=page2show[%d] value=\"%s\">",$_POST['na_vg_2show'], $_POST['page2show'][$_POST['na_vg_2show']]);

  if(isset($_POST['start_page_new']) && isset($_POST['page2show_new_id']) && $_POST['page2show_new_id']!="" && $_POST['start_page_new'] != "")$_POST['start_page'][$_POST['page2show_new_id']] = $_POST['start_page_new'];
  printf("<input type=hidden name=start_page[%d] value=\"%s\">",$_POST['na_vg_2show'], $_POST['start_page'][$_POST['na_vg_2show']]);

  if(!isset($_POST['page2show'][$_POST['na_vg_2show']]) || $_POST['zeropages'] == 1)$_POST['page2show'][$_POST['na_vg_2show']] = 1;
  if(!isset($_POST['start_page'][$_POST['na_vg_2show']]))$_POST['start_page'][$_POST['na_vg_2show']] = 0;
  $leftborder   = ($_POST['page2show'][$_POST['na_vg_2show']] - 1) * $_POST['show_on_page'];
  $paginglimit  = sprintf(" limit %d,%d",$leftborder,$_POST['show_on_page']);

	switch($_POST['sort'])
	{
		case 2: $order_type = " order by vgroups.login DESC ";
			break;
			
		case 3: $order_type = " order by agreements.balance "; break;
		case 4: $order_type = " order by agreements.balance DESC "; break;
			
		case 5: $order_type = " order by vgroups.acc_ondate ";
			break;
		
		case 6: $order_type = " order by vgroups.acc_ondate DESC ";
			break;
			
		default: $order_type = " order by vgroups.login ";
			$_POST['sort'] = 1;
	}

  if ( $_SESSION['auth']['authperson'] == 0 ) // Залогинен администратор
  {
    unset($man);
    $qstring5="select person_id from managers";
    if( false ==  ($qresult6=mysql_query($qstring5, $lanbilling->descriptor)))
          $lanbilling->ErrorHandler(__FILE__, "Query Error: " . mysql_error($lanbilling->descriptor), __LINE__);
    do {
      $c_row1=mysql_fetch_row($qresult6);
      if ($c_row1 != false)
      $man[]=(-1)*$c_row1[0];
    }
    while ($c_row1 !=false);

    if(is_array($man))$str = ",".implode(",",$man);
    else $str = "";

    if($_POST['template'] == 1) {
    $tp=sprintf("select distinct vgroups.descr from vgroups where vgroups.id=%d and vgroups.vg_id > 0 and vgroups.archive=0 and vgroups.template = 1", $_POST['na_vg_2show']);
    }
    else {
    $tp=sprintf("select distinct vgroups.login from vgroups, agreements %s where vgroups.id=%d %s and vgroups.agrm_id=agreements.agrm_id and agreements.uid in (0%s) and vgroups.vg_id > 0 and vgroups.archive=0 and vgroups.template=0",
    $tl_stf, $_POST['na_vg_2show'],
    $show_dsbld,$str);
    }
    
    if(false == ($tr = mysql_query($tp, $lanbilling->descriptor)))
          $lanbilling->ErrorHandler(__FILE__, "Query Error: " . mysql_error($lanbilling->descriptor), __LINE__);
    $total_pages = mysql_num_rows($tr);
    $total_staff = $total_pages;
    $total_1   = mysql_num_rows($tr);
    
    if($_POST['template'] == 1) {
    $tp = sprintf("select distinct vgroups.descr from vgroups where vgroups.id=%d and vgroups.vg_id > 0 and vgroups.archive=0 and vgroups.template=1", $_POST['na_vg_2show']);
    }
    else {
    $tp=sprintf("select distinct vgroups.login from vgroups,accounts,agreements %s where vgroups.id=%d %s and vgroups.agrm_id=agreements.agrm_id and agreements.uid=accounts.uid and vgroups.vg_id > 0 and vgroups.archive=0 and vgroups.template=0",
    $tl_stf, $_POST['na_vg_2show'],
    $show_dsbld);
    }
    if( false == ($tr = mysql_query($tp, $lanbilling->descriptor))) 
          $lanbilling->ErrorHandler(__FILE__, "Query Error: " . mysql_error($lanbilling->descriptor), __LINE__);;
    $total_pages += mysql_num_rows($tr);
    $total_2   = mysql_num_rows($tr);
    
    $total_pages = ceil($total_pages/$_POST['show_on_page']);

    $leftborder   = ($_POST['page2show'][$_POST['na_vg_2show']] - 1) * $_POST['show_on_page'];
    $paginglimit  = sprintf(" limit %d,%d",$leftborder,$_POST['show_on_page']);

    if($_POST['search_parm'] != 3 && $_POST['search_parm'] != 4 && $_POST['search_parm'] != 5)
{

if(!empty($str)) {
    if($_POST['template'] == 1) {
    $qs1 = sprintf("select vgroups.descr, vgroups.descr, vgroups.vg_id, 0, 0, 0, 0, vgroups.template, '0000-00-00 00:00:00', 0, '0000-00-00 00:00:00', 0 from vgroups where vgroups.id=%d and vgroups.archive=0 and vgroups.template=1 order by vgroups.descr %s", $_POST['na_vg_2show'], $paginglimit);
    }
    else {
    $qs1=sprintf("select distinct vgroups.login, vgroups.descr, vgroups.vg_id, %s,
    vgroups.blocked, vgroups.changed, vgroups.blk_req, vgroups.template,
    DATE_FORMAT(block_date, '%%d.%%m.%%Y'), agreements.uid, DATE_FORMAT(vgroups.acc_ondate, '%%Y%%m%%d%%H%%i%%s'), vgroups.changed
    from vgroups,agreements, accounts %s %s where vgroups.id=%d %s and vgroups.archive=0 and vgroups.agrm_id=agreements.agrm_id and agreements.uid in (0%s) and accounts.uid=agreements.uid and vgroups.template=0 %s %s",
    $balance_query, $tl_stf, ($_POST['search_parm'] == 6 ? ",staff" : ""),$_POST['na_vg_2show'],
    $show_dsbld , $str , $order_type, $paginglimit );
    }
} else {
    if($_POST['template'] == 1) {
    $qs1 = sprintf("select vgroups.descr, vgroups.descr, vgroups.vg_id, 0, 0, 0, 0, vgroups.template, '0000-00-00 00:00:00', 0, '0000-00-00 00:00:00', 0 from vgroups where vgroups.id=%d and vgroups.archive=0 and vgroups.template=1 order by vgroups.descr %s", $_POST['na_vg_2show'], $paginglimit);
    }
    else {
    $qs1=sprintf("select distinct 
    vgroups.login,
    vgroups.descr,
    vgroups.vg_id,
    %s,
    vgroups.blocked,
    vgroups.changed, 
    vgroups.blk_req,
    vgroups.template,
    DATE_FORMAT(block_date, '%%d.%%m.%%Y'),
    agreements.uid,
    DATE_FORMAT(vgroups.acc_ondate, '%%Y%%m%%d%%H%%i%%s'),
    vgroups.changed
    from vgroups,agreements %s %s where vgroups.id=%d %s and vgroups.archive=0 and vgroups.agrm_id=agreements.agrm_id and vgroups.template=0  %s %s",
    $balance_query, $tl_stf, ($_POST['search_parm'] == 6 ? ",staff" : ""),$_POST['na_vg_2show'],
    $show_dsbld , $order_type, $paginglimit );
    }
}
}


// echo $qs1;
    
    if($total_1 - ($_POST['page2show'][$_POST['na_vg_2show']]-1)*$_POST['show_on_page'] < $_POST['show_on_page'])
    {
    $t1 = $total_1%$_POST['show_on_page'];
    $x_q2  = $_POST['show_on_page'] - $t1%$_POST['show_on_page'];

    $paginglimit  = sprintf(" limit 0,%d",$x_q2);
    $qs2=sprintf("select distinct 
    vgroups.login,
    %s,
    vgroups.vg_id,
    %s,
    vgroups.blocked,
    vgroups.changed, 
    vgroups.blk_req,
    vgroups.template,
    DATE_FORMAT(block_date,  '%%d.%%m.%%Y'),
    agreements.uid,
    DATE_FORMAT(vgroups.acc_ondate, '%%Y%%m%%d%%H%%i%%s'),
    vgroups.changed
    from vgroups,accounts,agreements %s %s where vgroups.id=%d %s and vgroups.archive=0 and vgroups.agrm_id=agreements.agrm_id and agreements.uid=accounts.uid and vgroups.template=%d %s %s",
     $d2s,$balance_query, $tl_stf, ($_POST['search_parm'] == 6 ? ",staff" : ""),
    $_POST['na_vg_2show'],
    $show_dsbld, $_POST['template'], $order_type, $paginglimit);
    }

    if($total_1 - ($_POST['page2show'][$_POST['na_vg_2show']]-1)*$_POST['show_on_page']  <= 0)
    {
    unset($qs1);

      $offset  = $_POST['show_on_page'] - ($total_1%$_POST['show_on_page'])%$_POST['show_on_page'];
      if($offset == $_POST['show_on_page'])$offset = 0;
      $r = $offset + ($_POST['page2show'][$_POST['na_vg_2show']] -1 - ceil($total_1/$_POST['show_on_page']))*$_POST['show_on_page'] ;
      $paginglimit1 = " limit ".$r.",".$_POST['show_on_page'];
      $qs2=sprintf("select distinct 
      vgroups.login,
      %s,
      vgroups.vg_id,
      %s,
      vgroups.blocked,
      vgroups.changed, 
      vgroups.blk_req,
      vgroups.template,
      DATE_FORMAT(block_date,  '%%d.%%m.%%Y'),
      agreements.uid,
      DATE_FORMAT(vgroups.acc_ondate, '%%Y%%m%%d%%H%%i%%s'),
      vgroups.changed, agreements.cur_id 
      from vgroups,accounts,agreements %s %s where vgroups.id=%d %s and vgroups.archive=0 and vgroups.agrm_id=agreements.agrm_id and agreements.uid=accounts.uid and vgroups.template=%d %s %s",
          $d2s,$balance_query, $tl_stf, ($_POST['search_parm'] == 6 ? ",staff" : ""),
          $_POST['na_vg_2show'],
          $show_dsbld, $_POST['template'], $order_type, $paginglimit1);
    }

  }
  else // Залогинен менеджер
  {
    $tp=sprintf("select distinct vgroups.login from vgroups,agreements %s where vgroups.id=%d %s and vgroups.agrm_id=agreements.agrm_id and agreements.uid=%d and vgroups.archive=0",
    $tl_stf, $_POST['na_vg_2show'],
    $show_dsbld,$str,(-1)*$_SESSION['auth']['authperson']);

    if( false == ($tr = mysql_query($tp, $lanbilling->descriptor)))
          $lanbilling->ErrorHandler(__FILE__, "Query Error: " . mysql_error($lanbilling->descriptor), __LINE__);
    $total_pages = mysql_num_rows($tr);
    $total_staff = $total_pages;
    $total_1   = mysql_num_rows($tr);
    $tp=sprintf("select distinct vgroups.login from vgroups,accounts,agreements %s where vgroups.id=%d %s and vgroups.agrm_id=agreements.agrm_id and agreements.uid=accounts.uid and vgroups.archive=0",
    $tl_stf, $_POST['na_vg_2show'],
    $show_dsbld);
    if( false == ($tr = mysql_query($tp, $lanbilling->descriptor)))
          $lanbilling->ErrorHandler(__FILE__, "Query Error: " . mysql_error($lanbilling->descriptor), __LINE__);
    $total_pages += mysql_num_rows($tr);
    $total_2   = mysql_num_rows($tr);
    $total_pages = ceil($total_pages/$_POST['show_on_page']);

    if($_POST['search_parm'] != 3 && $_POST['search_parm'] != 4 && $_POST['search_parm'] != 5)
    $qs1=sprintf("select distinct 
    vgroups.login,
    vgroups.descr,
    vgroups.vg_id,
    vgroups.balance,
    vgroups.blocked,
    vgroups.changed, 
    vgroups.blk_req,
    vgroups.template,
    DATE_FORMAT(block_date,  '%%d.%%m.%%Y'),
    agreements.uid,
    DATE_FORMAT(vgroups.acc_ondate, '%%Y%%m%%d%%H%%i%%s'),
    vgroups.changed, agreements.cur_id
    from vgroups,agreements %s where vgroups.id=%d %s and vgroups.archive=0 and vgroups.agrm_id=agreements.agrm_id and agreements.uid=-%d and vgroups.template=%d %s %s",
    $tl_stf, $_POST['na_vg_2show'],
    $show_dsbld,$_SESSION['auth']['authperson'], $_POST['template'], $order_type, $paginglimit);

    $qs2=sprintf("select distinct 
    vgroups.login,
    %s,
    vgroups.vg_id,
    %s,
    vgroups.blocked,
    vgroups.changed, 
    vgroups.blk_req,
    vgroups.template,
    DATE_FORMAT(block_date,  '%%d.%%m.%%Y'),
    agreements.uid,
    DATE_FORMAT(vgroups.acc_ondate, '%%Y%%m%%d%%H%%i%%s'),
    vgroups.changed, agreements.cur_id 
    from vgroups,accounts,agreements %s %s where vgroups.id=%d %s and vgroups.archive=0 and vgroups.agrm_id=agreements.agrm_id and agreements.uid=accounts.uid and vgroups.template=%d %s %s",
    $d2s, $balance_query, $tl_stf, ($_POST['search_parm'] == 6 ? ",staff" : ""),
    $_POST['na_vg_2show'],
    $show_dsbld, $_POST['template'], $order_type, $paginglimit);

    
    if($total_1 - ($_POST['page2show'][$_POST['na_vg_2show']]-1)*$_POST['show_on_page'] < $_POST['show_on_page'])
    {

    $t1 = $total_1%$_POST['show_on_page'];
    $x_q2  = $_POST['show_on_page'] - $t1%$_POST['show_on_page'];

    $paginglimit  = sprintf(" limit 0,%d",$x_q2);
    $qs2=sprintf("select distinct 
    vgroups.login,
    %s,
    vgroups.vg_id,
    %s,
    vgroups.blocked,
    vgroups.changed, 
    vgroups.blk_req,
    vgroups.template,
    DATE_FORMAT(block_date,  '%%d.%%m.%%Y'),
    agreements.uid,
    DATE_FORMAT(vgroups.acc_ondate, '%%Y%%m%%d%%H%%i%%s'),
    vgroups.changed, agreements.cur_id 
    from vgroups,accounts,agreements %s %s where vgroups.id=%d %s and vgroups.archive=0 and  vgroups.agrm_id=agreements.agrm_id and agreements.uid=accounts.uid and vgroups.template=%d %s %s",
    $d2s, $balance_query, $tl_stf, ($_POST['search_parm'] == 6 ? ",staff" : ""),
    $_POST['na_vg_2show'],
    $show_dsbld, $_POST['template'], $order_type, $paginglimit);
    }

    if($total_1 - ($_POST['page2show'][$_POST['na_vg_2show']]-1)*$_POST['show_on_page']  <= 0)
    {

      $offset  = $_POST['show_on_page'] - ($total_1%$_POST['show_on_page'])%$_POST['show_on_page'];
      if($offset == $_POST['show_on_page'])$offset = 0;
      $r = $offset + ($_POST['page2show'][$_POST['na_vg_2show']] -1 - ceil($total_1/$_POST['show_on_page']))*$_POST['show_on_page'] ;
      $paginglimit1 = " limit ".$r.",".$_POST['show_on_page'];
      $qs2=sprintf("select distinct 
      vgroups.login,
      %s,
      vgroups.vg_id,
      %s,
      vgroups.blocked,
      vgroups.changed, 
      vgroups.blk_req,
      vgroups.template,
      DATE_FORMAT(block_date,  '%%d.%%m.%%Y'),
      agreements.uid,
      DATE_FORMAT(vgroups.acc_ondate, '%%Y%%m%%d%%H%%i%%s'),
      vgroups.changed, agreements.cur_id 
      from vgroups,accounts,agreements %s %s where vgroups.id=%d %s and vgroups.archive=0 and vgroups.agrm_id=agreements.agrm_id and agreements.uid=accounts.uid and vgroups.template=%d %s %s",
      $d2s,$balance_query,  $tl_stf, ($_POST['search_parm'] == 6 ? ",staff" : ""),
          $_POST['na_vg_2show'],
          $show_dsbld, $_POST['template'], $order_type, $paginglimit1);
    }
  }

  if(isset($qs1))
  {
  //echo $qs1."<br/>";
  if( false == ($qr=mysql_query($qs1,$lanbilling->descriptor)))
        $lanbilling->ErrorHandler(__FILE__, "Query Error: " . mysql_error($lanbilling->descriptor), __LINE__);
  do {
  $c_r=mysql_fetch_row($qr);
      if ($c_r != false)
      {
      $vg2show_idx_temp[] = $c_r[2];
      $vg2show[$c_r[2]][0] = $c_r[0];
      $vg2show[$c_r[2]][1] = $c_r[1];
      $vg2show[$c_r[2]][3] = $c_r[3];
      $vg2show[$c_r[2]][4] = $c_r[4];
      $vg2show[$c_r[2]][5] = $c_r[5];
      $vg2show[$c_r[2]][6] = $c_r[6];
      $vg2show[$c_r[2]][7] = $c_r[7];
      $vg2show[$c_r[2]][8] = $c_r[8];
      $vg2show[$c_r[2]][9] = $c_r[10];
      $vg2show[$c_r[2]][10] = $c_r[11];
      $vg2show[$c_r[2]][11] = $c_r[12];

      if($c_r[9] < 0)
      {
        $man = @mysql_fetch_row(mysql_query(sprintf("select login from managers where person_id=%d",abs($c_r[9])), $lanbilling->descriptor));
        $vg2show[$c_r[2]][1] = MANNO.abs($c_r[9]).",".$man[0];
      }
      if($c_r[9] == 0)$vg2show[$c_r[2]][1] = ADMINNAME;
      }
  }
  while ($c_r !=false);
  }

  if(isset($qs2))
  {
  //echo $qs2."<br/>";
  if( false == ($qr=mysql_query($qs2, $lanbilling->descriptor)))
        $lanbilling->ErrorHandler(__FILE__, "Query Error: " . mysql_error($lanbilling->descriptor), __LINE__);
  do {
  $c_r=mysql_fetch_row($qr);
      if ($c_r != false)
      {
      $vg2show_idx_temp[] = $c_r[2];
      $vg2show[$c_r[2]][0] = $c_r[0];
      $vg2show[$c_r[2]][1] = $c_r[1];
      $vg2show[$c_r[2]][3] = $c_r[3];
      $vg2show[$c_r[2]][4] = $c_r[4];
      $vg2show[$c_r[2]][5] = $c_r[5];
      $vg2show[$c_r[2]][6] = $c_r[6];
      $vg2show[$c_r[2]][7] = $c_r[7];
      $vg2show[$c_r[2]][8] = $c_r[8];
      $vg2show[$c_r[2]][9] = $c_r[10];
      $vg2show[$c_r[2]][10] = $c_r[11];
      $vg2show[$c_r[2]][11] = $c_r[12];

      if($c_r[9] < 0)
      {
        $man = @mysql_fetch_row(mysql_query(sprintf("select login from managers where person_id=%d",abs($c_r[9])), $lanbilling->descriptor));
        $vg2show[$c_r[2]][1] = MANNO.abs($c_r[9]).",".$man[0];
      }
      if($c_r[9] == 0)$vg2show[$c_r[2]][1] = ADMINNAME;
      }
  }
  while ($c_r !=false);
  }
  if(count($vg2show_idx_temp)==0)$stop = 1;

if($stop!=1){

  echo "<table class=table_comm style=\"border-top:none;border-left:none;\" width=100% border=0 cellspacing=0 cellpadding=0>";

  printf("
  <tr><td  align = left colspan = 10 height=20><font class=z11 size=-1>&nbsp;&nbsp;%s",PAGES.COLON);
  
  for($a = $_POST['start_page'][$_POST['na_vg_2show']] + 1;$a <= $total_pages; $a++)
  {
    if ($a <= ($_POST['start_page'][$_POST['na_vg_2show']] + 15))
    {
      if ($_POST['start_page'][$_POST['na_vg_2show']] != 0 && $a == $_POST['start_page'][$_POST['na_vg_2show']] + 1)
      {
        printf("&nbsp;&nbsp;<a href=\"javascript: go_2_page(1,%d,%d,%d);\"><<<</a>", $a-15, $_POST['start_page'][$_POST['na_vg_2show']], $_POST['na_vg_2show']);
      }
      if(  $a == $_POST['page2show'][$_POST['na_vg_2show']] )
        printf("&nbsp;&nbsp;<u>%d</u>",$a);
      else
      printf("&nbsp;&nbsp;<a href=\"javascript: go_2_page(0,%d,%d,%d);\">%d</a>", $a, $_POST['start_page'][$_POST['na_vg_2show']], $_POST['na_vg_2show'], $a);
    }
    else
    {
      printf("&nbsp;&nbsp;<a href=\"javascript: go_2_page(1,%d,%d,%d);\">>>></a>", $a, $_POST['start_page'][$_POST['na_vg_2show']], $_POST['na_vg_2show']);
      break;
    }
  } // for end
	printf("</font></td></tr><tr><td colspan=11 bgcolor=c0c0c0 height=1></td></tr>");
	
	$img_asc = " <img src='images/asc_order.gif' border=0>";
	$img_desc = " <img src='images/desc_order.gif' border=0>";
	
	printf("<tr bgcolor=\"#f5f5f5\">
	<td width=20 align=center style=\"border-bottom: solid 1px #c0c0c0;\"><font class=z11 size=-1>&nbsp;</font></td>
	<td width=20 style=\"border-bottom: solid 1px #c0c0c0;\">&nbsp;</td>
	<td width=100 align=center style=\"border-bottom: solid 1px #c0c0c0;\">
		<a href=\"javascript: document.forms[1].sort.value='%d'; document.forms[1].dropdown.value='%s';
		document.forms[1].na_vg_2show.value='%s'; document.forms[1].submit();\"><font class=z11 size=-1>%s</font></a>
	%s</td>",
	($_POST['sort'] != 1) ? 1 : 2,
	$_POST['dropdown'],
	$_POST['na_vg_2show'],
	ACCOUNTINGNAME,
	($_POST['sort'] == 1 || $_POST['sort'] == 2) ? (($_POST['sort'] == 1) ? $img_asc : $img_desc) : "");
	
	printf("<td align=center style=\"border-bottom: solid 1px #c0c0c0;\"><font class=z11 size=-1>&nbsp;
	<select class=z11 onchange=\"document.forms[1].devision.value=7;document.forms[1].dropdown.value=%d;document.forms[1].na_vg_2show.value=%s;document.forms[1].newdes2show.value=this.value;document.forms[1].iddes2show.value=%s;document.forms[1].submit();\">
	<option %s value=1>%s
	<option %s value=2>%s
	<option %s value=3>%s
	<option %s value=4>%s
	</select>
	&nbsp;</font></td>",
	$_POST['dropdown'], $_POST['na_vg_2show'], $_POST['na_vg_2show'], $d2s1,DESCRIPTION, $d2s2,FIO, $d2s3, ADDRESS, $d2s4, AGREEMENT);
	
	printf("<td align=center width=102 style=\"border-bottom: solid 1px #c0c0c0;\">&nbsp;
		<a href=\"javascript: document.forms[1].sort.value='%d'; document.forms[1].dropdown.value='%s';
		document.forms[1].na_vg_2show.value='%s'; document.forms[1].submit();\"><font class=z11 size=-1>%s&nbsp;</font></a>%s&nbsp;</td>
	<td align=center width=60 style=\"border-bottom: solid 1px #c0c0c0;\"><font class=z11 size=-1>&nbsp;%s&nbsp;</font></td>
	<td align=center width=105 style=\"border-bottom: solid 1px #c0c0c0;\"> 
		<a href=\"javascript: document.forms[1].sort.value=%d; document.forms[1].dropdown.value='%s';
		document.forms[1].na_vg_2show.value='%s'; document.forms[1].submit();\"><font class=z11 size=-1>%s</font></a>%s </td>
	<td align=center width=105 style=\"border-bottom: solid 1px #c0c0c0;\"><font class=z11 size=-1>&nbsp;%s&nbsp;</font></td>
	<td align=center width=60 style=\"border-bottom: solid 1px #c0c0c0;\"><font class=z11 size=-1>&nbsp;%s&nbsp;</font></td>
	<td align=center width=60 style=\"border-bottom: solid 1px #c0c0c0;\"><font class=z11 size=-1>&nbsp;%s&nbsp;</font></td>
	</tr>",
	($_POST['sort'] != 3) ? 3 : 4,
	$_POST['dropdown'],
	$_POST['na_vg_2show'],
	BALANCE, 
	($_POST['sort'] == 3 || $_POST['sort'] == 4) ? (($_POST['sort'] == 3) ? $img_asc : $img_desc) : "",
	BLOCK,
	($_POST['sort'] != 5) ? 5 : 6,
	$_POST['dropdown'],
	$_POST['na_vg_2show'],
	VGLINKEDDATE,
	($_POST['sort'] == 5 || $_POST['sort'] == 6) ? (($_POST['sort'] == 5) ? $img_asc : $img_desc) : "",
	BLOCKDATE,
	STATUS,
	BLOCKONOFF);


  if (!isset($vg2show_idx_temp))
  {
  printf("<tr><td colspan=10 bgcolor=c0c0c0 height=1></td></tr>
  <tr><td  align = center colspan = 11 bgcolor=f5f5f5 height=10><font class=z11 size=-1>%s</font></td></tr></table>",
  NOGROUPS2SHOW);
  exit(0);
  }

  // $a = array_unique(array_merge( array_intersect($vg2show_idx, $rw_groups),array_intersect($vg2show_idx, $rw_groups) )) ;
  $a = array_unique(array_merge($_SESSION['permissions']['ro_groups'],$_SESSION['permissions']['rw_groups']));

  $vg2show_idx = array_unique(array_intersect($vg2show_idx_temp,$a));
  //$vg2show_idx = array_unique($vg2show_idx_temp);
  $vg2show_idx_keys = array_keys($vg2show_idx);

  $counter_m = 0;
  $rw_groups = $_SESSION['permissions']['rw_groups'];
  
  for ($i=0;$i<sizeof($vg2show_idx);$i++)
  {
    $exact_counter = $i + ($_POST['page2show'][$_POST['na_vg_2show']] - 1) * $_POST['show_on_page'] + 1;
    if($vg2show[$vg2show_idx[$vg2show_idx_keys[$i]]][7] == 1) {
    $blstat = "-";
    }
    else {
    if( $vg2show[$vg2show_idx[$vg2show_idx_keys[$i]]][4] == 0 ) $blstat = BLOCKUNSET;
    elseif ( $vg2show[$vg2show_idx[$vg2show_idx_keys[$i]]][4] == 10 ) $blstat = BLOCKSET."(Off)";
    elseif ( $vg2show[$vg2show_idx[$vg2show_idx_keys[$i]]][4] == 3 ) $blstat = BLOCKSET."(Adm)";
    elseif ( $vg2show[$vg2show_idx[$vg2show_idx_keys[$i]]][4] == 2 ) $blstat = BLOCKSET."(User)";
    elseif ( $vg2show[$vg2show_idx[$vg2show_idx_keys[$i]]][4] == 5 ) $blstat = BLOCKSET."(Tp)";
    elseif ( $vg2show[$vg2show_idx[$vg2show_idx_keys[$i]]][4] == 1 || $vg2show[$vg2show_idx[$vg2show_idx_keys[$i]]][4] == 4) $blstat = BLOCKSET."($$)";
    else $blstat = BLOCKSET;
    }
    
    if($vg2show[$vg2show_idx[$vg2show_idx_keys[$i]]][7] == 1)
      $allow_fast_edit = sprintf("<a href=\"javascript: submitForm('_vgroup', 'vgid', '%d')\">",$vg2show_idx[$vg2show_idx_keys[$i]]);
    else $allow_fast_edit = sprintf("<a href=\"javascript: go_edit(%d)\">",$vg2show_idx[$vg2show_idx_keys[$i]]);

    if($vg2show[$vg2show_idx[$vg2show_idx_keys[$i]]][5]  == 4 || $vg2show[$vg2show_idx[$vg2show_idx_keys[$i]]][10]  == 4 )
    $vgstat = MODIFICATIONGROUPS;
    else if ($vg2show[$vg2show_idx[$vg2show_idx_keys[$i]]][5]  == 5 || $vg2show[$vg2show_idx[$vg2show_idx_keys[$i]]][10]  == 5)
    {
    $vgstat = DELETEGROUPS;
    $allow_fast_edit = "";
    }
    else if ( $vg2show[$vg2show_idx[$vg2show_idx_keys[$i]]][5]  == 3 || $vg2show[$vg2show_idx[$vg2show_idx_keys[$i]]][10]  == 3 ) $vgstat = NEWGROUPS;
    else $vgstat = ACTIVEGROUPS;

    if($vg2show[$vg2show_idx[$vg2show_idx_keys[$i]]][6]  != 0)
      $disabled = "disabled";
    else
      $disabled = "";

    $user_balance = $lanbilling->convertCurrency($vg2show[$vg2show_idx[$vg2show_idx_keys[$i]]][3], $vg2show[$vg2show_idx[$vg2show_idx_keys[$i]]][11]);
    $user_balance = implode(" ", $user_balance);
    

    if($vg2show[$vg2show_idx[$vg2show_idx_keys[$i]]][9] != "")
    {
      $year = substr($vg2show[$vg2show_idx[$vg2show_idx_keys[$i]]][9], 0, 4);
      $month = substr($vg2show[$vg2show_idx[$vg2show_idx_keys[$i]]][9], 4, 2);
      $day = substr($vg2show[$vg2show_idx[$vg2show_idx_keys[$i]]][9], 6, 2);
      $vg2show[$vg2show_idx[$vg2show_idx_keys[$i]]][9] = $day.".".$month.".".$year;
    }
    else
      $vg2show[$vg2show_idx[$vg2show_idx_keys[$i]]][9] = AUTOLOGOUT;

    /*
    printf("<tr>
    <td align=center width=20><font size=2><font class=z11 size=-1>%d</font></font></td>
    <td align=center width=20><a name=\"_%d\"><input type=radio name=vg_id value=%d
    onclick=\"btn_state_change(%d,%d,%d)\"></td>
    <td align=center width=100>%s<strong><font class=z11 size=-1>%s</font></strong></td>
    <td align=center width=220><font class=z11 size=-1>%s</font></td>
    <td align=center width=100><b><font class=z11 size=-1>%0.2f</font></b></td>
    <td align=center width=60><font class=z11 size=-1>%s</font></td>
    <td align=center width=75><font class=z11 size=-1>%s</font></td>
    <td align=center width=75><font class=z11 size=-1>%s</font></td>
    <td align=center width=60><font class=z11 size=-1>%s</font></td>
    <td align=center width=60><input type=radio name=vgid_onoff %s value=%d
    onclick=\"document.forms[1].na_vg_2show.value=%d;document.forms[1].dropdown.value='%d'; document.forms[1].devision.value=7; document.forms[1].submit();\"></td>
    
    <td align=center width=60>
    <input type=checkbox class=z11 name=%s %s
    onclick=\"document.forms[1].na_vg_2show.value=%d;document.forms[1].dropdown1.value='%d'; document.forms[1].dropdown.value='%d'; document.forms[1].devision.value=7; document.forms[1].submit();\">
    </td>    
    </tr>",
    $exact_counter,
    $vg2show_idx[$vg2show_idx_keys[$i]],
    $vg2show_idx[$vg2show_idx_keys[$i]],
    $vg2show[$vg2show_idx[$vg2show_idx_keys[$i]]][7],
    $vg2show[$vg2show_idx[$vg2show_idx_keys[$i]]][5],
    (in_array($vg2show_idx[$vg2show_idx_keys[$i]],$rw_groups) ? "1" : "0"),
    $allow_fast_edit,
    $vg2show[$vg2show_idx[$vg2show_idx_keys[$i]]][0],
    stripslashes($vg2show[$vg2show_idx[$vg2show_idx_keys[$i]]][1]),
    $user_balance,
    $blstat,
    $vg2show[$vg2show_idx[$vg2show_idx_keys[$i]]][9],
    $vg2show[$vg2show_idx[$vg2show_idx_keys[$i]]][8],
    $vgstat,
    $disabled,
    $vg2show_idx[$vg2show_idx_keys[$i]],
    $_POST['na_vg_2show'],$_POST['dropdown'], 
    "cart_block".$vg2show_idx[$vg2show_idx_keys[$i]] ,
    ($vg2show[$vg2show_idx[$vg2show_idx_keys[$i]]][11]<10)?"checked":"", 
    $_POST['na_vg_2show'], 
    $vg2show_idx[$vg2show_idx_keys[$i]],
    $_POST['dropdown']); */
    
     printf("<tr height=22>
    <td class=td_comm align=center  style=\"border-right:none;\" ><font size=2><font class=z11 size=-1>%d</font></font></td>
    <td class=td_comm align=center><a name=\"_%d\"><input type=radio name=vg_id value=%d
    onclick=\"btn_state_change(0,%d,%d)\"></td>
    <td class=td_comm align=center>%s<strong><font class=z11>%s</font></strong></td>
    <td class=td_comm align=center><font class=z11 size=-1>%s</font></td>
    <td class=td_comm align=center><font class=z11 color=green>%s</font></td>
    <td class=td_comm align=center><font class=z11 size=-1>%s</font></td>
    <td class=td_comm align=center><font class=z11 size=-1>%s</font></td>
    <td class=td_comm align=center><font class=z11 size=-1>%s</font></td>
    <td class=td_comm align=center><font class=z11 size=-1>%s</font></td>
    <td class=td_comm align=center style=\"border-right:none;\"><input type=radio name=vgid_onoff %s value=%d
    onclick=\"document.forms[1].na_vg_2show.value=%d;document.forms[1].dropdown.value='%d'; document.forms[1].devision.value=7; document.forms[1].submit();\"></td>
    </tr>",
    $exact_counter,
    $vg2show_idx[$vg2show_idx_keys[$i]],
    $vg2show_idx[$vg2show_idx_keys[$i]],
    $vg2show[$vg2show_idx[$vg2show_idx_keys[$i]]][5],
    (in_array($vg2show_idx[$vg2show_idx_keys[$i]],$rw_groups) ? "1" : "0"),
    $allow_fast_edit,
    $vg2show[$vg2show_idx[$vg2show_idx_keys[$i]]][0],
    ($vg2show[$vg2show_idx[$vg2show_idx_keys[$i]]][7] == 1) ? $vg2show[$vg2show_idx[$vg2show_idx_keys[$i]]][0] : stripslashes($vg2show[$vg2show_idx[$vg2show_idx_keys[$i]]][1]),
    ($vg2show[$vg2show_idx[$vg2show_idx_keys[$i]]][7] == 1) ? "-" : $user_balance,
    $blstat,
    ($vg2show[$vg2show_idx[$vg2show_idx_keys[$i]]][7] == 1) ? "-" : $vg2show[$vg2show_idx[$vg2show_idx_keys[$i]]][9],
    ($vg2show[$vg2show_idx[$vg2show_idx_keys[$i]]][7] == 1) ? "-" : $vg2show[$vg2show_idx[$vg2show_idx_keys[$i]]][8],
    ($vg2show[$vg2show_idx[$vg2show_idx_keys[$i]]][7] == 1) ? "-" : $vgstat,
    $disabled,
    $vg2show_idx[$vg2show_idx_keys[$i]],
    $_POST['na_vg_2show'],$_POST['dropdown']
	); 
    

    $counter_m++;
  }

  if($counter_m == 0)
  printf("<tr>
    <td colspan=10 height=20 align=center><font class=z11 size=-1>%s</font></td>
    </tr>
  ",NOGROUPS2SHOW);

  // printf("Execution time %d sec<br>",time()-$T1);
  printf("</table>");
}

  ?>
