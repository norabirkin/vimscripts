<?php
/**
 * SBSS class. Contains main functions to work with DB
 * Ticket list view, post list view. Save new and edit existing data
 */

class SBSS {
	
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
	 * Comtains ststus list
	 * @var		array
	 */
	var $statusList = array();
	
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
	 * Use this structure to save new or update existsing ticket
	 * If You live some value as null, than sql.field for this value will be excluded from query
	 * @param	array
	 */
	var $saveTicketStructure = array();
	
	
	/**
	 * Main entry function
	 *
	 */
	function SBSS( &$lanbilling )
	{
		$this->lanbilling = $lanbilling;
		$this->connection = $lanbilling->descriptor;
		
		if(!$this->ifIcluded("sbssSettings.class.php"))
			include_once("sbssSettings.class.php");
		
		$this->settings = new sbssSettings($this->connection);
		$this->settings->initCommonOptions();
		$this->settings->initManagers();
		$this->settings->initRequestClasses();
		$this->settings->initStatusList();
	} // end billingSBSS()
	
	
	/**
	 * Get tickets list from DB.
	 * @param	array, filter
	 * 		["string"] = string, concatination with ticket id and message body
	 * 		["authorType"] = integer, author type
	 * 		["authorId"] = integer or array author id, if there is authorId and not set authorType, than authorType = 0
	 * 		["responType"] = integer respondent type
	 * 		["respondId"] = integer or array respondent id, if there is respondId and not set respondType, than respondType = 0
	 * 		["classId"] = integer or array of the ticket's class
	 * 		["vgId"] = integer or array of the vgid linked to ticket
	 * 		["status"] = integer or array ticket status
	 * 		["responsible"] = integer or array ticket responsible man
	 * 		["ticketId"] = integer or array ticket id
	 * 		["dateFormat"] = string to format output date
	 * @param	integer order
	 * @param	integer to ASC or DESC result array
	 * @param	integer current page, if 0, than all
	 */
	function getTickets( $filter = null, $orderby = 0, $desc = 0, $page = 0 )
	{
		$_filter = array();
		$clients = array();
		$dateFormat = "%H:%i %d.%m.%Y";
		
		if(isset($filter["authorId"]) && !isset($filter["authorType"]))
			$filter["authorType"] = 0;
		
		if(isset($filter["respondId"]) && !isset($filter["respondType"]))
			$filter["respondType"] = 0;
		
		if(sizeof($filter) > 0)
		{
			foreach($filter as $key => $value)
			{
				switch( true )
				{
					case ($key == "string" && $value != ""):
						$_filter[] = sprintf("(tickets.id IN (%s) OR tickets.name LIKE '%%%s%%')", $this->findInPost($value), $this->settings->escapeQueryString($value));
					break;
					
					case ($key == "authorType" && !is_null($value) && (integer)$value >= 0): 
						$_filter[] = sprintf("tickets.author_type = %d", $value);
					break;
					
					case ($key == "authorId" && !is_null($value)):
						if(is_array($value))
							$_filter[] = sprintf("tickets.author_id IN (%s)", (sizeof($value) > 0) ? implode(",", $value) : "NULL");
						else $_filter[] = sprintf("tickets.author_id = %d", $value);
					break;
					
					case ($key == "respondType" && !is_null($value) && (integer)$respondType >= 0):
						$_filter[] = sprintf("tickets.respondent_type = %d", $value);
					break;
					
					case ($key == "respondId" && !is_null($value)):
						if(is_array($value))
							$_filter[] = sprintf("tickets.respondent_id IN (%s)", (sizeof($value) > 0) ? implode(",", $value) : "NULL");
						else $_filter[] = sprintf("tickets.respondent_id = %d", $value);
					break;
					
					case ($key == "classId"):
						if(is_array($value))
							$_filter[] = sprintf("tickets.class_id IN (%s)", (sizeof($value) > 0) ? implode(",", $value) : "NULL");
						elseif($value != "" && (integer)$value > 0) $_filter[] = sprintf("tickets.class_id = %d", $value);
					break;
					
					case ($key == "vgId"):
						if(is_array($value))
							$_filter[] = sprintf("tickets.vgid IN (%s)", (sizeof($value) > 0) ? implode(",", $value) : "NULL");
						elseif($value != "" && (integer)$value > 0) $_filter[] = sprintf("tickets.vgid = %d", $value);
					break;
					
					case ($key == "status"):
						if(is_array($value))
							$_filter[] = sprintf("tickets.status_id IN (%s)", (sizeof($value) > 0) ? implode(",", $value) : "NULL");
						elseif($value != "" && (integer)$value > 0)
							$_filter[] = sprintf("tickets.status_id = %d", $value);
					break;
					
					case ($key == "responsible"):
						if(is_array($value))
							$_filter[] = sprintf("tickets.responsible_man IN (%s)", (sizeof($value) > 0) ? implode(",", $value) : "NULL");
						elseif($value != "" && (integer)$value >= 0)
							$_filter[] = sprintf("tickets.responsible_man = %d", $value);
					break;
					
					case ($key == "ticketId"):
						if(is_array($value))
							$_filter[] = sprintf("tickets.id IN (%s)", (sizeof($value) > 0) ? implode(",", $value) : "NULL");
						elseif($value != "" && (integer)$value > 0) $_filter[] = sprintf("tickets.id = %d", $value);
					break;
					
					case ($key == "dateFormat" && strlen($value) > 0):
						$dateFormat = $value;
					break;
				}
			}
		}
		
		if( false == ($sql_query = mysql_query(sprintf("SELECT count(*) FROM sbss_tickets AS tickets %s",
			(sizeof($_filter) > 0) ? "WHERE " . implode(" AND ", $_filter) : ""), $this->connection)) )
		{
			$this->ErrorHandler("Error to get tickets array: " . mysql_error($this->connection), __LINE__);
			$this->ticketList = array();
			return false;
		}
		
		if(mysql_result($sql_query, 0) > 0)
		{
			$this->totalRows = mysql_result($sql_query, 0);
			$this->pages = ceil($this->totalRows / $this->rows);
			
			switch($orderby)
			{
				case 0: $orderby = "tickets.lastpost " . (($desc == 0) ? "" : "DESC"); break;
				case 1: $orderby = "tickets.name " . (($desc == 0) ? "" : "DESC"); break;
				case 3: $orderby = "tickets.replies " . (($desc == 0) ? "" : "DESC"); break;
			}
			
			if( false == ($sql_query = mysql_query(sprintf("SELECT tickets.id, tickets.name, tickets.author_type, 
							tickets.author_id, 
							DATE_FORMAT(tickets.created_on, '%s'), 
							tickets.respondent_type, tickets.respondent_id, 
							DATE_FORMAT(tickets.lastpost, '%s'), 
							tickets.responsible_man, tickets.class_id, 
							tickets.status_id, tickets.manager_lock, tickets.replies, 
							COUNT(files.id) fcount, tickets.vgid  
							FROM sbss_tickets AS tickets 
							LEFT JOIN sbss_posts_files AS files ON (files.ticket_id = tickets.id)
							%s 
							GROUP BY tickets.id ORDER BY %s %s",
							$dateFormat, $dateFormat, 
							(sizeof($_filter) > 0) ? "WHERE " . implode(" AND ", $_filter) : "", 
							$orderby,
							($page > 0) ? sprintf("LIMIT %d, %d", ($page * $this->rows) - $this->rows, $this->rows) : ""), $this->connection)) )
			{
				$this->ErrorHandler("Error to get tickets array: " . mysql_error($this->connection), __LINE__);
				$this->ticketList = array();
				return false;
			}
			
			while($row = mysql_fetch_row($sql_query))
			{
				$this->ticketList[] = array("id" => $row[0], 
							"name" => $row[1], 
							"aType" => $row[2], 
							"aId" => $row[3], 
							"created" => $row[4], 
							"respType" => $row[5], 
							"respId" => $row[6], 
							"last" => $row[7], 
							"man" => $row[8], 
							"class" => $row[9], 
							"status" => $row[10], 
							"lock" => $row[11], 
							"replies" => $row[12],
							"files" => $row[13],
							"vgid" => $row[14]);
				
				if($row[2] == 1) $clients[] = $row[3];
				if($row[14] > 0) $vgroups[] = $row[14];
			}
			
			$this->settings->initUsers($clients);
			// This is linked function from the main class lanbilling
			// Before call getTicket() define $sbss->settings->initVgroups = $lanbilling->getVgroupsList
			if(is_object($this->lanbilling) && sizeof($vgroups) > 0)
				$this->vgroupsList = $this->lanbilling->getVgroupsList(false, array("vgid" => $vgroups), 0, 0, $this->connection);
			
		}
		
		return $this->ticketList;
	} // end getTicket()
	
	
	/**
	 * Search and return ticket's ids by string in messages
	 * @param	string to search
	 * @param	bool if search in spec field
	 */
	function findInPost( $string, $use_spec = false )
	{
		if( false != ($sql_query = mysql_query(sprintf("SELECT GROUP_CONCAT(ticket_id) FROM sbss_posts 
				WHERE CONCAT(ticket_id, ' ', text %s) LIKE '%%%s%%'", 
				($use_spec) ? ", ' ', spec" : "",
				$this->settings->escapeQueryString($string)), $this->connection)) )
		{
			if(mysql_result($sql_query, 0) == "") return "NULL";
			else return mysql_result($sql_query, 0);
		}
		else
		{
			$this->ErrorHandler("Error while searching by string: " . mysql_error($this->connection), __LINE__);
			return "NULL";
		}
	} // end findInPost()
	
	
	/**
	 * Get Ticket's posts
	 * @param	integer ticket id
	 * @param	integer, author type: 0 - manager / admin, 1 - client
	 * @param	integer, man created ticket
	 */
	function getPosts( $ticketId = 0, $postId = 0, $authorType = 0, $authorId = 0 )
	{
		if(empty($ticketId))
		{
			$this->ErrorHandler("Error, I've got ticket ID: 0", __LINE__);
			return false;
		}
		
		if( false == ($sql_query = mysql_query(sprintf("SELECT posts.id, posts.ticket_id, 
							posts.author_type, posts.author_id, 
							DATE_FORMAT(posts.created_on,'%%H:%%i %%d.%%m.%%Y'), 
							posts.text, posts.spec
							FROM sbss_posts AS posts
							LEFT JOIN sbss_tickets AS tickets ON (tickets.id = posts.ticket_id) 
							WHERE posts.ticket_id = %d
							%s 
							%s GROUP BY posts.id ORDER BY posts.id", $ticketId, 
							($authoId > 0) ? sprintf("AND tickets.author_type = %d AND tickets.author_id = %d", $authorId, $authorType) : "",
							($postId > 0) ? sprintf("AND posts.id = %d", $postId) : ""), $this->connection)) )
		{
			$this->ErrorHandler("Error while getting posts for the ticket ID: " . $ticketId . "; " . mysql_error($this->connection), __LINE__);
		}
		
		while($row = mysql_fetch_row($sql_query))
			$this->postList[$row[0]] = array("ticketId" => $row[1], 
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
							FROM sbss_posts_files 
							WHERE ticket_id = %d", $ticketId), $this->connection)) )
		{
			$this->ErrorHandler("Error while getting post's files: " . $ticketId . "; " . mysql_error($this->connection), __LINE__);
		}
		
		if(mysql_num_rows($sql_query) > 0)
		{
			while($row = mysql_fetch_row($sql_query))
			{
				if(isset($this->postList[$row[0]]))
					$this->postList[$row[0]]["attach"][$row[1]] = array("created" => $row[2],
										"edited" => $row[3],
										"aType" => $row[4],
										"aId" => $row[5],
										"name" => $row[6],
										"descr" => $row[7],
										"size" => $row[8]);
			}
		}
		
		return $this->postList;
	} // end getPosts()
	
	
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
			(sizeof($filter) > 0) ? "WHERE " . implode(" AND ", $filter) : ""), $this->connection)) )
		{
			$this->ErrorHandler("Error while seraching user: " . mysql_error($this->connection), __LINE__);
			return false;
		}
		
		if(mysql_num_rows($sql_query) > 0)
			return mysql_fetch_array($sql_query, MYSQL_NUM);
		else return array();
	} // end searchUsers()
	
	
	/**
	 * Take a short statistic for the specified clien or manager by statuses (Group and count).
	 * Searching by author_id field
	 * @param	integer client type (0 - manager; 1 - client)
	 * @param	integer client id
	 * @param	integer vgroup id
	 */
	function authorStatusStatistic( $authorType = null, $authorId = null, $vgId = null )
	{
		if(is_null($authorId))
		{
			$this->ErrorHandler("I've got an empty author ID", __LINE__);
			return false;
		}
		
		if( false == ($sql_query = mysql_query(sprintf("SELECT status_id, COUNT(*) 
						FROM sbss_tickets WHERE author_type=%d  
						AND author_id=%d 
						%s 
						GROUP BY author_id, status_id", $authorType, $authorId, 
						(!is_null($vgId) && $vgId > 0) ? sprintf(" AND vgid = %d ", $vgId) : ""), $this->connection)) )
		{
			$this->ErrorHandler("Error while getting author statuses information: " . mysql_error($this->connection), __LINE__);
			return false;
		}
		
		$statusStat = array("total" => 0);
		while($row = mysql_fetch_row($sql_query))
		{
			$statusStat[$row[0]] = $row[1];
			$statusStat["total"] += $row[1];
		}
		
		return $statusStat;
	} // end authorStatusStatistic()
	
	
	/**
	 * Return Ticket structure, which is used to save now or update existing
	 *
	 */
	function initTicketStructure()
	{
		return array("id" => null, 
			"name" => null, 
			"aType" => null,
			"aId" => null, 
			"created" => null, 
			"respType" => null, 
			"respId" => null, 
			"last" => null, 
			"man" => null, 
			"class" => null, 
			"status" => null, 
			"lock" => null, 
			"replies" => null,
			"vgid" => null);
	} // end initTicketStructure()
	
	
	/**
	 * Return Ticket structure, which is used to save now or update existing
	 *
	 */
	function initPostStructure()
	{
		return array("id" => null, 
			"ticketId" => null, 
			"aType" => null, 
			"aId" => null, 
			"created" => null, 
			"text" => null, 
			"spec" => null);
	} // end initPostStructure()
	
	
	/**
	 * Save new or existing ticket data
	 * As value You can set sql statment like this @now()@
	 * @param	array structure to save
	 */
	function saveTicket( $structure )
	{
		$this->structure = $this->initTicketStructure();
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
		
		if( false == ($sql_query = mysql_query(sprintf("INSERT INTO sbss_tickets SET id=%s, 
				name=%s, author_type=%s,
				author_id=%s, created_on=%s,
				respondent_type=%s, respondent_id=%s,
				lastpost=%s, responsible_man=%s,
				class_id=%s, replies=%s,
				status_id=%s, manager_lock=%s, 
				vgid=%s 
				ON DUPLICATE KEY UPDATE 
				name=%s, author_type=%s,
				author_id=%s, created_on=%s,
				respondent_type=%s, respondent_id=%s,
				lastpost=%s, responsible_man=%s,
				class_id=%s, replies=%s,
				status_id=%s, manager_lock=%s, 
				vgid=%s", 
				is_null($this->structure["id"]) ? "NULL" : $this->structure["id"],
				is_null($this->structure["name"]) ? "name" : $this->structure["name"], 
				is_null($this->structure["aType"]) ? "author_type" : $this->structure["aType"],
				is_null($this->structure["aId"]) ? "author_id" : $this->structure["aId"],
				is_null($this->structure["created"]) ? "created_on" : $this->structure["created"],
				is_null($this->structure["respType"]) ? "respondent_type" : $this->structure["respType"],
				is_null($this->structure["respId"]) ? "respondent_id" : $this->structure["respId"],
				is_null($this->structure["last"]) ? "lastpost" : $this->structure["last"],
				is_null($this->structure["man"]) ? "responsible_man" : $this->structure["man"],
				is_null($this->structure["class"]) ? "class_id" : $this->structure["class"],
				is_null($this->structure["replies"]) ? "replies" : $this->structure["replies"],
				is_null($this->structure["status"]) ? "status_id" : $this->structure["status"],
				is_null($this->structure["lock"]) ? "NULL" : $this->structure["lock"],
				is_null($this->structure["vgid"]) ? "vgid" : $this->structure["vgid"],
				is_null($this->structure["name"]) ? "name" : $this->structure["name"], 
				is_null($this->structure["aType"]) ? "author_type" : $this->structure["aType"],
				is_null($this->structure["aId"]) ? "author_id" : $this->structure["aId"],
				is_null($this->structure["created"]) ? "created_on" : $this->structure["created"],
				is_null($this->structure["respType"]) ? "respondent_type" : $this->structure["respType"],
				is_null($this->structure["respId"]) ? "respondent_id" : $this->structure["respId"],
				is_null($this->structure["last"]) ? "lastpost" : $this->structure["last"],
				is_null($this->structure["man"]) ? "responsible_man" : $this->structure["man"],
				is_null($this->structure["class"]) ? "class_id" : $this->structure["class"],
				is_null($this->structure["replies"]) ? "replies" : $this->structure["replies"],
				is_null($this->structure["status"]) ? "status_id" : $this->structure["status"],
				is_null($this->structure["lock"]) ? "NULL" : $this->structure["lock"],
				is_null($this->structure["vgid"]) ? "vgid" : $this->structure["vgid"]), $this->connection)) )
		{
			$this->ErrorHandler("Error while saving ticket: " . $ticketId . "; " . mysql_error($this->connection), __LINE__);
			return false;
		}
		
		if(is_null($this->structure["id"]))
		{
			if( false == ($sql_query = mysql_query("SELECT LAST_INSERT_ID()", $this->connection)) )
			{
				$this->ErrorHandler("Error, can't get new record ID; " . mysql_error($this->connection), __LINE__);
				return false;
			}
			
			$this->structure["id"] = mysql_result($sql_query, 0);
			if(empty($this->structure["id"]))
			{
				$this->ErrorHandler("Error, SQL return an empty result for the ticket ID; ", __LINE__);
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
	function savePost( $structure )
	{
		$this->structure = $this->initPostStructure();
		$flagok = false;
		
		if(empty($structure["id"]) || $structure["id"] == 0)
			$structure["id"] = null;
		
		if(empty($structure["ticketId"]))
		{
			$this->ErrorHandler("I've an empty ticket ID, no save avaliable", __LINE__);
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
		
		if( false == ($sql_query = mysql_query(sprintf("INSERT INTO sbss_posts SET id=%s, 
				ticket_id=%s, author_type=%s, 
				author_id=%s, created_on=%s, 
				text=%s, spec=%s 
				ON DUPLICATE KEY UPDATE 
				ticket_id=%s, author_type=%s, 
				author_id=%s, created_on=%s, 
				text=%s, spec=%s", 
				is_null($this->structure["id"]) ? "NULL" : $this->structure["id"],
				is_null($this->structure["ticketId"]) ? "NULL" : $this->structure["ticketId"],
				is_null($this->structure["aType"]) ? "author_type" : $this->structure["aType"],
				is_null($this->structure["aId"]) ? "author_id" : $this->structure["aId"],
				is_null($this->structure["created"]) ? "created_on" : $this->structure["created"],
				is_null($this->structure["text"]) ? "created_on" : $this->structure["text"],
				is_null($this->structure["spec"]) ? "created_on" : $this->structure["spec"],
				is_null($this->structure["ticketId"]) ? "NULL" : $this->structure["ticketId"],
				is_null($this->structure["aType"]) ? "author_type" : $this->structure["aType"],
				is_null($this->structure["aId"]) ? "author_id" : $this->structure["aId"],
				is_null($this->structure["created"]) ? "created_on" : $this->structure["created"],
				is_null($this->structure["text"]) ? "created_on" : $this->structure["text"],
				is_null($this->structure["spec"]) ? "created_on" : $this->structure["spec"]), $this->connection)) )
		{
			$this->ErrorHandler("Error while saving post with ticket ID: " . $ticketId . "; " . mysql_error($this->connection), __LINE__);
			return false;
		}
		
		if(is_null($this->structure["id"]))
		{
			if( false == ($sql_query = mysql_query("SELECT LAST_INSERT_ID()", $this->connection)) )
			{
				$this->ErrorHandler("Error, can't get new record ID; " . mysql_error($this->connection), __LINE__);
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
	function deletePost( $postId )
	{
		if( false == (mysql_query(sprintf("DELETE FROM sbss_posts WHERE id = %d", $postId), $this->connection)))
		{
			$this->ErrorHandler("Error while removing post ID: " . $poistId . "; " . mysql_error($this->connection), __LINE__);
			return false;
		}
		return true;
	} // end deletePosy()
	
	
	/**
	 * Prepare array [key] = value to string key=value use comma separator
	 * @param	array values
	 */
	private function prepare( $_array, $_separator )
	{
		if(sizeof($_array) == 0) return "";
		if(empty($_separator)) $_separator = ",";
		
		$_temp = array();
		foreach($_array as $_key => $_value)
			$_temp[] = $_key . (strlen($_value) > 0) ? sprintf("='%s'" . $this->settings->escapeQueryString($_value)) : "";
		
		return implode($_separator, $_temp);
	} // end prepare()
	
	
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
		$message = sprintf("sbss.class.php: %s; at line %s", $message, $line);
		error_log($message, 0);
	} // end ErrorHandler()
} // end class SBSS
?>