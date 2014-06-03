<?php
/**
 * CRM system file to view, insert, modify client document information
 *
 */

ini_set("display_errors", false);
error_reporting(E_ALL^E_NOTICE);

include_once("../soap.class.php");
include_once("../main.class.php");
include_once("../localize.php");
include_once("../localize.class.php");
include_once("../IT.php");
include_once("sbssFiles.class.php");
// Start session
if(strpos($_SERVER["HTTP_USER_AGENT"], "MSIE")) {
    session_cache_limiter("public");
}

$lanbilling = new LANBilling(array("rootPath" => "../"));

// Create Template class object
$tpl = new HTML_Template_IT("../" . TPLS_PATH);
$tpl->loadTemplatefile("sbssCrmData.tpl", true, true);

// Localize object
$localize = new Localize('ru', 'UTF-8');
$lanbilling->localize = $localize;

// Check valid user id from client browser
if(!isset($_POST["uid"]))
{
	if(empty($_GET["uid"])) stopScript($tpl, GOTWRONGDATA);
	else $_POST["uid"] = $_GET["uid"];
}
else
{
	if(empty($_POST["uid"])) stopScript($tpl, GOTWRONGDATA);
}

// Check valid auhorized session
if(!isset($_SESSION["auth"]["authorized"])) {
	stopScript($tpl, GOTWRONGDATA);
}

// Create DB connection
$descriptor = $lanbilling->descriptor;
$serveraddress = $lanbilling->serveraddress;
$mysqluser = $lanbilling->mysqluser;
$mysqlpassword = $lanbilling->mysqlpassword;
$mysqldatabase = $lanbilling->mysqldatabase;
// Create sbss classes
$sbss = new SBSSFiles($descriptor);
$sbss->initSettings();

// Show subMenu
showSubmenu($tpl);

// Workin with E-mail attahed files
if($_POST["submenu"] == 1)
{
	// Get user Mail records from database
	if(!isset($_POST["page"]) || $_POST["page"] <= 0) $_POST["page"] = 1;
	$dataList = $sbss->getMailFiles("", "", "", null, $_POST["uid"], 3, 1, $_POST["page"]);
	
	// Print found record to the page
	if(!empty($dataList))
		mailFilesParse($sbss, $tpl);
	else
	{
		// Now rows found
		$tpl->setCurrentBlock("noData");
		$tpl->syncBlockLocalize("noData");
		$tpl->parseCurrentBlock();
	}
}

// Working with CRM files
else
{
	// Delete file from user card
	if(isset($_POST["dropFileId"]) && !empty($_POST["dropFileId"]))
	{
		if(false == $sbss->removeCRMFile($_POST["dropFileId"]))
			$sbss->errors[] = MESSAGESAVEERROR . ". " . WEBSERVERLOG;
	}
	
	// Save new or edit existing entry
	if(isset($_POST["save"]))
	{
		saveCRMFile($sbss);
	}
	
	// Print error message if they were
	if(!empty($sbss->errors))
	{
		$Error = true;
		foreach($sbss->errors as $errorText)
		{
			$tpl->setCurrentBlock("erroRow");
			$tpl->syncBlockLocalize("erroRow");
			$tpl->setVariable("ERRORMESSAGE", $errorText);
			$tpl->parseCurrentBlock();
		}
		
		$tpl->syncBlockLOcalize("errorShow");
		$tpl->parse("errorShow");
	}
	
	// Get user CRM file from database
	if(!isset($_POST["page"]) || $_POST["page"] <= 0) $_POST["page"] = 1;
	$dataList = $sbss->getCRMFiles("", null, $_POST["uid"], 0, 0, $_POST["page"]);
	
	// To attach files control
	$tpl->touchBlock("attachData");
	
	// Print found record to the page
	if(!empty($dataList))
		crmFilesParse($sbss, $tpl);
	else
	{
			// Block to attach file if there is empty list
			if(!isset($_POST["editFileId"]))
			{
				$tpl->setCurrentBlock("attachForm");
				$tpl->syncBlockLocalize("attachForm");
				$tpl->touchBlock("attachHide");
				$tpl->parse("attachForm");
			}
		
		// Now rows found
		$tpl->setCurrentBlock("noData");
		$tpl->syncBlockLocalize("noData");
		$tpl->parseCurrentBlock();
	}
}

// Send data to user
$tpl->setVariable("PAGEVALUE",$_POST["page"]);
$tpl->setVariable("CLIENTID",$_POST["uid"]);
$tpl->syncBlockLocalize("validData");
$tpl->parse("validData");
$localize->compile($tpl->get(), true);



/**
 * Creating subMenu items
 * @param	object template class
 */
function showSubMenu( &$tpl )
{
	if(!isset($_POST["submenu"]) || $_POST["submenu"] == 0)
	{
		$_POST["submenu"] = 0;
		$tpl->setCurrentBlock("SelectedMenu");
		$tpl->setVariable("WIDTHVALUE", "15%");
		$tpl->setVariable("SUBMENUSUBMIT", "0");
		$tpl->setVariable("MENUNAME", FILES);
		$tpl->parseCurrentBlock();
	}
	else
	{
		$tpl->setCurrentBlock("UnSelectedMenu");
		$tpl->setVariable("WIDTHVALUE", "15%");
		$tpl->setVariable("SUBMENUSUBMIT", "0");
		$tpl->setVariable("MENUNAME", FILES);
		$tpl->parseCurrentBlock();
	}
	$tpl->parse("subMenu");

	if($_POST["submenu"] == 1)
	{
		$tpl->setCurrentBlock("SelectedMenu");
		$tpl->setVariable("WIDTHVALUE", "15%");
		$tpl->setVariable("SUBMENUSUBMIT", "1");
		$tpl->setVariable("MENUNAME", "E-mail");
		$tpl->parseCurrentBlock();
	}
	else
	{
		$tpl->setCurrentBlock("UnSelectedMenu");
		$tpl->setVariable("WIDTHVALUE", "15%");
		$tpl->setVariable("SUBMENUSUBMIT", "1");
		$tpl->setVariable("MENUNAME", "E-mail");
		$tpl->parseCurrentBlock();
	}
	$tpl->parse("subMenu");
	$tpl->touchBlock("menuFreeSpace");
	$tpl->setVariable("SUBMENU", $_POST["submenu"]);
} // end showSubMenu()


/**
 * Create Mail records list
 * @param	object sbss class
 * @param	object template class
 */
function mailFilesParse( &$sbss, &$tpl )
{
	// Build pages
	pages($sbss, $tpl);
	$tpl->setVariable("COUNTOPENED", $sbss->totalRows);
	
	$tpl->setCurrentBlock("mailHead");
	$tpl->syncBlockLocalize("mailHead");
	$tpl->parseCurrentBlock();
	
	// Parse array with mail records
	foreach($sbss->mailList as $arr)
	{
		$tpl->setCurrentBlock("row");
		$tpl->setVariable("THISMODE", 2);
		$tpl->setVariable("THISDATE_1", $arr["created"]);
		$tpl->setVariable("THISDATE_2", $arr["from"]);
		$tpl->setVariable("THISCOL1", $arr["to"]);
		$tpl->setVariable("THISCOL2", $sbss->settings->managerList[$arr["manId"]]["name"]);
		
		if(empty($arr["subject"]))
		{
			$tpl->setCurrentBlock("emptySubj");
			$tpl->syncBlockLocalize("emptySubj");
			$tpl->parseCurrentBlock();
		}
		else $tpl->setVariable("THISCOL3", $arr["subject"]);
		
		$tpl->setVariable("THIS_SIZE", sprintf("%0.3f", $arr["size"] / 1024));
		
		$tpl->setVariable("CLIENTID",$_POST["uid"]);
		$tpl->setVariable("THISFILEID", $arr["id"]);
		$tpl->parse("row");
	}
	
	$tpl->syncBlockLocalize("Data");
	$tpl->parse("Data");
} // end mailFilesParse()


/**
 * Create CRM files list
 * @param	object sbss class
 * @param	object template class
 */
function crmFilesParse( &$sbss, &$tpl )
{
	// Build pages
	pages($sbss, $tpl);
	$tpl->setVariable("COUNTOPENED", $sbss->totalRows);
	
	// Show hidden if there was file id to edit
	if(isset($_POST["editFileId"]))
	{
		$tpl->setCurrentBlock("fileEdit");
		$tpl->setVariable("FILEID", $_POST["editFileId"]);
		$tpl->parseCurrentBlock();
	}
	
	// Block to attach file
	$tpl->setCurrentBlock("attachForm");
	$tpl->syncBlockLocalize("attachForm");
	if(isset($_POST["editFileId"]))
	{
		foreach($sbss->fileList as $arr)
		{
			if(isset($_POST["editFileId"]) && $_POST["editFileId"] == $arr["id"])
				$tpl->setVariable("FILEDESCR", $arr["descr"]);
		}
	}
	else $tpl->touchBlock("attachHide");
	$tpl->parseCurrentBlock();
	
	$tpl->setCurrentBlock("crmFileHead");
	$tpl->syncBlockLocalize("crmFileHead");
	$tpl->parseCurrentBlock();
	
	foreach($sbss->fileList as $arr)
	{
		$tpl->setCurrentBlock("row");
		$tpl->setVariable("THISMODE", 1);
		$tpl->setVariable("THISDATE_1", $arr["created"]);
		$tpl->setVariable("THISDATE_2", $arr["edited"]);
		$tpl->setVariable("THISCOL1", $sbss->settings->managerList[$arr["editId"]]["name"]);
		$tpl->setVariable("THISCOL2", $arr["descr"]);
		$tpl->setVariable("THISCOL3", $arr["name"]);
		$tpl->setVariable("THIS_SIZE", sprintf("%0.3f", $arr["size"] / 1024));
		
		$tpl->setCurrentBlock("button1");
		$tpl->setVariable("THISFILEID", $arr["id"]);
		$tpl->parseCurrentBlock();
		
		$tpl->setCurrentBlock("button2");
		$tpl->setVariable("THISFILEID", $arr["id"]);
		$tpl->parseCurrentBlock();
		
		$tpl->setVariable("CLIENTID",$_POST["uid"]);
		$tpl->setVariable("THISFILEID", $arr["id"]);
		$tpl->parse("row");
	}
	
	$tpl->syncBlockLocalize("Data");
	$tpl->parse("Data");
} // end crmFilesParse()


/**
 * Build pages list
 * @param	object sbss class
 */
function pages( &$sbss, &$tpl )
{
	// Page line to create
	if($_POST["page"] > $sbss->pageBlock)
	{
		$tpl->setCurrentBlock("pBack");
		$tpl->setVariable("PAGE", $_POST["page"]);
		$tpl->parse("pBack");
	}
	
	for($p = ($_POST["page"] - ($_POST["page"] % $sbss->pageBlock)), $off = min(($p + $sbss->pageBlock), $sbss->pages); $p <= $off; $p++)
	{
		if($p == 0) $p++;
		
		if($_POST["page"] != $p)
		{
			$tpl->setCurrentBlock("pGoto");
			$tpl->setVariable("PAGE", $p);
			$tpl->parseCurrentBlock();
		}
		else
		{
			$tpl->setCurrentBlock("pSel");
			$tpl->setVariable("PAGE", $p);
			$tpl->parseCurrentBlock();
		}
		
		$tpl->parse("pages");
	}
} // end pages()


/**
 * Save attached CRM file on disk and insert or update SQL entry
 * @param	object sbss file class
 */
function saveCRMFile( &$sbss )
{
	mysql_query("BEGIN");
	switch ($sbss->preUploadCheck("attach"))
	{
		case true:
			foreach($sbss->files as $fileData)
			{
				$Fstructure["name"] = $fileData["name"];
				$Fstructure["size"] = $fileData["size"];
				$Fstructure["clientId"] = $_POST["uid"];
				$Fstructure["descr"] = $_POST["fileDescr"];
				
				if(isset($_POST["editFileId"]) && !empty($_POST["editFileId"]))
				{
					$Fstructure["id"] = $_POST["editFileId"];
					$Fstructure["edited"] = "@NOW()@";
					$Fstructure["editId"] = $_SESSION["auth"]["authperson"];
				}
				else
				{
					$Fstructure["created"] = "@NOW()@";
					$Fstructure["aId"] = $_SESSION["auth"]["authperson"];
					$Fstructure["edited"] = "@created_on@";
					$Fstructure["editId"] = "@author_id@";
				}
				
				unset($_POST["editFileId"]);
				
				if( false != ($fileId = $sbss->attachCRMFile($Fstructure)) )
				{
					if( false == $sbss->saveFile($fileData["tmp_name"], $sbss->settings->commonSettings["sbss_crm_files"] . "/" . sprintf($sbss->crmFileTemplate, $fileId)) )
					{
						$sbss->errors[] = MESSAGESAVEERROR . ". " . WEBSERVERLOG;
						mysql_query("ROLLBACK");
						return false;
					}
				}
				else
				{
					$sbss->errors[] = MESSAGESAVEERROR . ". " . WEBSERVERLOG;
					mysql_query("ROLLBACK");
					return false;
				}
			}
		break;
		
		case null:
			if(isset($_POST["editFileId"]) && !empty($_POST["editFileId"]))
			{
				$Fstructure["descr"] = $_POST["fileDescr"];
				$Fstructure["clientId"] = $_POST["uid"];
				$Fstructure["id"] = $_POST["editFileId"];
				
				if( false == $sbss->attachCRMFile($Fstructure) )
				{
					$sbss->errors[] = MESSAGESAVEERROR . ". " . WEBSERVERLOG;
					mysql_query("ROLLBACK");
					return false;
				}
				
				unset($_POST["editFileId"]);
			}
		break;
		
		default: return false;
	}
	
	mysql_query("COMMIT");
	return true;
} // end saveCRMFile()


/**
 * Connect to MySQL
 *
 */
function connect($m_addr, $m_user, $m_pass, $m_db = "")
{
	$descriptor = mysql_connect($m_addr, $m_user, $m_pass, true) or die(mysql_error());
	
	if( !empty($m_db) )
	{
		mysql_select_db($m_db, $descriptor);
	}
	
	return $descriptor;
} // end connect()


/**
 * Stop script working if there was any problems
 *
 */
function stopScript( &$tpl, $message )
{
	$tpl->setCurrentBlock("noValidData");
	$tpl->syncBlockLocalize("noValidData");
	$tpl->setVariable("MESSAGE", $message);
	$tpl->parseCurrentBlock();
	$tpl->show();
	exit;
} // end stopScript()
?>