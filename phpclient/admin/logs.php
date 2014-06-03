<?php
/**
 * View events log
 *
 * Repository information:
 * $Date: 2014-01-14 10:30:48 +0400 (Вт., 14 янв. 2014) $
 * $Revision: 40965 $
 */

// There is background query
if(isset($_POST['async_call']))
{
	if(isset($_POST['getlogs'])) {
		getLogStat($lanbilling, $localize);
	}

	if(isset($_POST['getmen'])) {
		getManagers($lanbilling);
	}

	if(isset($_POST['getlogdetail'])) {
		getLogDetails($lanbilling);
	}
}
// There is standart query
else
{
	$tpl = new HTML_Template_IT(TPLS_PATH);
	$tpl->loadTemplatefile("logs.tpl", true, true);
	$tpl->touchBlock("__global__");

  // Initialize variables uid and user
	list( $uid, $user ) = preg_split( '/\+/', $_POST['uidlog'] );
	if( !isset( $uid  ) ) { $uid   =  0;  }
	if( !isset( $user ) ) { $user  =  ""; }

	$tpl->setVariable("USERID" , $uid);
	$tpl->setVariable("USER", htmlspecialchars($user, ENT_QUOTES));

	$localize->compile($tpl->get(), true);
}


/**
 * Filter parameters
 * 		code:  2 - log in/out, 3 - add, 4 - edit, 5 - delete, 1 - view, empty all
 */
function getLogStat( &$lanbilling, &$localize )
{
	$dtfrom = $lanbilling->formatDate($_POST['dtfrom'] . '00:00:00', 'YmdHis');
	$dtto = $lanbilling->formatDate($_POST['dtto'] . '00:00:00', 'YmdHis');

	// Filter
	$_filter = array(
		"repnum" => 15,
		"dtfrom" => $dtfrom,
		"dtto" => $dtto,
		"code" => empty($_POST['code']) ? '' : $_POST['code'],
		"type" => ((integer)$_POST['type'] > 0) ? $_POST['type'] : "",
		"personid" => ($_POST['personid'] != "") ? (integer)$_POST['personid'] : "",
    "operid"    =>  ($_POST['operid'] != "") ? (integer)$_POST['operid'] : "0"
	);

	$_filter['pgsize'] = ((integer)$_POST['limit'] <= 0) ? 100 : $_POST['limit'];
	$_filter['pgnum'] = $lanbilling->linesAsPageNum($_filter['pgsize'], (integer)$_POST['start'] + 1);

	// Sort
	$_order = array(
		"name" => $_POST['sort'],
		"ascdesc" => !isset($_POST['dir']) ? 0 : (($_POST['dir'] == "ASC") ? 0 : 1)
	);

	$_tmp = array();
	$lb = $lanbilling->cloneMain(array('query_timeout' => 380));

	if( false != ($result = $lb->get("getStat", array("flt" => $_filter, "ord" => $_order), true, true)) )
	{
		if(!is_array($result->data)) {
			$result->data = array($result->data);
		}

		$_tmp = $lanbilling->dataCombine($result->names->val, $result->data);

		/*if(isset($_POST['download'])) {
			if(!empty($_POST['clm'])) {
				$clms = explode(';', $_POST['clm']);
			}
			else $clms = array();

			compliteData($lanbilling, $_tmp, $clms);

			if(!empty($_POST['clmnames'])) {
				array_unshift($_tmp, prepareCSVFileHeader($lanbilling, $_POST['clmnames']));
			}
		}*/
	}

	if(isset($_POST['download'])) {
		if(sizeof($_tmp) > 0) {
			$lanbilling->Download('', 'log.csv', implode("\r\n", $_tmp));
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
} // end getLogStat()


/**
 * Get details for the selected log record
 * @param object, billing class
 */
function getLogDetails( &$lanbilling ) {
	if((integer)$_POST['getlogdetail'] == 0) {
		echo '({ "success": false, "results": "" })';
		return;
	}

	// Filter
	$_filter = array(
		"repnum" => 15,
		"repdetail" => 1,
		"recordid" => (integer)$_POST['getlogdetail']
	);

	$_tmp = array();

	if( false != ($result = $lanbilling->get("getStat", array("flt" => $_filter, "ord" => array()), true, true)) ) {
		if(!is_array($result->data)) {
			$result->data = array($result->data);
		}

		$_tmp = $lanbilling->dataCombine($result->names->val, $result->data);
		$_lines = preg_split("/[\n\r]+/", $_tmp[0]['more']);

		$_tmp = array();

		foreach($_lines as $key => $_line) {
			if($key == 0 || empty($_line)) {
				continue;
			}

			$_tmp[] = (object)array(
				"val" => preg_split("/[\t]+/", $_line)
			);
		}

		$_tmp = $lanbilling->dataCombine(array('table', 'field', 'new', 'old'), $_tmp);
	}

	if(sizeof($_tmp) > 0) {
		echo '({"success": true, "results": ' . JEncode($_tmp, $lanbilling) . '})';
	}
	else {
		echo '({ "success": true, "results": "" })';
	}
} // end getLogDetails()


/**
 * Get managers list
 * @param object billing class
 */
function getManagers( &$lanbilling )
{
	$_tmp = array();
    $_flt = array(	
    	'flt'=>array('istemplate' => 0, 'archive' => 0),
    	"ord" => array("name" => 'fio',"ascdesc" => 0)
    );

	if( false != ($result = $lanbilling->get("getManagers",$_flt,true)) )
	{
		if(!is_array($result)) {
			$result = array($result);
		}

		array_walk($result, create_function('$item, $key, $_tmp', '
			if($_tmp[1]->manager > 0 && $item->personid == 0){ return; };
			$_tmp[0][] = array(
				"personid" => $item->personid,
				"name" => $item->fio,
				"selected" => ($_tmp[1]->manager == $item->personid) ? 1 : 0,
				"login" => $item->login,
				"descr" => $item->descr
			);
		'), array( &$_tmp, &$lanbilling ));
	}

	if(sizeof($_tmp) > 0) {
		echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
	}
	else {
		echo "({ results: '' })";
	}
} // end getManagers()


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
?>
