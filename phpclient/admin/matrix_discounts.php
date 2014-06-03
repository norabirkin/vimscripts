<?php
/**
 * Matrix discounts control functions
 *
 */

// There is background query
if(isset($_POST['async_call']))
{
    if(isset($_POST['getmatrix'])) {
        getMatrixRules($lanbilling, $localize);
    }
    
    if(isset($_POST['setrule'])) {
        setMatrixDiscountRule($lanbilling, $localize);
    }
    
    if(isset($_POST['delrule'])) {
        delMatrixDiscountRule($lanbilling, $localize);
    }
}
// There is standart query
else
{
    // Parse HTML template to start Panel rendering
    $tpl = new HTML_Template_IT(TPLS_PATH);
    $tpl->loadTemplatefile("matrix_discounts.tpl", true, true);
    $tpl->touchBlock("__global__");
    $tpl->setVariable('AUTOLOAD', (integer)$lanbilling->Option('autoload_accounts'));
    $localize->compile($tpl->get(), true);
}


/**
 * Get matrix discounts rules
 * @param   object, billing class
 * @param   object, localize class
 */
function getMatrixRules( &$lanbilling, &$localize )
{
    try {
		$filter = array(
            "pgsize" => ((integer)$_POST['limit'] <= 0) ? 100 : (integer)$_POST['limit'],
        );
        $filter['pgnum'] = $lanbilling->linesAsPageNum($filter['pgsize'], (integer)$_POST['start'] + 1);
        
        if( false === ($result = $lanbilling->get("getDiscountAddons", array("flt" => $filter))) )
        {
            throw new Exception ($lanbilling->soapLastError()->detail);
        }        
        if($result && !is_array($result)) {
            $result = array($result);
        }
        //print_r($result);
        
        $_tmp = array();
        array_walk($result, create_function('$item, $key, $_tmp', '
			if((int)$item->actionid > 0) { $type = 1; $sid = (int)$item->actionid; }
			if((int)$item->packetid > 0) { $type = 2; $sid = (int)$item->packetid; }
			if((int)$item->individual > 0) { $type = 3; $sid = (int)$item->individual; }
			
			$_tmp[0][] = array(
				"id" => $item->recordid,
				"type" => (int)$type,
				"method" => $item->method,
				"descr" => $item->descr,
				"serviceid" => $sid
			);
		'), array( &$_tmp ));
		
        $count = $lanbilling->get("Count", array("flt" => $filter, "procname" => "getDiscountAddons", "md5" => ""));
    }
    catch(Exception $error) {
        $_response = array(
            "results" => array(),
            "success" => false,
            "error" => $error->getMessage()
        );
    }
    
    if(!$_response) {
        $_response = array(
            "success" => true,
            "total" => (int)$count,
            "error" => null,
            "results" => $_tmp
        );
    }
    
    echo "(" . JEncode($_response, $lanbilling) . ")";
} // end getMatrixRules()


/**
 * Set discount rule
 * @param   object, billing class
 * @param   object, localize class
 */
function setMatrixDiscountRule( &$lanbilling, &$localize )
{
    try {	
		
        $struct = array(
			"actionid" => ((int)$_POST['type'] == 1) ? (int)$_POST['serviceid'] : 0,
			"packetid" => ((int)$_POST['type'] == 2) ? (int)$_POST['serviceid'] : 0,
			"individual" => ((int)$_POST['type'] == 3) ? 1 : 0,
			"method" => (int)$_POST['method'],
            "recordid" => ((int)$_POST['id'] > 0) ? (int)$_POST['id'] : 0
        );
		//print_r($struct);
        // THERE IS NO isInsert parameter in this method!!!
        if( false == $lanbilling->save("insupdDiscountAddon", $struct, array("getDiscountAddons")) ) {
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
} // end setMatrixDiscountRule()


/**
 * Set discount rule
 * @param   object, billing class
 * @param   object, localize class
 */
function delMatrixDiscountRule( &$lanbilling, &$localize )
{
    try {
        if( false == $lanbilling->delete("delDiscountAddon", array("id" => (integer)$_POST['recordid']), array("getDiscountAddons")) ) {
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
} // end setMatrixDiscountRule()
