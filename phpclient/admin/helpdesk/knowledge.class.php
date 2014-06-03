<?php
/**
 * Knowledge class. Contains main functions to work with DB
 * Subjects list view, post list view. Save new and edit existing data
 */

class Knowledge {
	
	/**
	 * DB connection resource
	 * @var		resource
	 */
	public $descriptor = false;
	
	/**
	 * Set array allowed users for the manager if need
	 * Default value is false not to apply restrction
	 * @var		array
	 */
	var $restrictUsers = false;
	
	/**
	 * SBSS settings class, contains all main functions
	 * @var		object
	 */
	var $settings;
	
	/**
	 * Clients list found for tje ticket
	 * @var		array
	 */
	var $clientList = array();
	
	/**
	 * Error messages array
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
	function Knowledge( &$descriptor )
	{
		$this->descriptor = $descriptor;
		
		if(!$this->ifIcluded("sbssSettings.class.php"))
			include_once("sbssSettings.class.php");
	} // end billingSBSS()
	
	
	/**
	 * Initialize setting and options
	 *
	 */
	function initSettings()
	{
		$this->settings = new sbssSettings($this->descriptor);
		$this->settings->initCommonOptions();
		$this->settings->initManagers();
		$this->settings->initRequestClasses();
		$this->settings->initStatusList();
	} // end initSettings()
	
	
	/**
	 * Get tickets list from DB
	 * @param	string message concat with ticket id search
	 * @param	integer author type
	 * @param	integer author id
	 * @param	integer or array of request class ids
	 * @param	integer order
	 * @param	integer current page
	 * @param	integer to get only specified ticket item
	 */
	function getKnowledges( $string = "", $authorType = null, $authorId = null, 
				$classId = 0, $orderby = 0, $desc = 0, $page = 0, $itemId = 0 )
	{
		$filter = array();
		$clients = array();
		
		if(strlen($string) > 0)
			$filter[] = sprintf("(knowledges.id IN (%s) OR knowledges.name LIKE '%%%s%%')", $this->findInPost($string), $this->settings->escapeQueryString($string));
		
		if(!is_null($authorType) && is_numeric($authorType)) 
			$filter[] = sprintf("knowledges.author_type = %d", ($authorType == 1) ? $authorType : 0);
		
		if(!is_null($authorId))
		{
			if(is_array($authorId))
				$filter[] = sprintf("knowledges.author_id IN (%s)", (sizeof($authorId) > 0) ? implode(",", $authorId) : "NULL");
			elseif(is_numeric($authorId))
				$filter[] = sprintf("knowledges.author_id = %d", $authorId);
		}
		
		if($classId > 0 || is_array($classId))
		{
			if(is_array($classId) && sizeof($classId) > 0)
				$filter[] = sprintf("knowledges.class_id IN (%s)", implode(",", $classId));
			else if(!is_array($classId) && $classId > 0)
				$filter[] = sprintf("knowledges.class_id = %d", $classId);
		}
		
		if($itemId > 0) $filter[] = sprintf("knowledges.id = %d", $itemId);
		
		if( false == ($sql_query = mysql_query(sprintf("SELECT count(*) FROM sbss_knowledge AS knowledges %s",
			(sizeof($filter) > 0) ? "WHERE " . implode(" AND ", $filter) : ""), $this->descriptor)) )
		{
			$this->ErrorHandler("Error to get knowledges array: " . mysql_error($this->descriptor), __LINE__);
			$this->ticketList = array();
			return false;
		}
		
		if(mysql_result($sql_query, 0) > 0)
		{
			$this->totalRows = mysql_result($sql_query, 0);
			$this->pages = ceil($this->totalRows / $this->rows);
			
			switch($orderby)
			{
				case 0: $orderby = "knowledges.lastpost " . (($desc == 0) ? "" : "DESC"); break;
				case 1: $orderby = "knowledges.name " . (($desc == 0) ? "" : "DESC"); break;
				case 3: $orderby = "knowledges.replies " . (($desc == 0) ? "" : "DESC"); break;
			}
			
			if( false == ($sql_query = mysql_query(sprintf("SELECT knowledges.id, knowledges.name, 
							knowledges.author_type, knowledges.author_id, 
							DATE_FORMAT(knowledges.created_on, '%%H:%%i %%d.%%m.%%Y'), 
							knowledges.respondent_type, knowledges.respondent_id, 
							DATE_FORMAT(knowledges.lastpost, '%%H:%%i %%d.%%m.%%Y'), 
							knowledges.class_id, knowledges.replies, COUNT(files.id) fcount 
							FROM sbss_knowledge AS knowledges 
							LEFT JOIN sbss_knowledge_files AS files ON (files.knowledge_id = knowledges.id)
							%s 
							GROUP BY knowledges.id ORDER BY %s %s",
							(sizeof($filter) > 0) ? "WHERE " . implode(" AND ", $filter) : "", 
							$orderby,
							($page > 0) ? sprintf("LIMIT %d, %d", ($page * $this->rows) - $this->rows, $this->rows) : ""), $this->descriptor)) )
			{
				$this->ErrorHandler("Error to get knowledges array: " . mysql_error($this->descriptor), __LINE__);
				$this->ticketList = array();
				return false;
			}
			
			while($row = mysql_fetch_row($sql_query))
			{
				$this->knowledgeList[] = array("id" => $row[0], 
							"name" => $row[1], 
							"aType" => $row[2], 
							"aId" => $row[3], 
							"created" => $row[4], 
							"respType" => $row[5], 
							"respId" => $row[6], 
							"last" => $row[7], 
							"class" => $row[8], 
							"replies" => $row[9],
							"files" => $row[10]);
				
				if($row[2] == 1) $clients[] = $row[3];
			}
			
			$this->settings->initUsers($clients);
		}
		
		return $this->knowledgeList;
	} // end getKnowledges()
	
	
	/**
	 * Search and return ticket's ids by string in messages
	 * @param	string to search
	 * @param	bool if search in spec field
	 */
	function findInPost( $string, $use_spec = false )
	{
		if( false != ($sql_query = mysql_query(sprintf("SELECT GROUP_CONCAT(knowledge_id) FROM sbss_knowledge_posts 
				WHERE CONCAT(knowledge_id, ' ', text %s) LIKE '%%%s%%'", 
				($use_spec) ? ", ' ', spec" : "",
				$this->settings->escapeQueryString($string)), $this->descriptor)) )
		{
			if(mysql_result($sql_query, 0) == "") return "NULL";
			else return mysql_result($sql_query, 0);
		}
		else
		{
			$this->ErrorHandler("Error while searching by string: " . mysql_error($this->descriptor), __LINE__);
			return "NULL";
		}
	} // end findInPost()
	
	
	/**
	 * Get Ticket's posts
	 * @param	integer ticket id
	 * @param	integer, author type: 0 - manager / admin, 1 - client
	 * @param	integer, man created ticket
	 */
	function getKnowledgePosts( $knowledgeId = 0, $postId = 0, $authorType = 0, $authorId = 0 )
	{
		if(empty($knowledgeId))
		{
			$this->ErrorHandler("Error, I've got ticket ID: 0", __LINE__);
			return false;
		}
		
		if( false == ($sql_query = mysql_query(sprintf("SELECT posts.id, posts.knowledge_id, 
							posts.author_type, posts.author_id, 
							DATE_FORMAT(posts.created_on,'%%H:%%i %%d.%%m.%%Y'), 
							posts.text, posts.spec
							FROM sbss_knowledge_posts AS posts
							LEFT JOIN sbss_knowledge AS knowledges ON (knowledges.id = posts.knowledge_id) 
							WHERE posts.knowledge_id = %d
							%s 
							%s GROUP BY posts.id ORDER BY posts.id", $knowledgeId, 
							($authoId > 0) ? sprintf("AND knowledges.author_type = %d AND knowledges.author_id = %d", $authorId, $authorType) : "",
							($postId > 0) ? sprintf("AND posts.id = %d", $postId) : ""), $this->descriptor)) )
		{
			$this->ErrorHandler("Error while getting posts for the Knowledge item ID: " . $knowledgeId . "; " . mysql_error($this->descriptor), __LINE__);
		}
		
		while($row = mysql_fetch_row($sql_query))
			$this->knowledgePostList[$row[0]] = array("knowledgeId" => $row[1], 
							"aType" => $row[2], 
							"aId" => $row[3], 
							"created" => $row[4], 
							"text" => $row[5],
							"spec" => $row[6],
							"attach" => array());
		
		// Get attached files to the posts
		if( false == ($sql_query = mysql_query(sprintf("SELECT post_id, id, 
							DATE_FORMAT(created_on, '%%H:%%i %%d.%%m.%%Y'), 
							DATE_FORMAT(edited_on, '%%H:%%i %%d.%%m.%%Y'), 
							author_type, author_id, original_name, description, 
							size 
							FROM sbss_knowledge_files 
							WHERE knowledge_id = %d", $knowledgeId), $this->descriptor)) )
		{
			$this->ErrorHandler("Error while getting post's files for the Knowledge: " . $knowledgeId . "; " . mysql_error($this->descriptor), __LINE__);
		}
		
		if(mysql_num_rows($sql_query) > 0)
		{
			while($row = mysql_fetch_row($sql_query))
			{
				if(isset($this->knowledgePostList[$row[0]]))
					$this->knowledgePostList[$row[0]]["attach"][$row[1]] = array("created" => $row[2],
										"edited" => $row[3],
										"aType" => $row[4],
										"aId" => $row[5],
										"name" => $row[6],
										"descr" => $row[7],
										"size" => $row[8]);
			}
		}
		
		return $this->knowledgePostList;
	} // end getKnowledgePosts()
	
	
	/**
	 * Search client in DB and return array of ids
	 * @param	string user name or company name
	 */
	function searchUsers( $name )
	{
		$filter = array();
		
		if(!empty($name))
			$filter[] = sprintf("name LIKE '%%%s%%'", $this->settings->escapeQueryString($name));
		
		if($this->restrictUsers != false && is_array($this->restrictUsers))
			$filter[] = sprintf("uid IN (%s)", (sizeof($this->restrictUsers) > 0) ? implode(",", $this->restrictUsers) : "NULL");
		
		if( false == ($sql_query = mysql_query(sprintf("SELECT uid FROM accounts %s GROUP BY uid", 
			(sizeof($filter) > 0) ? "WHERE " . implode(" AND ", $filter) : ""), $this->descriptor)) )
		{
			$this->ErrorHandler("Error while seraching user: " . mysql_error($this->descriptor), __LINE__);
			return false;
		}
		
		if(mysql_num_rows($sql_query) > 0)
			return mysql_fetch_array($sql_query, MYSQL_NUM);
		else return array();
	} // end searchUsers()
	
	
	/**
	 * Return Knowledge structure, which is used to save or update existing
	 *
	 */
	function initKnowledgeStructure()
	{
		return array("id" => null, 
			"name" => null, 
			"aType" => null,
			"aId" => null, 
			"created" => null, 
			"respType" => null, 
			"respId" => null, 
			"last" => null, 
			"class" => null, 
			"replies" => null);
	} // end initKnowledgeStructure()
	
	
	/**
	 * Return Ticket structure, which is used to save now or update existing
	 *
	 */
	function initPostStructure()
	{
		return array("id" => null, 
			"knowledgeId" => null, 
			"aType" => null, 
			"aId" => null, 
			"created" => null, 
			"text" => null, 
			"spec" => null);
	} // end initPostStructure()
	
	
	/**
	 * Save new or existing Knowledge data
	 * As value You can set sql statment like this @now()@
	 * @param	array structure to save
	 */
	function saveKnowledge( $structure )
	{
		$this->structure = $this->initKnowledgeStructure();
		$flagok = false;
		
		if(empty($structure["id"]) || $structure["id"] == 0)
			$structure["id"] = null;
		
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
		
		if(!$flagok)
		{
			$this->ErrorHandler("I've got wrong data structure", __LINE__);
			return false;
		}
		
		if( false == ($sql_query = mysql_query(sprintf("INSERT INTO sbss_knowledge SET id=%s, 
				name=%s, author_type=%s,
				author_id=%s, created_on=%s,
				respondent_type=%s, respondent_id=%s,
				lastpost=%s, class_id=%s, replies=%s
				ON DUPLICATE KEY UPDATE 
				name=%s, author_type=%s,
				author_id=%s, created_on=%s,
				respondent_type=%s, respondent_id=%s,
				lastpost=%s, class_id=%s, replies=%s", 
				is_null($this->structure["id"]) ? "NULL" : $this->structure["id"],
				is_null($this->structure["name"]) ? "name" : $this->structure["name"], 
				is_null($this->structure["aType"]) ? "author_type" : $this->structure["aType"],
				is_null($this->structure["aId"]) ? "author_id" : $this->structure["aId"],
				is_null($this->structure["created"]) ? "created_on" : $this->structure["created"],
				is_null($this->structure["respType"]) ? "respondent_type" : $this->structure["respType"],
				is_null($this->structure["respId"]) ? "respondent_id" : $this->structure["respId"],
				is_null($this->structure["last"]) ? "lastpost" : $this->structure["last"],
				is_null($this->structure["class"]) ? "class_id" : $this->structure["class"],
				is_null($this->structure["replies"]) ? "replies" : $this->structure["replies"],
				is_null($this->structure["name"]) ? "name" : $this->structure["name"], 
				is_null($this->structure["aType"]) ? "author_type" : $this->structure["aType"],
				is_null($this->structure["aId"]) ? "author_id" : $this->structure["aId"],
				is_null($this->structure["created"]) ? "created_on" : $this->structure["created"],
				is_null($this->structure["respType"]) ? "respondent_type" : $this->structure["respType"],
				is_null($this->structure["respId"]) ? "respondent_id" : $this->structure["respId"],
				is_null($this->structure["last"]) ? "lastpost" : $this->structure["last"],
				is_null($this->structure["class"]) ? "class_id" : $this->structure["class"],
				is_null($this->structure["replies"]) ? "replies" : $this->structure["replies"]), $this->descriptor)) )
		{
			$this->ErrorHandler("Error while saving Knowledge item: " . $ticketId . "; " . mysql_error($this->descriptor), __LINE__);
			return false;
		}
		
		if(is_null($this->structure["id"]))
		{
			if( false == ($sql_query = mysql_query("SELECT LAST_INSERT_ID()", $this->descriptor)) )
			{
				$this->ErrorHandler("Error, can't get new record ID; " . mysql_error($this->descriptor), __LINE__);
				return false;
			}
			
			$this->structure["id"] = mysql_result($sql_query, 0);
			if(empty($this->structure["id"]))
			{
				$this->ErrorHandler("Error, SQL return an empty result for the Knowledge item ID; ", __LINE__);
				return false;
			}
			else return $this->structure["id"];
		}
		else return $this->structure["id"];
	} // end saveTicket()
	
	
	/**
	 * Save noe or edit existing post data for the ticket id
	 * As value You can set sql statment like this @now()@
	 * @param	array structure to save
	 */
	function saveKnowledgePost( $structure )
	{
		$this->structure = $this->initPostStructure();
		$flagok = false;
		
		if(empty($structure["id"]) || $structure["id"] == 0)
			$structure["id"] = null;
		
		if(empty($structure["knowledgeId"]))
		{
			$this->ErrorHandler("I've an empty Knowledge item ID, no save avaliable", __LINE__);
			return false;
		}
		
		if(!empty($structure["text"]))
			$structure["text"] = nl2br($structure["text"]);
		
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
		
		if(!$flagok)
		{
			$this->ErrorHandler("I've got wrong data structure", __LINE__);
			return false;
		}
		
		if( false == ($sql_query = mysql_query(sprintf("INSERT INTO sbss_knowledge_posts SET id=%s, 
				knowledge_id=%s, author_type=%s, 
				author_id=%s, created_on=%s, 
				text=%s, spec=%s 
				ON DUPLICATE KEY UPDATE 
				knowledge_id=%s, author_type=%s, 
				author_id=%s, created_on=%s, 
				text=%s, spec=%s", 
				is_null($this->structure["id"]) ? "NULL" : $this->structure["id"],
				is_null($this->structure["knowledgeId"]) ? "NULL" : $this->structure["knowledgeId"],
				is_null($this->structure["aType"]) ? "author_type" : $this->structure["aType"],
				is_null($this->structure["aId"]) ? "author_id" : $this->structure["aId"],
				is_null($this->structure["created"]) ? "created_on" : $this->structure["created"],
				is_null($this->structure["text"]) ? "created_on" : $this->structure["text"],
				is_null($this->structure["spec"]) ? "created_on" : $this->structure["spec"],
				is_null($this->structure["knowledgeId"]) ? "NULL" : $this->structure["knowledgeId"],
				is_null($this->structure["aType"]) ? "author_type" : $this->structure["aType"],
				is_null($this->structure["aId"]) ? "author_id" : $this->structure["aId"],
				is_null($this->structure["created"]) ? "created_on" : $this->structure["created"],
				is_null($this->structure["text"]) ? "created_on" : $this->structure["text"],
				is_null($this->structure["spec"]) ? "created_on" : $this->structure["spec"]), $this->descriptor)) )
		{
			$this->ErrorHandler("Error while saving post with Knowledge item ID: " . $ticketId . "; " . mysql_error($this->descriptor), __LINE__);
			return false;
		}
		
		if(is_null($this->structure["id"]))
		{
			if( false == ($sql_query = mysql_query("SELECT LAST_INSERT_ID()", $this->descriptor)) )
			{
				$this->ErrorHandler("Error, can't get new record ID; " . mysql_error($this->descriptor), __LINE__);
				return false;
			}
			
			$this->structure["id"] = mysql_result($sql_query, 0);
			if(empty($this->structure["id"]))
			{
				$this->ErrorHandler("Error, SQL return an empty result for the post ID; ", __LINE__);
				return false;
			}
			else return $this->structure["id"];
		}
		else return $this->structure["id"];
	} // end savePost()
	
	
	/**
	 * Delete Post From ticket history
	 * Attantion, if there are attached file, first remove them from dist,
	 * because file table will be cleared by the foriegn key on delete
	 * @param	integer post id
	 */
	function deleteKnowledgePost( $postId )
	{
		if( false == (mysql_query(sprintf("DELETE FROM sbss_knowledge_posts WHERE id = %d", $postId), $this->descriptor)))
		{
			$this->ErrorHandler("Error while removing post ID from the knowledges: " . $poistId . "; " . mysql_error($this->descriptor), __LINE__);
			return false;
		}
		return true;
	} // end deletePosy()
	
	
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
		$message = sprintf("knowledge.class.php: %s; at line %s", $message, $line);
		error_log($message, 0);
	} // end ErrorHandler()
} // end class SBSS
?>