<?php
/**
 * View auth log
 *
 */

// There is background query
if(isset($_POST['async_call']))
{
	if(isset($_POST['getauthlogs'])) {
		getAuthLog($lanbilling, $localize);
	}
}
else
{
	$tpl = new HTML_Template_IT(TPLS_PATH);
	$tpl->loadTemplatefile("authlog.tpl", true, true);
	$tpl->touchBlock("__global__");
	$localize->compile($tpl->get(), true);
}

function getAuthLog( &$lanbilling, &$localize )
{
	$dtfrom = $lanbilling->formatDate($_POST['dtfrom'] . '00:00:00', 'YmdHis');
	$dtto = $lanbilling->formatDate($_POST['dtto'] . '00:00:00', 'YmdHis');
	// Filter
	$_filter = array(
		"repnum" => 21,
		"dtfrom" => $dtfrom,
		"dtto"   => $dtto,
		// Т.К. другие поля не обрабатываются.
		"status" => (empty($_POST['typecombo']) ? 0 : $_POST['typecombo']),
	);
	$_filter['pgsize'] = ((integer)$_POST['limit'] <= 0) ? 100 : $_POST['limit'];
	$_filter['pgnum'] = $lanbilling->linesAsPageNum($_filter['pgsize'], (integer)$_POST['start'] + 1);

	if (!empty($_POST['searchfield'])){
		switch ($_POST['searchtype']){
			case 0: $searchType = 'vglogin'; break;
			case 1: $searchType = 'name'; break;
			case 2: $searchType = 'agrmnum'; break;
            case 3: $searchType = 'ani'; break;
            case 4: $searchType = 'fullsearch'; break;
		}
		$_filter[$searchType] = $_POST['searchfield'];
	}
	// Sort
	$_order = array(
		"name" => $_POST['sort'],
		"ascdesc" => !isset($_POST['dir']) ? 0 : (($_POST['dir'] == "ASC") ? 0 : 1)
	);
	$_tmp = array();
	$lb = $lanbilling->cloneMain(array('query_timeout' => 380));
	if( false !== ($result = $lb->get("getStat", array("flt" => $_filter, "ord" => $_order), true, true))){
		if(!is_array($result->data)) {
			$result->data = array($result->data);
		}
        $title_basic_array = $result->names->val;

        $required_fields = array( 'dt', 'vg_login', 'result', 'comment', 'nas_ip', 'session_id', 'auth_id', 'nas_id', 'duration', 'ip', 'mac' );
        $_tmpFullArray = $lanbilling->dataCombine($title_basic_array, $result->data);

	

        $resultArray = array();
        foreach ($_tmpFullArray as $origKey => $values){
            foreach ($values as $key => $title){
                if (in_array($key,$required_fields)){
                	$resultArray[$origKey][$key] = $title;
                } elseif(!is_numeric($key)) {
                    $resultArray[$origKey]['radiusAttr'][$key] = $title;			
                }
            }
            // Проверка на существование данных, модификация вывода данных
			if($resultArray[$origKey]['duration'] != '')
			{
				$time = date("H:i:s", mktime(0, 0, $resultArray[$origKey]['duration']));
				$days = floor ($resultArray[$origKey]['duration'] / 86400);
				$resultArray[$origKey]['duration'] = $days==0 ? $time : $days . 'd ' . $time;
			}
        }

        ///**
        // * Подготовка списка дополнительных полей
        // */
        //$title_addon_array = array();
        //foreach ($title_basic_array as $key => $title){
        //    if (!in_array($title,$required_fields) && !is_numeric($title))
        //        $title_addon_array[$key] = $title;
        //    elseif (!is_numeric($title))
        //        $assoc_title_array[$key] = $title;
        //}
        //
        $_tmp = $resultArray;
	}else{
        $error = $lanbilling->soapLastError();
        echo '({ success: false, errors: { reason: "'.$error.'" } })';
        return;
    }
	if(sizeof($resultArray) > 0) {
		echo '({"total": ' . (integer)$result->total . ', "results": ' . JEncode($resultArray, $lanbilling) . '})';
	}
	else echo '({ "total": 0, "results": "" })';
	unset($resultArray, $_filter, $lb);
} // end getAuthLog()
