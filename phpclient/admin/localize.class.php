<?php
/**
 * This PHP class reads from XML file localizations data
 * according to user settings which can be automaticaly detect or
 * set in strict mode for all requests. The idea was taken from the TMXResourceBundle class
 * wrote by Nicola Asuni
 */

class Localize {
	
	/**
	 * PHP files directory root path
	 * @var		string
	 */
	private $rootPath = '';
	
	/**
	 * Cache file to read from build earlier localization data
	 * @var		string
	 */
	private $cacheFile = "lb_localize_%s.inc";
	
	/**
	 * System temporary folder to store temp data
	 * @var		string
	 */
	private $tempPath;
	
	/**
	 * Source file with all avaliable localizes
	 * @var		string
	 */
	private $sourceLocalize = "localizes/localize.xml";
	
	/**
	 * Language localization to use
	 * @var		string
	 */
	public $LANG;
	
	/**
	 * Used to contain key-translation couples.
	 * @var		array
	 */
	public $resource = array();
	
	/**
	 * Current tu -> tuid value.
	 * @var		string
	 */
	private $current_key = "";
	
	/**
	 * Current data value.
	 * @var		string
	 */
	private $current_data = "";
	
	/**
	 * Is TRUE when we are inside a seg element
	 * @var		boolean
	 */
	private $segdata = false;
	
	/**
	 * Current tuv -> xml:lang value.
	 * @var		string
	 */
	private $xml_language = "";
	
	/**
	 * Localize XML file last modify date, UNIX time
	 * @var		integer
	 */
	private $sourceModified = 0;
	
	/**
	 * Keep localize array in memmory using specified charset
	 * @var		string
	 */
	private $charset = "UTF-8";
	
	
	
	/**
	 * Class constructor
	 * @param	string, language tu use. If value is empty or set 'auto' than try to detect from the connection
	 * @param	string, The result array should be in specified encoding
	 */
	public function __construct( $lang = "", $encoding = "UTF-8", $options = array() )
	{
		// Initialize php files root directory path
		if(isset($options['rootPath'])) {
			$this->rootPath = trim($options['rootPath']);
		}
		
		$this->ifIncluded("main.class.php");
		// Detect language to use
		$this->LANG = $this->language($lang);
		// Cache file name
		$this->cacheFile = sprintf($this->cacheFile, $this->LANG);
		// System temporary folder
		$this->tempPath = $this->systemTemporary();
		$this->charset = strtoupper($encoding);
		if(empty($this->charset)) $this->charset = "UTF-8";
		
		// Check if source file with translation exists
		if(!file_exists($this->rootPath . $this->sourceLocalize))
		{
			$this->ErrorHandler("Cannot open file: " . $this->rootPath . $this->sourceLocalize, __LINE__);
			return false;
		}
		else $this->sourceModified = filemtime($this->rootPath . $this->sourceLocalize);
		
		// Create function if not exists
		if(!function_exists('file_put_contents'))
		{
			function file_put_contents($filename, $data)
			{
				$f = @fopen($filename, 'w');
				if (!$f) return false;
				else
				{
					$bytes = fwrite($f, $data);
					fclose($f);
					return $bytes;
				}
			}
		}
		
		// Start localization. Check if already exists cache file
		if(file_exists($this->tempPath . "/" . $this->cacheFile))
		{
			require_once($this->tempPath . "/" . $this->cacheFile);
			if(!isset($tmx['__technical__']['lastmodify']) || $tmx['__technical__']['lastmodify'] != $this->sourceModified)
			{
				unlink($this->tempPath . "/" . $this->cacheFile);
				$this->XMLParse();
			}
			else $this->resource = $tmx;
			unset($this->resource['__technical__']);
		}
		else $this->XMLParse();
		
		if($this->charset != "UTF-8")
		{
			foreach($this->resource as $key => $value)
				$this->resource[$key] = $this->encode($value, "UTF-8", $this->charset);
		}
	} // end __construct()
	
	
	/**
	 * Class destructor; resets $resource array.
	 * 
	 */
	public function __destruct()
	{
		$resource = array(); // reset resource array
	} // end __destruct()
	
	
	/**
	 * Public function to return when data was modified
	 * @return	integer
	 */
	public function lastModified() {
		return $this->sourceModified;
	} // end lastModified()
	
	
	/**
	 * Returns the resource array containing the translated word/sentences.
	 * @var		array
	 */
	public function getResource()
	{
		return $this->resource;
	} // end getResource()
	
	
	/**
	 * Get value from array translation by key
	 * @param	string, key
	 */
	public function get($key = '')
	{
		if(isset($this->resource[$key])) {
			return $this->resource[$key];
		}
		else {
			return $key;
		}
	} // end get()
	
	
	/**
	 * Apply locale translation to the special tag
	 * @param	string to translate
	 * @param	boolean, if result should be send to stdout
	 */
	public function compile( $string = "", $print = false)
	{
		if(empty($string)) return "";
		preg_match_all("|<\%\@(.*)\%\>|U", $string, $matches);
		
		if(isset($matches[1]) && sizeof($matches[1]) > 0)
		{
			foreach($matches[1] as $key => $value)
			{
				$value = htmlspecialchars(trim($value), ENT_QUOTES, $this->charset);
				
				if(isset($this->resource[$value])) {
					$string = str_replace($matches[0][$key], $this->resource[$value], $string);
				}
			}
		}
		
		$string = preg_replace("/\<\%\@[\s\t]+/", "", $string);
		$string = preg_replace("/\<\%\@/", "", $string);
		$string = preg_replace("/[\s\t]+\%\>/", "", $string);
		$string = preg_replace("/\%\>/", "", $string);
		
		if($print) {
			print($string);
		}
		else return $string;
	} // end compile()
	
	
	/**
	 * Detect user language
	 * @param	string, language to identify
	 */
	private function language( $lang = "" )
	{
		if(empty($lang) || $lang == "auto")
		{
			if(isset($_SERVER['HTTP_ACCEPT_LANGUAGE']) && !empty($_SERVER['HTTP_ACCEPT_LANGUAGE']))
			{
				$language = strtolower($_SERVER["HTTP_ACCEPT_LANGUAGE"]);
				$language = explode(";", $language);
				$language = explode(",", $language[0]);
				
				$lang = $language[0];
			}
			else $lang = "en";
		}
		
		switch($lang)
		{
			case "ru": return "ru";
			default: return "en";
		}
		
		return $lang;
	} // end language()
	
	
	/**
	 * Get and returns system temporary folder to store cache file
	 *
	 */
	private function systemTemporary()
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
	 * XML Parser, Reads main xml file with translation and creates cache file in the system folders
	 *
	 */
	private function XMLParse()
	{
		$this->writeCache("<"."?php\n" . "// CACHE FILE FOR LANGUAGE: ". $this->LANG . "\n".
				"// DATE: " . date("Y-m-d H:i:s") . "\n" .
				"$" . "tmx['__technical__']['lastmodify']='" . $this->sourceModified . "';", FILE_APPEND);
		
		$this->parser = xml_parser_create();
		xml_set_object($this->parser, $this);
		xml_parser_set_option($this->parser, XML_OPTION_CASE_FOLDING, 0);
		// sets the element handler functions for the XML parser
		xml_set_element_handler($this->parser, "startElementHandler", "endElementHandler");
		// sets the character data handler function for the XML parser
		xml_set_character_data_handler($this->parser, "segContentHandler");
		// start parsing an XML document
		if(!xml_parse($this->parser, file_get_contents($this->rootPath . $this->sourceLocalize)))
		{
			$this->ErrorHandler(sprintf("XML error: %s at line %d", 
					    xml_error_string(xml_get_error_code($this->parser)), 
					    xml_get_current_line_number($this->parser)), __LINE__);
		}
		// free this XML parser
		xml_parser_free($this->parser);
		$this->writeCache("\n\n?" . ">");
	} // end XMLParse()
	
	
	/**
	 * Sets the start element handler function for the XML parser parser.start_element_handler.
	 * @param	resource A reference to the XML parser calling the handler.
	 * @param	string Contains the name of the element for which this handler is called. 
	 * 		If case-folding is in effect for this parser, the element name will be in uppercase letters. 
	 * @param	array Contains an associative array with the element's attributes (if any). 
	 * 		The keys of this array are the attribute names, the values are the attribute values. 
	 * 		Attribute names are case-folded on the same criteria as element names. 
	 * 		Attribute values are not case-folded. 
	 * 		The original order of the attributes can be retrieved by walking through attribs the normal way, using each(). 
	 * 		The first key in the array was the first attribute, and so on.
	 */
	private function startElementHandler($parser, $name, $attribs)
	{
		switch(strtolower($name)) {
			case 'tu':
				// Translation unit element, unit father of every element to be translated.
				// It can contain a unique identifier (tuid). 
				if (array_key_exists('tuid', $attribs))
					$this->current_key = $attribs['tuid'];
			break;
			
			case 'tuv':
				// Translation unit variant, unit that contains the language code of the translation (xml:lang)
				if (array_key_exists('xml:lang', $attribs))
					$this->xml_language = strtolower($attribs['xml:lang']);
			break;
			
			case 'seg':
				// Segment, it contains the translated text
				$this->segdata = true;
				$this->current_data = "";
			break;
			
			default: break;
		}
	} // end startElementHandler()
	
	
	/**
	 * Sets the end element handler function for the XML parser parser.end_element_handler.
	 * @param	resource Is a reference to the XML parser calling the handler.
	 * @param	string Contains the name of the element for which this handler is called.
	 * 		If case-folding is in effect for this parser, the element name will be in uppercase letters. 
	 */
	private function endElementHandler($parser, $name)
	{
		switch(strtolower($name)) {
			case 'tu':
				// Translation unit element, unit father of every element to be translated.
				// It can contain a unique identifier (tuid). 
				$this->current_key = "";
			break;
			
			case 'tuv':
				// Translation unit variant, unit that contains the language code of the translation (xml:lang)
				$this->xml_language = "";
			break;
			
			case 'seg':
				// Segment, it contains the translated text
				$this->segdata = false;
				if(!empty($this->current_data) && !array_key_exists($this->current_key, $this->resource))
				{
					$this->resource[$this->current_key] = $this->current_data;
					// Write element to cache file
					$this->writeCache("\n$" . "tmx['" . htmlspecialchars($this->current_key, ENT_QUOTES, $this->charset) . "']='" . htmlspecialchars($this->current_data, ENT_QUOTES, $this->charset) . "';");
				}
			break;
			
			default: break;
		}
	}
	
	
	/**
	 * Sets the character data handler function for the XML parser parser.handler.
	 * @param	resource Is a reference to the XML parser calling the handler.
	 * @param	string Contains the character data as a string. 
	 */
	private function segContentHandler($parser, $data) {
		if ($this->segdata && (strlen($this->current_key) > 0) && (strlen($this->xml_language)>0))
		{
			// Inside a seg element
			if (strcasecmp($this->xml_language, $this->LANG) == 0) {
				// Reached the requested language translation
				$this->current_data .= $data;
			}
		}
	} // end segContentHandler()
	
	
	/**
	 * Writes data to cache file
	 * @param	string Write data to file
	 * 
	 */
	private function writeCache( $data )
	{
		if(!file_put_contents($this->tempPath . "/" . $this->cacheFile, $data, FILE_APPEND))
			$this->ErrorHandler("Cannot store data to cache file: " . $this->tempPath . "/" . $this->cacheFile, __LINE__);
	} // end writeCache()
	
	
	/**
	 * Private link to parent project class function to send error to the log
	 * @param	string, message
	 * @param	line
	 */
	private function ErrorHandler( $message, $line )
	{
		lanbilling::ErrorHandler("localize.class.php", $message, $line);
	} // end ErrorHandler()
	
	
	/**
	 * Checks if file was included or required earlier
	 * @param	string file name
	 */
	private function ifIncluded( $file )
	{
		$included = get_included_files();
		$found = false;
		
		foreach ($included as $name)
		{
			$_data = preg_split("/[\/\\\]+/", $name);
			if($file == trim(end($_data)))
			{
				return true;
			}
		}
		
		if(!$found) include_once($file);
	} // end ifIncluded()
	
	
	/**
	 * Convert string from specified charset encoding to another
	 * @param	string, string to convert
	 * @param	string, source charset name
	 * @param	strung, result charset name
	 */
	public function encode( $string = "", $from = "UTF-8", $to = "CP1251")
	{
		if(strlen($string) == 0) return "";
		
		$from = strtoupper($from);
		$to = strtoupper($to);
		
		if($from == $to) return $string;
		
		return iconv($from, $to, $string);
	} // end encode()
}
?>