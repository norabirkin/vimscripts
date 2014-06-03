<?php
/**
 * Data to show financial reports
 * 
 * @date		$Date: 2013-02-14 17:12:53 +0400 (Чт., 14 февр. 2013) $
 * @revision	$Revision: 31755 $
 */

// There is background query
if(isset($_POST['async_call']))
{
	if(isset($_POST['rentgrid'])) {
		rentDataGrid($lanbilling);
	}
	
	if(isset($_POST['balancegrid'])) {
		balanceDataGrid($lanbilling);
	}
	
	if(isset($_POST['historylocks'])) {
		showHistoryLocks($lanbilling);
	}
    
    if(isset($_POST['getdiscountsstat'])) {
        getDiscountsStat($lanbilling, $localize);
    }
}
// There is standard query
else
{

}


/**
 * Get rent charges for the table
 * @param	object, billing class
 */
function rentDataGrid( &$lanbilling )
{
	if(!isset($_POST['datefrom']) || empty($_POST['datefrom'])) {
		$_POST['datefrom'] = date('Y-m') . '-01';
	}
	
	if(!isset($_POST['datetill']) || empty($_POST['datetill'])) {
		$_POST['datetill'] = $lanbilling->subDate(date('Y-m') . '-01', 1, 'month', 'Y-m-d');
	}
	
	$dtfrom = $lanbilling->formatDate($_POST['datefrom'] . " 00:00:00", 'YmdHis');
	$dtto = $lanbilling->formatDate($_POST['datetill'] . " 00:00:00", 'YmdHis');
	
	$_filter = array(
		"repnum" => 4, 
		//"dtfrom" => $dtfrom, 
		//"dtto" => $dtto,
		"dtfrom" => $_POST['datefrom'],
		"dtto" => $_POST['datetill'],
		"agrmid" => (integer)$_POST['agrmid'], 
		"vgid" => (integer)$_POST['vgid'], 
		// Skip empty amount records
		"amountfrom" => (integer)$_POST['emptyamount'],
		"pgnum" => $lanbilling->linesAsPageNum((((integer)$_POST['limit'] <= 0) ? 100 : $_POST['limit']), (integer)$_POST['start'] + 1), 
		"pgsize" => (((integer)$_POST['limit'] <= 0) ? 100 : $_POST['limit'])
	);
	
	$_order = array(
		"name" => 'dt',
		"ascdesc" => !isset($_POST['dir']) ? 0 : (($_POST['dir'] == "ASC") ? 0 : 1)
	);
	
	$_tmp = array();
	
	$lb = $lanbilling->cloneMain(array('query_timeout' => 380));
	
	if( false != ($result = $lb->get("getStat", array("flt" => $_filter, "ord" => $_order))) )
	{
		if(!is_array($result->data)) {
			$result->data = array($result->data);
		}
		
		$_tmp = $lanbilling->dataCombine($result->names->val, $result->data);
		
		foreach ($_tmp as &$item){
			$item['amount'] = round ($item['amount'], 2 );
		}
	}
	
	if(sizeof($_tmp) > 0) { 
		echo '({"total": ' . (integer)$result->total . ', "results": ' . JEncode($_tmp, $lanbilling) . '})';
	} else {
		echo '({ "total": 0, "results": "" })';
	}
	// Clear memory
	unset($lb);
} // end rentDataGrid()


/**
 * Get start balance data on each day on period
 * @param	object, billing class
 */
function balanceDataGrid( &$lanbilling )
{
	if(!isset($_POST['datefrom']) || empty($_POST['datefrom'])) {
		$_POST['datefrom'] = date('Y-m') . '-01';
	}
	
	if(!isset($_POST['datetill']) || empty($_POST['datetill'])) {
		$_POST['datetill'] = $lanbilling->subDate(date('Y-m') . '-01', 1, 'month', 'Y-m-d');
	}
	
	$dtfrom = $lanbilling->formatDate($_POST['datefrom'] . " 00:00:00", 'YmdHis');
	$dtto = $lanbilling->formatDate($_POST['datetill'] . " 00:00:00", 'YmdHis');
	
	$_filter = array(
		"repnum" => 11, 
		"dtfrom" => $dtfrom, 
		"dtto" => $dtto, 
		"agrmid" => (integer)$_POST['agrmid'], 
		"vgid" => (integer)$_POST['vgid'], 
		"pgnum" => $lanbilling->linesAsPageNum((((integer)$_POST['limit'] <= 0) ? 100 : $_POST['limit']), (integer)$_POST['start'] + 1), 
		"pgsize" => (((integer)$_POST['limit'] <= 0) ? 100 : $_POST['limit'])
	);
	
	$_order = array(
		"name" => 'dt',
		"ascdesc" => 1
	);
	
	$_tmp = array();
	if( false != ($result = $lanbilling->get("getStat", array("flt" => $_filter, "ord" => $_order))) )
	{
		if(!is_array($result->data)) {
			$result->data = array($result->data);
		}
		
		$_tmp = $lanbilling->dataCombine($result->names->val, $result->data);
	}
	
	if(sizeof($_tmp) > 0) { 
		echo '({"total": ' . (integer)$result->total . ', "results": ' . JEncode($_tmp, $lanbilling) . '})';
	} else {
		echo '({ "total": 0, "results": "" })';
	}
} // end balanceDataGrid()


/**
 * Show history of locks for the selected user account
 * @param	object, billing class
 */
function showHistoryLocks( &$lanbilling )
{
	if(!isset($_POST['datefrom']) || empty($_POST['datefrom'])) {
		$_POST['datetill'] = $lanbilling->subDate(date('Y-m') . '-01', -3, 'month', 'Y-m-d');
	}
	
	if(!isset($_POST['datetill']) || empty($_POST['datetill'])) {
		$_POST['datefrom'] = date('Y-m') . '-01';
	}
	
	$dtfrom = $lanbilling->formatDate($_POST['datefrom'] . " 00:00:00", 'YmdHis');
	$dtto = $lanbilling->formatDate($_POST['datetill'] . " 00:00:00", 'YmdHis');
	
	$_filter = array(
		"repnum" => 12, 
		"dtfrom" => $dtfrom, 
		"dtto" => $dtto, 
		"agrmid" => (integer)$_POST['agrmid'], 
		"vgid" => (integer)$_POST['historylocks'], 
		"pgnum" => $lanbilling->linesAsPageNum((((integer)$_POST['limit'] <= 0) ? 100 : $_POST['limit']), (integer)$_POST['start'] + 1), 
		"pgsize" => (((integer)$_POST['limit'] <= 0) ? 100 : $_POST['limit'])
	);
	
	$_order = array(
		"name" => 'dt',
		"ascdesc" => 1
	);
	
	$_tmp = array();
	if( false != ($result = $lanbilling->get("getStat", array("flt" => $_filter, "ord" => array("timeto")))) )
	{
		if(!empty($result->data)) {
			if(!is_array($result->data)) {
				$result->data = array($result->data);
			}
			
			$_tmp = $lanbilling->dataCombine($result->names->val, $result->data);
		}
	}
	
	if(sizeof($_tmp) > 0) { 
		echo '({ "total": ' . (integer)$result->total . ', "results": ' . JEncode($_tmp, $lanbilling) . '})';
	}
	else {
		echo '({ "results": "" })';
	}
} // end showHistoryLocks()


/**
 * Show discounts history
 * @param object, main class
 */
function getDiscountsStat( &$lanbilling, &$localize )
{
    try {
        if(!isset($_POST['datefrom']) || empty($_POST['datefrom'])) {
            $_POST['datetill'] = $lanbilling->subDate(date('Y-m') . '-01', -3, 'month', 'Y-m-d');
        }
        
        if(!isset($_POST['datetill']) || empty($_POST['datetill'])) {
            $_POST['datefrom'] = date('Y-m') . '-01';
        }
        
        $dtfrom = $lanbilling->formatDate($_POST['datefrom'] . " 00:00:00", 'YmdHis');
        $dtto = $lanbilling->formatDate($_POST['datetill'] . " 00:00:00", 'YmdHis');
        
        $_filter = array(
            "repnum" => 28, 
            "dtfrom" => $dtfrom, 
            "dtto" => $dtto, 
            "vgid" => (integer)$_POST['vgid'], 
            "pgnum" => $lanbilling->linesAsPageNum((((integer)$_POST['limit'] <= 0) ? 100 : $_POST['limit']), (integer)$_POST['start'] + 1), 
            "pgsize" => (((integer)$_POST['limit'] <= 0) ? 100 : $_POST['limit'])
        );
        
        $_order = array(
            "name" => 'dtfrom',
            "ascdesc" => 1
        );
        
        if( false === ($result = $lanbilling->get("getStat", array("flt" => $_filter, "ord" => $_order))) )
        {
            throw new Exception ($lanbilling->soapLastError()->detail);
        }
        
        if(!empty($result)) {
            if(!empty($result->data)) {
                if(!is_array($result->data)) {
                    $result->data = array($result->data);
                }
				
                $_tmp = $lanbilling->dataCombine($result->names->val, $result->data);
                for($i=0;$i<count($_tmp);$i++) $_tmp[$i]['costwithdisc'] = round($_tmp[$i]['costwithdisc'], 2);
            }
        }
    }
    catch(Exception $error) {
        $_response = array(
            "results" => array(),
            "total" => 0,
            "success" => false,
            "error" => $error->getMessage()
        );
    }
    
    if(!$_response) {
		//print_r($_tmp);
        $_response = array(
            "results" => (array)$_tmp,
            "total" => (integer)$result->total,
            "success" => true,
            "error" => null
        );
    }
    
    echo "(" . JEncode($_response, $lanbilling) . ")";
} // end getDiscountsStat()
