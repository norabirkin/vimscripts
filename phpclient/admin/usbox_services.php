<?php
/**
 * UsBox services management
 *
 * Repository information:
 * @date		$Date: 2014-04-18 13:57:19 +0400 (Пт., 18 апр. 2014) $
 * @revision	$Revision: 42781 $
 */

// There is background query
if(isset($_POST['async_call']))
{
	if(isset($_POST['getserv'])) {
		getUsBoxServices($lanbilling);
	}

	if(isset($_POST['gettarifs'])) {
		getUBTarifs($lanbilling);
	};

	if(isset($_POST['getcategories'])) {
		getUBCategories($lanbilling);
	}
	
	if(isset($_POST['getubvgroups'])) {
		getUBVgroups($lanbilling);
	}

	if(isset($_POST['saveubservice'])) {
		saveUBService($lanbilling, $localize);
	}

	if(isset($_POST['delservice'])) {
		delUBService($lanbilling, $localize);
	}

	if(isset($_POST['getctgrs'])) {
		getCategories($lanbilling);
	}
	
	if(isset($_POST['getcatrate'])) {
		getCategoryRate($lanbilling);
	}
}
// There is standard query
else
{
	$tpl = new HTML_Template_IT(TPLS_PATH);
	$tpl->loadTemplatefile("usbox_services.tpl", true, true);
	$tpl->touchBlock("__global__");
	$localize->compile($tpl->get(), true);
}


/**
 * Get UB assigned records
 * Available filter values:
 * Imperative: common
 * Possible: recordid(servid), agrmid, agrmnum, login (vglogin), vgid, username, tarid,
 * dtfrom (timefrom, date >=), dtto (timeto, date <)
 * @param	object, billing class
 */
 
function getUsBoxServices( &$lanbilling )
{
	if((integer)$_POST['vgid'] == 0)
	{
		$dateItem = create_function(
			'$item',
			'
				$item = explode(".", $item);
				if(sizeof($item) != 3) {
					return date("Y-m-d") . " 00:00:00";
				} else {
					return implode("-", array_reverse($item)) . " 00:00:00"; };
			'
		);

		if(!empty($_POST['timefrom'])) {
			$_POST['timefrom'] = $dateItem($_POST['timefrom']);
		}
		else {
			$_POST['timefrom'] = "0000-00-00 00:00:00";
		}

		if(!empty($_POST['timeto'])) {
			$_POST['timeto'] = $dateItem($_POST['timeto']);
		}
		else {
			$_POST['timeto'] = "9999-12-31 23:59:59";
		}
	}

	$_filter = array(
		"dtfrom" => $_POST['timefrom'],
		"dtto" => $_POST['timeto'],
		"common" => (integer)$_POST['getserv'],
		"tarid" => (integer)$_POST['searchtarif'],
		"category" => !isset($_POST['catid']) ? -1 : (integer)$_POST['catid'],
		"vgid" => (integer)$_POST['vgid'],
		"pgsize" => ((integer)$_POST['limit'] <= 0) ? 100 : $_POST['limit']
	);

	$_filter['pgnum'] = $lanbilling->linesAsPageNum($_filter['pgsize'], (integer)$_POST['start'] + 1);

	switch((integer)$_POST['searchtype'])
	{
		case 3: $_filter['descr'] = $_POST['search']; break;
		case 2: $_filter['login'] = $_POST['search']; break;
		case 1: $_filter['agrmnum'] = $_POST['search']; break;
		default: $_filter['name'] = $_POST['search'];
	}
	$_md5 = $lanbilling->controlSum($_filter);
	$_tmp = array();
	
	
	$_order = array(
		"name"     =>  "servid",
		"ascdesc"  =>  !isset($_POST['dir']) ? 0 : (($_POST['dir'] == "ASC") ? 0 : 1)
	);
	
	switch( $_POST['sort'] ) {
		case 'catdescr'  :  $_order['name']  =  'catdescr';  break;
		case 'timefrom'  :  $_order['name']  =  'timefrom';  break;
		case 'timeto'    :  $_order['name']  =  'timeto';    break;
		case 'personid'  :  $_order['name']  =  'personid';  break;
		default : 			$_order['name']  =  'servid';
	}
	
	$_md5  =  $lanbilling->controlSum( array_merge( $_filter , $_order ) );

	if( false != ($count = $lanbilling->get("Count", array("flt" => $_filter, "procname" => "getUsboxServices", "md5" => $_md5), true)) )
	{
		if( false != ($result = $lanbilling->get("getUsboxServices", array("flt" => $_filter, "ord" => $_order,  "md5" => $_md5))) )
		{
			if(!is_array($result)) {
				$result = array($result);
			}


		   
		   
//////////////
/// #6996		   
            foreach($result as $k=>$res) {
				$flt = array(
					'repnum' => 69,
					"recordid" =>  $res->service->servid,
					"vgid" => $res->service->vgid
				);
				
				if( false != ( $rate = $lanbilling->get("getStat", array("flt" => $flt)))) {
					$result[$k]->service->realrate = $result[$k]->service->rate;
					$result[$k]->service->rate = (float)$rate->data->val;
					
					// @36774 при rate = 0 обнуляем также и абсолютную скидку
                    if ((float)$rate->data->val  == 0) {
                            $result[$k]->service->discount = 0;
                    }
					
				}
		   }
		   
/// #6996		   
//////////////

		   
		   
			array_walk($result, create_function('$item, $key, $_tmp', '
                if (time() < strtotime($item->service->discounttimefrom) || time() > strtotime($item->service->discounttimeto)) {
                    $item->service->rate = 1;
                    $item->service->discount = 0;
                }
				$_tmp[0][] = array(
					"servid" => $item->service->servid,
					"vglogin" => $item->vglogin,
					"used" => $item->used,
					"timefrom" => $item->service->timefrom,
					"timeto" => $item->service->timeto,
					"username" => $item->username,
					"agrmnumber" => $item->agrmnumber,
					"vgid" => $item->service->vgid,
					"tarid" => $item->service->tarid,
					"mul" => $item->service->mul,
					"comment" => $item->service->comment,
					"catidx" => $item->service->catidx,
					"catdescr" => $item->catdescr,
					"catabove" => $item->catabove,
					"common" => $item->common,
					"personname" => $item->personname,
					"personid" => $item->service->personid,
					"externaldata" => $item->service->externaldata,
					"needcalc" => $item->service->needcalc,
					"realrate" => $item->service->realrate,
					"rate" => $item->service->rate,
					"accondate" => $item->accondate,
					"disctimefrom" => $item->service->discounttimefrom,
					"disctimeto" => $item->service->discounttimeto,
					"activated" => $item->service->activated,
					"discount" => $item->service->discount,
					"symbol" => $item->symbol
					);
				'), array( &$_tmp ));
		}
	}

	if(sizeof($_tmp) > 0) {
		echo '({"total": ' . $count . ', "results": ' . JEncode($_tmp, $lanbilling) . '})';
	}
	else echo '({ "total": 0, "results": "" })';
} // end getUsBoxServices()


/**
 * Get Tarifs list for the UsBox
 * @param	object, billing class
 */
function getUBTarifs( &$lanbilling )
{
	if( false == ($tarifs = $lanbilling->get("getTarifsExt", array("archive" => 0, "unavail" => -1, "common" => -1))) )
	{
		echo '({ "results": "" })';
		return false;
	}

	if(!is_array($tarifs)) {
		$tarifs = array($tarifs);
	}

	$_tmp = array();
	array_walk($tarifs, create_function('$item, $key, $_tmp', '
		if($item->tarif->type == 5){
			$_tmp[0][] = array(
				"id" => $item->tarif->tarid,
				"name" => $item->tarif->descr,
				"symbol" => $item->tarif->symbol
			);
		}'), array( &$_tmp ));

	if(sizeof($_tmp) > 0) {
		echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
	}
	else echo '({ "results": "" })';
} // end getUBTarifs()


/**
 * Get tarif categories and send them to selector
 * @param	object, billing class
 */
function getUBCategories( &$lanbilling )
{
	$_tmp = array();
    $filter = array();
    
    if(isset($_POST['getcategoriesvgid']) && $_POST['getcategoriesvgid'] != '') {
		$filter['tartype'] = (int)$_POST['getcategoriesvgid'];
		$filter['vgid'] = (int)$_POST['vgid'];
	}
    if(isset($_POST['uuid'])) {
        $filter['uuid'] = $_POST['uuid'];
    }

	if( false != ($result = $lanbilling->get("getTarCategories", array("id" => (integer)$_POST['getcategories'], "flt" => $filter))) ) {
		if(!is_array($result)) {
			$result = array($result);
		}

		array_walk($result, create_function('&$item, $key, $_tmp','
			if(($_tmp[1] == 1 && $item->common == 0) || ($_tmp[1] == 2 && $item->common > 0) || $_tmp[1] == 0) {
				$_tmp[0][] = array(
					"id" => $item->catidx,
					"name" => trim($item->descr, "\t\n\r")
				);
			}
		'), array( &$_tmp, (integer)$_POST['categoryfilter'] ));
	}

	if(sizeof($_tmp) > 0) {
		echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
	}
	else echo '({ "results": "" })';
} // end getUBCategories()




function getUBVgroups ( &$lanbilling ) {
	try {
		
		if(false === ($result = $lanbilling->get("getVgroups", array("flt" => array("agrmid" => (int)$_POST['agrmid'], "type" => '13')))))
		{
			throw new Exception($lanbilling->soapLastError()->detail);
		}
		
		if(!is_array($result)) $result = array($result);
		$_tmp = array();

		array_walk($result, create_function('&$obj, $key, $_tmp','
			$_tmp[0][] = array(	
				"vgid" => (int)$obj->vgid,
				"vglogin" => (string)$obj->login,
				"tarid" => (int)$obj->tarid
			);
		'), array( &$_tmp ));	
	}
	
	catch(Exception $error) {
        $_response = array(
            "success" => false,
            "error" => $error->getMessage()
        );
    }

    if(!$_response) {
        $_response = array(
			"results" => $_tmp,
            "success" => true
        );
    }
    
	echo "(" . JEncode($_response, $lanbilling) . ")";
}






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
 * Save service data to DB
 * @param	object, billing class
 */
function saveUBService( &$lanbilling, &$localize )
{
	$_withError = array();
	
	if(isset($_POST['regtype']) && $_POST['regtype'] == 0) {
		echo "({ success: true, id: -1 })";
		return;
	}
	
	/*
	*	Create usbox service while assigning agreement with equipment
	*/
	if(isset($_POST['regtype']) && $_POST['regtype'] != '') {
		$_POST['mul'] = 1;
		$_POST['comment'] = 'equip_serial: ' . $_POST['serial']	;		
		$_POST['common'] = ($_POST['regtype'] == 1) ? 0 : 1;
		
		if(!is_array($_POST['saveubservice'])) {
			$_POST['saveubservice'] = array(
				array("vgid" => $_POST['saveubservice'], "tarid" => $_POST['tarid'])
			);
		}		
	}

	if(!is_array($_POST['saveubservice']) || empty($_POST['saveubservice'])) {
		echo "({ success: true })";
		return;
	}

	if(sizeof($_POST['saveubservice']) > 1) {
		define('SAVE_UB_MULTIPLE', true);
	}

	$dateItem = create_function('$item','
		$item = explode(".", $item);
		if(sizeof($item) != 3){
			return date("Y-m-d") . " 00:00:00";
		}
		else {
			return implode("-", array_reverse($item)) . " 00:00:00";
		};'
	);
	
	$dtItem = create_function('$item',' 
		$item = explode(".", $item);
		if(sizeof($item) != 3){
			return date("Y-m-d");
		}
		else {
			return implode("-", array_reverse($item));
		};'
	);

	if(empty($_POST['timefromhour'])) {
		if(!empty($_POST['equip']))  {
			$_POST['timefromhour'] = date("H");
		}
		else{
			$_POST['timefromhour'] = '00';
		}
		
	}
	if(empty($_POST['timefrommin'])) {
		if(!empty($_POST['equip']))  {
			$_POST['timefrommin'] = date("i");
		}
		else{
			$_POST['timefrommin'] = '00';
		}
	}
	if(empty($_POST['timetohour'])) $_POST['timetohour'] = '00';
	if(empty($_POST['timetomin'])) $_POST['timetomin'] = '00';

	foreach($_POST['saveubservice'] as $key => $item) {
		// Check account id
		if((integer)$item['vgid'] == 0) {
			$_withError[] = array($key, $item['vglogin'], $item['catdescr'], $localize->get('Undefined-a') + ' ' + $localize->get('account'));
			continue;
		}

		// Check tariff id
		if((integer)$_POST['tarid'] == 0) {
			$_withError[] = array($key, $item['vglogin'], $item['catdescr'], $localize->get('Undefined') + ' ' + $localize->get('tariff'));
			continue;
		}
		
		// Check period start
		if((integer)$item['servid'] <= 0) {
			
			if(!empty($_POST['timefrom'])) {
				$timefrom = $dtItem($_POST['timefrom']) ." " .$_POST['timefromhour'] . ":" . $_POST['timefrommin'] .":00";
			}
			else {
				$timefrom = date('Y-m-d') ." " .$_POST['timefromhour'] . ":" . $_POST['timefrommin'] .":00";
			}
		}
		else {
						
			if($lanbilling->isConstant('SAVE_UB_MULTIPLE')) {
				if(empty($item['timefrom'])) {
					$_withError[] = array($key, $item['vglogin'], $item['catdescr'], $localize->get('Undefined-a') + ' ' + $localize->get('Date'));
					continue;
				}
					
				$timefrom = $dtItem($item['timefrom'])." " .$_POST['timefromhour'] . ":" . $_POST['timefrommin'] .":00";
			}
			else {
				if(empty($_POST['timefrom'])) {
					$_withError[] = array($key, $item['vglogin'], $item['catdescr'], $localize->get('Undefined-a') + ' ' + $localize->get('Date'));
					continue;
				}

				//$timefrom = $dateItem($_POST['timefrom']);
				$timefrom = $dtItem($_POST['timefrom'])." " .$_POST['timefromhour'] . ":" . $_POST['timefrommin'] .":00";
			}
		}

		// Check period end
		if((integer)$_POST['common'] == 0) {
			$timeto = $timefrom;
		}
		else {
			if(!empty($_POST['timeto'])) {
				$timeto = $dtItem($_POST['timeto']) ." " .$_POST['timetohour'] . ":" . $_POST['timetomin'] .":00";	
			}
		}


		if((integer)$item['servid'] <= 0) {
			$mul = ((float)$_POST['mul'] <= 0) ? $_POST['mul'] : $_POST['mul'];
			$rate = ((int)$_POST['disctype'] == 2) ? $_POST['rate'] : 1;
			$discount = ((int)$_POST['disctype'] == 1) ? $_POST['rate'] : 0;
		}
		else {
			if($lanbilling->isConstant('SAVE_UB_MULTIPLE')) {
				$mul = (float)$item['mul'];
				$rate = $item['rate'];
				$discount = $item['$discount'];
			}
			else {
				$mul = ((float)$_POST['mul'] <= 0) ? $_POST['mul'] : $_POST['mul'];
				$rate = ((int)$_POST['disctype'] == 2) ? $_POST['rate'] : 1;
				$discount = ((int)$_POST['disctype'] == 1) ? $_POST['rate'] : 0;
			}
		}

		// Check comments
		if($lanbilling->isConstant('SAVE_UB_MULTIPLE') && empty($_POST['comment'])) {
			$comment = $item['comment'];
		}
		else {
			$comment = $_POST['comment'];
		}
		
		if(!empty($_POST['disctimefrom'])) $disctimefrom = ($_POST['disctimefrom'] == $_POST['timefrom'] ? $timefrom : $dateItem($_POST['disctimefrom']));
		else $disctimefrom = $timefrom;
		
		if(!empty($_POST['disctimeto'])) $disctimeto = ($_POST['timeto'] == $_POST['disctimeto'] ? $timeto : $dateItem($_POST['disctimeto']));
		else $disctimeto = (empty($_POST['timeto'])) ? '' : $timeto;
		
		if((integer)$item['servid'] > 0 && $lanbilling->isConstant('SAVE_UB_MULTIPLE')) {
			$flt = array('recordid'=>(integer)$item['servid']);
			$srv = $lanbilling->get("getUsboxServices", array("flt" => $flt));
			if(!is_array($srv)) $srv = array($srv);
			
			$disctimefrom = $srv[0]->service->discounttimefrom;
			$disctimeto = $srv[0]->service->discounttimeto;			
		}
		
		
		
		if($_POST['common'] == 0) $disctimefrom = $timefrom;
		if($_POST['activatedhour']=='') {
			if(!empty($_POST['equip']))  {
				$_POST['activatedhour'] = date("H");
			}
			else{
				$_POST['activatedhour'] = '00';
			}
		}
		
		if($_POST['activatedmin']=='') {
			if(!empty($_POST['equip']))  {
				$_POST['activatedmin'] = date("i");
			}
			else{
				$_POST['activatedmin'] = '00';
			}
		}
		
		if($lanbilling->isConstant('SAVE_UB_MULTIPLE')) {
			$activated = $dtItem($item['activated'])." " .$_POST['activatedhour'] . ":" . $_POST['activatedmin'] .":00";
		} 
		else {
			$activated = $dtItem($_POST['activated']) ." " .$_POST['activatedhour'] . ":" . $_POST['activatedmin'] .":00";
		}
		
		if($_POST['common'] == 0) $activated = $timefrom;
		$struct = array(
			"servid" => (integer)$item['servid'],
			"vgid" => (integer)$item['vgid'],
			"tarid" => (integer)$_POST['tarid'],
			"catidx" => (integer)$_POST['catidx'],
			"externaldata" => $_POST['externaldata'],
			"activated" => $activated,
			"mul" => $mul,
			"rate" => $rate,
			"comment" => $comment,
			"timefrom" => $timefrom,
			"timeto" => $timeto,
			"discounttimefrom" => $disctimefrom,
			"discounttimeto" => $disctimeto,
			"planid" => (int)$_POST['planid'],
			"discount" => $discount
		);
		if( false == $lanbilling->save("insupdUsboxService", $struct, ((integer)$item['servid'] <= 0) ? true : false, array("getUsboxServices"))) {
			$error = $lanbilling->soapLastError();
			if(preg_match('/[0-9]{4}-[0-9]{2}-[0-9]{2}$/', trim($error->detail), $match)) {
				$_withError[] = array($key, $item['vglogin'], $item['catdescr'], sprintf($localize->get(trim(substr($error->detail, 0, strlen($error->detail) - strlen($match[0])))), $match[0]));
			}
			else if(strstr($error->detail, "Activation time should be in the range")){
				$msg = 'Activation time should be in the range from start time to end time';
				$_withError[] = array($key, $item['vglogin'], $item['catdescr'], $localize->get($msg));
			}
			else {
				$_withError[] = array($key, $item['vglogin'], $item['catdescr'], $localize->get($error->detail));
			}
		}
	}

	if(empty($_withError)) {
		echo "({ success: true, reason: '" . $localize->get('Request done successfully') . "', id: " . (int)$lanbilling->saveReturns->ret . " })";
	}
	else {
		if(sizeof($_withError) == 1) {
			echo "({ success: false, reason: " . JEncode($_withError[0][3], $lanbilling) . "})";
		}
		else {
			echo "({ success: false, reason: " . JEncode($_withError, $lanbilling) . "})";
		}
	}
} // end saveUBService()


/**
 * Remove assigned service
 * @param	object, billing class
 */
function delUBService( &$lanbilling, &$localize )
{
	$_withError = array();

	if(!is_array($_POST['delservice']) || empty($_POST['delservice'])) {
		echo "({ success: true })";
		return;
	}

	foreach($_POST['delservice'] as $key => $item) {
		if( false == $lanbilling->delete("delUsboxService", array("id" => (integer)$key), array("getUsboxServices"))) {
			$error = $lanbilling->soapLastError();
			if(preg_match('/[0-9]{4}-[0-9]{2}-[0-9]{2}$/', trim($error->detail), $match)) {
				$_withError[] = array($key, $item['vglogin'], $item['catdescr'], sprintf($localize->get(trim(substr($error->detail, 0, strlen($error->detail) - strlen($match[0])))), $match[0]));
			}
			else {
				$_withError[] = array($key, $item['vglogin'], $item['catdescr'], $localize->get($error->detail));
			}
		}
	}

	if(empty($_withError)) {
		echo "({ success: true, reason: '" . $localize->get('Request done successfully') . "' })";
	}
	else {
		if(sizeof($_withError) == 1) {
			echo "({ success: false, reason: " . JEncode($_withError[0][3], $lanbilling) . "})";
		}
		else {
			echo "({ success: false, reason: " . JEncode($_withError, $lanbilling) . "})";
		}
	}
} // end delUBService()


/**
 * Get on background request Categories list for the specified tariff id
 * @param	object, billing system class
 */
function getCategories( &$lanbilling )
{
	$_tmp = array();

	if( false != ($result = $lanbilling->get("getTarCategories", array("id" => (integer)$_POST['getctgrs']))) ) {
		if(!is_array($result)) {
			$result = array($result);
		}

		array_walk($result, create_function('&$obj, $key, $_tmp','
			$_tmp[0][] = array(
				"tarid" => $obj->tarid,
				"catidx" => $obj->catidx,
				"common" => $obj->common,
				"descr" => $obj->descr
			);
		'), array( &$_tmp ));
	}

	if(sizeof($_tmp) > 0) {
		echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
	}
	else {
		echo '({ "results": "" })';
	}
} // end getCategories()


/**
 * Get on background request rate value for current category
 * @param	object, billing system class
 */
function getCategoryRate( &$lanbilling )
{		
	$_filter = array(
		"vgid" => (int)$_POST['vgid'],
		"tarid" => (int)$_POST['tarid'],
		"catid" => (int)$_POST['catidx']
	);	
	
	if( false === ($result = $lanbilling->get("getTarCategoryRate", array("flt" => $_filter))) ) {
		echo '({"success": false,  "results": "" })';	
	}

	if(!is_array($result)) {
		$result = array("double" => (float)$result);
	}

	if(sizeof($result) > 0) {
		echo '({"success": true, "results": ' . JEncode($result, $lanbilling) . '})';
	}
	else {
		echo '({"success": false,  "results": "" })';
	}
} // end getCategories()
