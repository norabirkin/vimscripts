<?php
/**
 * Knowledge base simple list used to choose subject if there's need to copy reply
 * to knowledges
 */

ini_set("display_errors", false);
error_reporting(E_ALL^E_NOTICE);

// Include engine files to this script
include_once("../localize.php");
include_once("../localize.class.php");
include_once("../soap.class.php");
include_once("../main.class.php");
include_once("../IT.php");
include_once("knowledge.class.php");

// Create main object
$lanbilling = new LANBilling(array('rootPath' => '../'));

// Localize object
$localize = new Localize('ru', 'UTF-8');
$lanbilling->localize = $localize;

$lang=$localize->LANG;
if ($lang=='en') {require_once("../".LOCALE_PATH."localize_en.php");}

else require_once("../".LOCALE_PATH."localize.php");



// Create template object
$tpl = new HTML_Template_IT("../" . TPLS_PATH);
$tpl->loadTemplatefile("knowledgeSPList.tpl",true,true);

// Check authorization
if(!$lanbilling->authorized) {
	stopScript($tpl, GOTWRONGDATA);
}

// DB connection
$descriptor = $lanbilling->descriptor;
$serveraddress = $lanbilling->serveraddress;
$mysqluser = $lanbilling->mysqluser;
$mysqlpassword = $lanbilling->mysqlpassword;
$mysqldatabase = $lanbilling->mysqldatabase;

// Create knowledge database object
$sbss = new Knowledge($descriptor);
$sbss->initSettings();

// Get all knowledges by pages
if(!isset($_POST["page"]) || $_POST["page"] <= 0) $_POST["page"] = 1;
$knowledges = $sbss->getKnowledges($_POST["string"], null, null, 0, 1, 0, $_POST["page"]);
pages($sbss, $tpl);

if(sizeof($knowledges) > 0)
{
	// Parse knowledge entries array
	foreach($knowledges as $arr)
	{
		$tpl->setCurrentBlock("row");
		$tpl->setVariable("THISID", $arr["id"]);
		
		if(empty($arr["name"]))
			$tpl->setVariable("THISSUBJECT", SUBJECTEMPTY);
		else $tpl->setVariable("THISSUBJECT", $arr["name"]);
		
		$tpl->setVariable("THISCLASSNAME", $sbss->settings->requestClasses[$arr["class"]]["descr"]);
		
		if(!empty($sbss->settings->requestClasses[$arr["class"]]["color"]))
		{
			$tpl->setCurrentBlock("classColor");
			$tpl->setVariable("CLASSCOLOR", $sbss->settings->requestClasses[$arr["class"]]["color"]);
			$tpl->parseCurrentBlock();
		}
		
		$tpl->parse("row");
	}
}
else
{
	$tpl->setCurrentBlock("noData");
	$tpl->syncBlockLocalize("noData");
	$tpl->parseCurrentBlock();
}

$tpl->syncBlockLocalize("Data");
$tpl->parse("Data");
$tpl->syncBlockLocalize("validData");
$tpl->parse("validData");
$tpl->show();


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
?>