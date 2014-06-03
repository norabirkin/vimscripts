<?php
/**
 * This engine provides management actions to control requests
 * for the future provider customers
 *
 */

// There is background query
if(isset($_POST['async_call']))
{
	if(isset($_POST['getmanagers'])) {
		getManagersList($lanbilling, $localize);
	}

	if(isset($_POST['applcache'])) {
		setFormCache($lanbilling, $localize);
	}

	if(isset($_POST['applclearcache'])) {
		clearFromCache($lanbilling, $localize);
	}

	if(isset($_POST['applrestorecache'])) {
		restoreFormCache($lanbilling, $localize);
	}

	if(isset($_POST['getstatuses'])) {
		getStatuses($lanbilling, $localize);
	}

	if(isset($_POST['getapplications'])) {
		getApplications($lanbilling, $localize);
	}

	if(isset($_POST['saveapplication'])) {
		saveApplication($lanbilling, $localize);
	}

	if(isset($_POST['getcomments'])) {
		getComments($lanbilling, $localize);
	}

	if(isset($_POST['saveappcomm']) && (integer)$_POST['saveappcomm'] > 0) {
		saveComment($lanbilling, $localize);
	}

	if(isset($_POST['saveappcomm']) && (integer)$_POST['saveappcomm'] < 0) {
		deleteComment($lanbilling, $localize);
	}

	if(isset($_POST['getworkcalendar'])) {
		getWorkCalendar($lanbilling, $localize);
	}

	if(isset($_POST['getexccalendar'])) {
		getLimitExceptions($lanbilling, $localize);
	}

	if(isset($_POST['saveexcept'])) {
		saveLimitException($lanbilling, $localize);
	}

	if(isset($_POST['gettempldocs'])) {
		getTemplDocs($lanbilling, $localize);
	}

	if(isset($_POST['getdocument'])) {
		createDocument($lanbilling, $localize);
	}

	if(isset($_POST['download'])) {
		streamDocument($lanbilling, $localize);
	}
}
// There is standard query
else
{
	$tpl = new HTML_Template_IT(TPLS_PATH);
	$tpl->loadTemplatefile("applications.tpl", true, true);
	$tpl->touchBlock("__global__");
	$localize->compile($tpl->get(), true);
}


/**
 *
 * @param object $lanbilling
 * @param object $localize
 * @return
 */
function appFilter( &$lanbilling, &$localize )
{
	// Check there is default load with out rendered statuses panel
	// if $_POST['statuses'] < 0 then load default settings
	if((integer)$_POST['statuses'] < 0) {
		$st = getStatuses($lanbilling, $localize, true);
		$st_list = array();
		array_walk($st, create_function('$item, $key, $_tmp', '
			if($item->displaydefault > 0) {
				$_tmp[0][] = $item->id;
			};
		'), array( &$st_list ) );
		$_POST['statuses'] = !empty($st_list) ? implode(',', $st_list) : '';
	}

	// Filter
	$_filter = array(
		"type" => ((integer)$_POST['apptypeid'] <= 0) ? '' : $_POST['apptypeid'],
		"status" => $_POST['statuses'],
		"responsible" => $_POST['responsible'],
		"dtfrom" => $_POST['dtfrom'],
		"dtto" => $_POST['dtto'],

		"pgnum" => ((integer)$_POST['downtype'] == 0) ? $lanbilling->linesAsPageNum((((integer)$_POST['limit'] <= 0) ? 100 : $_POST['limit']), (integer)$_POST['start'] + 1) : 0,
		"pgsize" => ((integer)$_POST['downtype'] == 0) ? (((integer)$_POST['limit'] <= 0) ? 100 : $_POST['limit']) : 0
	);

	switch((integer)$_POST['searchtype'])
	{
		case 0: $_filter['name'] = $_POST['searchfield']; break;
		case 2: $_filter['login'] = $_POST['searchfield']; break;
		case 3: $_filter['vglogin'] = $_POST['searchfield']; break;
		case 4: $_filter['email'] = $_POST['searchfield']; break;
		case 5: $_filter['phone'] = $_POST['searchfield']; break;
		case 6: $_filter['address'] = $_POST['searchfield']; break;
		case 7: $_filter['recordid'] = $_POST['searchfield']; break;
	}

	return $_filter;
} // end appFilter()


/**
 * Build applications list on request
 * @param object, billing class
 * @param object $localize
 * @return
 */
function getApplications( &$lanbilling, &$localize )
{
	$_tmp = array();
	$_filter = appFilter($lanbilling, $localize);
	$_md5 = $lanbilling->controlSum($_filter);

	$count = $lanbilling->get("Count", array("flt" => $_filter, "procname" => "getApplications", "md5" => $_md5));

	if( false != ($result = $lanbilling->get("getApplications", array( "flt" => $_filter, "md5" => $_md5 ))) ) {
		if(!is_array($result)) {
			$result = array($result);
		}

		array_walk($result, create_function('$item, $key, $_tmp', '
			$item->address = $_tmp[1]->clearAddress($item->address, ",");
			$_tmp[0][] = (array)$item;
		'), array( &$_tmp, &$lanbilling ));
	}

	if(sizeof($_tmp) > 0) {
		echo '({ "total": ' . $count . ', "results": ' . JEncode($_tmp, $lanbilling) . '})';
	}
	else {
		echo '({ "total": 0, "results": "" })';
	}
} // end getApplications()


/**
 * Trying to build calendar grid of the done or scheduled works
 * @param object, billing class
 * @param object, localize class
 */
function getWorkCalendar( &$lanbilling, &$localize )
{
	$_tmp = array();

	$_POST['getworkcalendar'] = (empty($_POST['getworkcalendar']) || !preg_match('/[\d]{6}/', $_POST['getworkcalendar'])) ? date('Ym') : $_POST['getworkcalendar'];
	$C = new calMonthGrid(substr($_POST['getworkcalendar'], 0, 4) . '-' . substr($_POST['getworkcalendar'], 4, 2) . '-01');
	$G = $C->get();

	array_walk($G, create_function('$item, $key, $_tmp', '
		$_tmp[0][$key] = array(
			"item" => $key . "000000",
			"day" => date("D", $item),
			"tasks" => array()
		);
	'), array( &$_tmp ));

	// Prepare all available statuses
	$st = getStatuses($lanbilling, $localize, true);
	$st_list = array();
	array_walk($st, create_function('$item, $key, $_tmp', '
		if($item->defaultanswer > 0) {
			return;
		}
		$_tmp[0][] = $item->id;
	'), array( &$st_list ) );

	// Prepare restrictions
	$_types = array();
	if( false != ($apptypes = $lanbilling->get("getSbssApplClasses"))) {
		if(!is_array($apptypes)) {
			$apptypes = array($apptypes);
		}

		array_walk($apptypes, create_function('$item, $key, $_types', '
			if(!is_array($item->rules)) {
				$item->rules = array($item->rules);
			}
			foreach($item->rules as $_item) {
				$_types[0][$item->id][] = $_item->restriction;
			}
		'), array( &$_types ));
	}

	$_filter = array(
		"type" => ((integer)$_POST['apptypeid'] <= 0) ? '' : $_POST['apptypeid'],
		"status" => !empty($st_list) ? implode(',', $st_list) : '',
		"responsible" => $_POST['responsible'],
		"dtfrom" => $C->getFirst('Ymd'),
		"dtto" => $C->getLast('Ymd')
	);

	if( false != ($result = $lanbilling->get("getApplications", array( "flt" => $_filter ))) ) {
		if(!is_array($result)) {
			$result = array($result);
		}

		array_walk($result, create_function('$item, $key, $_tmp','
			$k = $_tmp[1]->formatDate($item->executefinal, "Ymd");
			if(isset($_tmp[0][$k])) {
				$item->address = $_tmp[1]->clearAddress($item->address, ",");
				array_push($_tmp[0][$k]["tasks"], (array)$item);
			};
		'), array( &$_tmp, &$lanbilling ));
	}

	$_tmp = array_values($_tmp);

	echo '({ "workcalendar" : "' . $_POST['getworkcalendar'] . '", "results" : ' . JEncode($_tmp, $lanbilling) . ', "typeRestrict": ' . JEncode($_types, $lanbilling) . ' })';
} // end getWorkCalendar()


/**
 * Building calendar grid and merge to the grid exceptions
 * for the application type exceptions
 * @param object, billing class
 * @param object, localize class
 */
function getLimitExceptions( &$lanbilling, &$localize )
{
	$_tmp = array();

	$_POST['getexccalendar'] = (empty($_POST['getexccalendar']) || !preg_match('/[\d]{6}/', $_POST['getexccalendar'])) ? date('Ym') : $_POST['getexccalendar'];
	$C = new calMonthGrid(substr($_POST['getexccalendar'], 0, 4) . '-' . substr($_POST['getexccalendar'], 4, 2) . '-01');
	$G = $C->get();

	// Prepare restrictions
	$_types = array();
	if( false != ($apptypes = $lanbilling->get("getSbssApplClasses"))) {
		if(!is_array($apptypes)) {
			$apptypes = array($apptypes);
		}

		array_walk($apptypes, create_function('$item, $key, $_types', '
			if(!is_array($item->rules)) {
				$item->rules = array($item->rules);
			}
			foreach($item->rules as $_item) {
				$_types[0][$item->id][$_item->weekdaynum] = $_item->restriction;
			}
		'), array( &$_types ));
	}

	array_walk($G, create_function('$item, $key, $_tmp', '
		$_wdn = date("N", $item) - 1;
		$_tmp[0][$key] = array(
			"item" => $key . "000000",
			"day" => date("D", $item),
			"appid" => (integer)$_POST["apptypeid"],
			"limits" => array(
				"defaultValue" => isset($_tmp[1][$_POST["apptypeid"]][$_wdn]) ? $_tmp[1][$_POST["apptypeid"]][$_wdn] : 0,
				"except" => -1
			)
		);
	'), array( &$_tmp, &$_types ));

	$_filter = array(
		"appid" => (integer)$_POST['apptypeid'],
		"dtfrom" => $C->getFirst('Ymd'),
		"dtto" => $C->getLast('Ymd')
	);

	if( false != ($result = $lanbilling->get("getApplExceptions", array( "flt" => $_filter ))) ) {
		if(!is_array($result)) {
			$result = array($result);
		}

		array_walk($result, create_function('$item, $key, $_tmp','
			$k = $_tmp[1]->formatDate($item->exceptday, "Ymd");
			if(isset($_tmp[0][$k])) {
				$_tmp[0][$k]["limits"]["except"] = $item->restriction;
			};
		'), array( &$_tmp, &$lanbilling ));
	}

	$_tmp = array_values($_tmp);

	echo '({ "workcalendar" : "' . $_POST['getexccalendar'] . '", "results" : ' . JEncode($_tmp, $lanbilling) . ' })';
} // end getLimitExceptions()


/**
 * Save received exception value
 * @param object, billing class
 * @param object, localize class
 */
function saveLimitException( &$lanbilling, &$localize )
{
	$_withError = array();

	if(empty($_POST['saveexcept']) || !preg_match('/^\d{4}\-\d{2}\-\d{2}/', $_POST['saveexcept'])) {
		$_withError[] = $localize->get('Date') . ': ' . $localize->get('Undefined');
	}

	if((integer)$_POST['appid'] <= 0) {
		$_withError[] = $localize->get('Application type') . ': ' . $localize->get('Undefined');
	}

	if(empty($_withError)) {
		$struct = array(
			"id" => (integer)$_POST['appid'],
     		"restriction" => (integer)$_POST['restriction'],
     		"exceptday" => $_POST['saveexcept']
		);

		if( false == $lanbilling->save("insApplException", $struct, true, array("getApplExceptions") ) ) {
			$error = $lanbilling->soapLastError();
			$_withError[] = $localize->get($error->detail);
		}
	}

	if(empty($_withError)) {
		echo '({ "success": true, "reason": "' . $localize->get('Request done successfully') . '" })';
	}
	else {
		if(sizeof($_withError) == 1) {
			echo '({ "success": false, "reason": ' . JEncode($_withError[0], $lanbilling) . ' })';
		}
		else {
			echo '({ "success": false, "reason": ' . JEncode($_withError, $lanbilling) . ' })';
		}
	}
} // end saveLimitException()


/**
 * Save application form data
 * @param object, billing class
 * @param object, localize class
 */
function saveApplication( &$lanbilling, &$localize )
{
	$_withError = array();

	$_POST['executestart'] = trim($_POST['executestart']);
	$_POST['executefinal'] = trim($_POST['executefinal']);

	if(preg_match('/[\d]{4}\-[\d]{2}\-[\d]{2}/', $_POST['executestart'])) {
		$_t = array(
			sprintf("%02d", (integer)$_POST['executestart_hh']),
			sprintf("%02d", (integer)$_POST['executestart_mm']),
			"00"
		);

		$_POST['executestart'] = $_POST['executestart'] . ' ' . implode(':', $_t);
	}

	if(preg_match('/[\d]{4}\-[\d]{2}\-[\d]{2}/', $_POST['executefinal'])) {
		$_t = array(
			sprintf("%02d", (integer)$_POST['executefinal_hh']),
			sprintf("%02d", (integer)$_POST['executefinal_mm']),
			"00"
		);

		$_POST['executefinal'] = $_POST['executefinal'] . ' ' . implode(':', $_t);
	}

	$struct = array(
		"recordid" => (integer)$_POST['recordid'],
		"uid" => ((integer)$_POST['uid'] <= 0) ? 0 : (integer)$_POST['uid'],
		"username" => $_POST['username'],
		"executetime" => (integer)$_POST['executetime'],
		"alreadydone" => (integer)$_POST['alreadydone'],
		"apptypeid" => (integer)$_POST['apptypeid'],
		"statusid" => (integer)$_POST['statusid'],
		"responsibleid" => (integer)$_POST['responsibleid'],
		"responsible" => $_POST['responsible'],
		"executestart" => $_POST['executestart'],
		"executefinal" => $_POST['executefinal'],
		"task" => $_POST['task']
	);

	if(false == $lanbilling->save("insupdApplication", $struct, $struct['recordid'] ? false : true, array("getApplications"))) {
		$error = $lanbilling->soapLastError();
		if(preg_match('/WEEK_DAY_RESTRICTIONS_ERROR/i', $error->detail)) {
			$error->detail = "Exceeded limit for this type of applications on selected date";
		}
		$_withError[] = array($_POST['task'], $localize->get($error->detail));
	}

	if(empty($_withError)) {
		echo "({ success: true, reason: '" . $localize->get('Request done successfully') . "' })";
		if(isset($_SESSION['auth']['application'])) {
			unset($_SESSION['auth']['application']);
		}
	}
	else {
		if(sizeof($_withError) == 1) {
			echo "({ success: false, reason: " . JEncode($_withError[0][1], $lanbilling) . "})";
		}
		else {
			echo "({ success: false, reason: " . JEncode($_withError, $lanbilling) . "})";
		}
	}
} // end saveApplication()


/**
 * Clear save earlier cache
 * @param object, billing main class
 * @param object, localize class
 */
function clearFromCache( &$lanbilling, &$localize )
{
	$_withError = array();

	if(isset($_SESSION['auth']['application'])) {
		if((integer)$_SESSION['auth']['application']['uid'] > 0) {
			$_clear = false;
			if((integer)$_SESSION['auth']['application']['recordid'] > 0) {
				if( false !== ($result = $lanbilling->get("getApplications", array( "flt" => array("recordid" => $_SESSION['auth']['application']['recordid']) ))) ) {
					if(!empty($result) && $result->uid != $_SESSION['auth']['application']['uid']) {
						$_clear = true;
					}
				}
				else {
					$error = $lanbilling->soapLastError();
					$_withError[] = array('Can not get application data', $localize->get($error->detail));
				}
			}
			else {
				$_clear = true;
			}
			if(empty($_withError) && $_clear == true) {
				if( false !== ($result = $lanbilling->get("getAccount", array("id" => $_SESSION['auth']['application']['uid']))) ) {
					if((integer)$result->account->templ == 2) {
						if( false == $lanbilling->delete("delAccount", array("id" => $_SESSION['auth']['application']['uid']), array("getAccounts", "getAccount", "getApplications")) ) {
							$error = $lanbilling->soapLastError();
							$_withError[] = array('Cannot remove user: ' . $result->account->name, $localize->get($error->detail));
						}
					}
				}
				else {
					$error = $lanbilling->soapLastError();
					$_withError[] = array('Can not get user data', $localize->get($error->detail));
				}
			}
		}
	}

	if(empty($_withError)) {
		echo "({ success: true, reason: '" . $localize->get('Request done successfully') . "' })";
		if(isset($_SESSION['auth']['application'])) {
			unset($_SESSION['auth']['application']);
		}
	}
	else {
		if(sizeof($_withError) == 1) {
			echo "({ success: false, reason: " . JEncode($_withError[0][1], $lanbilling) . "})";
		}
		else {
			echo "({ success: false, reason: " . JEncode($_withError, $lanbilling) . "})";
		}
	}
} // end clearFromCache()


/**
 * Restore form cache
 * @param object, billing main class
 * @param object, localize class
 */
function restoreFormCache( &$lanbilling, &$localize )
{
	if(isset($_SESSION['auth']['application'])) {
		$_SESSION['auth']['application']['username'] = html_entity_decode($_SESSION['auth']['application']['username'], ENT_QUOTES, 'UTF-8');
		$_SESSION['auth']['application']['responsible'] = html_entity_decode($_SESSION['auth']['application']['responsible'], ENT_QUOTES, 'UTF-8');
		echo '({ "success": true, "data": ' . JEncode($_SESSION['auth']['application'], $lanbilling) . ' })';
	}
	else {
		echo '({ "success": false, "data": null })';
	}
} // end restoreFormCache()


/**
 * Save application form data to session cache for the future restore
 * @param	object, billing class,
 * @param	object, localize class
 */
function setFormCache( &$lanbilling, &$localize )
{
	if(isset($_SESSION['auth']['application'])) {
		$_SESSION['auth']['application'] = null;
	}

	$_SESSION['auth']['application'] = $_POST;

	echo '({ "success": true })';
} // end setFormCache()


/**
 * Return statuses list
 * @param	object, billing class
 * @param	object, localize class
 * @param	boolean,
 */
function getStatuses( &$lanbilling, &$localize, $nopost = false )
{
	$_tmp = array();

	$_filter = array(
		"groups" => 1
	);

	if( false != ($result = $lanbilling->get("getSbssStatuses", array( "flt" => $_filter)))) {
		if(!is_array($result)) {
			$result = array($result);
		}

		if($nopost) {
			return $result;
		}

		array_walk($result, create_function('$item, $key, $_tmp', '
			if($item->active != 1) {
				return;
			}
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
			if($item->payments == 1){
				return;
			};
			$_tmp[0][] = array(
				"personid" => $item->personid,
				"name" => $item->fio,
				"login" => $item->login,
				"descr" => $item->descr
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
 * Get history and comments list for the specified applications id
 * @param	object, billing class
 * @param	object, localize class
 */
function getComments( &$lanbilling, &$localize )
{
	$_tmp = array();

	$parseSystem = create_function('$text, &$lanbilling, &$localize', '
		$fixDate = create_function(\'$_date, &$lanbilling, &$localize\', \'
			return $_date;
			if(substr($_date, 0, 1) == 0 || substr($_date, 0, 1) == 9 || empty($_date)) {
				return $localize->get("Undefined");
			}
			else {
				return $lanbilling->formatDate($_date, "d.m.Y H:i");
			}
		\');
		$lines = preg_split("/\%\]\n/", $text, -1, PREG_SPLIT_NO_EMPTY);
		foreach($lines as $key => $item) {
			$item = preg_replace("/^[\n\t\s\r]+\[\%/", "", $item);
			$item = explode("%]:[%", $item);
			$item[0] = str_replace("[%", "", $item[0]);
			$lines[$key] = array(
				"name" => $item[0],
				"oldvalue" => $item[1],
				"newvalue" => $item[2],
			);
			switch($lines[$key]["name"]) {
				case "status": $lines[$key]["name"] = $localize->get("Status"); break;
				case "execute_start":
					$lines[$key]["oldvalue"] = $fixDate($lines[$key]["oldvalue"], $lanbilling, $localize);
					$lines[$key]["newvalue"] = $fixDate($lines[$key]["newvalue"], $lanbilling, $localize);
					$lines[$key]["name"] = $localize->get("Beginning");
				break;
				case "execute_final":
					$lines[$key]["oldvalue"] = $fixDate($lines[$key]["oldvalue"], $lanbilling, $localize);
					$lines[$key]["newvalue"] = $fixDate($lines[$key]["newvalue"], $lanbilling, $localize);
					 $lines[$key]["name"] = $localize->get("End");
				break;
				case "execute_time": $lines[$key]["name"] = $localize->get("Estimated time"); break;
				case "responsible": $lines[$key]["name"] = $localize->get("Responsible"); break;
				case "address": $lines[$key]["name"] = $localize->get("Address"); break;
				case "already_done": $lines[$key]["name"] = $localize->get("Already done") . " (%)"; break;
				case "task": $lines[$key]["name"] = $localize->get("Task"); break;
			}
		}
		return $lines;
	');

	if( false != ($result = $lanbilling->get("getAppComments", array( "flt" => array("appid" => (integer)$_POST['getcomments']) )))) {
		if(!is_array($result)) {
			$result = array($result);
		}

		array_walk($result, create_function('$item, $key, $_tmp', '
			if(false !== strpos($item->comments, "%]:[%")) {
				$item->comments = $_tmp[1]($item->comments, $_tmp[2], $_tmp[3]);
			}
			$item->created = $_tmp[2]->formatDate($item->created, "d.m.Y H:i");
			$_tmp[0][] = (array)$item;
		'), array( &$_tmp, &$parseSystem, &$lanbilling, &$localize ));
	}

	echo '({ "success": true, "data": ' . JEncode($_tmp, $lanbilling) . ' })';
} // end getComments()


/**
 * Save comment to DB
 * @param	object, billing class
 * @param	object, localize class
 */
function saveComment( &$lanbilling, &$localize )
{
	if(empty($_POST['comments']) || $_POST['comments'] == '<br>') {
		$_POST['getcomments'] = $struct['appid'];
		getComments($lanbilling, $localize);
		return;
	}

	$struct = array(
		"recordid" => (integer)$_POST['recordid'],
		"appid" => (integer)$_POST['appid'],
		"comments" => $_POST['comments'],
		"authorid" => $lanbilling->manager
	);

	if(false != $lanbilling->save("insupdAppComment", $struct, ($struct['recordid'] == 0) ? true : false, array("getAppComments"))) {
		$_POST['getcomments'] = $struct['appid'];
		getComments($lanbilling, $localize);
	}
	else {
		$error = $lanbilling->soapLastError();
		echo '({ "success": false, "reason": ' . JEncode($error->detail, $lanbilling) . ' })';
	}
} // end saveComment()


/**
 * Remove comment from DB
 * @param	object, billing class
 * @param	object, localize class
 */
function deleteComment( &$lanbilling, &$localize )
{
	if( false != $lanbilling->delete("delAppComment", array( "id" => (integer)$_POST['delappcomm'] ), array("getAppComments")) ) {
		$_POST['getcomments'] = $_POST['appid'];
		getComments($lanbilling, $localize);
	}
	else {
		$error = $lanbilling->soapLastError();
		$error = (empty($error->detail) ? $error->type : $error->detail);
		echo '({ "success": false, "reason": ' . JEncode($error, $lanbilling) . ' })';
	}
} // end deleteComment()


/**
 * Get document's templates
 * @param	object, billing class
 * @param object, localize class
 */
function getTemplDocs( &$lanbilling, &$localize )
{
	$_tmp = array();

	$_filter = array(
		"onfly" => 4
	);

	if( false != ($result = $lanbilling->get("getDocuments", array("flt" => $_filter, "md5" => $lanbilling->controlSum($_filter)))) ) {
		if(!is_array($result)) {
			$result = array($result);
		}

		array_walk($result, create_function('$item, $key, $_tmp', '
			$_tmp[0][] = (array)$item;
		'), array( &$_tmp ) );
	}

	if(sizeof($_tmp) > 0) {
		echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
	}
	else {
		echo "({ results: '' })";
	}
} // end getTemplDocs()


/**
 * Call server function to generate summary document based on template
 * @param	object, billing class
 * @param	object, localize class
 */
function createDocument( &$lanbilling, &$localize )
{
	if((integer)$_POST['getdocument'] == 0) {
		echo '({ "success": false, "reason": "' . $localize->get('Undefined') . ' \'' . $localize->get('Documents templates') . '\'" })';
		return false;
	}

	$struct = array(
		"docid" => (integer)$_POST['getdocument'],
		"flt" => array(),
		"applist" => array()
	);

	if(!empty($_POST['records'])) {
		array_walk($_POST['records'], create_function('$item, $key, $_tmp', '
			$_tmp[0][] = array(
				"val" => $item
			);
		'), array( &$struct['applist'] ));
	}
	else {
		$struct['flt'] = appFilter($lanbilling, $localize);
		if((integer)$_POST['limit'] == 0) {
			$struct['flt']['pgnum'] = 0;
			$struct['flt']['pgsize'] = 0;
		}
	}

	if( false != ($result = $lanbilling->get("genApplications", $struct))) {
		$_md5 = '';
		if(!empty($result)) {
			$_md5 = md5($result . $_POST['devision'] . $_POST['getdocument']);
			$_SESSION['auth']['downloads'][$_md5] = $result;
		}
		if( false != ($template = $lanbilling->get("getDocuments", array("flt" => array("docid" => (integer)$_POST['getdocument'])), true)) ) {
			$_file = explode('.', $template->doctemplate);
			$_file[0] = date('YmdH');
			$_file = implode('.', $_file);
		}
		echo '({ "success": true, "file": "'. $_md5 . '", "name": "' . $_file . '", "ext": "'. (($template->uploadext) ? $template->uploadext : '') . '" })';
	}
	else {
		$error = $lanbilling->soapLastError();
		echo '({ "success": false, "reason": "'. $localize->get($error->detail) . '" })';
	}
} // end createDocument()


/**
 * This function returns file stream on request to download created application document
 * @param	object, billing class
 * @param	object, localize class
 */
function streamDocument( &$lanbilling, &$localize )
{
	if(!isset($_SESSION['auth']['downloads'][$_POST['file']])) {
		getFileError($lanbilling, $localize, 1, $localize->get('Unauthorized request'));
	}
	else {
		if( false == $lanbilling->Download($_SESSION['auth']['downloads'][$_POST['file']], $_POST['name'], '', $_POST['ext']) ) {
			getFileError($lanbilling, $localize, 1, $_SESSION['auth']['downloads'][$_POST['file']]);
		}
	}

	$_SESSION['auth']['downloads'] = array();
} // end streamDocument()
?>