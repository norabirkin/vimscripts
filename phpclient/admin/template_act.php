<?php
/********************************************************************
   filename:   template_act.php
   modified:   8/12/2005
   author:     Maria Basmanova
*********************************************************************/

include ("localize.php");

if (!session_is_registered("auth"))
{
   exit;
}

/*
	В этом скрипте обрабатываются следующие команды:
		
		del - удалить шаблоны
		save_new - добавить новый шаблон
		save - сохранить изменения в шаблоне		
*/

include("template_func.inc");

if ($_POST['act'] == "del") // Удаление выбранных шаблонов
{
	// Проверим, что массив $template_id содержит только числовые значения	

	if (is_array($_POST['template_id']))
	{
		
		$cnt = count($_POST['template_id']);
		$ok = true;
		for ($i=0; $i<$cnt; $i++)
		{
			if (!is_numeric($_POST['template_id'][$i]))
			{
				$ok = false;
				break;
			}
		}			
		
		if ($ok)
		{
			// Сначала удалим файлы шаблонов
			$query = sprintf("select template_id, template_name from templates where template_id in (%s)", implode(",", $_POST['template_id']));
			
			$res = mysql_query($query, $descriptor);
			if($res){
				while ($row = mysql_fetch_row($res))
				{
					$template_id = $row[0];
					$template_name = $row[1];
					$template_path = GetTemplatePath($template_name);
					if (is_file($template_path))	//Удаляем файл только если файл существует
					{
						if (!unlink($template_path))
						{
							PrintError(sprintf(E_CANT_DELETE_FILE, $template_path));
							exit;
						}
					}
 
					// Теперь удаляем запись из БД
					mysql_unbuffered_query(sprintf("delete from templates where template_id=%d", $template_id), $descriptor);
				}
			}
			else{
				printf("MySQL error %d: %s", mysql_errno(), mysql_error());
				exit;
			}
		}
		
	}
}
elseif ($_POST['act'] == "save_new") // Добавить новый шаблон
{

	// Проверяем, что пользователь указал файл шаблона
	if (strlen($_FILES['template_file']['name']) == 0)
	{
		PrintError(E_NO_TEMPLATE_FILE);
		exit;
	}

	// Проверяем, что директория templates существует (если нет, то создадим новую)
	
	$templates_dir = realpath(TEMPLATES_DIR);
	if (!is_dir($templates_dir))
	{
		$templates_dir = realpath("./") . "/" . TEMPLATES_DIR;
		// Создаем папку templates с прави на чтение и запись для пользователя, создавшего папку и всех пользователей, входящих в его группу.
		if (!mkdir($templates_dir, 0760))
		{
			PrintError(sprintf(E_CANT_CREATE_DIR, $templates_dir));
			exit;
		}
	}

	// Проверяем тип загруженного файла
	$mime_type = $_FILES['template_file']['type'];
	if (strpos($mime_type, "text/") != 0)
	{
		PrintError(sprintf(E_WRONG_TEMPLATE_FILETYPE, $mime_type));
		exit;
	}

	// Проверяем название шаблона
	if (strcmp(trim($template_name), TEMPLATEX_NAME) == 0)
	{
		PrintError(sprintf(E_WRONG_TEMPLATE_NAME, TEMPLATEX_NAME));
		exit;
	}

	$query = sprintf("insert into templates(document_type, account_type, agent_id, template_name) values(%d, %d, %d, '%s')", 
		$_POST['document_type'], 
		$_POST['account_type'], 
		$_POST['agent_id'], 
		addslashes(htmlspecialchars($_POST['template_name'])));
	$res = mysql_query($query, $descriptor);
	if($res){
		//OK
		$template_id = mysql_insert_id($descriptor);
	}
	else{
		printf("MySQL error %d: %s", mysql_errno(), mysql_error());
		exit;
	}	

	// Генерируем имя файла нового шаблона
	$template_filename = sprintf("tmpl_%d.%s", $template_id, substr(strrchr($_FILES['template_file']['name'], '.'),1));

	$template_path = GetTemplatePath($template_filename);

	// Копируем загруженный файл в папку templates
	if (!move_uploaded_file($_FILES['template_file']['tmp_name'], $template_path))
	{
		PrintError(sprintf(E_UPLOAD_ERROR, $_FILES['template_file']['error']));
		exit;
	}

	// Записываем название файла шаблона в БД
	$query = sprintf("update templates set template_filename='%s', original_filename='%s', template_filesize=%d 
		where template_id=%d", 
			$template_filename, 
			addslashes($_FILES['template_file']['name']), 
			$_FILES['template_file']['size'], 
			$template_id);
	$res = mysql_query($query, $descriptor);
	if($res){
		//OK
	}
	else{
		printf("MySQL error %d: %s", mysql_errno(), mysql_error());
		exit;
	}	

}
elseif ($_POST['act'] == "save") // Сохранить изменения в шаблоне
{
	$template_id = $_POST['template_id'];

	$template_exists = false;

	// Проверим существует ли шаблон с указанным ID
	if (is_numeric($template_id))
	{
		$query = sprintf("select template_id, template_filename from templates where template_id=%d", $template_id);
		$res = mysql_query($query, $descriptor);
		if($res){
			if (mysql_num_rows($res)==1)
			{
				if ($row=mysql_fetch_object($res))
				{
					$template_exists = true;
					$template_filename = $row->template_filename;
				}
			}
		}
		else{
			printf("MySQL error %d: %s", mysql_errno(), mysql_error());
			exit;
		}
	}

	if (!$template_exists)
	{
		PrintError(E_TEMPLATE_NOT_FOUND);
		exit;
	}

	// Если пользователь загрузил новый файл, то проверим тип файла
	if (strlen($_FILES['template_file']['name']) > 0)
	{

		// Проверяем тип загруженного файла
		$mime_type = $_FILES['template_file']['type'];
		if (strpos($mime_type, "text/") != 0)
		{
			PrintError(sprintf(E_WRONG_TEMPLATE_FILETYPE, $mime_type));
			exit;
		}

		// Проверяем, что директория templates существует (если нет, то создадим новую)
		$templates_dir = realpath("templates");//sprintf("%s/%s", $_SERVER['DOCUMENT_ROOT'], "templates");
		if (!is_dir($templates_dir))
		{
			// Создаем папку templates с прави на чтение и запись для пользователя, создавшего папку и всех пользователей, входящих в его группу.
			if (!mkdir($templates_dir, 0660))
			{
				PrintError(sprintf(E_CANT_CREATE_DIR, $templates_dir));
				exit;
			}
		}		

		// Генерируем имя файла нового шаблона, если нужно
		if (strlen(trim($template_filename)) == 0)
			$template_filename = sprintf("tmpl_%d.%s", $template_id, GetFileExtension($_FILES['template_filename']['name']));

		$template_path = GetTemplatePath($template_filename);

		// Копируем загруженный файл в папку templates
		if (!move_uploaded_file($_FILES['template_file']['tmp_name'], $template_path))
		{
			PrintError(sprintf(E_UPLOAD_ERROR, $_FILES['template_file']['error']));
			exit;
		}
	}

	$query = sprintf("UPDATE templates SET document_type=%d, account_type=%d, agent_id=%d, template_name='%s', template_filename='%s' %s WHERE template_id=%d",
		$_POST['document_type'], 
		$_POST['account_type'], 
		$_POST['agent_id'], 
		addslashes(htmlspecialchars($_POST['template_name'])), 
		$template_filename,
		(strlen($_FILES['template_file']['name']) > 0) ? sprintf(", original_filename='%s', template_filesize=%d",addslashes($_FILES['template_file']['name']),$_FILES['template_file']['size']) : '', 
		$template_id);
	$res = mysql_query($query, $descriptor);
	if($res){
		//OK
	}
	else{
		printf("MySQL error %d: %s", mysql_errno(), mysql_error());
		exit;
	}
}
?>
<form name="empty" action="config.php" method="post">
	<input type="hidden" name="devision" value="111">
</form>
<script language="JavaScript">
	document.forms.empty.submit();
</script>
