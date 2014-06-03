<?php
/**
 * Address book
 *
 * Repository information:
 * $Date: 2009-11-24 10:58:50 $
 * $Revision: 1.1.2.6 $
 */

// There is background query
if(isset($_POST['async_call']))
{
	if(isset($_POST['saveaddress'])) {
		saveAddressItems($lanbilling);
	}

	if(isset($_POST['removeaddress'])) {
		delAddressItem($lanbilling, $localize);
	}

	if(isset($_POST['getmeaning'])) {
		getAddressMeaning($lanbilling);
	}

	if(isset($_POST['gettype'])) {
		switch((integer)$_POST['gettype'])
		{
			// Full countries list
			case 0: getCountries($lanbilling); break;
			// Search regioms
			case 1: getRegions($lanbilling); break;
			// Search districts
			case 2: getDistricts($lanbilling); break;
			// Search cities
			case 3: getCities($lanbilling); break;
			// Search settlements
			case 4: getSettlements($lanbilling); break;
			// Search Streets
			case 5: getStreets($lanbilling); break;
			// Search buildings
			case 6: getBuildings($lanbilling); break;
			// Search flats
			case 7: getFlats($lanbilling); break;
			// Search porches
			case 8: getPorches($lanbilling); break;
			// Search floors
			case 9: getFloors($lanbilling); break;
		}
	}
}
// There is standart query
else { }


/**
 * Get and return full countries list
 * @param	object, billing class
 */
function getCountries( $lanbilling )
{
	$_tmp = array();
	if( false != ($result = $lanbilling->get("getAddressCountries", array("flt" => array("name" => $_POST['search'])))) )
	{
		if(!is_array($result)) {
			$result = array($result);
		}

		array_walk($result, create_function('$item, $key, $_tmp', '$_tmp[0][] = array("id" => $item->recordid, "name" => $item->name, "country" => $item->name, "shortname" => $item->shortname);'), array( &$_tmp ));
	}

	if(sizeof($_tmp) > 0) {
		echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
	}
	else echo '({ "total": 0, "results": "" })';
} // end getCountries()


/**
 * Get regions list by filter request
 * @param	object, billing class
 */
function getRegions( $lanbilling )
{
	$_tmp = array();
	$_filter = array("country" => (integer)$_POST['country'], "name" => $_POST['search']);
	$_md5 = $lanbilling->controlSum($_filter);

	if( false != ($result = $lanbilling->get("getAddressRegions", array("flt" => $_filter, "md5" => $_md5))) )
	{
		if(!is_array($result)) {
			$result = array($result);
		}
		array_walk($result, create_function('$item, $key, $_tmp', '$_tmp[0][] = array("id" => $item->recordid, "region" => $item->name, "shortname" => $item->shortname);'), array( &$_tmp ));
	}

	if(sizeof($_tmp) > 0) {
		echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
	}
	else echo '({ "total": 0, "results": "" })';
} // end getRegions()


/**
 * Get regions list by filter request
 * @param	object, billing class
 */
function getDistricts( $lanbilling )
{
	$_tmp = array();
	$_filter = array("region" => (integer)$_POST['region'], "name" => $_POST['search'],
			"pgsize" => 100, "pgnum" => $lanbilling->linesAsPageNum(100, (integer)$_POST['start'] + 1));
	$_md5 = $lanbilling->controlSum($_filter);

	if( false != ($count = $lanbilling->get("AddressCount", array("flt" => $_filter, "procname" => "getAddressAreas", "md5" => $_md5), true)))
	{
		if( false != ($result = $lanbilling->get("getAddressAreas", array("flt" => $_filter, "md5" => $_md5))) )
		{
			if(!is_array($result)) {
				$result = array($result);
			}

			array_walk($result, create_function('$item, $key, $_tmp', '$_tmp[0][] = array("id" => $item->recordid, "district" => $item->name, "shortname" => $item->shortname);'), array( &$_tmp ));
		}
	}

	if(sizeof($_tmp) > 0) {
		echo '({"total": ' . $count . ', "results": ' . JEncode($_tmp, $lanbilling) . '})';
	}
	else echo '({ "total": 0, "results": "" })';
} // end getDistricts()


/**
 * Get regions list by filter request
 * @param	object, billing class
 */
function getCities( $lanbilling )
{
	$_tmp = array();
	$_filter = array("region" => (integer)$_POST['region'], "area" => (integer)$_POST['area'], "name" => $_POST['search'],
			"pgsize" => 100, "pgnum" => $lanbilling->linesAsPageNum(100, (integer)$_POST['start'] + 1));
	$_md5 = $lanbilling->controlSum($_filter);

	if( false != ($count = $lanbilling->get("AddressCount", array("flt" => $_filter, "procname" => "getAddressCities", "md5" => $_md5), true)))
	{
		if( false != ($result = $lanbilling->get("getAddressCities", array("flt" => $_filter, "md5" => $_md5))) )
		{
			if(!is_array($result)) {
				$result = array($result);
			}

			array_walk($result, create_function('$item, $key, $_tmp', '$_tmp[0][] = array("id" => $item->recordid, "city" => $item->name, "shortname" => $item->shortname);'), array( &$_tmp ));
		}
	}

	if(sizeof($_tmp) > 0) {
		echo '({"total": ' . $count . ', "results": ' . JEncode($_tmp, $lanbilling) . '})';
	}
	else echo '({ "total": 0, "results": "" })';
} // end getCities()


/**
 * Get regions list by filter request
 * @param	object, billing class
 */
function getSettlements( $lanbilling )
{
	$_tmp = array();
	$_filter = array("region" => (integer)$_POST['region'], "area" => (integer)$_POST['area'], "city" => (integer)$_POST['city'],
			"name" => $_POST['search'], "pgsize" => 100, "pgnum" => $lanbilling->linesAsPageNum(100, (integer)$_POST['start'] + 1));
	$_md5 = $lanbilling->controlSum($_filter);

	if( false != ($count = $lanbilling->get("AddressCount", array("flt" => $_filter, "procname" => "getAddressSettles", "md5" => $_md5), true)))
	{
		if( false != ($result = $lanbilling->get("getAddressSettles", array("flt" => $_filter, "md5" => $_md5))) )
		{
			if(!is_array($result)) {
				$result = array($result);
			}

			array_walk($result, create_function('$item, $key, $_tmp', '$_tmp[0][] = array("id" => $item->recordid, "settlement" => $item->name, "shortname" => $item->shortname);'), array( &$_tmp ));
		}
	}

	if(sizeof($_tmp) > 0) {
		echo '({"total": ' . $count . ', "results": ' . JEncode($_tmp, $lanbilling) . '})';
	}
	else echo '({ "total": 0, "results": "" })';
} // end getSettlements()


/**
 * Get regions list by filter request
 * @param	object, billing class
 */
function getStreets( $lanbilling )
{
	$_tmp = array();
	$_filter = array(
		"region" => (integer)$_POST['region'],
		"area" => (integer)$_POST['area'],
		"city" => (integer)$_POST['city'],
		"settl" => (integer)$_POST['settl'],
		"name" => $_POST['search'],
		"pgsize" => 100,
		"pgnum" => $lanbilling->linesAsPageNum(100, (integer)$_POST['start'] + 1)
	);
	$_md5 = $lanbilling->controlSum($_filter);

	if( false != ($count = $lanbilling->get("AddressCount", array("flt" => $_filter, "procname" => "getAddressStreets", "md5" => $_md5), true)))
	{
		if( false != ($result = $lanbilling->get("getAddressStreets", array("flt" => $_filter, "md5" => $_md5))) )
		{
			if(!is_array($result)) {
				$result = array($result);
			}

			array_walk($result, create_function('$item, $key, $_tmp', '$_tmp[0][] = array("id" => $item->recordid, "street" => $item->name, "postcode" => $item->idx, "shortname" => $item->shortname);'), array( &$_tmp ));
		}
	}

	if(sizeof($_tmp) > 0) {
		echo '({"total": ' . $count . ', "results": ' . JEncode($_tmp, $lanbilling) . '})';
	}
	else echo '({ "total": 0, "results": "" })';
} // end getStreets()


/**
 * Get buildings list by filter request
 * @param	object, billing class
 */
function getBuildings( $lanbilling )
{
	$_tmp = array();
	$_filter = array(
		"region" => (integer)$_POST['region'],
		"area" => (integer)$_POST['area'],
		"city" => (integer)$_POST['city'],
		"settl" => (integer)$_POST['settl'],
		"street" => (integer)$_POST['street'],
		"name" => $_POST['search'],
		"pgsize" => (($_POST['limit']) ? $_POST['limit'] : 100),
		"pgnum" => $lanbilling->linesAsPageNum(100, (integer)$_POST['start'] + 1)
	);
	$_md5 = $lanbilling->controlSum($_filter);

	if( false != ($count = $lanbilling->get("AddressCount", array("flt" => $_filter, "procname" => "getAddressBuildings", "md5" => $_md5), true)))
	{
		if( false != ($result = $lanbilling->get("getAddressBuildings", array("flt" => $_filter, "md5" => $_md5))) )
		{
			if ( !is_array($result) ) {
				$result = array($result);
			}

			foreach($result as $obj) {
				$arr = get_object_vars($obj);
				$_tmp[] = array(
						"id"        => $arr['recordid'],
						"building"  => $arr['name'],
						"postcode"  => $arr['idx'],
						"flats"     => $arr['flats'],
						"conn_type" => $arr['conn-type'],
						"shortname" => $arr['shortname'],
						"block"     => $arr['block'],
						"name"      => $arr['shortname']." ".$arr['name'].(!empty($arr['block']) ? " / ".$arr['block'] : "")
				);
			}
		}
	}

	if(sizeof($_tmp) > 0) {
		echo '({"total": ' . $count . ', "results": ' . JEncode($_tmp, $lanbilling) . '})';
	}
	else echo '({ "total": 0, "results": "" })';
} // end getBuildings()


/**
 * Get flats list for the specified building by filter request
 * @param	object, billing class
 */
function getFlats( $lanbilling )
{
	$_tmp = array();
	$_filter = array(
		"region" => (integer)$_POST['region'],
		"building" => (integer)$_POST['building'],
		"name" => $_POST['search'],
		"pgsize" => (($_POST['limit']) ? $_POST['limit'] : 100),
		"pgnum" => $lanbilling->linesAsPageNum(100, (integer)$_POST['start'] + 1)
	);
	$_md5 = $lanbilling->controlSum($_filter);
	if( false != ($count = $lanbilling->get("AddressCount", array("flt" => $_filter, "procname" => "getAddressFlats", "md5" => $_md5), true)))
	{
		if( false != ($result = $lanbilling->get("getAddressFlats", array("flt" => $_filter, "md5" => $_md5))) )
		{
			if(!is_array($result)) {
				$result = array($result);
			}

			array_walk($result, create_function('$item, $key, $_tmp', '
                $_tmp[0][] = array(
                    "id" => $item->recordid,
                    "shortname" => $item->shortname,
                    "flat" => $item->name,
                    "name" => $item->shortname . " " . $item->name
                );
            '), array( &$_tmp ));
		}
	}

	if(sizeof($_tmp) > 0) {
		echo '({"total": ' . $count . ', "results": ' . JEncode($_tmp, $lanbilling) . '})';
	}
	else echo '({ "total": 0, "results": "" })';
} // end getFlats()



function getPorches( $lanbilling )
{

	$_tmp = array();
	$_filter = array(
		"region" => (integer)$_POST['region'],
		"building" => (integer)$_POST['building'],
		"name" => $_POST['search'],
		"pgsize" => (($_POST['limit']) ? $_POST['limit'] : 100),
		"pgnum" => $lanbilling->linesAsPageNum(100, (integer)$_POST['start'] + 1)
	);
	$_md5 = $lanbilling->controlSum($_filter);

	if( false != ($count = $lanbilling->get("AddressCount", array("flt" => $_filter, "procname" => "getAddressEntrances", "md5" => $_md5), true)))
	{
		if( false != ($result = $lanbilling->get("getAddressEntrances", array("flt" => $_filter, "md5" => $_md5))) )
		{
			if(!is_array($result)) {
				$result = array($result);
			}
			array_walk($result, create_function('$item, $key, $_tmp', '
                $_tmp[0][] = array(
                    "id" => $item->recordid,
                    "shortname" => $item->shortname,
                    "porches" => $item->name,
                    "name" => $item->shortname . " " . $item->name
                );
            '), array( &$_tmp ));
		}
	}

	if(sizeof($_tmp) > 0) {
		echo '({"total": ' . $count . ', "results": ' . JEncode($_tmp, $lanbilling) . '})';
	}
	else echo '({ "total": 0, "results": "" })';
} // end getFlats()


function getFloors( $lanbilling )
{

	$_tmp = array();
	$_filter = array(
		"region" => (integer)$_POST['region'],
		"building" => (integer)$_POST['building'],
		"name" => $_POST['search'],
		"pgsize" => (($_POST['limit']) ? $_POST['limit'] : 100),
		"pgnum" => $lanbilling->linesAsPageNum(100, (integer)$_POST['start'] + 1)
	);
	$_md5 = $lanbilling->controlSum($_filter);

	if( false != ($count = $lanbilling->get("AddressCount", array("flt" => $_filter, "procname" => "getAddressFloors", "md5" => $_md5), true)))
	{
		if( false != ($result = $lanbilling->get("getAddressFloors", array("flt" => $_filter, "md5" => $_md5))) )
		{
			if(!is_array($result)) {
				$result = array($result);
			}

			array_walk($result, create_function('$item, $key, $_tmp', '
                $_tmp[0][] = array(
                    "id" => $item->recordid,
                    "shortname" => $item->shortname,
                    "floors" => $item->name,
                    "name" => $item->shortname . " " . $item->name
                );
            '), array( &$_tmp ));
		}
	}
	if(sizeof($_tmp) > 0) {
		echo '({"total": ' . $count . ', "results": ' . JEncode($_tmp, $lanbilling) . '})';
	}
	else echo '({ "total": 0, "results": "" })';
} // end getFlats()





/**
 * Get address types short names
 * @param	object, billing class
 */
function getAddressMeaning( $lanbilling )
{
	$_tmp = array();
	$_filter = array("level" => (integer)$_POST['getmeaning']);
	$_md5 = $lanbilling->controlSum($_filter);

    /**
     * Fix for "Floor" and "Porch"
     */
    if (in_array((integer)$_POST['getmeaning'], array(8,9) )){
        echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
        return;
    }

	if( false != ($result = $lanbilling->get("getAddressMeanings", array("flt" => $_filter, "md5" => $_md5))) )
	{
		if(!is_array($result)) {
			$result = array($result);
		}

		array_walk($result, create_function('$item, $key, $_tmp', '$_tmp[0][] = array("id" => $item->recordid, "name" => $item->name, "shortname" => $item->shortname);'), array( &$_tmp ));
	}

	if(sizeof($_tmp) > 0) {
		echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
	}
	else echo '({ "results": "" })';
} // end getAddressMeaning()


/**
 * Save new address items or edit existing
 * @param	object, billing class
 */
function saveAddressItems( $lanbilling )
{
	if(empty($_POST['saveaddress'])) {
		echo "({ success: true, checked: null })";
		return;
	}

	$func_name = "";
	$struct = array();
	$checked = null;

	switch((integer)$_POST['level'])
	{
		case 0: $func_name = "insupdAddressCountry"; break;
		case 1: $func_name = "insupdAddressRegion"; break;
		case 2: $func_name = "insupdAddressArea"; break;
		case 3: $func_name = "insupdAddressCity"; break;
		case 4: $func_name = "insupdAddressSettle"; break;
		case 5: $func_name = "insupdAddressStreet"; break;
		case 6: $func_name = "insupdAddressBuilding"; break;
		case 7: $func_name = "insupdAddressFlat"; break;
		case 8: $func_name = "insupdAddressEntrance"; break;
		case 9: $func_name = "insupdAddressFloor"; break;

	}

	if(empty($func_name)) {
		echo "({ success: false, errors: { reason: 'Unknown tast' } })";
		return false;
	}

	foreach($_POST['saveaddress'] as $i=>$item)
	{

		switch((integer)$_POST['level'])
		{
			case 0: $struct = array("recordid" => (integer)$item['id'],
						"name" => $item['country']);
			break;

			case 1: $struct = array("recordid" => (integer)$item['id'],
						"country" => (integer)$_POST['country'],
						"name" => $item['region'],
						"shortname" => $item['shortname']);
			break;

			case 2: $struct = array("recordid" => (integer)$item['id'],
						"region" => (integer)$_POST['region'],
						"name" => $item['district'],
						"shortname" => $item['shortname']);
			break;

			case 3: $struct = array("recordid" => (integer)$item['id'],
						"region" => (integer)$_POST['region'],
						"area" => (integer)$_POST['area'],
						"name" => $item['city'],
						"shortname" => $item['shortname']);
			break;

			case 4: $struct = array("recordid" => (integer)$item['id'],
						"region" => (integer)$_POST['region'],
						"area" => (integer)$_POST['area'],
						"city" => (integer)$_POST['city'],
						"name" => $item['settlement'],
						"shortname" => $item['shortname']);
			break;

			case 5: $struct = array("recordid" => (integer)$item['id'],
						"region" => (integer)$_POST['region'],
						"area" => (integer)$_POST['area'],
						"city" => (integer)$_POST['city'],
						"settl" => (integer)$_POST['settl'],
						"name" => $item['street'],
						"idx" => (integer)$item['postcode'],
						"shortname" => $item['shortname']);
			break;

			case 6: $struct = array("recordid" => (integer)$item['id'],
						"region" => (integer)$_POST['region'],
						"area" => (integer)$_POST['area'],
						"city" => (integer)$_POST['city'],
						"settl" => (integer)$_POST['settl'],
						"street" => (integer)$_POST['street'],
						"name" => $item['building'],
						"idx" => (integer)$item['postcode'],
						"flats" => (integer)$item['flats'],
						"conn-type" => $item['conn_type'],
						"block" => $item['block'],
						"shortname" => $item['shortname']);
			break;

			case 7: $struct = array("recordid" => (integer)$item['id'],
						"region" => (integer)$_POST['region'],
						"building" => (integer)$_POST['building'],
						"name" => $item['flat'],
						"shortname" => $item['shortname']);
			break;
			case 8: $struct = array("recordid" => (integer)$item['id'],
						"region" => (integer)$_POST['region'],
						"building" => (integer)$_POST['building'],
						"name" => (integer)$item['porches'],
						"shortname" =>(integer)$item['porches']);
						break;
			case 9: $struct = array("recordid" => (integer)$item['id'],
						"region" => (integer)$_POST['region'],
						"building" => (integer)$_POST['building'],
						"name" =>  (integer)$item['floors'],
						"shortname" => (integer)$item['floors'],
						"entrance"=>0
			);



			break;
		}

		if((string)$struct['name'] == '') {
			$struct['name'] = 'Undefined';
		}

		if( false == $lanbilling->save($func_name, $struct, empty($struct['recordid']) ? true : false, array("getAddressCountries", "getAddressRegions", "getAddressAreas", "getAddressCities", "getAddressStreets", "getAddressBuildings", "getAddressFlats"))) {
			echo "({ success: false, errors: { reason: 'There was an error while saving address item. Look server logs for details' } })";
			return false;
		}

		if((integer)$item['checked'] == 1) {
			$checked = $item;
			$checked['id'] = $lanbilling->saveReturns->ret;
		}
	}

	echo "({ success: true, checked: " . JEncode($checked, $lanbilling) . " })";
} // end saveAddressItems()


/**
 * Remove passed items from the address dictionary
 * @param	object, main class
 * @param	object, localize class
 */
function delAddressItem( $lanbilling, $localize )
{
	if(empty($_POST['removeaddress'])) {
		echo '({ success: false, reason: "' . $localize->get('Unknown value') . '" })';
		return false;
	}

	$func_name = "";

	switch((integer)$_POST['level'])
	{
		case 0: $func_name = "delAddressCountry"; break;
		case 1: $func_name = "delAddressRegion"; break;
		case 2: $func_name = "delAddressArea"; break;
		case 3: $func_name = "delAddressCity"; break;
		case 4: $func_name = "delAddressSettle"; break;
		case 5: $func_name = "delAddressStreet"; break;
		case 6: $func_name = "delAddressBuilding"; break;
		case 7: $func_name = "delAddressFlat"; break;
		case 8: $func_name = "delAddressEntrance"; break;
		case 9: $func_name = "delAddressFloor"; break;
	}

	if( false == $lanbilling->delete($func_name, array("id" => (integer)$_POST['removeaddress']['id']), array(
		"getAddressCountries",
		"getAddressRegions",
		"getAddressAreas",
		"getAddressCities",
		"getAddressStreets",
		"getAddressBuildings",
		"getAddressFlats",
		"getAddressEntrance",
		"getAddressFloor"
	)))
	{
		$error = $lanbilling->soapLastError();
		
		$error_detail = $error->detail;
		
		if(strstr($error_detail, "Cannot delete because item is used"))
			switch((integer)$_POST['level'])
			{
				case 0: $error_detail = $localize->get("Cannot delete country, because item is used"); break;
				case 1: $error_detail = $localize->get("Cannot delete region, because item is used"); break;
				case 2: $error_detail = $localize->get("Cannot delete area, because item is used"); break;
				case 3: $error_detail = $localize->get("Cannot delete city, because item is used"); break;
				case 4: $error_detail = $localize->get("Cannot delete settle, because item is used"); break;
				case 5: $error_detail = $localize->get("Cannot delete street, because item is used"); break;
				case 6: $error_detail = $localize->get("Cannot delete building, because item is used"); break;
				case 7: $error_detail = $localize->get("Cannot delete flat, because item is used"); break;
				case 8: $error_detail = $localize->get("Cannot delete entrance, because item is used"); break;
				case 9: $error_detail = $localize->get("Cannot delete floor, because item is used"); break;
			}
			
		echo '({ success: false, reason: "' . $error_detail . '" })';
		return false;
	}

	echo '({ success: true, reason: "' . $localize->get("Request done successfully") . '" })';
} // end delAddressItem()
