<?php class RentSoftClientAPI extends CApplicationComponent {
	public $lanbilling_admin;
	public $lanbilling_login_password;
	public $secret;
	public $ag_name;
	public $lanbilling_tarif_id;
	public $usbox_agent_id;
	public $min_balance_allowed;
	public $api_url;
	public $dev_domain_suffix;
	public $agrmid;
	public $current_url;
	public $width;
	public $only_agent_ids;
	public $allow_for_account_types;
	public $rs_uri;
	public $height;
	public $log_all = false;
	protected $lanbilling;
	protected $agreementsList = NULL;
	public function checkAccess() { // called from outside too
		$account_type = yii::app()->controller->lanbilling->clientInfo->account->type;
		if ($this->allow_for_account_types AND !in_array($account_type, $this->allow_for_account_types)) return false;
		return true;
	}
	public function init() {
		$this->current_url = ($_SERVER['SERVER_PORT'] == 443 ? "https" : "http") . "://" . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
		$this->setApiUrl();
		if (!$this->width) $this->width = '100%';
	}
	private function setApiUrl() {
		if ( $this->api_url ) return;
		if (strpos( $this->current_url, "index.php" )) $ex = explode( "index.php" , $this->current_url );
		elseif ( strpos( $this->current_url, "/?" ) ) $ex = explode( "?" , $this->current_url );
		else {
			$ex = explode( "?" , $this->current_url );
			$ex[ 0 ] .= DIRECTORY_SEPARATOR;
		}
		$this->api_url = $ex[0] . "rentsoft";
	}
	public function getAgreementsList() {
		if (!$this->checkAccess()) return array();
		if($this->agreementsList === NULL) {
			$agreements = yii::app()->controller->lanbilling->agreements;
			$data = array();
			foreach ($agreements as $id => $agreement) {
				if($this->agreementHasInternet($id)) $data[$id] = $agreement->number;
			}
			$this->agreementsList = $data;
		}
		if (!$this->agreementsList) throw new Exception('No agreements');
		return $this->agreementsList;
	}
	public function getRentSoftOfAgreementUrls() {
		$locations = array();
		foreach($this->getAgreementsList() as $k => $v) $locations[] = "'" . $k . "':'http://" . $_SERVER['HTTP_HOST'] . yii::app()->controller->createUrl('default/index',array('agrmid' => $k)) . "'"; 
		return implode(',',$locations);
	}
	public function getFirstAgreementId() {
		$agreementIDs = array_keys($this->getAgreementsList());
		return $agreementIDs[0];
	}
	public function getAgreementIdFromCookie() {
		return $_COOKIE["agrm_".yii::app()->controller->lanbilling->client];
	}
	public function setAgrmid($agrmid) {
		if($agrmid) $this->agrmid = $agrmid;
		elseif($agrmid = $this->getAgreementIdFromCookie()) $this->agrmid = $agrmid;
		if (!$this->agrmid OR !$this->agreementHasInternet($this->agrmid)) $this->agrmid = $this->getFirstAgreementId();
		if (!in_array($this->agrmid, array_keys($this->getAgreementsList()))) {
			// User MUST see the meaning of this error, but not only a blank page.
			die("Access denied: this agrmid does not belong to the current user!");
		}
		setcookie ("agrm_".yii::app()->controller->lanbilling->client, $this->agrmid, time()+3600*24*365*2);
	}
	public function getAgreementsDropdownList() {
		$data = $this->getAgreementsList();
		$selectedValue = $this->agrmid;
		$name = 'agrmid';
		return CHtml::dropDownList($name, $selectedValue, $data, array(
			'style' => 'width:auto;',
			'id' => 'rentsoftAgreementsList'
		));
	}
	protected function agreementHasInternet($agrmid = 0) {
		$vgroups = $this->soapRequest(
			'getClientVgroups',
			array('flt' => array(
				'agrmid' => $agrmid
			)
		));
		// Balance should NOT be checked here, else "Antiviruses" item
		// in the left menu disappears on negative balance and user cannot
		// see his subscriptions details.
		//$balance = yii::app()->controller->lanbilling->agreements[$agrmid]->balance;
		//if ($balance < $this->min_balance_allowed) return false;
		foreach($vgroups as $item) {
			// VGroup blocking should not cause disappearing of "Antivirus" link
			// in the left menu.
			//if($item->vgroup->blocked > 0) continue;
			if($this->only_agent_ids AND in_array($item->vgroup->agentid, $this->only_agent_ids)) return true;
			if(!$this->only_agent_ids AND $item->vgroup->tariftype <= 2) return true;
		}
		return false;
	}
	protected function createUrl($params) {
		$result = array();
		foreach ($params as $k=>$v) {
			$result[] = urlencode($k).'='.urlencode($v);
		}
		$url = implode('&', $result);
		return $url;
	}
	public function iframe() {
		yii::import('application.modules.RentSoft.components.Rentsoft');
		return Rentsoft::getIframe($this->rs_uri, NULL, $this->ag_name, $this->agrmid, $this->api_url, $this->secret, '', $this->width);
	}
	protected function getAgName() {
		$operid = yii::app()->controller->lanbilling->agreements[$this->agrmid]->operid;
		if (preg_match('/\b' . $operid . ':(.+?)\b/', $this->ag_name, $m)) return $m[1];
		return $this->ag_name;
	}
	protected function soapRequest($functionName,$params) {
		return $this->toArray(yii::app()->controller->lanbilling->get(
			$functionName,
			$params
		));
	}
	protected function toArray($v) {
		if (!$v) return array();
		if (!is_array($v)) return array($v);
		else return $v;	
	}
	public function redirect($routeAndParams) {
		return;
		$controller = new CController('account');
		$controller->redirect($routeAndParams);
	}
} ?>