<?php
/**
 * Send requested file to user in SBSS system
 * You should know that this script identify type of request in the GET variable _GET["for"]
 * Request for the ticket's files:
 * _GET["for"] == 0
 * 	Impotant for this mode:
 * 	$_GET["fid"] - file id
 * 	$_GET["tid"] - ticket id
 * 
 * Request for the CRM's files attached to user:
 * _GET["for"] == 1
 * 	Impotant for this mode:
 * 	$_GET["fid"] - file id
 * 	$_GET["uid"] - user id
 * 
 * Request for the Mail's files attached to user:
 * _GET["for"] == 1
 * 	Impotant for this mode:
 * 	$_GET["fid"] - file id
 * 	$_GET["uid"] - user id
 * 
 * Request for the E-mail's files attached to user:
 * _GET["for"] == 2
 */

ini_set("display_errors", false);
error_reporting(E_ALL^E_NOTICE);

include_once("../localize.php");
include_once("../soap.class.php");
include_once("../main.class.php");
include_once("sbssFiles.class.php");

$lanbilling = new LANBilling(array('rootPath' => '../'));

if(!$lanbilling->authorized) {
	$_GET["fid"] = 0;
}

$descriptor = $lanbilling->descriptor;
$serveraddress = $lanbilling->serveraddress;
$mysqluser = $lanbilling->mysqluser;
$mysqlpassword = $lanbilling->mysqlpassword;
$mysqldatabase = $lanbilling->mysqldatabase;

$sbss = new SBSSFiles($descriptor);
$sbss->initSettings();

switch($_GET["for"])
{
	case 0: $sbss->readPostFile($_GET["fid"], $_GET["tid"]);
	break;
	
	case 1: $sbss->readCRMFile($_GET["fid"], $_GET["uid"]);
	break;
	
	case 2: $sbss->settings->initEmailCOptions();
		$sbss->readMailFile($_GET["fid"], $_GET["uid"]);
	break;
	
	case 3: $sbss->readKnowledgeFile($_GET["fid"], $_GET["tid"]);
	break;
	
	default:
		header("Content-Length: 0");
		header("Connection: close");
}

?>