<?php class LBFake {
	
	private $lanbilling;
	public $login;
	public $password;
	private $scenario;
	private $test;
	private $log = array();
	public $logEnabled = true;
	
	function __construct($test) {
		$this->test = $test;
	}
	public function log($message) {
		$this->log[] = $message;
	}
	public function logOutput() {
		if ($this->logEnabled) foreach ($this->log as $message) Dumper::log($message);
	}
	public function soapOn($login, $password) {
		$this->login = $login;
		$this->password = $password;
		$this->test->useSOAP = true;
	}
	public function soapOff() {
		$this->test->useSOAP = false;
	}
	public function getLanbilling() {
		if (!$this->isLanbillingPreloaded()) throw new Exception('lanbilling is not loaded');
		if (!$this->lanbilling) $this->Authorize();
		return $this->lanbilling;
	}
	public function setScenario($scenario) {
		$this->scenario = $scenario;
	}
	public function save( $functionName, $options = array(), $isInsert = false, $flush = array(), $flt = array() ) {
		return func_get_args();
	}
	public function formatDate( $date_value, $format ) {
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
	}
	protected function Authorize() {
		$model = new LoginForm;
		$model->login = $this->login;
		$model->password = $this->password;
		$model->login();
		yii::import('application.controllers.SiteController');
		$controller = new SiteController('site');
		$controller->init();
		$this->lanbilling = $controller->lanbilling;
	}
	private function getSerializedStructuresFolder($folder) {
		if ($this->scenario) $folder = $folder . DIRECTORY_SEPARATOR . $this->scenario;
		return $folder;
	}
	public function writeFixture($name, $structure) {
		$SerializedObjects = new SerializedObjects($this->test);
		$SerializedObjects->setName($name);
		$SerializedObjects->setFolder('fixtures');
		$SerializedObjects->setScenario($this->scenario);
		$SerializedObjects->write($structure);
	}
	public function writeExpected($name, $structure) {
		$SerializedObjects = new SerializedObjects($this->test);
		$SerializedObjects->setName($name);
		$SerializedObjects->setFolder('expected');
		$SerializedObjects->setScenario($this->scenario);
		$SerializedObjects->write($structure);
	}
	public function getExpected($name) {
		$SerializedObjects = new SerializedObjects($this->test);
		$SerializedObjects->setName($name);
		$SerializedObjects->setFolder('expected');
		$SerializedObjects->setScenario($this->scenario);
		$expected = $SerializedObjects->getStructure();
		$this->log(array('name' => $name, 'expectedValue' => $expected));
		return $expected;
	}
	public function getFixture($name, $call = NULL) {
		$SerializedObjects = new SerializedObjects($this->test);
		$SerializedObjects->setName($name);
		$SerializedObjects->setCall($call);
		$SerializedObjects->setFolder('fixtures');
		$SerializedObjects->setScenario($this->scenario);
		$fix = $SerializedObjects->getStructure();
		$this->log(array('name' => $name, 'call' => $call, 'fix' => $fix));
		return $fix;
	}
	public function call($call) {
		if (key_exists('property', $call)) {
			$property = $call['property'];
			$object = $call['object'] ? $call['object'] : $this->getLanbilling();
			return $object->$property;
		} elseif (key_exists('method', $call)) {
			$method = $call['method'];
			$object = $call['object'] ? $call['object'] : $this->getLanbilling();
			$params = $call['params'] ? $call['params'] : array();
			return call_user_func_array(array($object, $method), $params);
		}
	}
	private function isLanbillingPreloaded() {
		foreach (yii::app()->preload as $v) if ($v == 'lanbilling') return true;
		return false;
	}
	public function getClientInfo() {
		return $this->getFixture('clientInfo', array(
			'property' => 'clientInfo'
		));
	}
	public function get($function, $params = array()) {
		$fixturename = $function;
		if ($params) $fixturename .=  md5(serialize($params));
		return $this->getFixture($fixturename, array(
			'method' => 'get',
			'params' => array(
				'functionName' => $function,
				'options' => $params
			)
		));
	}
	public function getItem($function, $params = array()) {
		$fixturename = $function;
		if ($params) $fixturename .=  md5(serialize($params));
		$conf = array(
			'method' => 'getItem',
			'params' => array(
				'function' => $function,
				'params' => $params
			)
		);
		$fix = $this->getFixture($fixturename, $conf);
		return $fix;
	}
	public function getRows($function, $params = array()) {
		$fixturename = $function;
		if ($params) $fixturename .=  md5(serialize($params));
		$conf = array(
			'method' => 'getRows',
			'params' => array(
				'function' => $function,
				'params' => $params
			)
		);
		$fix = $this->getFixture($fixturename, $conf);
		return $fix;
	}
	public function getAgreements() {
		return $this->getFixture('agreements', array(
			'property' => 'agreements'
		));
	}
	function __get($propertyName) {
		$methodName = 'get' . ucfirst($propertyName);
		if (!method_exists($this, $methodName)) throw new Exception('method LBFake::' . $methodName . '() does not exists');
		return $this->$methodName();
	}
	function __call($methodName, $params) {
		if (!method_exists($this, $methodName)) throw new Exception('method LBFake::' . $methodName . '() does not exists');
	}
	
} ?>