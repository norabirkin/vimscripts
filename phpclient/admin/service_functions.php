<?PHP
/**
 * ����������� ��������� �������
 *
 */

// ������� �����������
if (!session_is_registered("auth")) exit;

// ���������� ��� �������� ��������� �������
define("SERVICE_DIR", "../client/services/");

if(isset($_POST['async_call']))
{

	if(isset($_POST['getcontent']))
	{
		if( false == ($result = $lanbilling->get("getServFuncs")) ) {
			echo "({ success: false, errors: { reason: 'There was an error while getting services functions list. Look server logs for details.' } })";
		}
		else {
			if(!is_array($result)) {
				$result = array($result);
			}
			
			$_tmp = array();
			foreach($result as $obj)
			{
				$_tmp[] = array(					
					"id" => $obj->id,
					"flag" => $obj->flag,
					"descr" => $obj->descr,
					"originalfile" => $obj->originalfile,
					"savedfile" => $obj->savedfile,
					"descrfull" => $obj->descrfull,
					"uuid" => $obj->uuid,
					"link" => $obj->link);
			}
			// $lanbilling->ErrorHandler(__FILE__, "getTrustedHosts: [Result]=[".JEncode($_tmp, $lanbilling)."]", __LINE__);
			
			if(sizeof($_tmp) > 0)
				echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
			else echo "({ results: '' })";
		}
	}	
	if(isset($_POST['delrow']))
	{
		if(isset($_POST['id'])) $id=$_POST['id'];
		else return false;
		if( false == ($lanbilling->delete("delServFunc", array("id" => $id), array("getServFuncs"))) )
			{
				return false;
			}
			
	  }
	  if(isset($_POST['insupd']))
	 {	
	    $struct = array(
					"id" => $_POST['id'], 
					"flag" => $_POST['flag']=='on'? 1: 0, 
					"descr" => $_POST['descr'], 
					"originalfile" => $_POST['originalfile'],
					"savedfile" => $_POST['savedfile'], 
					"descrfull" => $_POST['descrfull'],
					"uuid" => $_POST['uuid'],
					"link" => $_POST['link']);
			if ( $_POST['id']==0){
				if( false == ($lanbilling->save("insupdServFuncs", $struct, true, array("getServFuncs"))) )
					{
						echo "({ success: false })";
					} else {
						echo "({ success: true })";
					}
			}
			else{
				if( false == ($lanbilling->save("insupdServFuncs", $struct, false, array("getServFuncs"))) )
				{
					echo "({ success: false })";
				} else {
					echo "({ success: true })";
				}
			}	
	 }
	 
	 

}
else{
	$tpl = new HTML_Template_IT(TPLS_PATH);
	$tpl->loadTemplatefile("service_functions.tpl", true, true);
	$tpl->touchBlock("__global__");
	$localize->compile($tpl->get(), true);
}

?>
