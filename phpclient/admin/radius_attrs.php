<?php
/**
 * Radius attributes settings control
 */


// There is background query
if(isset($_POST['async_call']))
{
    if(isset($_POST['getmodules'])) {
        getModules($lanbilling);
    }

    if(isset($_POST['getnas'])) {
        getModuleNAS($lanbilling);
    }

    if(isset($_POST['getdictionary'])) {
        getNASDictionary($lanbilling);
    }

    if(isset($_POST['getunions'])) {
        getVgUnions($lanbilling);
    }

    if(isset($_POST['gettariffs'])) {
        getTariffs($lanbilling);
    }

    if(isset($_POST['getcategories'])) {
        getCategories($lanbilling);
    }

    if(isset($_POST['vgroups'])) {
        getVgroups($lanbilling);
    }

    if(isset($_POST['getattributes'])) {
        getAttributesList($lanbilling);
    }

    if(isset($_POST['saveattribute'])) {
        saveAttribute($lanbilling, $localize);
    }

    if(isset($_POST['delattrs'])) {
        deleteAttributes($lanbilling, $localize);
    }

    if(isset($_POST['getdevgroups'])) {
        getDeviceGroups($lanbilling, $localize);
    }
}
// There is standard query
else
{
    $tpl = new HTML_Template_IT(TPLS_PATH);
    $tpl->loadTemplatefile("radius_attributes.tpl",true,true);
    $tpl->touchBlock("__global__");
    $localize->compile($tpl->get(), true);
}


/**
 * Show attributes list
 * Use filter parameter "repdetail" to filter record by groups. Known groups:
 *         1 - group records linked only to module
 *         2 - group records linked only to accounts union
 *         3 - group records linked only to tariff
 *         4 - group records linked only to tariff and category
 *         5 - group records linked only to tariff shape rate
 *         6 - group records linked only to accounts
 *         0 - all
 * @param    object, billing class
 */
function getAttributesList( &$lanbilling )
{
    $_tmp = array();

    $_filter = array(
        "repdetail" => (integer)$_POST['getattributes'],
        "pgsize" => ((integer)$_POST['limit'] <= 0) ? 100 : $_POST['limit']
    );

    $_filter['pgnum'] = $lanbilling->linesAsPageNum($_filter['pgsize'], (integer)$_POST['start'] + 1);
    $_md5 = $lanbilling->controlSum($_filter);

    $count = $lanbilling->get("Count", array("flt" => $_filter, "procname" => "getRadiusAttrs", "md5" => $_md5));

    if( false != ($result = $lanbilling->get("getRadiusAttrs", array("flt" => $_filter, "md5" => $_md5))) )
    {
        if(!is_array($result)) {
            $result = array($result);
        }
        array_walk($result, create_function('&$item, $key, $_tmp', '
            $_tmp[0][] = array(
                "recordid"          => $item->recordid,
                "agentid"          => $item->id,
                "nasid"          => $item->nasid,
                "groupid"          => $item->groupid,
                "vgid"              => $item->vgid,
                "tarid"          => $item->tarid,
                "shape"          => $item->shape,
                "radiuscode"      => $item->radiuscode,
                "attrid"          => $item->attrid,
                "value"          => $item->value,
                "description"      => $item->description,
                "ownerdescr"      => $item->ownerdescr,
                "dictname"          => $item->dictname,
                "catdescr"          => $item->catdescr,
                "catidx"          => $item->catidx,
                "service"          => $item->service,
                "serviceforlist" => $item->serviceforlist,
                "devgroupid"      => $item->devgroupid,
                "tag"              => $item->tag
            );
        '), array( &$_tmp ));
        // "devgroupid" => $item->getDictionary,
    }

    if(sizeof($_tmp) > 0) {
        echo '({"total": ' . (integer)$count . ', "results": ' . JEncode($_tmp, $lanbilling) . '})';
    }
    else {
        echo '({"total": 0, "results": "" })';
    }
} // end buildList()


/**
 * Save radius attribute data to server
 * @param    object, billing class
 * @param    object, localize class
 */
function saveAttribute( &$lanbilling, &$localize )
{
    if((integer)$_POST['module'] == 0) {
        echo "({ success: false, reason: '" . $localize->get('Undefined') . " " . $localize->get("Module") . "' })";
        return false;
    }
    $struct = array(
        "recordid" => (integer)$_POST['saveattribute'],
        "id" => (integer)$_POST['module'],
        "nasid" => (integer)$_POST['nasid'] < -1 ? 0 : (integer)$_POST['nasid'],
        "devgroupid" => (integer)$_POST['devgroupid'],
        "service" => $_POST['service'],
        "serviceforlist" => $lanbilling->boolean($_POST['serviceforlist']) ? 1 : 0,
        "groupid" => 0,
        "vgid" => 0,
        "tarid" => 0,
        "catidx" => 0,
        "shape" => 0,
        "attrid" => (integer)$_POST['attrid'],
        "radiuscode" => (integer)$_POST['radcode'],
        "value" => $_POST['attrvalue'],
        "description" => $_POST['description'],
        "ownerdescr" => '',
        "tag" => ($_POST['tagged'] > 0) ? (integer)$_POST['tagged'] : 0
    );

    switch($_POST['link'])
    {
        case 2:
            if((integer)$_POST['groupid'] <= 0) {
                echo "({ success: false, reason: '" . $localize->get('Undefined-o') . " " . $localize->get("Union") . "' })";
                return false;
            }

            $struct['groupid'] = $_POST['groupid'];
        break;

        case 3:
            if((integer)$_POST['tarid'] <= 0) {
                echo "({ success: false, reason: '" . $localize->get('Undefined') . " " . $localize->get("Tarif") . "' })";
                return false;
            }

            $struct['tarid'] = $_POST['tarid'];

            if($_POST['catidx'] == "" || !is_numeric($_POST['catidx'])) {
                $_POST['catidx'] = -1;
            }

            $struct['catidx'] = $_POST['catidx'];
        break;

        case 4:
            if((integer)$_POST['vgid'] <= 0) {
                echo "({ success: false, reason: '" . $localize->get('Undefined-a') . " " . $localize->get("Account") . "' })";
                return false;
            }

            $struct['vgid'] = $_POST['vgid'];
        break;

        case 5:
            if((integer)$_POST['shape'] <= 0) {
                echo "({ success: false, reason: '" . $localize->get('Undefined-a') . " " . $localize->get("Shape") . "' })";
                return false;
            }

            $struct['shape'] = $_POST['shape'];
        break;
    }

    if( false == $lanbilling->save("insupdRadiusAttr", $struct, (((integer)$_POST['saveattribute'] == 0) ? true : false), array("getRadiusAttr", "getRadiusAttrs")) ) {
        $error = $lanbilling->soapLastError();
        echo "({ success: false, errors: { reason: '" . $localize->get('There was an error while sending data to server') . ": " . $error->detail . "' } })";
    }
    else {
        echo "({ success: true, reason: '" . $localize->get('Request done successfully') . "' })";
    }
} // end saveData()


/**
 * Remove attribute data from server
 * @param    object, billing class
 */
function deleteAttributes( &$lanbilling, &$localize )
{
    $_withError = array();

    if(!empty($_POST['delattrs'])) {
        foreach($_POST['delattrs'] as $key => $item) {
            if((integer)$key > 0) {
                if( false == $lanbilling->delete("delRadiusAttr", array("id" => $key), array("getRadiusAttr", "getRadiusAttrs")) ) {
                    $error = $lanbilling->soapLastError();
                    $_withError[] = array($item['dictname'], $localize->get($error->detail));
                }
            }
        }
    }

    if(empty($_withError)) {
        echo "({ success: true, reason: '" . $localize->get('Request done successfully') . "' })";
    }
    else {
        if(sizeof($_withError) == 1) {
            echo "({ success: false, reason: " . JEncode($_withError[0][1], $lanbilling) . "})";
        }
        else {
            echo "({ success: false, reason: " . JEncode($_withError, $lanbilling) . "})";
        }
    }
} // end deleteAttr()


/**
 * Get modules list on request
 * @param object $lanbilling
 */
function getModules( &$lanbilling )
{
    $_tmp = array();

    if( false != ($result = $lanbilling->get("getAgentsExt")) ) {

        if(!is_array($result)) {
            $result = array($result);
        }

        array_walk($result, create_function('&$item, $key, $_tmp', '
            if($item->agent->type == 6 || $item->agent->type == 12) {
                $_tmp[0][] = array(
                    "id" => $item->agent->id,
                    "descr" => $item->agent->descr,
					"remulateonnaid" => $item->agent->remulateonnaid
                );
            }
        '), array( &$_tmp ));
    }


    if(sizeof($_tmp) > 0) {
        echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
    }
    else {
        echo '({ "results": "" })';
    }
} // end getModules


/**
 * Get modules NAS list on request
 * @param object $lanbilling
 */
function getModuleNAS( &$lanbilling )
{
    $_tmp = array();
    if( false != ($result = $lanbilling->get("getAgent", array("id" => (integer)$_POST['getnas']))) ) {
        if(!is_array($result->rnas)) {
            $result->rnas = array($result->rnas);
        }
        array_walk($result->rnas, create_function('&$item, $key, $_tmp', '
            $_tmp[0][] = array(
                "id" => $item->nasid,
                "ip" => $item->ipmask->ip
            );
        '), array( &$_tmp ));
    }
    if(sizeof($_tmp) > 0) {
        echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
    }
    else {
        echo '({ "results": "" })';
    }
} // end getModuleNAS


/**
 * Get NAS Dictionary
 * @param object $lanbilling
 */
function getNASDictionary( &$lanbilling )
{
    $_tmp = array();

    if (!isset($_POST['getdictionary'])) $_POST['getdictionary'] = 0;

    if( false != ($result = $lanbilling->get("getDictionaries", array("id" => (integer)$_POST['getdictionary']))) ) {
        if(!is_array($result)) {
            $result = array($result);
        }
        array_walk($result, create_function('&$item, $key, $_tmp', '
                switch((integer)$item->valuetype)
                {
                    case 0: $type = "int"; break;
                    case 1: $type = "string"; break;
                    case 2: $type = "avpair"; break;
                    case 3: $type = "ipaddr"; break;
                    case 5: $type = "url"; break;
                    case 6: $type = "octet"; break;
                    case 7: $type = "sublist"; break;
                    default: $type = "int";
                }
                $_tmp[0][] = array(
                     "id"         => $item->recordid
                    ,"name"       => $item->name
                    ,"radiustype" => $item->radiustype
                    ,"nasid"      => $item->nasid
                    ,"type"       => $type
                    ,"tagged"     => $item->tagged
                );
        '), array( &$_tmp ));
    }

    if(sizeof($_tmp) > 0) {
        echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
    }
    else {
        echo '({ "results": "" })';
    }
} // end getNASDictionary()


/**
 * Get vgroup's unions
 * @param object $lanbilling
 */
function getVgUnions( &$lanbilling )
{
    $_tmp = array();

    if( false != ($result = $lanbilling->get("getGroups")) )
    {
        if(!is_array($result)) {
            $result = array($result);
        }

        array_walk($result, create_function('&$item, $key, $_tmp', '
            $_tmp[0][] = array(
                "id" => $item->groupid,
                "name" => $item->name
            );
        '), array( &$_tmp ));
    }

    if(sizeof($_tmp) > 0) {
        echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
    }
    else {
        echo '({ "results": "" })';
    }
} // end getVgUnions()


/**
 * Get tariffs list
 * @param object $lanbilling
 */
function getTariffs( &$lanbilling )
{
    $_tmp = array();

    if((integer)$_POST['gettariffs'] > 0) {
        if( false != ($module = $lanbilling->get("getAgent", array("id" => $_POST['gettariffs']))) ) {
            $moduleType = $module->agent->type;
        }
    }

    if( false != ($result = $lanbilling->get("getTarifsExt", array("archive" => 0, "unavail" => -1, "common" => -1))) )
    {
        if(!is_array($result)) {
            $result = array($result);
        }

        array_walk($result, create_function('&$item, $key, $_tmp', '
            if((integer)$_tmp[1] == 6 && $item->tarif->type == 4) {
                return;
            };
            if((integer)$_tmp[1] == 12 && $item->tarif->type != 4) {
                return;
            };
            if($item->tarif->type == 0 ||
                $item->tarif->type == 1 ||
                $item->tarif->type == 2 ||
                $item->tarif->type == 4 ||
                $item->tarif->type == 5)
            {
                $_tmp[0][] = array(
                    "id" => $item->tarif->tarid,
                    "name" => $item->tarif->descr,
                    "symbol" => $item->tarif->symbol
                );
            }
        '), array( &$_tmp, $moduleType ));
    }

    if(sizeof($_tmp) > 0) {
        echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
    }
    else {
        echo '({ "results": "" })';
    }
} // end getTariffs()


/**
 * Get Categories list on request
 * @param    object, billing system class
 */
function getCategories( &$lanbilling )
{
    if((integer)$_POST['getcategories'] == 0) {
        echo '({ "results": "" })';
        return;
    }

    $_tmp = array();

    if( false != ($result = $lanbilling->get("getTarCategories", array("id" => (integer)$_POST['getcategories']))) ) {
        if(!is_array($result)) {
            $result = array($result);
        }

        array_walk($result, create_function('&$item, $key, $_tmp','
            $_tmp[0][] = array(
                "id" => $item->catidx,
                "descr" => $item->descr,
                "tarid" => $item->tarid,
                "catid" => $item->catid,
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
 * Build and return vgroups lists on background request
 * @param    object, billing class
 */
function getVgroups( &$lanbilling )
{
    $_filter = $lanbilling->soapFilter(vgroupsFilter($lanbilling));
    $_md5 = $lanbilling->controlSum($_filter);

    if( false != ($result = $lanbilling->get("getVgroups", array("flt" => $_filter, "md5" => $_md5))) )
    {
        if(!is_array($result)) {
            $result = array($result);
        }

        $count = $lanbilling->get("Count", array("flt" => $_filter, "procname" => "getVgroups", "md5" => $_md5));
        $_tmp = array();

        array_walk($result, create_function('&$obj, $key, $_tmp', '$_tmp[0][] = array("id" => $obj->vgid, "login" => $obj->login, "descr" => $obj->descr);'), array(&$_tmp));

        if(sizeof($_tmp) > 0) {
            echo '({"total": ' . $count . ', "results": ' . JEncode($_tmp, $lanbilling) . '})';
        }
        else echo '({ "total": 0, "results": "" })';
    }
    else echo '({ "total": 0, "results": "" })';
} // end getVgroups()


/**
 * Build filter structure, returns array
 * @param    object, billing class
 */
function vgroupsFilter( &$lanbilling )
{
    $_filter = array("personid" => $_SESSION['auth']['authperson'], "istemplate" => 0);

    switch((integer)$_POST['searchtype'])
    {
        case 0: $_filter['login'] = $_POST['search']; break;
        case 1: $_filter['descr'] = $_POST['search']; break;
        default: $_POST['search'];
    }

    return $_filter;
} // end Filter()


/**
 * Get device groups
 * @param   object, main billing class
 * @param   object, localize class
 */
function getDeviceGroups( &$lanbilling, &$localize )
{
    $_filter = array( "agentid" => (integer)$_POST['getdevgroups'] );
    $_md5 = $lanbilling->controlSum($_filter);

    if( false !== ($result = $lanbilling->get("getDeviceGroups", array("flt" => $_filter, "md5" => $_md5))) )
    {
        if(!is_array($result)) {
            $result = array($result);
        }

        $response = array(
            "success" => true,
            "results" => array_values($result)
        );
    }
    else {
        $response = array(
            "success" => false,
            "results" => array()
        );
    }
    print JEncode($response, $lanbilling);
} // end getDeviceGroups()
