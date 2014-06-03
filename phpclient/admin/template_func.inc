<?php

define("TEMPLATEX_NAME", "templatex");
define("TEMPLATES_DIR", "templates");

define("ACC_TYPE_COMPANY", 1);
define("ACC_TYPE_PERSON", 2);

define("DOC_TYPE_CONTRACT", 1);
define("DOC_TYPE_ATTACHMENT3", 2);
define("DOC_TYPE_ADDITION", 3);
define("DOC_TYPE_USER", 4);

function PrintError($err)
{
	printf("<table align='center'><tr><td class=z11 align='center'><font color='red'>%s</font>: %s</td></tr></table>", ERROR, $err);
}

function GetFileExtension($filename)
{		
	$ext_pos = strrpos($filename, ".");
	if ($ext !== FALSE)
		$ext = substr($filename, $ext_pos+1);
	if (strlen($ext) == 0)
		$ext = "xml"; // default extension	

	return $ext;
}

function GetTemplatePath($template_filename)
{
	return sprintf("%s/%s", TEMPLATES_DIR, $template_filename);
}

function GetTemplateX()
{
	global $descriptor;

	$template_data = array();

	// Выберем название файла шаблона из БД
	$query = sprintf("select template_filename, document_type as max_page_size from templates where template_name='%s'", TEMPLATEX_NAME);
	$res = mysql_query($query, $descriptor);
	if ($res)
	{
		if (mysql_num_rows($res) == 1)
		{
			if ($row = mysql_fetch_object($res))
			{	
				$filename = $row->template_filename;
				$template_data['max_page_size'] = $row->max_page_size;

				// Прочитаем текст шаблона из файла
				$filepath = GetTemplatePath($filename);
				if (is_file($filepath))
				{
					$template = join("\n", file($filepath));								
					$template_found = (strlen($template) > 0);
				}
			}
		}
	}
	else
	{
		printf("MySQL error %d: %s", mysql_errno(), mysql_error());
		exit;
	}

	if (!$template_found)	// используем шаблон по умолчанию
	{
		$template = "<p>Дата подключения: {linkdate}<br/><br/>
			<b>
			№ Договора: {contract_no}<br/>
			Абонент: {fio}<br/>
			Почтовый адрес: {address}
			</b><br/><br/>
			Телефон: {phone}<br/>
			Примечание: {comments}<br/><br/>
			Логин: {login}<br/>
			Пароль: {password}</p>";

		$template_data['template'] = $template;
		$template_data['max_page_size'] = 10;
	}
	else
	{
		$template_data['template'] = $template;
	}

	return $template_data;
}

/*
	Функция возвращает HTML-тег <select>, содержащий список шаблонов
		$select_attributes - атрибуты тега <select> (Например, "name='template_id' class=z11")
		$document_type - ограничивает выборку шаблонами для указанного типа документов (можно указать массив из нескольких типов)
		$account_type - ограничивает выборку шаблонами для указанного типа абонента (физ/юр лицо)
		$agent_id	- ограничиват выборку шаблонами для указанного агента

	Пример:
		GenTemplateSelect("name='template_id' class=z11", array(DOC_TYPE_CONTRACT, DOC_TYPE_ATTACHMENT3), ACC_TYPE_PERSON, 0) 
			- возвращает список всех шаблонов договоров и приложений №3
*/
function GenTemplateSelect($select_attributes, $document_type, $account_type, $agent_id)
{
	global $descriptor;

	$template_select = sprintf("<select %s>", $select_attributes);

	$where = "";
	$link_string = " and ";
	if ($document_type)
	{
		$where .= sprintf("%sdocument_type in (%s)", $link_string, is_array($document_type) ? join(",", $document_type) : $document_type);
		$link_string = " and ";
	}

	if ($account_type)
	{
		$where .= sprintf("%s(account_type in (0, %d))", $link_string, $account_type);
		$link_string = " and ";
	}

	if ($agent_id)
	{
		$where .= sprintf("%s(agent_id in (0, %d))", $link_string, $agent_id);
		$link_string = " and ";	// in case we'll add more filters later
	}

	$query = sprintf("select template_id, template_name from templates 
		where template_name <> '%s' %s 
		order by template_name", TEMPLATEX_NAME, $where);
	$res = mysql_query($query, $descriptor);
	if ($res)
	{
		while ($row = mysql_fetch_object($res))
		{	
			$template_select .= sprintf("<option value='%d'>%s</option>", $row->template_id, $row->template_name);
		}
	}
	else
	{
		printf("MySQL error %d: %s", mysql_errno(), mysql_error());
		exit;
	}

	$template_select .= "</select>";
	return $template_select;
}

// общие ключевые слова
$general_keywords = array("company_agent_name", "company_agent_fio", "contract_no", "contract_date", "agent_no");
$address_keywords = array("address", "country", "city", "street", "house", "building", "apt", "address_comments");


function FormatAddress($data, $keyword_suffix)
{
	global $address_keywords;

	$address = "";
	$n=0;
	
	$cnt = count($address_keywords);

	for($i=1; $i<$cnt; $i++)
	{
		//echo $data[$address_keywords[$i].$keyword_suffix]."---".$address_keywords[$i]."<br />";
		
		//$value = str_replace("{".$address_keywords[$i]."}", $data[$address_keywords[$i].$keyword_suffix]);
		$value = trim(str_replace(chr(160), "", $data[$address_keywords[$i].$keyword_suffix]));
		if (strlen($value))
		{
			$address .= ($n ? ", " : "").$value;
			$n++;
		}
	}

	return $address;
}

// Функция возвращет имя в формате Иванов И.И. 
//	$name - полное имя (Иванов Иван Иванович)
function GetFioFromName($name)
{
	$full_name = trim($name);
	$parts = explode(" ", $full_name, 3);
	if(strlen($parts[0]) > 2 && strlen($parts[1]) > 2 && strlen($parts[2]) > 2)
		$fio = sprintf("%s %s.%s.", $parts[0], substr($parts[1], 0, 1), substr($parts[2], 0, 1));
 	else 
 	      $fio = $full_name;

	return $fio;
}

function unicode_russian($in) 
{
    $in = convert_cyr_string($in ,"w","i");
    $out = "";
    for ($i=0; $i < strlen($in); $i++)
        {
         $char = ord($in[$i]);
         $out .= ($char > 175)?"&#".(1040+($char-176)).";":$in[$i];
        }
    return $out; 

}

?>