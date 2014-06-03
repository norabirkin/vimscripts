<?php
/**
 * Billing systems statistics
 *
 * Repository information:
 * $Date: 2009-11-27 07:57:58 $
 * $Revision: 1.1.2.22 $f
 */

// There is background query
if(isset($_POST['async_call']))
{
	if(isset($_POST['getmodules'])) {
		getModules($lanbilling);
	}

	if(isset($_POST['getugroups'])) {
		getUserGroups($lanbilling);
	}

	if(isset($_POST['gettraff'])) {
		getTraffData($lanbilling);
	}

	if(isset($_POST['gettime'])) {
		getTimeData($lanbilling);
	}

	if(isset($_POST['getsessions'])) {
		getSessions($lanbilling);
	}

	if(isset($_POST['getserv'])) {
		getServData($lanbilling);
	}

	if(isset($_POST['stopsession'])) {
		stopSessions($lanbilling);
	}
}
// There is standart query
else
{
	$tpl = new HTML_Template_IT(TPLS_PATH);
	$tpl->loadTemplatefile("statistics.tpl", true, true);
	$tpl->touchBlock('__global__');

	if($lanbilling->Option("zkh_configuration") == 1) {
		$tpl->touchBlock("ifZkhConfiguration");
	}

	if(isset($_POST['shortview']) && is_array($_POST['shortview']) && !empty($_POST['shortview'])) {
		foreach($_POST['shortview'] as $key => $value)
		{
			if($key == 'name' || $key == 'id') {
				continue;
			}
			$tpl->setCurrentBlock('ShortViewAttr');
			$tpl->setVariable("SHORTANAME", $key);
			$tpl->setVariable("SHORTAVALUE", $value);
			$tpl->parseCurrentBlock();
		}
	}
	
	$tpl->setCurrentBlock("StatConf");	
	$tpl->setVariable("IPSTAT", $_SESSION['auth']['access']['ipstat']);
	$tpl->setVariable("TIMESTAT", $_SESSION['auth']['access']['timestat']);
	$tpl->setVariable("USBOXSTAT", $_SESSION['auth']['access']['usboxstat']);
	$tpl->parseCurrentBlock();
	
	$localize->compile($tpl->get(), true);
}


/**
 * Get modules list
 * @param	object, billing class
 */
function getModules( &$lanbilling )
{
	$_tmp = array();
	if( false != ($result = $lanbilling->get("getAgentsExt")) ) {
		if(!is_array($result)) {
			$result = array($result);
		}

		array_walk($result, create_function('$item, $key, $_tmp', '
			$_tmp[0][] = array(
				"id" => $item->agent->id,
				"name" => $item->agent->descr,
				"type" => $item->agent->type
			);
		'), array( &$_tmp ));
	}

	if(sizeof($_tmp) > 0) {
		echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
	}
	else echo '({ "results": "" })';
} // end getModules()


/**
 * Get users groups
 * @param	object, billing class
 */
function getUserGroups( &$lanbilling )
{
	$_tmp = array();

	if( false != ($result = $lanbilling->get("getUserGroups", array("flt" => array()))) )
	{
		if(!is_array($result)) {
			$result = array($result);
		}

		array_walk($result, create_function('$item, $key, $_tmp', '$_tmp[0][] = array("id" => $item->usergroup->groupid, "name" => $item->usergroup->name, "descr" => $item->usergroup->description);'), array( &$_tmp ));
	}

	if(sizeof($_tmp) > 0) {
		echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
	}
	else echo '({ "results": "" })';
} // end getUserGroups()


/**
 * Get traffic data
 * Avaliable filter
 * agentid then set adds = concat(adds, ' and v.id = ', agentid ); end if;
 * username <> '' then set adds = concat(adds, ' and a.name like "%', username, '%"'); end if;
 * vglogin <> '' then set adds = concat(adds, ' and v.login like "%', vglogin, '%"'); end if;
 * agrmnum <> '' then set adds = concat(adds, ' and ag.number like "%', username, '%"'); end if;
 * vgid then set adds = concat(adds, ' and v.vg_id = ', vgid ); end if;
 * userid then set adds = concat(adds, ' and a.uid = ', userid ); end if;
 * agrmid then set adds = concat(adds, ' and ag.agrm_id = ', agrmid ); end if;
 * ip then set adds = concat(adds, ' and st.ip = ', srcip ); end if;
 * dstip then set adds = concat(adds, ' and st.remote = ', dstip ); end if;
 * port then set adds = concat(adds, ' and st.remport = ', port ); end if;
 * proto then set adds = concat(adds, ' and st.protnum = ', proto ); end if;
 * ani
 *
 * repdetail = 1 group by hours and vgid
 * repdetail = 2 group by days and vg_id
 * else group only vgid
 * @param	object, billing class
 */
function getTraffData( &$lanbilling )
{
	$dtfrom = $lanbilling->formatDate($_POST['datefrom'] . ' ' . sprintf("%02d", $_POST['fromhour']) . ':' . sprintf("%02d", $_POST['fromminute']) . ':00', 'YmdHis');
	$dtto = $lanbilling->formatDate($_POST['datetill'] . ' ' . sprintf("%02d", $_POST['tillhour']) . ':' . sprintf("%02d", $_POST['tillminute']) . ':00', 'YmdHis');

	// If user group filter not defined
	if($_POST['groups'] == ''){
		$_POST['groups'] = -1;
	}

	$_filter = array(
		"agentid" => (integer)$_POST['module'],
		"dtfrom" => $dtfrom,
		"dtto" => $dtto,
		"repdetail" => (integer)$_POST['groupitem'],
		"vgid" => (integer)$_POST['vgid'],
		"showdefault" => 1,
		"defaultonly" => 0, 
		"ugroups" => (integer)$_POST['groups'],

		// Set dynamic filter fields to default
		"agrmnum" => '',
		"name" => '',
		"vglogin" => '',
		"ip" => '',

		"pgnum" => ((integer)$_POST['downtype'] == 0) ? $lanbilling->linesAsPageNum((((integer)$_POST['limit'] <= 0) ? 100 : $_POST['limit']), (integer)$_POST['start'] + 1) : 0,
		"pgsize" => ((integer)$_POST['downtype'] == 0) ? (((integer)$_POST['limit'] <= 0) ? 100 : $_POST['limit']) : 0
	);

	if((integer)$_POST['groups'] == -1){
		unset($_filter['ugroups']);
	}

	if((integer)$_POST['vgid'] > 0 || (integer)$_POST['groups'] > -1) {
		$_filter['showdefault'] = 0;
	}
	else {
		if((integer)$_POST['showdef'] == 1) {
			$_filter['defaultonly'] = 1;
		}
	}

	switch(getModuleId((integer)$_POST['module'], $lanbilling))
	{
		case 6: $_filter["repnum"] = 7; break;
		default: $_filter["repnum"] = 5; break;
	}

	// Search filter
	if((integer)$_POST['vgid'] == 0)
	{
		switch((integer)$_POST['searchtype'])
		{
			case 1: $_filter['agrmnum'] = $_POST['searchfield']; break;
			case 0: $_filter['name'] = $_POST['searchfield']; break;
			case 4: $_filter['ip'] = $_POST['searchfield']; break;
			case 5: $_filter['ani'] = $_POST['searchfield']; break;

			case 3:
			default:
				$_filter['vglogin'] = $_POST['searchfield'];
		}

		switch((integer)$_POST['searchtype'])
		{
				case 0:
				case 1:
				case 3:
					if(!empty($_POST['searchfield'])){
						$_filter['showdefault'] = 0;
					}
		}
	}

	$_order = array(
		"name" => $_POST['sort'],
		"ascdesc" => !isset($_POST['dir']) ? 0 : (($_POST['dir'] == "ASC") ? 0 : 1)
	);

	$_tmp = array();
	$lb = $lanbilling->cloneMain(array('query_timeout' => 580));

	if( false != ($result = $lb->get("getStat", array("flt" => $_filter, "ord" => $_order), true, true)) )
	{
		if(!is_array($result->data)) {
			$result->data = array($result->data);
		}

		$_func = create_function('$item', '
			$_proto = array(
				0 => "IP",
				1 => "ICMP",
				2 => "IGMP",
				6 => "TCP",
				17 => "UDP",
				27 => "RDP",
				41 => "IPv6",
				47 => "GRE",
				58 => "IPv6-ICMP",
				94 => "IPIP",
				97 => "ETHERIP",
				98 => "ENCAP",
				115 => "L2TP",
				136 => "UDPLite"
			);

			if(isset($_proto[$item["dst_proto"]])) {
				$item["dst_proto"] = $_proto[$item["dst_proto"]];
			}

			return $item;
		');

		$_tmp = $lanbilling->dataCombine($result->names->val, $result->data, $_func);
		
		if(isset($_POST['download'])) {
			if(!empty($_POST['clm'])) {
				$clms = explode(';', $_POST['clm']);
			}
			else $clms = array();
			
			compileData($lanbilling, $_tmp, $clms);

			if(!empty($_POST['clmnames'])) {
				array_unshift($_tmp, prepareCSVFileHeader($lanbilling, $_POST['clmnames']));
			}
		}
	}

	if(isset($_POST['download'])) {
		if(sizeof($_tmp) > 0) {
			$lanbilling->Download('', 'traffic.csv', implode("\r\n", $_tmp));
		}
	}
	else {
		if(sizeof($_tmp) > 0) {
			if((integer)$result->total==0)
				echo '({ "total": 0, "results": [] })';
			else
				echo '({"total": ' . (integer)$result->total . ', "results": ' . JEncode($_tmp, $lanbilling) . '})';
		}
		else echo '({ "total": 0, "results": "" })';
	}

	// Clear memory
	unset($_tmp, $_filter);
} // end getTraffData()


/**
 * Get time data
 * Avaliable filter:
 * agentid then set adds = concat(adds, ' and v.id = ', agentid ); end if;
 * username <> '' then set adds = concat(adds, ' and a.name like "%', username, '%"'); end if;
 * vglogin <> '' then set adds = concat(adds, ' and v.login like "%', vglogin, '%"'); end if;
 * agrmnum <> '' then set adds = concat(adds, ' and ag.number like "%', username, '%"'); end if;
 * vgid then set adds = concat(adds, ' and v.vg_id = ', vgid ); end if;
 * durfrom
 * durto;
 * amountfrom;
 * amountto;
 */
function getTimeData( &$lanbilling )
{
	$dtfrom = $lanbilling->formatDate($_POST['datefrom'] . ' ' . sprintf("%02d", $_POST['fromhour']) . ':' . sprintf("%02d", $_POST['fromminute']) . ':00', 'YmdHis');
	$dtto = $lanbilling->formatDate($_POST['datetill'] . ' ' . sprintf("%02d", $_POST['tillhour']) . ':' . sprintf("%02d", $_POST['tillminute']) . ':00', 'YmdHis');

	// If user group filter not defined
	if($_POST['groups'] == ''){
		$_POST['groups'] = -1;
	}

	// Fix for the ext groupitem to convert 0 data to 3 and back
	if((integer)$_POST['groupitem'] == 0) {
		$_POST['groupitem'] = 3;
	}
	elseif((integer)$_POST['groupitem'] == 3) {
		$_POST['groupitem'] = 0;
	}


	$_filter = array(
		"repnum" => 9,
		"agentid" => (integer)$_POST['module'],
		"dtfrom" => $dtfrom,
		"dtto" => $dtto,
		"repdetail" => (integer)$_POST['groupitem'],
		"vgid" => (integer)$_POST['vgid'],
		"amountfrom" => (float)$_POST['amountfrom'],
		"numfrom" => $_POST['numfrom'],
		"numto" => $_POST['numto'],
		"durfrom" => (integer)$_POST['durfrom'],
		"durto" => (integer)$_POST['durto'],
		"direction" => 0,
		"showdefault" => 1,
		"defaultonly" => 0,
		"operid" => !isset($_POST['operid']) ? -1 : (integer)$_POST['operid'],
		"ugroups" => (integer)$_POST['groups'],
		"pgnum" => ((integer)$_POST['downtype'] == 0) ? $lanbilling->linesAsPageNum((((integer)$_POST['limit'] <= 0) ? 100 : $_POST['limit']), (integer)$_POST['start'] + 1) : 0,
		"pgsize" => ((integer)$_POST['downtype'] == 0) ? (((integer)$_POST['limit'] <= 0) ? 100 : $_POST['limit']) : 0,
		"cdate" => $_POST['c_date']
	);

	if((integer)$_POST['groups'] == -1){
		unset($_filter['ugroups']);
	}
	
	if($lanbilling->boolean($_POST['additional']) == true) {
		$_filter['additional'] = 1;
	}

	if($lanbilling->boolean($_POST['cin']) == true && $lanbilling->boolean($_POST['cout']) == false) {
		$_filter['direction'] = 1;
	}
	elseif($lanbilling->boolean($_POST['cin']) == false && $lanbilling->boolean($_POST['cout']) == true) {
		$_filter['direction'] = 2;
	}

	if((integer)$_POST['vgid'] > 0 || (integer)$_POST['groups'] > -1) {
		$_filter['showdefault'] = 0;
	}
	else {
		if((integer)$_POST['showdef'] == 1) {
			$_filter['defaultonly'] = 1;
		}
	}

	// Search filter
	if((integer)$_POST['vgid'] == 0)
	{
		switch((integer)$_POST['searchtype'])
		{
			case 1:
				$_filter['agrmnum'] = $_POST['searchfield'];
				$_filter['username'] = '';
				$_filter['vglogin'] = '';
			break;

			case 0:
				$_filter['agrmnum'] = '';
				$_filter['name'] = $_POST['searchfield'];
				$_filter['vglogin'] = '';
			break;

			default:
				$_filter['agrmnum'] = '';
				$_filter['username'] = '';
				$_filter['vglogin'] = $_POST['searchfield'];
		}

		switch((integer)$_POST['searchtype'])
		{
				case 0:
				case 1:
				case 3:
					if(!empty($_POST['searchfield'])){
						$_filter['showdefault'] = 0;
					}
		}
	}

	$_order = array(
		"name" => $_POST['sort'],
		"ascdesc" => !isset($_POST['dir']) ? 0 : (($_POST['dir'] == "ASC") ? 0 : 1)
	);

	$_tmp = array();
	$lb = $lanbilling->cloneMain(array('query_timeout' => 580));

	if( false != ($result = $lb->get("getStat", array("flt" => $_filter, "ord" => $_order),true,true)) )
	{
		if(!is_array($result->data)) {
			$result->data = array($result->data);
		}
		$_tmp = $lanbilling->dataCombine($result->names->val, $result->data);
		
		if((integer)$_filter["vgid"] == 0) {
			foreach($_tmp as $key => $item){
				$_tmp[$key]["amount"] = $item["amount_in"] + $item["amount_out"];
			}
		}
		else {
			foreach($_tmp as $key => $item){
				if((integer)$item["direction"] == 0) {
					$_tmp[$key]["amount"] = $item["amount_in"];
				}
				else {
					$_tmp[$key]["amount"] = $item["amount_out"];
				}
			}
		}
	
	
		if(isset($_POST['download'])) {			
			if(!empty($_POST['clm'])) {
				$clms = explode(';', $_POST['clm']);
				
				// Условие заблокировано по ТТ @37727
				//if((integer)$_filter["vgid"] > 0 || (integer)$_filter["defaultonly"] > 0) {
					$_func = create_function('$a, $b', '
						$t = array_intersect_key($a, $b);
						
						foreach($b as $k=>$v) {
							if($k == "duration_in") { 
								$t["duration_in"] = Duration($a["duration_out"]); 
							}							
							if($k == "duration_round_in") { 
								$t["duration_round_in"] = Duration($a["duration_round_out"]); 
							}							
						}					
						return $t; '
					);
				//}
			}
			else {
				$clms = array();
				$_func = false;
			}

			compileData($lanbilling, $_tmp, $clms, $_func);

			if(!empty($_POST['clmnames'])) {
				array_unshift($_tmp, prepareCSVFileHeader($lanbilling, $_POST['clmnames']));
			}
		}
		else {
			foreach($_tmp as $key => $item){
				if($item["c_date"] == '0000-00-00') {
					$_tmp[$key]["c_date"] = "";
				}
			}
		}
	}

	if(isset($_POST['download'])) {
		// Hardcode 2. Check the field is empty
		foreach($_tmp as $k => $v) {
			$t = explode(';', $v);
			if($t[0]=='' && $t[1]=='' && $t[2]=='') unset($_tmp[$k]);
		}
		if(sizeof($_tmp) > 0) {
			$lanbilling->Download('', 'phonecallsdata.csv', implode("\r\n", $_tmp));
		}
	}
	else {
		if(sizeof($_tmp) > 0) {
			if((integer)$result->total==0)
				echo '({ "total": 0, "results": [] })';
			else
				echo '({"total": ' . (integer)$result->total . ', "results": ' . JEncode($_tmp, $lanbilling) . '})';
		}
		else echo '({ "total": 0, "results": "" })';
	}

	// Clear memory
	unset($_tmp, $_filter);
} // end getTimeData()


/**
 * Get services data
 * Avaliable filter
 * agentid then set adds = concat(adds, ' and v.id = ', agentid ); end if;
 * username <> '' then set adds = concat(adds, ' and a.name like "%', username, '%"'); end if;
 * vglogin <> '' then set adds = concat(adds, ' and v.login like "%', vglogin, '%"'); end if;
 * agrmnum <> '' then set adds = concat(adds, ' and ag.number like "%', username, '%"'); end if;
 * vgid then set adds = concat(adds, ' and v.vg_id = ', vgid ); end if;
 * userid then set adds = concat(adds, ' and a.uid = ', userid ); end if;
 * agrmid then set adds = concat(adds, ' and ag.agrm_id = ', agrmid ); end if;
 * amountfrom - skip empty amount
 *
 * repdetail = 1 group by days
 * repdetail = 2 group by tar_id, cat_id, curr_id
 * repdetail = 3 group by vg_id
 * else as is
 * @param	object, billing class
 */
function getServData( &$lanbilling )
{
	$dtfrom = $lanbilling->formatDate($_POST['datefrom'] . ' ' . sprintf("%02d", $_POST['fromhour']) . ':' . sprintf("%02d", $_POST['fromminute']) . ':00', 'YmdHis');
	$dtto = $lanbilling->formatDate($_POST['datetill'] . ' ' . sprintf("%02d", $_POST['tillhour']) . ':' . sprintf("%02d", $_POST['tillminute']) . ':00', 'YmdHis');
	
	// If user group filter not defined
	if($_POST['groups'] == ''){
		$_POST['groups'] = -1;
	}

	$_filter = array(
		"repnum" => 6,
		"agentid" => (integer)$_POST['module'],
		"dtfrom" => $dtfrom,
		"dtto" => $dtto,
		"repdetail" => 0,
		"vgid" => (integer)$_POST['vgid'],
		"agrmid" => (integer)$_POST['vgid'] == 0 ? (integer)$_POST['agrmid'] : 0, 
		"ugroups" => (integer)$_POST['groups'],
		"amountfrom" => (integer)$_POST['emptyamount'],
		"pgnum" => ((integer)$_POST['downtype'] == 0) ? $lanbilling->linesAsPageNum((((integer)$_POST['limit'] <= 0) ? 100 : $_POST['limit']), (integer)$_POST['start'] + 1) : 0,
		"pgsize" => ((integer)$_POST['downtype'] == 0) ? (((integer)$_POST['limit'] <= 0) ? 100 : $_POST['limit']) : 0
	);

	switch((integer)$_POST['groupitem'])
	{
		case 2: $_filter["repdetail"] = 1; break;
		case 0: $_filter["repdetail"] = 3; break;
		case 1: $_filter["repdetail"] = 0; break;
        case 3:
        	if((integer)$_POST['vgid'] > 0){
        		$_filter["repdetail"] = 0;
        	}
        	else {
        		$_filter["repdetail"] = 2;
        	}
        break;
	}

	if((integer)$_POST['groups'] == -1){
		unset($_filter['ugroups']);
	}

	if((integer)$_POST['vgid'] > 0 || (integer)$_POST['groups'] > -1) {
		$_filter['showdefault'] = 0;
	}

	// Search filter
	if((integer)$_POST['vgid'] == 0)
	{
		switch((integer)$_POST['searchtype'])
		{
			case 1: $_filter['agrmnum'] = $_POST['searchfield'];
				$_filter['username'] = '';
				$_filter['vglogin'] = '';
			break;

			case 0: $_filter['agrmnum'] = '';
				$_filter['name'] = $_POST['searchfield'];
				$_filter['vglogin'] = '';
			break;

			default:
				$_filter['agrmnum'] = '';
				$_filter['username'] = '';
				$_filter['vglogin'] = $_POST['searchfield'];
		}
	}

	//$_order = array("name" => 'amount', "ascdesc" => 1);
	$_order = array(
		"name" => $_POST['sort'],
		"ascdesc" => !isset($_POST['dir']) ? 0 : (($_POST['dir'] == "ASC") ? 0 : 1)
	);

	$_tmp = array();
	$lb = $lanbilling->cloneMain(array('query_timeout' => 380));

	if( false != ($result = $lb->get("getStat", array("flt" => $_filter, "ord" => $_order),true,true)) )
	{
		if(!is_array($result->data)) {
			$result->data = array($result->data);
		}

		$_tmp = $lanbilling->dataCombine($result->names->val, $result->data);

		if(isset($_POST['download'])) {
			if(!empty($_POST['clm'])) {
				$clms = explode(';', $_POST['clm']);
			}
			else $clms = array();

			compileData($lanbilling, $_tmp, $clms);

			if(!empty($_POST['clmnames'])) {
				array_unshift($_tmp, prepareCSVFileHeader($lanbilling, $_POST['clmnames']));
			}
		}
	}

	if(isset($_POST['download'])) {
		if(sizeof($_tmp) > 0) {
			$lanbilling->Download('', 'providedservices.csv', implode("\r\n", $_tmp));
		}
	}
	else {
		if(sizeof($_tmp) > 0) {
			if((integer)$result->total==0)
				echo '({ "total": 0, "results": [] })';
			else
				echo '({"total": ' . (integer)$result->total . ', "results": ' . JEncode($_tmp, $lanbilling) . '})';
		}
		else echo '({ "results": "" })';
	}

	// Clear memory
	unset($_tmp, $_filter);
} // end getServData()


/**
 * Get RADUIS sessions
 * @param	object, billing class
 */
function getSessions( &$lanbilling )
{
	$_filter = array(
		"repnum" => 8,
		"agentid" => (integer)$_POST['getsessions']
	);

	if((integer)$_POST['limit'] > 0) {
		$_filter['pgnum'] = $lanbilling->linesAsPageNum($_POST['limit'], (integer)$_POST['start'] + 1);
		$_filter['pgsize'] = (integer)$_POST['limit'];
	}

	/**
	 * Filteres
	 */
	if (isset($_POST['search_type']) && !empty($_POST['search'])){
		switch ($_POST['search_type']){
			case 'number': $_filter['agrmnum'] = trim($_POST['search']); break;
			case 'login': $_filter['vglogin'] = trim($_POST['search']); break;
			case 'assignedip': $_filter['ip'] = trim($_POST['search']); break;
			case 'sessionid': $_filter['name'] = trim($_POST['search']); break;
            case 'devname': $_filter['fullsearch'] = trim($_POST['search']); break;
		}
	}

	$_tmp = array();

	if (FALSE != ($result = $lanbilling->get("getStat", array("flt" => $_filter, "ord" => $_order, "md5" => $_md5), true, true))){
		if(!is_array($result->data)) { $result->data = array($result->data); }
		$_tmp = $lanbilling->dataCombine($result->names->val, $result->data);
		if(sizeof($_tmp) > 0) {
			if((integer)$result->total==0)
				echo '({ "total": 0, "results": [] })';
			else
				echo '({ "total": ' . (integer)$result->total . ', "results": ' . JEncode($_tmp, $lanbilling) . '})'; 
		} else {
			echo '({ "total": 0, "results": "" })';
		}
	} else {
		echo '({ "total": 0, "results": "" })';
	}

	// Clear memory
	unset($_tmp, $_filter);
} // end getSessions


/**
 * Get module type by module id
 * @param	integer, module id
 * @param	object, billing class
 */
function getModuleId( $id, &$lanbilling )
{
	if( false != ($result = $lanbilling->get("getAgentsExt")) )
	{
		if(!is_array($result)) {
			$result = array($result);
		}

		foreach($result as $item) {
			if($item->agent->id == $id) {
				return $item->agent->type;
			}
		}
	}

	return 0;
} // end getModuleId()


/**
 * Stop RADIUS sessions
 * @param	object, billing class
 */
function stopSessions( &$lanbilling )
{
	if(!empty($_POST['stopsession']))
	{
		foreach($_POST['stopsession'] as $item) {
			$lanbilling->get("stopSessionsRadius", array("id" => (integer)$_POST['module'], "sessionid" => $item), true);
		}
	}
	echo '({"success": true})';
} // end stopSessions()


/**
 * Cut and prepare array data to send as CSV
 * @param	object, billing class
 * @param	array, data
 * @param	array, fields to use as keys
 * @param	function, use this function instead of array key intersection
 */
function compileData( &$lanbilling, &$data, $keys = array(), $callback = false )
{
	if(!empty($keys)) {
		if(!in_array('curr_id', $keys)) {
			array_push($keys, 'curr_id');
		}
		$keys = array_flip($keys);
	}
	else $keys = false;

	// Get character set from options to export data
	if(false == ($out_encoding = $lanbilling->Option('export_character'))) {
		$out_encoding = $lanbilling->encodingName('UTF8');
	}
	else {
		$out_encoding = $lanbilling->encodingName($out_encoding);
	}

	// Sums array
	$_sums = array();

	foreach($data as $i => $item)
	{
		$line = array();

		if($keys != false) {
			if($callback != false) {
				$line = $callback($item, $keys);
			}
			else $line = array_intersect_key($item, $keys);
			$_tmp_line = array();
		}
		else $line = $item;

		foreach($line as $key => $val) {
			if(is_string($val)) {
				$str_encoding = mb_detect_encoding($val, $lanbilling->encodingName('UTF8, CP1251, KOI8R, ASCII'), true);
				if($str_encoding != $out_encoding) {
					$val = iconv($str_encoding, $out_encoding, $val);
				}

				// Правильный экспорт кавычек в эксель
				$val = str_replace('"', '\"', $lanbilling->stripMagicQuotes($val));
				$val=str_replace("\"", "\"\"", $val); // fix - quotes inside fields
				
				//$val = str_replace('"', '""', $lanbilling->stripMagicQuotes($val)); // excel 2007
			}

			if(!isset($_sums[$line['curr_id']])) {
				$_sums[$line['curr_id']] = array();
			}

			if($key == 'amount' || $key == 'amount_in' || $key == 'amount_out') {
				if(!isset($_sums[$line['curr_id']][$key])) {
					$_sums[$line['curr_id']][$key] = 0;
				}
				$_sums[$line['curr_id']][$key] += (float)$val;
				$val = number_format((float)$val, 2, ",", " ");
			}

			if($key == 'volume' || $key == 'volume_in' || $key == 'volume_out') {
				if(!isset($_sums[$line['curr_id']][$key])) {
					$_sums[$line['curr_id']][$key] = 0;
				}
				$_sums[$line['curr_id']][$key] += (float)$val;
				$val = number_format((float)$val, 3, ",", " ");
			}

			if(false !== strpos($key, 'cnt')) {
				if(!isset($_sums[$line['curr_id']][$key])) {
					$_sums[$line['curr_id']][$key] = 0;
				}
				$_sums[$line['curr_id']][$key] += (integer)$val;
			}

			if(false !== strpos($key, 'duration') && is_numeric($val)) {
				if(!isset($_sums[$line['curr_id']][$key])) {
					$_sums[$line['curr_id']][$key] = 0;
				}
				$_sums[$line['curr_id']][$key] += $val;
				$val = Duration($val);
			}

			if($key == 'curr_symbol' && !isset($_sums[$line['curr_id']][$key])) {
				$_sums[$line['curr_id']][$key] = $val;
			}

			if($key != 'curr_id') {
				if($keys != false) {
					$_tmp_line[$keys[$key]] = sprintf('"%s"', $val);
				}
				else {
					$line[$key] = sprintf('"%s"', $val);
				}
			}
		}

		if($keys != false) {
			ksort($_tmp_line);
			$line = $_tmp_line;
		}

		$data[$i] = implode(';', $line);
	}

	if($keys != false) {
		// Columns keys should be sum
		$sumcol = array(
			'amount', 'amount_in', 'amount_out',
			'volume', 'volume_in', 'volume_out',
			'duration', 'duration_in', 'duration_out', 'duration_round', 'duration_round_in', 'duration_round_out',
			'cnt_in', 'cnt_out',
			'curr_symbol'
		);

		for($i = 0, $off = 2; $i < $off; $i++) {
			$_tmp_line = array();

			$data[] = implode(';', array_fill(0, sizeof($keys), ''));
		}

		foreach($_sums as $line) {
			$_tmp_line = array();

			foreach($keys as $key => $item) {
				if(in_array($key, $sumcol) && isset($line[$key])) {
					if($key == 'amount' || $key == 'amount_in' || $key == 'amount_out') {
						$_tmp_line[] = sprintf('"%s"', number_format((float)$line[$key], 2, ",", " "));
					}
					else if($key == 'volume' || $key == 'volume_in' || $key == 'volume_out') {
						$_tmp_line[] = sprintf('"%s"', number_format((float)$line[$key], 3, ",", " "));
					}
					else if(false !== strpos($key, 'cnt') || $key == 'curr_symbol') {
						$_tmp_line[] = sprintf('"%s"', $line[$key]);
					}
					else if(false !== strpos($key, 'duration') && is_numeric($line[$key])) {
						$_tmp_line[] = sprintf('"%s"', Duration($line[$key]));
					}
					else {
						$_tmp_line[] = '';
					}
				}
				else {
					$_tmp_line[] = '';
				}
			}

			if(!empty($_tmp_line)) {
				$data[] = implode(';', $_tmp_line);
			}
		}
	}
} // end compileData()


/**
 * Compile header line for the download file
 * @param	object, billing class
 * @param	string, header line
 */
function prepareCSVFileHeader( &$lanbilling, $line ) {
	$line = explode(';', $line);

	// Get character set from options to export data
	if(false == ($out_encoding = $lanbilling->Option('export_character'))) {
		$out_encoding = $lanbilling->encodingName('UTF8');
	}
	else {
		$out_encoding = $lanbilling->encodingName($out_encoding);
	}

	foreach($line as $key => $val) {
		if(empty($val)){
			$val = '';
		}
		else {
			$str_encoding = mb_detect_encoding($val, $lanbilling->encodingName('UTF8, CP1251, KOI8R, ASCII'), true);
			if($str_encoding != $out_encoding) {
				$val = iconv($str_encoding, $out_encoding, $val);
			}
		}

		$val = str_replace('"', '\"', $lanbilling->stripMagicQuotes($val));
		$line[$key] = sprintf('"%s"', $val);
	}

	return implode(';', $line);
} // end prepareCSVFileHeader


/**
 * Convert integer time in seconds to human notation
 * @param	integer
 */
function Duration( $time )
{
	if((integer)$time == 0) {
		return '00:00:00';
	}

	$h = ($time - ($time % 3600)) / 3600;
	$time = $time - ($h * 3600);
	$m = ($time - ($time % 60)) / 60;
	$s = $time - $m * 60;

	return sprintf('%02d:%02d:%02d', $h, $m, $s);
} // end Duration()
?>
