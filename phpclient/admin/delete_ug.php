<?PHP
/********************************************************************
	filename: 	delete_ug.php
	modified:	November 04 2004 20:34:44.
	author:		LANBilling

	version:    LANBilling 1.8
*********************************************************************/
if (!session_is_registered("auth"))
{
	exit;
}

// Вставить проверку на удаление объединения (удаление его из присвоенных менеджеру)

if(isset($_POST['ug_id']))
		{
		printf("<table  bgcolor=ffffff align=center cellspacing=0 cellpadding=0 border=0  width=750 style=\"border: solid 1px #c0c0c0;\">
			<tr><td colspan=3 align=center bgcolor=e0e0e0 style=\"border-bottom: solid 1px #c0c0c0;\" height=15><b>%s</b></td></tr>", DELETEUG);
		printf("<tr><td colspan=3 align=left bgcolor=ffffff style=\"border-bottom: solid 1px #c0c0c0;\"><b><font class=z11 size=-1>&nbsp;&nbsp;&nbsp;%s %s</font></b></td></tr>", TRANSACTIONINNODB.COLON, BIGINNING);

		$qstring = sprintf("begin");
		$qresult = mysql_query($qstring);

		printf("<tr><td align=left width=50%% bgcolor=ffffff style=\"border-bottom: solid 1px #c0c0c0;\"><b><font class=z11 size=-1>&nbsp;&nbsp;&nbsp;%s %s</font></b></td>", USERGROUPSENGLISH.COLON,DELETEUGPROPERTIES);
		// Таблица содержащая описание и имя объединения
		$qstring=sprintf("delete from groups where group_id = %d",$_POST['ug_id']);
		$qres1=mysql_query($qstring);

		if(mysql_errno() != 0)
		{
		bars("remove",1);
		$qstring=sprintf("rollback");
		$qresult=mysql_query($qstring);
		die("<tr><td colspan=3 align=center bgcolor=f5f5f5 height=15 style=\"border-bottom: solid 1px #c0c0c0;\"><b><font class=z11 size=-1 color=\"#FF0000\">".ERRORTRANSACTION."</font></b></td></tr>");
		}
		else
		bars("remove",0);

		printf("<tr><td align=left width=50%% bgcolor=ffffff style=\"border-bottom: solid 1px #c0c0c0;\"><b><font class=z11 size=-1>&nbsp;&nbsp;&nbsp;%s %s</font></b></td>", UGSTAFFENGLISH.COLON,DELETEUGSTAFF);
		// Таблица содержащая состав объединения
		$qstring=sprintf("delete from gr_staff where group_id = %d",$_POST['ug_id']);
		$qres1=mysql_query($qstring);

		if(mysql_errno() != 0)
		{
		bars("remove",1);
		$qstring=sprintf("rollback");
		$qresult=mysql_query($qstring);
		die("<tr><td colspan=3 align=center bgcolor=f5f5f5 height=15 style=\"border-bottom: solid 1px #c0c0c0;\"><b><font class=z11 size=-1 color=\"#FF0000\">".ERRORTRANSACTION."</font></b></td></tr>");
		}
		else
		bars("remove",0);

/*		printf("<tr><td align=left width=50%% bgcolor=ffffff style=\"border-bottom: solid 1px #c0c0c0;\"><b><font class=z11 size=-1>&nbsp;&nbsp;&nbsp;%s %s</font></b></td>", MANSTAFFENGLISH.COLON,ERASEMANSTAFF);

		// Таблица содержащая объединения присвоенные менеджерам
		$qstring=sprintf("delete from man_staff where ug_id = %d",$_POST['ug_id']);
		$qres1=mysql_query($qstring);

		if(mysql_errno() != 0)
		{
		bars("remove",1);
		$qstring=sprintf("rollback");
		$qresult=mysql_query($qstring);
		die("<tr><td colspan=3 align=center bgcolor=f5f5f5 height=15 style=\"border-bottom: solid 1px #c0c0c0;\"><b><font class=z11 size=-1 color=\"#FF0000\">".ERRORTRANSACTION."</font></b></td></tr>");
		}
		else
		bars("remove",0);*/

		printf("<tr><td align=left width=50%% bgcolor=ffffff style=\"border-bottom: solid 1px #c0c0c0;\"><b><font class=z11 size=-1>&nbsp;&nbsp;&nbsp;%s %s</font></b></td>", TRANSACTIONINNODB.COLON, SAVEMODIFY);
		$qstring = sprintf("commit");
		$qresult = mysql_query($qstring);

		if(mysql_errno() != 0)
		{
		bars("committing",1);
		$qstring=sprintf("rollback");
		$qresult=mysql_query($qstring);
		die("<tr><td colspan=3 align=center bgcolor=f5f5f5 height=15 style=\"border-bottom: solid 1px #c0c0c0;\"><b><font class=z11 size=-1 color=\"#FF0000\">".ERRORTRANSACTION."</font></b></td></tr>");
		}
		else
		bars("committing",0);
		printf("<tr><td colspan=3 align=center bgcolor=e8e8e8 height=15><b><font class=z11 size=-1>%s</font></b></td></tr></table>", REQUIREFORDELETEISCOMPLETE);
		}
	else
		{
		printf("%s<br>", NOTSELECTUG);
		}
?>
