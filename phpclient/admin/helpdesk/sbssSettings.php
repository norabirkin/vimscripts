<?php
/**
 * SBSS and CRM system settings interface
 *
 */

include_once("sbssSettings.class.php");

$tpl = new HTML_Template_IT(TPLS_PATH);
$tpl->loadTemplatefile("sbssSettings.tpl",true,true);
$tpl->syncBlockLocalize();
// Create SBSS settings class
$sbss = new sbssSettings($lanbilling->descriptor);

// SubMenu creation
if(!isset($_POST["submenu"]) || $_POST["submenu"] == 0)
{
	$_POST["submenu"] = 0;
	$tpl->setCurrentBlock("SelectedMenu");
	$tpl->setVariable("CLASS", "x-tab-strip-active");
	$tpl->setVariable("WIDTHVALUE", "16%");
	$tpl->setVariable("SUBMENUSUBMIT", "0");
	$tpl->setVariable("MENUNAME", COMMONOPTIONS);
	$tpl->parseCurrentBlock();
}
else
{
	$tpl->setCurrentBlock("UnSelectedMenu");
	$tpl->setVariable("WIDTHVALUE", "16%");
	$tpl->setVariable("SUBMENUSUBMIT", "0");
	$tpl->setVariable("MENUNAME", COMMONOPTIONS);
	$tpl->parseCurrentBlock();
}
$tpl->parse("subMenu");

if($_POST["submenu"] == 1)
{
	$tpl->setCurrentBlock("SelectedMenu");
	$tpl->setVariable("WIDTHVALUE", "31%");
	$tpl->setVariable("CLASS", "x-tab-strip-active");
	$tpl->setVariable("SUBMENUSUBMIT", "1");
	$tpl->setVariable("MENUNAME", EMAIL_MODULE_OPTIONS);
	$tpl->parseCurrentBlock();
}
else
{
	$tpl->setCurrentBlock("UnSelectedMenu");
	$tpl->setVariable("WIDTHVALUE", "31%");
	$tpl->setVariable("SUBMENUSUBMIT", "1");
	$tpl->setVariable("MENUNAME", EMAIL_MODULE_OPTIONS);
	$tpl->parseCurrentBlock();
}
$tpl->parse("subMenu");

if($_POST["submenu"] == 2)
{
	$tpl->setCurrentBlock("SelectedMenu");
	$tpl->setVariable("WIDTHVALUE", "29%");
	$tpl->setVariable("CLASS", "x-tab-strip-active");
	$tpl->setVariable("SUBMENUSUBMIT", "2");
	$tpl->setVariable("MENUNAME", '<%@ E-mail template to send document %>');
	$tpl->parseCurrentBlock();
}
else
{
	$tpl->setCurrentBlock("UnSelectedMenu");
	$tpl->setVariable("WIDTHVALUE", "29%");
	$tpl->setVariable("SUBMENUSUBMIT", "2");
	$tpl->setVariable("MENUNAME", '<%@ E-mail template to send document %>');
	$tpl->parseCurrentBlock();
}
$tpl->parse("subMenu");
$tpl->touchBlock("menuFreeSpace");
$tpl->setVariable("SUBMENU", $_POST["submenu"]);

// Main blocks according to submenu selection
if(!isset($_POST["submenu"]) || $_POST["submenu"] == 0)
{
	if(isset($_POST["save"]))
	{
		prepareCommOptions($sbss);
		prepareReplyClasses($sbss);
		prepareClientClasses($sbss);
		prepareStatusClasses($sbss);
		
		// Start saving
		$sbss->saveOptions($sbss->commonSettings);
		$sbss->saveRequestClasses($sbss->requestClasses);
		$sbss->saveClientClasses($sbss->clientClasses);
		$sbss->saveStatusList($sbss->statusList);
		
		// Check permisions for the folder path
		if(!empty($sbss->commonSettings["sbss_crm_files"]) && !$sbss->folderPermitions($sbss->commonSettings["sbss_crm_files"]))
			$Errors[] = FOLDERERROR . ": '" . $sbss->commonSettings["sbss_crm_files"] . "'";
		
		if(!empty($sbss->commonSettings["sbss_ticket_files"]) && !$sbss->folderPermitions($sbss->commonSettings["sbss_ticket_files"]))
			$Errors[] = FOLDERERROR . ": '" . $sbss->commonSettings["sbss_ticket_files"] . "'";
	}
	else
	{
		$sbss->initCommonOptions();
		$sbss->initRequestClasses();
		$sbss->initClientClasses();
		$sbss->initStatusList();
	}
	
	if(sizeof($Errors) > 0) showErrors($tpl, $Errors);
	showCommon($tpl, $sbss);
}

if($_POST["submenu"] == 1)
{
	if(isset($_POST["save"]))
	{
		prepareEmailOptions($sbss);
		$sbss->saveOptions($sbss->emailCSettings);
	}
	else $sbss->initEmailCOptions();
	
	showEmailOptions($tpl, $sbss);
}

if($_POST["submenu"] == 2)
{
	if(isset($_POST["save"]))
	{
		$struct = array(
			array("name" => "sbss_subject", "descr" => "", "value" => $_POST['sbss_subject']),
			array("name" => "sbss_message", "descr" => "", "value" => $_POST['sbss_message'])
		);
		
		$lanbilling->save("updOptions", array('arr' => $struct), false, array("getOptions", "getAccounts"));
	}
	
	$results = $lanbilling->get("getOptions");
	$emptydata = true;
	foreach($results as $item) {
		switch($item->name) {
			case 'sbss_subject': $tpl->setVariable("SBSSMAILSUBJ", $item->value); $emptydata = false; break;
			case 'sbss_message': $tpl->setVariable("SBSSMAILTEXT", $item->value); $emptydata = false; break;
		}
	}
	
	if($emptydata) {
		$tpl->touchBlock('emailMessage');
	}
	else {
		$tpl->parse('emailMessage');
	}
}

$localize->compile($tpl->get(), true);


/**
 * This function draw error messages to html document if they exists
 * @param	object template class
 */
function showErrors( &$tpl, $Errors )
{
	foreach($Errors as $val)
	{
		$tpl->setCurrentBlock("Error");
		$tpl->setVariable("ERRORMESSAGE", $val);
		$tpl->parseCurrentBlock();
	}
	$tpl->parse("ErrorBlock");
} // end showErrors()

/**
 * Parse TPL block if common options requested
 * @param	object template
 */
function showCommon( &$tpl, &$sbss )
{
	$men = $sbss->initManagers();
	$tpl->setVariable("SBSSCFILES", $sbss->commonSettings["sbss_crm_files"]);
	$tpl->setVariable("SBSSTFILES", $sbss->commonSettings["sbss_ticket_files"]);
	
	foreach($men as $m_key => $m_val)
	{
		$tpl->setCurrentBlock("managersList");
		if($sbss->commonSettings["sbss_ticket_superviser"] == $m_key) $tpl->touchBlock("manSelected");
		$tpl->setVariable("MANID", $m_key);
		$tpl->setVariable("MANNAME", $m_val["name"]);
		$tpl->parseCurrentBlock();
		
		$tpl->setCurrentBlock("manReplDef");
		$tpl->setVariable("MANREPLDEF_ID", $m_key);
		$tpl->setVariable("MANREPLDEF_NAME", $m_val["name"]);
		$tpl->parseCurrentBlock();
	}
	
	if(sizeof($sbss->requestClasses) > 0)
	{
		$tpl->touchBlock("replNoList");
		
		foreach($sbss->requestClasses as $key => $arr)
		{
			$tpl->setCurrentBlock("ReplRows");
			$tpl->setVariable("REPLYCLASSID", $key);
			$tpl->setVariable("REPLYNAME", htmlspecialchars($arr["descr"], ENT_QUOTES));
			$tpl->setVariable("REPLYCOLOR", $arr["color"]);
			
			foreach($men as $m_key => $m_val)
			{
				$tpl->setCurrentBlock("manRepl");
				
				if($m_key == $arr["responsible"]) $tpl->touchBlock("manReplSel");
				
				$tpl->setVariable("REPLYMANID", $m_key);
				$tpl->setVariable("REPLYMANNAME", $m_val["name"]);
				$tpl->parseCurrentBlock();
			}
			
			$tpl->parse("ReplRows");
		}
	}
	
	// Display client's classes
	if(sizeof($sbss->clientClasses) > 0)
	{
		$tpl->touchBlock("custNoList");
		
		foreach($sbss->clientClasses as $key => $arr)
		{
			$tpl->setCurrentBlock("custClasses");
			$tpl->setVariable("CUSTOMERID", $key);
			$tpl->setVariable("CUSTOMERNAME", htmlspecialchars($arr["descr"], ENT_QUOTES));
			$tpl->setVariable("CUSTOMERCOLOR", $arr["color"]);
			$tpl->parseCurrentBlock();
		}
	}
	
	// Display ticket status's list
	if(sizeof($sbss->statusList) > 0)
	{
		$tpl->touchBlock("statNoList");
		
		foreach($sbss->statusList as $key => $arr)
		{
			$tpl->setCurrentBlock("Statuses");
			$tpl->syncBlockLocalize("Statuses");
			$tpl->setVariable("STATUSID", $key);
			$tpl->setVariable("STATUSDESCR", htmlspecialchars($arr["descr"], ENT_QUOTES));
			$tpl->touchBlock("statusType" . $arr["type"]);
			$tpl->setVariable("STATUSCOLOR", $arr["color"]);
			
			if($arr["active"] == 1) $tpl->touchBlock("statusActive");
			if($arr["display_def"] == 1) $tpl->touchBlock("statusDefault");
			if($arr["cli_modify"] == 1) $tpl->touchBlock("statusAllowed");
			if($arr["request_def"] == 1) $tpl->touchBlock("statusNew");
			if($arr["response_def"] == 1) $tpl->touchBlock("statusAnswer");
			
			$tpl->parse("Statuses");
		}
	}
	
	$tpl->syncBlockLocalize("commonOptions");
	$tpl->parse("commonOptions");
} // end showCommon()


/**
 * Parse TPL block if common options requested
 * @param	object template
 */
function showEmailOptions( &$tpl, &$sbss )
{
	$tpl->setVariable("MAILFILEPATH", htmlspecialchars($sbss->emailCSettings["crm_email_filepath"], ENT_QUOTES));
	$tpl->setVariable("MAILSIZE", $sbss->emailCSettings["crm_email_size"]);
	$tpl->setVariable("MAILFLUSH", $sbss->emailCSettings["crm_email_flush"]);
	
	$tpl->touchBlock("mailDebug" . $sbss->emailCSettings["crm_email_debug"]);
	$tpl->touchBlock("incProto" . $sbss->emailCSettings["crm_email_getproto"]);
	
	$tpl->setVariable("INCSERVER", $sbss->emailCSettings["crm_email_gethost"]);
	$tpl->setVariable("INCPORT", $sbss->emailCSettings["crm_email_getport"]);
	
	$tpl->touchBlock("incTls" . $sbss->emailCSettings["crm_email_gettls"]);
	
	$tpl->setVariable("INCUSER", $sbss->emailCSettings["crm_email_getuser"]);
	$tpl->setVariable("INCPASS", htmlspecialchars($sbss->emailCSettings["crm_email_getpass"], ENT_QUOTES));
	$tpl->setVariable("CRMBOX", $sbss->emailCSettings["crm_email_box"]);
	$tpl->setVariable("CRMMAILFOLDER", htmlspecialchars($sbss->emailCSettings["crm_email_imapfolder"], ENT_QUOTES));
	
	$tpl->setVariable("OUTSERVER", $sbss->emailCSettings["crm_email_smtphost"]);
	$tpl->setVariable("OUTPORT", $sbss->emailCSettings["crm_email_smtpport"]);
	
	$tpl->touchBlock("outTls" . $sbss->emailCSettings["crm_email_smtptls"]);
	$tpl->touchBlock("authMethod" . $sbss->emailCSettings["crm_email_smtpmethod"]);
	
	$tpl->setVariable("OUTUSER", $sbss->emailCSettings["crm_email_smtpuser"]);
	$tpl->setVariable("OUTPASS", htmlspecialchars($sbss->emailCSettings["crm_email_smtppass"], ENT_QUOTES));
	
	$tpl->syncBlockLocalize("emailConnector");
	$tpl->parse("emailConnector");
} // end showEmailOptions()


/**
 * Prepare to save reply classes
 * @param	object sbss class
 */
function prepareCommOptions( &$sbss )
{
	$sbss->commonSettings["sbss_crm_files"] = $_POST["sbssCFiles"];
	$sbss->commonSettings["sbss_ticket_files"] = $_POST["sbssTfiles"];
	$sbss->commonSettings["sbss_ticket_superviser"] = $_POST["sbssSuperviser"];
} // end prepareCommOptions()


/**
 * Prepare to save Email connector settings
 * @param	object sbss class
 */
function prepareEmailOptions( &$sbss )
{
	$sbss->emailCSettings["crm_email_filepath"] = $_POST["mailFilePath"];
	$sbss->emailCSettings["crm_email_getproto"] = $_POST["incProto"];
	$sbss->emailCSettings["crm_email_gethost"] = $_POST["incServer"];
	$sbss->emailCSettings["crm_email_getport"] = $_POST["incPort"];
	$sbss->emailCSettings["crm_email_gettls"] = $_POST["incTls"];
	$sbss->emailCSettings["crm_email_getuser"] = $_POST["incUser"];
	$sbss->emailCSettings["crm_email_getpass"] = $_POST["incPass"];
	$sbss->emailCSettings["crm_email_imapfolder"] = $_POST["crmMailFolder"];
	$sbss->emailCSettings["crm_email_size"] = $_POST["mailSize"];
	$sbss->emailCSettings["crm_email_flush"] = $_POST["mailFlush"];
	$sbss->emailCSettings["crm_email_debug"] = $_POST["mailDebug"];
	$sbss->emailCSettings["crm_email_box"] = $_POST["crmBox"];
	$sbss->emailCSettings["crm_email_smtphost"] = $_POST["outServer"];
	$sbss->emailCSettings["crm_email_smtpport"] = $_POST["outPort"];
	$sbss->emailCSettings["crm_email_smtptls"] = $_POST["outTls"];
	$sbss->emailCSettings["crm_email_smtpmethod"] = $_POST["authMethod"];
	$sbss->emailCSettings["crm_email_smtpuser"] = $_POST["outUser"];
	$sbss->emailCSettings["crm_email_smtppass"] = $_POST["outPass"];
} // end prepareEmailOptions()


/**
 * Prepare to save reply classes
 * @param	object sbss class
 */
function prepareReplyClasses( &$sbss )
{
	if(sizeof($_POST["replyClass"]))
	{
		foreach($_POST["replyClass"] as $key => $arr)
			$sbss->requestClasses[$key] = array("descr" => $arr[0], "color" => $arr[2], "responsible" => $arr[1]);
	}
	
	if(sizeof($sbss->requestClasses) > 0) $key = max(array_keys($sbss->requestClasses)) + 1;
	else $key = 1;
	
	if(is_array($_POST["replyClassName"]))
	{
		for($i = 0, $off = sizeof($_POST["replyClassName"]); $i < $off; $i++)
		{
			$sbss->requestClasses[$key] = array("descr" => $_POST["replyClassName"][$i], 
							"color" => $_POST["replyClassColor"][$i], 
							"responsible" => $_POST["replyClassMan"][$i]);
			
			$key++;
		}
	}
} // end prepareReplyClasses()


/**
 * Prepare to save client classes
 * @param	object sbss class
 */
function prepareClientClasses( &$sbss )
{
	if(sizeof($_POST["clientClass"]))
	{
		foreach($_POST["clientClass"] as $key => $arr)
			$sbss->clientClasses[$key] = array("descr" => $arr[0], "color" => $arr[1]);
	}
	
	if(sizeof($sbss->clientClasses) > 0) $key = max(array_keys($sbss->clientClasses)) + 1;
	else $key = 1;
	
	if(is_array($_POST["clientClassName"]))
	{
		for($i = 0, $off = sizeof($_POST["clientClassName"]); $i < $off; $i++)
		{
			$sbss->clientClasses[$key] = array("descr" => $_POST["clientClassName"][$i], 
							"color" => $_POST["clientClassColor"][$i]);
			
			$key++;
		}
	}
} // end prepareClientClasses()


/**
 * Prepare to save status classes
 * @param	object sbss class
 */
function prepareStatusClasses( &$sbss )
{
	if(sizeof($_POST["statusList"]))
	{
		foreach($_POST["statusList"] as $key => $arr)
			$sbss->statusList[$key] = array("descr" => $arr[0], 
							"type" => $arr[1],
							"color" => $arr[2], 
							"active" => isset($arr[3]) ? 1 : 0,
							"display_def" => isset($arr[4]) ? 1 : 0, 
							"cli_modify" => isset($arr[5]) ? 1 : 0,
							"request_def" => 0, 
							"response_def" => 0);
	}
	
	if(isset($_POST["statusListNew"]) && isset($sbss->statusList[$_POST["statusListNew"]]))
		$sbss->statusList[$_POST["statusListNew"]]["request_def"] = 1;
	
	if(isset($_POST["statusListAnswer"]) && isset($sbss->statusList[$_POST["statusListAnswer"]]))
		$sbss->statusList[$_POST["statusListAnswer"]]["response_def"] = 1;
	
	if(sizeof($sbss->statusList) > 0) $key = max(array_keys($sbss->statusList)) + 1;
	else $key = 1;
	
	if(is_array($_POST["statusName"]))
	{
		for($i = 0, $off = sizeof($_POST["statusName"]); $i < $off; $i++)
		{
			$sbss->statusList[$key] = array("descr" => $_POST["statusName"][$i],
							"type" => $_POST["statusFor"][$i],
							"color" => $_POST["statusColor"][$i],
							"active" => isset($_POST["statusActive"][$i]) ? 1 : 0,
							"display_def" => isset($_POST["statusDefault"][$i]) ? 1 : 0,
							"cli_modify" => isset($_POST["statusAllowed"][$i]) ? 1 : 0,
							"request_def" => 0, 
							"response_def" => 0);
			
			$key++;
		}
	}
} // end prepareStatusClasses()
?>