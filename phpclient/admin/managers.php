<?php
/**
 * Managers access control form
 *
 * Repository information:
 * $Date: 2009-11-27 12:06:58 $
 * $Revision: 1.9.2.11 $
 */

// There is background query
if(isset($_POST['async_call']))
{
	if(isset($_POST['getRights'])) {
		getRights($lanbilling);
	}

	if(isset($_POST['privileges'])) {
		getManPrivileges($lanbilling, $localize);
	}

	if(isset($_POST['getman'])) {
		getManager($lanbilling);
	}
	
	if(isset($_POST['getcurrentman'])) {
		getCurrentManager($lanbilling);
	}

	if(isset($_POST['getmanagersgroups'])) {
		getManagersGroups($lanbilling);
	}

	if(isset($_POST['saveman'])) {
		saveManager($lanbilling, $localize);
	}

	if(isset($_POST['getfreegroups'])) {
		getFreeGroups($lanbilling);
	}

	if(isset($_POST['getrogroups'])) {
		getROGroups($lanbilling);
	}

	if(isset($_POST['getrwgroups'])) {
		getRWGroups($lanbilling);
	}

	if(isset($_POST['getfreetariffs'])) {
		getFreeTariffs($lanbilling, $localize);
	}

	if(isset($_POST['getrotariffs'])) {
		getROTariffs($lanbilling, $localize);
	}

	if(isset($_POST['getrwtariffs'])) {
		getRWTariffs($lanbilling, $localize);
	}

	if(isset($_POST['getmanagers'])) {
		getManagers($lanbilling);
	}
	
	if(isset($_POST['getpaymanagers'])) {
		getPayManagers($lanbilling);
	}

	if(isset($_POST['delmanager'])) {
		delManager($lanbilling, $localize);
	}

	if(isset($_POST['gettarperm'])) {
		getTarPermisions($lanbilling, $localize);
	}

	if(isset($_POST['savetarpermid'])) {
		saveTarPermissions($lanbilling, $localize);
	}
}
// There is standart query
else
{
	$tpl = new HTML_Template_IT(TPLS_PATH);
	$tpl->loadTemplatefile("managers.tpl", true, true);
	$tpl->touchBlock('__global__');
	$localize->compile($tpl->get(), true);
}


function getManagersGroups( &$lanbilling , $full = false){
    if( false != ( $groups = $lanbilling->get('getManagers',array('flt'=>array('istemplate' => 1, "archive" => 0))) ) ) {
        if(!is_array($groups)) { $groups = array($groups); }
        $grarray = array();
        foreach ($groups as $k=>$v){
            if ($full){
                $grarray[] = $v;
            } else {
                $grarray[$v->personid] = (!empty($v->descr)) ? $v->descr : $v->fio;
            }
        }
    } else {
        $grarray = array();
    }

	if ($_POST['encode'] == 1){
		if(sizeof($groups) > 0) {
			echo '({"results": ' . JEncode($groups, $lanbilling) . '})';
		}
		else {
			echo "({ results: '' })";
		}
	} else return $grarray;
}


/**
 * Get manager full list
 * @param	object, billing class
 */
function getManagers( &$lanbilling )
{
	$_tmp = array();

    if ($_POST['getmanagers'] > 0) {
        $param = array( 'flt' => array('parentid' => $_POST['getmanagers']) );
    } else
        $param = array( 'flt' => array('parentid' => 0) );

	if( false != ( $managers = $lanbilling->get('getManagers', $param) ) )
	{
		if ( !is_array($managers) ) {
			$managers = array($managers);
		}

		foreach($managers as $key => $item) {			
			
			$_tmp[] = array(
				"personid" => $item->personid,
				"name" => $item->fio,
				"login" => $item->login,
				"descr" => $item->descr,
				"istemplate" => $item->istemplate,
				"parenttemplate" => $item->parenttemplate
			);
		}
	}


    if ($_POST['getmanagers'] <= 0){
        $_man = array();
        $manGroups = getManagersGroups($lanbilling, true);
		if(!is_array($manGroups)) { $manGroups = array($manGroups); }
		foreach($manGroups as $key => $item) {
			$_man[] = array(
                "personid" => $item->personid,
                "name" => $item->fio,
                "login" => $item->login,
                "descr" => $item->descr,
                "istemplate" => $item->istemplate,
                "parenttemplate" => $item->parenttemplate
			);
		}
        $_tmp = array_merge($_man,$_tmp);
    }

	if(sizeof($_tmp) > 0) {
		echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
	}
	else {
		echo "({ results: '' })";
	}
} // end getManagers()

function getPayManagers( &$lanbilling )
{
	$_tmp = array();
	
	if( false != ($result = $lanbilling->get("getManager", array("id" => $lanbilling->manager))) )
		{
			$_tmp[] = array( 
				"personid" => $result->manager->personid,
				"name" => $result->manager->fio,
				"login" => $result->manager->login,
				"descr" => $result->manager->descr,
				"istemplate" => $result->manager->istemplate,
				"parenttemplate" => $result->manager->parenttemplate
			);
		}
    
    if( false != ($paymentman = $lanbilling->get("getManagers", array( 'flt' => array('payed' => 1)))) )
    {	
		if(!is_array($paymentman)) { $paymentman = array($paymentman); }
		$_man = array();
		foreach($paymentman as $key => $item) {		
			$_man[] = array(
	            "personid" => $item->personid,
	            "name" => $item->fio,
	            "login" => $item->login,
	            "descr" => $item->descr,
	            "istemplate" => $item->istemplate,
	            "parenttemplate" => $item->parenttemplate
			);
		}
	    $_tmp = array_merge($_man,$_tmp);
    }
	
	if(sizeof($_tmp) > 0) {
		echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
	}
	else {
		echo "({ results: '' })";
	}
} // end getAllManagers()


/**
 * Get manager privileges
 * @param	object, billing class
 */
function getManPrivileges( &$lanbilling, &$localize )
{
	// Permision groups
	$struct = array(
		array('group' => 0, 'data' => 'agents',     'text' => '<%@ Agents %>'),
		array('group' => 0, 'data' => 'users',      'text' => '<%@ Users %>'),
		array('group' => 0, 'data' => 'accounts',   'text' => '<%@ Accounts %>'),
		array('group' => 0, 'data' => 'usergroups', 'text' => '<%@ Users groups %>'),
		array('group' => 0, 'data' => 'agrmgroups', 'text' => '<%@ Agreements groups %>'),
		array('group' => 0, 'data' => 'unions',     'text' => '<%@ Unions %>'),
		array('group' => 0, 'data' => 'operators',  'text' => '<%@ Operators %>'),
		array('group' => 0, 'data' => 'cards',      'text' => '<%@ Pre-paid cards %>'),
		array('group' => 0, 'data' => 'managers',   'text' => '<%@ Managers %>'),
        array('group' => 0, 'data' => 'postmans',   'text' => '<%@ Postmans %>'),
        array('group' => 0, 'data' => 'bso',        'text' => '<%@ Strict reporting forms %>'),
		array('group' => 0, 'data' => 'registry',   'text' => '<%@ Registry %>'),
		array('group' => 0, 'data' => 'invdevices', 'text' => '<%@ Add %> <%@ device %>'),
		array('group' => 0, 'data' => 'invdevices', 'text' => '<%@ Edit %> <%@ devices %>'),
		array('group' => 0, 'data' => 'currency',   'text' => '<%@ Currency %> <%@ and %> <%@ rate %>'),
		array('group' => 0, 'data' => 'kladr',   'text' => '<%@ Addresses %>'),
		
		
		// Properties
		array('group' => 1, 'data' => 'tarifs',          'text' => '<%@ Tarifs %>'),
		array('group' => 1, 'data' => 'saledictionary',  'text' => '<%@ Classifier services %>'),
		array('group' => 1, 'data' => 'catalog',         'text' => '<%@ Catalogues %>'),
        array('group' => 1, 'data' => 'packages',        'text' => '<%@ Services packages %>'),
		array('group' => 1, 'data' => 'cashonhand',      'text' => '<%@ Payments %>'),
		array('group' => 1, 'data' => 'cardsets',        'text' => '<%@ Cards groups %>'),
		array('group' => 1, 'data' => 'radattr',         'text' => 'RADIUS-<%@ attributes %>'),
		array('group' => 1, 'data' => 'calendar',        'text' => '<%@ Calendar  %>'),
		array('group' => 1, 'data' => 'services',        'text' => '<%@ Services %>'),

		// Actions
		array('group' => 2, 'data' => 'cards',          'text' => '<%@ Generate %> <%@ cards %>'),
		array('group' => 2, 'data' => 'orders',         'text' => '<%@ Generate %> <%@ invoices %>'),
		array('group' => 2, 'data' => 'userspreorders', 'text' => '<%@ Generate %> <%@ advanced payments %>'),
		array('group' => 2, 'data' => 'reports',        'text' => '<%@ Users reports %>'),
		array('group' => 2, 'data' => 'recount',        'text' => '<%@ Re-count %>'),

		// Reports
		array('group' => 3, 'data' => 'ipstat',    'text' => '<%@ Traffic statistics %>'),
		array('group' => 3, 'data' => 'timestat',  'text' => '<%@ Time statistics %>'),
		array('group' => 3, 'data' => 'usboxstat', 'text' => '<%@ Provided services %>'),
		array('group' => 3, 'data' => 'logs',      'text' => '<%@ Events log %>'),
		array('group' => 3, 'data' => 'authlogs',  'text' => '<%@ Authorization log %>'),
		array('group' => 3, 'data' => 'paydocs',   'text' => '<%@ Documents of charges %>'),

		// Options
		array('group' => 4, 'data' => 'optionscommon',    'text' => '<%@ Common %> <%@ settings %>'),
		array('group' => 4, 'data' => 'optionsrequisite', 'text' => '<%@ Operator details %>'),
		array('group' => 4, 'data' => 'optionsdocuments', 'text' => '<%@ Documents settings %>'),
		array('group' => 4, 'data' => 'optionshosts',     'text' => '<%@ Trusted hosts %>'),
		array('group' => 4, 'data' => 'optionsfunctions', 'text' => '<%@ Service functions %>'),

		// HelpDesk
		array('group' => 5, 'data' => 'applications', 'text' => '<%@ Applications %>'),
		array('group' => 5, 'data' => 'helpdesk', 'text' => 'HelpDesk'),
		array('group' => 5, 'data' => 'hdsettings', 'text' => '<%@ Settings %> HelpDesk'),
		array('group' => 5, 'data' => 'broadcast', 'text' => '<%@ Messages %>')
	);

	$groups = array(
		array('text' => '<%@ Objects %>', 'draggable' => false, 'expanded' => true, 'group' => true, 'children' => array()),
		array('text' => '<%@ Properties %>', 'draggable' => false, 'expanded' => true, 'group' => true, 'children' => array()),
		array('text' => '<%@ Actions %>', 'draggable' => false, 'expanded' => true, 'group' => true, 'children' => array()),
		array('text' => '<%@ Reports %>', 'draggable' => false, 'expanded' => true, 'group' => true, 'children' => array()),
		array('text' => '<%@ Options %>', 'draggable' => false, 'expanded' => true, 'group' => true, 'children' => array()),
		array('text' => 'HelpDesk', 'draggable' => false, 'expanded' => true, 'group' => true, 'children' => array())
	);



	if((integer)$_POST['man'] == -1 && $_POST['parenttemplate'] > 0){
        $_POST['man'] = $_POST['parenttemplate'];
    }

    if((integer)$_POST['man'] >= 0)
	{
		if( false != ($result = $lanbilling->get("getManager", array("id" => (integer)$_POST['man']))) ) {
			$_priv = (array)$result->manager;

			foreach($struct as $key => $item)
			{
				if(isset($_priv[$item['data']]) && (integer)$_priv[$item['data']] != (integer)$_POST['privileges']) {
					continue;
				}

				$_tmp = array(
					'grpchild' => $item['group'],
					'data' => $item['data'],
					'iconCls' => 'ext-privileges',
					'text' => $localize->compile($item['text'], false),
					'leaf' => true
				);

				$groups[$item['group']]['children'][] = $_tmp;
			}
		}
	}
	else {
		if((integer)$_POST['privileges'] == 0)
		{
			foreach($struct as $key => $item)
			{
				$_tmp = array(
					'grpchild' => $item['group'],
					'data' => $item['data'],
					'iconCls' => 'ext-privileges',
					'text' => $localize->compile($item['text'], false),
					'leaf' => true
				);

				$groups[$item['group']]['children'][] = $_tmp;
			}
		}
	}

	foreach($groups as $key => $item) {
		$groups[$key]['grpnum'] = $key;
		$groups[$key]['text'] = $localize->compile($item['text'], false);
	}

	$groups = array_values($groups);
	if(sizeof($groups) > 0) {
		echo '(' . JEncode($groups, $lanbilling) . ')';
	}
	else echo "({ })";
} // end getManPrivileges()


/**
 * Get from full available users groups free to asign
 * @param	object, billing class
 */
function getFreeGroups( &$lanbilling )
{
	$_tmp = array();

	if( false != ($groups = $lanbilling->get("getUserGroups", array("flt" => array()))) )
	{
		if(!is_array($groups)) {
			$groups = array($groups);
		}

		$_chmod = array();

		if((integer)$_POST['getfreegroups'] == -1 && $_POST['parenttemplate'] > 0){
			$_POST['getfreegroups'] = $_POST['parenttemplate'];
		}

		if((integer)$_POST['getfreegroups'] >= 0)
		{
			if( false != ($man = $lanbilling->get("getManager", array("id" => (integer)$_POST['getfreegroups']))) )
			{
				if(!is_array($man->usergroups)) {
					$man->usergroups = array($man->usergroups);
				}


				foreach($man->usergroups as $item) {
					if($item->fwrite == 1 || $item->fread == 1) {
						$_chmod[] = $item->usergroup->groupid;
					}
				}
			}
		}

		foreach($groups as $item) {
			if(!in_array($item->usergroup->groupid, $_chmod)) {
				$_tmp[] = array(
					'data' => $item->usergroup->groupid,
					'text' => $item->usergroup->name,
					'count' => $item->usercnt,
					'iconCls' => 'ext-ugroup',
					'leaf' => true);
			}
		}
	}

	if(sizeof($_tmp) > 0)
		echo '(' . JEncode($_tmp, $lanbilling) . ')';
	else echo "({ })";

	// Clear memory
	unset($_chmod, $_tmp);
} // end getFreeGroups()


/**
 * Get assinged users groups as read only
 * @param	object, billing class
 */
function getROGroups( &$lanbilling )
{
	$_tmp = array();

	if((integer)$_POST['getrogroups'] == -1 && $_POST['parenttemplate'] > 0){
		$_POST['getrogroups'] = $_POST['parenttemplate'];
	}

	if((integer)$_POST['getrogroups'] >=0 )
	{
		if( false != ($man = $lanbilling->get("getManager", array("id" => (integer)$_POST['getrogroups']))) )
		{
			if(!is_array($man->usergroups)) {
				$man->usergroups = array($man->usergroups);
			}

			foreach($man->usergroups as $item) {
				if($item->fread != 1 || $item->fwrite == 1) {
					continue;
				}

				$_tmp[] = array(
					'data' => $item->usergroup->groupid,
					'text' => $item->usergroup->name,
					'count' => $item->usercnt,
					'iconCls' => 'ext-ugroup',
					'leaf' => true);
			}
		}
	}

	if(sizeof($_tmp) > 0)
		echo '(' . JEncode($_tmp, $lanbilling) . ')';
	else echo "({ })";
} // end getROGroups()


/**
 * Get assinged users groups as read and write
 * @param	object, billing class
 */
function getRWGroups( &$lanbilling )
{
	$_tmp = array();

	if((integer)$_POST['getrwgroups'] == -1 && $_POST['parenttemplate'] > 0){
		$_POST['getrwgroups'] = $_POST['parenttemplate'];
	}

	if((integer)$_POST['getrwgroups'] >= 0)
	{
		if( false != ($man = $lanbilling->get("getManager", array("id" => (integer)$_POST['getrwgroups']))) )
		{
			if(!is_array($man->usergroups)) {
				$man->usergroups = array($man->usergroups);
			}

			foreach($man->usergroups as $item) {
				if($item->fwrite != 1) {
					continue;
				}

				$_tmp[] = array(
					'data' => $item->usergroup->groupid,
					'text' => $item->usergroup->name,
					'count' => $item->usercnt,
					'iconCls' => 'ext-ugroup',
					'leaf' => true);
			}
		}
	}

	if(sizeof($_tmp) > 0)
		echo '(' . JEncode($_tmp, $lanbilling) . ')';
	else echo "({ })";
} // end getRWGroups()


/**
 * Get from full available tariffs free to asign
 * @param	object, billing class
 * @param	object, localize class
 */
function getFreeTariffs( &$lanbilling, &$localize )
{
	$_tmp = getTarifGroupStruct($localize);

	if( false != ($tariffs = $lanbilling->get("getTarifsExt", array("archive" => 0, "unavail" => -1, "common" => -1))) )
	{
		if(!is_array($tariffs)) {
			$tariffs = array($tariffs);
		}

		$_chmod = array();

		if((integer)$_POST['getfreetariffs'] == -1 && $_POST['parenttemplate'] > 0){
			$_POST['getfreetariffs'] = $_POST['parenttemplate'];
		}

		if((integer)$_POST['getfreetariffs'] >= 0)
		{
			if( false != ($man = $lanbilling->get("getManager", array("id" => (integer)$_POST['getfreetariffs']))) )
			{
				if(!is_array($man->mantarifs)) {
					$man->mantarifs = array($man->mantarifs);
				}

				foreach($man->mantarifs as $item) {
					if($item->fwrite == 1 || $item->fread == 1) {
						$_chmod[] = $item->tarid;
					}
				}
			}
		}

		foreach($tariffs as $item) {
			if($item->tarif->archive == 1) continue;
			if(!in_array($item->tarif->tarid, $_chmod)) {
				$_tmp[$item->tarif->type]['children'][] = array(
					'grpchild' => $item->tarif->type,
					'data' => $item->tarif->tarid,
					'text' => $item->tarif->descr,
					'iconCls' => 'ext-tariff',
					'leaf' => true);
			}
		}
	}

	$_tmp = array_values($_tmp);

	if(sizeof($_tmp) > 0) {
		echo '(' . JEncode($_tmp, $lanbilling) . ')';
	}
	else {
		echo "({ })";
	}

	// Clear memory
	unset($_chmod, $_tmp);
} // end getFreeTariffs()


/**
 * Get assigned users groups as read only
 * @param	object, billing class
 * @param	object, localize class
 */
function getROTariffs( &$lanbilling, &$localize )
{
	$_tmp = getTarifGroupStruct($localize);

	if((integer)$_POST['getrotariffs'] == -1 && $_POST['parenttemplate'] > 0){
		$_POST['getrotariffs'] = $_POST['parenttemplate'];
	}

	if((integer)$_POST['getrotariffs'] >=0 )
	{
		if( false != ($man = $lanbilling->get("getManager", array("id" => (integer)$_POST['getrotariffs']))) )
		{
			if(!is_array($man->mantarifs)) {
				$man->mantarifs = array($man->mantarifs);
			}

			foreach($man->mantarifs as $item) {
				if($item->fread != 1 || $item->fwrite == 1) {
					continue;
				}

				$_tmp[$item->tartype]['children'][] = array(
					'grpchild' => $item->tartype,
					'data' => $item->tarid,
					'text' => $item->tardescr,
					'iconCls' => 'ext-tariff',
					'leaf' => true);
			}
		}
	}

	$_tmp = array_values($_tmp);

	if(sizeof($_tmp) > 0) {
		echo '(' . JEncode($_tmp, $lanbilling) . ')';
	}
	else {
		echo "({ })";
	}
} // end getROTariffs()


/**
 * Get assigned users groups as read only
 * @param	object, billing class
 * @param	object, localize class
 */
function getRWTariffs( &$lanbilling, &$localize )
{
	$_tmp = getTarifGroupStruct($localize);;

	if((integer)$_POST['getrwtariffs'] == -1 && $_POST['parenttemplate'] > 0){
		$_POST['getrwtariffs'] = $_POST['parenttemplate'];
	}

	if((integer)$_POST['getrwtariffs'] >=0 )
	{
		if( false != ($man = $lanbilling->get("getManager", array("id" => (integer)$_POST['getrwtariffs']))) )
		{
			if(!is_array($man->mantarifs)) {
				$man->mantarifs = array($man->mantarifs);
			}

			foreach($man->mantarifs as $item) {
				if($item->fwrite != 1) {
					continue;
				}

				$_tmp[$item->tartype]['children'][] = array(
					'grpchild' => $item->tartype,
					'data' => $item->tarid,
					'text' => $item->tardescr,
					'iconCls' => 'ext-tariff',
					'leaf' => true);
			}
		}
	}

	$_tmp = array_values($_tmp);

	if(sizeof($_tmp) > 0) {
		echo '(' . JEncode($_tmp, $lanbilling) . ')';
	}
	else {
		echo "({ })";
	}
} // end getRWTariffs()


/**
 * Returns array of tariff types group
 *
 */
function getTarifGroupStruct( &$localize )
{
	$_tmp = array();

	for($i = 0; $i < 6; $i++) {
		$_tmp[$i] = array(
			'text' => '',
			'grpnum' => $i,
			'draggable' => false,
			'expanded' => true,
			'group' => true,
			'children' => array()
		);

		switch($i) {
			case 0:
				$_tmp[$i]['text'] = $localize->compile('<%@ Leased line %>', false);
			break;

			case 1:
				$_tmp[$i]['text'] = $localize->compile('Dialup <%@ by size %>', false);
			break;

			case 2:
				$_tmp[$i]['text'] = $localize->compile('Dialup <%@ by time %>', false);
			break;

			case 3:
				$_tmp[$i]['text'] = $localize->compile('<%@ Telephony %>', false);
			break;

			case 4:
				$_tmp[$i]['text'] = $localize->compile('IP <%@ Telephony %>', false);
			break;

			case 5:
				$_tmp[$i]['text'] = $localize->compile('<%@ Service %>', false);
			break;
		}
	}

	return $_tmp;
} // end getTarifGroupStruct()


/**
 * Get main fields values for the selected manager
 * @param	object, billing class
 */
function getManager( &$lanbilling )
{
    $getMan = ($_POST['parenttemplate']) ? (integer)$_POST['parenttemplate'] : (integer)$_POST['getman'];

    $_tmp = array(
		'saveman'            => (integer)$getMan,
		'fio'                => '',
		'login'              => '',
		'pass'               => '',
		'email'              => '',
		'descr'              => '',
		'office'             => '',
		'openpass'           => 0,
		'payments'           => 0,
		'externalid'         => '',
		'cashregisterfolder' => '',
        'useadvance'         => 0,
		'istemplate'         => 0,
		'parenttemplate'     => 0
	);

	if((integer)$getMan >= 0)
	{
		if( false != ($result = $lanbilling->get("getManager", array("id" => (integer)$getMan))) )
		{
			$_tmp = array( 
				'saveman' => (integer)$_POST['getman'],
				'fio' => ($_POST['parenttemplate']) ? '' : $result->manager->fio,
				'login' => ($_POST['parenttemplate']) ? '' : $result->manager->login,
				'pass' => ($_POST['parenttemplate']) ? '' : ((!empty($result->manager->pass) > 0) ? substr($result->manager->pass, 1, 5) : ''),
				'email' => $result->manager->email,
				'descr' => $result->manager->descr,
				'office' => $result->manager->office,
				'openpass' => ((integer)$result->manager->openpass == 0) ? false : true,
				'payments' => ($result->manager->payments) ? true : false,
				'externalid' => $result->manager->externalid,
				'cashregisterfolder' => $result->manager->cashregisterfolder,
				'classid' => $result->manager->payclassid,
                'useadvance' => $result->manager->useadvance,
				'istemplate' => $result->manager->istemplate,
				'parenttemplate' => ( ($_POST['parenttemplate']) ? $getMan : $result->manager->parenttemplate )
			);
		}
		else echo '({ success: false, data: ' . JEncode($_tmp, $lanbilling) . '})';
	}

	echo '({ success: true, data: ' . JEncode($_tmp, $lanbilling) . '})';
} // end getManager()

function getCurrentManager( &$lanbilling )
{
	$_response = array(
        "results" => $lanbilling->manager,
        "success" => true,
        "error" => null
	);	
	
	echo "(" . JEncode($_response, $lanbilling) . ")";
} // end getManager()


/**
 *
 * @param	object, billing class
 */
function saveManager( &$lanbilling,  &$localize )
{
	$struct = array(
		"personid"   => (integer)$_POST['saveman'],
		"packages"   => 0,
		"accounts"   => 0,
		"agents"     => 0,
		"broadcast"  => 0,
		"calendar"   => 0,
		"cards"      => 0,
		"cardsets"   => 0,
		"cashonhand" => 0,
		"catalog"    => 0,
		"currency"   => 0,
		"helpdesk"   => 0,
		"ipstat"     => 0,
		"logs"       => 0,
		"authlogs" 	 => 0,
		"paydocs" 	 => 0,
        "bso"        => 0,
		"registry"   => 0,
		"managers" 	 => 0,
        "postmans" 	 => 0,
		"operators"  => 0,
		"optionscommon"    => 0,
		"optionsrequisite" => 0,
		"optionsdocuments" => 0,
		"optionshosts" 	   => 0,
		"optionsfunctions" => 0,
		"orders" 		 => 0,
		"radattr" 		 => 0,
		"recount" 		 => 0,
		"reports" 		 => 0,
		"services" 		 => 0,
		"tarifs" 		 => 0,
		"installments" 		 => 0,
		"timestat" 		 => 0,
		"unions" 		 => 0,
		"usboxstat" 	 => 0,
		"users" 		 => 0,
		"usersdocallow"  => 0,
		"userspreorders" => 0,
		"usergroups" 	 => 0,
		"agrmgroups" 	 => 0,
		"hdsettings" 	 => 0,
		"invdevices" 	 => 0,
		"saledictionary" => 0,
		"kladr" => 0,
		"openpass" 		 => isset($_POST['openpass']) ? 1 : 0,
		"login" 		 => $_POST['login'],
		"fio" 			 => $_POST['fio'],
		"email" 		 => $_POST['email'],
		"descr" 		 => $_POST['descr'],
		"office"         => $_POST['office'],
		"payments"       => isset($_POST['payments']) ? 1 : 0,
		"applications"   => 0,
		'externalid'     => '', 
		'cashregisterfolder' => $_POST['cashregisterfolder'],
        'istemplate'     => ((isset($_POST['istpl']) && $_POST['istpl']) ? 1 : 0),
        //'parenttemplate' => ($_POST['parenttemplate']) ? (integer)$_POST['parenttemplate'] : 0,
        'payclassid' => (integer)$_POST['classid']
	);
	
	if(isset($_POST['externalid']) && $_POST['externalid']!=''){ 
		$struct['externalid'] = (integer)$_POST['externalid'];
	}
	
	if(isset($_POST['parenttemplate']) && (integer)$_POST['parenttemplate']>0){ 
		$struct['parenttemplate'] = (integer)$_POST['parenttemplate'];
	}

    /**
     * Разрешить внешней ПС проводить авансовые платежи
     */
    $struct['useadvance'] = (isset($_POST['useadvance'])) ? 1 : 0;



	if((integer)$_POST['passchanged']) {
		$struct['changepass'] = 1;
		$struct['pass'] = $_POST['pass'];
	}

	if(isset($_POST['privro']) && !empty($_POST['privro'])) {
		foreach($_POST['privro'] as $item)
		{
			if(isset($struct[$item])) {
				$struct[$item] = 1;
			}
		}
	}

	if(isset($_POST['privrw']) && !empty($_POST['privrw'])) {
		foreach($_POST['privrw'] as $item)
		{
			if(isset($struct[$item])) {
				$struct[$item] = 2;
			}
		}
	}
	
	
	$groups_struct = array();

	if(isset($_POST['grpro']) && !empty($_POST['grpro'])) {
		foreach($_POST['grpro'] as $item)
		{
			$groups_struct[] = array(
				'usergroup' => array('groupid' => $item),
				'fread' => 1,
				'fwrite' => 0
			);
		}
	}

	if(isset($_POST['grprw']) && !empty($_POST['grprw'])) {
		foreach($_POST['grprw'] as $item)
		{
			$groups_struct[] = array(
				'usergroup' => array('groupid' => $item),
				'fread' => 1,
				'fwrite' => 1
			);
		}
	}

	$tar_struct = array();

	if(isset($_POST['trfro']) && !empty($_POST['trfro'])) {
		foreach($_POST['trfro'] as $item)
		{
			$tar_struct[] = array(
				'tarid' => (integer)$item,
				'fread' => 1,
				'fwrite' => 0
			);
		}
	}

	if(isset($_POST['trfrw']) && !empty($_POST['trfrw'])) {
		foreach($_POST['trfrw'] as $item)
		{
			$tar_struct[] = array(
				'tarid' => (integer)$item,
				'fread' => 0,
				'fwrite' => 1
			);
		}
	}
	if( false != $lanbilling->save("insupdManager",
									array(  "manager" => $struct,
											"usergroups" => $groups_struct,
											"mantarifs" => $tar_struct),
									(((integer)$_POST['saveman'] < 0) ? true : false),
									array("getManager", "getManagers")) )
	{
		echo '({ success: true, man: ' . $lanbilling->saveReturns->ret . ' })';
	}
	else {
        $msg = $lanbilling->soapLastError()->detail;
        if(strstr($msg, 'Duplicate entry')){
        	$msg = 'Duplicate login for manager';
        }
        echo '({ success: false, errors: { reason: "' . $localize->get($msg) . '" } })';
    }

} // end saveManager()


/**
 *
 *
 */
function delManager( &$lanbilling, &$localize)
{
	if((integer)$_POST['delmanager'] <= 0) {
		echo '({ success: false, errors: { reason: "' . $localize->get('Manager ID not found or trying to delete Administrator.') . '" } })';
		return false;
	}

	if( false == $lanbilling->delete("delManager", array("id" => $_POST['delmanager']), array("getManagers")) ) {
		echo '({ success: false, errors: { reason: "' . $localize->get('Unable to remove manager / manager group. Probably group is not empty.') . ' '. $localize->get('See logs for details') . '" } })';
	}
	else echo '({ success: true })';
} // end delManager()


/**
 * Get the list of the permitted managers for the selected tariff
 * @param	object, billing class
 * @param	object, localize, class
 */
function getTarPermisions( &$lanbilling, &$localize )
{
	if((integer)$_POST['gettarperm'] == 0) {
		echo '({ "results" : null })';
		return;
	}

	$_tmp = array();

	if(false != ($result = $lanbilling->get("getTarPermissions", array("tarid" => $_POST['gettarperm'])))) {
		if(!is_array($result)) {
			$result = array($result);
		}

		array_walk($result, create_function('$item, $key, $_tmp','
			if($item->personid > 0) {
				$_tmp[0][] = array(
					"personid" => $item->personid,
					"tarid" => $_POST["gettarpermision"],
					"fread" => $item->fread,
					"fwrite" => $item->fwrite,
					"login" => $item->login,
					"fio" => $item->fio,
					"descr" => $item->descr
				);
			};
		'), array( &$_tmp ));
	}

	echo '({ "results" : ' . JEncode($_tmp, $lanbilling) . ' })';
} // end getTarPermisions()


/**
 * Save passed managers list with permissions for the selected tariff
 * @param	object, billing class
 * @param	object, localize class
 */
function saveTarPermissions( &$lanbilling, &$localize )
{
	if((integer)$_POST['savetarpermid'] <= 0) {
		echo "({ success: false, reason: '" . $localize->get('Undefined') . " " . $localize->get('tariff') . "' })";
		return false;
	}

	$_withError = array();

	if(is_array($_POST['savetarperm']) && sizeof($_POST['savetarperm']) > 0){
		$struct = array(
			"tarid" => $_POST['savetarpermid'],
			"perm" => array()
		);

		foreach($_POST['savetarperm'] as $key => $item) {
			$struct['perm'][] = array(
				"personid" => $key,
				"fread" => ($lanbilling->boolean($item['fread']) == true) ? 1 : 0,
				"fwrite" => ($lanbilling->boolean($item['fwrite']) == true) ? 1 : 0
			);
		}

		if(false == $lanbilling->save("updTarPermissions", $struct, false, array("getTarPersmissions")) ) {
			$error = $lanbilling->soapLastError();
			$_withError[] = array(
				$key,
				$item['fio'],
				$localize->get($error->detail)
			);
		}
	}

	if(empty($_withError)) {
		echo "({ success: true, reason: '" . $localize->get('Request done successfully') . "' })";
	}
	else {
		if(sizeof($_withError) == 1) {
			echo "({ success: false, reason: " . JEncode($_withError[0][2], $lanbilling) . "})";
		}
		else {
			echo "({ success: false, reason: " . JEncode($_withError, $lanbilling) . "})";
		}
	}
} // end saveTarPermissions()



function getRights(&$lanbilling){
	echo "({ success: true, result: " . JEncode($_SESSION['auth']['access'], $lanbilling) . " })";
	return;
}
