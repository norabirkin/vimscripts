<?php
/**
 * Show cards list according to the requested filter
 *
 */

// There is background query
if(isset($_POST['async_call']))
{
	if(isset($_POST['cardslist']))
		getCardsList($lanbilling);
}
// There is standart query
else
{
	$tpl = new HTML_Template_IT(TPLS_PATH);
	$tpl->loadTemplatefile("cardslist.tpl", true, true);
	
	$tpl->touchBlock("__global__");
	
	$localize->compile($tpl->get(), true);
}


/**
 * Get from DB cards list according to the filter parameters
 * @param	object, billing class
 */
function getCardsList( &$lanbilling )
{
	$_tmp = array();
	
	$_filter = $lanbilling->soapFilter(array(
				"pgsize" => 50, 
				"pgnum" => $lanbilling->linesAsPageNum(50, (integer)$_POST['start'] + 1), 
				"activated" => (integer)$_POST['cardslist'], 
				"setid" => (integer)$_POST['setid'], 
				"cardkey" => $_POST['cardkey'], 
				"serno" => $_POST['serno'], 
				"dtcreated" => $_POST['dtcreated'], 
				"dtactivated" => $_POST['dtactivated']
	));
	
	if((integer)$_POST['download'] == 1){
		unset($_filter['pgsize'], $_filter['pgnum']);
	}
	
	$_md5 = $lanbilling->controlSum($_filter);
	
	if( false != ($result = $lanbilling->get("getPaycards", array("flt" => $_filter, "md5" => $_md5))) )
	{
		if(!empty($result) && !is_array($result)) {
			$result = array($result);
		}
		
		$count = $lanbilling->get("Count", array("flt" => $_filter, "procname" => "getPaycards", "md5" => $_md5));
		
		if(isset($_POST['download'])){
			// Get character set from options to export data
			if(false == ($out_encoding = $lanbilling->Option('export_character'))) {
				$out_encoding = 'UTF8';
			}
			else {
				$out_encoding = $lanbilling->encodingName($out_encoding);
			}
			
			foreach($result as $item){
				$line = array(
						$item->serno, 
						$item->cardkey, 
						$item->sum, 
						$item->symbol, 
						$item->datecreate,
						$item->acttil
				);

				foreach($line as $key => $val) {
					if(is_string($val)) {
						$str_encoding = mb_detect_encoding($val, $lanbilling->encodingName('UTF8, CP1251, KOI8R, ASCII'), true);
						if($lanbilling->encodingName($str_encoding) != $out_encoding) {
							$val = iconv($str_encoding, $out_encoding, $val);
						}
						
						$line[$key] = sprintf('"%s"', $val);
					}
				}
				
				$_tmp[] = implode(';', $line);
			}
		}
		else {
			foreach($result as $obj)
			{
				$_tmp[] = array("serno" => $obj->serno, "used" => $obj->used, "agrmid" => $obj->agrmid, 
						"modpers" => $obj->modpers, "cardset" => $obj->cardset, "sum" => $obj->sum, 
						"modpersdescr" => $obj->modpersdescr, "cardkey" => $obj->cardkey,
						"datecreate" => $obj->datecreate, "acttil" => $obj->acttil, "activated" => $obj->activated, 
						"symbol" => $obj->symbol, "expired" => $obj->expired, "username" => $obj->username);
			}
		}
	}
	
	if(!isset($_POST['download'])){
		if(sizeof($_tmp) > 0)
			echo '({"total": ' . $count . ', "results": ' . JEncode($_tmp, $lanbilling) . '})';
		else {
			echo '({ "total": 0, "results": "" })';
		}
	}
	else {
		if(sizeof($_tmp) > 0){
			$lanbilling->Download('', 'cards.csv', implode("\n", $_tmp));
		}
	}
} // end getCardsList()


?>