<?php
/**
 * Gen.sales
 * генерация документов о начислениях
*/

// There is background query
if(isset($_POST['async_call']))
{
	if(isset($_POST['genSales'])) {
		genSales($lanbilling, $localize);
	}

	if(isset($_POST['getUserGroups'])) {
		getUserGroups($lanbilling, $localize);
	}
}
else
{
	$tpl = new HTML_Template_IT(TPLS_PATH);
	$tpl->loadTemplatefile("gen_sales.tpl", true, true);
	$tpl->setVariable('AUTOLOAD', (integer)$lanbilling->Option('autoload_accounts'));
	$tpl->touchBlock("__global__");
	$localize->compile($tpl->get(), true);
}

function genSales( &$lanbilling, &$localize )
{
    $input = $lanbilling->objectToArray(json_decode($_POST['fields']));
    $bdate = $lanbilling->formatDate($input['bdate'], 'Y-m-d H:i:s');
	$date = $lanbilling->formatDate(date('Y-m-d', strtotime($input['date'])).' 23:59:59', 'Y-m-d H:i:s');
    $docType = ((integer)$input['gen_type'] && in_array((integer)$input['gen_type'], array(1,2,3))) ? (integer)$input['gen_type'] : 1;
	$addon_filter = array();
    switch ($docType){
        case 1:
            $procedure = 'genSales';
            $params = array(
                'bdate' => $bdate,
                'date' => $date
            );
        break;
        case 2:
            $procedure = 'exportDocumentsTo1C';
            $params = array(
                'bdate' => $bdate,
                'edate' => $date
            );
            /**
             * Дополнительный фильтр экспорта 1С. Побитовое сложение.
             */
            $Csum = 0;
            if (isset($input['export_group']) && in_array($input['export_group'],array(0,1,2))){
                if ( $input['export_group'] == 0 ) $Csum = 3;
                else $Csum = $input['export_group'];
            } else $Csum = 3;
            if (isset($input['1CexportOne'])) $Csum += 4;
            if (isset($input['1CByDocDate'])) $Csum += 8;
            
			
			if(isset($input['1CexportFilter']))
			{
				if($input['1CexportFilter']==0)
					$Csum +=8;
				if($input['1CexportFilter']==1)
				{
					$Csum +=16;
					
					$dt_el  = explode("-",$bdate);
					$params['bdate'] =$dt_el[0] . "-" . $dt_el[1] . "-01 00:00:00";
					$params['edate'] = $lanbilling->subDate($dt_el[0] . "-" . $dt_el[1] . '-01', 1, 'month', 'Y-m-d') . " 00:00:00";
					
				}
			}
			
			if ($Csum > 0) $params['flg'] = $Csum;

        break;
        case 3:
            $procedure = 'exportBalanceTo1C';
            $params = array(
                'date' => $bdate
            );
        break;
        default:
            $error = $lb->soapLastError();
            echo '({ success: false, errors: { reason: "'.$localize->get("Error occurred while generating documents").'", detail: '.JEncode($error, $lb).' } })';
            exit();
    }
    
    if (isset($input['filter'])){
        switch ($input['filter']){
            // Filtering by group
            case 'group':
                if (isset($input['user_group']) && (integer)$input['user_group'] >= 0){
                    if (isset($input['include_group']) && (integer)$input['include_group'] == 1){
                        $addon_filter['ugroups'] = (integer)$input['user_group'];
                    } else {
                        $addon_filter['notgroups'] = (integer)$input['user_group'];
                    }
                }
            break;
            // Filtering by user
            case 'user':
                if (isset($input['genUserId']) && (integer)$input['genUserId'] > 0)
                    $addon_filter['userid'] = (integer)$input['genUserId'];
            break;
            // Filtering by agreement
            case 'agreement':
                if (isset($input['genAgrmId']) && (integer)$input['genAgrmId'] > 0)
                    $addon_filter['agrmid'] = (integer)$input['genAgrmId'];
            break;
            // Advanced filters
            case 'adv_search':
            	$adv_flt = searchTemplFilter($lanbilling);
            	$addon_filter = array_merge($addon_filter, $adv_flt);
            break;
        }
    }
	$addon_filter['archive'] = (int)$input['archive']; // new param for doctype combo
	
	$params['flt'] = $addon_filter;
    //$params = array_merge($params, $addon_filter);
	$_tmp = array();
    set_time_limit(18000);
    $lb = $lanbilling->cloneMain(array('query_timeout' => 18000));

	if( false != ($result = $lb->get($procedure, $params))){
		echo '({ success: true })';
	}else{
        $error = $lb->soapLastError();
        if (preg_match('~Sales generation in progress~',$error->detail,$mtch)){
            $err = $localize->get("Generation is already started");
        } 
        else if(strstr($error->detail, 'sale document with closed period or manual corrections')){
        	$err = $localize->get('Sale document with closed period or manual corrections');
        } 
        else {
            $err = $localize->get("Error occurred while generating documents") . '<br/>'.$error->detail;
        }
        echo '({ success: false, errors: { reason: "'.$err.'", detail: '.JEncode($error, $lb).' } })';
    }
} // end genSales()



function getUserGroups($lanbilling, $localize)
{
    if( false != ($result = $lanbilling->get("getUserGroups", array("flt" => array()))))
	{
		if(!is_array($result)) { $result = array($result); }
		array_walk($result, create_function('$item, $key, $_tmp', '
			$_tmp[0][] = array(
				"groupid"     => $item->usergroup->groupid,
				"name"        => $item->usergroup->name,
                "description" => $item->usergroup->description
			);
		'), array( &$_tmp, &$lanbilling ));
        if(sizeof($_tmp) > 0) {
            echo '({ success: true, "results": ' . JEncode($_tmp, $lanbilling) . '})';
        } else {
            echo '({ success: true, "results": "" })';
        }
	}else{
        $error = $lanbilling->soapLastError();
		echo '({ success: false, errors: { reason: "'.$error.'" } })';
		return false;
    }

}

/**
 * Build filter structure, returns array
 * @param    object, billing class
 */
function searchTemplFilter( &$lanbilling )
{
	$_filter = array();

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
	return $_filter;
} // end Filter()
