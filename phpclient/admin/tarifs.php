<?php 
 
 
/** 
 * Control all known tariffs in the billing system 
 * Create new 
 * Known tariff types 
 * 0 - Ethernet, NetFlow, Sflow 
 * 1 - RADIUS (traffic volume) 
 * 2 - RADIUS (time volume) 
 * 3 - All classic telephony 
 * 4 - VOIP 
 * 5 - USBox 
 * 
 * Repository information: 
 * $Date: 2009-12-15 13:41:06 $ 
 * $Revision: 1.73.2.57 $ 
 */ 
 
// There is background query 
if(isset($_POST['async_call'])) 
{ 
	// Save tarif in background. Usually it calls when add new category while tariff is new 
	// and have not been saved yet 
	if(isset($_POST['save'])) { 
		if( false == saveTarifData($lanbilling)) { 
			$error = $lanbilling->soapLastError(); 
			echo "({ success: false, error: { reason: 'There was an error while saving tarif data: " . $error->detail . ". Look server logs for details' } })"; 
		} 
		else { 
			echo '({ success: true, tarif: ' . (integer)$_POST['tarif'] . ' })'; 
		} 
	} 
 
	if(isset($_POST['getcatlist'])) { 
		getTelCatalogues($lanbilling);
	} 
 
 
	if(isset($_POST['addDirFromCategory'])) { 
		addDirFromCategory($lanbilling, $localize); 
	} 
	 
	if(isset($_POST['gettarcatdisc'])) { 
		getTarCategoryDiscount($lanbilling, $localize); 
	} 
	 
	if(isset($_POST['catcontent'])) { 
		getCatContent($lanbilling); 
	} 
 
	if(isset($_POST['categories'])) { 
		getCategories($lanbilling); 
	} 
	elseif(isset($_POST['category'])) { 
		if(isset($_POST['timedisc'])) { 
			getTimeDisc($lanbilling); 
		} 
 
		if(isset($_POST['sizedisc'])) { 
			getSizeDisc($lanbilling); 
		} 
 
		if(isset($_POST['directions'])) { 
			getDirections($lanbilling); 
		} 
 
		if(isset($_POST['routes'])) { 
			getRoutesWeight($lanbilling); 
		} 
	} 
	elseif(isset($_POST['catsave'])) { 
		saveCategory($lanbilling, $localize); 
	} 
	elseif(isset($_POST['catdelete'])) { 
		deleteCategories($lanbilling, $localize); 
	} 
	elseif(isset($_POST['directiondelete'])) { 
		deleteDirections($lanbilling, $localize); 
	} 
	elseif(isset($_POST['directionsave'])) { 
		saveDirections($lanbilling, $localize); 
	} 
 
	if(isset($_POST['timeshapes'])) { 
		getTimeshapes($lanbilling, $result); 
	} 
 
	if(isset($_POST['sizeshapes'])) { 
		getSizeshapes($lanbilling, $result); 
	} 
 
	if(isset($_POST['get_cerber'])) { 
		getCerberMaskArr($lanbilling); 
	} 
 
	if(isset($_POST['updirection'])) { 
		saveDirFromFile($lanbilling, $localize); 
	} 
 
	if(isset($_POST['getsimpletarifs'])) { 
		getSimpleTarifsList($lanbilling); 
	} 
 
	if(isset($_POST['getholidays'])) { 
		getHolidays($lanbilling, $localize); 
	} 
 
	if(isset($_POST['saveholidays'])) { 
		saveHolidays($lanbilling, $localize); 
	} 
 
    if(isset($_POST['gettariffs'])) { 
        getTariffs($lanbilling, $localize); 
    } 
 
	if(isset($_POST['getSaleDictionary'])) { 
		getSaleDictionary($lanbilling); 
	} 
	if(isset($_POST['delSalesDict'])) { 
		delSalesDict($lanbilling, $localize); 
	} 
	if(isset($_POST['insUpdSalesDictionary'])) { 
		insUpdSalesDictionary($lanbilling, $localize); 
	} 
 
	if(isset($_POST['getDefUnit'])) { 
		getDefUnit($lanbilling); 
	} 
 
    if(isset($_POST['getcaspacks'])) { 
        getCASPackages($lanbilling); 
    } 
     
    if(isset($_POST['tarifcopy'])) { 
        cloneTariff($lanbilling, $localize); 
    } 
     
    if(isset($_POST['tardelete'])) { 
        deleteTarif($lanbilling, $localize); 
    } 
} 
// There is standard direct query to show list or form 
else 
{ 
	$tpl = new HTML_Template_IT(TPLS_PATH); 
 
	if(isset($_POST['tarif'])) { 
		if(isset($_POST['save'])) { 
			if( false == saveTarifData($lanbilling)) { 
				define("SAVED_OK", false); 
				tarifForm($lanbilling, $tpl, $localize); 
			} 
			else { 
				define("SAVED_OK", true); 
				if(isset($_POST['nolist'])) tarifForm($lanbilling, $tpl, $localize); 
				else showTarifsList($lanbilling, $tpl); 
			} 
		} 
		else tarifForm($lanbilling, $tpl, $localize); 
	} 
	else { 
	    showTarifsList($lanbilling, $tpl); 
    } 
 
	$localize->compile($tpl->get(), true); 
} 
 
 
/** 
 * Get tariffs list 
 * @param   object, main class 
 * @param   object, localize 
 */ 
function getTariffs( &$lanbilling, &$localize )
{
	try { 
	    $filter = array( 
            "archive" => 0, 
            "unavail" => !isset($_POST['unavail']) ? -1 : (integer)$_POST['unavail'], 
            "formanager" => 1, 
            "name" => (string)$_POST['tarname'], 
            "tartype" => ($_POST['tartype'] == '') ? -1 : (int)$_POST['tartype'], 
            "pgsize" => ((integer)$_POST['limit'] <= 0) ? 100 : $_POST['limit'] 
        ); 
         
        if($_POST['operid'] != '') { 
			$filter['common'] = (integer)$_POST['common']; 
			$filter['operid'] = (integer)$_POST['operid']; 
		} 
		 
		if($_POST['common'] == '') { 
			$filter['common'] = '-1'; 
		} 
         
        if((integer)$_POST['moduleid'] > 0) { 
            $filter['agentid'] = (integer)$_POST['moduleid']; 
            unset($filter['tartype']); 
        } 
         
        if((integer)$_POST['agrmid'] > 0) { 
            if( false != ($agrm = $lanbilling->get("getAgreements", array("flt" => array( 
                "agrmid" => (integer)$_POST['agrmid'] 
            )))) ) 
            { 
				$filter['curid'] = $agrm->curid; 
				$filter['blocktype'] = $agrm->paymentmethod;  
            } 
        } 
		 
        $filter['pgnum'] = $lanbilling->linesAsPageNum($filter['pgsize'], (integer)$_POST['start'] + 1); 
         
        $order = array( 
            "name" => "descr", 
            "ascdesc" => !isset($_POST['dir']) ? 0 : (($_POST['dir'] == "ASC") ? 0 : 1) 
        );	 
         
        switch($_POST['sort']) { 
            case 'tarid': $order['name'] = 'tarid'; break; 
            case 'rent': $order['name'] = 'rent'; break; 
        } 
		 
        if( false === ($result = $lanbilling->get("getTarifsExt2", array("flt" => $filter, "ord" => $order))) ) 
        { 
            throw new Exception ($lanbilling->soapLastError()->detail); 
        } 
 
        if($result) { 
            if(!is_array($result)) { 
                $result = array($result); 
            } 
 
            array_walk($result, create_function('&$item', ' 
                $A = array( 
                    "tarid" => $item->tarif->tarid, 
                    "type" => $item->tarif->type, 
                    "descr" => $item->tarif->descr, 
                    "unaval"  => $item->tarif->unavaliable, 
                    "dailyrent" => $item->tarif->dailyrent, 
                    "actblock" => $item->tarif->actblock, 
                    "rent" => $item->tarif->rent, 
                    "symbol" => $item->tarif->symbol, 
                    "vgroups" => $item->vgroups, 
                    "additional" => $item->tarif->additional 
                ); 
                 
                $item = $A; 
            ')); 
             
            $_md5 = $lanbilling->controlSum($filter); 
            $total = $lanbilling->get("Count", array("flt" => $filter, "procname" => "getTarifsExt2", "md5" => $_md5)); 
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
            "results" => (array)$result, 
            "success" => true, 
            "total" => (integer)$total, 
            "error" => null, 
            "filter" => $filter 
        ); 
    } 
     
    echo "(" . JEncode($_response, $lanbilling) . ")";
} // end getTariffs() 
 
 
/** 
 * Clone passed tarif 
 * @param   object, main class 
 */ 
function cloneTariff( &$lanbilling, &$localize ) 
{ 
    try { 
        if((integer)$_POST['tarifcopy'] == 0) { 
            throw new Exception($localize->compile("<%@ Undefined %>: <%@ Tarif %>")); 
        } 
         
        if( false == ($result = $lanbilling->get("cloneTarif", array( 
            "id" => (integer)$_POST['tarifcopy'],  
            "descrprefix" => sprintf(" (%s)", $localize->resource['Copy-n'] 
        )))) ) 
        { 
            throw new Exception ($lanbilling->soapLastError()->detail); 
        } 
         
        $lanbilling->flushCache(array("getTarif", "getTarifsExt", "getCatalogs", "cloneTarif")); 
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
            "results" => (integer)$result 
        ); 
    } 
     
    echo "(" . JEncode($_response, $lanbilling) . ")"; 
} // end cloneTariff() 
 
 
/** 
 * Remove existing tariff 
 * @param   object, system main class 
 */ 
function deleteTarif( &$lanbilling, &$localize ) 
{ 
    try { 
        if((integer)$_POST['tardelete'] == 0) { 
            throw new Exception($localize->compile("<%@ Undefined %>: <%@ Tarif %>")); 
        } 
         
        if( false == $lanbilling->delete("delTarif", array('id' => $_POST['tardelete']), array("getTarif", "getTarifsExt", "getTarCategory")) ) { 
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
            "error" => null 
        ); 
    } 
     
    echo "(" . JEncode($_response, $lanbilling) . ")"; 
} // end deleteTarif() 
 
 
function getDefUnit($lanbilling) 
{ 
	if(FALSE == ($result = $lanbilling->get("getDictOkei", array('flt'=>$_flt)))) { 
		echo "({ results: '' })"; 
		return; 
	} else { 
		if(!is_array($result)) { 
			$result = array($result); 
		} 
		$_tmp = array(); 
		array_walk($result, create_function('&$obj, $key, $_tmp', ' 
			$_tmp[0][] = array( 
				"recordid"   => $obj->recordid, 
				"name"       => $obj->name, 
				"unitrus"    => $obj->unitrus, 
				"unitintern" => $obj->unitintern, 
                "coderus"    => $obj->coderus, 
                "codeintern" => $obj->codeintern 
			); 
		'), array(&$_tmp)); 
        if(sizeof($_tmp) > 0) 
			echo '({"success": true, "results": ' . JEncode($_tmp, $lanbilling) . '})'; 
		else echo "({ results: '' })"; 
	} 
} 
 
function getSaleDictionary($lanbilling, $recordid = false){ 
 
    $_filter = array( 
        "pgnum" => $lanbilling->linesAsPageNum((((integer)$_POST['limit'] <= 0) ? 100 : $_POST['limit']), (integer)$_POST['start'] + 1), 
        "pgsize" => ((integer)$_POST['downtype'] == 0) ? (((integer)$_POST['limit'] <= 0) ? 100 : $_POST['limit']) : (isset($_POST['limit']) ? $_POST['limit'] : "") 
    ); 
 
    if ($recordid !== false && $recordid >= 0) 
        $_filter['recordid'] = $recordid; 
 
	if( false != ($result = $lanbilling->get('getSaleDictionaryEntries', array('flt'=>$_filter)))){ 
		if(!is_array($result)) { $result = array($result); } 
        array_walk($result, create_function('$item, $key, $_tmp',' 
			$_tmp[0][] = array( 
				"recordid"  => $item->recordid, 
				"gaap"      => $item->gaap, 
				"name"      => $item->name, 
				"unit"      => $item->unit, 
				"unitmult"  => $item->unitmult, 
                "modperson" => $item->modperson, 
                "codeokei"  => $item->codeokei, 
                "servtype"  => $item->servtype 
			); 
        '), array( &$_tmp )); 
 
        if ($recordid) return $_tmp; 
        if(sizeof($_tmp) > 0) { 
            $count = $lanbilling->get("Count", array( 'flt'=>$_filter, "procname"	=> "getSaleDictionaryEntries" ) ); 
			echo '({"total": ' . $count . ', "results": ' . JEncode($_tmp, $lanbilling) . '})'; 
		} 
		else echo '({ "total": 0, "results": "" })'; 
	}else{ 
		$error = $lanbilling->soapLastError(); 
        if ($recordid) 
            return false; 
        else 
            echo '({ success: false,  errors: {reason: "'.$error->detail.'"} })'; 
		return false; 
	} 
} 
 
function delSalesDict($lanbilling, &$localize) 
{ 
    $salesDictID = ((integer)$_POST['delSalesDict']) ? (integer)$_POST['delSalesDict'] : 0; 
    if (!$salesDictID) echo '({ success: false, errors: { reason: "' . $localize->get('Unknown service code') . '" } })'; 
    if( false == ($res = $lanbilling->delete("delSaleDictionaryEntry", array('id'=>$salesDictID), array('getSaleDictionaryEntries'))) ) { 
        echo '({ success: false, errors: { reason: "' . $localize->get('Unable to remove service from dictionary') . '" } })'; 
    } else { 
        echo '({ success: true })'; 
    } 
} 
 
function insUpdSalesDictionary($lanbilling, &$localize) 
{ 
    $insupdSaleDictionaryEntry = array( 
        'gaap'      => trim($_POST['gaap']), 
        'name'      => trim($_POST['name']), 
        'codeokei'  => (integer)$_POST['codeokei'], 
        'unitmult'  => $_POST['unitmult'], 
        'servtype'  => (integer)$_POST['servtype'], 
        'modperson' => $lanbilling->manager 
    ); 
    if ((integer)$_POST['isInsert'] == 1){ 
        $isInsert = true; 
    }else{ 
        $isInsert = false; 
        $insupdSaleDictionaryEntry['recordid'] = $_POST['recordid']; 
    } 
    if( FALSE !== ($result = $lanbilling->save('insupdSaleDictionaryEntry', $insupdSaleDictionaryEntry, $isInsert)) ){ 
        echo '({ success: true })'; 
    } else { 
		$error = $lanbilling->soapLastError(); 
        echo '({ success: false, error: { reason: "' . $localize->get('Server error') . '.<br/>'.$error->detail.'" } })'; 
    } 
} 
 
function addDirFromCategory($lanbilling,$localize){ 
 
    $direction = explode(';',$_POST['addDirFromCategory']); 
    if (is_array($direction)){ 
        $directionArray = array(); 
        foreach ($direction as $k=>$v){ 
            if ( FALSE !== ($dirArr = getDirData($_POST['catid'],$v,$lanbilling))){ 
                $directionArray = array_merge(getDirData($_POST['catid'],$v,$lanbilling),$directionArray); 
            } 
        } 
    } 
    foreach ($directionArray as $key => $arr){ 
 
        $struct = array( 
            'tarid'     => (integer)$_POST['tarid'], 
            'catidx'    => (integer)$_POST['catidx'], 
            'zoneid'    => (integer)$arr['zoneid'], 
            //'direction' => (integer)$arr['direction'], 
            'direction' => 0, 
            'catid'     => (integer)$arr['catid'], 
        ); 
        if(false == $lanbilling->save("insCatItem4Category", $struct, true, array("getTarCategory")) ) { 
        	$error = $lanbilling->soapLastError(); 
        	$_withError[] = array( 
        		$struct['number'], 
        		$arr['descr'], 
        		$localize->get($error->detail)); 
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
 
 
} 
 
 
 
function getDirData($catid, $catidx, $lanbilling){ 
    $_filter = array( 
        'recordid' => $catidx, 
        'catid'    => $catid 
    ); 
    if( false !== ($result = $lanbilling->get("getMasterCategory", array('flt'=>$_filter))) ){ 
        if (!isset($result->telcatalog)) {return false;} 
        if(!is_array($result->telcatalog)) { $result->telcatalog = array($result->telcatalog); } 
        array_walk($result->telcatalog, create_function('$item, $key, $_tmp', ' 
            $_tmp[0][] = array( 
                "catid"       => $item->catid, 
                "zoneid"      => $item->zoneid, 
                "zoneclass"   => $item->zoneclass, 
                "direction"   => $item->direction, 
                "zonenum"     => $item->zonenum, 
                "descr"       => $item->descr, 
                "classdescr"  => $item->classdescr, 
                "zonedescr"   => $item->zonedescr, 
                "catidx"      => $item->catidx, 
                "catidxdir"   => $item->catidxdir, 
                "catidxdescr" => $item->catidxdescr 
            ); 
        '), array( &$_tmp, &$lanbilling )); 
        if(sizeof($_tmp) > 0) { 
            return $_tmp; 
        } else { 
            return false; 
        } 
    } else return false; 
} 
 
 
 
/** 
 * Show tarifs list 
 * @param	object, billing class 
 * @param	object, template class 
 */ 
function showTarifsList($lanbilling, $tpl) 
{ 
	$tpl->loadTemplatefile("tarifs_list.tpl", true, true); 
    $tpl->touchBlock("__global__"); 
         
    if($lanbilling->getAccess('calendar') > 0) { 
        $tpl->touchBlock('CalendarControl'); 
    } 
} // end showTarifsList() 
 
 
/** 
 * Build tarifs form to show / save settings for the selected or new tarif 
 * @param	object, billing sytem main class 
 * @param	object, template class 
 */ 
function tarifForm( &$lanbilling, &$tpl, $localize ) 
{ 
	$tpl->loadTemplatefile("tarif.tpl", true, true); 
	$tpl->touchBlock("__global__"); 
	
	if(SAVED_OK === false){
		
		$error = $lanbilling->soapLastError()->detail;
		if(strstr($error, "Change of tariff is not allowed")){
			$error = "Change of tariff is not allowed";
		}
		$tpl->setCurrentBlock('SaveStatFalse');
		$tpl->setVariable("SAVESTATERR", $localize->get($error));
		$tpl->parseCurrentBlock();
	}
 
	// If there is telephony tarif this define will be usefull 
	define("USEOPERATORS", $lanbilling->Option("use_operators")); 
	$catalogues = $lanbilling->get("getCatalogs"); 
 
	if($lanbilling->getAccess('calendar') > 0) { 
		$tpl->touchBlock('CalendarControl'); 
	} 
     
	if((integer)$_POST['tarif'] > 0) 
	{ 
		// Get data 
		$result = $lanbilling->get("getTarif", array("id" => (integer)$_POST['tarif'])); 
 
		if(!isset($_POST['type'])) $_POST['type'] = $result->tarif->type; 
		if(!$_POST['unavaliable']) $_POST['unavaliable'] = $result->tarif->unavaliable; 
		$_POST['descr'] = $result->tarif->descr; 
		$_POST['trafflimit'] = $result->tarif->trafflimit; 
		$_POST['trafflimitper'] = $result->tarif->trafflimitper; 
		$_POST['rent'] = $result->tarif->rent; 
		$_POST['blockrent'] = $result->tarif->blockrent;
		$_POST['usrblockrent'] = $result->tarif->usrblockrent;
		$_POST['admblockrent'] = $result->tarif->admblockrent;
		$_POST['dailyrent'] = $result->tarif->dailyrent; 
		$_POST['dynamicrent'] = $result->tarif->dynamicrent; 
		$_POST['actblock'] = $result->tarif->actblock; 
		$_POST['trafftype'] = $result->tarif->trafftype; 
		$_POST['shapeprior'] = $result->tarif->shapeprior; 
		$_POST['shape'] = $result->tarif->shape; 
		$_POST['chargeincoming'] = $result->tarif->chargeincoming; 
		$_POST['rentmultiply'] = $result->tarif->rentmultiply; 
		$_POST['voipblocklocal'] = $result->tarif->voipblocklocal; 
		$_POST['dynroute'] = $result->tarif->dynroute; 
		$_POST['curid'] = $result->tarif->curid; 
		$_POST['minsum'] = $result->tarif->minsum; 
		$_POST['blockrentduration'] = $result->tarif->blockrentduration; 
		$_POST['coeflow'] = $result->tarif->coeflow; 
		$_POST['coefhigh'] = $result->tarif->coefhigh; 
        $_POST['saledictionaryid'] = $result->tarif->saledictionaryid; 
		$_POST['descrfull'] = $result->tarif->descrfull; 
		$_POST['additional'] = $result->tarif->additional; 
		$_POST['link'] = $result->tarif->link; 
 
		if(is_array($result->tarif->catnumbers)) { 
			$_tmp = array(); 
			array_walk($result->tarif->catnumbers, create_function('&$val, $key, $_tmp', '$_tmp[0][] = $val->val;'), array(&$_tmp)); 
			$_POST['catnumbers'] = implode(",", $_tmp); 
		} 
		else $_POST['catnumbers'] = $result->tarif->catnumbers->val; 
 
        if ($result->tarif->saledictionaryid <= 0){ 
            $tpl->touchBlock("saleDictionaryLinkUndef"); 
        } else { 
            $tpl->setVariable("SALEDICTIONARYID", $result->tarif->saledictionaryid); 
            if (FALSE !== ($sdArr = getSaleDictionary($lanbilling, $result->tarif->saledictionaryid)) && count($sdArr)){ 
                $tpl->setVariable("SALEDICTIONARYLINK", $sdArr[0]['gaap'] . ': ' . $sdArr[0]['name']); 
            }else{ 
                $tpl->setVariable("SALEDICTIONARYLINK", $result->tarif->saledictionaryid); 
            } 
        } 
 
 
		if($result->tarif->used > 0) 
		{ 
			$tpl->touchBlock("typedisabled"); 
			$tpl->touchBlock("currdisabled"); 
 
			if($_POST['type'] != 5) 
			{ 
				$tpl->touchBlock("rentreadonly"); 
				$tpl->touchBlock("blockrentreadonly");				 
				$tpl->touchBlock("blockadmrentreadonly");	
				$tpl->touchBlock("blockusrrentreadonly");	
			} 
			$tpl->touchBlock("coeflowreadonly"); 
			$tpl->touchBlock("coefhighreadonly"); 
 
			$tpl->touchBlock("TarifUsed"); 
		} 
 
		$tpl->touchBlock("onExistSubmit"); 
 
		$tpl->setCurrentBlock('TarPermControl'); 
		$tpl->setVariable("TARIFID", $_POST['tarif']); 
		$tpl->parseCurrentBlock(); 
 
    } 
	else { 
		$tpl->touchBlock("onNewSubmit"); 
 
        $tpl->touchBlock("saleDictionaryLinkUndef"); 
 
		if(!isset($_POST['type'])) { 
			$_POST['type'] = 0; 
		} 
		$_POST['dailyrent'] = 1; 
		$_POST['dynamicrent'] = 1; 
		$_POST['catnumbers'] = 0; 
	} 
 
	if($_POST['type'] == 3 || $_POST['type'] == 4) 
	{	 
		if(USEOPERATORS == 1 && $_POST['additional'] == 0) 
		{ 
			$tpl->touchBlock("ifOperators"); 
			$tpl->setCurrentBlock("CatOperMode"); 
			$tpl->setVariable("CATIDS", is_array($_POST['catnumbers']) ? implode(',', $_POST['catnumbers']) : $_POST['catnumbers']); 
			$tpl->parseCurrentBlock(); 
 
			if($_POST['type'] == 4) { 
				$tpl->touchBlock("ifVoIPRoute"); 
				$tpl->touchBlock("VoIPRoute_" . (integer)$_POST['dynroute']); 
			} 
		} 
		else showCatControl($catalogues, $lanbilling, $tpl); 
		 
		$tpl->touchBlock("existAdditional"); 
		$tpl->touchBlock("ifTelephony"); 
		$tpl->touchBlock("incChargeSel_" . $_POST['chargeincoming']); 
		$tpl->touchBlock("ifTelRent"); 
 
		if($_POST['rentmultiply'] == 1) $tpl->touchBlock("rentMultiple"); 
		if($_POST['additional'] == 1) $tpl->touchBlock("additional"); 
 
		if($_POST['type'] == 4) { 
			$tpl->touchBlock("ifVoIPDropUnk"); 
			if($_POST['voipblocklocal'] == 1) $tpl->touchBlock("BlkLocal"); 
		} 
	} 
	else { 
		if($_POST['type'] < 5) { 
			showCatControl($catalogues, $lanbilling, $tpl); 
		} 
	} 
     
    if(false != ($AOpt = $lanbilling->get("getAgentOptions", array("flt" => array("name" => "cas_host"))))) 
    { 
        if(!is_array($AOpt)) { 
            $AOpt = array($AOpt); 
        } 
         
        foreach($AOpt as $item) { 
            if(!empty($item->value)) { 
                $isDTV = true; 
                break; 
            } 
        } 
    } 
    if($_POST['type'] == 5 && $isDTV) { 
        $tpl->touchBlock("DTVSettings"); 
    } 
     
	if($_POST['unavaliable'] == 1) $tpl->touchBlock("unavaliable"); 
	if($_POST['actblock'] == 1) $tpl->touchBlock("actblockchk"); 
	$tpl->touchBlock("type_" . $_POST['type']); 
	$tpl->touchBlock("actblock_" . $_POST['actblock']); 
	$tpl->setVariable("TARTYPE" , $_POST['type']); 
	$tpl->setVariable("TARIFID", $_POST['tarif']); 
	$tpl->setVariable("DESCR", $_POST['descr']); 
	 
	$tpl->setVariable("DESCRFULL", $_POST['descrfull']); 
	$tpl->setVariable("LINK", $_POST['link']); 
	 
 
	if($_POST['type'] < 5) { 
		$tpl->touchBlock("dailyrent_" . $_POST['dailyrent']); 
		$tpl->setVariable("RENT", $lanbilling->largeNumber($_POST['rent'])); 
		$tpl->setVariable("BLOCKRENT", $lanbilling->largeNumber($_POST['blockrent'])); 
 	   	$tpl->setVariable("USRBLOCKRENT", $lanbilling->largeNumber($_POST['usrblockrent']));
		$tpl->setVariable("ADMBLOCKRENT", $lanbilling->largeNumber($_POST['admblockrent']));
		$tpl->setVariable("BLOCKRENTDURATION", $lanbilling->largeNumber($_POST['blockrentduration'])); 
		 
	} 
	$tpl->setVariable("COEFLOW", (isset($_POST['coeflow'])  ? $_POST['coeflow'] : 1)); 
	$tpl->setVariable("COEFHIGH", (isset($_POST['coefhigh'])  ? $_POST['coefhigh']:1)); 
 
	// This is common settings for all tariff types 
	$tpl->touchBlock("dynamicrent_" . $_POST['dynamicrent']); 
 
	// Fill dropDown with curency list 
	foreach($lanbilling->initCurrency() as $key => $currency) 
	{ 
		if(((integer)$_POST['tarif'] == 0 || (integer)$result->tarif->used == 0) && (integer)$key == 0) { 
			continue; 
		} 
 
		$tpl->setCurrentBlock("tarCurOpt"); 
		if($key == (integer)$_POST['curid']) $tpl->touchBlock("tarCurOptSel"); 
		$tpl->setVariable("CURRENCYID", $key); 
		$tpl->setVariable("CURRENCYSYMBOL", $currency['symbol']); 
		$tpl->setVariable("CURRENCYNAME", $currency['name']); 
		$tpl->parseCurrentBlock(); 
	} 
 
	if($_POST['type'] < 3) 
	{ 
		if($_POST['type'] == 2) { 
			$tpl->touchBlock("ifTarfLimMin"); 
		} 
		else $tpl->touchBlock("ifTarfLimMb"); 
 
		$tpl->touchBlock("shapeprior_" . $_POST['shapeprior']); 
		$tpl->touchBlock("trafftype_" . $_POST['trafftype']); 
		$tpl->touchBlock("ifTrafDir"); 
		$tpl->setVariable("TRAFFLIMIT", $_POST['trafflimit']); 
		$tpl->setVariable("TRAFFLIMITPER", $_POST['trafflimitper']); 
		$tpl->setVariable("SHAPE", $_POST['shape']); 
 
		if((integer)$_POST['trafflimitper'] > 0) { 
			$tpl->touchBlock("traffpersel_1"); 
		} 
		else { 
			$tpl->touchBlock("traffpersel_0"); 
			$tpl->touchBlock("traffperdis"); 
		} 
	} 
 
	if( $_POST['type'] == 5 ) { 
		$tpl->setCurrentBlock("ifCerber"); 
		if( $lanbilling->Option('use_cerbercrypt') == 1 ) { 
			$tpl->setVariable("USE_CERBER", "1"); 
		} 
		else { 
				$tpl->setVariable("USE_CERBER", "0"); 
		} 
		$tpl->parseCurrentBlock("USE_CERBER"); 
	} 
 
} // end tarifForm() 
 
 
/** 
 * Show catalogue control selector if tarif type is not telephony or if there is not 
 * turned on operator mode 
 * @param	object, catalogues object content 
 * @param	object, billing class 
 * @param	object, template class 
 */ 
function showCatControl( &$catalogues, &$lanbilling, &$tpl ) 
{ 
	if($_POST['type'] > 0 && $_POST['type'] < 3) { 
		$tpl->touchBlock("catdisabled"); 
		$_POST['catnumbers'] = 0; 
	} 
 
	$tpl->setCurrentBlock("catopt"); 
	$tpl->setVariable("CATNUM", "0"); 
	$tpl->setVariable("CATTYPE", "0"); 
	$tpl->setVariable("CATNAME", "<%@ Undefined %>"); 
	$tpl->parseCurrentBlock(); 
 
	$defOper = $lanbilling->getOperators(null, true); 
 
	if($catalogues != false) { 
		if(!is_array($catalogues)) { 
			$catalogues = array($catalogues); 
		} 
 
		foreach($catalogues as $obj) 
		{ 
			if($_POST['type'] > 2 && $obj->cattype < 3) { 
				continue; 
			} 
			elseif($_POST['type'] > 0 && $_POST['type'] < 3 && $obj->cattype > 1) { 
				continue; 
			} 
			elseif($_POST['type'] == 0 && $obj->cattype == 3) { 
				continue; 
			} 
 
			$tpl->setCurrentBlock("catopt"); 
 
			if($_POST['catnumbers'] == $obj->catid) $tpl->touchBlock("catoptsel"); 
 
			$tpl->setVariable("CATNUM", $obj->catid); 
			$tpl->setVariable("CATOWNERID", $obj->operid); 
			$tpl->setVariable("CATTYPE", $obj->cattype); 
			$tpl->setVariable("CATNAME", $obj->catname); 
			$tpl->parseCurrentBlock(); 
		} 
	} 
} // end showCatControl() 
 
 
/** 
 * Return on background request timeshapes list 
 * @param	object, billing system class 
 * @param	object, result from the server 
 */ 
function getTimeshapes( &$lanbilling, &$result ) 
{ 
	$result = $lanbilling->get("getTarif", array("id" => (integer)$_POST['tarif'])); 
	if(!isset($result->timeshapes)) 
	{ 
		echo "({ results: '' })"; 
		return; 
	} 
	else 
	{ 
		if(!is_array($result->timeshapes)) 
			$result->timeshapes = array($result->timeshapes); 
 
		$_tmp = array(); 
		foreach($result->timeshapes as $obj) 
		{ 
			$_tmp[] = array( 
				"id" => $obj->id, 
				"shaperate" => $obj->shaperate, 
				"mon" => $obj->mon, 
				"tue" => $obj->tue, 
				"wed" => $obj->wed, 
				"thu" => $obj->thu, 
				"fri" => $obj->fri, 
				"sat" => $obj->sat, 
				"sun" => $obj->sun, 
				"timefrom" => $obj->timefrom, 
				"timeto" => $obj->timeto, 
				"useweekend" => $obj->useweekend 
			); 
		} 
 
		if(sizeof($_tmp) > 0) 
			echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})'; 
		else echo "({ results: '' })"; 
	} 
} // end getTimeshapes() 
 
 
/** 
 * Return on background request timeshapes list 
 * @param	object, billing system class 
 * @param	object, result from the server 
 */ 
function getSizeshapes( &$lanbilling, &$result ) 
{ 
	$result = $lanbilling->get("getTarif", array("id" => (integer)$_POST['tarif'])); 
	if(!isset($result->sizeshapes)) 
	{ 
		echo "({ results: '' })"; 
		return; 
	} 
	else 
	{ 
		if(!is_array($result->sizeshapes)) 
			$result->sizeshapes = array($result->sizeshapes); 
 
		$_tmp = array(); 
		foreach($result->sizeshapes as $obj) 
		{ 
			$_tmp[] = array("id" => $obj->id, "shaperate" => $obj->shaperate, "amount" => $obj->amount); 
		} 
 
		if(sizeof($_tmp) > 0) 
			echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})'; 
		else echo "({ results: '' })"; 
	} 
} // end getSizeshapes() 
 
 
/** 
 * Return Directions for the specified tariff and category 
 * @param	object, billing system class 
 */ 
function getDirections( &$lanbilling ) 
{ 
	$_filter = array( 
		"tarid" => (integer)$_POST['directions'], 
		"catid" => (integer)$_POST['category'], 
		"direction" => (integer)$_POST['dirtype'], 
		"descr" => $_POST['dirsearch'], 
		"pgsize" => ((integer)$_POST['limit'] <= 0) ? 100 : $_POST['limit'] 
	); 
 
	// Page number 
	$_filter['pgnum'] = $lanbilling->linesAsPageNum($_filter['pgsize'], (integer)$_POST['start'] + 1); 
 
	// Records order 
	$_order = array(); 
 
	$_md5 = $lanbilling->controlSum(array_merge($_filter, $_order)); 
 
	// Count records 
	$count = $lanbilling->get("Count", array("flt" => $_filter, "procname" => "getTarCategoryCatalog", "md5" => $_md5)); 
 
	// Temporary data array 
	$_tmp = array(); 
 
	if( false != ($result = $lanbilling->get("getTarCategoryCatalog", array("flt" => $_filter, "ord" => $_order, "md5" => $_md5))) ) 
	{ 
		if(isset($result->ipcatalog)) { 
			if(!is_array($result->ipcatalog)) { 
				$result->ipcatalog = array($result->ipcatalog); 
			} 
			$_dir = $result->ipcatalog; 
		} 
		elseif(isset($result->ascatalog)) { 
			if(!is_array($result->ascatalog)) { 
				$result->ascatalog = array($result->ascatalog); 
			} 
			$_dir = $result->ascatalog; 
		} 
		elseif($result->telcatalog) { 
			if(!is_array($result->telcatalog)) { 
				$result->telcatalog = array($result->telcatalog); 
			} 
			$_dir = $result->telcatalog; 
		} 
 
		if(isset($_dir)) { 
			$_tmp = array(); 
			array_walk($_dir, create_function('&$val, $key, $_tmp',' 
				$data = (array)$val; 
				if(isset($val->ipmask)){ 
					$data["zoneip"] = $val->ipmask->ip; 
					$data["zonemask"] = $val->ipmask->mask; 
					unset($data["ipmask"]); 
				}; 
				$_tmp[0][] = $data; 
			'), array(&$_tmp)); 
		} 
	} 
 
	if(sizeof($_tmp) > 0) { 
		echo '({ "total": ' . (integer)$count . ', "results": ' . JEncode($_tmp, $lanbilling) . '})'; 
	} 
	else { 
		echo '({ "total": 0, "results": "" })'; 
	} 
} // end getSizeshapes() 
 
 
/** 
 * Return on background request Categories list 
 * @param	object, billing system class 
 * @param	object, result from the server 
 */ 
function getCategories( &$lanbilling ) 
{ 
	$_tmp = array(); 
	$result = $lanbilling->getOperators(); 
 
	if(!empty($result)) 
	{ 
		array_walk($result, create_function('$item, $key, $_tmp', ' 
			$_tmp[0][$item["uid"]] = array( 
				"id" => $item["uid"], 
				"operid" => $item["uid"], 
				"text" => $item["name"], 
				"def" => $item["def"], 
				"group" => true 
			);' 
		), array( &$_tmp )); 
 
		if( false != ($leaves = $lanbilling->get("getTarCategories", array("id" => (integer)$_POST['categories']))) ) { 
			if(!empty($leaves)) 
			{ 
				if(!is_array($leaves)) { 
					$leaves = array($leaves); 
				}
                array_walk($leaves, create_function('&$obj, $key, $_tmp',' 
                    global $lanbilling; 
                    if ($obj->saledictionaryid > 0) 
                        $sdArr = getSaleDictionary($lanbilling, $obj->saledictionaryid); 
                    else 
                        $sdArr = ""; 
					$_tmp[0][$obj->operid]["children"][] = array( 
						"id"               => ($obj->operid + 1) . $obj->catidx, 
						"iconCls"          => ($obj->catidx == 0) ? "ext-mainleaf" : "", 
						"text"             => ($obj->descr == "") ? "Unsigned" : $obj->descr, 
						"leaf"             => true, 
						"tarid"            => $obj->tarid, 
						"catid"            => $obj->catid, 
						"catidx"           => $obj->catidx, 
						"includes"         => $obj->includes, 
						"operid"           => $obj->operid, 
						"common"           => $obj->common, 
						"descr"            => $obj->descr, 
						"above"            => $obj->above, 
						"disprior"         => $obj->disprior, 
						"freeseconds"      => $obj->freeseconds, 
						"roundseconds"     => $obj->roundseconds, 
						"minchargedur"     => $obj->minchargedur, 
						"permabove"        => $obj->permabove,
                		"admblockabove"    => $obj->admblockabove, 
                		"usboxcount"       => $obj->usboxcount,  
                		"usrblockabove"    => $obj->usrblockabove,  
						"uuid"             => $obj->uuid, 
						"keepturnedon"     => $obj->keepturnedon, 
						"autoassign"       => $obj->autoassign, 
						"enabled"          => (integer)$obj->enabled, 
						"available"        => (integer)$obj->available, 
						"uscript"          => $obj->script, 
						"scriptoff"		   => $obj->scriptoff, 
                        "catidxmaster"     => $obj->catidxmaster, 
                        "saledictionaryid" => $obj->saledictionaryid, 
                        "gaap"             => $sdArr, 
						"descrfull"        => $obj->descrfull, 
						"link"     		   => $obj->link,
                		"dtvtype"     => $obj->dtvtype
					); 
				'), array( &$_tmp)); 
			} 
		} 
	} 
 
	foreach ($_tmp as $key=>$val) { 
		if(!isset($val["children"]) || empty($val["children"])) { 
			unset($_tmp[$key]); 
		} 
	} 
 
	$_tmp = array_values($_tmp); 
	if(sizeof($_tmp) > 0) { 
		echo '(' . JEncode($_tmp, $lanbilling) . ')'; 
	} 
	else echo "({ })"; 
} // end getCategories() 
 
 
/** 
 * Return on background request Categories list 
 * @param	object, billing system class 
 */ 
function getTimeDisc( &$lanbilling ) 
{ 
	if( false === ($result = $lanbilling->get("getTarCategory", 
			array(  "id" => (integer)$_POST['timedisc'], 
				"catidx" => (integer)$_POST['category'] ))) ) 
	{ 
		echo "({ results: '' })"; 
		return false; 
	} 
 
	if(isset($result->timediscounts)) 
	{ 
		if(!is_array($result->timediscounts)) 
			$result->timediscounts = array($result->timediscounts); 
 
		$_tmp = array(); 
		foreach($result->timediscounts as $obj) 
		{ 
			$_tmp[] = array( 
				"disid" => $obj->disid, 
				"tarid" => $obj->tarid, 
				"catidx" => $obj->catidx, 
				"type" => $obj->type, 
				"useweekend" => $obj->useweekend, 
				"mon" => $obj->mon, 
				"tue" => $obj->tue, 
				"wed" => $obj->wed, 
				"thu" => $obj->thu, 
				"fri" => $obj->fri, 
				"sat" => $obj->sat, 
				"sun" => $obj->sun, 
				"discount" => $obj->discount, 
				"timefrom" => $obj->timefrom, 
				"timeto" => $obj->timeto 
			); 
		} 
	} 
	else $_tmp = array(); 
 
	if(sizeof($_tmp) > 0) 
		echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})'; 
	else echo "({ results: '' })"; 
} // end getTimeDisc() 
 
 
/** 
 * Return on background request Categories list 
 * @param	object, billing system class 
 * @param	object, result from the server 
 */ 
function getSizeDisc( &$lanbilling ) 
{ 
	if( false === ($result = $lanbilling->get("getTarCategory", 
			array(  "id" => (integer)$_POST['sizedisc'], 
				"catidx" => (integer)$_POST['category'] ))) ) 
	{ 
		echo "({ results: '' })"; 
		return false; 
	} 
 
	if(isset($result->sizediscounts)) 
	{ 
		if(!is_array($result->sizediscounts)) 
			$result->sizediscounts = array($result->sizediscounts); 
 
		$_tmp = array(); 
		foreach($result->sizediscounts as $obj) 
		{ 
			$_tmp[] = array("disid" => $obj->disid, "tarid" => $obj->tarid, "catidx" => $obj->catidx, "type" => $obj->type, 
					"discount" => $obj->discount, "amount" => $obj->amount, "bonus" => $obj->bonus); 
		} 
	} 
 
	if(sizeof($_tmp) > 0) 
		echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})'; 
	else echo "({ results: '' })"; 
} // end getTimeDisc() 
 
 
/** 
 * Try to identify category routes weights 
 * @param	object, billing class 
 */ 
function getRoutesWeight( &$lanbilling ) 
{ 
	$_tmp = array(); 
	if( false != ($category = $lanbilling->get("getTarCategory", array(  "id" => (integer)$_POST['routes'], "catidx" => (integer)$_POST['category'] ))) ) { 
 
		if(isset($category->routeweights) && !is_array($category->routeweights)) { 
			$category->routeweights = array($category->routeweights); 
		} 
 
		$operator = $lanbilling->getOperators($category->tarcategory->operid); 
		if( false != ($vgroups = $lanbilling->get('getVgroups', array('flt' => array('userid' => $operator['uid'], 'category' => 1)))) ) { 
			if(!is_array($vgroups)) { 
				$vgroups = array($vgroups); 
			} 
 
			foreach($vgroups as $item) 
			{ 
				if($item->agenttype == 12) { 
					if( false != ($vgroup = $lanbilling->get('getVgroup', array('id' => $item->vgid))) ) 
					{ 
						if(isset($vgroup->telstaff) && !empty($vgroup->telstaff)) { 
							if(!is_array($vgroup->telstaff)) { 
								$vgroup->telstaff = array($vgroup->telstaff); 
							} 
 
							array_walk($vgroup->telstaff, create_function('$item, $key, $_tmp','$_tmp[0][$item->recordid] = array("routeid" => $item->recordid, "trunk" => $item->phonenumber, "weight" => 1);'), array(&$_tmp)); 
						} 
					} 
				} 
			} 
		} 
 
		if(isset($category->routeweights)) { 
			array_walk($category->routeweights, create_function('&$obj, $key, $_tmp','if(isset($_tmp[0][$obj->routeid])) { $_tmp[0][$obj->routeid]["tarid"] = $obj->tarid; $_tmp[0][$obj->routeid]["catidx"] = $obj->catidx; $_tmp[0][$obj->routeid]["weight"] = $obj->weight; }'), array(&$_tmp)); 
		} 
 
		$_tmp = array_values($_tmp); 
	} 
 
	if(sizeof($_tmp) > 0) 
		echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})'; 
	else echo "({ results: '' })"; 
} // end getRoutesWeight() 
 
 
/** 
 * Get telephony catalogues to build list 
 * @param	object, billing class 
 */ 
function getTelCatalogues( &$lanbilling ) 
{ 
	$_tmp = array(); 
	if( false != ($result = $lanbilling->get("getCatalogs")) ) { 
		if(!empty($result)) { 
			if(!is_array($result)) { $result = array($result); } 
			array_walk($result, create_function('&$obj, $key, $_tmp', ' 
                if($obj->cattype == 3) { 
                    $_tmp[0][] = array( 
                        "operid" => $obj->operid, 
                        "opername" => $obj->opername, 
                        "catid" => $obj->catid, 
                        "catname" => $obj->catname 
                    ); 
                }; 
            '), array(&$_tmp)); 
		} 
	} 
	if(sizeof($_tmp) > 0) 
		echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})'; 
	else echo "({ results: '' })"; 
} // end getTelCatalogues() 
 
 
/** 
 * Get catalogue content according to its type passed by client 
 * @param	object, billing class 
 */ 
function getCatContent( &$lanbilling ) 
{ 
	if((integer)$_POST['catcontent'] == 0 || (integer)$_POST['cattype'] == 0) { 
		echo '({ "total": 0, "results": "" })'; 
		return false; 
	} 
 
	switch($_POST['cattype']) 
	{ 
		case 1: $func = "getIPCatalog"; break; 
		case 2: $func = "getASCatalog"; break; 
		case 3: $func = "getTelCatalog"; break; 
		default: 
			echo "({ results: '' })"; 
			return false; 
	} 
 
	$_filter = array( 
        "catid" => $_POST['catcontent'], 
        "pgsize" => 50, 
        "pgnum" => $lanbilling->linesAsPageNum(50, (integer)$_POST['start'] + 1) 
    ); 
 
	switch($_POST['searchtype']) 
	{ 
		case 1: $_filter["ip"] = (string)$_POST['search']; break; 
		case 2: $_filter["proto"] = (integer)$_POST['search']; break; 
		case 3: $_filter["port"] = (integer)$_POST['search']; break; 
		case 4: $_filter["asnum"] = (integer)$_POST['search']; break; 
		case 5: $_filter["telnum"] = (string)$_POST['search']; break; 
		case 10: $_filter["descr"] = (string)$_POST['search']; break; 
	} 
 
    if (isset($_POST['unavail'])){ 
        $_filter["unavail"] = '1'; 
        $_filter["direction"] = (integer)$_POST['direction']; 
    } 
 
	$_filter = $lanbilling->soapFilter($_filter); 
	$_md5 = $lanbilling->controlSum($_filter); 
	$_tmp = array(); 
    if( false != ($result = $lanbilling->get($func, array("flt" => $_filter, "md5" => $_md5))) ) 
	{ 
		if(empty($result)) { 
			echo '({ "total": 0, "results": "" })'; 
			return false; 
		} 
		if(!is_array($result)) { 
			$result = array($result); 
		} 
		$count = $lanbilling->get("Count", array("flt" => $_filter, "procname" => $func, "md5" => $_md5)); 
		array_walk($result, create_function('$obj, $key, $_tmp', '$o = (array)$obj; if(isset($o["ipmask"])) { $o["zoneip"] = $o["ipmask"]->ip; $o["zonemask"] = $o["ipmask"]->mask; unset($o["ipmask"]); }; $_tmp[0][] = $o;'), array(&$_tmp)); 
	} 
 
	if(sizeof($_tmp) > 0) 
		echo '({"total": ' . $count . ', "results": ' . JEncode($_tmp, $lanbilling) . '})'; 
	else echo '({ "total": 0, "results": "" })'; 
} // end getCatContent() 
 
 
/** 
 * Save recieved category data to DB 
 * @param	object, billing system class 
 */ 
function saveCategory( &$lanbilling, &$localize ) 
{ 
	if((integer)$_POST['tarid'] == 0) { 
		echo "({ success: false, errors: { reason: 'There was an empty tarif id' } })"; 
		$lanbilling->ErrorHandler(__FILE__, "I've got an empty tarif ID. stop saving", __LINE__); 
		return false; 
	} 
	
    /** 
     * Включить трафик в общую группу 
     */ 
    if((integer)$_POST['tartype'] >= 0 && (integer)$_POST['tartype'] < 3) { 
        if (isset($_POST['common']) || $_POST['common_hidden'] == 1) { 
            $_POST['common'] =  1; 
        }else{ 
            $_POST['common'] =  0; 
        } 
	} 

	$options = array('tarcategory' => array( 
		'operid'        => (integer)$_POST['operid'], 
		'tarid'         => (integer)$_POST['tarid'], 
		'catidx'        => (integer)$_POST['catidx'], 
		'includes'      => (integer)$_POST['includes'], 
		'common'        => (integer)$_POST['common'], 
		'above'         => $lanbilling->float($_POST['above']), 
		'disprior'      => (integer)$_POST['disprior'], 
		'descr'         => $lanbilling->stripMagicQuotes($_POST['descr']), 
		"freeseconds"   => (integer)$_POST['freeseconds'], 
		"minchargedur"  => (integer)$_POST['minchargedur'], 
		"roundseconds"  => (integer)$_POST['roundseconds'], 
		"permabove"     => (float)$_POST['permabove'], 
		"admblockabove"     => (float)$_POST['admblockabove'],
		"usrblockabove"     => (float)$_POST['usrblockabove'],
		"uuid"          => $_POST['uuid'], 
		"keepturnedon"  => (integer)$_POST['keepturnedon'], 
		"autoassign"    => (integer)$_POST['autoassign'], 
		"enabled"       => (integer)$_POST['enabled'], 
		"available"     => (integer)$_POST['available'], 
		"script"        => $_POST['uscript'],
		"scriptoff"		=> $_POST['scriptoff'], 
		'timediscounts' => array(), 
		'sizediscounts' => array(), 
        'catidxmaster'  => (integer)$_POST['catidxmaster'], 
        'saledictionaryid' => (integer)$_POST['saledictionaryid'], 
        'link'  => $_POST['link'], 
        'descrfull' => $_POST['descrfull'],
		'dtvtype' => $_POST['dtvtype']
	)); 
 
	if(isset($_POST['timedisc']) && sizeof($_POST['timedisc']) > 0) 
	{ 
		$timeDisStruct = array(); 
 
		foreach($_POST['timedisc'] as $child) 
		{ 
			$timeDisStruct[] = array( 
				"disid" => (integer)$child['disid'], 
				"tarid" => (integer)$_POST['tarid'], 
				"catidx" => (integer)$_POST['catidx'], 
				"discount" => $lanbilling->float($child['discount']), 
				"mon" => $lanbilling->boolean($child['mon']) ? 1 : 0, 
				"tue" => $lanbilling->boolean($child['tue']) ? 1 : 0, 
				"wed" => $lanbilling->boolean($child['wed']) ? 1 : 0, 
				"thu" => $lanbilling->boolean($child['thu']) ? 1 : 0, 
				"fri" => $lanbilling->boolean($child['fri']) ? 1 : 0, 
				"sat" => $lanbilling->boolean($child['sat']) ? 1 : 0, 
				"sun" => $lanbilling->boolean($child['sun']) ? 1 : 0, 
				"useweekend" => ($lanbilling->boolean($child['useweekend'])) ? 1 : 0, 
				"timefrom" => $child['timefrom'], 
				"timeto" => $child['timeto'], 
				"type" => $lanbilling->boolean($child['type']) ? 1 : 0 
			); 
		} 
 
		$options['timediscounts'] = $timeDisStruct; 
	} 
	else unset($options['timediscounts']); 
 
	if(isset($_POST['sizedisc']) && sizeof($_POST['sizedisc']) > 0) 
	{ 
		$sizeDisStruct = array(); 
 
		foreach($_POST['sizedisc'] as $child) 
		{ 
			$sizeDisStruct[] = array( 
				"disid" => (integer)$child['disid'], 
				"tarid" => (integer)$_POST['tarid'], 
				"catidx" => (integer)$_POST['catidx'], 
				"discount" => $lanbilling->float($child['discount']), 
				"type" => $lanbilling->boolean($child['type']) ? 1 : 0, 
				"amount" => (integer)$child['amount'], 
				"bonus" => $lanbilling->float($child['bonus']) 
			); 
		} 
 
		$options['sizediscounts'] = $sizeDisStruct; 
	} 
	else unset($options['sizediscounts']); 
 
	if(isset($_POST['routes']) && sizeof($_POST['routes']) > 0) 
	{ 
		$routes = array(); 
 
		foreach($_POST['routes'] as $child) 
		{ 
			if((integer)$child['weight'] < 0) { 
				continue; 
			} 
			$routes[] = array( 
				"routeid" => (integer)$child['routeid'], 
				"tarid" => (integer)$_POST['tarid'], 
				"catidx" => (integer)$_POST['catidx'], 
				"weight" => (integer)$child['weight'] 
			); 
		} 
 
		if(sizeof($routes) > 0) { 
			$options['routeweights'] = $routes; 
		} 
	} 

    if( false == ($ret = $lanbilling->save("insupdTarCategory", $options, (((integer)$_POST['catidx'] < 0) ? true : false), array("getTarCategories", "getTarCategory"))) ) 
	{ 
		$error = $lanbilling->soapLastError(); 
		echo "({ success: false, errors: { reason: '" . $localize->get($error->detail) . "' } })"; 
		return false;
	} 
	elseif( isset($_POST['cerber_mask']) && $lanbilling->Option('use_cerbercrypt') == 1) 
	{
		$retcatidx = $lanbilling->saveReturns->ret;
		
		$maskid = 0; 
		$catidx = 0; 
		if( (integer)$_POST['catidx'] < 0 ) 
		{ 
			$catidx = $lanbilling->saveReturns->ret; 
			$insert = true; 
		} 
		else 
		{ 
			$catidx = (integer)$_POST['catidx']; 
			if( false === ($res = getCerberMask($lanbilling, (integer)$_POST['tarid'], $catidx)) ) { 
				$error = $lanbilling->soapLastError(); 
				echo "({ success: false, errors: { reason: '" . $lanbilling->explainError($error->type). "' } })"; 
				return; 
			} 
			if( empty($res) ) { 
				$insert = true; 
			} else { 
				$maskid = $res['maskid']; 
				$insert = false; 
			} 
		} 
 
		$cerber = array( 
			"maskid" => $maskid, 
			"tarid" => (integer)$_POST['tarid'], 
			"catidx" => $catidx, 
			"mask" => $_POST['cerber_mask'] 
		); 
 
		if( false == ($ret = $lanbilling->save("insupdCerberMask", $cerber, $insert, array("getCerberMasks"))) ) 
		{ 
			$error = $lanbilling->soapLastError(); 
			echo $lanbilling->explainError($error->type); 
		} 
	} 
	else
		$retcatidx = $lanbilling->saveReturns->ret;
	
	$_POST['catidx'] = $retcatidx;
	if(true !== ($resp = setTarCategoryDiscount($lanbilling, $localize))) {
		return false;
	}
 
	echo '({ success: true, catidx: ' . $retcatidx . ' })'; 
 
} // end saveCategory() 
 
 
/** 
 * Save sent data from client through soap 
 * @param	object, billing system 
 */ 
function saveTarifData( &$lanbilling ) 
{ 
	if($_POST['curid'] < 1) { 
		$_POST['curid'] = 1; 
	} 
	 
	// Prepare Array construction to fill data to 
	$struct = array( "tarif" => array( 
		"tarid" => (integer)$_POST['tarif'], 
		"type" => isset($_POST['type']) ? $_POST['type'] : $_POST['tartype'], 
		"shape" => $_POST['shape'], 
		"trafflimit" => (integer)$_POST['trafflimit'], 
		"trafflimitper" => (integer)$_POST['trafflimitper'], 
		"actblock" => $_POST['actblock'], 
		"archive" => 0, 
		"priceplan" => $_POST['priceplan'], 
		"trafftype" => $_POST['trafftype'], 
		"dailyrent" => $_POST['dailyrent'], 
		"dynamicrent" => $_POST['dynamicrent'], 
		"shapeprior" => $_POST['shapeprior'], 
		"unavaliable" => isset($_POST['unavaliable']) ? 1 : 0, 
		"rent" => $lanbilling->float($_POST['rent']), 
		"chargeincoming" => (integer)$_POST['chargeincoming'], 
		"blockrent" => $lanbilling->float($_POST['blockrent']), 
		"usrblockrent" => $lanbilling->float($_POST['usrblockrent']), 
		"admblockrent" => $lanbilling->float($_POST['admblockrent']), 
		"descr" => $_POST['descr'], 
		"rentmultiply" => (integer)$_POST['rentmultiply'], 
		"voipblocklocal" => (integer)$_POST['voipblocklocal'], 
		"dynroute" => (integer)$_POST['dynroute'], 
		"curid" => (integer)$_POST['curid'], 
		"blockrentduration" => (integer)$_POST['blockrentduration'], 
		"coeflow" => $lanbilling->float($_POST['coeflow']), 
		"coefhigh" => $lanbilling->float($_POST['coefhigh']), 
		"link" => $_POST['link'], 
		"descrfull" => $_POST['descrfull'], 
		"additional" => (integer)$_POST['additional'], 
        "saledictionaryid" => $lanbilling->float($_POST['saledictionaryid']) 
		), 
		"sizeshapes" => '', 
		"timeshapes" => '' 
	); 
	 
	if(!empty($_POST['catnumbers'])) { 
		array_walk(explode(",", $_POST['catnumbers']), create_function('&$val, $key, $_tmp', '$_tmp[0]["catnumbers"][] = array("val" => $val);'), array(&$struct['tarif'])); 
	} 
 
	if(isset($_POST['sizeshp']) && sizeof($_POST['sizeshp']) > 0) 
	{ 
		$sizeShpStruct = array(); 
 
		foreach($_POST['sizeshp'] as $child) 
		{ 
			$sizeShpStruct[] = array( 
				"id" => (integer)$child['id'], 
				"amount" => (integer)$child['amount'], 
				"tarid" => (integer)$_POST['tarif'], 
				"shaperate" => (integer)$child['shaperate'] 
			); 
		} 
 
		$struct['sizeshapes'] = $sizeShpStruct; 
	} 
	else unset($struct['sizeshapes']); 
 
	if(isset($_POST['timeshp']) && sizeof($_POST['timeshp']) > 0) 
	{ 
		$timeShpStruct = array(); 
 
		foreach($_POST['timeshp'] as $child) 
		{ 
			$timeShpStruct[] = array( 
				"id" => (integer)$child['id'], 
				"tarid" => (integer)$_POST['tarif'], 
				"shaperate" => (integer)$child['shaperate'], 
				"mon" => $lanbilling->boolean($child['mon']) ? 1 : 0, 
				"tue" => $lanbilling->boolean($child['tue']) ? 1 : 0, 
				"wed" => $lanbilling->boolean($child['wed']) ? 1 : 0, 
				"thu" => $lanbilling->boolean($child['thu']) ? 1 : 0, 
				"fri" => $lanbilling->boolean($child['fri']) ? 1 : 0, 
				"sat" => $lanbilling->boolean($child['sat']) ? 1 : 0, 
				"sun" => $lanbilling->boolean($child['sun']) ? 1 : 0, 
				"useweekend" => ($lanbilling->boolean($child['useweekend'])) ? 1 : 0, 
				"timefrom" => $child['timefrom'], 
				"timeto" => $child['timeto'] 
			); 
		} 
 
		$struct['timeshapes'] = $timeShpStruct; 
	} 
	else unset($struct['timeshapes']); 
	 
	if( false != $lanbilling->save("insupdTarif", $struct, (((integer)$_POST['tarif'] == 0) ? true : false), array("getTarif", "getTarifsExt", "getTarCategory")) ) 
	{ 
		$_POST['tarif'] = $lanbilling->saveReturns->ret; 
		return true; 
	} 
	else { 
		return false; 
	} 
} // end saveTarifData() 
 
 
/** 
 * Save recivied directions to the selected category 
 * @param	object, billing class 
 * @param	object, localize class 
 */ 
function saveDirections( &$lanbilling, &$localize ) 
{ 
	$_withError = array(); 
 
	if(is_array($_POST['directionsave']) && sizeof($_POST['directionsave']) > 0) 
	{ 
		foreach($_POST['directionsave'] as $arr) 
		{ 
			$struct = array( 
				'tarid' => (integer)$_POST['tarid'], 
				'catidx' => (integer)$_POST['catidx'], 
				'zoneid' => (integer)$arr['id'], 
				'direction' => (integer)$_POST['direction'], 
				'catid' => (integer)$arr['catid'] 
			); 
 
			if((integer)$_POST['upcattype'] > 0) { 
				switch($_POST['upcattype']) { 
					case 1: 
						$struct['proto'] = $arr['proto']; 
						$struct['port'] = $arr['port']; 
						$struct['ipmask'] = array( 
							'ip' => $arr['ip'], 
							'mask' => $arr['mask'] 
						); 
					break; 
 
					case 2: 
						$struct['number'] = $arr['as']; 
					break; 
 
					case 3: 
						$struct['number'] = $arr['number']; 
						$struct['classid'] = $arr['class']; 
					break; 
				} 
 
				$struct['descr'] = $arr['descr']; 
			} 
 
			if(false == $lanbilling->save("insCatItem4Category", $struct, true, array("getTarCategory")) ) { 
				$error = $lanbilling->soapLastError(); 
				$_withError[] = array( 
					(empty($struct['number']) ? ($arr['ip'] . ", " . $arr['proto'] . ", " . $arr['port']) : $struct['number']), 
					$arr['descr'], 
					$localize->get($error->detail)); 
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
} // end saveDirections() 
 
 
/** 
 * Remove existing tarif categories from the database 
 * @param	object, system main class 
 * @param	object, localize class 
 */ 
function deleteCategories( &$lanbilling, &$localize ) 
{ 
	if((integer)$_POST['catdelete'] > 0) 
	{ 
		if( false != $lanbilling->delete("delTarCategory", array('tarid' => $_POST['tarid'], 'catidx' => $_POST['catdelete']), array("getTarCategories")) ) 
		{ 
			if( $lanbilling->Option('use_cerbercrypt') == 1 ) { 
				$res = getCerberMask($lanbilling, (integer)$_POST['tarid'], (integer)$_POST['catdelete']); 
				if( $res ) { 
					if( false == $lanbilling->delete("delCerberMask", array('id' => $res['maskid']), array("getTarCategories")) ) 
					{ 
						$error = $lanbilling->soapLastError(); 
						echo "({ success: false, errors: { reason: '" . $lanbilling->explainError($error->type). "' } })";
						return false; 
					} 
				} 
			} 
		} 
		else { 
			$error = $lanbilling->soapLastError(); 
			$msg = $lanbilling->explainError($error->type);
			if(strstr($error->detail, "is used in Usbox services")) {
				$msg = $localize->compile("<%@ Category is used %>"); 
			} else if(strstr($error->detail, "No delete category")) {
				$msg = $localize->compile("<%@ No delete category %>");
			}
			echo "({ success: false, errors: { reason: '" . $msg. "' } })"; 
			return false; 
		} 
	}
 
	echo "({ success: true })";
} // end deleteTarif() 
 
 
/** 
 * Remove existing category directions from the database 
 * @param	object, system main class 
 * @param	object, localize class 
 */ 
function deleteDirections( &$lanbilling, &$localize ) 
{ 
	if(is_array($_POST['directiondelete']) && sizeof($_POST['directiondelete']) > 0) 
	{ 
		foreach($_POST['directiondelete'] as $arr) 
		{ 
			$struct = array( 
				"tarid" => $_POST['tarid'], 
				"catidx" => $_POST['catidx'], 
				"zoneid" => $arr['zoneid'], 
				"catid" => $arr['catid'], 
				"direction" => (integer)$arr['direction'] 
			); 
 
			if( false == $lanbilling->delete("delCatItem4Category", array('val' => $struct), array("getTarCategory")) ) 
			{ 
				$error = $lanbilling->soapLastError(); 
				echo "({ success: false, errors: { reason: '" . $localize->get("There was an error while sending data to server") . ": " . $localize->get($error->detail) . "' } })"; 
				return false; 
			} 
		} 
	} 
 
	echo "({ success: true })"; 
} // end deleteTarif() 
 
 
/** 
 * Save uploaded direction from file to the specified category 
 * @param	object, billing class 
 * @param	object, localize class 
 */ 
function saveDirFromFile( &$lanbilling, &$localize ) 
{ 
	if( false == ($files = $lanbilling->UploadCheck('upcontent')) ) 
	{ 
		echo "({ success: false, errors: { reason: 1 } })"; 
		return false; 
	} 
 
	if((integer)$_POST['upcatid'] == 0) { 
		echo "({ success: false, errors: { reason: '" . $localize->get('Undefined') . " " . $localize->get('catalog') . "' } })"; 
		return false; 
	} 
 
	if( false == ($catalog = $lanbilling->get("getCatalog", array("id" => $_POST['upcatid']))) ) { 
		$error = $lanbilling->soapLastError(); 
		echo "({ success: false, errors: { reason: '" . $localize->get("There was an error while sending data to server") . ": " . $error->detail . "' } })"; 
		return false; 
	} 
 
	switch($catalog->cattype) { 
		case 1: 
			$_POST['directionsave'] = $lanbilling->csvFileToArray($files[0]['tmp_name'], 6, array('id', 'ip', 'mask', 'proto', 'port', 'descr')); 
		break; 
 
		case 2: 
			$_POST['directionsave'] = $lanbilling->csvFileToArray($files[0]['tmp_name'], 3, array('id', 'as', 'descr')); 
		break; 
 
		case 3: 
			$_POST['directionsave'] = $lanbilling->csvFileToArray($files[0]['tmp_name'], 4, array('id', 'number', 'class', 'descr')); 
		break; 
	} 
 
	foreach($_POST['directionsave'] as $key => $item) { 
		$_POST['directionsave'][$key]['catid'] = (integer)$_POST['upcatid']; 
	} 
 
	$_POST['catidx'] = $_POST['upcatidx']; 
	$_POST['upcattype'] = $catalog->cattype; 
	$_POST['direction'] = $_POST['updirection']; 
 
	saveDirections($lanbilling, $localize); 
} // end saveDirFromFile() 
 
 
/** 
 * Get cerber mask 
 * @param	object, system main class 
 * @param	integer, tariff id 
 * @param	integer category id 
 */ 
function getCerberMask($lanbilling, $tarid, $catidx) { 
 
	$result = $lanbilling->get("getCerberMasks"); 
	if( false === $result ) { 
		return false; 
	} 
 
	if( !is_array($result) ) { 
		$result = array($result); 
	} 
 
	$res = array(); 
	foreach( $result as $item ) { 
		if( $item->tarid == $tarid && $item->catidx == $catidx ) { 
			$res["maskid"] = $item->maskid; 
			$res["mask"] = $item->mask; 
			break; 
		} 
	} 
 
	return $res; 
} 
 
 
/** 
 * Echo cerber mask as array for acynch call 
 * @param	object, system main class 
 */ 
function getCerberMaskArr($lanbilling) { 
 
	$res = getCerberMask($lanbilling, (integer)$_POST['tarid'], (integer)$_POST['catid']); 
	$str = ""; 
	if( !empty($res) ) { 
		$mask = $res['mask']; 
		$arr = preg_split('//', $mask, -1, PREG_SPLIT_NO_EMPTY); 
		for($i = 0; $i < 8; $i++) { 
			$n = 16*$i; 
			$s = ""; 
			for($j = 0; $j < 16; $j++) { 
				if( strlen($s) ) $s .= ","; 
				$s .= "{$arr[$n + $j]}"; 
			} 
			$s = "[{$s}]"; 
			if( strlen($str) ) $str .= ","; 
			$str .= $s; 
		} 
	} 
 
	if( !strlen($str) ) { 
		for($j = 0; $j < 8; $j++) { 
			if( strlen($str) ) $str .= ","; 
			$str .= "[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,]"; 
		} 
	} 
	echo "[{$str}]"; 
} // end getCerberMaskArr() 
 
 
/** 
 * Get simple tariff list on background request 
 * @param	object, billing blass 
 */ 
function getSimpleTarifsList( &$lanbilling ) 
{ 
	$_tmp = array(); 
 
	if( false != ($result = $lanbilling->get("getTarifs", array("archive" => 0, "unavail" => (integer)$_POST['getsimpletarifs'], "formanager" => 1))) ) 
	{ 
		if(!is_array($result)) { 
			$result = array($result); 
		} 
 
		array_walk($result, create_function('$item, $key, $_tmp', '$_tmp[0][] = (array)$item;'), array( &$_tmp )); 
	} 
 
	if(sizeof($_tmp) > 0) 
		echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})'; 
	else echo "({ results: '' })"; 
} // end getTarifsList() 
 
 
/** 
 * Get the list of avalaible holidays in the period 
 * @param		object, billing class 
 * @param		object, localize class 
 */ 
function getHolidays( &$lanbilling, &$localize ) 
{ 
	$_tmp = array(); 
 
	if(!preg_match('/[\d]{6}/', $_POST['getholidays'])) { 
		$_POST['getholidays'] = date('Ym'); 
	} 
 
	$C = new calMonthGrid(substr($_POST['getholidays'], 0, 4) . '-' . substr($_POST['getholidays'], 4, 2) . '-01'); 
	$G = $C->get(); 
 
	array_walk($G, create_function('$item, $key, $_tmp', ' 
		$_tmp[0][$key] = array( 
			"item" => $key . "000000", 
			"day" => date("D", $item), 
			"flag" => -1 
		); 
	'), array( &$_tmp )); 
 
	if(false != ($result = $lanbilling->get("getWeekends", array("dtfrom" => $C->getFirst('Ymd'), "dtto" => $C->getLast('Ymd'))))) { 
		if(!is_array($result)) { 
			$result = array($result); 
		} 
 
		array_walk($result, create_function('$item, $key, $_tmp',' 
			$k = str_replace("-", "", $item->date); 
			if(isset($_tmp[0][$k])) { 
				$_tmp[0][$k]["flag"] = $item->weflag; 
			}; 
		'), array( &$_tmp )); 
	} 
 
	$_tmp = array_values($_tmp); 
 
	echo '({ "results" : ' . JEncode($_tmp, $lanbilling) . ' })'; 
} // end getHolidays() 
 
 
/** 
 * Save passed holidays 
 * @param	object, billing class 
 * @param	object, localize class 
 */ 
  
function saveHolidays( &$lanbilling, &$localize ) 
{ 
	$_withError = array(); 
 
	if(is_array($_POST['saveholidays']) && sizeof($_POST['saveholidays']) > 0){ 
		foreach($_POST['saveholidays'] as $key => $item) { 
			$struct = array( 
				"date" => $key, 
				"weflag" => $lanbilling->boolean($item) 
			); 
 
			if(false == $lanbilling->save("updWeekend", $struct, true, array("getWeekends")) ) { 
				$error = $lanbilling->soapLastError(); 
				$_withError[] = array( 
					$key, 
					$localize->get($error->detail) 
				); 
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
} // end saveHolidays() 
 
/** 
 * Returns CAS Packages list 
 * @param   object, main class 
 */ 
function getCASPackages(&$lanbilling) 
{ 
    try { 
        $filter = array( 
            "fullsearch" => (string)$_POST['fullsearch'], 
            "pgsize" => ((integer)$_POST['limit'] <= 0) ? 100 : $_POST['limit'] 
        ); 
         
        $filter['pgnum'] = $lanbilling->linesAsPageNum($filter['pgsize'], (integer)$_POST['start'] + 1); 
         
        if( false === ($result = $lanbilling->get("getCASPackages", array("flt" => $filter))) ) { 
            throw new Exception ($lanbilling->soapLastError()->detail); 
        } 
         
        if($result) { 
            if(!is_array($result)) { 
                $result = array($result); 
            } 
             
            $_md5 = $lanbilling->controlSum($filter); 
            $count = $lanbilling->get("Count", array("flt" => $filter, "procname" => "getCASPackages", "md5" => $_md5)); 
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
            "total" => (integer)$count, 
            "success" => true, 
            "error" => null 
        ); 
    } 
     
    echo "(" . JEncode($_response, $lanbilling) . ")"; 
} // end getCASPackages() 
 
 
/** 
 * Get discounts for usbox agent (tarif categories) 
 * @param   object, main class 
 */ 
function getTarCategoryDiscount(&$lanbilling, &$localize) 
{ 
    try { 
        $struct = array( 
			"tarid" => (int)$_POST['tarid'], 
			"catidx" => (int)$_POST['catidx'] 
        ); 
 
        if( false === ($result = $lanbilling->get("getTarCategoryDiscount", $struct )) ) { 
            throw new Exception ($localize->get($lanbilling->soapLastError()->detail)); 
        } 
        $_tmp = array(); 
 
		if(!empty($result->discounts) && !is_array($result->discounts)) { 
			$result->discounts = array($result->discounts); 
		} 
 
        if($result) { 
			foreach($result->discounts as $item) { 
				$_tmp[] = array( 
					"count" => $item->count, 
					"rate" => $item->rate, 
					"object" => $result->object 
				); 
			} 
		} 
    } 
    catch(Exception $error) { 
        $_response = array( 
            "results" => (array)$_tmp, 
            "success" => false, 
            "error" => $localize->get($error->getMessage()) 
        ); 
    } 
     
    if(!$_response) { 
        $_response = array( 
            "results" => (array)$_tmp, 
            "success" => true, 
            "error" => null 
        ); 
    } 
     
    echo "(" . JEncode($_response, $lanbilling) . ")"; 
} // end getTarCategoryDiscounts() 
 
 
 
/** 
 * Insert and update discount for usbox (tar categs) 
 * @param   object, main class 
 */ 
function setTarCategoryDiscount(&$lanbilling, &$localize, $s = false) 
{		 
	$discount = array(); 
	if($_POST['setDisc'][0] != '') { 
		foreach($_POST['setDisc'] as $item) { 
			 $split = explode(';', $item); 
			 $discount[] = array("count"=>$split[0] , "rate"=>$split[1]); 
		} 
	} else { 
		$discount = ''; 
	} 
	 
	$data = array( 
		"tarid" => (int)$_POST['tarid'], 
		"catidx" => (int)$_POST['catidx'], 
		"object" => (int)$_POST['usingBy']
	); 

	if(!empty($discount)) {
		$data['discounts'] = $discount;
	}
	
	if( false == ($ret = $lanbilling->save("insupdTarCategoryDiscount", $data, false)) )
	{
		$error = $lanbilling->soapLastError(); 
		echo '({success: false, errors: { reason: "'. $localize->get($error->detail) .'"}})';
		return false;
	} 
     
    return true; 
} // end setTarCategoryDiscount() 
