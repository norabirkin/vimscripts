<?php
/**
 * Currancy form to create or edit unit and set rate
 * for the selected
 */


// There is background query
if(isset($_POST['async_call']))
{
	if(isset($_POST['getDefCurr'])) {
		getDefCurr($lanbilling);
	}

	if(isset($_POST['getcurlist'])) {
		getCurrenciesList($lanbilling);
	}

	if(isset($_POST['getrate'])) {
		CurrencyRateValues($lanbilling, $localize);
	}

	if(isset($_POST['getcurrency'])) {
		getCurrencyValue($lanbilling);
	}

	if(isset($_POST['savecurr']))
		saveCurrencyValue($lanbilling);

	if(isset($_POST['saverate'])) {
		saveCurrencyRate($lanbilling);
	}

	if(isset($_POST['getrates'])) {
		getRates($lanbilling);
	}

	if(isset($_POST['curr_remove'])) {
		removeCurrency($lanbilling);
	}
}
else
{
	$tpl = new HTML_Template_IT(TPLS_PATH);
	$tpl->loadTemplatefile("rate_control.tpl",true,true);
	$tpl->touchBlock('__global__');
	$localize->compile($tpl->get(), true);
}


function getDefCurr($lanbilling)
{
	if(FALSE == ($result = $lanbilling->get("getDictOkv", array('flt'=>$_flt)))) {
		echo "({ results: '' })";
		return;
	} else {
		if(!is_array($result)) {
			$result = array($result);
		}
		$_tmp = array();
		array_walk($result, create_function('&$obj, $key, $_tmp', '
			$_tmp[0][] = array(
				"recordid" => $obj->recordid,
				"name" => $obj->name,
				"codename" => $obj->codename,
				"countries" => $obj->countries
			);
		'), array(&$_tmp));
        if(sizeof($_tmp) > 0)
			echo '({"success": true, "results": ' . JEncode($_tmp, $lanbilling) . '})';
		else echo "({ results: '' })";
	}
}

/**
 * Build calendar grid with rate values for the selected currency
 * @param	object, billing class
 */
function CurrencyRateValues( &$lanbilling, &$localize )
{
	$cal = new calendarGrid($lanbilling, (integer)$_POST['getrate']);
	$cal->Grid();
	echo '({ current: ' . $cal->year . $cal->month . $cal->day . ', period: ' . JEncode($cal->lineGrid, $lanbilling) . ', rates: ' . JEncode($cal->db_rate, $lanbilling) . ' })';
} // end CurrencyRateValues()


/**
 * Saving new rate information to DB for the selected currency
 * @param	object, billing class
 */
function saveCurrencyRate( &$lanbilling )
{
	$struct = array(
		"curid" => (integer)$_POST['saverate'],
		"rate" => (float)$_POST['rate'],
		"date" => $_POST['startdate'],
		"datetill" => $_POST['enddate']
	);

	if( false != $lanbilling->save("updCurrencyRate", $struct, false, array("getRates", "getCurrencies")) ) {
		echo "({ success: true })";
	}
	else {
		$error = $lanbilling->soapLastError();
		echo '({ success: false, errors: { reason: "' . $error->detail . '" } })';
		return false;
	}
} // end saveCurrencyRate()


/**
 * Get rates for the currencies, this function reqires for the header information display
 * @param
 */
function getRates( &$lanbilling )
{
	$_tmp = array();
	foreach($lanbilling->Rates['other'] as $arr) {
		if($arr['curid'] > 0) {
			$_tmp[] = array("name" => $arr['name'], "symbol" => $arr['symbol'], "rate" => $arr['rate']);
		}
	}

	if(sizeof($_tmp) > 0) {
		echo "({rates: " . JEncode($_tmp, $lanbilling) . "})";
	}
	else echo "({rates: ''})";
} // end getRates()


/**
 * Get currencies list for the tree panel as leaves
 * @param	object, billing class
 */
function getCurrenciesList( &$lanbilling )
{
	$_tmp = array();

	if( false != ($result = $lanbilling->get("getCurrencies")) )
	{
		if(!is_array($result)) {
			$result = array($result);
		}

		array_walk($result, create_function('$item, $key, $_tmp', 'if($item->id > 0){ $A = (array)$item; $A["leaf"] = true; $A["text"] = $A["name"] . " (" . $A["symbol"] . ")"; if($item->def > 0){ $A["iconCls"] = "ext-mainleaf"; }; $_tmp[0][] = $A; }'), array( &$_tmp ));
	}

	$_tmp = array_values($_tmp);
	if(sizeof($_tmp) > 0) {
		echo '(' . JEncode($_tmp, $lanbilling) . ')';
	}
	else echo "({ })";
} // end getCurrenciesList()


/**
 * Get currentcy rate from database
 * @param	object
 * @param	object, template parser
 */
function getCurrency( &$lanbilling, &$tpl )
{
	foreach($lanbilling->initCurrency() as $key => $currency)
	{
		if($key == 0) {
			continue;
		}

		if(!isset($_POST['currency'])) {
			$_POST['currency'] = $key;
		}

		$tpl->setCurrentBlock("currOpt");
		$tpl->setVariable("CURRENCY", $key);
		$tpl->setVariable("CURRENCYNAME", $currency['name']);
		$tpl->setVariable("SURRENCYSYMB", $currency['symbol']);
		if($key == $_POST['currency']) {
			$tpl->touchBlock("currOptSel");
		}
		$tpl->parseCurrentBlock();
	}
} // end getCurrency()


/**
 * Get currency value by recieved ID
 * @param	object
 */
function getCurrencyValue( &$lanbilling )
{
	if( false != ($result = $lanbilling->get("getCurrencies")) )
	{
		if(!is_array($result)) {
			$result = array($result);
		}
		array_walk($result, create_function('$item, $key, $_tmp', '
            if((integer)$_POST["getcurrency"] > 0 && $_POST["getcurrency"] != $item->id) { return; }
            $_tmp[0][] = (array)$item;
        '), array( &$_tmp, $_POST['getcurrency'] ));
	}

	if(sizeof($_tmp) > 0)
		echo '({"results": ' . JEncode($_tmp, $lanbilling) . '})';
	else echo "({ results: '' })";
} // end getCurrencyValue()


/**
 * Save currency value by recieved ID
 * @param	object
 */
function saveCurrencyValue( &$lanbilling )
{
	$struct = array(
		"id" => (integer)$_POST['savecurr'],
		"def" => isset($_POST['currdef']) ? 1 : 0,
		"symbol" => $_POST['currsymb'],
		"name" => $_POST['currname'],
        "codeokv" => $_POST['codeokv']
	);

	if( false != $lanbilling->save("insupdCurrency", $struct, ((integer)$_POST['savecurr'] == 0) ? true : false, array("getRates", "getCurrencies")) )
	{
		echo "({ success: true })";
	}
	else {
		$error = $lanbilling->soapLastError();
		echo '({ success: false, errors: { reason: "' . $error->detail . '" } })';
		return false;
	}
} // end saveCurrencyValue()


/**
 * Remove currency from the list
 * @param	object, billing class
 */
function removeCurrency( &$lanbilling )
{
	if((integer)$_POST['curr_remove'] > 0)
	{
		if( false != $lanbilling->delete("delCurrency", array("id" => (integer)$_POST['curr_remove']), array("getRates", "getCurrencies")) ) {
			echo "({ success: true })";
		}
		else {
			$error = $lanbilling->soapLastError();
			echo '({ success: false, errors: { reason: "' . $error->detail . '" } })';
			return false;
		}
	}
} // end removeCurrency()


/**
 * Calendar Grid Class
 *
 */
class calendarGrid {
	/**
	 * Calendar day
	 * @var		int
	 */
	static $day;

	/**
	 * Calendar month
	 * @var		int
	 */
	static $month;

	/**
	 * Calendar year
	 * @var		int
	 */
	static $year;

	/**
	 * Calendar grid array
	 * @var		array
	 */
	public $lineGrid = array();

	/**
	 * Stores DB values of the rate
	 * @var		array
	 */
	public $db_rate = array();

	/**
	 * Number of the first month day
	 * @var		int
	 */
	private $weekDayFirst = 0;

	/**
	 * Stores current cycle time value
	 * @var		timestamp
	 */
	private $timer = 0;

	/**
	 * Current currency ID
	 * @var		integer
	 */
	public $currency = 0;

	/**
	 * Parent class object
	 * @var		object
	 */
	public $parent;


	/**
	 * Construct function to initialize settings
	 * @param
	 */
	function __construct( &$lanbilling, $currency )
	{
		$this->parent = $lanbilling;
		$this->currency = $currency;
	} // end __construct()


	/**
	 * Entry function call
	 *
	 */
	public function Grid( $_year = null, $_month = null, $_day = null )
	{
		$this->day = !empty($_day) ? sprintf("%02d", $_day) : date("d");
		$this->month = !empty($_month) ? sprintf("%02d", $_month) : date("m");
		$this->year = !empty($_year) ? sprintf("%d", $_year) : date("Y");

		$this->init_vars();
		$this->createGrid();
		$this->getFromDB();
	} // end calendarGrid()


	/**
	 * The first date of the array
	 *
	 */
	private function init_vars()
	{
		$this->weekDayFirst = date("w", mktime(0, 0, 0, $this->month, 1, $this->year));
		$this->breakOn = mktime(0, 0, 0, $this->month + 1, 1, $this->year);

		if($this->weekDayFirst == 0) $this->timer = mktime(0, 0, 0, $this->month, -6, $this->year);
		elseif($this->weekDayFirst == 1) $this->timer = mktime(0, 0, 0, $this->month, 0, $this->year);
		else $this->timer = mktime(0, 0, 0, $this->month, (0 - ($this->weekDayFirst - 1)), $this->year);
	} // end init_vars()


	/**
	 * Generate calendar grid
	 *
	 */
	function createGrid()
	{
		$this->lineGrid = array();

		for($week = 0; $week < 7; $week++)
		{
			for($weekDay = 0; $weekDay < 7; $weekDay++)
			{
				$this->timer = mktime(0, 0, 0, date("n", $this->timer), date("j", $this->timer) + 1, date("Y", $this->timer));
				$this->lineGrid[date("Ymd", $this->timer)] = $this->timer;

				if($weekDay == 6 && $this->timer > $this->breakOn) return;
			}
		}

		ksort($this->lineGrid);
	} // end createGrid()


	/**
	 * Synchronize calendar data with DB data
	 * @var		Creates data array
	 */
	function getFromDB()
	{
		reset($this->lineGrid);

		$_filter = array(
			'dtfrom' => key($this->lineGrid),
			'curid' => $this->currency
		);

		end($this->lineGrid);
		$_filter['dtto'] = key($this->lineGrid);
		$_md5 = $this->parent->controlSum($_filter);

		if( false != ($result = $this->parent->get("getRates", array('flt' => $_filter, 'md5' => $_md5))) )
		{
			if(!is_array($result)) {
				$result = array($result);
			}

			foreach($result as $item) {
				$d = $this->parent->formatDate($item->date . ' 00:00:00', 'Ymd');
				$this->db_rate[$d][0] = $item->rate;
				$this->db_rate[$d][1] = $item->modperson;
			}
		}
	} // end getFromDB()


	/**
	 * Format givven date like number
	 * @param	Date number YYYYMMDD
	 * @var		Returns YYYY-MM-DD
	 */
	function formatDate( $_date )
	{
		if(strlen($_date) != 8) return $_date;

		return (substr($_date, 0, 4) . "-" . substr($_date, 4, 2) . "-" . substr($_date, 6, 2));
	} // end formatDate()
} // end calendarGrid { }
?>
