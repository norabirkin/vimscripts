<?php
/**
 * Billing system setting engine
 *
 * Repository information:
 */

// There is background query
if(isset($_POST['async_call']))
{
	// get payments classes list
	if(isset($_POST['getpayclass'])) {
		getPayClass($lanbilling, $localize);
	}
	if(isset($_POST['recompayment'])) {
		recomPayment($lanbilling, $localize);
	}

	// If passed save payments classes
	if(isset($_POST['setpclass'])) {
		savePayClasses($lanbilling, $localize);
	}

	// If passed delete payments classes
	if(isset($_POST['delpclass'])) {
		deletePayClasses($lanbilling, $localize);
	}

	// get sales check data
	if(isset($_POST['printsales'])) {
		getSalesCheck($lanbilling, $localize);
	}
	
	// close period
	if(isset($_POST['closeperiod'])) {
		closePeriod($lanbilling, $localize);
	}
	
	// get current close period
	if(isset($_POST['getcloseddate'])) {
		getClosedDate($lanbilling, $localize);
	}	

}
else
{
	if(isset($_POST['save'])) {
		saveSettings($lanbilling, $localize);
	}

	if(isset($_POST['license'])) {
		sendLicense($lanbilling);
	}

	$tpl = new HTML_Template_IT(TPLS_PATH);
	$tpl->loadTemplatefile("settings.tpl", true, true);
	$tpl->touchBlock("__global__");

	if(!isset($_POST['submenu'])) $_POST['submenu'] = 0;

	$use_cerber = checkCerberIsUsed($lanbilling);
	if( $use_cerber ) $tpl->touchBlock("CerberMenu");

	switch($_POST['submenu'])
	{
		case 0:
			$tpl->touchBlock("Change");
			$tpl->setVariable("COMMUN", "x-tab-strip-active");
			$tpl->setVariable("PMUN", "x-tab-strip-disabled");
			$tpl->setVariable("ACTUN", "x-tab-strip-disabled");
			if($lanbilling->manager == 0) {
				$tpl->touchBlock("SetCloseDate"); 
			}
			if( $use_cerber ) $tpl->setVariable("CERBUN", "x-tab-strip-disabled");
		break;

		case 1:
			$tpl->touchBlock("Change");
			$tpl->setVariable("COMMUN", "x-tab-strip-disabled");
			$tpl->setVariable("PMUN", "x-tab-strip-active");
			$tpl->setVariable("ACTUN", "x-tab-strip-disabled");
			if( $use_cerber ) $tpl->setVariable("CERBUN", "x-tab-strip-disabled");
		break;

		case 2:
			if($lanbilling->manager == 0) {
				$tpl->touchBlock("Activate");
			}
			$tpl->setVariable("COMMUN", "x-tab-strip-disabled");
			$tpl->setVariable("PMUN", "x-tab-strip-disabled");
			$tpl->setVariable("ACTUN", "x-tab-strip-active");
			if( $use_cerber ) $tpl->setVariable("CERBUN", "x-tab-strip-disabled");
		break;

		case 3:
			$tpl->touchBlock("Change");
			$tpl->touchBlock("CerberCrypt");
			$tpl->setVariable("COMMUN", "x-tab-strip-disabled");
			$tpl->setVariable("PMUN", "x-tab-strip-disabled");
			$tpl->setVariable("ACTUN", "x-tab-strip-disabled");
			$tpl->setVariable("CERBUN", "x-tab-strip-active");
		break;
	}

	$tpl->setVariable("SUBMENUSELECTED", $_POST['submenu']);

	// Choose visialization according to submited submenu
	switch($_POST['submenu'])
	{
		case 0: showCommonSettings($lanbilling, $tpl); break;
		case 1: showStorageSettings($lanbilling, $tpl); break;
		case 2: showActivation($lanbilling, $tpl); break;
	}

	if( $use_cerber && $_POST['submenu'] == 3 ) {
		showCerberSettings($lanbilling, $tpl);
	}

	$localize->compile($tpl->get(), true);
}


function recomPayment(&$lanbilling, &$loc){

	$_filter['agrmid']=$_POST['agrmid'];
	$agr = $lanbilling->get("getAgreements", array("flt" => $_filter, "md5" => $_md5));

	$res=$lanbilling->get('getRecommendedPayment', array('id'=>$_POST['agrmid']));
	$row['sum']=$res;
	$row['symbol']=$agr->symbol;
	echo JEncode ($row, $lanbilling) ;

}


/**
 * Replace html entities with ASKII code
 * @param $val bool
 */
function htmlEntRepl($val,$ord=false){
	$entArr = array (
		9  => '\t',
		32 => '\s'
	);
	if (!$ord) {
		if (in_array($val,array_keys($entArr)))
			return str_replace(array_keys($entArr),array_values($entArr),$val);
		else return chr($val);
	} else {
		if (in_array($val,array_values($entArr)))
			return str_replace(array_values($entArr),array_keys($entArr),$val);
		else return ord($val);
	}
}


/**
 * Common billing settings
 * @param	object, billing class
 * @param	object, template class
 */
function getSalesCheck( &$lanbilling, &$tpl )
{

	/**
	 * Аппарат типа МЕБИУС
	 * Без поддержки 13-го (расширенного поля)
	 */
	$isMebius   = $lanbilling->Option('print_sales_mebius');
	/**
	 * Шаблон чека
	 */
	$salesTpl   = $lanbilling->Option('print_sales_template');
	/**
	 * Дополнительное поле оператора для физ.лиц
	 */
	$salesOcfiz = $lanbilling->Option('print_sales_ocfiz');
	/**
	 * Дополнительное поле оператора для юр.лиц
	 */
	$salesOcur  = $lanbilling->Option('print_sales_ocur');
	/**
	 * ID договора
	 */
	$agrmid = $_POST['agrmid'];
	/**
	 * Данные аккаунта пользователя
	 */
	$accountData = getAccountDetail($agrmid);
	/**
	 * Дополнительное поле кода оператора для пользователя
	 */
	$type = $accountData->account->type;

	// Налоговые группы в чеке: 0 для физиков и 2 для юриков (18%)
	$rArr['taxGroup'] = ($type == 2) ? 0 : 2 ;

	$operAddonCodeField = ($type == 2) ? $salesOcfiz : $salesOcur;
	$rArr['operCode'] = getOperAddon($agrmid,$operAddonCodeField);


	$rArr['isMebius'] = ($isMebius) ? true : false;


	//$accountData

	if ( preg_match_all('(\%\S+)',$salesTpl,$mtch,PREG_PATTERN_ORDER) ){
		foreach ($mtch[0] as $k => $val){
			switch ($val) {
				case '%fio':
					$ufio = (isset($accountData->account->name) && !empty($accountData->account->name)) ? $accountData->account->name : '';
					$salesTpl = str_replace($val,$ufio,$salesTpl);
				break;
				case '%addr':
					if(isset($accountData->addresses) && !empty($accountData->addresses)) {
						foreach($accountData->addresses as $i => $agrm) {
							if ($agrm->type == 2) $uaddr = $agrm->address;
						}
					}
					$temp_uaddr = explode(',',$uaddr);
					$uaddr = implode(', ', array($temp_uaddr[5], $temp_uaddr[6], $temp_uaddr[7]));
					$salesTpl = str_replace($val,$uaddr,$salesTpl);
				break;
				case '%ulogin':
					$ulogin = (isset($accountData->account->login) && !empty($accountData->account->login)) ? $accountData->account->login : '';
					$salesTpl = str_replace($val,$ulogin,$salesTpl);
				break;
				//$lanbilling->get("getVgroups", array("agrmid" => $pid));

				case '%credit':
				case '%balance':
				case '%agrm':
					if (is_array($accountData->agreements)){
						foreach ($accountData->agreements as $k => $agrm){
							if ($agrm->agrmid == $agrmid){
								//$r = $lanbilling->get("getVgroup", array("id" => $agrm->vgroups));
								$replaceArr = array(
									'%balance' => $agrm->balance,
									'%credit' => $agrm->credit,
									'%agrm' => $agrm->number
								);
							}
						}
					}else{
						$replaceArr = array(
							'%balance' => $accountData->agreements->balance,
							'%credit' => $accountData->agreements->credit,
							'%agrm' => $accountData->agreements->number
						);
					}
					$salesTpl = str_ireplace(array_keys($replaceArr),$replaceArr,$salesTpl);
				break;

			}
		}
	}
	$rArr['tpl'] = str_replace(array("\r\n","\n","\r"),'^',$salesTpl);
	if(sizeof($rArr) > 0) {
		echo '({ success: true, results: ' . JEncode($rArr, $lanbilling) . '})';
	}
	else {
		echo '({ success: true, results: ""})';
	}
}

/**
 * Получение значения дополнительных полей оператора "dop_pole_oper" для пользователя.
 * Входной параметр: номер договора абонента.
 * @param $agrmid
 * @param $field
 */
function getOperAddon($agrmid,$field) {
	global $lanbilling;
	if (!$agrmid) return 0;

	$r = $lanbilling->get("getAgreements", array("flt"=>array("agrmid" => $agrmid)));
	$obj = $lanbilling->get("getAccount", array("id" => $r->operid));
	if(isset($obj->agreements) && !empty($obj->agreements)) {
		foreach($obj->agreements as $i => $agrm) {
			if ($i == 'addons'){
				foreach($agrm as $k => $addonField){
					if ($addonField->name == $field){
						return $addonField->strvalue;
					}
				}
			}
		}
	}
	return 0;
}
/**
 * get account details for KKM
 */
function getAccountDetail($agrmid) {
	global $lanbilling;
	$return = array();
	$r = $lanbilling->get("getAgreements", array("flt"=>array("agrmid" => $agrmid)));
	return $lanbilling->get("getAccount", array("id" => $r->uid));
} // end getAccountDetail()

/**
 * Common billing settings
 * @param	object, billing class
 * @param	object, template class
 */
function showCommonSettings( &$lanbilling, &$tpl )
{
	$tpl->touchBlock("Common_Set");

	if(!isset($_POST['default_physical']))
	{
		$results = $lanbilling->get("getOptions");
		$tpls = 0;
		foreach($results as $obj)
		{	
			switch($obj->name)
			{
				case "default_physical": $_POST['default_physical'] = $obj->value; break;
				case "default_legal": $_POST['default_legal'] = $obj->value; break;
				case "default_operator": $_POST['default_operator'] = $obj->value; break;
                case "default_country": $_POST['default_country'] = $obj->value; break;
				case "templates_dir": $_POST['templates_dir'] = $obj->value; break;
				case "default_discount_method": $_POST['default_discount_method'] = $obj->value; break;
				case "change_usertype": $_POST['change_usertype'] = $obj->value; break;
                case "disable_change_user_agreement": $_POST['disable_change_user_agreement'] = $obj->value; break;
				case "user_viewpayed": $_POST['user_viewpayed'] = $obj->value; break;
				case "user_gendoc": $_POST['user_gendoc'] = $obj->value; break;
				case "user_pass_symb": $_POST['user_pass_symb'] = $obj->value; break;
				case "acc_pass_symb": $_POST['acc_pass_symb'] = $obj->value; break;
				case "generate_pass": $_POST['generate_pass'] = $obj->value; break;
				case "pass_length": $_POST['pass_length'] = $obj->value; break;
				case "pass_numbers": $_POST['pass_numbers'] = $obj->value; break;
				case "payment_format": $_POST['payment_format'] = $obj->value; break;
				case "auto_transfer_payment": $_POST['auto_transfer_payment'] = $obj->value; break; // from x015
                case "pay_import": $_POST['pay_import'] = $obj->value; break;
				case "payment_script_path": $_POST['payment_script_path'] = $obj->value; break;
				case "tax_value": $_POST['tax_value'] = $obj->value; break;
				case "wrong_active": $_POST['wrong_active'] = $obj->value; break;
				case "pay_import_delim": $_POST['pay_import_delim'] = $obj->value; break;
				case "session_lifetime": $_POST['session_lifetime'] = $obj->value; break;
				case "export_character": $_POST['export_character'] = $obj->value; break;
				case "autoload_accounts": $_POST['autoload_accounts'] = $obj->value; break;
				case "payments_cash_now": $_POST['payments_cash_now'] = $obj->value; break;
				case "reset_ord_numbers": $_POST['reset_ord_numbers'] = $obj->value; break;
				case "print_sales_ocur": $_POST['print_sales_ocur'] = $obj->value; break;
				case "print_sales_ocfiz": $_POST['print_sales_ocfiz'] = $obj->value; break;
				case "print_sales_template": $_POST['print_sales_template'] = $obj->value; break;
				case "print_sales_mebius": $_POST['print_sales_mebius'] = $obj->value; break;
				case "cyberplat_common_agreement": $_POST['cyberplat_common_agreement'] = $obj->value; break;
				case "cyberplat_agreement_regexp": $_POST['cyberplat_agreement_regexp'] = $obj->value; break;
				case "zkh_configuration": $_POST['zkh_configuration'] = $obj->value; break;
                case "bring_friend_script": $_POST['bring_friend_script'] = $obj->value; break;
				case "user_mobile_format": $_POST['user_mobile_format'] = $obj->value; break;
                case "smartcard_usbox_tag": $_POST['smartcard_usbox_tag'] = $obj->value; break;
                case "smartcard_eqip_max": $_POST['smartcard_eqip_max'] = $obj->value; break;
                case "usbox_eqip_min": $_POST['usbox_eqip_min'] = $obj->value; break;
                case "use_vgroup_activation_period": $_POST['use_vgroup_activation_period'] = $obj->value; break;
                case "crm_email_subject": $_POST['crm_email_subject'] = $obj->value; break;
                case "antivirus_promo_period": $_POST['antivirus_promo_period'] = $obj->value; break;
                case "antivirus_activation_period": $_POST['antivirus_activation_period'] = $obj->value; break;
                case "antivirus_notify_activation_expire": $_POST['antivirus_notify_activation_expire'] = $obj->value; break;
                case "uprs_common_agreement": $_POST['uprs_common_agreement'] = $obj->value; break;
			}

			if(false !== strpos($obj->name, "agrmnum_template_"))
			{
				$_POST["agrmANum"][$tpls][0] = $obj->descr;
				$_POST["agrmANum"][$tpls][1] = $obj->value;
				$tpls++;
			}
		}
	}
	
	if(isset($_POST["dropAgrmANum"]) && $_POST["dropAgrmANum"] != "")
		unset($_POST["agrmANum"][$_POST["dropAgrmANum"]]);

	if(isset($_POST["newAgrmANum"]))
	{
		$arr_lng = sizeof($_POST["agrmANum"]);
		$_POST["agrmANum"][$arr_lng][0] = "";
		$_POST["agrmANum"][$arr_lng][1] = "";
	}

    if ($lanbilling->getAccess('optionscommon') < 2){
        $tpl->setVariable("CANDEL_ANUM", 'disabled="disabled"');
        $tpl->setVariable("ADDIMG", 'dot.gif');
    }else{
        $tpl->setVariable("CANDEL_ANUM", '');
        $tpl->setVariable("ADDIMG", 'ext-add.gif');
    }

	if(sizeof($_POST["agrmANum"]) > 0)
	{
        sort($_POST["agrmANum"]);
		
		foreach($_POST["agrmANum"] as $_index => $_arr)
		{
			$_arr[1] = str_replace("{","&#123;", $_arr[1]);
			$_arr[1] = str_replace("}","&#125;", $_arr[1]);
			$tpl->setCurrentBlock("Template_Agrm");
			$tpl->setVariable("TEMPLINDEX", sprintf("%d", $_index));
			$tpl->setVariable("TEMPLDESCR", $_arr[0]);
			$tpl->setVariable("TEMPLVALUE", $_arr[1]);

            if ($lanbilling->getAccess('optionscommon') < 2){
                $tpl->setVariable("DELIMG", 'delete_grey.gif');
            }else{
                $tpl->setVariable("DELIMG", 'delete.gif');
            }
			$tpl->parseCurrentBlock();
		}
	}
    if ($lanbilling->getAccess('optionscommon') < 2)
        $tpl->setVariable("CANDEL_ANUM", 'disabled="disabled"');
    else
        $tpl->setVariable("CANDEL_ANUM", '');

	if($_POST['default_discount_method'] == 0) $tpl->touchBlock("matrix_sum");
	if($_POST['change_usertype'] == 1) $tpl->touchBlock("ChgUT");
    if($_POST['disable_change_user_agreement'] == 1) $tpl->touchBlock("ChgUA");
	if($_POST['user_viewpayed'] == 1) $tpl->touchBlock("UserPD");
	if($_POST['user_gendoc'] == 1) $tpl->touchBlock("UserGD");
	if($_POST['generate_pass'] == 1) $tpl->touchBlock("GenPass");
	if($_POST['pass_numbers'] == 1) $tpl->touchBlock("PassNum");
    if($_POST['auto_transfer_payment'] == 1) $tpl->touchBlock("AutoTransfer"); // X015



	# && is_numeric($_POST['pay_import_delim']) && !preg_match('~^\d*$~is',$_POST['pay_import_delim']) && isset($_POST['default_physical'])
	//if (!isset($_POST['save']) ){
		//$DELIM = htmlspecialchars($lanbilling->stripMagicQuotes(htmlEntRepl($_POST['pay_import_delim']), ENT_QUOTES, 'UTF-8'));
	//}else{
		$DELIM = htmlspecialchars($lanbilling->stripMagicQuotes($_POST['pay_import_delim'], ENT_QUOTES, 'UTF-8'));
	//}



	// Convert special symbols to html code
	$_POST['user_pass_symb'] = htmlspecialchars($lanbilling->stripMagicQuotes($_POST['user_pass_symb']), ENT_QUOTES, 'UTF-8');
	$_POST['user_pass_symb'] = str_replace("{","&#123;", $_POST['user_pass_symb']);
	$_POST['user_pass_symb'] = str_replace("}","&#125;", $_POST['user_pass_symb']);
	$_POST['acc_pass_symb'] = htmlspecialchars($lanbilling->stripMagicQuotes($_POST['acc_pass_symb']), ENT_QUOTES, 'UTF-8');
	$_POST['acc_pass_symb'] = str_replace("{","&#123;", $_POST['acc_pass_symb']);
	$_POST['acc_pass_symb'] = str_replace("}","&#125;", $_POST['acc_pass_symb']);

	$tpl->setVariable("TEMPLATESDIR", $lanbilling->stripMagicQuotes($_POST['templates_dir']));
	$tpl->setVariable("WRONGACTIVE", ((integer)$_POST['wrong_active'] <= 0) ? 10 : $_POST['wrong_active']);

	$tpl->setVariable("IMPORTDELIMITER", $DELIM);

	$tpl->setVariable("SESSIONLIFETIME", (integer)$_POST['session_lifetime']);
	$tpl->setVariable("USERPASSSYMB", $_POST['user_pass_symb']);
	$tpl->setVariable("ACCPASSSYMB", $_POST['acc_pass_symb']);
	$tpl->setVariable("PASSLEN", ((integer)$_POST['pass_length'] < 1) ? 4 : $_POST['pass_length']);
	$tpl->setVariable("PAYMENTFORMAT", $_POST['payment_format']);
	$tpl->setVariable("PAYIMPORT", $_POST['pay_import']);
	$tpl->setVariable("PAYSCRIPT", $_POST['payment_script_path']);
	$tpl->setVariable("TAXVALUE", (integer)$_POST['tax_value']);

	// Operators
	$O = $lanbilling->getOperators();
	foreach($O as $item)
	{
		$tpl->setCurrentBlock('operOpt');
		$tpl->setVariable('THISOP_ID', $item['uid']);
		$tpl->setVariable('THISOP_NAME', $item['name']);
		if((integer)$_POST['default_operator'] == $item['uid']) {
			$tpl->touchBlock('operOptSel');
		}
		$tpl->parseCurrentBlock();
	}


    $countries = $lanbilling->get("getDictOksm");
    $countries = (is_array($countries)) ? $countries : array($countries);
	foreach($countries as $c_item)
	{
		$tpl->setCurrentBlock('countryOpt');
		$tpl->setVariable('THISCOUNTRY_ID', $c_item->recordid);
		$tpl->setVariable('THISCOUNTRY_NAME', $c_item->name);
		if((integer)$_POST['default_country'] == $c_item->recordid) {
			$tpl->touchBlock('countryOptSel');
		}
		$tpl->parseCurrentBlock();
	}

	// Avaliable documents
	$docs = getDocumntsList($lanbilling);
	foreach($docs as $key => $val)
	{
		$tpl->setCurrentBlock("defPhysOpt");
		if($_POST['default_physical'] == $key) $tpl->touchBlock("defPhysSel");
		$tpl->setVariable("DEFPHYZID", $key);
		$tpl->setVariable("DEFPHYZNAME", $val);
		$tpl->parseCurrentBlock();

		$tpl->setCurrentBlock("defLegalOpt");
		if($_POST['default_legal'] == $key) $tpl->touchBlock("defLegalSel");
		$tpl->setVariable("DEFLEGID", $key);
		$tpl->setVariable("DEFLEGNAME", $val);
		$tpl->parseCurrentBlock();
	}

	// Statistics charset
	$tpl->touchBlock('ExportStat_' . $_POST['export_character']);

	if ($_POST['cyberplat_common_agreement']){
		$cyberplat_common_agreement =  ( FALSE != $cybAgrmData = $lanbilling->get("getAgreements", array("flt"=>array("agrmid" => $_POST['cyberplat_common_agreement'])))) ? $cyberplat_common_agreement = $cybAgrmData->number : '';
	}
	
    $_POST['cyberplat_agreement_regexp'] = htmlspecialchars($lanbilling->stripMagicQuotes($_POST['cyberplat_agreement_regexp']), ENT_QUOTES, 'UTF-8');
	$_POST['cyberplat_agreement_regexp'] = str_replace("{","&#123;", $_POST['cyberplat_agreement_regexp']);
	$_POST['cyberplat_agreement_regexp'] = str_replace("}","&#125;", $_POST['cyberplat_agreement_regexp']);


	$tpl->setVariable("CYBCOMMAGRMID", empty($_POST['cyberplat_common_agreement']) ? '' : $_POST['cyberplat_common_agreement']);
	$tpl->setVariable("CYBCOMMAGRMNAME", empty($cyberplat_common_agreement) ? 'Undefined' : $cyberplat_common_agreement);
	$tpl->setVariable("CYBAGRMREGEXP", empty($_POST['cyberplat_agreement_regexp']) ? '' : $_POST['cyberplat_agreement_regexp']);

	if($_POST['autoload_accounts'] == 1) {
		$tpl->touchBlock('autoAccounts');
	}

	if($_POST['payments_cash_now'] == 1) {
		$tpl->touchBlock('paymentsCahsNow');
	}
	
	if ($_POST['uprs_common_agreement']){
		$uprs_common_agreement =  ( FALSE != $uprsAgrmData = $lanbilling->get("getAgreements", array("flt"=>array("agrmid" => $_POST['uprs_common_agreement'])))) ? $uprs_common_agreement = $uprsAgrmData->number : '';
	}
	$tpl->setVariable("UPRSCOMMONAGRMNAME", empty($uprs_common_agreement) ? 'Undefined' : $uprs_common_agreement);
	$tpl->setVariable("UPRSCOMMONAGRM", empty($_POST['uprs_common_agreement']) ? '' : $_POST['uprs_common_agreement']);

	// Start numbering documents with "1" from the beginning of the year
	if($_POST['reset_ord_numbers'] == 1) {
		$tpl->touchBlock('resetOrdNumbers');
	}

	// Print sails chek params
	if($_POST['print_sales_mebius'] == 1) {
		$tpl->touchBlock("printSalesMebius");
	}

	if($_POST['zkh_configuration']) {
		$tpl->touchBlock('zkhConfiguration');
	}

	if($_POST['use_vgroup_activation_period']) {
		$tpl->touchBlock('useVgroupActivationPeriod');
	}
	
    $_POST['user_mobile_format'] = htmlspecialchars($lanbilling->stripMagicQuotes($_POST['user_mobile_format']), ENT_QUOTES, 'UTF-8');
	$_POST['user_mobile_format'] = str_replace("{","&#123;", $_POST['user_mobile_format']);
	$_POST['user_mobile_format'] = str_replace("}","&#125;", $_POST['user_mobile_format']);
	

    $tpl->setVariable("BRINGFRIENDSCRIPT", empty($_POST['bring_friend_script']) ? '' : $_POST['bring_friend_script']);
	$tpl->setVariable("PFORMAT", empty($_POST['user_mobile_format']) ? '' : $_POST['user_mobile_format']);
	$tpl->setVariable("PAYMENTKUR",    empty($_POST['print_sales_ocur'])     ? '' : $_POST['print_sales_ocur']);
	$tpl->setVariable("PAYMENTKFIZ",   empty($_POST['print_sales_ocfiz'])    ? '' : $_POST['print_sales_ocfiz']);
	$tpl->setVariable("SAILSTEMPLATE", empty($_POST['print_sales_template']) ? '' : $_POST['print_sales_template']);

    $tpl->setVariable("SMCARDUSBOXTAG", $_POST['smartcard_usbox_tag']);
    $tpl->setVariable("SMEQUIPMAX", empty($_POST['smartcard_eqip_max']) ? '' : $_POST['smartcard_eqip_max']);
    $tpl->setVariable("SMEQUIPMINUSBOX", empty($_POST['usbox_eqip_min']) ? '' : $_POST['usbox_eqip_min']);

    $tpl->setVariable("USE_VGROUP_ACTIVATION_PERIOD", empty($_POST['use_vgroup_activation_period']) ? '' : $_POST['use_vgroup_activation_period']);
    $tpl->setVariable("CRM_EMAIL_SUBJECT", empty($_POST['crm_email_subject']) ? '' : $_POST['crm_email_subject']);

    $tpl->setVariable("ANTIVIRUS_PROMO_PERIOD", empty($_POST['antivirus_promo_period']) ? '' : $_POST['antivirus_promo_period']);
    $tpl->setVariable("ANTIVIRUS_ACTIVATION_PERIOD", empty($_POST['antivirus_activation_period']) ? '' : $_POST['antivirus_activation_period']);
    $tpl->setVariable("ANTIVIRUS_NOTIFY_ACTIVATION_EXPIRE", empty($_POST['antivirus_notify_activation_expire']) ? '' : $_POST['antivirus_notify_activation_expire']);
} // end showCommonSettings()


/**
 * Common billing settings
 * @param	object, billing class
 * @param	object, template class
 */
function showStorageSettings( &$lanbilling, &$tpl )
{
	$tpl->touchBlock("Store_Set");

	if(!isset($_POST['day']))
	{
		$results = $lanbilling->get("getOptions");
		foreach($results as $obj)
		{
			if(empty($obj->value))
				$value = "<%@ always %>";
			else $value = $obj->value;

			switch($obj->name)
			{
				case "day": $_POST['day'] = $value; break;
				case "month": $_POST['month'] = $value; break;
				case "vg_blocks": $_POST['vg_blocks'] = $value; break;
				case "eventlog": $_POST['eventlog'] = $value; break;
				case "balances": $_POST['balances'] = $value; break;
				case "bills": $_POST['bills'] = $value; break;
				case "orders": $_POST['orders'] = $value; break;
				case "rentcharge": $_POST['rentcharge'] = $value; break;
				case "pay_cards": $_POST['pay_cards'] = $value; break;
				case "auth_history": $_POST['auth_history'] = $value; break;
			}
		}
	}

	$tpl->setVariable("DAY", $_POST['day']);
	$tpl->setVariable("MONTH", $_POST['month']);
	$tpl->setVariable("VGBLOCKS", $_POST['vg_blocks']);
	$tpl->setVariable("EVENTLOG", $_POST['eventlog']);
	$tpl->setVariable("BALANCES", $_POST['balances']);
	$tpl->setVariable("BILLS", $_POST['bills']);
	$tpl->setVariable("ORDERS", $_POST['orders']);
	$tpl->setVariable("RENTCHARGE", $_POST['rentcharge']);
	$tpl->setVariable("PAYCARDS", $_POST['pay_cards']);
	$tpl->setVariable("AUTHHISTORY", $_POST['auth_history']);
} // end showStorageSettings()



/**
 * Billing system activation form
 * @param	object, billing class
 * @param	object, template class
 */
function showActivation( &$lanbilling, &$tpl )
{
	if($lanbilling->manager != 0)
	{
		$tpl->touchBlock("notGranted");
		return false;
	}

	$tpl->touchBlock("ActivationForm");

	$result = (object)$lanbilling->getLicenseFlag('all');
	
	$O = $lanbilling->getOperators(null, true);
	$tpl->setVariable("DEF_OPER_NAME", $O["name"]);
	if(empty($result->cdkey))
	{
		$tpl->touchBlock('defOperAtt');

		if(empty($O)) {
			$tpl->touchBlock('defOperError');
		}

		$tpl->touchBlock("KeyStart");
		$tpl->touchBlock("KeyCancel");
		$tpl->touchBlock("A1");
		$tpl->touchBlock("A3");
		$tpl->touchBlock("A5");
		$tpl->setVariable("ISACTIVATED", 0);
		$tpl->setVariable("PROGOWNER", $O['name']);
		
	}
	else
	{
		$tpl->touchBlock("KeySend");
		$tpl->touchBlock("KeyCancel");
		$tpl->touchBlock("A2");
		$tpl->touchBlock("A4");
		$tpl->touchBlock("A6");
		$tpl->touchBlock("A8");
		

		$tpl->setVariable("ISACTIVATED", 1);
		$tpl->setVariable("VERSION", $result->progname);
		$tpl->setVariable("PROGOWNER", htmlspecialchars($result->progowner, ENT_QUOTES, 'UTF-8'));
		$tpl->setVariable("CDKEYFULL", $result->cdkey); 
		

		$cdparts = explode("-", $result->cdkey);
		for($i = 0; $i < 5; $i++)
			$tpl->setVariable("KEY" . $i, $cdparts[$i]);

		$tpl->setCurrentBlock("LiOptions");
		
		$tillDate = (int)$result->expire - ceil((time() - strtotime($result->gendate)) / 86400);
		
		$tpl->setVariable("GENDATE", $result->gendate);
		$tpl->setVariable("TILLDATE", $tillDate);
		$tpl->setVariable("PLSERV", ((integer)$result->usbox > 0) ? "in use" : "not in use");
		$tpl->setVariable("PLTEL", ((integer)$result->phone > 0) ? "in use" : "not in use");
		$tpl->setVariable("PLINT", ((integer)$result->radius > 0) ? "in use" : "not in use");
		
		$tpl->setVariable("EXPIRE", $result->expire);
		$tpl->setVariable("USERLIMIT", $result->userlimit);
		$tpl->setVariable("USEOPER", ($result->useoperators == 1) ? "in use" : "not in use");
		$tpl->setVariable("FIDELIO", ($result->usefidelio == 1) ? "in use" : "not in use");
		$tpl->setVariable("MODULEEC", ($result->useec == 1) ? "in use" : "not in use");
		$tpl->setVariable("INVENTORY", ($result->useinventory == 1) ? "in use" : "not in use");
		$tpl->setVariable("AVDESK", ($result->useavdesk == 1) ? "in use" : "not in use");
		$tpl->setVariable("CERBERC", ($result->usecerber == 1) ? "in use" : "not in use");
		$tpl->setVariable("PAYSYSTEMS", ((integer)$result->payments > 0) ? "in use" : "not in use");

		if((integer)$result->payments > 0) {
			$tpl->setCurrentBlock('ifPayExtCount');
			$tpl->setVariable("PCOUNT", (integer)$result->payments);
			$tpl->parseCurrentBlock();
		}

		$tpl->parseCurrentBlock();
	}

	if(defined("GETLISENCE") && GETLISENCE == false)
	{
		if(defined("WRONGKEY") && WRONGKEY == true)
			$tpl->touchBlock("KeyFormatError");
		else
			$tpl->touchBlock("LisenceError");
	}
} // end


/**
 * Send activation key, get license
 * @param	object, billing class
 */
function sendLicense( &$lanbilling )
{
	$struct = array("cdkey" => '', "progowner" => '', "progname" => '', "gendate" => '',
			"expire" => 0, "useoperators" => 0, "usefidelio" => 0, "useec" => 0, "useinventory" => 0, "userlimit" => 0);

	$struct["progowner"] = $lanbilling->stripMagicQuotes($_POST['liccomp']);
	$struct["cdkey"] = $_POST['keyfull'];
	
	if( strlen($_POST['keyfull']) !=24){
		define("WRONGKEY", true); 
	}
	else{
		define("WRONGKEY", false);
		$keys = split ("-", $_POST['keyfull']);
		if(count($keys)!=5) 
			define("WRONGKEY", true);
		else {
			foreach ($keys as $key) {
				if(strlen($key)!=4)
					define("WRONGKEY", true);
			}
		}
	}
	
	if(defined("WRONGKEY") && WRONGKEY == true)
	{
		define("GETLISENCE", false);
	}
	else 
	{
		try {
			$result = $lanbilling->save("updLicense", $struct, false, array("getLicense"));
		} catch(Exception $e) { define("GETLISENCE", false); return false; }
	
		if(!$lanbilling->saveReturns->ret) define("GETLISENCE", false);
		else define("GETLISENCE", true);
	}
	
	
} // end sendLicense()


/**
 * Save settings to DB
 * @param	object, billing class
 */
function saveSettings( &$lanbilling, &$localize )
{
	switch($_POST['submenu'])
	{
		case 0:
			// Allowed post variable to save
			$post = array(
				"default_operator",
                "default_country",
				"default_physical",
				"default_legal",
				"templates_dir",
				"default_discount_method",
				"user_gendoc",
				"change_usertype",
				"disable_change_user_agreement",
				"user_viewpayed",
				"user_viewpayed",
				"user_pass_symb",
				"acc_pass_symb",
				"generate_pass",
				"pass_length",
				"pass_numbers",
				"payment_format",
				"auto_transfer_payment", // x015
                "pay_import",
				"payment_script_path",
				"tax_value",
				"wrong_active",
				"session_lifetime",
				"export_character",
				"autoload_accounts",
				"payments_cash_now",
				"reset_ord_numbers",
				"print_sales_ocur",
				"print_sales_ocfiz",
				"print_sales_template",
				"print_sales_mebius",
				"cyberplat_agreement_regexp",
				"cyberplat_common_agreement",
				"zkh_configuration",
				'bring_friend_script',
				'user_mobile_format',
				"smartcard_usbox_tag",
				"smartcard_eqip_max",
				"usbox_eqip_min",
				"use_vgroup_activation_period",
				"crm_email_subject",
				"antivirus_promo_period",
				"antivirus_activation_period",
				"antivirus_notify_activation_expire",
				"uprs_common_agreement"
			);

			$settings = array();
			foreach($post as $postkey)
				$settings[] = array("name" => $postkey, "descr" => "", "value" => $_POST[$postkey]);

			//if(isset($_POST['pay_import_delim']) && sizeof($_POST['pay_import_delim']) > 0){
				$settings[] = array("name" => 'pay_import_delim', "descr" => "", "value" => /*htmlEntRepl(*/$_POST['pay_import_delim']/*,true)*/);
			//}

			if(isset($_POST['agrmANum']) && sizeof($_POST['agrmANum']) > 0)
			{
				foreach($_POST['agrmANum'] as $key => $val)
					$settings[] = array("name" => "agrmnum_template_" . $key, "descr" => $val[0], "value" => $val[1]);
			}

			$lanbilling->save("delAgrmTemplates");

			// Remove payments class if there is list
			deletePayClasses($lanbilling, $localize, true);

			// Save payments classes list
			savePayClasses($lanbilling, $localize, true);
		break;

		case 1:
			$post = array("day", "month", "vg_blocks", "eventlog", "balances", "bills", "orders", "rentcharge", "pay_cards", "auth_history");

			$settings = array();
			foreach($post as $postkey)
				$settings[] = array("name" => $postkey, "descr" => "", "value" => (integer)$_POST[$postkey]);
		break;
	}

	if( checkCerberIsUsed($lanbilling) && $_POST['submenu'] == 3 ) {
		$post = array("cerber_host", "cerber_login", "cerber_pass", "cerber_port", "cerber_subscribers_amount");
		$settings = array();
			foreach($post as $postkey) {
				$settings[] = array("name" => $postkey, "descr" => "", "value" => $_POST[$postkey]);
			}
		$use = ( isset($_POST["use_cerbercrypt"]) == true ) ? 1 : 0;
		$settings[] = array("name" => "use_cerbercrypt", "descr" => "", "value" => $use);
	}

	$lanbilling->save("updOptions", array('arr' => $settings), false, array("getOptions", "getAccounts"));
} // end saveSettings()


/**
 * Documents list
 * @param	object, billing class
 */
function getDocumntsList( &$lanbilling )
{
	if( false == ($sql_query = mysql_query("SELECT doc_id, name FROM documents WHERE payable = 2 AND onfly = 0", $lanbilling->descriptor)) )
	{
		$lanbilling->ErrorHandler(__FILE__, "Can't get documents list: " . mysql_error($lanbilling->descriptor), __LINE__);
		return array();
	}

	$docs = array();
	while($row = mysql_fetch_row($sql_query))
		$docs[$row[0]] = $row[1];

	return $docs;
} // end getDocumntsList()

/**
 * Check if CerberCrypt is used
 * @param	object, billing class
 */
function checkCerberIsUsed(&$lanbilling)
{
	if( $lanbilling->getLicenseFlag('usecerber') == 1) {
		return true;
	}
	else {
		return false;
	}
}

/**
 * Show CerberCrypt Settings tab
 * @param	object, billing class
 */
function showCerberSettings(&$lanbilling, &$tpl)
{
	$result = $lanbilling->get("getOptions");
	foreach($result as $obj) {
		switch($obj->name) {
			case "use_cerbercrypt": if( $obj->value == 1) $tpl->touchBlock("UseCerber"); break;
			case "cerber_host": $tpl->setVariable("CERBERHOST", $obj->value); break;
			case "cerber_login": $tpl->setVariable("CERBERLOGIN", $obj->value); break;
			case "cerber_pass": $tpl->setVariable("CERBERPASS", $obj->value); break;
			case "cerber_port": $tpl->setVariable("CERBERPORT", $obj->value); break;
			case "cerber_subscribers_amount": $tpl->setVariable("CERBERCARDSAMOUNT", $obj->value); break;
		}
	}

} // end showCerberSettings()


/**
 * get payments classes list to view and edit
 * @param	object, billing class
 * @param	object, localize class
 */
function getPayClass( &$lanbilling, &$localize )
{
	$_tmp = array();

	if( false == ($result = $lanbilling->get("getPayClasses")) ) {
		echo "({ success: false })";
		return false;
	}

	if(!is_array($result)) {
		$result = array($result);
	}

	array_walk($result, create_function('$item, $key, $_tmp', '$_tmp[0][] = array(
			"classid" => $item->classid,
			"classname" => $item->name,
			"descr" => $item->descr,
            "externcode" => $item->externcode
		);'), array( &$_tmp ));

	if(sizeof($_tmp) > 0) {
		echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
	}
	else {
		echo '({ "results": "" })';
	}
} // end getPayClass()


/**
 * Save payments classes sned from form
 * @param	object, billint class
 * @param	object, localize class
 */
function savePayClasses( &$lanbilling, &$localize, $silent = false )
{
	if(isset($_POST['setpclass']) && !empty($_POST['setpclass'])) {
		$_withError = array();

		foreach($_POST['setpclass'] as $item) {
			if( false == $lanbilling->save("insupdPayClass", array(
					"classid" => (integer)$item['classid'],
					"name" => $item['classname'],
					"descr" => $item['descr'],
                    "externcode" => $item['externcode']
				),
				(($item['classid'] < 0) ? true : false), array("getPayClasses")))
			{
				$error = $lanbilling->soapLastError();
				$_withError[] = array($item, $item, $localize->get($error->detail));
			}
		}

		if(empty($_withError)) {
			if(!$silent) {
				 echo "({ success: true })";
			}
			return true;
		}
		else {
			if(!$silent) {
				echo "({ success: false, errors: { reason: " . JEncode($_withError, $lanbilling) . " } })";
			}
			return false;
		}
	}
	else {
		if(!$silent) {
			echo "({ success: true })";
		}
		return true;
	}
} // end savePayClasses()


/**
 * Save payments classes sned from form
 * @param	object, billint class
 * @param	object, localize class
 */
function deletePayClasses( &$lanbilling, &$localize, $silent = false )
{
	if(isset($_POST['delpclass']) && !empty($_POST['delpclass'])) {
		$_withError = array();

		foreach($_POST['delpclass'] as $item) {
			if( false == $lanbilling->delete("delPayClass", array(
					"id" => (integer)$item
				),
				array("getPayClasses")))
			{
				$error = $lanbilling->soapLastError();
				$_withError[] = array($item, $item, $localize->get($error->detail));
			}
		}

		if(empty($_withError)) {
			if(!$silent) {
				 echo "({ success: true })";
			}
			return true;
		}
		else {
			if(!$silent) {
				echo "({ success: false, errors: { reason: " . JEncode($_withError, $lanbilling) . " } })";
			}
			return false;
		}
	}
	else {
		if(!$silent) {
			echo "({ success: true })";
		}
		return true;
	}
} // end deletePayClasses()

function closePeriod ( &$lanbilling, &$localize) {
    
    $closedate = strtotime($_POST['closeyear'] . '-' . $_POST['closemonth'] . '-01');
    $closedate = date("Y-m-d", strtotime("+1 month", $closedate));
    $struct = array (
        'date' => $closedate
    );  

    if( false == $lanbilling->delete("setOpenPeriodBeginDate", $struct)){
        $message = $lanbilling->soapLastError()->detail;
        
        if (strstr((string)$message, 'Invalid date value')) {
            $message = 'Invalid date value';
        }
        if (strstr((string)$message, 'negative sales are found')) {
            $message = 'Negative sales are found';
        }
        if (strstr((string)$message, 'Current, requested and available values')) {
            try {
                preg_match(
                    "/You can`t close the period. Current, requested and available values are [0-9]{4}-[0-9]{2}-[0-9]{2}, [0-9]{4}-[0-9]{2}-[0-9]{2}, ([0-9]{4}-[0-9]{2}-[0-9]{2}), ([0-9]{4}-[0-9]{2}-[0-9]{2})/",
                    $message,
                    $dates
                );
                $months = array(1 => "January", 2 => "February", 3 => "March", 4 => "April", 5 => "May", 6 => "June", 7 => "July", 8 => "August", 9 => "September", 10 => "October", 11 => "November", 12 => "December");
                $datesLocalized = array();
                foreach ( array($closedate, $lanbilling->Option("lock_period"), $dates[1], $dates[2]) as $date ) {
                    if (!$date) {
                        throw new Exception;
                    }
                    $date = explode("-", date("Y-m", strtotime("-1 month", strtotime($date))));
                    $year = $date[0];
                    $month = $localize->get($months[(int) $date[1]]);
                    $datesLocalized[] = "$month $year";
                }
                $message = sprintf(
                    $localize->get(
                        "Unable to close period %s. Current closed period is %s, available values are %s и %s"
                    ),
                    "\"$datesLocalized[0]\"",
                    "\"$datesLocalized[1]\"",
                    "\"$datesLocalized[2]\"",
                    "\"$datesLocalized[3]\""
                );
            } catch (Exception $e) {
                $message = str_replace("You can`t close the period. Current, requested and available values are", "", $message);
                $message = $localize->get('Unable to close period on this date. Available date values') . ': ' . $message;
            }
        }
        echo json_encode(array("success" => false, "errors" => array("reason" => html_entity_decode($message))));
        return false;
    }
    
    echo "({ success: true })";
	
	
} // end closePeriod()

function getClosedDate ( &$lanbilling, &$localize) {
		
	$results = $lanbilling->get("getOptions");
	foreach($results as $obj){
	 	if($obj->name == "lock_period") {
			echo "({ success: true, result: '" . $obj->value . "' })";
			return;
		}
	}
	echo "({ success: false, error: 'Enable to find close period value'})";
	
} // end getClosedDate()
