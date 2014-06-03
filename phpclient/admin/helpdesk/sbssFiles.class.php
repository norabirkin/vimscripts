<?php
/**
 * SBSSFiles class implements all impotatnt function to work with files
 * like CRM storage, or the ticket attachments.
 */

class SBSSFiles {
	
	/**
	 * SBSS settings class, contains all main functions
	 * @var		object
	 */
	var $settings = false;
	
	/**
	 * Allowed file size in bytes, default 3Mb
	 * If 0 than no restriction
	 * @var		integer
	 */
	var $size = 3145728;
	
	/**
	 * Files array to upload
	 * @var		array
	 */
	var $files = false;
	
	/**
	 * TTMS post file tempate name to save on disk
	 * @var		string
	 */
	var $postFileTemplate = "TTMS_%011d";
	
	/**
	 * Knowledge base post file tempate name to save on disk
	 * @var		string
	 */
	var $knowledgeFileTemplate = "KB_%011d";
	
	/**
	 * CRM file tempate name to save on disk
	 * @var		string
	 */
	var $crmFileTemplate = "CRM_%011d";
	
	/**
	 * Contains error messages during execution
	 * @var		array
	 */
	var $errors = array();
	
	/**
	 * Entries on the page
	 * @var		integer
	 */
	var $rows = 50;
	
	/**
	 * Total row found by the search
	 * @var		integer
	 */
	var $totalRows = 0;
	
	/**
	 * Page Block
	 * @var		integer
	 */
	var $pageBlock = 15;
	
	/**
	 * Total pages for the founded result
	 * @var		integer
	 */
	var $pages = 0;
	
	
	
	/**
	 * Main entry function
	 *
	 */
	function SBSSFiles( &$descriptor )
	{
		$this->descriptor = $descriptor;
		
		if(!$this->ifIcluded("sbssSettings.class.php"))
			include_once("sbssSettings.class.php");
		
	} // end initFilter()
	
	
	/**
	 * Initialize setting and options
	 *
	 */
	function initSettings()
	{
		if($this->settings != false)
			return;
		
		$this->settings = new sbssSettings($this->descriptor);
		$this->settings->initCommonOptions();
		$this->settings->initManagers();
	} // end initSettings()
	
	
	/**
	 * This function returns total records for selected item: CRM files or Mail records
	 * Default item is CRM files
	 * @param	integer, item to return. CRM or Mail
	 * 			0 - files
	 * 			1 - mail
	 * @param	integer, = 0 - total value, > 0 - client id
	 */
	function initTotalCRMRecords( $item = 0, $clientId = 0 )
	{
		if($item == 1)
		{
			if( false == ($sql_query = mysql_query(sprintf("SELECT COUNT(*) FROM crm_mail %s", 
				($clientId > 0) ? sprintf("WHERE client_id = %d", $clientId) : ""))) )
			{
				$this->ErrorHandler("Error, Can't get total Mail records: " . mysql_error(), __LINE__);
				return 0;
			}
			
			return mysql_result($sql_query, 0);
		}
		else
		{
			if( false == ($sql_query = mysql_query(sprintf("SELECT COUNT(*) FROM sbss_crm_files %s", 
				($clientId > 0) ? sprintf("WHERE client_id = %d", $clientId) : ""))) )
			{
				$this->ErrorHandler("Error, Can't get total crm file records: " . mysql_error(), __LINE__);
				return 0;
			}
			
			return mysql_result($sql_query, 0);
		}
	} // end initTotalCRMRecords()
	
	
	/**
	 * Create CRM files array using values
	 * @param	string to search in description or file name
	 * @param	integer author id
	 * @param	integer client id
	 * @param	integer records order to select (hardcorded values)
	 * 			1 - original file name
	 * 			2 - by edited date
	 * 			default by record id
	 * @param	integer 1 = descount order
	 * @param	integer page number to get, 0 - all
	 */
	function getCRMFiles( $string = "", $authorId = null, $clientId = null, 
				$orderby = 0, $desc = 0, $page = 0)
	{
		$filter = array();
		
		if(strlen($string) > 0)
			$filter[] = sprintf("(files.original_name LIKE '%%%s%%' OR files.description LIKE '%%%s%%')", $this->escapeQueryString($string), $this->escapeQueryString($string));
		
		if(!is_null($authorId)) $filter[] = sprintf("files.author_id = %d", $authorId);
		if(!is_null($clientId)) $filter[] = sprintf("files.client_id = %d", $clientId);
		
		if( false == ($sql_query = mysql_query(sprintf("SELECT count(*) FROM sbss_crm_files AS files %s",
			(sizeof($filter) > 0) ? "WHERE " . implode(" AND ", $filter) : ""))) )
		{
			$this->ErrorHandler("Error to get crm files array: " . mysql_error(), __LINE__);
			$this->fileList = array();
			return false;
		}
		
		if(mysql_result($sql_query, 0) > 0)
		{
			$this->totalRows = mysql_result($sql_query, 0);
			$this->pages = ceil($this->totalRows / $this->rows);
			
			switch($orderby)
			{
				case 1: $orderby = "files.original_name " . (($desc == 0) ? "" : "DESC"); break;
				case 2: $orderby = "files.edited_on " . (($desc == 0) ? "" : "DESC"); break;
				default: $orderby = "files.id " . (($desc == 0) ? "" : "DESC");
			}
			
			if( false == ($sql_query = mysql_query(sprintf("SELECT files.id, files.client_id, 
							DATE_FORMAT(files.created_on, '%%H:%%i %%d.%%m.%%Y'), 
							files.author_id, 
							DATE_FORMAT(files.edited_on, '%%H:%%i %%d.%%m.%%Y'), 
							files.edited_id, 
							files.original_name, files.size, 
							files.description 
							FROM sbss_crm_files AS files %s GROUP BY id ORDER BY %s %s", 
							(sizeof($filter) > 0) ? "WHERE " . implode(" AND ", $filter) : "", 
							$orderby,
							($page > 0) ? sprintf("LIMIT %d, %d", ($page * $this->rows) - $this->rows, $this->rows) : ""))) )
			{
				$this->ErrorHandler("Error to get crm files array: " . mysql_error(), __LINE__);
				$this->fileList = array();
				return false;
			}
			
			while($row = mysql_fetch_row($sql_query))
			{
				$this->fileList[] = array("id" => $row[0], 
							"name" => $row[6], 
							"clientId" => $row[1], 
							"aId" => $row[3], 
							"created" => $row[2], 
							"edited" => $row[4], 
							"editId" => $row[5], 
							"size" => $row[7],
							"descr" => $row[8]);
			}
		}
		
		return $this->fileList;
	} // end getCRMFiles
	
	
	/**
	 * Create E-Mail files array using values
	 * @param	string to search on mail subject
	 * @param	string to search on mail from
	 * @param	string to search on mail to
	 * @param	integer manager id
	 * @param	integer client id
	 * @param	integer records order to select (hardcorded values)
	 * 			1 - by mail from 
	 * 			2 - by mail to
	 * 			3 - by date
	 * 			default by record id
	 * @param	integer 1 = descount order
	 * @param	integer page number to get, 0 - all
	 * @param	integer file id
	 */
	function getMailFiles( $subject = "", $from = "", $to = "", $managerId = null, $clientId = null, 
				$orderby = 0, $desc = 0, $page = 0, $fileId = null)
	{
		$filter = array();
		
		if(strlen($subject) > 0)
			$filter[] = sprintf("crmmail.subject LIKE '%%%s%%'", $this->escapeQueryString($subject));
		
		if(strlen($from) > 0)
			$filter[] = sprintf("crmmail.msg_from LIKE '%%%s%%'", $this->escapeQueryString($from));
		
		if(strlen($to) > 0)
			$filter[] = sprintf("crmmail.msg_to LIKE '%%%s%%'", $this->escapeQueryString($to));
		
		if(!is_null($managerId)) $filter[] = sprintf("crmmail.orig_manager = %d", $managerId);
		if(!is_null($clientId)) $filter[] = sprintf("crmmail.client_id = %d", $clientId);
		if(!is_null($fileId)) $filter[] = sprintf("crmmail.id = %d", $fileId);
		
		if( false == ($sql_query = mysql_query(sprintf("SELECT count(*) FROM crm_mail AS crmmail %s",
			(sizeof($filter) > 0) ? "WHERE " . implode(" AND ", $filter) : ""))) )
		{
			$this->ErrorHandler("Error to get CRM Mail records array: " . mysql_error(), __LINE__);
			$this->mailList = array();
			return false;
		}
		
		if(mysql_result($sql_query, 0) > 0)
		{
			$this->totalRows = mysql_result($sql_query, 0);
			$this->pages = ceil($this->totalRows / $this->rows);
			
			switch($orderby)
			{
				case 1: $orderby = "crmmail.msg_from " . (($desc == 0) ? "" : "DESC"); break;
				case 2: $orderby = "crmmail.msg_to " . (($desc == 0) ? "" : "DESC"); break;
				case 3: $orderby = "crmmail.date " . (($desc == 0) ? "" : "DESC"); break;
				default: $orderby = "crmmail.id " . (($desc == 0) ? "" : "DESC");
			}
			
			if( false == ($sql_query = mysql_query(sprintf("SELECT crmmail.id, crmmail.client_id, 
							DATE_FORMAT(crmmail.date, '%%H:%%i %%d.%%m.%%Y'), 
							crmmail.orig_manager, crmmail.msg_from, 
							crmmail.msg_to, crmmail.filesize, 
							crmmail.filename, crmmail.subject 
							FROM crm_mail AS crmmail %s GROUP BY id ORDER BY %s %s", 
							(sizeof($filter) > 0) ? "WHERE " . implode(" AND ", $filter) : "", 
							$orderby,
							($page > 0) ? sprintf("LIMIT %d, %d", ($page * $this->rows) - $this->rows, $this->rows) : ""))) )
			{
				$this->ErrorHandler("Error to get CRM Mail records array: " . mysql_error(), __LINE__);
				$this->mailList = array();
				return false;
			}
			
			while($row = mysql_fetch_row($sql_query))
			{
				$this->mailList[] = array("id" => $row[0], 
							"subject" => $row[8], 
							"clientId" => $row[1], 
							"manId" => $row[3], 
							"created" => $row[2], 
							"from" => $row[4], 
							"to" => $row[5], 
							"size" => $row[6],
							"file" => $row[7]);
			}
		}
		
		return $this->mailList;
	} // end getMailFiles()
	
	
	/**
	 * Returns post file structure to save
	 *
	 */
	function initPostFileStructure()
	{
		return array("id" => null,
			"ticketId" => null,
			"postId" => null,
			"aType" => null, 
			"aId" => null, 
			"created" => null,
			"edit" => null,
			"editType" => null,
			"editId" => null,
			"size" => null,
			"name" => null,
			"descr" => null);
	} // end initPostFileStructure()
	
	
	/**
	 * Returns CRM file structure to save
	 *
	 */
	function initCRMFileStructure()
	{
		return array("id" => null,
			"name" => null,
			"clientId" => null,
			"aId" => null, 
			"created" => null,
			"edited" => null,
			"editId" => null,
			"size" => null,
			"descr" => null);
	} // end initCRMFileStructure()
	
	
	/**
	 * Returns post file structure to save
	 *
	 */
	function initKnowledgeStructure()
	{
		return array("id" => null,
			"knowledgeId" => null,
			"postId" => null,
			"aType" => null, 
			"aId" => null, 
			"created" => null,
			"edit" => null,
			"editType" => null,
			"editId" => null,
			"size" => null,
			"name" => null,
			"descr" => null);
	} // end initKnowledgeStructure()
	
	
	/**
	 * Attach file to the client CRM database
	 * @param	array structure to save, see initPostFileStructure function
	 */
	function attachCRMFile( $structure )
	{
		$this->structure = $this->initCRMFileStructure();
		$flagok = false;
		
		if(empty($structure["clientId"]))
		{
			$this->ErrorHandler("Error, I've got unknown client id: " . $structure["clientId"], __LINE__);
			return false;
		}
		
		foreach($structure as $key => $value)
		{
			if(is_null($this->structure[$key]))
			{
				$value = trim($value);
				if($key == "id")
				{
					if(!is_numeric($value) || $value <= 0) $this->structure[$key] = null;
					else $this->structure[$key] = $value;
				}
				elseif($value{0} == "@" && $value{(strlen($value) - 1)} == "@")
				{
					$this->structure[$key] = substr($value, 1);
					$this->structure[$key] = substr($this->structure[$key], 0, -1);
				}
				else $this->structure[$key] = sprintf("'%s'", $this->settings->escapeQueryString($value));
				$flagok = true;
			}
		}
		
		if(is_null($this->structure["clientId"]) || empty($this->structure["clientId"]))
		{
			$this->ErrorHandler("Error, I've got unknown client id: " . $this->structure["clientId"], __LINE__);
			return false;
		}
		
		if( false == (mysql_query(sprintf("INSERT INTO sbss_crm_files SET id=%s, 
					client_id=%s, author_id=%s,
					created_on=%s, edited_on=%s,
					edited_id=%s, size=%s, 
					original_name=%s, description=%s
					ON DUPLICATE KEY UPDATE 
					client_id=%s, author_id=%s,
					created_on=%s, edited_on=%s,
					edited_id=%s, size=%s, 
					original_name=%s, description=%s", 
					is_null($this->structure["id"]) ? "NULL" : $this->structure["id"],
					is_null($this->structure["clientId"]) ? "client_id" : $this->structure["clientId"],
					is_null($this->structure["aId"]) ? "author_id" : $this->structure["aId"],
					is_null($this->structure["created"]) ? "created_on" : $this->structure["created"],
					is_null($this->structure["edited"]) ? "edited_on" : $this->structure["edited"],
					is_null($this->structure["editId"]) ? "edited_id" : $this->structure["editId"],
					is_null($this->structure["size"]) ? "size" : $this->structure["size"],
					is_null($this->structure["name"]) ? "original_name" : $this->structure["name"],
					is_null($this->structure["descr"]) ? "description" : $this->structure["descr"],
					is_null($this->structure["clientId"]) ? "client_id" : $this->structure["clientId"],
					is_null($this->structure["aId"]) ? "author_id" : $this->structure["aId"],
					is_null($this->structure["created"]) ? "created_on" : $this->structure["created"],
					is_null($this->structure["edited"]) ? "edited_on" : $this->structure["edited"],
					is_null($this->structure["editId"]) ? "edited_id" : $this->structure["editId"],
					is_null($this->structure["size"]) ? "size" : $this->structure["size"],
					is_null($this->structure["name"]) ? "original_name" : $this->structure["name"],
					is_null($this->structure["descr"]) ? "description" : $this->structure["descr"]))) )
		{
			$this->ErrorHandler("Error while saving attach file information: " . mysql_error(), __LINE__);
			return false;
		}
		
		if(is_null($this->structure["id"]))
		{
			if( false == ($sql_query = mysql_query("SELECT LAST_INSERT_ID()")) )
			{
				$this->ErrorHandler("Error, can't get new record ID; " . mysql_error(), __LINE__);
				return false;
			}
			
			$this->structure["id"] = mysql_result($sql_query, 0);
			if(empty($this->structure["id"]))
			{
				$this->ErrorHandler("Error, SQL return an empty result for the atached file ID; ", __LINE__);
				return false;
			}
			else return $this->structure["id"];
		}
		else return $this->structure["id"];
	} // end attachCRMFile()
	
	
	/**
	 * Attach file to ticket post
	 * @param	array structure to save, see initPostFileStructure function
	 */
	function attachPostFile( $structure )
	{
		$this->structure = $this->initPostFileStructure();
		$flagok = false;
		
		if(empty($structure["ticketId"]) || empty($structure["postId"]))
		{
			$this->ErrorHandler("Error, I've got ticket or post id empty, ticketId: " . $structure["ticketId"], __LINE__);
			$this->ErrorHandler("Error, I've got ticket or post id empty, postId: " . $structure["postId"], __LINE__);
			return false;
		}
		
		foreach($structure as $key => $value)
		{
			if(is_null($this->structure[$key]))
			{
				$value = trim($value);
				if($key == "id")
				{
					if(!is_numeric($value) || $value <= 0) $this->structure[$key] = null;
					else $this->structure[$key] = $value;
				}
				elseif($value{0} == "@" && $value{(strlen($value) - 1)} == "@")
				{
					$this->structure[$key] = substr($value, 1);
					$this->structure[$key] = substr($this->structure[$key], 0, -1);
				}
				else $this->structure[$key] = sprintf("'%s'", $this->settings->escapeQueryString($value));
				$flagok = true;
			}
		}
		
		if(is_null($this->structure["ticketId"]) || is_null($this->structure["postId"]))
		{
			$this->ErrorHandler("Error, I've got ticket or post id empty, ticketId: " . $this->structure["ticketId"], __LINE__);
			$this->ErrorHandler("Error, I've got ticket or post id empty, postId: " . $this->structure["postId"], __LINE__);
			return false;
		}
		
		if( false == (mysql_query(sprintf("INSERT INTO sbss_posts_files SET id=%s, 
					ticket_id=%s, post_id=%s, 
					author_type=%s, author_id=%s,
					created_on=%s, edited_on=%s,
					edited_type=%s, edited_id=%s,
					size=%s, original_name=%s,
					description=%s
					ON DUPLICATE KEY UPDATE 
					ticket_id=%s, post_id=%s, 
					author_type=%s, author_id=%s,
					created_on=%s, edited_on=%s,
					edited_type=%s, edited_id=%s,
					size=%s, original_name=%s,
					description=%s", 
					is_null($this->structure["id"]) ? "NULL" : $this->structure["id"],
					is_null($this->structure["ticketId"]) ? "ticket_id" : $this->structure["ticketId"],
					is_null($this->structure["postId"]) ? "post_id" : $this->structure["postId"],
					is_null($this->structure["aType"]) ? "author_type" : $this->structure["aType"],
					is_null($this->structure["aId"]) ? "author_id" : $this->structure["aId"],
					is_null($this->structure["created"]) ? "created_on" : $this->structure["created"],
					is_null($this->structure["edit"]) ? "edited_on" : $this->structure["edit"],
					is_null($this->structure["editType"]) ? "edited_type" : $this->structure["editType"],
					is_null($this->structure["editId"]) ? "edited_id" : $this->structure["editId"],
					is_null($this->structure["size"]) ? "size" : $this->structure["size"],
					is_null($this->structure["name"]) ? "original_name" : $this->structure["name"],
					is_null($this->structure["descr"]) ? "description" : $this->structure["descr"],
					is_null($this->structure["ticketId"]) ? "ticket_id" : $this->structure["ticketId"],
					is_null($this->structure["postId"]) ? "post_id" : $this->structure["postId"],
					is_null($this->structure["aType"]) ? "author_type" : $this->structure["aType"],
					is_null($this->structure["aId"]) ? "author_id" : $this->structure["aId"],
					is_null($this->structure["created"]) ? "created_on" : $this->structure["created"],
					is_null($this->structure["edit"]) ? "edited_on" : $this->structure["edit"],
					is_null($this->structure["editType"]) ? "edited_type" : $this->structure["editType"],
					is_null($this->structure["editId"]) ? "edited_id" : $this->structure["editId"],
					is_null($this->structure["size"]) ? "size" : $this->structure["size"],
					is_null($this->structure["name"]) ? "original_name" : $this->structure["name"],
					is_null($this->structure["descr"]) ? "description" : $this->structure["descr"]))) )
		{
			$this->ErrorHandler("Error while saving attach file information: " . mysql_error(), __LINE__);
			return false;
		}
		
		if(is_null($this->structure["id"]))
		{
			if( false == ($sql_query = mysql_query("SELECT LAST_INSERT_ID()")) )
			{
				$this->ErrorHandler("Error, can't get new record ID; " . mysql_error(), __LINE__);
				return false;
			}
			
			$this->structure["id"] = mysql_result($sql_query, 0);
			if(empty($this->structure["id"]))
			{
				$this->ErrorHandler("Error, SQL return an empty result for the atached file ID; ", __LINE__);
				return false;
			}
			else return $this->structure["id"];
		}
		else return $this->structure["id"];
	} // end attachPostFile()
	
	
	/**
	 * Attach file to the knowledge post
	 * @param	array structure to save, see initKnowledgeStructure function
	 */
	function attachKnowledgeFile( $structure )
	{
		$this->structure = $this->initPostFileStructure();
		$flagok = false;
		
		if(empty($structure["knowledgeId"]) || empty($structure["postId"]))
		{
			$this->ErrorHandler("Error, I've got Knowledge or post id empty, knowledgeId: " . $structure["knowledgeId"], __LINE__);
			$this->ErrorHandler("Error, I've got Knowledge or post id empty, postId: " . $structure["postId"], __LINE__);
			return false;
		}
		
		foreach($structure as $key => $value)
		{
			if(is_null($this->structure[$key]))
			{
				$value = trim($value);
				if($key == "id")
				{
					if(!is_numeric($value) || $value <= 0) $this->structure[$key] = null;
					else $this->structure[$key] = $value;
				}
				elseif($value{0} == "@" && $value{(strlen($value) - 1)} == "@")
				{
					$this->structure[$key] = substr($value, 1);
					$this->structure[$key] = substr($this->structure[$key], 0, -1);
				}
				else $this->structure[$key] = sprintf("'%s'", $this->settings->escapeQueryString($value));
				$flagok = true;
			}
		}
		
		if(is_null($this->structure["knowledgeId"]) || is_null($this->structure["postId"]))
		{
			$this->ErrorHandler("Error, I've got Knowledge or post id empty, knowledgeId: " . $this->structure["ticketId"], __LINE__);
			$this->ErrorHandler("Error, I've got Knowledge or post id empty, postId: " . $this->structure["postId"], __LINE__);
			return false;
		}
		
		if( false == (mysql_query(sprintf("INSERT INTO sbss_knowledge_files SET id=%s, 
					knowledge_id=%s, post_id=%s, 
					author_type=%s, author_id=%s,
					created_on=%s, edited_on=%s,
					edited_type=%s, edited_id=%s,
					size=%s, original_name=%s,
					description=%s
					ON DUPLICATE KEY UPDATE 
					knowledge_id=%s, post_id=%s, 
					author_type=%s, author_id=%s,
					created_on=%s, edited_on=%s,
					edited_type=%s, edited_id=%s,
					size=%s, original_name=%s,
					description=%s", 
					is_null($this->structure["id"]) ? "NULL" : $this->structure["id"],
					is_null($this->structure["knowledgeId"]) ? "knowledge_id" : $this->structure["knowledgeId"],
					is_null($this->structure["postId"]) ? "post_id" : $this->structure["postId"],
					is_null($this->structure["aType"]) ? "author_type" : $this->structure["aType"],
					is_null($this->structure["aId"]) ? "author_id" : $this->structure["aId"],
					is_null($this->structure["created"]) ? "created_on" : $this->structure["created"],
					is_null($this->structure["edit"]) ? "edited_on" : $this->structure["edit"],
					is_null($this->structure["editType"]) ? "edited_type" : $this->structure["editType"],
					is_null($this->structure["editId"]) ? "edited_id" : $this->structure["editId"],
					is_null($this->structure["size"]) ? "size" : $this->structure["size"],
					is_null($this->structure["name"]) ? "original_name" : $this->structure["name"],
					is_null($this->structure["descr"]) ? "description" : $this->structure["descr"],
					is_null($this->structure["knowledgeId"]) ? "ticket_id" : $this->structure["knowledgeId"],
					is_null($this->structure["postId"]) ? "post_id" : $this->structure["postId"],
					is_null($this->structure["aType"]) ? "author_type" : $this->structure["aType"],
					is_null($this->structure["aId"]) ? "author_id" : $this->structure["aId"],
					is_null($this->structure["created"]) ? "created_on" : $this->structure["created"],
					is_null($this->structure["edit"]) ? "edited_on" : $this->structure["edit"],
					is_null($this->structure["editType"]) ? "edited_type" : $this->structure["editType"],
					is_null($this->structure["editId"]) ? "edited_id" : $this->structure["editId"],
					is_null($this->structure["size"]) ? "size" : $this->structure["size"],
					is_null($this->structure["name"]) ? "original_name" : $this->structure["name"],
					is_null($this->structure["descr"]) ? "description" : $this->structure["descr"]))) )
		{
			$this->ErrorHandler("Error while saving attach file information to the Knowledge: " . mysql_error(), __LINE__);
			return false;
		}
		
		if(is_null($this->structure["id"]))
		{
			if( false == ($sql_query = mysql_query("SELECT LAST_INSERT_ID()")) )
			{
				$this->ErrorHandler("Error, can't get new record ID; " . mysql_error(), __LINE__);
				return false;
			}
			
			$this->structure["id"] = mysql_result($sql_query, 0);
			if(empty($this->structure["id"]))
			{
				$this->ErrorHandler("Error, SQL return an empty result for the atached file ID; ", __LINE__);
				return false;
			}
			else return $this->structure["id"];
		}
		else return $this->structure["id"];
	} // end attachKnowledgeFile()
	
	
	/**
	 * Preupload check of the file loaded from user
	 * @param	string array key to search for the files
	 */
	function preUploadCheck( $key )
	{
		if(isset($_FILES[$key]))
		{
			$this->files = array();
			
			if(is_array($_FILES[$key]["name"]))
			{
				foreach($_FILES[$key]["name"] as $fKey => $fName)
				{
					$this->files[] = array("id" => $fKey,
							"name" => $fName, 
							"type" => $_FILES[$key]["type"][$fKey], 
							"tmp_name" => $_FILES[$key]["tmp_name"][$fKey], 
							"error" => $_FILES[$key]["error"][$fKey],
							"size" => $_FILES[$key]["size"][$fKey]);
				}
			}
			else $this->files[] = $_FILES[$key];
			
			foreach($this->files as $fData)
			{
				if($fData["error"] == 4) return null;
				
				if($fData["error"] != 0)
				{
					$this->ErrorHandler("Error while loading file on server", __LINE__);
					$this->errors[] = FILELOADERROR;
					return false;
				}
				
				if(!is_uploaded_file($fData["tmp_name"]))
				{
					$this->ErrorHandler("Possible file upload attack: '" . $fData["name"] . "'", __LINE__);
					return false;
				}
				
				if($this->size > 0 && $fData["size"] > $this->size)
				{
					$this->ErrorHandler("File size over than " . $this->size, __LINE__);
					$this->errors[] = FILESIZERESTRICTION . " " . $this->size . " (" . BYTE . ")";
					return false;
				}
			}
			
			return true;
		}
		
		return null;
	} // end preUploadCheck()
	
	
	/**
	 * Save uploaded file from user to specified folder on the server
	 * @param	string file path source
	 * @param	string file path destination
	 */
	function saveFile( $source, $destination )
	{
		if(false == @move_uploaded_file($source, $destination))
		{
			$this->ErrorHandler("Can't save source file '" . $source . "' to '" . $destination . "'", __LINE__);
			$this->errors[] = FOLDERDENY . ": " . $destination;
			return false;
		}
		else return true;
	} // end saveFile()
	
	
	/**
	 * Copy file from source to destination
	 * @param	string file path source
	 * @param	string file path destination
	 */
	function copyFile( $source, $destination )
	{
		if(false == @copy($source, $destination))
		{
			$this->ErrorHandler("Can't copy source file '" . $source . "' to '" . $destination . "'", __LINE__);
			$this->errors[] = FOLDERDENY . ": " . $destination;
			return false;
		}
		else return true;
	} // end copyFile()
	
	
	/**
	 * Get attached post file original name
	 * @param	integer file id
	 * @param	integer ticket id
	 * @param	integer post id
	 */
	function readPostFile( $fileId = null, $ticketId = null, $postId = null )
	{
		if( false == ($sql_query = mysql_query(sprintf("SELECT original_name FROM sbss_posts_files 
					WHERE id = %d AND ticket_id = %d %s", 
					$fileId, $ticketId, 
					!is_null($postId) ? sprintf(" AND post_id = %d", $postId) : ""))) )
		{
			$this->ErrorHandler("Error, can't get file: " . mysql_error(), __LINE__);
		}
		else
		{
			$fileName = @mysql_result($sql_query, 0);
			$filePath = $this->settings->commonSettings["sbss_ticket_files"] . "/" . sprintf($this->postFileTemplate, $fileId);
		}
		
		if(!isset($fileName) || empty($fileName)) $fileName = false;
		$this->download($filePath, $fileName);
	} // end readPostFile()
	
	
	/**
	 * Get attached post file original name
	 * @param	integer file id
	 * @param	integer ticket id
	 * @param	integer post id
	 */
	function readKnowledgeFile( $fileId = null, $knowledgeId = null, $postId = null )
	{
		if( false == ($sql_query = mysql_query(sprintf("SELECT original_name FROM sbss_knowledge_files 
					WHERE id = %d AND knowledge_id = %d %s", 
					$fileId, $knowledgeId, 
					!is_null($postId) ? sprintf(" AND post_id = %d", $postId) : ""))) )
		{
			$this->ErrorHandler("Error, can't get file fot the Knowledge: " . mysql_error(), __LINE__);
		}
		else
		{
			$fileName = @mysql_result($sql_query, 0);
			$filePath = $this->settings->commonSettings["sbss_ticket_files"] . "/" . sprintf($this->knowledgeFileTemplate, $fileId);
		}
		
		if(!isset($fileName) || empty($fileName)) $fileName = false;
		$this->download($filePath, $fileName);
	} // end readKnowledgeFile()
	
	
	/**
	 * Get attached CRM file original name
	 * @param	integer file id
	 * @param	integer user id
	 */
	function readCRMFile( $fileId = null, $clientId = null )
	{
		if( false == ($sql_query = mysql_query(sprintf("SELECT original_name FROM sbss_crm_files 
					WHERE id = %d AND client_id = %d", 
					$fileId, $clientId))) )
		{
			$this->ErrorHandler("Error, can't get file: " . mysql_error(), __LINE__);
		}
		else
		{
			$fileName = @mysql_result($sql_query, 0);
			$filePath = $this->settings->commonSettings["sbss_crm_files"] . "/" . sprintf($this->crmFileTemplate, $fileId);
		}
		
		if(!isset($fileName) || empty($fileName)) $fileName = false;
		$this->download($filePath, $fileName);
	} // end readCRMFile()
	
	
	/**
	 * Get attached CRM file original name
	 * @param	integer file id
	 * @param	integer user id
	 */
	function readMailFile( $fileId = null, $clientId = null )
	{
		if(is_null($fileId) || empty($fileId))
			$this->ErrorHandler("I've got am empty file ID", __LINE__);
		else
		{
			if(is_null($clientId) || empty($clientId))
				$this->ErrorHandler("I've got am empty user ID", __LINE__);
			else
			{
				$this->mailList = array();
				$this->getMailFiles("", "", "", null, $clientId, 0, 0, 0, $fileId);

				$fileName = $this->mailList[0]["file"];
				$filePath = $this->settings->emailCSettings["crm_email_filepath"] . "/" . $this->mailList[0]["file"];
			}
		}
		
		if(!isset($fileName) || empty($fileName)) $fileName = false;
		$this->download($filePath, $fileName);
	} // end readMailFile()
	
	
	/**
	 * Request to download CRM file
	 * @param	integer record about file
	 * @param	integer record condition to user id
	 */
	function download( $pathOrigin = null, $fileName = null )
	{
		if($fileName != false && !empty($fileName))
		{
			if( false == ($handle = @fopen($pathOrigin, "r")) )
			{
				$fileName = false;
				$this->ErrorHandler("Error, Can't open file: " . $pathOrigin, __LINE__);
			}
			
			$ext = $this->Extention($fileName);
			$fileSize = filesize($pathOrigin);
		}
		else $this->ErrorHandler("Error, I've got wrong original file name", __LINE__);
		
		header("Pragma: public");
		header("Expires: 0");
		header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
		header("Cache-Control: public");
		header("Content-Description: File Transfer");
		header("Content-Type: " . $this->mimeType($ext));
		
		if($fileName != false)
		{
			header("Content-Disposition: attachment; filename=" . $fileName . ";");
			header("Content-Transfer-Encoding: binary");
			header("Content-Length: " . $fileSize);
			echo fread($handle, $fileSize);
			fclose($handle);
		}
		else
		{
			header("Content-Disposition: attachment; filename=fileError;");
			header("Content-Transfer-Encoding: binary");
			header("Content-Length: 0");
			header("Connection: close");
		}
	} // end download()
	
	
	/**
	 * Removes all post files from disk
	 * @param	integer post id
	 */
	function removePostFiles( $postId )
	{
		if( false != ($sql_query = mysql_query(sprintf("SELECT id FROM sbss_posts_files WHERE post_id = %d", $postId))))
		{
			if(mysql_num_rows($sql_query) > 0)
			{
				while($row = mysql_fetch_row($sql_query))
				{
					$myFile = $this->settings->commonSettings["sbss_ticket_files"] . "/" . sprintf($this->postFileTemplate, $row[0]);
					if(is_file($myFile)) unlink($myFile);
				}
			}
		}
		else
		{
			$this->ErrorHandler("Error while removing files for the post ID: " . $poistId . "; " . mysql_error(), __LINE__);
			return false;
		}
		
		return true;
	} // end removePostFiles()
	
	
	/**
	 * Delete CRM file record and file from disk
	 * @param	integer file id
	 */
	function removeCRMFile( $fileId )
	{
		if( false == mysql_query(sprintf("DELETE FROM sbss_crm_files WHERE id = %d", $fileId)) )
		{
			$this->ErrorHandler("Error delete file record for the ID: " . $fileId . "; " . mysql_error(), __LINE__);
			return false;
		}
		
		$myFile = $this->settings->commonSettings["sbss_crm_files"] . "/" . sprintf($this->crmFileTemplate, $fileId);
		if(is_file($myFile)) unlink($myFile);
	} // end removeCRMFile()
	
	
	/**
	 * Http headers for the document mime types
	 * @param	string, file extantion to identify document type
	 */
	private function mimeType( $ext = "" )
	{
		switch($ext)
		{
			case "pdf": return "application/pdf";
			case "zip": return "application/zip";
			case "gzip":
			case "gz":  return "application/x-gzip";
			case "doc": return "application/msword";
			case "xls": return "application/vnd.ms-excel";
			case "ppt": return "application/vnd.ms-powerpoint";
			case "gif": return "image/gif";
			case "png": return "image/png";
			case "jpeg":
			case "jpg": return "image/jpg";
			case "mp3": return "audio/mpeg";
			case "wav": return "audio/x-wav";
			case "mpeg":
			case "mpg":
			case "mpe": return "video/mpeg";
			case "mov": return "video/quicktime";
			case "avi": return "video/x-msvideo";
			case "txt":
			case "sql":
			case "csv": return "text/plain";
			case "eml": return "message/rfc822";
			
			default: return "application/octet-stream";
		}
	} // end mimeType()
	
	
	/**
	 * Initialize file extention fot the correct mime type header
	 * @param	string file name
	 */
	private function Extention( $string )
	{
		if(empty($string)) return "";
		
		$arr = explode(".", $string);
		if(sizeof($arr) == 0) return "";
		
		$value = end($arr);
		return trim($value);
	} // end Extention()
	
	
	/**
	 * Checks if file was included or required earlier
	 * @param	string file name
	 */
	private function ifIcluded( $file )
	{
		$included = get_included_files();
		
		foreach ($included as $name)
		{
			if($name == $file) return true;
		}
		
		return false;
	} // end ifIncluded()
	
	
	/**
	 * Error handler
	 * @param	string, message
	 * @param	line
	 */
	private function ErrorHandler( $message, $line )
	{
		$message = sprintf("sbssFiles.class.php: %s; at line %s", $message, $line);
		error_log($message, 0);
	} // end ErrorHandler()
}
?>