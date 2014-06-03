<?php
/**
 * Settings for the selected telephony module to provide on fly
 * phone numbers substitution
 *
 * Repository information:
 * $Date: 2009-06-25 07:52:35 $
 * $Revision: 1.1.2.4 $
 */

// There is background query
if(isset($_POST['async_call']))
{
    if(isset($_POST['savesubst'])) {
        saveDataSubst($lanbilling, $localize);
    }

    if(isset($_POST['getsubst'])) {
        getPhoneSubstData($lanbilling);
    }

    if(isset($_POST['get_filter'])) {
        getFilter($lanbilling);
    }

    if(isset($_POST['save_filter'])) {
        saveFilter($lanbilling, $localize);
    }
}
else
{
    if(isset($_POST['delete'])) {
        deleteRecord($lanbilling, $localize);
    }

    $tpl = new HTML_Template_IT(TPLS_PATH);
    $tpl->loadTemplatefile("phone_substitution.tpl",true,true);

    $tpl->setVariable("MODULEID", (integer)$_POST['module']);

    if( false != ($module = $lanbilling->get("getAgent", array("id" => (integer)$_POST['module']))) ) {
        $tpl->setVariable("MODULEINFO", $module->agent->servicename);
    }

    if( false != ($result = $lanbilling->get("getPhoneReplaces", array("id" => (integer)$_POST['module']))) )
    {
        if(empty($result)) {

        }
        else
        {
            if(!is_array($result)) {
                $result = array($result);
            }

            foreach($result as $obj)
            {
                $tpl->setCurrentBlock("substRow");
                $tpl->setVariable("INTATSNUM", $obj->oldnumber);

                if($obj->ltrim < 0) {
                    $tpl->setVariable("CLINUM", ($obj->newnumber == "") ? "-" : $obj->newnumber);
                    $tpl->setVariable("LENGTH", "-");
                }
                else {
                    $tpl->touchBlock("cliGroup");
                    $tpl->setVariable("LENGTH", $obj->ltrim);
                    $tpl->setVariable("PREFIX", ($obj->newnumber == "") ? "-" : $obj->newnumber);
                }

                $tpl->touchBlock("substNum_" . $obj->replacewhat);

                $tpl->setVariable("RECORDID", $obj->recordid);
                $tpl->parseCurrentBlock();
            }
        }
    }

    $localize->compile($tpl->get(), true);
}


/**
 * Get phone substitution information to edit
 * @param    object, billing class
 */
function getPhoneSubstData( &$lanbilling )
{
    if((integer)$_POST['module'] == 0 && (integer)$_POST['getsubst'] == 0) {
        echo "({ results: '' })";
        return false;
    }

    $_tmp = array();
    if( false != ($result = $lanbilling->get("getPhoneReplaces", array("id" => (integer)$_POST['module']))) )
    {
        if(empty($result)) {
            echo "({ results: '' })";
            return false;
        }

        if(!is_array($result)) {
            $result = array($result);
        }

        foreach($result as $obj)
        {
            if($obj->recordid != $_POST['getsubst']) continue;
            $_tmp[] = array("recordid" => $obj->recordid, "oldnumber" => $obj->oldnumber, "newnumber" => $obj->newnumber, "newprefix" => $obj->newnumber, "whatsubst" => $obj->replacewhat, "length" => $obj->ltrim);
            break;
        }
    }

    if(sizeof($_tmp) > 0)
        echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
    else echo "({ results: '' })";
} // end getPhoneSubstData()


/**
 * Save recieved data from client abount phone substitution
 * @param    object, billing class
 */
function saveDataSubst(&$lanbilling, &$localize )
{
    $struct = array(
        'recordid' => (integer)$_POST['recordid'],
        'id' => (integer)$_POST['savesubst'],
        'ltrim' => !isset($_POST['grpsubst']) ? -1 : (integer)$_POST['lng'],
        'replacewhat' => (integer)$_POST['whatsubst'],
        'oldnumber' => $_POST['oldnumber'],
        'newnumber' => !isset($_POST['grpsubst']) ? $_POST['newnumber'] : $_POST['newprefix']);
	
		if($_SESSION['auth']['access']['agents'] < 2) {
			 echo "({ success: false, errors: { reason: '".$localize->get('Permission denied')."' } })";
			return false;
		}	
		
    if( false != $lanbilling->save("insupdPhoneReplace", $struct, (((integer)$_POST['recordid'] == 0) ? true : false), array("getPhoneReplaces")))
    {
        if($lanbilling->saveReturns->ret == 0) {
            echo "({ success: false, errors: { reason: 'There was an error while saving phone substitution. Look server logs for details' } })";
        }
        else echo "({ success: true })";
    }
    else echo "({ success: false, errors: { reason: 'There was an error while saving phone substitution. Look server logs for details' } })";
} // end saveDataSubst()


/**
 * Delete record data from DB
 * @param    object, billing class
 */
function deleteRecord( &$lanbilling, &$localize )
{		
    if((integer)$_POST['delete'] == 0) {
        return false;
    }

    try {
		if($_SESSION['auth']['access']['agents'] < 2) {
			throw new Exception ($localize->get('Permission denied'));
			return false;
		}
		
        $lanbilling->delete("delPhoneReplace", array("id" => $_POST['delete']), array("getPhoneReplaces"));
        return true;
    }
    catch(Exception $e) { return false; }
} // end deleteRecord()


/**
 * Get filter from DB
 * @param    object, billing class
 */
function getFilter($lanbilling) {

    $filter = $lanbilling->get("getPhoneFilter", array("id" => (integer) $_POST["module_id"]), true);

    if( false === $filter || empty($filter) ) {
        echo "[]";
        return;
    }
    preg_match_all("/\( *([a-z_]+) *([!=><~]{1,2}) *([^<>\"\'\(]+ *)\) *(&&|\\|\\|)*/", $filter, $matches);
    for( $i = 0; $i < count($matches[0]); $i++ ) {
        if( !empty($s) ) $s .= ",";
        $s .= "['{$matches[1][$i]}', '{$matches[2][$i]}', '".htmlspecialchars(str_replace('\\','\\\\',$matches[3][$i]))."', '{$matches[4][$i]}']";
    }
    echo "[{$s}]";
}

/**
 * Save filter
 * @param    object, billing class
 */
function saveFilter($lanbilling, $localize) {
	
	if($_SESSION['auth']['access']['agents'] < 2) {
		 echo "({ success: false, errors: { reason: '".$localize->get('Permission denied')."' } })";
		return false;
	}
	
    $filter = $_POST["filter"];
    if( preg_match("/\( *([a-z_]+) *([=><!~]{1,2}) *([^<>\"\'\(]+ *)\) *(&&|\\|\\|)*/", $filter, $matches) || empty($filter)) {
        $res = $lanbilling->get("updPhoneFilter", array("id" => (integer) $_POST["module_id"], "val" => htmlspecialchars_decode($filter)), true);
    }
}