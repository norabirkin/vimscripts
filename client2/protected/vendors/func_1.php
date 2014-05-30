<?php
/**
 * This engine helps user to block his account like manager lock
 *
 * @date		$Date: 2010-04-19 16:07:21 +0400 (Пн., 19 апр. 2010) $
 * @revision	$Revision: 9316 $
 */

// Write debug information to the temporary file. On Unix OS - /tmp/lb_debug_dump
define("FILE_DEBUG", false);
// Show error and warning to stdout (browser)
define("STDOUT_ERRORS", false);

/**
 * Don't edit below code if you are not experienced!!!
 * Set necessary flags upper
 * Error Handler
 */
ini_set("display_errors", STDOUT_ERRORS);
error_reporting(E_ALL^E_NOTICE);
// Template derictory
define("TPLS_PATH", "../tpls");

// Include core libraries
// Template class
include_once("../IT.php");
// SOAP client class
include_once("../soap.class.php");
// Core billing class
include_once("../main.class.php");

// Create Core object
$lanbilling = new LANBilling( array('rootPath' => '../') );
$tpl = new HTML_Template_IT(TPLS_PATH);
$tpl->loadTemplatefile("servicefuncs.tpl", true, true);

// Start authorized operations by client request
if($lanbilling->authorized) {
	$O = $lanbilling->getOperators(null, true);
	$tpl->setVariable("OPERATOR", $O['name']);
	$tpl->setVariable("CLIENTNAME", $lanbilling->clientInfo->account->name);

	if( null == $vg = getVgroup($lanbilling, $_GET['vgid']) ) {
		$_GET['vgid'] = 0;
	}

	// Check if passed account identifier if it's empty than alert and stop
	if((integer)$_GET['vgid'] == 0) {
		// Header line
		$tpl->setCurrentBlock('tdattribute');
		$tpl->setVariable("TDANAME", "class");
		$tpl->setVariable("TDAVALUE", "td_head_ext");
		$tpl->parseCurrentBlock();

		$tpl->setVariable("CELL_VALUE", "<%@ Suspension of services for the account %>");
		$tpl->parse('td_col');
		$tpl->parse('line_tr');

		$tpl->setCurrentBlock('tdattribute');
		$tpl->setVariable("TDANAME", "class");
		$tpl->setVariable("TDAVALUE", "td_bold");
		$tpl->parseCurrentBlock();

		$tpl->setCurrentBlock('tdattribute');
		$tpl->setVariable("TDANAME", "style");
		$tpl->setVariable("TDAVALUE", "color: red; text-align: center; height: 50px;");
		$tpl->parseCurrentBlock();

		$tpl->setVariable("CELL_VALUE", "<%@ To complete request need defined account %>");
		$tpl->parse('td_col');
		$tpl->parse('line_tr');

		$tpl->setCurrentBlock('tdattribute');
		$tpl->setVariable("TDANAME", "class");
		$tpl->setVariable("TDAVALUE", "td_bold");
		$tpl->parseCurrentBlock();

		$tpl->setCurrentBlock('tdattribute');
		$tpl->setVariable("TDANAME", "style");
		$tpl->setVariable("TDAVALUE", "text-align: center; height: 50px;");
		$tpl->parseCurrentBlock();

		$tpl->setCurrentBlock('button');
		$tpl->setVariable("BANAME", "onclick");
		$tpl->setVariable("BAVALUE", "try{ window.opener.focus(); window.close(); } catch(e) { }");
		$tpl->setVariable("BVALUE", "<%@ Back %>");
		$tpl->parseCurrentBlock();

		$tpl->parse('td_col');
		$tpl->parse('line_tr');

		$tpl->setCurrentBlock('tbattribute');
		$tpl->setVariable("TBANAME", "class");
		$tpl->setVariable("TBAVALUE", "table_comm");
		$tpl->parseCurrentBlock();

		$tpl->setCurrentBlock('tbattribute');
		$tpl->setVariable("TBANAME", "style");
		$tpl->setVariable("TBAVALUE", "margin-top: 20px;");
		$tpl->parseCurrentBlock();
	}
	else {
		if((integer)$_POST['vgid'] > 0 && (integer)$_POST['vgid'] == (integer)$_GET['vgid']) {
			// Header line
			$tpl->setCurrentBlock('tdattribute');
			$tpl->setVariable("TDANAME", "class");
			$tpl->setVariable("TDAVALUE", "td_head_ext");
			$tpl->parseCurrentBlock();

			$tpl->setVariable("CELL_VALUE", "<%@ Suspension of services for the account %>");
			$tpl->parse('td_col');
			$tpl->parse('line_tr');

			// Message line
			$tpl->setCurrentBlock('tdattribute');
			$tpl->setVariable("TDANAME", "class");
			$tpl->setVariable("TDAVALUE", "td_bold");
			$tpl->parseCurrentBlock();

			$tpl->setCurrentBlock('tdattribute');
			$tpl->setVariable("TDANAME", "style");
			$tpl->setVariable("TDAVALUE", "text-align: center; height: 50px;");
			$tpl->parseCurrentBlock();

			if( false !== $lanbilling->get("blkClientVgroup", array("id" => (integer)$_POST['vgid'], "blk" => 3, "state" => "off"), true) ) {
				$lanbilling->flushCache("getClientVgroups");
				$tpl->setVariable("CELL_VALUE", $lanbilling->localize->get('Request completed successfully'));
			}
			else {
				$tpl->setVariable("CELL_VALUE", nl2br($lanbilling->localize->get('Request can not be completed. The account had either disabled or awaiting completion')));
			}

			$tpl->parse('td_col');
			$tpl->parse('line_tr');

			// Button line
			$tpl->setCurrentBlock('tdattribute');
			$tpl->setVariable("TDANAME", "class");
			$tpl->setVariable("TDAVALUE", "td_comm");
			$tpl->parseCurrentBlock();

			$tpl->setCurrentBlock('tdattribute');
			$tpl->setVariable("TDANAME", "style");
			$tpl->setVariable("TDAVALUE", "text-align: center; height: 50px;");
			$tpl->parseCurrentBlock();

			$tpl->setCurrentBlock('button');
			$tpl->setVariable("BANAME", "onclick");
			$tpl->setVariable("BAVALUE", "try{ window.opener.focus(); window.close(); } catch(e) { }");
			$tpl->setVariable("BVALUE", "<%@ Back %>");
			$tpl->parseCurrentBlock();

			$tpl->parse('td_col');
			$tpl->parse('line_tr');

			// Table common
			$tpl->setCurrentBlock('tbattribute');
			$tpl->setVariable("TBANAME", "class");
			$tpl->setVariable("TBAVALUE", "table_comm");
			$tpl->parseCurrentBlock();

			$tpl->setCurrentBlock('tbattribute');
			$tpl->setVariable("TBANAME", "style");
			$tpl->setVariable("TBAVALUE", "margin-top: 20px;");
			$tpl->parseCurrentBlock();
		}
		else {
			// Open form
			$tpl->touchBlock('startForm');

			// Hidden
			$tpl->setCurrentBlock('hidden');
			$tpl->setVariable("HNAME", "vgid");
			$tpl->setVariable("HVALUE", "0");
			$tpl->parseCurrentBlock();

			// Header line
			$tpl->setCurrentBlock('tdattribute');
			$tpl->setVariable("TDANAME", "class");
			$tpl->setVariable("TDAVALUE", "td_head_ext");
			$tpl->parseCurrentBlock();

			$tpl->setVariable("CELL_VALUE", "<%@ Suspension of services for the account %>");
			$tpl->parse('td_col');
			$tpl->parse('line_tr');

			// Message line
			$tpl->setCurrentBlock('tdattribute');
			$tpl->setVariable("TDANAME", "class");
			$tpl->setVariable("TDAVALUE", "td_bold");
			$tpl->parseCurrentBlock();

			$tpl->setCurrentBlock('tdattribute');
			$tpl->setVariable("TDANAME", "style");
			$tpl->setVariable("TDAVALUE", "text-align: center; height: 50px;");
			$tpl->parseCurrentBlock();

			$tpl->setVariable("CELL_VALUE", nl2br(sprintf($lanbilling->localize->get('The service for the selected account will be stopped'), $vg->vgroup->login)));
			$tpl->parse('td_col');
			$tpl->parse('line_tr');

			// Button line
			$tpl->setCurrentBlock('tdattribute');
			$tpl->setVariable("TDANAME", "class");
			$tpl->setVariable("TDAVALUE", "td_comm");
			$tpl->parseCurrentBlock();

			$tpl->setCurrentBlock('tdattribute');
			$tpl->setVariable("TDANAME", "style");
			$tpl->setVariable("TDAVALUE", "text-align: center; height: 50px;");
			$tpl->parseCurrentBlock();

			$tpl->setCurrentBlock('button');
			$tpl->setVariable("BANAME", "onclick");
			$tpl->setVariable("BAVALUE", "try{ this.form.vgid.value = '" . (integer)$_GET['vgid'] . "'; this.form.submit(); } catch(e) { }");
			$tpl->setVariable("BVALUE", "<%@ Continue %>");
			$tpl->parseCurrentBlock();

			$tpl->setCurrentBlock('button');
			$tpl->setVariable("BANAME", "onclick");
			$tpl->setVariable("BAVALUE", "try{ window.opener.focus(); window.close(); } catch(e) { }");
			$tpl->setVariable("BVALUE", "<%@ Cancel %>");
			$tpl->parseCurrentBlock();

			$tpl->parse('td_col');
			$tpl->parse('line_tr');

			// Table common
			$tpl->setCurrentBlock('tbattribute');
			$tpl->setVariable("TBANAME", "class");
			$tpl->setVariable("TBAVALUE", "table_comm");
			$tpl->parseCurrentBlock();

			$tpl->setCurrentBlock('tbattribute');
			$tpl->setVariable("TBANAME", "style");
			$tpl->setVariable("TBAVALUE", "margin-top: 20px;");
			$tpl->parseCurrentBlock();

			// End form
			$tpl->touchBlock('endForm');
		}
	}
}
else {
	// Header line
	$tpl->setCurrentBlock('tdattribute');
	$tpl->setVariable("TDANAME", "class");
	$tpl->setVariable("TDAVALUE", "td_head_ext");
	$tpl->parseCurrentBlock();

	$tpl->setVariable("CELL_VALUE", "<%@ Suspension of services for the account %>");
	$tpl->parse('td_col');
	$tpl->parse('line_tr');

	$tpl->setCurrentBlock('tdattribute');
	$tpl->setVariable("TDANAME", "class");
	$tpl->setVariable("TDAVALUE", "td_bold");
	$tpl->parseCurrentBlock();

	$tpl->setCurrentBlock('tdattribute');
	$tpl->setVariable("TDANAME", "style");
	$tpl->setVariable("TDAVALUE", "color: red; text-align: center; height: 50px;");
	$tpl->parseCurrentBlock();

	$tpl->setVariable("CELL_VALUE", "<%@ Unauthorized request %>");
	$tpl->parse('td_col');

	$tpl->setCurrentBlock('tbattribute');
	$tpl->setVariable("TBANAME", "class");
	$tpl->setVariable("TBAVALUE", "table_comm");
	$tpl->parseCurrentBlock();

	$tpl->setCurrentBlock('tbattribute');
	$tpl->setVariable("TBANAME", "style");
	$tpl->setVariable("TBAVALUE", "margin-top: 20px;");
	$tpl->parseCurrentBlock();

	$tpl->setVariable("OPERATOR", "--");
	$tpl->setVariable("CLIENTNAME", "--");
}

$lanbilling->localize->compile($tpl->get(), true);


/**
 * Get Vgroup information by its identification number
 * @param	object, billing class
 * @param	integer, vgroup id
 */
function getVgroup( &$lanbilling, $vgid = 0 )
{
	if( false != ($result = $lanbilling->get("getClientVgroups", array("id" => (integer)$lanbilling->clientInfo->account->uid))) )
	{
		if(!empty($result))
		{
			if(!is_array($result)) {
				$result = array($result);
			}

			foreach($result as $item) {
				if($item->vgroup->vgid == $vgid) {
					return $item;
				}
			}
		}
	}

	return null;
} // end getVgroups()
?>