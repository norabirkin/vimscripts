<?php
/**
 * View Vgroups (accounts) list. Create nee, edit existing
 *
 */

// There is background query
// TODO:  "for new" market functions for the new form
if(isset($_POST['async_call']))
{
	
	// Link IP class
	if($lanbilling->ifIncluded("ip_calc_compare.php") == false)
		include_once("ip_calc_compare.php");
    
    // Modules ist route
	if(isset($_POST['getmodules'])) {
		getModules($lanbilling, $localize);
	}
    
    // Simple users list route
    if(isset($_POST['getuseronfly'])) {
        getUserOnFly($lanbilling, $localize);
    }
    
    // Simple agreements list route
    if(isset($_POST['getagrmonfly'])) {
        getAgrmOnFly($lanbilling, $localize);
    }
    
    // Return generated password route
    if(isset($_POST['getrandompass'])) {
        getRandomPass($lanbilling, $localize);
    }
    
    // Simple vgroups list route
    if(isset($_POST['getvgidonfly'])) {
        getVgidOnFly($lanbilling, $localize);
    }
    
    // More complex vgroup data route
    if(isset($_POST['getvgroup']) && (integer)$_POST['getvgroup'] > 0) {
        getVgroup($lanbilling, $localize);
    }
    
    // Save vgroup data route
    if(isset($_POST['setvgroup'])) {
        setVgroup($lanbilling, $localize);
    }
    
    // Document template route
    if(isset($_POST['getdoctpls'])) {
        getDocTpls($lanbilling, $localize);
    }
    
    // Telephony tariff discounts route
    if(isset($_POST['getteldisc'])) {
        getTelDisc($lanbilling, $localize);
    }
    
    // Tariffs scheduling route
    if(isset($_POST['gettarhistory'])) {
        getTarHistory($lanbilling, $localize);
    }
    
    // Save single tariff for the vgroup
    if(isset($_POST['settarrasp'])) {
        setTarRasp($lanbilling, $localize);
    }
    
    // Remove tarif rasp route
    if(isset($_POST['deltarrasp'])) {
        delTarifsRasp($lanbilling, $localize);
    }
    
    // Vg blocks route
    if(isset($_POST['getvgblocks'])) {
        getVgBlocks($lanbilling, $localize);
    }
    
    // Save vgroup block event
    if(isset($_POST['setvgblock'])) {
        setVgBlock($lanbilling, $localize);
    }
    
    // Remove block record from scheduler
    if(isset($_POST['delblkrasp'])) {
        delBlkRasp($lanbilling, $localize);
    }

    // Vgroup telephony route
    if(isset($_POST['gettelstaff'])) {
        getTelStaff($lanbilling, $localize);
    }

    // Save telephony staff
    if(isset($_POST['settelstaff'])) {
        setTelStaff($lanbilling, $localize);
    }

    // Remove telephony staff
    if(isset($_POST['deltelstaff'])) {
        delTelStaff($lanbilling, $localize);
    }
    
    // Check if there is access for the manager to go to user form
    if(isset($_POST['getifuser'])) {
        getIfUser($lanbilling, $localize);
    }
	
	// Check if there is access for the manager to go to getting tariff
    if(isset($_POST['getiftarif'])) {
        getIfTarif($lanbilling, $localize);
    }
    
	if(isset($_POST['getvgroups'])) {
		getVgroups($lanbilling);
		
	}

	if(isset($_POST['gettarifs'])) {
		getTarifs($lanbilling);
	}

	if(isset($_POST['assign'])) {
		if( $_POST['assign'] == 0 ) { setRecount($lanbilling);      }   // установка перерасчета объединению
		if( $_POST['assign'] == 1 ) { setTarif($lanbilling);        }   // установка тарифа объединению
		if( $_POST['assign'] == 2 ) { setSuspension($lanbilling);   }   // установка приостановки объединению
		if( $_POST['assign'] == 3 ) { setUsboxService($lanbilling); }   // установка услуги объединению
	}

	if(isset($_POST['getagrms'])) {
		getAgreements($lanbilling);
    }

	if(isset($_POST['getips'])) {
		getIpList($lanbilling);
	}
	

	if(isset($_POST['get_ifindex'])) {
		getIfIndex($lanbilling);
	}

	if(isset($_POST['getsegments'])) {
		getModuleSegments($lanbilling);
	}

	if(isset($_POST['getipfree'])) {
		getFreeSegments($lanbilling);
	}

	if(isset($_POST['getmacs'])) {
		getMACList($lanbilling);
	}

    if(isset($_POST['getaslist'])) {
        getASList($lanbilling);
    }

	if(isset($_POST['getphones'])) {
		getPhoneNumbers($lanbilling);
	}

	if(isset($_POST['lockcommand'])) {
		sendLockCommand($lanbilling, $localize);
	}

	if(isset($_POST['delvgid'])) {
		deleteVgroup($lanbilling, $localize);
	}

	if(isset($_POST['getvfrmfds'])) {
		getVgFormFields($lanbilling);
	}

	if(isset($_POST['setvfrmfds'])) {
		saveVgFormField($lanbilling);
	}

	if(isset($_POST['delvfrmfds'])) {
		delVgFormFields($lanbilling);
	}

	if(isset($_POST['validateform'])) {
		validateFormBefore($lanbilling, $localize);
	}

	if(isset($_POST['getvgservices'])) {
		getTariffCategories($lanbilling, $localize);
	}

	if(isset($_POST['getMultitarifs'])) {
		getMultitarifs($lanbilling, $localize);
	}
	if(isset($_POST['insupdMultitarif'])) {
		insupdMultitarif($lanbilling, $localize);
	}
	if(isset($_POST['delMultitarif'])) {
		delMultitarif($lanbilling, $localize);
	}
	
	if(isset($_POST['getaddonsvalues'])) {
		getVgroupAddons($lanbilling, $localize);
	}
	
	if(isset($_POST['setaddonsvalues'])) {
		setVgroupAddons($lanbilling, $localize);
	}

	if(isset($_POST['getActionsList'])) {
		getActionsList($lanbilling);
	}
    if(isset($_POST['getUserActions'])) {
		getUserActions($lanbilling, $localize);
	}
	if(isset($_POST['insUpdAction'])) {
		insUpdAction($lanbilling);
	}
	if(isset($_POST['delActions'])) {
		delActions($lanbilling, $localize);
	}
	
	if(isset($_POST['getstaff']) && (int)$_POST['setstaffport']==0) {
		getStaff($lanbilling, $localize);
	}
	
	if(isset($_POST['getstaffas'])) {
		getStaffAS($lanbilling, $localize);
	}
	
	if(isset($_POST['setstaff'])) {
		setStaff($lanbilling, $localize);
	}
	
	if(isset($_POST['setstaffas'])) {
		setStaffAS($lanbilling, $localize);
	}
	
	if(isset($_POST['setstaffport']) && (int)$_POST['getstaff']==0) {
		setStaffPort($lanbilling, $localize);
	}
	
	if(isset($_POST['getmacstaff'])) {
		getMacStaff($lanbilling, $localize);
	}
	
	if(isset($_POST['setmacstaff'])) {
		setMacStaff($lanbilling, $localize);
	}
}
// There is standart query
else
{
	$tpl = new HTML_Template_IT(TPLS_PATH);

	if(isset($_POST['save'])) {
		if(saveVgroup($lanbilling, $localize)) {
			// Show ok message
			define("ERRORSTATE", false);
		}
		else {
			// Show error message
			define("ERRORSTATE", true);
		}
	}

	if(isset($_POST['vgid']) || (integer)$_POST['vgroupbytpl'] > 0) {
		if((integer)$_POST['vgroupbytpl'] > 0) { unset($_POST['templ']); }
		showVgroupForm($lanbilling, $localize, $tpl);
	}
	else showVgroupsList($lanbilling, $tpl);

	$localize->compile($tpl->get(), true);
}


/**
 * Build and show vgroups list
 * @param	object, billing class
 * @param	object, template class
 */
function showVgroupsList( &$lanbilling, &$tpl )
{
	$tpl->loadTemplatefile("vgroupslist.tpl", true, true);
	$tpl->touchBlock("__global__");
	$tpl->setVariable("IFUSECERBER", (integer)$lanbilling->getLicenseFlag('usecerber'));
	$tpl->setVariable('AUTOLOAD', (integer)$lanbilling->Option('autoload_accounts'));
} // end showVgroupsList()


/**
 * Show virtual group template form to create new or edit existing
 * @param   object, billing class
 * @param   object, template class
 */
function showVgroupForm( &$lanbilling, &$localize, &$tpl )
{
	
	if(!empty($_POST['address_str'])) {
		if($lanbilling->clearAddress($_POST['address_str'][1]) != '') {
			$aStr = $lanbilling->clearAddress($_POST['address_str'][1]);
			$aCode = $_POST['address_idx'][1];
		} else if($lanbilling->clearAddress($_POST['address_str'][1]) == '' && $lanbilling->clearAddress($_POST['address_str'][0]) != '') {
			$aStr = $lanbilling->clearAddress($_POST['address_str'][0]);
			$aCode = $_POST['address_idx'][0];
		} else { 
			$aStr = $lanbilling->clearAddress($_POST['address_str'][2]);
			$aCode = $_POST['address_idx'][2];
		}
	}
	
	
    $tpl->loadTemplatefile("vgroup.tpl", true, true);
    $tpl->touchBlock("__global__");
    $tpl->setVariable("IFUSECERBER", (integer)$lanbilling->getLicenseFlag('usecerber'));
	$tpl->setVariable('ADDRSTR', (string)$aStr);
	$tpl->setVariable('ADDRCODE', (string)$aCode);
    $tpl->setVariable('VGTPL', (integer)$_POST['vgroupbytpl']);
    $tpl->setVariable('VGID', (integer)$_POST['vgid']);
    $tpl->setVariable('MODULEID', (integer)$_POST['modCMB']);
    $tpl->setVariable('UID', (integer)$_POST['uid']);
    $tpl->setVariable('USERNAME', (integer)$_POST['uid'] > 0 ? htmlentities((string)$_POST['name'], ENT_QUOTES, "UTF-8") : "");
    $tpl->setVariable('TEMPLATEVLUE', (integer)$_POST['templ']);
    define("IS_TEMPLATE", (integer)$_POST['templ']);

	
    if(false != ($opt = $lanbilling->get("getOptions"))) {       
		foreach($opt as $n) {
			if($n->name != 'acc_pass_symb') continue;
			else $tpl->setVariable("REGPASS", $n->value);
		}
	}
	
    if(IS_TEMPLATE > 0) {
		$tpl->touchBlock("ifTemplTitle");

		if(IS_TEMPLATE > 1) {
			// User and agreement linked to this vgroup
			
			parseUserData($lanbilling, $tpl);
			// Vgroup access attributes
			parseVgAccess($lanbilling, $tpl);
		}
	}
	
	if(IS_TEMPLATE < 1) {
		// User and agreement linked to this vgroup
		
		parseUserData($lanbilling, $tpl);
		// Vgroup access attributes
		parseVgAccess($lanbilling, $tpl);
	}

	if(IS_TEMPLATE > 0) {

		// Show control to go back to application
		if(IS_TEMPLATE == 2) {
			$tpl->touchBlock("returnApplications");
		}
	}
	
	// Show control go back users and accounts list
	if(IS_TEMPLATE < 2) {
		if($lanbilling->getAccess('users') > 0) {
			$tpl->touchBlock('returnUsersList');
		}

		if($lanbilling->getAccess('accounts') > 0) {
			$tpl->touchBlock('returnAccList');
		}
	}
} // end showVgroupForm()


/**
 * Define module type constant according to the module id
 * @param   object, billing class
 */
function declareModuleType( &$lanbilling, $id )
{
    try {
        if(false == ($result = $lanbilling->get('getAgentsExt', array('flt' => array(
            "id" => $id
        )))))
        {
            throw new Exception($localize->get($lanbilling->soapLastError()->detail));
        }
        
        switch((integer)$result->agent->type)
        {
            case 1: case 2:
            case 3: case 4:
            case 5:
                define('LEASEDLINE', 1);
            break;
            
            case 6:
                define('RADIUSDIALUP', 1);
            break;
            
            case 7: case 8:
            case 9: case 10:
            case 11:
                define('TELEPHONY', 1);
            break;
            
            case 12:
                define('VOICEIP', 1);
            break;
            
            case 13:
                define('USBOX', 1);
            break;
        }
    }
    catch(Exception $error)
    {
        define('LEASEDLINE', 0);
        define('RADIUSDIALUP', 0);
        define('TELEPHONY', 0);
        define('VOICEIP', 0);
        define('USBOX', 0);
    }
} // end declareModuleType()


/**
 * Returns vgroup form data
 * @param	object, billing class
 * @param	object, localize class
 */
function getVgroup( &$lanbilling, &$localize)
{
    try {
    	if( false == ($result = $lanbilling->get("getVgroup2", array("id" => (integer)$_POST['vgid']))) )
        {
            throw new Exception($localize->get($lanbilling->soapLastError()->detail));
        }
		
        $struct = (array)$result->vgroup;
		$struct['openpass'] = $struct['pass'];
        $struct['moduleid'] = $result->vgroup->id;
        $struct['moduledescr'] = $result->agentname;
        $struct['username'] = $result->username;
        $struct['agrmnum'] = $result->agrmnum;
        $struct['parentlogin'] = $result->vgroup->parentvglogin;
		$struct['accondate'] = $result->vgroup->accondate; 
        $struct['connecteduid'] = $result->vgroup->connectedfrom;
        $struct['connectedname'] = $result->connectedfromname;
        $struct['modulereadonly'] = 1;
        $struct['agrmreadonly'] = (integer)$lanbilling->Option("disable_change_user_agreement");
        $struct['ccrypt'] = $result->vgroup->cuid;

        if($result->addresses) {
            $struct['vgaddrcode'] = $result->addresses->code;
            $struct['vgaddrstr'] = $result->addresses->address;
        }
        
        // Useful to know module type
        if( false === ($module = $lanbilling->get("getAgents", array("flt" => array(
            "agentid" => $result->vgroup->id
        )))) )
        {
            throw new Exception ($lanbilling->soapLastError()->detail);
        }
		
        $struct['moduletype'] = $module->data;

        // Complete object with tariff information
        if( false === ($tarif = $lanbilling->get("getTarifsExt2", array("flt" => array(
            "tarid" => (integer)$result->vgroup->tarid,
            "common" => -1
        )))) )
        {
            throw new Exception ($lanbilling->soapLastError()->detail);
        }
        
        $struct['tardescr'] = isset($tarif->tarif->descr) && $tarif->tarif->descr!='' ? $tarif->tarif->descr : $result->tarname; 
        $struct['tarrent'] = $tarif->tarif->rent;
        $struct['dailyrent'] = $tarif->tarif->dailyrent;
        $struct['actblock'] = $tarif->tarif->actblock;
        $struct['tarshape'] = $tarif->tarif->shape;
        
        
        if( false == ($opt = $lanbilling->get("getOptions")) )
        {
            throw new Exception($localize->get($lanbilling->soapLastError()->detail));
        }
        
        foreach($opt as $n) {
			if($n->name != 'acc_pass_symb') continue;
			else $struct['regpass'] = $n->value;
		}

		$struct['hidepass'] = $lanbilling->getAccess('openpass') >= 1 ? 0 : 1;
        
        // Agreement
		if((int)$result->vgroup->agrmid > 0) {
			if( false === ($agrm = $lanbilling->get("getAgreements", array("flt" => array(
				"agrmid" => $result->vgroup->agrmid
			)))) ) {
				throw new Exception ($lanbilling->soapLastError()->detail);
			}
		}
		
		if (false != ($Aopt = $lanbilling->get("getAgentOptions", array('flt' => array("agentid" => (int)$struct['moduleid']))))) {
            $_tmp = array();
            
            if(!empty($Aopt)) {
                array_walk($Aopt, create_function('$item, $key, $_tmp', '
                    $_tmp[0][$item->name]["value"] = $item->value;
                    $_tmp[0][$item->name]["descr"] = $item->descr;
                '), array( &$_tmp ));
            }
						
			if($_tmp['use_cas']['value'] == 1 && $_tmp['use_smartcards']['value'] == 1) {
				$struct['usecas'] = 1;
			} else {
				$struct['usecas'] = 0;
			}
			
		}
		
		if($agrm) {
			$struct['balance'] = sprintf("%s %s", number_format($agrm->balance, 2, '.', ''), $agrm->symbol);
		}        
        
        // Clear garbage
        unset($struct['id'], $struct['connectedfrom']);
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
            "data" => (array)$struct,
            "full" => $agrm
        );
    }

    echo "(" . JEncode($_response, $lanbilling) . ")";
} // end getVgroup()


/**
 * Save common vgroup data
 * @param   object, billing class
 * @param   object, localize
 */
function setVgroup( &$lanbilling, &$localize )
{
    try {
        declareModuleType($lanbilling, (integer)$_POST['moduleid']);
		// Create vgroup by using template
		if($_POST['vgtpl'] != 0) {
			$_POST['vgid'] = 0;
			$_POST['templ'] = 0;
			$_POST['tardisc'] = 1;
		}
        // Get common data to compare if vgroup is not new
        if((integer)$_POST['vgid'] > 0) {
            if( false == ($vgroup = $lanbilling->get("getVgroup2", array("id" => (integer)$_POST['vgid']))) )
            {
                throw new Exception($localize->get($lanbilling->soapLastError()->detail));
            }
        }
		
		// get password length option
		// @38083
        if( false == ($passLength = $lanbilling->get("getOptionByName", array("name" => "pass_length"))) )
        {
            throw new Exception($localize->get($lanbilling->soapLastError()->detail));
        }
		
		$pwd = isset($_POST['passtype']) && $_POST['passtype']==1 ? (string)$_POST['openpass'] : (string)$_POST['pass'];
		
		if(strlen($pwd) < $passLength->value) {
			throw new Exception($localize->get("Minimal password length is") . " " . $passLength->value .' '. $localize->get("symbols"). "<br>" . $localize->get("Data not saved"));
		}
		
        $struct = array("vgroup" => array(
            "templ" => (integer)$_POST['templ'],            
            "vgid" => (integer)$_POST['vgid'],
            "descr" => (string)$_POST['descr'],
            "login" => (string)$_POST['login'],
            "pass" => (string)$pwd, 
            "agrmid" => (integer)$_POST['agrmid'],
            "id" => (integer)$_POST['moduleid'],
            "tarid" => (integer)$_POST['tarid'],
            "shape" => (integer)$_POST['shape'],
            "maxsessions" => (integer)$_POST['maxsessions'],
            "ipdet" => (integer)$_POST['ipdet'],
            "portdet" => (integer)$_POST['portdet'],
            "cuid" => 0,
            
            /**
             * TODO: браданные из инвентори формы
             */
            //"ifindex" => (integer)$_POST['ifindex'],
            
            "connectedfrom" => (integer)$_POST['connecteduid'],
            "parentvgid" => (integer)$_POST['parentvgid']
        ));
        
        if(USBOX && $lanbilling->Option('use_cerbercrypt') == 1)
        {
            $struct["vgroup"]["cuid"] = (integer)$_POST['ccrypt'];
        }

        // Only if vgroup is new or if there was changed module
        if((integer)$_POST['vgid'] == 0 || ((integer)$_POST['vgid'] > 0 && (integer)$_POST['moduleid'] != $vgroup->vgroup->id)) {
            $struct["vgroup"]["tarid"] = (integer)$_POST['tarid'];
            
            if(isset($_POST['catdisc']) && is_array($_POST['catdisc']) && !empty($_POST['catdisc'])) {
                array_walk($_POST['catdisc'], create_function('&$item', '
                    $A = array(
                        "catidx" => $item["catidx"],
                        "above" => $item["type"] ? 0 : $item["value"],
                        "rate" => $item["type"] ? (1 - $item["value"]/100) : 1,
                        "includes" => $item["includes"],
						"discount" => $item["type"] ? 0 : $item["value"]
                    );
                    
                    $item = $A;
                '));
            }
            else {
                $_POST['catdisc'] = array();
            }
            
            $struct["tarrasp"][] = array(
                "recordid" => 0,
                "vgid" => (integer)$_POST['vgid'],
                "groupid" => 0,
                "id" => (integer)$_POST['moduleid'],
                "taridnew" => (integer)$_POST['tarid'],
                "taridold" => 0,
                "requestby" => $lanbilling->manager,
				'changetime' => !empty($_POST['tartime']) ? $_POST['tartime'] : date('Y-m-d') . ' 00:00:00',
                'discount'  => (float)$_POST['tardisc'],
                'catdiscounts' => (array)$_POST['catdisc']
            );
        }
        
        $struct['addresses'] = array(
            'type' => 0,
            'code' => (string)$_POST['vgaddrcode'],
            'address' => ''
        );

        if(false == $lanbilling->save("insupdVgroup2", $struct, (integer)$_POST['vgid'] == 0 ? true : false)) {
            $error = $lanbilling->soapLastError();
            if (preg_match("~There is period lock.*(\d{4}\-\d{2}\-\d{2})~is",$error->detail, $matches)){
                $msg = '<br/>' . $localize->get('Period is locked') . '! ' . $localize->get('You cannot make changes before then') . ' ' . $matches[1];
            } elseif(preg_match("~vgroup for self.*~is",$error->detail)) {
                $msg = '<br/>' . $localize->get('This account could not be parent at the same time') . '!';
            } elseif (strpos($error->detail, 'ERROR_INVALID_CURRENCY_IN_TARIFF') !== false) {
                $msg = $localize->get('Tariff is not set') . '!';
            } 
			elseif (strpos($error->detail, 'has the assigned usbox_services') !== false) {
                $msg = $localize->get("Before start action services should be finished");
            }
			elseif (strpos($error->detail, 'already in use') !== false) {
                $msg = $localize->get("There is the same account entry");
            } 
			elseif (strpos($error->detail, 'Duplicate entry')!==false)
				$msg = $localize->get("Possible reasons") . ":" .
				'<br/>' . $localize.get("There is the same account entry for this module") . ';' .
				'<br/>' . $localize->get('Module and tariff were changed') . ';';
            else {
                $msg = '<br/>'.$error->detail;
            }
            throw new Exception($localize->get($msg));
        }
        
        $struct['vgroup']['vgid'] = $lanbilling->saveReturns->ret;
    }
    catch(Exception $error) {
        $_response = array(
            "success" => false,
            "error" => $error->getMessage(),
            "data" => $struct
        );
    }
    
    if(!$_response) {
        $_response = array(
            "success" => true,
            "data" => (array)$struct
        );
    }

    echo "(" . JEncode($_response, $lanbilling) . ")";
} // end setVgroup()


/**
 * Parse and show User data and link to user agreement
 * @param	object, billing class
 * @param	object, template class
 */
function parseUserData( &$lanbilling, &$tpl )
{
			
	if( false == ($user = getUser($lanbilling)) ) {
		$tpl->touchBlock("ifUserData");
		$tpl->touchBlock("ifUserUndefined");
		$tpl->touchBlock("ifConnectedUserUndefined");
		$tpl->touchBlock("ifUserAddrUndefined");
		$tpl->touchBlock('parentVglinkUndef');
	}
	else {
		$tpl->setVariable("VALIDUSERID", $user->account->uid);
		$tpl->setVariable("USERCATEGORY", $user->account->category);
		$tpl->setVariable("VALIDUSER", $user->account->name);
		
		if((integer)$_POST['vgid'] > 0) { 
			$userAddr = $connectedVgroup = $lanbilling->get("getVgroup", array("id" => (integer)$_POST['vgid'], "archive" => 0));
		} 
        if (isset($userAddr->addons)){
            if (!is_array($userAddr->addons)) $userAddr->addons = array($userAddr->addons);
            foreach($userAddr->addons as $k => $val){
                if (trim($val->name) == 'old_agent_id'){
                    $tpl->setVariable("OLDAGENT", $val->idx);
                    break;
                }
            }
        }else{
            $tpl->setVariable("OLDAGENT", 0);
        }

		$connectedAccount = ($connectedVgroup->vgroup->connectedfrom != 0 && !empty($connectedVgroup->vgroup->connectedfrom)) ? $lanbilling->get("getAccount", array("id" => $connectedVgroup->vgroup->connectedfrom)) : false;
		$tpl->setVariable("USERCONNECTEDCATEGORY",(false !== $connectedAccount) ? $connectedAccount->account->category : ''); // Возможно, потребуется в будущем
		$tpl->setVariable("VALIDCONNECTEDUSERID", (false !== $connectedAccount) ? $connectedVgroup->vgroup->connectedfrom : '');
		$tpl->setVariable("VALIDCONNECTEDUSER",	  (false === $connectedAccount) ? '<%@ Undefined %>' : $connectedAccount->account->name);

		/**
		 * Адрес учетной записи
		 */
		$vgUserAddrCode = $userAddr->addresses->code;
		$vgUserAddr = $userAddr->addresses->address;
		// код адреса
		$tpl->setVariable("VALIDUSERADDRCODE", (false === $vgUserAddrCode) ? '0' : $vgUserAddrCode);
		// текст адреса
		$tpl->setVariable("VALIDUSERADDR", (false === $vgUserAddr || empty($vgUserAddr)) ? '<%@ Undefined %>' : $vgUserAddr);

		foreach($user->agreements as $obj)
		{
			$tpl->setCurrentBlock("agrmOtp");
			if($_POST['agrmid'] == $obj->agrmid){
				// Balance
				$tpl->setVariable("AG_BAL", number_format((float)$obj->balance, 2, ",", " "));
				if($lanbilling->getAccess('cashonhand') > 0) {
					$tpl->setCurrentBlock('agrmBalModify');
					$tpl->setVariable('BAG_ID', $obj->agrmid);
					$tpl->parseCurrentBlock();
				}
				$tpl->touchBlock("agrmOptSel");
			}
			$tpl->setVariable("AGRMID", $obj->agrmid);
			$tpl->setVariable("AGRMBAL", (float)$obj->balance);
			$tpl->setVariable("AGRMNUM", empty($obj->number) ? '<%@ Undefined %> <%@ number %>' : $obj->number);
			$tpl->parse('agrmOtp');
		}

		// Touch account state block
		$tpl->setVariable("VGBLOCKSTATE", (integer)$_POST['blocked']);
		$tpl->touchBlock('vgBlockDescr_' . (integer)$_POST['blocked']);
		// Touch and parent parent vg
		$tpl->setVariable("PARENTVGID", (integer)$_POST['parentvgid']);
		$tpl->setVariable("PARENTVGLOGIN", $_POST['parentvglogin']);

		if(empty($_POST['parentvglogin'])) {
			$tpl->touchBlock('parentVglinkUndef');
		}
		else {
			$tpl->setVariable("PARENTVGLINK", $_POST['parentvglogin']);
		}
        if ((integer)$_POST['vgid']) {
            if ( (integer)$lanbilling->Option("disable_change_user_agreement") ) {
                $tpl->touchBlock('agrmDisabled');
            }
            if ( (integer)$lanbilling->Option("disable_change_user_agenttype") ) {
                $tpl->touchBlock('moduleSelDisabled');
            }
        }
		$tpl->parse("ifUserData");

	}
} // end parseUserData()


/**
 * Parse and show vgroup item access attributes
 * @param	object, billing class
 * @param	object, template class
 */
function parseVgAccess( &$lanbilling, &$tpl )
{
	$tpl->setCurrentBlock("ifVgAccess");
	$tpl->setVariable("THISVGLOGIN", $_POST['login']);
	
	if(!NEW_VGROUP)
	{
		if($lanbilling->getAccess('openpass') >= 1)
		{
			$tpl->touchBlock("showPass");
			$tpl->setvariable("THISPASS", $_POST['pass']);
		}
		else
		{
			if($_POST['pass_chg'] == 1) {
				$_SESSION['auth']['vgPass'] = $_POST['pass'];
			}
			$tpl->touchBlock("hidePass");
			$tpl->setvariable("THISPASS", substr(time(), 0, $lanbilling->Option('pass_length')));
		}
	}
	else
	{		
		if((integer)$lanbilling->Option('generate_pass') == 1) {
			if((integer)$lanbilling->getAccess('openpass') < 1) {
				$_POST['pass'] = (isset($_SESSION['auth']['crossPass'][$_POST['uid']]) && !empty($_SESSION['auth']['crossPass'][$_POST['uid']])) ? $_SESSION['auth']['crossPass'][$_POST['uid']] : $lanbilling->randomString();
			}
			else {
				$_POST['pass'] = (sizeof($_POST['pass']) > 0) ? $_POST['pass'] : $lanbilling->randomString();
			}
		}
		$tpl->touchBlock("showPass");
		$tpl->setvariable("THISPASS", $_POST['pass']);

		// Auto add agrmid & agrmnum while creating new vgroup, when parent user has only one agreement
		
		if(is_array($_POST['agrms']) && count($_POST['agrms'])==1) {
			foreach($_POST['agrms'] as $k => $v) {
				if(!empty($v['closedon'])) continue;
				$tpl->setVariable("THISAGRMID", $k);
				$tpl->setVariable("THISAGRMNUM", $v['num']);
                $tpl->setVariable("THISPAYMENTMETHOD", $v['paymentmethod']);
			}
		}
		
	}
	$tpl->parseCurrentBlock();
	
} // end parseVgAccess()



/**
 * Getting addon fields values
 * @param	object, billing class
 * @param   object, localize class
 */
function getVgroupAddons( &$lanbilling, &$localize )
{
    try {
		if((int)$_POST['modCMB']>0) $_POST['getaddonsvalues'] = (int)$_POST['modCMB'];

        if(false === ($resf = $lanbilling->get("getVgroupsAddonsSet", array('flt' => array('agentid' => (integer)$_POST['getaddonsvalues'])))) ) {
            throw new Exception($localize->get($lanbilling->soapLastError()->detail));
        }
        
        
        if(false === ($resv = $lanbilling->get("getVgroupAddons", array('id' => (integer)$_POST['vgid'])))) {
            throw new Exception($localize->get($lanbilling->soapLastError()->detail));
        }

        if($resf) {
            if(!is_array($resv)) {
                $resv = array($resv);
            }
            
            if(!is_array($resf)) {
                $resf = array($resf);
            }
	
            array_walk($resf, create_function('&$item', '
                $A = array(
					"type" => $item->addon->type,
					"agentid" => $item->addon->agentid,
					"name" => $item->addon->name,
					"descr" => $item->addon->descr,
					"staff" => (!is_array($item->staff) && !is_null($item->staff)) ? array($item->staff) : $item->staff
                );

                $item = $A;
            '));
            
            foreach($resv as &$res) {
				foreach($resf as $key=>$ress) {
					if($res->name == $ress['name']) {		
						$resf[$key]['idx'] = $res->idx;
						$resf[$key]['strvalue'] = $res->strvalue;
					}
					if($resf[$key]['strvalue'] == '' && $resf[$key]['type'] == 1) $resf[$key]['strvalue'] = $localize->get('Undefined');
					
					if($resf[$key]['type'] == 2)
					{
						if($resf[$key]['strvalue'] == '1') 
							$resf[$key]['strvalue'] = 'true';
						if($resf[$key]['strvalue'] == '0')
							$resf[$key]['strvalue'] = 'false';
					}
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
            "results" => (array)$resf
        );
    }

    echo "(" . JEncode($_response, $lanbilling) . ")";
} // end getVgroupAddons()


/**
 * Set addon fields values
 * @param	object, billing class
 * @param   object, localize class
 */
 
 
function setVgroupAddons( &$lanbilling, &$localize )
{
	$struct = array(
		'vgid' => (integer)$_POST['setaddonsvalues'],
		'type' => (integer)$_POST['type'],
		'agentid' => 0,
		'name' => (string)$_POST['name'],
		'idx' => $_POST['idx'],
		'descr' => $_POST['descr'],
		'strvalue' => $_POST['strvalue']
	);
	
	if($struct['type'] == 2)
	{
		if($struct['strvalue'] == 'true')
			$struct['strvalue'] = 1;
		if($struct['strvalue'] == 'false')
			$struct['strvalue'] = 0;
	}
	
	if( false == $lanbilling->save("setVgroupAddon", $struct, false, "getVgroupAddons") )
	{
		$error = $lanbilling->soapLastError();
		echo "({ success: false, errors: { reason: '" .  $lanbilling->soapLastError()->detail . "'	 } })";
	}			

} // end setVgroupAddons()



/**
 * Get the list of avaliable addons for the user
 * @param	object, billing
 * @param	objrct, template class
 */
function buildAddonFields( &$lanbilling, &$tpl )
{
	if( false != ($result = $lanbilling->get("getVgroupsAddonsSet", array('flt' => array('agentid' => (integer)$_POST['module'])))) )
	{
		if(!is_array($result)) {
			$result = array($result);
		}

		foreach($result as $item)
		{
			switch((integer)$item->addon->type)
			{
				case 1:
					$tpl->setCurrentBlock('AddonComboRow');
					$tpl->setVariable('ADDONCOMBODESCR', $item->addon->descr);
					$tpl->setVariable('ADDONCOMBONAME', $item->addon->name);

					if(!is_array($item->staff)) {
						$item->staff = array($item->staff);
					}

					array_walk($item->staff, create_function('$item, $key, $_tmp', '
						$_tmp[0]->setCurrentBlock("AddonComboOpt");
						$_tmp[0]->setVariable("ADDONCOMBOSELVAL", $item->idx);
						$_tmp[0]->setVariable("ADDONCOMBOSELNAME", $item->value);
						if($_tmp[1] == $item->idx) {
							$_tmp[0]->touchBlock("AddonComboOptSel"); };
							$_tmp[0]->parseCurrentBlock();'), array( &$tpl, isset($_POST['addons']['combo'][$item->addon->name]) ? $_POST['addons']['combo'][$item->addon->name] : 0 ));

					$tpl->parse('AddonComboRow');
				break;

				default:
					$tpl->setCurrentBlock('AddOnTextRow');
					$tpl->setVariable('ADDONTEXTDESCR', $item->addon->descr);
					$tpl->setVariable('ADDONTEXTNAME', $item->addon->name);
					$tpl->setVariable('ADDONTEXTVALUE', isset($_POST['addons']['text'][$item->addon->name]) ? $_POST['addons']['text'][$item->addon->name] : '');
					$tpl->parse('AddOnTextRow');
			}
		}

		$tpl->parse('AddonFields');

		if(!empty($result) && (!empty($tpl->blockdata['LeasedLineOpt']) ||
				!empty($tpl->blockdata['CommonInternetOpt']) ||
				!empty($tpl->blockdata['CommonVoIPOpt']) ||
				!empty($tpl->blockdata['ifCbCrypt'])))
		{
			$tpl->touchBlock('MarginOptIfAddons');
		}
	}
} // end buildAddonFields()


/**
 * Return boolean if selected tarif is qual to module type
 * @param	integer, tarif type
 */
function equalTomoduleType( $tarifType )
{
	if(LEASEDLINE) {
		if((integer)$tarifType == 0) return true;
	}

	if(RADIUSDIALUP) {
		if((integer)$tarifType > 0 && (integer)$tarifType < 3) return true;
	}

	if(TELEPHONY) {
		if((integer)$tarifType == 3) return true;
	}

	if(VOICEIP) {
		if((integer)$tarifType == 4) return true;
	}

	if(USBOX) {
		if((integer)$tarifType == 5) return true;
	}

	return false;
} // end equalTomoduleType()


/**
 * Initialize avaliable modules. Returns array
 * @param	object, billing class
 * @param   object, localize class
 */
function getModules( &$lanbilling, &$localize )
{
    try {
        if(false == ($result = $lanbilling->get('getAgentsExt'))) {
            throw new Exception($localize->get($lanbilling->soapLastError()->detail));
        }
        
        if($result) {
            if(!is_array($result)) {
                $result = array($result);
            }
            
            $_tmp = array();
            
            array_walk($result, create_function('&$item, $key, $_tmp', '
                if($item->agent->remulateonnaid == 0) {
                    $_tmp[0][$item->agent->id] = array(
                        "id" => $item->agent->id,
                        "name" => $item->agent->descr,
                        "type" => $item->agent->type
                    );
                };'), array( &$_tmp ));
            
            $_tmp = array_values($_tmp);
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
            "results" => (array)$_tmp
        );
    }

    echo "(" . JEncode($_response, $lanbilling) . ")";
} // end getModules()


/**
 * Search and return short users list
 * @param   object, main class
 * @param   object, localize class
 */
function getUserOnFly( &$lanbilling, &$localize )
{
    try {
        if(false === ($result = $lanbilling->get('getAccounts', array("flt" => array(
            "personid" => $lanbilling->manager,
            "name" => (string)$_POST['username'],
            "start" => 0,
            "limit" => 10
        ),
        "ord" => array(
            "name" => 'a_name',
            "ascdesc" => 0
        )))))
        {
            throw new Exception($localize->get($lanbilling->soapLastError()->detail));
        }
        
        if($result) {
            if(!is_array($result)) {
                $result = array($result);
            }
            
            array_walk($result, create_function('&$item, $key, $_tmp', '
                $A = array(
                    "uid" => $item->account->uid,
                    "name" => $item->account->name
                );
                
                if($item->addresses) {
                    if(!is_array($item->addresses)) {
                        $item->addresses = array($item->addresses);
                    }
                    
                    foreach($item->addresses as $addr) {
                        if($addr->type == 0) {
                            $A["addrtype"] = $addr->type;
                            $A["addrcode"] = $addr->code;
                            $A["address"] = $_tmp[0]->clearAddress($addr->address);
                            break;
                        }
                    }
                }
                
                $item = $A;
            '), array( &$lanbilling ));
            
            $_tmp = array_values($_tmp);
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
            "results" => (array)$result
        );
    }

    echo "(" . JEncode($_response, $lanbilling) . ")";
} // end getUserOnFly()


/**
 * Search and return short agreements list
 * @param   object, main class
 * @param   object, localize class
 */
function getAgrmOnFly( &$lanbilling, &$localize )
{
    try {
        if(false === ($result = $lanbilling->get('getAgreements', array("flt" => array(
            "userid" => (integer)$_POST['uid'],
            "istemplate" => 0,
            "category" => -1,
            "archive" => 0,
            "agrmnum" => (string)$_POST['useragrm'],
            "start" => 0,
            "limit" => 10
        )/*,
        "ord" => array(
            "name" => 'a_number',
            "ascdesc" => 0
        )*/))))
        {
            throw new Exception($localize->get($lanbilling->soapLastError()->detail));
        }
        
        if($result) {
            if(!is_array($result)) {
                $result = array($result);
            }
            
            array_walk($result, create_function('&$item', '
                $A = array(
                    "agrmid" => $item->agrmid,
                    "number" => $item->number,
                    "paymentmethod" => $item->paymentmethod
                );
                $item = $A;
            '));
            
            $_tmp = array_values($_tmp);
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
            "results" => (array)$result
        );
    }

    echo "(" . JEncode($_response, $lanbilling) . ")";
} // end getAgrmOnFly()


/**
 * Search and return short agreements list
 * @param   object, main class
 * @param   object, localize class
 */
function getVgidOnFly( &$lanbilling, &$localize )
{
    try {
        if(false === ($result = $lanbilling->get('getVgroups', array("flt" => array(
            "userid" => (integer)$_POST['uid'],
            "archive" => 0,
            "login" => (string)$_POST['vglogin'],
            "start" => 0,
            "limit" => 10
        )/*,
        "ord" => array(
            "name" => 'a_number',
            "ascdesc" => 0
        )*/))))
        {
            throw new Exception($localize->get($lanbilling->soapLastError()->detail));
        }
        
        if($result) {
            if(!is_array($result)) {
                $result = array($result);
            }
            
            array_walk($result, create_function('&$item', '
                $A = array(
                    "vgid" => $item->vgid,
                    "login" => $item->login
                );
                $item = $A;
            '));
            
            $_tmp = array_values($_tmp);
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
            "results" => (array)$result
        );
    }

    echo "(" . JEncode($_response, $lanbilling) . ")";
} // end getAgrmOnFly()


/**
 * Return random passeord string
 * @param   object, main class
 * @param   object, localize class
 */
function getRandomPass( &$lanbilling, &$localize )
{
    $_response = array(
        "success" => true,
        "data" => $lanbilling->randomString()
    );
    
    echo "(" . JEncode($_response, $lanbilling) . ")";
} // end getRandomPass()


/**
 * Returns document template
 * @param   object, main class
 */
function getDocTpls(&$lanbilling, &$localize ){
    $_filter = array("onfly" => 6);
    
    try {
        if( false != ($result = $lanbilling->get("getDocuments", array("flt" => array(
            "onfly" => 6
        )))) )
        {
            if(!is_array($result)) {
                $result = array($result);
            }
            
            array_walk($result, create_function('&$item', '
                $A = array(
                    "id" => $item->docid,
                    "name" => $item->name
                );
                
                $item = $A;
            '));
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
            "results" => (array)$result
        );
    }

    echo "(" . JEncode($_response, $lanbilling) . ")";
} // end getDocTpls()


/**
 * Returns discounts for the telephony tariff
 * @param   object, main class
 */
function getTelDisc( &$lanbilling, &$localize )
{
    try {
        if(false === ($result = $lanbilling->get("getTelClasses")))
        {
            throw new Exception($localize->get($lanbilling->soapLastError()->detail));
        }
        
        if($result) {
            if(!is_array($result)) {
                $result = array($result);
            }
            
            array_walk($result, create_function('&$item', '
                $A = array(
                    "id"    => $item->id,
                    "name"  => $item->name,
                    "descr" => $item->descr,
                    "coef" => 1
                );
                $item = $A;
            '));
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
            "results" => (array)$result
        );
    }

    echo "(" . JEncode($_response, $lanbilling) . ")";
} // end getTelDisc()


/**
 * Get tariffs history list, planned changes
 * @param   object, billing class
 * @param   object, localize class
 */
function getTarHistory( &$lanbilling, &$localize )
{
    try {

        if(false === ($result = $lanbilling->get("getVgTarifs", array("flt" => array(
            "vgid" => (integer)$_POST['vgid']
        )))))
        {
            throw new Exception($localize->get($lanbilling->soapLastError()->detail));
        }
        
        if($result) {
            if(!is_array($result)) {
                $result = array($result);
            }
			
            array_walk($result, create_function('&$item', '
                if((integer)$item->timeto == 9999) {
                    $item->timeto = "";
                }
                
                $A = array(
                    "recordid" => $item->recordid,
                    "vgid" => $item->vgid,
                    "moduleid" => $item->id,
                    "taridnew" => $item->taridnew,
                    "taridold" => $item->taridold,
                    "israsp" => $item->israsp,
                    "ishistory" => $item->ishistory,
                    "ismulti" => $item->ismulti,
                    "tarnewname" => $item->tarnewname,
                    "taroldname" => $item->taroldname,
                    "changetime" => $item->changetime,
                    "rasptime" => $item->rasptime,
                    "timeto" => $item->timeto,
                    "mgrname" => $item->mgrname,
					"groupid" => $item->groupid
                );
                $item = $A;
            '));
            
			$_filter = array('vgid' => (int)$_POST['vgid']);
            
            $_count = $lanbilling->get("Count", array("flt" => $_filter, "procname" => "getVgTarifs", "md5" => $_md5));
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
            "total" => (integer)$_count,
            "results" => (array)$result
        );
    }

    echo "(" . JEncode($_response, $lanbilling) . ")";
} // end getTarHistory()


/**
 * Save tariff scheduling
 * @param   object, billing class
 * @param   object, localize class
 */
function setTarRasp( &$lanbilling, &$localize )
{
    try {
        if((integer)$_POST['vgid'] == 0) {
            throw new Exception($localize->get("Undefined-o") . ": " . $localize->get("Account"));
        }
        
        $_POST['tardate'] = implode('-', array_reverse(explode('.', $_POST['tardate'])));
        $_POST['tartimehour'] = isset($_POST['tartimehour']) ? sprintf("%02d", (integer)$_POST['tartimehour']) : date('H');
        $_POST['tartimemin'] = isset($_POST['tartimemin']) ? sprintf("%02d", (integer)$_POST['tartimemin']) : date('i');
        
        if(preg_match("/^\d{2}\.\d{2}\.\d{2}$/", $_POST['datetill'])) {
            $_POST['datetill'] = implode('-', array_reverse(explode('.', $_POST['datetill'])));
            $_POST['timehourtill'] = isset($_POST['timehourtill']) ? sprintf("%02d", (integer)$_POST['timehourtill']) : date('H');
            $_POST['timemintill'] = isset($_POST['timemintill']) ? sprintf("%02d", (integer)$_POST['timemintill']) : date('i');
            
            $_POST['datetill'] = $lanbilling->formatDate(sprintf("%s %02d:%02d:00", $_POST['datetill'], $_POST['timehourtill'], $_POST['timemintill']), "Y-m-d H:i:s");
        }
        else {
            $_POST['datetill'] = $_POST['ismulti'] ? '9999-12-31 23:59:59' : null;
        }
		
		$dateFrom = $lanbilling->formatDate(sprintf("%s %02d:%02d:00", $_POST['tardate'], $_POST['tartimehour'], $_POST['tartimemin']), "Y-m-d H:i:s");
		$dateTo = $_POST['datetill'];
        if(!empty($dateFrom) && !empty($dateTo) && (strtotime($dateFrom) > strtotime($dateTo))) {			
            throw new Exception($localize->get("Start date could not be less than end date"));
        }
        
        if(isset($_POST['catdisc']) && is_array($_POST['catdisc']) && !empty($_POST['catdisc'])) {
            array_walk($_POST['catdisc'], create_function('&$item', '
				$A = array(
					"catidx" => $item["catidx"],
					"above" => $item["type"] ? 0 : $item["value"],
					"rate" => $item["type"] ? (1 - $item["value"]/100) : 1,
					"includes" => $item["includes"],
					"discount" => $item["type"] ? 0 : $item["value"]
				);
                
                $item = $A;
            '));
        }
        else {
            $_POST['catdisc'] = array();
        }
        
        $struct = array(
            "recordid" => (integer)$_POST['recordid'],
            "groupid" => 0,
            "id" => (integer)$_POST['moduleid'],
            "vgid" => (integer)$_POST['vgid'],
            "override" => (integer)$_POST['override'],
            "taridnew" => (integer)$_POST['tarid'],
            "taridold" => 0,
			"discount"  => (float)$_POST['tardisc'],
            "changetime" => $lanbilling->formatDate(sprintf("%s %02d:%02d:00", $_POST['tardate'], $_POST['tartimehour'], $_POST['tartimemin']), "Y-m-d H:i:s"),
            "timeto" => $_POST['datetill'],
            "requestby" => $lanbilling->manager,
            "override" => (integer)$_POST['override']
        );
		
		if(is_array($_POST['catdisc']) && !empty($_POST['catdisc'])) {
			$struct['catdiscounts'] = (array)$_POST['catdisc'];
		}	
		
        if(false == $lanbilling->save("insupdTarifsRasp", $struct, $struct['recordid'] == 0 ? true : false)) {
            throw new Exception($localize->get($lanbilling->soapLastError()->detail), $lanbilling->soapLastError()->detail == "Packet will be broken" ? 1 : 0);
        }
    }
    catch(Exception $error) {
    	
		$error_msg = $error->getMessage();
		
		if(strstr($error_msg, 'Cannot add or update a child row: a foreign key constraint fails')){
			$error_msg = 'No such tariffs';
		}
		if (preg_match("~^There is period lock.*\s(\d{4}-\d{2}-\d{2})$~is",$error_msg, $mtch)){
			$error_msg = $localize->get('Period is locked') . '. ' . $localize->get('You cannot make changes before then') . ' <b>' . $mtch[1] . '</b>.';
		}
		if (preg_match("~^Category rate .*$~is",$error_msg, $mtch)){
			$error_msg = $localize->get('Category rate is out of tarif bounds');
		}
        $_response = array(
            "success" => false,
            "error" => $error_msg,
            "override" => $error->getCode()
        );
    }
    
    if(!$_response) {
        $_response = array(
            "success" => true,
            "error" => null
        );
    }

    echo "(" . JEncode($_response, $lanbilling) . ")";
} // end setTarRasp()


/**
 * Remove tariff from the scheduler
 * @param   object, billing class
 * @param   object, localize class
 */
function delTarifsRasp( &$lanbilling, &$localize )
{
    try {
        if((integer)$_POST['recordid'] == 0) {
            throw new Exception($localize->get("Undefined") . ": " . $localize->get("Tarif"));
        }
        
        if(false == $lanbilling->delete($_POST['ismulti'] == 1 ? "delMultitarif" : "delTarifsRasp", array(
            "id" => $_POST['recordid']
        )))
        {
            throw new Exception($localize->get($lanbilling->soapLastError()->detail));
        }
    }
    catch(Exception $error) {
        $_response = array(
            "success" => false,
            "error" => $error->getMessage(),
            "struct" => $struct
        );
    }
    
    if(!$_response) {
        $_response = array(
            "success" => true,
            "error" => null
        );
    }

    echo "(" . JEncode($_response, $lanbilling) . ")";
} // end delTarifsRasp()


/**
 * Returns blocks history and scheduled items
 * @param   object, billing class
 * @param   object, localize class
 */
function getVgBlocks( &$lanbilling, &$localize )
{
    try {
		$_filter = array(
            "vgid" => (integer)$_POST['vgid'],
			"pgsize" => ((integer)$_POST['limit'] <= 0) ? 100 : $_POST['limit']
		);
		$_filter["pgnum"] = $lanbilling->linesAsPageNum($_filter['pgsize'], (integer)$_POST['start'] + 1);
		
        if(false === ($result = $lanbilling->get("getBlockRasp", array("flt" => $_filter))))
        {
            throw new Exception($localize->get($lanbilling->soapLastError()->detail));
        }
        
        if($result) {
            if(!is_array($result)) {
                $result = array($result);
            }
            
            array_walk($result, create_function('&$item, $key', '
                $A = array(
                    "recordid" => $item->recordid,
                    "vgid" => $item->vgid,
                    "id" => $key,
                    "blkreq" => $item->blkreq,
                    "ishistory" => $item->ishistory,
                    "requestby" => $item->requestby,
                    "changetime" => $item->changetime,
                    "timeto" => $item->timeto,
                    "mgrname" => $item->mgrname,
                    "mgrdescr" => $item->mgrdescr,
                    "comment" => $item->comment
                );
                $item = $A;
            '));
            
            $_count = $lanbilling->get("Count", array("flt" => $_filter, "procname" => "getBlockRasp"));
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
            "total" => (integer)$_count,
            "results" => (array)$result
        );
    }

    echo "(" . JEncode($_response, $lanbilling) . ")";
} // end getVgBlocks()


/**
 * Save vgroup blocking event
 * @param   object, billing class
 * @param   object, localize class
 */
function setVgBlock( &$lanbilling, &$localize )
{
    try {
        if((integer)$_POST['vgid'] == 0) {
            throw new Exception($localize->get("Undefined-a") . ": " . $localize->get("Account"));
        }
        
        if((integer)$_POST['moduleid'] == 0) {
            throw new Exception($localize->get("Undefined") . ": " . $localize->get("Module"));
        }
        
        $_POST['blockdate'] = implode('-', array_reverse(explode('.', $_POST['blockdate'])));
        $_POST['timehour'] = isset($_POST['timehour']) ? sprintf("%02d", (integer)$_POST['timehour']) : date('H');
        $_POST['timemin'] = isset($_POST['timemin']) ? sprintf("%02d", (integer)$_POST['timemin']) : date('i');
        
        $struct = array(
            "recordid" => (integer)$_POST['recordid'],
            "groupid" => 0,
            "id" => (integer)$_POST['moduleid'],
            "vgid" => (integer)$_POST['vgid'],
            "blkreq" => (integer)$_POST['blkreq'],
            "changetime" => $lanbilling->formatDate(sprintf("%s %02d:%02d:00", $_POST['blockdate'], $_POST['timehour'], $_POST['timemin']), "Y-m-d H:i:s"),
            "requestby" => $lanbilling->manager
        );
        
        if(false == $lanbilling->save("insBlkRasp", $struct, true)) {
            $error = $lanbilling->soapLastError();
			if (preg_match("~There is period lock.*(\d{4}\-\d{2}\-\d{2})~is",$error->detail, $matches)){
				$msg = '<br/>' . $localize->get('Period is locked') . '! ' . $localize->get('You cannot make changes before then') . ' ' . $matches[1];
			} else if (preg_match("~Blocktype .* is not allowed for closed agreement~is",$error->detail, $matches)){
				$msg = '<br/>' . $localize->get('This block type is unavailable for the terminated contract');
			} else {
                $msg = $error->detail;
            }
            throw new Exception($localize->get($msg));
        }
    }
    catch(Exception $error) {
        $_response = array(
            "success" => false,
            "error" => $error->getMessage(),
            "struct" => $struct
        );
    }
    
    if(!$_response) {
        $_response = array(
            "success" => true,
            "error" => null
        );
    }

    echo "(" . JEncode($_response, $lanbilling) . ")";
} // end setVgBlock()


/**
 * Returns the list of the telephony staff
 * @param   object, billing class
 * @param   object, localize class
 */
function getTelStaff( &$lanbilling, &$localize )
{
    try {
        $_filter = array(
            "vgid" => (integer)$_POST['vgid']
        );

        if(false === ($result = $lanbilling->get($_POST['trunk'] == 1 ? "getTrunkStaff" : "getPhoneStaff", array("flt" => $_filter))))
        {
            throw new Exception($localize->get($lanbilling->soapLastError()->detail));
        }

        if(!empty($result)) {
            if(!is_array($result)) {
                $result = array($result);
            }

            $_count = $lanbilling->get("Count", array("flt" => $_filter, "procname" => $_POST['trunk'] == 1 ? "getTrunkStaff" : "getTelStaff"));
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
            "total" => (integer)$_count,
            "results" => (array)$result
        );
    }

    echo "(" . JEncode($_response, $lanbilling) . ")";
} // end getTelStaff()


/**
 * (Save) Send telephone data to the server
 * @param   object, billing class
 * @param   object, localize class
 */
function setTelStaff( &$lanbilling, &$localize )
{
    try {
        if((integer)$_POST['vgid'] == 0) {
            throw new Exception($localize->get("Undefined-a") . ": " . $localize->get("Account"));
        }

        if(preg_match("/^\d{2}\.\d{2}\.\d{2}$/", $_POST['timefrom'])) {
            $_POST['timefrom'] = implode('-', array_reverse(explode('.', $_POST['timefrom'])));
            $_POST['timefrom'] = $lanbilling->formatDate(sprintf("%s %02d:%02d:%02d", $_POST['timefrom'], $_POST['timefrom_hh'], $_POST['timefrom_mm'], $_POST['timefrom_ss']), "Y-m-d H:i:s");
        }
        else {
            $_POST['timefrom'] = null;
        }

        if(preg_match("/^\d{2}\.\d{2}\.\d{2}$/", $_POST['timeto'])) {
            $_POST['timeto'] = implode('-', array_reverse(explode('.', $_POST['timeto'])));
            $_POST['timeto'] = $lanbilling->formatDate(sprintf("%s %02d:%02d:%02d", $_POST['timeto'], $_POST['timeto_hh'], $_POST['timeto_mm'], $_POST['timeto_ss']), "Y-m-d H:i:s");
        }
        else {
            $_POST['timeto'] = null;
        }

        $struct = array(
            "telstaff" => array(
                "recordid" => (integer)$_POST['recordid'],
                "vgid" => (integer)$_POST['vgid'],
                "device" => (integer)$_POST['device'],
                "ldservice" => (integer)$_POST['ldservice'],
                "phonenumber" => (string)$_POST['phonenumber'],
                "timefrom" => $_POST['timefrom'],
                "timeto" => $_POST['timeto'],
                "comment" => (string)$_POST['comment']
            ),
            "checkduplicate" => (integer)$_POST['nodupl']
        );

        if(false == $lanbilling->save((integer)$_POST['device'] < 2 ? "insupdPhoneStaff" : "insupdTrunkStaff", $struct, (integer)$_POST['recordid'] == 0 ? true : false)) {
        	$msg = $lanbilling->soapLastError()->detail;
        	
        	if(preg_match("~^There is period lock.*\s(\d{4}-\d{2}-\d{2})$~is",$msg, $mtch)){
        		$msg = $localize->get('Period is locked') . '. ' . $localize->get('Unable to make changes with date less than') . ' ' . '<b>'.$mtch[1].'</b>.';
        	}
        	
        	throw new Exception($localize->get($msg));
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
            "struct" => $struct,
            "error" => null
        );
    }

    echo "(" . JEncode($_response, $lanbilling) . ")";
} // end setTelStaff()


/**
 * Remove block record from the scheduler
 * @param   object, billing class
 * @param   object, localize class
 */
function delBlkRasp( &$lanbilling, &$localize )
{
    try {
        if((integer)$_POST['recordid'] == 0) {
            throw new Exception($localize->get("Undefined-a") . ": " . $localize->get("Blocking"));
        }
        
        if(false == $lanbilling->delete("delBlkRasp", array(
            "id" => $_POST['recordid']
        )))
        {
            throw new Exception($localize->get($lanbilling->soapLastError()->detail));
        }
    }
    catch(Exception $error) {
        $_response = array(
            "success" => false,
            "error" => $error->getMessage(),
            "struct" => $struct
        );
    }
    
    if(!$_response) {
        $_response = array(
            "success" => true,
            "error" => null
        );
    }

    echo "(" . JEncode($_response, $lanbilling) . ")";
} // end delBlkRasp()


/**
 * Remove block record from the scheduler
 * @param   object, billing class
 * @param   object, localize class
 */
function delTelStaff( &$lanbilling, &$localize )
{
    try {
        if((integer)$_POST['recordid'] == 0) {
            throw new Exception($localize->get("Undefined-o") . ": " . $localize->get("Device"));
        }

        if(false == $lanbilling->delete($_POST['device'] < 2 ? "delPhoneStaff" : "delTrunkStaff", array(
            "id" => $_POST['recordid']
        )))
        {
            $msg = $lanbilling->soapLastError()->detail;
        	
        	if(preg_match("~^There is period lock.*\s(\d{4}-\d{2}-\d{2})$~is",$msg, $mtch)){
        		$msg = $localize->get('Unable to delete records affected in closed period');
        	}
        	
        	throw new Exception($localize->get($msg));
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
} // end deltelStaff()


/**
 * Initialize available tariffs. Returns array
 * @param	object, billing class
 */
function initTarifs( &$lanbilling )
{
    $flt = array(
		"archive" => 0,
		"unavail" => -1,
		"common" => -1
    );

    if (isset($_POST['tarid']) && $_POST['tarid'] > 0){
        $flt['tarid'] = $_POST['tarid'];
    }

	//if( false != ($result = $lanbilling->get("getTarifsExt", array("archive" => 0, "unavail" => -1, "formanager" => 1))) )
    if( false != ($result = $lanbilling->get("getTarifsExt2", array('flt' => $flt))) )
	{
		if(!is_array($result)) {
			$result = array($result);
		}

		$_tmp = array();
		array_walk($result, create_function('&$val, $key, $_tmp', '
			$_tmp[0][$val->tarif->tarid] = array(
				"tarid" => $val->tarif->tarid,
				"name" => $val->tarif->descr,
				"unavail" => $val->tarif->unavaliable,
				"archive" => $val->tarif->archive,
				"type" => $val->tarif->type,
				"rent" => $val->tarif->rent,
				"dailyrent" => $val->tarif->dailyrent,
				"actblock" => $val->tarif->actblock,
				"symbol" => $val->tarif->symbol,
				"shape" => $val->tarif->shape);
			'), array(&$_tmp));
		return $_tmp;
	}
	return array();
} // end initTarifs()


/**
 * Initialize vgroup item properties from server
 * @param	object, billing class
 * @param	boolean, if there need to write values to corresponding post variables
 */
function initVgroup( &$lanbilling, $toPost = false )
{
	if( false != ($result = $lanbilling->get("getVgroup", array("id" => (integer)$_POST['vgid']))) )
	{
		if(!empty($result->addons)) {
			if(!is_array($result->addons)) {
				$result->addons = array($result->addons);
			}
		}

		if($toPost)
		{
			if(!empty($result->addons)) {
				foreach($result->addons as $item)
				{
					if($item->type == 1) {
						$_POST['addons']['combo'][$item->name] = $item->idx;
					}
					else {
						$_POST['addons']['text'][$item->name] = $item->strvalue;
					}
				}
			}

			$_array = (array)$result->vgroup;
			foreach($_array as $key => $val)
			{
				switch($key)
				{
					case "id": $_POST['module'] = $val; break;
					case "templ": $_POST['templ'] = ($_POST['vgroupbytpl'] > 0) ? 0 : $val; break;

					case "accondate":
						$_date = date_parse($val);
						$_POST['onyear'] = sprintf("%04d", $_date['year']);
						$_POST['onmonth'] = sprintf("%02d", $_date['month']);
						$_POST['onday'] = sprintf("%02d", $_date['day']);
						$_POST['onhour'] = sprintf("%02d", $_date['hour']);
						$_POST['onminute'] = sprintf("%02d", $_date['minute']);
					break;

					case "accoffdate":
						$_date = date_parse($val);
						$_POST['offyear'] = sprintf("%04d", $_date['year']);
						$_POST['offmonth'] = sprintf("%02d", $_date['month']);
						$_POST['offday'] = sprintf("%02d", $_date['day']);
						$_POST['offhour'] = sprintf("%02d", $_date['hour']);
						$_POST['offminute'] = sprintf("%02d", $_date['minute']);
					break;

					default: $_POST[$key] = $val;
				}
			}

			if((integer)$lanbilling->getAccess('openpass') == 0) {
				$_SESSION['auth']['vgPass'] = $result->vgroup->pass;
			}
		}

		if((integer)$result->vgroup->tarid == 0 && (integer)$result->vgroup->templ = 0) {
			$_SESSION['auth']['flushSoap'] = true;
			$lanbilling->flushCache("getVgroup");
		}
		else {
			unset($_SESSION['auth']['flushSoap']);
		}

		return $result;
	}
	else {
		define('ERRORSTATE', true);
		$error = $lanbilling->soapLastError();
		define('ERRORDETAIL', $error->detail);
	}

	return array();
} // end initVgroup()


/**
 * Returns JSON structure if the access result
 * @param   object, billing class
 * @param   object, localize class
 */
function getIfUser( &$lanbilling, &$localize )
{
    try {
        if($lanbilling->getAccess('users') < 1) {
            throw new Exception($localize->get('You dont have rights to complete this action'));
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
} // end getIfUser()

function getIfTarif( &$lanbilling, &$localize )
{
    try {
    	
        if($lanbilling->getAccess('tarifs') < 1) {
            throw new Exception($localize->get('You dont have rights to complete this action'));
        }
		
		$result = $lanbilling->get("getTarif", array("id" => (integer)$_POST['getiftarif']));
		
		if(!isset($result)){
			throw new Exception($localize->get('You dont have rights to complete this action'));
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
} // end getIfTarif()


/**
 * Get user information using agreement id or direct user identifier
 * @param	object, billing class
 */
function getUser( &$lanbilling )
{
	if((integer)$_POST['agrmid'] > 0)
	{
		$_filter = $lanbilling->soapFilter(array("agrmid" => $_POST['agrmid']));
		$user = $lanbilling->get("getAccounts", array("flt" => $_filter, "md5" => $lanbilling->controlSum($_filter)));

		if(!is_array($user->agreements)) {
			$user->agreements = array($user->agreements);
		}
		return $user;
	}

	if((integer)$_POST['uid'] > 0)
	{
		$user = $lanbilling->get("getAccount", array("id" => $_POST['uid']));

		if(!is_array($user->agreements)) {
			$user->agreements = array($user->agreements);
		}
		return $user;
	}

	return false;
} // end getUser()


/**
 * Send vgroup item data to server
 * @param	object, billing class
 */
function saveVgroup( &$lanbilling, &$localize )
{
	if((integer)$_POST['templ'] == 0 && (integer)$_POST['vgid'] > 0)
	{
		if((integer)$lanbilling->getAccess('openpass') < 1) {
			if((integer)$_POST['pass_chg'] == 0) {
				$_POST['pass'] = $_SESSION['auth']['vgPass'];
				unset($_SESSION['auth']['vgPass']);
			}
		}
	}

	$struct = array("vgroup" => array(
		// Read only
		"currentshape" => 0, "blkreq" => 0, "blocked" => 0, "changed" => 0, "archive" => 0, "dlimit" => 0, "amount" => 0,
		"creationdate" => "", "blockdate" => "", "cdate" => "", "dclear" => "",

		"vgid" => (integer)$_POST['vgid'],
		"cuid" => 0,
		"tarid" => (integer)$_POST['tarid'],
		"agrmid" => (integer)$_POST['agrmid'],
		"id" => (integer)$_POST['module'],
		"shape" => (integer)$_POST['shape'],
		"maxsessions" => (integer)$_POST['maxsessions'],
		"templ" => (integer)$_POST['templ'],
		"ipdet" => (integer)$_POST['ipdet'],
		"portdet" => (integer)$_POST['portdet'],
		"accondate" => sprintf("%04d%02d%02d%02d%02d00", $_POST['onyear'], $_POST['onmonth'], $_POST['onday'], $_POST['onhour'], $_POST['onminute']),
		"accoffdate" => sprintf("%04d%02d%02d%02d%02d00", $_POST['offyear'], $_POST['offmonth'], $_POST['offday'], $_POST['offhour'], $_POST['offminute']),
		"ifindex" => (integer)$_POST['ifindex'],
		"descr" => $_POST['descr'],
		"login" => $_POST['login'],
		"pass" => $_POST['pass'],
		"checkduplicate" => (integer)$_POST['checkduplicates'],
		"connectedfrom" => (integer)$_POST['connecteduid'],
		"parentvgid" => (integer)$_POST['parentvgid'],
		"templ" => (integer)$_POST['templ']
	));

	$struct['addresses'] = array(
		'type' => 0,
		'code' => $_POST['vgAddrCode'],
		'address' => ''
	);

	if(isset($_POST['schedule']) && !empty($_POST['schedule']))
	{
		foreach($_POST['schedule'] as $arr)
		{
			$tcc = explode('%',$arr['telclasscoef']);
			if (count($tcc)>0){
				foreach ($tcc as $tclasscoef){
					$tmpCl = explode('^',$tclasscoef);
					$clAr[] = array(
						'classid' => ($tmpCl[0]) ? $tmpCl[0] : 0,
						'discount' => ($tmpCl[1]) ? $tmpCl[1] : 0
					);
				}
			}

			$struct['tarrasp'][] = array(
				'recordid' => (integer)$arr['recordid'],
				'vgid' => (integer)$_POST['vgid'],
				'groupid' => 0,
				'id' => (integer)$_POST['module'],
				'taridnew' => (integer)$arr['taridnew'],
				'taridold' => 0,
				'requestby' => ($arr['requestby'] == 'null') ? '' : (((integer)$arr['recordid'] == 0) ? $lanbilling->manager : $arr['requestby']),
				'changetime' => $arr['changetime'] . str_replace(':', '', $arr['time']),
				'discount'	=> (float)$arr['tarcoef'],
				'catdiscounts' => $clAr
			);
		}
	}

	if(isset($_POST['vgblocks']) && !empty($_POST['vgblocks'])) {
		foreach($_POST['vgblocks'] as $arr)
		{

			$struct['blockrasp'][] = array(
				'blkreq' => (integer)$arr['blkreq'],
				'changetime' => $arr['changedate'] . implode("", explode(":", $arr['changetime'])) . "00",
				'vgid' => (integer)$_POST['vgid']
			);
		}
	}

	if(isset($_POST['ips']) && !empty($_POST['ips']))
	{
		foreach($_POST['ips'] as $arr)
		{
			$struct['staff'][] = array(
				'recordid' => 0,
				'type' => ($lanbilling->boolean($arr['type']) == true) ? 1 : 0,
				'ipmask' => array(
					"ip" => $arr['segment'],
					"mask" => $arr['mask']),
				'vgid' => (integer)$_POST['vgid']
			);
		}
	}

	if(isset($_POST['aslist']) && !empty($_POST['aslist']))
	{
		foreach($_POST['aslist'] as $arr)
		{
			$struct['staff'][] = array(
				'recordid' => 0,
				'as' => $arr['as'],
				'type' => 2,
				'vgid' => (integer)$_POST['vgid']
			);
		}
	}

	if(isset($_POST['mac']) && !empty($_POST['mac']))
	{
		foreach($_POST['mac'] as $arr)
		{
			$struct['macstaff'][] = array(
				'recordid' => 0,
				'segment' => $arr['segment'],
				'mac' => $arr['mac'],
				'vgid' => (integer)$_POST['vgid']
			);
		}
	}

	if(isset($_POST['phone']) && !empty($_POST['phone']))
	{
		foreach($_POST['phone'] as $arr)
		{
			$struct['telstaff'][] = array(
				'recordid' => (integer)$arr['recordid'],
				'device' => (integer)$arr['device'],
				'ldservice' => $lanbilling->boolean($arr['ldservice']) ? 1 : 0,
				'phonenumber' => trim($arr['phonenumber']),
				'comment' => $arr['comment'],
				'vgid' => (integer)$_POST['vgid']
			);
		}
	}

	if(isset($_POST['rservices']) && !empty($_POST['rservices']))
	{
		foreach($_POST['rservices'] as $arr)
		{
			if(!$lanbilling->boolean($arr['asigned'])) {
				continue;
			}
			$struct['services'][] = array(
				'tarid' => (integer)$_POST['tarid'],
				'catidx' => (integer)$arr['catidx']
			);
		}
	}

	if(USBOX && $lanbilling->Option('use_cerbercrypt') == 1)
	{
		$struct["vgroup"]["cuid"] = (integer)$_POST['cuid'];
	}

	if(isset($_POST['addons']['text']) && sizeof($_POST['addons']['text']) > 0) {
		foreach($_POST['addons']['text'] as $key => $val) {
			$struct['addons'][] = array(
				"vgid" => (integer)$_POST['vgid'],
				"agentid" => (integer)$_POST['module'],
				"type" => 0,
				"idx" => 0,
				"name" => $key,
				"descr" => '',
				"strvalue" => $val
			);
		}
	}

	if(isset($_POST['addons']['combo']) && sizeof($_POST['addons']['combo']) > 0) {
		foreach($_POST['addons']['combo'] as $key => $val) {
			if((integer)$val <= 0) {
				continue;
			}

			$struct['addons'][] = array(
				"vgid" => (integer)$_POST['vgid'],
				"agentid" => (integer)$_POST['module'],
				"type" => 1,
				"idx" => $val,
				"name" => $key,
				"descr" => '',
				"strvalue" => ''
			);
		}
	}

	if( false != ($lanbilling->save("insupdVgroup", $struct, (((integer)$_POST['vgid'] == 0) ? true : false), array("getVgroup", "getVgroups", "getTarifsRasp", "getTarifsHistory"))) )
	{
		$_POST['vgid'] = $lanbilling->saveReturns->ret;
		if(isset($_SESSION['auth']['crossPass'][$_POST['uid']])) {
			unset($_SESSION['auth']['crossPass'][$_POST['uid']]);
		}
		return true;
	}
	else {
		$_POST['vgid'] = $_POST['vgid'];
		$error = $lanbilling->soapLastError();
        if (preg_match("~There is period lock.*(\d{4}\-\d{2}\-\d{2})~is",$error->detail, $matches)){
            $msg = '<br/>' . $localize.get('Period is locked') . '! ' . $localize->get('You cannot make changes before then') . ' ' . $matches[1];
        } elseif(preg_match("~vgroup for self.*~is",$error->detail)){
            $msg = '<br/>' . $localize.get("There is the same account entry") . '!';
        } else {
            $msg = '<br/>' . $error->detail;
        }
		define('ERRORDETAIL', $msg);
		return false;
	}
} // end saveVgroup()


// Установка тарифа объединению

function setTarif( &$lanbilling )
{

	$group_id      =  $_POST['groupid'];         // ид. группы объединения
	$tarif_id_new  =  $_POST['tarid'];           // ид. нового тарифа
	$change_date   =  $_POST['changedatetar'];   // дата начала действия нового тарифа
	$change_time   =  $_POST['changetimetar'];   // дата окончания действия нового тарифа


	if((integer)$_POST['templ'] == 0 && (integer)$_POST['vgid'] > 0)
	{
		if((integer)$lanbilling->getAccess('openpass') < 1) {
			if((integer)$_POST['pass_chg'] == 0) {
				$_POST['pass'] = $_SESSION['auth']['vgPass'];
				unset($_SESSION['auth']['vgPass']);
			}
		}
	}


	if( (integer)$group_id )  // если задано ид. группы объединения
	{

		// находим все учетные записи принадлежащие объединению

		$_filter = array( "groups" => $group_id );

		$_order = array(
				"name"     =>  "v_login",
				"ascdesc"  =>  !isset($_POST['dir']) ? 0 : (($_POST['dir'] == "ASC") ? 0 : 1)
		);

		switch( $_POST['sort'] ) {
			case 'ccrypt'        :  $_order['name']  =  'v_cu_id';          break;
			case 'agrmnum'       :  $_order['name']  =  'a_number';         break;
			case 'balance'       :  $_order['name']  =  'a_balance';        break;
			case 'accondate'     :  $_order['name']  =  'v_acc_ondate';     break;
			case 'accoffdate'    :  $_order['name']  =  'v_acc_offdate';    break;
			case 'blocked'       :  $_order['name']  =  'v_blocked';        break;
			case 'blockdate'     :  $_order['name']  =  'v_block_date';     break;
			case 'agentdescr'    :  $_order['name']  =  'v_id';             break;
			case 'username'      :  $_order['name']  =  'ac_name';          break;
			case 'descr'         :  $_order['name']  =  'v_descr';          break;
			case 'tarifdescr'    :  $_order['name']  =  'v_tar_id';         break;
			case 'creationdate'  :  $_order['name']  =  'v_creation_date';  break;
			default : $_order['name']  =  'v_login';
		}

		$_md5  =  $lanbilling->controlSum( array_merge( $_filter , $_order ) );


		if( false != ($result = $lanbilling->get("getVgroups", array("flt" => $_filter, "ord" => $_order, "md5" => $_md5))) )
		{

			if( !is_array($result) ) { $result = array($result); }


			foreach($result as $obj)
			{

				$vgid          =  $obj->vgid;
				$userid        =  $obj->uid;
				$agentid       =  $obj->id;
				$agrmid        =  $obj->agrmid;
				$agenttype     =  $obj->agenttype;
				$agrmnum       =  $obj->agrmnum;
				$login         =  $obj->login;                         # логин
				$balance       =  sprintf("%.02f", $obj->balance);     # баланс
				$tarifdescr    =  $obj->tarifdescr;                    # тариф
				$tarif_id_old  =  $obj->tarif_id;                      # ид. тарифа
				$agentdescr    =  $obj->agentdescr;
				$username      =  $obj->username;
				$symbol        =  $obj->symbol;
				$canmodify     =  $obj->canmodify;
				$blkreq        =  $obj->blkreq;
				$blocked       =  $obj->blocked;
				$descr         =  $obj->descr;
				$accondate     =  $obj->accondate;
				$accoffdate    =  $obj->accoffdate;
				$ccrypt        =  $obj->cuid;
				$creationdate  =  $obj->creationdate;
				$ppdebt        =  $obj->ppdebt;
				$dirty         =  $obj->dirty;


				// Общие данные учетной записи

				$struct = array("vgroup" => array(

					// Read only
					"currentshape" => 0, "blkreq" => 0, "blocked" => 0, "changed" => 0, "archive" => 0, "dlimit" => 0, "amount" => 0,
					"creationdate" => "", "blockdate" => "", "cdate" => "", "dclear" => "",

					"vgid"        =>  $vgid,
					"cuid"        =>  0,
					"tarid"       =>  $tarif_id_old,
					"agrmid"      =>  $agrmid,
					"id"          =>  $agentid,
					"accondate"   =>  $accondate,
					"accoffdate"  =>  $accoffdate
				));


				if( (integer)$tarif_id_new )  // если указан новый тариф
				{

					$struct['tarrasp'][] = array(
								'vgid'        =>  $vgid,
								'groupid'     =>  0,
								'id'          =>  $agentid,
								'taridnew'    =>  $tarif_id_new,
								'taridold'    =>  0,
								'requestby'   =>  $lanbilling->manager,
								'changetime'  =>  $change_date . str_replace( ':', '', $change_time) );


					if( false != ( $lanbilling->save( "insupdVgroup", $struct, false ) ) )
					{
						$_POST['vgid'] = $lanbilling->saveReturns->ret;
						if(isset($_SESSION['auth']['crossPass'][$_POST['uid']])) {
							unset($_SESSION['auth']['crossPass'][$_POST['uid']]);
						}
					}
					else {
						$_POST['vgid'] = $_POST['vgid'];
						$error = $lanbilling->soapLastError();
						define('ERRORDETAIL', $error->detail);
					}

				}

			}

		}

	}


	echo '({ results: })';

} // end setTarif()


// Установка приостановки объединению

function setSuspension( &$lanbilling )
{

	$group_id           =  $_POST['groupid'];              // ид. группы объединения
	$change_date_start  =  $_POST['changedatesusstart'];   // дата начала приостановки
	$change_time_start  =  $_POST['changetimesusstart'];   // время начала приостановки
	$change_date_end    =  $_POST['changedatesusend'];     // дата окончания приостановки
	$change_time_end    =  $_POST['changetimesusend'];     // время окончания приостановки


	if((integer)$_POST['templ'] == 0 && (integer)$_POST['vgid'] > 0)
	{
		if((integer)$lanbilling->getAccess('openpass') < 1) {
			if((integer)$_POST['pass_chg'] == 0) {
				$_POST['pass'] = $_SESSION['auth']['vgPass'];
				unset($_SESSION['auth']['vgPass']);
			}
		}
	}


	if( (integer)$group_id )  // если задано ид. группы объединения
	{

		// находим все учетные записи принадлежащие объединению

		$_filter = array( "groups" => $group_id );

		$_order = array(
				"name"     =>  "v_login",
				"ascdesc"  =>  !isset($_POST['dir']) ? 0 : (($_POST['dir'] == "ASC") ? 0 : 1)
		);

		switch( $_POST['sort'] ) {
			case 'ccrypt'        :  $_order['name']  =  'v_cu_id';          break;
			case 'agrmnum'       :  $_order['name']  =  'a_number';         break;
			case 'balance'       :  $_order['name']  =  'a_balance';        break;
			case 'accondate'     :  $_order['name']  =  'v_acc_ondate';     break;
			case 'accoffdate'    :  $_order['name']  =  'v_acc_offdate';    break;
			case 'blocked'       :  $_order['name']  =  'v_blocked';        break;
			case 'blockdate'     :  $_order['name']  =  'v_block_date';     break;
			case 'agentdescr'    :  $_order['name']  =  'v_id';             break;
			case 'username'      :  $_order['name']  =  'ac_name';          break;
			case 'descr'         :  $_order['name']  =  'v_descr';          break;
			case 'tarifdescr'    :  $_order['name']  =  'v_tar_id';         break;
			case 'creationdate'  :  $_order['name']  =  'v_creation_date';  break;
			default : $_order['name']  =  'v_login';
		}

		$_md5  =  $lanbilling->controlSum( array_merge( $_filter , $_order ) );


		if( false != ($result = $lanbilling->get("getVgroups", array("flt" => $_filter, "ord" => $_order, "md5" => $_md5))) )
		{

			if( !is_array($result) ) { $result = array($result); }


			foreach($result as $obj)
			{

				$vgid          =  $obj->vgid;
				$userid        =  $obj->uid;
				$agentid       =  $obj->id;
				$agrmid        =  $obj->agrmid;
				$agenttype     =  $obj->agenttype;
				$agrmnum       =  $obj->agrmnum;
				$login         =  $obj->login;                         # логин
				$balance       =  sprintf("%.02f", $obj->balance);     # баланс
				$tarifdescr    =  $obj->tarifdescr;                    # тариф
				$tarif_id_old  =  $obj->tarif_id;                      # ид. тарифа
				$agentdescr    =  $obj->agentdescr;
				$username      =  $obj->username;
				$symbol        =  $obj->symbol;
				$canmodify     =  $obj->canmodify;
				$blkreq        =  $obj->blkreq;
				$blocked       =  $obj->blocked;
				$descr         =  $obj->descr;
				$accondate     =  $obj->accondate;
				$accoffdate    =  $obj->accoffdate;
				$ccrypt        =  $obj->cuid;
				$creationdate  =  $obj->creationdate;
				$ppdebt        =  $obj->ppdebt;
				$dirty         =  $obj->dirty;


				// Общие данные учетной записи

				$struct = array("vgroup" => array(

					// Read only
					"currentshape" => 0, "blkreq" => 0, "blocked" => 0, "changed" => 0, "archive" => 0, "dlimit" => 0, "amount" => 0,
					"creationdate" => "", "blockdate" => "", "cdate" => "", "dclear" => "",

					"vgid"        =>  $vgid,
					"login"        =>  $login,
					"cuid"        =>  0,
					"tarid"       =>  $tarif_id_old,
					"agrmid"      =>  $agrmid,
					"id"          =>  $agentid,
					"accondate"   =>  $accondate,
					"accoffdate"  =>  $accoffdate
				));



				// Формируем структуру данных блокировки по клиенту



				// Выставляем блокировку на дату начала

				$struct['blockrasp'][] = array(
							'id'          =>  $agentid,
							'vgid'        =>  $vgid,
							'blk_req'     =>  2,
							'groupid'     =>  $group_id,
							'requestby'   =>  $lanbilling->manager,
							'changetime'  =>  $change_date_start . str_replace( ':', '', $change_time_start )  );

				if( false != ( $lanbilling->save( "insupdVgroup", $struct, false ) ) )
				{

					$_POST['vgid'] = $lanbilling->saveReturns->ret;
					if(isset($_SESSION['auth']['crossPass'][$_POST['uid']])) {
						unset($_SESSION['auth']['crossPass'][$_POST['uid']]);
					}


					// Выставляем блокировку на дату окончания

					$struct['blockrasp'][] = array(
								'id'          =>  $agentid,
								'vgid'        =>  $vgid,
								'blk_req'     =>  0,
								'groupid'     =>  $group_id,
								'requestby'   =>  $lanbilling->manager,
								'changetime'  =>  $change_date_end . str_replace( ':', '', $change_time_end )  );

					if( false != ( $lanbilling->save( "insupdVgroup", $struct, false ) ) )
					{
						$_POST['vgid'] = $lanbilling->saveReturns->ret;
						if(isset($_SESSION['auth']['crossPass'][$_POST['uid']])) {
							unset($_SESSION['auth']['crossPass'][$_POST['uid']]);
						}

					}
					else {
						$_POST['vgid'] = $_POST['vgid'];
						$error = $lanbilling->soapLastError();
						define('ERRORDETAIL', $error->detail);
					}

				}
				else {
					$_POST['vgid'] = $_POST['vgid'];
					$error = $lanbilling->soapLastError();
					define('ERRORDETAIL', $error->detail);
				}

			}

		}

	}


	echo '({ results: })';

} // end setTarif()


// Установка перерасчета объединению

function setRecount( &$lanbilling )
{

	$group_id           =  $_POST['groupid'];              // ид. группы объединения
	$change_date_start  =  $_POST['changedaterecstart'];   // дата начала перерасчета
	$change_time_start  =  $_POST['changetimerecstart'];   // время начала перерасчета
	$change_date_end    =  $_POST['changedaterecend'];     // дата окончания перерасчета
	$change_time_end    =  $_POST['changetimerecend'];     // время окончания перерасчета


	if((integer)$_POST['templ'] == 0 && (integer)$_POST['vgid'] > 0)
	{
		if((integer)$lanbilling->getAccess('openpass') < 1) {
			if((integer)$_POST['pass_chg'] == 0) {
				$_POST['pass'] = $_SESSION['auth']['vgPass'];
				unset($_SESSION['auth']['vgPass']);
			}
		}
	}


	if( (integer)$group_id )  // если задано ид. группы объединения
	{

		// находим все учетные записи принадлежащие объединению

		$_filter = array( "groups" => $group_id );

		$_order = array(
				"name"     =>  "v_login",
				"ascdesc"  =>  !isset($_POST['dir']) ? 0 : (($_POST['dir'] == "ASC") ? 0 : 1)
		);

		switch( $_POST['sort'] ) {
			case 'ccrypt'        :  $_order['name']  =  'v_cu_id';          break;
			case 'agrmnum'       :  $_order['name']  =  'a_number';         break;
			case 'balance'       :  $_order['name']  =  'a_balance';        break;
			case 'accondate'     :  $_order['name']  =  'v_acc_ondate';     break;
			case 'accoffdate'    :  $_order['name']  =  'v_acc_offdate';    break;
			case 'blocked'       :  $_order['name']  =  'v_blocked';        break;
			case 'blockdate'     :  $_order['name']  =  'v_block_date';     break;
			case 'agentdescr'    :  $_order['name']  =  'v_id';             break;
			case 'username'      :  $_order['name']  =  'ac_name';          break;
			case 'descr'         :  $_order['name']  =  'v_descr';          break;
			case 'tarifdescr'    :  $_order['name']  =  'v_tar_id';         break;
			case 'creationdate'  :  $_order['name']  =  'v_creation_date';  break;
			default : $_order['name']  =  'v_login';
		}

		$_md5  =  $lanbilling->controlSum( array_merge( $_filter , $_order ) );


		if( false != ($result = $lanbilling->get("getVgroups", array("flt" => $_filter, "ord" => $_order, "md5" => $_md5))) )
		{

			if( !is_array($result) ) { $result = array($result); }


			foreach($result as $obj)
			{

				$vgid          =  $obj->vgid;
				$userid        =  $obj->uid;
				$agentid       =  $obj->id;
				$agrmid        =  $obj->agrmid;
				$agenttype     =  $obj->agenttype;
				$agrmnum       =  $obj->agrmnum;
				$login         =  $obj->login;                         # логин
				$balance       =  sprintf("%.02f", $obj->balance);     # баланс
				$tarifdescr    =  $obj->tarifdescr;                    # тариф
				$tarif_id_old  =  $obj->tarif_id;                      # ид. тарифа
				$agentdescr    =  $obj->agentdescr;
				$username      =  $obj->username;
				$symbol        =  $obj->symbol;
				$canmodify     =  $obj->canmodify;
				$blkreq        =  $obj->blkreq;
				$blocked       =  $obj->blocked;
				$descr         =  $obj->descr;
				$accondate     =  $obj->accondate;
				$accoffdate    =  $obj->accoffdate;
				$ccrypt        =  $obj->cuid;
				$creationdate  =  $obj->creationdate;
				$ppdebt        =  $obj->ppdebt;
				$dirty         =  $obj->dirty;


				// Общие данные учетной записи

				$struct = array("vgroup" => array(

					// Read only
					"currentshape" => 0, "blkreq" => 0, "blocked" => 0, "changed" => 0, "archive" => 0, "dlimit" => 0, "amount" => 0,
					"creationdate" => "", "blockdate" => "", "cdate" => "", "dclear" => "",

					"vgid"        =>  $vgid,
					"cuid"        =>  0,
					"tarid"       =>  $tarif_id_old,
					"agrmid"      =>  $agrmid,
					"id"          =>  $agentid,
					"accondate"   =>  $accondate,
					"accoffdate"  =>  $accoffdate
				));


				// Формируем структуру данных блокировки по клиенту


				// Выставляем блокировку на дату начала

				$struct['blockrasp'][] = array(
							'id'          =>  $agentid,
							'vgid'        =>  $vgid,
							'blk_req'     =>  2,
							'groupid'     =>  $group_id,
							'requestby'   =>  $lanbilling->manager,
							'changetime'  =>  $change_date_start . str_replace( ':', '', $change_time_start )  );

				if( false != ( $lanbilling->save( "insupdVgroup", $struct, false ) ) )
				{

					$_POST['vgid'] = $lanbilling->saveReturns->ret;
					if(isset($_SESSION['auth']['crossPass'][$_POST['uid']])) {
						unset($_SESSION['auth']['crossPass'][$_POST['uid']]);
					}


					// Выставляем блокировку на дату окончания

					$struct['blockrasp'][] = array(
								'id'          =>  $agentid,
								'vgid'        =>  $vgid,
								'blk_req'     =>  0,
								'groupid'     =>  $group_id,
								'requestby'   =>  $lanbilling->manager,
								'changetime'  =>  $change_date_end . str_replace( ':', '', $change_time_end ) );

					if( false != ( $lanbilling->save( "insupdVgroup", $struct, false ) ) )
					{
						$_POST['vgid'] = $lanbilling->saveReturns->ret;
						if(isset($_SESSION['auth']['crossPass'][$_POST['uid']])) {
							unset($_SESSION['auth']['crossPass'][$_POST['uid']]);
						}

					}
					else {
						$_POST['vgid'] = $_POST['vgid'];
						$error = $lanbilling->soapLastError();
						define('ERRORDETAIL', $error->detail);
					}

				}
				else {
					$_POST['vgid'] = $_POST['vgid'];
					$error = $lanbilling->soapLastError();
					define('ERRORDETAIL', $error->detail);
				}

			}

		}

	}


	echo '({ results: })';

} // end setTarif()


// Установка услуги объединению

function setUsboxService( &$lanbilling )
{

	$group_id      =  $_POST['groupid'];         // ид. группы объединения
	$tarif_id      =  $_POST['tarid'];           // ид. тарифа
	$change_date   =  $_POST['changedatetar'];   // дата начала действия нового тарифа
	$change_time   =  $_POST['changetimetar'];   // дата окончания действия нового тарифа


	if((integer)$_POST['templ'] == 0 && (integer)$_POST['vgid'] > 0)
	{
		if((integer)$lanbilling->getAccess('openpass') < 1) {
			if((integer)$_POST['pass_chg'] == 0) {
				$_POST['pass'] = $_SESSION['auth']['vgPass'];
				unset($_SESSION['auth']['vgPass']);
			}
		}
	}


	if( (integer)$group_id )  // если задано ид. группы объединения
	{

		// находим все учетные записи принадлежащие объединению

		$_filter = array( "groups" => $group_id );

		$_order = array(
				"name"     =>  "v_login",
				"ascdesc"  =>  !isset($_POST['dir']) ? 0 : (($_POST['dir'] == "ASC") ? 0 : 1)
		);

		switch( $_POST['sort'] ) {
			case 'ccrypt'        :  $_order['name']  =  'v_cu_id';          break;
			case 'agrmnum'       :  $_order['name']  =  'a_number';         break;
			case 'balance'       :  $_order['name']  =  'a_balance';        break;
			case 'accondate'     :  $_order['name']  =  'v_acc_ondate';     break;
			case 'accoffdate'    :  $_order['name']  =  'v_acc_offdate';    break;
			case 'blocked'       :  $_order['name']  =  'v_blocked';        break;
			case 'blockdate'     :  $_order['name']  =  'v_block_date';     break;
			case 'agentdescr'    :  $_order['name']  =  'v_id';             break;
			case 'username'      :  $_order['name']  =  'ac_name';          break;
			case 'descr'         :  $_order['name']  =  'v_descr';          break;
			case 'tarifdescr'    :  $_order['name']  =  'v_tar_id';         break;
			case 'creationdate'  :  $_order['name']  =  'v_creation_date';  break;
			default : $_order['name']  =  'v_login';
		}

		$_md5  =  $lanbilling->controlSum( array_merge( $_filter , $_order ) );


		if( false != ($result = $lanbilling->get("getVgroups", array("flt" => $_filter, "ord" => $_order, "md5" => $_md5))) )
		{

			if( !is_array($result) ) { $result = array($result); }


			foreach($result as $obj)
			{

				$vgid          =  $obj->vgid;
				$userid        =  $obj->uid;
				$agentid       =  $obj->id;
				$agrmid        =  $obj->agrmid;
				$agenttype     =  $obj->agenttype;
				$agrmnum       =  $obj->agrmnum;
				$login         =  $obj->login;                         # логин
				$balance       =  sprintf("%.02f", $obj->balance);     # баланс
				$tarifdescr    =  $obj->tarifdescr;                    # тариф
				$tarif_id_old  =  $obj->tarif_id;                      # ид. тарифа
				$agentdescr    =  $obj->agentdescr;
				$username      =  $obj->username;
				$symbol        =  $obj->symbol;
				$canmodify     =  $obj->canmodify;
				$blkreq        =  $obj->blkreq;
				$blocked       =  $obj->blocked;
				$descr         =  $obj->descr;
				$accondate     =  $obj->accondate;
				$accoffdate    =  $obj->accoffdate;
				$ccrypt        =  $obj->cuid;
				$creationdate  =  $obj->creationdate;
				$ppdebt        =  $obj->ppdebt;
				$dirty         =  $obj->dirty;



				// Общие данные учетной записи

				$struct = array("vgroup" => array(

					// Read only
					"currentshape" => 0, "blkreq" => 0, "blocked" => 0, "changed" => 0, "archive" => 0, "dlimit" => 0, "amount" => 0,
					"creationdate" => "", "blockdate" => "", "cdate" => "", "dclear" => "",

					"vgid"        =>  $vgid,
					"cuid"        =>  0,
					"tarid"       =>  $tarif_id_old,
					"agrmid"      =>  $agrmid,
					"id"          =>  $agentid,
					"accondate"   =>  $accondate,
					"accoffdate"  =>  $accoffdate
				));


				if( (integer)$tarif_id )  // если указан тариф
				{

					$struct['tarrasp'][] = array(
								'vgid'        =>  $vgid,
								'groupid'     =>  0,
								'id'          =>  $agentid,
								'taridnew'    =>  $tarif_id,
								'taridold'    =>  0,
								'requestby'   =>  $lanbilling->manager,
								'changetime'  =>  $change_date . str_replace( ':', '', $change_time) );


					if( false != ( $lanbilling->save( "insupdVgroup", $struct, false ) ) )
					{
						$_POST['vgid'] = $lanbilling->saveReturns->ret;
						if(isset($_SESSION['auth']['crossPass'][$_POST['uid']])) {
							unset($_SESSION['auth']['crossPass'][$_POST['uid']]);
						}
					}
					else {
						$_POST['vgid'] = $_POST['vgid'];
						$error = $lanbilling->soapLastError();
						define('ERRORDETAIL', $error->detail);
					}

				}



				// Заводим периодическую услугу

				$struct = array(
						"servid"    =>  0,
						"vgid"      =>  $vgid,
						"tarid"     =>  $tarif_id,
						"catidx"    =>  0,
						"mul"       =>  1,
						"timefrom"  =>  $change_date_end . str_replace( ':', '', $change_time_end ) );

				if( false == $lanbilling->save( "insupdUsboxService", $struct, true, array("getUsboxServices") ) )
				{
					$error = $lanbilling->soapLastError();
					define('ERRORDETAIL', $error->detail);
				}

			}

		}

	}


	echo '({ results: })';

} // end setUsboxService()

/**
 * Show modules list in the vgroups list view
 * @param	object, billing class
 * @param	object, localize class
 */
/*function getModules( &$lanbilling, &$localize )
{
	$_tmp = array(
		array(
			"id" => 0,
			"type" => null,
			"name" => $localize->get('All') . ' ' . $localize->get('modules')
		)
	);

	if( false != ($result = $lanbilling->get("getAgentsExt")) )
	{
		if(!is_array($result)) {
			$result = array($result);
		}

		array_walk($result, create_function('&$obj, $key, $_tmp', '
			$name = $obj->agent->descr;
			if(empty($obj->agent->servicename)) {
				$name = $obj->agent->descr;
			};
			$_tmp[0][] = array(
				"id" => $obj->agent->id,
				"type" => $obj->agent->type,
				"name" => $name
			);
		'), array(&$_tmp));
	}

	if(sizeof($_tmp) > 0) {
		echo '({ results: ' . JEncode($_tmp, $lanbilling) . '})';
	}
	else echo "({ })";
}*/ // end getModules()


/**
 * Get vgroups list and send them as JSON object
 * @param	object, billing class
 */
function getVgroups( &$lanbilling )
{
	$_tmp = array();

	$_filter = usersFilter($lanbilling);

	/**
	 * Available order by
	 * v_vg_id
	 * v_id
	 * v_tar_id
	 * v_agrm_id
	 * v_blk_req
	 * v_blocked
	 * ac_uid
	 * s_type
	 * ac_category
	 * v_cu_id
	 * a_balance
	 * v_login
	 * v_descr
	 * a_number
	 * a_code
	 * ac_name
	 * v_creation_date
	 * v_acc_ondate
	 * v_acc_offdate
	 * v_block_date
	 * s_descr
	 * t_descr
	 * c_symbol
	 */
	$_order = array(
		"name" => "v_login",
		"ascdesc" => !isset($_POST['dir']) ? 0 : (($_POST['dir'] == "ASC") ? 0 : 1)
	);

	switch($_POST['sort']) {
		case 'ccrypt': $_order['name'] = 'v_cu_id'; break;
		case 'agrmnum': $_order['name'] = 'a_number'; break;
		case 'balance': $_order['name'] = 'a_balance'; break;
		case 'accondate': $_order['name'] = 'v_acc_ondate'; break;
		case 'accoffdate': $_order['name'] = 'v_acc_offdate'; break;
		case 'blocked': $_order['name'] = 'v_blocked'; break;
		case 'blockdate': $_order['name'] = 'v_block_date'; break;
		case 'agentdescr': $_order['name'] = 'v_id'; break;
		case 'username': $_order['name'] = 'ac_name'; break;
		case 'descr': $_order['name'] = 'v_descr'; break;
		case 'tarifdescr': $_order['name'] = 'v_tar_id'; break;
		case 'creationdate': $_order['name'] = 'v_creation_date'; break;
		default : $_order['name'] = 'v_login';
	}


	$_md5 = $lanbilling->controlSum(array_merge($_filter, $_order));
	$count = $lanbilling->get("Count", array("flt" => $_filter, "procname" => (integer)$_POST['packetentryid'] > 0 ? "getAvailableVgroups" : "getVgroups", "md5" => $_md5));
	
	if( false != ($result = $lanbilling->get((integer)$_POST['packetentryid'] > 0 ? "getAvailableVgroups" : "getVgroups", array("flt" => $_filter, "ord" => $_order, "md5" => $_md5))) )
	{
		if(!is_array($result)) {
			$result = array($result);
		}

		foreach($result as $obj)
		{
			if((integer)substr($obj->blockdate, 0, 4) == 0) {
				$_date = $obj->creationdate;
			}
			else $_date = $obj->blockdate;

			$_tmp[] = array(
				"vgid" => $obj->vgid,
				"userid" => $obj->uid,
				"agentid" => $obj->id,
				"agrmid" => $obj->agrmid,
				"agenttype" => $obj->agenttype,
				"agrmnum" => $obj->agrmnum,
				"login" => $obj->login,
				"balance" => sprintf("%.02f", $obj->balance),
				"tarifdescr" => $obj->tarifdescr,
				"agentdescr" => $obj->agentdescr,
				"username" => $obj->username,
				"symbol" => $obj->symbol,
				"canmodify" => $obj->canmodify,
				"blkreq" => $obj->blkreq,
				"blocked" => $obj->blocked,
				"blockdate" => $_date,
				"descr" => $obj->descr,
				"accondate" => $obj->accondate,
				"accoffdate" => $obj->accoffdate,
				"ccrypt" => $obj->cuid,
				"creationdate" => $obj->creationdate,
				"ppdebt" => $obj->ppdebt,
				"dirty" => $obj->dirty
			);
		}
	}

	if(sizeof($_tmp) > 0) {
		echo '({"total": ' . $count . ', "results": ' . JEncode($_tmp, $lanbilling) . '})';
	}
	else echo '({ "total": 0, "results": "" })';

	// Clear memory
	unset($_tmp, $_filter, $_md5, $count, $obj);
} // end getUsers()


/**
 * Build filter structure, returns array
 * Avaliable filter values
 * Imperative: istemplate, archive
 * Posible: tarid, agentid, agrmid, userid, blocked
 * !name.empty(), !login.empty(), !descr.empty(), !agrmnum.empty(), !code.empty()
 *
 * @param	object, billing class
 */
function usersFilter( &$lanbilling )
{
	$_filter = array(
		"personid" => $lanbilling->manager,
		"agentid" => (integer)$_POST['getvgroups'],
		"istemplate" => (integer)$_POST['istemplate'],
		"blocked" => (integer)$_POST['blocked'],
		"tarid" => (integer)$_POST['tarid'],
		"agrmid" => (integer)$_POST['agrmid']
	);

	if((integer)$_POST['vguserid'] > 0) {
		$_filter['userid'] = $_POST['vguserid'];
	}
    
    if((integer)$_POST['agentid'] == 0 && (integer)$_POST['usedtv'] > 0) {
        $_filter["fullsearch"] = 'USECARDS';
    }
    
	if(isset($_POST['searchtpl']) && !empty($_POST['searchtpl'])) {
		foreach($_POST['searchtpl'] as $item) {
			$t = explode('.', $item['property']);
			$_filter['searchtempl'][] = array(
				"tplname" => '',
				"tablename" => $t[0],
				"field" => $t[1],
				"condition" => $item['condition'],
				"value" => $item['value'],
				"logic" => $item['logic']
			);
		}
	}
	else {
		$sval = trim($_POST['search']);
		switch((integer)$_POST['searchtype'])
		{
			case 0: $_filter['name'] = $sval; break;
			case 1: $_filter['agrmnum'] = $sval; break;
			case 2: $_filter['login'] = $sval; break;
			case 4: $_filter['ip'] = $sval; break;
			case 5: $_filter['phone'] = $sval; break;
			case 6: $_filter['code'] = $sval; break;
			case 7: $_filter['descr'] = $sval; break;
			case 8: $_filter['address'] = $sval; break;
			case 10: $_filter['cardkey'] = $sval; break;
			
			// Smartcard and decoder attributes
			case 11: $_filter['serialnumber'] = $sval; break;
			case 12: $_filter['serial'] = $sval; break;
			case 13: $_filter['mac'] = $sval; break;
			case 14: $_filter['chipid'] = $sval; break;
			
			default: $_POST['search'];
		}
	}
    
    if((integer)$_POST['packetentryid'] > 0) {
        $_filter['recordid'] = (integer)$_POST['packetentryid'];
        $_filter['code'] = (string)$_POST['packetvgids'];
    }
    
	$_filter['pgsize'] = ((integer)$_POST['limit'] <= 0) ? 100 : $_POST['limit'];
	$_filter['pgnum'] = $lanbilling->linesAsPageNum($_filter['pgsize'], (integer)$_POST['start'] + 1);

	return $_filter;
} // end Filter()


/**
 * Build tariffs list grouping by service type
 * Agreement filter:
 * Imperative: archive
 * Possible: uid, agrmid, !agrmnum.empty(), !code.empty()
 *
 * @param	object, billing class
 */
function getTarifs( &$lanbilling )
{
	if((integer)$_POST['gettarifs'] > 0)
	{
		if( false != ($modules = $lanbilling->get("getAgentsExt")) )
		{
			if(!is_array($modules)) {
				$modules = array($modules);
			}

			$moduleType = 0;
			array_walk($modules, create_function('&$obj, $key, $arr', 'if($obj->agent->id == $_POST["gettarifs"]) { $arr[0] = $obj->agent->type; }'), array(&$moduleType));
		}
	}

	if((integer)$_POST['agrmcurid'] > 0)
	{
		$_filter = array("archive" => 0, "agrmid" => (integer)$_POST['agrmcurid']);
		$_md5 = $lanbilling->controlSum($_filter);

		if( false == ($agrm = $lanbilling->get("getAgreements", array("flt" => $_filter, "md5" => $_md5)) ) )
		{
			echo '({ "total": 0, "results": "" })';
			return false;
		}
	}
	//if( false == $tarifs = $lanbilling->get("getTarifsExt", array("archive" => 0, "unavail" => !isset($_POST['unavail']) ? -1 : (integer)$_POST['unavail'], "formanager" => 1)) )
	if( false == $tarifs = $lanbilling->get("getTarifsExt2", array('flt'=>array("archive" => 0, "unavail" => !isset($_POST['unavail']) ? -1 : (integer)$_POST['unavail']), "common" => -1)) )
	{
		echo '({ "total": 0, "results": "" })';
		return false;
	}

	if(!is_array($tarifs)) {
		$tarifs = array($tarifs);
	}

	$_tmp = array();
	foreach($tarifs as $obj)
	{
		if(isset($_POST['agrmcurid']) && $obj->tarif->curid != (integer)$agrm->curid) {
			continue;
		}
		if(isset($_POST['origtarid']) && (integer)$_POST['origtarid'] > 0 && $obj->tarif->tarid == (integer)$_POST['origtarid']) {
			continue;
		}

		switch($moduleType)
		{
			case 1: case 2: case 3: case 4: case 5:
				if($obj->tarif->type == 0) {
					$_tmp[] = array(
						"id"     => $obj->tarif->tarid,
						"tarid"  => $obj->tarif->tarid,
						"name"   => $obj->tarif->descr,
						"curid"  => $obj->tarif->curid,
						"symbol" => $obj->tarif->symbol,
						"coeflow"=> $obj->tarif->coeflow,
						"coefhigh"=> $obj->tarif->coefhigh
					);
				}
			break;

			case 6:
				if($obj->tarif->type > 0 && $obj->tarif->type < 3) {
					$_tmp[] = array(
						"id"     => $obj->tarif->tarid,
						"tarid"  => $obj->tarif->tarid,
						"name"   => $obj->tarif->descr,
						"curid"  => $obj->tarif->curid,
						"symbol" => $obj->tarif->symbol,
						"coeflow"=> $obj->tarif->coeflow,
						"coefhigh"=> $obj->tarif->coefhigh
					);
				}
			break;

			case 7: case 8: case 9: case 10: case 11:
				if($obj->tarif->type == 3) {
					$_tmp[] = array(
						"id"     => $obj->tarif->tarid,
						"tarid"  => $obj->tarif->tarid,
						"name"   => $obj->tarif->descr,
						"curid"  => $obj->tarif->curid,
						"symbol" => $obj->tarif->symbol,
						"coeflow"=> $obj->tarif->coeflow,
						"coefhigh"=> $obj->tarif->coefhigh

					);
				}
			break;

			case 12:
				if($obj->tarif->type == 4) {
					$_tmp[] = array(
						"id"     => $obj->tarif->tarid,
						"tarid"  => $obj->tarif->tarid,
						"name"   => $obj->tarif->descr,
						"curid"  => $obj->tarif->curid,
						"symbol" => $obj->tarif->symbol,
						"coeflow"=> $obj->tarif->coeflow,
						"coefhigh"=> $obj->tarif->coefhigh

					);
				}
			break;

			case 13:
				if($obj->tarif->type == 5) {
					$_tmp[] = array(
						"id"     => $obj->tarif->tarid,
						"tarid"  => $obj->tarif->tarid,
						"name"   => $obj->tarif->descr,
						"curid"  => $obj->tarif->curid,
						"symbol" => $obj->tarif->symbol,
						"coeflow"=> $obj->tarif->coeflow,
						"coefhigh"=> $obj->tarif->coefhigh

					);
				}
			break;

			default:
				$_tmp[] = array(
					"id"     => $obj->tarif->tarid,
					"tarid"  => $obj->tarif->tarid,
					"name"   => $obj->tarif->descr,
					"curid"  => $obj->tarif->curid,
					"symbol" => $obj->tarif->symbol,
					"coeflow"=> $obj->tarif->coeflow,
					"coefhigh"=> $obj->tarif->coefhigh

				);
		}
	}

	if(sizeof($_tmp) > 0) {
		echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
	}
	else echo '({ "total": 0, "results": "" })';
} // end getTarifs()


/**
 * Get agreements list for the selected user
 * @param	object, billing class
 */
function getAgreements( &$lanbilling )
{
	if((integer)$_POST['getagrms'] > 0)
	{
		if( false == ($user = $lanbilling->get("getAccount", array("id" => $_POST['getagrms']))) )
		{
			echo '({ "results": "" })';
			return false;
		}

		if(!is_array($user->agreements)) {
			$user->agreements = array($user->agreements);
		}

		$_tmp = array();
		foreach($user->agreements as $agrms) {
			if($agrms->agrmid == (int)$_POST['agrmid']) $_tmp[] = array("agrmid" => $agrms->agrmid, "number" => $agrms->number);
		}
		//array_walk($user->agreements, create_function('&$val, $key, $_tmp', '$_tmp[0][] = array("agrmid" => $val->agrmid, "number" => $val->number);'), array(&$_tmp));
		
		if(sizeof($_tmp) > 0) {
			echo '({ "results": ' . JEncode($_tmp, $lanbilling) . '})';
		}
		else echo '({ "results": "" })';
	}
	else echo '({ "results": "" })';
} // end getAgreements()


/**
 * Get assigned ip addresses for the selected vgroup
 * @param	object, billing class
 */
function getIpList( &$lanbilling )
{
	if((integer)$_POST['getips'] <= 0) {
		echo '({ "results": "" })';
		return;
	}

	$_POST['vgid'] = $_POST['getips'];
	$result = initVgroup($lanbilling);

	if(isset($result->staff) && !empty($result->staff)) {
		if(!is_array($result->staff)) {
			$result->staff = array($result->staff);
		}
	}
	else {
		echo '({ "results": "" })';
		return;
	}

	$_tmp = array();
	foreach($result->staff as $key => $item) {
		if($item->type < 2) {
			$_tmp[] = array(
				"segment"	=> $item->ipmask->ip,
				"mask"		=> $item->ipmask->mask,
				"type"		=> $item->type,
				"recordid"	=> $item->recordid
			);
		}
	}

	if(sizeof($_tmp) > 0) {
		echo '({ "results": ' . JEncode($_tmp, $lanbilling) . '})';
	}
	else {
		echo '({ "results": "" })';
	}
} // end getIpList()

/**
 * Get assigned SNMP idex for the selected vgroup
 * @param	object, billing class
 */
function getIfIndex( &$lanbilling )
{
	if ( (integer)$_POST['get_ifindex'] <= 0 ) {
		echo '({ success: true, "data": ""})';
		return;
	}

	$_POST['vgid'] = $_POST['get_ifindex'];

	$result = initVgroup($lanbilling);
	$_tmp = array();
	$_tmp['ifindex'] = $result->vgroup->ifindex;

	if(sizeof($_tmp) > 0) {
		echo '({ success: true, "data": '.JEncode($_tmp, $lanbilling).'})';
	}
	else {
		echo '({ success: true, "data": ""})';
	}
} // end getIfIndex()


/**
 * Try to get module avaliable segments for the selected vgroup
 * @param	object, billing class
 */
function getModuleSegments( &$lanbilling )
{
	if((integer)$_POST['getsegments'] <= 0) {
		echo '({ "results": "" })';
		return false;
	}
	
	$findAgent = getAddonsIdx($lanbilling, $localize);
	if (!empty($findAgent)){
		if (!is_array($findAgent)) $findAgent = array($findAgent);	
		foreach($findAgent as $key => $val) {			
			if (trim($val->name) == 'old_agent_id'){
				$oldagent = $val->idx;
				break;
			}
		}
	}
	
    $idx = (isset($oldagent) && (integer)$oldagent > 0) ? $oldagent : $_POST['getsegments'];
    if( false == ($result = $lanbilling->get("getSegments", array("id" => $idx))) ) {
		echo '({ "results": "" })';
		return;
	}

	if(empty($result)) {
		echo '({ "results": "" })';
		return;
	}

	if(!is_array($result)) {
		$result = array($result);
	}

	$_tmp = array();
	array_walk($result, create_function('&$val, $key, $_tmp', '$_tmp[0][] = array("segment" => $val->ipmask->ip, "mask" => $val->ipmask->mask);'), array(&$_tmp));

	if(sizeof($_tmp) > 0) {
		echo '({ "results": ' . JEncode($_tmp, $lanbilling) . '})';
	}
	else echo '({ "results": "" })';
} // end getModuleSegments()


/**
 * Get Local AS number assigned to the vgroup
 * @param	object, billing class
 */
function getASList( &$lanbilling )
{
	if((integer)$_POST['getaslist'] <= 0) {
		echo '({ "results": [] })';
		return false;
	}

	$_POST['vgid'] = $_POST['getaslist'];
	$result = initVgroup($lanbilling);

	if(isset($result->staff) && !empty($result->staff)) {
		if(!is_array($result->staff)) {
			$result->staff = array($result->staff);
		}
	}
	else {
		echo '({ "results": [] })';
		return;
	}

	$_tmp = array();
	array_walk($result->staff, create_function('$item, $key, $_tmp','
		if($item->type == 2) {
			$_tmp[0][] = (array)$item;
		};
	'), array( &$_tmp ));

	if(sizeof($_tmp) > 0) {
		echo '({ "results": ' . JEncode($_tmp, $lanbilling) . '})';
	}
	else {
		echo '({ "results": [] })';
	}
} // end getASList()


/**
 * Try to get vgroups mac's list
 * @param	object, billing class
 */
function getMACList( &$lanbilling )
{
	if((integer)$_POST['getmacs'] <= 0) {
		echo '({ "results": "" })';
		return false;
	}

	if( false == ($result = $lanbilling->get("getVgroup", array("id" => $_POST['getmacs']))) ) {
		echo '({ "results": "" })';
		return;
	}

	if(empty($result->macstaff)) {
		echo '({ "results": "" })';
		return;
	}

	if(!is_array($result->macstaff)) {
		$result->macstaff = array($result->macstaff);
	}

	$_tmp = array();
	array_walk($result->macstaff, create_function('&$val, $key, $_tmp','$_tmp[0][] = (array)$val;'), array(&$_tmp));

	if(sizeof($_tmp) > 0) {
		echo '({ "results": ' . JEncode($_tmp, $lanbilling) . '})';
	}
	else echo '({ "results": "" })';
} // end getMACList()


/**
 * Try to request free segments list built on recieved data
 * @param	object, billing class
 */
function getFreeSegments( &$lanbilling )
{
	if((integer)$_POST['getipfree'] <= 0) {
		echo '({ "results": "" })';
		return false;
	}

	$_filter = array("id" => $_POST['getipfree'],
			"segment" => $_POST['segment'],
			"mask" => $_POST['mask'],
			"with0x00" => (!$lanbilling->boolean($_POST['broadcast'])) ? 1 : 0,
			"with0xFF" => (!$lanbilling->boolean($_POST['broadcast'])) ? 1 : 0,
			"used" => $_POST['used'],
			"maxcnt" => 0, // Ограничение списка выводимых свободных IP адресов учетной записи (0 - show all) 
            "pgsize" => ((integer)$_POST['limit'] <= 0) ? 100 : $_POST['limit']
		);
	
	$_filter['pgnum'] = $lanbilling->linesAsPageNum($_filter['pgsize'], (integer)$_POST['start'] + 1);
	
	if( false == ($result = $lanbilling->get("IPCalc", array("flt" => $_filter), true)) ) {
		echo '({ "results": "" })';
		return;
	}
	
	
	
	
	if(!is_array($result)) {
		$result = array($result);
	}

	$_tmp = array();
	array_walk($result, create_function('&$val, $key, $_tmp', '$_tmp[0][] = array(
			"ip" => $val->ip, 
			"mask" => $val->mask,
			"segmentid" => $val->segmentid,
	);'), array(&$_tmp));
	
	$_count = (int)$lanbilling->get("IPCalcCount", array("flt" => $_filter));

	if(sizeof($_tmp) > 0) {		
		echo '({ "results": ' . JEncode($_tmp, $lanbilling) . ', "total": ' . JEncode($_count, $lanbilling) . '})';
	}
	else echo '({ "results": "" })';
} // end getFreeSegments()


/**
 * Try to get phone numbers for the selected vgroups
 * @param	object, class billing
 */
function getPhoneNumbers( &$lanbilling )
{
	if((integer)$_POST['getphones'] <= 0) {
		echo '({ "results": "" })';
		return false;
	}

	if( false == ($result = $lanbilling->get("getVgroup", array("id" => $_POST['getphones']))) ) {
		echo '({ "results": "" })';
		return;
	}

	if(empty($result->telstaff)) {
		echo '({ "results": "" })';
		return;
	}

	if(!is_array($result->telstaff)) {
		$result->telstaff = array($result->telstaff);
	}

	$_tmp = array();
	array_walk($result->telstaff, create_function('$item, $key, $_tmp','$_tmp[0][] = array("recordid" => $item->recordid, "device" => $item->device, "ldservice" => $item->ldservice, "phonenumber" => $item->phonenumber, "comment" => $item->comment);'), array(&$_tmp));

	if(sizeof($_tmp) > 0) {
		echo '({ "results": ' . JEncode($_tmp, $lanbilling) . '})';
	}
	else echo '({ "results": "" })';
} // end getPhoneNumbers();


/**
 * Send to server to block selected vgroup
 * @param	object, billing class
 * @param	object, localize class
 */
function sendLockCommand( &$lanbilling, &$localize )
{
	if($lanbilling->getAccess('accounts') < 1) {
		echo '({ success: false, reason: "' . $localize->get('You dont have rights to complete this action') . '" })';
		return false;
	}

	$_withError = array();

	if(!empty($_POST['lockcommand'])) {
		foreach($_POST['lockcommand'] as $key => $item) {
			if((integer)$key > 0) {
				// Block type definition
				switch($item['action']) {
					case 'unlock':
						$action = $item['state'];
					break;

					case 'off':
						$action = '10';
					break;

					case 'lock':
					default:
						$action = 3;
					break;
				}

				// If state already in case
				if($item['action'] == 'off' && $item['state'] == 10) {
					continue;
				}
				elseif($item['action'] == 'lock' && $item['state'] == 10) {
					$_withError[] = array($item['login'], $item['tarifdescr'], $localize->get('Account is off You have to turn it on before'));
					continue;
				}
				elseif($item['action'] == 'unlock' && $item['state'] == 0) {
					continue;
				}

				/**
				 * State parameter: on / off
				 */
				if( false == $lanbilling->get("blkVgroup", array("id" => $key, "blk" => $action, ($item['action'] == 'unlock') ? 'on' : 'off'), true)) {
					$error = $lanbilling->soapLastError();
					$_withError[] = array($item['login'], $item['tarifdescr'], $localize->get($error->detail));
				}
			}
		}
	}


	if(empty($_withError)) {
		echo "({ success: true, reason: '" . $localize->get('Request done successfully') . "' })";
	}
	else {
		echo "({ success: false, reason: " . JEncode($_withError, $lanbilling) . "})";
	}
} // end callBlockRequest()


/**
 * Delete selected vgroup item
 * @param	object, billing object
 * @param	object, localize class
 */
function deleteVgroup( &$lanbilling, &$localize )
{
	if($lanbilling->getAccess('accounts') < 2) {
		echo '({ success: false, reason: "' . $localize->get('You dont have rights to complete this action') . '" })';
		return false;
	}

	$_withError = array();

	if(!empty($_POST['delvgid'])) {
		foreach($_POST['delvgid'] as $key => $item) {
			if((integer)$key > 0) {
				if( false == $lanbilling->delete("delVgroup", array("id" => $key), array("getAccount", "getVgroup", "getTarifsRasp", "getTarifsHistory", "getVgroups")) ) {
					$error = $lanbilling->soapLastError();
					if(false !== strpos($error->detail, 'assigned usbox_services')) {
						$_withError[] = array($item['login'], $item['tarifdescr'], $localize->get('There is a working service for this account'));
					}
					else {
						$_withError[] = array($item['login'], $item['tarifdescr'], $localize->get($error->detail));
					}
				}
			}
		}
	}

	if(empty($_withError)) {
		echo "({ success: true, reason: '" . $localize->get('Request done successfully') . "' })";
	}
	else {
		if(sizeof($_withError) == 1) {
			echo "({ success: false, reason: " . JEncode($_withError[0][2], $lanbilling) . "})";
		}
		else {
			echo "({ success: false, reason: " . JEncode($_withError, $lanbilling) . "})";
		}
	}
} // end deleteVgroup()


/**
 * Get the list of additional user's form fields
 * @param	object, billing class
 */
function getVgFormFields( &$lanbilling )
{
	$_filter = array();
	$_tmp = array();

	if(!empty($_POST['getvfrmfds'])) {
		$_filter['name'] = $_POST['getvfrmfds'];
	}

	if( false != ($result = $lanbilling->get("getVgroupsAddonsSet", array('flt' => $_filter))) )
	{
		if(isset($_POST['values'])) {
			if(isset($result->staff)) {
				if(!is_array($result->staff)) {
					$result->staff = array($result->staff);
				}

				array_walk($result->staff, create_function('$item, $key, $_tmp', '$_tmp[0][] = (array)$item;'), array( &$_tmp ));
			}
		}
		else {
			if(!is_array($result)) {
				$result = array($result);
			}

			array_walk($result, create_function('$item, $key, $_tmp', '
				$A = (array)$item->addon;
				if(isset($item->staff) && !is_array($item->staff)) {
					$item->staff = array($item->staff);
				}
				if(isset($item->staff)) {
					$D = (array)$item->staff;
					$B = array();
					foreach($D as $C) {
						$B[] = $C->value;
					};
					$A["strvalue"] = implode("; ", $B);
				};
				$_tmp[0][] = $A;'), array( &$_tmp ));
		}
	}
	
	
	if(sizeof($_tmp) > 0) {
		echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
	}
	else {
		echo "({ results: '' })";
	}
} // end getVgFormFields()


/**
 * Save new or edit additional account form field
 * @param	object, billing class
 */
function saveVgFormField( &$lanbilling )
{
	if(empty($_POST['setvfrmfds'])) {
		echo "({ success: false, errors: { reason: 'Unknown field name' } })";
		return false;
	}

	$struct = array("staff" => array(),
		"addon" => array(
			"type" => (integer)$_POST['type'],
			"agentid" => (integer)$_POST['agentid'],
			"name" => $_POST['setvfrmfds'],
			"descr" => $_POST['descr']
		)
	);

	if(isset($_POST['newstaff']) && sizeof($_POST['newstaff']) > 0)
	{
		foreach($_POST['newstaff'] as $item)
		{
			$struct['staff'][] = array(
				"idx" => 0,
				"value" => $item
			);
		}
	}

	if(isset($_POST['staff']) && sizeof($_POST['staff']) > 0)
	{
		foreach($_POST['staff'] as $key => $item)
		{
			$struct['staff'][] = array(
				"idx" => $key,
				"value" => $item
			);
		}
	}

	if( false == $lanbilling->save("insupdVgroupsAddonsSet", $struct, false, array("getVgroupsAddonsSet")) )
	{
		$error = $lanbilling->soapLastError();
		echo "({ success: false, errors: { reason: 'There was an error while saving field: " . $error->detail . ". Look server logs for details' } })";
	}
	else {
		echo "({ success: true })";
	}
} // end saveVgFormField()


/**
 * Remove additional user's form fiels from settings
 * @param	object, billing class
 */
function delVgFormFields( &$lanbilling )
{
	if(empty($_POST['delvfrmfds'])) {
		echo "({ success: false, errors: { reason: 'Unknown field name' } })";
		return false;
	}

	if( false == $lanbilling->delete("delVgroupsAddonsSet", array("id" => $_POST['delvfrmfds']), array("getVgroupsAddonsSet")) )
	{
		$error = $lanbilling->soapLastError();
		echo "({ success: false, errors: { reason: '" . $localize->get("There was an error while sending data to server") . ": " . $error->detail . ".' } })";
	}
	else {
		echo "({ success: true })";
	}
} // end delUserFormFields()


/**
 * Check main form data sent via ajax before complex submit
 * @param	object, billing class
 * @param	object, localize class
 */
function validateFormBefore( &$lanbilling, &$localize )
{
	// Get full default data
	if((integer)$_POST['vgid'] > 0){
		$result = initVgroup($lanbilling, false);
		if($lanbilling->isConstant('ERRORSTATE')) {
			echo "({ success: false, errors: { reason: '" . $localize->get("There was an error while sending data to server") . ": " . ERRORDETAIL . ".' } })";
			return false;
		}
	}

	$post = (object)array(
		"on" => sprintf("%04d%02d%02d%02d%02d00", $_POST['onyear'], $_POST['onmonth'], $_POST['onday'], $_POST['onhour'], $_POST['onminute']),
		"off" => sprintf("%04d%02d%02d%02d%02d00", $_POST['offyear'], $_POST['offmonth'], $_POST['offday'], $_POST['offhour'], $_POST['offminute'])
	);

	// CerberCrypt validation
	if((integer)$_POST['agenttype'] == 13 && (integer)$lanbilling->getLicenseFlag('usecerber') > 0 && (integer)$lanbilling->Option('use_cerbercrypt') > 0) {
		if((integer)$_POST['cuid'] <= 0) {
			// If account state is on
			if((integer)$result->vgroup->blocked != 10 && (checkdate((integer)$_POST['onmonth'], (integer)$_POST['onday'], (integer)$_POST['onyear']) && $post->on < date('YmdHis'))) {
				if(!checkdate((integer)$_POST['offmonth'], (integer)$_POST['offday'], (integer)$_POST['offyear']) || $post->off > date('YmdHis')) {
					// Commented out according to ticket 14228
					// echo "({ success: false, errors: { accoff: { offyear: " . date('Y') . ", offmonth: " . date('m') . ", offday: " . date('d') . ", offhour: " . date('H') . ", offminute:" . date('m') . "}, reason: '" . $localize->get("CerberCrypt card number is not defined. This account must be turned off") . "!' } })";
					// return false;
				}
			}
		}
		else {
			if((integer)$result->vgroup->blocked == 10) {
				 if((!checkdate((integer)$_POST['onmonth'], (integer)$_POST['onday'], (integer)$_POST['onyear']) &&
				 	checkdate((integer)$_POST['offmonth'], (integer)$_POST['offday'], (integer)$_POST['offyear'])) ||
					($post->on < date('YmdHis') && $post->off < date('YmdHis')))
				{
					echo "({ success: false, errors: { reason: '" . $localize->get("CerberCrypt card number must be removed") . "!', resetcard: true } })";
					return false;
				}
			}
		}
	}

	echo "({ success: true })";
} // end validateFormBefore()


/**
 * Get tariff categories to show all available services for the account
 * and have a chance tp manage them
 * @param	object, billing class
 * @param	ovject, localize class
 */
function getTariffCategories( &$lanbilling, &$localize )
{
    try {
        if((integer)$_POST['tarid'] <= 0) {
            throw new Exception($localize->get('Undefimed') . ': ' . $localize->get('Tariff'));
        }
        
        $_services = array();
        $_filter = array(
            
        );
        
        if(isset($_POST['limit'])) {
            $_filter['pgsize'] = ((integer)$_POST['limit'] <= 0) ? 100 : $_POST['limit'];
            $_filter['pgnum'] = $lanbilling->linesAsPageNum($_filter['pgsize'], (integer)$_POST['start'] + 1);
        }
        
        
        if((integer)$_POST['getvgservices'] > 0) {
            $_POST['vgid'] = $_POST['getvgservices'];
            
            $vgroup = initVgroup($lanbilling, false);
            
            if(!empty($vgroup) && isset($vgroup->services)) {
                if(!is_array($vgroup->services)) {
                    $vgroup->services = array($vgroup->services);
                }
        
                array_walk($vgroup->services, create_function('$item, $key, $_tmp', '
                    $_tmp[0][] = $item->catidx;
                '), array( &$_services ));
            }
            unset($vgroup);
        }
        
        if( false == ($result = $lanbilling->get("getTarCategories", array("id" => $_POST['tarid'], "flt" => $_filter))) ) {
            throw new Exception($localize->get($lanbilling->soapLastError()->detail));
        }
        
        $_count = $lanbilling->get("Count", array("flt" => $_filter, "procname" => "getTarCategories"));
        
        if(!is_array($result)) {
            $result = array($result);
        }
        
        array_walk($result, create_function('&$item, $key, $_tmp','
            $A = array(
                "catdescr" => ($item->descr == "") ? "Unsigned" : $item->descr,
                "tarid" => $item->tarid,
                "catidx" => $item->catidx,
                "uuid" => $item->uuid,
                "enabled" => (integer)$item->enabled,
                "available" => (integer)$item->available,
                "asigned" => in_array($item->catidx, $_tmp[0]) ? 1 : 0
            );
            
            $item = $A;
        '), array( &$_services ));
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
            "total" => (integer)$_count,
            "results" => (array)$result
        );
    }

    echo "(" . JEncode($_response, $lanbilling) . ")";
    
    /*
    
	if((integer)$_POST['getvgservices'] <= 0 || (integer)$_POST['tarid'] <= 0) {
		echo "({ results: '' })";
		return false;
	}

	$_tmp = array();
	$_services = array();

	$_POST['vgid'] = $_POST['getvgservices'];
	$vgroup = initVgroup($lanbilling, false);
	if(!empty($vgroup) && isset($vgroup->services)) {
		if(!is_array($vgroup->services)) {
			$vgroup->services = array($vgroup->services);
		}

		array_walk($vgroup->services, create_function('$item, $key, $_tmp', '
			$_tmp[0][] = $item->catidx;
		'), array( &$_services ));
	}
	unset($vgroup);

	if( false != ($result = $lanbilling->get("getTarCategories", array("id" => $_POST['tarid']))) ) {
		if(!is_array($result)) {
			$result = array($result);
		}

		array_walk($result, create_function('&$item, $key, $_tmp','
			$_tmp[0][] = array(
				"catdescr" => ($item->descr == "") ? "Unsigned" : $item->descr,
				"tarid" => $item->tarid,
				"catidx" => $item->catidx,
				"uuid" => $item->uuid,
				"enabled" => (integer)$item->enabled,
				"available" => (integer)$item->available,
				"asigned" => in_array($item->catidx, $_tmp[1]) ? 1 : 0
			);
		'), array( &$_tmp, &$_services ));
	}

	if(sizeof($_tmp) > 0) {
		echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
	}
	else {
		echo "({ results: '' })";
	}*/
} // end getTariffCategories()


/**
 * Get actions list
 */
function getActionsList( $lanbilling )
{
	try {
        $_flt = array( );
		if( false === ($result = $lanbilling->get("getActions", array("flt" => $_flt))) ) {
			throw new Exception ($lanbilling->soapLastError()->detail);
		}
        if(!is_array($result)) { $result = array($result); }
        array_walk($result, create_function('$item, $key, $_tmp', '
			$_tmp[0][] = array(
                "recordid"      => $item->recordid,
                "daycount"      => $item->daycount,
                "type"          => $item->type,
                "object"        => $item->object,
                "archive"       => $item->archive,
                "name"          => $item->name,
                "descr"         => $item->descr,
                "dtfromstart"   => $item->dtfromstart,
                "dtfromend"     => $item->dtfromend,
                "dtto"          => $item->dtto
            );
		'), array( &$_tmp, &$lanbilling ));
	} catch(Exception $error) {
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
	echo '(' . JEncode($_response, $lanbilling) . ')';
}

/**
 * Get the list of vgroup actions
 * @param	object, main billing class
 * @param	object, localize class
 */
function getUserActions( &$lanbilling, &$localize )
{
    $_tmp = array();

	try {
		if((integer)$_POST['getUserActions'] <= 0) {
			throw new Exception('Undefined agreement id');
		}

        $_flt = array(
            'agrmid' => (integer)$_POST['agrmid']
        );
		if( false === ($result = $lanbilling->get("getActionsStaff", array("flt" => $_flt))) ) {
			throw new Exception ($lanbilling->soapLastError()->detail);
		}

        if(!empty($result)) {
            if(!is_array($result)) { $result = array($result); }
            array_walk($result, create_function('$item, $key, $_tmp', '
                $_tmp[0][] = array(
                    recordid    => $item->staff->recordid,
                    actionid    => $item->staff->actionid,
                    uid         => $item->staff->uid,
                    agrmid      => $item->staff->agrmid,
                    vgid        => $item->staff->vgid,
                    tarid       => $item->staff->tarid,
                    archive     => $item->staff->archive,
                    dtfrom      => $item->staff->dtfrom,
                    dtto        => $item->staff->dtto
                );
            '), array( &$_tmp, &$lanbilling ));
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
	echo '(' . JEncode($_response, $lanbilling) . ')';
}

/**
 * Insert or update actions for vgroup
 * @param	object, main billing class
 */
function insUpdAction($lanbilling)
{
	try {
        $isInsert = true;
        //if((integer)$_POST['vgid'] <= 0) {
        //    throw new Exception('Undefined vgroup id');
        //}
        if((integer)$_POST['agrmid'] <= 0) {
            throw new Exception('Undefined agreement id');
        }

        $struct = array(
            'actionid'  => (integer)$_POST['action'],
            //'vgid'      => (integer)$_POST['vgid'],
            'agrmid'    => (integer)$_POST['agrmid'],
            'dtfrom'    => $_POST['actionDateFrom'],
        );
        if (!empty($_POST['actionDateTo']))
            $struct['dtto'] = $_POST['actionDateTo'];
        if ((integer)$_POST['insUpdAction'] > 0){
            $struct['recordid'] = (integer)$_POST['insUpdAction'];
            $isInsert = false;
        }
        // recordid, actionid, uid, agrmid, vgid, tarid, archive, dtfrom, dtto
        if( false === ($result = $lanbilling->save("insupdActionStaff", $struct, ($isInsert) ? true : false)) ) {
			throw new Exception ($lanbilling->soapLastError()->detail);
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
			"success" => true
		);
	}
	echo '(' . JEncode($_response, $lanbilling) . ')';
}

/**
 * Remove vgroup action
 * @param	object, main billing class
 * @param	object, localize class
 */
function delActions( &$lanbilling, &$localize )
{
    if(!$_response) {
		$_response = array(
			"success" => true
		);
	}
	echo '(' . JEncode($_response, $lanbilling) . ')';
}


/**
 * Get the list of the addon tarifs for phones
 * @param	object, main billing class
 * @param	object, localize class
 */
function getMultitarifs( &$lanbilling, &$localize )
{
	$_tmp = array();

	try {
		if((integer)$_POST['getMultitarifs'] <= 0) {
			throw new Exception('Undefined vgroup id');
		}

		$_flt = array(
            'vgid' => (integer)$_POST['getMultitarifs']
        );
        if( false === ($result = $lanbilling->get("getMultitarifs", array("flt" => $_flt))) )
		{
			throw new Exception ($lanbilling->soapLastError()->detail);
		}

		if($result) {
			if(!is_array($result)) { $result = array($result); }
			if(!empty($result)) {
				array_walk($result, create_function('$item, $key, $_tmp', '
					$item = (array)$item;
					$item["recordid"] = $item["recordid"];
					$item["vgid"] = $item["vgid"];
                    $item["tarid"] = $item["tarid"];
                    $item["dtfrom"] = $item["dtfrom"];
					$item["dtto"] = $item["dtto"];
                    $item["tarname"] = $item["tarname"];
					$_tmp[0][] = $item;
				'), array( &$_tmp, &$lanbilling ));
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

    echo '(' . JEncode($_response, $lanbilling) . ')';
}

function insupdMultitarif( $lanbilling, &$localize )
{
    $isInsert = true;
    $vgid = (integer)$_POST['vgid'];
    $tarid = (integer)$_POST['tarid'];
    if($vgid <= 0 || $tarid <= 0) {
        echo '({ success: false, errors: { reason: "' . $localize->get('Unable to get account entry or tariff') . '." } })';
        return false;
    }
    $struct = array(
        'vgid'   => $vgid,
        'tarid'  => $tarid,
        'dtfrom' => $_POST['dtfrom'],
        'dtto'   => ((isset($_POST['useDateTo']) && $_POST['useDateTo'] == 'true') ? $_POST['dtto'] : '')
    );
    if ((integer)$_POST['insupdMultitarif'] > 0){
        $struct['recordid'] = (integer)$_POST['insupdMultitarif'];
        $isInsert = false;
    }

    if( false != ($result = $lanbilling->save("insupdMultitarif", $struct, ($isInsert) ? true : false))){
        echo '({ success: true })'; return true;
    } else {
        $error = $lanbilling->soapLastError();
        //if (preg_match("~Duplicate entry.*~is",$error->detail)){
            //$msg = '<br/>Документ с таким названием уже существует.';
        //} else {
            $msg = '<br/>'.$error->detail;
        //}
        echo '({ success: false, errors: { reason: "' . $localize->get('Server error') . '. ' . $msg . '" } })';
        return false;
    }
}

function delMultitarif( $lanbilling, $localize )
{
    $recordid = (integer)$_POST['delMultitarif'];
    if($recordid <= 0) {
        echo '({ success: false, errors: { reason: "Unknown record ID." } })';
        return false;
    }
    if( false == ($res = $lanbilling->delete("delMultitarif", array('id'=>$recordid), array('delMultitarif'))) ) {
        $error = $lanbilling->soapLastError();
        $msg = '<br/>'.$error->detail;
        echo '({ success: false, errors: { reason: "Can not delete tarif from list. '.$msg.'" } })';
        return false;
    }
    else {
        echo '({ success: true })'; return true;
    }
} // end delMultitarif


/**
 * Get staff
 * @param	object, main billing class
 * @param	object, localize class
 */
function getStaff( &$lanbilling, &$localize )
{
	$_tmp = array();
	try {
		if((integer)$_POST['getstaff'] <= 0) {
			throw new Exception('Undefined vgroup id');
		}
		
		// Delete array of records
		if(isset($_POST['records']) && $_POST['records'] != '') {
			$recs = json_decode(str_replace("\\", "", $_POST['records']));
			foreach($recs as $record) {
				if( false === ($res = $lanbilling->get("delStaff", array('id' => $record))))
				throw new Exception ($lanbilling->soapLastError()->detail);
			}
		}
		
		
		$_flt = array(
            'vgid' => (integer)$_POST['getstaff']
        );

        if( false === ($result = $lanbilling->get("getStaff", array("flt" => $_flt))) )
		{
			throw new Exception ($lanbilling->soapLastError()->detail);
		}

		if($result) {
			if(!is_array($result)) { $result = array($result); }			
			if(!empty($result)) {
				foreach($result as $key=>$res) {
					if($res->type == 2) {
						unset($result[$key]); // Удаляем записи Local AS из массива
					}
				}		
				array_walk($result, create_function('$item, $key, $_tmp', '
					$item = (array)$item;
					$item["recordid"] = $item["recordid"];
					$item["vgid"] = $item["vgid"];
					$item["type"] = $item["type"];
                    $item["as"] = $item["as"];
                    $item["ipmask"] = $item["ipmask"];
                    $item["port"] = $item["port"];
					$_tmp[0][] = $item;
				'), array( &$_tmp, &$lanbilling ));
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

    echo '(' . JEncode($_response, $lanbilling) . ')';
} // End getStaff()






function getStaffAS( &$lanbilling, &$localize )
{
	$_tmp = array();
	try {
		if((integer)$_POST['getstaffas'] <= 0) {
			throw new Exception('Undefined vgroup id');
		}
		
		// Delete array of records
		if(isset($_POST['record']) && $_POST['record'] != '') {	
				if( false === ($res = $lanbilling->get("delStaff", array('id' => $_POST['record']))))
				throw new Exception ($lanbilling->soapLastError()->detail);
		}		
		
		$_flt = array(
            'vgid' => (integer)$_POST['getstaffas']
        );
        
        if( false === ($result = $lanbilling->get("getStaff", array("flt" => $_flt))) )
		{
			throw new Exception ($lanbilling->soapLastError()->detail);
		}

		if($result) {
			if(!is_array($result)) { $result = array($result); }			
			if(!empty($result)) {				
				array_walk($result, create_function('$item, $key, $_tmp', '
					$item = (array)$item;
					$item["recordid"] = $item["recordid"];
					$item["vgid"] = $item["vgid"];
					$item["type"] = $item["type"];
                    $item["as"] = $item["as"];
                    $item["ipmask"] = $item["ipmask"];
					$_tmp[0][] = $item;
				'), array( &$_tmp, &$lanbilling ));
			}
		}		
		foreach($_tmp as $key=>$res) { // Удаляем из массива все записи кроме Local AS
			if($res['type'] != 2) {
				unset($_tmp[$key]);
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

    echo '(' . JEncode($_response, $lanbilling) . ')';
} // End getStaff()



function getMacStaff( &$lanbilling, &$localize )
{
	$_tmp = array();

	try {
		if((integer)$_POST['getmacstaff'] <= 0) {
			throw new Exception('Undefined vgroup id');
		}		
		
		// Delete array of records
		if(isset($_POST['record']) && $_POST['record'] != '') {	
				if( false === ($res = $lanbilling->get("delMacStaff", array('id' => $_POST['record']))))
				throw new Exception ($lanbilling->soapLastError()->detail);
		}
		
		$_flt = array('vgid' => (integer)$_POST['getmacstaff']);
		
        if( false === ($result = $lanbilling->get("getMacStaff", array("flt" => $_flt))) )
		{
			throw new Exception ($lanbilling->soapLastError()->detail);
		}
		
		if($result) {
			if(!is_array($result)) { $result = array($result); }
			if(!empty($result)) {
				array_walk($result, create_function('$item, $key, $_tmp', '
					$item = (array)$item;
					$item["recordid"] = $item["recordid"];
					$item["vgid"] = $item["vgid"];
                    $item["macid"] = $item["macid"];
                    $item["mac"] = $item["mac"];
                    $item["segment"] = $item["segment"];
					$_tmp[0][] = $item;
				'), array( &$_tmp, &$lanbilling ));
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

    echo '(' . JEncode($_response, $lanbilling) . ')';
}



function setStaff( &$lanbilling, &$localize )
{
    try {
        if((integer)$_POST['setstaff'] == 0) {
            throw new Exception($localize->get("Undefined-o") . ": " . $localize->get("Account"));
        }
        
        $rec = json_decode(str_replace("\\", "", $_POST['records']));
        
        foreach($rec as $r) {
			$struct = array(
				"recordid" => (integer)$r->recordid, // if is not empty - update, else insert
				"vgid" => (integer)$_POST['setstaff'],
				"type" => (integer)$r->type,
				"ipmask" => array('ip'=>$r->segment, 'mask'=>$r->mask, "segmentid" => (integer)$r->segmentid)
			);
			
			if(false == $lanbilling->save("insupdStaff", $struct, $struct['recordid'] == 0 ? true : false)) {
				throw new Exception($localize->get($lanbilling->soapLastError()->detail));
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
} // end setStaff()




function setStaffPort( &$lanbilling, &$localize )
{
    try {
        if((integer)$_POST['setstaffport'] == 0) {
            throw new Exception($localize->get("Undefined-o") . ": " . $localize->get("Account"));
        }
        
			$struct = array(
				"recordid" => (integer)$_POST['recordid'], // if is not empty - update, else insert
				"vgid" => (integer)$_POST['setstaffport'],
				"type" => (integer)$_POST['type'],
				"ipmask" => array('ip'=>$_POST['segment'], 'mask'=>$_POST['mask'])
			);
			if(false == $lanbilling->save("insupdStaff", $struct, $struct['recordid'] == 0 ? true : false)) {
				throw new Exception($localize->get($lanbilling->soapLastError()->detail));
			}
        
        
        // Data reload
        $_flt = array(
            'vgid' => (integer)$_POST['setstaffport']
        );
        if( false === ($result = $lanbilling->get("getStaff", array("flt" => $_flt))) )
		{
			throw new Exception ($lanbilling->soapLastError()->detail);
		}
		
		if($result) {
			if(!is_array($result)) { $result = array($result); }			
				foreach($result as $key=>$res) {
					if($res->type == 2) {
						unset($result[$key]); // Удаляем записи Local AS из массива
					}
				}	
				array_walk($result, create_function('$item, $key, $_tmp', '
					$item = (array)$item;
					$item["recordid"] = $item["recordid"];
					$item["vgid"] = $item["vgid"];
					$item["type"] = $item["type"];
                    $item["as"] = $item["as"];
                    $item["ipmask"] = $item["ipmask"];
                    $item["port"] = $item["port"];
					$_tmp[0][] = $item;
				'), array( &$_tmp, &$lanbilling ));
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
} // end setStaff()


function setStaffAS( &$lanbilling, &$localize )
{
    try {
		
        if((integer)$_POST['setstaffas'] == 0) {
            throw new Exception($localize->get("Undefined-o") . ": " . $localize->get("Account"));
        }
        
		$rec = json_decode(str_replace("\\", "", $_POST['records']));
		$struct = array(
			"recordid" => (integer)$rec->recordid, // if is not empty - update, else insert
			"vgid" => (integer)$rec->vgid,
			"type" => (integer)$rec->type,
			"as" => (integer)$rec->las
		);
		if(false == $lanbilling->save("insupdStaff", $struct, $struct['recordid'] == 0 ? true : false)) {
			throw new Exception($localize->get($lanbilling->soapLastError()->detail));
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
} // end setStaff()





function setMacStaff( &$lanbilling, &$localize )
{
    try {
        if((integer)$_POST['setmacstaff'] == 0) {
            throw new Exception($localize->get("Undefined-o") . ": " . $localize->get("Account"));
        }
			
			$rec = json_decode(str_replace("\\", "", $_POST['records']));
			$struct = array(
				"macid" => (integer)$_POST['macid'], // if is not empty - update, else insert
				"vgid" => (integer)$_POST['setmacstaff'],
				"mac" => $rec->mac,
				"segment" => $rec->segment,
				"recordid" => (integer)$rec->recordid
			);

			if(false == $lanbilling->save("insupdMacStaff", $struct, $struct['macid'] == 0 ? true : false)) {
				throw new Exception($localize->get($lanbilling->soapLastError()->detail));
			}        
        
        // Data reload
        $_flt = array(
            'vgid' => (integer)$_POST['setmacstaff']
        );
        if( false === ($result = $lanbilling->get("getMacStaff", array("flt" => $_flt))) )
		{
			throw new Exception ($lanbilling->soapLastError()->detail);
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
            "results" => $result
        );
    }

    echo "(" . JEncode($_response, $lanbilling) . ")";
} // end setMacStaff()



/**
 * Getting addon idx value for old_agent_id field
 * @param	object, billing class
 * @param   object, localize class
 */
function getAddonsIdx( &$lanbilling, &$localize )
{
	if(false === ($result = $lanbilling->get("getVgroupAddons", array('id' => (integer)$_POST['vgid'])))) {
		throw new Exception($localize->get($lanbilling->soapLastError()->detail));
	}

    return $result;
} // end getAddonsIdx()
