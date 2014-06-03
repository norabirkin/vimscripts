<?php
/**
 * Core class form billing system interface
 *
 */


class LANBilling extends SOAP {

    /**
     * Database resource variable, Contains DB resource link
     * @var        object
     */
    public $descriptor = false;

    /**
     * Operating system on this machine
     * @param    string
     */
    public $OS;

    /**
     * If this OS is MS Windows. Detectes on construct
     * @var        boolean
     */
    public $MSWin = false;

    /**
     * If this OS is UNIX like. Detectes on construct
     * @var        boolean
     */
    public $UNIX = false;

    /**
     * Root directory path use to include files
     * @var        string
     */
    public $rootPath = "";

    /**
     * Connected manager IP address
     *
     */
    public $clientIP = false;

    /**
     * Authorization flag
     * @var        boolean
     */
    public $authorized = false;

    /**
     * Authorized manager identification number
     * @var        integer
     */
    public $manager = 0;

    /**
     * MySQL DB varible to create connection
     * Server address
     * @var        string
     */
    public $serveraddress = "127.0.0.1";

    /**
     * MySQL DB varible to create connection
     * Database privileged user
     * @var        string
     */
    public $mysqluser = "billing";

    /**
     * MySQL DB varible to create connection
     * Database privileged user password
     * @var        string
     */
    public $mysqlpassword = "";

    /**
     * MySQL DB varible to create connection
     * Database name
     * @var        string
     */
    public $mysqldatabase = "billing";

    /**
     * check varible
     * check mobile number
     * @var        string
     */
    public $check_mobile = "1";

    /**
     * Array of the system settings from options table
     * @var        array
     */
    public $settings = array();

    /**
     * Currencies rate for the requested date, usually current date
     * Valid key contains boolean value to identify if all rate are set for the selected date
     * @var        array('default' => array(), 'other' => array(), 'valid' => boolean )
     */
    public $Rates = array();

    /**
     * Configuration file path to get SQL connection variables
     * @var        string
     */
    private $ConfigFile = "";

    var $ass_show;
    var $currency_symbol;
    var $bill_multiply;
    var $auth_class = "";
    var $logs_class    = "";
    var $balance_symbol;

    /**
     * Convergent mode flag
     * @var        int
     */
    var $convergent = 0;

    /**
     * Operator mode flag
     * @var        int
     */
    var $useOperators = 0;

    /**
     * Contains invoice default system value
     * @var        string
     */
    var $naklformat;

    /**
     * Contains currency list
     * @var        array
     */
    var $Currency = array();

    /**
     * Balance value
     * Convergent mode @var integer
     * None convergent mode @var array[vg_id] = blance_value
     */
    var $UBalance = 0;

    /**
     * Session name use to indetify
     * @var     string
     */
    private $sesName = 'bc37b9703283';

    /**
     * Authenticated session TTL
     * @var        integer
     */
    private $authTTL = 86400;

    /**
     * Contains license information
     * @var        array
     */
    private $license = array();

    /**
     * Debug start time
     * @var        integer
     */
    private $debugStartTime = null;

    /**
     * Debug start line
     * @var        integer
     */
    private $debugStartLine = 0;

    /**
     * Dump file name
     * @var        string
     */
    private $dumpFile = "lb_debug_dump";

    /**
     * Alowed upload file size
     * @var        integer
     */
    private $UploadFileSize = 5242880;

    /**
     * Path to interface version file. Contains build verion and build data
     * @var        string
     */
    private $versionfile = '.version';

    /**
     * Variable to store lock date for the period
     * @var        string
     */
    private $lockperiod = null;


    /**
     * Class constructor function, is calling on class object creation
     * @param    array, known options
     *         [rootPath] => root path for interface for right including
     */
    public function __construct( $options = array() )
    {
        // Check memory limit and up it if is too low
        if((integer)ini_get('memory_limit') < 120) {
            ini_set('memory_limit', 120 . "M");
        }

        // Initialize php files root directory path
        if(isset($options['rootPath'])) {
            $this->rootPath = trim($options['rootPath']);
        }

        // If there was turned on debug flag
        if($this->isConstant("FILE_DEBUG") == true) {
            $this->debug(__FUNCTION__);
        }

        // Detect Operating system
        $this->getOS();
        // Initialize client ip
        $this->getClientIP();
        // Create session or start existing
        $this->createSession();
        // SOAP client load
        parent::__construct();

        // Check authorization session
        if(!$this->isAuthorized()) {
            if(!$this->Authorize()) {
                return false;
            }
        }
        else {
            $this->setCookie('sessnum', $_SESSION['auth']['sessnum']);
        }

        // Prepare MySQL connection
        $this->initMySQL();
        // Retrieve billing global settings
        $this->initSystemSettings();
        // Retrieve currencies rates
        $this->initCurrencyRates();
        // Retrieve operators list
        $this->getOperators();
    } // end __construct()


    /**
     * This function calls before class finished its work
     *
     */
    public function __destruct()
    {
        if($this->isConstant("FILE_DEBUG") == true) {
            $this->debug(__FUNCTION__);
        }

        if($this->descriptor) {
            @mysql_close($this->descriptor);
        }
		
		session_write_close();
    } // end __destruct()


    /**
     * Try to detect Operating System using SERVER_SOFTWARE variable
     *
     */
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
     * Start new session with specific name value or use existing session
     *
     */
    private function createSession()
    {
        // Check client browser, if MSIE than set cache to public
        if(strpos($_SERVER["HTTP_USER_AGENT"], "MSIE")) {
            session_cache_limiter("public");
        }

        // Let us check and correct garbage collection settings
        // to prevent removing session file with long time out
        if(ini_get('session.gc_probability') > 1) {
            ini_set('session.gc_probability', 1);
        }

        if(ini_get('session.gc_divisor') < 1000) {
            ini_set('session.gc_divisor', 1000);
        }

        if(ini_get('session.gc_maxlifetime') < 86400) {
            ini_set('session.gc_maxlifetime', 86400);
        }

        // Let us check our specific directory to store session file before change garbage time collection
        if(!ini_get('session.save_path')) {
            $this->isConstant("FILE_DEBUG") == true && $this->ErrorHandler(__FILE__, "There is empty session.save_path directive value. Cannot create subdirectory for session files");
        }
        else {
            $path_sep = $this->MSWin ? '\\' : '/';
            if(!is_dir(ini_get('session.save_path') . $path_sep . 'lbadmin')) {
                if(mkdir(ini_get('session.save_path') . $path_sep . 'lbadmin')) {
                    ini_set('session.save_path', ini_get('session.save_path') . $path_sep . 'lbadmin');
                }
            }
            else {
                ini_set('session.save_path', ini_get('session.save_path') . $path_sep . 'lbadmin');
            }
        }

        //@session_set_cookie_params($this->authTTL);
        // При значении отличном от 0, в InternetExplorer происходит обрыв сессии сразу после авторизации.
        @session_set_cookie_params(0);
        @session_name($this->sesName) || $this->ErrorHandler(__FILE__, "Can't initialize session by name " . $this->sesName);
        @session_start() || $this->ErrorHandler(__FILE__, "Can't start manager session connected from: " . $this->clientIP);

        if(!isset($_SESSION['auth']['from'])) {
            $_SESSION['auth']['from'] = ip2long($this->clientIP);
            $_SESSION['auth']['last'] = time();
        }

        if($_SESSION['auth']['from'] != ip2long($this->clientIP)) {
            $this->ErrorHandler(__FILE__, "Current connected manager (" . $this->clientIP . ") has different IP address as session remember (" . long2ip($_SESSION['auth']['from']) . ")", __LINE__);
            $this->destroySession();
        }

        // Set downloads control sums array
        $_SESSION['auth']['download'] = array();
    } // end createSession()


    /**
     * Destroy session data
     *
     */
    private function destroySession()
    {
        if(isset($_SESSION['auth'])) {
            unset($_SESSION['auth']);
        }

        if(isset($_COOKIE[session_name()])) {
            setcookie(session_name(), '', time()-42000, '/');
        }

        @session_destroy();
    } // end destroySession()


    /**
     * Check if there is authorized session started
     * Set important flags
     */
    private function isAuthorized()
    {
        if(!isset($_SESSION['auth']['authorized']) || !$_SESSION['auth']['authorized']) {
            $this->authorized = false;
            $this->clearPriviliges();
            return false;
        }

        if((integer)$_SESSION['auth']['sessionttl'] > 0 && ((time() - $_SESSION['auth']['last']) > $_SESSION['auth']['sessionttl'])) {
            $this->authorized = false;
            $this->Logout();
            return false;
        }

        $this->authorized = true;
        $_SESSION['auth']['last'] = time();
        $this->manager = $_SESSION['auth']['authperson'];

        return true;
    } // end isAuthorized()


    /**
     * Remove privileged data from session array
     *
     */
    private function clearPriviliges()
    {
        unset($_SESSION['auth']['access']);
        unset($_SESSION['auth']['menu']);
    } // end clearPriviliges()


    /**
     * Try to authorize connected client by passed login and password
     *
     */
    private function Authorize()
    {
        if(!isset($_POST['login']) || !isset($_POST['password']) || empty($_POST['login'])) {
            $this->authorized = false;
            return false;
        }

        if( false != ($result = $this->get("Login", array('login' => $_POST['login'], 'pass' => $_POST['password']), true)) ) {
        	
			if($result->manager->payments==1){
				$this->authorized = false;
            	return false;
			}
			
            $_SESSION['auth']['login'] = base64_encode($_POST['login']);
            $_SESSION['auth']['authorized'] = true;
            $_SESSION['auth']['authperson'] = $result->manager->personid;
            $_SESSION['auth']['authname'] = $result->manager->fio;
            $_SESSION['auth']['sessnum'] = $this->getCookie('sessnum');
            $this->setCookie( 'sessnum', $_SESSION['auth']['sessnum'] );

            // Person cash register properties
            $_SESSION['auth']['cashregister'] = array(
                'id' => (integer)$result->manager->externalid,
                'folder' => $result->manager->cashregisterfolder
            );

            // Get session ttl from options
            if( false !== $this->Option('session_lifetime') ) {
                $_SESSION['auth']['sessionttl'] = (integer)$this->Option('session_lifetime');
            }
            else {
                $_SESSION['auth']['sessionttl'] = $this->authTTL;
            }

            // Set time stamp
            $_SESSION['auth']['last'] = time();

            $this->authorized = true;
            $this->manager = $result->manager->personid;

            if($this->getLicenseFlag('useinventory') == 1) {
                $result->manager->inventory = 2;
            }
            else {
                $result->manager->inventory = 0;
            }

            $this->setMenu($result->manager);

            // Put interface version to session
            if(file_exists($this->versionfile)) {
                // Get lines
                $_data = file($this->versionfile);
                // Split first line
                $_data = explode('-', $_data[0]);
                // Store to session
                $_SESSION['auth']['version'] = array(
                    "ifcbuild" => $_data[1],
                    "ifcdate" => $_data[2]
                );
                // Clear temp. variable
                unset($_data);
            }

            // Retrieving version data from database
            if( false != ($_data = $this->Option('version')) ) {
                // Split line
                $_data = explode('-', $_data);
                // Store to session
                $_SESSION['auth']['version']['dbbuild'] = $_data[1];
                $_SESSION['auth']['version']['dbdate'] = $_data[2];
                $_SESSION['auth']['version']['match'] = true;
                // Clear temp. variable
                unset($_data);
                if(isset($_SESSION['auth']['version']['dbbuild']) && isset($_SESSION['auth']['version']['ifcbuild'])) {
                    if($_SESSION['auth']['version']['dbbuild'] != $_SESSION['auth']['version']['ifcbuild'] ||
                        intval($_SESSION['auth']['version']['dbdate']) != intval($_SESSION['auth']['version']['ifcdate']))
                    {
                        $_SESSION['auth']['version']['match'] = false;
                        $this->ErrorHandler(__FILE__, "Found mismatch in interface version and database version record; Interface build date and number: " .
                            $this->formatDate($_SESSION['auth']['version']['ifcdate'], 'd.m.Y') . ', ' . $_SESSION['auth']['version']['ifcbuild'] .
                            '; Database version record: ' . $this->formatDate($_SESSION['auth']['version']['dbdate'], 'd.m.Y') . ', ' . $_SESSION['auth']['version']['dbbuild'], __LINE__);
                    }
                }
            }
        }
        else {
            $this->Logout();

            if(DETAIL_REJECTED == true) {
                $this->ErrorHandler(__FILE__, "Rejected authorization for manager from: " . $this->clientIP . ", login=" . $_POST['login'] . ", password=" . $_POST['password']);
            }

            return false;
        }

        return true;
    } // end Authorize()


    /**
     * Get real cleint IP
     *
     */
    private function getClientIP()
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
     * Thisfunction tries to allocate billing main configuration file
     * according to the server software
     * @return
     */
    private function getBillingConfig()
    {
        // Check if server software is MS Windows
        if($this->MSWin) {
            try {
                $shell = new COM("WScript.Shell") or
                    $this->ErrorHandler(__FILE__, "To find configuration file from registry record on MS Windows operation system, PHP requires Windows Scripting Host plugin. You must Correct this mismatch to get the right data by interface");

                if($shell) {
                    $services = $shell->RegRead("HKEY_LOCAL_MACHINE\\SOFTWARE\\LANBilling\\LBcore\\Services");
                    $this->ConfigFile = $shell->RegRead("HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Services\\".$services[0]."\\Parameters\\CfgFile");
                    $this->billingCorePath = $shell->RegRead("HKEY_LOCAL_MACHINE\\SOFTWARE\\LANBilling\\LBcore\\MyPath");
                }
            } catch(Exception $e) {
                $this->ErrorHandler(__FILE__, sprintf("There was an error while getting configuration file: %s", $e->getMessage()));
            }

            if(empty($this->ConfigFile)) {
                $this->ConfigFile = "C:/Program Files/LANBilling/LBcore/billing.conf";
            }

            if(empty($this->billingCorePath) || !isset($this->billingCorePath)) {
                $this->billingCorePath = "C:\\Program Files\\LANBilling\\LBcore";
            }
        }
        // Otherwise server software is unix like system
        else {
            $this->ConfigFile = "/etc/billing.conf";
            if(defined('BILLING_CONF')) {
                $this->ConfigFile = BILLING_CONF;
            }
        }

        return $this->ConfigFile;
    } // end getBillingConfig()


    /**
     * Prepare MySQL connection for old functions
     *
     */
    private function initMySQL()
    {
        if(!$this->descriptor)
        {
            $this->ConfigFile = $this->getBillingConfig();

            if(!file_exists($this->ConfigFile)) {
                $this->ErrorHandler(__FILE__, sprintf("Could not find file `%s`, we recommend You to correct this mismatch otherwise there will be used default authentication data to connect to SQL server", $this->ConfigFile));
            }
            else {
                $fh = fopen($this->ConfigFile, "r");

                while (!feof($fh)) {
                    $line = fgets($fh, 1024);

                    if(strpos($line, '#') === 0) {
                        continue;
                    }

                    if(strpos($line, '=') !== false) {
                        $_line = explode('=', $line);
                        switch(trim($_line[0])) {
                        	case 'database' : $this->database   =  trim($_line[1]); break; 
                            case 'rdbhost'      : $this->serveraddress  =  trim($_line[1]); break;
                            case 'rdbuser'      : $this->mysqluser      =  trim($_line[1]); break;
                            case 'rdbpass'      : $this->mysqlpassword  =  trim($_line[1]); break;
                            case 'rdbname'      : $this->mysqldatabase  =  trim($_line[1]); break;
                            case 'check_mobile' : $this->check_mobile   =  trim($_line[1]); break; 
                        }
                    }
                }
                fclose($fh);
            }


			if($this->database!='') {
				$tmp = str_replace("mysql://", "", $this->database);
				$tmp = str_replace("/", ":", $tmp);
				$tmp = str_replace("@", ":", $tmp);
				$tmp = explode(':', $tmp);
				$this->serveraddress  =  trim($tmp[2]);
				$this->mysqluser      =  trim($tmp[0]);
				$this->mysqlpassword  =  trim($tmp[1]);
				$this->mysqldatabase  =  trim($tmp[3]);
			}

            if( false == $this->descriptor = mysql_connect($this->serveraddress, $this->mysqluser, $this->mysqlpassword) ) {
                $this->ErrorHandler(__FILE__, mysql_error(), __LINE__);
                return false;
            }

            if(!empty($this->mysqldatabase)) {
                mysql_select_db($this->mysqldatabase, $this->descriptor);
            }
        }

        if( false == mysql_query("SET NAMES UTF8", $this->descriptor) ) {
            $this->ErrorHandler(__FILE__, "Can't set charset: " . mysql_error($this->descriptor), __LINE__);
        }
    } // end initMySQL()


    /**
     *
     * @param    object, login function returned object - manager structure
     */
    private function setMenu( &$man )
    {

        // Default menu structure
        $struct = array(
            // Objects
            array('id' => 'agents',    'data' => 'agents',   'level' => '1|2', 'devision' => 10,      'text' => '<%@ Agents %>'),
            array('id' => 'users',     'data' => 'users',    'level' => '1|2', 'devision' => 22,      'text' => '<%@ Users %>'),
            array('id' => 'agrms',     'data' => 'users',    'level' => '1|2', 'devision' => 24,      'text' => '<%@ Agreements %>'),
            array('id' => 'accounts',  'data' => 'accounts', 'level' => '1|2', 'devision' => 7,       'text' => '<%@ Accounts %>'),
            array('id' => 'usersgroups', 'data' => 'usergroups', 'level' => '1|2', 'devision' => 23,  'text' => '<%@ Users groups %>'),
			array('id' => 'agrmgroups', 'data' => 'agrmgroups', 'level' => '1|2', 'devision' => 28,  'text' => '<%@ Agreements groups %>'),
            array('id' => 'unions',    'data' => 'unions',     'level' => '1|2', 'devision' => 16,    'text' => '<%@ Unions %>'),
            array('id' => 'cards',        'data' => 'cards',      'level' => '1|2', 'devision' => 103,   'text' => '<%@ Pre-paid cards %>'),
            array('id' => 'managers',  'data' => 'managers',   'level' => '1|2', 'devision' => 13,    'text' => '<%@ Managers %>'),
            array('id' => 'postmans',  'data' => 'postmans',   'level' => '1|2', 'devision' => 15,    'text' => '<%@ Postmans %>'),
            array('id' => 'bso',        'data' => 'bso',        'level' => '1|2', 'devision' => 18,    'text' => '<%@ Strict reporting forms %>'),
            array('id' => 'registry',  'data' => 'registry',   'level' => '1|2', 'devision' => 21,    'text' => '<%@ Registry %>'),
            array('id' => 'inventory', 'data' => 'inventory',  'level' => '1|2', 'devision' => false, 'text' => '<%@ Inventory'),
            array('id' => 'invmdfdev', 'data' => 'invdevices', 'level' => '1|2', 'devision' => 207,   'text' => '<%@ Edit %> <%@ devices %>'),
            array('id' => 'invcntplc', 'data' => 'invdevices', 'level' => '1|2', 'devision' => 208,   'text' => '<%@ Control Policies %>'),
            array('id' => 'invdevlst', 'data' => 'invdevices', 'level' => '1|2', 'devision' => 209,   'text' => '<%@ Devices List %>'),
            array('id' => 'vlans',     'data' => 'invdevices', 'level' => '1|2', 'devision' => 210,   'text' => '<%@ Vlans %>'),
            array('id' => 'clientdevices',   'data' => 'users',   'level' => '1|2', 'devision' => 27, 'text' => '<%@ Customer equipment %>'),
            array('id' => 'currency',  'data' => 'currency',   'level' => '1|2', 'devision' => 14,    'text' => '<%@ Currency %> <%@ and %> <%@ rate %>'),

            // Properties
            array('id' => 'tarifs',     'data' => 'tarifs',     'level' => '1|2', 'devision' => 4,   'text' => '<%@ Tarifs %>'),
            array('id' => 'serv_codes',     'data' => 'services',     'level' => '1|2', 'devision' => 123,   'text' => '<%@ Classifier services %>'),
			array('id' => 'installments',     'data' => 'tarifs',     'level' => '1|2', 'devision' => 29,   'text' => '<%@ Installment setup %>'),
            array('id' => 'catalogues', 'data' => 'catalog',    'level' => '1|2', 'devision' => 17,  'text' => '<%@ Catalogues %>'),
            array('id' => 'tarcat',     'data' => 'catalog',    'level' => '1|2', 'devision' => 25,  'text' => '<%@ Master categories %>'),
            array('id' => 'servpacks', 'data' => 'packages', 'level' => '1|2', 'devision' => 5, 'text' => '<%@ Services packages %>'),
            array('id' => 'cashonhand', 'data' => 'cashonhand', 'level' => '1|2', 'devision' => 199, 'text' => '<%@ Payments %>'),
            array('id' => 'cardsets',   'data' => 'cardsets',   'level' => '1|2', 'devision' => 545, 'text' => '<%@ Cards groups %>'),
            array('id' => 'radattr',    'data' => 'radattr',    'level' => '1|2', 'devision' => 399, 'text' => 'RADIUS-<%@ attributes %>'),
            array('id' => 'calendar',   'data' => 'calendar',   'level' => '1|2', 'devision' => 102, 'text' => '<%@ Calendar  %>'),
            array('id' => 'services',   'data' => 'services',   'level' => '1|2', 'devision' => 106, 'text' => '<%@ Services %>'),
            array('id' => 'actions',   'data' => 'services',   'level' => '1|2', 'devision' => 122, 'text' => '<%@ Promotions %>'),
            array('id' => 'matrixdisc',   'data' => 'services',   'level' => '1|2', 'devision' => 124, 'text' => '<%@ Matrix discounts %>'),

            // Actions
            array('id' => 'createcards',   'data' => 'cards', 'level' => '2', 'devision' => 109, 'text' => '<%@ Generate %> <%@ pre-paid cards %>'),
            array('id' => 'createbills',   'data' => 'orders', 'level' => '2', 'devision' => 108, 'text' => '<%@ Generate %> <%@ printing forms %>'),
            array('id' => 'createreports', 'data' => 'reports', 'level' => '1|2', 'devision' => 107, 'text' => '<%@ Generate %> <%@ users reports %>'),
            array('id' => 'createsales', 'data' => 'reports', 'level' => '1|2', 'devision' => 26, 'text' => '<%@ Generate %> <%@ sales %>'),
			array('id' => 'genconnectionapps', 'data' => 'applications', 'level' => '1|2', 'devision' => 112, 'text' => '<%@ Generate %> <%@ applications for connection %>'),
            array('id' => 're-count',      'data' => 'recount', 'level' => '2', 'devision' => 67, 'text' => '<%@ Re-count %>'),

            // Reports
            array('id' => 'statistics',     'data' => array('ipstat', 'timestat', 'usboxstat'), 'level' => '1|2', 'devision' => 104, 'text' => '<%@ Statistics %>'),
            array('id' => 'accountancy',    'data' => 'orders',   'level' => '1|2', 'devision' => 105, 'text' => '<%@ Printing forms %>'),
            array('id' => 'accountancydocs',    'data' => 'orders',   'level' => '1|2', 'devision' => 121, 'text' => '<%@ Documents of charges %>'),
            array('id' => 'grouppedorders', 'data' => 'orders',   'level' => '1|2', 'devision' => 120, 'text' => '<%@ Groupped invoice %>'),
            array('id' => 'eventslog',         'data' => 'logs',       'level' => '1|2', 'devision' => 19, 'text' => '<%@ Events log %>'),
            array('id' => 'authlog',         'data' => 'authlogs', 'level' => '1|2', 'devision' => 20, 'access' => 1, 'text' => '<%@ Authorization log %>'),

            // Options
            array('id' => 'common',        'data' => 'optionscommon',    'level' => '1|2', 'devision' => 331, 'text' => '<%@ Common %>'),
            array('id' => 'operdetails',   'data' => 'optionsrequisite', 'level' => '1|2', 'devision' => 332, 'text' => '<%@ Operator details %>'),
            array('id' => 'documentset',   'data' => 'optionsdocuments', 'level' => '1|2', 'devision' => 337, 'text' => '<%@ Documents settings %>'),
            array('id' => 'trustedhosts',  'data' => 'optionshosts',     'level' => '1|2', 'devision' => 501, 'text' => '<%@ Trusted hosts %>'),
            array('id' => 'documenttempl', 'data' => 'options',          'level' => '1|2', 'devision' => 111, 'text' => '<%@ Documents templates %>'),
            array('id' => 'servicefunc',   'data' => 'optionsfunctions', 'level' => '1|2', 'devision' => 339, 'text' => '<%@ Service functions %>'),

            // HelpDesk
            array('id' => 'applications',  'data' => 'applications', 'level' => '1|2', 'devision' => 110,  'text' => '<%@ Applications %>'),
            array('id' => 'hdrequests',    'data' => 'helpdesk',     'level' => '1|2', 'devision' => 1001, 'text' => '<%@ Requests %>'),
            array('id' => 'hdknowledges',  'data' => 'helpdesk',     'level' => '1|2', 'devision' => 1002, 'text' => '<%@ Knowledges %>'),
            array('id' => 'hdsettings',    'data' => 'hdsettings',   'level' => '1|2', 'devision' => 111,  'text' => '<%@ Settings %>'),
            array('id' => 'broadcast',     'data' => 'broadcast',    'level' => '1|2', 'devision' => 1150, 'text' => '<%@ Messages %>')
        );

        $_man = (array)$man;
        $_menu = array();
        for($i = 0, $off = sizeof($struct); $i < $off; $i++) {
            if(is_array($struct[$i]['data']))
            {
                $_data = 0;

                if( sizeof($_tmp = array_intersect_key($_man, array_flip($struct[$i]['data']))) > 0 )
                {
                    foreach($_tmp as $item) {
                        if($item > $_data) {
                            $_data = $item;
                        }
                    }
                }
            }

            $_tmp = array('id' => 'lbmenu-' . $struct[$i]['id'],
                    'access' => 0,
                    'devision' => $struct[$i]['devision'],
                    'text' => $struct[$i]['text']);

            if(isset($_data)) {
                if(strpos((string)$struct[$i]['level'], (string)$_data) !== false) {
                    $_tmp['access'] = 1;
                }
            }
            else
            {
                if(isset($_man[$struct[$i]['data']]) &&
                    strpos((string)$struct[$i]['level'], (string)$_man[$struct[$i]['data']]) !== false)
                {
                    if($struct[$i]['data'] == 'inventory' && $struct[$i]['devision'] == false) {
                        $_tmp['access'] = ($_man['users'] > 0 && !$_man['inventory']) ? 1 : $_man[$struct[$i]['data']];
                    }
                    else {
                        $_tmp['access'] = $_man[$struct[$i]['data']];
                    }
                }
            }

            array_push($_menu, $_tmp);
            unset($_data);
        }

        // Fill access array, excluding selected items
        foreach($man as $key => $item) {
            if (
               $key == "login"      || $key == "pass"     || $key == "fio"   || $key == "login"  ||
               $key == "email"      || $key == "descr"    || $key == "login" || $key == "office" ||
               $key == "changepass" || $key == "personid" || $key == "isadmin"
            )
            {
                continue;
            }

            $_SESSION['auth']['access'][$key] = $item;
        }

        $_SESSION['auth']['menu'] = $_menu;
        $_SESSION['auth']['localize_menu'] = true;

        // Clear memory
        unset($_man, $struct, $_menu, $_tmp);
    } // end


    /**
     * Returns priviosly compiled menu with localize changes
     * @param    object, local translation class
     */
    public function getMenu( &$localize, $_print = false )
    {

        if(isset($_SESSION['auth']['localize_menu']))
        {
            for($i = 0, $off = sizeof($_SESSION['auth']['menu']); $i < $off; $i++) {
                $_SESSION['auth']['menu'][$i]['text'] = $localize->compile($_SESSION['auth']['menu'][$i]['text'], false);
            }

            unset($_SESSION['auth']['localize_menu']);
        }

        if($_print) {
            $res['items']=$_SESSION['auth']['menu'];
            $res['original']=true;
            $res['access']=$_SESSION['auth']['access'];
            echo JEncode($res, $this);
            //echo '("items": ' . JEncode($_SESSION['auth']['menu'], $this) . ', "access": ' . JEncode($_SESSION['auth']['access'], $this) . ', "original": true)';
        }
        else {
            return $_SESSION['auth']['menu'];
        }
    } // end getMenu()


    /**
     * Check if there is access to the specified devision name
     * @param    string, devision name
     */
    public function getAccess( $name )
    {
        if(!$this->isAuthorized()) {
            $this->Logout();
        }

        if($this->manager == 0) {
            return 2;
        }
        else {
            if(empty($name)) {
                return 0;
            }

            return (integer)($_SESSION['auth']['access'][$name]);
        }
    } // end getAccess()


    /**
     * Check if there is defined constant. If none - returns false, else constant value
     * @param    string, constant name
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
     * Initialized passed options to the class constructor
     * @param    array options
     */
    function initOptions( $options = array() )
    {
        if(!is_array($options))
            return;

        foreach($options as $key => $value)
            switch($key)
            {
                case "rootPath": $this->rootPath = $this->stripMagicQuotes($value); break;
                case "serveraddress": $this->serveraddress = $value; break;
                case "mysqluser": $this->mysqluser = $value; break;
                case "mysqlpassword": $this->mysqlpassword = $value; break;
                case "mysqldatabase": $this->mysqldatabase = $value; break;
            }
    } // end initOptions()


    /**
     * Get user classes or single if specified class id
     * @param    integer, class id
     */
    public function getUserCategory( $id = null )
    {
        $class = array(
            0 => 'Subscriber',
            1 => 'Operator',
            2 => 'Dealer',
            3 => 'LegalOwner',
            4 => 'Advertiser',
            5 => 'Partner',
            6 => 'Agent'
        );

        if(!is_null($id)) {
            if(isset($class[$id])) {
                return array($id => $class[$id]);
            }
            else return array(0 => $class[0]);
        }
        else {
            return $class;
        }
    } // end getUserCategory()


    /**
     * Clone object with new options
     * @param    integer, query timeout
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
     * Retrive license information for this billing system
     * @param    string, flag name to get from or all of them
     */
    public function getLicenseFlag( $flag = 'all' )
    {
        if(empty($this->license)) {
            if( false != $result = $this->get("getLicense") )
            {
                $this->license = (array)$result;
            }
        }

        if(empty($flag) || $flag == 'all') {
            return $this->license;
        }
        else {
            if(isset($this->license[$flag])) {
                return $this->license[$flag];
            }
            else return false;
        }
    } // end getLicenseFlag()


    /**
     * Retrieve billing global settings from DB
     * All Values will be store to the assoc array
     */
    public function initSystemSettings()
    {
        if( false != ($result = $this->get("getOptions")) )
        {
            foreach($result as $item)
            {
                if($item->name == "license") {
                    continue;
                }

                // Store System tions list to class global variable
                $this->settings[$item->name] = $item;

                // Declare deprecated variable
                switch($item->name)
                {
//                    case "default_physical": $this->physDefDocument = $item->value; break;
//                    case "default_legal": $this->legalDefDocument = $item->value; break;
                    case "use_operators": $this->useOperators = $item->value; break;
//                    case "change_usertype": $this->allowChangeUserType = $item->value; break;
                    case "generate_pass": $this->autoGeneratePass = $item->value; break;
                    case "pass_length": $this->passwordLength = $item->value; break;
                    case "payment_format": $this->naklformat = $item->value; break;
                }
            }
        }

        // Declare deprecated constants
        define ("IS_CONVERGENT", $this->convergent);
        define ("IS_NAKLFORMAT", $this->naklformat);
    } // end initSystemSettings()


    /**
     * Get option value by name from the global array stored in the this->settings
     * if option not found than returns false
     * Need check result using if(false !== ($value = $lanbilling->Option))
     * @param    string, option name
     * @param    boolean, to search option name like pattern
     */
    public function Option( $name = "", $regexp = false )
    {
        if(empty($name)) {
            $this->ErrorHandler(__FILE__, "I've got an empty option name, there is no siutable value", __LINE__);
            return false;
        }

        if(empty($this->settings)) {
            $this->initSystemSettings();
        }

        if($regexp){
            $result = array();
            foreach($this->settings as $key => $item) {
                if(preg_match('/' . $name . '/', $key)) {
                    $result[$key] = $item;
                }
            }
            return $result;
        }
        else {
            foreach($this->settings as $key => $item) {
                if($key == $name) {
                    return $item->value;
                }
            }
        }

        return false;
    } // end Option()


    /**
     * Get currency list with rate values for the selected date
     * @param    string, date YYYY-mm-dd
     */
    public function initCurrencyRates( $_date = "" )
    {
        if(empty($_date)) {
            $_date = date('Y-m-d');
        }

        // Default start value
        $this->Rates['valid'] = true;

        if( false !== ($result = $this->get("getRates", array('flt' => array('dtfrom' => $_date)))))
        {
            if(!is_array($result)) {
                $result = array($result);
            }

            foreach($result as $obj)
            {
                if($obj->def == 1)
                    $this->Rates['default'] = array("curid" => $obj->curid, "name" => $obj->name, "date" => $obj->date,
                                "symbol" => $obj->symbol, "def" => $obj->def,
                                "rate" => $obj->rate);

                $this->Rates['other'][$obj->curid] = array("curid" => $obj->curid, "name" => $obj->name,
                            "date" => $obj->date,
                            "symbol" => $obj->symbol, "def" => $obj->def,
                            "rate" => $obj->rate);

                if($obj->curid > 0 && empty($obj->rate)) {
                    $this->Rates['valid'] = false;
                }
            }
        }

        if(!isset($this->Rates['default']))
        {
            foreach($this->Rates['other'] as $arr) {
                $this->Rates['default'] = $arr;
                break;
            }
        }

        // Clear from memory
        unset($_date, $arr, $obj);

        return $this->Rates;
    } // end initCurrencyRates()


    /**
     * Get operators list or single operator by id
     * @param    integer, operator id
     * @param    boolean, return only default operator
     */
    public function getOperators( $id = null, $default = false )
    {
        if(!isset($this->Operators))
        {
            if( false !== ($result = $this->get('getAccounts', array('flt' => array('category' => 1, 'nodata' => 1)))) )
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
        else return $this->Operators;
    } // end getOperators()


    /**
     * Reset operator's list and load new
     *
     */
    public function flushOperators()
    {
        unset($this->Operators);
        $this->getOperators();
    } // end flushOperators()


    /**
     * Logout action
     *
     */
    public function Logout()
    {
        // If there was valid session and expired on time out, let's send session number to server
        // for correct log out action
        if(!empty($_SESSION['auth']['sessnum'])) {
            $this->setCookie('sessnum', $_SESSION['auth']['sessnum']);
        }

        // Send to server logout action
        $this->get("Logout");

        $this->destroySession();
        $this->authorized = false;
    } // end Logout()


    /**
     * !!ATANTION Don't send any data before you'll call this function
     * This function sends special headers to turn on private cache on client side
     * Needs started session before
     * @param    integer, UNIX time stamp of data modification to compare with header 'If-Modified-Since'
     *             This header contains the last server response about data relevance
     *             If value is null then there will be standard logic to compare if header 'if-Modified-Since'
     *             record value is over than 86400 seconds
     */
    public function clientPrivateCache( $timeModified = null )
    {
        // Flag to send data to client or send header 'Not Modified'
        // Default send header
        $_sendData = false;

        if(!isset($_SERVER['HTTP_IF_MODIFIED_SINCE'])) {
            $_sendData = true;
        }
        else {
            if( false !== ($_last = strtotime($_SERVER['HTTP_IF_MODIFIED_SINCE'])) ) {
                if(!is_null($timeModified)) {
                    if($timeModified != $_last) {
                        $_sendData = true;
                    }
                }
                else {
                    if($_SESSION['private_cache'][$cachekey] != $_last) {
                        $_sendData = true;
                    }
                }
            }
            else {
                $_sendData = true;
            }
        }

        header('Cache-Control: private, must-revalidate');
        if(!$_sendData) {
            header('Last-Modified: ' . $_SERVER['HTTP_IF_MODIFIED_SINCE']);
            header('Expires: ' . gmdate('D, d M Y H:i:s', ((integer)strtotime($_SERVER['HTTP_IF_MODIFIED_SINCE']) + 86400)) . ' GMT');
            header('HTTP/1.1 304 Not Modified');
            return true;
        }
        else {
            if(is_null($timeModified)) {
                $timeModified = time();
            }

            header('Last-Modified: ' . gmdate('D, d M Y H:i:s', $timeModified) . ' GMT');
            header('Expires: ' . gmdate('D, d M Y H:i:s', ($timeModified + 86400)) . ' GMT');
            return false;
        }
    } // end clientPrivateCache()


    /**
     * Get lock of the period. This parameter need to stop any action if they take affect
     * any system values before sign date
     * @param    string YYYY-mm-dd, date to check if passed value less than lock date
     *             Returns true if takes affect or false if not
     *             If there empty parameters list than it will return lock period date or false
     *             if lock is not set
     */
    public function getPeriodLock( $pdate = "0000-00-00" )
    {
        if(is_null($this->lockperiod)) {

            $this->lockperiod = (object)array(
                'lockisset' => true,
                'lockdate' => null,
                'items' => array()
            );

            if( false === ($result = $this->Option('lock_period')) ){
                $this->lockperiod->lockisset = false;
                return false;
            }

            $plock = explode('-', substr($result, 0, 10));
            if(!checkdate((integer)$plock[1], (integer)$plock[2], (integer)$plock[0])) {
                $this->lockperiod->lockisset = false;
                return false;
            }

            $this->lockperiod->lockdate = $result;
            $this->lockperiod->items = $plock;
            unset($plock);
        }

        $pdate = explode('-', substr($pdate, 0, 10));
        if(checkdate((integer)$pdate[1], (integer)$pdate[2], (integer)$pdate[0])) {
            if(sprintf("%04d%02d%02d", $this->lockperiod->items[0], $this->lockperiod->items[1], $this->lockperiod->items[2]) >
                sprintf("%04d%02d%02d", $pdate[0], $pdate[1], $pdate[2]))
            {
                return true;
            }
            else {
                return false;
            }
        }

        if(!$this->lockperiod->lockisset) {
            return false;
        }
        else  {
            return $this->lockperiod->lockdate;
        }
    } // end getPeriodLock()


    /**
     * Initialize currency list avaliable for this system
     * Returns array [cur_id] => array( [symbol] => string, [name] => string, [default] => int )
     */
    function initCurrency()
    {
        $this->Currency = array();

        if( false != ($currency = $this->get("getCurrencies")) )
        {
            if(!is_array($currency)) {
                $currency = array($currency);
            }

            array_walk($currency, create_function('&$val, $key, $_arr', '$_arr[0][$val->id] = array("symbol" => $val->symbol, "name" => $val->name, "default" => $val->def);'), array(&$this->Currency));
        }

        return $this->Currency;
    } // end initCurrency()


    /**
     * Remove slashes if magic_quotes_gpc is set in php.ini
     * @param    string
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
     * Convert special chars in string to html code
     * @param    string to convert in
     */
    public function specialToHtmlCodes( $_string = null )
    {
        if(is_null($_string)) {
            return $_string;
        }

        $_string = $this->stripMagicQuotes($_string);
        // ampersand, quotes, less, greater
        $_string = htmlspecialchars($_string, ENT_QUOTES, 'UTF-8');
        // { }
        $_string = str_replace("{","&#123;", $_string);
        $_string = str_replace("}","&#125;", $_string);

        return $_string;
    } // end specialToHtmlCodes()


    /**
     * Escaping special symbols in the string
     * @param    string
     * @param    resource, use external DB decriptor
     */
    public function escapeQueryString( $var, $descriptor = false )
    {
        if($descriptor == false && $this->descriptor != false)
            $descriptor = $this->descriptor;

        if(!$descriptor)
            return mysql_real_escape_string($this->stripMagicQuotes($var));
        else return mysql_real_escape_string($this->stripMagicQuotes($var), $descriptor);
    } // end escapeString()


    /**
     * Get agreemants numbering templates from options table
     * @var        returns array
     */
    function OptionsAgrmList()
    {
        $_options = array();
        if( false == ($sql_query = mysql_query("SELECT descr, value FROM options WHERE name REGEXP 'agrmnum_template_[[:digit:]]+'", $this->descriptor)) )
            return $_options;

        while($row = mysql_fetch_row($sql_query))
            $_options[] = array($row[0], $row[1]);

        return $_options;
    } // end OptionsAgrmList()


    /**
     * Get users list from the DB using search parameters
     * @param    bool, apply privileges to logged in manager for the list
     * @param    array, filter array values:
     *         ["locale"]    string, !!Impotant!! if you need to change result locale, then set this variable according
     *                 to MySQL variable names (default cp1251)
     *         ["uid"]        integer or uid's array
     *         ["name"]    string, user name
     *         ["agrmnum"]    string, agreement number
     *         ["address"]    string, address
     * @param    integer, start list from record line
     * @param    integer, records limit, if 0 than full list (ignore start)
     * @param    object, sql connectio resource
     */
    function getUsersList( $privileges = true, $filter = array(), $start = 0, $limit = 0, $descriptor = false )
    {
        if($descriptor == false && $this->descriptor != false)
            $descriptor = $this->descriptor;

        if(!isset($_SESSION["auth"]["authperson"]))
        {
            $this->ErrorHandler("main.class.php", "Session authorized person record not found, returned empty data.", __LINE__);
            return array();
        }

        $_filter = array();
        if($privileges == true && $_SESSION["auth"]["authperson"] > 0)
            $uids = array_unique(array_merge($_SESSION["permissions"]["ro_usergroups"],$_SESSION["permissions"]["rw_usergroups"]));

        // Aply filter values
        if(sizeof($filter) > 0)
        {
            if(isset($filter["locale"]))
            {
                $_locale = $this->encodingName($filter["locale"]);
                unset($filter["locale"]);
            }

            foreach($filter as $key => $value)
            {
                switch( true )
                {
                    case($key == "name"):
                        $_filter[] = sprintf("acc.name LIKE '%%%%%s%%%%'", $this->escapeQueryString($value));
                    break;

                    case($key == "name_sound"):
                            $str_arr = explode(" ", $value);
                            $_tmp = array();

                            foreach($str_arr as $_val)
                            {
                                if(empty($_val)) continue;

                                $cons = $this->consonant($_val, (!isset($_locale) ? 'cp1251' : $_locale));
                                if($cons[1] < 3) continue;

                                $_tmp[] = $cons[0];
                            }

                            if(sizeof($_tmp) > 0)
                                $_filter[] = sprintf("CONSONANT(acc.name) REGEXP '%s'", implode("|", $_tmp));
                    break;

                    case($key == "agrmnum" && $value != ""):
                        $_filter[] = sprintf("agrms.number LIKE '%%%%%s%%%%'", $this->escapeQueryString($value));
                    break;

                    case($key == "kod_1c" && $value != ""):
                        $_filter[] = sprintf("acc.kod_1c LIKE '%%%%%s%%%%'", $this->escapeQueryString($value));
                    break;

                    case($key == "address" && $value != ""):
                        $_filter[] = sprintf("CONCAT_WS(' ', acc.b_index, acc.country_b, acc.city_b, acc.street_b,
                        acc.bnum_b, acc.bknum_b, acc.apart_b, acc.region_b, acc.district_b, acc.settle_area_b,
                        acc.addr_b, acc.fa_index, acc.country, acc.city, acc.street, acc.bnum, acc.bknum, acc.apart,
                        acc.region, acc.district, acc.settle_area, acc.addr, acc.pass_sernum, acc.pass_no,
                        acc.pass_issuedate, acc.pass_issuedep, acc.pass_issueplace) LIKE '%%%%%s%%%%'",
                        $this->escapeQueryString($value));
                    break;

                    case ($key == "uid"):
                        // Let us convert integer value to array. It's the simple way to check permitions
                        if(!is_array($value) && $value != "")
                            $value = explode(",", $value);

                        if(is_array($value) && sizeof($value))
                        {
                            if($privileges == true && $_SESSION["auth"]["authperson"] > 0)
                            {
                                if(isset($uids) && sizeof($uids) > 0)
                                    $uids = array_intersect($value, $uids);
                                else $uids = array();
                            }
                            elseif($privileges == true && $_SESSION["auth"]["authperson"] == 0)
                                $uids = $value;
                            elseif($privileges == false)
                                $uids = $value;
                            else $uids = array();
                        }
                        else $uids = array();
                    break;

                    case($key == "groupId" && $value != ""):
                        $_filter[] = sprintf("grp.group_id IN (%s)", $this->escapeQueryString($value));
                        $_joinGroups = true;
                    break;
                }
            }
        }

        if(isset($uids))
            $_filter[] = sprintf("acc.uid IN (%s)", (sizeof($uids) == 0) ? "NULL" : implode(",", $uids));

        // Change connection encoding
        if(isset($_locale))
        {
            if( false == mysql_unbuffered_query(sprintf("SET names %s", $_locale), $descriptor))
                $this->ErrorHandler("main.class.php", "Can't change result encoding to " . $_locale, __LINE__);
        }

        // Get total records
        if( false == ($sql_query = mysql_query(sprintf("SELECT COUNT(DISTINCT acc.uid) FROM accounts AS acc
                LEFT JOIN agreements_list AS agrms ON (acc.uid = agrms.uid)
                %s
                %s ORDER BY acc.uid",
                ($_joinGroups == true) ? "LEFT JOIN usergroups_staff AS grp ON (grp.uid = acc.uid) " : "",
                sizeof($_filter) ? "WHERE " . implode(" AND ", $_filter) : ""), $descriptor)))
        {
            $this->ErrorHandler("main.class.php", "Can't get total users list value. " . mysql_error($descriptor), __LINE__);
            return array();
        }

        $this->userListTotal = mysql_result($sql_query, 0);

        if( false == ($sql_query = mysql_query(sprintf("SELECT acc.uid uid, acc.name name, acc.login login, acc.phone phone,
                acc.fax fax, acc.email email, acc.descr descr,
                GROUP_CONCAT(DISTINCT list.number SEPARATOR ', ') agrm_num,
                GROUP_CONCAT(DISTINCT list.date SEPARATOR ', ') agrm_date,
                acc.kod_1c kod_1c, acc.type type, acc.balance balance,
                CONCAT_WS(', ', acc.b_index, acc.country_b, acc.city_b, acc.street_b, acc.bnum_b, acc.bknum_b,
                acc.apart_b, acc.region_b, acc.district_b, acc.settle_area_b, acc.addr_b) address_bill,
                CONCAT_WS(', ', acc.fa_index, acc.country, acc.city, acc.street, acc.bnum, acc.bknum, acc.apart,
                acc.region, acc.district, acc.settle_area, acc.addr) address,
                CONCAT_WS(', ', acc.yu_index, acc.country_u, acc.city_u, acc.street_u, acc.bnum_u, acc.bknum_u,
                acc.apart_u, acc.region_u, acc.district_u, acc.settle_area_u, acc.addr_u) address_u,
                CONCAT_WS(', ', acc.pass_sernum, acc.pass_no, acc.pass_issuedate, acc.pass_issuedep, acc.pass_issueplace) passport, acc.birthdate, acc.birthplace,
                GROUP_CONCAT(list.vg_id) vg_id
                FROM accounts AS acc
                LEFT JOIN agreements AS list ON (list.uid = acc.uid)
                %s
                %s GROUP BY acc.uid ORDER BY acc.uid %s",
                ($_joinGroups == true) ? "LEFT JOIN usergroups_staff as grp ON (grp.uid = acc.uid) " : "",
                sizeof($_filter) ? "WHERE " . implode(" AND ", $_filter) : "",
                ($limit > 0) ? sprintf(" LIMIT %d, %d", $start, $limit) : ""), $descriptor)) )
        {
            $this->ErrorHandler("main.class.php", "Can't get users list. " . mysql_error($descriptor), __LINE__);
            return array();
        }

        $arr = array();
        while($row = mysql_fetch_assoc($sql_query))
        {
            $row["address_bill"] = $this->clearAddress($row["address_bill"]);
            $row["address"] = $this->clearAddress($row["address"]);
            $arr[$row["uid"]] = $row;
        }

        return $arr;
    } // end getUsersList()


    /**
     * Get vgroups list from the DB using search parameters
     * @param    bool, apply privileges to logged in manager for the list
     * @param    array, filter array values:
     *         ["locale"]    string, !!Impotant!! if you need to change result locale, then set this variable according
     *                 to MySQL variable names (default cp1251)
     *         ["vgid"]    integer or uid's array
     *         ["login"]    string, vgroup login
     *         ["tarif_id"]    integer, tarif id
     *         ["id"]        integer, agent id
     *         ["uid"]        to find vg by user id
     *         ["archive"]    if vg is deletes
     *         ["changed"]    if vg is modified, Youshould set value with logic: 'changed' => '!= 5'
     * @param    integer, start list from record line
     * @param    integer, records limit, if 0 than full list (ignore start)
     * @param    object, sql connection resource
     */
    function getVgroupsList( $privileges = true, $filter = array(), $start = 0, $limit = 0, $descriptor = false )
    {
        if($descriptor == false && $this->descriptor != false)
            $descriptor = $this->descriptor;

        if(!isset($_SESSION["auth"]["authperson"]))
        {
            $this->ErrorHandler("main.class.php", "Session authorized person record not found, returned empty data.", __LINE__);
            return array();
        }

        $_filter = array();
        if($privileges == true && $_SESSION["auth"]["authperson"] > 0)
            $vgid = array_unique(array_merge($_SESSION["permissions"]["ro_groups"],$_SESSION["permissions"]["rw_groups"]));

        if($privileges == true && $_SESSION["auth"]["authperson"] > 0)
            $uids = array_unique(array_merge($_SESSION["permissions"]["ro_usergroups"],$_SESSION["permissions"]["rw_usergroups"]));

        // Aply filter values
        if(sizeof($filter) > 0)
        {
            if(isset($filter["locale"]))
            {
                $filter["locale"] = strtoupper($filter["locale"]);
                if(in_array($filter["locale"], array("UTF8", "UTF-8", "CP1251", "KOI8R", "ASCII", "WINDOWS-1251")))
                    $_locale = $filter["locale"];

                unset($filter["locale"]);
            }

            foreach($filter as $key => $value)
            {
                switch( true )
                {
                    case($key == "login" && $value != ""):
                        $_filter[] = sprintf("vgroups.login LIKE '%%%%%s%%%%'", $this->escapeQueryString($value));
                    break;

                    case($key == "tarif_id" && $value != ""):
                        $_filter[] = sprintf("vgroups.tar_id = '%d'", $value);
                    break;

                    case($key == "id" && $value != ""):
                        $_filter[] = sprintf("vgroups.id = '%d'", $value);
                    break;

                    case($key == "archive"):
                        $_filter[] = sprintf("vgroups.archive = '%d'", $value);
                    break;

                    case($key == "modified" && $value != ""):
                        $_filter[] = sprintf("vgroups.changed %s", $this->escapeQueryString($value));
                    break;

                    case($key == "vgid"):
                        // Let us convert integer value to array. It's the simple way to check permitions
                        if(!is_array($value) && $value != "")
                            $value = explode(",", $value);

                        if(is_array($value) && sizeof($value))
                        {
                            if($privileges == true && $_SESSION["auth"]["authperson"] > 0)
                            {
                                if(isset($vgid) && sizeof($vgid) > 0)
                                    $vgid = array_intersect($value, $vgid);
                                else $vgid = array();
                            }
                            elseif($privileges == true && $_SESSION["auth"]["authperson"] == 0)
                                $vgid = $value;
                            elseif($privileges == false)
                                $vgid = $value;
                            else $vgid = array();
                        }
                        else $vgid = array();
                    break;

                    case($key == "uid"):
                        // Let us convert integer value to array. It's the simple way to check permitions
                        if(!is_array($value) && $value != "")
                            $value = explode(",", $value);

                        if(is_array($value) && sizeof($value))
                        {
                            if($privileges == true && $_SESSION["auth"]["authperson"] > 0)
                            {
                                if(isset($uids) && sizeof($uids) > 0)
                                    $uids = array_intersect($value, $uids);
                                else $uids = array();
                            }
                            elseif($privileges == true && $_SESSION["auth"]["authperson"] == 0)
                                $uids = $value;
                            elseif($privileges == false)
                                $uids = $value;
                            else $uids = array();
                        }
                        else $uids = array();
                    break;
                }
            }
        }

        if(isset($vgid))
            $_filter[] = sprintf("vgroups.vg_id IN (%s)", (sizeof($vgid) == 0) ? "NULL" : implode(",", $vgid));


        if(isset($uids))
            $_filter[] = sprintf("list.uid IN (%s)", (sizeof($uids) == 0) ? "NULL" : implode(",", $uids));

        // Change connection encoding
        if(isset($_locale))
        {
            if( false == mysql_unbuffered_query(sprintf("SET names %s", $_locale), $descriptor))
                $this->ErrorHandler("main.class.php", "Can't change result encoding to " . $_locale, __LINE__);
        }

        // Get total records
        if( false == ($sql_query = mysql_query(sprintf("SELECT COUNT(*) FROM vgroups AS vgroups
                %s %s ORDER BY vgroups.vg_id",
                isset($uids) ? " LEFT JOIN agreements AS list ON (vgroups.agrm_id = list.agrm_id) " : "",
                sizeof($_filter) ? "WHERE " . implode(" AND ", $_filter) : ""), $descriptor)))
        {
            $this->ErrorHandler("main.class.php", "Can't get total vgroups list value. " . mysql_error($descriptor), __LINE__);
            return array();
        }

        $this->vgroupListTotal = mysql_result($sql_query, 0);

        if( false == ($sql_query = mysql_query(sprintf("SELECT vgroups.vg_id vg_id, vgroups.login login,
                vgroups.id id, vgroups.tar_id tar_id,
                tarifs.descr tarifname, settings.service_name service_name, settings.descr agentdescr
                FROM vgroups AS vgroups
                %s
                LEFT JOIN tarifs AS tarifs ON (tarifs.tar_id = vgroups.tar_id)
                LEFT JOIN settings AS settings ON (settings.id = vgroups.id)
                %s ORDER BY vgroups.vg_id %s",
                isset($uids) ? " LEFT JOIN agreements AS list ON (vgroups.agrm_id = list.agrm_id) " : "",
                sizeof($_filter) ? "WHERE " . implode(" AND ", $_filter) : "",
                ($limit > 0) ? sprintf(" LIMIT %d, %d", $start, $limit) : ""), $descriptor)) )
        {
            $this->ErrorHandler("main.class.php", "Can't get vgroups list. " . mysql_error($descriptor), __LINE__);
            return array();
        }

        $arr = array();
        while($row = mysql_fetch_assoc($sql_query))
            $arr[$row["vg_id"]] = $row;

        return $arr;
    } // end getVgroupsList()


    /**
     * Clear address string, remove any empty values
     * @param    string address
     * @param    string separator to devide address string
     */
    public function clearAddress( $address = "", $separator = "," )
    {
        if(trim($address) == "") {
            return "";
        }

        $arr = explode($separator, $address);
        foreach($arr as $key => $value) {
            if(trim($value) == "") {
                unset($arr[$key]);
            }
        }

        return implode($separator, $arr);
    } // end clearAddress()


    /**
     * Gets and returns accountancy documents in system, which can be used in
     * different list. For example to create preOrders list
     * @param    array with filter attributes
     */
    function getAccountancyDocs( $filter )
    {
        if($this->Option('default_legal') === false || $this->Option('default_physical') === false) {
            $this->initSystemSettings();
        }

        $_filter = array();
        $arr = array();

        foreach($filter as $key => $value)
        {
            switch( true )
            {
                case ($key == "hidden"): $_filter[] = sprintf("hidden = %d", $value);
                break;

                case ($key == "payable"): $_filter[] = sprintf("payable = %d", $value);
                break;

                case ($key == "onfly"): $_filter[] = sprintf("onfly = %d", $value);
                break;
            }
        }

        if( false == ($sql_query = mysql_query(sprintf("SELECT doc_id, name, NULL, nds_above,
                    template, save_path, usergroup_id,
                    group_id, payable, client_allowed,
                    upload_ext, hidden, onfly, detail
                    FROM documents %s
                    GROUP BY doc_id ORDER BY name",
                    (sizeof($_filter) > 0) ? "WHERE " . implode(" AND ", $_filter) : ""), $this->descriptor)) )
        {
            $this->ErrorHandler("main.class.php", "Can't get documents list (accountancy). " . mysql_error($this->descriptor), __LINE__);
            return array();
        }

        while($row = mysql_fetch_assoc($sql_query))
            $arr[$row['doc_id']] = $row;

        return $arr;
    } // end getAccountancyDocs()


    /**
     * Performs date arithmetic
     * @param    string, date to change (YYYY-mm-dd HH:ii:ss)
     * @param    integer, interval to add
     * @param    string, units in which the expression should be interpreted
     *             known: year, month, day
     * @param    string, output format
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
     * @param    string, date to convert YYYY-mm-dd HH:ii:ss
     * @param    string, to format to
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
     * Creates an array by using one array (SOAP array name) for keys and another (SOAP array data item) for its values
     * @param    array, name to use as keys
     * @param    array of object with data
     * @param    function, callback function to apply on each data line
     */
    public function dataCombine( $names = array(), $data = array(), $callback = false )
    {
        if(empty($data)) {
            return array();
        }

        if(!is_array($data)) {
            $data = array($data);
        }

        if(!is_callable($callback)) {
            $callback = false;
        }

        $_data = array();
        if(empty($names)) {
            array_walk($data, create_function('$val, $key, $_tmp', '
                if($_tmp[1] != false) {
                    $_tmp[0][] = $_tmp[1]($val->val);
                }
                else {
                    $_tmp[0][] = $val->val;
                }
            '), array( &$_data, $callback ));
        }
        else {
            array_walk($data, create_function('$val, $key, $_tmp', '
                $A = @array_combine($_tmp[1], $val->val);
                if($_tmp[2] != false) {
                     $A = $_tmp[2]($A);
                }
                if(!empty($A)){
                    $_tmp[0][] = $A;
                };
            '), array( &$_data, &$names, $callback ));
        }

        // Clear memory
        unset($name, $data);

        return $_data;
    } // end dataCombine


    /**
     * Send mail function
     * @param    string, to set mail from address. If empty, than system default
     * @param    stringm to send to
     * @param    string mail subject
     * @param    string mail message
     */
    public function sendMailTo( $mail_from = "" , $mail_to = "", $subject = "", $message = "" )
    {
        if(!empty($mail_from))
        {
            if($this->checkEmailAddress($mail_from)) {
                ini_set('sendmail_from', $mail_from);
            }
            else {
                $this->ErrorHandler("main.class.php", "Wrong email format From: " . $mail_from . " Using system default!", __LINE__);
            }
        }

        if(empty($mail_to))
        {
            $this->ErrorHandler("main.class.php", "Empty email To. Stop sending!", __LINE__);
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
                        $this->ErrorHandler("main.class.php", "Wrong email format To: " . $val . " Removed from list!", __LINE__);
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

        // Заголовок
		$headers = "MIME-Version: 1.0\n";
		$headers .= "Content-Type: text/plain; charset=utf-8\n";
		$headers .= "Content-Transfer-Encoding: 8bit\n";

		if($this->checkEmailAddress($mail_from)) {
			$headers .= sprintf("Return-path: %s <%s>\n", $mail_from, $mail_from);
			$headers .= sprintf("From: %s <%s>\n\n", $mail_from, $mail_from);
		}

        $subject = sprintf("=?utf-8?B?%s?=", base64_encode($subject));
        $message = sprintf("%s\n", $message);

        if(mail($mail_to, $subject, $message, $headers)) {
            return true;
        }
        else
        {
            $this->ErrorHandler("main.class.php", "There was error while sending email", __LINE__);
            return false;
        }
    } // end sendMailTo()


    /**
     * Validate email address format
     * @param    string address
     * @param    bool, use strict format
     */
    public function checkEmailAddress( $email = "", $strict = true )
    {
        if(strlen($email) == 0) return false;

        $regex = ($strict) ? '/^([.0-9a-z_-]+)@(([0-9a-z-]+\.)+[0-9a-z]{2,4})$/i' :
                '/^([*+!.&#$¦\'\\%\/0-9a-z^_`{}=?~:-]+)@(([0-9a-z-]+\.)+[0-9a-z]{2,4})$/i';

        if(preg_match($regex, trim($email))) return true;
        else return false;
    } // end checkEmailAddress()


    /**
     * Leaves in string only consonants.
     * Returnds array: [0] => string, [1] => string_length
     * @param    string
     */
    public function consonant( $string )
    {
        $out_string = '';
        $string = mb_strtoupper($string, 'UTF8');
        $str_length = mb_strlen($string, 'UTF8');

        while($i < $str_length)
        {
            $str = mb_substr($string, $i, 1, 'UTF8');
            $str_num = hexdec(current(unpack('H*', $str)));

            switch( true )
            {
                // cyrillic utf8
                case ($str_num > 0xd090 && $str_num < 0xd095):
                case ($str_num > 0xd095 && $str_num < 0xd098):
                case ($str_num > 0xd099 && $str_num < 0xd09e):
                case ($str_num > 0xd09e && $str_num < 0xd0a3):
                // integer
                case ($str_num >= 0x30 && $str_num <= 0x39):
                // latin
                case ($str_num > 0x41 && $str_num < 0x45):
                case ($str_num > 0x45 && $str_num < 0x49):
                case ($str_num > 0x4a && $str_num < 0x4f):
                case ($str_num > 0x4f && $str_num < 0x51):
                case ($str_num > 0x51 && $str_num < 0x59):
                case ($str_num == 0x5a):

                break;

                default: $str = '';
            }

            if($i < 1) $out_string .= $str;
            else {
                if($str != $str_last) $out_string .= $str;
            }

            $str_last = $str;
            $i++;
        }

        return array(mb_strtolower($out_string, 'UTF8'), mb_strlen($out_string, 'UTF8'));
    } // end consonant()


    /**
     * Returns random symbols line. You may use this function to generate random password
     * If there is no any parameter, than function will use internal settings
     * Don't use multibyte cyrillic symbols
     * @param    string, symbols list to use for random
     * @param    integer, length of the result
     */
    function randomString( $symbols = "", $length = 0 )
    {
        if(empty($length) || is_null($length)) $length = $this->Option('pass_length');

        if(strlen($symbols) > 0 && strlen($symbols) < $length)
        {
            $this->ErrorHandler(__FILE__, "You try to get result with " . $length . " length, but source line contains " . strlen($symbols) . " symbols. Using default", __LINE__);
            $symbols = null;
        }

        if(empty($symbols) || is_null($symbols))
        {
            if($this->Option('pass_numbers') != 1)
                $symbols = "bcdfghjkmnpqrstvwxyzBCDFGHJKMNPQRSTVWXYZ-_";

            $symbols .= "1234567890123456789012345";
        }

        if(!function_exists("str_split"))
        {
            $this->ErrorHandler(__FILE__, "You need 'str_split function. Please install additional packedges for the PHP5'", __LINE__);

            function str_split($text, $split = 1)
            {
                $array = array();
                for ($i = 0; $i < strlen($text); $i += $split)
                    $array[] = substr($text, $i, $split);

                return $array;
            }
        }

        $str = '';
        $symbols = str_split($symbols);
        shuffle($symbols);
        $rand_keys = array_rand($symbols, $length);
        foreach($rand_keys as $key)
            $str .= $symbols[$key];

        return $str;
    } // end randomString()


    /**
     * Sometimes sent variable from web contains boolean value like string type
     * or "on" state from checkbox. This function checks this states and return
     * boolean value true or false
     * @param    string
     */
    public function boolean( $value = null )
    {
        switch( strtolower($value) )
        {
            case ("true"): return true;
            case ("on"): return true;
            case ("false"): return false;
            case (true): return true;
            case (false): return false;
            case (1): return true;
            case (0): return false;
            default: return false;
        }
    } // end boolean()


    /**
     * Check number and convert float value with comma delimiter to number with point delimiter
     * @param    float
     */
    public function float( $value = 0 )
    {
        return ((float)str_replace(",", ".", $value));
    } // end float()


    /**
     * Create file path according to the billing folder path
     * If path is relative than there'll be added start path
     * @param    string, some path
     */
    public function inCorePath( $path )
    {
        if(preg_match("/^(\/)|(\w:[\/])/", $path)) return $path;

        if(!isset($this->billingCorePath))
        {
            if($this->MSWin){
                $this->getBillingConfig();
            }
            else {
                $this->billingCorePath = "/usr/local/billing/";
            }
        }

        return ($this->billingCorePath . preg_replace("/^[\.\\/]+/", "", $path));
    } // end inCorePath()


    /**
     * Checks and returns compatible encoding name
     * @param    string, encoding name
     * @param    boolean, if this check is for HTTP header
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
     * Checks if file was included or required earlier
     * @param    string file name
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
     * @param    integer, start iteration from point
     * @param    integer, stop iteration on point
     * @param    string, callback function name for each array item
     * @param    mixed, parameter to pass to the callback function
     * @param    array, exclude default iteration and use passed array
     * @param    integer, add undefined value at the begining of array
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
     * Create month array and pass it to the callback function ( keyValue, arrayKey, passesParams )
     * @param    string, callback function name for each array item
     * @param    mixed, parameter to pass to the callback function
     * @param    boolean, add undefined value at the begining of array
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
     * @param    integer, lines on page
     * @param    integer, current page
     */
    public function linesAsPageNum( $limit, $line )
    {
        $page = ceil($line / $limit);

        if($page == 0) return 1;
        else return $page;
    } // end linesAsPageNum()


    /**
     * This function is a bug fix for the php 5.2.x to represent correct view of the large number
     * @param    string / float / integer value to check for the short form math %fE+-%d
     */
    public function largeNumber( $value )
    {
        if(preg_match('/^[\d\.\d]+E[\+\-]\d$/', $value)) {
            return (float)$value;
        }
        else {
            return (float)$value;
        }
    } // end largeNumber()


    /**
     * Try to detect System temporary folder
     *
     */
    public function systemTemporary()
    {
        if(!function_exists('sys_get_temp_dir'))
        {
            if(!empty($_ENV['TMP'])) return realpath($_ENV['TMP']);
            if(!empty($_ENV['TMPDIR'])) return realpath( $_ENV['TMPDIR']);
            if(!empty($_ENV['TEMP'])) return realpath( $_ENV['TEMP']);

            $tempfile = tempnam(uniqid(rand(), TRUE), '');
            if(file_exists($tempfile))
            {
                unlink($tempfile);
                return realpath(dirname($tempfile));
            }
        }
        else return sys_get_temp_dir();
    } // end systemTemporary()


    /**
     * Conver file data from CSV format to array
     * @param    string, file to read
     * @param    array or integer, INTEGER: to cut columns from firt till INTEGER
     *             ARRAY: to cut columns (int start from, int till)
     * @param    array, if returned array should be accos.
     * @param    string, column delimiter, default ;
     */
    public function csvFileToArray( $file = null, $slice = 1, $struct = null, $delimiter = ';' )
    {
        if(is_null($file) || empty($file) || !file_exists($file)) {
            $this->ErrorHandler(__FILE__, "Unknown CSV file: " . $file, __LINE__);
            return false;
        }

        if(!is_array($slice)) {
            if((integer)$slice == 0) {
                $slice = 1;
            }

            $slice = array(0, $slice);
        }
        else {
            $slice[0] = (integer)$slice[0];
            $slice[1] = (integer)$slice[1];

            if($slice[1] == 0) {
                $slice[1] = 1;
            }
        }

        if(empty($struct)) {
            $struct = null;
        }

        if(empty($delimiter)) {
            $delimiter = ',';
        }

        $lines = file($file, FILE_SKIP_EMPTY_LINES);
        $_arr = array();
        foreach($lines as $line)
        {
            if(!mb_check_encoding($line, 'UTF8')) {
                $line = mb_convert_encoding($line, 'UTF8', 'CP1251');
            }

            $col = array_slice(explode($delimiter, rtrim($line, "\x20\x09\x0A\x0D\x00\x0B")), $slice[0], $slice[1]);

            if(!is_null($struct)) {
                $_tmp = array();
                array_walk($col, create_function('$val, $key, $_tmp','if(isset($_tmp[1][$key])){ $_tmp[0][$_tmp[1][$key]] = $val; } else{ $_tmp[0][sizeof($_tmp[0])] = $val; }'), array( &$_tmp, &$struct ));
                $col = $_tmp;
            }

            foreach($col as $key => $item) {
                $item = trim($item);
                $item = preg_replace("/^[\"\']+/", "", $item);
                $item = preg_replace("/[\"\']+$/", "", $item);

                $col[$key] = $item;
            }

            $_arr[] = $col;
        }

        return $_arr;
    } // end csvFileToArray()


    /**
     * Conver file data from CSV format to array, version 2
     * @param    string, file to read
     * @param    array or integer, INTEGER: to cut columns from firt till INTEGER
     *             ARRAY: to cut columns (int start from, int till)
     * @param    array, if returned array should be accos.
     * @param    string, column delimiter, default ;
     */
    public function ArrayFromCsv( $file = null, $slice = 1, $struct = null, $delimiter = ';' )
    {
        if(is_null($file) || empty($file) || !file_exists($file)) {
            $this->ErrorHandler(__FILE__, "Unknown CSV file: " . $file, __LINE__);
            return false;
        }

        if(!is_array($slice)) {
            if((integer)$slice == 0) {
                $slice = 1;
            }

            $slice = array(0, $slice);
        }
        else {
            $slice[0] = (integer)$slice[0];
            $slice[1] = (integer)$slice[1];

            if($slice[1] == 0) {
                $slice[1] = 1;
            }
        }

        if(empty($struct)) {
            $struct = null;
        }

        if(empty($delimiter)) {
            $delimiter = ',';
        }

        $lines = explode("\r", file_get_contents($file));
        $_arr = array();
		
        foreach($lines as $line)
        {
            if(!mb_check_encoding($line, 'UTF8')) {
                $line = mb_convert_encoding($line, 'UTF8', 'CP1251');
            }

            $col = array_slice(explode($delimiter, rtrim($line, "\x20\x09\x0A\x0D\x00\x0B")), $slice[0], $slice[1]);
			
            if(!is_null($struct)) {
                $_tmp = array();
                array_walk($col, create_function('$val, $key, $_tmp','if(isset($_tmp[1][$key])){ $_tmp[0][$_tmp[1][$key]] = $val; } else{ $_tmp[0][sizeof($_tmp[0])] = $val; }'), array( &$_tmp, &$struct ));
                $col = $_tmp;
            }
			
            foreach($col as $key => $item) {
                $item = trim($item);
                $item = preg_replace("/^[\"\']+/", "", $item);
                $item = preg_replace("/[\"\']+$/", "", $item);

                $col[$key] = $item;
            }
            $_arr[] = $col;
        }

        return $_arr;
    } // end ArrayFromCsv()




    /**
     * Check uploaded files array
     * @param    string, array key from the post that contains files
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

                if($this->UploadFileSize > 0 && $fData["size"] > $this->UploadFileSize)
                {
                    $this->ErrorHandler(__FILE__, "File size over than " . $this->UploadFileSize, __LINE__);
                    return false;
                }
            }

            return $this->UploadFiles;
        }

        return false;
    } // end UploadCheck()


    /**
     * Request to download selected file to client machine
     * This function has own header to send to
     * @param    string, full path to file to send to
     * @param    string, file name to send to
     * @param    string, string to send to as content
     * @param    string, content type extention
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
            else {
                $fileSize = filesize($file);
            }
        }

        if($handle == false) {
            $fileSize = mb_strlen($string, '8bit');
        }

        // Get character set from options to export data
        if(false == ($out_encoding = $this->Option('export_character'))) {
            $out_encoding = 'UTF8';
        }

        header("Pragma: public");
        header("Expires: 0");
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Cache-Control: public");
        header("Content-Description: File Transfer");
        header("Content-Type: " . (empty($ext) ? $this->mimeType($this->Extention($name)) : $ext) . "; charset=" . $this->getHtmlHeaderEnc($out_encoding));
        header("Content-Disposition: attachment; filename=" . $name . ";");
        header("Content-Transfer-Encoding: binary");

        if($handle != false) {
            if($this->isXSendFile()) {
                fclose($handle);
                header("X-Sendfile:" . realpath($file));
            }
            else {
                header("Content-Length: " . $fileSize);
                echo fread($handle, $fileSize);
                fclose($handle);
            }
        }
        else {
            echo $string;
        }

        return true;
    } // end Download()


    /**
     * Get billing verion
     * Returns object
     */
    public function getBillingVersion() {
        if(isset($_SESSION['auth']['version'])) {
            return (object)$_SESSION['auth']['version'];
        }

        return false;
    } // end getBillingVersion()


    /**
     * Returns true or false if mod_xsendfile is avaliable to use in apache server
     * Only apache server
     */
    public function isXSendFile()
    {
        if(isset($this->XSendFile)) {
            return $this->XSendFile;
        }

        if(false === stripos($_SERVER['SERVER_SOFTWARE'], 'apache')) {
            $this->XSendFile = false;
        }
        else {
            if(in_array('mod_xsendfile', apache_get_modules())) {
                $this->XSendFile = true;
            }
            else {
                $this->XSendFile = false;
            }
        }

        return $this->XSendFile;
    } // end isXSendFile()


    /**
     * This function tries to explain error codes to string
     * @param    string, error code
     * @param    string, additional message
     * @param    string, concat "my" message to defined: after, before or replace if there is no explanation
     */
    public function explainError($code = '', $mess = '', $ifmess = 'after')
    {
        $text = '';

        switch($code) {
            case 'error_perm':
                $text = 'You dont have rights to complete this action';
            break;

            default:
            if($ifmess == 'replace' && !empty($mess)) {
                $text = $mess;
            }
            else {
                $text = 'There was an error. Look server logs for details';
            }
        }

        if(is_object($this->localize)) {
            if(!empty($mess)) {
                $mess = $this->localize->get($mess);
            }

            $text = $this->localize->get($text);
        }

        if(!empty($mess)) {
            switch($ifmess) {
                case 'after':
                    $text = $text . ' ' .  $mess;
                break;

                case 'before':
                    $text = $mess . ' ' . $text;
                break;
            }
        }

        return $text;
    } // end explainError()


    /**
     * Error handler
     * @param    string, script called error
     * @param    string, message
     * @param    line
     */
    static public function ErrorHandler( $script = __FILE__, $message = '', $line = '' )
    {
        if(!empty($line)) $line = sprintf("; at line %s", $line);
        $message = sprintf("%s: %s", $script, $message, $line);
        error_log($message, 0);
    } // end ErrorHandler()


    /**
     * Debug system function
     * @param    resource or string of file name
     * @param    boolean, if need to remove previous dump file
     */
    public function debug( $caller = __FUNCTION__, $data = null )
    {
        if(empty($file)) {
            $file = __FILE__;
        }
        $backtrace = array_shift( debug_backtrace() );
        $backtrace['function_caller'] = $caller;

        if($this->debugStartTime === NULL)
        {
            $this->ErrorHandler($file, "Debug: Initialized as line " . $backtrace['line']);
            $this->debugStartTime = time() + microtime();
            $this->debugStartLine = $backtrace['line'];
            $this->dump($backtrace, $data);
        }
        else {
            $this->dump($backtrace, $data);
        }
    } // end debug()


    /**
     * Convert encoding designation to correct header value
     * @param    string, encoding name
     */
    private function getHtmlHeaderEnc( $name = 'UTF8' )
    {
        switch(strtoupper($name)) {
            case 'CP1251':
            case 'CP-1251':
                return 'windows-1251';

            case 'KOI8R':
            case 'KOI8-R':
                return 'koi8-r';

            case 'UTF8':
            case 'UTF-8':
            default:
                return 'utf-8';
        }
    } // end getHtmlHeaderEnc()


    /**
     * Http headers for the document mime types
     * @param    string, file extantion to identify document type
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
            case "xml": return "application/xml";
            case "eml": return "message/rfc822";

            default: return "application/octet-stream";
        }
    } // end mimeType()


    /**
     * Initialize file extention fot the correct mime type header
     * @param    string file name
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
     * This function dumps all known variables to file
     * @param    object, trace
     * @param    boolen, if need to remove previous dump file
     */
    private function dump( $backtrace, $data = null )
    {
        $tmp = $this->systemTemporary();

        ob_start();
        print("/*======================================================================================*/\n");
        print("/**\n * CALLED FROM FUNCTION: " . $backtrace['function_caller'] .
                "\n * Debug dump called at: " . $backtrace['file'] .
                sprintf("\n * Time since main class was initialized: %.4f", time() + microtime() - $this->debugStartTime) .
                sprintf("\n * Memory: %d Kb", ceil( memory_get_usage()/1024)) .
                "\n * Line: " . $backtrace['line'] .
                "\n * At: " . date('Y-m-d H:i:s') .
                "\n */\n");

        if($data == null || empty($data)) {
            print("\n\n/**\n * Dump SESSION Array Data\n * \n */\n");
            print_r($_SESSION);
            print("\n\n/**\n * Dump POST Array Data\n * \n */\n");
            print_r($_POST);
            print("\n\n/**\n * Dump GET Array Data\n * \n */\n");
            print_r($_GET);
            print("\n\n/**\n * Dump SERVER Array Data\n * \n */\n");
            print_r($_SERVER);
        }
        else {
            if(is_array($data) || is_object($data)) {
                print_r($data);
            }
            else {
                print($data);
            }
        }

        if($this->isConstant("FILE_DEBUG_VARDUMP") == true)
        {
            print("\n\n/**\n * Dump Trace Data\n * \n */\n");
            var_dump($backtrace);
        }

        print("\n\n");

        if(!file_put_contents($tmp . "/" . $this->dumpFile, ob_get_contents(), FILE_APPEND))
        {
            $this->ErrorHandler("Cannot store data to cache file: " . $tmp . "/" . $this->dumpFile, __LINE__);
        }
        ob_end_clean();
    } // end dump()



    /**
     * Dump data to the specified file
     * @param array $data Input array
     * @param string $filename File name to save (in TMP directory)
     */
    public function dumpme( $data, $filename = '_lb_dump_.log' )
    {
        if (is_string($data)){
            if (strtolower($data) == 'filter')
                file_put_contents(sys_get_temp_dir().'/__filter',print_r($this->_filter,1));
            elseif (strtolower($data) == 'post')
                file_put_contents(sys_get_temp_dir().'/__POST',print_r($_POST,1));
        }
        else
            file_put_contents(sys_get_temp_dir().'/'.$filename,print_r($data,1));
    }

    /**
    * Convert an object to an array
    *
    * @param    object  $object The object to convert
    * @return  array
    */
    public function objectToArray( $object )
    {
        if( !is_object( $object ) && !is_array( $object ) ) {
            return $object;
        }
        if( is_object( $object ) ) {
            $object = get_object_vars( $object );
        }
        return array_map(array($this, __FUNCTION__), $object);
    }


} // end LANBilling


/**
 * Calendar grid class to build the array of days for the selected month.
 * Mark array days if there is weekend flag
 * To get own required period pass at list YYYY-mm
 */
class calMonthGrid extends LANBilling {
    /**
     * Calendar day
     * @var        int
     */
    private $day;

    /**
     * Calendar month
     * @var        int
     */
    private $month;

    /**
     * Calendar year
     * @var        int
     */
    private $year;

    /**
     * Number of the first day of the month
     * @var        int
     */
    private $monthDayFirst = 0;

    /**
     * Point unix time when stop period iteration
     * @var        int long
     */
    private $periodEnd;

    /**
     * Stores current cycle time value
     * @var        timestamp
     */
    private $timer = 0;

    /**
     * Store period value YYYY-mm
     * @var        string
     */
    private $period = null;

    /**
     * Calendar grid array
     * @var        array
     */
    private $Grid = array();


    /**
     * Construct function to initialize settings
     * @param
     */
    function __construct( $period = null )
    {
        $this->setPeriodVar($period);
    } // end __construct()


    /**
     * Check and set period value
     * @param        string, period value
     */
    private function setPeriodVar( $period = null )
    {
        if(is_null($period) || !preg_match("/[\d+]{4}\-[\d+]{2}/", $period)) {
            $this->period = date('Y-m-01');
        }
        else {
            $this->period = $period;
        }

        $_p = explode('-', $this->period);
        $_p[2] = '01';

        $this->year = $_p[0];
        $this->month = $_p[1];
        $this->day = $_p[2];

        $this->monthDayFirst = date("w", mktime(0, 0, 0, $this->month, 1, $this->year));
        $this->periodEnd = mktime(0, 0, 0, $this->month + 1, 1, $this->year);

        if($this->monthDayFirst == 0) {
            $this->timer = mktime(0, 0, 0, $this->month, -6, $this->year);
        }
        elseif($this->monthDayFirst == 1) {
            $this->timer = mktime(0, 0, 0, $this->month, 0, $this->year);
        }
        else {
            $this->timer = mktime(0, 0, 0, $this->month, (0 - ($this->monthDayFirst - 1)), $this->year);
        }

        return ($this->period = implode('-', array_slice($_p, 0, 3)));
    } // end setPeriodVar()


    /**
     * Entry function call
     * Returns built array data like
     * array(
     * [YYYYmmdd] = unix_timestamp
     * ...
     * )
     */
    private function setGrid()
    {
        $this->Grid = array();

        for($week = 0; $week < 7; $week++)
        {
            for($weekDay = 0; $weekDay < 7; $weekDay++)
            {
                $this->timer = mktime(0, 0, 0, date("n", $this->timer), date("j", $this->timer) + 1, date("Y", $this->timer));
                $this->Grid[date("Ymd", $this->timer)] = $this->timer;

                if($weekDay == 6 && $this->timer > $this->periodEnd) {
                    break;
                }
            }

            if($weekDay == 6 && $this->timer > $this->periodEnd) {
                break;
            }
        }

        ksort($this->Grid);
        return $this->Grid;
    } // end calendarGrid()


    /**
     * Return created calendar data grid
     * @param
     */
    public function get( $period = null, $p1 = false, $p2 = false, $p3 = false )
    //public function get( $period = null )
    {
        if(!is_null($period)) {
            $this->setPeriodVar($period);
        }

        return $this->setGrid();
    } // end getFromDB()


    /**
     * Get array date value
     * @param    string, date value
     * @param    string, date format
     */
    public function getDate( $_date = null, $format = 'Ymd' )
    {
        if(is_null($_date) || empty($_date)) {
            return null;
        }

        if(isset($this->Grid[$_date])) {
            return date($format, $this->Grid[$_date]);
        }

        if(false !== ($key = array_search($_date, $this->Grid))) {
            return date($format, $this->Grid[$key]);
        }

        return null;
    } // end getDate()


    /**
     * Get the first date value
     * @param    string, format output date
     */
    public function getFirst( $format = 'Ymd' )
    {
        return $this->getDate(reset($this->Grid), $format);
    } // end getFirst()


    /**
     * Get the last date value
     * @param    string, format output date
     */
    public function getLast( $format = 'Ymd' )
    {
        return $this->getDate(end($this->Grid), $format);
    } // end getFirst()


    /**
     * Returns number of weeks in the grid block
     * @return        int
     */
    public function getWeeksNum() {
        return ceil(sizeof($this->Grid) / 7);
    }
} // calMonthGrid
