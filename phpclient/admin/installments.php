<?php
/**
 * View Installent Plan panel. Create nee, edit existing
 *
 */

if(isset($_POST['async_call']))
{
    // Installments list
	if(isset($_POST['getinstallments'])) {
		getInstallmentsPlans($lanbilling, $localize);
	}
    // Remove Installment
	if(isset($_POST['delinstallment'])) {
		delInstallmentsPlan($lanbilling, $localize);
	}
    // Save new or edit existing Installment Plan
	if(isset($_POST['setinstallment'])) {
		setInstallmentsPlan($lanbilling, $localize);
	}
	
	// Installments list
	if(isset($_POST['getvginstallments'])) {
		getVgroupInstallments($lanbilling, $localize);
	}
	
}
// There is standart query
else
{
	$tpl = new HTML_Template_IT(TPLS_PATH);
	showInstallmentsPanel($lanbilling, $tpl);
	$localize->compile($tpl->get(), true);
}


/**
 * Build and show agrm groups panel
 * @param	object, billing class
 * @param	object, template class
 */
function showInstallmentsPanel( &$lanbilling, &$tpl )
{
	$tpl->loadTemplatefile("installments.tpl", true, true);
	$tpl->touchBlock("__global__");
	$tpl->setVariable("IFUSECERBER", (integer)$lanbilling->getLicenseFlag('usecerber'));
} // end showInstallmentsPanel()


/**
 * Get installments plan list
 * @param	object, billing class
 * @param	object, localization class
 */
function getInstallmentsPlans( &$lanbilling, &$localize )
{
    try {	
		$_filter = array();
		
		$_filter['pgsize'] = ((integer)$_POST['limit'] <= 0) ? 100 : $_POST['limit'];
		$_filter['pgnum'] = $lanbilling->linesAsPageNum($_filter['pgsize'], (integer)$_POST['start'] + 1);
		
		if( false === ($result = $lanbilling->get("getInstallmentsPlans", $_filter ))) {
			throw new Exception ($lanbilling->soapLastError()->detail);
		}
		if(!is_array($result)) $result = array($result);
			
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
            "error" => null,
            "results" => $result
        );
    }

    echo "(" . JEncode($_response, $lanbilling) . ")";
} // end getInstallmentsPlans()



/**
 * Set or update installments plans
 * @param	object, billing class
 * @param	object, localization class
 */
function setInstallmentsPlan( &$lanbilling, &$localize )
{
    try {
		$struct = array(
			'planid' => (int)$_POST['planid'],
			'name' => $_POST['name'],
			'descr' => $_POST['descr'],
			'duration' => (int)$_POST['duration'],
			'firstpayment' => (int)$_POST['firstpayment']
		);
        
		if( false == $lanbilling->save("insupdInstallmentsPlan", $struct) ) {
            throw new Exception($lanbilling->soapLastError()->detail);
        }
		$ret = $lanbilling->saveReturns->ret;
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
            "error" => null,
            "results" => $ret
        );
    }

    echo "(" . JEncode($_response, $lanbilling) . ")";
} // end setInstallmentsPlan()



/**
 * Remove intallments plan
 * @param	object, billing class
 * @param	object, localization class
 */
function delInstallmentsPlan( &$lanbilling, &$localize )
{
    try {		
        if( false == $lanbilling->get("delInstallmentsPlan", array('planid' => (int)$_POST['planid']) )) {
            throw new Exception($lanbilling->soapLastError()->detail);
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
            "error" => null
        );
    }

    echo "(" . JEncode($_response, $lanbilling) . ")";
} // end delInstallmentsPlan()



/**
 * Get data of vgroups repayment installments
 * @param	object, billing class
 * @param	object, localization class
 */
function getVgroupInstallments( &$lanbilling, &$localize )
{
    try {	
		$_filter = array(
			'vgid' => (int)$_POST['vgid'],
			'dtfrom' => $_POST['datefrom'],
			'dtto' => $_POST['dateto']
		);
		
		$_filter['pgsize'] = ((integer)$_POST['limit'] <= 0) ? 100 : $_POST['limit'];
		$_filter['pgnum'] = $lanbilling->linesAsPageNum($_filter['pgsize'], (integer)$_POST['start'] + 1);
		$_ord = array(
			"name" => $_POST['sort'],
			"ascdesc" => ($_POST['dir'] == 'DESC') ? 1 : 0
		);

		if( false === ($result = $lanbilling->get("getVgroupInstallments", array('flt' => $_filter, 'ord' => $_ord) ))) {
			throw new Exception ($lanbilling->soapLastError()->detail);
		}
		if(!is_array($result)) $result = array($result);
			
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
            "error" => null,
            "results" => $result
        );
    }

    echo "(" . JEncode($_response, $lanbilling) . ")";
} // end getVgroupInstallments()
