<?php
/**
 * Accounting documents
 *
 */

// There is background query
if(isset($_POST['async_call']))
{
    if(isset($_POST['getdocs'])) getUserDocs($lanbilling);
    if(isset($_POST['saveSalesDocs'])) saveSalesDocs($lanbilling);
    if(isset($_POST['delSaleDocument'])) delSaleDocument($lanbilling);
	if(isset($_POST['getSalesHistory'])) getSalesHistory($lanbilling);
}
// There is standart query
else
{
    // Parse HTML template to start Panel rendering
    $tpl = new HTML_Template_IT(TPLS_PATH);
    $tpl->loadTemplatefile("accountingdocs.tpl", true, true);
    $tpl->touchBlock("__global__");
    $tpl->setVariable('AUTOLOAD', (integer)$lanbilling->Option('autoload_accounts'));
    $localize->compile($tpl->get(), true);
}


function delSaleDocument( $lanbilling )
{
    if((integer)$_POST['delSaleDocument'] <= 0) {
            echo '({ success: false, errors: { reason: "Unknown document ID" } })';
            return false;
    }

    try {
        if( false === ($result = $lanbilling->delete("delSale", array("id" => $_POST['delSaleDocument']), array("getSales")) ) )
        {
            throw new Exception ($lanbilling->soapLastError()->detail);
        }
    }
    catch(Exception $error) {
        $_response = array(
            "results" => $_tmp,
            "success" => false,
            "error" => $error->getMessage()
        );
    }
    if(!$_response) {
        $_response = array(
            "results" => $_tmp,
            "success" => true,
            "error" => null
        );
    }
    echo "(" . JEncode($_response, $lanbilling) . ")";
} // end delSaleDocument()


function saveSalesDocs($lanbilling)
{
    try {
        $data = json_decode($_POST['saveSalesDocs']);

        if (!is_array($data->SaleDetail)) $data->SaleDetail = array($data->SaleDetail);
        $s_detail = array();
        foreach ($data->SaleDetail as $k => $val){
            $s_detail[] = array(
                "entry" => array(
                    'recordid' => $val->recordid,
                    'gaap' => $val->gaap
                ),
                "vat" => $val->vat,
                "count" => $val->count,
                "pricecur" => $val->pricecur,
                "amountcur" => $val->amountcur,
                "amountcurvat" => $val->amountcurvat,
                "price" => $val->price,
                "amount" => $val->amount,
                "amountvat" => $val->amountvat
            );
        }

        $_struct = array(
            "saleid" => $data->saleid,
            "agrmid" => $data->agrmid,
            "ownerid" => $data->ownerid,
            "amountcurid" => $data->amountcurid,
            "amountcur" => $data->amountcur,
            "amountcurvat" => $data->amountcurvat,
            "amount" => $data->amount,
            "amountvat" => $data->amountvat,
            "receipt" => $data->receipt,
            "saledate" => $data->saledate,
            "bdate" => $data->bdate,
            "edate" => $data->edate,
            "modperson" => $data->modperson,
            "receiptseq" => $data->receiptseq,
            "comment" => $data->comment,
            "details" => $s_detail
        );

        if( false === ($result = $lanbilling->save("insupdSale", $_struct, false, array('getSales'))) )
        {
        	$msg = $lanbilling->soapLastError()->detail;
        	if (strstr($lanbilling->soapLastError()->detail, "No rights to edit sale")) {
        		$msg = "No rights to edit sale";
        	}
        	throw new Exception ($msg);
        }
    }
    catch(Exception $error) {
        $_response = array(
            "results" => $_tmp,
            "total" => 0,
            "success" => false,
            "error" => $error->getMessage()
        );
    }
    if(!$_response) {
        $_response = array(
            "results" => $_tmp,
            "success" => true,
            "error" => null
        );
    }
    echo "(" . JEncode($_response, $lanbilling) . ")";
}

 /*
 * Show or download user payment documents 
 */

function getUserDocs($lanbilling)
{
    $_tmp = array();
    try {
        $filter = array(
            'agrmid' => (integer)$_POST['agrmid'],
            'pgsize' => ((integer)$_POST['limit'] <= 0) ? 100 : $_POST['limit']
        );
        $filter['pgnum'] = $lanbilling->linesAsPageNum($filter['pgsize'], (integer)$_POST['start'] + 1);
        if ((integer)$_POST['saleDetail'] > 0){
            /**
             * Получаем данные с детализацией по конкретному документу
             */
            $filter['recordid'] = $_POST['saleDetail'];
        } else {
            if(!isset($_POST['datetill']) || empty($_POST['datefrom'])) {
                $_POST['datetill'] = $lanbilling->subDate(date('Y-m') . '-01', 1, 'month', 'Y-m-d');
            }
            if(!isset($_POST['datefrom']) || empty($_POST['datetill'])) {
                $_POST['datefrom'] = $lanbilling->subDate(date('Y-m') . '-01', -1, 'month', 'Y-m-d');
            }
            $dtfrom = $lanbilling->formatDate($_POST['datefrom'] . " 00:00:00", 'YmdHis');
            // Small fix to get documents up to the end of day
            $dtto = $lanbilling->formatDate(date('Y-m-d 00:00:00',strtotime($_POST['datetill'])+86400), 'YmdHis');

            //$filter['nodata'] = 1; // Вывод только списка документов без детализации
            $filter['dtfrom'] = $dtfrom;
            $filter['dtto']   = $dtto;
        }
        if( false === ($result = $lanbilling->get("getSales", array("flt" => $filter))) )
        {
            throw new Exception ($lanbilling->soapLastError()->detail);
        }

        if($result) {
            if ((integer)$_POST['saleDetail'] > 0)
            {
                if(!is_array($result->details)) {
                    $result->details = array($result->details);
                }
				
                array_walk($result->details, create_function('$item, $key, $_tmp', '
                    $_tmp[0][] = array(
                        "recordid"      => $item->entry->recordid,
                        "gaap"          => $item->entry->gaap,
                        "codeokei"      => $item->entry->codeokei,
                        "name"          => $item->entry->name,
                        "unit"          => $item->entry->unit,
                        "unitmult"      => $item->entry->unitmult,
                        "modperson"     => $item->entry->modperson,
                        "vat"           => $item->vat,
                        "count"         => $item->count,
                        "pricecur"      => $item->pricecur,
                        "amountcur"     => $item->amountcur,
                        "amountcurvat"  => $item->amountcurvat,
                        "price"         => $item->price,
                        "amount"        => $item->amount,
                        "amountvat"     => $item->amountvat,
                        "saledate"		=> $item->saledate,
                        "localdate"		=> $item->localdate
                    );
                '), array( &$_tmp ));
            }
            else
            {
                if(!is_array($result)) {
                    $result = array($result);
                }
                $count = $lanbilling->get("Count", array("flt" => $filter, "procname" => "getSales"));
                array_walk($result, create_function('$item, $key, $_tmp', '
                    $_tmp[0][] = $item;
                '), array( &$_tmp ));
            }
        }
        
        
        // Gen order permissions
        $genorderpermissions = (integer)$lanbilling->getAccess('orders') == 2 ? 1 : 0;
    }
    catch(Exception $error) {
        $_response = array(
            "results" => $_tmp,
            "total" => 0,
            "success" => false,
            "error" => $error->getMessage()
        );
    }

    if(!$_response) {
        $_response = array(
            "results" => $_tmp,
            "total" => (integer)$count,
            "success" => true,
            "error" => null,
        	"genorderpermissions" => $genorderpermissions
        );
    }
    echo "(" . JEncode($_response, $lanbilling) . ")";
}


function pickInfo($d){
 	// Этот метод вообще нигде не используется!!!
    $str='<ul style="margin-bottom:10px">';
    $str.='<li style="padding-top: 3px"><span style="color: black">Code gaap: </span>'.$d->entry->gaap.'</li>';
    $str.='<li style="padding-top: 3px"><span style="color: black">Наименование услуги : </span>'.$d->entry->name.'</li>';
    $str.='<li style="padding-top: 3px"><span style="color: black">Ед.изм.: </span>'.$d->entry->unit.'</li>';
    $str.='<li style="padding-top: 3px"><span style="color: black">Кол-во: </span>'.$d->count.'</li>';
    $str.='<li style="padding-top: 3px"><span style="color: black">Стоимость: </span>'.$d->amount.'</li>';

    $str.='</ul>';
    return $str;

}

 /*
 * Show sales history
 */

function getSalesHistory($lanbilling)
{
	$_tmp = array();
	try {		
        $_filter = array(
        	"payhistory" => "3",
			"recordid" => (integer)$_POST['id']
        );
        if( false === ($result = $lanbilling->get("getSales", array("flt" => $_filter))) ) {
            throw new Exception ($lanbilling->soapLastError()->detail);
        }
		
        if(!is_array($result)) {
            $result = array($result);
        }
		
		$det = $_POST['detailed'];
		if($_POST['detailed'] != '') {

			 if(!is_array($result[$det]->details)) {
					$result[$det]->details = array($result[$det]->details);
			 }
			array_walk($result[$det]->details, create_function('$detail, $key, $_tmp', '
				$_tmp[0][] = array(
					"recordid"      => $detail->entry->recordid,
					"gaap"          => $detail->entry->gaap,
					"codeokei"      => $detail->entry->codeokei,
					"name"          => $detail->entry->name,
					"unit"          => $detail->entry->unit,
					"unitmult"      => $detail->entry->unitmult,
					"modperson"     => $detail->entry->modperson,
					"vat"           => $detail->vat,
					"count"         => $detail->count,
					"pricecur"      => $detail->pricecur,
					"amountcur"     => $detail->amountcur,
					"amountcurvat"  => $detail->amountcurvat,
					"price"         => $detail->price,
					"amount"        => $detail->amount,
					"amountvat"     => $detail->amountvat
				);
			'), array( &$_tmp ));
		} else {
			array_walk($result, create_function('$item, $key, $_tmp', '
					$_tmp[0][] = $item;
				'), array( &$_tmp ));
		}
    }
    catch(Exception $error) {
        $_response = array(
            "success" => false,
            "error" => $error->getMessage()
        );
    }
    
    if(!$_response) {
        $_response = array(
            "success" => true,
            "results" => $_tmp
        );
    }

    echo "(" . JEncode($_response, $lanbilling) . ")";
} // getSalesHistory()
