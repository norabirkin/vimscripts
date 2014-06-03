<?php
/**
 * Used identificators for the async_call
 *
 */
 
    if (!session_is_registered("auth")) 
	{
	echo 'Not authenticated';
	exit; // ���� ��������� ������� ��� ����������� �� �������� (�� ��������)
	}
	// include_once("confparser.inc");
 
	// ������������� ����������� � �� �� ������ ���������� �� billing.conf
	// $descriptor=mysql_connect($serveraddress,$mysqluser,$mysqlpassword);
	// mysql_select_db($mysqldatabase, $descriptor);
	
 	// �� ������������ POST ������������� ���������� ��������� ������� �� ����� ������� ������ ������
 	
	// ��� async_call = 1 ������� JSON ������ �� ������� �� ������������ ������ (������ � ��������)
	if( isset($_POST['async_call']) && $_POST['async_call'] == 1 )
	{
	  $tarif_id = 0;
	  if ( isset($_POST['tarif_id'])){
	    $tarif_id = $_POST['tarif_id'];   // �������� ���������� �� Web 2.0 �������
	  }
			
	  switch($tarif_id){
	    case 0: // ���� �� ������ id ������ �� ���������� ������ ������� �������
	      echo "{failure:true}";  // Simple 1-dim JSON array to tell Ext element the request failed.
	      break;
	    default:
		get_vgid_list($tarif_id, $lanbilling, $descriptor); // �������� � echo() ��������� ������� � ����
		mysql_close($descriptor);
	      break;
	  }
	}
	elseif( isset($_POST['async_call']) && $_POST['async_call'] == 2 )
		userListRequired($lanbilling, $descriptor);
	elseif( isset($_POST['async_call']) && $_POST['async_call'] == 3 )
		vgroupsListRequired($lanbilling, $descriptor);
	elseif( isset($_POST['async_call']) && $_POST['async_call'] == 5 )
		sbssVgoupsLinked($lanbilling, $descriptor);
	elseif( isset($_POST['async_call']) && $_POST['async_call'] == 6 )
	{
		// Return template agreement's list
		mysql_unbuffered_query("SET names UTF8", $descriptor);
		$agrms = $lanbilling->OptionsAgrmList();
		
		if(sizeof($agrms) > 0)
		{
			foreach($agrms as $arr)
			{
				$str = str_replace("{","&#123;", $arr[1]);
				$str = str_replace("}","&#125;", $str);
				$tmp[] = array('name' => $arr[0], 'template' => $str);
			}
			
			$json = JEncode($tmp, $lanbilling);
			echo '({"results":' . $json . '})';
		}
		else echo '({"results":""})';
	}
	// Looking for the similar users by name
	elseif( isset($_POST['async_call']) && $_POST['async_call'] == 8 )
		findSimilarUser($lanbilling, $descriptor);
	// Show payments history
	elseif( isset($_POST['async_call']) && $_POST['async_call'] == 9 )
		showPaymentsHistory($lanbilling, $localize);
	// Id there was unknown caller
	else
	{
		$lanbilling->ErrorHandler(__FILE__, "Unkonown call for this engine", __LINE__);
		exit;
	}

/**
 *
 *
 */
function userListRequired( &$lanbilling, &$descriptor )
{
	// Set the limits to query
	if(isset($_POST["start"]) && $_POST["limit"])
	{
		if((integer) $_POST["start"] < 0) $_POST["start"] = 0;
		if((integer) $_POST["limit"] <= 0) $_POST["limit"] = 50;
	}
	
	$filter["locale"] = "utf8";
	if(isset($_POST["search"]) && $_POST["search"] != "") $filter["name"] = $_POST["search"];
	$usersList = $lanbilling->getUsersList(true, $filter, $_POST["start"], $_POTS["limit"], $descriptor);
	
	if(sizeof($usersList) > 0)
	{
		foreach($usersList as $key => $arr)
		{
			$tmp[] = array_intersect_key($usersList[$key], array("uid" => 0, "name" => 0, "agrm_num" => 0, "address" => 0, "vg_id" => 0));
		}
		
		$json = JEncode($tmp, $lanbilling);
		echo  '({"total":"' . (integer) $lanbilling->userListTotal . '","results":' . $json . '})';
	}
	else echo '({"total":"0", "results":""})';
} // end userLisrRequred()


/**
 *
 *
 */
function vgroupsListRequired( &$lanbilling, &$descriptor )
{
	// Set the limits to query
	if(isset($_POST["start"]) && $_POST["limit"])
	{
		if((integer) $_POST["start"] < 0) $_POST["start"] = 0;
		if((integer) $_POST["limit"] <= 0) $_POST["limit"] = 50;
	}
	
	$filter["archive"] = 0;
	$filter["locale"] = "utf8";
	if(isset($_POST["vgid"]) && $_POST["vgid"] != "") $filter["vgid"] = $_POST["vgid"];
	else
	{
		echo '({"total":"0", "results":""})';
		return;
	}
	$vgroupsList = $lanbilling->getVgroupsList(true, $filter, $_POST["start"], $_POTS["limit"], $descriptor);
	
	if(sizeof($vgroupsList) > 0)
	{
		foreach($vgroupsList as $key => $arr)
		{
			$tmp[] = array_intersect_key($vgroupsList[$key], array("vg_id" => 0, "login" => 0, "service_name" => 0));
		}
		
		$json = JEncode($tmp, $lanbilling);
		echo  '({"total":"' . (integer) $lanbilling->vgroupListTotal . '","results":' . $json . '})';
	}
	else echo '({"total":"0", "results":""})';
} // end vgroupsListRequired()



/**
 *
 *
 */
function sbssVgoupsLinked( &$lanbilling, &$descriptor )
{
	if(empty($_POST["vgid"]))
	{
		echo '({"total":"0", "results":""})';
		return;
	}
	
	// Prepare UTF conversation with DB
	mysql_unbuffered_query("SET names UTF8", $descriptor);
	
	include_once("helpdesk/sbss.class.php");
	$sbss = new SBSS();
	
	if((integer) $_POST["start"] < 0) $_POST["start"] = 0;
	if((integer) $_POST["limit"] <= 0) $_POST["limit"] = 50;
	$page = ceil(($_POST["start"] + $_POST["limit"])/ $_POST["limit"]);
	
	$filter = array("vgId" => $_POST['vgid'],
			"dateFormat" => "%Y/%m/%d %H:%i:%s");
	$sbss->getTickets($filter, 0, 1, $page);
	
	$tmp = array();
	if(sizeof($sbss->ticketList) > 0)
	{
		$sbss->settings->managerList[0]["name"] = iconv('cp1251', 'utf8', $sbss->settings->managerList[0]["name"]);
		foreach($sbss->ticketList as $array)
			$tmp[] = array("status" => $sbss->settings->statusList[$array["status"]]["descr"], 
					"title" => $array["name"], 
					"lasttime" => $array["last"], 
					"lastauthor" => (($array["respType"] == 0) ? $sbss->settings->managerList[$array["respId"]]["name"] : $sbss->settings->clientList[$array["respId"]]["name"]), 
					"responsible" => $sbss->settings->managerList[$array["man"]]["name"]);
		
		$json = JEncode($tmp, $lanbilling);
		echo  '({"total":"' . sizeof($charges) . '","results":' . $json . '})';
	}
	else echo '({"total":"0", "results":""})';

// 	$lanbilling->ErrorHandler("async", sizeof($array), __LINE__ );
} // end sbssVgoupsLinked()


/**
 *
 *
 */
function get_vgid_list($tarif_id, &$lanbilling, &$descriptor)
{
	// Prepare UTF conversation with DB
	mysql_unbuffered_query("SET names UTF8", $descriptor);
	
	// Get total rows for the request
	if( false == ($sql_query = mysql_query(sprintf("SELECT COUNT(*) FROM vgroups WHERE tar_id = %d AND archive = 0", $_POST["tarif_id"]))) )
	{
		$lanbilling->ErrorHandler("async_handler.php", "There was an error while counting total rows. " . mysql_error($descriptor), __LINE__);
		
		echo '({"total":"0", "results":""})';
		return false;
	}
	
	// Remember total rows
	$total = mysql_result($sql_query, 0);
	
	// Set the limits to query
	if(isset($_POST["start"]) && $_POST["limit"])
	{
		if((integer) $_POST["start"] < 0) $_POST["start"] = 0;
		if((integer) $_POST["limit"] <= 0) $_POST["limit"] = 50;
		
		$limit = sprintf("LIMIT %d, %d", $_POST["start"], $_POST["limit"]);
	}

	// Get the main list for the vgroups
	if( false == ($sql_query = mysql_query(sprintf("SELECT vgroups.vg_id AS vg_id, vgroups.login AS login, 
				vgroups.descr AS descr, vgroups.acc_ondate AS acc_ondate, accounts.name AS username,
				accounts.email AS usermail 
				FROM vgroups 
				INNER JOIN acc_list ON (vgroups.vg_id = acc_list.vg_id) 
				INNER JOIN accounts ON (accounts.uid = acc_list.uid)
				WHERE vgroups.tar_id = %d and archive = 0 ORDER BY vgroups.vg_id %s", 
				$_POST["tarif_id"], $limit), $descriptor)) )
	{
		$lanbilling->ErrorHandler("async_handler.php", "There was an error to get the main list. " . mysql_error($descriptor), __LINE__);
		
		printf('({"total":"%d", "results":""})', $total);
		return false;
	}
	
	// If total > 0 than build data array
	if(mysql_num_rows($sql_query) > 0)
	{
		while($res = mysql_fetch_array($sql_query))
		{
			$arr[] = $res;
		}
		
		$json = JEncode($arr, $lanbilling);
		echo  '({"total":"' . $total . '","results":' . $json . '})';
	} else echo '({"total":"0", "results":""})';
}


/**
 * Looking for the similar users by name
 * @param	object, billing class
 * @param	resource, mysql
 */
function findSimilarUser( $lanbilling, $descriptor)
{
	if(empty($_POST['string']))
	{
		echo '({"total":"0", "results":""})';
		$lanbilling->ErrorHandler(__FILE__, "I've got empty user name", __LINE__);
		return false;
	}
	
	// Set the limits to query
	if(isset($_POST["start"]) && $_POST["limit"])
	{
		if((integer) $_POST["start"] < 0) $_POST["start"] = 0;
		if((integer) $_POST["limit"] <= 0) $_POST["limit"] = 50;
	}
	
	$usersList = $lanbilling->getUsersList(false, array("locale" => "utf8", "name_sound" => $_POST['string']), $_POST["start"], $_POST["limit"], $descriptor);
	if(sizeof($usersList) > 0)
	{
		foreach($usersList as $key => $arr)
		{
			$tmp[] = array_intersect_key($usersList[$key], array("uid" => 0, "name" => 0, "agrm_num" => 0, "address_bill" => 0));
		}
		
		$json = JEncode($tmp, $lanbilling);
		echo  '({"total":"' . (integer) $lanbilling->userListTotal . '","results":' . $json . '})';
	}
	else echo '({"total":"0", "results":""})';
} // end findSimilarUser()


/**
 * Show payments history by query
 * @param	object, billing class
 */
function showPaymentsHistory( &$lanbilling, &$localize )
{
	if((integer)$_POST["start"] <= 0) $_POST["start"] = 0;
	if((integer)$_POST["limit"] <= 0) $_POST["limit"] = 50;
	
	if($_POST["start"] == 0)
		$_POST["start"] = ceil(50 / $_POST["limit"]);
	else $_POST["start"] = ceil($_POST["start"] / $_POST["limit"]);
	
	$struct = array("agrmid" => (integer)$_POST['agrmid'], 
			"userid" => (integer)$_POST['userid'],
			"pgsize" => (integer)$_POST['limit'],
			"pgnum" => (integer)$_POST["start"],
			"vgid" => 0, "tarid" => 0, "operid" => 0, "recordid" => 0, "agentid" => 0,
			"ugroups" => 0, "vgroups" => 0, "dtfrom" => '', "dtto" => '', "direction" => 0,
			"numfrom" => '', "numto" => '');
	
	$filter = $struct;
	$filter['flt'] = $struct;
	$filter['procname'] = "Payments";
	
	$total = $lanbilling->get("Count", $filter);
	
	if((integer)$total == 0)
	{
		echo '({"total":"0", "results":""})';
		return;
	}
	
	$result = $lanbilling->get("Payments", $filter);
	
	if(!is_array($result))
		$result = array($result);
	
	$_tmp = array();
	foreach($result as $obj)
	{
		$_date = explode(" ", $obj->pay->paydate);
		$_symbol = empty($obj->pay->currid) ? $localize->resource['c.u.'] : $obj->currsymb;
		$_tmp[] = array("paydate" => $_date[0], "status" => $obj->pay->status, "agreement" => $obj->agrm,
				"user" => $obj->uname, "symbol" => $_symbol, "manager" => $obj->mgr, 
				"amount" => number_format($obj->amountcurr, 2, ',', ' '), "ordernum" => $obj->ordernum);
	}

	if(!empty($_tmp))
		echo  '({"total":"' . $total . '","results":' . JEncode($_tmp, $lanbilling) . '})';
	else echo '({"total":"0", "results":""})';
} // end showPaymentsHistory()
?>