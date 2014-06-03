<?php
/**
 * The first page short information that is shown fater manager was
 * successfully loged in
 * 
 * @date		$Date: 2013-02-04 10:42:57 +0400 (Пн., 04 февр. 2013) $
 * @revision	$Revision: 31374 $
 */


// There is background query
if(isset($_POST['async_call']))
{
	if(isset($_POST['getsessions'])) {
		getAuthSessions($lanbilling, $localize);
	}
	
	if(isset($_POST['getgeneralinfo'])) {
		getSystemInfo($lanbilling, $localize);
	}
	
	if(isset($_POST['getlogfile'])) {
		getLogFileData($lanbilling, $localize);
	}
}	
else
{
	// Show first page general information 
   	$tpl = new HTML_Template_IT(TPLS_PATH);
	$tpl->loadTemplatefile("firstpage.tpl", true, true);
	$tpl->touchBlock("__global__");
	if($lanbilling->manager == 0) {
		$tpl->touchBlock("allowLog");
	}
	$localize->compile($tpl->get(), true);

}


/**
 * Retrieve from server authorized manager's sessions
 * @param	object, billing class
 * @param	object, localize class
 */
function getAuthSessions( &$lanbilling, &$localize )
{
	$_tmp = array();
	
	// Known filter values
	// 0 - all
	// 1 - managers
	// 2 - users
	if( false != ($result = $lanbilling->get("getLoggedUsers", array("ismanager" => 1))) ) {
		if(!is_array($result)) {
			$result = array($result);
		}
		
		array_walk($result, create_function('$item, $key, $_tmp', '
			$_tmp[0][] = array(
				"name" => $item->name,
				"online" => $item->online
			);
		'), array( &$_tmp ));
	}
	
	if(sizeof($_tmp) > 0) {
		echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
	}
	else { 
		echo '({"results": null })';
	}
} // end getAuthSessions()


/**
 * Retrieve system total information
 * @param	object, billing class
 * @param	object, localize class
 */
function getSystemInfo( &$lanbilling, &$localize )
{
	$_tmp = array();
	
	$_descr = array(					
		"operators" => $localize->get('Operators'), 
		"accounts" => $localize->get('Users'),
		"userservices" => $localize->get('Accounts'), 
		"agreements" => $localize->get('Agreements'), 
		"currencies" => $localize->get('Currencies'), 
		"managers" => $localize->get('Managers'), 
		"agentswork" => $localize->get('Agents') .  ' (Online)',
		"agentsstop" => $localize->get('Agents') . ' (Offline)',
		"devices" => $localize->get('Inventory Devices'),
		"tickets" => $localize->get('Opened tickets'),
		"crmdocs" => $localize->get('CRM files'),
		"buildname" => $localize->get('Billing version'),
		"builddate" => $localize->get('Build number / date'),
		"lock_period" => $localize->get('Locked period')
	);
	
	$results = $lanbilling->get("getOptions");
	$key = 'lock_period';
	foreach($results as $obj){
	 	if($obj->name == $key) {
			$_tmp[] = array(
				"name" => $key,
				"descr" => $_descr[$key],
				"value" => $obj->value
			);
			break;
		}
	}
	
	if( false != ($result = $lanbilling->get("getFirstPage")) ) {
		
		foreach($result as $key => $item) {
			if(!$_descr[$key]) {
				continue;
			}
			
			$_tmp[] = array(
				"name" => $key,
				"descr" => $_descr[$key],
				"value" => $item
			);
		}
	}
	
	if(sizeof($_tmp) > 0) {
		echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
	}
	else { 
			echo '({"results": null })';
	}
} // end getSystemInfo()


/**
 * Get server log file data
 * @param	object, billing class
 * @param	object, localize class
 */
function getLogFileData( &$lanbilling, &$localize )
{
	if( false != ($result = $lanbilling->get("getLogFile", array("chars" => (integer) 30000))) ) {
		$result = nl2br($result);
		// Color DEBUG messages
		$result = preg_replace('/(\d\s+)(DEBUG)(\s+\[)/', '${1}<span style="color:#074EAB;">${2}</span>${3}', $result);
		// Color Error messages
		$result = preg_replace('/(\d\s+)(ERROR)(\s+\[)/', '${1}<span style="color:#AD251D;">${2}</span>${3}', $result);
		echo $result;
	}
	else {
		echo '';
	}
} // end getLogFileData()

?>
