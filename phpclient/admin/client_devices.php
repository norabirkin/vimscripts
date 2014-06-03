<?php
/**
 * @file Client devices control
 */

// There is background query
if(isset($_POST['async_call']))
{
    if(isset($_POST['getsmcards'])) {
        getSmartCards($lanbilling);
    }

    if(isset($_POST['getcldevices'])) {
        getClientDevices($lanbilling, $localize);
    }

    if(isset($_POST['setsmcard'])) {
        setSmartCard($lanbilling, $localize);
    }
    
    if(isset($_POST['getequipmenthistory'])) {
        getEquipmentHistory($lanbilling, $localize);
    }

    if(isset($_POST['setclientdevice'])) {
        setDevice($lanbilling, $localize);
    }

    if(isset($_POST['removeclidevs'])) {
        removeClientDevices($lanbilling, $localize);
    }

    if(isset($_POST['removesmcards'])) {
        removeSmartCard($lanbilling, $localize);
    }

    if(isset($_POST['getmodels'])) {
        getModels($lanbilling);
    }

    if(isset($_POST['setmodel'])) {
        setModel($lanbilling, $localize);
    }

    if(isset($_POST['delmodel'])) {
        removeModel($lanbilling, $localize);
    }

    if(isset($_POST['getmodeltypes'])) {
        getModelTypes($lanbilling);
    }

    if(isset($_POST['assigndevs'])) {
        assignDevices($lanbilling, $localize);
    }

    if(isset($_POST['getvgsmartcard'])) {
        getVgSmartItem($lanbilling, $localize);
    }

    if(isset($_POST['setfromfile'])) {
        setDataFromFile($lanbilling, $localize);
    }

    if(isset($_POST['getsmartstatus'])) {
        getSmartStatus($lanbilling, $localize);
    }
    
    if(isset($_POST['checkcomplect'])) {
        getComplectData($lanbilling, $localize);
    }
    
    if(isset($_POST['activatesmcard'])) {
        activateSmartCard($lanbilling, $localize);
    }
	
    if(isset($_POST['setagrmequip'])) {
        setAgrmEquipment($lanbilling, $localize);
    }
	
    if(isset($_POST['setvgequip'])) {
        setVgEquipment($lanbilling, $localize);
    }
	
    if(isset($_POST['setcardequip'])) {
        setCardEquipment($lanbilling, $localize);
    }
	
    if(isset($_POST['setvgcard'])) {
        setVgSmartCard($lanbilling, $localize);
    }
	
    if(isset($_POST['replacesmartcard'])) {
       	replaceSmartCard($lanbilling, $localize);
    }
	
    if(isset($_POST['unlinkdevice'])) {
        setAgrmEquipment($lanbilling, $localize);
    }
    
    if(isset($_POST['resetpin'])) {
    	resetSmartcardPin($lanbilling, $localize);
    }
	
}
// There is standard query
else
{
    $tpl = new HTML_Template_IT(TPLS_PATH);
    $tpl->loadTemplatefile("client_devices.tpl", true, true);
    $tpl->touchBlock("__global__");

    $localize->compile($tpl->get(), true);
}


/**
 * Get smart cards
 * @param   object, main class
 */
function getSmartCards( &$lanbilling ) {
	
    $_tmp = array();

    try {
        $filter = array(
            "fullsearch" => (string)$_POST['fullsearch'],
            "pgsize" => ((integer)$_POST['limit'] <= 0) ? 100 : $_POST['limit'],
        );
		
		if((integer)$_POST['cardserial'] > 0) {
            $filter["serial"] = (integer)$_POST['cardserial'];
        }

        $filter['pgnum'] = $lanbilling->linesAsPageNum($filter['pgsize'], (integer)$_POST['start'] + 1);

        if( false === ($result = $lanbilling->get("getSmartCards", array("flt" => $filter))) )
        {
            throw new Exception ($lanbilling->soapLastError()->detail);
        }

        if($result) {
            if(!is_array($result)) {
                $result = array($result);
            }

            $_md5 = $lanbilling->controlSum($filter);
            $count = $lanbilling->get("Count", array("flt" => $filter, "procname" => "getSmartCards", "md5" => $_md5));

            array_walk($result, create_function('$item, $key, $_tmp', '
                $_tmp[0][] = array(
                    "id" => $item->smartcard->cardid,
                    "name" => $item->smartcard->name,
                    "descr" => $item->smartcard->descr,
                    "serial" => $item->smartcard->serial,
                    "vgid" => $item->smartcard->vgid,
                    "vglogin" => $item->vglogin,
                    "garantee" => $item->smartcard->garantee
                );
            '), array( &$_tmp ));
        }
    }
    catch(Exception $error) {
        $_response = array(
            "results" => $_tmp,
            "total" => 0,
            "success" => false,
            "error" => $error->getMessage()
        );
    }

    if(!$_response) {
        $_response = array(
            "results" => $_tmp,
            "total" => (integer)$count,
            "success" => true,
            "error" => null
        );
    }

    echo "(" . JEncode($_response, $lanbilling) . ")";
} // end getSmartCards()


/**
 * Get smart card one item
 */
function getVgSmartItem( &$lanbilling, &$localize )
{
    $_tmp = array(
        "id" => 0,
        "name" => null,
        "descr" => null,
        "serial" => null,
        "vgid" => 0,
        "vglogin" => null,
        "serviceid" => null,
        "servicename" => null,
        "status" => null,
        "message" => $localize->get("Unknown")
    );

    try {
        $filter = array(
            "pgsize" => 1,
            "pgnum" => 0,
            "vgid" => (integer)$_POST['vgid']
        );

        if( false === ($result = $lanbilling->get("getSmartCards", array("flt" => $filter, "md5" => $lanbilling->controlSum($filter)))) ) {
            throw new Exception ($lanbilling->soapLastError()->detail);
        }

        if($result) {
            if(!is_array($result)) {
                $result = array($result);
            }

            $_tmp["id"] = $result[0]->smartcard->cardid;
            $_tmp["name"] = $result[0]->smartcard->name;
            $_tmp["descr"] = $result[0]->smartcard->descr;
            $_tmp["serial"] = $result[0]->smartcard->serial;
            $_tmp["vgid"] = $result[0]->smartcard->vgid;
            $_tmp["vglogin"] = $result[0]->vglogin;

            if($result[0]->smartcard->status != 2) {
                $_tmp["status"] = $result[0]->smartcard->status;
                $_tmp["message"] = $result[0]->smartcard->status == 0 && empty($result[0]->smartcard->message) ?
                    $localize->get("Ok") : $result[0]->smartcard->message;
            }

            $filter = array(
                "parentid" => $result[0]->smartcard->cardid,
                "pgsize" => 100,
                "pgnum" => 1
            );

            if( false === ($devs = $lanbilling->get("getEquipment", array("flt" => $filter, "md5" => $lanbilling->controlSum($filter)))) ) {
                throw new Exception ("Impossible to count qeuipment: " . $lanbilling->soapLastError()->detail);
            }

            if(!empty($devs) && !is_array($devs)) {
                $devs = array($devs);
            }

            if(($lim = (integer)$lanbilling->Option('smartcard_eqip_max')) > 0 && $lim <= count($devs)) {
                $exceeded = true;
            }
            
            
            if($tag = (string)$lanbilling->Option('smartcard_usbox_tag')) {
                // Looking for USBox service
                $filter = array(
					//"servid" =>
                    "dtfrom" => date('Y-m-d H:i:s'),
                    "common" => 1,
                    "category" => -1,
                    "vgid" => $_tmp["vgid"],
                    "uuid" => $tag,
                    "pgsize" => 1,
                    "pgnum" => 1
                );

                if( false != ($result = $lanbilling->get("getUsboxServices", array("flt" => $filter, "md5" => $lanbilling->controlSum($filter)))) ) {
                    if(!is_array($result)) {
                        $result = array($result);
                    }

                    $_tmp["serviceid"] = $result[0]->service->servid;
                    $_tmp["servicename"] = $result[0]->catdescr;
                }
            }
        }

        if((integer)$_tmp["vgid"] == 0) {
            $_tmp["vgid"] = (integer)$_POST['vgid'];
        }

        if((integer)$_tmp["serviceid"] == 0) {
            $_tmp["servicename"] = $localize->get("Undefined-o");
        }
    }
    catch(Exception $error) {
        $_response = array(
            "data" => null,
            "success" => false,
            "error" => $error->getMessage()
        );
    }

    if(!$_response) {
        $_response = array(
            "data" => $_tmp,
            "exceeded" => (boolean)$exceeded,
            "success" => true,
            "error" => null
        );
    }

    echo "(" . JEncode($_response, $lanbilling) . ")";
} // end getVgSmartItem()

function getClientDeviceService( &$lanbilling, $equipment ) {
    $noService = array(
        'catdescr' => ''
    );
    if (!$equipment->equipment->servid) {
        return $noService;
    }
    if (!($services = $lanbilling->get('getUsboxServices', array(
        'flt' => array(
            'agrmid' => $equipment->equipment->agrmid
        )
    )))) {
        $services = array();
    }
    if (!is_array($services)) {
        $services = array($services);
    }
    foreach ($services as $service) {
        if ($service->service->servid == $equipment->equipment->servid) {
            return array(
                'catdescr' => $service->catdescr
            );
        }
    }
    return $noService;
}

/**
 * Get devices list
 * @param   object, main class
 */
function getClientDevices( &$lanbilling, &$localize ) {
	
    $_tmp = array();

    try {
        $filter = array(
            "fullsearch" => (string)$_POST['fullsearch'],
            "pgsize" => ((integer)$_POST['limit'] <= 0) ? 100 : $_POST['limit']
        );

        if((integer)$_POST['agrmid'] > 0 && (integer)$_POST['singlecards'] != 1) {
           $filter["agrmid"] = (integer)$_POST['agrmid'];
        }
        
        if((integer)$_POST['vgid'] > 0) {
        	$filter["vgid"] = (integer)$_POST['vgid'];
        }

        if((integer)$_POST['cardid'] > 0) {
            $filter["parentid"] = (integer)$_POST['cardid'];
        }
		
		if((integer)$_POST['equipserial'] > 0) {
            $filter["serial"] = (integer)$_POST['equipserial'];
        }

        $filter['pgnum'] = $lanbilling->linesAsPageNum($filter['pgsize'], (integer)$_POST['start'] + 1);
	
        if( false === ($result = $lanbilling->get("getEquipment", array("flt" => $filter))) )
        {
            throw new Exception ($localize->get($lanbilling->soapLastError()->detail));
        }

        if($result) {
            if(!is_array($result)) {
                $result = array($result);
            }

            $_md5 = $lanbilling->controlSum($filter);
            $count = $lanbilling->get("Count", array("flt" => $filter, "procname" => "getEquipment", "md5" => $_md5));

            array_walk($result, create_function('$item, $key, $_tmp', '
                $_tmp[0][] = array_merge(array(
                    "id" => $item->equipment->equipid,
                    "modelid" => $item->equipment->modelid,
                    "modelname" => $item->modelname,
                    "name" => $item->equipment->name,
                    "descr" => $item->equipment->descr,
                    "serial" => $item->equipment->serial,
                    "agrmid" => $item->equipment->agrmid,
                    "cardid" => $item->equipment->cardid,
                    "cardserial" => $item->cardserial,
                    "agrmnum" => $item->agrmnum,
                    "serialformat" => $item->equipment->serialformat,
                    "garantee" => $item->equipment->garantee,
                    "vgid" =>  $item->vgid,
					"chipid" => $item->equipment->chipid,
					"mac" => $item->equipment->mac,
					"vglogin" => $item->vglogin
                ), getClientDeviceService($_tmp[1], $item));
				
            '), array( &$_tmp, &$lanbilling ));
        }
        
        if(($lim = (integer)$lanbilling->Option('smartcard_eqip_max')) > 0 && $lim <= $count) {
        	$exceeded = true;
        }
    }
    catch(Exception $error) {
        $_response = array(
            "results" => $_tmp,
            "total" => 0,
            "success" => false,
            "error" => $error->getMessage()
        );
    }

    if(!$_response) {
        $_response = array(
            "results" => $_tmp,
            "total" => (integer)$count,
            "success" => true,
        	"exceeded" => (boolean)$exceeded,
            "error" => null
        );
    }

    echo "(" . JEncode($_response, $lanbilling) . ")";
} // end getClientDevices()


/**
 * Insert or update smart card data
 * @param   object, main class
 */
function setSmartCard( &$lanbilling, &$localize )
{
    try {
        if($lanbilling->getAccess('users') < 2) {
            throw new Exception($localize->get('This operation is not permitted for You'));
        }

        $struct = array();
		$struct['cardid'] = (integer)$_POST['id'];
		$struct['serial'] = (string)$_POST['serial'];
		$struct['name'] = (string)$_POST['name'];
		$struct['descr'] = (string)$_POST['descr'];
		$struct['garantee'] = $lanbilling->formatDate($_POST['garantee'], 'Y-m-d');
		
        if( false == $lanbilling->save("setSmartCard", $struct) ) {
			$error = $lanbilling->soapLastError();
			if(preg_match("~Not available smartcard\(.*\)~is ",$error->detail, $matches)){ 
				$msg = "Not available smartcard";
			} 
			throw new Exception($localize->get($msg));
        }
		
		$ret = (int)$lanbilling->saveReturns->ret;
		
		if($ret > 0) {		
			$card = $lanbilling->get("getSmartCards", array("flt" => array("recordid"=>$ret)));
			if(((int)$card->smartcard->vgid > 0 && (int)$_POST['vgid']==0) || ((int)$card->smartcard->vgid == 0 && (int)$_POST['vgid'] > 0)) {
				$data = array();
				$data['cardid'] = (int)$ret;
				$data['vgid'] = (int)$_POST['vgid'];
				$data['reason'] = (string)$_POST['reason'];
				if( false == $lanbilling->save("setVgSmartCard", $data) ) {
					$error = $lanbilling->soapLastError();
					if(preg_match("~Requested smartcard already linked to vgroup\(.*\)~is ",$error->detail, $matches)){
						$msg = "Requested smartcard is already linked to account";
					} else 
					if(preg_match("~Requested vgroup already linked to smartcard\(.*\)~is ",$error->detail, $matches)){
						$msg = "Requested account is already linked to smartcard";
					} else 
					if(preg_match("~Requested vgroup already linked to equipment\(.*\)~is ",$error->detail, $matches)){
						$msg = "Requested account is already linked to equipment";
					} 
					throw new Exception($localize->get($msg));
				}
			}
		}
    }
    catch(Exception $error) {
        $_response = array(
            "success" => false,
			"ret" => (int)$ret,
            "error" => $error->getMessage()
        );
    }

    if(!$_response) {
        $_response = array(
            "success" => true,
			"ret" => (int)$ret
        );
    }

    echo "(" . JEncode($_response, $lanbilling) . ")";
} // end setSmartCard()


/**
 * Insert or update client device data
 * Mobility... this ugly code is the result of the mobility
 * @param   object, main class
 */
function setDevice( &$lanbilling, &$localize )
{
    try {

        if($lanbilling->getAccess('users') < 2) {
            throw new Exception($localize->get('This operation is not permitted for You'));
        }
		
        $struct = array(
            "equipid" => (integer)$_POST['id'],
            "modelid" => (integer)$_POST['modelid'],
            "serial" => (string)$_POST['serial'],
            "name" => (string)$_POST['name'],
            "descr" => (string)$_POST['descr'],
            "serialformat" => ($_POST['serialformat'] == 'on' || $_POST['serialformat'] == '1') ? 1 : 0, 
            "garantee" => $lanbilling->formatDate($_POST['garantee'], 'Y-m-d'),
			"chipid" => $_POST['chipid'],
			"mac" => $_POST['mac']
        );
	
        $devs = 0;
		
		$lim = (integer)$lanbilling->Option('smartcard_eqip_max');
		
        if((integer)$_POST['cardid'] > 0 || (integer)$_POST['origcardid']) {
            $filter = array(
                "parentid" => (integer)$_POST['cardid'] > 0 ? $_POST['cardid'] : (integer)$_POST['origcardid'],
                "agrmid" => (integer)$_POST['agrmid'],
                "pgsize" => 100,
                "pgnum" => 1
            );
		} else {
			$filter = array(
                "recordid" => (integer)$_POST['id'],
                "agrmid" => (integer)$_POST['agrmid'],
                "pgsize" => (int)$lim > 0 ? $lim : 1,
                "pgnum" => 1
            );
		}
		
            if( false === ($devs = $lanbilling->get("getEquipment", array("flt" => $filter, "md5" => $lanbilling->controlSum($filter)))) ) {
                throw new Exception ($localize->get("Data saved but there was impossible to get linked equipments") . ": " . $lanbilling->soapLastError()->detail);
            }
			$getData = $devs;
			
            if(!empty($devs) && !is_array($devs)) {
                $devs = array($devs);
            }
            $devs = (integer)sizeof($devs);

            if((integer)$_POST['cardid'] > 0 && ($lim = (integer)$lanbilling->Option('smartcard_eqip_max')) > 0 && $lim <= $devs) {
                throw new Exception($localize->get("Equipment limit exceeded"));
            }
			
		/*if((int)$_POST['equipid'] > 0 && !empty($_POST['vgid']) {
			$s = setVgEquipment($lanbilling, $localize);
		}*/	
		
        if( false == $lanbilling->save("setEquipment", $struct) ) {
			$error = $lanbilling->soapLastError();
			if(strpos($error->detail, 'Not available chipid')) $msg = "Not available chipid";
			else if(strpos($error->detail, 'Not available mac')) $msg = "Not available mac";
			else if(strpos($error->detail, 'Not available serial')) $msg = "Not available serial";
			else if(strpos($error->detail, 'Not available identity')) $msg = "Not available identity";
			else if(strpos($error->detail, 'Not available model')) $msg = "Not available model";
			else if(strpos($error->detail, 'Not available equipment')) $msg = "Not available equipment";
			else $msg = $error->detail;
			throw new Exception($localize->get($msg));
            
        }
		$ret = (int)$lanbilling->saveReturns->ret;	
		
        if((integer)$_POST['cardid'] > 0) {
            // Let us send flag if exceeded
            if(($lim = (integer)$lanbilling->Option('smartcard_eqip_max')) > 0 && $lim <= ($devs + 1)) {
                $exceeded = true;
            }
        }
        else if((integer)$_POST['origcardid'] > 0 &&
            $devs > 0 &&
            ($devs - (integer)$lanbilling->Option('usbox_eqip_min')) == 1 &&
            (integer)$_POST['serviceid'] > 0)
        {
            $lanbilling->get("stopUsboxService", array("id" => (integer)$_POST['serviceid'], "timeto" => date('Y-m-d H:i:00')));
            $loadform = true;
        }

        if((integer)$_POST['cardid'] > 0 &&
            (integer)$_POST['tarusbox'] > 0 &&
            ($tag = (string)$lanbilling->Option('smartcard_usbox_tag')) &&
            (integer)$_POST['serviceid'] == 0)
        {
            $filter = array(
                "uuid" => $tag
            );
            if( false === ($catidxs = $lanbilling->get("getTarCategories", array("id" => (integer)$_POST['tarusbox'], "flt" => $filter, "md5" => $lanbilling->controlSum($filter)))) ) {
                throw new Exception($localize->get("Data saved but there was impossible to get categories") . ": " . $lanbilling->soapLastError()->detail);
            }
			
            if(($devs + 1) > (integer)$lanbilling->Option('usbox_eqip_min') && !$ubservs) {
                if(!$catidxs) {
                    throw new Exception($localize->get("Misconfigured tarif. Unknown category with tag") . ": " . $tag . ', ' . $localize->get("cannot assign service"));
                }

                $callusbox = true;
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
            "tag" => (string)$tag,
            "exceeded" => (boolean)$exceeded,
            "loadform" => (boolean)$loadform,
            "callusbox" => (boolean)$callusbox,
          //  "getservid" => (int)$getData->equipment->servid	 //hybrid
		    "ret" => (int)$ret
        );
    }

    echo "(" . JEncode($_response, $lanbilling) . ")";
} // end setDevice()

/**
 * Remove client device
 * @param   object, main class
 */
function removeClientDevices( &$lanbilling, &$localize )
{
    try {
        if($lanbilling->getAccess('users') < 2) {
            throw new Exception($localize->get('This operation is not permitted for You'));
        }

        foreach($_POST['clidev'] as $key => $item) {
            if( false == $lanbilling->delete("delEquipment", array("id" => $key), array("getEquipment")) ) {
                throw new Exception($localize->get("Serial number") . ": " . $item['serial'] . "<br>" . $lanbilling->soapLastError()->detail);
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
            "success" => true
        );
    }

    echo "(" . JEncode($_response, $lanbilling) . ")";
} //end removeClientDevices()


/**
 * Remove smart card
 * @param   object, main class
 */
function removeSmartCard( &$lanbilling, &$localize )
{
    try {
        if($lanbilling->getAccess('users') < 2) {
            throw new Exception($localize->get('This operation is not permitted for You'));
        }

        foreach($_POST['smcard'] as $key => $item) {
            if( false == $lanbilling->delete("delSmartCard", array("id" => $key), array("getSmartCards")) ) {
                throw new Exception($localize->get("Serial number") . ": " . $item['serial'] . "<br>" . $localize->get($lanbilling->soapLastError()->detail));
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
            "success" => true
        );
    }

    echo "(" . JEncode($_response, $lanbilling) . ")";
} //end removeSmartCard()


/**
 * Get models list
 */
function getModels( &$lanbilling )
{
    try {
        $filter = array(
            "pgsize" => ((integer)$_POST['limit'] <= 0) ? 100 : $_POST['limit']
        );

        $filter['pgnum'] = $lanbilling->linesAsPageNum($filter['pgsize'], (integer)$_POST['start'] + 1);

        if( false === ($result = $lanbilling->get("getEquipmentModels", array("flt" => $filter))) ) {
            throw new Exception ($lanbilling->soapLastError()->detail);
        }

        if($result) {
            if(!is_array($result)) {
                $result = array($result);
            }

            $_md5 = $lanbilling->controlSum($filter);
            //$count = $lanbilling->get("Count", array("flt" => $filter, "procname" => "getEquipmentModels", "md5" => $_md5));
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
} // end getModels()



/**
 * Get all data about smartcard using
 */
function getEquipmentHistory( &$lanbilling, &$localize )
{
    try {		
        $_filter = array(
			"recordid" => (integer)$_POST['id'],		// ID устройства или смарткарты
			"timefrom" => $_POST['datefrom'],	// не обязательное поле
			"timeto" => $_POST['dateto']		// не обязательное поле
        );
		
		$type = (integer)$_POST['type'];
		$method = array("getEquipmentHistory", "getSmartcardsHistory", "getEquipcardsHistory");		
		
        if( false === ($result = $lanbilling->get($method[$type], array("flt" => $_filter))) ) {
            throw new Exception ($localize->get($lanbilling->soapLastError()->detail));
        }

        if($result) {
            if(!is_array($result)) {
                $result = array($result);
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
            "results" => (array)$result
        );
    }

    echo "(" . JEncode($_response, $lanbilling) . ")";
} // end getEquipmentHistory()


/**
 * Insert new model or update existing
 * @param   object
 */
function setModel( &$lanbilling, &$localize )
{
    try {
        if($lanbilling->getAccess('users') < 2) {
            throw new Exception($localize->get('This operation is not permitted for You'));
        }

        $struct = array(
            "modelid" => (integer)$_POST['modelid'],
            "type" => (integer)$_POST['type'],
            "name" => (string)$_POST['name'],
            "descr" => (string)$_POST['descr'],
        	"identitytype" => (integer)$_POST['identitytype']
        );

        if(false == $lanbilling->save("insupdEquipmentModel", $struct, $struct['modelid'] == 0 ? true : false, array("getEquipmentModels"))) {
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
            "success" => true
        );
    }

    echo "(". JEncode($_response, $lanbilling) . ")";
} // end setModel()


/**
 * Remove smart card
 * @param   object, main class
 */
function removeModel( &$lanbilling, &$localize )
{
    try {
        if($lanbilling->getAccess('users') < 2) {
            throw new Exception($localize->get('This operation is not permitted for You'));
        }

        foreach($_POST['modeltypes'] as $key => $item) {
            if( false == $lanbilling->delete("delEquipmentModel", array("id" => $key), array("getEquipmentModels")) ) {
            	

				if (strstr((string)$lanbilling->soapLastError()->detail, 'equipment_ibfk_1'))
					throw new Exception($localize->get("Type") . ": " . $item['strtype'] . "<br>" . $localize->get("Model is using"));
				else
                	throw new Exception($localize->get("Type") . ": " . $item['strtype'] . "<br>" . $lanbilling->soapLastError()->detail);
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
            "success" => true
        );
    }

    echo "(" . JEncode($_response, $lanbilling) . ")";
} //end removeSmartCard()


/**
 * Get model types
 * @param   object, main class
 */
function getModelTypes( &$lanbilling )
{
    try {
        if( false === ($result = $lanbilling->get("getEquipmentTypes", array())) ) {
            throw new Exception ($localize->get($lanbilling->soapLastError()->detail));
        }

        if($result) {
            if(!is_array($result)) {
                $result = array($result);
            }
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
            "results" => (array)$result,
            "success" => true,
            "error" => null
        );
    }

    echo "(" . JEncode($_response, $lanbilling) . ")";
} // end getModelTypes($lanbilling)


/**
 * Assign device
 * @param   object, main class
 */
function assignDevices( &$lanbilling, &$localize )
{
    try {
        if($lanbilling->getAccess('users') < 2) {
            throw new Exception($localize->get('This operation is not permitted for You'));
        }

        if(is_array($_POST['devs'])) {
            foreach($_POST['devs'] as $item) {
                $struct = array(
                    "equipid" => (integer)$item['id'],
                    "modelid" => (integer)$item['modelid'],
                    "agrmid" => (integer)$item['agrmid'],
                    "cardid" => (integer)$item['cardid'],
                    "serial" => (string)$item['serial'],
                    "name" => (string)$item['name'],
                    "descr" => (string)$item['descr'],
            		"serialformat" => ($item['serialformat'] == 'on' || $item['serialformat'] == 1) ? 1 : 0, 
            		"garantee" => $lanbilling->formatDate(date('Y-m-d',strtotime($item['garantee']))),
            		"reason" => $item['reason'],
					"chipid" => $item['chipid'],
					"mac" => $item['mac']
                );
				
                if( false == $lanbilling->save("setEquipment", $struct, $struct['equipid'] == 0 ? true : false, array("getEquipment")) ) {
                    throw new Exception($localize->get($lanbilling->soapLastError()->detail));
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
            "success" => true
        );
    }

    echo "(" . JEncode($_response, $lanbilling) . ")";
} // end assignDevices($lanbilling)


/**
 * Load data from CSV file
 * @param   object, main class
 */
function setDataFromFile( &$lanbilling, &$localize )
{
    try {
        if($lanbilling->getAccess('users') < 2) {
            throw new Exception($localize->get('This operation is not permitted for You'));
        }

        if( false == ($files = $lanbilling->UploadCheck('upcontent')) ) {
            throw new Exception($localize->get("Select file to upload"));
        }

        if($_POST['setfromfile'] == 'equipment') {
        	
        	if($_POST['equipmenttype'] == 0)
			{
				if((integer)$_POST['modelid'] == 0) {
                throw new Exception($localize->get("Undefined") . ": " . $localize->get("Model"));
	            }
	
	            $struct = array("equipid", "serial", "name", "descr");
	
	            $data = $lanbilling->csvFileToArray($files[0]['tmp_name'], 4, $struct);
	
	            foreach($data as $item) {
					
					if($_POST['identitytype'] != '') {
						if($_POST['identitytype'] == 0) {
							$item['chipid'] = $item['serial'];
							$item['serial'] = '';
						} else if($_POST['identitytype'] == 1) {
							$item['mac'] = $item['serial'];
							$item['serial'] = '';
						} else if($_POST['identitytype'] == 2) {
							$item['serial'] = $item['serial'];
						}
					}
					
	                $item['modelid'] = (integer)$_POST['modelid'];
            		$item["serialformat" ] = $_POST['serialformat'] == 'on' ? 1 : 0; 
            		$item["garantee" ] = $lanbilling->formatDate(date('Y-m-d',strtotime($_POST['garantee'])));
	                $item['agrmid'] = 0;
	                $item['cardid'] = 0;

	                if( false == $lanbilling->save("setEquipment", $item) ) {
	                    throw new Exception($lanbilling->soapLastError()->detail);
	                }
	            }
			}
			
			if($_POST['equipmenttype'] == 1) 
			{				
				$struct = array("cardserial", "cardname", "carddescr", "equipserial", "equipname", "equipdescr");
	            $file_data = $lanbilling->csvFileToArray($files[0]['tmp_name'], 6, $struct);

	            foreach($file_data as &$item) {
	                $card = array();
					$card['vgid'] = 0;
					$card['cardid'] = 0;
					$card['serial'] = $item['cardserial'];
					$card['name'] = $item['cardname'];
					$card['descr'] = $item['carddescr'];
					$card['garantee'] = $lanbilling->formatDate(date('Y-m-d',strtotime($_POST['garantee'])));
					
	                if( false === ($result = $lanbilling->save("setSmartCard", $card)) ) {
	                    throw new Exception($localize->get($lanbilling->soapLastError()->detail));
	                }
					$item['cardid'] = $lanbilling->saveReturns->ret;
	            }
				
	            foreach($file_data as &$item) {
					
					$equip = array();
					
					if($_POST['identitytype'] != '') {
						if($_POST['identitytype'] == 0) {
							$equip['chipid'] = $item['equipserial'];
						} else if($_POST['identitytype'] == 1) {
							$equip['mac'] = $item['equipserial'];
						} else if($_POST['identitytype'] == 2) {
							$equip['serial'] = $item['equipserial'];
						}
					}					
	            	
	                $equip['modelid'] = (integer)$_POST['modelid'];
	                $equip['agrmid'] = 0;
	                $equip['cardid'] = $item['cardid'];
					$equip['name'] = $item['equipname'];
					$equip['descr'] = $item['equipdescr'];
					$equip['equipid'] = 0;
					$equip['serialformat'] = $_POST['serialformat'] == 'on' ? 1 : 0; 
					$equip['garantee'] = $lanbilling->formatDate(date('Y-m-d',strtotime($_POST['garantee'])));

	                if( false == $lanbilling->save("setEquipment", $equip) ) {
	                    throw new Exception($lanbilling->soapLastError()->detail);
	                }
					
					$ret = $lanbilling->saveReturns->ret;
					// LINK SMCARD WITH EQUIPMENT
	                if( false == $lanbilling->save("setCardEquipment", array('equipid'=>$ret, 'cardid'=>$item['cardid'])) ) {
						$error = $lanbilling->soapLastError();
						if(preg_match("~Requested equipment already linked to vgroup\(.*\)~is ",$error->detail, $matches)) $msg = "Requested equipment is already linked to account";
						else if(preg_match("~Requested equipment already linked to smartcard\(.*\)~is ",$error->detail, $matches)) $msg ="Requested equipment is already linked to smartcard";
						else if(preg_match("~Not available equipment\(.*\)~is ",$error->detail, $matches)) $msg = "Not available equipment";
						else if(preg_match("~Requested equipment already without smartcards~is ",$error->detail, $matches)) $msg = ''; //$msg ="Requested equipment is not linked to account";
						if($msg != '') throw new Exception($localize->get($msg));
	                }
	            }
			}
        }
        else if($_POST['setfromfile'] == 'smartcard') {
            $struct = array("cardid", "serial", "name", "descr");

            $data = $lanbilling->csvFileToArray($files[0]['tmp_name'], 4, $struct);

            foreach($data as $item) {
                $item['vgid'] = 0;
                $item['garantee'] = $lanbilling->formatDate(date('Y-m-d',strtotime($_POST['garantee'])));
				
                if( false == $lanbilling->save("setSmartCard", $item) ) {
                    throw new Exception($localize->get($lanbilling->soapLastError()->detail));
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
            "success" => true
        );
    }

    echo "(" . JEncode($_response, $lanbilling) . ")";
} // end setDataFromFile()


/**
 * Get smart card status
 * @param   object, main class
 * @param   object, licalize
 */
function getsmartstatus( &$lanbilling, &$localize )
{
    $_tmp = array(
        "id" => 0,
        "status" => null,
        "message" => null
    );

    try {
        if((integer)$_POST['id'] == 0) {
        	throw new Exception($localize->get("Undefined") . ": " . $localize->get("Smart card") . ". " . $localize->get("Status") . ": " . $localize->get("Uknown"));
        }

        $filter = array(
            "pgsize" => 1,
            "pgnum" => 0,
            "recordid" => (integer)$_POST['id']
        );

        if( false === ($result = $lanbilling->get("getSmartCards", array("flt" => $filter, "md5" => $lanbilling->controlSum($filter)))) ) {
            throw new Exception ($localize->get($lanbilling->soapLastError()->detail));
        }
		
        if($result) {
            if(!is_array($result)) {
                $result = array($result);
            }

            $_tmp["id"] = $result[0]->smartcard->cardid;

            if($result[0]->smartcard->status != 2) {
                $_tmp["status"] = $result[0]->smartcard->status;
                $_tmp["message"] = $result[0]->smartcard->status == 0 && empty($result[0]->smartcard->message) ?
                    $localize->get("Ok") : $result[0]->smartcard->message;
            }
        }
    }
    catch(Exception $error) {
        $_response = array(
            "data" => null,
            "success" => false,
            "error" => $error->getMessage()
        );
    }

    if(!$_response) {
        $_response = array(
            "data" => $_tmp,
            "success" => true,
            "error" => null
        );
    }

    echo "(" . JEncode($_response, $lanbilling) . ")";
} // end getsmartstatus()


/**
 * Get complects data
 * @param   object, main class
 * @param   object, localize
 */
function getComplectData( &$lanbilling, &$localize )
{
	try {
		// get Equipment by smcard id
		$filter = array(
			"parentid" => (int)$_POST['checkcomplect'],
			"pgsize" => 100,
			"pgnum" => 1
		);
		
		if((int)$_POST['checkcomplect']>0) {
			if( false === ($equips = $lanbilling->get("getEquipment", array("flt" => $filter))) ) {
				throw new Exception ($localize->get($lanbilling->soapLastError()->detail));
			}
			// get Smartcard data by serial number
			$filter2 = array("serial" => $_POST['smserial']);
			if( false === ($cards = $lanbilling->get("getSmartCards", array("flt" => $filter2))) ) {
				throw new Exception ($lanbilling->soapLastError()->detail);
			}	
	
			if($equips && $cards) {
				if(!is_array($equips)) $equips = array($equips);
				$result = array('complect' => ($equips[0]->equipment->agrmid == 0 && $cards->smartcard->vgid == 0) ? 1 : 0, 'equipid' => $equips[0]->equipment->equipid);
			} else { 
				$result = array('complect' => 0, 'vgid' => $cards->smartcard->vgid, 'vglogin' => $cards->smartcard->vglogin);
			}
		}			
	}
    catch(Exception $error) {
        $_response = array(
            "result" => null,
            "success" => false,
            "error" => $error->getMessage()
        );
    }
    if(!$_response) {
        $_response = array(
            "result" => $result,
            "success" => true,
            "error" => null
        );
    }

    echo "(" . JEncode($_response, $lanbilling) . ")";
} // end getComplectData()


/**
 * Update equipment -> Add earlier recieved servid 
 * @param   object, main class
 * @param   object, localize
 */
function setDeviceService( &$lanbilling, &$localize )
{
	try {
		
		$filter = array("recordid" => (int)$_POST['equipid']);
        if( false === ($ress = $lanbilling->get("getEquipment", array("flt" => $filter))) ) {
            throw new Exception ($localize->get($lanbilling->soapLastError()->detail));
        }

		if((int)$_POST['justdevice'] > 0) {
			$agrmid = 0;
		} else {
			$agrmid = (integer)$ress->equipment->agrmid;
		}

		$struct = array(
            "equipid" => (integer)$ress->equipment->equipid,
            "modelid" => (integer)$ress->equipment->modelid,
            "agrmid" => (integer)$agrmid,
            "cardid" => (integer)$ress->equipment->cardid, 
            "serial" => (string)$ress->equipment->serial,
            "name" => (string)$ress->equipment->name,
            "descr" => (string)$ress->equipment->descr ,
            "serialformat" => $ress->equipment->serialformat, 
            "garantee" => $ress->equipment->garantee,
            "reason" => $ress->equipment->reason,
			"chipid" => $ress->equipment->chipid,
			"mac" => $ress->equipment->mac
        );

		if( false == $lanbilling->save("setEquipment", $struct) ) {
            throw new Exception($localize->get($lanbilling->soapLastError()->detail));
        }
	}
    catch(Exception $error) {
        $_response = array(
            "result" => null,
            "success" => false,
            "error" => $error->getMessage()
        );
    }
    if(!$_response) {
        $_response = array(
            "result" => $result,
            "success" => true,
            "error" => null
        );
    }

    echo "(" . JEncode($_response, $lanbilling) . ")";
} // end setDeviceService()


/**
 * Smartcard activation method
 * @param   object, main class
 */
function activateSmartCard( &$lanbilling, &$localize )
{
    try {
		$struct = array(
			"id" => (int)$_POST['activatesmcard']
		);
		
		$lb = $lanbilling->cloneMain(array('query_timeout' => 380));
		
		// Set smcard activation by delete method!!!
        if( false == $lb->delete("activateSmartCard", $struct) ) {
        	$msg = $lb->soapLastError()->detail;
        	if(strstr($msg, 'timeout')){
        		$msg = 'Operation is not possible - no connection to the equipment';
        	}
            throw new Exception($localize->get($msg));
        }
        
    }
    catch(Exception $error) {
		$_response = array(
			"success" => false,
			"error" => $localize->get($error->getMessage())
		);
	}

	if(!$_response) {
		$_response = array(
			"success" => true,
			"error" => null
		);
	}

    echo "(" . JEncode($_response, $lanbilling) . ")";
} // end activateSmartCard($lanbilling, $localize)


/**
 * Link Agreement with Device
 * @param   object, main class
 * @param   object, localize
 */
function setAgrmEquipment( &$lanbilling, &$localize )
{
	try {
		
        if(!empty($_POST['devs']) && is_array($_POST['devs'])) {
            foreach($_POST['devs'] as $item) {
                $struct = array(
                    "equipid" => (integer)$item['id'],
                    "agrmid" => (integer)$item['agrmid'],
            		"reason" => $_POST['reason']
                );

                if( false == $lanbilling->save("setAgrmEquipment", $struct)) {
					$error = $lanbilling->soapLastError();
					if(preg_match("~Requested equipment already linked to vgroup\(.*\)~is ",$error->detail, $matches)) $msg = "Requested equipment is already linked to account";
					else if(preg_match("~Requested equipment already linked to smartcard\(.*\)~is ",$error->detail, $matches)) $msg = '';//$msg = "Requested equipment is already linked to smartcard";
					else if(preg_match("~Requested equipment already linked to agreement\(.*\)~is ",$error->detail, $matches)) $msg = "Requested equipment is already linked to agreement";
					else if(preg_match("~Requested equipment already without smartcard~is ",$error->detail, $matches)) $msg = '';//$msg = "Requested equipment is not linked to account";
					else $msg = $error->detail;
					if($msg != '') throw new Exception($localize->get($msg));
                }
            }			
        } else {		

			if((int)$_POST['unlinkdevice']>0 && (int)$_POST['closewin']!=1) {
				$struct = array(
		            "equipid" => (int)$_POST['equipid'],
		            "cardid" => 0,
		            "reason" => $_POST['reason']
		        );

				if( false == $lanbilling->save("setCardEquipment", $struct) ) {
					$error = $lanbilling->soapLastError();
					if(preg_match("~Requested equipment already linked to vgroup\(.*\)~is ",$error->detail, $matches)) $msg = "Requested equipment is already linked to account";
					else if(preg_match("~Requested equipment already linked to smartcards\(.*\)~is ",$error->detail, $matches)) $msg ="Requested equipment is already linked to smartcard";
					else if(preg_match("~Requested equipment without smartcard~is ",$error->detail, $matches)) $msg = '';//$msg = "Requested equipment is not linked to smartcard";
					else if(preg_match("~Not available equipment~is ",$error->detail, $matches)) $msg = "Not available equipment";
					else $msg = $error->detail;
					if($msg != '') throw new Exception($localize->get($msg));    
		        }
			}

			$struct = array(
				"equipid" => (int)$_POST['equipid'],
				"agrmid" => (int)$_POST['agrmid'],
				"reason" => $_POST['reason'],
				"servid" => (int)$_POST['servid']
			);
		
			if( false == $lanbilling->save("setAgrmEquipment", $struct) ) {
				$error = $lanbilling->soapLastError();
				if(preg_match("~Requested equipment already linked to vgroup\(.*\)~is ",$error->detail, $matches)) $msg = "Requested equipment is already linked to account";
				else if(preg_match("~Requested equipment already linked to smartcard\(.*\)~is ",$error->detail, $matches)) $msg = "Requested equipment is already linked to smartcard";
				else if(stripos($error->detail, "Requested equipment already linked to agreement")) $msg = "Requested equipment is already linked to agreement";
				else if(preg_match("~Requested equipment already without smartcard~is ",$error->detail, $matches)) $msg = '';//$msg = "Requested equipment is not linked to account";
				else if(preg_match("~Requested equipment already linked to agreement~is ",$error->detail, $matches)) $msg = '';
				else if(preg_match("~Requested equipment already without agreement~is ",$error->detail, $matches)) $msg = '';
				else $msg = $error->detail;
				if($msg != '') throw new Exception($localize->get($msg));
			}
		}
	}
    catch(Exception $error) {
        $_response = array(
            "result" => null,
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
} // end setAgrmEquipment()


/**
 * Link Device with Vgroup
 * @param   object, main class
 * @param   object, localize
 */
function setVgEquipment( &$lanbilling, &$localize )
{
	try {
		$struct = array(
            "equipid" => (int)$_POST['equipid'],
            "vgid" => (int)$_POST['vgid'],
            "reason" => $_POST['reason']
        );

		if( false == $lanbilling->save("setVgEquipment", $struct) ) {
			$error = $lanbilling->soapLastError();
			if(preg_match("~Requested equipment already linked to vgroup\(.*\)~is ",$error->detail, $matches)) $msg = "Requested equipment is already linked to account";
			else if(preg_match("~Requested equipment already linked to smartcard\(.*\)~is ",$error->detail, $matches)) $msg = "Requested equipment is already linked to smartcard";
			else if(preg_match("~Requested equipment already without vgroup~is ",$error->detail, $matches)) $msg = '';//$msg = "Requested equipment is not linked to account"; 
			else if(preg_match("~Requested vgroup don\'t match agreements~is ",$error->detail, $matches)) $msg = "Account is not match agreement ID";
			else if(preg_match("~Requested equipment not linked to agreements~is ",$error->detail, $matches)) $msg = "Requested equipment is not linked to agreement";
			else if(preg_match("~Not available equipment~is ",$error->detail, $matches)) $msg = "Not available equipment";
			else $msg = $error->detail;
			if($msg != '') throw new Exception($localize->get($msg));            
        }     
	}
    catch(Exception $error) {
        $_response = array(
            "result" => null,
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
} // end setAgrmEquipment()


/**
 * Link Device with SmartCard
 * @param   object, main class
 * @param   object, localize
 */
function setCardEquipment( &$lanbilling, &$localize )
{
	try {
		$struct = array(
            "equipid" => (int)$_POST['equipid'],
            "cardid" => (int)$_POST['cardid'],
            "reason" => $_POST['reason']
        );
		
		/*
			Некоторые ошибки умышленно закрыты для вывода в интерфейс ($msg = '') потому что разработчики ядра не всегда понимают, что в инт-се их ошибка совсем не к месту...
		*/		
		
		if( false == $lanbilling->save("setCardEquipment", $struct) ) {
			$error = $lanbilling->soapLastError();
			if(preg_match("~Requested equipment already linked to vgroup\(.*\)~is ",$error->detail, $matches)) $msg = "Requested equipment is already linked to account";
			else if(preg_match("~Requested equipment already linked to smartcard\(.*\)~is ",$error->detail, $matches)) $msg = "Requested equipment is already linked to smartcard";
			else if(preg_match("~Requested equipment already without smartcards~is ",$error->detail, $matches)) $msg = '';
			else if(preg_match("~Requested equipment without smartcard~is ",$error->detail, $matches)) $msg = '';//$msg = "Requested equipment is not linked to smartcard";
			else if(preg_match("~Not available equipment~is ",$error->detail, $matches)) $msg = "Not available equipment";
			else $msg = $error->detail;
			if($msg != '') throw new Exception($localize->get($msg));    
        }
        
        // Check if mobility
        if( false === ($devs = $lanbilling->get("getEquipment", array("flt" => array(
        	'parentid' => (int)$_POST['cardid']
        )))) )
        {
        	throw new Exception ($localize->get($lanbilling->soapLastError()->detail));
        }
        $devscount = count($devs);

         if((integer)$_POST['cardid'] > 0 &&
         		(integer)$_POST['tarusbox'] > 0 &&
         		($tag = (string)$lanbilling->Option('smartcard_usbox_tag')) &&
         		(integer)$_POST['serviceid'] == 0)
         {
	        $filter = array(
	        		"uuid" => $tag
	        );
	        if( false === ($catidxs = $lanbilling->get("getTarCategories", array("id" => (integer)$_POST['tarusbox'], "flt" => $filter, "md5" => $lanbilling->controlSum($filter)))) ) {
	        	throw new Exception($localize->get("Data saved but there was impossible to get categories") . ": " . $lanbilling->soapLastError()->detail);
	        }
	        	
	        if(($devscount) > (integer)$lanbilling->Option('usbox_eqip_min')) {
		        if(!$catidxs) {
		        	throw new Exception($localize->get("Misconfigured tarif. Unknown category with tag") . ": " . $tag . ', ' . $localize->get("cannot assign service"));
		        }
		        
		        $callusbox = true;
	        }
        }  
	}
    catch(Exception $error) {
        $_response = array(
            "result" => null,
            "success" => false,
            "error" => $error->getMessage()
        );
    }
    if(!$_response) {
        $_response = array(
            "success" => true,
			"tag" => $tag,
        	"callusbox" => (boolean)$callusbox,
            "error" => null
        );
    }

    echo "(" . JEncode($_response, $lanbilling) . ")";
} // end setCardEquipment()

/**
 * Link Device with SmartCard
 * @param   object, main class
 * @param   object, localize
 */
function setVgSmartCard( &$lanbilling, &$localize )
{
	try {
		$struct = array(
            "cardid" => (int)$_POST['id'],
            "vgid" => (int)$_POST['vgid'],
            "reason" => $_POST['reason']
        );

		if( false == $lanbilling->save("setVgSmartCard", $struct) ) {
			$error = $lanbilling->soapLastError();
			if(preg_match("~Requested smartcard already linked to vgroup\(.*\)~is ",$error->detail, $matches)){
				$msg = "Requested smartcard is already linked to account";
			} else 
			if(preg_match("~Requested vgroup already linked to smartcard\(.*\)~is ",$error->detail, $matches)){
				$msg = "Requested account is already linked to smartcard";
			} else 
			if(preg_match("~Requested vgroup already linked to equipment\(.*\)~is ",$error->detail, $matches)){
				$msg = "Requested account is already linked to equipment";
			} 
			else { $msg = $error->detail; }
			throw new Exception($localize->get($msg));
        }
	}
    catch(Exception $error) {
        $_response = array(
            "result" => null,
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
} // end setVgSmartCard()



/**
 * Link vgroup with another smartcard (replacing)
 * @param   object, main class
 * @param   object, localize
 */
function replaceSmartCard( &$lanbilling, &$localize )
{
	try {
		$struct = array(
            "cardid" => (int)$_POST['id'],
            "vgid" => (int)$_POST['vgid'],
            "reason" => $_POST['reason']
        );

		if( false == $lanbilling->save("replaceSmartCard", $struct) ) {
			$error = $lanbilling->soapLastError()->detail;
			throw new Exception($localize->get($error));
        }
	}
    catch(Exception $error) {
        $_response = array(
            "result" => null,
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
} // end replaceSmartCard()


/**
 * Set another pin to smartcard
 * @param   object, main class
 * @param   object, localize
 */
function resetSmartcardPin( &$lanbilling, &$localize )
{
	try {
		$struct = array(
			"smartcardnum" => $_POST['smartcardnumber'],
			"pin" => $_POST['newpin']
		);

		if( false == $lanbilling->delete("stbPinReset", $struct) ) {
			$error = $lanbilling->soapLastError()->detail;
			throw new Exception($localize->get($error));
		}
	}
	catch(Exception $error) {
		$_response = array(
				"result" => null,
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
} // end resetEquipmentPin()
