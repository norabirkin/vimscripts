<?php class ZKHRegistration {
	
	private $vgid;
	private $catidx;
	private $VGroupData;
	
	public function setVGroupID($vgid) {
		$this->vgid = (int) $vgid;
		return $this;
	}
	
	public function setCategoryID($catidx) {
		$this->catidx = (int) $catidx;
		return $this;
	}
	
	private function getUsboxServicesSoapRequest() {
		return yii::app()->controller->lanbilling->getRows("getUsboxServices", 
			array("flt" => array(
				"vgid" => $this->vgid,
				"common" => 0
			))
		);
	}
	
	public function orderByTimeFrom($a, $b) {
		if ($a->timestamp > $b->timestamp) return 1;
		elseif ($a->timestamp == $b->timestamp) return 0;
		elseif ($a->timestamp < $b->timestamp) return -1;
	}
	
	private function getCategoryServices() {
		$data = array();
		foreach ($this->getUsboxServicesSoapRequest() as $item) {
			if( $item->service->catidx == $this->catidx ) {
				$item->timestamp = strtotime($item->service->timefrom);
				$data[] = $item;
			}
		}
		return $data;
	}
	
	private function getLastAssignedZKHService() {		
		if (!$data = $this->getCategoryServices()) return NULL;
		usort($data, array($this, 'orderByTimeFrom'));
		$data = array_reverse($data);
		return $data[0];
	}
	
	public function getVGroupData() {
		if (!$this->VGroupData) $this->VGroupData = yii::app()->controller->lanbilling->getItem("getClientVgroups", 
			array('flt' => array(
				'vgid' => $this->vgid
			))
		);
		return $this->VGroupData;
	}
	
	private function getCategoryData() {
		if (!$vgroup = $this->getVGroupData()) return NULL;
		foreach( yii::app()->controller->lanbilling->getRows("getTarCategories", array("id" => $vgroup->vgroup->tarifid)) as $item ) {
			if ($item->catidx == $this->catidx AND ZKH::isValidZkhCategory($item)) return $item;
		}
		return NULL;
	}
	
	public function getRegistration() {
		if (!$categoryData = $this->getCategoryData()) return NULL;
		$service = $this->getLastAssignedZKHService();
		
		return array(
			"device" => $this->getVGroupData()->vgroup->login,
			"serial" => ZKH::getDeviceSerial($this->getVGroupData()),
			"lastvalue" => !empty($service) ? (((integer)trim($service->service->externaldata) <= 0) ? 0 : (integer)trim($service->service->externaldata)) : "",
			"lastdate" => !empty($service) ? $service->service->timefrom : "",
			"cost" => !empty($service) ? (float)$service->catabove : $categoryData->above,
			"sum" => 0,
			"servicename" => !empty($service) ? $service->catdescr : $categoryData->descr,
		);
	}
	
} ?>