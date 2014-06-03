<?php

if (isset($_POST['async_call'])){
	//----------------------------------------------
	if(isset($_POST['getgroups'])){
		if( false == ($result = $lanbilling->get("getUserGroups", array("flt" => array()))) ) {
			echo "({ success: false, errors: { reason: 'There was an error while getting reports functions list. Look server logs for details.' } })";
		}
		else {	
			if(!is_array($result)) {
				$result = array($result);
			}
			$_tmp = array();
			foreach($result as $obj)
			{
				$_tmp[] = array(
					"groupid" => $obj->usergroup->groupid,
					"promisemax" => $obj->usergroup->promisemax,
					"promisemin" => $obj->usergroup->promisemin,
					"promiseallow" => $obj->usergroup->promiseallow,
					"promiserent" => $obj->usergroup->promiserent,
					"promisetill" => $obj->usergroup->promisetill,
					"promiselimit" => $obj->usergroup->promiselimit,				
					"promiseblockdays" => $obj->usergroup->promiseblockdays,
					"promiseondays" => $obj->usergroup->promiseondays,
					"blockamount" => $obj->usergroup->blockamount,
					"blockdurationdebtor" => $obj->usergroup->blockdurationdebtor,
					"blockdurationdenouncement" => $obj->usergroup->blockdurationdenouncement,
					"name" => $obj->usergroup->name,
					"description" => $obj->usergroup->description,
					"usercnt"=>$obj->usercnt,
					"fread"=>$obj->fread,
					"fwrite"=>$obj->fwrite
					);
			}

			if(sizeof($_tmp) > 0)
				echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
			else echo "({ results: '' })";
		}
	}
//----------------------------------------------
	if(isset($_POST['first'])){
	$pgsize=$_POST['limit'];
	$numpage=$_POST['start'];
	$pgnum=$numpage/$pgsize +1;

	//Get list of users (ugroups=groupid)
		if(isset($_POST['groupid'])) $groupid=$_POST['groupid'];
		if ($groupid==-1) return;


		$filter = array("ugroups" => $groupid,"archive"=>0);
		$filter_page = array("ugroups" => $groupid,"archive"=>0,"pgnum"=>$pgnum,"pgsize"=>$pgsize);

		if(isset($_POST['searchtpl']) && !empty($_POST['searchtpl'])) {
			foreach($_POST['searchtpl'] as $item) {
				$t = explode('.', $item['property']);
				$search['searchtempl'][] = array(
					"tplname" => '',
					"tablename" => $t[0],
					"field" => $t[1],
					"condition" => $item['condition'],
					"value" => $item['value'],
					"logic" => $item['logic']
				);
			}
			$filter = array_merge($search,$filter);
			$filter_page = array_merge($search,$filter_page);
		}

		$count = $lanbilling->get("Count", array("flt" => $filter, "procname" => "getAccounts"));
		$result_first = $lanbilling->get("getAccounts", array("flt" => $filter_page)) ;

		if(!is_array($result_first)) {
				$result_first= array($result_first);
			}

		$first = array();
		foreach($result_first as $obj){
			if ($obj->account->uid!=0){
					$first[] = array( "name" => $obj->account->name,
									 "uid"=>$obj->account->uid,
									 "groupsid"=>$group->usergroup->groupid,
									 "agrmid"=>$obj->agreements->agrmid
									);
			}
		}


		if(sizeof($first) > 0)
				echo '({"total":'.$count.',"results": ' . JEncode($first, $lanbilling) . '})';
			else echo "({ results: '' })";
		}

//----------------------------------------------
	if(isset($_POST['second'])){
	$pgsize=$_POST['limit'];
	$numpage=$_POST['start'];
	$pgnum=$numpage/$pgsize+1;

	$groupid=$_POST['groupid'];
	if ($groupid==0) return;
	//Get list of users (ugroups=0)
		$filter = array("notgroups" => $groupid,"archive"=>0);
		$filter_page = array("notgroups" => $groupid,"archive"=>0,"pgnum"=>$pgnum,"pgsize"=>$pgsize);

		if(isset($_POST['searchtpl']) && !empty($_POST['searchtpl'])) {
			foreach($_POST['searchtpl'] as $item) {
				$t = explode('.', $item['property']);
				$search['searchtempl'][] = array(
					"tplname" => '',
					"tablename" => $t[0],
					"field" => $t[1],
					"condition" => $item['condition'],
					"value" => $item['value'],
					"logic" => $item['logic']
				);
			}
			$filter = array_merge($search,$filter);
			$filter_page = array_merge($search,$filter_page);
		}
		$count = $lanbilling->get("Count", array("flt" => $filter, "procname" => "getAccounts"));
		$result_second = $lanbilling->get("getAccounts", array("flt" => $filter_page)) ;

		if(!is_array($result_second)) {
				$result_second= array($result_second);
			}
		
		$second = array(); // X015
		foreach($result_second as $obj){

					$second[] = array( "name" => $obj->account->name,
									 "uid"=>$obj->account->uid,
									 "groupsid"=>$group->usergroup->groupid
									);

		}


		if(sizeof($second) > 0)
				echo '({"total":'.$count.',"results": ' . JEncode($second, $lanbilling) . '})';
			else echo "({ results: '' })";
		}

//----------------------------------------------
if(isset($_POST['creategroup'])){
		$groupname=$_POST['groupname'];
		$description=$_POST['description'];
		$promisemax=$_POST['promisemax'];
		$promiserent=$_POST['promiserent'];
		$promisemin=$_POST['promisemin'];
		$promiselimit=$_POST['promiselimit'];
		$promiseblockdays=$_POST['promiseblockdays']; 
		$promiseondays=$_POST['promiseondays'];
		$promisetill=$_POST['promisetill'];
		$promiseallow=$_POST['promiseallow'];

		$blockdurationdenouncement=$_POST['blockdurationdenouncement'];
		$blockdurationdebtor=$_POST['blockdurationdebtor'];
		$blockamount=$_POST['blockamount'];

		$options=array("name"=>$groupname,
					   "groupid"=>0,
					   "description"=>$description,
					   "promisemax"=>$promisemax,
					   "promiserent"=>(integer)$promiserent,
					   "promiseallow"=>(integer)$promiseallow,
					   "promisemin"=>$promisemin,
					   "promiselimit"=>$promiselimit,
					   "promiseblockdays"=>$promiseblockdays,
					   "promiseondays"=>$promiseondays, 
					   "promisetill"=>$promisetill,
					   "blockamount"=>$blockamount,
					   "blockdurationdebtor"=>$blockdurationdebtor,
					   "blockdurationdenouncement"=>$blockdurationdenouncement
					);
		$lanbilling->save("insupdUsergroup",$options,1);
	 	echo $lanbilling->saveReturns->ret; 

	}
//-----------------------------------------------------------
if(isset($_POST['savegroup'])){
		$grouid=$_POST['groupid'];
		$groupname=$_POST['groupname'];
		$description=$_POST['description'];
		$promisemax=$_POST['promisemax'];
		$promiserent=$_POST['promiserent'];
		$promisemin=$_POST['promisemin'];
		$promiselimit=$_POST['promiselimit'];
		$promiseblockdays=$_POST['promiseblockdays']; 
		$promiseondays=$_POST['promiseondays'];
		$promisetill=$_POST['promisetill'];
		$promiseallow=$_POST['promiseallow'];
		$blockamount=$_POST['blockamount'];
		$blockdurationdebtor=$_POST['blockdurationdebtor'];
		$blockdurationdenouncement=$_POST['blockdurationdenouncement'];



		$options=array("name"=>$groupname,
					   "groupid"=>$grouid,
					   "description"=>$description,
					   "promisemax"=>$promisemax,
					   "promiserent"=>(integer)$promiserent,
					   "promiseallow"=>(integer)$promiseallow,
					   "promisemin"=>$promisemin,
					   "promiselimit"=>$promiselimit,
					   "promiseblockdays"=>$promiseblockdays,
					   "promiseondays"=>$promiseondays,
					   "promisetill"=>$promisetill,
					   "blockamount"=>$blockamount,
					   "blockdurationdebtor"=>$blockdurationdebtor,
					   "blockdurationdenouncement"=>$blockdurationdenouncement
					);
		$ret=$lanbilling->save("insupdUsergroup",$options,0);
	}
//-----------------------------------------------------------

	if(isset($_POST['deletegroup'])){
		$groupid=$_POST['groupid'];
		$options=array("id"=>$groupid);
		$lanbilling->delete("delUsergroup",$options);

	}
//-----------------------------------------------------------
	if(isset($_POST['adduids'])){
		$groupid=$_POST['groupid'];

		if(!empty($_POST['uids'])) {
			$uids=array();
			$uids=explode(",",$_POST['uids']);
			$tmp=array();
			foreach($uids as $obj){
				$tmp[]=array("val"=>$obj);
			}

			$options=array("groupid"=>(integer)$groupid,"uids"=>$tmp);
			$lanbilling->save("insUsergroupStaff",$options,1);

		}
	}
//-----------------------------------------------------------
	if(isset($_POST['deleteuids'])){
		$groupid=$_POST['groupid'];

		if(!empty($_POST['uids'])) {
			$uids=array();
			$uids=explode(",",$_POST['uids']);
			$tmp=array();
			foreach($uids as $obj){
				$tmp[]=array("val"=>$obj);
			}

			$options=array("groupid"=>(integer)$groupid,"uids"=>$tmp);
			$lanbilling->save("delUsergroupStaff",$options);

		}
	}
//---------------------------------------------------------------
}
else{
    $tpl = new HTML_Template_IT(TPLS_PATH);
	$tpl->loadTemplatefile("user_groups.tpl", true, true);
	$tpl->touchBlock("__global__");
	$localize->compile($tpl->get(), true);
}
?>