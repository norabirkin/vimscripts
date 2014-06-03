<?php
//if (!session_is_registered("auth")) exit;
if(!isset($_SESSION["auth"])) {
	exit;
}
if(!isset($_SESSION["auth"]["authorized"])) {
	exit;
}
if($_SESSION["auth"]["authorized"] != true) {
	exit;
}

if (isset($_POST['async_call'])) {


if (isset($_POST['report']) && !$_POST['download']){
	if((integer)$_POST['docid'] == 0) {
		echo "({ success: false, error: { reason: Unknown document template } })";
	}

	$struct = array(
		"period" => $lanbilling->formatDate($_POST['timeperiod'], 'Ym'),
		"docid"  => (integer)$_POST['docid'],
		"date"   => 0,
		"summ"   => 0,
		"grp"    => 0,
		"ugrp"   => $_POST['include_group'] == 1 ? (integer)$_POST['usergroupid'] : 0, 
		"uid"    => 0,
		"agrmid" => 0,
		"oper"   => 0,
		"num"    => 0
	);

	$flt = array();
	
	if($_POST['include_group'] == 2){
		$flt['notgroups'] = (integer)$_POST['usergroupid'];
	} 
	else if($_POST['include_group'] == 1){ 
		$flt['ugroups'] = (integer)$_POST['usergroupid'];
	}

	if($_POST['onfly'] == 7){
		$flt['code'] =  $_POST['f_code'];
		$flt['receipt'] =  $_POST['f_receipt'];
		$flt['category'] =  (integer)$_POST['f_category'];
	}
	
	if($_POST['documentperiod'] == 0){
		$flt['dtfrom'] = $lanbilling->formatDate($_POST['selectedmonthyear'] . $_POST['selectedmonth'] . '01', 'Ymd');
	}
	
	if($_POST['documentperiod'] == 1){
		$flt['dtfrom'] = $lanbilling->formatDate($_POST['timeperiod'], 'Ymd');
		$flt['dtto'] = $lanbilling->formatDate($_POST['timeperiodtill'], 'Ymd');
	}
	
	if($_POST['documentperiod'] == 2){
		$flt['dtfrom'] = $lanbilling->formatDate($_POST['selectedday'], 'Ymd');
	}
	
	$struct['period'] = $lanbilling->formatDate($flt['dtfrom'], 'Ym');
	
	$lb = $lanbilling->cloneMain(array('query_timeout'=>18000));


    if(isset($_POST['searchtpl']) && !empty($_POST['searchtpl'])) {
        foreach($_POST['searchtpl'] as $item) {
            $t = explode('.', $item['property']);
            $_filter['searchtempl'][] = array(
                "tplname"   => '',
                "tablename" => $t[0],
                "field"     => $t[1],
                "condition" => $item['condition'],
                "value"     => $item['value'],
                "logic"     => $item['logic']
            );
        }
        $flt = array_merge($_filter,$flt);
	}
	
	if (isset($_POST['enqueueItem'])) {
		
		require_once( dirname(__FILE__) . DIRECTORY_SEPARATOR . 'documentsQueueManager.php' );
		$documentsQueue = new documentsGenerationQueueManager(array('lanbilling' => $lanbilling, 'localize' => $lanbilling->localize));
		$documentsQueue->addDocumentGenerationTask(array(
			'val' => (object) $struct, 
			'flt' => (object) $flt
		));
		
	} else {

		if( false != ($lb->save("genOrderGetFile", $struct,false,null, $flt)) ) {
       	 	if ($_POST['checkbox_excel'] == 1){
				// Store file for future request to download with specific headers
				$fuid = substr(md5($lb->manager . date('mdHis')), 0, 12);
				$ext = (trim($_POST['download_type']) != 'application/octet-stream' && ( ($extbymime = LBDownloadHelper::getExtensionByMimeType($_POST['download_type'])) !== null ))
					? LBDownloadHelper::getExtensionByMimeType($_POST['download_type'])
					: LBDownloadHelper::getFileExtension($_POST['doctemplate']);
				if ($lb->MSWin) $namefile = $fuid . "report.".$ext;
				if ($lb->UNIX)  $namefile = "/" . $fuid . "report.".$ext;
				$pathfile = $lb->systemTemporary() . $namefile;
				$handler  = fopen($pathfile, 'wb');
				fwrite($handler, $lb->saveReturns->ret);
				fclose($handler);
				echo "({ success: true, filename: ".JEncode( $namefile, $lb)." })";
        	} else { // WARNING! Clear HTML here
            	echo $lb->saveReturns->ret;
        	}
		}
		else {
			$error = $lb->soapLastError();
			
			if(preg_match("~Cannot open~", $error->detail)) {
				$filename = str_replace('Cannot open ' , '' , str_replace(' for reading' , '' , $error->detail));
				$error->detail =  $localize->get('Cannot open file') . ' ' . $filename;
			}
			
			if(preg_match("~Document with empty template~", $error->detail)) {
				$error->detail =  $localize->get('Unable to generate document with empty template');
			}
			
			echo "({ success: false, errors: { reason: " . JEncode( $error->detail, $lb) . " } })";
		}
	}
}

if (isset($_POST['getreport'])){
    if ( file_exists($lanbilling->systemTemporary().$_POST['getreport']) ){
        $fileName = $_POST['selectedday'] . '_report.' . LBDownloadHelper::getExtension($lanbilling->systemTemporary().$_POST['getreport']);
        LBDownloadHelper::download($lanbilling->systemTemporary().$_POST['getreport'], $fileName);
    }else{
        getFileError($lanbilling, $localize, 1, $lanbilling->systemTemporary().$_POST['getreport']);
    }
}

// ------------------------------------Get all reports from documents table------------------------------
if(isset($_POST['getstandartreports'])){
	$_tmp = array();
	$_filter = array("onfly" => 2);
	if( false !== ($result = $lanbilling->get("getDocuments", array("flt" => $_filter, "md5" => $lanbilling->controlSum($_filter)))) )
	{
		if(!$result) $result = array();
		if(!is_array($result)) {
			$result = array($result);
		}
		array_walk($result, create_function('$item, $key, $_tmp', 'if (!$item->hidden) {$_tmp[0][] = (array)$item;}'), array(&$_tmp));
	} else {
		$error = $lb->soapLastError();
		echo "({ success: false, errors: { reason: " . JEncode( $error->detail, $lb) . " } })";
    }
    
    $_filter = array("onfly" => 7);
    if( false !== ($result2 = $lanbilling->get("getDocuments", array("flt" => $_filter, "md5" => $lanbilling->controlSum($_filter)))) )
    {
	if(!$result2) $result2 = array();
    	if(!is_array($result2)) {
    		$result2 = array($result2);
    	}
    	array_walk($result2, create_function('$item, $key, $_tmp', 'if (!$item->hidden) {$_tmp[0][] = (array)$item;}'), array(&$_tmp));
    } else {
    	$error = $lb->soapLastError();
    	echo "({ success: false, errors: { reason: " . JEncode( $error->detail, $lb) . " } })";
    }

	if(sizeof($_tmp) > 0) {
		echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
	}
	else echo '({ "results": "" })';
}
// -----------------------------------------------------------------


// ------------------------------------Get all groups list-------------------------------------------------------------------------
if(isset($_POST['getgroups'])){
	if( false == ($result = $lanbilling->get("getUserGroups", array("flt" => array()))) ) {

			echo "({ success: false, errors: { reason: 'There was an error while getting reports functions list. Look server logs for details.' } })";
		}
		else {

		if(!is_array($result)) {

				$result = array($result);
			}

			$_tmp = array();

			foreach($result as $obj)
			{
				$_tmp[] = array(
					"groupid" => $obj->usergroup->groupid,
					"name" => $obj->usergroup->name
					);
			}

			if(sizeof($_tmp) > 0)
				echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
			else echo "({ results: '' })";
		}
}


// ------------------------------------Get all agents list-------------------------------------------------------------------------
if(isset($_POST['getagents'])){
	if( false == ($result = $lanbilling->get("getAgents")) ) {
        echo "({ success: false, errors: { reason: 'There was an error while getting reports functions list. Look server logs for details.' } })";
    }
    else {
		if(!is_array($result)) {
            $result = array($result);
        }
        $_tmp = array();
        foreach($result as $obj) {
            $_tmp[] = array(
                "id" => $obj->id,
                "name" => $obj->name
            );
        }
        if(sizeof($_tmp) > 0)
            echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
        else echo "({ results: '' })";
	}
}

// ------------------------------------Get all reports list-------------------------------------------------------------------------
  if(isset($_POST['getallcontent'])){
		if( false == ($result = $lanbilling->get("getUserReports")) ) {
			echo "({ success: false, errors: { reason: 'There was an error while getting reports functions list. Look server logs for details.' } })";
		}
		else {
				if(!is_array($result)) {

				$result = array($result);
			}

			$_tmp = array();

			foreach($result as $obj)
			{
				$_tmp[] = array(
					"reportid" => $obj->report->reportid,
					"reportname" => $obj->report->reportname,
					"reportdesc" => $obj->report->reportdesc,
					"reportact" => $obj->report->reportact,
					"mainfile"=> $obj->report->mainfile,
					"files"=>$obj->files
					);
			}
			if(sizeof($_tmp) > 0)
				echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
			else echo "({ results: '' })";
		}
   }


//--------------------------------------Get one record----------------------------------------------------------------------------
  if(isset($_POST['getcontent'])){
		if( false == ($result = $lanbilling->get("getUserReport",array("id"=>$_POST['reportid']))) ) {

			echo "({ success: false, errors: { reason: 'There was an error while getting reports functions list. Look server logs for details.' } })";
		}
		else {

			if(!is_array($result)) {
				$result = array($result);
			}

			$_tmp = array();
			foreach($result as $obj)
			{
				$_tmp[] = array(
					"reportid" => $obj->report->reportid,
					"reportname" => $obj->report->reportname,
					"reportdesc" => $obj->report->reportdesc,
					"reportact" => $obj->report->reportact,
					"files"=>$obj->files);
			}
			// $lanbilling->ErrorHandler(__FILE__, "getTrustedHosts: [Result]=[".JEncode($_tmp, $lanbilling)."]", __LINE__);

			if(sizeof($_tmp) > 0)
				echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
			else echo "({ results: '' })";
		}
   }
//End Get one record
//-----------------------------------------------------------------------------------------------------------------------------------

//--------------------------------------Insert/Update reports --------------------------------------------------------------------
if(isset($_POST['insupd'])){

//Upload Files
$uploaddir = './users_reports/';
if (move_uploaded_file($_FILES['mainfile']['tmp_name'], $uploaddir.$_FILES['mainfile']['name'])) {
	  $struct ['files'][0]= array(
					 'fileid' =>0,
					 'reportid'=>$_POST['reportid'],
					 'filename'=> $_FILES['mainfile']['name'],
					 'ismain'=> 1
				);

} else {
    echo '({ failure: false })';return;
}
$name='additionalfile';
for ($i=0;$_FILES[$name.$i]['size']!=0;$i++){
	if (move_uploaded_file($_FILES[$name.$i]['tmp_name'], $uploaddir.$_FILES[$name.$i]['name'])) {
	$struct ['files'][$i+1]= array(
					 'fileid' =>0,
					 'reportid'=>$_POST['reportid'],
					 'filename'=> $_FILES[$name.$i]['name'],
					 'ismain'=> 0
				);

} else {
    //print "There some errors!";
}
}//End Upload Files
	    $struct ['report']= array(
					 'reportid' =>$_POST['reportid'],
					 'reportname'=>$_POST['reportname'],
					 'reportdesc'=> $_POST['reportdesc'],
					 'reportact'=> 1
				);

			if( false == ($lanbilling->save("insupdUserReport", $struct, ((integer)$_POST['reportid'] == 0) ? true : false, array("getUserReports"))) )
			{
				echo '({ success: false })';
				return false;
			}
			else {
				echo '({ success: true })';
			}
	 }
//End Insert/Update reports

//----------------------------------------------Delete Reports--------------------------------------------------------------------

if(isset($_POST['delrow']))
	{
		if(isset($_POST['id'])) $id=$_POST['id'];
		else return false;

		if( false == ($lanbilling->delete("delUserReport", array("id" => $id), array("getUserReports"))) )
			{
				echo "false";
				return false;
			}
	  }
//-----------------------------------------------------------------------------------------------------------------------------------
}
else{
	$tpl = new HTML_Template_IT(TPLS_PATH);
	$tpl->loadTemplatefile("user_reports.tpl", true, true);
	$tpl->touchBlock("__global__");
	$tpl->setVariable('AUTOLOAD', (integer)$lanbilling->Option('autoload_accounts'));
	$localize->compile($tpl->get(), true);
}

//class lbUserReports extends LANBilling {
//
//    public $_filter  = FALSE;
//    public $_input   = FALSE;
//    public $output   = FALSE;
//    public $localize = FALSE;
//
//    function __construct($localize = false)
//    {
//        parent::__construct();
//        $this->localize = $localize;
//    }
//}
//
///**
// * Processing queryes from interface
// */
//if(isset($_POST['async_call']))
//{
//    try  {
//        $userReports = new lbUserReports($localize);
//        //echo $userReports->handling();
//    }  catch (Exception $e) {
//
//    }
//}
//else
//{
//	$tpl = new HTML_Template_IT(TPLS_PATH);
//	$tpl->loadTemplatefile("user_reports.tpl", true, true);
//	$tpl->touchBlock('__global__');
//    $tpl->setVariable('AUTOLOAD', (integer)$lanbilling->Option('autoload_accounts'));
//	$localize->compile($tpl->get(), true);
//}
