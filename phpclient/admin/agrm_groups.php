<?php
/**
 * View Agreements Groups panel. Create nee, edit existing
 *
 */

if(isset($_POST['async_call']))
{
    // Groups list
	if(isset($_POST['getagrmgroups'])) {
		getAgrmGroupsList($lanbilling, $localize);
	}
	 // Agremments list for second d'n'd grid
	if(isset($_POST['getagrmlist'])) {
		getAgrmList($lanbilling, $localize);
	}
	
	if(isset($_POST['setagrmgroup'])) {
		setAgrmGroup($lanbilling, $localize);
	}
	
	if(isset($_POST['delagrmgroup'])) {
		delAgrmGroup($lanbilling, $localize);
	}
	
	if(isset($_POST['setagrmgroupstaff'])) {
		setAgrmGroupStaff($lanbilling, $localize);
	}
	
	if(isset($_POST['delagrmgroupstaff'])) {
		delAgrmGroupStaff($lanbilling, $localize);
	} 
	
	if(isset($_POST['candeldebt'])) {
		agrmGroupCancelDebt($lanbilling, $localize);
	}
	
	if(isset($_POST['getagrmaddons'])) {
		getAgrmAddons($lanbilling, $localize);
	}
	
	if(isset($_POST['setgroupaddon'])) {
		setGroupAddon($lanbilling, $localize);
	}
}
// There is standart query
else
{
	$tpl = new HTML_Template_IT(TPLS_PATH);
	showAgrmGroupsPanel($lanbilling, $tpl);
	$localize->compile($tpl->get(), true);
}


/**
 * Build and show agrm groups panel
 * @param	object, billing class
 * @param	object, template class
 */
function showAgrmGroupsPanel( &$lanbilling, &$tpl )
{
	$tpl->loadTemplatefile("agrm_groups.tpl", true, true);
	$tpl->touchBlock("__global__");
	$tpl->setVariable("IFUSECERBER", (integer)$lanbilling->getLicenseFlag('usecerber'));
} // end showAgrmGroupsPanel()


/**
 * Get agreements groups list
 * @param	object, billing class
 * @param	object, localization class
 */
function getAgrmGroupsList( &$lanbilling, &$localize )
{
    try {	
		// Параметр vgroups не должен присутствовать в выходном списке результата, однако он все равно там есть, пусть и нулевой
		// только потому что из API его удалить никто не пожелал
						
		if( false === ($result = $lanbilling->get("getAgrmGroups", array() ))) {
			throw new Exception ($lanbilling->soapLastError()->detail);
		}
        if(!$result) $result = array();
		if(!is_array($result)) $result = array($result);
		for($i=0; $i<count($result);$i++) { // for $i конструкция для возможности назначения доп. параметра в элемент массива
			if((int)$result[$i]->groupid == 0) continue;
			$result[$i]->id = $result[$i]->groupid;
			$_filter = array('groupid' => (int)$result[$i]->groupid);
			$_md5 = $lanbilling->controlSum($_filter);
			$result[$i]->agrms = $lanbilling->get("Count", array("flt" => $_filter, "procname" => "getAgrmGroupStaff", "md5" => $_md5));
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
            "error" => null,
            "results" => (array)$result
        );
    }

    echo "(" . JEncode($_response, $lanbilling) . ")";
} // end getAgrmGroupsList()



/**
 * Get the list of agreements
 * @param	object, main billing class
 * @param	object, localize class
 */
function getAgrmList( &$lanbilling, &$localize )
{
	try {
		$_tmp = array();
		$_filter = array();

		if((int)$_POST['groupid']>0) {
			$_filter['groupid'] = (int)$_POST['groupid'];
		} 

		if((int)$_POST['notgroup']>0) {
			$_filter['notgroups'] = (int)$_POST['notgroup'];
		} 
		
		
		$_filter['pgsize'] = ((integer)$_POST['limit'] <= 0) ? 100 : $_POST['limit'];
		$_filter['pgnum'] = $lanbilling->linesAsPageNum($_filter['pgsize'], (integer)$_POST['start'] + 1);
		
		$_md5 = $lanbilling->controlSum($_filter);
		$_count = $lanbilling->get("Count", array("flt" => $_filter, "procname" => "getAgrmGroupStaff", "md5" => $_md5));
		
		if(false === ($result = $lanbilling->get("getAgrmGroupStaff", array("flt" => $_filter)))) {
			throw new Exception($lanbilling->soapLastError()->detail);
		}
		if(!is_array($result)) {
			$result = array($result);
		}
		if($_count == 0) $result = array();
		foreach($result as $key => $item) {
			$_tmp[] = array(
				"agrmid" => $item->id,
				"number" => $item->number
			);
		}		
	}
	catch(Exception $error) {
		$_response = array(
			"success" => false,
			"error" => $error->getMessage(),
			"total" => 0,
			"results" => array()
		);
	}

	if(!$_response) {
		$_response = array(
			"success" => true,
			"error" => null,
			"total" => $_count,
			"results" => $_tmp
		);
	}

	echo '(' . JEncode($_response, $lanbilling) . ')';
} // end getAgrmList()


/**
 * Set agreements group
 * @param	object, billing class
 * @param	object, localization class
 */
function setAgrmGroup( &$lanbilling, &$localize )
{
    try {		
		$struct = array(
			'groupid' => (int)$_POST['groupid'],
			'name' => $_POST['name'],
			'descr' => $_POST['descr']
		);

        if( false == $lanbilling->save("setAgrmGroup", $struct) ) {
            throw new Exception($lanbilling->soapLastError()->detail);
        }
		$ret = $lanbilling->saveReturns->ret;
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
            "error" => null,
            "results" => $ret
        );
    }

    echo "(" . JEncode($_response, $lanbilling) . ")";
} // end setAgrmGroup()



/**
 * Remove agreements group from DB
 * @param	object, billing class
 * @param	object, localization class
 */
function delAgrmGroup( &$lanbilling, &$localize )
{
    try {		
        if( false == $lanbilling->get("delAgrmGroup", array('id' => (int)$_POST['delagrmgroup']) )) {
            throw new Exception($lanbilling->soapLastError()->detail);
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
            "error" => null,
            "results" => $ret
        );
    }

    echo "(" . JEncode($_response, $lanbilling) . ")";
} // end delAgrmGroup()



/**
 * Set agreements group staff
 * @param	object, billing class
 * @param	object, localization class
 */
function setAgrmGroupStaff( &$lanbilling, &$localize )
{
    try {		
		if((int)$_POST['fromfile']>0) {
	        if( false == ($files = $lanbilling->UploadCheck('upcontent')) ) {
	            throw new Exception($localize->get("Select file to upload"));
	        }
			
            $struct = array("agrmnumber");
            $data = $lanbilling->csvFileToArray($files[0]['tmp_name'], 1, $struct);
			
			
			$numbers = array();
			foreach($data as $item) {
				array_push($numbers, $item['agrmnumber']);
			}

		} else {
			$numbers = explode(',', $_POST['number']);
			array_pop($numbers);
		}		
		
		$failedAgrmIds = array();
		foreach($numbers as $number) {
			$struct = array(
				'groupid' => (int)$_POST['groupid'],
				'agrmnumber' => $number
			);
			
			if( false == $lanbilling->get("setAgrmGroupStaff", $struct) ) {
				$error = $lanbilling->soapLastError();
				if(preg_match("~No agreement for agrm_number .*~is ",$error->detail, $matches)){
					$failedAgrmIds[] = str_replace('No agreement for agrm_number ', '', $error->detail);
				} else { 
					throw new Exception($localize->get($error->detail));
				}
				
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
            "error" => null,
        	"failedAgrmIds" => $failedAgrmIds
        );
    }

    echo "(" . JEncode($_response, $lanbilling) . ")";
} // end setAgrmGroup()


/**
 * Delete assigned agreements from group
 * @param	object, billing class
 * @param	object, localization class
 */
function delAgrmGroupStaff( &$lanbilling, &$localize )
{
    try {		

		$numbers = explode(',', $_POST['number']);
		array_pop($numbers);
	
		foreach($numbers as $number) {
			$struct = array(
				'groupid' => (int)$_POST['groupid'],
				'agrmnumber' => $number
			);

	        if( false == $lanbilling->get("delAgrmGroupStaff", $struct) ) {
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

    echo "(" . JEncode($_response, $lanbilling) . ")";
} // end delAgrmGroupStaff()


/**
 * Set payments for agreements group
 * @param	object, billing class
 * @param	object, localization class
 */
function agrmGroupCancelDebt( &$lanbilling, &$localize )
{
    try {
		$struct = array(
			'groupid' => (int)$_POST['groupid'],
			'classid' => (int)$_POST['payclass'],
			'comment' => $_POST['paycomment'],
			'paydate' => $_POST['paydate']
		);

		if( false == $lanbilling->get("agrmGroupCancelDebt", $struct) ) {
			throw new Exception($lanbilling->soapLastError()->detail);
		}
		$ret = $lanbilling->saveReturns->ret;
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

    echo "(" . JEncode($_response, $lanbilling) . ")";
} // end agrmGroupCancelDebt()

/**
 * Get agreement additional field values by field name
 * @param	object, billing class
 * @param	object, localization class
 */
function getAgrmAddons( &$lanbilling, &$localize )
{
    try {

	    if(!empty($_POST['fname'])) {
	        $_filter['name'] = $_POST['fname'];
	    }

	    if( false != ($result = $lanbilling->get("getAgreementsAddonsSet", array('flt' => $_filter))) )
	    {
			$_tmp = array();
			if(!empty($result->staff)) {
				$_tmp = $result->staff;
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
            "error" => null,
			"results" => $_tmp
        );
    }

    echo "(" . JEncode($_response, $lanbilling) . ")";
} // end getAgrmAddons()


/**
 * Set payments for agreements group
 * @param	object, billing class
 * @param	object, localization class
 */
function setGroupAddon( &$lanbilling, &$localize )
{
    try {
		$struct = array(
			'groupid' => (int)$_POST['groupid'],
			'name' => $_POST['addonname'],
			'strvalue' => (!empty($_POST['nametext'])) ? $_POST['nametext'] : $_POST['addonvalue']
		);
		
		if((int)$_POST['idx'] > 0) {
			$struct['idx'] = (int)$_POST['idx'];
		}

		if( false == $lanbilling->get("setAgreementsGroupAddon", $struct) ) {
			throw new Exception($lanbilling->soapLastError()->detail);
		}
		$ret = $lanbilling->saveReturns->ret;
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

    echo "(" . JEncode($_response, $lanbilling) . ")";
} // end setGroupAddon()
