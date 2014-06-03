<?php
/**
 * Search templates engine to add new rules or modify existing
 *
 * Repository information:
 * $Date: 2009-10-09 09:42:19 $
 * $Revision: 1.1.2.2 $
 */

// There is background query
if(isset($_POST['async_call']))
{
	if(isset($_POST['getallsearchtpl'])) {
		getAllSearchTemplate($lanbilling);
	}

	if(isset($_POST['getsearchtpl'])) {
		getSearchTemplate($lanbilling);
	}

	if(isset($_POST['getaddonfields'])) {
		getAddonFields($lanbilling);
	}

	if(isset($_POST['savesearchtpl'])) {
		saveSearchTemplate($lanbilling);
	}
}
// There is standart query
else
{

}


/**
 * Get existing search rules
 * @param	object, billing class
 */
function getAllSearchTemplate( &$lanbilling )
{
	getSearchTemplate($lanbilling, true);
} //end getAllSearchTemplate()


/**
 * Get existing search rules for the specified
 * @param	object, billing class
 * @param	boolean, true to get all record excluding filter
 */
function getSearchTemplate( &$lanbilling, $all = false )
{
	$_tmp = array();

	if($all == true || !empty($_POST['getsearchtpl'])) {
		$_filter = array('name' => $_POST['getsearchtpl']);
		$_md5 = $lanbilling->controlSum($_filter);
		if( false != ($result = $lanbilling->get("getSearchTemplates", array('flt' => $_filter, 'md5' => $_md5))) )
		{
			if(!is_array($result)) {
				$result = array($result);
			}

			array_walk($result, create_function('$item, $key, $_tmp', '$A = (array)$item; $A["property"] = implode(".", array($item->tablename, $item->field)); $_tmp[0][] = $A;'), array( &$_tmp ));
		}
	}

	if(sizeof($_tmp) > 0)
		echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
	else echo "({ results: '' })";
} //end getSearchTemplate()


/**
 * Get the list of avaliable addons fileds in the user form
 * @param	object, billing
 */
function getAddonFields( &$lanbilling )
{
	$_tmp = array();

	if( false != ($result = $lanbilling->get("getAccountsAddonsSet", array('flt' => array()))) )
	{
		if(!is_array($result)) {
			$result = array($result);
		}

		array_walk($result, create_function('$item, $key, $_tmp', '$_tmp[0][] = array("property" => "accounts_addons_vals." . $item->addon->name, "descr" => $item->addon->descr);'), array( &$_tmp ));

// 		foreach($result as $item)
// 		{
// 			switch((integer)$item->addon->type)
// 			{
// 				case 1:
// 					$tpl->setCurrentBlock('AddonComboRow');
// 					$tpl->setVariable('ADDONCOMBODESCR', $item->addon->descr);
// 					$tpl->setVariable('ADDONCOMBONAME', $item->addon->name);
//
// 					if(!is_array($item->staff)) {
// 						$item->staff = array($item->staff);
// 					}
//
// 					array_walk($item->staff, create_function('$item, $key, $_tmp', '$_tmp[0]->setCurrentBlock("AddonComboOpt"); $_tmp[0]->setVariable("ADDONCOMBOSELVAL", $item->idx); $_tmp[0]->setVariable("ADDONCOMBOSELNAME", $item->value); if($_tmp[1] == $item->idx){ $_tmp[0]->touchBlock("AddonComboOptSel"); }; $_tmp[0]->parseCurrentBlock();'), array( &$tpl, isset($_POST['addons']['combo'][$item->addon->name]) ? $_POST['addons']['combo'][$item->addon->name] : 0 ));
//
// 					$tpl->parse('AddonComboRow');
// 				break;
//
// 				default:
// 					$tpl->setCurrentBlock('AddOnTextRow');
// 					$tpl->setVariable('ADDONTEXTDESCR', $item->addon->descr);
// 					$tpl->setVariable('ADDONTEXTNAME', $item->addon->name);
// 					$tpl->setVariable('ADDONTEXTVALUE', isset($_POST['addons']['text'][$item->addon->name]) ? $_POST['addons']['text'][$item->addon->name] : '');
// 					$tpl->parse('AddOnTextRow');
// 			}
// 		}
	}

	if( false != ($result = $lanbilling->get("getAgreementsAddonsSet", array('flt' => array()))) )
	{
		if(!is_array($result)) {
			$result = array($result);
		}
		array_walk($result, create_function('$item, $key, $_tmp', '$_tmp[0][] = array("property" => "agreements_addons_vals." . $item->addon->name, "descr" => $item->addon->descr);'), array( &$_tmp ));
	}


	if(sizeof($_tmp) > 0)
		echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
	else echo "({ results: '' })";
} // end getAddonFields()


/**
 * Save new rules for the search template to DB
 * @param	object, billing class
 */
function saveSearchTemplate( &$lanbilling )
{
	if(!empty($_POST['savesearchtpl']) && (!is_array($_POST['searchtpl']) || sizeof($_POST['searchtpl']) == 0))
	{
		$lanbilling->delete("delSearchTemplate", array("id" => $_POST['savesearchtpl']), array("getSearchTemplates"));
		echo '({ success: true })';
		return;
	}

	$struct = array();

	for($i = 0, $off = sizeof($_POST['searchtpl']); $i < $off; $i++)
	{
		$item = $_POST['searchtpl'][$i];

		if(empty($item['tplname']) || empty($item['property'])) {
			continue;
		}

		$p = explode('.', $item['property']);

		$struct[] = array(
			"tplname" => $item['tplname'],
			"tablename" => $p[0],
			"field" => $p[1],
			"condition" => $item['condition'],
			"value" => $item['value'],
			"logic" => (($i+1) == $off) ? '' : $item['logic']
		);
	}

	if(!empty($struct)) {
		if( false == $lanbilling->save("insupdSearchTemplate", array("val" => $struct), false, array("getSearchTemplates"))) {
			$error = $lanbilling->soapLastError();
			echo '({ success: false, errors: { reason: "' . $error->detail . '" } })';
			return false;
		}
	}

	echo '({ success: true })';
} // end saveSearchTemplate()
?>