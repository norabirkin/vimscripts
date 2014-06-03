<?php
session_start();

define("REPORTS_DIR", "./users_reports/");

$tpl = new HTML_Template_IT(TPLS_PATH); 

$tpl->loadTemplatefile("reports_load.tpl", true, true); 

// Сохранение созданного отчета
if($_POST['save_user_report'] && $_POST['whatpressed'] == 1)
{
	$rep_name = addslashes($_POST['report_name']);
	$rep_desc = addslashes($_POST['report_desc']);
	$main_file_name_tmp = $_FILES['m_file_name']['tmp_name'];
	$main_file_name = $_FILES['m_file_name']['name'];
	
	if(!file_exists($main_file_name_tmp))
		die("Main file not found!!!");

	// Пишем в БД основную информацию
	mysql_query("begin", $descriptor);
	
	$query = sprintf("INSERT INTO user_reports SET report_name='%s', report_desc='%s'", $rep_name, $rep_desc);	
	if(!mysql_query($query, $descriptor))
	{
		echo "<center><font class=z11 color=Red>".REPORT_INFO_ERR."</font></center>";
		mysql_query("rollback", $descriptor);
		exit;
	}
	$report_id = mysql_insert_id($descriptor);
	
	// Пишем основной файл отчета
	if(!move_uploaded_file($main_file_name_tmp, REPORTS_DIR.$main_file_name))
	{
		echo "<center><font class=z11 color=Red>".REPORT_LOAD_ERR.$main_file_name."</font></center>";
		mysql_query("rollback", $descriptor);
		exit;
	}
	
	$query = sprintf("INSERT INTO user_reports_files SET report_id='%d', filename='%s', is_main=1",
	                  $report_id, addslashes($main_file_name));
	if(!mysql_query($query, $descriptor))
	{
		echo "<center><font class=z11 color=Red>".REPORT_LOAD_MAIN_ERR."</font></center>";
		mysql_query("rollback", $descriptor);
		exit;
	}
	
	// Теперь пишем дополнительные файлы
	for($i = 0; $i < 8; ++$i)
	{
		$tmp_file_name = $_FILES['a_file_name']['tmp_name'][$i];
		$add_file_name = $_FILES['a_file_name']['name'][$i];
		
		if(!empty($_FILES['a_file_name']['name'][$i]))
		{
			if(!move_uploaded_file($tmp_file_name, REPORTS_DIR.$add_file_name))
			{
				echo "<center><font class=z11 color=Red>".REPORT_LOAD_ERR.$add_file_name."</font></center>";
				mysql_query("rollback", $descriptor);
				exit;
			}
				
			$query = sprintf("INSERT INTO user_reports_files SET report_id='%d', filename='%s', is_main=0",
	                 $report_id, addslashes($add_file_name));
			if(!mysql_query($query, $descriptor))
			{
				echo "<center><font class=z11 color=Red>".REPORT_OWNER_ERR."</font></center>";
				mysql_query("rollback", $descriptor);
				exit;
			}
		}
	}
	
	
	
	mysql_query("commit", $descriptor);
 	echo "<center><font class=z11><b>".REPORT_CREATED_SUCC."</b></font></center>";
 	exit;
}

// Сохранение отредактированного  отчета
if($_POST['save_user_report'] && $_POST['whatpressed'] == 2)
{
	$rep_name = addslashes($_POST['report_name']);
	$rep_desc = addslashes($_POST['report_desc']);
	$main_file_name_tmp = $_FILES['m_file_name']['tmp_name'];
	$main_file_name = $_FILES['m_file_name']['name'];
	
	// Пишем в БД основную информацию
	mysql_query("begin", $descriptor);
	
	$query = sprintf("UPDATE user_reports SET report_name='%s', report_desc='%s' WHERE report_id='%d'", $rep_name, $rep_desc, $_POST['loaded_rep']);	
	if(!mysql_query($query, $descriptor))
	{
		echo "<center><font class=z11 color=Red>".REPORT_INFO_ERR."</font></center>";
		mysql_query("rollback", $descriptor);
		exit;
	}
	$report_id = $_POST['loaded_rep'];
	
	// Пишем основной файл отчета
	if(!empty($main_file_name))
	{
		unlink(REPORTS_DIR.addslashes($_POST['report_main_file']));
		
		if(!move_uploaded_file($main_file_name_tmp, REPORTS_DIR.$main_file_name))
		{
			echo "<center><font class=z11 color=Red>".REPORT_LOAD_ERR.$main_file_name."</font></center>";
			mysql_query("rollback", $descriptor);
			exit;
		}
		
		$query = sprintf("UPDATE user_reports_files SET filename='%s' WHERE report_id='%d' AND is_main=1",
	                  addslashes($main_file_name), $report_id);
		if(!mysql_query($query, $descriptor))
		{
			echo "<center><font class=z11 color=Red>".REPORT_OWNER_ERR."</font></center>";
			mysql_query("rollback", $descriptor);
			exit;
		}
	}
	
	// Теперь пишем дополнительные файлы
	for($i = 0; $i < 8; ++$i)
	{
		$tmp_file_name = $_FILES['a_file_name']['tmp_name'][$i];
		$add_file_name = $_FILES['a_file_name']['name'][$i];
		
		if(!empty($_FILES['a_file_name']['name'][$i]))
		{
			if(!move_uploaded_file($tmp_file_name, REPORTS_DIR.$add_file_name))
			{
				echo "<center><font class=z11 color=Red>".REPORT_LOAD_ERR.$add_file_name."</font></center>";
				mysql_query("rollback", $descriptor);
				exit;
			}
				
			$query = sprintf("INSERT INTO user_reports_files SET report_id='%d', filename='%s', is_main=0",
	                 $report_id, addslashes($add_file_name));
			if(!mysql_query($query, $descriptor))
			{
				echo "<center><font class=z11 color=Red>".REPORT_OWNER_ERR."</font></center>";
				mysql_query("rollback", $descriptor);
				exit;
			}
		}
	}
	
	
	
	mysql_query("commit", $descriptor);
 	echo "<center><font class=z11><b>".REPORT_EDITED_SUCC."</b></font></center>";
 	exit;
}

// Удаление отчета
if($_POST['delete_r'])
{
	$rep_to_del = $_POST['report2edit'];
	
	// Смотрим какие у него файлы 
	$query = sprintf("SELECT filename FROM user_reports_files WHERE report_id='%d'", $rep_to_del);
	$result = mysql_query($query, $descriptor);
	while( ($row = mysql_fetch_row($result)))
	{
		$file_to_del = REPORTS_DIR.$row[0];
		unlink($file_to_del);	
	}
	
	// Удаляем записи из таблиц
	mysql_query("DELETE FROM user_reports WHERE report_id=".$rep_to_del, $descriptor);
	mysql_query("DELETE FROM user_reports_files WHERE report_id=".$rep_to_del, $descriptor);
	
	echo "<center><font class=z11><b>".REPORT_DELETED_SUCC."</b></font></center>";
 	exit;
}

if(!$_POST['whatpressed']) //Список отчетов
{
	// Читаем из БД все пользовательские отчеты
	$query = "SELECT report_id, report_name, report_desc FROM user_reports";
	$result = mysql_query($query, $descriptor);
	$curr_num = 1;
	while( ($row = mysql_fetch_row($result)))
	{
		$tpl->setCurrentBlock("reports_entry");
		$tpl->setVariable("REPORT2EDIT", intval($row[0]));
		$tpl->setVariable("REPORT_NUM", $curr_num);
		$tpl->setVariable("REPORT_NAME", stripslashes($row[1]));
		$tpl->setVariable("REPORT_DESC", stripslashes($row[2]));
		$tpl->parseCurrentBlock("reports_entry");
		
		++$curr_num;
	}
	
	mysql_free_result($result);
	
	$tpl->setCurrentBlock("reports_list");
	$tpl->setVariable("SHOW_REP_LIST", REPORT_LIST_USER);
	$tpl->parseCurrentBlock("reports_list");
}
else if($_POST['whatpressed'] == 1 || $_POST['whatpressed'] == 2) // Создание отчета
{
	if($_POST['create'])
	{
		$_POST['report_name'] = "";
		$_POST['report_desc'] = "";
		$_POST['loaded_rep'] = 0;
	}
	

	if($_POST['edit_r'])
	{
		// Читаем из БД название и описание
		$query = sprintf("SELECT report_id, report_name, report_desc FROM user_reports WHERE report_id='%d' LIMIT 1", $_POST['report2edit']);
		$result = mysql_query($query, $descriptor) or die(mysql_error());
		$row = mysql_fetch_row($result);
		list($_POST['loaded_rep'], $_POST['report_name'], $_POST['report_desc']) = $row;
		mysql_free_result($result);
		
		// Читаем файлы для этого отчета
		$query = sprintf("SELECT filename, is_main FROM user_reports_files WHERE report_id='%d'", $_POST['loaded_rep']);
		$result = mysql_query($query, $descriptor);
		
		$_POST['report_main_file'] = "";
		
		while( ($row=mysql_fetch_row($result)))
		{
			if($row[1] == 1)
			{
				$_POST['report_main_file'] = stripslashes($row[0]);
			}
			else 
			{
				$add_files_arr[] = stripslashes($row[0]);
			}	
		}
	}
	
	// Удаляем дополнительный файл
	if($_POST['whatpressed'] == 2 && $_POST['del_add_file'])
	{
		if(is_array($_POST['report_add_files']))
		{
			foreach ($_POST['report_add_files'] as $key=>$value)
			{
				$query = sprintf("DELETE FROM user_reports_files WHERE report_id='%d' AND filename='%s'",
				         $_POST['loaded_rep'], addslashes($value));
				mysql_query($query, $descriptor);
				
				$t_f = REPORTS_DIR.$value;
				unlink($t_f);
			}	
		}
		
		// Читаем файлы для этого отчета
		$query = sprintf("SELECT filename FROM user_reports_files WHERE report_id='%d' AND is_main=0", $_POST['loaded_rep']);
		$result = mysql_query($query, $descriptor);
		
		while( ($row=mysql_fetch_row($result)))
			$add_files_arr[] = stripslashes($row[0]);
	}
	
	if(is_array($add_files_arr))
	{
		foreach ($add_files_arr as $value)
		{
			$tpl->setCurrentBlock("add_file_opt");
			$tpl->setVariable("REPORT_ADD_FILE", $value);
			$tpl->parseCurrentBlock("add_file_opt");
		}	
	}
	
	$tpl->setCurrentBlock("create_edit_report");
	$tpl->setVariable("SHOW_REP_CREATE", USERREPORTS_DRIVE);
	$tpl->setVariable("REPORT_NAME", $_POST['report_name']);
	$tpl->setVariable("REPORT_DESC", $_POST['report_desc']);
	$tpl->setVariable("LOADED_REP", $_POST['loaded_rep']);
	$tpl->setVariable("REPORT_MAIN_FILE", $_POST['report_main_file']);
	$tpl->parseCurrentBlock("create_edit_report");
}

$tpl->setCurrentBlock("show_reports_load");
$tpl->setVariable("WHATPRESSED", ($_POST['whatpressed'])?$_POST['whatpressed']:0);
$tpl->parseCurrentBlock("show_reports_load");
$tpl->show();
?>
