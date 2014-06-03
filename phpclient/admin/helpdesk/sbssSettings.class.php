<?php
/**
 * SBSS common system settings stored in the billing.options table
 * SBSS plugins settings
 * SBSS classes's settins
 */

class sbssSettings {
	
	/**
	 * DB connection resource
	 * @var		resource
	 */
	public $descriptor = false;
	
	/**
	 * SBSS common system options array structure
	 * @var		array
	 */
	var $commonSettings = array(
		"sbss_crm_files" => "",					// Path to save / read crm attachments
		"sbss_ticket_files" => "",				// Path to save / read ticket attachments
		"sbss_ticket_superviser" => "0"				// Default ticket superviser
		);
	
	/**
	 * E-mail connector options structure
	 * @var		array
	 */
	var $emailCSettings = array(
		"crm_email_filepath" => "",				// Where to store email files
		"crm_email_getproto" => "1",				// Client get mail protocol
		"crm_email_gethost" => "localhost.localhost.ru",	// Client get mail server
		"crm_email_getport" => "993",				// Client get mail host port
		"crm_email_gettls" => "1",				// If client use tls to get mail
		"crm_email_getuser" => "crm@localhost.ru",		// Client user name to get mail
		"crm_email_getpass" => "",				// Client password to get mail
		"crm_email_imapfolder" => "INBOX",			// Root name of the IMAP folder on the server
		"crm_email_size" => "10485760",				// E-mail size allowed, bytes
		"crm_email_flush" => "120",				// Check mail each interval
		"crm_email_debug" => "1",				// Debug Email connector
		"crm_email_box" => "crm@localhost.ru",			// CRM system email box
		"crm_email_smtphost" => "localhost.localhost.ru",	// Send email via host
		"crm_email_smtpport" => "25",				// SMTP server port
		"crm_email_smtptls" => "1",				// Use tls auth method to send email
		"crm_email_smtpmethod" => "2",				// Authorization method
		"crm_email_smtpuser" => "crm@localhost.ru",		// Smtp user name
		"crm_email_smtppass" => ""				// Smtp password
		);
	
	
	/**
	 * Contains manager list from DB
	 * @var		array
	 */
	var $managerList = array();
	
	/**
	 * Status list from DB
	 * @var		array
	 */
	var $statusList = array();
	
	/**
	 * Request classes list from DB
	 * @var		array
	 */
	var $requestClasses = array();
	
	/**
	 * Client classes arra
	 *
	 */
	var $clientClasses = array();
	
	
	
	/**
	 * Constructor function, runs on create object
	 * @param	resource, db connection
	 */
	function __construct( &$descriptor )
	{
		$this->descriptor = $descriptor;
	} // end __construct()
	
	
	/**
	 * Get email connector settings from DB
	 *
	 */
	function initEmailCOptions()
	{
		if( false != ($sql_query = mysql_query("SELECT name, value FROM options WHERE name LIKE 'crm_email_%'", $this->descriptor)) )
		{
			while($row = mysql_fetch_row($sql_query))
			{
				if(isset($this->emailCSettings[$row[0]]))
					$this->emailCSettings[$row[0]] = $row[1];
			}
		}
		else $this->ErrorHandler("Error while getting E-mail connector options: " . mysql_error($this->descriptor), __LINE__);
		
		return $this->emailCSettings;
	} // end initEmailCOptions()
	
	
	/**
	 * Get SBSS commont settings
	 *
	 */
	function initCommonOptions()
	{
		if( false != ($sql_query = mysql_query("SELECT name, value FROM options WHERE name LIKE 'sbss_%'", $this->descriptor)) )
		{
			while($row = mysql_fetch_row($sql_query))
			{
				if(isset($this->commonSettings[$row[0]]))
					$this->commonSettings[$row[0]] = $row[1];
			}
		}
		else $this->ErrorHandler("Error while getting common options: " . mysql_error($this->descriptor), __LINE__);
		
		return $this->commonSettings;
	} // end initCommonOptions()
	
	
	/**
	 * Initialize manager information from DB
	 *
	 */
	function initManagers()
	{
		if( false != ($sql_query = mysql_query("SELECT person_id, fio, email, archive FROM managers where archive = 0 ORDER BY fio", $this->descriptor)) )
		{
			while($row = mysql_fetch_row($sql_query))
				$this->managerList[$row[0]] = array("name" => $row[1], "email" => $row[2], "archive" => $row[3]);
		}
		else $this->ErrorHandler("Error while getting manager list: " . mysql_error($this->descriptor), __LINE__);
		
		return $this->managerList;
	} // end initManagers()
	
	
	/**
	 * Get clients information by id array
	 * @param	array or integer
	 */
	function initUsers( $ids = null )
	{
		if(is_null($ids) || empty($ids))
			return false;
		
		if( false == ($sql_query = mysql_query(sprintf("SELECT uid, name, email FROM accounts WHERE uid IN (%s) GROUP BY uid", 
					!empty($ids) ? implode(",", $ids) : "NULL"), $this->descriptor)) )
		{
			$this->ErrorHandler("Error while getting users information: " . mysql_error($this->descriptor), __LINE__);
			return false;
		}
		
		$this->clientList = array();
		while($row = mysql_fetch_row($sql_query))
		{
			$this->clientList[$row[0]] = array("name" => $row[1],
							"email" => $row[2]);
		}
		
		return $this->clientsList;
	} // end initUsers()
	
	
	/**
	 * Build array of CRM system ticket's statuses to use them later
	 * 
	 */
	function initStatusList()
	{
		if( false == ($sql_query = mysql_query("SELECT id, type, descr, color, active, display_default, client_modify_allow, 
							default_new, default_answer FROM sbss_statuses WHERE `group` = 0 AND `archive` = 0", $this->descriptor)) )
		{
			$this->ErrorHandler("Can't get statuses list from DB: " . mysql_error($this->descriptor), __LINE__);
			return false;
		}
		
		$this->statusList = array();
		while($row = mysql_fetch_row($sql_query))
		{
			$this->statusList[$row[0]] = array( "descr" => $row[2], 
							"type" => $row[1], 
							"color" => $row[3], 
							"active" => $row[4], 
							"display_def" => $row[5], 
							"cli_modify" => $row[6], 
							"request_def" => $row[7], 
							"response_def" => $row[8]);
		}
		
		$this->statusList;
	} // end initStatusList()
	
	
	/**
	 * Saving prepared array structure of the statuses to DB
	 * @param	array of request classes
	 */
	function saveStatusList( $options )
	{
		if(sizeof($options) == 0) return true;
		
		foreach($options as $key => $arr)
		{
			if( false == (mysql_query(sprintf("INSERT INTO sbss_statuses SET id = %d, descr = '%s', type = %d, 
							color = '%s', active = %d, display_default = %d, 
							client_modify_allow = %d, default_new = %d, default_answer = %d 
							ON DUPLICATE KEY UPDATE descr = '%s', type = %d, 
							color = '%s', active = %d, display_default = %d, 
							client_modify_allow = %d, default_new = %d, default_answer = %d", $key, 
							$this->escapeQueryString($arr["descr"]), 
							$arr["type"],
							$this->escapeQueryString($arr["color"]), 
							$arr["active"], 
							$arr["display_def"], 
							$arr["cli_modify"], 
							$arr["request_def"],
							$arr["response_def"],
							$this->escapeQueryString($arr["descr"]), 
							$arr["type"],
							$this->escapeQueryString($arr["color"]), 
							$arr["active"], 
							$arr["display_def"], 
							$arr["cli_modify"], 
							$arr["request_def"],
							$arr["response_def"]), $this->descriptor)) )
			{
				$this->ErrorHandler("Can't create / update statuses list: " . mysql_error($this->descriptor), __LINE__);
				return false;
			}
		}
		
		return true;
	} // end saveStatusList()
	
	
	/**
	 * Save Email connector setting to DB
	 *
	 */
	function saveOptions( $options )
	{
		if(!is_array($options) || sizeof($options) == 0)
		{
			$this->ErrorHandler("Error, I've got an empty options array ", __LINE__);
			return false;
		}
		
		foreach($options as $key => $value)
		{
			if( false == mysql_query(sprintf("INSERT INTO options SET name = '%s', value = '%s' ON DUPLICATE KEY UPDATE value = '%s'",
							$key, $this->escapeQueryString($value), $this->escapeQueryString($value)), $this->descriptor))
			{
				$this->ErrorHandler("Error while saving options: " . mysql_error($this->descriptor), __LINE__);
				return false;
			}
		}
		
		return true;
	} // end saveOptions()
	
	
	/**
	 * Build array of CRM system ticket requsts classes to use them later
	 * 
	 */
	function initRequestClasses()
	{
		if( false == ($sql_query = mysql_query("SELECT id, descr, color, responsible_man FROM sbss_request_classes", $this->descriptor)) )
		{
			$this->ErrorHandler("Can't get request classes list from DB: " . mysql_error($this->descriptor), __LINE__);
			return false;
		}
		
		$this->requestClasses = array();
		while($row = mysql_fetch_row($sql_query))
		{
			$this->requestClasses[$row[0]] = array( "descr" => $row[1], 
							"color" => $row[2], 
							"responsible" => $row[3]);
		}
		
		return $this->requestClasses;
	} // end initRequestClasses()
	
	
	/**
	 * Saving prepared array structure of the request classes to DB
	 * @param	array of request classes
	 */
	function saveRequestClasses( $options )
	{
		if(sizeof($options) == 0) return true;
		
		foreach($options as $key => $arr)
		{
			if( false == (mysql_query(sprintf("INSERT INTO sbss_request_classes SET id = %d, descr = '%s', color = '%s', 
							responsible_man = '%s' ON DUPLICATE KEY UPDATE descr = '%s', color = '%s', 
							responsible_man = '%s'", $key, 
							$this->escapeQueryString($arr["descr"]), 
							$this->escapeQueryString($arr["color"]), 
							$arr["responsible"], 
							$this->escapeQueryString($arr["descr"]), 
							$this->escapeQueryString($arr["color"]), 
							$arr["responsible"]), $this->descriptor)) )
			{
				$this->ErrorHandler("Can't create / update request classes: " . mysql_error($this->descriptor), __LINE__);
				return false;
			}
		}
		
		return true;
	} // end saveRequestClasses()
	
	
	/**
	 * Build array of CRM system client classes to use them later
	 * 
	 */
	function initClientClasses()
	{
		if( false == ($sql_query = mysql_query("SELECT id, descr, color FROM sbss_client_classes", $this->descriptor)) )
		{
			$this->ErrorHandler("Can't get client classes list from DB: " . mysql_error($this->descriptor), __LINE__);
			return false;
		}
		
		$this->clientClasses = array();
		while($row = mysql_fetch_row($sql_query))
		{
			$this->clientClasses[$row[0]] = array( "descr" => $row[1], 
								"color" => $row[2]);
		}
		
		return $this->clientClasses;
	} // end initClientClasses()
	
	
	/**
	 * Saving prepared array structure of the client classes to DB
	 * @param	array of request classes
	 */
	function saveClientClasses( $options )
	{
		if(sizeof($options) == 0) return true;
		
		foreach($options as $key => $arr)
		{
			if( false == (mysql_query(sprintf("INSERT INTO sbss_client_classes SET id = %d, descr = '%s', color = '%s' 
							ON DUPLICATE KEY UPDATE descr = '%s', color = '%s'", $key, 
							$this->escapeQueryString($arr["descr"]), 
							$this->escapeQueryString($arr["color"]), 
							$this->escapeQueryString($arr["descr"]), 
							$this->escapeQueryString($arr["color"])), $this->descriptor)) )
			{
				$this->ErrorHandler("Can't create / update client classes: " . mysql_error($this->descriptor), __LINE__);
				return false;
			}
		}
		
		return true;
	} // end saveClientClasses()
	
	
	/**
	 * Check folder permitions to write file
	 * @param	string folder path
	 */
	function folderPermitions( $_folder = null )
	{
		if(is_null($_folder) || empty($_folder)) return false;
		
		if( false != fopen($_folder . "/.privileges", 'w') )
		{
			@unlink($_folder . "/.privileges");
			return true;
		}
		else return false;
	} // end folderPermitions()
	
	
	/**
	 * Remove slashes if magic_quotes_gpc is set in php.ini
	 * @param	string
	 */
	function stripMagicQuotes( $var )
	{
		if(get_magic_quotes_gpc())
		{
			return stripslashes($var);
		} else {
			return $var;
		}
	} // end stripMagicQuotes()
	
	
	/**
	 * Escaping special symbols in the string
	 * @param	string
	 */
	function escapeQueryString( $var, $descriptor = false )
	{
		if($descriptor == false && $this->descriptor != false)
			$descriptor = $this->descriptor;
		
		if(!$descriptor)
			return mysql_real_escape_string($this->stripMagicQuotes($var));
		else return mysql_real_escape_string($this->stripMagicQuotes($var), $descriptor);
	} // end escapeString()
	
	
	/**
	 * Error handler
	 * @param	string, message
	 * @param	line
	 */
	private function ErrorHandler( $message, $line )
	{
		$message = sprintf("sbssSettings.class.php: %s; at line %s", $_SERVER["PHP_SELF"], $message, $line);
		error_log($message, 0);
	} // end ErrorHandler()
} // end sbssSettings()
?>