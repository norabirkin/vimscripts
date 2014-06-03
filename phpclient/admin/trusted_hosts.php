<?php

// print_r($_POST);

// Если нажата кнопка сохранения
if($_POST['th_save'] > 0)
{
	$ip2save = $_POST['th_ip1'].".".$_POST['th_ip2'].".".$_POST['th_ip3'].".".$_POST['th_ip4'];
	$mask2save = $_POST['th_mask1'].".".$_POST['th_mask2'].".".$_POST['th_mask3'].".".$_POST['th_mask4'];
	
	$query = sprintf("INSERT INTO trusted set trusted_ip=inet_aton('%s'), 
	                  trusted_mask=inet_aton('%s'), 
	                  trusted_descr='%s'", $ip2save, $mask2save, addslashes($_POST['th_descr']));
	// echo $query;
	$result = mysql_query($query, $descriptor);
}

// Если нажата кнопка удаления
if($_POST['th_del_curr'])
{
	$th_temp_del = $_POST['th_del_curr'];
	$trusted_id = key($th_temp_del);

	$query = sprintf("DELETE FROM trusted WHERE trusted_id='%d'", $trusted_id);
	// echo $query;
	mysql_query($query, $descriptor);
}


// Читаем из БД - вдруг там уже есть хосты
unset($trusted_array);
unset($th_message);
$query = sprintf("select trusted_id, inet_ntoa(trusted_ip), inet_ntoa(trusted_mask), trusted_descr FROM trusted");
// echo $query;
//echo $th_message."<br />";

$result = mysql_query($query, $descriptor);
if($result && mysql_num_rows($result) > 0)
{
	while( ($row = mysql_fetch_row($result)))
		$trusted_array[$row[0]] = array($row[1], $row[2], stripslashes($row[3]));
	unset($th_message);	
}
else if(!$_POST['th_create'])
	$th_message = TH_MESSAGE_EMPTY;

//echo $th_message."<br />";

// Заполнение шаблона
$tpl = new HTML_Template_IT(TPLS_PATH);
$tpl->loadTemplatefile("trusted_hosts.tpl");

if(isset($th_message))
{
	$tpl->setCurrentBlock("th_message");
	$tpl->setVariable("TH_MESSAGE", $th_message);
	$tpl->parseCurrentBlock("th_message");
}
// Если создаем новый адрес
$th_save_dis = "disabled";

if($_POST['th_create'])
{
	$th_save_dis = "";
	$tpl->setCurrentBlock("th_row");
	$tpl->setVariable("CURR_ID", "&nbsp;");
	$tpl->parseCurrentBlock("th_row");
}

if(is_array($trusted_array))
{
	foreach ($trusted_array as $id=>$arr)
	{
		$tpl->setCurrentBlock("th_row_db");
		$tpl->setVariable("TH_IP_C", $arr[0]);
		
		$tpl->setVariable("TH_MASK_C", $arr[1]);
		
		$tpl->setVariable("TH_DESCR_C", htmlspecialchars($arr[2]));
		$tpl->setVariable("TH_DEL", DELETE3);
		$tpl->setVariable("CURR_ID", $id);
		$tpl->parseCurrentBlock("th_row_db");
	}
}

$tpl->setCurrentBlock("trusted_hosts");
$tpl->setVariable("TH_TITLE", TRUSTED_HOSTS);
$tpl->setVariable("TH_CREATE", HD_ADD_BUT);
$tpl->setVariable("TH_IP", IPADDRESS);
$tpl->setVariable("TH_MASK", TH_IPMASK);
$tpl->setVariable("TH_DESCR", DESCRIPTION);
$tpl->setVariable("TH_SAVE", SAVE);
$tpl->setVariable("TH_SAVE_DIS", $th_save_dis);
$tpl->setVariable("WRONG_NEW_PARAMS", WRONG_NEW_PARAMS_M);
$tpl->parseCurrentBlock("trusted_hosts");

$tpl->show();

?>