<?PHP
/********************************************************************
	filename: 	read_permissions.php
	modified:	September 29 2004 19:26:00.
	author:		LANBilling

	version:    LANBilling 1.8
*********************************************************************/

	if(!isset($_SERVER['PHP_AUTH_USER']) || !isset($auth)) {
    exit;
  	}

	// ������ ��������� �������� ������� ��� ���������� ��� ��������
	$qstring = sprintf("select email from share");
	$qresult=mysql_query($qstring);
	$cur_row = mysql_fetch_row($qresult);
	$admin_name = $cur_row[0];

	if ( strcmp($_SERVER['PHP_AUTH_USER'],$admin_name) == 0) // ���� ��������� �������������
	{
			// ��������� ������ ����� �� ���� ������� ��� ��������������
			$qstring="select distinct id from settings";
			$qresult=mysql_query($qstring);
			do	{
				$table_row=mysql_fetch_row($qresult);
				if ($table_row != false)
					$allow_na_ids[] = $table_row[0];
				}
			while ($table_row !=false);
			// ��������� �������� ������ �������

	//	unset($rw_groups); // � ����� � ��������� ��������� �������������
	//	unset($ro_groups);

		unset($rw_usergroups); // ������ �������������, ��������� ��� �����������
		unset($ro_usergroups); // ������ �������������, ��������� ��� ������

		// ������� ����� ������ ������� ������� � �������
		$qstring="select vg_id from vgroups where archive=0 order by vg_id";
		$qresult=mysql_query($qstring);
		do {
			$cur_row=mysql_fetch_row($qresult);
			if ($cur_row != false)
			$rw_groups[]=$cur_row[0];
		}
		while ($cur_row !=false);
		// ����� �������� ������ ������� ������� � �������

		// ������� ����� ������ ������������� � �������
		$qstring="select uid from accounts";
		$qresult=mysql_query($qstring);
		do {
			$cur_row=mysql_fetch_row($qresult);
			if ($cur_row != false)
			$rw_usergroups[]=$cur_row[0];
		}
		while ($cur_row !=false);
		// ����� �������� ������ ������������� � �������

		$qstring="select group_id from usergroups";
		$qresult=mysql_query($qstring);
		do {
			$cur_row=mysql_fetch_row($qresult);
			if ($cur_row != false)
			$rw_ugroups[]=$cur_row[0];
		}
		while ($cur_row !=false);

	$rw_ugroups[] = 0;

		$qstring="select person_id from managers";
		$qresult=mysql_query($qstring);
		do {
			$cur_row=mysql_fetch_row($qresult);
			if ($cur_row != false)
			$rw_ugroups[]=(-1)*$cur_row[0];
		}
		while ($cur_row !=false);

	}
	else // ���� ��������� ��������
	{

	// � ����� � ��������� ��������� �������������
	// ��������� ������ ����� �� ���� ������� ��� ���������
			$qstring="select distinct id from settings";
			$qresult=mysql_query($qstring);
			do	{
				$table_row=mysql_fetch_row($qresult);
				if ($table_row != false)
					$allow_na_ids[] = $table_row[0];
				}
			while ($table_row !=false);
	// ��������� �������� ������ �������

	// ������ ������ ����� ��������� �� ������
	unset($ro_usergroups);

	$qs=sprintf("select man_staff.ug_id from man_staff,managers
	where man_staff.rw_flag = 0 and managers.login = '%s' and
	managers.person_id = man_staff.person_id",$_SERVER['PHP_AUTH_USER']);
	$qr=mysql_query($qs);
	do {
		$current_row=mysql_fetch_row($qr);
		// ������ ����� �� ������������
		if($current_row !=false && is_numeric($current_row[0]))
		{
		$ro_ugroups[] = $current_row[0];
		$qs1 = sprintf("select uid from usergroups_staff where group_id = %d",$current_row[0]);
		$qr1=mysql_query($qs1);
			do {
			$current_row1=mysql_fetch_row($qr1);
				if($current_row1 !=false)
			//	$ro_groups[] = $current_row1[0];
				$ro_usergroups[] = $current_row1[0];
			}
			while ($current_row1 !=false);
		}
		elseif ($current_row !=false)
		{
			// ��� ���������������� ������
			list($temp_id) = sscanf($current_row[0],"pd%d");
			$ro_usergroups[] = (-1)*(integer)$temp_id;
			$ro_ugroups[] = (-1)*(integer)$temp_id;

			$qs1 = sprintf("select uid from usergroups_staff where group_id = %d",(-1)*(integer)$temp_id);
			$qr1=mysql_query($qs1);
			do {
			$current_row1=mysql_fetch_row($qr1);
				if($current_row1 !=false)
				$ro_usergroups[] = $current_row1[0];
			}
			while ($current_row1 !=false);
		}
	}
	while ($current_row !=false);

	// ������ ������ ����� ��������� ��� �����������
	unset($rw_usergroups);
	$qs=sprintf("select man_staff.ug_id from man_staff,managers
	where man_staff.rw_flag = 1 and managers.login = '%s'
	and	managers.person_id = man_staff.person_id",$_SERVER['PHP_AUTH_USER']);
	$qr=mysql_query($qs);
	do {
		$current_row=mysql_fetch_row($qr);
		// ������ ������������� �� ������������
		if($current_row !=false && is_numeric($current_row[0]))
		{
		$rw_ugroups[] = $current_row[0];
		$qs1 = sprintf("select uid from usergroups_staff where group_id = %d",$current_row[0]);
		$qr1=mysql_query($qs1);
			do {
			$current_row1=mysql_fetch_row($qr1);
				if($current_row1 !=false)
			//	$rw_groups[] = $current_row1[0];
				$rw_usergroups[] = $current_row1[0];
			}
			while ($current_row1 !=false);
		}
		elseif ($current_row !=false)
		{
			// ��� ���������������� ������
			list($temp_id) = sscanf($current_row[0],"pd%d");
			$rw_usergroups[] = (-1)*(integer)$temp_id;
			$rw_ugroups[] = (-1)*(integer)$temp_id;

			$qs1 = sprintf("select uid from usergroups_staff where group_id = %d",(-1)*(integer)$temp_id);
			$qr1=mysql_query($qs1);
			do {
			$current_row1=mysql_fetch_row($qr1);
				if($current_row1 !=false)
				$rw_usergroups[] = $current_row1[0];
			}
			while ($current_row1 !=false);
		}
	}
	while ($current_row !=false);

	// ��������� ������������ �� ������ ������������ ��� ������
		$qs1 = sprintf("select uid from usergroups_staff where group_id = -%d",$GLOBALS['authperson']);
		$qr1=mysql_query($qs1);
			do {
			$current_row1=mysql_fetch_row($qr1);
				if($current_row1 !=false)
				$rw_usergroups[] = $current_row1[0];
			}
			while ($current_row1 !=false);

	$rw_ugroups[] = (-1)*$GLOBALS['authperson'];
	$rw_usergroups[] = (-1)*$GLOBALS['authperson'];
	} // ���������� else ��� �������� ������ rw/ro ����� ��� ����������

	// �������� � POST ����� ���� ����� � ������ users.class.
	$_POST['ro_ugroups'] = $ro_ugroups;
	$_POST['rw_ugroups'] = $rw_ugroups;

	$_POST['ro_usergroups'] = $ro_usergroups;
	$_POST['rw_usergroups'] = $rw_usergroups;

	// ������ ������� usergroups->groups
	/*
	if(is_array($ro_usergroups))
		foreach($ro_usergroups as $uid)
		{
			$q = sprintf("select vg_id from acc_list where uid = %d order by vg_id",$uid);
			$res = mysql_query($q);
			$row = mysql_fetch_row($res);
			if($row != false)
			do
			{
				$ro_groups[] = $row[0];
				$row = mysql_fetch_row($res);
			}while($row != false);
		}

	if(is_array($rw_usergroups))
		foreach($rw_usergroups as $uid)
		{
			$q = sprintf("select vg_id from acc_list where uid = %d order by vg_id",$uid);
			$res = mysql_query($q);
			$row = mysql_fetch_row($res);
			if($row != false)
			do
			{
				$rw_groups[] = $row[0];
				$row = mysql_fetch_row($res);
			}while($row != false);
		}*/
	if(is_array($ro_usergroups))
		{
			$q = sprintf("select v.vg_id from vgroups v join agreements a on a.agrm_id=v.agrm_id where a.uid in (%s) order by v.vg_id",implode(",",$ro_usergroups));
			$res = mysql_query($q);
			$row = mysql_fetch_row($res);
			if($row != false)
			do
			{
				$ro_groups[] = $row[0];
				$row = mysql_fetch_row($res);
			}while($row != false);
		}

	if(is_array($rw_usergroups))
		{
			$q = sprintf("select v.vg_id from vgroups v join agreements a on a.agrm_id=v.agrm_id where a.uid in (%s) order by v.vg_id",implode(",",$rw_usergroups));
			$res = mysql_query($q);
			$row = mysql_fetch_row($res);
			if($row != false)
			do
			{
				$rw_groups[] = $row[0];
				$row = mysql_fetch_row($res);
			}while($row != false);
		}



	// ��������� ��������� �������� ������� ��� ����������

?>
