<?php
/**
 * SBBS knowledge database system
 * Helps clients to view and understand operator's knowledges
 */

// Load SBSS classes
include_once("knowledge.class.php");
include_once("sbssFiles.class.php");
// Create sbss classes
$sbss = new Knowledge($lanbilling->descriptor);
$sbss->initSettings();

// Identifying request types for the future actions
switch( true )
{
	// If there was request to edit post from knowledge item
	case (isset($_POST["editPostId"]) && $_POST["editPostId"] > 0):
		if(isset($_POST["save"]) && saveSelectedPost($sbss))
			showKnowledgePosts($sbss);
		else editKnowledgePost($sbss);
	break;
	
	// If there was request to remove post from ticket
	case (isset($_POST["dropPostId"])):
		deleteKnowledgePost($sbss);
		showKnowledgePosts($sbss);
	break;
	
	// Show posts list
	case (!isset($_POST["save"]) && isset($_POST["itemId"])):
		if($_POST["itemId"] == 0) createKnowledge($sbss);
		else showKnowledgePosts($sbss);
	break;
	
	default: 
		if(isset($_POST["save"]) && isset($_POST["itemId"]))
		{
			if(!saveKnowledge($sbss))
			{
				if($_POST["itemId"] == 0) createKnowledge($sbss);
				else showKnowledgePosts($sbss);
			}
			else showKnowledges($sbss);
		}
		else showKnowledges($sbss);
}


/**
 * Build and show knowledges list for the manager
 * @param	object knowledge class
 */
function showKnowledges( &$sbss )
{
	$tpl = new HTML_Template_IT(TPLS_PATH);
	$tpl->loadTemplatefile("sbssKnowledge.tpl",true,true);
	
	// Ther was request to find manager as author. Set search key according search type
	if(isset($_POST["manId"]) && is_numeric($_POST["manId"]))
	{
		$_POST["srchKey"] = $_POST["manId"];
		$_POST["manForType"] = 2;
	}
	
	// Field visualization if manager is selected
	if($_POST["srchKey"] > -1)
	{
		$tpl->touchBlock("stringDisable");
		$tpl->touchBlock("stringNone");
		$tpl->touchBlock("manForSel-" . $_POST["manForType"]);
	}
	// Field visualization if manager is not selected
	else
	{
		$tpl->touchBlock("manForDisable");
		$tpl->touchBlock("manForNone");
		if($_POST["srchKey"] == -2 && !empty($_POST["clientId"]))
			$tpl->setVariable("STRINGVALUE", htmlspecialchars($sbss->settings->clientList[$_POST["clientId"]]["name"], ENT_QUOTES));
		else $tpl->setVariable("STRINGVALUE", htmlspecialchars($_POST["string"], ENT_QUOTES));
	}
	
	// Show button to create new knowledge item
	$tpl->setCurrentBlock("newTicket");
	$tpl->syncBlockLocalize("newTicket");
	$tpl->parseCurrentBlock();
	
	switch( true )
	{
		// Looking for manager
		case ($_POST["srchKey"] > -1):
			// Manager is author
			$authorType = 0;
			$authorId = $_POST["srchKey"];
			$responsible = null;
		break;
		
		// Looking for the context string
		case ($_POST["srchKey"] == -1):
			$string = $_POST["string"];
		// Reset to first value if search control is set to not allowed value
		default:
			$authorType = null;
			$authorId = null;
			$responsible = null;
			$_POST["srchKey"] = -1;
	}
	
	if(empty($sbss->settings->requestClasses))
	{
		$tpl->setCurrentBlock("ClassNone");
		$tpl->syncBlockLocalize("ClassNone");
		$tpl->parseCurrentBlock();
		$tpl->syncBlockLocalize("__global__");
		$tpl->show();
		return false;
	}
	
	$tpl->setCurrentBlock("StatusAndGroups");
	$tpl->syncBlockLocalize("StatusAndGroups");
	// Show request classes group by
	if(isset($_POST["group_class"])) $tpl->setVariable("GROUPCLASSVALUE", $_POST["group_class"]);
	else $tpl->setVariable("GROUPCLASSVALUE", -1);
	
	// Check and set page variable
	if(!isset($_POST["page"]) || $_POST["page"] <= 0) $_POST["page"] = 1;
	
	if(isset($_POST["group_class"]))
	{
		$groups = explode(",", $_POST["group_class"]);
		// Get knowledge list group by classes
		$knowledges = $sbss->getKnowledges($string, $authorType, $authorId, $groups, 0, 1, $_POST["page"]);
		
		$tpl->touchBlock("groupClChecked");
		foreach($sbss->settings->requestClasses as $key => $arr)
		{
			$tpl->setCurrentBlock("groups_title");
			$tpl->syncBlockLocalize("groups_title");
			$tpl->setVariable("THISCLASSID", $key);
			$tpl->setVariable("THISGROUPNAME", $arr["descr"]);
			$tpl->setVariable("THISGROUPCOLOR", $arr["color"]);
			
			if(!isset($sbss->settings->managerList[$arr["responsible"]]["name"]))
				$tpl->setVariable("THISMANNAME", sprintf("<i>(%s)</i>", NOT_SET));
			else $tpl->setVariable("THISMANNAME", $sbss->settings->managerList[$arr["responsible"]]["name"]);
			$tpl->parseCurrentBlock();
			// Print knowledge Row
			if($_POST["group_class"] == $key) knowledgeItems($tpl, $sbss, $knowledges);
			$tpl->parse("groups");
		}
	}
	// If there is no flag to group by request's classes
	else
	{
		$knowledges = $sbss->getKnowledges($string, $authorType, $authorId, 0, 0, 1, $_POST["page"]);
		// Print knowledge Row
		knowledgeItems($tpl, $sbss, $knowledges);
	}
	
	// Create managers list to search selector on the form
	foreach($sbss->settings->managerList as $key => $arr)
	{
		$tpl->setCurrentBlock("searchByMan");
		$tpl->setVariable("SRCHMANID", $key);
		$tpl->setVariable("SRCHMANNAME", $arr["name"]);
		// If search key is the same as manager id, than mark as selected
		if($_POST["srchKey"] != "" && $_POST["srchKey"] == $key) $tpl->touchBlock("searchSelMan");
		$tpl->parseCurrentBlock();
	}
	
	$tpl->touchBlock("searchSel" . $_POST["srchKey"]);
	$tpl->syncBlockLocalize();
	$tpl->show();
} // end showKnowledges()


/**
 * Parse items list returned by query
 * @param	object template
 * @param	object sbss
 * @param	array, items list
 */
function knowledgeItems( &$tpl, &$sbss, &$knowledges )
{
	if(empty($knowledges))
	{
		$tpl->setCurrentBlock("item_empty");
		$tpl->syncBlockLocalize("item_empty");
		$tpl->parseCurrentBlock();
		return;
	}

	$tpl->setCurrentBlock("list_title");
	$tpl->syncBlockLocalize("list_title");
	
	// Page line to create
	if($_POST["page"] > $sbss->pageBlock)
	{
		$tpl->setCurrentBlock("pBack");
		$tpl->setVariable("PAGE", $_POST["page"]);
		$tpl->parse("pBack");
	}
	
	for($p = ($_POST["page"] - ($_POST["page"] % $sbss->pageBlock)), $off = min(($p + $sbss->pageBlock), $sbss->pages); $p <= $off; $p++)
	{
		if($p == 0) $p++;
		
		if($_POST["page"] != $p)
		{
			$tpl->setCurrentBlock("pGoto");
			$tpl->setVariable("PAGE", $p);
			$tpl->parseCurrentBlock();
		}
		else
		{
			$tpl->setCurrentBlock("pSel");
			$tpl->setVariable("PAGE", $p);
			$tpl->parseCurrentBlock();
		}
		
		$tpl->parse("pages");
	}
	
	$tpl->setVariable("COUNTOPENED", $sbss->totalRows);
	$tpl->parse("list_title");
	
	// Parse items array
	foreach($knowledges as $arr)
	{
		if(!isset($sbss->settings->requestClasses[$arr["class"]]["color"]) || 
			empty($sbss->settings->requestClasses[$arr["class"]]["color"]))
		{
			$sbss->settings->requestClasses[$arr["class"]]["color"] = "ffffff";
		}
		
		if(!isset($sbss->settings->statusList[$arr["status"]]["descr"]))
		{
			$sbss->settings->statusList[$arr["status"]]["descr"] = "000000";
		}
		
		$tpl->setCurrentBlock("item");
		$tpl->setVariable("THISTID", $arr["id"]);
		$tpl->setVariable("TRCOLOR", $sbss->settings->requestClasses[$arr["class"]]["color"]);
		$tpl->setVariable("THISTITLE", empty($arr["name"]) ? SUBJECTEMPTY : $arr["name"]);
		
		if($arr["aType"] == 0)
		{
			$tpl->setVariable("THISAUTHOR", $sbss->settings->managerList[$arr["aId"]]["name"]);
			$tpl->touchBlock("authorManager");
		}
		else
		{
			$tpl->setVariable("THISAUTHOR", $sbss->settings->clientList[$arr["aId"]]["name"]);
			$tpl->touchBlock("authorClient");
		}
		
		$tpl->setVariable("THISPERSONID", $arr["aId"]);
		$tpl->setVariable("THISAUTHORTIME", $arr["created"]);
		if(empty($sbss->settings->requestClasses[$arr["class"]]["descr"]))
			$tpl->setVariable("THISCLASSNAME", UNDEFINED);
		else $tpl->setVariable("THISCLASSNAME", $sbss->settings->requestClasses[$arr["class"]]["descr"]);
		
		if($arr["respType"] == 0)
			$tpl->setVariable("THISANSWERNAME", $sbss->settings->managerList[$arr["respId"]]["name"]);
		
		$tpl->setVariable("THISANSWERTIME", $arr["last"]);
		$tpl->syncBlockLocalize("item");
		$tpl->parse("item");
	}
} // end knowledgeItems()


/**
 * Create new knowledge subject
 * @param	object knowledge class
 */
function createKnowledge( &$sbss )
{
	$tpl = new HTML_Template_IT(TPLS_PATH);
	$tpl->loadTemplatefile("sbssKnowledgePosts.tpl",true,true);
	$tpl->syncBlockLocalize();
	$tpl->setVariable("ITEMID", 0);
	
	// Print error message if they ware
	if(!empty($sbss->errors))
	{
		$Error = true;
		foreach($sbss->errors as $errorText)
		{
			$tpl->setCurrentBlock("erroRow");
			$tpl->syncBlockLocalize("erroRow");
			$tpl->setVariable("ERRORMESSAGE", $errorText);
			$tpl->parseCurrentBlock();
		}
		
		$tpl->syncBlockLOcalize("errorShow");
		$tpl->parse("errorShow");
	}
	
	// Show Controls
	$tpl->touchBlock("allowAddPost");
	$tpl->setCurrentBlock("saveData");
	$tpl->syncBlockLocalize("saveData");
	$tpl->parseCurrentBlock();
	$tpl->setCurrentBlock("attachData");
	$tpl->syncBlockLocalize("attachData");
	$tpl->parseCurrentBlock();
	
	$tpl->setCurrentBlock("newPost");
	$tpl->syncBlockLocalize("newPost");
	
	// Request classes array
	if(sizeof($sbss->settings->requestClasses) > 0)
	{
		foreach($sbss->settings->requestClasses as $key => $arr)
		{
			$tpl->setCurrentBlock("requestList");
			$tpl->setVariable("REQUESTID", $key);
			$tpl->setVariable("REQUESTNAME", $arr["descr"]);
			if($_POST["reqClass"] == $key) $tpl->touchBlock("requestListSel");
			$tpl->parseCurrentBlock();
		}
	}
	
	$tpl->setVariable("TICKETSUBJ", $_POST["name"]);
	$tpl->setVariable("POSTTEXT", $_POST["text"]);
	
	if(!empty($_POST["fileDescr"]))
		$tpl->setVariable("FILEDESCR", $_POST["fileDescr"]);
	else $tpl->touchBlock("attachFormNone");
	
	if(isset($_POST["spec"])) $tpl->touchBlock("isSpec");
	
	$tpl->syncBlockLocalize("fullPostControl");
	$tpl->parse("fullPostControl");
	$tpl->setVariable("ROWSPANVALUE", 3);
	$tpl->parse("newPost");
	$tpl->show();
} // end createKnowledge()


/**
 * Show knowledge item posts with attached files
 * @param	object knowledge class
 */
function showKnowledgePosts( &$sbss )
{
	$tpl = new HTML_Template_IT(TPLS_PATH);
	$tpl->loadTemplatefile("sbssKnowledgePosts.tpl",true,true);
	$tpl->syncBlockLocalize();
	$tpl->setVariable("ITEMID", $_POST["itemId"]);
	
	// Print error message if they ware
	if(!empty($sbss->errors))
	{
		$Error = true;
		foreach($sbss->errors as $errorText)
		{
			$tpl->setCurrentBlock("erroRow");
			$tpl->syncBlockLocalize("erroRow");
			$tpl->setVariable("ERRORMESSAGE", $errorText);
			$tpl->parseCurrentBlock();
		}
		
		$tpl->parse("errorShow");
	}
	
	// Get selected knowledge information
	$knowledge = $sbss->getKnowledges(null, null, null, null, null, null, 0, $_POST["itemId"]);
	
	// Show Controls
	$tpl->touchBlock("allowAddPost");
	$tpl->setCurrentBlock("saveData");
	$tpl->syncBlockLocalize("saveData");
	$tpl->parseCurrentBlock();
	$tpl->setCurrentBlock("attachData");
	$tpl->syncBlockLocalize("attachData");
	$tpl->parseCurrentBlock();
	
	$tpl->setCurrentBlock("postsList");
	$tpl->syncBlockLocalize("postsList");
	$tpl->setVariable("TICKET_TITLE", $knowledge[0]["name"]);
	$tpl->setVariable("STATUSNAME", $sbss->settings->statusList[$knowledge[0]["status"]]["descr"]);
	
	$posts = $sbss->getKnowledgePosts($_POST["itemId"]);
	if(empty($posts))
	{
		$tpl->setCurrentBlock("rowPostEmpty");
		$tpl->syncBlockLocalize("rowPostEmpty");
		$tpl->parseCurrentBlock();
	}
	else
	{
		foreach($posts as $key => $arr)
		{
			$tpl->setCurrentBlock("rowTitle");
			$tpl->syncBlockLocalize("rowTitle");
			
			if($arr["aType"] != 1)
				$tpl->setVariable("AUTHORNAME", $sbss->settings->managerList[$arr["aId"]]["name"]);
			else $tpl->setVariable("AUTHORNAME", $sbss->settings->clientList[$arr["aId"]]["name"]);
			
			$tpl->setVariable("CREATEDDATE", $arr["created"]);
			$tpl->setVariable("THISPOSTID", $key);
			$tpl->parseCurrentBlock();
			
			if($arr["spec"] > 0)
			{
				$tpl->setCurrentBlock("rowSpec");
				$tpl->syncBlockLocalize("rowSpec");
				$tpl->setVariable("SPECTEXT", $arr["text"]);
				$tpl->setCurrentBlock();
			}
			else
			{
				$tpl->setCurrentBlock("rowMess");
				$tpl->syncBlockLocalize("rowMess");
				$tpl->setVariable("ROWTEXT", $arr["text"]);
				$tpl->setCurrentBlock();
			}
			
			// Check for the attached files
			if(!empty($arr["attach"]))
			{
				$tpl->setCurrentBlock("rowFile");
				$tpl->syncBlockLocalize("rowFile");
				$tpl->setVariable("ISATTACHED", sizeof($arr["attach"]));
				
				foreach($arr["attach"] as $fKey => $fArr)
				{
					$tpl->setCurrentBlock("rowFileItem");
					$tpl->setVariable("THIS_FL_TID", $_POST["itemId"]);
					$tpl->setVariable("THIS_FL_ID", $fKey);
					$tpl->setVariable("THIS_FL_CREATED", $fArr["created"]);
					$tpl->setVariable("THIS_FL_EDIT", $fArr["edited"]);
					
					if($fArr["aType"] == 0)
						$tpl->setVariable("THIS_FL_AUTHOR", $sbss->settings->managerList[$fArr["aId"]]["name"]);
					else $tpl->setVariable("THIS_FL_AUTHOR", $sbss->settings->clientList[$fArr["aId"]]["name"]);
					
					$tpl->setVariable("THIS_FL_DESCR", $fArr["descr"]);
					$tpl->setVariable("THIS_FL_FILE", $fArr["name"]);
					$tpl->setVariable("THIS_FL_SIZE", sprintf("%.02f", $fArr["size"] / 1024));
					$tpl->parseCurrentBlock();
				}
				
				$tpl->parse("rowFile");
			}
			
			$tpl->parse("row");
		}
	}
	
	$tpl->parse("postsList");
	$tpl->setCurrentBlock("newPost");
	$tpl->syncBlockLocalize("newPost");
	// Request classes array
	if(sizeof($sbss->settings->requestClasses) > 0)
	{
		foreach($sbss->settings->requestClasses as $key => $arr)
		{
			$tpl->setCurrentBlock("requestList");
			$tpl->setVariable("REQUESTID", $key);
			$tpl->setVariable("REQUESTNAME", $arr["descr"]);
			if($Error)
			{
				if($_POST["reqClass"] == $key) $tpl->touchBlock("requestListSel");
			}
			else
			{
				if($knowledge[0]["class"] == $key) $tpl->touchBlock("requestListSel");
			}
			$tpl->parseCurrentBlock();
		}
	}
	
	if($Error)
	{
		$tpl->setVariable("TICKETSUBJ", htmlspecialchars($_POST["name"], ENT_QUOTES));
		$tpl->setVariable("POSTTEXT", htmlspecialchars($_POST["text"], ENT_QUOTES));
	}
	else $tpl->setVariable("TICKETSUBJ", htmlspecialchars($knowledge[0]["name"], ENT_QUOTES));
	
	if(!empty($_POST["fileDescr"]))
		$tpl->setVariable("FILEDESCR", $_POST["fileDescr"]);
	else $tpl->touchBlock("attachFormNone");
	
	if(isset($_POST["spec"])) $tpl->touchBlock("isSpec");
	
	$tpl->syncBlockLocalize("fullPostControl");
	$tpl->parse("fullPostControl");
	
	$tpl->setVariable("ROWSPANVALUE", 3);
	$tpl->parse("newPost");
	$tpl->show();
} // end showKnowledgePosts()


/**
 * Show form to edit selected knowledge base post
 * @param	object knowledge class
 */
function editKnowledgePost( &$sbss )
{
	$tpl = new HTML_Template_IT(TPLS_PATH);
	$tpl->loadTemplatefile("sbssKnowledgePosts.tpl",true,true);
	$tpl->syncBlockLocalize();
	$tpl->setVariable("ITEMID", $_POST["itemId"]);
	$tpl->setVariable("NEWKNOWLEDGE", EDITKNOWLEDGE);
	
	// Print error message if they ware
	if(!empty($sbss->errors))
	{
		$Error = true;
		foreach($sbss->errors as $errorText)
		{
			$tpl->setCurrentBlock("erroRow");
			$tpl->syncBlockLocalize("erroRow");
			$tpl->setVariable("ERRORMESSAGE", $errorText);
			$tpl->parseCurrentBlock();
		}
		
		$tpl->parse("errorShow");
	}
	
	// Set hidden value to post id
	$tpl->setCurrentBlock("EditHid");
	$tpl->setVariable("EDITPOST", $_POST["editPostId"]);
	$tpl->parseCurrentBlock();
	
	// Get selected knowledge information
	$knowledge = $sbss->getKnowledges(null, null, null, null, null, null, 0, $_POST["itemId"]);
	// Current post data
	$posts = $sbss->getKnowledgePosts($_POST["itemId"], $_POST["editPostId"]);
	
	// Show Controls
	$tpl->touchBlock("allowAddPost");
	$tpl->setCurrentBlock("saveData");
	$tpl->syncBlockLocalize("saveData");
	$tpl->parseCurrentBlock();
	$tpl->setCurrentBlock("attachData");
	$tpl->syncBlockLocalize("attachData");
	$tpl->parseCurrentBlock();
	
	$tpl->setCurrentBlock("newPost");
	
	$tpl->setCurrentBlock("nonePostControl");
	$tpl->syncBlockLocalize("nonePostControl");
	$tpl->parseCurrentBlock();
	
	if($Error)
	{
		$tpl->setVariable("TICKETSUBJ", htmlspecialchars($_POST["name"], ENT_QUOTES));
		$tpl->setVariable("POSTTEXT", htmlspecialchars($_POST["text"], ENT_QUOTES));
	}
	else
	{
		$tpl->setVariable("TICKETSUBJ", htmlspecialchars($knowledge[0]["name"], ENT_QUOTES));
		$tpl->setVariable("POSTTEXT", htmlspecialchars($posts[$_POST["editPostId"]]["text"], ENT_QUOTES));
	}
	
	if(!empty($posts[$_POST["editPostId"]]["attach"]))
	{
		foreach($posts[$_POST["editPostId"]]["attach"] as $fKey => $fArr)
		{
			$tpl->setCurrentBlock("fileToEdit");
			$tpl->setVariable("EDITFILEID", $fKey);
			$tpl->parseCurrentBlock();
			
			$tpl->setCurrentBlock("fileInfo");
			$tpl->syncBlockLocalize("fileInfo");
			$tpl->setVariable("THISCRMFILEDESRC", $fArr["descr"]);
			$tpl->setVariable("THISFILEORIGINALNAME", $fArr["name"]);
			$tpl->setVariable("THISFILESIZE", sprintf("%.02f", $fArr["size"] / 1024));
			$tpl->parseCurrentBlock();
		}
	}
	else $tpl->touchBlock("nonePostControl");
	
	if($posts[$_POST["editPostId"]]["spec"] == 1)
		$tpl->touchBlock("isSpec");
	
	if(!empty($_POST["fileDescr"]))
		$tpl->setVariable("FILEDESCR", $_POST["fileDescr"]);
	else $tpl->touchBlock("attachFormNone");
	
	$tpl->setVariable("ROWSPANVALUE", 3);
	$tpl->syncBlockLocalize("newPost");
	$tpl->parse("newPost");
	
	$tpl->show();
} // end editKnowledgePost()


/**
 * This function save new Knowledge item with new post or add new post to the existing
 * SBSS class function need data structure array to save to DB
 * @param	object sbss class
 */
function saveKnowledge( &$sbss )
{
	$sbssFiles = new SBSSFiles($sbss->descriptor);
	$sbssFiles->settings = $sbss->settings;
	
	if(empty($_POST["name"]))
	{
		$sbss->errors[] = NEEDSUBJECT;
		return false;
	}
	
	if(empty($_POST["text"]))
	{
		$sbss->errors[] = NEEDTEXTBODY;
		return false;
	}
	
	// Before all check if save ixisting or new
	if(empty($_POST["itemId"]))
		define("NEWTICKET", true);
	
	// New Knowledge Entry
	if(defined("NEWTICKET"))
	{
		$Kstruct["aType"] = 0;
		$Kstruct["aId"] = $_SESSION["auth"]["authperson"];
		$Kstruct["created"] = "@NOW()@";
		$Kstruct["last"] = "@created_on@";
		$Kstruct["respType"] = "@author_type@";
		$Kstruct["respId"] = "@author_id@";
	}
	// Existing Knowledge entry
	else
	{
		$Kstruct["aType"] = "@author_type@";
		$Kstruct["aId"] = "@author_id@";
		$Kstruct["created"] = "@created_on@";
		$Kstruct["last"] = "@NOW()@";
		$Kstruct["respType"] = 0;
		$Kstruct["respId"] = $_SESSION["auth"]["authperson"];
	}
	
	$Kstruct["id"] = $_POST["itemId"];
	$Kstruct["name"] = $_POST["name"];
	$Kstruct["class"] = $_POST["reqClass"];
	
	// Start strunsaction
	mysql_query("BEGIN");
	// Save Knowledge information
	if( false == ($KnowledgeId = $sbss->saveKnowledge($Kstruct)) )
	{
		$sbss->errors[] = MESSAGESAVEERROR . ". " . WEBSERVERLOG;
		mysql_query("ROLLBACK");
		return false;
	}
	
	// If not empty message control, than save it to DB
	if(!empty($_POST["text"]))
	{
		$Pstruct["id"] = $_POST["postId"];
		$Pstruct["knowledgeId"] = $KnowledgeId;
		$Pstruct["aType"] = 0;
		$Pstruct["aId"] = $_SESSION["auth"]["authperson"];
		$Pstruct["created"] = "@NOW()@";
		$Pstruct["text"] = $_POST["text"];
		$Pstruct["spec"] = (int) $_POST["spec"];
		
		if( false == ($PostId = $sbss->saveKnowledgePost($Pstruct)) )
		{
			$sbss->errors[] = MESSAGESAVEERROR . ". " . WEBSERVERLOG;
			mysql_query("ROLLBACK");
			return false;
		}
	}
	
	// Save attached files on disk if they exists
	switch ($sbssFiles->preUploadCheck("attach"))
	{
		case true:
			foreach($sbssFiles->files as $fileData)
			{
				$Fstructure["name"] = $fileData["name"];
				$Fstructure["size"] = $fileData["size"];
				$Fstructure["knowledgeId"] = $KnowledgeId;
				$Fstructure["postId"] = $PostId;
				$Fstructure["descr"] = $_POST["fileDescr"];
				
				if(isset($fileData["id"]) && !empty($fileData["id"]))
				{
					$Fstructure["id"] = $fileData["id"];
					$Fstructure["edit"] = "@NOW()@";
					$Fstructure["editType"] = 0;
					$Fstructure["editId"] = $_SESSION["auth"]["authperson"];
				}
				else
				{
					$Fstructure["created"] = "@NOW()@";
					$Fstructure["aType"] = 0;
					$Fstructure["aId"] = $_SESSION["auth"]["authperson"];
					$Fstructure["edit"] = "@created_on@";
					$Fstructure["editType"] = "@author_type@";
					$Fstructure["editId"] = "@author_id@";
				}
				
				if( false != ($fileId = $sbssFiles->attachKnowledgeFile($Fstructure)) )
				{
					$sbssFiles->saveFile($fileData["tmp_name"], $sbss->settings->commonSettings["sbss_ticket_files"] . "/" . sprintf($sbssFiles->knowledgeFileTemplate, $fileId));
				}
				else
				{
					$sbss->errors[] = MESSAGESAVEERROR . ". " . WEBSERVERLOG;
					mysql_query("ROLLBACK");
					return false;
				}
			}
		break;
	}
	
	mysql_query("COMMIT");
	return true;
} // end saveKnowledge()


/**
 * Save edited post to the existing knowledge item
 * @param	object knowledge class
 */
function saveSelectedPost( &$sbss )
{
	$sbssFiles = new SBSSFiles();
	$sbssFiles->settings = $sbss->settings;
	
	// Start strunsaction
	mysql_query("BEGIN");
	if(!empty($_POST["text"]))
	{
		$Pstruct["id"] = $_POST["editPostId"];
		$Pstruct["knowledgeId"] = $_POST["itemId"];
		$Pstruct["text"] = $_POST["text"];
		$Pstruct["spec"] = $_POST["spec"];
		
		if( false == ($PostId = $sbss->saveKnowledgePost($Pstruct)) )
		{
			$sbss->errors[] = MESSAGESAVEERROR . ". " . WEBSERVERLOG;
			mysql_query("ROLLBACK");
			return false;
		}
	}
	
	// Save attached files on disk if they exists
	switch($sbssFiles->preUploadCheck("attach"))
	{
		case true:
			foreach($sbssFiles->files as $fileData)
			{
				$Fstructure["name"] = $fileData["name"];
				$Fstructure["size"] = $fileData["size"];
				$Fstructure["knowledgeId"] = $_POST["itemId"];
				$Fstructure["postId"] = $PostId;
				$Fstructure["descr"] = $_POST["fileDescr"];
				
				if(isset($fileData["id"]) && !empty($fileData["id"]))
				{
					$Fstructure["id"] = $fileData["id"];
					$Fstructure["edit"] = "@NOW()@";
					$Fstructure["editType"] = 0;
					$Fstructure["editId"] = $_SESSION["auth"]["authperson"];
				}
				else
				{
					$Fstructure["created"] = "@NOW()@";
					$Fstructure["aType"] = 0;
					$Fstructure["aId"] = $_SESSION["auth"]["authperson"];
					$Fstructure["edit"] = "@created_on@";
					$Fstructure["editType"] = "@author_type@";
					$Fstructure["editId"] = "@author_id@";
				}
				
				if( false != ($fileId = $sbssFiles->attachKnowledgeFile($Fstructure)) )
				{
					$sbssFiles->saveFile($fileData["tmp_name"], $sbss->settings->commonSettings["sbss_ticket_files"] . "/" . sprintf($sbssFiles->knowledgeFileTemplate, $fileId));
				}
				else
				{
					$sbss->errors[] = MESSAGESAVEERROR . ". " . WEBSERVERLOG;
					mysql_query("ROLLBACK");
					return false;
				}
			}
 		break;
 		
 		case null:
			if(isset($_POST["editPostId"]) && !empty($_POST["editPostId"]) && !empty($_POST["fileId"]))
			{
				foreach($sbssFiles->files as $fileData)
				{
					$Fstructure["knowledgeId"] = $_POST["itemId"];
					$Fstructure["postId"] = $PostId;
					$Fstructure["descr"] = $_POST["fileDescr"];
					$Fstructure["edit"] = "@NOW()@";
					$Fstructure["editType"] = 0;
					$Fstructure["editId"] = $_SESSION["auth"]["authperson"];
					$Fstructure["id"] = $_POST["fileId"];
					
					if( false == ($fileId = $sbssFiles->attachKnowledgeFile($Fstructure)) )
					{
						$sbss->errors[] = MESSAGESAVEERROR . ". " . WEBSERVERLOG;
						mysql_query("ROLLBACK");
						return false;
					}
				}
			}
		break;
 		
 		default: mysql_query("ROLLBACK");
			 return false;
	}
	
	mysql_query("COMMIT");
	return true;
} // end saveSelectedPost()


/**
 * Delete knowledge item's post and attached files
 * @param	object knowledge class
 */
function deleteKnowledgePost( &$sbss )
{
	$sbssFiles = new SBSSFiles();
	$sbssFiles->settings = $sbss->settings;
	
	// Current post data, Need know if post is special
	$posts = $sbss->getKnowledgePosts($_POST["itemId"], $_POST["dropPostId"]);
	
	if(!$sbssFiles->removePostFiles($_POST["dropPostId"]))
		return false;
	
	mysql_query("BEGIN");
	if(!$sbss->deleteKnowledgePost($_POST["dropPostId"]))
	{
		$sbss->errors[] = WHILESAVEERROR . ". " . WEBSERVERLOG;
		mysql_query("ROLLBACK");
		return false;
	}
	
	$sbss->knowledgePostList = array();
	mysql_query("COMMIT");
	return true;
} // end deleteKnowledgePost()
?>
