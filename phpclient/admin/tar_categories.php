<?php

/**
 * Engine to view and control tarifs categories
 */

// There is background query
if(isset($_POST['async_call']))
{

	if($_POST['getCatList']) {
		getCatList1($lanbilling, $localize);
	}

	if(isset($_POST['directions'])) {
		saveTarCat($lanbilling, $localize);
	}

    if($_POST['tarCatStartUsing']) {
		migrateTarifs($lanbilling, $localize);
	}

    if($_POST['getMasterCategoryList']) {
		getMasterCategoryList($lanbilling, $localize);
	}

    if($_POST['addMasterCategory']) {
		addMasterCategory($lanbilling, $localize);
	}

    if(isset($_POST['getmastercategory'])) {
		getMasterCategory($lanbilling, $localize);
	}

    if($_POST['delMasterCategory']) {
		delMasterCategory($lanbilling, $localize);
	}

	if($_POST['getCatContent']) {
		getCatContent($lanbilling, $localize);
	}



}
else {
	$tpl = new HTML_Template_IT(TPLS_PATH);
	$tpl->loadTemplatefile("tar_categories.tpl", true, true);
	$tpl->touchBlock('__global__');
	$localize->compile($tpl->get(), true);
}

function saveTarCat($lanbilling, $localize){
    if (!empty($_POST['directions'])){
        /**
         * Уникальность для связки зона-направление
         */

        $directions = (strpos($_POST['directions'],';') == 1) ? explode(';',$_POST['directions']) : array_unique(explode(';',$_POST['directions']));

        //$directions = array_unique(explode(';',$_POST['directions']));
        foreach ($directions as $v){
            $zonDirArr = explode(':',$v);
            $zoneDir[$v] = array(
                'zoneid'    => $zonDirArr[0],
                'direction' => $zonDirArr[1]
            );
        }
        foreach($zoneDir as $key => $zoneArray){ $zones[] = $zoneArray['zoneid']; }
        $_filter = array( "catid" => $_POST['catid'] );
        if( false != ($result = $lanbilling->get('getTelCatalog', array("flt" => $_filter))) ) {
			if(!is_array($result)) $result = array($result);
            foreach ($result as $k => $zoneObj){
                if (in_array($zoneObj->zoneid,$zones)){
                    $zoneClean[$zoneObj->zoneid] = (array)$zoneObj;
                }else continue;
            }
        } else $zoneClean = array();
        foreach($zoneDir as $key => $zoneClearArray){
            $tmpOutRes = $zoneClean[$zoneClearArray['zoneid']];
            $tmpOutRes['direction'] = $zoneClearArray['direction'];
            $outRes[] = $tmpOutRes;
        }
    } else $outRes = array();

    $ins = array(
        'category' => array(
            'catidx' => $_POST['tarcat'],
            'catid'  => $_POST['catid'],
            'descr'  => $_POST['descr'],
            'uuid'   => $_POST['uuid']
        ),
        //'telcatalog' => $outRes
    );

    (!empty($outRes)) ? $ins['telcatalog'] = $outRes : '';

    if( false !== ($result = $lanbilling->save('insupdMasterCategory', $ins, false)) ){
        echo '({ success: true })';
	} else {
        $error = $lanbilling->soapLastError();
        echo '({ success: false, errors: { reason: "'.$error->detail.'" } })';
    }
}


function delMasterCategory($lanbilling, $localize){
	if((integer)$_POST['delMasterCategory'] <= 0) {
		echo '({ success: false, errors: { reason: "' . $localize->get('Undefined') . ': CATIDX" } })';
		return false;
	}
	if( false == $lanbilling->delete("delMasterCategory", array("catidx" => $_POST['delMasterCategory']), array("getMasterCategory")) ) {
        $error = $lanbilling->soapLastError();
		echo '({ success: false, errors: { reason: "' . $localize->get('Server error') . ': ' . $errDescr . '" } })';
	}
	else echo '({ success: true })';

}


function getMasterCategoryList($lanbilling, $localize){
    $_filter = array(
        'recordid' => $_POST['getMasterCategoryList'],
        'catid'    => $_POST['catid']
    );
    if( false !== ($result = $lanbilling->get("getMasterCategory", array('flt'=>$_filter))) ){
        if (!isset($result->telcatalog))   { echo '({ success: true, "results": "" })'; return;}
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
            echo '({ success: true, "results": ' . JEncode($_tmp, $lanbilling) . '})';
        } else {
            echo '({ success: true, "results": "" })';
        }
	} else echo '({ success: false, errors: { reason: "Unknown catalog ID" } })';
}

function migrateTarifs($lanbilling){
    $ins = array(
        'date' => $_POST['tarCatStartUsing']
    );
    if( false !== ($result = $lanbilling->get('migrateTarifs', $ins)) ){
        echo '({ success: true })';
	} else {
        $error = $lanbilling->soapLastError();
        echo '({ success: false, errors: { reason: "'.$error->detail.'" } })';
    }
}



function addMasterCategory($lanbilling, $localize){

    $ins = array(
        'category' => array(
            'catidx' => 0,
            'catid' => $_POST['catid'],
            'descr' => $_POST['catname'],
            'uuid'  => $_POST['catUnicUid']
        )/*,
        'telcatalog' => array(
            array(
                'catid' => 0,
                'zoneid' => 0,
                'zoneclass' => 0,
                'direction' => 0,
                'classdescr' => 0,
                'zonenum' => 0,
                'descr' => 0,
                'zonedescr' => 0,
                'catidx' => 0,
                'catidxdir' => 0,
                'catidxdescr' => 0
            ),
            array(
                'catid' => 0,
                'zoneid' => 0,
                'zoneclass' => 0,
                'direction' => 0,
                'classdescr' => 0,
                'zonenum' => 0,
                'descr' => 0,
                'zonedescr' => 0,
                'catidx' => 0,
                'catidxdir' => 0,
                'catidxdescr' => 0
            ),
            array(
                'catid' => 0,
                'zoneid' => 0,
                'zoneclass' => 0,
                'direction' => 0,
                'classdescr' => 0,
                'zonenum' => 0,
                'descr' => 0,
                'zonedescr' => 0,
                'catidx' => 0,
                'catidxdir' => 0,
                'catidxdescr' => 0
            )


        )*/
    );

    if( false !== ($result = $lanbilling->save('insupdMasterCategory', $ins, true)) ){
        echo '({ success: true })';
	} else {
        $error = $lanbilling->soapLastError();
        echo '({ success: false, errors: { reason: "'.$error->detail.'" } })';
    }

}

/**
 * Получение списка тарифных категорий для каталога
 */
function getMasterCategory($lanbilling, $localize){

    if ($_POST['getmastercategory'] == 0) {echo '({ success: true, "results": "" })'; return;}

    $_filter = array(
        'catid'  => $_POST['getmastercategory'],
        'nodata' => 1
    );
    if( false !== ($result = $lanbilling->get("getMasterCategory", array('flt'=>$_filter))) ){
        if ($result == null) {echo '({ success: true, "results": "" })'; return;}
		if(!is_array($result)) { $result = array($result); }
		array_walk($result, create_function('$item, $key, $_tmp', '
			$_tmp[0][] = array(
                "catidx" => $item->category->catidx,
                "catid"  => $item->category->catid,
                "descr"  => $item->category->descr,
                "uuid"   => $item->category->uuid
			);
		'), array( &$_tmp, &$lanbilling ));
        if(sizeof($_tmp) > 0) {
            echo '({ success: true, "results": ' . JEncode($_tmp, $lanbilling) . '})';
        } else {
            echo '({ success: true, "results": "" })';
        }
	} else echo '({ success: false, errors: { reason: "Unknown catalog ID" } })';
}
// END getMasterCategory


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

	$_filter = array("catid" => $_POST['catcontent'], "pgsize" => 50, "pgnum" => $lanbilling->linesAsPageNum(50, (integer)$_POST['start'] + 1));
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



function getMasterCategoryTelCatalog($lanbilling, $localize){
	$_tmp = array();
	if( false != ($result = $lanbilling->get("getMasterCategoryTelCatalog", array('flt'=>array('catid' => 1)))) ) {
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
}

/**
 * Получение списка каталогов
 */
function getCatalogsList($lanbilling){
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
};



function getCatList1( &$lanbilling )
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
                "group" => true
            );
        '), array(&$_tmp));

		if( false != ($leaves = $lanbilling->get("getCatalogs")) ) {
			if(!empty($leaves)) {
				$leaves = (!is_array($leaves)) ? array($leaves) : $leaves;
				array_walk($leaves, create_function('&$obj, $key, $_tmp','
                    if($obj->cattype == 3){
                        $_tmp[0][$obj->operid]["children"][] = array(
                            "id" => ($obj->operid + 1) . $obj->catid,
                            "catid" => $obj->catid,
                            "cattype" => $obj->cattype,
                            "operid" => $obj->operid,
                            "catname" => $obj->catname,
                            "text" => $obj->catname,
                            "used" => $obj->used,
                            "leaf" => true,
                            "iconCls" => "ext-cdrpabx"
                        );
                    }
                '), array( &$_tmp ));
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
 * @about Print array to file or/and interface
 * @param Array()
 * @print_i  Print to interface DEFAULT FALSE
 * @param path DEFAULT to /tmp/_lb_dump.log
 */
function dumpI($arr,$print_i = FALSE,$path='/tmp/_lb_dump.log'){
    global $lanbilling;
    file_put_contents($path,print_r($arr,1));
    return ($print_i) ? '({' . JEncode($arr, $lanbilling) . '})' : TRUE;
}
