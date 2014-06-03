<?php
include_once('NBLogger.php');

L::addFunction('lockSbssTicket');
L::addFunction('delSbssPost');
L::addFunction('getSbssTickets');
L::addFunction('getSbssTicket');
L::addFunction('insupdSbssTicket');
L::addFunction('insupdSbssPost');
L::addFunction('insupdSbssPostFile');

/**
 * Billing Parent interface file. Operates all requests made by clients
 * Modified and created for the version 1.9
 * There are two logic ways to proccess requests: the head (foreground) call and background call
 * The first one takes action when there is synchronous call from client
 * The second, when there is asynchronous call from client using AJAX
 * To initialize asynchronous call there is predefined post key 'async_call'
 *
 * !! Remember this file operates only with POST method
 *
 * Repository information:
 * $Date: 2009-11-24 10:59:06 $
 * @revision   SVN: $Revision$
 */

// Global statements to write debug information
// Detail unsuccessful authentication requests to WEB server log file
define("DETAIL_REJECTED", true);
// You can find in the system temporary folder. On Unix OS - /tmp/lb_debug_dump
define("FILE_DEBUG", false);
// Make dump for the all variable, If false, there will be only global POST, GET, SESSION, SERVER
define("FILE_DEBUG_VARDUMP", false);
// Show error and warning to stdout
define("STDOUT_ERRORS", false);
// Use session cache to store Soap responses
define("SOAP_RESPONSE_CACHE", false);


// Don't edit below code if you are not experienced!!!
// Error Handler
ini_set("display_errors", STDOUT_ERRORS);
error_reporting(E_ALL^E_NOTICE);

// Convert received GET variables to POST array only if debug mode is on
// or "download" key is passed
if(FILE_DEBUG || isset($_GET['download']) || isset($_GET['localize'])) {
	if(isset($_GET) && sizeof($_GET) > 0) {
		foreach($_GET as $key => $values) {
			if(!isset($_POST[$key])) $_POST[$key] = $values;
		}
	}
}

// Core files that contains necessary common function and object for the correct interface work
if(file_exists("configuration.php")) {
	include_once("configuration.php");
}
include_once("localize.php");
include_once('localize.class.php');
include_once("functions.inc");
include_once("api_functions.php");
include_once("constants.php");
include_once("IT.php");
include_once("common_display_1.php");
include_once("soap.class.php");
include_once("main.class.php");
include_once("includes.php");
include_once('./helpers/LBDownloadHelper.php');

// Create parent object that
$lanbilling = new LANBilling();
$descriptor = $lanbilling->descriptor;
$serveraddress = $lanbilling->serveraddress;
$mysqluser = $lanbilling->mysqluser;
$mysqlpassword = $lanbilling->mysqlpassword;
$mysqldatabase = $lanbilling->mysqldatabase;

// Localize object
if(!defined("LOCALE_LANG")) {
	define("LOCALE_LANG", "ru");
}
$localize = new Localize(LOCALE_LANG, 'UTF-8');
$lanbilling->localize = $localize;

$lang=$localize->LANG;
if ($lang=='en') {require_once(LOCALE_PATH."localize_en.php");}

else require_once(LOCALE_PATH."localize.php");

// If session expired or pressed logout control
if((integer)$_POST["devision"] == 99)
{
	$lanbilling->Logout();
}
// else $al->sessionOpen();



/**
 * Billing system devision cases
 * They shows only if authorization is granted
 */
if($lanbilling->authorized)
{
	// If there was the asynchronous query let its redirect to specified script
	// and exit for main routine
	if( isset($_POST['async_call']) && $_POST['async_call'] > 1 )
	{
		include_once("async_handler.php");
		exit;
	}

	// If there is foreground query then show HTML page headers
	if(!isset($_POST['async_call'])) {
		showHeader($lanbilling, $localize);
	}

	// Initialize variables uid and user
	list( $uid, $user ) = preg_split( '/\+/', $_POST['uidlog'] );
	if( !isset( $uid  ) ) { $uid   =  0;  }
	if( !isset( $user ) ) { $user  =  ""; }
	if( $uid && !$_POST['devision'] ) { $_POST['devision'] = 19; }

	switch((integer)$_POST['devision'])
	{
		// Default empty request after login action
		// The first step is to request menu data and validate localization for the JS engines
		case 0:
			
			// Validate localize data changes and send them to client
			if(isset($_POST['localize'])) {
				if(!$lanbilling->clientPrivateCache($localize->lastModified())) {
					header("Content-type: text/javascript");
					echo 'var localize = ' . JEncode($localize->getResource(), $lanbilling) . ';';
				}
			}
			// Initialize menu for the authorized session
			else if(isset($_POST['async_call']) && sizeof($_POST) < 3) {
				$lanbilling->getMenu($localize, true);
			}
			else {
				include_once('firstpage.php');
			}
		break;

		// To create / edit / view billing system modules
		case 1:
        case 10:
			include_once('modules.php');
		break;
		// Financial statistics
		case 2: include_once('charges.php'); break;
		// Tariffs settings
		case 4: include('tarifs.php'); break;
        // Services packages
        case 5: include('services_packages.php'); break;
		// Vgroups list. Show / Create / Edit vgroup item and its template
		case 7: include_once('vgroups.php'); break;
		// Manager's permisions
		case 13: include('managers.php'); break;
		// Currency rate settings
		case 14: include('rate_control.php'); break;
		// Manager's permisions
		case 15: include('postmans.php'); break;
		// Unions settings
		case 16: include('groups.php'); break;
		// Catalogs settings
		case 17: include('catalogues.php'); break;
		// strict reporting forms
		case 18: include('bso.php'); break;
		// Events log guide
		case 19: include('logs.php'); break;
		// Auth log guide
		case 20: include('authlog.php'); break;
		// Registry
		case 21: include('registry.php'); break;
		// Users list. Create / edit user
		case 22: include('users.php'); break;
		// User's groups control
		case 23: include_once("user_groups.php"); break;
		// Agreements list. Create / edit agreement
		case 24: include('agreements.php'); break;
		// Tarifs categories
		case 25: include('tar_categories.php'); break;
        // gen Sales
        case 26: include('gen_sales.php'); break;
        // Client devices
        case 27: include_once('client_devices.php'); break;
		// Agreements groups
		case 28: include_once('agrm_groups.php'); break;
		// Address book read and add new elements
		case 29: include_once('installments.php'); break;
		// Address book read and add new elements
		case 41: include_once('address.php'); break;
		// Modify search rules
		case 42: include_once('searchtemplate.php'); break;
		// Docuements generation queue
		case 43: include_once('documents_queue.php'); break;
		// Call recalculation action for the selected service or view current status fot this
		case 67: include_once('recalc.php'); break;
		// On fly phone numbers substitution (Modules list)
		case 68: include('phonenum_subst.php'); break;
		// RADIUS dictionary
		case 69: include('dictionary.php'); break;
		// View cards list
		case 103: include("cardslist.php"); break;
		// System statistics
		case 104: include_once('statistics.php'); break;
		// View financial documents
		case 105: include_once('orders.php'); break;
		// USBOX services manegment
		case 106: include('usbox_services.php'); break;
		// Generate user reports
		case 107: include('reports_list.php'); break;

		// ???????-????????? ?????????
		case 92:
        case 108:
			include('create_documents.php');
		break;
		// Generate cards for the selectes cardset
		case 109: include("generatecards.php"); break;
		// Would-be customers management
		case 110: include_once('applications.php'); break;
		// SBSS common settings
		case 111: include_once('sbsssettings.php'); break;
		// Generate applications for connection
		case 112: include_once('gen_connection_apps.php'); break;
		// View financial documents
		case 120: include_once('grouppedorders.php'); break;
		// Accounting docs
		case 121: include_once('accountingdocs.php'); break;
		case 122: include_once('actions.php'); break;
		case 123: include_once('serv_codes.php'); break;
        // Discounts matrix
        case 124: include_once('matrix_discounts.php'); break;
		
		
		// Payments control
		case 199: include('payments.php'); break;
		// Create / Edit / Remove Operators
		case 201: include_once('operators.php'); break;

		case 207:
		case 208:
		case 209:
			include_once('inventory.php');
		break;

        // Inventory Vlans
        case 210: include_once('vlans.php'); break;

		// Billing system settings
		case 331: include('settings.php'); break;
		// Default operator settings
		case 332:
			$_POST['default_operator'] = 1;
			include_once('users.php');
		break;
		// Documents templates
		case 337: include('db_documents.php'); break;
		// ???????? ???????????????? ???????
		case 338: include('reports_load.php'); break;
		// ?????????? ?????????? ?????????
		case 339: include('service_functions.php'); break;

		// Radius attributes settings
		case 399: include('radius_attrs.php'); break;

		// ?????????? ?????????? ???????
		case 501: include_once("trusted.class.php"); break;
		// Card Groups settings
		case 545: include_once('cardgroups.php'); break;

		// SBSS and CRM system (?????? ? ??)
		//case 1000: include_once("helpdesk/sbssSettings.php"); break;
		case 1001: include_once("helpdesk/sbssTickets.php"); break;
		case 1002: include_once("helpdesk/sbssKnowledge.php"); break;
		// Client side messages
		case 1150: include_once("broadcast_mess.php"); break;
	}

	if(!isset($_POST['async_call'])) showFooter($localize);
} // end granted access
// If access not granted, then stop any discussions
else
{
	// If not AJAX request
	if(!isset($_POST['async_call'])) {
		$tpl = new HTML_Template_IT(TPLS_PATH);
		$tpl->loadTemplatefile("login.tpl",true,true);
		$tpl->setVariable("CURRENTYEAR", date('Y'));
		$localize->compile($tpl->get(), true);
	}
	// If AJAX request
	else {
		echo "({ success: false, errors: { reason: 'unauthorized' }, authorize: 1 })";
	}
}


/**
 * Additional functions fot the whole interface system
 * Returns document head to start body
 * @param	object, billing class
 * @param	object, localize
 */
function showHeader( &$lanbilling, &$localize )
{
	$tpl = new HTML_Template_IT(TPLS_PATH);
	$tpl->loadTemplatefile("header.tpl",true,true);
	$tpl->touchBlock("__global__");
    
    if($localize->LANG == "ru") {
        $tpl->touchBlock("lang_ru");
    }
    
	$month = array('<%@ January-a %>', '<%@ February-a %>', '<%@ March-a %>', '<%@ April-a %>', '<%@ May-a %>', '<%@ June-a %>', '<%@ July-a %>', '<%@ August-a %>', '<%@ September-a %>', '<%@ October-a %>', '<%@ November-a %>', '<%@ December-a %>');

	if(!$lanbilling->Rates['valid']) {
		$tpl->touchBlock("rateAlert");
	}

	$O = $lanbilling->getOperators(null, true);

	if( false != ($V = $lanbilling->getBillingVersion()) && $V->ifcbuild != '') {
		$tpl->setVariable("IFCBUILDDATE", '(' . (!$V->match ? '!' : '') . $V->ifcbuild . '-' . $lanbilling->formatDate($V->ifcdate, 'Ymd') . ')');
	}

	$tpl->setVariable("THISCOMPANYNAME", $O['name']);
	$tpl->setVariable("SERVERTIME", date('d') . ' ' . $month[date('m') - 1] . ' ' . date("Y H:i"));
	$tpl->setVariable("RATEVALUE", $lanbilling->Rates['default']['rate'] . ' ' . $lanbilling->Rates['default']['symbol']);
	$tpl->setVariable("LOGGEDPERSON", $_SESSION['auth']['authname']);

	$localize->compile($tpl->get(), true);
} // end showHeader()


/**
 * Returns document foot to end body
 *
 */
function showFooter( &$localize )
{
	$tpl = new HTML_Template_IT(TPLS_PATH);
	$tpl->loadTemplatefile("footer.tpl", true, true);
	$tpl->touchBlock("__global__");

	$localize->compile($tpl->get(), true);
} // end showFooter()


/**
 * Send massage to browser if there was error while getting access to the file
 * @param	object, billing class
 * @param	object, localize
 * @param	integer, Message code
 * @param	string, detailed data
 */
function getFileError( &$lanbilling, &$localize, $code = 1, $detail = '' )
{
	$tpl = new HTML_Template_IT(TPLS_PATH);
	$tpl->loadTemplatefile("download_failed.tpl", true, true);
	$tpl->touchBlock("__global__");

	if(!empty($detail)) {
		$tpl->setCurrentBlock("FileError_" . $code);
		$tpl->setVariable("THISDETAILED", $detail);
		$tpl->parseCurrentBlock();
	}
	else $tpl->touchBlock("FileError_" . $code);

	$localize->compile($tpl->get(), true);
} // end getFileError()


/**
 * Function to encode recieved array to JSON structure
 * Remember!! Tou should pass array data encoded UTF-8
 * Returns String
 * @param	array data
 * @param	sobject
 */
function JEncode( &$arr, &$lanbilling )
{
	if(function_exists("json_encode")) {
		$data = json_encode($arr);
	}

	else {
		if( !version_compare(PHP_VERSION,"5.2","<") )
		{
			$lanbilling->ErrorHandler("async_handler.php", "There're avaliable [json_encode / json_decode] functions for your version. [PHP " . PHP_VERSION . "]", __LINE__);
		}

		require_once("includes/JSON.php");
		$json = new Services_JSON();
		$data = $json->encode($arr);
	}

	return $data;
} // end JEncode()
