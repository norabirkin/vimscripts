<?php
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
$lb = $lanbilling->cloneMain(array('query_timeout' => 380));
//---------------------------------------------------------------------------------------------------------------
if(isset($_POST['getuserinfo'])){
	$agrmid=$_POST['agrmid'];
	$filter = array("agrmid" => $agrmid);
	$result = $lb->get("getAccounts", array("flt" => $filter)) ;
	if(!is_array($result->account)) {				
				$result->account = array($result->account);
			}
	$usrid=$result->account[0]->uid;	
	if( false != ($result = $lb->get("getAccount", array("id" => (integer)$usrid))) ) {
		if(!empty($result->account)) { 
			if(!is_array($result->account)) { $result->account = array($result->account); } 
		}
	}		
	$res=array_merge($result->account,(array)$result->addresses);	
	if(sizeof($result->account) > 0)
				echo '({"results": ' . JEncode($res, $lb) . '})';
			else echo "({ results: '' })";	
	return;		
}
//---------------------------------------------------------------------------------------------------------------

$dtfrom = $lb->formatDate($_POST['start_period']. " 00:00:00", 'YmdHis');
$dtto = $lb->formatDate($_POST['end_period']." 00:00:00", 'YmdHis');
$numagent=$_POST['report_filter_agent'];
$usergroup_id=$_POST['usergroup_id'];
$_order = array();
$_tmp = array();
$sum=0;
$above=0;
$rent=0;

if ($_POST['commondate']==1) { 
	$cf = array("repnum" => 10,"ugroups"=>$usergroup_id, "agentid" => $numagent, "dtfrom" => $dtfrom, "dtto" => $dtto,"showdefault"=>1);
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

	$result = $lb->get("getStat", array("flt" => $_filter, "ord" => $_order));
	if ($result){		
			if(!is_array($result->data)) {
				$result->data = array($result->data);
			}
			
			foreach($result->data as $item)			{
				$_combine = array_combine($result->names->val, $item->val);	
				$_combine['sum']=$_combine["above"]+$_combine["rent"];	
				$sum=$sum+$_combine['sum'];
				$above=$above+$_combine["above"];
				$rent=$rent+$_combine["rent"];				
			}
	echo '({ "sum": '.$sum.', "above": '.$above.',"rent": '.$rent.' })';
	return;
	}
	else {		
		echo '({ "sum": 0, "above": 0,"rent": 0 })';
		return;
	}
}

$pgsize=$_POST['limit'];
$numpage=$_POST['start'];
$pgnum=$numpage/$pgsize +1;

$kk=array("repnum" => 13,"ugroups"=>$usergroup_id,"agentid" => $numagent, "dtfrom" => $dtfrom, "dtto" => $dtto,"showdefault"=>1,"pgnum"=>$pgnum,"pgsize"=>$pgsize);



if ($_POST['filter']!='null'){
	
	$json = stripcslashes($_POST['filter']);
	$_filter_add=json_decode($json);

	$_filter_add=(array)$_filter_add;
	foreach($_filter_add['searchtempl'] as $key=>$item){
		$_filter_add['searchtempl'][$key]=(array)$item;
	}
	$_filter = array_merge($_filter_add,$kk);
}

else $_filter=$kk;


	if( false != ($count = $lb->get("getStat", array("flt" => array_merge($_filter, array("nodata" => 1)), "ord" => $_order), true)) )
	{ 
		if((integer)$count->rows > 0)
		{
			$result = $lb->get("getStat", array("flt" => $_filter, "ord" => $_order));
			
			if(!is_array($result->data)) {
				$result->data = array($result->data);
			}
			
			foreach($result->data as $item)
			{
				$_combine = array_combine($result->names->val, $item->val);	
				$_combine['sum']=$_combine["above"]+$_combine["rent"];			
				$_tmp[] = $_combine;
			}
		}
	}	
	if(sizeof($_tmp) > 0) { 
		echo '({"total": ' . (integer)$count->total . ',"summa":'.$sum.',"above":'.$above.',"rent":'.$rent.', "results": ' . JEncode($_tmp, $lb) . '})';
	}
	else echo '({ "total": 0, "results": "" })';
	
	
//--Begin of JEncode()
function JEncode( &$arr, &$lb )
{
	if(function_exists("json_encode")) {
		$data = json_encode($arr);
	}
	
	else {
		if( !version_compare(PHP_VERSION,"5.2","<") )
		{
			$lb->ErrorHandler("async_handler.php", "There're avaliable [json_encode / json_decode] functions for your version. [PHP " . PHP_VERSION . "]", __LINE__);
		}
		
		require_once("includes/JSON.php");
		$json = new Services_JSON();
		$data = $json->encode($arr);
	}
	
	return $data;
} 
//--End of JEncode()


?>





