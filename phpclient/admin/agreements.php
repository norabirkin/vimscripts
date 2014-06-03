<?php
/**
 * Engine to view and control agreements
 *
 * Repository information:
 * $Date: 2009-12-23 12:44:13 $
 * $Revision: 1.11.2.57 $
 */

// There is background query
if(isset($_POST['async_call']))
{
	if($_POST['getagrms']) {
		getAgreementsList($lanbilling, $localize);
	}

	if($_POST['getopers']) {
		getOperators($lanbilling, $localize);
	}

	if($_POST['getcurr']) {
		getCurrency($lanbilling, $localize);
	}

	if($_POST['setagrm']) {
		setAgreement($lanbilling, $localize);
	}
	
	if(isset($_POST['getavailablepaymethods'])) {
        getAvailablePayMethods($lanbilling, $localize);
    }
}
else {
	$tpl = new HTML_Template_IT(TPLS_PATH);
	$tpl->loadTemplatefile("agreements.tpl", true, true);
	$tpl->touchBlock('__global__');
    $tpl->setVariable('AUTOLOAD', (integer)$lanbilling->Option('autoload_accounts'));
	$localize->compile($tpl->get(), true);
}

/**
 * Get the list of agreements using filter parameters
 * @param	object, main billing class
 * @param	object, localize class
 */
function getAgreementsList( &$lanbilling, &$localize )
{
	$_tmp = array();

	$_filter = array(
		"personid" => $lanbilling->manager,
		"ugroups" => (integer)$_POST['getusers'],
		"istemplate" => (integer)$_POST['istemplate']
	);

	try {
		$_filter['pgsize'] = ((integer)$_POST['limit'] <= 0) ? 100 : $_POST['limit'];
		$_filter['pgnum'] = $lanbilling->linesAsPageNum($_filter['pgsize'], (integer)$_POST['start'] + 1);
		$_filter['onfly'] = $lanbilling->boolean($_POST['isauto']) ? 1 : 0;

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
			switch((integer)$_POST['searchtype'])
			{
				case 0: $_filter['name'] = $_POST['fullsearch']; break;
				case 1: $_filter['agrmnum'] = $_POST['fullsearch']; break;
				case 2: $_filter['login'] = $_POST['fullsearch']; break;
				case 3: $_filter['vglogin'] = $_POST['fullsearch']; break;
				case 4: $_filter['email'] = $_POST['fullsearch']; break;
				case 5: $_filter['phone'] = $_POST['fullsearch']; break;
				case 6: $_filter['code'] = $_POST['fullsearch']; break;
				case 7: $_filter['address'] = $_POST['fullsearch']; break;
				case 10:
					$str_arr = explode(" ", $_POST['fullsearch']);
					$_tmp = array();

					foreach($str_arr as $_val) {
						if(empty($_val)) continue;
						$cons = $lanbilling->consonant($_val);
						if($cons[1] < 3) continue;
						$_tmp[] = $cons[0];
					}

					if(sizeof($_tmp) > 0) {
						$_filter['namesound'] = implode("|", $_tmp);
					}
				break;
				default: $_POST['fullsearch'];
			}
		}

		// Prepare clone with incremented timeout
		$lb = $lanbilling->cloneMain(array('query_timeout' => 380));

		$_md5 = $lanbilling->controlSum($_filter);

		$_count = $lb->get("Count", array("flt" => $_filter, "procname" => "getAgreements", "md5" => $_md5));

		if(false === ($result = $lb->get("getAgreements", array("flt" => $_filter, "md5" => $_md5)))) {
			throw new Exception($lb->soapLastError()->detail);
		}
		
		if(!empty($result) && !is_array($result)) {
			$result = array($result);
		}

        foreach ($result as $item) {
            $ablocktype = 0;
            $ablockvalue = 0;
            if($item->paymentmethod == 0){
                $ablocktype = 0;
                $ablockvalue = $item->blockdays;
                
                if ($item->blockmonths !=0){
                    $ablocktype = 1;
                    $ablockvalue = $item->blockmonths;
                }
                if ($item->blockamount != 0){
                    $ablocktype = 2;
                    $ablockvalue = $item->blockamount;
                }
            }
            $item->ablocktype = $ablocktype;
            $item->ablockvalue = $ablockvalue;
        }

		array_walk($result, create_function('&$item, $key, $_tmp', '
			if($item->addons && !is_array($item->addons)) {
				$item->addons = array($item->addons);
			}
		'));

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
			"results" => (array)$result
		);
	}

	echo '(' . JEncode($_response, $lanbilling) . ')';
} // end getAgreementsList()


/**
 * Get operators list
 * @param	object, main billing class
 * @param	object, localize class
 */
function getOperators( &$lanbilling, &$localize )
{
	try {
		if( false === ($result = $lanbilling->get('getAccounts', array('flt' => array('category' => 1)))) )
		{
			throw new Exception($lanbilling->soapLastError()->detail);
		}

		if(!is_array($result)) {
			$result = array($result);
		}

		$_tmp = array();

		array_walk($result, create_function('$item, $key, $_tmp', '
			$_tmp[0][] = (array)$item->account;
		'), array( &$_tmp ));

		unset($result);
	}
	catch(Exception $error) {
		$_response = array(
			"success" => false,
			"error" => $error->getMessage(),
			"results" => array()
		);
	}

	if(!$_response) {
		$_response = array(
			"success" => true,
			"results" => $_tmp ? $_tmp : array()
		);
	}

	echo '(' . JEncode($_response, $lanbilling) . ')';
} // end getOperators()




/**
 * Get currency list
 * @param	object, main class
 * @param	object, localize class
 */
function getCurrency( &$lanbilling, &$localize )
{
	try {
		if( false === ($result = $lanbilling->get("getCurrencies")) ) {
			throw new Exception($lanbilling->soapLastError()->detail);
		}

		if(!is_array($result)) {
			$result = array($result);
		}

		array_walk($result, create_function('$item, $key, $_tmp', '
			if($item->id == 0) {
				unset($_tmp[0][$key]);
			}
		'), array( &$result ));

		$result = array_values($result);
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

	echo '(' . JEncode($_response, $lanbilling) . ')';
} // end getCurrency()


/**
 * Save received agreement data
 * @param	object, main class
 * @param	object, localize class
 */
function setAgreement( &$lanbilling, &$localize )
{
	try {
		// Additional fields for agreements
		if( false != ($AAddonsSet = $lanbilling->get("getAgreementsAddonsSet", array('flt' => array()))) ){
			if(!is_array($AAddonsSet)) {
				$AAddonsSet = array($AAddonsSet);
			}
		}
		else {
			$AAddonsSet = array();
		}

        $ablocktype = 0;
        $ablockvalue = 0;
        if($_POST['paymentmethod'] == 0){
                $blockdays = $_POST['ablocktype'] == 0 ? $_POST['ablockvalue'] : 0;
                $blockmonths = $_POST['ablocktype'] == 1 ? $_POST['ablockvalue'] : 0;
                $blockamount  = $_POST['ablocktype'] == 2 ? $_POST['ablockvalue'] : 0;
        }

		$struct = array(
			"agrmid" => (integer)$_POST['agrmid'],
			"operid" => (integer)$_POST['operid'],
			"curid" => (integer)$_POST['curid'],
			"uid" => (integer)$_POST['uid'],
			"number" => $_POST['number'],
			"date" => $_POST['date'],
			"credit" => $_POST['credit'],
			"code" => $_POST['code'],
			"bnotify" => $lanbilling->boolean($_POST['bnotify']) ? 1 : 0,
			"blimit" => (float)$_POST['blimit'],
			"penaltymethod" => (integer)$_POST['penaltymethod'],
			"ownerid" => (integer)$_POST['ownerid'],
            "blockdays" => (integer)$blockdays,
            "blockmonths" => (integer)$blockmonths,
            "blockamount" => (integer)$blockamount
		);

		$addon = array();

		if(!empty($AAddonsSet) && isset($_POST['agrmaddons'])) {
			foreach($AAddonsSet as $item) {
				if(!isset($_POST['agrmaddons'][$item->addon->name]) ||
					($item->addon->type == 1 && (integer)$_POST['agrmaddons'][$item->addon->name] == 0)) {
					continue;
				}

				$addon[] = array(
					"agrmid" => (integer)$_POST['agrmid'],
					"type" => $item->addon->type,
					"idx" => ((integer)$item->addon->type == 1) ? (integer)$_POST['agrmaddons'][$item->addon->name] : '',
					"name" => $item->addon->name,
					"descr" => '',
					"strvalue" => ((integer)$item->addon->type == 0) ? $_POST['agrmaddons'][$item->addon->name] : ''
				);
			}
		}

		if(!empty($addon)) {
			$struct["addons"] = $addon;
		}

		if(false == $lanbilling->save("insupdAgreement", $struct, (integer)$_POST['agrmid'] == 0 ? true : false)) {
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

	echo '(' . JEncode($_response, $lanbilling) . ')';
} // end setAgreement()

/**
 * Get available payment methods for agreement
 * @param	object, main class
 * @param	object, localize class
 */
function getAvailablePayMethods( &$lanbilling, $localize )
{
    try {
		if($_POST['agrmid'] ==0){
			$result = array ("0" => 0,"1" => 1,"2" => 2);
		}
		else
		{
	        if( false === ($result = $lanbilling->get("getAgrmAvailablePayMethods", array("agrmid" => (integer)$_POST['agrmid']))) ) {
	            throw new Exception ($lanbilling->soapLastError()->detail);
	        }
	
	        if($result) {
	            if(!is_array($result)) {
	                $result = array($result);
	            }
	        }
		} 

		$agrmtypelist = array( 
			0 => $localize->get("Advance"),
			1 => $localize->get("Credit acc"),
			2 => $localize->get("Mixed")
		);
		
        $_tmp = array();
        foreach($result as $item){
	        $_tmp[] = array(
	            "id" => $item,
	            "name" => $agrmtypelist[$item]
	        );
        }
    }
    catch(Exception $error) {
        $_response = array(
            "success" => false,
            "error" => $error
        );
    }

    if(!$_response) {
        $_response = array(
            "success" => true,
            "results" => $_tmp
        );
    }

    echo "(" . JEncode($_response, $lanbilling) . ")";
} // end getAvailablePayMethods()
