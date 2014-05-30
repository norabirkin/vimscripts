<?php class LBTestCase extends CTestCase {
	
	private $lbfake;
	public $useSOAP = false;
	
	protected function getLBFake() {
		if (!$this->lbfake) {
			$this->setLBFake();
			$this->lbfake = yii::app()->controller->lanbilling;
		}
		return $this->lbfake;
	}
	
	protected function getController($controller) {
		$controllerClass = ucfirst($controller).'Controller';
		yii::import('application.controllers.' . $controllerClass);
		return new $controllerClass($controller);
	}
	
	protected function runAction($controller, $action) {
		$actionMethod = 'action' . ucfirst($action);
		$controller->$actionMethod();
	}
	
	protected function getRenderedPage($controller, $action) {
		$this->setBasePaths();
		ob_start();		
		$this->runAction($controller, $action);
		$rendered = ob_get_contents();
		ob_end_clean();
		return $rendered;
	}
	
	public function log($message) {
		$this->getLBFake()->log($message);
	}
	public function logOutput() {
		$this->getLBFake()->logOutput();
	}
	
	protected function getStub($config) {
		$stub = $this->getMock($config['class'],array_keys($config['methods']), array(), $config['class'] . 'Stub', false);
		foreach($config['methods'] as $k => $v) $stub->expects($this->any())->method($k)->will($this->returnValue($this->getExpected($v)));
		return $stub;
	}
	
	protected function setBasePaths() {
		yii::app()->getThemeManager()->setBasePath('/home/anshakov/workspace/client2/themes');
		yii::app()->getAssetManager()->setBasePath('/home/anshakov/workspace/client2/assets');
	}
	
	protected function setLBFake() {
		yii::import('application.controllers.SiteController');
		yii::app()->controller = new SiteController('site');
		yii::app()->controller->lanbilling = $this->lbfake = new LBFake($this);
	}
	
	public function soapOn($login, $password) {
		$this->getLBFake()->soapOn($login, $password);
	}
	
	public function soapOff() {
		$this->getLBFake()->soapOff();
	}
	
	public function writeExpected($name, $structure) {
		$this->getLBFake()->writeExpected($name, $structure);
	}
	public function writeFixture($name, $structure) {
		$this->getLBFake()->writeFixture($name, $structure);
	}
	public function getFixture($name) {
		return $this->getLBFake()->getFixture($name);
	}
	public function getExpected($name) {
		return $this->getLBFake()->getExpected($name);
	}
	
} ?>