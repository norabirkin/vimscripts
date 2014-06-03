<?php

include('system.php');

class ServCodes extends System {
	
}




/**
 * Processing queryes from interface
 */

if(isset($_POST['async_call']))
{
    try  {
        $c = new ServCodes($localize);
        echo $c->handling();
    }  catch (Exception $e) {
    }
}
else
{
	$tpl = new HTML_Template_IT(TPLS_PATH);
	$tpl->loadTemplatefile("serv_codes.tpl", true, true);
	$tpl->touchBlock('__global__');
    $tpl->setVariable('AUTOLOAD', (integer)$lanbilling->Option('autoload_accounts'));
	$localize->compile($tpl->get(), true);
}
