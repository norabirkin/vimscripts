<?php class RentSoftAdminAPI extends CApplicationComponent {
	private $lanbilling_admin;
	private $lanbilling_login_password;
	private $secret;
	private $RsAg_Processor = NULL;
	private $RsAg_Processor_config = array();
	private $log_all = false;
	private $client2Config = array();
	private $client2BasePath;
	const CONFIG_ARRAY_PATH = "modules.RentSoft.components.rentsoft";
	
	public function LoadConfig() {
		$this->lanbilling_admin = $this->getConfigParam('lanbilling_admin');
		$this->lanbilling_login_password = $this->getConfigParam('lanbilling_login_password');
		$this->secret = $this->getConfigParam('secret');
		$this->log_all = $this->getConfigParam('log_all');
		$this->RsAg_Processor_config = array(
			'only_agent_ids' => $this->getConfigParam('only_agent_ids'),
			'min_balance_allowed' => $this->getConfigParam('min_balance_allowed'),
			'lanbilling_tarif_id' => $this->getConfigParam('lanbilling_tarif_id'),
			'usbox_agent_id' => $this->getConfigParam('usbox_agent_id')
		);
	}
	private function getConfigParam($paramName) {
		return $this->GetArrayItemByPath(self::CONFIG_ARRAY_PATH.'.'.$paramName, $this->GetClient2Config());
	}
	public function RequireRentsoftMainClass() {
		$this->RequireByPathRelativeToClient2('protected/modules/RentSoft/components/Rentsoft.php');
	}
	private function GetClient2Config() {
		if (!$this->client2Config) {
			$this->client2Config = $this->RequireByPathRelativeToClient2('protected/config/lanbilling.config.php');
		}
		return $this->client2Config;
	}
	private function GetArrayItemByPath($path,$array) {
		$path = explode('.', $path);
		$item = $array;
		foreach ($path as $key) {
			if (isset($item[$key])) $item = $item[$key];
			else return NULL;
		}
		return $item;
	}
	public function SetAuthorizationPostData() {
		list ($_POST['login'], $_POST['password']) = explode(":", $this->lanbilling_login_password);
		// Set single session for all requests to economize php sessions.
		// We also disable caching to make this session smaller.
		@define("SOAP_RESPONSE_CACHE", false);
		@session_id('rs' . md5(SECRET)); // do not use "_" here!
	}
	public function LoadLanbillingAdminMainClass() {
		require_once($this->lanbilling_admin . DIRECTORY_SEPARATOR . "soap.class.php");
		require_once($this->lanbilling_admin . DIRECTORY_SEPARATOR . "main.class.php");
		yii::import('ext.LANBillingAdmin');
		$this->RsAg_Processor_config['lanbilling'] = new LANBillingAdmin($this->lanbilling_admin);
	}
	private function GetRsAg_Processor() {
		if (!$this->RsAg_Processor) $this->RsAg_Processor = new RsAg_Processor($this->RsAg_Processor_config);
		return $this->RsAg_Processor;
	}
	private function log($var,$category = 'rentsoft.log') {
		if (is_scalar($var)) $entry = $var;
		else {
			ob_start();
			print_r($var);
			$entry = ob_get_contents();
			ob_end_clean();
		}
		yii::log($entry,'info',$category);
	}
	private function GetInput() {
		if ($this->log_all) {
			$this->log($_REQUEST,'rentsoft.'.$_GET['method'].'|REQUEST');
		}
		$input = array();
		foreach (($_POST+$_GET) as $k => $v) {
    		if (preg_match('/^(.*?)(\d+)$/s', $k, $m)) {
                if (!isset($input[$m[2]])) {
                    $input[$m[2]] = new stdclass();
                }
                $input[$m[2]]->$m[1] = $v;
    		}
		}
		return $input;
	}
	public function CheckAccess() {
		if ($this->secret != $_GET['apikey']) return false;
		return true;
	}
	public function RunMethod($methodName) {
		if (!$methodName || !is_callable(array($this->GetRsAg_Processor(), $methodName))) throw new Exception("Invalid method: $methodName");
		$input = $this->GetInput();
		return $this->GetRsAg_Processor()->$methodName($input);	
	}
	private function RequireByPathRelativeToClient2($path) {
		$path = str_replace('\\', DIRECTORY_SEPARATOR, $path);
		$path = str_replace('/', DIRECTORY_SEPARATOR, $path);
		if ($path[0] == DIRECTORY_SEPARATOR) $path = substr($path, 1);
		$base = $this->GetClient2BasePath();
		return require_once($base.DIRECTORY_SEPARATOR.$path);
	}
	private function GetClient2BasePath() {
		if (!$this->client2BasePath) {
			$s = DIRECTORY_SEPARATOR;
			$b = DIRECTORY_SEPARATOR . '..';
			$path = dirname(__FILE__);
			$path = $path.$b.$b.$b.$s;
			$this->client2BasePath = realpath($path);
		}
		return $this->client2BasePath;
	}
	public function writeResponse($output) {
		$response = '';
		foreach ($output as $i => $row) {
    		foreach ($row as $k => $v) {
        		$response .= "{$k}{$i}={$v}\n";
    		}
		}
		if ($this->log_all) {
			$log_response = '

'.$response;
			$this->log($log_response,'rentsoft.'.$_GET['method'].'|RESPONSE');
		}
		return $response;
	}
	public function Logout() {
		$this->GetRsAg_Processor()->logout();
	}
} ?>