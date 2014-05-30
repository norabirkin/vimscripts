<?php class SerializedObjects extends LBTestCase {
	
	private $test;
	private $name;
	private $call;
	private $path;
	private $folder;
	private $scenario;
	
	function __construct($test) {
		$this->test = $test;
	}
	public function setFolder($folder) {
		$this->folder = $folder;
	}
	public function setName($name) {
		$this->name = $name;
	}
	public function setCall($call) {
		$this->call = $call;
	}
	public function setScenario($scenario) {
		$this->scenario = $scenario;
	}
	public function write($structure) {
		$handle = fopen($this->getPath($this->name), 'w');
		fwrite($handle, serialize($structure));
		fclose($handle);
	}
	private function getDirectory() {
		$dir = dirname(__FILE__) . DIRECTORY_SEPARATOR . $this->folder . DIRECTORY_SEPARATOR . get_class($this->test);
		if(!is_dir($dir)) mkdir($dir); 
		if ($this->scenario) {
			$dir .= DIRECTORY_SEPARATOR .$this->scenario;
			if(!is_dir($dir)) mkdir($dir);
		}
		return $dir;
	}
	private function getPath() {
		if (!$this->path) {
			$this->path = $this->getDirectory() . DIRECTORY_SEPARATOR . $this->name . '.obj';
		}
		return $this->path;
	}
	private function writeStructureIfNecessary() {
		if ($this->test->useSOAP AND $this->call) {
			$this->write($this->test->getLBFake()->call($this->call));
		}
	}
	private function checkFileExists() {
		if (!file_exists($this->getPath())) throw new Exception($this->getPath() . ' is not exists');
	}
	public function getStructure() {
		$path = $this->getPath($this->name);
		$this->writeStructureIfNecessary();
		$this->checkFileExists();
		$object = file_get_contents($path);
		return unserialize($object);
	}
	
} ?>