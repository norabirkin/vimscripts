<?php
/**
 * Billing system settings for the binary modules
 *
 * Repository information:
 * $Date: 2009-10-30 10:02:48 $
 * $Revision: 1.1.2.38 $
 */
// Global array for this devision, to describe module by type id
$moduleDescr = array(
	1 => array("name" => "Ethernet / PCAP", "group" => 1),
	2 => array("name" => "Ethernet / ULOG", "group" => 1),
	3 => array("name" => "Ethernet / TEE", "group" => 1),
	4 => array("name" => "Netflow", "group" => 1),
	5 => array("name" => "Sflow", "group" => 1),
	6 => array("name" => "RADIUS", "group" => 2),
	7 => array("name" => "LBPhone", "group" => 3),
	12 => array("name" => "VoIP", "group" => 4),
	13 => array("name" => "UsBox", "group" => 5),
	14 => array("name" => "Snmp", "group" => 6)
);

// There is background query
if(isset($_POST['async_call']))
{
	// Link IP class
	if($lanbilling->ifIncluded("ip_calc_compare.php") == false)
		include_once("ip_calc_compare.php");

	if(isset($_POST['getifaces'])) {
		getInterfaces($lanbilling);
	}

	if(isset($_POST['setparser'])) {
		setParser($lanbilling, $localize);
	}
	
	if(isset($_POST['getparsers'])) {
		getParsers( $lanbilling, $localize );
	}
	
	if(isset($_POST['delparser'])) {
		delParser($lanbilling, $localize);
	}
	

	if(isset($_POST['getsegments'])) {
		getSegments($lanbilling);
	}
	if(isset($_POST['delSegment'])) {
		delSegment($lanbilling, $localize);
	}
	if(isset($_POST['InsUpdSegment'])) {
		InsUpdSegment($lanbilling, $localize);
	}


	if(isset($_POST['getRnas'])) {
		getRnas($lanbilling);
	}
	if(isset($_POST['InsUpdNas'])) {
		insupdRnas($lanbilling, $localize);
	}
	if(isset($_POST['delRnas'])) {
		delRnas($lanbilling, &$localize);
	}
	if(isset($_POST['AddRemoveDevice'])) {
		AddRemoveDevice($lanbilling, &$localize);
	}

	if(isset($_POST['getformats'])) {
		getFormats($lanbilling, &$localize);
	}


	if(isset($_POST['getignore'])) {
		getIgnore($lanbilling);
	}

	if(isset($_POST['getnas'])) {
		getNAS($lanbilling);
	}

	if(isset($_POST['getnasblock'])) {
		getNASBlock($lanbilling);
	}

	if(isset($_POST['gettarifs'])) {
		getTarifs($lanbilling);
	}

	if(isset($_POST['getunions'])) {
		getUnions($lanbilling);
	}

	if(isset($_POST['getmodules'])) {
		getmodulesList($lanbilling);
	}

	if(isset($_POST['getnasdevice'])) {
		getDevices($lanbilling);
	}
}
// There is standart query
else
{
	$tpl = new HTML_Template_IT(TPLS_PATH);

	if(isset($_POST['module'])) {
		if(isset($_POST['save'])) {
			if( false == saveModuleData($lanbilling, $tpl, $moduleDescr)) {
				define("SAVED_OK", false);
				moduleForm($lanbilling, $tpl, $moduleDescr, $localize);
			}
			else {
				define("SAVED_OK", true);
				showModulesList($lanbilling, $tpl, $moduleDescr);
			}
		}
		elseif(isset($_POST['delete'])) {
			if($_POST['module'] > 0) {
				$lanbilling->delete("delAgent", array("id" => $_POST['module']), array("getAgents", "getAgentsExt"));
			}

			showModulesList($lanbilling, $tpl, $moduleDescr);
		}
		else moduleForm($lanbilling, $tpl, $moduleDescr);
	}
	else showModulesList($lanbilling, $tpl, $moduleDescr, $localize);

	$localize->compile($tpl->get(), true);
}


/**
 * Show modules list
 * @param	object, billing class
 * @param	object, template class
 */
function showModulesList( $lanbilling, $tpl, &$moduleDescr )
{
	// If defined save option, than show report message
	if(defined("SAVED_OK") && SAVED_OK == false) afterSaveReport($lanbilling, $localize, 960);

	// Getting modules list
	$result = $lanbilling->get("getAgentsExt");
	$tpl->loadTemplatefile("modules_list.tpl", true, true);
	$tpl->touchBlock("__global__");

	if($result === false)
	{
		$tpl->touchBlock("empty_item");

		$tpl->setCurrentBlock("messages");
		$tpl->setVariable("MESSAGE_TEXT", "There was an error while getting data from server");
		$tpl->parse("messages");
	}
	elseif(empty($result))
		$tpl->touchBlock("empty_item");
	else
	{
		if(!is_array($result)) {
			$result = array($result);
		}

		foreach($result as $obj)
		{
			$tpl->setCurrentBlock("list_item");

			if($obj->agent->type == 6 || $obj->agent->type == 12)
			{
				$tpl->setCurrentBlock("dic");
				$tpl->setVariable("AGID", $obj->agent->id);
				$tpl->parseCurrentBlock();

				$tpl->setVariable("AGSES", (integer)$obj->sessions);
			}
			else {
				$tpl->touchBlock("empty_dic");
				$tpl->setVariable("AGSES","-");
			}

			if($obj->agent->type >= 7 && $obj->agent->type <= 12)
			{
				$tpl->setCurrentBlock("num");
				$tpl->setVariable("AGID", $obj->agent->id);
				$tpl->parseCurrentBlock();
			}
			else $tpl->touchBlock("empty_num");

			if($obj->active == 1)
			{
				$tpl->setCurrentBlock("ison");
				$tpl->setVariable("LASTCONTACT", $obj->agent->lastcontact);
				$tpl->parseCurrentBlock();
			}
			else $tpl->touchBlock("isoff");

			if((integer)$obj->vgroups == 0)
			{
				$tpl->setCurrentBlock("drop");
				$tpl->setVariable("AGID", $obj->agent->id);
				$tpl->parseCurrentBlock();
			}
			else $tpl->touchBlock("empty_drop");

			$tpl->setVariable("AGID", $obj->agent->id);
			$tpl->setVariable("AGTYPE", $moduleDescr[$obj->agent->type]['name']);
			$tpl->setVariable("AGDESCR", $obj->agent->descr);
			$tpl->setVariable("AGIP", $obj->agent->naip);
			$tpl->setVariable("AGVG", (integer)$obj->vgroups);
			$tpl->parse("list_item");
		}
	}
} // end showModulesList()



/**
 * @param $isSave boolean
 * @param $module
 * @param $name
 * @param $descr
 * @param $value
 */
function useAgentOptions($isSave = false, $agent_id = 0, $name = '', $descr = '', $value = 0){
	global $lanbilling;
	if ($isSave){
		$_val = array(
			'id' => $agent_id,
			'name' => $name,
			'descr' => $descr,
			'value' => $value
		);
		if (false == ($insOpt = $lanbilling->save("insAgentOption", $_val, true))){
			$error = $lanbilling->soapLastError();
			return false;
		} return true;
	} else {
		$_flt = array();
		if ($agent_id) $_flt['agentid'] = $agent_id;
		if ($name) $_flt['name'] = $name;
		if (false == ($resAgent = $lanbilling->get("getAgentOptions", array('flt' => $_flt))))
			return false;
		else
			return $resAgent;
	}
}


/**
 * Form to Create / Edit selected module
 * @param	object, billing class
 * @param	object, template class
 */
function moduleForm( &$lanbilling, &$tpl, &$moduleDescr, $localize )
{
	// If defined save option, than show report message
	if(defined("SAVED_OK") && !defined("SHOW_ERROR_MSG")) {
		afterSaveReport($lanbilling);
	}

	$tpl->loadTemplatefile("modules.tpl", true, true);
	$tpl->touchBlock("__global__");
	
	if(defined("SHOW_ERROR_MSG") && SHOW_ERROR_MSG == true) {
		$tpl->touchBlock("ErrorState");
        $tpl->setCurrentBlock("errorCreateAgentOption");
        $tpl->setVariable("ERROR_AGENT_OPTION_CREATE", $localize->get('Error') . ': ' . $localize->get($lanbilling->soapLastError()->detail));
        $tpl->parse("errorCreateAgentOption");
	}

	if((integer)$_POST['module'] > 0 && !isset($_POST['moduleType']))
	{
        // Full initialization
        if (false != ($AOpt = $lanbilling->get("getAgentOptions", array('flt' => array("agentid" => (integer)$_POST['module']))))) {
            if(!is_array($AOpt)) {
                $AOpt = array($AOpt);
            }
            
            $_tmp = array();
            
            if(!empty($AOpt)) {
                array_walk($AOpt, create_function('$item, $key, $_tmp', '
                    $_tmp[0][$item->name]["value"] = $item->value;
                    $_tmp[0][$item->name]["descr"] = $item->descr;
                '), array( &$_tmp ));
            }
            
            $AOpt = $_tmp;
            unset($_tmp);
        }
        
        if(!isset($AOpt['skip-empty-framed-ip'])) {
            if (false == ($insOpt = $lanbilling->save("insAgentOption", array(
                'id' => (integer)$_POST['module'],
                'name' => 'skip-empty-framed-ip',
                'descr' => 'skip-empty-framed-ip',
                'value' => 0
            ), true)))
            {
                $error = $lanbilling->soapLastError();
                
				if(!strstr($error->detail, 'No rights to change agent')){
					$tpl->touchBlock("ErrorState");
	                $tpl->setCurrentBlock("errorCreateAgentOption");
	                $tpl->setVariable("ERROR_AGENT_OPTION_CREATE", "There was an error while creating Framed-IP-Address option.");
	                $tpl->parse("errorCreateAgentOption");
				}
            }
            $FramedIPAddress = 0;
        }
        else {
            $FramedIPAddress = $AOpt['skip-empty-framed-ip']['value'];
        }
		
        $useCas = $AOpt['use_cas']['value'] ? $AOpt['use_cas']['value'] : 0;
		
		// Get data
		$result = $lanbilling->get("getAgent2", array("id" => (integer)$_POST['module']));

		$_POST['moduleType'] = $result->agent->type;
		$_POST['servicename'] = $result->agent->servicename;
		$_POST['descr'] = $result->agent->descr;
		$_POST['naip'] = $result->agent->naip;
		$_POST['nadb'] = $result->agent->nadb;
		$_POST['nausername'] = $result->agent->nausername;
		$_POST['napass'] = $result->agent->napass;
		$_POST['flush'] = $result->agent->flush;
		$_POST['timer'] = $result->agent->timer;
		$_POST['nfhost'] = $result->agent->nfhost;
		$_POST['nfport'] = $result->agent->nfport;
		$_POST['dvport'] = $result->agent->nfport;
		$_POST['netgrp'] = $result->agent->nfport;
		$_POST['localasnum'] = $result->agent->localasnum;
		$_POST['ignorelocal'] = $result->agent->ignorelocal;
		$_POST['nobroadcast'] = $result->agent->ignorelocal;
		$_POST['raccport'] = $result->agent->raccport;
		$_POST['rauthport'] = $result->agent->rauthport;
		$_POST['eapcertpassword'] = $result->agent->eapcertpassword;
		$_POST['sessionlifetime'] = $result->agent->sessionlifetime;
		$_POST['maxradiustimeout'] = $result->agent->maxradiustimeout;
		$_POST['radstopexpired'] = $result->agent->radstopexpired;
		$_POST['raddrpool'] = $result->agent->raddrpool;
		$_POST['savestataddr'] = $result->agent->savestataddr;
		$_POST['remulateonnaid'] = $result->agent->remulateonnaid;
		$_POST['telrawcopy'] = $result->agent->telrawcopy;
		$_POST['teldirectionmode'] = $result->agent->teldirectionmode;
		// Only for telephony
		$_POST['failedcalls'] = $result->agent->failedcalls;
		// The same for ethernet
		$_POST['ethblockedacc'] = $result->agent->failedcalls;
		// NetFlow / Sflow modules
		$_POST['flowblockedacc'] = $result->agent->failedcalls;
		// RADIUS
		$_POST['radblockedacc'] = $result->agent->failedcalls;
		$_POST['opercat'] = $result->agent->opercat;
		$_POST['telsrc'] = $result->agent->telsrc;
		$_POST['comspeed'] = $result->agent->comspeed;
		$_POST['comparity'] = $result->agent->comparity;
		$_POST['comdatabits'] = $result->agent->comdatabits;
		$_POST['comstopbits'] = $result->agent->comstopbits;
		$_POST['pbxid'] = $result->agent->pbxid;
		$_POST['failedcalls'] = $result->agent->failedcalls;
		$_POST['voipcarduser'] = $result->agent->voipcarduser;
		$_POST['keepdetail'] = $result->agent->keepdetail;
		$_POST['noframedip'] = $FramedIPAddress;
		$_POST['authunknown'] = $result->agent->opercat;
		$_POST['restartshape'] = $result->agent->restartshape;
        
        if($_POST['moduleType'] == 6) {
            $_POST['dhcpd_port'] = isset($AOpt['dhcpd_port']) ? $AOpt['dhcpd_port']['value'] : '';
            $_POST['dhcpd_ip'] = isset($AOpt['dhcpd_ip']) ? $AOpt['dhcpd_ip']['value'] : '';
            $_POST['dhcp-domain-name'] = isset($AOpt['dhcp-domain-name']) ? $AOpt['dhcp-domain-name']['value'] : '';
            $_POST['dhcp-identifier'] = isset($AOpt['dhcp-identifier']) ? $AOpt['dhcp-identifier']['value'] : '';
            $_POST['dhcp-lease-time'] = isset($AOpt['dhcp-lease-time']) ? $AOpt['dhcp-lease-time']['value'] : '';
            $_POST['radius-nameserver'] = isset($AOpt['radius-nameserver']) ? $AOpt['radius-nameserver']['value'] : '';
            $_POST['radius-nameserver2'] = isset($AOpt['radius-nameserver2']) ? $AOpt['radius-nameserver2']['value'] : '';
            $_POST['radius_insert_mac_staff'] = isset($AOpt['radius_insert_mac_staff']) ? $AOpt['radius_insert_mac_staff']['value'] : '';
            $_POST['radius_keep_only_last_auth_info'] = isset($AOpt['radius_keep_only_last_auth_info']) ? $AOpt['radius_keep_only_last_auth_info']['value'] : '';
        }
        else if($_POST['moduleType'] == 7) {
            $_POST['instantly_amount'] = isset($AOpt['instantly_amount']) ? $AOpt['instantly_amount']['value'] : 1;
        }
        else if($_POST['moduleType'] == 13) {
			$_POST['use_cas'] = isset($AOpt['use_cas']) ? $AOpt['use_cas']['value'] : 0;
			$_POST['use_smartcards'] = isset($AOpt['use_smartcards']) ? $AOpt['use_smartcards']['value'] : 0;
            $_POST['cas_host'] = isset($AOpt['cas_host']) ? $AOpt['cas_host']['value'] : '';
            $_POST['cas_port'] = isset($AOpt['cas_port']) ? $AOpt['cas_port']['value'] : '';
            $_POST['operator_tag'] = isset($AOpt['operator_tag']) ? $AOpt['operator_tag']['value'] : '';
            $_POST['nationality'] = isset($AOpt['nationality']) ? $AOpt['nationality']['value'] : '';
            $_POST['region'] = isset($AOpt['region']) ? $AOpt['region']['value'] : '';
            $_POST['refresh_sec'] = isset($AOpt['refresh_sec']) ? $AOpt['refresh_sec']['value'] : '';
            $_POST['city_code'] = isset($AOpt['city_code']) ? $AOpt['city_code']['value'] : '';
			$_POST['channels_filter'] = isset($AOpt['channels_filter']) ? $AOpt['channels_filter']['value'] : '';
			$_POST['keep_turned_on_month'] = isset($AOpt['keep_turned_on_month']) ? $AOpt['keep_turned_on_month']['value'] : 0;
			$_POST['middleware_login'] = isset($AOpt['middleware_login']) ? $AOpt['middleware_login']['value'] : '';
			$_POST['middleware_password'] = isset($AOpt['middleware_password']) ? $AOpt['middleware_password']['value'] : '';
			$_POST['middleware_http_endpoint'] = isset($AOpt['middleware_http_endpoint']) ? $AOpt['middleware_http_endpoint']['value'] : '';
			$_POST['middleware_provisioning_endpoint'] = isset($AOpt['middleware_provisioning_endpoint']) ? $AOpt['middleware_provisioning_endpoint']['value'] : '';
			$_POST['middleware_session_endpoint'] = isset($AOpt['middleware_session_endpoint']) ? $AOpt['middleware_session_endpoint']['value'] : '';
			$_POST['dtv_type'] = isset($AOpt['dtv_type']) ? $AOpt['dtv_type']['value'] : '';
        }
	}
	else
	{
		
		if(!isset($_POST['moduleType']))
		{
			$_POST['module'] = 0;
			$_POST['moduleType'] = 1;

			$_POST['servicename'] = $result->agent->servicename;
			$_POST['descr'] = "";
			$_POST['naip'] = "127.0.0.1";
			$_POST['nadb'] = "billing";
			$_POST['nausername'] = "billing";
			$_POST['napass'] = "billing";
			$_POST['nfhost'] = "0.0.0.0";
			$_POST['nfport'] = 7223;
			$_POST['flush'] = "60";
			$_POST['timer'] = "30";
			$_POST['raccport'] = 1813;
			$_POST['rauthport'] = 1812;
			$_POST['eapcertpassword'] = "";
			$_POST['radstopexpired'] = 0;
			$_POST['restartshape'] = 0;
			$_POST['pbxid'] = 1;
			$_POST['keepdetail'] = 0;
		}

		$_POST['sessionlifetime'] = ((integer)$_POST['sessionlifetime'] == 0) ? 86400 : $_POST['sessionlifetime'];
		$_POST['maxradiustimeout'] = ((integer)$_POST['maxradiustimeout'] == 0) ? 86400 : $_POST['maxradiustimeout'];

	}

	$tpl->setVariable("MODULE", $_POST['module']);
	$tpl->setVariable("SERVICENAME", $_POST['servicename']);
	$tpl->setVariable("MDDESCR", $_POST['descr']);


	
	$m = array(1,2,3,4,5,12,14); // Список типов агентов для которых следует отобразить настройки БД
	
	if(in_array($_POST['moduleType'], $m)) {
		
		$tpl->setVariable("NAIP", $_POST['naip']);
		$tpl->setVariable("NADB", $_POST['nadb']);
		$tpl->setVariable("NAUSERNAME", $_POST['nausername']);
		$tpl->setVariable("NAPASS", $_POST['napass']);
		
		$tpl->touchBlock("showWidthDB");		
		$tpl->touchBlock("showHeadDB");
		$tpl->touchBlock("showFieldsDB");
	} else {
		$tpl->touchBlock("hideWidthDB");	
		$tpl->touchBlock("hideHeadDB");
		$tpl->touchBlock("hideFieldsDB");
	}
    
	
	
	
	if(isset($_POST['ignorelocal'])) {
	    if($_POST['moduleType'] < 6) {
	        $_POST['ignorelocal'] && $_POST['moduleType'] < 4 ? $tpl->touchBlock("ETHIgnoreLocalCheck") : null;
            $_POST['ignorelocal'] && $_POST['moduleType'] > 3 ? $tpl->touchBlock("FLOWIgnoreLocalCheck") : null;
	    }
        else if($_POST['moduleType'] != 13) {
    		$tpl->setCurrentBlock("ignlocalHid");
    		$tpl->setVariable("MODIGNLOCAL", $_POST['ignorelocal']);
    		$tpl->parseCurrentBlock();
		}
	}

	foreach($moduleDescr as $type => $arr)
	{
		if((integer)$_POST['module'] > 0) {
            $editNetwBtn = true;
            $editNasBtn = true;
			if($moduleDescr[$result->agent->type]['group'] != $arr['group'])
				continue;
		}else{
            $editNetwBtn = false;
            $editNasBtn = false;
        }

		$tpl->setCurrentBlock("moduleOpt");
		$tpl->setVariable("MODULETYPE", $type);
		$tpl->setVariable("MODULEDESCR", $arr['name']);
		$tpl->setVariable("MODULEGRP", $arr['group']);
		if($_POST['moduleType'] == $type) $tpl->touchBlock("moduleOptSel");
		$tpl->parseCurrentBlock();
	}

	if($_POST['moduleType'] > 6 && $_POST['moduleType'] < 12) {
		define("AG_SCHEMA", (integer)$lanbilling->Option('use_operators'));
	}

	switch($_POST['moduleType'])
	{
		case 1:
			($editNetwBtn) ? $tpl->touchBlock("editNetw") : '';
            $tpl->touchBlock("moduleGroup_1");
			$tpl->touchBlock("NetFlowSflow");
			$tpl->touchBlock("LocalAS");
			$tpl->touchBlock("NetLink");
			$tpl->touchBlock("Divert");
		break;

		case 2:
            ($editNetwBtn) ? $tpl->touchBlock("editNetw") : '';
			$tpl->touchBlock("moduleGroup_1");
			$tpl->touchBlock("NetFlowSflow");
			$tpl->touchBlock("LocalAS");
			$tpl->touchBlock("Divert");

			$tpl->setVariable("NETGRP", $_POST['netgrp']);
		break;

		case 3:
            ($editNetwBtn) ? $tpl->touchBlock("editNetw") : '';
			$tpl->touchBlock("moduleGroup_1");
			$tpl->touchBlock("NetFlowSflow");
			$tpl->touchBlock("LocalAS");
			$tpl->touchBlock("NetLink");

			$tpl->setVariable("DIVERTPORT", $_POST['dvport']);
		break;

		case 4:
            ($editNetwBtn) ? $tpl->touchBlock("editNetw") : '';
			$tpl->touchBlock("moduleGroup_1");
			$tpl->touchBlock("ETH");
			$tpl->touchBlock("NetLink");
			$tpl->touchBlock("Divert");

			$tpl->setVariable("FLOWBLOCKEDACC", $_POST['flowblockedacc']);
			$tpl->setVariable("LOCALASNUM", $_POST['localasnum']);
			$tpl->setVariable("NFHOST", $_POST['nfhost']);
			$tpl->setVariable("NFPORT", $_POST['nfport']);
		break;

		case 5:
            ($editNetwBtn) ? $tpl->touchBlock("editNetw") : '';
			$tpl->touchBlock("moduleGroup_1");
			$tpl->touchBlock("ETH");
			$tpl->touchBlock("LocalAS");
			$tpl->touchBlock("NetLink");
			$tpl->touchBlock("Divert");

			$tpl->setVariable("FLOWBLOCKEDACC", $_POST['flowblockedacc']);
			$tpl->setVariable("NFHOST", $_POST['nfhost']);
			$tpl->setVariable("NFPORT", $_POST['nfport']);
		break;

		case 6:
			($editNetwBtn) ? $tpl->touchBlock("editNetw") : '';
            ($editNasBtn) ? $tpl->touchBlock("editNas") : '';
            $tpl->touchBlock("moduleGroup_2");
			$tpl->setCurrentBlock("moduleSpecGroup_2");
			$tpl->setVariable("RACCPORT", empty($_POST['raccport']) ? 1813 : $_POST['raccport']);
			$tpl->setVariable("RAUTHPORT", empty($_POST['rauthport']) ? 1812 : $_POST['rauthport']);
			$tpl->setVariable("EAPCERTPASSWORD", $_POST['eapcertpassword']);
			$tpl->setVariable("SESSIONLIFETIME", (integer)$_POST['sessionlifetime']);
			$tpl->setVariable("MAXRADIUSTIMEOUT", (integer)$_POST['maxradiustimeout']);

			$tpl->setVariable("NFHOST", $_POST['nfhost']);

			if((integer)$_POST['radblockedacc']) {
				$tpl->touchBlock("RADBLOCKEDACC");
			}

			if($_POST['radstopexpired'] == 1) {
				$tpl->touchBlock('radstopexpired');
			}
			if($_POST['restartshape'] == 1) {
				$tpl->touchBlock('restartshape');
			}
			if($_POST['raddrpool'] == 1)
			{
				$tpl->touchBlock('raddrpool');
				if($_POST['savestataddr'] == 1) $tpl->touchBlock('savestataddr');
				if($_POST['nobroadcast'] == 1) $tpl->touchBlock('nobroadcast');
			}
			else {
				$tpl->touchBlock('savestataddr_dis');
				$tpl->touchBlock('nobroadcast_dis');
			}

			$tpl->setCurrentBlock("remulItem");
			$tpl->setVariable("REMULID", 0);
			$tpl->setVariable("REMULNAME", "<%@ None %>");
			$tpl->parseCurrentBlock();

			if( false != ($modules = $lanbilling->get("getAgentsExt")) )
			{
				if(!is_array($modules))
					$modules = array($modules);

				foreach($modules as $obj)
				{
					if($obj->agent->type > 5) continue;
					$tpl->setCurrentBlock("remulItem");
					$tpl->setVariable("REMULID", $obj->agent->id);
					$tpl->setVariable("REMULNAME", "ID " . $obj->agent->id . ". " . $obj->agent->descr);

					if($_POST['remulateonnaid'] == $obj->agent->id) $tpl->touchBlock("remulSel");

					$tpl->parseCurrentBlock();
				}
			}

			if($_POST['authunknown']) {
				$tpl->touchBlock('AuthUnknown');
			}

			if($_POST['noframedip']) {
				$tpl->touchBlock('NoFramedIP');
			}

			if($_POST['radius_insert_mac_staff']) {
				$tpl->touchBlock('RadiusInsertMacStaff');
			}

			if($_POST['radius_keep_only_last_auth_info']) {
				$tpl->touchBlock('RadiusKeepOnlyLastauthInfo');
			}
            
            // DHCPD
            if((integer)$_POST['dhcpd_port'] == 0) {
                $tpl->touchBlock('dhcp_domain_name');
                $tpl->touchBlock('dhcp_identifier');
                $tpl->touchBlock('dhcp_lease_time');
                $tpl->touchBlock('radius_nameserver');
                $tpl->touchBlock('radius_nameserver2');
            }
            
            // DHCPD values
            $tpl->setVariable('DHCPPORT', $_POST['dhcpd_port']);
            $tpl->setVariable('DHCPIP', $_POST['dhcpd_ip']);
            $tpl->setVariable('DHCPDOMAINNAME', $_POST['dhcp-domain-name']);
            $tpl->setVariable('DHCPIDENTIFIER', $_POST['dhcp-identifier']);
            $tpl->setVariable('DHCPLEASETIME', $_POST['dhcp-lease-time']);
            $tpl->setVariable('RADIUSNAMESERVER', $_POST['radius-nameserver']);
            $tpl->setVariable('RADIUSNAMESERVER2', $_POST['radius-nameserver2']);
            
			$tpl->parse("moduleSpecGroup_2");
		break;

		// Phone modules setting
		case 7: case 8: case 9: case 10: case 11:
			$tpl->touchBlock("moduleSpecGroup_3");
			if(AG_SCHEMA) {
				$tpl->touchBlock("ifAGPhone");
				$tpl->touchBlock("opercatSel_" . $_POST['opercat']);
			}

			$tpl->setVariable("TELSRC", $lanbilling->stripMagicQuotes($_POST['telsrc']));
			$tpl->touchBlock("comspSel_" . $_POST['comspeed']);
			$tpl->touchBlock("comprSel_" . $_POST['comparity']);
			$tpl->touchBlock("comdtSel_" . $_POST['comdatabits']);
			$tpl->touchBlock("comstSel_" . $_POST['comstopbits']);
			$tpl->setVariable("PABXHOST", empty($_POST['nfhost']) ? "0.0.0.0" : $_POST['nfhost']);
			$tpl->setVariable("PABXPORT", (integer)$_POST['nfport']);

			if(!$_POST['instantly_amount'] AND $_POST['module']) {
				$tpl->touchBlock('InstantlyAmount');
			}

			if($_POST['moduleType'] > 7) {
				$tpl->setCurrentBlock('ifRawCopy');
				$tpl->setVariable("TELRAWCOPY", $lanbilling->stripMagicQuotes($_POST['telrawcopy']));
				$tpl->parseCurrentBlock();
			}

			$tpl->touchBlock("teldirSel_" . $_POST['teldirectionmode']);
			if($_POST['failedcalls'] == 1) $tpl->touchBlock("failcallsCheck");

			// Formats
			/*if( false != ($pabx = $lanbilling->get("getPabxes")) )
			{
				if(!is_array($pabx)) {
					$pabx = array($pabx);
				}

				foreach($pabx as $obj) {
					$tpl->setCurrentBlock("pabxsOpt");
					if($_POST['pbxid'] == $obj->pbxid) $tpl->touchBlock("pabxsOptSel");
					$tpl->setVariable("PBXID", $obj->pbxid);
					$tpl->setVariable("PBXNAME", $obj->descr);
					$tpl->parseCurrentBlock();
				}
			}*/
			/*
			switch($_POST['moduleType'])
			{
				case 7:
					$tpl->touchBlock("ifRS232src");
					$tpl->touchBlock("ifFIFOsrc");
					$tpl->touchBlock("ifPABXRS232");
					$tpl->touchBlock("ifPABXNet");
					$tpl->touchBlock("ifPABXSerIP");
					$tpl->touchBlock("ifPABXSerPort");
				break;

				case 8:
					$tpl->touchBlock("ifCDRsrc");
					$tpl->touchBlock("ifFIFOsrc");
					$tpl->touchBlock("ifPABXNet");
					$tpl->touchBlock("ifPABXSerIP");
					$tpl->touchBlock("ifPABXSerPort");
				break;

				case 9:
					$tpl->touchBlock("ifCDRsrc");
					$tpl->touchBlock("ifRS232src");
					$tpl->touchBlock("ifPABXRS232");
					$tpl->touchBlock("ifPABXNet");
					$tpl->touchBlock("ifPABXSerIP");
					$tpl->touchBlock("ifPABXSerPort");
				break;

				case 10:
					$tpl->touchBlock("ifPhIsNet");
					$tpl->touchBlock("ifCDRsrc");
					$tpl->touchBlock("ifRS232src");
					$tpl->touchBlock("ifPABXRS232");
					$tpl->touchBlock("ifPABXserIP");
					$tpl->touchBlock("ifPABXserPort");
				break;

				case 11:
					$tpl->touchBlock("ifPhIsNet");
					$tpl->touchBlock("ifCDRsrc");
					$tpl->touchBlock("ifRS232src");
					$tpl->touchBlock("ifPABXRS232");
					$tpl->touchBlock("ifPABXCliIP");
					$tpl->touchBlock("ifPABXCliPort");
				break;
			}*/

		break;

		// VoIP settings
		case 12:
			if(AG_SCHEMA) {
				$tpl->touchBlock("ifAGVoipSel_" . (integer)$_POST['opercat']);
			}
            
            ($editNasBtn) ? $tpl->touchBlock("editNas") : '';
			$tpl->setCurrentBlock("moduleSpecGroup_4");
			$tpl->setVariable("RACCPORT", empty($_POST['raccport']) ? 1813 : $_POST['raccport']);
			$tpl->setVariable("RAUTHPORT", empty($_POST['rauthport']) ? 1812 : $_POST['rauthport']);
			$tpl->setVariable("FLUSH", $_POST['flush']);
			$tpl->setVariable("TIMER", $_POST['timer']);
			$tpl->setVariable("KEEPDETAIL", ((integer)$_POST['keepdetail'] == 0) ? "<%@ always %>" : $_POST['keepdetail']);
            $tpl->setVariable("VOIPCARDUSER", $_POST['voipcarduser']);
            $tpl->setVariable("SESSIONLIFETIME", empty($_POST['sessionlifetime']) ? 3600 : $_POST['sessionlifetime']);
            $tpl->setVariable("MAXRADIUSTIMEOUT", empty($_POST['maxradiustimeout']) ? 86400 : $_POST['maxradiustimeout']);
            if($_POST['failedcalls'] == 1) $tpl->touchBlock("failedCalls");
			$tpl->parseCurrentBlock();
		break;

		// USBox settings
		case 13:
			
			$tpl->setCurrentBlock("isUsbox");
			$tpl->setVariable("USECAS", (int)$_POST['use_cas']);
			if((int)$_POST['use_cas'] > 0) $tpl->touchBlock("usingCas");
			if((int)$_POST['module'] > 0 ) $tpl->touchBlock("usingCasDis");
			$tpl->parseCurrentBlock();
			
			
			if((integer)$_POST['ignorelocal'] > 0) {
				$tpl->touchBlock('UServOnRasp');
			}
			else {
				$tpl->touchBlock("moduleSpecGroup_5");
			}
			
			if((int)$_POST['use_cas']>0) {
				$tpl->setVariable("USESMCARDS", (int)$_POST['use_smartcards']);
				$tpl->touchBlock("use_dtv");
				
				if($_POST['use_smartcards']>0) {
					$tpl->touchBlock("usingSmcards");
				}
				
				if( 0 != ($vgroupsCount = $lanbilling->get("Count", array("flt" => array("agentid" => (integer)$_POST['module']), "procname" => "getVgroups")))){
					if((integer)$_POST['module']>0) {
						$tpl->touchBlock("usingSmcardsDis"); // Disable "using smartcards" checkbox
						$tpl->setCurrentBlock("smDis");
						$tpl->setVariable("DISABLED_VALUE_USE_SMARTCARDS", $_POST['use_smartcards']);
						$tpl->parseCurrentBlock();
					}					
				}
				
				if ($_POST['dtv_type'] == "hybrid") {
					$tpl->touchBlock("use_hybrid");
					$tpl->setVariable("MDSESSIONENDPOINT", (string)$_POST['middleware_session_endpoint'] == "" ? "pgw/services/SessionControlEndpointSlsbService" : (string)$_POST['middleware_session_endpoint']);
					$tpl->setVariable("MDPROVISENDPOINT", (string)$_POST['middleware_provisioning_endpoint'] == "" ? "pgw/services/SessionControlEndpointSlsbService" : (string)$_POST['middleware_provisioning_endpoint']);
				} else {
					$tpl->touchBlock("not_hybrid");
					$tpl->setVariable("MDENDPOINT", (string)$_POST['middleware_http_endpoint']);
				}
				
	            $tpl->setVariable("CASHOST", (string)$_POST['cas_host']);
	            $tpl->setVariable("CASPORT", (integer)$_POST['cas_port']);
	            $tpl->setVariable("OPERATORTAG", (string)$_POST['operator_tag']);
	            $tpl->setVariable("NATIOANLITY", (string)$_POST['nationality']);
	            $tpl->setVariable("CASREGION", (string)$_POST['region']);
	            $tpl->setVariable("CASREFRESHSEC", (string)$_POST['refresh_sec']);
	            $tpl->setVariable("CASCITYCODE", (string)$_POST['city_code']);
				$tpl->setVariable("CHANNELS_FILTER", (string)$_POST['channels_filter']);
				$tpl->setVariable("KEEPTURNEDON", (string)$_POST['keep_turned_on_month']);
				$tpl->setVariable("MDLOGIN", (string)$_POST['middleware_login']);
				$tpl->setVariable("MDPASS", (string)$_POST['middleware_password']);
				
				$dtv_types = array(
					'irdeto'=> 'Irdeto',
					'dre' => 'DRE Crypt',
					'cerbercrypt'  => 'CerberCrypt',
					'hybrid' => '<%@ Hybrid TV %>'
				);
				
			  	foreach($dtv_types as $type => $value) {
			  		if((integer)$_POST['module'] > 0) {
			  			if($_POST['dtv_type'] != $type) {
			  				continue;
			  			}
			  		}
					$tpl->setCurrentBlock("dtvOpt");
					$tpl->setVariable("DTVTYPE", $type);
					$tpl->setVariable("DTVTYPEDESCR", $value);
					if($_POST['dtv_type'] == $type) $tpl->touchBlock("dtvOptSel");
					$tpl->parseCurrentBlock();
				}
			}
		break;
	}

	if($_POST['moduleType'] >= 1 && $_POST['moduleType'] <= 3) {
		if((integer)$_POST['ethblockedacc']) {
			$tpl->touchBlock("ETHBLOCKEDACC");
		}
	}
	else if($_POST['moduleType'] > 3 && $_POST['moduleType'] < 6) {
		if((integer)$_POST['flowblockedacc']) {
			$tpl->touchBlock("FLOWBLOCKEDACC");
		}
	}

	if($_POST['moduleType'] != 12)
	{
		$tpl->setCurrentBlock("moduleOptions");
		$tpl->setVariable("FLUSH", $_POST['flush']);
		$tpl->setVariable("TIMER", $_POST['timer']);
		$tpl->setVariable("KEEPDETAIL", ((integer)$_POST['keepdetail'] == 0) ? "<%@ always %>" : $_POST['keepdetail']);
		$tpl->parseCurrentBlock();
	}
} // end moduleForm()



/**
 * Return on background request nas list
 * @param	object, billing system class
 */
function getRnas( $lanbilling )
{
    $agentId = (integer)$_POST['module'];

	// r_id, r_nas_id	, r_rnas, r_device_id, r_rsharedsec, d_device_name
    $_order = array(
		"name" => (isset($_POST['sort'])) ? $_POST['sort'] : 'r_nas_id',
		"ascdesc" => !isset($_POST['dir']) ? 1 : (($_POST['dir'] == "ASC") ? 1 : 0)
	);

	$_flt = array(
		"agentid" => $agentId
	);
	// TODO: add search by rnas

    /**
     * Фильтр поиска по Segment или VLAN
     */
    if (isset($_POST['search']) && !empty($_POST['search'])){
		$_flt['ip'] = trim($_POST['search']);
    }

    if (!isset($_POST['alldata'])){
		$_flt["pgnum"]  = $lanbilling->linesAsPageNum((((integer)$_POST['limit'] <= 0) ? 100 : $_POST['limit']), (integer)$_POST['start'] + 1);
		$_flt["pgsize"] = ((integer)$_POST['downtype'] == 0) ? (((integer)$_POST['limit'] <= 0) ? 100 : $_POST['limit']) : (isset($_POST['limit']) ? $_POST['limit'] : "");
	}

	if(FALSE == ($result = $lanbilling->get("getRnas", array('flt'=>$_flt, "ord" => $_order)))) {
		echo "({ results: '' })";
		return;
	} else {
		if(!is_array($result)) {
			$result = array($result);
		}
		$_tmp = array();
		array_walk($result, create_function('&$obj, $key, $_tmp', '
			$_tmp[0][] = array(
				"nasid"       => $obj->nasid,
				"id"          => $obj->id,
				"isnew"       => $obj->isnew,
				"deviceid"    => $obj->deviceid,
				"rsharedsec"  => $obj->rsharedsec,
				"devicename"  => $obj->devicename,
                "ip"          => $obj->ipmask->ip,
                "mask"        => $obj->ipmask->mask
            );
            '), array(&$_tmp));
        $countNas = $lanbilling->get("Count", array("flt" => $_flt, "procname" => "getRnas"));
        if(sizeof($_tmp) > 0)
			echo '({"success": true, "total":'.$countNas.', "results": ' . JEncode($_tmp, $lanbilling) . '})';
		else echo "({ results: '' })";
	}
}

function insupdRnas( $lanbilling, &$localize )
{
    $insupdNas = array(
        'id'        => (integer)$_POST['agentid'],
        'deviceid' => (integer)$_POST['deviceid'],
        'devicename'   => $_POST['devicename'],
        'rsharedsec'   => $_POST['secret'],
        'ipmask'    => array(
            'ip' => $_POST['ip'],
            'mask' => $_POST['mask']
        )
    );
    if ((integer)$_POST['isInsert'] == 1){
        $isInsert = true;
        $insupdNas['nasid'] = 0;
    }else{
        $isInsert = false;
        $insupdNas['nasid'] = (integer)$_POST['InsUpdNas'];
    }
    if( FALSE !== ($result = $lanbilling->save('insupdRnas', $insupdNas, $isInsert)) ){
        echo '({ success: true })';
    } else {
		$error = $lanbilling->soapLastError();
        echo '({ success: false, error: { reason: "' . $localize->get("Server error") . ':<br/>' . $error->detail . '" } })';
    }
}

function delRnas( $lanbilling, &$localize )
{
	if((integer)$_POST['delRnas'] <= 0) {
		echo '({ success: false, error: { reason: "' . $localize->get("Unknown ID") . '" } })';
		return false;
	}
	if( false == $lanbilling->delete("delRnas", array("id" => (integer)$_POST['delRnas']), array("getRnas")) ) {
		$error = $lanbilling->soapLastError();
        echo '({ success: false, error: { reason: "' . $localize->get("Server error") . '<br/>' . $error->detail . '" } })';
	}
	else echo '({ success: true })';
}

function AddRemoveDevice( $lanbilling, &$localize )
{
    $isRemove = ($_POST['isRemove']) ? true : false;
    if ($isRemove)
    {
        $_flt = array(
            'nasid' => $_POST['AddRemoveDevice'],
            'devid' => 0
        );
    }
    else
    {
        $devArr = getDevices($lanbilling, trim($_POST['ip']));
        $_flt = array(
            'nasid' => $_POST['AddRemoveDevice'],
            'devid' => $devArr['deviceid']
        );
    }
    if(FALSE == ($result = $lanbilling->get("setRnasDevice", $_flt))) {
		$error = $lanbilling->soapLastError();
        echo '({ success: false, error: { reason: "' . $localize->get('Server error') . ': <br/>' . $error->detail . '" } })';
    }else{

        if (!$isRemove){

            //if ($result == 'null'){
            //    $v = array(
            //        'devicename'=>$devArr['devicename']
            //    );
            //
            //}else{
                $v = array(
                    'devicename'=>$devArr['devicename']
                );
            //}

            $d_data = ', "data": ' . JEncode($v, $lanbilling);
        }
        else $d_data = '';

        echo '({ success: true '.$d_data.' })';
    }
}



/**
 * Return on background request segments list
 * @param	object, billing system class
 */
function getSegments( $lanbilling )
{
    $agentSegmentId = ((integer)$_POST['emulate'] > 0 && (integer)$_POST['flush'] != 1) ? (integer)$_POST['emulate'] : (integer)$_POST['module'];
    $_flt = array(
        "pgnum" => $lanbilling->linesAsPageNum((((integer)$_POST['limit'] <= 0) ? 100 : $_POST['limit']), (integer)$_POST['start'] + 1),
        "pgsize" => ((integer)$_POST['downtype'] == 0) ? (((integer)$_POST['limit'] <= 0) ? 100 : $_POST['limit']) : (isset($_POST['limit']) ? $_POST['limit'] : ""),
        "agentid" => $agentSegmentId
    );

    /**
     * Фильтр поиска по Segment или VLAN
     */
    if (isset($_POST['search']) && !empty($_POST['search'])){
        if (!preg_match('~v\d*~is',$_POST['search']))
            $_flt['ip'] = trim($_POST['search']);
        else
            $_flt['vlan'] = substr(trim($_POST['search']),1);
    }
    if(FALSE == ($result = $lanbilling->get("getSegments", array('flt'=>$_flt)))) {
		echo "({ results: '' })";
		return;
	} else {
		if(!is_array($result)) {
			$result = array($result);
		}
		$_tmp = array();

		array_walk($result, create_function('&$obj, $key, $_tmp', '
			$_tmp[0][] = array(
				"recordid" => $obj->recordid,
				"aid" => $obj->id,
				"ignore" => (integer)$obj->ignorelocal,
				"nat" => (integer)$obj->nat,
				"segment" => $obj->ipmask->ip,
				"mask" => $obj->ipmask->mask,
				"nasid" => $obj->nasid,
                "rnas" => $obj->rnas,
				"outervlan" => $obj->outervlan,
				"vlanname" => $obj->vlanname,
				"vlanid" => $obj->vlanid,
                "gateway" => $obj->gateway,
                "devicegroupid" => $obj->devicegroupid,
				"devicegroupname" => $obj->devicegroupname,
				"guest" => $obj->guest);
			'), array(&$_tmp));

        $count = $lanbilling->get("Count", array("flt" => $_flt, "procname"	=> "getSegments"));
        if(sizeof($_tmp) > 0)
			echo '({"success": true, "total":'.$count.', "results": ' . JEncode($_tmp, $lanbilling) . '})';
		else echo "({ results: '' })";
	}
} // end getSegments()

/**
 * Удаление сегмента
 */
function delSegment($lanbilling, &$localize)
{
	if((integer)$_POST['delSegment'] <= 0) {
		echo '({ success: false, error: { reason: "' . $localize->get('Unknown ID') . '" } })';
		return false;
	}
	if( false == $lanbilling->delete("delSegment", array("id" => $_POST['delSegment']), array("getSegments")) ) {
		$error = $lanbilling->soapLastError();
		if(strstr($error->detail, "Segment ")) {
			$msg = $localize->get('Segment is already in use');
		} else {
			$msg = $localize->get($error->detail);
		}
        echo '({ success: false, error: { reason: "' . $localize->get('Server error') . '<br/>'.$msg.'" } })';
	}
	else echo '({ success: true })';
}


function InsUpdSegment($lanbilling, &$localize)
{
    $cidrTomask = create_function('$mask', 'return long2ip(pow(2,32) - pow(2, (32-$mask)));');
    $ipVsNet = create_function('$ip, $network, $mask', '
        if (((ip2long($ip))&(ip2long($mask)))==ip2long($network)) {
            return 1;
        }
        return 0;
    ');

    if(!empty($_POST['segment']) && !empty($_POST['mask']) && !empty($_POST['gateway']) &&
        !$ipVsNet($_POST['gateway'], $_POST['segment'], $cidrTomask($_POST['mask'])))
    {
        echo '({ success: false, error: { reason: "' . $localize->get('Gateway does not belong segment') . '" } })';
        return;
    }

    $insupdSegment = array(
		'id'	=> (integer)$_POST['agentid'],
		'nasid'	=> (integer)$_POST['nasid'],
		'vlanid'	=> (integer)$_POST['vlanid'],
		'gateway'	=> $_POST['gateway'],
		'devicegroupid'	=> $_POST['groupid'],
		'ipmask'    => array(
			'ip' => $_POST['segment'],
			'mask' => $_POST['mask']
		)
    );

    $insupdSegment['ignorelocal'] = (isset($_POST['ignore'])) ? 1 : 0;
    $insupdSegment['guest'] = (isset($_POST['guest'])) ? 1 : 0;
    $insupdSegment['nat'] = (isset($_POST['nat'])) ? 1 : 0;

    if ((integer)$_POST['isInsert'] == 1){
        $isInsert = true;
    }else{
        $isInsert = false;
        $insupdSegment['recordid'] = $_POST['recordid'];
    }

    if( FALSE !== ($result = $lanbilling->save('insupdSegment', $insupdSegment, $isInsert)) ){
        echo '({ success: true })';
    } else {
		$error = $lanbilling->soapLastError();
        echo '({ success: false, error: { reason: "' . $localize->get('Server error') . '<br/>'.$error->detail.'" } })';
    }
}


/**
 * Return on background request segments list
 * @param	object, billing system class
 */
function getIgnore( &$lanbilling )
{
	$result = $lanbilling->get("getAgent2", array("id" => (integer)$_POST['module']));

	if(!isset($result->ignorenets))
	{
		echo "({ results: '' })";
		return;
	}
	else
	{
		if(!is_array($result->ignorenets))
			$result->ignorenets = array($result->ignorenets);

		$_tmp = array();
		array_walk($result->ignorenets, create_function('&$obj, $key, $_tmp', '$_tmp[0][] = array("id" => $obj->id, "segment" => $obj->ipmask->ip, "mask" => $obj->ipmask->mask);'), array(&$_tmp));

		if(sizeof($_tmp) > 0)
			echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
		else echo "({ results: '' })";
	}
} // end getIgnore()


/**
 * Return on background request interfaces list
 * @param	object, billing system class
 */
function getInterfaces( &$lanbilling )
{
	$result = $lanbilling->get("getAgent2", array("id" => (integer)$_POST['module']));

	if(!isset($result->interfaces))
	{
		echo "({ results: '' })";
		return;
	}
	else
	{
		if(!is_array($result->interfaces))
			$result->interfaces = array($result->interfaces);

		$_tmp = array();
		array_walk($result->interfaces, create_function('&$obj, $key, $_tmp','$_tmp[0][] = array("id" => $obj->id, "name" => $obj->devname, "devid" => $obj->devid);'), array(&$_tmp));

		if(sizeof($_tmp) > 0)
			echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
		else echo "({ results: '' })";
	}
} // end getInterfaces()


/**
 * Return on background request NAS list
 * @param	object, billing class
 */
function getNAS( &$lanbilling )
{
	$result = $lanbilling->get("getAgent2", array("id" => (integer)$_POST['module']));
	if(!isset($result->rnas))
	{
		echo "({ results: '' })";
		return;
	}
	else
	{
		if(!is_array($result->rnas))
			$result->rnas = array($result->rnas);

		$_tmp = array();
		foreach($result->rnas as $obj)
		{
			$_tmp[] = array("nasid" => $obj->nasid,
					"id" => $obj->id,
					"rnas" => $obj->ipmask->ip,
					"secret" => $obj->rsharedsec,
                    "deviceid" => $obj->deviceid,
                    "devicename" => $obj->devicename,
					"isnew" => 0);
		}

		if(sizeof($_tmp) > 0)
			echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
		else echo "({ results: '' })";
	}
} // end getNAS()


/**
 * Return on background request black list for the selected NAS
 * @param	object, billing class
 */
function getNASBlock( &$lanbilling )
{
	$result = $lanbilling->get("getAgent2", array("id" => (integer)$_POST['module']));

	if(!isset($result->rnas))
	{
		echo "({ results: '' })";
		return;
	}
	else
	{
		if(!is_array($result->rnas))
			$result->rnas = array($result->rnas);

		$_tmp = array();
		foreach($result->rnas as $obj)
		{
			if($obj->nasid == (integer)$_POST['getnasblock'])
			{
				if(!isset($obj->radblacklog) || empty($obj->radblacklog)) break;
				else
				{
					if(!is_array($obj->radblacklog))
						$obj->radblacklog = array($obj->radblacklog);

					foreach($obj->radblacklog as $child)
					{
						$tmp = array(
                            "nasid" => $child->nasid,
							"aniid" => $child->nasid,
							"descr" => $child->anidescr
                        );

						switch( true )
						{
							case ((integer)$child->vgid > 0): $tmp["value"] = $child->vgid; $tmp["type"] = 3; break;
							case ((integer)$child->groupid > 0): $tmp["value"] = $child->groupid; $tmp["type"] = 2; break;
							case ((integer)$child->tarid > 0): $tmp["value"] = $child->tarid; $tmp["type"] = 1; break;
							default: $tmp["value"] = $child->ani; $tmp["type"] = 0;
						}

						$_tmp[] = $tmp;
					}
				}

				break;
			}
		}
		if(sizeof($_tmp) > 0)
			echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
		else echo "({ results: '' })";
	}
} // end getNASBlock()


/**
 * Get tarifs list according to the module type edited
 * @param	object, billing class
 */
function getTarifs( &$lanbilling )
{
	if( false != ($result = $lanbilling->get("getTarifsExt", array("archive" => 0, "unavail" => -1, "common" => -1))) )
	{
		if(!is_array($result)) {
			$result = array($result);
		}

		$_tmp = array();
		foreach($result as $obj)
		{
			if($_POST['gettarifs'] < 7 && $result->tarif->type < 4) {
				$_tmp[] = array("id" => $obj->tarif->tarid, "name" => $obj->tarif->descr);
			}
			elseif($_POST['gettarifs'] == 12) {
				$_tmp[] = array("id" => $obj->tarif->tarid, "name" => $obj->tarif->descr);
			}
			else continue;
		}

		if(sizeof($_tmp) > 0)
			echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
		else echo "({ results: '' })";
	}
	else echo "({ results: '' })";
} // end getTarifs()


/**
 * Get tarifs list according to the module type edited
 * @param	object, billing class
 */
function getUnions( &$lanbilling )
{
	if( false != ($result = $lanbilling->get("getGroups")) )
	{
		if(!is_array($result)) {
			$result = array($result);
		}

		$_tmp = array();
		array_walk($result, create_function('&$val, $key, $_tmp', '$_tmp[0][] = array("id" => $val->groupid, "name" => $val->name);'), array(&$_tmp));

		if(sizeof($_tmp) > 0)
			echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
		else echo "({ results: '' })";
	}
	else echo "({ results: '' })";
} // end getUnions()


/**
 * Save sent data from client through soap
 * @param	object, billing system
 * @param	object, template class
 * @param	array
 */
function saveModuleData( &$lanbilling, &$tpl, &$moduleDescr )
{
	// Link IP class
	if($lanbilling->ifIncluded("ip_calc_compare.php") == false)
		include_once("ip_calc_compare.php");
	
	// Prepare Array construction to fill data to
	$struct = array( "agent" => array(
		"id" => (integer)$_POST['module'],
		"type" => (integer)$_POST['moduleType'],
		"flush" => (integer)$_POST['flush'],
		"timer" => $_POST['timer'],
		"nfhost" => $_POST['nfhost'],
		"nfport" => (integer)$_POST['nfport'],
		"localasnum" => $_POST['localasnum'],
		"ignorelocal" => $_POST['ignorelocal'],
		"descr" => empty($_POST['descr']) ? 'Undefined module name' : $_POST['descr'],
		"servicename" => $_POST['servicename'],
		"naip" => $_POST['naip'],
		"nadb" => $_POST['nadb'],
		"nausername" => $_POST['nausername'],
		"napass" => $_POST['napass'],
		"raccport" => (integer)$_POST['raccport'],
		"rauthport" => (integer)$_POST['rauthport'],
		"eapcertpassword" => $_POST['eapcertpassword'],
		"sessionlifetime" => (integer)$_POST['sessionlifetime'],
		"maxradiustimeout" => (integer)$_POST['maxradiustimeout'],
		"raddrpool" => (integer)$_POST['raddrpool'],
		"savestataddr" => (integer)$_POST['savestataddr'],
		"remulateonnaid" => (integer)$_POST['remulateonnaid'],
		"radstopexpired" => (integer)$_POST['radstopexpired'],
		"restartshape" => (integer)$_POST['restartshape'],
		"telrawcopy" => $lanbilling->stripMagicQuotes($_POST['telrawcopy']),
		"teldirectionmode" => (integer)$_POST['teldirectionmode'],
		"failedcalls" => (integer)$_POST['failedcalls'],
		"opercat" => (integer)$_POST['opercat'],
		"telsrc" => $lanbilling->stripMagicQuotes($_POST['telsrc']),
		"comspeed" => (integer)$_POST['comspeed'],
		"comparity" => (integer)$_POST['comparity'],
		"comdatabits" => (integer)$_POST['comdatabits'],
		"comstopbits" => (integer)$_POST['comstopbits'],
		"pbxid" => (integer)$_POST['pbxid'],
		"failedcalls" => (integer)$_POST['failedcalls'],
		"voipcarduser" => $_POST['voipcarduser'],
		"keepdetail" => (integer)$_POST['keepdetail']),

		"ignorenets" => '',
		"interfaces" => '',
		"segments" => '',
		"rnas" => ''
	);
	
	if($_POST['moduleType'] >= 1 && $_POST['moduleType'] < 4) {
		$struct['agent']['failedcalls'] = (integer)$_POST['ethblockedacc'];
	}

	if($_POST['moduleType'] > 3 && $_POST['moduleType'] < 6) {
		$struct['agent']['failedcalls'] = (integer)$_POST['flowblockedacc'];
	}

	if($_POST['moduleType'] == 6) {
		$struct['agent']['failedcalls'] = (integer)$_POST['radblockedacc'];
		$struct['agent']['ignorelocal'] = (integer)$_POST['nobroadcast'];
		$struct['agent']['opercat'] = (integer)$_POST['authunknown'];

		//$struct['agent']['admnotify'] = (integer)$_POST['noframedip'];
		// $FramedIPAddress
	}

	switch($_POST['moduleType'])
	{
		case 2: $struct['agent']['nfport'] = $_POST['netgrp']; break;
		case 3: $struct['agent']['nfport'] = $_POST['dvport']; break;
		case 13:
			$struct['agent']['ignorelocal'] = (integer)$_POST['ignorelocal'];
		break;
	}

	if(isset($_POST['net']) && sizeof($_POST['net']) > 0)
	{
		$netStruct = array();

		foreach($_POST['net'] as $_seg)
		{
			$netStruct[] = array(
				"recordid" => (integer)$_seg['recordid'],
				"id" => (integer)$_seg['id'],
				"ipmask" => array("ip" => $_seg['segment'], "mask" => $_seg['mask']),
				"nasid" => (integer)$_seg['nasid'],
				"guest" => !$lanbilling->boolean($_seg['guest']) ? 0 : 1,
				"ignorelocal" => !$lanbilling->boolean($_seg['ignore']) ? 0 : 1,
				"nat" => !$lanbilling->boolean($_seg['nat']) ? 0 : 1,
                "outervlan" => (integer)$_seg['outervlan'],
                "gateway" => trim($_seg['gateway'])
			);
		}

		$struct['segments'] = $netStruct;
	}
	else unset($struct['segments']);

	if(isset($_POST['ign']) && sizeof($_POST['ign']) > 0)
	{
		$netStruct = array();

		foreach($_POST['ign'] as $_seg) {
			$netStruct[] = array( "id" => (integer)$_seg['id'], "ipmask" => array("ip" => $_seg['segment'], "mask" => $_seg['mask']));
		}

		$struct['ignorenets'] = $netStruct;
	}
	else unset($struct['ignorenets']);

	if(isset($_POST['ifc']) && sizeof($_POST['ifc']) > 0)
	{
		$netStruct = array();

		foreach($_POST['ifc'] as $_seg)
		{
			$netStruct[] = array(
				"id" => (integer)$_seg['id'], "devid" => (integer)$_seg['devid'],
				"devname" => $_seg['name'], "archive" => 0
			);
		}

		$struct['interfaces'] = $netStruct;
	}
	else unset($struct['interfaces']);

	if(isset($_POST['nas']) && sizeof($_POST['nas']) > 0)
	{
		$netStruct = array();

		foreach($_POST['nas'] as $_seg)
		{
			$netStruct[] = array(
				"nasid" => (integer)$_seg['nasid'],
				"isnew" => (integer)$_seg['isnew'],
				"ipmask" => array("ip" => $_seg['rnas'], "mask" => 32),
				"id" => (integer)$_seg['id'],
                "deviceid" => (integer)$_seg['deviceid'],
				"rsharedsec" => $_seg['secret']
			);

			if(isset($_POST['radblacklog'][(integer)$_seg['nasid']]) && !empty($_POST['radblacklog'][(integer)$_seg['nasid']]))
			{
				foreach($_POST['radblacklog'][(integer)$_seg['nasid']] as $child)
				{
					$tmp = array("aniid" => (integer)$_POST['aniid'],
						"nasid" => (integer)$child['nasid'],
						"createdby" => (integer)$_SESSION['auth']['authperson'],
						"anidescr" => $child['descr'],
						"ani" => "", "vgid" => 0, "tarid" => 0, "groupid" => 0);

					switch($child['type'])
					{
						case 2: $tmp["groupid"] = $child["value"]; break;
						case 1: $tmp["tarid"] = $child["value"]; break;
						default: $tmp["ani"] = $child["value"];
					}

					$netStruct[sizeof($netStruct) - 1]["radblacklog"][] = $tmp;
				}
			}
		}

		$struct['rnas'] = $netStruct;
	}
	else unset($struct['rnas']);

	try {
		if ($ret = $lanbilling->save("insupdAgent2", $struct, (($_POST['module'] == 0) ? true : false), array("getAgent2", "getAgentsExt")))	{
			if((int)$ret>0 && $_POST['module'] == 0) $_POST['module'] = $ret->ret;
			
			if($_POST['moduleType'] == 7) {
				if (!useAgentOptions(true, $_POST['module'], 'instantly_amount', 'instantly_amount', isset($_POST['instantly_amount']) ? $_POST['instantly_amount'] : 1)) {
					return false;
				}
			}
			if($_POST['moduleType'] == 6) {
				// This line need to fix unchecked check box in the post
				$_POST['skip-empty-framed-ip'] = (integer)$_POST['noframedip'];
			
				foreach(array('skip-empty-framed-ip', 'dhcpd_port', 'dhcpd_ip', 'dhcp-domain-name', 'dhcp-identifier', 'dhcp-lease-time',
						'radius-nameserver', 'radius-nameserver2', 'radius_insert_mac_staff', 'radius_keep_only_last_auth_info') as $item) {
						if (!useAgentOptions(true, $_POST['module'], $item, $item, $_POST[$item])) {
							return false;
						}
				}
			}
			else if($_POST['moduleType'] == 13) {
				foreach(array('use_cas', 'use_smartcards', 'cas_host', 'cas_port', 'operator_tag', 'nationality', 'region', 'refresh_sec', 'city_code', 'channels_filter', 'keep_turned_on_month', 'middleware_login', 'middleware_password', 'middleware_http_endpoint', 'middleware_session_endpoint', "middleware_provisioning_endpoint", 'dtv_type') as $item) {
					$_POST['use_smartcards'] = (int)$_POST['use_smartcards'];
					if(isset($_POST['disabled_value_use_smartcards'])) {
						$_POST['use_smartcards'] = (int)$_POST['disabled_value_use_smartcards'];
					}
					if(isset($_POST[$item])) {
						if (!useAgentOptions(true, $_POST['module'], $item, $item, (string)$_POST[$item])) return false;
					}
				}
			}
			return true;
		}
		else {
			define("SHOW_ERROR_MSG", true);
			return false;
		}
		
	} catch(Exception $e) { return false; }
} // end saveModuleData()


/**
 * Get simple modules list on background request
 * @param
 */
function getModulesList( &$lanbilling )
{
	$_tmp = array();

	if( false != ($result = $lanbilling->get("getAgentsExt")) )
	{
		if(!is_array($result)) {
			$result = array($result);
		}

		array_walk($result, create_function('$item, $key, $_tmp', '$_tmp[0][] = (array)$item->agent;'), array( &$_tmp ));
	}

	if(sizeof($_tmp) > 0) {
		echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
	}
	else {
		echo "({ results: '' })";
	}
} // end getModulesList


/**
 * Show Debug report after save action
 * @param	object, system main class
 * @param	integer, table width
 */
function afterSaveReport( &$lanbilling, &$localize, $width = 800 )
{
	if($lanbilling->ifIncluded("debug.class.php") == false)
		include_once("debug.class.php");

	$debug = new debug_PRINT();
	// Allow table borders
	$debug->table_border = 1;
	// Redefined table properties after build
	$debug->table_width = $width;
	$debug->tableProp();
	// Allow column borders
	$debug->td_border = 1;
	$debug->head_drawLine($localize->resource["Saving module settings"] . COLON,0);
	// Allow column borders
	$debug->td_border = 0;
	$debug->sock_drawLine("There was an error while saving module. See logs", "FAIL");
} // end afterSaveReport()


/**
 * Get devices list
 * @param   object, system main class
 */
function getDevices( &$lanbilling, $devId = false )
{
    $dev_ip = ($devId === false) ? $_POST['getnasdevice'] : $devId;
    $_tmp = array();
    if( false != ($result = $lanbilling->get("getDevices", array( "flt" => array( "ip" => $dev_ip ) ))) ) {
        if(!is_array($result)) { $result = array($result); }
        if(!empty($result)) {
            $result = current($result);

            $_tmp = array(
                "deviceid" => $result->deviceid,
                "devicename" => $result->devicename
            );
        }
    }
    if(sizeof($_tmp) > 0) {
        if ($devId !== false)
            return $_tmp;
        else
            echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
    }
    else {
        if ($devId !== false)
            return false;
        else
            echo "({ results: null })";
    }
} // end getDevices()



/**
 * Get parsers list
 * @param   object, system main class
 * @param	object, localize class
 */
function getParsers( &$lanbilling, &$localize ) {
	
	$filter = array(
		'agentid' => (int)$_POST['getparsers']
	);
		
	if(false === ($parsers = $lanbilling->get("getPhoneParsers", array('flt' => $filter)))) {
		echo '({ success: false, error: { reason: "' . $localize->get($lanbilling->soapLastError()->detail) . '" } })';
		return;
	}
	if(!is_array($parsers)) {
		$parsers = array($parsers);
	}
	
	echo '({"results": ' . JEncode($parsers, $lanbilling) . '})';
} // getParsers()


/**
 * Set parser params or create new
 * @param   object, system main class
 * @param	object, localize class
 */
function setParser( &$lanbilling, &$localize ) {
	$struct = array(
		'recordid' => (int)$_POST['recordid'],
		'agentid' => (int)$_POST['agentid'],
		'name' => $_POST['name'],
		'pabxid' => (int)$_POST['pabxid'],
		'type' => (int)$_POST['type']
	);
	
	$struct['savedir'] = '';
	$struct['source'] = '';
	
	switch((int)$_POST['type']) {
		case 0: 
			$struct['savedir'] = $_POST['pcdrSaveDir'];
			$struct['source'] = $_POST['cdrdir'];
			break;
		case 1: 
			$struct['savedir'] = $_POST['RSSaveDir'];
			$struct['source'] = $_POST['deviceport'] . ',' . $_POST['speed'] . ',' . $_POST['parity'] . ',' . $_POST['databits'] . ',' . $_POST['stopbits'];
			break;
		case 2:
			$struct['savedir'] = $_POST['fifoSaveDir'];
			$struct['source'] = $_POST['streamfile'];
			break;
		case 3:
		case 4:
			$struct['savedir'] = $_POST['tcpSaveDir'];
			$struct['source'] = $_POST['ip'].':'.$_POST['port'];
			break;
	}

	if($struct['savedir'] == '') {
		echo '({ success: false, error: { reason: "Please fill saving path field, it is required" } })';
		return;
	}
	
	$data = array(
		'id'=> (int)$_POST['recordid'],
		'val' => $struct
	);
	
	if(false === $lanbilling->get("insupdPhoneParser", $data)) {
		echo '({ success: false, error: { reason: "' . $localize->get($lanbilling->soapLastError()->detail) . '" } })';
		return;
	} else {
		 echo '({success: true})';
	}
		
} // setParser()



/**
 * Delete parser
 * @param   object, system main class
 * @param	object, localize class
 */
function delParser( &$lanbilling, &$localize ) {
	
	$struct = array(
		'id' => (int)$_POST['delparser']
	);
	
	if(false === $lanbilling->get("delPhoneParser", $struct)) {
		echo '({ success: false, error: { reason: "' . $localize->get($lanbilling->soapLastError()->detail) . '" } })';
		return;
	}
	echo '({success:true})';
} // delParser()



/**
 * Get LBPhone parser types
 * @param   object, system main class
 * @param	object, localize class
 */
function getFormats( &$lanbilling, &$localize  ) {
	if( false != ($pabx = $lanbilling->get("getPabxes")) )
	{
		if(!is_array($pabx)) {
			$pabx = array($pabx);
		}
	}
	
	echo '({"results": ' . JEncode($pabx, $lanbilling) . '})';
} // end getFormats()
