<?PHP
/********************************************************************
	filename: 	save_ug_tar.php
	modified:	November 04 2004 20:39:44.
	author:		LANBilling

	version:    LANBilling 1.8
*********************************************************************/
	if (!session_is_registered("auth"))
{
	exit;
}
	printf("<table  bgcolor=ffffff align=center cellspacing=0 cellpadding=0 border=0  width=750 style=\"border: solid 1px #c0c0c0;border-bottom:0px;\">
			<tr><td colspan=3 align=center bgcolor=e0e0e0 style=\"border-bottom: solid 1px #c0c0c0;\" height=25><b>%s</b></td></tr>", SAVINGTARRASP);
	printf("<tr><td colspan=3 align=left bgcolor=ffffff style=\"border-bottom: solid 1px #c0c0c0;\"><font class=z11 size=-1><b>&nbsp;&nbsp;&nbsp;%s %s</b></font></td></tr>", TRANSACTIONINNODB.COLON, BIGINNING);

	$qstring = sprintf("begin");
	$qresult = mysql_query($qstring);

	if($_POST['groupworkmode'] == 1 && !isset($_POST['personal_tch']))
	{
		printf("<tr><td align=left width=50%% bgcolor=ffffff style=\"border-bottom: solid 1px #c0c0c0;\"><font class=z11 size=-1><b>&nbsp;&nbsp;&nbsp;%s %s</b></font></td>", TARRASPENGLISH.COLON, SAVETARRASP);
		$qstring=sprintf("delete from tarifs_rasp where id=%d and group_id=0 and changed=0",$_POST['group_id']);
		$qresult=mysql_query($qstring);

		$cur_res = mysql_query("select record_id from tarifs_rasp WHERE changed=0");
			$mycounter = 1;
			do
			{
				$cur_sess = mysql_fetch_row($cur_res);
				if($cur_sess != false)
				{
					$res = mysql_query(sprintf("update tarifs_rasp set record_id = %d
						where record_id = %d",$mycounter,$cur_sess[0]));
				}
				$mycounter++;
			}
			while ($cur_sess != false);

		$crow = mysql_fetch_row(mysql_query("select max(record_id)+1 from tarifs_rasp"));
		$cur_tid = $crow[0];
		if($cur_tid == 0) $cur_tid = 1;

		$opt2 = 0; //gid
		if(isset($_POST['personal_tch']))
		{
			$opt1 = 0;
		}
		else
		{
			$opt1 = $_POST['group_id']; //aid
		}

		if(is_array($_POST['assigned_tarch']))
		foreach($_POST['assigned_tarch'] as $tar_time => $tar_id)
			{
			$qstring=sprintf("insert into tarifs_rasp set record_id = %d,
			vg_id = %d, time = '%s00', tariff_id = %d, id = %d, group_id = %d, changed=0",
			$cur_tid,
			$_POST['vg_id'],
			$tar_time,
			$tar_id,$opt1,$opt2);
			$qresult=mysql_query($qstring);
			$cur_tid++;
			}

		if(mysql_errno() != 0)
		{
		bars("insert",1);
		$qstring=sprintf("rollback");
		$qresult=mysql_query($qstring);
		die("<tr><td colspan=3 align=center bgcolor=f5f5f5 height=25 style=\"border-bottom: solid 1px #c0c0c0;\"><b><font class=z11 size=-1 color=\"#FF0000\">".ERRORTRANSACTION."</font></b></td></tr>");
		}
		else
		bars("insert",0);
	}
	elseif($_POST['groupworkmode'] == 2 && !isset($_POST['personal_tch']))
	{
		printf("<tr><td align=left width=50%% bgcolor=ffffff style=\"border-bottom: solid 1px #c0c0c0;\"><font class=z11 size=-1><b>&nbsp;&nbsp;&nbsp;%s %s</b></font></td>", TARRASPENGLISH.COLON, SAVETARRASP);
		$qstring=sprintf("delete from tarifs_rasp where id=0 and group_id=%d and changed=0",$_POST['group_id']);
		$qresult=mysql_query($qstring);

		$cur_res = mysql_query("select record_id from tarifs_rasp where changed=0");
			$mycounter = 1;
			do
			{
				$cur_sess = mysql_fetch_row($cur_res);
				if($cur_sess != false)
				{
					$res = mysql_query(sprintf("update tarifs_rasp set record_id = %d
						where record_id = %d",$mycounter,$cur_sess[0]));
				}
				$mycounter++;
			}
			while ($cur_sess != false);

		$crow = mysql_fetch_row(mysql_query("select max(record_id)+1 from tarifs_rasp"));
		$cur_tid = $crow[0];
		if($cur_tid == 0) $cur_tid = 1;

		$opt1 = 0; //aid
		if(isset($_POST['personal_tch']))
		{
			$opt2 = 0;
		}
		else
		{
			$opt2 = $_POST['group_id']; //gid
		}


		if(is_array($_POST['assigned_tarch']))
		foreach($_POST['assigned_tarch'] as $tar_time => $tar_id)
			{
			$qstring=sprintf("insert into tarifs_rasp set record_id = %d,
			vg_id = %d, time = '%s00', tariff_id = %d, id = %d, group_id = %d, changed=0",
			$cur_tid,
			$_POST['vg_id'],
			$tar_time,
			$tar_id,$opt1,$opt2);
			$qresult=mysql_query($qstring);
			$cur_tid++;
			}

		if(mysql_errno() != 0)
		{
		bars("insert",1);
		$qstring=sprintf("rollback");
		$qresult=mysql_query($qstring);
		die("<tr><td colspan=3 align=center bgcolor=f5f5f5 height=25 style=\"border-bottom: solid 1px #c0c0c0;\"><b><font class=z11 size=-1 color=\"#FF0000\">".ERRORTRANSACTION."</font></b></td></tr>");
		}
		else
		bars("insert",0);
	}
	elseif(isset($_POST['personal_tch']))
	{
	   //print_r($_POST['personal_tch']);
		printf("<tr><td align=left width=50%% bgcolor=ffffff style=\"border-bottom: solid 1px #c0c0c0;\"><font class=z11 size=-1><b>&nbsp;&nbsp;&nbsp;%s %s</b></font></td>", TARRASPENGLISH.COLON, SAVETARRASP);

		$crow = mysql_fetch_row(mysql_query("select max(record_id)+1 from tarifs_rasp"));
		$cur_tid = $crow[0];
		if($cur_tid == 0) $cur_tid = 1;

		if(is_array($_POST['personal_chtar']))
		foreach($_POST['personal_chtar'] as $vg_id)
		{
		if(is_array($_POST['assigned_tarch']))
		foreach($_POST['assigned_tarch'] as $tar_time => $tar_id)
			{
			$qstring=sprintf("insert into tarifs_rasp set record_id = %d,
			vg_id = %d, time = '%s00', tariff_id = %d, id = 0, group_id = 0, changed=0",
			$cur_tid,
			$vg_id,
			$tar_time,
			$tar_id);
			$qresult=mysql_query($qstring);
			$cur_tid++;
			}
		}

		if(mysql_errno() != 0)
		{
		bars("insert",1);
		$qstring=sprintf("rollback");
		$qresult=mysql_query($qstring);
		die("<tr><td colspan=3 align=center bgcolor=f5f5f5 height=25 style=\"border-bottom: solid 1px #c0c0c0;\"><b><font class=z11 size=-1 color=\"#FF0000\">".ERRORTRANSACTION."</font></b></td></tr>");
		}
		else
		bars("insert",0);
	}

	// 	Окончание бэкапа

	printf("<tr><td align=left width=50%% bgcolor=ffffff style=\"border-bottom: solid 1px #c0c0c0;\"><font class=z11 size=-1><b>&nbsp;&nbsp;&nbsp;%s %s</b></font></td>", TRANSACTIONINNODB.COLON, SAVEMODIFY);
	$qstring = sprintf("commit");
	$qresult = mysql_query($qstring);

	if(mysql_errno() != 0)
	{
	bars("committing",1);
	printf("</table>");
	$qstring=sprintf("rollback");
	$qresult=mysql_query($qstring);
	die("<tr><td colspan=3 align=center bgcolor=f5f5f5 height=25 style=\"border-bottom: solid 1px #c0c0c0;\"><b><font class=z11 size=-1 color=\"#FF0000\">".ERRORTRANSACTION."</font></b></td></tr>");
	}
	else
	bars("committing",0);
printf("</table>");

printf("<input type=hidden name=devision value=16>");

printf("<br><center><a href=\"javascript: document.forms[1].submit();\">%s</a></center>", BACK2UNIONEDIT);
?>
