<?php

if($lanbilling->ifIncluded("ip_calc_compare.php") == false)
	include_once("ip_calc_compare.php");

// There is background query
if(isset($_POST['async_call']))
{
	if(isset($_POST['getTrustedHosts']))
	{
		if( false == ($result = $lanbilling->get("getTrusteds")) ) {
			echo "({ success: false, errors: { reason: 'There was an error while getting trusted hosts list. Look server logs for details.' } })";
		}
		else {
			if(!is_array($result)) {
				$result = array($result);
			}
			
			$_tmp = array();
			foreach($result as $obj)
			{
				$_tmp[] = array(					
					"id" => $obj->trustedid,
					"ip" => long2ip($obj->trustedip),
					"mask" => long2ip($obj->trustedmask),
					"description" => $obj->trusteddescr);
			}
			// $lanbilling->ErrorHandler(__FILE__, "getTrustedHosts: [Result]=[".JEncode($_tmp, $lanbilling)."]", __LINE__);
			
			if(sizeof($_tmp) > 0)
				echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
			else echo "({ results: '' })";
		}
	}
}	
else
{
// Alternative implementation of trusted hosts algorithm, SOAP & API3 & AJAX ExtJS
   	$tpl = new HTML_Template_IT(TPLS_PATH);
	
	if(isset($_POST['savetrusteds']))
	{
	saveTrustedHosts($lanbilling);
	showExistedHosts($lanbilling, $tpl);
	$localize->compile($tpl->get(), true);
	}
	else
	{
	showExistedHosts($lanbilling, $tpl);
	$localize->compile($tpl->get(), true);
	}
}
/**
 * Show trusted hosts list
 * @param	object, billing class
 * @param	object, template class
 */
function showExistedHosts($lanbilling, $tpl)
{
	$tpl->loadTemplatefile("th.tpl", true, true);
	$tpl->touchBlock("th_jsapp");
	$tpl->touchBlock("main_body");	
}

function saveTrustedHosts( &$lanbilling )
{
	// $lanbilling->ErrorHandler(__FILE__, "saveTrustedHosts: [Started]", __LINE__);
	if(isset($_POST['throwupd']) && is_array($_POST['throwupd']))
	{
		// $lanbilling->ErrorHandler(__FILE__, "THrowupd exists & array", __LINE__);
		
		foreach($_POST['throwupd'] as $arr)
		{
			$mask = unpack('V', pack('L', ip2long($arr['mask'])));
			$ip = unpack('V', pack('L', ip2long($arr['ip'])));
			
			$struct = array("trustedid" => (integer)$arr['id'], 
					"trustedip" => $ip[1], 
					"trustedmask" => $mask[1], 
					"trusteddescr" => $arr['description']);
			
			if( false == ($lanbilling->save("insupdTrusted", $struct, ((integer)$arr['id'] == 0) ? true : false, array("getTrusteds"))) )
			{
				return false;
			}
			
		}
	}
	
	
	if(isset($_POST['throwdel']) && is_array($_POST['throwdel']))
	{
		foreach($_POST['throwdel'] as $arr)
		{
			if( false == ($lanbilling->delete("delTrusted", array("id" => (integer)$arr['id']), "getTrusteds")) )
			{
				return false;
			}
		}
	}
	
	// $lanbilling->ErrorHandler(__FILE__, "saveTrustedHosts: [Ended]", __LINE__);
	return true;
} // end saveTrustedHosts()
	
?>
