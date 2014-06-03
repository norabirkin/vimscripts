<?php
/**
 * Recalculation status list and action handler
 * 
 * Repository information:
 * @date		$Date: 2012-08-23 09:39:25 +0400 (Чт., 23 авг. 2012) $
 * @revision	$Revision: 25320 $
 */


// There is background query
if(isset($_POST['async_call']))
{
	if(isset($_POST['getmodules'])) {
		getModules($lanbilling, $localize);
	}
	
	if(isset($_POST['getunions'])) {
		getUnions($lanbilling, $localize);
	}
	
	if(isset($_POST['getrecalc'])) {
        getRecalcProcess($lanbilling, $localize);
	}
	
	if(isset($_POST['setrecalc'])) {
		setRecalcProc($lanbilling, $localize);
	}
}
// There is standart query
else
{
	$tpl = new HTML_Template_IT(TPLS_PATH);
	$tpl->loadTemplatefile("recalc.tpl", true, true);
	$tpl->touchBlock("__global__");
	$localize->compile($tpl->get(), true);
}


/**
 * Show modules list in the vgroups list view
 * @param	object, billing class
 * @param	object, localize class
 */
function getModules( &$lanbilling, &$localize )
{
	$_tmp = array();
	
	if( false != ($result = $lanbilling->get("getAgentsExt")) )
	{
		if(!is_array($result)) {
			$result = array($result);
		}
		
		$recalc = getRecalcProcess($lanbilling, $localize, false); 
		
		array_walk($result, create_function('&$item, $key, $_tmp', '
			switch($item->agent->type) {
				case 14:
					return;
			};
			if($item->agent->remulateonnaid || isset($_tmp[1][$item->agent->id])) {
				return;	
			}
			$name = $item->agent->descr; 
			if(empty($item->agent->servicename)) { 
				$name = $item->agent->descr;
			}; 
			$_tmp[0][] = array(
				"id" => $item->agent->id, 
				"type" => $item->agent->type, 
				"name" => $name
			);
		'), array( &$_tmp, &$recalc ));
	}
	
	if(sizeof($_tmp) > 0) { 
		echo '({ results: ' . JEncode($_tmp, $lanbilling) . '})';
	}
	else echo "({ })";
} // end getModules()


/**
 * Return JSON data with the selected unions for which can be made recalculation
 * @param	object, billing class
 * @param	obkect, localize class
 * @param	boolean, don't send echo 
 */
function getUnions( &$lanbilling, &$localize, $_echo = true )
{
	$_tmp = array(
		array(
			"id" => -1,  
			"name" => $localize->get('All')
		)
	);
	
	if( false != ($result = $lanbilling->get("getGroups")) ) {
		if(!is_array($result)) {
			$result = array($result);
		}
		
		if(!$_echo) {
			return $result;
		}
		
		array_walk($result, create_function('&$item, $key, $_tmp','
			$_tmp[0][] = array(
				"id" => $item->groupid, 
				"name" => $item->name
			);
		'), array(&$_tmp));
	}
	
	if($_echo !== false) {
		if(sizeof($_tmp) > 0) { 
			echo '({ "results": ' . JEncode($_tmp, $lanbilling) . '})';
		}
		else {
			echo '({ "results": "" })';
		}
	}
} // end getUnions()


/**
 * Get current already stared recalc processes
 * @param	object $val
 * @param	object $key
 * @param	boolean, don't send echo
 */
function getRecalcProcess( &$lanbilling, &$localize, $_echo = true)
{
	$_tmp = array();
	
	if( false != ($result = $lanbilling->get("getRecalcState", array("id" => 0), true)) ) {
		if(!is_array($result)) {
			$result = array($result);
		}
		
		// If passed true than let it be call from client, not from modules list function
		if ($_echo) {
			$modules = $lanbilling->get("getAgents");
			if(!is_array($modules)) {
				$modules = array($modules);
			}
			
			$_modules = array();
			array_walk($modules, create_function('$item, $key, $_tmp', '
				$_tmp[0][$item->id] = $item->name;
			'), array( &$_modules ));
			
			$modules = $_modules;
			
			$unions = getUnions($lanbilling, $localize, false);
			$_unions = array();
			if(!empty($unions)) {
				array_walk($unions, create_function('$item, $key, $_tmp', '
					$_tmp[0][$item->groupid] = $item->name;
				'), array( &$_unions ));
			}
			
			$unions = $_unions;
			unset($_modules, $_unions);
		}
		
		array_walk($result, create_function('$item, $key, $_tmp', '
			if($item->recalcstat == 0 && $item->recalcrent == 0) {
				return;
			}
			if($_tmp[1]) {
				$item->agentname = $_tmp[1][$item->id];
			}
			if($_tmp[2]) {
				$item->groupname = $_tmp[2][$item->recalcgroup];
			}
			$_tmp[0][$item->id] = (array)$item;
		'), array( &$_tmp, (empty($modules) ? false : $modules), (empty($unions) ? false : $unions) ) );
		
		if($_echo == false) {
			return $_tmp;
		}
		
		$_tmp = array_values($_tmp);
	}
	
    if($_echo == true) {
    	if(sizeof($_tmp) > 0) { 
    		echo '({ "total": ' . (integer)sizeof($_tmp) . ', "results": ' . JEncode($_tmp, $lanbilling) . '})';
    	}
    	else {
    		echo '({ "total": 0, "results": "" })';
    	}
    }
} // end getRecalcProcess()


/**
 * Start recalculation process 
 * @param	object, billing class
 */
function setRecalcProc( &$lanbilling, &$localize )
{
	$_withError = array();
	
	// Check if passed module id
	if((integer)$_POST['module'] <= 0) {
		$_withError[] = $localize->get('Undefined') . " " . $localize->get('module');
	}
	
	// Check if there is passed task
	if((integer)$_POST['stat'] == 0 && (integer)$_POST['rent'] == 0) {
		$_withError[] = $localize->get('Undefined task') . " (" . $localize->get('Statistics') . ", " . $localize->get('Rent') . ")";
	}
	
	// Check if there is correct date value
	if(!preg_match('/^[0-9]{1,2}\.[0-9]{1,2}\.[0-9]{4}$/', $_POST['period'])) {
		$_withError[] = $localize->get('Undefined-a') . " " . $localize->get('Date');
	}
	else {
		$period = explode('.', $_POST['period']); 
		$period = sprintf("%04d-%02d-%02d", $period[2], $period[1], ((integer)$period[0] == 0) ? 1 : $period[0]);
		
		// Check if set lock date for the period
		if( true == $lanbilling->getPeriodLock($period)) {
			$_withError[] = sprintf($localize->get("There is period lock. You cannot affect data earlier than"), $lanbilling->getPeriodLock());
		}
	}
	
	if(sizeof($_withError) == 0) {
		// Parse date
		
		$stat = ((integer)$_POST['stat'] + (integer)$_POST['statowner'] + (integer)$_POST['stattarif']);
		$rent = ((integer)$_POST['rent'] + (integer)$_POST['renttarif']);
		$struct = array("id" => $_POST['module'], 
			"recalcstat" => $stat, 
			"recalcrent" => $rent, 
			"recalcgroup" => ((integer)$_POST['union'] <= 0) ? 0 : $_POST['union'], 
			"recalcdate" => $period
		);
		
		if( false === $lanbilling->get("startRecalc", array("flt" => $struct), true) ) {
			$error = $lanbilling->soapLastError();
			$_withError[] = $error->detail; 
		}
	}
	
	if(sizeof($_withError) > 0) {
		echo "({ success: false, reason: " . JEncode(implode("<br>", $_withError), $lanbilling) . "})";
	}
	else {
		echo "({ success: true })";
	}
} // end setRecalcProc()

?>