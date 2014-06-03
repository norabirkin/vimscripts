<?php
/**
 * BSO backend
 */
if(isset($_POST['async_call']))
{
	if(isset($_POST['getBsoSets'])) {
		getBsoSets($lanbilling,$localize);
	}
	if(isset($_POST['cancelPayment'])) {
		cancelPayment($lanbilling,$localize);
	}
	if(isset($_POST['addPayment'])) {
		addPayment($lanbilling,$localize);
	}
	if(isset($_POST['delBsoSet'])) {
		delBsoSets($lanbilling,$localize);
	}
	if(isset($_POST['delBsoDoc'])) {
		delBsoDoc($lanbilling,$localize);
	}
	if(isset($_POST['getBsoDocs'])) {
		getBsoDocs($lanbilling,$localize);
	}
	if(isset($_POST['getNewSettings'])) {
		getNewSetSettings($lanbilling,$localize);
	}
	if(isset($_POST['insupdBsoSet'])) {
		insupdBsoSet($lanbilling,$localize);
	}
	if(isset($_POST['genBsoOneDoc'])) {
		genBsoOneDoc($lanbilling,$localize);
	}
	if(isset($_POST['getTemplates'])) {
		getTemplates($lanbilling,$localize);
	}
	if(isset($_POST['markDocDirty'])) {
		markDocDirty($lanbilling,$localize);
	}
	if(isset($_POST['genBsoSetDoc'])) {
		genBsoSetDoc($lanbilling,$localize);
	}
	if(isset($_POST['getBsoPayments'])) {
		getBsoPayments($lanbilling,$localize);
	}
}
else
{
	$tpl = new HTML_Template_IT(TPLS_PATH);
	$tpl->loadTemplatefile("bso.tpl", true, true);
	$tpl->touchBlock('__global__');
	$localize->compile($tpl->get(), true);
}


function getBsoPayments($lanbilling,$localize){
	if((integer)$_POST['getBsoPayments'] <= 0) {
		echo '({ success: false, errors: { reason: "'. $localize->get('Server error') .'" } })'; //Не могу открыть историю платежей.
		return false;
	}

	$_filter['recordid'] = $_POST['getBsoPayments'];

	if( false != ($result = $lanbilling->get('getBsoDocs', array('flt'=>$_filter))) ) {
		$presult = (!is_array($result->payments)) ? array($result->payments) : $result->payments;
		if (count($presult) > 0){
			foreach ($presult as $k=>$v){
				if ($v != ""){
					$p_data[] = array(
						"recordid"  => $v->pay->recordid,
						"agrmid"    => $v->pay->agrmid,
						"modperson" => $v->pay->modperson,
						"amount"    => $v->pay->amount,
						"agrm"      => $v->agrm,
						"uname"     => $v->uname,
						"paydate"   => $v->pay->paydate,
						"receipt"   => $v->pay->receipt,
						"mgr"       => $v->mgr,
						"mgrdescr"  => $v->mgrdescr,
						"comment"   => $v->pay->comment
					);
				} else $p_data = null;
			}
		}else{
			$p_data = null;
		}
		$count = count($p_data);
        echo '({ "success": true, "total":'.$count.',  "results": ' . JEncode($p_data, $lanbilling) . '})';
	} else {
		echo '({ success: false })';
		return true;
	}
}


/**
 * Привязка БСО к платежу
 */
function addPayment($lanbilling,$localize){
    $bsoRecId = (integer)$_POST['bsoDocId'];
    if($bsoRecId <= 0) { echo '({ success: false, errors: { reason: "'.$localize->get("Unknown ID").'" } })'; return false;}
    $r = array(
        "payid" => (integer)$_POST['addPayment'],
        "bsoid" => (integer)$bsoRecId
    );
    if( false != ($req = $lanbilling->get("setPaymentBSO", $r, false))){
        echo '({ success: true })'; return true;
    } else {
		$error = $lanbilling->soapLastError();
		if (preg_match('~.*Existing\sdate\s(\d{4}-\d{2}-\d{2}).*\s(\d{4}-\d{2}-\d{2})~',$error->detail,$mtch)){
			$err = $localize->get('Action is not allowed') . $localize->get('Date must be') . ' ' .$mtch[1];
		} elseif (preg_match('~.*Pay\sdate\s(\d{4}-\d{2}-\d{2}).*BSO.*\s(\d{4}-\d{2}-\d{2})~is',$error->detail,$mtch)) {
			$err = $localize->get('Action is not allowed') . $localize->get('Date of payment less than date of SRF') . ' ('.$mtch[2].')';
		} elseif (preg_match("~^There is period lock.*\s(\d{4}-\d{2}-\d{2})$~is",$error->detail, $mtch)){
            $err = '<br/>' . $localize->get('Period is locked') . '. ' . $localize->get('You cannot link strict reporting form to payment with date less then') . ' ' . '<b>'.$mtch[1].'</b>.';
		} else {
			$err = $localize->get('Server error');
		}
		
		echo '({ success: false, errors: { reason: "'.$err.'" } })';
		return false;
	}
}

function cancelPayment($lanbilling,$localize){
    $bsoRecId = (integer)$_POST['cancelPayment'];
    if($bsoRecId <= 0) { echo '({ success: false, errors: { reason: "'.$localize->get("Wrong ID").'" } })'; return false;}
    $r = array(
        "payid" => (integer)$_POST['precordid'],
        "bsoid" => 0
    );
    if( $_SESSION['auth']['access']['bso'] == 2 && false != ($req = $lanbilling->get("setPaymentBSO", $r, false))){
        echo '({ success: true })'; return true;
    } else {
		$errDescr = ($_SESSION['auth']['access']['bso'] < 2) ? '</br>' . $localize->get('Permission denied') : '';
		echo '({ success: false, errors: { reason: "' . $localize->get('Server error') . ' : ' .$errDescr.'" } })';
		return false;
	}
}

/**
 * Генерация одного документа БСО
 */
function genBsoOneDoc($lanbilling,$localize)
{
    $bsoSetId = (integer)$_POST['genBsoOneDoc'];
    if($bsoSetId <= 0) { echo '({ success: false, errors: { reason: "'. $localize->get('Unknown ID') .'" } })'; return false; }
    $struct = array(
        'recordid'  => 0,
        'createdby' => $lanbilling->manager,
        'number'    => trim($_POST['number']),
        'setid'     => $bsoSetId,
        'created'   => $_POST['bso_date'],
        'createdip' => array(
                'ip'   => $_SERVER['REMOTE_ADDR'],
                'mask' => 32
            )
    );
    if( false != ($result = $lanbilling->save("insupdBsoDoc", $struct, true))){
        echo '({ success: true })'; return true;
    } else {
        $error = $lanbilling->soapLastError();
        if (preg_match("~Duplicate entry.*~is",$error->detail)){
            $msg = '<br/>' . $localize->get('Duplicate entry');
        } else {
            $msg = '<br/>'.$error->detail;
        }
        echo '({ success: false, errors: { reason: "' . $localize->get('Server error') . ': ' . $msg.'" } })';
        return false;
    }
}


function genBsoSetDoc($lanbilling,$localize)
{
    $bsoSetId = (integer)$_POST['genBsoSetDoc'];
    if($bsoSetId <= 0 || (integer)$_POST['amountDocs'] <= 0) {
		echo '({ success: false, errors: { reason: "Unknown BSO\'s set ID or wrong amount" } })';
		return false;
	}
    $struct = array(
    	'setid' => $bsoSetId,
        'cnt'   => (integer)$_POST['amountDocs'],
        'templ' => $_POST['tplcombo'],
    	'ip'    => $_SERVER['REMOTE_ADDR'],
        'dt'    => $_POST['bso_date']
    );

    if ($_POST['startDocs'])
        $struct['start'] = (integer)$_POST['startDocs'];
    if( false != ( $result = $lanbilling->get("genBsoDocs", $struct) )) {
        echo '({ success: true })'; return;
    } else {
		$error = $lanbilling->soapLastError();
		if (preg_match("~.*\((.*)\)~is",$error->detail, $mtch)){
			$minVal = str_ireplace('available: ', '', $mtch[1]);
			$msg = '<br/>' . $localize->get('Minimal start number') . ' <b>'.$minVal.'</b>.';
		} elseif ( preg_match("~[\w\s]*\S?(\-?\d+)\S?[\w\s]*\S?(\-?\d+)\S?.*~is",html_entity_decode($error->detail, ENT_QUOTES), $mtch2) ){
			$msg = '<br/>You can use '.$mtch2[1].' as start number and '.$mtch2[2].' as a quantity';
		} else {
			$msg = '<br/>'.$error->detail;
		}
		echo '({ success: false, errors: { reason: "' . $localize->get('Server error') . ': ' . $msg.'" } })';
		return;
	}
}

function markDocDirty( $lanbilling,$localize )
{
    $bsoDocId = (integer)$_POST['markDocDirty'];
    $bsoSetId = (integer)$_POST['bsoSetId'];
    if($bsoDocId <= 0 || $bsoSetId <= 0) { echo '({ success: false, errors: { reason: "' . $localize->get('Wrong ID') . '" } })'; return false; }
    $struct = array(
        'recordid' => $bsoDocId,
        'updatedby' => $lanbilling->manager,
        'dirty' => (($_POST['restore'] == 1) ? 0 : 1),
        'number' => $_POST['number'],
        'setid' => $bsoSetId,
        'updatedip' => array(
                'ip'	=> $_SERVER['REMOTE_ADDR'],
                'mask' => 32
            )
    );
    if( $_SESSION['auth']['access']['bso'] == 2 && false != ($result = $lanbilling->save("insupdBsoDoc", $struct, false))){
        echo '({ success: true })'; return true;
    } else {
		$errDescr = ($_SESSION['auth']['access']['bso'] < 2) ? '</br>' . $localize->get('Permission denied') : '';
		echo '({ success: false, errors: { reason: "' . $localize->get('Server error') . ': ' . $errDescr.'" } })'; return false;
	}
}


function getTemplates( $lanbilling,$localize )
{
    $results = $lanbilling->get("getOptions");
    foreach($results as $obj) {
        if(false !== strpos($obj->name, "agrmnum_template_")) {
            if (empty($agrmANum)) $agrmANum = array();
            $size = sizeof($agrmANum);
            $agrmANum[$size]['genname'] = $obj->descr;
            $agrmANum[$size]['gentpl'] = $obj->value;
        }
    }
    if (count($agrmANum) > 0)
        echo '({ "success": true, "total":'.count($agrmANum).',  "results": ' . JEncode($agrmANum, $lanbilling) . '})';
    else
        echo '({ "success": true, "total": 0, "results": ""})';
}


function insupdBsoSet( $lanbilling,$localize )
{
    $bsoSet = (integer)$_POST['insupdBsoSet'];
    if (!empty($_POST['bsoSetNumber'])){

        $struct = array(
            'recordid' => ($bsoSet == -1) ? 0 : $bsoSet,
            'createdby' => $lanbilling->manager,
            'number' => trim($_POST['bsoSetNumber']),
            'createdip' => array(
                    'ip'	=> $_SERVER['REMOTE_ADDR'],
                    'mask' => 32
                )
        );
        if( false != ($result = $lanbilling->save("insupdBsoSet", $struct, (((integer)$bsoSet < 0) ? true : false)))){
            $bsoSetId = $lanbilling->saveReturns->ret;
            echo '({ success: true, insupdBsoSet: '.$bsoSetId.'})';
        } else {
            $error = $lanbilling->soapLastError();
            if (preg_match("~Duplicate entry.*~is",$error->detail)){
                $msg = '<br/>' . $localize->get('Duplicate entry');
            } else {
                $msg = '<br/>'.$localize->get($error->detail);
            }
            echo '({ success: false, errors: { reason: "' . $localize->get('Server error') . ': '.$msg.'" } })';
            return false;
        }
    }else{ echo '({ success: false, errors: { reason: "' . $localize->get('Blank is not allowed') . '" } })'; return false; }
}


function getBsoDocs($lanbilling,$localize)
{
	if((integer)$_POST['getBsoDocs'] <= 0) {
		echo '({ success: false, errors: { reason: "' . $localize->get('Wrong ID') . '" } })';
		return false;
	}

    $_filter = array(
			"setid"=>$_POST['getBsoDocs'],
			"code" => $_POST['number'],
			"pgnum" => $lanbilling->linesAsPageNum((((integer)$_POST['limit'] <= 0) ? 100 : $_POST['limit']), (integer)$_POST['start'] + 1),
			"pgsize" => ((integer)$_POST['downtype'] == 0) ? (((integer)$_POST['limit'] <= 0) ? 100 : $_POST['limit']) : (isset($_POST['limit']) ? $_POST['limit'] : "")
			);

    if (isset($_POST['bsoPayed']))  $_filter['payed'] = $_POST['bsoPayed'];

    if (isset($_POST['category'])){
        $_filter['category'] = $_POST['category'];
    }

    if( false != ($result = $lanbilling->get("getBsoDocs", array("flt"=>$_filter, "md5" => $lanbilling->controlSum($_filter)))) ) {
		if(!is_array($result)) {
			$result = array($result);
		}

		$_tmp = array();
        foreach($result as $key => $item) {
            if( $item->recordid > 0 ) {
				$presult = (!is_array($item->payments)) ? array($item->payments) : $item->payments;
				$p_data = null;
				foreach ($presult as $k => $v) {
					if ($v != "") {
						$p_data[] = array(
							"amount"  => $v->pay->amount,
							"agrm"    => $v->agrm,
							"uname"   => $v->uname,
							"paydate" => $v->pay->paydate,
							"receipt" => $v->pay->receipt
						);
					} else {
						$p_data = null;
					}
				}
                $_tmp[] = array(
                    "p_data"        => $p_data,
                    "recordid"      => $item->recordid,
                    "setid"         => $item->setid,
                    "createdby"     => $item->createdby,
                    "updatedby"     => $item->updatedby,
                    "dirty"         => $item->dirty,
                    "payid"         => $item->payid,
                    "number"        => $item->number,
                    "receipt"       => $item->receipt,
                    "created"       => $item->created,
                    "updated"       => $item->updated,
                    "mgrnameins"    => $item->mgrnameins,
                    "mgrnameupd"    => $item->mgrnameupd,
                    "createdip"     => $item->createdip->ip,
                    "createdipmask" => $item->createdip->mask,
                    "updatedip"     => $item->updatedip->ip,
                    "updatedipmask" => $item->updatedip->mask

                );
            }
		}

        $count = $lanbilling->get("Count", array( 	"flt" 		=> $_filter,
													"procname"	=> "getBsoDocs",
													"md5"		=> $lanbilling->controlSum($_filter) ) );

        echo '({ "success": true, "total":'.$count.',  "results": ' . JEncode($_tmp, $lanbilling) . '})';
	} else {
        echo '({ success: false, errors: { reason: "'.$localize->get("Can not get bso docs").'" } })';
    }
}


function getNewSetSettings($lanbilling,$localize)
{
    $mng = $lanbilling->get('getManager',array('id'=>0));
    $arr['managerId']   = $lanbilling->manager;
    $arr['managerName'] = $mng->manager->fio;
    $arr['createdDate'] = date('Y-m-d H:i:s');
    $arr['createdIp']   = $_SERVER['REMOTE_ADDR'];
    echo '({ success: true, "data": ' . JEncode($arr, $lanbilling) . '})';
}


function delBsoSets($lanbilling, $localize)
{
	if((integer)$_POST['delBsoSet'] <= 0) {
		echo '({ success: false, errors: { reason: "Unknown BSO\'s set ID" } })';
		return false;
	}
	if( false == $lanbilling->delete("delBsoSet", array("id" => $_POST['delBsoSet']), array("getBsoSets")) ) {
		$errDescr = ($_SESSION['auth']['access']['bso'] < 2) ? '</br>' . $localize->get('Permission denied') : '';
		echo '({ success: false, errors: { reason: "' . $localize->get('Blank is not allowed') . ': ' .$errDescr.'" } })';
	}
	else echo '({ success: true })';
}

function delBsoDoc($lanbilling, $localize){
    # delBsoDoc
	if((integer)$_POST['delBsoDoc'] <= 0) {
		echo '({ success: false, errors: { reason: "' . $localize->get('Wrong ID') . '" } })';
		return false;
	}


	if( false == $lanbilling->delete("delBsoDoc", array("id" => $_POST['delBsoDoc']), array("getBsoDocs")) ) {
		$errDescr = ($_SESSION['auth']['access']['bso'] < 2) ? '</br>' . $localize->get('Permission denied') : '';
		echo '({ success: false, errors: { reason: "'.$errDescr.'" } })';
	}
	else echo '({ success: true, descr: "'.$_SESSION['auth']['access']['bso'].'" })';
}



/**
 * Получение списка серий бланков строгой отчетности
 */
function getBsoSets($lanbilling,$localize)
{
	if( false !== ($result = $lanbilling->get("getBsoSets")) ){
		if(!is_array($result)) {
			$result = array($result);
		}
		array_walk($result, create_function('$item, $key, $_tmp', '
			if(($_tmp[1]->manager > 0 && $item->recordid == 0) || is_null($item->recordid)){
				return;
			};
			$_tmp[0][] = array(
				"recordid"  => $item->recordid,
				"createdby" => $item->createdby,
                "number"    => $item->number,
                "created"   => $item->created,
                "mgrname"   => $item->mgrname,
                "createdip" => $item->createdip->ip,
				"use_bso" => '.$_SESSION['auth']['access']['bso'].'
			);
		'), array( &$_tmp, &$lanbilling ));

        if(sizeof($_tmp) > 0) {
            echo '({ success: true, "results": ' . JEncode($_tmp, $lanbilling) . '})';
        } else {
            echo '({ success: true, "results": "" })';
        }
	} else echo '({ success: false, errors: { reason: "Unknown postman\'s ID" } })';
}
