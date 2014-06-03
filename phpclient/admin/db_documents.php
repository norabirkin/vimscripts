<?php
/**
 * Document's templates configuration engine
 *
 * Repository information:
 * $Date: 2009-12-21 13:15:34 $
 * $Revision: 1.5.2.9 $
 */

// MIME type to start correct download process
$mimeTypes = array(
    "application/octet-stream" => $localize->get('Without changes'),
	"application/msword"       => $localize->get('MS Word'),
    "application/vnd.ms-excel" => $localize->get('MS Excel'),
	"text/html"                => $localize->get('HTML')
);

// Создание объекта шаблона
$tpl = new HTML_Template_IT(TPLS_PATH);
$tpl->loadTemplatefile("db_documents.tpl",true,true);

// Установка общих заголовков и постоянных переменных в шаблоне
$tpl->setVariable("TITLE", $localize->get('Documents settings'));
$tpl->setVariable("DB_DOCUMENT", (!isset($_POST['db_document'])) ? -1 : $_POST['db_document']);

// Определение вызываемого события
switch(true)
{
	// Создание нового шаблона
	case ($_POST['db_document'] > 0 && $_POST['what_do'] != 2):
		// Сохранение информации по шаблону
		if($_POST['what_do'] == 1)
		{	
			$saveResult = saveToDB( $lanbilling, $tpl );
		}		
		
		if(!isset($saveResult)) {
			restoreBD($lanbilling);
		}
		documentsForm($lanbilling, $tpl, $mimeTypes, $localize);
		break;

	case (isset($_POST['db_document']) && $_POST['db_document'] == 0):
		// Сохранение информации по шаблону

		if($_POST['what_do'] == 1) {
            $tpl->setVariable("DB_DOCUMENT", saveToDB( $lanbilling, $tpl ));
        }
		
		documentsForm($lanbilling, $tpl, $mimeTypes, $localize);
		break;

	default: 
	if($_POST['what_do'] == 2) delDocument( $lanbilling, $tpl );
	showDocumentsList($lanbilling, $tpl, $localize);
}

$localize->compile($tpl->get(), true);


/**
 * Recursive iteration for the all content of the folder and subfolders
 * @param	object, billing class
 * @param	array, linked array to write data to
 * @param	resource, opened older resource
 * @param	string, full path to the targer
 * @param	string, subpath of entrance
 */
function templatesList( &$lanbilling, &$files, $handler, $path, $subPath = '' )
{
	while(false !== ($file = readdir($handler))) {
		if(preg_match("/(^[\.]{1,2})|concat|sql|post/", $file)) {
			continue;
		}

		if(is_dir($path . "/" . $file)) {
			if(false == ($h = opendir($path . "/" . $file))) {
				$lanbilling->ErrorHandler(__FILE__, "Can't open specified files path: " . $path . "/" . $file, __LINE__);
			}
			else {
				templatesList($lanbilling, $files, $h, $path . "/" . $file, (!empty($subPath) ? ($subPath . "/" . $file) : $file));
			}
		}
		else {
			if(preg_match("/[a-zA-Z0-9\-\_]+\.[a-zA-Z0-9\-\_]+/", $file)) {
				$item = !empty($subPath) ? ($subPath . "/" . $file) : $file;
				$files[$item] = $item;
			}
		}
	}
} // end templatesList()


/**
 * Список групп пользователей и объединений
 * Формировать список 0 - группы пользователей, 1 - объединения
 */
function groupsList( &$lanbilling, $what_to = 0 )
{
	$_tmp = array();

	switch($what_to) {
		case 0: $_func = 'getUserGroups'; break;
		case 1: $_func = 'getGroups'; break;
		default: return $_tmp;
	}

	if( false != ($result = $lanbilling->get($_func, array('flt' => array()))) )
	{
		if(!is_array($result)) {
			$result = array($result);
		}

		if((integer)$what_to == 0) {
			array_walk($result, create_function('$val, $key, $_tmp', '$_tmp[0][$val->usergroup->groupid] = $val->usergroup->name;'), array( &$_tmp ));
		}
		else array_walk($result, create_function('$val, $key, $_tmp', '$_tmp[0][$val->groupid] = $val->name;'), array( &$_tmp ));

	}

	return $_tmp;
} // end groupsList()


/**
 * Отрисовка таблицы со списком документов
 * @var		открытый дескриптор на объект с шаблонами
 *
 */
function showDocumentsList( &$lanbilling, &$tpl, &$localize )
{
	// Управление списком
	$tpl->setCurrentBlock("create_return");
	$tpl->setVariable("ACTIONDESCR", NEWENTRY);
	$tpl->parseCurrentBlock("create_return");

	if( false != ($result = $lanbilling->get('getDocuments', array('flt' => array('onfly' => -1)))) )
	{
		$tpl->setCurrentBlock("line");
		$tpl->setVariable("ACTION_EDIT", "&nbsp;");
		$tpl->setVariable("STYLE_BOLD","font-weight:bold");
		$tpl->setVariable("DOC_ID", 'ID');
		$tpl->setVariable("DOC_NAME", NNAME);
		$tpl->setVariable("DOCUMENTISPAY", DOCUMENT_ISPAY);
		$tpl->setVariable("DOC_NDS", NDS_INSIDE);
		$tpl->setVariable("DOC_GR", DOCUMENT_FOR);
		$tpl->setVariable("ACTION_DROP", "&nbsp;");
		$tpl->parseCurrentBlock("line");

		if(!is_array($result)) {
			$result = array($result);
		}

		foreach($result as $item)
		{
			if((integer)$item->usergroupid < 0 && (integer)$item->groupid < 0) {
				$doc_gr = DOCUMENT_NOBODY;
			}
			elseif((integer)$item->usergroupid == 0 && (integer)$item->groupid == 0) {
				$doc_gr = DOCUMENT_FORALL;
			}
			elseif((integer)$item->usergroupid > 0) {
				$doc_gr = $item->usergroupname;
			}
			elseif((integer)$item->groupid > 0) {
				$doc_gr = $item->groupname;
			}
			else $doc_gr = "&nbsp;";

			$edit_bt = "<img src='images1/edit_15.gif' border=0 style='cursor: pointer;' onClick='javascript: document.forms[0].db_document.value = %d; document.forms[0].submit();' title='%s'>";
			$drop_bt = "<img src='images1/delete.gif' border=0 style='cursor: pointer;' onClick='document.forms[0].db_document.value = %s; document.documents.what_do.value = 2; document.documents.submit();'>";

			$tpl->setCurrentBlock("line");

			$tpl->setVariable("TRPROP", empty($item->doctemplate) ? sprintf("style='background-color: #FFF4F4;' title='%s'", DOCUMENT_CREATE_FALSE) : "");

			$tpl->setVariable("STYLE_BOLD","");
			$tpl->setVariable("ACTION_EDIT", sprintf($edit_bt, $item->docid, EDITENTRY));
			$tpl->setVariable("ACTION_DROP", sprintf($drop_bt, $item->docid, DELETEENTRY));
			$tpl->setVariable("DOC_NAME", $item->name);
			$tpl->setVariable("DOC_ID", $item->docid);

			// Схема выставления документа
			switch((integer)$item->payable)
			{
				case 0: $tpl->setVariable("DOCUMENTISPAY", DOCUMENT_ISNONEPAY); break;
				case 1: $tpl->setVariable("DOCUMENTISPAY", DOCUMENT_ISPOSTPAY); break;
				case 2: $tpl->setVariable("DOCUMENTISPAY", DOCUMENT_ISBEFOREPAY); break;
				case 3: $tpl->setVariable("DOCUMENTISPAY", $localize->get('prepayment') . ' + ' . $localize->get('services')); break;
			}
			$tpl->setVariable("DOC_NDS", empty($item->ndsabove) ? DOCUMENT_NDS_1 : DOCUMENT_NDS_2);
			$tpl->setVariable("DOC_GR", $doc_gr);
			$tpl->parseCurrentBlock("line");
		}
	}
} // end showDocumentsList()


/**
 * Востановление информации из базы данных
 *
 */
function restoreBD( &$lanbilling )
{
	if( false != ($result = $lanbilling->get('getDocuments', array('flt' => array('docid' => (integer)$_POST['db_document'])))) )
	{
		// Заполнение поста значениями
		$_POST['name'] = $result->name;
		$_POST['template'] = $result->doctemplate;
		$_POST['save_path'] = $result->savepath;
		$_POST['payable'] = $result->payable;
		$_POST['upload_ext'] = $result->uploadext;
		$_POST['client_allowed'] = $result->clientallowed;
		$_POST['hidden'] = $result->hidden;
		$_POST['onfly'] = $result->onfly;
		$_POST['documentperiod'] = $result->documentperiod;
		$_POST['curid'] = $result->curid;
		$_POST['detail'] = $result->detail;
		if ($lanbilling->Option('use_grouped_orders')){
			$_POST['save_path_group'] = $result->grouppath;
			$_POST['filenaming'] = $result->filenaming;
		}

		if((integer)$result->ndsabove == 0) {
			$_POST['nds_above'] = 0;
		}

		if((integer)$result->usergroupid < 0 && (integer)$result->groupid < 0) {
			$_POST['group_type'] = -1;
		}
		elseif((integer)$result->usergroupid > 0) {
			$_POST['usr_list'] = $result->usergroupid;
			$_POST['group_type'] = 1;
		}
		elseif((integer)$result->groupid > 0) {
			$_POST['grp_list'] = $result->groupid;
			$_POST['group_type'] = 2;
		}


		$_POST['penaltycost'] = $result->penaltycost;
		$_POST['penaltylimit'] = $result->penaltylimit;
		$_POST['penaltyperiod'] = $result->penaltyperiod;
		$_POST['penaltyinterval'] = $result->penaltyinterval;


	}
} // end restoreBD()


/**
 * Create 0r edit document
 * @param	object, billing class
 * @param	object, temaplte class
 * @param	string
 */
function documentsForm( &$lanbilling, &$tpl, $_mime, &$localize )
{
	// Сохранение
	$tpl->touchBlock("save_return");

	// Описание формы
	$tpl->setCurrentBlock("document_create_edit");
	$tpl->syncBlockLocalize("document_create_edit");

	// Поля управления
	$tpl->setVariable("HID_CHECKED", ($_POST['hidden'] == 1) ? "checked" : "");
	$tpl->setVariable("NAME_VALUE", $_POST['name']);
	$tpl->setVariable("NDS_CHECKED", isset($_POST['nds_above']) ? "checked" : "");
	$tpl->setVariable("SAVE_PATH", $_POST['save_path']);
	$tpl->setVariable("ALL_CHECKED", ((integer)$_POST['group_type'] == 0) ? "checked" : "");
	$tpl->setVariable("NO_CHECKED", ($_POST['group_type'] == -1) ? "checked" : "");
	$tpl->setVariable("USR_CHECKED", ($_POST['group_type'] == 1) ? "checked" : "");
	$tpl->setVariable("GRP_CHECKED", ($_POST['group_type'] == 2) ? "checked" : "");
	$tpl->setVariable("USR_DISABLED", ($_POST['group_type'] == 1) ? "" : "disabled");
	$tpl->setVariable("GRP_DISABLED", ($_POST['group_type'] == 2) ? "": "disabled");
	$tpl->setVariable("PERIOD_DISABLED", ($_POST['onfly'] == 2 || $_POST['onfly'] == 7 || $_POST['onfly'] == 1) ? "": "disabled");
	$tpl->setVariable("CL_ALLOWED", (isset($_POST['client_allowed']) && $_POST['client_allowed'] == 1) ? "checked" : "");
	$tpl->touchBlock("onfly_se_" . (integer)$_POST['onfly']);
	$tpl->touchBlock("documentperiod_se_" . (integer)$_POST['documentperiod']);

	// TODO:
	if ($lanbilling->Option('use_grouped_orders')){
		$tpl->setCurrentBlock("use_grouped_orders");
		$tpl->syncBlockLocalize("use_grouped_orders");
		$tpl->setVariable("SAVE_PATH_GROUP", $_POST['save_path_group']);
		$tpl->touchBlock("filenaming_se_" . (integer)$_POST['filenaming']);
	}

	if((integer)$_POST['detail'] == 1) {
		$tpl->touchBlock("skip_detail");
	}

	/**
	 * Пени
	 */
	$tpl->setCurrentBlock("penalty_settings");
	$tpl->syncBlockLocalize("penalty_settings");

	if ($_POST['penaltycost'] > 0){
		$can_to_pay = 1;
	}
	// Галочка CAN_TO_PAY_CHK
	$tpl->setVariable("CAN_TO_PAY_CHK", ($can_to_pay == 1) ? "checked" : "");

	$tpl->setVariable("PENALTY_PERIOD",            ($can_to_pay == 1) ? "" : "disabled"); //
	$tpl->setVariable("PENALTY_INTERVAL",          ($can_to_pay == 1) ? "" : "disabled"); //
	$tpl->setVariable("PENALTY_COST_DIS",          ($can_to_pay == 1) ? "" : "disabled"); //
	$tpl->setVariable("PENALTY_INTERVAL_DIS",      ($can_to_pay == 1) ? "" : "disabled"); //
	$tpl->setVariable("PENALTY_LIMIT_CHECKED",     ($can_to_pay == 1) ? "" : "disabled"); //
	$tpl->setVariable("PENALTY_LIMIT_ABS_CHECKED", ($can_to_pay == 1) ? "" : "disabled"); //
	$tpl->setVariable("PENALTY_LIMIT_DIS",         ($can_to_pay == 1) ? "" : "disabled"); //

	if ($can_to_pay){

		$tpl->touchBlock("penaltyperiod_se_" . $_POST['penaltyperiod']);

		if (preg_match('~(\d+)\s(\S+)~',$_POST['penaltyinterval'],$matches)){
			$_POST['penaltyinterval'] = $matches[2];
			$_POST['penaltyintervalval'] = $matches[1];
		}else{
			$_POST['penaltyinterval'] = 'month';
			$_POST['penaltyintervalval'] = 1;
		}

		$tpl->touchBlock("penaltyinterval_se_" . $_POST['penaltyinterval']);
		$tpl->setVariable("PENALTY_INTERVAL_VAL",  $_POST['penaltyintervalval']);

		$tpl->setVariable("PENALTY_COST_VAL",  $_POST['penaltycost']);
		$tpl->setVariable("PENALTY_LIMIT_VAL", $_POST['penaltylimit']);

		$tpl->setVariable("PENALTY_BILL_MAX", ($_POST['penaltylimit'] == 0) ? "checked" : "");
		$tpl->setVariable("PENALTY_BILL_ABS", ($_POST['penaltylimit'] > 0)  ? "checked" : "");
	}


	// Currency
	if( false != ($result = $lanbilling->get("getCurrencies")) )
	{
		if(!is_array($result)) {
			$result = array($result);
		}

		foreach($result as $item)
		{
			if($item->id == 0) {
				continue;
			}

			$tpl->setCurrentBlock('currOpt');
			$tpl->setVariable('CUURID', $item->id);
			$tpl->setVariable('CURRNAME', $item->name . " (" . $item->symbol . ")");

			if((integer)$_POST['curid'] == $item->id) {
				$tpl->touchBlock('currOptSel');
			}

			$tpl->parseCurrentBlock();
		}
	}

	// Declare files list array
	$files = array();
	// Prepare templates list
	$t_dir = $lanbilling->inCorePath($lanbilling->Option('templates_dir'));
	// Create handler
	if(false == ($handler = opendir($t_dir))) {
		$lanbilling->ErrorHandler(__FILE__, "Can't open specified files path: " . $_dir, __LINE__);
	}
	else {
		templatesList($lanbilling, $files, $handler, $t_dir);
		array_multisort($files);
	}

	// Files
	optionBuilder( $tpl, "doc_template", $files, $_POST['template'], "TMP_VAL", "TMP_SEL", "TMP_OPT" );
	//Группы пользователей и объдинения
	groupsList($lanbilling, $tpl);
	// Группы пользователей
	optionBuilder( $tpl, "doc_usr", ( groupsList($lanbilling, 0) ), $_POST['usr_list'], "USR_VAL", "USR_SEL", "USR_OPT" );
	// Объединения
	optionBuilder( $tpl, "doc_grp", ( groupsList($lanbilling, 1) ), $_POST['grp_list'], "GRP_VAL", "GRP_SEL", "GRP_OPT" );
	// Оплачивание документа
	optionBuilder( $tpl, "payable", array(0 => DOCUMENT_ISNONEPAY, 1 => DOCUMENT_ISPOSTPAY, 2 => DOCUMENT_ISBEFOREPAY, 3 => $localize->get('prepayment') . ' + ' . $localize->get('services')), $_POST['payable'], "PB_VAL", "PB_SEL", "PB_OPT" );
	// Выгружать документ для программы
	optionBuilder( $tpl, "upload_ext", $_mime, $_POST['upload_ext'], "EXT_VAL", "EXT_SEL", "EXT_OPT" );

	$tpl->parseCurrentBlock("document_create_edit");

} // end documentsForm()


/**
 * Сохранение в базу данных иноформации по шаблону
 *
 */
function saveToDB( &$lanbilling, &$tpl )
{
	$struct = array(
		"docid" => (integer)$_POST['db_document'],
		"ndsabove" => isset($_POST['nds_above']) ? 0 : 1,
		"usergroupid" => ((integer)$_POST['group_type'] < 0) ? -1 : (((integer)$_POST['group_type'] == 1) ? (integer)$_POST['usr_list'] : 0),
		"groupid" => ((integer)$_POST['group_type'] < 0) ? -1 : (((integer)$_POST['group_type'] == 2) ? (integer)$_POST['grp_list'] : 0),
		"payable" => (integer)$_POST['payable'],
		"clientallowed" => (integer)$_POST['client_allowed'],
		"hidden" => (integer)$_POST['hidden'],
		"onfly" => (integer)$_POST['onfly'],
		"documentperiod" => (integer)$_POST['documentperiod'],
		"name" => $_POST['name'],
		"doctemplate" => $_POST['template'],
		"savepath" => preg_replace("/[\ \"\'\/\\\]+$/","",$_POST['save_path']),
		"uploadext" => $_POST['upload_ext'],
		"curid" => (integer)$_POST['curid'],
		"filenaming" => (integer)$_POST['filenaming'],
		"detail" => (integer)$_POST['detail'],
		"grouppath" => preg_replace("/[\ \"\'\/\\\]+$/","",$_POST['save_path_group']),
	);

	if ($_POST['can_to_pay'] == 1){
		$struct["penaltycost"]   = $_POST['penaltycost'];
		$struct["penaltyperiod"] = $_POST['penaltyperiod'];
		$struct["penaltyinterval"]   = $_POST['penaltyintervalval'] . ' ' . $_POST['penaltyinterval'];
		if ($_POST['penaltylimit_radio'] == 1){
			$_POST['penaltylimit'] = $struct["penaltylimit"]  = 0;
		}else{
			$struct["penaltylimit"]  = $_POST['penaltylimit'];
		}
	}else{
		$struct["penaltycost"]   = $_POST['penaltycost']   = 0;
		$struct["penaltylimit"]  = $_POST['penaltylimit']  = 0;
		$struct["penaltyperiod"] = $_POST['penaltyperiod'] = 'D';

		$struct["penaltyinterval"]   = $_POST['penaltyinterval']   = '1 month';
	}
		$_POST["penaltyinterval"]   = $_POST['penaltyintervalval'] . ' ' . $_POST['penaltyinterval'];

	if( false != $lanbilling->save("insupdDocument", $struct, (((integer)$_POST['db_document'] == 0) ? true : false), array("getDocuments")) ) {
		$tpl->setCurrentBlock("save_status");
		$tpl->setVariable("STATUS", "<font color=green>".DOCUMENT_RECORD_SAVED."</font>");
		$tpl->parseCurrentBlock("save_status");
	}
	else {
		$tpl->setCurrentBlock("save_status");
		$tpl->setVariable("STATUS", "<font color=red>".P_ERR_DB."</font>");
		$tpl->parseCurrentBlock("save_status");
	}
	return $lanbilling->saveReturns->ret;
} // end saveToDB()


/**
 * Удаление документа
 *
 */
function delDocument( &$lanbilling, &$tpl )
{
	$struct = array(
		"id" => (integer)$_POST['db_document']
	);

	if( false != $lanbilling->delete("delDocument", $struct, array("getDocuments")) ) {
		$tpl->setCurrentBlock("save_status");
		$tpl->setVariable("STATUS", "<font color=green>OK</font>");
		$tpl->parseCurrentBlock("save_status");
	}
	else {
		$tpl->setCurrentBlock("save_status");
		$tpl->setVariable("STATUS", "<font color=red>".P_ERR_DB."</font>");
		$tpl->parseCurrentBlock("save_status");
	}
	return 0;
} // end delDocument()


/**
 * Построение опций
 * @var		Ссылка на объект шаблона
 * @var		Название блока в шаблоне
 * @var		Массив опций opt_value => opt_descr
 * @var		Выбраное значение
 * @var		Переменная в шаблоне значения опции
 * @var		Переменная в шаблоне определяющая по умолчанию
 * @var		Переменная в шаблоне описания опции
 */
function optionBuilder( &$tpl, $block_name, $_opt, $post_sel, $opt_t_val, $opt_t_sel, $opt_t_descr )
{
	foreach($_opt as $opt_val => $opt_descr)
	{
		$tpl->setCurrentBlock($block_name);
		$tpl->setVariable($opt_t_val, $opt_val);
		$tpl->setVariable($opt_t_sel, ($opt_val == $post_sel) ? "selected" : "");
		$tpl->setVariable($opt_t_descr, $opt_descr);
		$tpl->parseCurrentBlock($block_name);
	}
} // end optionBuilder()
