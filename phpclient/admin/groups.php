<?php
/**
 * Create / edit account groups
 * Modify allowed tarifs for the selected group
 * Set tarif duty
 * 
 * Repository information:
 * $Date: 2009-11-03 15:18:54 $
 * $Revision: 1.1.2.14 $
 */

// There is background query
if(isset($_POST['async_call']))
{
	if(isset($_POST['getunions'])) {
		getUnionsList($lanbilling);
	}
	
	if(isset($_POST['getrasp'])) {
		getRasp($lanbilling);
	}
	
	if(isset($_POST['saverasp'])) {
		saveRasp($lanbilling);
	}
	
	if(isset($_POST['savegrp'])) {
		saveGroup($lanbilling);
	}
	
	if(isset($_POST['gettarstaff'])){
		getUnionTarStaff($lanbilling);
	}
	
	if(isset($_POST['getfreetarstaff'])) {
		getFreeTarsStaff($lanbilling);
	}
	
	if(isset($_POST['savetarstaff'])) {
		saveTarStaff($lanbilling);
	}
	
	if(isset($_POST['getvgroups']) || isset($_POST['getgrpstaff'])) {
		getVgroups($lanbilling);
	}
	
	if(isset($_POST['savegrpstaff'])) {
		updateGroupStaff($lanbilling);
	}
	
	if(isset($_POST['delgrp'])) {
		deleteGroup($lanbilling);
	}
}
else
{
	$tpl = new HTML_Template_IT(TPLS_PATH);
	$tpl->loadTemplatefile("groups.tpl", true, true);
	$tpl->touchBlock("__global__");
	$localize->compile($tpl->get(), true);
}


/**
 * Build and send unions on client request
 * @param	object, billing class
 */
function getUnionsList( &$lanbilling )
{
	if((integer)$_POST['getunions'] == 0){
		if( false == ($result = $lanbilling->get("getGroups")) ) {
			$result = array();
		}
	}
	elseif((integer)$_POST['getunions'] == 1) {
		if( false == ($result = $lanbilling->get("getTarifsExt", array("archive" => 0, "unavail" => (isset($_POST['unavail']) && (integer)$_POST['unavail'] > -1) ? $_POST['unavail'] : -1, "formanager" => 1, "common" => -1))) ) {
			$result = array();
		}
		
		// Need to group module by there types
		if( false != ($modules = $lanbilling->get("getAgentsExt")) ) {
			if(!is_array($modules)) {
				$modules = array($modules);
			}
			
			$_modules = array();
			foreach($modules as $item) {
				switch((integer)$item->agent->type)
				{
					case 1: case 2: case 3: case 4: case 5: $_modules[0][] = $item->agent->id; break;
					case 6: $_modules[1][] = $item->agent->id; $_modules[2][] = $item->agent->id; break;
					case 7: case 8: case 9: case 10: case 11: $_modules[3][] = $item->agent->id; break;
					case 12: $_modules[4][] = $item->agent->id; break;
					case 13: $_modules[5][] = $item->agent->id; break;
				}
			}
		}
	}
	elseif((integer)$_POST['getunions'] == 2) {
		if( false == ($result = $lanbilling->get("getAgentsExt")) ) {
			$result = array();
		}
	}
	
	
	$_tmp = array();
	if(!empty($result))
	{
		if(!is_array($result)) {
			$result = array($result);
		}
		
		if((integer)$_POST['getunions'] == 0){
			$_modules = create_function('$items','$_tmp = array(); if(!is_array($items)){ $items = array($items); }; foreach($items as $item){ array_push($_tmp, $item->val); }; return $_tmp;');
		}
		
		array_walk($result, create_function('$item, $key, $_tmp', 'if($_tmp[1] == 0){ $_tmp[0][] = array("groupid" => $item->groupid, "vgroups" => $item->vgroups, "name" => $item->name, "descr" => $item->descr, "agents" => implode("|", $_tmp[2]($item->agents))); } elseif($_tmp[1] == 1){ $_tmp[0][] = array("groupid" => $item->tarif->tarid, "id" => $item->tarif->tarid, "name" => $item->tarif->descr, "vgroups" => $item->vgroups, "type" => $item->tarif->type, "curid" => $item->tarif->curid, "symbol" => $item->tarif->symbol, "descr" => $item->tarif->descr, "agents" => !empty($_tmp[2][$item->tarif->type]) ? implode(",", $_tmp[2][$item->tarif->type]) : ""); } elseif($_tmp[1] == 2){ $_tmp[0][] = array("groupid" => $item->agent->id, "id" => $item->agent->id, "vgroups" => (integer)$item->vgroups, "descr" => $item->agent->descr, "name" => $item->agent->descr, "agents" => $item->agent->id, "type" => $item->agent->type); }'), array( &$_tmp, (integer)$_POST['getunions'], $_modules ));
	}
	
	if(sizeof($_tmp) > 0) { 
		echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
	}
	else echo '({ "results": "" })';
} // end getUnionsList()


/**
 * Get accounts list for the DD block
 * Filter values (flt):
 * istemplate, archive, vgid, tarid, agentid, agrmid, userid, 
 * blocked - block flag number
 * groups - include vgroups only for the selected union id
 * notgroups - exclude for the selected union id
 * name, login, descr, agrmnum, code
 * phone, tardescr
 * @param	object, billing class
 */
function getVgroups( &$lanbilling )
{
	$_filter = array("istemplate" => 0);
	
	if(isset($_POST['getvgroups'])) {
		$_filter = array("notgroups" => (integer)$_POST['getvgroups']);
	}
	
	if(isset($_POST['getgrpstaff']) && (integer)$_POST['getgrpstaff'] > 0) {
		$_filter = array("groups" => $_POST['getgrpstaff']);
	}
	
	$v = (integer)$_POST['search_ex'];

	switch((integer)$_POST['searchtype'])
	{
		case 0:  $_filter[ 'name'    ]  =  $_POST['search'];               break;
		case 1:  $_filter[ 'agrmnum' ]  =  $_POST['search'];               break;
		case 2:  $_filter[ 'login'   ]  =  $_POST['search'];               break;
		case 3:  $_filter[ 'email'   ]  =  $_POST['search'];               break;
		case 4:  $_filter[ 'agrmnum' ]  =  $_POST['search'];               break;
		case 5:  $_filter[ 'agrmid'  ]  =  $_POST['search'];               break;
		case 7:  $_filter[ 'address' ]  =  $_POST['search'];               break;
		case 8:  $_filter[ 'tarid'   ]  =  ( $v ) ? $v : $_POST['search']; break;
		case 9:  $_filter[ 'blocked' ]  =  ( $v ) ? $v : $_POST['search']; break;
		case 10: $_filter[ 'agentid' ]  =  ( $v ) ? $v : $_POST['search']; break;

		default: $_POST['search'];
	}
	
	$_order = array(
		"name" => "v_login",
		"ascdesc" => !isset($_POST['dir']) ? 0 : (($_POST['dir'] == "ASC") ? 0 : 1)
	);
	switch($_POST['sort']) {
		case 'agrmnum': $_order['name'] = 'a_number'; break;
		case 'username': $_order['name'] = 'ac_name'; break;
		default : $_order['name'] = 'v_login';
	}

	$_filter['pgsize'] = 50;
	$_filter['pgnum'] = $lanbilling->linesAsPageNum(50, (integer)$_POST['start'] + 1);
	$_md5 = $lanbilling->controlSum($_filter);
	
	$_tmp = array();
	if( false != ($count = $lanbilling->get("Count", array("flt" => $_filter, "procname" => "getVgroups", "md5" => $_md5), true)) )
	{

		if( false != ($result = $lanbilling->get("getVgroups", array("flt" => $_filter, "ord" => $_order, "md5" => $_md5))) )
		{
			if(!is_array($result)) {
				$result = array($result);
			}
			
			array_walk($result, create_function('$item, $key, $_tmp', '$_tmp[0][] = array("vgid" => $item->vgid, "agrmnum" => $item->agrmnum, "vglogin" => $item->login, "tarifdescr" => $item->tarifdescr, "agentdescr" => $item->agentdescr, "username" => $item->username, "symbol" => $item->symbol);'), array( &$_tmp ));
		}
	}
	
	if(sizeof($_tmp) > 0) { 
		echo '({"total": ' . $count . ', "results": ' . JEncode($_tmp, $lanbilling) . '})';
	}
	else echo '({ "total": 0, "results": "" })';
} // end getVgroups()


/**
 * Get assigned tarifs for the selected group
 * @param	object, billing class
 */
function getUnionTarStaff( &$lanbilling )
{
	$_filter = array(
		"groupid" => ((integer)$_POST['gettarstaff'] == 0) ? (integer)$_POST['getitemid'] : 0, 
		"grouptarid" => ((integer)$_POST['gettarstaff'] == 1) ? (integer)$_POST['getitemid'] : 0, 
		"groupmoduleid" => ((integer)$_POST['gettarstaff'] == 2) ? (integer)$_POST['getitemid'] : 0, 
		"tarid" => 0);
	
	$_md5 = $lanbilling->controlSum($_filter);
	
	$_tmp = array();
	if( false != ($result = $lanbilling->get("getTarifsStaff", array("filter" => $_filter, 'md5' => $_md5))) )
	{
		if(!is_array($result)) {
			$result = array($result);
		}
		
		array_walk($result, create_function('$item, $key, $_tmp','$_tmp[0][] = array("groupid" => $item->groupid, "grouptarid" => $item->grouptarid, "groupmoduleid" => $item->groupmoduleid, "tarid" => $item->tarid, "tartype" => $item->tartype, "tarname" => $item->tarname, "tarcurid" => $item->tarcurid, "tarsymbol" => $item->tarsymbol);'), array( &$_tmp ));
	}
	
	if(sizeof($_tmp) > 0) { 
		echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
	}
	else echo '({ "results": "" })';
} // end getGroupTarStaff()


/**
 *
 * @param	object, billing class
 */
function getFreeTarsStaff( &$lanbilling )
{
	$_filter = array(
		"groupid" => ((integer)$_POST['getfreetarstaff'] == 0) ? (integer)$_POST['getitemid'] : 0, 
		"grouptarid" => ((integer)$_POST['getfreetarstaff'] == 1) ? (integer)$_POST['getitemid'] : 0, 
		"groupmoduleid" => ((integer)$_POST['getfreetarstaff'] == 2) ? (integer)$_POST['getitemid'] : 0, 
		"tarid" => 0);
	
	$_md5 = $lanbilling->controlSum($_filter);
	
	$_tarstaff = array();
	if( false != ($result = $lanbilling->get("getTarifsStaff", array("filter" => $_filter, 'md5' => $_md5))) )
	{
		if(!is_array($result)) {
			$result = array($result);
		}
		
		array_walk($result, create_function('$item, $key, $_tmp','$_tmp[0][$item->tarid] = array("tarid" => $item->tarid, "tartype" => $item->tartype, "tarcurid" => $item->tarcurid);'), array( &$_tarstaff ));
	}
	
	$_modules = array();
	if( false != ($modules = $lanbilling->get("getAgentsExt")) ) {
		if(!empty($modules))
		{
			if(!is_array($modules)) {
				$modules = array($modules);
			}
			
			$allowedTarTypes = create_function('$A', '$B = array(); switch((integer)$A){ case 1: case 2: case 3: case 4: case 5: $B = array(0); break; case 6: $B = array(1, 2); break; case 7: case 8: case 9: case 10: case 11: $B = array(3); break; case 12: $B = array(4); break; case 13: $B = array(5); break; } return $B;');
			
			array_walk($modules, create_function('$item, $key, $_tmp', 'if(in_array($item->agent->id, $_tmp[1])){ $_tmp[0] = array_merge($_tmp[0], $_tmp[2]($item->agent->type)); }'), array( &$_modules, explode('|', $_POST['modules']), $allowedTarTypes ));
			
			$_modules = array_unique($_modules);
		}
	}
	
	$_tmp = array();
	if( false != ($result = $lanbilling->get("getTarifsExt", array("archive" => 0, "unavail" => 0, "formanager" => 1, "common" => -1))) )
	{
		if(!is_array($result)) {
			$result = array($result);
		}
		
		array_walk($result, create_function('$item, $key, $_tmp','if(in_array($item->tarif->type, $_tmp[1]) && !isset($_tmp[2][$item->tarif->tarid])){ $_tmp[0][] = array("tarid" => $item->tarif->tarid, "tartype" => $item->tarif->type, "tarname" => $item->tarif->descr, "tarcurid" => $item->tarif->curid, "tarsymbol" => $item->tarif->symbol); }'), array( &$_tmp, $_modules, $_tarstaff ));
	}
	
	if(sizeof($_tmp) > 0) { 
		echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
	}
	else echo '({ "results": "" })';
} // end getFreeTarsStaff()


/**
 * Get tarifs schedulling according to the request type
 * Fiter incoming values: 
 * 		agentid - module id
 * 		taridprev - prev tarif
 * 		vgroups - union id
 * 		vgid
 *		tarid - new tarif id
 *		recordid
 * @param	object, billing class
 */
function getRasp( &$lanbilling )
{
	if((integer)$_POST['getitemid'] == 0) {
		echo "({results: ''})";
		return;
	}
	
	$_filter = array();
	switch((integer)$_POST['getrasp'])
	{
		case 0: $_filter['groups'] = (integer)$_POST['getitemid']; break;
		case 1: $_filter['taridprev'] = (integer)$_POST['getitemid']; break;
		case 2: $_filter['agentid'] = (integer)$_POST['getitemid']; break;
	}
	
	$_md5 = $lanbilling->controlSum($_filter);

	$_tmp = array();
	if( false != ($result = $lanbilling->get("getTarifsRasp", array("flt" => $_filter, "md5" => $_md5))) ) {
		
		if(!is_array($result)) {
			$result = array($result);
		}
		
		array_walk($result, create_function('$item, $key, $_tmp', '$_date = explode(" ", $item->changetime); $_tmp[0][] = array("recordid" => $item->recordid, "agentid" => $item->id, "agenttype" => $item->agenttype, "changedate" => $_date[0], "changetime" => $_date[1], "taridnew" => $item->taridnew, "tarnewname" => $item->tarnewn, "taroldcurid" => $item->taroldcurid, "taridold" => $item->taridold, "taroldname" => $item->taroldname, "taroldsymbol" => $item->taroldsymbol);'), array( &$_tmp ));
	}
	
	if(sizeof($_tmp) > 0) {
		echo '({ results: ' . JEncode($_tmp, $lanbilling) . '})';
	}
	else echo '({ results: "" })';
} // end getRasp()


/**
 * Save new or existing group
 * @param	object, lanbilling class
 */
function saveGroup( &$lanbilling )
{
	if(is_array($_POST['savegrp']) && !empty($_POST['savegrp']))
	{
		foreach($_POST['savegrp'] as $item)
		{
			$struct = array(
				"groupid" => (integer)$item['groupid'], 
				"name" => $item['name'], 
				"descr" => $item['descr'], 
			);
			
			if( false == $lanbilling->save("insupdGroup", $struct, ((integer)$struct['groupid'] > 0) ? false : true, array("getGroups")) )
			{
				echo "({ success: false, errors: { reason: 'There was error while saving group data' } })";
				return false;
			}
		}
	}
	
	echo "({ success: true })";
} // end saveGroup()


/**
 * Update union staff
 * @param	object, billing class
 */
function updateGroupStaff( &$lanbilling )
{
	if((integer)$_POST['savegrpstaff'] == 0) {
		echo "({ success: false, errors: { reason: 'Unknown Union' } })";
		return false;
	}
	
	if(isset($_POST['updgrpstaff']) && is_array($_POST['updgrpstaff']) && !empty($_POST['updgrpstaff'])) {
		foreach($_POST['updgrpstaff'] as $item)
		{
			if( false == ($result = $lanbilling->get("insGrStaff", array("groupid" => (integer)$_POST['savegrpstaff'], "vgid" => (integer)$item), true))) {
				echo "({ success: false, errors: { reason: 'There was error while saving staff data' } })";
				return false;
			}
		}
		
		$lanbilling->flushCache(array("getGroups", "getVgroups"));
	}
	
	if(isset($_POST['delgrpstaff']) && is_array($_POST['delgrpstaff']) && !empty($_POST['delgrpstaff'])) {
		foreach($_POST['delgrpstaff'] as $item)
		{
			if( false == ($result = $lanbilling->get("delGrStaff", array("groupid" => (integer)$_POST['savegrpstaff'], "vgid" => (integer)$item), true))) {
				echo "({ success: false, errors: { reason: 'There was error while saving staff data' } })";
				return false;
			}
		}
		
		$lanbilling->flushCache(array("getGroups", "getVgroups"));
	}
	
	echo "({ success: true })";
} // end updateGroupStaff()


/**
 * Save tarifs schedulling
 * @param	object, billing class
 */
function saveRasp( &$lanbilling )
{
	if(!empty($_POST['updrasp']))
	{
		foreach($_POST['updrasp'] as $row) {
			$struct = array(
				'recordid' => (integer)$row['recordid'], 
				'id' => (integer)$row['agentid'], 
				'vgid' => 0, 
				'taridold' => ((integer)$_POST['saverasp'] == 1) ? (integer)$row['setitemid'] : 0, 
				'groupid' => ((integer)$_POST['saverasp'] == 0) ? (integer)$row['setitemid'] : 0, 
				'taridnew' => (integer)$row['taridnew'], 
				'requestby' => 0, 
				'requestby' => $_SESSION['auth']['authperson'],
				'changetime' => $row['changedate'] . " " . $row['changetime'],
				"override" => (integer)$_POST['override'],
			);
			
			if(false == $lanbilling->save("insupdTarifsRasp", $struct, (((integer)$row['recordid'] == 0) ? true : false), "getTarifRasp")) {
				
				$_response = array(
		            "success" => false,
		            "error" => $lanbilling->soapLastError()->detail,
		            "override" => $lanbilling->soapLastError()->detail == "Packet will be broken" ? 1 : 0
		        );	
				echo "(" . JEncode($_response, $lanbilling) . ")";
				return false;
	        }
			
			/*if( false == $lanbilling->save("insupdTarifsRasp", $struct, (((integer)$row['recordid'] == 0) ? true : false), "getTarifsRasp")) {
				echo "({ success: false, errors: { reason: 'There was error while saving scheduling data' } })";
				return false;
			}*/
			
		}
	}
	
	if(!empty($_POST['delrasp']))
	{
		foreach($_POST['delrasp'] as $row) {
			if( false == $lanbilling->delete("delTarifsRasp", array("id" => (integer)$row['recordid']), "getTarifsRasp")) {
				echo "({ success: false, errors: { reason: 'There was error while removing scheduling data' } })";
				return false;;
			}
		}
	}
	
	echo "({ success: true })";
} // end saveRasp()


/**
 * Save the list of assigned tarifs for the duty changes
 * @param	object, billing class
 */
function saveTarStaff( &$lanbilling )
{
	$struct = array(
		"groupid" => ((integer)$_POST['savetarstaff'] == 0) ? (integer)$_POST['tarstaffgroup'] : 0, 
		"grouptarid" => ((integer)$_POST['savetarstaff'] == 1) ? (integer)$_POST['tarstaffgroup'] : 0, 
		"groupmoduleid" => ((integer)$_POST['savetarstaff'] == 2) ? (integer)$_POST['tarstaffgroup'] : 0,
		"tarname" => '',
		"tarid" => array()
	);

	if(isset($_POST['updtarstaff']) && is_array($_POST['updtarstaff']) && sizeof($_POST['updtarstaff']) > 0) {
		array_walk($_POST['updtarstaff'], create_function('$item, $key, $_tmp', '$_tmp[0][] = array("id" => $item);'), array( &$struct['tarid'] ));
	}
	
	if( false == $lanbilling->save("insTarifsStaff", $struct, false, "getTarifsStaff") ) {
		echo "({ success: false, errors: { reason: 'There was an error while saving group tarifs. Look server logs for details' } })";
	}
	else echo "({ success: true })";
} // end saveTarStaff()


/**
 * Remove Union data
 * @param	object, billing class
 */
function deleteGroup( &$lanbilling )
{
	if( false == $lanbilling->delete("delGroup", array("id" => (integer)$_POST['delgrp']), array("getGroups")) )
	{
		echo "({ success: false, errors: { reason: 'There was an error while removing group data. Look server logs for details' } })";
		return false;
	}
	
	echo "({ success: true })";
} // end deleteGroup()
