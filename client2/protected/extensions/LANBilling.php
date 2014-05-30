<?php
/**
 * Main billing system class
 * Controls session validation, SOAP client. Contains additional function
 */
class LANBilling extends SOAP {
	/**
	 * PHP files directory root path
	 * @var		string
	 */
	public $rootPath = '';

	/**
	 * Operating system on this machine
	 * @var		string
	 */
	public $OS;

	/**
	 * If this OS is MS Windows. Detectes on construct
	 * @var		boolean
	 */
	public $MSWin = false;

	/**
	 * If this OS is UNIX like. Detectes on construct
	 * @var		boolean
	 */
	public $UNIX = false;

	/**
	 * Client IP connect from
	 *
	 */
	public $clientIP = false;

	/**
	 * Array of the system settings from options table
	 * @var		array
	 */
	public $settings = array();

	/**
	 * Localize object to speak interface native language
	 * @var		object
	 */
	public $localize = false;

	/**
	 * Authorization flag
	 * @var		boolean
	 */
	public $authorized = false;

	/**
	 * Authorized client identification number
	 * @var		integer
	 */
	public $client = 0;

	/**
	 * Authorized client full information
	 * @var		integer
	 */
	public $clientInfo = null;
	
	/**
	 * Shared posts categories for client
	 * @var		integer
	 */
	public $sharedPostsCategories = array();

	/**
	 * Knowledge file name template
	 * @var 	string
	 */
	public $knowledgeFileTemplate = "KB_%011d";

	/**
	 * Ticket file name template
	 * @var 	string
	 */
	public $postFileTemplate = "TTMS_%011d";

	/**
	 * Debug start time
	 * @var		integer
	 */
	private $debugStartTime = null;

	/**
	 * Debug start line
	 * @var		integer
	 */
	private $debugStartLine = 0;

	/**
	 * Dump file name
	 * @var		string
	 */
	private $dumpFile = "lb_debug_client_dump";

	/**
	 * Session name use to indetify
	 * @var 	string
	 */
	private $sesName = 'c8e157c1165c';

	/**
	 * Authenticated session TTL
	 * @var		integer
	 */
	private $authTTL = 360000;

	/**
	 * Interface configuration file name
	 * @var		string
	 */
	private $configFile = "../config/client_interface.cfg";

	/**
	 * Temporary Interface configuration file name prefix
	 * @var		string
	 */
	private $configTmpFile = "lb_client_cfg_";


    function init(){

    }

	/**
	 * Class constructor function, is calling on class object creation
	 * @param	array, known options
	 * 		[rootPath] => root path for interface for right including
	 */
	public function __construct( $options = array() )
	{
		// Check memory limit and up it if is too low
		if((integer)ini_get('memory_limit') < 64) {
			ini_set('memory_limit', 64 . "M");
		}

		// Initialize php files root directory path
		if(isset($options['rootPath'])) {
			$this->rootPath = trim($options['rootPath']);
		}

		// If there was turned on debug flag
		if(defined("FILE_DEBUG") && FILE_DEBUG == true) {
			$this->debug(null, true);
		}

		// Detect Operating system
		$this->getOS();
		// Initialize client ip
		$this->getClientIP();
		// Create session or start existing
		$this->createSession();
		// SOAP client load
		parent::__construct();
		$this->rootPath = dirname(__FILE__) . '/';
		// Read configuration
		//$this->readIntefaceConfig();
		// Create Localize object

		if($this->isConstant('INTERFACE_LANGUAGE') == false) {
			define('INTERFACE_LANGUAGE', 'auto');
		}
	} // end __construct()


	/**
	 * Try to detect Server Operating System using SERVER_SOFTWARE variable
	 *
	 */
	 
	public function getRows($function,$params = array()) {
		return $this->toArray($this->get($function,$params));
	}
	
	public function getItem($function,$params = array()) {
		$ret = $this->get($function,$params);
		if(is_array($ret)) return false;
		return $ret;
	}
	
	protected function toArray($v) {
		if (!$v) return array();
		if (!is_array($v)) return array($v);
		else return $v;	
	}
	 
	private function getOS()
	{
		// Get operating system name
		$this->OS = getenv("SERVER_SOFTWARE");

		if(preg_match('/win32/i', $this->OS)) {
			$this->MSWin = true;
		}
		else $this->UNIX = true;
	} // end getOS()


	/**
	 * Retrieve billing global settings from DB
	 * All Values will be store to the assoc array
	 */
	public function initSettings()
	{
		if( false != ($result = $this->get("getOptions")) ) {
			foreach($result as $obj){
				if($obj->name == "license") continue;
				$this->settings[$obj->name] = $obj->value;
			}
		}
		else {
			$this->ErrorHandler(__FILE__, "Can't initialize LB setting", __LINE__);
		}
	} // end initSystemSettings()


	/**
	 * Get option value by name from the global array stored in the this->settings
	 * if option not found than returns false
	 * Need check result using if(false !== ($value = $lanbilling->Option))
	 * @param	string, option name
	 */
	public function getOption( $name = "" )
	{
		if(empty($name)) {
			return null;
		}

		if(empty($this->settings)) {
			$this->initSettings();
		}

		if (isset($this->settings[$name]))
            return $this->settings[$name];
        else return null;
	} // end Option()


	/**
	 * Get client full information
	 *
	 */
	public function setUid($uid) {
		$this->client = $uid;
	}
	public function getClient()
	{
		if(empty($this->client)) {
			yii::app()->auth->logout();
			if(DETAIL_REJECTED == true) {
				$this->ErrorHandler(__FILE__, "Confused, there is unknown client ID. Session Stoped!", __LINE__);
			}
		}

		if( false == ($this->clientInfo = $this->get("getClientAccount", array(
            'flt' => array('activonly' => 1)
        )))) {

			yii::app()->auth->logout();
		}
		
		if( false == ($this->sharedPostsCategories = $this->get("getSharedPostsCategories", array(
				'flt' => array()
		)))) {
		
			yii::app()->auth->logout();
		}
		if(!is_array($this->sharedPostsCategories)) {
			$this->sharedPostsCategories = array($this->sharedPostsCategories);
		}
		
		if(isset($this->clientInfo->addresses)) {
			if(!is_array($this->clientInfo->addresses)) {
				$this->clientInfo->addresses = array($this->clientInfo->addresses);
			}
		}

		if(isset($this->clientInfo->agreements)) {
			if(!is_array($this->clientInfo->agreements)) {
				$this->clientInfo->agreements = array($this->clientInfo->agreements);
			}
		}

		if(isset($this->clientInfo->addons)) {
			if(!is_array($this->clientInfo->addons)) {
				$this->clientInfo->addons = array($this->clientInfo->addons);
			}
		}

		return $this->clientInfo;
	} // end getClient()


	/**
	 * Get operators list or single operator by id
	 * @param	integer, operator id
	 * @param	boolean, return only default operator
	 */
	public function getOperators( $id = null, $default = false )
	{
		if(!isset($this->Operators))
		{
			if( false != ($result = $this->get('getAccounts', array('flt' => array('category' => 1)))) )
			{
				if(!is_array($result)) {
					$result = array($result);
				}

				foreach($result as $item) {
					$this->Operators[$item->account->uid] = (array)$item->account;
					$this->Operators[$item->account->uid]['name'] = htmlspecialchars($item->account->name, ENT_QUOTES, 'UTF-8');
				}
			}
		}

		if((integer)$id > 0) {
			if(isset($this->Operators[$id])) {
				return $this->Operators[$id];
			}
			else return array();
		}
		else if($default == true) {
			foreach($this->Operators as $item) {
				if($item['def'] == 1) {
					return $item;
				}
			}

			$this->ErrorHandler(__FILE__, 'Cannot find default operator by request (getOperators, default = true)');
			return array();
		}
		else return empty($this->Operators) ? NULL : $this->Operators;
	} // end getOperators()


	/**
	 * Build query string if there is _GET data, insert there devision value if not exists
	 * Return query string with get '?' delimiter
	 */
	public function getQueryString() {
		if(!empty($_GET)) {
			$_GET['devision'] = !$this->authorized ? $_GET['devision'] : $_POST['devision'];

			$_tmp = array();
			array_walk($_GET, create_function('$item, $key, $_tmp', '
				$_tmp[0][] = sprintf("%s=%s", $key, $item);
			'), array( &$_tmp ));

			return "?" . implode('&', $_tmp);
		}
		return '';
	} // end getQueryString()


	/**
	 * Read interface configuration file from prebuild temporary or create the new one
	 *
	 */
	private function readIntefaceConfig()
	{
		if(!isset($this->billingSystemPath)) {
			$this->billingSystemPath = $this->initBillingSystemPath();
		}

		if(!file_exists($this->billingSystemPath . "/" . $this->configFile)) {
			$cfg = $this->rootPath . $this->configFile;
		}
		else $cfg = $this->billingSystemPath . "/" . $this->configFile;

		$_tmp = $this->systemTemporary() . "/" . $this->configTmpFile . md5(filesize($cfg) . filemtime($cfg));

		if(!file_exists($_tmp)) {
			$cfg = file($cfg);
			$_string = "<?php\n/**\n * Client interface configuration file\n * \n */\n";
			$is_bool = create_function('$value','switch(true){ case(trim($value) == "true" || trim($value) == "false"): return true; default: return false; }');

			foreach($cfg as $line) {
				if(preg_match("/^[\s\t#\/]+/", $line)) continue;

				$values = explode("=", $line);
				if(sizeof($values) != 2) continue;

				if($is_bool($values[1])) {
					$_string .= sprintf("define('%s', %s);\n", strtoupper(trim($values[0])), trim($values[1]));
				}
				else $_string .= sprintf("define('%s', '%s');\n", strtoupper(trim($values[0])), trim($values[1]));
			}

			$_string .= "\n" . "?" . ">\n";
			if(!file_put_contents($_tmp, $_string, FILE_APPEND)) {
				$this->ErrorHandler("Cannot store configuration data: " . $_tmp, __LINE__);
			}
		}

		require_once($_tmp);
	} // end readIntefaceConfig()


	/**
	 * Start new session with specific name or connect existing
	 *
	 */
	private function createSession()
	{
		// Let us check our specific directory to store session file before change garbage time collection
		if(!ini_get('session.save_path')) {
			$this->isConstant("FILE_DEBUG") == true && $this->ErrorHandler(__FILE__, "There is empty session.save_path directive value. Cannot create subdirectory for session files");
		}
		else {
			$path_sep = $this->MSWin ? '\\' : '/';
			if(!is_dir(ini_get('session.save_path') . $path_sep . 'lbclient')) {
				if(mkdir(ini_get('session.save_path') . $path_sep . 'lbclient')) {
					ini_set('session.save_path', ini_get('session.save_path') . $path_sep . 'lbclient');
				}
			}
			else {
				ini_set('session.save_path', ini_get('session.save_path') . $path_sep . 'lbclient');
			}
		}

		@session_name($this->sesName) || $this->ErrorHandler(__FILE__, "Can't initialize session by name " . $this->sesName);
		@session_start() || $this->ErrorHandler(__FILE__, "Can't start manager session connected from: " . $this->clientIP);

 
		
	} // end createSession()


	/**
	 * Destroy session data
	 *
	 */
	public function destroySession()
	{
		if(isset($_COOKIE[session_name()])) {
			setcookie(session_name(), '', time()-42000, '/');
		}

		@session_destroy();
	} // end destroySession()


	/**
	 * Get real cleint IP
	 *
	 */
	public function getClientIP()
	{
		if(!empty($_SERVER['HTTP_CLIENT_IP'])) {
			$this->clientIP = $_SERVER['HTTP_CLIENT_IP'];
		}
		elseif(!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
			$this->clientIP = $_SERVER['HTTP_X_FORWARDED_FOR'];
		}
		else {
			$this->clientIP = $_SERVER['REMOTE_ADDR'];
		}

		return $this->clientIP;
	} // end getClientIP()


	/**
	 * Clone object with new options
	 * @param	integer, query timeout
	 */
	public function cloneMain( $options = array() )
	{
		if(!empty($options))
		{
			foreach($options as $key => $item)
			{
				switch($key) {
					case 'query_timeout':
						if((integer)$item > 0) {
							ini_set('default_socket_timeout', $item);
						}
					break;
				}
			}
		}

		return clone $this;
	} // end cloneMain()


	/**
	 * Remove slashes if magic_quotes_gpc is set in php.ini
	 * @param	string
	 */
	public function stripMagicQuotes( $var )
	{
		if(get_magic_quotes_gpc())
		{
			return stripslashes($var);
		} else {
			return $var;
		}
	} // end stripMagicQuotes()


	/**
	 * Clear address string, remove any empty values
	 * @param	string address
	 * @param	string separator to devide address string
	 */
	public function clearAddress( $address = "", $separator = "," )
	{
		if( trim($address) == "" )
			return "";

		$arr = explode($separator, $address);
		foreach($arr as $key => $value)
		{
			if(trim($value) == "")
				unset($arr[$key]);
		}

		return implode($separator, $arr);
	} // end clearAddress()


	/**
	 * Creates an array by using one array (SOAP array name) for keys and another (SOAP array data item) for its values
	 * @param	array, name to use as keys
	 * @param	array of object with data
	 */
	public function dataCombine( $names = array(), $data = array() )
	{
		if(empty($data)) {
			return array();
		}

		if(!is_array($data)) {
			$data = array($data);
		}

		$_data = array();
		if(empty($names)) {
			array_walk($data, create_function('$val, $key, $_tmp', '$_tmp[0][] = $val->val;'), array( &$_data ));
		}
		else {
			array_walk($data, create_function('$val, $key, $_tmp', '$_tmp[0][] = array_combine($_tmp[1], $val->val);'), array( &$_data, &$names ));
		}

		return $_data;
	} // end dataCombine


	/**
	 * Get array that contains numbers of pages allowed to show
	 * @param	integer, total RECORDS for the request
	 * @param	integer, current PAGE (not record)
	 * @param	integer, record limit for the page
	 * @param	integer, page numbers limit in array
	 */
	public function Pager( $records = 0, $current = 1, $limit = 10, $page_limit = 7 )
	{
		$_array = array('total_pages' => 0, 'total_blocks' => 0, 'block' => 1, 'items' => array(1));
		if(empty($records)) {
			return $_array;
		}

		if(empty($limit)) {
			$limit = 10;
		}

		if(empty($page_limit)) {
			$page_limit = 7;
		}

		$_array['total_pages'] = ceil($records / $limit);
		$_array['total_blocks'] = ceil($_array['total_pages'] / $page_limit);

		for($i = 1; $i <= $_array['total_blocks']; $i++) {
			if(($i * $page_limit) >= $current && $current > (($i - 1) * $page_limit)) {
				$start = ($i - 1) * $page_limit + 1;

				$_a = array_fill($start, $page_limit, 1);
				foreach($_a as $key => $value) {
					if($key > $_array['total_pages']) {
						unset($_a[$key]);
					}
				}

				$_array['block'] = $i;
				$_array['items'] = array_keys($_a);
				break;
			}
		}

		return $_array;
	} // end Pager()


	/**
	 * Send mail function
	 * @param	string, to set mail from address. If empty, than system default
	 * @param	stringm to send to
	 * @param	string mail subject
	 * @param	string mail message
	 */
	public function sendMailTo( $mail_from = "" , $mail_to = "", $subject = "", $message = "" )
	{
		if(!empty($mail_from))
		{
			if($this->checkEmailAddress($mail_from)) {
				ini_set(sendmail_from, $mail_from);
			}
			else {
				$this->ErrorHandler(__FILE__, "Wrong email format From: " . $mail_from . " Using system default!", __LINE__);
			}
		}

		if(empty($mail_to))
		{
			$this->ErrorHandler(__FILE__, "Empty email To. Stop sending!", __LINE__);
			return false;
		}
		else
		{
			if(strpos($mail_to, ",") !== false)
			{
				$emails = explode(",", $mail_to);
				foreach($emails as $key => $val)
				{
					$emails[$key] = trim($val);
					if(!$this->checkEmailAddress($emails[$key]))
					{
						$this->ErrorHandler(__FILE__, "Wrong email format To: " . $val . " Removed from list!", __LINE__);
						unset($emails[$key]);
					}
				}

				if(sizeof($emails) == 0)
				{
					$this->ErrorHandler("main.class.php", "There was not found correct mail To. Stop sending!", __LINE__);
					return false;
				}
				$mail_to = implode(", ", $emails);
			}
			else
			{
				if(!$this->checkEmailAddress($mail_to))
				{
					$this->ErrorHandler("main.class.php", "Wrong email format To: " . $mail_to . " Stop sending!", __LINE__);
					return false;
				}
			}
		}

		// Header
		$headers = "MIME-Version: 1.0\r\n";
		$headers .= "Content-Type: text/plain; charset=utf-8\r\n";
		$headers .= "Content-Transfer-Encoding: 8bit\r\n";

		if($this->checkEmailAddress($mail_from)) {
			$headers .= sprintf("Return-path: %s <%s>\r\n", $mail_from, $mail_from);
			$headers .= sprintf("From: %s <%s>\r\n", $mail_from, $mail_from);
		}

		$subject = sprintf("=?utf-8?B?%s?=", base64_encode($subject));
		$message = sprintf("%s\n", $message);

		if(mail($mail_to, $subject, $message, $headers))
			return true;
		else {
			$this->ErrorHandler(__FILE__, "There was error while sending email", __LINE__);
			return false;
		}
	} // end sendMailTo()


	/**
	 * Validate email address format
	 * @param	string address
	 * @param	bool, use strict format
	 */
	function checkEmailAddress( $email = "", $strict = true )
	{
		if(strlen($email) == 0) return false;

		$regex = ($strict) ? '/^([.0-9a-z_-]+)@(([0-9a-z-]+\.)+[0-9a-z]{2,4})$/i' :
				'/^([*+!.&#$�\'\\%\/0-9a-z^_`{}=?~:-]+)@(([0-9a-z-]+\.)+[0-9a-z]{2,4})$/i';

		if(preg_match($regex, trim($email))) return true;
		else return false;
	} // end checkEmailAddress()


	/**
	 * Convert relative path to full path string to billing system folder
	 * @param	string, some path
	 */
	public function convertRelativePath( $path )
	{
		if(preg_match("/^(\/)|(\w:[\/])/", $path)) return $path;

		if(!isset($this->billingSystemPath)) {
			$this->initBillingSystemPath();
		}

		return ($this->billingSystemPath . preg_replace("/^[\.\\/]+/", "", $path));
	} // end convertRelativePath()


	/**
	 * Check if there is defined constant. If none - returns false, else constant value
	 * @param	string, constant name
	 */
	public function isConstant( $_const = "" )
	{
		if(empty($_const)) {
			return false;
		}

		if(!defined($_const)) {
			return false;
		}

		return constant($_const);
	} // end isConstant()


	/**
	 * Performs date arithmetic
	 * @param	string, date to change (YYYY-mm-dd HH:ii:ss)
	 * @param	integer, interval to add
	 * @param	string, units in which the expression should be interpreted
	 * 			known: year, month, day
	 * @param	string, output formart
	 */
	public function subDate( $date_value = "", $interval = 0, $item = "", $format = 'Y-m-d H:i:s' )
	{
		if(empty($item) || trim(strtolower($date_value)) == 'now') {
			$_date = date_parse(date('Y-m-d H:i:s'));
		}
		else {
			if( false == ($_date = date_parse($date_value))) {
				return false;
			}

			if(!empty($_date['errors'])) {
				return $date_value;
			}
		}

		$date_onend = create_function('$_date, $item, $interval, $format, $scope', '
			$_subdate = date_parse(date("Y-m-d H:i:s", mktime(0, 0, 0, $_date["month"] + (($item == "month") ? (integer)$interval : 0), 1, $_date["year"] + (($item == "year") ? (integer)$interval : 0))));
			for($i = 31, $off = 20; $i > $off; $i--) {
				if(checkdate($_subdate["month"], $i, $_subdate["year"])){
					return $scope->formatDate(sprintf("%04d-%02d-%02d %02d:%02d:%02d",
						$_subdate["year"],
						$_subdate["month"],
						$i,
						$_date["hour"],
						$_date["minute"],
						$_date["second"]), $format);
				}
			}
			return false;
		');

		switch(strtolower($item))
		{
			case 'day':
				return date($format, mktime($_date['hour'], $_date['minute'], $_date['second'], $_date['month'], $_date['day'] + (integer)$interval, $_date['year']));

			case 'month':
				if((integer)$_date['day'] > 27 && ($_new = $date_onend($_date, $item, $interval, $format, $this))) {
					return $_new;
				}

				return date($format, mktime($_date['hour'], $_date['minute'], $_date['second'], $_date['month'] + (integer)$interval, $_date['day'], $_date['year']));

			case 'year':
				if((integer)$_date['day'] > 27 && ($_new = $date_onend($_date, $item, $interval, $format, $this))) {
					return $_new;
				}

				return date($format, mktime($_date['hour'], $_date['minute'], $_date['second'], $_date['month'], $_date['day'], $_date['year'] + (integer)$interval));

			default: return $date_value;
		}
	} // end subDate()


	/**
	 * To format reciedved SQL date to specified
	 * @param	string, date to convert YYYY-mm-dd HH:ii:ss
	 * @param	string, to format to
	 */
	public function formatDate( $date_value, $format )
	{
		if( false == ($_date = date_parse($date_value))) {
			return false;
		}

		if(!empty($_date['errors'])) {
			return $date_value;
		}

		if(empty($format)) {
			return $date_value;
		}

		return date($format, mktime((integer)$_date['hour'], (integer)$_date['minute'], (integer)$_date['second'], (integer)$_date['month'], (integer)$_date['day'], (integer)$_date['year']));
	} // end formatDate()


	/**
	 * Returns delta between two dates in hours or days
	 * @param	string, date in format YYYYMMDDHHiiss or YYYY-MM-DD HH:ii:ss
	 * @param	string, date in format YYYYMMDDHHiiss or YYYY-MM-DD HH:ii:ss
	 * @param	string, hours or days, default hours
	 */
	public function dateDelta( $A, $B, $type = 'hours' )
	{
		if(!is_object($A)) {
			$A = new DateTime($A);
		}

		if(!is_object($B)) {
			$B = new DateTime($B);
		}

		$A = strtotime($A->format("Y-m-d H:i:s"));
		$B = strtotime($B->format("Y-m-d H:i:s"));
		$C = $A - $B;

		switch($type) {
			case 'days': $C = "" . $C / 60 / 60/ 24; break;
			default: $C = "" . $C / 60 / 60;
		}

		$D = strpos($C, ".");
		if ($D !== false) {
			$C = substr($C, 0, $D + 3);
		}

		if($C < 0) {
			$C = $C * -1;
		}

		return $C;
	} // end dateDelta()


	/**
	 * Checks if file was included or required earlier
	 * @param	string file name
	 */
	public function ifIncluded( $file )
	{
		$included = get_included_files();

		foreach ($included as $name)
		{
			if($name == $file) return true;
		}

		return false;
	} // end ifIncluded()


	/**
	 * Create numbered array and pass it to the callback function ( keyValue, arrayKey, passesParams )
	 * This function useful to iterate date unit, for exam;e year
	 * @param	integer, start iteration from point
	 * @param	integer, stop iteration on point
	 * @param	string, callback function name for each array item
	 * @param	mixed, parameter to pass to the callback function
	 * @param	array, exclude default iteration and use passed array
	 * @param	integer, add undefined value at the begining of array
	 */
	public function parseArrayUnit( $from = 0, $till = 0, $callback, $params, $myarray = array(), $undefined = null )
	{
		if((integer)$from == (integer)$till && sizeof($myarray) == 0) return false;

		if((integer)$from != (integer)$till) {
			$myarray = array();
			for($from; $from <= $till; $from++) { $myarray[$from] = $from; }
		}

		if(isset($undefined)) {
			$myarray[$undefined['key']] = $undefined['value']; ksort($myarray);
		}

		array_walk($myarray, $callback, $params);
	} // end parseArrayUnit()


	/**
	 * Convert integer seconds value to string like HH:ii:ss
	 * @param	integer, seconds value
	 */
	public function secondsToString( $time = 0 )
	{
		$hours = ($time - ($time % 3600)) / 3600;
		$time = $time - ($hours * 3600);

		$min = sprintf("%02d", ($time - ($time % 60)) / 60);
		$sec = sprintf("%02d", $time - ($min * 60));

		if($hours < 10) $hours = sprintf("%02d", $hours);
		return ( $hours . ':' . $min . ':' . $sec );
	} // end convertToTime()


	/**
	 * Convert bytes integer to MB value
	 * @param	integer, bytes
	 */
	public function bytesToMb( $byte = 0 )
	{
		return str_replace(".", ",", sprintf("%.03f", ($byte / 1024 / 1024)));
	} // end bytesToMb()


	/**
	 * Create month array and pass it to the callback function ( keyValue, arrayKey, passesParams )
	 * @param	string, callback function name for each array item
	 * @param	mixed, parameter to pass to the callback function
	 * @param	boolean, add undefined value at the begining of array
	 */
	public function parseMonths( $callback, $params, $undefined = null )
	{
		$months = array(1 => "January", 2 => "February", 3 => "March", 4 => "April", 5 => "May",
			6 => "June", 7 => "July", 8 => "August", 9 => "September", 10 => "October", 11 => "November", 12 => "December");

		if(isset($undefined)) {
			$months[0] = $undefined; ksort($months);
		}

		array_walk($months, $callback, $params);
	} // end parseMonths()


	/**
	 * Convert lines numbers to page number
	 * @param	integer, lines on page
	 * @param	integer, current page
	 */
	public function linesAsPageNum( $limit, $line )
	{
		$page = ceil($line / $limit);

		if($page == 0) return 1;
		else return $page;
	} // end linesAsPageNum()


	/**
	 * This function is a bug fix for the php 5.2.x to represent correct view of the large number
	 * @param	string / float / integer value to check for the short form mat %fE+-%d
	 */
	public function largeNumber( $value )
	{
		if(preg_match('/^[\d\.\d]+E[\+\-]\d$/', $value)) {
			return (integer)$value;
		}
		else return $value;
	} // end largeNumber()


	/**
	 * Check number and convert float value with comma delimiter to number with point delimiter
	 * @param	float
	 */
	public function float( $value = 0 )
	{
		return ((float)str_replace(",", ".", $value));
	} // end float()


	/**
	 * Create file path according to the billing folder path
	 * If path is relative than there'll be added start path
	 * @param	string, some path
	 */
	public function initBillingSystemPath( $path = '' )
	{
		if(preg_match("/^(\/)|(\w:[\/])/", $path)) return $path;

		if(!isset($this->billingCorePath))
		{
			if($this->MSWin)
			{
				try {
					$shell = new COM("WScript.Shell") or die("Requires Windows Scripting Host");
					$this->billingCorePath = $shell->RegRead("HKEY_LOCAL_MACHINE\\SOFTWARE\\LANBilling\\LBcore\\MyPath");
				} catch(ErrorException $e) {
					$this->billingCorePath = "C:\\Program Files\\LANBilling\\LBcore";
					$this->ErrorHandler(__FILE__, "Can't get billing root path for the " . $this->OS . ". Using default: " . $this->billingCorePath, __LINE__);
				}
			}
			else $this->billingCorePath = "/usr/local/billing/";
		}

		return ($this->billingCorePath . preg_replace("/^[\.\\/]+/", "", $path));
	} // end initBillingSystemPath()


	/**
	 * Check uploaded files array
	 * @param	string, array key from the post that contains files
	 */
	public function UploadCheck( $key = null )
	{
		if(isset($_FILES[$key]))
		{
			$this->UploadFiles = array();

			if(is_array($_FILES[$key]["name"]))
			{
				foreach($_FILES[$key]["name"] as $fKey => $fName)
				{
					$this->UploadFiles[] = array("id" => $fKey,
							"name" => $fName,
							"type" => $_FILES[$key]["type"][$fKey],
							"tmp_name" => $_FILES[$key]["tmp_name"][$fKey],
							"error" => $_FILES[$key]["error"][$fKey],
							"size" => $_FILES[$key]["size"][$fKey]);
				}
			}
			else $this->UploadFiles[] = $_FILES[$key];

			foreach($this->UploadFiles as $fData)
			{
				if($fData["error"] == 4) return null;

				if($fData["error"] != 0)
				{
					$this->ErrorHandler(__FILE__, "There was error while loading file on server", __LINE__);
					return false;
				}

				if(!is_uploaded_file($fData["tmp_name"]))
				{
					$this->ErrorHandler(__FILE__, "Possible file upload attack: '" . $fData["name"] . "'", __LINE__);
					return false;
				}

				if(UPLOAD_FILE_SIZE > 0 && $fData["size"] > UPLOAD_FILE_SIZE)
				{
					$this->ErrorHandler(__FILE__, "File size over than " . UPLOAD_FILE_SIZE, __LINE__);
					return false;
				}
			}

			return $this->UploadFiles;
		}

		return false;
	} // end UploadCheck()


	/**
	 * Save uploaded file from user to folder on the server
	 * @param	string file path source
	 * @param	string file path destination
	 */
	public function saveFile( $source, $destination )
	{
		if(false == @move_uploaded_file($source, $destination))
		{
			$this->ErrorHandler(__FILE__, "Can't save source file '" . $source . "' to '" . $destination . "'", __LINE__);
			return false;
		}
		else return true;
	} // end upload()


	/**
	 * Request to download selected file to client machine
	 * This function has own header to send to
	 * @param	string, absolute file path to send to
	 * @param	string, original file name to send to
	 * @param	string, string to send to as file content
	 * @param	string, content type extention
	 */
	public function Download( $file = '', $name = 'file.csv', $string = '', $ext = '' )
	{
		if((empty($file) || !file_exists($file)) && empty($string))
		{
			$this->ErrorHandler(__FILE__, "Unknown task to do, empty file, empty string...", __LINE__);
			return false;
		}

		if(file_exists($file))
		{
			if( false == ($handle = @fopen($file, "r")) ) {
				$this->ErrorHandler(__FILE__, "Can't open file: " . $file, __LINE__);
				$handle = false;
			}
			else $fileSize = filesize($file);
		}

		if($handle == false) {
			$fileSize = mb_strlen($string, '8bit');
		}

		if((integer)$fileSize == 0) {
			$this->ErrorHandler(__FILE__, "File " . $file . " has 0 size", __LINE__);
			return false;
		}

		header("Pragma: public");
		header("Expires: 0");
		header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
		header("Cache-Control: public");
		header("Content-Description: File Transfer");
		header("Content-Type: " . empty($ext) ? $this->mimeType($this->Extention($name)) : $ext);
		header("Content-Disposition: attachment; filename=" . $name . ";");
		header("Content-Transfer-Encoding: binary");
		header("Content-Length: " . $fileSize);

		if($handle != false) {
			echo fread($handle, $fileSize);
			fclose($handle);
		}
		else {
			echo $string;
		}

		return true;
	} // end Download()


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
			case "csv": return "text/csv";
			case "eml": return "message/rfc822";

			default: return "application/octet-stream";
		}
	} // end mimeType()


	/**
	 * Checks and returns compatible encoding name
	 * @param	string, encoding name
	 * @param	boolean, if this check is for HTTP header
	 */
	public function encodingName( $encode = 'CP1251', $httpheader = false )
	{
                // If passed string is the list
                if( false !== strpos($encode, ',') ) {
                        $_encodes = explode(',', $encode);
                        foreach($_encodes as $key => $item) {
                                $item = trim($item);
                                $_encodes[$key] = $this->encodingName($item, $httpheader);
                        }
                        return implode(', ', $_encodes);
                }

                // Convert to UPPER case
                $_encode = strtoupper($encode);

                if(false !== strpos($_encode, 'UTF')) {
                        if(false === strpos($_encode, '-')) {
                                $_encode = str_replace('UTF','UTF-',$_encode);
                        }
                }
                elseif(false !== strpos($_encode, 'CP')) {
                        if(false !== strpos($_encode, '-')) {
                                $_encode = str_replace('CP-','CP',$_encode);
                        }
                }
                elseif(false !== strpos($_encode, 'WINDOWS')) {
                        if(false === strpos($_encode, '-')) {
                                $_encode = str_replace('WINDOWS','Windows-',$_encode);
                        }
                        else {
                                $_encode = str_replace('WINDOWS','Windows',$_encode);
                        }
                }
		elseif(false !== strpos($_encode, 'KOI8')) {
			if(false === strpos($_encode, '-')) {
				$_encode = str_replace('KOI8','KOI8-', $_encode);
			}
		}
		else {
			$_encode = $encode;
		}

		// Check if this encoding is supported in system
		if(!isset($this->encodings)) {
			$this->encodings = (object)array(
				"system" => array(),
				"checked" => array(),
				"logged" => array()
			);
			$this->encodings->system = mb_list_encodings();
		}

		if(!isset($this->encodings->checked[$_encode])) {
			if(empty($this->encodings->system)) {
				$this->ErrorHandler(__FILE__, "The list of supported encodings is empty, cannot validate passed encoding name: " . $_encode, __LINE__);
				$this->encodings->checked[$_encode] = null;
			}
			else {
				$this->encodings->checked[$_encode] = false;
				switch($_encode) {
					case 'CP1251':
						$_alias = 'Windows-1251';
					break;

					case 'CP1252':
						$_alias = 'Windows-1252';
					break;

					default: $_alias = null;
				}

				foreach($this->encodings->system as $name) {
					if(strcasecmp($name, $_encode) == 0 || (!is_null($_alias) && strcasecmp($name, $_alias) == 0)) {
						$this->encodings->checked[$_encode] = true;
					}
				}

				if(!is_null($_alias)) {
					unset($_alias);
				}
			}
		}

		if(!isset($this->encodings->logged[$_encode])) {
			if(is_null($this->encodings->checked[$_encode])) {
				$this->ErrorHandler(__FILE__, "This message is not fatal by warning. It was not possible to determine list of known system encodings that is why this (" . $_encode . ") may not be supported. Be careful to iconv from or to this encoding", __LINE__);
			}
			elseif(!$this->encodings->checked[$_encode]) {
				$this->ErrorHandler(__FILE__, "This message is not fatal by warning. Encoding name (" . $_encode . ") is not supported or PHP knows nothing about it. Be careful to iconv from or to this encoding", __LINE__);
			}
			$this->encodings->logged[$_encode] = true;
		}

		return $_encode;
	} // end encodingName()


	/**
	 * Function to encode recieved array to JSON structure
	 * Remember!! Tou should pass array data encoded UTF-8
	 * Returns String
	 * @param	array data
	 * @param	sobject
	 */
	public function JEncode( &$arr, &$lanbilling )
	{
		if(function_exists("json_encode")) {
			$data = json_encode($arr);
		}

		else {
			if( !version_compare(PHP_VERSION,"5.2","<") )
			{
				$this->ErrorHandler("async_handler.php", "There're avaliable [json_encode / json_decode] functions for your version. [PHP " . PHP_VERSION . "]", __LINE__);
			}

			require_once("JSON.php");
			$json = new Services_JSON();
			$data = $json->encode($arr);
		}

		return $data;
	} // end JEncode()

	/**
	 * Error handler
	 * @param	string, script called error
	 * @param	string, message
	 * @param	line
	 */
	static public function ErrorHandler( $script = __FILE__, $message = '', $line = '' )
	{
		if(!empty($line)) $line = sprintf("; at line %s", $line);
		$message = sprintf("[LBClientSide]: %s: %s%s", $script, $message, $line);
		error_log($message, 0);
	} // end ErrorHandler()


	/**
	 * Debug system function
	 * @param	resource or string of file name
	 * @param	boolen, if need to remove previous dump file
	 */
	function debug( $file = null, $flush = false )
	{
		if(empty($file)) $file = __FILE__;
		$backtrace = array_shift( debug_backtrace() );

		if($this->debugStartTime === NULL)
		{
			$this->ErrorHandler($file, "Debug: Initialized as line " . $backtrace['line']);
			$this->debugStartTime = time() + microtime();
			$this->debugStartLine = $backtrace['line'];
			$dumpFile = $this->dump($backtrace, $flush);
			return;
		}

		$dumpFile = $this->dump($backtrace, $flush);
	} // end debug()


	/**
	 * This function dumps all known variables to file
	 * @param	object, trace
	 * @param	boolen, if need to remove previous dump file
	 */
	private function dump( $backtrace, $flush = false )
	{
		$tmp = $this->systemTemporary();
		if($flush == true) unlink($tmp . "/" . $this->dumpFile);

		ob_start();
		print("/*======================================================================================*/\n");
		print("/**\n * Debug dump called at: " . $backtrace['file'] .
				"\n * Known start line: " . $this->debugStartLine .
				sprintf("\n * Known start time: %.4f", $this->debugStartTime) .
				sprintf("\n * Time since: %.4f", time() + microtime() - $this->debugStartTime) .
				sprintf("\n * Memory: %d Kb", ceil( memory_get_usage()/1024)) .
				"\n * Line: " . $backtrace['line'] .
				"\n * At: " . date('Y-m-d H:i:s') .
				"\n */\n");

		print("\n\n/**\n * Dump SESSION Array Data\n * \n */\n");
		print_r($_SESSION);
		print("\n\n/**\n * Dump POST Array Data\n * \n */\n");
		print_r($_POST);
		print("\n\n/**\n * Dump GET Array Data\n * \n */\n");
		print_r($_GET);
		print("\n\n/**\n * Dump SERVER Array Data\n * \n */\n");
		print_r($_SERVER);

		if(defined("FILE_DEBUG_VARDUMP") && FILE_DEBUG_VARDUMP == true)
		{
			print("\n\n/**\n * Dump Trace Data\n * \n */\n");
			var_dump($backtrace);
		}

		print("\n\n");

		if(!file_put_contents($tmp . "/" . $this->dumpFile, ob_get_contents(), FILE_APPEND)) {
			$this->ErrorHandler("Cannot store data to cache file: " . $tmp . "/" . $this->dumpFile, __LINE__);
		}
		ob_end_clean();
	} // end dump()
}
