<?php
/**
 * Inventory
 *
 *
 * Repository information:
 * $Date: 2009/12/10 08:48:07 $
 * $Revision: 1.1.2.24 $
 */
//---------------------------------------------------------------------------------------
    define("SUCCESS_MSG", $localize->compile("<%@ Request done successfully %>"));
    define("ERROR_MSG", $localize->compile("<%@ There was an error while sending data to server %>"));
    define("UNDEFINED", $localize->compile("<%@ Undefined %>"));
    define("EMPTY_SEL", $localize->compile("<%@ Fields not selected %>"));
    define("SNMP_AGENT_TYPE", 14);
    define("FLUSH_MULTIPLIER", 6);
    define("STATUS_UP", 1);
    define("STATUS_DOWN", 0);
    define("STATUS_UNKNOWN", -1);
    define("ICONS_DIR", "./images/states");
//---------------------------------------------------------------------------------------
// There is background query
if(isset($_POST['async_call'])) {

    if( isset($_POST["save_devices"]) ) {
        save_devices($lanbilling, $localize);
    }

    if( isset($_POST["save_port_tpls"]) ) {
        save_ports($lanbilling, $localize);
    }
    if( isset($_POST["getFilteredDeviceIds"]) ) {
        getFilteredDeviceIds($lanbilling, $localize);
    }
    if( isset($_POST["get_dev_tpls"]) ) {
        get_device_tpls($lanbilling, $localize);
    }
    
    if( isset($_POST["getdevgr"]) ) {
        getDevGroups($lanbilling, $localize);
    }

    if( isset($_POST["get_ports_tpls"]) ) {
        get_ports($lanbilling, $localize);
    }

    if( isset($_POST["get_ports"]) ) {
        get_ports($lanbilling, $localize, false);
    }

    if( isset($_POST["get_devices"]) ) {
        get_devices($lanbilling, $lanbilling);
    }
    if( isset($_POST["get_devices_options"]) ) {
        get_devices_options($lanbilling);
    }
    if( isset($_POST["get_device"]) ) {
        get_device($lanbilling);
    }

    if( isset($_POST["delete_device"]) ) {
        delete_device($lanbilling, $localize);
    }

    if( isset($_POST["get_dev_groups"]) ) {
        get_device_groups($lanbilling, $localize);
    }

    if( isset($_POST["add_group"]) ) {
        edit_device_group($lanbilling, $localize);
    }

    if( isset($_POST["remove_group"]) ) {
        edit_device_group($lanbilling, $localize);
    }

    if( isset($_POST["update_groups_members"]) ) {
        update_groups_members($lanbilling, $localize);
    }

    if( isset($_POST["check_vgid"]) ) {
        check_vgid($lanbilling);
    }

    if( isset($_POST["update_port"]) ) {
        update_port($lanbilling);
    }

    if( isset($_POST["getvgroups"]) ) {
        get_accounts($lanbilling);
    }

    if( isset($_POST["get_devices_for_tree"]) ) {
        get_devices_for_tree($lanbilling, $localize);
    }

    if( isset($_POST["del_tree_item"]) ) {
        update_device_tree($lanbilling);
    }

    if( isset($_POST["insert_tree_item"]) ) {
        update_device_tree($lanbilling);
    }

    if( isset($_POST["get_agents"]) ) {
        get_snmp_agent($lanbilling, $localize);
    }

    if( isset($_POST["get_policy"]) || isset($_POST["get_policies"]) ) {
        get_policy($lanbilling, $localize);
    }

    if( isset($_POST["delete_policy"]) ) {
        delete_policy($lanbilling, $localize);
    }

    if( isset($_POST["get_port_states"]) ) {
        get_port_states($lanbilling);
    }

    if( isset($_POST["delete_port_state"]) ) {
        delete_port_state($lanbilling, $localize);
    }

    if( isset($_POST["save_policies"]) ) {
        save_policies($lanbilling, $localize);
    }

    if( isset($_POST["save_states"]) ) {
        save_port_states($lanbilling, $localize);
    }

    if( isset($_POST["get_device_segments"]) ) {
        get_device_segments($lanbilling);
    }

    if( isset($_POST["get_devices_list"]) ) {
        get_devices_list($lanbilling);
    }

    if( isset($_POST['get_device_nas']) ) {
        get_device_nas($lanbilling);
    }

    if( isset($_POST['get_device_agents']) ) {
        get_radius_modules($lanbilling);
    }
    // ---------- DevGroupOpt ------------------------
    // -- VALS --
    if( isset($_POST["show_dev_group_opt_vals"]) ) {
        showDevGroupOptVals($lanbilling);
    }
    if( isset($_POST["save_dev_group_opt_vals"]) ) {
        saveDevGroupOptVals($lanbilling, $localize);
    }

    // -- SET --
    if( isset($_POST["show_dev_group_opt_set"]) ) {
        showDevGroupOptSet($lanbilling);
    }
    if( isset($_POST["save_dev_group_opt_set"]) ) {
        saveDevGroupOptSet($lanbilling);
    }
    if( isset($_POST["del_dev_group_opt_set"]) ) {
        delDevGroupOptSet($lanbilling);
    }
    if( isset($_POST["removeportfromvgid"]) ) {
        removePortFromVgid($lanbilling);
    }

    // -- STAFF --
    if( isset($_POST["show_dev_group_opt_staff"]) ) {
        showDevGroupOptStaff($lanbilling);
    }

}
else {

    $tpl = new HTML_Template_IT(TPLS_PATH);

    if( $_POST['devision'] == 207 ) {
        if( isset($_POST['device']) ) {
            $tpl->loadTemplatefile("inventory_edit_device.tpl", true, true);
            $tpl->touchBlock("__global__");
            $tpl->setCurrentBlock("DEVICE_PARAMS");
            $device_id = is_numeric($_POST['device']) ? $_POST['device'] : 0;
            $tpl->setVariable("DEVICE_ID", $device_id);
            $group_id = is_numeric($_POST['group_id']) ? $_POST['group_id'] : 0;
            $tpl->setVariable("GROUP_ID", $group_id);
            $tpl->parseCurrentBlock();
        } else {
            $tpl->loadTemplatefile("inventory_edit_devices.tpl", true, true);
            $tpl->touchBlock("__global__");
        }
    } elseif( $_POST['devision'] == 208 ) {
        $tpl->loadTemplatefile("inventory_policy.tpl", true, true);
        $tpl->touchBlock("__global__");
        $icons = get_icons();
        $tpl->setCurrentBlock("STATE_ICONS");
        $tpl->setVariable("ICONS", $icons);
        $tpl->parseCurrentBlock();
    } elseif( $_POST['devision'] == 209 ) {
        $tpl->loadTemplatefile("inventory_devicetree.tpl", true, true);
        $tpl->touchBlock("__global__");
    }

    $localize->compile($tpl->get(), true);
}


/**
 * Function to dencode recieved JSON structure
 * Remember!! You should pass array data encoded UTF-8
 * Returns mixed
 * @param
 * @param
 */
function JDecode(&$lanbilling, $json_string ,$assoc= false)
{
    if(function_exists("json_decode")) {
        $json_string = $lanbilling->stripMagicQuotes($json_string);
        $data = json_decode($json_string, $assoc);
    }

    else {
        if( !version_compare(PHP_VERSION,"5.2","<") )
        {
            $lanbilling->ErrorHandler("async_handler.php", "There're avaliable [json_encode / json_decode] functions for your version. [PHP " . PHP_VERSION . "]", __LINE__);
        }

        require_once("includes/JSON.php");
        $json = new Services_JSON();
        $data = $json->decode($json_string, $assoc);
    }

    return $data;
} // end JDecode()

//---------------------------------------------------------------------------
/**
 * Save devices
 * @param    object, billing class
 * @param    object, template class
 */
function save_devices(&$lanbilling, &$localize) {
    $devices = JDecode($lanbilling, $_POST["devices"]);
    $success = true;
	
    foreach( $devices as $device ) {
        if( !($result = save_device($lanbilling, $device)) ) {
            break;
        }
    }

    $msg = ($result) ? SUCCESS_MSG : ERROR_MSG;
    if( isset($_POST["single_device"]) ) {
        $response = array("device_id" => $result, "message" => $msg);
        $response =  JEncode($response, $lanbilling);
        echo "$response";
    } else {
        echo "$msg";
    }
}

//---------------------------------------------------------------------------
/**
 * Save device
 * @param    object, billing class
 * @param    object, device
 */
function save_device(&$lanbilling, &$device) {

    $addr = explode(",", $device->address);
	$dev = array(
		"deviceid"      => ($device->device_id) ? (integer) $device->device_id : 0,
		"tpl"           => ($_POST["group_id"] == -1) ? 1 : 0,
		"devicename"    => htmlspecialchars($device->name, ENT_QUOTES),
		"prototypeid"   => (integer) $device->prototype_id,
		"countryid"     => (integer) trim($addr[0]),
		"regionid"      => (integer) trim($addr[1]),
		"areaid"        => (integer) trim($addr[2]),
		"cityid"        => (integer) trim($addr[3]),
		"settleid"      => (integer) trim($addr[4]),
		"streetid"      => (integer) trim($addr[5]),
		"buildingid"    => (integer) trim($addr[6]),
		"flatid"        => (integer) trim($addr[7]),
		"entranceid"    => (integer) trim($addr[8]),
		"floorid"       => (integer) trim($addr[9])
	);


    if( $device->device_id && !isset($device->options) ) {

        $result = $lanbilling->get("getDevice", array("id" => (integer) $device->device_id), true);
        if( false === $result || empty($result) ) {
            $success = false;
            break;
        }

        if( isset($result->options) ) {
                if( !is_array($result->options) ) {
                    $o = array($result->options);
                }
                else {
                    $o = $result->options;
                }
        }

        $opt = array();
        if( $o ) {
            foreach( $o as $item ) {
                $opt[] = array("name" => $item->name, "desc" => $item->desc, "value" => $item->value);
            }
        }

    } elseif( isset($device->options) && is_array($device->options) && !empty($device->options)) {
        $opt = array();
        foreach( $device->options as $o ) {
            $opt[] = array( "optionid"    => 0,
                            "deviceid"    => 0,
                            "name"        => htmlspecialchars($o[0], ENT_QUOTES),
                            /*"variantid" => $o[0],*/
                            "desc"        => htmlspecialchars($o[1], ENT_QUOTES),
                            "value"        => htmlspecialchars($o[2], ENT_QUOTES)
                         );
        }
    }

    $params = array("device" => $dev);

    if($device->rnas && $device->rnas->rnas == 1) {
       $params['rnas'] = array(
           'nasid' => 0,
           'id' => (integer)$device->rnas->moduleid,
           'rsharedsec' => $device->rnas->rsharedsec
       );
    }

    if( isset($opt) ){
        $params["options"] = $opt;
    }

    $success = $lanbilling->save("insupdDevice", $params, ($device->device_id) ? false : true, "getDevices");
    $device_id = ($device->device_id) ? (integer) $device->device_id : $lanbilling->saveReturns->ret;

    $group_id = (integer) $_POST["group_id"];
    if( $group_id && $group_id != -1 ) {
        $o = array("deviceid" => $device_id, "groupid" => $group_id);
        $success = $lanbilling->get("insDeviceGroupsMember", $o, true);
     }

    if( isset($device->removed_groups) ) {
        foreach( $device->removed_groups as $id ) {
            if( false === $lanbilling->delete("delDeviceGroupsMember", array("deviceid" => $device_id, "groupid" => (integer)$id), "getDevices") ) {
                $success = false;
                break;
            }
        }
    }

    if( isset($device->groups) ) {
        foreach( $device->groups as $group ) {
            $o = array("deviceid" => $device_id, "groupid" => (integer) $group[0] );
            if( false === $lanbilling->get("insDeviceGroupsMember", $o, true) ) {
                $success = false;
                break;
            }
        }
    }

    if( isset($device->removed_ports) ) {
        foreach( $device->removed_ports as $id ) {
            if( false === $lanbilling->delete("delPort", array("id" => (integer) $id), array("getPorts", "getDevices")) ) {
                $success = false;
                break;
            }
        }
    }

    if( isset($device->ports) ) {
        foreach( $device->ports as $port ) {
            $ar = array(    "portid" => ($port[0]) ? (integer) $port[0] : 0,
                            "deviceid" => $device_id,
                            "vgid" => (integer) $port[8],
                            "tpl" => 0,
                            "prototypeid" => (integer) $port[7],
                            "name" =>  (integer) $port[1],
                            "speed" => htmlspecialchars($port[2], ENT_QUOTES),
                            "media" => htmlspecialchars($port[3], ENT_QUOTES),
                            "vlanid" => (integer) $port[4],
                            "policyid" => (integer) $port[12],
                            "comment" => htmlspecialchars($port[11], ENT_QUOTES)

                        );

            if( false === $lanbilling->save("insupdPort", $ar, ($port[0]) ? false : true ,  array("getPorts", "getDevices")) ) {
                $success = false;
                break;
            }
        }

    }

    if( isset($_POST["single_device"]) ) {
        $result = ($success) ? $device_id : 0;
        return     $result;
    } else {
        return $success;
    }
}
//---------------------------------------------------------------------------
/**
 * Get devices templates
 * @param    object, billing class
 */
function get_device_tpls(&$lanbilling, &$localize) {

    $_filter = $lanbilling->soapFilter( array("istemplate" => 1) );
    $_md5 = $lanbilling->controlSum($_filter);
    $result = $lanbilling->get("getDevices", array("flt" => $_filter , "md5" => $_md5), true);

    if( false === $result || empty($result) ) {
        echo "[]";
        return;
    }

    if( !is_array($result) ) {
        $result = array($result);
    }

    $first_option_name = $localize->compile("<%@ Choose %>");
    $s = "[0, '{$first_option_name}']";

    foreach( $result as $item ) {
        if( !empty($s) ) $s .= ",";
        $addr_idx = "{$item->countryid}, {$item->regionid}, {$item->areaid}, {$item->cityid}, {$item->settleid}, {$item->streetid}, {$item->buildingid}, {$item->flatid}, {$item->entranceid}, {$item->floorid}";
        $s .= "['{$item->deviceid}', '{$item->devicename}', '{$item->deviceaddr}', '{$addr_idx}']";
    }

    echo "[{$s}]";
}



/**
 *
 * Get device option variants
 */

function get_devices_options(&$lanbilling){

    $response = $lanbilling->get("getDevicesOptionsSet", array(), true);
    if (!$response || !is_array($response)) echo '{}';
    else{
            $result  = array();

        foreach($response as $item)
                $result[]=array('name'=>$item->name);

        echo JEncode($result, $lanbilling);
    }

}



//---------------------------------------------------------------------------
/**
 * Get device options
 * @param    object, billing class
 */
function get_device(&$lanbilling, $template = false) {

    $id = ($template) ? $_POST["tpl_id"] : $_POST["device_id"];
    if( !$id ) {
        echo "{}";
        return;
    }
    $result = $lanbilling->get("getDevice", array("id" => (integer) $id), true);

    if( false === $result || empty($result) ) {
        echo "{}";
        return;
    }

    $options = array();

    if( isset($result->options) ) {
        if( !is_array($result->options) ) {
            $o = array($result->options);
        }
        else {
            $o = $result->options;
        }

        foreach( $o as $opt ) {
            $ar = array( "id" => $opt->optionid,
                         "name" => $opt->name,
                         "descr" => $opt->desc,
                         "value" => $opt->value
                       );
            $options[] = $ar;
        }
    }

    if( $template ) {
        $response = array("tpl_name" => $result->device->devicename, "options" => $options);
    } else {
        $address_idx = "{$result->device->countryid}, {$result->device->regionid}, {$result->device->areaid}, {$result->device->cityid}, {$result->device->settleid}, {$result->device->streetid}, {$result->device->buildingid}, {$result->device->flatid}, {$result->device->entranceid}, {$result->device->floorid}";
        $response = array("tpl_name" => $result->device->devicename, "prototype_id" => $result->device->prototypeid, "uptime" => $result->device->uptime, "address_idx" => $address_idx , "address_str" => $result->device->deviceaddr, "options" => $options);
    }

    $encoded = JEncode($response, $lanbilling);
    echo "$encoded";
}
//---------------------------------------------------------------------------
/**
 * Save device ports
 * @param    object, billing class
 * @param    object, localize class
 */
function save_ports(&$lanbilling, &$localize) {

     $success = true;

     if( isset($_POST["to_delete"]) ) {
         foreach( $_POST["to_delete"] as $id ) {
            if( false === $lanbilling->delete("delPort", array("id" => (integer) $id), array("getPorts", "getDevices")) ) {
                $success = false;
                break;
            }
        }
         if( !$success ) {
             echo ERROR_MSG;
            return;
         }
    }

    if( isset($_POST["ports"]) && !empty($_POST["ports"]) ) {
        foreach( $_POST["ports"] as $row ) {
            $p = split(",", htmlspecialchars($row) );
            $ar = array(    "portid" => ($p[0]) ? (integer) $p[0] : 0,
                            "deviceid" => (integer) $_POST["device_id"],
                            "vgid" => '',
                            "tpl" => ($_POST["save_port_tpls"]) ? 1 : 0,
                            "prototypeid" => (integer) $p[5],
                            "name" => (integer) $p[1],
                            "speed" => htmlspecialchars($p[2], ENT_QUOTES),
                            "media" => htmlspecialchars($p[3], ENT_QUOTES),
                            "vlan" => (integer) $p[4],
                            "comment" => htmlspecialchars($p[5], ENT_QUOTES),
                            "policyid" => (integer) $p[6]
                        );
            if( false === $lanbilling->save("insupdPort", $ar, ($p[0]) ? false : true , "getPorts") ) {
                $success = false;
                break;
            }
        }
    }

    if( $success ) {
        echo SUCCESS_MSG;
    } else {
        echo ERROR_MSG;
    }


}


/**
 * Get ports templates
 * @param    object, billing class
 */
function get_ports(&$lanbilling, &$localize, $templates = true)
{
    try {
        $_tmp = array();

        if( $templates ) {
            $_filter = $lanbilling->soapFilter( array("istemplate" => 1) );
        } else {
            $_filter = $lanbilling->soapFilter( array("istemplate" => 0) );

            $device_id = (integer)$_POST["device_id"];

            if( $device_id == 0 ) {
                throw new Exception("Unknown device", -1);
            }

            $_filter["deviceid"] = $device_id;
        }

        if(false === ($result = $lanbilling->get("getPorts", array("flt" => $_filter , "md5" => $lanbilling->controlSum($_filter)), true))) {
            throw new Exception ($lanbilling->soapLastError()->detail);
        }

        if( !is_array($result) ) {
            $result = array($result);
        }

        $states_map = get_port_states_map($lanbilling);
        $now = time();
        $check_timestamp = create_function('$item, $now', '
            return ( $item->timestamp == 0) ? false : ( ($now - $item->timestamp) > $item->flush * FLUSH_MULTIPLIER ) ? false : true;
        ');

        if($templates) {
            if( !isset($_POST["for_grid"]) ) {
                $_tmp[] = array(
                    "id" => -1,
                    "name" => $localize->get("Choose")
                );
            }
        }

        if(!empty($result)) {
            foreach($result as $item) {
                if($check_timestamp($item, $now)) {
                    $status = ($states_map[$item->status]) ? $states_map[$item->status] : $states_map[0];
                } else {
                    $status = $states_map[0];
                }

                $A = array(
                    "id" => $item->portid,
                    "name" => $item->name,
                    "speed" => $item->speed,
                    "media" => $item->media,
                    "vlanid" => $item->vlanid,
                    "innervlan" => $item->innervlan,
                    "vlan" => (integer)$item->outervlan . ":" . (integer)$item->innervlan,
                    "outervlan" => $item->outervlan,
                    "prototype_id" => $item->prototypeid,
                    "vg_id" => $item->vgid,
                    "port_number" => $item->name,
                    "login" => $item->login,
                    "comment" => $item->comment,
                    "policy_id" => $item->policyid,
                    "status" => $status
                );

                if($item->treeitem) {
                    if( $item->deviceid == $item->treeitem->devtreeitem->deviceid ) {
                        $A = array_merge($A, array(
                            "connected_port_id" => $item->treeitem->devtreeitem->parentportid,
                            "connected_device_id" => $item->treeitem->devtreeitem->parentdeviceid,
                            "connected_port_name" => $item->treeitem->parentportname,
                            "connected_device_name" => $item->treeitem->parentdevicename,
                            "connected_device_is_parent" => 1
                        ));
                    }
                    elseif($item->deviceid == $item->treeitem->devtreeitem->parentdeviceid) {
                        $A = array_merge($A, array(
                            "connected_port_id" => $item->treeitem->devtreeitem->portid,
                            "connected_device_id" => $item->treeitem->devtreeitem->deviceid,
                            "connected_port_name" => $item->treeitem->portname,
                            "connected_device_name" => $item->treeitem->devicename,
                            "connected_device_is_parent" => 0
                        ));
                    }
                }

                array_push($_tmp, $A);
            }
        }
    }
    catch(Exception $error) {
        $_response = array(
            "success" => $error->getCode() == -1 ? true : false,
            "error" => $error->getCode() == -1 ? '' : $error->getMessage(),
            "results" => array()
        );
    }

    if(!$_response) {
        $_response = array(
            "success" => true,
            "results" => (array)$_tmp
        );
    }

    echo "(" . JEncode($_response, $lanbilling) . ")";
}


/**
 * Get devices list by filter
 * @param    object, billing class
 */
function get_devices( &$lanbilling, &$localize )
{
    try {
        $filter = array(
            "groups" => (integer)$_POST["group_id"],
            "vgid" => (integer)$_POST['vgid'],
            "istemplate" => 0,
            "pgsize" => ((integer)$_POST['limit'] <= 0) ? 100 : $_POST['limit']
        );

        $filter['pgnum'] = $lanbilling->linesAsPageNum($filter["pgsize"], (integer)$_POST['start'] + 1);

        if($filter['groups'] == -1) {
            $filter['istemplate'] = 1;
            unset($filter['groups']);
        }

        if((integer)$_POST['searchtype'] > 0) {
            if((integer)$_POST['searchtype'] == 1 || (integer)$_POST['searchtype'] == 2) {
                if(false === ($vg = $lanbilling->get("getVgroups", array("flt" => array(
                    "vgid" => (integer)$_POST['vgid']
                )), true)))
                {
                    throw new Exception ($lanbilling->soapLastError()->detail);
                }

                if(empty($vg) || !$vg->address->code) {
                    throw new Exception("", -1);
                }

                $filter["addresscode"] = prepare_address($vg->address->code, (integer)$_POST['searchtype'] == 2 ? 6 : 5);
            }
            else if((integer)$_POST['searchtype'] == 3) {
                $filter["ip"] = (string)$_POST['search'];
            }
            else if((integer)$_POST['searchtype'] == 4) {
                $filter["name"] = (string)$_POST['search'];
            }
            else if((integer)$_POST['searchtype'] == 5) {
                $filter["address"] = $_POST["search"];
            }
        }

        $_md5 = $lanbilling->controlSum($filter);

        if(false === ($result = $lanbilling->get("getDevices", array("flt" => $filter , "md5" => $_md5), true))) {
            throw new Exception ($lanbilling->soapLastError()->detail);
        }

        if(empty($result)) {
            throw new Exception ("", -1);
        }

        $_count = $lanbilling->get("Count", array("flt" => $filter, "procname" => "getDevices", "md5" => $_md5));

        if(!is_array($result)) {
            $result = array($result);
        }

        $_tmp = array();
        $now = time();

        foreach( $result as $item ) {
            if( $item->uptime == "" ) {
                // Unknown status
                $status = STATUS_UNKNOWN;
            } elseif( $item->uptime > 0 ) {
                $status = ($item->timestamp == 0) ? 0 : ( ($now - $item->timestamp) > $item->flush * FLUSH_MULTIPLIER) ? STATUS_UNKNOWN : STATUS_UP;
            } else {
                $status = ($item->timestamp == 0) ? 0 : ( ($now - $item->timestamp) > $item->flush * FLUSH_MULTIPLIER) ? STATUS_UNKNOWN : STATUS_DOWN;
            }

            $_tmp[] = array(
                "id" => $item->deviceid,
                "name" => $item->devicename,
                "dev_grp_id" => $filter['istemplate'] == 1 ? -1 : $filter['groups'],
                "prototype_id" => $item->prototypeid,
                "address" => $item->deviceaddr,
                "address_idx" => implode(",", array(
                    $item->countryid,
                    $item->regionid,
                    $item->areaid,
                    $item->cityid,
                    $item->settleid,
                    $item->streetid,
                    $item->buildingid,
                    $item->flatid,
					$item->entranceid,
					$item->floorid
                )),
                "ports_amount" => $item->portcnt,
                "status" => $status
            );
        }
    }
    catch(Exception $error) {
        $_response = array(
        "flt" => $filter,
            "success" => $error->getCode() == -1 ? true : false,
            "error" => $error->getCode() == -1 ? null : $error->getMessage(),
            "amount" => 0,
            "devices" => array()
        );
    }

    if(!$_response) {
        $_response = array(
        "flt" => $filter,
            "success" => true,
            "amount" => (integer)$_count,
            "devices" => (array)$_tmp
        );
    }

    echo "(" . JEncode($_response, $lanbilling) . ")";

    /*$group_id = ( isset($_POST["group_id"]) ) ? (integer)$_POST["group_id"] : 0;
    if( $group_id != -1 ) {
        $_filter = $lanbilling->soapFilter( array("pgsize" => (integer) $_POST["limit"], "pgnum" => $lanbilling->linesAsPageNum((integer) $_POST["limit"], (integer)$_POST ['start'] + 1), "istemplate" => 0) );
        $_filter["groups"] = $group_id;
        if( isset($_POST["search"]) ) {
            switch( (integer) $_POST["searchtype"] ) {
                case 0:    $_filter["address"] = prepare_address($_POST["search"]);

                        break;

                case 1: $_filter["name"] = htmlspecialchars($_POST["search"]);
                        break;
            }
        }
    } else {
            $_filter = $lanbilling->soapFilter( array("pgsize" => (integer) $_POST["limit"], "pgnum" => $lanbilling->linesAsPageNum((integer) $_POST["limit"], (integer) $_POST['start'] + 1), "istemplate" => 1) );
    }

    $_md5 = $lanbilling->controlSum($_filter);
    $result = $lanbilling->get("getDevices", array("flt" => $_filter , "md5" => $_md5), true);

    if( false === $result || empty($result) ) {
        echo "{amount: 0, devices: []}";
        return;
    }

    if( !is_array($result) ) {
        $result = array($result);
    }*/

    /*$d = array();
    $now = time();
    foreach( $result as $item ) {
        if( $item->uptime == "" ) {
            $status = STATUS_UNKNOWN; //unknown
        } elseif( $item->uptime > 0 ) {
            $status = ($item->timestamp == 0) ? 0 : ( ($now - $item->timestamp) > $item->flush * FLUSH_MULTIPLIER) ? STATUS_UNKNOWN : STATUS_UP;
        } else {
            $status = ($item->timestamp == 0) ? 0 : ( ($now - $item->timestamp) > $item->flush * FLUSH_MULTIPLIER) ? STATUS_UNKNOWN : STATUS_DOWN;
        }
        $ar = array(
                     "id" => $item->deviceid,
                     "name" => $item->devicename,
                     "dev_grp_id" => ($group_id) ? $group_id : '',
                     "prototype_id" => $item->prototypeid,
                     "address" => $item->deviceaddr,
                     "address_idx" => "{$item->countryid}, {$item->regionid}, {$item->areaid}, {$item->cityid}, {$item->settleid}, {$item->streetid}, {$item->buildingid}, {$item->flatid}",
                     "ports_amount" => $item->portcnt,
                     "status" => $status
                   );
        $d[] = $ar;
    }*/

    /*if( $group_id != -1 ) {
        $_filter = $lanbilling->soapFilter( array() );
        $_filter["groups"] = $group_id;
    } else {
        $_filter = $lanbilling->soapFilter( array("istemplate" => 1) );
    }

    $_md5 = $lanbilling->controlSum($_filter);
    $amount = $lanbilling->get("Count", array("flt" => $_filter, "procname" =>"getDevices", "md5" => $_md5), "getDevices");

    $response = array("amount" => $amount, "devices" => $d);
    $encoded = JEncode($response, $lanbilling);
    echo "$encoded";*/

}
//---------------------------------------------------------------------------
/**
 * Delete device
 * @param    object, billing class
 * @param    object, localize class
 */
function delete_device(&$lanbilling, &$localize) {

    if( false === $lanbilling->delete("delDevice", array("id" => (integer)$_POST["device_id"]), "getDevices") ) {
        echo ERROR_MSG;
    } else {
        echo SUCCESS_MSG;
    }

}
//---------------------------------------------------------------------------
/**
 * Get device groups
 * @param    object, billing class
 */
function get_device_groups(&$lanbilling, &$localize) {

    if( isset($_POST["clearList"]) ) {
        $clearList = true;
    }else{
        $clearList = false;
    }

    $_filter = $lanbilling->soapFilter( array() );
    if( isset($_POST["for_grid"]) ) {
         $_filter["groupid"] = (integer) $_POST["group_id"];
    }
    if( isset($_POST["device_id"]) ) {
        $_filter["deviceid"] = (integer) $_POST["device_id"];
    }

    $_md5 = $lanbilling->controlSum($_filter);
    $result = $lanbilling->get("getDeviceGroups", array("flt" => $_filter , "md5" => $_md5), true);

    $tpls = $localize->compile("<%@ Devices templates %>");
    $s = "{id: 0, text: '{$tpls}', leaf: true, group_id: -1}";
    $all = $localize->compile("<%@ All devices %>");
    $s .= ",{id: 0, text: '{$all}', leaf: true, group_id: 0}";

    if( false === $result || empty($result) ) {
        if( isset($_POST["for_grid"]) ) {
            echo "[]";
        } else {
            echo "[{$s}]";
        }
        return;
    }

    if( !is_array($result) ) {
        $result = array($result);
    }

    if( isset($_POST["for_grid"]) ) {
        $s = "";
        foreach( $result as $item ) {
            if( !empty($s) ) $s .= ",";
            if ($clearList)
                $s .= "['{$item->groupid}', '{$item->name}', '{$item->desc}', '0', '{$item->agentname}']";
            else
                $s .= "['{$item->groupid}', '{$item->name}', '{$item->desc}', '{$item->agentid}', '{$item->agentname}']";
        }
        echo "[{$s}]";
    } else {
        foreach( $result as $item ) {
                $s .= ",";
                $s .= "{ id: {$item->groupid}, text: '{$item->name}', leaf: true, group_id: {$item->groupid}}";
        }
        echo "[{$s}]";
    }


}
//---------------------------------------------------------------------------
/**
 * get snmp agent
 * @param    object, billing class
 */
function get_snmp_agent($lanbilling, $localize) {

    $result = $lanbilling->get("getAgentsExt");
     if( $result == false ) {
            echo "[]";
            return;
      }

    $first_option_name = $localize->compile("<%@ Choose %>");
    $s = "[0, '{$first_option_name}']";

    if( !is_array($result) ) {
        $result = array($result);
    }

     foreach( $result as $obj ) {
            if( $obj->agent->type == SNMP_AGENT_TYPE ) {
                    if( !empty($s) ) $s .= ",";
                    $s .= "['{$obj->agent->id}', '{$obj->agent->descr}']";
            }
        }

    echo "[$s]";

}
//---------------------------------------------------------------------------
/**
 * edit device group
 * @param    object, billing class
 * @param    object, localize class
 */
function edit_device_group($lanbilling, $localize) {
    if( isset($_POST["add_group"]) ) {
        $group = array(
            "groupid"   => (integer)($_POST["group_id"]),
            "name"      => htmlspecialchars($_POST["group_name"], ENT_QUOTES),
            "desc"      => htmlspecialchars($_POST["group_desc"], ENT_QUOTES),
            "agentid"   => empty( $_POST["agent_id"] ) ? 0 : (integer) $_POST["agent_id"]
        );

        if ( $lanbilling->save("insupdDeviceGroup", $group, ( (integer)$_POST["add_group"] == 1 ) ? true : false, "getDeviceGroups") )
        {
            $group_id = $lanbilling->saveReturns->ret;
            $encoded = JEncode($group_id, $lanbilling);
            echo $encoded;
        }
    }elseif( isset($_POST["remove_group"]) ) {
        $lanbilling->delete("delDeviceGroup", array("id" => $_POST["group_id"]), "getDeviceGroups");
    }

}
//---------------------------------------------------------------------------
/**
 * check if vg_id is bind to port
 * @param    object, billing class
 *
 */
function check_vgid (&$lanbilling) {

	if(isset($_POST["vg_id"]) && $_POST["vg_id"] > 0)  {	
		$_filter = $lanbilling->soapFilter( array("vgid" => (integer)$_POST["vg_id"], "pgnum" => 1, "pgsize" => 1) );
		$_md5 = $lanbilling->controlSum($_filter);
		$result = $lanbilling->get("getPorts", array("flt" => $_filter , "md5" => $_md5), true);
		$check_timestamp = create_function('$item, $now, $flush', 'return ( $item->timestamp == 0) ? false : ( ($now - $item->timestamp) > $flush) ? false : true;');
		$states_map = get_port_states_map($lanbilling);
	} else {
		echo '({error: "Vgid is undefined"})';
	}

    if( false != $result && !empty($result) ) {
        $device = $lanbilling->get("getDevice", array("id" => $result->deviceid), true);
        if( false != $device && !empty($device) ) {
            $now = time();
            $flush = $device->device->flush * FLUSH_MULTIPLIER;
            if( $device->device->uptime == "" ) {
                $device_status = STATUS_UNKNOWN;
            } elseif( $device->device->uptime > 0 ) {
                $device_status = ($device->device->timestamp == 0) ? 0 : ( ($now - $device->device->timestamp) > $flush) ? STATUS_UNKNOWN : STATUS_UP;
            } else {
                $device_status = ($device->device->timestamp == 0) ? 0 : ( ($now - $device->device->timestamp) > $flush) ? STATUS_UNKNOWN : STATUS_DOWN;
            }
            if( $check_timestamp($result, $now, $flush) ) {
                $port_status =  ( $states_map[$result->status] ) ?  $states_map[$result->status] : $states_map[0];
            } else {
                $port_status = $states_map[0];
            }
            $policy = get_policy_by_id($lanbilling, $result->policyid);
            $d = array();
            $d[] =  array(  "deviceid" => $result->deviceid,
                            "devicename" => $device->device->devicename,
                            "portid" => $result->portid,
                            "tpl" => $result->tpl,
                            "prototypeid" => $result->prototypeid,
                            "name" => $result->name,
                            "speed" => $result->speed,
                            "media" => $result->media,
                            "vlan" => (integer)$result->outervlan . ":" . (integer)$result->innervlan,
                            "vlanid" => (integer)$result->vlanid,
                            "comment" => $result->comment,
                            "policy_id" => $result->policyid,
                            "device_status" => $device_status,
                            "port_status" => $port_status,
                            "policy_name" => $policy->name,
                            "port_status_name" => ($port_status == STATUS_UNKNOWN) ? UNDEFINED : $states_map[$port_status]
                        );
                $response = array("found" => 1, "device" => $d);
                $encoded = JEncode($response, $lanbilling);
                echo $encoded;
        }
    }
    elseif( isset($_POST["for_sbss"]) ) {
        echo "({found: 0})";
    }

}
//---------------------------------------------------------------------------
/**
 * update port
 * @param    object, billing class
 *
 */
function update_port(&$lanbilling) {
	
    $port = array(    "portid" => (integer) $_POST["port_id"],
                    "deviceid" =>  (integer) $_POST["device_id"],
                    "vgid" =>  (integer) $_POST["vg_id"],
                    "tpl" => (integer) $_POST["tpl"],
                    "prototypeid" => (integer) $_POST["prototypeid"],
                    "name" => htmlspecialchars($_POST["name"], ENT_QUOTES),
                    "speed" => htmlspecialchars($_POST["speed"], ENT_QUOTES) ,
                    "media" => htmlspecialchars($_POST["media"], ENT_QUOTES),
                    "vlan" => (integer) $_POST["vlan"],
                    "vlanid" => (integer) $_POST["vlan_id"], 
                    "policyid" => (integer) $_POST["policy_id"],
                    "comment" => htmlspecialchars($_POST["comment"], ENT_QUOTES)
                );

    if( isset($_POST["old_port_id"]) ) {
        $ar = array(    "portid" => (integer) $_POST["old_port_id"],
                        "deviceid" => (integer) $_POST["old_device_id"],
                        "vgid" => 0,
                        "tpl" => (integer) $_POST["old_tpl"],
                        "prototypeid" => (integer) $_POST["old_prototypeid"],
                        "name" => htmlspecialchars($_POST["old_name"], ENT_QUOTES),
                        "speed" => htmlspecialchars($_POST["old_speed"], ENT_QUOTES),
                        "media" => htmlspecialchars($_POST["old_media"], ENT_QUOTES),
                        "vlan" => (integer) $_POST["old_vlan"],
                        "vlanid" => (integer) $_POST["old_vlan_id"], 
                        "policyid" => (integer) $_POST["old_policy_id"],
                        "comment" => htmlspecialchars($_POST["old_comment"], ENT_QUOTES)
                    );

        if( false != $lanbilling->save("insupdPort", $ar, false , "getPorts") ) {
                $lanbilling->save("insupdPort", $port, false , "getPorts");
        }

    } else {
        $lanbilling->save("insupdPort", $port, false , "getPorts");
    }

}

//---------------------------------------------------------------------------
/**
 * get accounts
 * @param    object, billing class
 *
 */
function get_accounts(&$lanbilling) {

    $_filter = $lanbilling->soapFilter( array("pgsize" => $_POST["limit"], "pgnum" => $lanbilling->linesAsPageNum($_POST["limit"], (integer)$_POST['start'] + 1), "istemplate" => 0) );

    if( isset($_POST["searchtype"]) && isset($_POST["search"]) ) {
        switch( (integer)$_POST["searchtype"] ) {
            case 0:     $_filter["name"] = htmlspecialchars($_POST["search"]);
                        break;

            case 1:     $_filter["agrmnum"] = htmlspecialchars($_POST["search"]);
                        break;

            case 2:     $_filter["login"] = htmlspecialchars($_POST["search"]);
                        break;

            case 3:        $_filter["addresscode"] = prepare_address($_POST["search"]);
                        break;

            default:     break;
        }
    }

    $_md5 = $lanbilling->controlSum($_filter);
    $result = $lanbilling->get("getVgroups", array("flt" => $_filter , "md5" => $_md5), true);

    if( false === $result || empty($result) ) {
        echo "{total: 0}";
        return;
    }

    if( !is_array($result) ) {
        $result = array($result);
    }

    $v = array();
    foreach( $result as $item ) {
        $ar = array(
                     "vgid" => $item->vgid,
                     "login" => $item->login,
                     "agrmnum" => $item->agrmnum,
                     "username" => $item->username,
                     "userid" => $item->uid,
                     "agentdescr" => $item->agentdescr,
                     "address" =>  join(" ", split(",", $item->address->address))
                   );
        $v[] = $ar;
    }

    $amount = $lanbilling->get("Count", array("flt" => $_filter, "procname" =>"getVgroups", "md5" => $_md5), "getVgroups");
    $response = array("total" => $amount, "results" => $v);
    $encoded = JEncode($response, $lanbilling);
    echo "$encoded";

}

//---------------------------------------------------------------------------
/**
 *
 * @param    object, billing class
 * @param    object, localize class
 */
function get_devices_for_tree(&$lanbilling, &$localize) {

    if( isset($_POST["node"]) && $_POST["node"] === "all" ) {

        $_filter = $lanbilling->soapFilter( array("istemplate" => 0) );
        $_md5 = $lanbilling->controlSum($_filter);
        $result = $lanbilling->get("getDevices", array("flt" => $_filter , "md5" => $_md5), true);

        $all_children = "";
        if( false != $result && !empty($result) ) {
            if( !is_array($result) ) {
                $result = array($result);
            }

            foreach( $result as $item ) {
                if( !empty($all_children) ) {
                    $all_children .= ",";
                }
                $addr = make_address($item->deviceaddr);
                $all_children .= "{deviceid: {$item->deviceid}, text: '{$item->devicename}', leaf: true, qtip: '{$addr}'}";
            }
        }
        echo "[$all_children]";

    } elseif( isset($_POST["node"]) && $_POST["node"] === "next" ) {

        $addresscode =  "";
        if( isset($_POST["vgid"]) ) {

            $_filter = $lanbilling->soapFilter( array("vgid" => (integer) $_POST["vgid"], "istemplate" => 0) );
            $_md5 = $lanbilling->controlSum($_filter);
            $result = $lanbilling->get("getVgroups", array("flt" => $_filter , "md5" => $_md5), true);
            if( isset($result->address) ) {
                $addresscode =  prepare_address($result->address->code);
            }

        } elseif( isset($_POST["addresscode"]) ) {
            $addresscode = prepare_address($_POST["addresscode"]);
        }

        $next_children = "";
        if( !empty($addresscode) ) {

            $_filter = $lanbilling->soapFilter( array("istemplate" => 0) );
            $_filter["addresscode"] =  $addresscode;
            $_md5 = $lanbilling->controlSum($_filter);
            $result = $lanbilling->get("getDevices", array("flt" => $_filter , "md5" => $_md5), true);

            if( false != $result && !empty($result) ) {
                if( !is_array($result) ) {
                    $result = array($result);
                }

                foreach( $result as $item ) {
                    if( isset($_POST["deviceid"]) && (integer) $_POST["deviceid"] == $item->deviceid) {
                        continue;
                    }
                    if( !empty($next_children) ) {
                        $next_children .= ",";
                    }
                    $addr = make_address($item->deviceaddr);
                    $next_children .= "{deviceid: {$item->deviceid}, text: '{$item->devicename}', leaf: true, qtip: '{$addr}'}";
                }
            }
        }
        echo "[$next_children]";

    } else {

        $next = $localize->compile("<%@ Next %>");
        $s = "{id: 'next', text: '{$next}', leaf: false}";
        $all = $localize->compile("<%@ All devices %>");
        $s .= ",{id: 'all', text: '{$all}', leaf: false}";
        echo "[$s]";

    }

}


/**
 * Prepare address code string for searching
 * @param    string, address code
 * @param   integer, item key to rest value from
 */
function prepare_address( $address, $key = 5 )
{
    $address = split(",", htmlspecialchars($address));

    array_walk($address, create_function('&$item, $key, $_tmp', '
       $item = trim($item);
       if($key > $_tmp[0]) {
           $item = 0;
       }
    '), array( $key ));

    $address = join(",", $address);

    return $address;
}

//---------------------------------------------------------------------------
/**
 * update device tree
 * @param    object, billing class
 *
 */
function update_device_tree(&$lanbilling) {

    if( isset($_POST["del_tree_item"]) ) {

        $val = array("deviceid" => (integer) $_POST["deviceid"], "portid" => (integer) $_POST["portid"], "parentdeviceid" => (integer) $_POST["parentdeviceid"], "parentportid" => (integer) $_POST["parentportid"]);
        if( false === $lanbilling->delete("delDeviceTreeItem", array("val" => $val), array("getPorts", "getDevices")) ) {
            $result = array(success => false);
        } else {
            $result = array(success => true);
        }
        $encoded = JEncode($result, $lanbilling);
        echo $encoded;
        return;
    }

    if( isset($_POST["insert_tree_item"]) ) {

        $val = array("deviceid" => (integer) $_POST["deviceid"], "portid" => (integer) $_POST["portid"], "parentdeviceid" => (integer) $_POST["parentdeviceid"], "parentportid" => (integer) $_POST["parentportid"]);
        if( false === $lanbilling->delete("insDeviceTreeItem", array("val" => $val), array("getPorts", "getDevices")) ) {
            $result = array(success => false, msg => ERROR_MSG);
        } else {
            $result = array(success => true, msg => SUCCESS_MSG);
        }
        $encoded = JEncode($result, $lanbilling);
        echo $encoded;
        return;
    }
}
//---------------------------------------------------------------------------
/**
 * Get control policy list
 * @param    object, billing class
 */
function get_policy(&$lanbilling, &$localize) {

    $_filter = $lanbilling->soapFilter( array() );
    $_md5 = $lanbilling->controlSum($_filter);
    $result = $lanbilling->get("getPortPolicies", array("flt" => $_filter , "md5" => $_md5), true);

    if( false === $result || empty($result) ) {
        echo "[]";
        return;
    }

    if( !is_array($result) ) {
        $result = array($result);
    }

    if ( isset($_POST["get_policy"]) ) {
        $first_option_name = $localize->compile("<%@ Choose %>");
        $s = "[0, '{$first_option_name}']";
    }

    foreach( $result as $item ) {
        if( !empty($s) ) $s .= ",";
        $script = preg_replace('/\'/', "\\'", $item->script);
        $script = preg_replace('/\"/', '\\"', $script);
        $script = preg_replace('/\r\n|\n/', "<br>", $script);
        $desc =  preg_replace("/[^a-zа-я0-9\s]/ui", "", $item->desc);
        $name =  preg_replace("/[^a-zа-я0-9\s]/ui", "", $item->name);
        $s .= "['{$item->policyid}', '{$name}', '{$desc}', '{$script}']";
    }

    echo "[{$s}]";
}
//---------------------------------------------------------------------------
/**
 * Delete policy
 * @param    object, billing class
 * @param    object, localize class
 */
function delete_policy(&$lanbilling, &$localize) {

    if( false === $lanbilling->delete("delPortPoliciy", array("id" => (integer)$_POST["policy_id"]), "getPortPolicies") ) {
        echo ERROR_MSG;
    } else {
        echo SUCCESS_MSG;
    }

}
//---------------------------------------------------------------------------
/**
 * Get port states
 * @param    object, billing class
 */
function get_port_states(&$lanbilling) {

    $_filter = $lanbilling->soapFilter( array() );
    $_md5 = $lanbilling->controlSum($_filter);
    $result = $lanbilling->get("getPortStates", array("flt" => $_filter , "md5" => $_md5), true);

    if( false === $result || empty($result) ) {
        echo "[]";
        return;
    }

    if( !is_array($result) ) {
        $result = array($result);
    }

    foreach( $result as $item ) {
        if( !empty($s) ) $s .= ",";
        $s .= "['{$item->stateid}', '{$item->name}', '{$item->desc}', '{$item->icon}']";
    }

    echo "[{$s}]";
}
//---------------------------------------------------------------------------
/**
 * Get port states as map
 * @param    object, billing class
 */
function get_port_states_map(&$lanbilling) {

    $_filter = $lanbilling->soapFilter( array() );
    $_md5 = $lanbilling->controlSum($_filter);
    $result = $lanbilling->get("getPortStates", array("flt" => $_filter , "md5" => $_md5), true);
     $states_map = array();

   if( false === $result || empty($result) ) {
        return $states_map;
    }

    if( !is_array($result) ) {
        $result = array($result);
    }

    foreach( $result as $obj ) {
        $states_map[$obj->stateid] = $obj->icon;
        $states_map[$obj->icon] = $obj->name;
    }

    return $states_map;

}
//---------------------------------------------------------------------------
/**
 * Delete port state
 * @param    object, billing class
 * @param    object, localize class
 */
function delete_port_state(&$lanbilling, &$localize) {

    if( false === $lanbilling->delete("delPortState", array("id" => (integer)$_POST["state_id"]), "getPortStates") ) {
        echo ERROR_MSG;
    } else {
        echo SUCCESS_MSG;
    }

}
//---------------------------------------------------------------------------
/**
 * Save control policies
 * @param    object, billing class
 * @param    object, localize class
 */
function save_policies(&$lanbilling, &$localize) {
     $success = true;
    foreach( $_POST["policies"] as $row ) {
        if( empty($row) )
            continue;
        $p = explode(',',$row,4);
        $ar = array(
            "policyid" => ($p[0]) ? (integer) $p[0] : 0,
            "name"     => $p[1],
            "desc"     => $p[2],
            "script"   => $p[3],
        );
        if( false === $lanbilling->save("insupdPortPolicy", $ar, ($p[0]) ? false : true , "getPortPolicies") ) {
            $success = false;
            break;
        }
    }
    if( $success ) {
        echo SUCCESS_MSG;
    } else {
        echo ERROR_MSG;
    }

}
//---------------------------------------------------------------------------
/**
 * Save port states
 * @param    object, billing class
 * @param    object, localize class
 */
function save_port_states(&$lanbilling, &$localize) {

     $success = true;

    foreach( $_POST["states"] as $row ) {
        if( empty($row) )
            continue;
        $p = split(",", htmlspecialchars($row) );
        $ar = array("stateid" => ( is_numeric($p[0]) ) ? (integer) $p[0] : 0,
                    "name" => htmlspecialchars($p[1], ENT_QUOTES),
                    "desc" => htmlspecialchars($p[2], ENT_QUOTES),
                    "icon" => htmlspecialchars($p[3], ENT_QUOTES),

                    );
        if( false === $lanbilling->save("insupdPortState", $ar, ( is_numeric($p[0]) ) ? false : true , "getPortStates") ) {
                $success = false;
                break;
            }
    }

    if( $success ) {
        echo SUCCESS_MSG;
    } else {
        echo ERROR_MSG;
    }

}
//---------------------------------------------------------------------------
/**
 * get device segments
 * @param    object, billing class
 *
 */
function get_device_segments (&$lanbilling) {

    if (!isset($_POST["vg_id"]) || $_POST["vg_id"] == 0){
        echo "{'success': true}";
        return;
    }

    $_filter = $lanbilling->soapFilter( array("vgid" => (integer)$_POST["vg_id"]) );
    $_md5 = $lanbilling->controlSum($_filter);
    $result = $lanbilling->get("getPorts", array("flt" => $_filter , "md5" => $_md5), true);
    $segments = array();

    if( false != $result && !empty($result) ) {

        $device = $lanbilling->get("getDevice", array("id" => $result->deviceid), true);
        if( isset($device->options) ) {

            if( !is_array($device->options) ) {
                $o = array($device->options);
            }
            else {
                $o = $device->options;
            }

            foreach( $o as $opt ) {
                if( $opt->name == "Segment" ) {
                    $s = split("/", $opt->value);
                    $ar = array( "segment"    =>     $s[0],
                                 "mask"        =>    $s[1]
                                );
                    $segments[] = $ar;
                }
            }
        }
    }

    $response = array("results" => $segments);
    $encoded = JEncode($response, $lanbilling);
    echo "$encoded";

}
//---------------------------------------------------------------------------
/**
 * Get control policy bu id
 * @param    object, billing class
 * @param    integer, policy id
 */
function get_policy_by_id(&$lanbilling, $id) {

    $_filter = $lanbilling->soapFilter( array("recordid" => $id) );
    $_md5 = $lanbilling->controlSum($_filter);
    $result = $lanbilling->get("getPortPolicies", array("flt" => $_filter , "md5" => $_md5), true);

    if( false === $result || empty($result) ) {
        return (object) null;
    }

    return $result;

}
//---------------------------------------------------------------------------
/**
 * Get icons from directotry
 *
 */
function get_icons($path = ICONS_DIR) {

    $icons = array();
    if ($handle = opendir($path)) {
        while (false !== ($file = readdir($handle))) {
            if( preg_match("/\w+\.\w+/", $file) ) {
                $icons[] = "{icon:'".ICONS_DIR."/{$file}'}";
            }
        }
        closedir($handle);
        $icons = implode(",", $icons);
        return $icons;
    }
    else {
        return "";
    }

}
//---------------------------------------------------------------------------
/**
 * get device segments
 * @param    object, billing class
 *
 */
function get_devices_list($lanbilling) {

    $_filter = $lanbilling->soapFilter( array("pgsize" => (integer) $_POST["limit"], "pgnum" => $lanbilling->linesAsPageNum((integer) $_POST["limit"], (integer)$_POST ['start'] + 1), "istemplate" => 0) );
    if( isset($_POST["deviceid"]) && $_POST["deviceid"] > 0 ) {
        $_filter["parentid"] = (integer) $_POST["deviceid"];
    }

    $_md5 = $lanbilling->controlSum($_filter);
    $result = $lanbilling->get("getDevices", array("flt" => $_filter , "md5" => $_md5), true);


    if( false === $result || empty($result) ) {
        echo "{'success': false; amount: 0}";
        return;
    }

    if( !is_array($result) ) {
        $result = array($result);
    }

    $d = array();
    $now = time();
    $id = ( isset($_POST["deviceid"]) && $_POST["deviceid"] > 0 ) ? rand((integer)$_POST["anode"], 1000) : (integer)$_POST ['start'] + 1;
    foreach( $result as $item ) {
        if( $item->uptime == "" ) {
            $status = STATUS_UNKNOWN; //unknown
        } elseif( $item->uptime > 0 ) {
            $status = ($item->timestamp == 0) ? 0 : ( ($now - $item->timestamp) > $item->flush * FLUSH_MULTIPLIER) ? STATUS_UNKNOWN : STATUS_UP;
        } else {
            $status = ($item->timestamp == 0) ? 0 : ( ($now - $item->timestamp) > $item->flush * FLUSH_MULTIPLIER) ? STATUS_UNKNOWN : STATUS_DOWN;
        }
        $ar = array(
                     "_id" =>  $id,
                     "deviceid" => $item->deviceid,
                     "devicename" => $item->devicename,
                     "status" => $status,
                     "uptime" => $item->uptime,
                     "deviceaddr" => make_address($item->deviceaddr),
                     "_parent" => ( isset($_POST["deviceid"]) && $_POST["deviceid"] > 0 ) ? (integer)$_POST["anode"] : null,
                     "_is_leaf" => ($item->haschild) ? false : true
                   );
        $d[] = $ar;
        ++$id;
    }

    $_md5 = $lanbilling->controlSum($_filter);
    $amount = $lanbilling->get("Count", array("flt" => $_filter, "procname" =>"getDevices", "md5" => $_md5), "getDevices");

    $response = array("success" => "true", "amount" => $amount, "data" => $d);
    $encoded = JEncode($response, $lanbilling);
    echo "$encoded";

}



function getDevGroups($lanbilling) {
    $_filter = $lanbilling->soapFilter( array("pgsize" => (integer) $_POST["limit"], "pgnum" => $lanbilling->linesAsPageNum((integer) $_POST["limit"], (integer)$_POST ['start'] + 1), "istemplate" => 0) );
    $result = $lanbilling->get("getDeviceGroups", array("flt" => $_filter), true);

    if( !is_array($result) ) {
        $result = array($result);
    }

    $response = array("success" => "true", "data" => $result);
    $encoded = JEncode($response, $lanbilling);
    echo "$encoded";
}

/**
 * make_address
 * @param    string
 *
 */
function make_address($addr_str) {
    $addr = join(" ",  explode(",", $addr_str));
     return $addr;
}

// -------------- DevGroupOpt -------------------------
// SHOW
function showDevGroupOptVals( &$lanbilling )
{
    if(!isset($_POST['group_id'])) {
        echo "({ success: false, errors: { reason: 'Unknown group ID' } })";
        return false;
    } elseif (empty($_POST['group_id'])) {
        $_POST['group_id'] = (integer)0;
    }

    $_filter = $lanbilling->soapFilter( array() );
    $_filter["groupid"] = (integer) $_POST["group_id"];

    $result_vals = array();
    if ( $_filter["groupid"] ) { // 0 - if create_group button pressed
        $_md5 = $lanbilling->controlSum($_filter);
        $result_vals    = $lanbilling->get("getDevGroupOptVals" , array("flt" => $_filter , "md5" => $_md5), true);
    }

    $result_set   = $lanbilling->get("getDevGroupOptSet"  , true);
    $result_staff = $lanbilling->get("getDevGroupOptStaff", true);

    if(!is_array($result_vals) ) {
        $result_vals = array($result_vals);
    }
    if(!is_array($result_set)) {
        $result_set = array($result_set);
    }
    if(!is_array($result_staff)) {
        $result_staff = array($result_staff);
    }


    $_tmp = array();
    foreach($result_set as $set_row) {
        $intvalue   = 0;
        $value      = array();
        foreach($result_vals as $val_row) {
            if ($val_row->name == $set_row->name) {
                $intvalue = (integer)$val_row->intvalue;
                if ( (integer)$set_row->type == 0) {
                    $value[] = array('id' => 0, 'value' => $val_row->value);
                }
                break;
            }
        }
        if ((integer)$set_row->type > 0) {
            foreach($result_staff as $staff_row) {
                if ($staff_row->name == $set_row->name) {
                    $idx = (integer)$staff_row->idx;
                    // если не нашли индекс в SET берём первый индекс ( не обязательно 0) для данной опции
                    if ( $intvalue == 0 && count($value) == 0 ) { // idx - начинается с 1
                        $intvalue = $idx; // если индекс не задан в опциях
                    }
                    $value[] = array('id' => $idx, 'value' => $staff_row->value);
                }
            }
        } else {
            if ( count($value) == 0 ) { // если поле текстовое и оно не установлено
                $value[] = array('id' => 0, 'value' => "");
            }
        }
        $_tmp[] = array('name'      => $set_row->name,
                        'descr'     => $set_row->descr,
                        'type'      => (integer)$set_row->type,
                        'intvalue'  => $intvalue,
                        'value'     => $value);
    }

    if(sizeof($_tmp) > 0) {
        echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
    }
    else {
        echo "({ results: '' })";
    }
}

// SAVE
function saveDevGroupOptVals(&$lanbilling, &$localize)
{
    if(!isset($_POST['group_id']) || empty($_POST['group_id'])) {
        echo "({ success: false, errors: { reason: 'Unknown group ID' } })";
        return false;
    }

    $group_id=(integer)$_POST["group_id"];
    $options = JDecode($lanbilling, $_POST["dev_group_options"]);
    $result  = false;
    if (!is_array($options)) {
        $options = array($options);
    }
    foreach( $options as $option ) {
        $data = array("devicegroupid" => $group_id, "name" => $option->name, "value" => $option->param_value);
        $result = $lanbilling->save("insupdDevGroupOptVals" , $data, false);
        if( !$result ) {
            break;
        }
    }

    $msg = ($result) ? SUCCESS_MSG : ERROR_MSG;
    if (!count($options)) {
        $msg  = EMPTY_SEL;
    }
    echo "$msg";
}
//end vals

// --------------- SET --------------------------------------------------
// SHOW
function showDevGroupOptSet( &$lanbilling )
{
    $_tmp = array();

    if( false != ($result = $lanbilling->get("getDevGroupOptSet")) )
    {
        if(!is_array($result)) {
            $result = array($result);
        }

        foreach($result as $row) {
            $_tmp[] = array('name'  => $row->name,
                            'descr' => $row->descr,
                            'type'  => (integer)$row->type);
        }
    }

    if(sizeof($_tmp) > 0) {
        echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
    }
    else {
        echo "({ results: '' })";
    }
}

// DELETE
function delDevGroupOptSet( &$lanbilling )
{
    if(empty($_POST['del_dev_group_opt_set'])) {
        echo "({ success: false, errors: { reason: 'Unknown field name' } })";
        return false;
    }

    if( false == $lanbilling->delete(
                "delDevGroupOptSet", array("name" => $_POST['del_dev_group_opt_set']), array("delDevGroupOptSet")) )
    {
        $error = $lanbilling->soapLastError();
        echo "({ success: false, errors: { reason: 'There was an error while removing field: " .
                                                    $error->detail . ". Look server logs for details' } })";
    }
    else echo "({ success: true })";
}

// SAVE / DELETE_staff
function saveDevGroupOptSet( &$lanbilling )
{
    if(empty($_POST['save_dev_group_opt_set'])) {
        echo "({ success: false, errors: { reason: 'Unknown field name' } })";
        return false;
    }

    $opt_name = $_POST['save_dev_group_opt_set'];

    $set = array(
        "type"  => (integer)$_POST['type'],
        "name"  => $opt_name,
        "descr" => $_POST['descr']
    );

    if( false == $lanbilling->save("insupdDevGroupOptSet", $set) )
    {
        $error = $lanbilling->soapLastError();
        echo "({ success: false, errors: { reason: 'There was an error while saving field: " .
                                                $error->detail . ". Look server logs for details' } })";
        return false;
    }

    $staff_array = array();
    if(isset($_POST['newstaff']) && sizeof($_POST['newstaff']) > 0)
    {
        foreach($_POST['newstaff'] as $item)
        {
            $staff_array[] = array(
                "idx"   => 0,
                "value" => $item,
                "name"  => $opt_name
            );
        }
    }
    if(isset($_POST['staff']) && sizeof($_POST['staff']) > 0)
    {
        foreach($_POST['staff'] as $key => $item)
        {
            $staff_array[] = array(
                "idx"   => $key,
                "value" => $item,
                "name"  => $opt_name
            );
        }
    }

    if (count($staff_array)) {

        if( false == $lanbilling->save("insupdDevGroupOptStaff", array("vals" => $staff_array)) )
        {
            $error = $lanbilling->soapLastError();
            echo "({ success: false, errors: { reason: 'There was an error while saving field: " .
                                                    $error->detail . ". Look server logs for details' } })";
            return false;
        }

    }

    $del_staff = array();
    if(isset($_POST['delstaff']) && sizeof($_POST['delstaff']) > 0)
    {
        foreach($_POST['delstaff'] as $key => $item)
        {
            $del_staff[] = array(
                "idx"   => $key,
                "value" => $item,
                "name"  => $opt_name
            );
        }

        if( false == $lanbilling->delete("delDevGroupOptStaff", array("deletedstaff" => $del_staff)))
        {
            $error = $lanbilling->soapLastError();
            echo "({ success: false, errors: { reason: 'There was an error while removing field: " .
                                                    $error->detail . ". Look server logs for details' } })";
            return false;
        }
    }
    else echo "({ success: true })";
}
// end set

// ------------------- STAFF --------------------------------------------------
// SHOW
function showDevGroupOptStaff( &$lanbilling )
{
    $_filter = $lanbilling->soapFilter( array() );
    if( isset($_POST["show_dev_group_opt_staff"]) ) {
         $_filter["name"] = $_POST["show_dev_group_opt_staff"];
    }
    $_md5 = $lanbilling->controlSum($_filter);

    $result = $lanbilling->get("getDevGroupOptStaff" , array("flt" => $_filter , "md5" => $_md5), true);

    $_tmp = array();
    if( false != $result)
    {
        if(!is_array($result)) {
            $result = array($result);
        }

        foreach($result as $row) {
            $_tmp[] = array('name'  => $row->name,
                            'value' => $row->value,
                            'idx'   => (integer)$row->idx);
        }
    }

    if(sizeof($_tmp) > 0) {
        echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
    }
    else {
        echo "({ results: '' })";
    }
}

/**
 * Get agents list and resturn only radius type
 * @param   object, main billing class
 */
function get_radius_modules( &$lanbilling )
{
    if(false == ($result = $lanbilling->get("getAgents", array(), true))) {
        $response = array(
            "success" => true,
            "resutls" => array()
        );
    }
    else {
        if( !is_array($result) ) {
            $result = array($result);
        }

        foreach($result as $key => $item) {
            if($item->data != 6 && $item->data != 12) {
                unset($result[$key]);
            }
        }

        $response = array(
            "success" => true,
            "results" => array_values($result)
        );
    }

    echo JEncode($response, $lanbilling);
} // end get_radius_modules()


/**
 * Get data about device and determine if device is NAS
 * @param   object, main billing class
 */
function get_device_nas( &$lanbilling )
{
    $result = $lanbilling->get("getDevice", array("id" => (integer)$_POST["deviceid"]), true);

    if( false === $result || empty($result) ) {
        echo "{'success':" . ($result === false) ? "false" : "true" . "; data:null}";
        return;
    }

    if( !is_array($result) ) {
        $result = array($result);
    }

    if(isset($result[0]->rnas)) {
        $response = array(
            "success" => true,
            "data" => array(
                "rnas" => 1,
                "moduelid" => $result[0]->rnas->id,
                "agentname" => $result[0]->rnas->agentname,
                "rsharedsec" => $result[0]->rnas->rsharedsec
            )
        );
    }
    else {
        $response = array(
            "success" => true,
            "data" => null
        );
    }

    echo JEncode($response, $lanbilling);
}

function getFilteredDeviceIds(&$lanbilling, &$localize){

    $ar=array();
    $_filter=array();
    if ($_POST['field']=='name'){
        $_filter['name']=$_POST['value'];
    }

    $row = $lanbilling->get("getDevices", array("flt" => $_filter , "md5" => $_md5), true);
    if (!$row) {
        echo '[]';
        return false;
    }
    if (!is_array($row)) $row=array($row);
    foreach($row as $item){
        if ($_POST['field']=='All') $ar[]=$item->deviceid;
        elseif ($_POST['field']=='name') {

            if ($item->devicename==$_POST['value']) $ar[]=$item->deviceid;
        }
        else {

            $device = $lanbilling->get("getDevice", array("id" => (integer) $item->deviceid), true);
            if (is_array($device->options)){
                foreach($device->options as $do){
                    if (($do->name==$_POST['field'] && $do->value==$_POST['value'])){
                        $ar[]=$item->deviceid;
                    }
                }
            }
        }
    }

    echo JEncode($ar, $lanbilling);

    return true;
}
// end $lanbilling




/**
 * update port
 * @param    object, billing class
 *
 */
function removePortFromVgid(&$lanbilling) {
	$_filter = array(
		"vgid" => $_POST['vgid']
	);
	$result = $lanbilling->get("getPorts", array("flt" => $_filter));
	if( !is_array($result) ) {
		$result = array($result);
	}
	
	$port = array(	"portid" => (integer)$result[0]->portid,
					"deviceid" =>  (integer)$result[0]->deviceid,
					"vgid" => 0,
					"tpl" => (integer)$result[0]->tpl,
					"prototypeid" => (integer)$result[0]->prototypeid,
					"name" => htmlspecialchars($result[0]->name, ENT_QUOTES),
					"speed" => htmlspecialchars($result[0]->speed, ENT_QUOTES) ,
					"media" => htmlspecialchars($result[0]->media, ENT_QUOTES),
					"vlanid" => (integer)$result[0]->vlanid, 
					"policyid" => (integer)$result[0]->policyid,
					"comment" => htmlspecialchars($result[0]->comment, ENT_QUOTES)
				);
		$lanbilling->save("insupdPort", $port, false , "getPorts");
		if(!$_response) {
			$_response = array(
				"success" => true,
				"callback" => 1
			);
		}

		echo JEncode($_response, $lanbilling);
}
