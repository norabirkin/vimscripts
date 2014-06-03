<?php
/**
 * View Agreements Groups panel. Create nee, edit existing
 *
 */

if(isset($_POST['async_call']))
{

	if(isset($_POST['getmanagers'])) {
		getManagersList($lanbilling, $localize);
	}
	
	if(isset($_POST['gettemplates'])) {
		getUserTemplatesList($lanbilling, $localize);
	}
	
	if(isset($_POST['genapps'])) {
		genApplicationsForConnection($lanbilling, $localize);
	}
	
	if(isset($_POST['getgeneratorstasks'])) {
		getGeneratorsTasks($lanbilling, $localize);
	}

}


// There is standart query
else
{
	$tpl = new HTML_Template_IT(TPLS_PATH);
	showAppsGenerationPanel($lanbilling, $tpl);
	$localize->compile($tpl->get(), true);
}




/**
 * Build and show agrm groups panel
 * @param	object, billing class
 * @param	object, template class
 */
function showAppsGenerationPanel( &$lanbilling, &$tpl )
{
	$tpl->loadTemplatefile("gen_connection_apps.tpl", true, true);
	$tpl->touchBlock("__global__");
	$tpl->setVariable("IFUSECERBER", (integer)$lanbilling->getLicenseFlag('usecerber'));
} // end showAgrmGroupsPanel()




/**
 * Get manager full list
 * @param	object, billing class
 */
function getManagersList( &$lanbilling, &$localize )
{
	
	$_tmp = array();
	$param = array(
		'flt' => array()
	);


	if( false != ( $managers = $lanbilling->get('getManagers', $param) ) )
	{
		if ( !is_array($managers) ) {
			$managers = array($managers);
		}

		foreach($managers as $key => $item) {
			if($item->istemplate > 0) {
				continue;
			}	
			$_tmp[] = array(
				"id" => $item->personid,
				"name" => $item->fio . ' ['. $item->login .']'
			);
		}
	}

	if(sizeof($_tmp) > 0) {
		echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
	}
	else {
		echo "({ results: '' })";
	}
} // end getManagers()



/**
 * Build users templates list
 * @param object, billing class
 * @param object $localize
*/
function getUserTemplatesList( &$lanbilling, &$localize )
{
    $_filter = array(
        "istemplate" => 1
    );
	
	$_tmp = array();
	
    if( false != ($result = $lanbilling->get("getAccounts", array("flt" => $_filter))) )
    {
        if(!is_array($result)) {
            $result = array($result);
        }

        foreach($result as $obj)
        {
			$_tmp[] = array(
				"uid" => $obj->account->uid,
				"name" => htmlentities($obj->account->name, ENT_QUOTES, 'UTF-8'),
			);
		}
	} else {
		throw new Exception ($lanbilling->soapLastError()->detail);
	}
	
	if(sizeof($_tmp) > 0) {
		echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
	}
	else {
		echo "({ results: '' })";
	}
} // getUserTemplatesList()




/**
 * Generate applications
 * @param object, billing class
 * @param object $localize
*/
function genApplicationsForConnection( &$lanbilling, &$localize )
{
	$struct = array(
		'count' => (int)$_POST['count'],
		'agrmnumtempl' => html_entity_decode($_POST['agrmnumtempl']),
		'uidtempl' => (int)$_POST['uidtempl'],
		'responsibleid' => (int)$_POST['responsibleid'],
		'appltypeid' => (int)$_POST['appltypeid'],
		'paymentmethod' => (int)$_POST['paymentmethod'],
		'operid' => (int)$_POST['operid']
	);

	if( false === ($result = $lanbilling->get("genPreActivatedAccounts", array("val" => $struct) )) )
    {
		$error_msg = $lanbilling->soapLastError()->detail;
		
		if(strstr($error_msg, 'All numbers from range')){
			$error_msg = 'All numbers from range in use';
		}
		
		echo '({ success: false, reason: "'. $error_msg .'"})';
		return;
	}

	
	echo '({ success: true, result: ' . $result . ' })';

} // genApplicationsForConnection()


/**
 * get generation statuses
 * @param object, billing class
 * @param object $localize
*/
function getGeneratorsTasks( &$lanbilling, &$localize )
{
	$filter = array(
		'name' => 'GenPreActivatedAccounts',
		'dtfrom' => date('Y-m-d', strtotime($_POST['datefrom'])) . ' 00:00:00',
		'dtto' => date('Y-m-d', strtotime($_POST['dateto'])) . ' 23:59:59'
	);
	
    if(isset($_POST['limit'])) {
        $filter['pgsize'] = ((integer)$_POST['limit'] <= 0) ? 100 : $_POST['limit'];
        $filter['pgnum'] = $lanbilling->linesAsPageNum($filter['pgsize'], (integer)$_POST['start'] + 1);
    }
	
	
	if( false === ($result = $lanbilling->get("getGeneratorsTasks", array("flt" => $filter) )) )
    {
		$error_msg = $lanbilling->soapLastError()->detail;
		echo '({ success: false, reason: "'. $error_msg .'"})';
		return;
	}
	
	
	if ( !is_array($result) ) {
		$result = array($result);
	}
	
	foreach($result as $k=>$res) {
		$result[$k]->begindate = date('d.m.Y H:i', strtotime($res->begindate));
		$result[$k]->createdate = date('d.m.Y H:i', strtotime($res->createdate));
		$result[$k]->enddate = date('d.m.Y H:i', strtotime($res->enddate));
	}
	
	echo '({"results": ' . JEncode($result, $lanbilling) . '})';

} // getGeneratorsTasks()


