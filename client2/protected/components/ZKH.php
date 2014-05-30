<?php class ZKH {
	
	private $vgroups = array();
	
	function __construct() {
		$this->traverseUSBoxVGroups();
	}
	
	private function traverseUSBoxVGroups() {
		foreach ( yii::app()->controller->lanbilling->getRows("getClientVgroups") as $item ) {
			if($item->vgroup->tariftype == 5) $this->addVGroup($item);
		}
	}
	
	private function addVGroup($vgroup) {
		if (!( $services = $this->getZkhServices($vgroup->vgroup) )) return;
		
		$vgroupData = array(
			"login" => $vgroup->vgroup->login ? $vgroup->vgroup->login : yii::t('ZKH','NoLogin'),
			'services' => $services
		);
		if ($serial = self::getDeviceSerial($vgroup)) $vgroupData["serial"] = $serial;
		$this->vgroups[] = $vgroupData;
	}
	
	public static function isValidZkhCategory($category) {
		return (preg_match(yii::app()->params["zkhCategoryPrefix"], $category->uuid) AND $category->common == 0);
	}
	
	private function getZkhServices($vgroup) {
		$services = array();
		foreach ( yii::app()->controller->lanbilling->getRows("getTarCategories", array("id" => $vgroup->tarifid)) as $item ) {
			if (self::isValidZkhCategory($item)) {
				$services[] = array(
					"catidx" => $item->catidx,
					"vgid" => $vgroup->vgid,
					"descr" => $item->descr,
					"above" => $item->above
				);
			}
		}
		return $services;
	}
	
	public static function getDeviceSerial($vgroup) {
		if (!isset($vgroup->addons)) return false;
		if(!is_array($vgroup->addons)) $vgroup->addons = array($vgroup->addons);
		foreach($vgroup->addons as $addon) {
			if(yii::app()->params["zkhSerialNumber"] == $addon->name) return $addon->strvalue;
		}
		return false;
	}
	
	public function getVGroups() {
		return $this->vgroups;
	}
	
} ?>