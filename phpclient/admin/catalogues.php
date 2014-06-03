<?php
/**
 * Catalogues engine file. Caomtains sync and asyn query response
 * 
 * Repository information:
 * $Date$
 * $Revision$
 */

// Link IP class
if($lanbilling->ifIncluded("ip_calc_compare.php") == false)
	include_once("ip_calc_compare.php");

// There is background query
if(isset($_POST['async_call']))
{
	if(isset($_POST['getcatlist'])) {
		getCataloguesList($lanbilling);
	}
	
	if(isset($_POST['gettelclass'])) {
		getTelClasses($lanbilling);
	}
	
	if(isset($_POST['savetelclass'])) {
		saveTelClasses($lanbilling);
	}
	
	if(isset($_POST['operators'])) {
		getOperators($lanbilling);
	}
	
	if(isset($_POST['catdelete'])) {
		deleteCatalogue($lanbilling);
	}
	
	if(isset($_POST['getcontent'])){
		getCatContent($lanbilling);
	}
	
	if(isset($_POST['savecat'])) {
		saveCatInfo($lanbilling);
	}
	
	if(isset($_POST['zonesave']) || isset($_POST['zonedelete'])) {
		saveCatContent($lanbilling, $localize);
	}
	
	if(isset($_POST['upcatcode'])) {
		CSVToCatalogue($lanbilling, $localize);
	}
	
	if(isset($_POST['downcatcode'])) {
		CatalogueToCSV($lanbilling);
	}
	
	if(isset($_POST['getdefoper'])) {
		getDefaultOperator($lanbilling);
	}
}
// There is standart query
else
{
	$tpl = new HTML_Template_IT(TPLS_PATH);
	$tpl->loadTemplatefile("catalogues.tpl", true, true);
	$tpl->touchBlock("__global__");
	
	$localize->compile($tpl->get(), true);
}


/**
 * Get catalogue content according to its type passed by client
 * @param	object, billing class
 */
function getCatContent( &$lanbilling )
{
	if((integer)$_POST['getcontent'] == 0 || (integer)$_POST['cattype'] == 0) {
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
	
	$_filter = array("catid" => $_POST['getcontent'], "pgsize" => 50, "pgnum" => $lanbilling->linesAsPageNum(50, (integer)$_POST['start'] + 1));
	switch($_POST['searchtype'])
	{
		case 1: $_filter["ip"] = (string)$_POST['search']; break;
		case 2: $_filter["proto"] = (integer)$_POST['search']; break;
		case 3: $_filter["port"] = (integer)$_POST['search']; break;
		case 4: $_filter["asnum"] = (integer)$_POST['search']; break;
		case 5: $_filter["telnum"] = (string)$_POST['search']; break;
		case 10: $_filter["descr"] = (string)$_POST['search']; break;
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
 * Save data of the selected catalogue to DB
 * @param	object, billing class
 */
function saveCatContent( &$lanbilling, &$localize )
{
	if((integer)$_POST['catid'] == 0 || (integer)$_POST['cattype'] == 0) {
		echo "({ success: false, reason: '" . $localize->get('Undefined') . ' ' . $localize->get('catalogue') . "' })";
		return false;
	}
	
	// Errors array declaration
	$_withError = array();
	
	// Flag to indentify privios error
	$_false = false;
	
	if(!empty($_POST['zonedelete']))
	{
		foreach($_POST['zonedelete'] as $arr)
		{
			if($arr['catid'] != $_POST['catid']) continue;
			switch($_POST['cattype'])
			{
				case 1: $func = "delIPCat"; $clear = array("getIPCatalog"); break;
				case 2: $func = "delASCat"; $clear = array("getASCatalog"); break;
				case 3: $func = "delTelCat"; $clear = array("getTelCatalog"); break;
			} 
			
			if( false == $lanbilling->delete($func, array("id" => (integer)$arr['zoneid'], "force" => (integer)$_POST['force']), $clear) ){
				$error = $lanbilling->soapLastError();
				if(false !== strpos($error->detail, 'used in')) {
					$_withError[] = array($arr['descr'], $localize->get('Remove'), $localize->get('This is used in tariff') . ': ' . substr($error->detail, strpos('tarif_descr')));
				}
				else {
					$_withError[] = array($arr['descr'], $localize->get('Remove'), $error->detail);
				}
			}
		}
	}
	
	if(!empty($_POST['zonesave']))
	{
		foreach($_POST['zonesave'] as $arr)
		{
			if($arr['catid'] != $_POST['catid']) continue;
			switch($_POST['cattype'])
			{
				case 1: $struct = array("catid" => $_POST['catid'], "zoneid" => (integer)$arr['zoneid'], "proto" => (integer)$arr['proto'], "port" => (integer)$arr['port'], "descr" => $arr['descr'], "ipmask" => array("ip" => $arr['zoneip'], "mask" => (integer)$arr['zonemask']));
					$func = "insupdIPCat";
					$clear = array("getIPCatalog");
				break;
				
				case 2: $struct = array("catid" => $_POST['catid'], "zoneid" => (integer)$arr['zoneid'], "zoneas" => (integer)$arr['zoneas'], "descr" => $arr['descr']);
					$func = "insupdASCat";
					$clear = array("getASCatalog");
				break;
				
				case 3: $struct = array("catid" => $_POST['catid'], "zoneid" => (integer)$arr['zoneid'], "zoneclass" => (integer)$arr['zoneclass'], "zonenum" => trim($arr['zonenum']), "descr" => $arr['descr']);
					$func = "insupdTelCat";
					$clear = array("getTelCatalog");
				break;
			}
			
			if( false == $lanbilling->save($func, $struct, ($struct['zoneid'] == 0) ? true : false, $clear)) {
				$error = $lanbilling->soapLastError();
				$_withError[] = array($arr['descr'], $localize->get('Save'), $error->detail);
			}
		}
	}
	
	if(empty($_withError)) {
		echo "({ success: true, reason: '" . $localize->get('Request done successfully') . "' })";
	}
	else {
		if(sizeof($_withError) == 1) {
			
			$msg = $_withError[0][2];
			
			if(preg_match("~already exist in catalog~", $msg)) {
				$number = str_replace('A number' , '' , str_replace(' already exist in catalog' , '' , $msg));
				$msg =  $localize->get('Number') . ' ' . $number . ' ' . $localize->get('already exist in catalog');
			}			
			
			echo "({ success: false, reason: " . JEncode($msg, $lanbilling) . "})";
		}
		else {
			echo "({ success: false, reason: " . JEncode($_withError, $lanbilling) . "})";
		}
	}
} // end saveCatContent()


/**
 * Get operators list
 * @param	object, billing class
 */
function getOperators( &$lanbilling )
{
	$_tmp = array();
	$result = $lanbilling->getOperators();
	
	if(!empty($result)) {
		array_walk($result, create_function('$item, $key, $_tmp', '$_tmp[0][] = array("id" => $item["uid"], "name" => $item["name"]);'), array(&$_tmp));
	}
	
	if(sizeof($_tmp) > 0)
		echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
	else echo "({ results: '' })";
} // end getOperators()


/**
 * Get telephone direction classes
 * @param	object, billing class
 */
function getTelClasses($lanbilling)
{
	$_tmp = array();
	if( false != ($result = $lanbilling->get("getTelClasses")) )
	{
		if(!empty($result))
		{
			if(!is_array($result)) {
				$result = array($result);
			}
			
			array_walk($result, create_function('&$obj, $key, $_tmp', '$_tmp[0][] = array("id" => $obj->id, "name" => $obj->name, "descr" => $obj->descr);'), array(&$_tmp));
		}
	}
	
	if(sizeof($_tmp) > 0)
		echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
	else echo "({ results: '' })";
} // end getTelClasses()


/**
 * Save modified or new phone direction classes
 * @param object $lanbilling 
 */
function saveTelClasses( &$lanbilling ){
	$lanbilling->flushCache(array('getTelClasses'));
	
	if(isset($_POST['savetelclass']['removed'])){
		foreach($_POST['savetelclass']['removed'] as $id){
			if((integer)$id <= 0){
				continue;
			}
			if( false == $lanbilling->delete('delTelClass', array('id' => (integer)$id)) ) {
				$error = $lanbilling->soapLastError();
				echo '({ success: false, errors: { reason: "There was an error while removing class: ' . $error->detail . '" } })';
				return false;
			}
		}
	}
	
	if(isset($_POST['savetelclass']['modified'])){
		foreach($_POST['savetelclass']['modified'] as $item){
			$struct = array(
				'id' => (integer)$item['id'],
				'name' => $item['name'],
				'descr' => $item['descr']
			);
			
			if( false == $lanbilling->save('insupdTelClass', $struct, ((integer)$item['id'] < 0) ? true : false ) ){
				$error = $lanbilling->soapLastError();
				echo '({ success: false, errors: { reason: "There was an error while saving class: ' . $error->detail . '" } })';
				return false;
			}
		}
	}
	
	echo '({ success: true })';
} // end saveTelClasses()


/**
 * Get exitsting list of the catalogues
 * @param	object, billing class
 */
function getCataloguesList( &$lanbilling )
{
	$_tmp = array();
	$result = $lanbilling->getOperators();
	
	if(!empty($result))
	{
		array_walk($result, create_function('$item, $key, $_tmp', '$_tmp[0][$item["uid"]] = array("id" => $item["uid"], "operid" => $item["uid"], "text" => $item["name"], "group" => true);'), array(&$_tmp));
		
		if( false != ($leaves = $lanbilling->get("getCatalogs")) ) {
			if(!empty($leaves))
			{
				if(!is_array($leaves)) {
					$leaves = array($leaves);
				}
				
				array_walk($leaves, create_function('&$obj, $key, $_tmp','switch($obj->cattype){ case 1: $icon = "ext-leased"; break; case 2: $icon = "ext-leased"; break; case 3: $icon = "ext-cdrpabx"; break; }; $_tmp[0][$obj->operid]["children"][] = array("id" => ($obj->operid + 1) . $obj->catid, "catid" => $obj->catid, "cattype" => $obj->cattype, "operid" => $obj->operid, "catname" => $obj->catname, "text" => $obj->catname, "used" => $obj->used, "leaf" => true, "iconCls" => $icon);'), array( &$_tmp ));
			}
		}
		
		array_walk($_tmp, create_function('&$val, $key, $_tmp', 'if(!isset($val["children"])) { $_tmp[0][$key]["leaf"] = true; };'), array(&$_tmp));
	}
	
	$_tmp = array_values($_tmp);
	if(sizeof($_tmp) > 0) { 
		echo '(' . JEncode($_tmp, $lanbilling) . ')';
	}
	else echo "({ })";
} // end getCatalogueList()


/**
 * Save information about catalogue
 * @param	object, billing class
 */
function saveCatInfo( &$lanbilling )
{
	$struct = array(
		'catid' => (integer)$_POST['savecat'],
		'cattype' => (integer)$_POST['cattype'],
		'operid' => (integer)$_POST['operid'],
		'catname' => $_POST['catname'] );
	
	try {
		$lanbilling->save("insupdCatalog", $struct, ((integer)$_POST['savecat'] == 0) ? true : false, array("getCatalogs", "getTarCategories", "getTarCategory"));
		if($lanbilling->saveReturns->ret > 0) {
			echo "({ success: true })";
		}
		else {
			throw new Exception($lanbilling->soapLastError()->detail);
		}
	} catch(Exception $e) { echo "({ success: false, errors: { reason: '". $e->getMessage() ."' } })"; }
} // end saveCatInfo()


/**
 * Remove catalog from the DB
 * @param	object, billing class
 */
function deleteCatalogue( &$lanbilling )
{
	if((integer)$_POST['catdelete'] == 0) {
		echo "({ success: false, errors: { reason: 'Unknown catalogue ID' } })";
		return false;
	}
	
	try {
		$lanbilling->delete("delCatalog", array("id" => $_POST['catdelete']), array("getCatalogs", "getTarCategories", "getTarCategory"));
		echo "({ success: true })";
	} catch(Exception $e) { echo "({ success: false, errors: { reason: '". $e->getMessage() ."' } })"; }
} // end deleteCatalogue()


/**
 * Save recieved data in CSV file to selected catalog
 * @param	object, billing class
 * @param	object, localize class
 */
function CSVToCatalogue( &$lanbilling, &$localize )
{
	if( false == ($files = $lanbilling->UploadCheck('upcontent')) )
	{
		echo "({ success: false, errors: { reason: 1 } })";
		return false;
	}
	
	switch((integer)$_POST['upcattype'])
	{
		case 1: $struct = array("zoneid", "zoneip", "zonemask", "port", "proto", "descr"); 
			$column = 6;
		break;
		
		case 2: $struct = array("zoneid", "zoneas", "descr"); 
			$column = 3;
		break;
		
		case 3: $struct = array("zoneid", "zonenum", "zoneclass", "descr"); 
			$column = 4;
		break;
		
		default: echo "({ success: false, errors: { reason: 2 } })";
		return false;
	}
	
	$_POST['zonesave'] = $lanbilling->csvFileToArray($files[0]['tmp_name'], $column, $struct);
	
	foreach($_POST['zonesave'] as $key => $item) {
		$item['catid'] = $_POST['upcatcode'];
		$_POST['zonesave'][$key] = $item;
	}
	
	$_POST['catid'] = $_POST['upcatcode'];
	$_POST['cattype'] = $_POST['upcattype'];
	
	// Clone with new connection timout
	$lb = $lanbilling->cloneMain(array('query_timeout' => 600));
	saveCatContent($lb, $localize);
} // end CSVToCatalogue()


/**
 * Compile catalogue data as csv format and send it to client
 * @param	object, billing class
 */
function CatalogueToCSV( &$lanbilling )
{
	if((integer)$_POST['downcatcode'] == 0 || (integer)$_POST['downcattype'] == 0) {
		return false;
	}
	
	switch($_POST['downcattype'])
	{
		case 1: $func = "getIPCatalog"; break;
		case 2: $func = "getASCatalog"; break;
		case 3: $func = "getTelCatalog"; break;
		default: return false;
	}
	
	$_filter = array("catid" => $_POST['downcatcode'], "pgsize" => 50, "pgnum" => 0);
	$_filter = $lanbilling->soapFilter($_filter);
	$_md5 = $lanbilling->controlSum($_filter);
	$_tmp = array();
	
	if( false != ($result = $lanbilling->get($func, array("flt" => $_filter, "md5" => $_md5))) )
	{
		if(empty($result)) {
			return false;
		}
		
		if(!is_array($result)) {
			$result = array($result);
		}
		
		foreach($result as $item)
		{
			switch($_POST['downcattype'])
			{
				case 1: $line = array($item->zoneid, $item->ipmask->ip, $item->ipmask->mask, $item->port, $item->proto, $item->descr); break;
				case 2: $line = array($item->zoneid, $item->zoneas, $item->descr); break;
				case 3: $line = array($item->zoneid, $item->zonenum, $item->zoneclass, $item->descr); break;
			}
			
			foreach($line as $key => $val) {
				if(is_string($val)) {
					$str_encoding = mb_detect_encoding($val, $lanbilling->encodingName('UTF8, CP1251, KOI8R, ASCII'), true);
					if($lanbilling->encodingName($str_encoding) != 'UTF-8') {
						$val = iconv($str_encoding, $lanbilling->encodingName('UTF8'), $val);
					}
					
					$line[$key] = sprintf('"%s"', $val);
				}
			}
			
			$_tmp[] = implode(';', $line);
		}
	}
	
	if(sizeof($_tmp) > 0) {
		$lanbilling->Download('', 'catalogue.csv', implode("\n", $_tmp));
	}
} // end CatalogueToCSV()



/**
 * Getting default operator name and id
 * @param	object, billing class
 */
function getDefaultOperator( &$lanbilling )
{
	
	if( false == ($result = $lanbilling->get("getOptionByName", array("name" => 'default_operator'))) ) {
		$error = $lanbilling->soapLastError()->detail;
	}
	
	if(!is_array($result)) {
		$result = array($result);
	}
	
	if(sizeof($result) > 0) echo '({success: true, "results": ' . JEncode($result, $lanbilling) . '})';
	else echo "({ success: false, reason: " . JEncode($error, $lanbilling) . "})";
	
} // end getDefaultOperator()

