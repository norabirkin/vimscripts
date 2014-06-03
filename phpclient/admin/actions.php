<?php
/**
 * Promotions control functions
 *
 */

// There is background query
if(isset($_POST['async_call']))
{
    if(isset($_POST['getpromo'])) {
        getPromotions($lanbilling, $localize);
    }
    
    if(isset($_POST['delpromo'])) {
        delPromotions($lanbilling, $localize);
    }
	
	if(isset($_POST['delpromostaff'])) {
        delPromotionsStaff($lanbilling, $localize);
    }
    
    if(isset($_POST['setpromo'])) {
        setPromotion($lanbilling, $localize);
    }
    
    if(isset($_POST['setpromostaff'])) {
        setPromoStaff($lanbilling, $localize);
    }
    
    if(isset($_POST['getpromostaff'])) {
        getPromoStaff($lanbilling, $localize);
    }
    
    if(isset($_POST['getpromotarifs'])) {
        getPromoTarifs($lanbilling, $localize);
    }
    
    if(isset($_POST['setpromotars'])) {
        setPromoTarif($lanbilling, $localize);
    }
    
    if(isset($_POST['delpromotars'])) {
        delPromoTarif($lanbilling, $localize);
    }
}
// There is standart query
else
{
	// Parse HTML template to start Panel rendering
	$tpl = new HTML_Template_IT(TPLS_PATH);
	$tpl->loadTemplatefile("actions.tpl", true, true);
	$tpl->touchBlock("__global__");
	$tpl->setVariable('AUTOLOAD', (integer)$lanbilling->Option('autoload_accounts'));
	$localize->compile($tpl->get(), true);
}


/**
 * Get promotions items (actions)
 * @param   object, main class
 * @param   object, localize
 */
function getPromotions( &$lanbilling, &$localize )
{
    try {
        $filter = array(
            "category" => !isset($_POST['category']) ? -1 : (integer)$_POST['category']
        );
		
        if( false === ($result = $lanbilling->get("getActions", array("flt" => $filter))) )
        {
            throw new Exception ($lanbilling->soapLastError()->detail);
        }
		
        if(!is_array($result)) {
            $result = array($result);
        }
    }
    catch(Exception $error) {
        $_response = array(
            "results" => array(),
            "total" => 0,
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
} // end getPromotions()


/**
 * Add tariff to the promotion
 */
function delPromotions( &$lanbilling, &$localize )
{
    try {
        if( false == $lanbilling->delete("delAction", array("id" => (integer)$_POST['recordid']), array("getActions")) ) {
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
            "error" => null
        );
    }
    
    echo "(" . JEncode($_response, $lanbilling) . ")";
} // end delPromotions()

function delPromotionsStaff(&$lanbilling, &$localize) 
{
	//delActionStaff
	try {
        if( false == $lanbilling->delete("delActionStaff", array("id" => (integer)$_POST['recordid']), array("getActionsStaff")) ) {
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
            "error" => null
        );
    }
    
    echo "(" . JEncode($_response, $lanbilling) . ")";
}


/**
 * Get promotions staff
 * @param   object, main class
 * @param   object, localize
 */
function getPromoStaff( &$lanbilling, &$localize )
{
    $_tmp = array();
    
    try {
        $filter = array(
            "actionid" => (integer)$_POST['actionid'],
            "agrmid" => (integer)$_POST['agrmid'],
            "vgid" => (integer)$_POST['vgid'],
            "pgsize" => ((integer)$_POST['limit'] <= 0) ? 100 : $_POST['limit']
        );
        
        $filter['pgnum'] = $lanbilling->linesAsPageNum($filter['pgsize'], (integer)$_POST['start'] + 1);
        
        $_md5 = $lanbilling->controlSum($filter);

        if(false === ($result = $lanbilling->get('getActionsStaff', array('flt' => $filter, 'md5' => $_md5)))) {
            throw new Exception ($lanbilling->soapLastError()->detail);
        }
        
        if($result) {
            if(!is_array($result)) {
                $result = array($result);
            }
            
            $_count = $lanbilling->get("Count", array("flt" => $filter, "procname" => "getActionsStaff", "md5" => $_md5));
            
            array_walk($result, create_function('$item, $key, $_tmp', '
                $item->staff->dtfrom = (integer)$item->staff->dtfrom == 0 ? "" : $item->staff->dtfrom;
                $item->staff->dtto = (integer)$item->staff->dtto == 0 ? "" : $item->staff->dtto;
                
                $_tmp[0][] = array(
                    "actionid" => $item->staff->actionid,
                    "recordid" => $item->staff->recordid,
                    "uid" => $item->staff->uid,
                    "userlogin" => $item->userlogin,
                    "username" => $item->username,
                    "tarid" => $item->staff->tarid,
                    "tardescr" => $item->tardescr,
                    "agrmnum" => $item->agrmnum,
                    "agrmid" => $item->staff->agrmid,
                    "vglogin" => $item->vglogin,
                    "vgid" => $item->staff->vgid,
                    "actionname" => $item->actionname,
                    "dtfrom" => $item->staff->dtfrom,
                    "dtto" => $item->staff->dtto,
                    "personid" => $item->personid,
                    "mgrname" => $item->mgrname
                );
            '), array( &$_tmp ));
        }
    }
    catch(Exception $error) {
        $_response = array(
            "results" => array(),
            "total" => 0,
            "success" => false,
            "error" => $error->getMessage()
        );
    }
    
    if(!$_response) {
        $_response = array(
            "results" => (array)$_tmp,
            "total" => (integer)$_count,
            "success" => true,
            "error" => null
        );
    }
    
    echo "(" . JEncode($_response, $lanbilling) . ")";
} // end getPromoStaff()


/**
 * Aply promotion to the specified item (agrmid || vgid)
 * or update existing
 * @param   object, main class
 * @param   object localize
 */
function setPromoStaff( &$lanbilling, &$localize )
{
    try {
        if((integer)$_POST['actionid'] == 0) {
            throw new Exception($localize->get("Undefined") . ": " . $localize->get("Promotion"));
        }
        
        /*if((integer)$_POST['agrmid'] == 0 && (integer)$_POST['vgid'] == 0) {
            throw new Exception($localize->get("Undefined") . ": " . $localize->get("Agreements") . " / " . $localize->get("Account"));
        }*/
        
        if(preg_match("/\d{2}\.\d{2}\.\d{4}/", $_POST['dtfrom'])) {
            $_POST['dtfrom'] = explode('.', $_POST['dtfrom']);
            $_POST['dtfrom'] = implode('-', array_reverse($_POST['dtfrom']));
        }
        else if(preg_match("/\d{4}\-\d{2}\-\d{2}/", $_POST['dtfrom'])) {
            $_POST['dtfrom'] = str_replace(array('T'), ' ', $_POST['dtfrom']);
        }
        
        if(preg_match("/\d{2}\.\d{2}\.\d{4}/", $_POST['dtto'])) {
            $_POST['dtto'] = explode('.', $_POST['dtto']);
            $_POST['dtto'] = implode('-', array_reverse($_POST['dtto']));
        }
        else if(preg_match("/\d{4}\-\d{2}\-\d{2}/", $_POST['dtto'])) {
            $_POST['dtto'] = str_replace(array('T'), ' ', $_POST['dtto']);
        }
        
        if(is_array($_POST['members']) && !empty($_POST['members'])) {
            foreach($_POST['members'] as $item) {
                $struct = array(
                    "recordid" => (integer)$_POST['recordid'],
                    "actionid" => (integer)$_POST['actionid'],
                    "uid" => (integer)$item['uid'],
                    "agrmid" => (integer)$item['agrmid'],
                    "vgid" => (integer)$item['vgid'],
                    "dtfrom" => $_POST['dtfrom'],
                    "dtto" => $_POST['dtto']
                );
                
                if( false == $lanbilling->save("insupdActionStaff", $struct, $struct['recordid'] == 0 ? true : false, array("getActionsStaff")) ) {
					$error = $lanbilling->soapLastError()->detail;
					
					if(preg_match("~Object already take part in action (.*) from (.*) to (.*)~is",$error, $matches)){
						$error = $localize->get('Object already take part in action') . ' "'.$matches[1].'" (' . $matches[2] . ' - ' . $matches[3] . ')';
					} else
					if(preg_match("~Action can be started from (.*) to (.*)~is",$error, $matches)){
						$error = $localize->get('Action can be started in period') .' (' . $matches[1] . ' - ' . $matches[2] . ')';
					} else
					if (preg_match("~There is period lock.*(\d{4}\-\d{2}\-\d{2})~is",$error, $matches)){
						$error = '<br/>' . $localize->get('Period is locked') . '! ' . $localize->get('You cannot make changes before then') . ' ' . $matches[1];
					} else {
						$error =  $localize->get($error);
					}
		
                    throw new Exception($error);
                }
            }
        }
    }
    catch(Exception $error) {
        $errorMessage = $error->getMessage();
        $errorParams = array();
        if (preg_match('/^Action (.*) can be started from ([0-9]{4}-[0-9]{2}-[0-9]{2}) to ([0-9]{4}-[0-9]{2}-[0-9]{2})$/', $errorMessage, $errorParams)) {
            $errorMessage = strtr($localize->get('Action name can be started from date1 to date2'), array(
                'name' => $errorParams[1],
                'date1' => $errorParams[2],
                'date2' => $errorParams[3]
            ));
        } elseif (preg_match('/^There is period lock\. You cannot affect data earlier than ([0-9]{4}-[0-9]{2}-[0-9]{2})$/', $errorMessage, $errorParams)) {
            $errorMessage = strtr($localize->get('There is period lock. You cannot affect data earlier than'), array(
                '%s' => $errorParams[1]
            ));
        }
        $_response = array(
            "success" => false,
            "error" => $errorMessage
        );
    }
    
    if(!$_response) {
        $_response = array(
            "success" => true,
            "error" => null
        );
    }
    
    echo "(" . JEncode($_response, $lanbilling) . ")";
} // end setPromoStaff()


/**
 * Add new promo or edit existing
 * @param   object, main billing class
 * @param   object, localize
 */
function setPromotion( &$lanbilling, &$localize )
{
    try {
        if(preg_match("/\d{2}\.\d{2}\.\d{4}/", $_POST['dtfromstart'])) {
            $_POST['dtfromstart'] = explode('.', $_POST['dtfromstart']);
            $_POST['dtfromstart'] = implode('-', array_reverse($_POST['dtfromstart']));
        }
        else if(preg_match("/\d{4}\-\d{2}\-\d{2}/", $_POST['dtfromstart'])) {
            $_POST['dtfromstart'] = str_replace(array('T'), ' ', $_POST['dtfromstart']);
        }
        
        if(preg_match("/\d{2}\.\d{2}\.\d{4}/", $_POST['dtfromend'])) {
            $_POST['dtfromend'] = explode('.', $_POST['dtfromend']);
            $_POST['dtfromend'] = implode('-', array_reverse($_POST['dtfromend']));
        }
        else if(preg_match("/\d{4}\-\d{2}\-\d{2}/", $_POST['dtfromend'])) {
            $_POST['dtfromend'] = str_replace(array('T'), ' ', $_POST['dtfromend']);
        }
        
        if(preg_match("/\d{2}\.\d{2}\.\d{4}/", $_POST['dtto'])) {
            $_POST['dtto'] = explode('.', $_POST['dtto']);
            $_POST['dtto'] = implode('-', array_reverse($_POST['dtto']));
        }
        else if(preg_match("/\d{4}\-\d{2}\-\d{2}/", $_POST['dtto'])) {
            $_POST['dtto'] = str_replace(array('T'), ' ', $_POST['dtto']);
        }
		
        $struct = array(
            "recordid" => (integer)$_POST['recordid'],
            "name" => (string)$_POST['name'],
            "descr" => (string)$_POST['descr'],
            "link" => (string)$_POST['link'],
            "object" => (integer)$_POST['object'],
            "dtfromstart" => $_POST['dtfromstart'],
            "dtfromend" => $_POST['dtfromend'],
            "dtto" => $_POST['dtto'],
            "daycount" => (integer)$_POST['daycount'],
            "type" => (integer)$_POST['type'],
            "uuid" => (string)$_POST['uuid'],
            "script" => (string)$_POST['script'],
            "forcorporation" => $_POST['forcorporation']=='on'? 1: 0,
            "forindividual" => $_POST['forindividual']=='on'? 1: 0,
            "positivebalance" => $_POST['positivebalance']=='on'? 1: 0,
            "notblocked1" => $_POST['notblocked1']=='on'? 1: 0,
            "modifyrent" => $_POST['modifyrent']=='on'? 1: 0,
            "modifyabove" => $_POST['modifyabove']=='on'? 1: 0,
            "modifyshape" => $_POST['modifyshape']=='on'? 1: 0,
            "available" => $_POST['available']=='on'? 1: 0

        );
        if( false == $lanbilling->save("insupdAction", $struct, $struct['recordid'] == 0 ? true : false, array("getActions")) ) {
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
            "error" => null
        );
    }
    
    echo "(" . JEncode($_response, $lanbilling) . ")"; 
} // end setPromotion()


/**
 * Show free tariffs
 * @param   object, main billing class
 * @param   object, localize
 */
function getPromoTarifs( &$lanbilling, &$localize )
{
    try {
        $filter = array(
            "tardescr" => (string)$_POST['fullsearch'],
            "notgroups" => (integer)$_POST['notgroups'],
            "actionid" => (integer)$_POST['actionid'],
            "pgsize" => ((integer)$_POST['limit'] <= 0) ? 100 : $_POST['limit']
        );
        
        $filter['pgnum'] = $lanbilling->linesAsPageNum($filter['pgsize'], (integer)$_POST['start'] + 1);
        
        $_md5 = $lanbilling->controlSum($filter);

        if(false === ($result = $lanbilling->get('getActionsTariffs', array('flt' => $filter, 'md5' => $_md5)))) {
            throw new Exception ($lanbilling->soapLastError()->detail);
        }
        
        if($result) {
            if(!is_array($result)) {
                $result = array($result);
            }
            
            $_count = $lanbilling->get("Count", array("flt" => $filter, "procname" => "getActionsTariffs", "md5" => $_md5));
            
            array_walk($result, create_function('$item, $key, $_tmp', '
                $_tmp[0][] = array(
                    "recordid" => $item->acttariff->recordid,
                    "actionid" => $item->acttariff->actionid,
                    "tarid" => $item->acttariff->tarid,
                    "actionname" => $item->actionname,
                    "tardescr" => $item->tardescr
                );
            '), array( &$_tmp ));
        }
    }
    catch(Exception $error) {
        $_response = array(
            "results" => array(),
            "total" => 0,
            "success" => false,
            "error" => $error->getMessage()
        );
    }
    
    if(!$_response) {
        $_response = array(
            "results" => (array)$_tmp,
            "total" => (integer)$_count,
            "success" => true,
            "error" => null
        );
    }
    
    echo "(" . JEncode($_response, $lanbilling) . ")";
} // end getTarifs()


/**
 * Add tariff to the promotion
 */
function setPromoTarif( &$lanbilling, &$localize )
{
    try {
        if(is_array($_POST['promotar']) && !empty($_POST['promotar'])) {
            foreach($_POST['promotar'] as $item) {
                $struct = array(
                    "recordid" => (integer)$item['recordid'],
                    "actionid" => (integer)$_POST['actionid'],
                    "tarid" => (integer)$item['tarid']
                );
                
                if( false == $lanbilling->save("insupdActionTariff", $struct, $struct['recordid'] == 0 ? true : false, array("getActionsTariffs")) ) {
                    throw new Exception($lanbilling->soapLastError()->detail);
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
            "error" => null
        );
    }
    
    echo "(" . JEncode($_response, $lanbilling) . ")";
} // end setPromoTarif()


/**
 * Add tariff to the promotion
 */
function delPromoTarif( &$lanbilling, &$localize )
{
    try {
        if(is_array($_POST['promotar']) && !empty($_POST['promotar'])) {
            foreach($_POST['promotar'] as $item) {
                if( false == $lanbilling->delete("delActionTariff", array("id" => (integer)$item['recordid']), array("getActionsTariffs")) ) {
                    throw new Exception($lanbilling->soapLastError()->detail);
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
            "error" => null
        );
    }
    
    echo "(" . JEncode($_response, $lanbilling) . ")";
} // end delPromoTarif()
