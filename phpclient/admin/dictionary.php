<?php
/**
 * RADIUS attributes control panel to modify, exiting default entries in the dictionary
 * for the selected NAS server
 *
 * Repository information:
 * $Date: 2009-09-23 08:10:13 $
 * $Revision: 1.5.2.5 $
 */

// There is background query
if(isset($_POST['async_call']))
{
	if(isset($_POST['saverecord'])) {
		saveAttributeData($lanbilling);
	}

	if(isset($_POST['delete'])) {
		deleteNASAttribute($lanbilling);
	}

	if(isset($_POST['getnases'])) {
		getNASList($lanbilling);
	}

	if(isset($_POST['getattributes'])) {
		getDictionary($lanbilling);
	}
}
else
{
	$tpl = new HTML_Template_IT(TPLS_PATH);
	$tpl->loadTemplatefile("dictionary.tpl",true,true);
	$tpl->touchBlock("__global__");
	$tpl->setVariable("MODULEID", (integer)$_POST['module']);
	$localize->compile($tpl->get(), true);
}


/**
 * Get NAS list for the selected module
 * @param	object, billing class
 */
function getNASList( &$lanbilling )
{
	if((integer)$_POST['getnases'] == 0) {
		echo "({ })";
		return false;
	}

	$_tmp = array();
	if( false != ($result = $lanbilling->get("getAgent", array("id" => (integer)$_POST['getnases']))) )
	{
		if(!isset($result->rnas)) {
			echo "({ })";
			return;
		}

		if(!is_array($result->rnas)) {
			$result->rnas = array($result->rnas);
		}

		array_walk($result->rnas, create_function('&$obj, $key, $_tmp', '$_tmp[0][] = array("id" => $obj->nasid, "module" => $obj->id, "text" => $obj->ipmask->ip, "leaf" => true, "iconCls" => "ext-server");'), array(&$_tmp));
	}

	if(sizeof($_tmp) > 0) {
		echo '(' . JEncode($_tmp, $lanbilling) . ')';
	}
	else echo "({ })";
} // end getNASList()


/**
 * Get dictionary for the selected NAS
 * @param	object, billing class
 */
function getDictionary( &$lanbilling )
{
	$_tmp = array();
	if( false != ($result = $lanbilling->get("getDictionaries", array("id" => (integer)$_POST['getattributes']))) ) {
		if(!empty($result)) {
			if(!is_array($result))
				$result = array($result);
			array_walk($result,
				create_function('&$obj, $key, $_tmp',
					'$_tmp[0][] = array(
						"recordid" => $obj->recordid,
						"id" => $obj->recordid,
						"nasid" => $obj->nasid,
						"radiustype" => $obj->radiustype,
						"vsatype" => $obj->vsatype,
						"vendor" => $obj->vendor,
						"valuetype" => $obj->valuetype,
						"name" => $obj->name,
						"replaceid" => $obj->replaceid,
						"tagged" => $obj->tagged,
                        "tohistory" => $obj->tohistory
					);
				'), array(&$_tmp));
		}
	}
	if(sizeof($_tmp) > 0)
		echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
	else echo "({ results: '' })";
} // end getDictionary()


/**
 * Save modified attribute data for the selected NAS data
 * @param	object, billing class
 */
function saveAttributeData( &$lanbilling )
{
	if((integer)$_POST['nasid'] == 0) {
		echo "({ success: false, errors: { reason: 'Unknown NAS id' } })";
		return false;
	}

	if(empty($_POST['name'])) {
		echo "({ success: false, errors: { reason: 'Unknown RADIUS attribute name' } })";
		return false;
	}

	$struct = array(
		"recordid"   => (integer)$_POST['saverecord'],
		"nasid" 	 => (integer)$_POST['nasid'],
		"radiustype" => $_POST['radiustype'],
		"vsatype"    => $_POST['vsatype'],
		"vendor"     => $_POST['vendor'],
		"valuetype"  => $_POST['valuetype'],
		"name"       => $_POST['name'],
		"replaceid"  => (integer)$_POST['replaceid'],
		"tagged"     => (isset($_POST['tagged'])) ? 1 : 0,
        "tohistory"     => (isset($_POST['tohistory'])) ? 1 : 0
	);

	if( false == $lanbilling->save("insupdDictionary", $struct, ($struct['recordid'] == 0) ? true : false, array("getDictionaries")) ) {
		$error = $lanbilling->soapLastError();
		echo "({ success: false, errors: { reason: 'There was an error while saving RADIUS attribute: " . $error->detail . ". Look server logs for details' } })";
	}
	else echo "({ success: true })";
} // end saveAttributeData()


/**
 * Remove information about linked attibute to the NAS
 * @param	object, billing class
 */
function deleteNASAttribute( &$lanbilling )
{
	if((integer)$_POST['delete'] == 0) {
		echo "({ success: false, errors: { reason: 'Unknown record' } })";
		return false;
	}

	if( false == $lanbilling->delete("delDictionary", array("id" => $_POST['delete']), array("getDictionaries")) ) {
		echo "({ success: false, errors: { reason: 'There was an error while removing RADIUS attribute. Look server logs for details' } })";
	}
	else echo "({ success: true })";
} // end deleteNASAttribute()
