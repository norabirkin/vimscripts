<?php
/**
 * SOAP Client class. It uses WSDL specification to communicate with
 * billing core module.
 * Attantion, this file is extends of the main system class
 *
 * Repository information:
 * $Date: 2009-10-08 09:01:01 $
 * $Revision: 1.1.2.29 $
 */

class SOAP {
    private $logRawSoap = false;

	/**
	 * WSDL file path
	 * @var		string
	 */
	public $wsdlFile = "soap/api3.wsdl";

	/**
	 * WSDL control file cache path
	 * @var		string
	 */
	private $wsdlTmpPrefix = "lb_wsdl_admin_";

	/**
	 * Error flag, default false
	 * @var		boolean
	 */
	public $Error = false;

	/**
	 * Errors array, messages from exception trace
	 * @var		array
	 */
	private $Errors = array();

	/**
	 * If need to skip priviuos errors and run
	 * @var		boolean
	 */
	public $skipErrors = true;

	/**
	 * Client class resource
	 * @var		object
	 */
	public $soapClient;

	/**
	 * SOAP client options
	 * @var		array
	 */
	public $soapOptions = array('trace' => 1, 'user_agent' => "PHP-SOAP/php-version", 'connection_timeout' => 5);

	/**
	 * Avaliable functions to call
	 * @var		array
	 */
	public $soapFunctions = array();

	/**
	 * Avaliable SOAP type
	 * @var		array
	 */
	 public $soapTypes = array();

	 /**
	  * SOAP Discovery flag. Maybe usefull to debug
	  * @var	boolean
	  */
	 public $soapDiscover = false;

	 /**
	  * To turn on / off response cache
	  * @var	boolean
	  */
	 private $useCache = true;

	 /**
	  * Global variable cache name
	  * @var	string
	  */
	 private $cacheName = 'lbSoapCache';

	 /**
	  * Time interval to recall cache data for the function
	  * @var	integer
	  */
	 private $timeInterval = 180;

	public $lastRequest = array();
	
	private $lastRequestedFunction;

	/**
	 * Construct
	 *
	 */
	public function __construct()
	{
		if(defined('SOAP_WSDL_FILE')) {
			$this->wsdlFile = SOAP_WSDL_FILE;
		}
		if(defined('SOAP_WSDL_TMP_PREFIX')) {
			$this->wsdlTmpPrefix = SOAP_WSDL_TMP_PREFIX;
		}
		if(defined('SOAP_RESPONSE_CACHE')) {
			if(SOAP_RESPONSE_CACHE == false) $this->useCache = false;
		}

		// Call function to check if parent wsdl file was modified
		$this->wsdlControl();

		try {
			$this->soapClient = new SoapClient($this->rootPath . $this->wsdlFile, $this->soapOptions);

			if($this->soapDiscover) {
				$this->soapFunctions = $this->soapClient->__getFunctions();
				$this->soapTypes = $this->soapClient->__getTypes();
			}
		} catch( Exception $e ) {
			$this->ErrorHandler(__FILE__, $e, __LINE__);
			$this->Error = true;
		}
	} // end __construct()


	/**
	 * Fires to destroy class
	 *
	 */
	public function __destruct()
	{
		if($this->useCache == false && isset($_SESSION[$this->cacheName]))
			unset($_SESSION[$this->cacheName]);
		else {
			$flush = array();
			if(sizeof($_SESSION[$this->cacheName]) > 0)
			{
				foreach($_SESSION[$this->cacheName] as $func => $_array) {
					if(!isset($_array['valid']) || $_array['valid'] <= time())
						$flush[] = $func;
				}
			}

			if(sizeof($flush) > 0) {
				$this->flushCache($flush);
			}
		}
	} // end __destruct()


	/**
	 * Flush error messages and reset error flag
	 *
	 */
	public function flushErrors()
	{
		$this->Errors = array();
		$this->Error = false;
	} // end flushErrors()


	/**
	 * Returns object with the last error
	 * @var		detail - message from server
	 * 		type - server side error type
	 * 		code - server code error (reserved, not supprted yet)
	 */
	public function soapLastError()
	{
		end($this->Errors);
		$_err = current($this->Errors);

		return (object)$_err;
	} // end soapLastError()


	/**
	 * Get cookie(s) from SOAP response
	 * @param        string, cookie name
	 */
	public function getCookie( $name = "" )
	{
		$headers = $this->soapClient->__getLastResponseHeaders();
		$result = array();
		if(($m = preg_match_all('/.*Set-Cookie: ([[:alnum:]]+)=([[:alnum:]]+);.*/', $headers, $match, PREG_SET_ORDER)))
			for($i = 0; $i < $m; $i++)
				$result[$match[$i][1]] = $match[$i][2];
		if(empty($name))
			return $result;
		else
			return $result[$name];
	}


	/**
	 * Set cookie for SOAP requests
	 * @param	string, cookie name
	 * @param	string, cookie value
	 */
	public function setCookie( $name = "", $value ="" )
	{
		if( !empty($name) )
		{
			if( !empty($value) )
				$this->soapClient->__setCookie( $name, $value );
			else
				$this->soapClient->__setCookie( $name );
		}
	}

	/**
	 * Make select query to server
	 * @param	string, function name to use
	 * @param	array, options to send to
	 * @param	boolean, reset cache and send request again
	 * @param	boolean, if the result should be store to cache
	 */
	public function get( $functionName = "", $options = array(), $revalidate = false, $dontcache = false )
	{
		if($this->skipErrors == false && $this->Error)
		{
			$this->ErrorHandler(__FILE__, "Request stopped through priviuos error", __LINE__);
			return false;
		}

		if(empty($functionName))
		{
			$this->ErrorHandler(__FILE__, "There was request with empty function name", __LINE__);
			$this->Error = true;
			return false;
		}

		if($revalidate == true && $this->useCache == true) {
			unset($_SESSION[$this->cacheName][$functionName]);
		}

		if($this->useCache == true && $dontcache == false)
		{
			if(isset($options['md5'])) {
				$_md5 = $options['md5'];
			}
			else {
				$_md5 = $this->controlSum($options);
			}
			switch( true )
			{
				case (!isset($_SESSION[$this->cacheName][$functionName]['opt']) ||
							$_SESSION[$this->cacheName][$functionName]['opt'] != $_md5):

				case (!isset($_SESSION[$this->cacheName][$functionName]['valid']) ||
							$_SESSION[$this->cacheName][$functionName]['valid'] <= time()):
				break;

				default: return $_SESSION[$this->cacheName][$functionName]['ret'];
			}
		}

		try {
			$this->lastRequest = $options;
			$this->lastRequestedFunction = $functionName;
			

			$result = $this->soapClient->$functionName($options)->ret;

			L::logfunction( $this->lastRequestedFunction, $this->lastRequest, $result );
            if ($this->logRawSoap) {
                L::logfunction($this->lastRequestedFunction, array(
                    'HEADERS' => $this->soapClient->__getLastRequestHeaders(),
                    'BODY' => $this->soapClient->__getLastRequest()
                ), array(
                    'HEADERS' => $this->soapClient->__getLastResponseHeaders(),
                    'BODY' => $this->soapClient->__getLastResponse()
                ));
            }

			if($this->useCache == true && $dontcache == false)
			{
				$_SESSION[$this->cacheName][$functionName]['opt'] = $_md5;
				$_SESSION[$this->cacheName][$functionName]['valid'] = time() + $this->timeInterval;
				$_SESSION[$this->cacheName][$functionName]['ret'] = $result;
			}

			if($this->isConstant("FILE_DEBUG") == true) {
				$this->debug(__FUNCTION__, $this->prepareSoapTrace());
			}

			return $result;
		} catch(SoapFault $fault) {
			$this->FaultHandler($fault);
			$this->Error = true;
			return false;
		}
	} // end get()


	/**
	 * Prepare and send data to the server
	 * @param	string, function name to call for the saving
	 * @param	array, options to convert to the object
	 * @param	boolean, if true - new record, false - update existing
	 * @param	array, functions names to flush for the reload after save
	 * @param	array, soapFilter values to send
	 */
	public function save( $functionName, $options = array(), $isInsert = false, $flush = array(), $flt = array() )
	{
		if($this->skipErrors == false && $this->Error)
		{
			$this->ErrorHandler(__FILE__, "Request stopped through priviuos error", __LINE__);
			return false;
		}

		if(empty($functionName))
		{
			$this->ErrorHandler(__FILE__, "There was request with empty function name", __LINE__);
			$this->Error = true;
			return false;
		}

		try {
			if(is_array($flt) && sizeof($flt) > 0)
				$this->saveReturns = $this->soapClient->$functionName(array('val' => $this->expoundAsSOAP($this->arrayToObject($options)),
					'flt' => $this->expoundAsSOAP($this->arrayToObject($flt))));
			else {
				$saveParams = array('isInsert' => (integer)$isInsert, 'val' => $this->expoundAsSOAP($this->arrayToObject($options)));
				$this->lastRequest = $saveParams;
				$this->lastRequestedFunction = $functionName;
				$this->saveReturns = $this->soapClient->$functionName( $saveParams );
				L::logfunction( $this->lastRequestedFunction, $this->lastRequest, $this->saveReturns );
                if ($this->logRawSoap) {
                    L::logfunction($this->lastRequestedFunction, array(
                        'HEADERS' => $this->soapClient->__getLastRequestHeaders(),
                        'BODY' => $this->soapClient->__getLastRequest()
                    ), array(
                        'HEADERS' => $this->soapClient->__getLastResponseHeaders(),
                        'BODY' => $this->soapClient->__getLastResponse()
                    ));
                }
			}

			if($this->useCache == true) {
				$this->flushCache($flush);
			}

			if($this->isConstant("FILE_DEBUG") == true) {
				$this->debug(__FUNCTION__, $this->prepareSoapTrace());
			}
			
			if(!empty($this->saveReturns)) return $this->saveReturns;
			else return true;
			
		} catch(SoapFault $fault) {
			$this->FaultHandler($fault);
			return false;
		}
	} // end save()


	/**
	 * Prepare and send data to the server
	 * @param	string, function name to call for the saving
	 * @param	array, options to convert to the object
	 * @param	array, functions names to flush for the reload after save
	 */
	public function delete( $functionName, $options = array(), $flush = array() )
	{
		if($this->skipErrors == false && $this->Error)
		{
			$this->ErrorHandler(__FILE__, "Request stopped through priviuos error", __LINE__);
			return false;
		}

		if(empty($functionName))
		{
			$this->ErrorHandler(__FILE__, "There was request with empty function name", __LINE__);
			$this->Error = true;
			return false;
		}

		try {
			$this->lastRequest = $options;
			$this->lastRequestedFunction = $functionName;

			$ret = $this->soapClient->$functionName($this->expoundAsSOAP($this->arrayToObject($options)));
            L::logfunction( $this->lastRequestedFunction, $this->lastRequest, $ret );

			if($this->useCache == true) {
				$this->flushCache($flush);
			}

			if($this->isConstant("FILE_DEBUG") == true) {
				$this->debug(__FUNCTION__, $this->prepareSoapTrace());
			}

			return true;
		} catch(SoapFault $fault) {
			$this->FaultHandler($fault);
			$this->Error = true;
			return false;
		}
	} // end delete()


	/**
	 * Returns default structure filter which is used as input value for the functions
	 * @param	array, keys => values to return filled
	 */
	public function soapFilter( $filter )
	{
		$default = array(
			"agrmid" => 0, "userid" => 0,
			"vgid" => 0, "tarid" => 0,
			"operid" => 0, "agentid" => 0,
			"recordid" => 0, "istemplate" => 0,
			"ugroups" => 0, "vgroups" => 0,
			"direction" => 0, "setid" => 0,
			"activated" => 0, "serno" => "",
			"cardkey" => "", "dtcreated" => "",
			"dtactivated" => "", "dtfrom" => "",
			"dtto" => "", "numfrom" => "",
			"numto" => "", "personid" => 0,
			"name" => "", "login" => "",
			"agrmnum" => "", "email" => "",
			"phone" => "", "ip" => "",
			"telstaff" => "", "code" => "",
			"archive" => 0, "descr" => "",
			"blocked" => 0, "taridprev" => 0,
			"catid" => 0, "proto" => 0,
			"port" => 0, "asnum" => 0,
			"telnum" => "", "namesound" => "",
            "unavail" => 0,
			"pgsize" => 0, "pgnum" => 0);

		$_filter = array();
		if(is_array($filter) && sizeof($filter) > 0) {
			array_walk($filter, create_function('&$val, $key, $default',' if(isset($default[0][$key])) { $default[1][$key] = $val; }'), array(&$default, &$_filter));
		}

		return $_filter;
	} // end filter()


	/**
	 * Remove any data from SESSION cache for the given functions names
	 * @param	array, functions names
	 */
	public function flushCache( $functions = array() )
	{
		if(!is_array($functions) && !empty($functions))
			$functions = explode(",", $functions);

		if(is_array($functions) && sizeof($functions) > 0)
		{
			foreach($functions as $string) {
				if(isset($_SESSION[$this->cacheName][trim($string)])) {
					unset($_SESSION[$this->cacheName][trim($string)]);
				}
			}
		}
	} // end flushCache


	/**
	 * Recursively Convert array to the Object
	 * @param	array
	 */
	private function arrayToObject( $_array = array() )
	{
		$convert = true;
		foreach($_array as $key => $value)
		{
			if(is_array($value)) {
				$_array[$key] = $this->arrayToObject($value);
				$convert = false;
			}
		}

		if($convert == true) return (object)$_array;
		else return $_array;
	} // end arrayToObject()


	/**
	 * To Prepare data as SOAP Object
	 * @param	array / object
	 */
	private function expoundAsSOAP( $data )
	{
		if(!is_array($data) && !is_object($data))
		{
			$this->ErrorHandler(__FILE__, "I've got unknown data type, there should be an array or an object", __LINE__);
			return false;
		}

		if(is_array($data))
			$data = (object)$data;

		foreach($data as $key => &$value) {
		    $this->prepareSOAPrecursive($data->$key);
		}
		return $data;
	} // end expoundAsSOAP()


	/**
	 * Recursive iteration to convert elements to SOAP interpritation
	 * @param	array / object data
	 */
	private function prepareSOAPrecursive( &$element )
	{
		if(is_array($element)) {
			foreach($element as $key=>&$val) {
				$this->prepareSOAPrecursive($val);
			}
		}
		elseif(is_object($element)) {
			if($element instanceof self) {
				$element->expoundAsSOAP();
			}
			$element=new SoapVar($element,SOAP_ENC_OBJECT);
		}
	} // end prepareSOAPrecursive()


	/**
	 * Get controls sum for the options array
	 * @param	array, Options array
	 */
	public function controlSum( $options )
	{
		$_arr = $options;

		if(sizeof($_arr) > 0)
		{
			// Sort keys
			ksort($_arr);

			foreach($_arr as $key => $item) {
				if(is_array($item)) {
					$_arr[$key] = $this->controlSum($item);
				}
			}

			$_md5 = md5( (implode('', array_keys($_arr)) . implode('', $_arr)) );
		}
		else $_md5 = 0;
		// Clear from memory
		unset($_arr);
		// return sum
		return $_md5;
	} // end controlSum()


	/**
	 * Compare original wsdl file control sum with temporary file
	 *
	 */
	private function wsdlControl()
	{
		if(!file_exists($this->rootPath . $this->wsdlFile)) {
			$this->ErrorHandler("Can't locate " . $this->rootPath . $this->wsdlFile . ". This is fatal!");
			$this->Error = true;
			$this->skipErrors = false;

			return false;
		}

		if(!file_exists($this->systemTemporary() . "/" . $this->wsdlTmpPrefix . md5(filesize($this->rootPath . $this->wsdlFile) . filemtime($this->rootPath . $this->wsdlFile)))) {
			ini_set('soap.wsdl_cache_ttl', 1);
			touch($this->systemTemporary() . "/" . $this->wsdlTmpPrefix . md5(filesize($this->rootPath . $this->wsdlFile) . filemtime($this->rootPath . $this->wsdlFile)));
		}
	} // end wsdlControl()


	/**
	 * This function process fault exception
	 * @param	object
	 */
	private function FaultHandler( $fault )
	{
		L::log( $this->lastRequestedFunction.'[REQUEST]' );
		L::log(	$this->lastRequest );
		L::log( $this->lastRequestedFunction.'[ERROR]' );
		L::log(array($fault->faultstring,$fault->detail));

		if(trim($fault->faultstring) == 'error_auth') {
			$this->Logout();
		}

		$this->ErrorHandler(__FILE__, "SOAP Fault: (faultcode: {$fault->faultcode}, faultstring: {$fault->faultstring}, detail: {$fault->detail})", __LINE__);

        if ($this->logRawSoap) {
            L::logfunction($this->lastRequestedFunction, array(
                'HEADERS' => $this->soapClient->__getLastRequestHeaders(),
                'BODY' => $this->soapClient->__getLastRequest()
            ), array(
                'HEADERS' => $this->soapClient->__getLastResponseHeaders(),
                'BODY' => $this->soapClient->__getLastResponse()
            ));
        }
		$this->Errors[] = array(
			"type" => $fault->faultstring,
			"detail" => htmlspecialchars($this->stripMagicQuotes($fault->detail), ENT_QUOTES, 'UTF-8')
		);

		$this->Error = true;
	} // end FaultHandler()


	/**
	 * Compile SOAP request and response to array data for the debug
	 *
	 */
	private function prepareSoapTrace()
	{
		return array(
			"request_header" => $this->soapClient->__getLastRequestHeaders(),
			"request" => $this->soapClient->__getLastRequest(),
			"response_header" => $this->soapClient->__getLastResponseHeaders(),
			"response" => $this->soapClient->__getLastResponse()
		);
	} // end prepareSoapTrace()
}
