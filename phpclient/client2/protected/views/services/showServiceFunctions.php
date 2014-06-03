   <link rel="stylesheet" type="text/css" href="turbo-btn.css">
   <div id="turbo_shape">
   <iframe frameborder="0" vspace="0" hspace="0" marginwidth="0" marginheight="0" scrolling="no" src="./index.php?async_call=1&devision=4&fcall=iframe_turbo_btn&banner="></iframe>
   </div>

<?
$lanbilling = $this->lanbilling;

//register_shutdown_function('onfatal', $lanbilling);


//var_dump($lanbilling)





if(isset($_POST['async_call']))
{
	// Asynchronous call can be made only to the one specified service function
	if(!empty($_POST['fcall'])) {
		// Get available funtions list
		$func = showServiceFunctions($lanbilling, $tpl);
		if(!empty($func['embed']))
		{
			foreach($func['embed'] as $item) {
				if($_POST['fcall'] != $item) {
					continue;
				}

				(file_exists('services/' . $item . '.php') && include('services/' . $item . '.php')) ||
					($lanbilling->isConstant("FILE_DEBUG") == true && $lanbilling->ErrorHandler(__FILE__, sprintf("File services/%s.php does not exist", $item)));
			}
		}
	}
}
// There is standard query
else
{
	// Show available functions
	$func = showServiceFunctions($lanbilling);
	//
	//if($lanbilling->isConstant('SERVICES_NOT_IFRAME_SHOW')) {
	//	$tpl->loadTemplatefile("services.tpl",true, true);
	//	$tpl->setVariable("USERID", (integer)$lanbilling->clientInfo->account->uid);
	//
	//	// Build vglist
	//	buildVgroups($lanbilling, $tpl);
	//
	//	// Functions
	//	foreach($func['standard'] as $item) {
	//		$tpl->setCurrentBlock('ServItem');
	//		$tpl->setVariable("FILENAME", $item->savedfile);
	//		$tpl->setVariable("SERVICEDESCR", $item->descr);
	//		$tpl->parseCurrentBlock();
	//	}
	//
	//	// Parse template
	//	$lanbilling->localize->compile($tpl->get(), true);
	//}

	if(!empty($func['embed']))
	{
		foreach($func['embed'] as $item) {
			if(!empty($_POST['fcall'])) {
				if($_POST['fcall'] != $item) {
					continue;
				}
			}
			(file_exists('services/' . $item . '.php') && include('services/' . $item . '.php')) ||
				($lanbilling->isConstant("FILE_DEBUG") == true && $lanbilling->ErrorHandler(__FILE__, sprintf("File services/%s.php does not exist", $item)));
		}
	}
}



/**
 * Catch fatal message when sript execution was stopped
 * @param	object, billing class
 */
function onfatal( &$handler ) {
	$last_error = error_get_last();
	if(in_array($last_error['type'], array(E_ERROR, E_PARSE))) {
		// fatal error
		$handler->ErrorHandler($last_error['file'], $last_error['message'], $last_error['line']);
	}
}
/**
 * Get Vgroup dor the selected user
 * @param	object, billing class
 * @param	object, template class
 */
function buildVgroups( &$lanbilling, &$tpl )
{
	$accVg = array();
	if( false != ($result = $lanbilling->get("getClientVgroups", array("id" => (integer)$lanbilling->clientInfo->account->uid))) )
	{
		if(!empty($result))
		{
			if(!is_array($result)) {
				$result = array($result);
			}

			foreach($result as $item)
			{
				$tpl->setCurrentBlock('vgOpt');
				$tpl->setVariable("VGOPTID", $item->vgroup->vgid);
				$tpl->setVariable("VGOPTNAME", $item->vgroup->login);
				$tpl->parse('vgOpt');
			}
		}
	}

	return $accVg;;
} // end buildVgroups()


/**
 * Show service function for the client
 * @param	object, billing class
 */
function showServiceFunctions( &$lanbilling )
{
	$data = array(
		"embed" => array(),
		"standard" => array()
	);

	if(false != ($result = $lanbilling->get("getClientServFuncs")))
	{
		if(!is_array($result)) {
			$result = array($result);
		}

		foreach($result as $item)
		{
			if(strpos($item->savedfile, 'iframe') !== false) {
				$data['embed'][] = $item->savedfile;
			}
			else {
				$data['standard'][] = $item;
			}
		}
	}

	return $data;
} // end

