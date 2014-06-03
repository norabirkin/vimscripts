<?php
ini_set("display_errors", false);
include_once("../localize.php");
include_once('../localize.class.php');
include_once("../functions.inc");
include_once("../api_functions.php");
include_once("../constants.php");
include_once("../IT.php");
include_once("../common_display_1.php");
include_once("../soap.class.php");
include_once("../main.class.php");
include_once("../includes.php");
$localize = new Localize('ru', 'UTF-8',array("rootPath"=>"../"));
$lanbilling = new LANBilling(array("rootPath"=>"../"));
$lb = $lanbilling->cloneMain(array('query_timeout' => 1200));
// ------------------------------------Get all operators list-------------------------------------------------------------------------
if(isset($_POST['getoperators'])){
	$filter = array("category" => 1);
	if( false == ($result = $lanbilling->get("getAccounts", array("flt" => $filter)))){
		echo "({ success: false, errors: { reason: 'There was an error while getting operators list. Look server logs for details.' } })";
	}
	else{
		if(!is_array($result)) {
				$result = array($result);
		}
		$tmp = array();
		$tmp[] = array("uid" => 0,
					   "name" => $localize->get('Select all')
					  );
		foreach($result as $obj){
			$tmp[] = array("uid" => $obj->account->uid,
					       "name" => $obj->account->name
					      );
		}
	}
	if (sizeof($tmp) > 0) echo '({"results": ' . JEncode($tmp, $lanbilling) . '})';
	else echo "({ results: '' })";

	return;
}
// ------------------------------------Get all managers list-------------------------------------------------------------------------
if(isset($_POST['getmanagers'])){
	$_flt = array(
			'flt'=>array('istemplate' => 0, 'archive' => 0),
			"ord" => array("name" => 'fio',"ascdesc" => 0)
	);
	if( false == ($result = $lanbilling->get("getManagers", $_flt)) ){
			echo "({ success: false, errors: { reason: 'There was an error while getting managers list. Look server logs for details.' } })";
	}
	else {
		if(!is_array($result)) { $result = array($result); }
		$_tmp = array();
		$_tmp[] = array(
            "personid" => -1,
			"fio" => $localize->get('Select all')
		);
        foreach($result as $obj){
            $_tmp[] = array(
                "personid" => $obj->personid,
                "fio" => $obj->fio
            );
        }
        if(sizeof($_tmp) > 0)
            echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
        else echo "({ results: '' })";
	}
	return;
}
//---------------------------------------------------------------------------------------------------------------
if(isset($_POST['getuserinfo'])){
	$agrmid=$_POST['agrmid'];
	$filter = array("agrmid" => $agrmid);
	$result = $lanbilling->get("getAccounts", array("flt" => $filter)) ;

	if(!is_array($result->account)) {
				$result->account = array($result->account);
			}
	$usrid=$result->account[0]->uid;

	if( false != ($result = $lanbilling->get("getAccount", array("id" => (integer)$usrid))) ) {
		if(!empty($result->account)) {
			if(!is_array($result->account)) { $result->account = array($result->account); }
		}
	}

	$res=array_merge($result->account,(array)$result->addresses);

	if(sizeof($result->account) > 0)
		echo '({"results": ' . JEncode($res, $lanbilling) . '})';
	else echo "({ results: '' })";
  return;
}

//---------------------------------------------------------------------------------------------------------------
$dtfrom = $lanbilling->formatDate($_POST['start_period']. " 00:00:00", 'YmdHis');
$dtto   = $lanbilling->formatDate($_POST['end_period']." 00:00:00", 'YmdHis');

$numagent     = $_POST['report_filter_agent'];
$usergroup_id = $_POST['usergroup_id'];
$mgrid        = $_POST['manager_id'];
$operid       = $_POST['operator_id'];

if ($_POST['commondate']==1) {
	$summa=0;
	$cf = array(
		"dtfrom"  => $dtfrom,
        "dtto"    => $dtto,
        "ugroups" => $usergroup_id,
        "mgrid"   => $mgrid,
        "operid"  => $operid, 
        "repnum"  => -2
    );
	if ($_POST['filter']!='null'){
		$json = stripcslashes($_POST['filter']);
		$_filter_add=json_decode($json);
		$_filter_add=(array)$_filter_add;
		foreach($_filter_add['searchtempl'] as $key=>$item){
			$_filter_add['searchtempl'][$key]=(array)$item;
		}
		$_filter = array_merge($_filter_add,$cf);
	}
	else $_filter=$cf;

	$_filter['payhistory'] = 1;
    if (false!=($result = $lb->get('getPayments', array('flt' => $_filter)))){
		if(!is_array($result)) 	$result = array($result);
		foreach($result as $obj){
			if(!empty($obj->pay->canceldate)) continue;
			$_tmp[] = array(
			$summa=$summa+$obj->pay->amount);
		}
	}
	echo $summa;
	return;
}

$summa   = 0;
$pgsize  = $_POST['limit'];
$numpage = $_POST['start'];
$pgnum   = $numpage/$pgsize +1;
$kk = array("dtfrom" => $dtfrom, "dtto" => $dtto,"ugroups"=>$usergroup_id,"mgrid"=>$mgrid,"operid"=>$operid,"pgnum"=>$pgnum,"pgsize"=>$pgsize, "repnum"=>-2);
if ($_POST['filter']!='null'){
    $json = stripcslashes($_POST['filter']);
    $_filter_add=json_decode($json);
    $_filter_add=(array)$_filter_add;
    foreach($_filter_add['searchtempl'] as $key=>$item){
        $_filter_add['searchtempl'][$key] = (array)$item;
    }
    $_filter = array_merge($_filter_add,$kk);
}
else $_filter=$kk;

$_cf = $_filter;
$_cf['flt'] = $_filter;
$_filter['payhistory'] = 1;
$_cf['procname'] = "getPayments";
$total = $lb->get("Count", $_cf);

        if (false!=($result = $lb->get('getPayments', array('flt' => $_filter)))){
            if(!is_array($result)){
                $result = array($result);
            }
            $canseledPayments = 0;
            foreach($result as $obj){
                if(!empty($obj->pay->canceldate)){
                    $canceledPayments += 1;
                    continue;
                }
                $_tmp[] = array(
                "date" => $lanbilling->formatDate($obj->pay->paydate, 'Y-m-d H:i:s'),
                "localdate" => $lanbilling->formatDate($obj->pay->localdate, 'Y-m-d H:i:s'),
                "paysum" => number_format($obj->pay->amount, 2, ',', ' '),
                "comment"=>$obj->pay->comment,
                $summa=$summa+$obj->pay->amount,
                "uname"=>$obj->uname,
                "login"=>$obj->login,
                "manager"=>$obj->mgr,
                "currsymb"=>$obj->currsymb,
                "agreement"=>$obj->agrm,
                "receipt"=>$obj->pay->receipt,
                "opername"=>$obj->opername,
                "agrmid"=>$obj->pay->agrmid
                );
            }
        }

if(sizeof($_tmp) > 0) {
    echo '({"total":'.($total-$canceledPayments).',"summa":'.$summa.', "results": ' . JEncode($_tmp, $lanbilling) . '})';
}
else echo '({ "total": 0, "results": "" })';


function JEncode( &$arr, &$lanbilling )
{
	if(function_exists("json_encode")) {
		$data = json_encode($arr);
	}
	else
    {
		if( !version_compare(PHP_VERSION,"5.2","<") ) {
			$lanbilling->ErrorHandler("async_handler.php", "There're avaliable [json_encode / json_decode] functions for your version. [PHP " . PHP_VERSION . "]", __LINE__);
		}
		require_once("includes/JSON.php");
		$json = new Services_JSON();
		$data = $json->encode($arr);
	}
	return $data;
}
