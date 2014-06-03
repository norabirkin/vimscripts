<?php
/**
 * Services packages common functions
 *
 */


// There is background query
if(isset($_POST['async_call']))
{
    if(isset($_POST['getservpacks'])) {
        getServPacks($lanbilling, $localize);
    }
    
    if(isset($_POST['getpacket'])) {
        getPacket($lanbilling, $localize);
    }
    
    if(isset($_POST['setpack'])) {
        setPack($lanbilling, $localize);
    }
    
    if(isset($_POST['delpacket'])) {
        delPacket($lanbilling, $localize);
    }
    
    if(isset($_POST['deluserpacket'])) {
        delUserPacket($lanbilling, $localize);
    }
    
    if(isset($_POST['getpackentries'])) {
        getPackEntries($lanbilling, $localize);
    }
        
    if(isset($_POST['delpackettpl'])) {
        delPacketEntry($lanbilling, $localize);
    }
    
    if(isset($_POST['setpackentry'])) {
        setPackEntry($lanbilling, $localize);
    }
    
    if(isset($_POST['getpackettars'])) {
        getPacketEntryTariffs($lanbilling, $localize);
    }
    
    if(isset($_POST['setpackettarif'])) {
        setPacketEntryTariff($lanbilling, $localize);
    }
    
    if(isset($_POST['delpackettarif'])) {
        delPacketEntryTariff($lanbilling, $localize);
    }
    
    if(isset($_POST['getuserpackets'])) {
        getUserPackets($lanbilling, $localize);
    }
    
    if(isset($_POST['getpackageusers'])) {
        getPackageUsers($lanbilling, $localize);
    }    
    
    if(isset($_POST['setuserpacket'])) {
        setUserPacket($lanbilling, $localize);
    }
}
else {
    $tpl = new HTML_Template_IT(TPLS_PATH);
    $tpl->loadTemplatefile("services_packages.tpl", true, true);
    $tpl->touchBlock('__global__');
    $localize->compile($tpl->get(), true);
}


/**
 * Returns services packages list
 * @param   object, billing class
 * @param   object, localize class
 */
function getServPacks( &$lanbilling, &$localize )
{
    if($lanbilling->getAccess('packages') < 1) {
        echo '({ success: false, reason: "' . $localize->get('You dont have rights to complete this action') . '" })';
        return false;
    }
    try {
        $_filter = array(
            "userid" => (integer)$_POST['userid'],
            "pgsize" => ((integer)$_POST['limit'] <= 0) ? 100 : $_POST['limit']
        );
        
        $_filter['pgnum'] = $lanbilling->linesAsPageNum($_filter['pgsize'], (integer)$_POST['start'] + 1);
        
        if(false === ($result = $lanbilling->get("getPackets", array("flt" => $_filter))))
        {
            throw new Exception($localize->get($lanbilling->soapLastError()->detail));
        }
        
        if(!empty($result)) {
            if(!is_array($result)) {
                $result = array($result);
            }
            
            array_walk($result, create_function('&$item', '
                $A = array(
                    "packetid" => $item->packetid,
                    "state" => $item->state,   
                    "name" => $item->name,   
                    "descr" => $item->descr,  
                    "created" => $item->created,
                    "datefrom" => $item->datefrom,
                    "dateto" => $item->dateto,  
                    "dateend" => $item->dateend, 
                    "discount" => $item->rate > 0 ? $item->rate : $item->discount,
                    "disctype" => $item->rate > 0 ? 0 : 1
                );
                
                $item = $A;
            '));
            
            $_count = $lanbilling->get("Count", array("flt" => $_filter, "procname" => "getPackets"));
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
            "results" => (array)$result,
            "total" => (integer)$_count
        );
    }

    echo "(" . JEncode($_response, $lanbilling) . ")";
} // end getServPacks()


/**
 * Returns form structure for the one packet
 * @param   object, billing class
 * @param   object, localize class
 */
function getPacket( &$lanbilling, &$localize )
{
    if($lanbilling->getAccess('packages') < 1) {
        echo '({ success: false, reason: "' . $localize->get('You dont have rights to complete this action') . '" })';
        return false;
    }
    try {
        if((integer)$_POST['packetid'] == 0) {
            throw new Exception($localize->get('Undefined') . ': ' . $localize->get('Package'));
        }
        
        if(false === ($result = $lanbilling->get("getPacket", array("id" => $_POST['packetid']))))
        {
            throw new Exception($localize->get($lanbilling->soapLastError()->detail));
        }
        
        $result->discount = $result->rate > 0 ? $result->rate : $result->discount;
        $result->disctype = $result->rate > 0 ? 0 : 1;
        
        unset($result->rate);
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
            "data" => (array)$result
        );
    }

    echo "(" . JEncode($_response, $lanbilling) . ")";
} // end getPacket()


/**
 * Insert / Update pack record
 * @param   object, billing class
 * @param   object, localize class
 */
function setPack( &$lanbilling, &$localize )
{
    if($lanbilling->getAccess('packages') < 2) {
        echo '({ success: false, reason: "' . $localize->get('You dont have rights to complete this action') . '" })';
        return false;
    }
    try {
        if(preg_match("/^\d{2}\.\d{2}\.\d{2}$/", $_POST['datefrom'])) {
            $_POST['datefrom'] = implode('-', array_reverse(explode('.', $_POST['datefrom'])));
            $_POST['datefrom'] = $lanbilling->formatDate(sprintf("%s 00:00:00", $_POST['datefrom']), "Y-m-d H:i:s");
        }
        else {
            $_POST['datefrom'] = '';
        }
        
        if(preg_match("/^\d{2}\.\d{2}\.\d{2}$/", $_POST['dateto'])) {
            $_POST['dateto'] = implode('-', array_reverse(explode('.', $_POST['dateto'])));
            $_POST['dateto'] = $lanbilling->formatDate(sprintf("%s 00:00:00", $_POST['dateto']), "Y-m-d H:i:s");
        }
        else {
            $_POST['dateto'] = '';
        }
        
        if(preg_match("/^\d{2}\.\d{2}\.\d{2}$/", $_POST['dateend'])) {
            $_POST['dateend'] = implode('-', array_reverse(explode('.', $_POST['dateend'])));
            $_POST['dateend'] = $lanbilling->formatDate(sprintf("%s 00:00:00", $_POST['dateend']), "Y-m-d H:i:s");
        }
        else {
            $_POST['dateend'] = '';
        }
        
        $struct = array(
            "packetid" => (integer)$_POST['packetid'],
            "name" => (string)$_POST['name'],
            "descr" => (string)$_POST['descr'],
            "blockstate" => 3,
            "rate" => (integer)$_POST['disctype'] == 1 ? 0 : (float)$_POST['discount'],
            "discount" => (integer)$_POST['disctype'] == 1 ? (float)$_POST['discount'] : 0,
            "datefrom" => $_POST['datefrom'],
            "dateto" => $_POST['dateto'],
            "dateend" => $_POST['dateend']
        );
        
        if(false == $lanbilling->save('insupdPacket', $struct, $struct['packetid'] == 0 ? true : false)) {
            throw new Exception($localize->get($lanbilling->soapLastError()->detail));
        }
       
        $struct["packetid"] = $lanbilling->saveReturns->ret;
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
            "data" => $struct
        );
    }

    echo "(" . JEncode($_response, $lanbilling) . ")";
} // end setPack()


/**
 * Remove packet entry tariff information
 * @param   object, main class
 */
function delPacket( &$lanbilling, &$localize )
{
    if($lanbilling->getAccess('packages') < 2) {
        echo '({ success: false, reason: "' . $localize->get('You dont have rights to complete this action') . '" })';
        return false;
    }
    try {
        if( false == $lanbilling->delete("delPacket", array("id" => (integer)$_POST['packetid'])) ) {
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
            "success" => true
        );
    }

    echo "(" . JEncode($_response, $lanbilling) . ")";
} //end delPacket()




/**
 * Remove packet from account
 * @param   object, main class
 */
function delUserPacket( &$lanbilling, &$localize )
{
    if($lanbilling->getAccess('packages') < 2) {
        echo '({ success: false, reason: "' . $localize->get('You dont have rights to complete this action') . '" })';
        return false;
    }
    try {
        if( false == $lanbilling->delete("delUserPacket", array("id" => (integer)$_POST['userpacketid'])) ) {
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
            "success" => true
        );
    }

    echo "(" . JEncode($_response, $lanbilling) . ")";
} //end delUserPacket()



/**
 * Return pack entries
 * @param   object, billing class
 * @param   object, localize class
 */
function getPackEntries( &$lanbilling, &$localize )
{
    if($lanbilling->getAccess('packages') < 1) {
        echo '({ success: false, reason: "' . $localize->get('You dont have rights to complete this action') . '" })';
        return false;
    }
    try {
        $_filter = array(
            "parentid" => (integer)$_POST['packetid'],
            "pgsize" => ((integer)$_POST['limit'] <= 0) ? 100 : $_POST['limit']
        );
        
        $_filter['pgnum'] = $lanbilling->linesAsPageNum($_filter['pgsize'], (integer)$_POST['start'] + 1);
        
        if(false === ($result = $lanbilling->get("getPacketEntries", array("flt" => $_filter))))
        {
            throw new Exception($localize->get($lanbilling->soapLastError()->detail));
        }
        
        if((integer)$_POST['packetid'] > 0) {
            $packet = $lanbilling->get("getPacket", array("id" => $_POST['packetid']));
        }
        
        if(!empty($result)) {
            if(!is_array($result)) {
                $result = array($result);
            }
            
            array_walk($result, create_function('&$item, $key, $_tmp', '
                $A = array(
                    "packetentryid" => $item->packetentryid,
                    "packetid" => $item->packetid,
                    "name" => $item->name,
                    "blockstate" => $item->blockstate,
                    "discount" => $item->rate > 0 ? $item->rate : $item->discount,
                    "disctype" => $item->rate > 0 ? 0 : 1,
                    "state" => (integer)$_tmp[0]->state
                );
                
                $item = $A;
            '), array( &$packet ));
            
            $_count = $lanbilling->get("Count", array("flt" => $_filter, "procname" => "getPacketEntries"));
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
            "results" => (array)$result,
            "total" => (integer)$_count
        );
    }

    echo "(" . JEncode($_response, $lanbilling) . ")";
} // end getPackEntries()


/**
 * Insert / Update packet entry
 * @param   object, billing class
 * @param   object, localize class
 */
function setPackEntry( &$lanbilling, &$localize )
{
    if($lanbilling->getAccess('packages') < 2) {
        echo '({ success: false, reason: "' . $localize->get('You dont have rights to complete this action') . '" })';
        return false;
    }
    try {
        if((integer)$_POST['packetid'] == 0) {
            throw new Exception($localize->get('Undefined') . ': ' . $localize->get('Package'));
        }
        
        $struct = array(
            "packetentryid" => (integer)$_POST['packetentryid'],
            "packetid" => (integer)$_POST['packetid'],
            "name" => (string)$_POST['name'],
            "blockstate" => 3,
            "rate" => (integer)$_POST['disctype'] == 1 ? 0 : (float)$_POST['discount'],
            "discount" => (integer)$_POST['disctype'] == 1 ? (float)$_POST['discount'] : 0
        );
        
        if(false == $lanbilling->save('insupdPacketEntry', $struct, $struct['packetentryid'] == 0 ? true : false)) {
            throw new Exception($localize->get($lanbilling->soapLastError()->detail));
        }
        
        $struct['packetentryid'] = $lanbilling->saveReturns->ret;
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
            "results" => $struct
        );
    }

    echo "(" . JEncode($_response, $lanbilling) . ")";
} // end setPackEntry()


/**
 * Remove packet entry
 * @param   object, main class
 */
function delPacketEntry( &$lanbilling, &$localize )
{
    if($lanbilling->getAccess('packages') < 2) {
        echo '({ success: false, reason: "' . $localize->get('You dont have rights to complete this action') . '" })';
        return false;
    }
    try {
        if( false == $lanbilling->delete("delPacketEntry", array("id" => $_POST['packetentryid'])) ) {
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
            "success" => true
        );
    }
	if(!$_POST['setpackentry'] && $_POST['setpackentry'] == '') {
		echo "(" . JEncode($_response, $lanbilling) . ")";
	}
} //end delPacketEntry()


/**
 * Get packet entry tariffs
 * @param   object, billing class
 * @param   object, localize class
 */
function getPacketEntryTariffs( &$lanbilling, &$localize )
{
    if($lanbilling->getAccess('packages') < 1) {
        echo '({ success: false, reason: "' . $localize->get('You dont have rights to complete this action') . '" })';
        return false;
    }
    try {
        $_filter = array(
            "parentid" => (integer)$_POST['packetentryid']
        );
        
        if(false === ($result = $lanbilling->get("getPacketTariffs", array("flt" => $_filter))))
        {
            throw new Exception($localize->get($lanbilling->soapLastError()->detail));
        }
        
        if((integer)$_POST['packetid'] > 0) {
            $packet = $lanbilling->get("getPacket", array("id" => $_POST['packetid']));
        }
        
        if(!empty($result)) {
            if(!is_array($result)) {
                $result = array($result);
            }
            
            array_walk($result, create_function('&$item, $key, $_tmp', '
                $A = array(
                    "recordid" => $item->packettariff->packettariffid,
                    "packetentryid" => $item->packettariff->packetentryid,
                    "packetid" => (integer)$_tmp[0]->packetid,
                    "tariffid" => $item->packettariff->tariffid,
                    "tarname" => $item->tarname,
                    "state" => (integer)$_tmp[0]->state
                );
                
                $item = $A;
            '), array( &$packet ));
            
            $_count = $lanbilling->get("Count", array("flt" => $_filter, "procname" => "getPacketTariffs"));
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
            "results" => (array)$result,
            "total" => (integer)$_count
        );
    }

    echo "(" . JEncode($_response, $lanbilling) . ")";
} // end getPacketEntryTariffs()


/**
 * Insert / Update packet entry tariff information
 * @param   object, billing class
 * @param   object, localize class
 */
function setPacketEntryTariff( &$lanbilling, &$localize )
{
    if($lanbilling->getAccess('packages') < 2) {
        echo '({ success: false, reason: "' . $localize->get('You dont have rights to complete this action') . '" })';
        return false;
    }
    try {
        if((integer)$_POST['packetentryid'] == 0) {
            throw new Exception($localize->get('Undefined') . ': ' . $localize->get('Template'));
        }
        $arrtar = explode(',', $_POST['tarid']);
        foreach($arrtar as $tarid) {
			$struct = array(
				"packettariffid" => (integer)$_POST['recordid'],
				"packetentryid" => (integer)$_POST['packetentryid'],
				"tariffid" => (integer)$tarid
			);
		 
			if(false == $lanbilling->save('insPacketTariff', $struct, true)) {
				throw new Exception($localize->get($lanbilling->soapLastError()->detail));
			}
		}
		        
        $struct['recordid'] = $lanbilling->saveReturns->ret;
    }
    catch(Exception $error) {
		if(preg_match("/\bpacket_tariffs_uk_tariff_id\b/i", $error->getMessage()))	$err = "Tarif is already assigned";
		else $err = $error->getMessage();
		
        $_response = array(
            "success" => false,
            "error" => $localize->get($err)
        );
    }
    
    if(!$_response) {
        $_response = array(
            "success" => true,
            "results" => $struct
        );
    }

    echo "(" . JEncode($_response, $lanbilling) . ")";
} // end setPacketEntryTariff()


/**
 * Remove packet entry tariff information
 * @param   object, main class
 */
function delPacketEntryTariff( &$lanbilling, &$localize )
{
    if($lanbilling->getAccess('packages') < 2) {
        echo '({ success: false, reason: "' . $localize->get('You dont have rights to complete this action') . '" })';
        return false;
    }
    try {
        if( false == $lanbilling->delete("delPacketTariff", array("id" => (integer)$_POST['recordid'])) ) {
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
            "success" => true
        );
    }

    echo "(" . JEncode($_response, $lanbilling) . ")";
} //end delPacketEntryTariff()


/**
 * According to the filter there will be returned the list or the whole package data
 * @param   object, billing class
 * @param   object, localize class
 */
function getUserPackets( &$lanbilling, &$localize )
{
    if($lanbilling->getAccess('packages') < 1) {
        echo '({ success: false, reason: "' . $localize->get('You dont have rights to complete this action') . '" })';
        return false;
    }
    try {
        /**
         * recordid -> userpacketid
         * parentid -> packetid
         * userid   -> uid
         */
        $_filter = array(
            "recordid" => (integer)$_POST['userpacketid'],
            "packetid" => (integer)$_POST['packetid'],
            "userid" => (integer)$_POST['userid']
        );
        
        if($_POST['showusers'] == 1) {
			$_filter = array(
				"parentid" => (integer)$_POST['packetid']
			);
		} 

        if(false === ($result = $lanbilling->get("getUserPackets", array("flt" => $_filter))))
        {
            throw new Exception($localize->get($lanbilling->soapLastError()->detail));
        }
        
        if(!empty($result)) {
            if(!is_array($result)) {
                $result = array($result);
            }
            
            if((integer)$_POST['onlyenries'] == 0) {
                array_walk($result, create_function('&$item, $key, $_tmp', '
                    if($_tmp[0]["userid"] > 0) {
                        $A = (array)$item->packet;
                        $A["userid"] = $A["uid"];
                        unset($A["uid"]);
                        
                        $A["packetname"] = $item->packetname;
                        $A["username"] = $item->username;
                        
                        $item = $A;
                    }
                '), array( &$_filter ));
            }
            else {			
                $packet = (array)$result[0]->packet;
                $result = (array)$result[0]->entries;
                
                array_walk($result, create_function('&$item, $key, $_tmp', '
                    $item->state = $_tmp[0]["state"];
                '), array( &$packet ) );
                
                if(!is_object($result[0]) && !is_array($result[0])) {
					$result = array((object)$result);
				}
                
            }
            
            if((integer)$_POST['userpacketid'] == 0) {
                $_count = $lanbilling->get("Count", array("flt" => $_filter, "procname" => "getUserPackets"));
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
            "results" => (array)$result,
            "total" => (integer)$_count
        );
        
        if((integer)$_POST['userpacketid'] > 0 && (integer)$_POST['onlyenries'] == 0) {
            $_response['data'] = $_response['results'][0];
            unset($_response['results']);
        }
    }

    echo "(" . JEncode($_response, $lanbilling) . ")";
} // end getUserPackets()



/**
 * Getting users assigned to packet
 * @param   object, billing class
 * @param   object, localize class
 */
function getPackageUsers( &$lanbilling, &$localize )
{
    if($lanbilling->getAccess('packages') < 1) {
        echo '({ success: false, reason: "' . $localize->get('You dont have rights to complete this action') . '" })';
        return false;
    }
    try {

		$_filter = array(
			"parentid" => (integer)$_POST['getpackageusers']
		);

        if(false === ($result = $lanbilling->get("getUserPackets", array("flt" => $_filter))))
        {
            throw new Exception($localize->get($lanbilling->soapLastError()->detail));
        }
        
        if(!empty($result)) {
            if(!is_array($result)) {
                $result = array($result);
            }
		
		$newResult = array();
		foreach($result as $res) {
			if(!is_array($res->entries)) $res->entries = array($res->entries);
			foreach($res->entries as $ent) {
				$vglogin = $ent->vglogin;
				$dateto = $res->packet->dateto;
				$datefrom = $res->packet->datefrom;
				$nres = array('vglogin'=>$vglogin, 'datefrom'=>$datefrom, 'dateto'=>$dateto);
				array_push($newResult, (object)$nres);
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
            "results" => (array)$newResult
        );
    }

    echo "(" . JEncode($_response, $lanbilling) . ")";
} // end getUserPackets()




/**
 * Insert/ Update user packet information
 * @param   object, billing class
 * @param   object, localize class
 */
function setUserPacket( &$lanbilling, &$localize )
{
    if($lanbilling->getAccess('packages') < 2) {
        echo '({ success: false, reason: "' . $localize->get('You dont have rights to complete this action') . '" })';
        return false;
    }

    try {
        if(preg_match("/^\d{2}\.\d{2}\.\d{2}$/", $_POST['datefrom'])) {
            $_POST['datefrom'] = implode('-', array_reverse(explode('.', $_POST['datefrom'])));
            $_POST['datefrom'] = $lanbilling->formatDate(sprintf("%s 00:00:00", $_POST['datefrom']), "Y-m-d H:i:s");
        }
        else {
            $_POST['datefrom'] = date('Y-m-d H:i:s');
        }
        
        if(preg_match("/^\d{2}\.\d{2}\.\d{2}$/", $_POST['dateto'])) {
            $_POST['dateto'] = implode('-', array_reverse(explode('.', $_POST['dateto'])));
            $_POST['dateto'] = $lanbilling->formatDate(sprintf("%s 00:00:00", $_POST['dateto']), "Y-m-d H:i:s");
        }
        else {
            $_POST['dateto'] = '';
        }
        
        $struct = array(
            "packet" => array(
                "userpacketid" => (integer)$_POST['userpacketid'],
                "packetid" => (integer)$_POST['packetid'],
                "uid" => (integer)$_POST['userid'],
                "datefrom" => $_POST['datefrom'],
                "dateto" => $_POST['dateto'],
                "comment" => (string)$_POST['comment']
            ),
            "entries" => array()
        );
        
        if(is_array($_POST['entries'])) {
            array_walk($_POST['entries'], create_function('$item, $key, $_tmp', '
                $A = json_decode($item);
                $_tmp[0]["entries"][] = array(
                    "packetentryid" => $A->packetentryid,
                    "vgid" => $A->vgid
                );
            '), array( &$struct ));
        }
        
        if(false == $lanbilling->save('insupdUserPacket', $struct, (integer)$_POST['userpacketid'] == 0 ? true : false)) {
            throw new Exception($localize->get($lanbilling->soapLastError()->detail));
        }
        
        $data = $struct["packet"];
        $data["userpacketid"] = $lanbilling->saveReturns->ret;
    }
    catch(Exception $error) {
        $_response = array(
            "success" => false,
            "str" => $struct,
            "error" => $error->getMessage()
        );
    }
    
    if(!$_response) {
        $_response = array(
            "success" => true,
            "data" => $data
        );
    }

    echo "(" . JEncode($_response, $lanbilling) . ")";
} // end setUserPacket()
