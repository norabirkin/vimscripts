<?php
/**
 * Configuration engine to get or save data for the HelpDesk settings, 
 * applications or E-mail connector
 * 
 * @date		$Date: 2013-12-18 17:57:10 +0400 (Ср., 18 дек. 2013) $
 * @revision	$Revision: 40469 $
 */

// There is background query
if(isset($_POST['async_call']))
{
	if(isset($_POST['setnotice'])) {
		setNotice($lanbilling, $localize);
	}

	if(isset($_POST['getnotices'])) {
		getNoticesList($lanbilling, $localize);
	}

	if(isset($_POST['getreqlist'])) {
		getRequestsList($lanbilling, $localize);
	}
	
	if(isset($_POST['getmenlist'])) {
		getManagersList($lanbilling, $localize);
	}
	
	if(isset($_POST['getappltypes'])) {
		getApplicationTypes($lanbilling, $localize);
	}
	
	if(isset($_POST['getstatuses'])) {
		getStatuses($lanbilling, $localize);
	}
	
	if(isset($_POST['savesbsscommon'])) {
		saveSBSSCommon($lanbilling, $localize);
	}
	
	if(isset($_POST['getsbssoptions'])) {
		getSBSSOptions($lanbilling, $localize);
	}
	
	if(isset($_POST['getcategories'])) {
		getSharedPostsCategories($lanbilling, $localize);
	}
	
	if(isset($_POST['delcategory'])) {
		delSharedPostsCategory($lanbilling, $localize);
	}
	
	if(isset($_POST['savecategories'])) {
		saveSharedPostsCategories($lanbilling, $localize);
	}
}
// There is standard query
else
{
	$tpl = new HTML_Template_IT(TPLS_PATH);
	$tpl->loadTemplatefile("sbsssettings.tpl", true, true);
	$tpl->touchBlock("__global__");
	$localize->compile($tpl->get(), true);
}

function setNotice( &$lanbilling, &$localize ) {
    if (!$lanbilling->save('updSbssNoticeTemplate', array(
        'name' => $_POST['name'],
        'id' => $_POST['id'],
        'options' => $_POST['options'],
        'theme' => $_POST['theme'],
        'body' => $_POST['body']
    ))) {
        echo json_encode(array(
            'success' => false,
            'error' => $lanbilling->soapLastError()
        ));
    } else {
        echo json_encode(array(
            'results' => true
        ));
    }
}

function getNoticesList( &$lanbilling, &$localize ) {
    $data = array();
    $notices = $lanbilling->get('getSbssNoticeTemplate', array(
        'flt' => array(
            'pgsize' => 4,
            'pgnum' => 1
        )
    ));
    if (!$notices) {
        $notices = array();
    }
    if (!is_array($notices)) {
        $notices = array($notices);
    }
    foreach ($notices as $item) {
        $data[] = array(
            'name' => $item->name,
            'id' => $item->id,
            'options' => $item->options,
            'theme' => $item->theme,
            'body' => $item->body
        );
    }
    echo json_encode(array(
        'results' => $data
    ));
}

/**
 * Build and return to web client available managers list
 * @param	object, billing class
 * @param	object, localize class
 */
function getManagersList( &$lanbilling, &$localize )
{
	$_tmp = array();
	
	if( false != ($result = $lanbilling->get("getManagers")) )
	{
		if(!is_array($result)) {
			$result = array($result);
		}
		
		array_walk($result, create_function('$item, $key, $_tmp', '
			$_tmp[0][] = array(
				"id" => $item->personid, 
				"name" => $item->fio, 
				"login" => $item->login, 
				"descr" => $item->descr,
				itsme => $_tmp[1]->manager == $item->personid ? 1 : 0
			);
		'), array( &$_tmp, &$lanbilling ));
	}
	
	if(sizeof($_tmp) > 0) {
		echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
	}
	else {
		echo "({ results: '' })";
	}
} // end getManagersList()


/**
 * Return on server response all availabe requests classes
 * @param	object, billing class
 * @param	object, localize class
 */
function getRequestsList( &$lanbilling, &$localize )
{
	$_tmp = array();
	
	if( false != ($result = $lanbilling->get("getSbssRequestClasses"))) {
		if(!is_array($result)) {
			$result = array($result);
		}
		
		array_walk($result, create_function('$item, $key, $_tmp', '
			$_tmp[0][] = (array)$item;
		'), array( &$_tmp ));
	}
	
	if(sizeof($_tmp) > 0) {
		echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
	}
	else {
		echo '({ "results": "" })';
	}
} // end getRequestsList()


/**
 * Return on server response application types
 * @param object $lanbilling
 * @param object $localize
 */
function getApplicationTypes( &$lanbilling, &$localize )
{
	$_tmp = array();
	
	if( false != ($result = $lanbilling->get("getSbssApplClasses"))) {
		if(!is_array($result)) {
			$result = array($result);
		}
		
		array_walk($result, create_function('$item, $key, $_tmp', '
			if((integer)$_POST["skiparchive"] == 1 && $item->archive == 1) {
				return;
			};
			if(!isset($_POST["skiparchive"]) && (int)$_POST["checktype"] == 0 && $item->archive == 1) {
				return;
			};
			if(!isset($item->rules) || empty($item->rules)) {
				$item->rules = array(0,0,0,0,0,0,0);
			}
			else {
				if(!is_array($item->rules)) {
					$item->rules = array($item->rules);
				}
				$_r = array();
				foreach($item->rules as $_item) {
					array_push($_r, $_item->restriction);
				}
				$item->rules = $_r;
			}
			$item->rules = implode(",", $item->rules);
			$_tmp[0][] = (array)$item;
		'), array( &$_tmp ));
	}
	
	if(sizeof($_tmp) > 0) {
		echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
	}
	else {
		echo '({ "results": "" })';
	}	
} // end getApplicationTypes()


/**
 * Return on server response all available statuses from DB settings
 * @param	object, billing class
 * @param	object, localize class
 */
function getStatuses( &$lanbilling , &$localize )
{
	$_tmp = array();
	
	$_filter = array(
		"groups" => (integer)$_POST['getstatuses']
	);
	
	if( false != ($result = $lanbilling->get("getSbssStatuses", array( "flt" => $_filter)))) {
		if(!is_array($result)) {
			$result = array($result);
		}
		
		array_walk($result, create_function('$item, $key, $_tmp', '
			$_tmp[0][] = (array)$item; 
		'), array( &$_tmp ));
	}
	
	if(sizeof($_tmp) > 0) {
		echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
	}
	else {
		echo '({ "results": "" })';
	}
} // end getStatuses()


/**
 * Get CRM Email connector settings
 * @param object $lanbilling
 * @param object $localize
 * @return 
 */
function getSBSSOptions( &$lanbilling, &$localize )
{
	$post = array(
		"crm_email_filepath" => "",							// Where to store email files
		"crm_email_getproto" => "1",						// Client get mail protocol
		"crm_email_gethost" => "localhost.localhost.ru",	// Client get mail server
		"crm_email_getport" => "993",						// Client get mail host port
		"crm_email_gettls" => "1",							// If client use tls to get mail
		"crm_email_getuser" => "crm@localhost.ru",			// Client user name to get mail
		"crm_email_getpass" => "",							// Client password to get mail
		"crm_email_imapfolder" => "INBOX",					// Root name of the IMAP folder on the server
		"crm_email_size" => "10485760",						// E-mail size allowed, bytes
		"crm_email_flush" => "120",							// Check mail each interval
		"crm_email_debug" => "1",							// Debug Email connector
		"crm_email_box" => "crm@localhost.ru",				// CRM system email box
		"crm_email_smtphost" => "localhost.localhost.ru",	// Send email via host
		"crm_email_smtpport" => "25",						// SMTP server port
		"crm_email_smtptls" => "1",							// Use tls auth method to send email
		"crm_email_smtpmethod" => "2",						// Authorization method
		"crm_email_smtpuser" => "crm@localhost.ru",			// Smtp user name
		"crm_email_smtppass" => "",							// Smtp password
		"sbss_subject" => "",								// E-mail message subject
		"sbss_message" => "",								// E-mail message body text
		"sbss_crm_files" => "",								// Path to store attached files to client
		"sbss_ticket_files" => "",							// Path to store attached files to Helpdesk tickets
		"sbss_ticket_superviser" => "0"						// Default tickets supervisor
	);
	
	foreach($post as $key => $value) {
		$_value = $lanbilling->Option($key);
		if($_value == '' && $value != '') {
			continue;
		}
		$post[$key] = $_value;
	}
	
	echo '({ "success": true, "data": ' . JEncode($post, $lanbilling) . '})';
} // end getSBSSOptions()


/**
 * Save SBSS common information
 * @param	object, billing class
 * @param	object, localize class 
 */
function saveSBSSCommon( &$lanbilling, &$localize )
{
	$_withError = array();
	
	// Allowed post variable to save to global options
	$post = array(
		"sbss_crm_files", 
		"sbss_ticket_files",
		"sbss_ticket_superviser",
		"crm_email_filepath",
		"crm_email_getproto",
		"crm_email_gethost",
		"crm_email_getport",
		"crm_email_gettls",
		"crm_email_getuser",
		"crm_email_getpass",
		"crm_email_imapfolder",
		"crm_email_size",
		"crm_email_flush",
		"crm_email_debug",
		"crm_email_box",
		"crm_email_smtphost",
		"crm_email_smtpport",
		"crm_email_smtptls",
		"crm_email_smtpmethod",
		"crm_email_smtpuser",
		"crm_email_smtppass",
		"sbss_subject",
		"sbss_message"
	);
	
	$struct = array();
	foreach($post as $key) {
		if(isset($_POST[$key])) {
			if($key == 'sbss_crm_files' && !empty($_POST[$key]) && !folderPermitions($_POST[$key])) {
				$_withError[] = array($localize->get('Path for storing the attached files to the user'), $localize->get('Access is restricted to this section'));
			}
			
			if($key == 'sbss_ticket_files' && !empty($_POST[$key]) && !folderPermitions($_POST[$key])) {
				$_withError[] = array($localize->get('Path for storing the attached files to tickets'), $localize->get('Access is restricted to this section'));
			}
			
			$struct[] = array(
				"name" => $key, 
				"descr" => "", 
				"value" => $_POST[$key]
			);
		}
	}
	
	if(empty($_POST['saveappltypes'])) { 
		if( false == $lanbilling->save("updOptions", array('arr' => $struct), false, array("getOptions", "getAccounts")) ) {
			$error = $lanbilling->soapLastError();
			$_withError[] = array(empty($item['descr']) ? $localize->get('Error') : $item['descr'], $localize->get(empty($error->detail) ? $error->type : $error->detail));
		}
	}
	
	if(isset($_POST['savereqclasses'])) {
		saveRequestClasses($lanbilling, $localize, $_withError);
	}
	
	if(isset($_POST['saveappltypes'])) {
		saveApplClasses($lanbilling, $localize, $_withError);
	}
	
	// Save helpdesk statuses
	if(isset($_POST['savestatuses'])) {
		saveStatuses($lanbilling, $localize, $_withError);
	}
	
	// Save application statuses
	if(isset($_POST['saveastatuses'])) {
		$_POST['savestatuses'] = $_POST['saveastatuses'];
		saveStatuses($lanbilling, $localize, $_withError);
	}
	
	if(empty($_withError)) {
			echo "({ success: true, reason: " . JEncode($localize->get('Request done successfully'), $lanbilling) . " })";
	}
	else {
		if(sizeof($_withError) == 1) {
			$text = $_withError[0][0] . ": " . $_withError[0][1];
			echo "({ success: false, reason: " . JEncode($text, $lanbilling) . "})";
		}
		else {
			echo "({ success: false, reason: " . JEncode($_withError, $lanbilling) . "})";
		}
	}
} // end saveSBSSCommon()


/**
 * Save SBSS requests classes
 * @param	object, billing class
 * @param	object, localize class
 */
function saveRequestClasses( &$lanbilling, &$localize, &$_withError )
{
	if(is_null($_withError) || !isset($_withError)) {
		$_withError = array();
	}
	
	foreach($_POST['savereqclasses'] as $item) {
		if((integer)$item['archive'] == 1) {
			if((integer)$item['id'] > 0) {
				if( false == $lanbilling->delete("delSbssRequestClass", array("id" => $item['id']), array("getRequestClasses")) ) {
					$error = $lanbilling->soapLastError();
					$_withError[] = array($item['descr'], $localize->get($error->detail));
				}
			}
		}
		else {
			$struct = array(
				"id" => (integer)$item['id'],
				"descr" => $item['descr'],
				"responsibleman" => (integer)$item['responsibleman'],
				"color" => $item['color']
			);
			
			if( false == $lanbilling->save("insupdSbssRequestClass", $struct, (integer)$item['id'] > 0 ? false : true, array("getRequestClasses")) ) {
				$error = $lanbilling->soapLastError();
				$_withError[] = array($item['descr'], $localize->get($error->detail));
			}
		}
	}
} // end saveRequestClasses()


/**
 * Save SBSS requests classes
 * @param	object, billing class
 * @param	object, localize class
 */
function saveApplClasses( &$lanbilling, &$localize, &$_withError )
{
	if(is_null($_withError) || !isset($_withError)) {
		$_withError = array();
	}
	
	foreach($_POST['saveappltypes'] as $item) {
		if((integer)$item['archive'] == 1) {
			if((integer)$item['id'] > 0) {
				if( false == $lanbilling->delete("delSbssApplClass", array("id" => $item['id']), array("getRequestClasses")) ) {
					$error = $lanbilling->soapLastError();
					$_withError[] = array($item['descr'], $localize->get($error->detail));
				}
			}
		}
		else {
			$struct = array(
				"id" => (integer)$item['id'],
				"descr" => $item['descr'],
				"color" => $item['color'],
				"rules" => array()
			);
			
			if(!empty($item['rules'])) {
				$_r = explode(",", $item['rules']);
				foreach($_r as $_k => $_v) {
					$struct['rules'][] = array(
						"weekdaynum" => (integer)$_k,
						"restriction" => (integer)$_v
					);
				} 
			}
			
			if( false == $lanbilling->save("insupdSbssApplClass", $struct, (integer)$item['id'] > 0 ? false : true, array("getRequestClasses")) ) {
				$error = $lanbilling->soapLastError();
				$_withError[] = array($item['descr'], $localize->get($error->detail));
			}
		}
	}
} // end saveApplClasses()


/**
 * Save SBSS requests classes
 * @param	object, billing class
 * @param	object, localize class
 */
function saveStatuses( &$lanbilling, &$localize, &$_withError )
{
	if(is_null($_withError) || !isset($_withError)) {
		$_withError = array();
	}
	
	foreach($_POST['savestatuses'] as $item) {
		if((integer)$item['archive'] == 1) {
			if((integer)$item['id'] > 0) {
				if( false == $lanbilling->delete("delSbssStatus", array("id" => $item['id']), array("getSbssStatuses")) ) {
					$error = $lanbilling->soapLastError();
					$_withError[] = array($item['descr'], $localize->get($error->detail));
				}
			}
		}
		else {
			$struct = array(
				"id" => (integer)$item['id'],
				"descr" => $item['descr'],
				"group" => (integer)$item['group'],
				"type" => (integer)$item['type'],
				"active" => (integer)$item['active'],
				"displaydefault" => (integer)$item['displaydefault'],
				"clientmodifyallow" => (integer)$item['clientmodifyallow'],
				"defaultnew" => (integer)$item['defaultnew'],
				"defaultanswer" => (integer)$item['defaultanswer'],
				"color" => $item['color']
			);
			
			if( false == $lanbilling->save("insupdSbssStatus", $struct, (integer)$item['id'] > 0 ? false : true, array("getSbssStatuses")) ) {
				$error = $lanbilling->soapLastError();
				$_withError[] = array($item['descr'], $localize->get($error->detail));
			}
		}
	}
} // end saveStatuses()


/**
 * Check folder permitions to write file
 * @param	string folder path
 */
function folderPermitions( $_folder = null )
{
	if(is_null($_folder) || empty($_folder)) return false;
	
	if( false != fopen($_folder . "/.privileges", 'w') )
	{
		@unlink($_folder . "/.privileges");
		return true;
	}
	else return false;
} // end folderPermitions()


function getSharedPostsCategories (&$lanbilling, &$localize) {

	if( false != ($result = $lanbilling->get("getSharedPostsCategories", array()))) {
		if(!is_array($result)) {
			$result = array($result);
		}
	}
	
	foreach ($result as &$item) {
		$item->isdefault = (integer) $item->isdefault;
		$item->unremovable = $item->isdefault;
	}
	
	if(sizeof($result) > 0) {
		echo '({"results": ' . JEncode($result, $lanbilling) . '})';
	}
	else {
		echo '({ "results": "" })';
	}
	
	
} // end getSharedPostsCategories()


function delSharedPostsCategory (&$lanbilling, &$localize) {

	if((integer)$_POST['delcategory'] <= 0) {
            echo '({ success: false, errors: { reason: "'. $localize->get("Unknown category ID") . '" } })';
            return false;
    }

    try {
        if( false === ($result = $lanbilling->delete("delSharedPostsCategory", array("id" => $_POST['delcategory'])) ) )
        {
            throw new Exception ($lanbilling->soapLastError()->detail);
        }
    }
    catch(Exception $error) {
        $_response = array(
            "results" => $_tmp,
            "success" => false,
            "error" => $error->getMessage()
        );
    }
	
    if(!$_response) {
        $_response = array(
            "results" => $_tmp,
            "success" => true,
            "error" => null
        );
    }
    echo "(" . JEncode($_response, $lanbilling) . ")";

} // end delSharedPostsCategory()

function saveSharedPostsCategories (&$lanbilling, &$localize){
	try {
		foreach( $_POST['categories'] as $category ) {
			$struct = array(
				"id" => (integer)$category["id"],
				"name" => $category["name"],
				"isdefault" => $category["isdefault"] == "true" ? 1 : 0
			);
			
			if( false == $lanbilling->save("insupdSharedPostsCategory", $struct, $struct['id'] > 0 ? false : true) ) {
				throw new Exception($lanbilling->soapLastError()->detail);
			}
		}
	}

	catch(Exception $error) {
		$_response = array(
				"success" => false,
				"error" => $error->getMessage()
		);
	}
	
	if(!$_response) {
		$_response = array(
				"success" => true,
				"error" => null
		);
	}
	
	echo JEncode($_response, $lanbilling);
} // end saveSharedPostsCategories
