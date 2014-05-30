<?php class Additional {
	private $agreements = array();
	private $categories = array();

	private function servicesApiRequest($vgid, $needcalc) {
		return	yii::app()->lanbilling->getRows('getVgroupServices',array(
			'flt' => array(
				'vgid' => $vgid,
				'common' => -1,
				'unavail' => -1,
				'needcalc' => $needcalc, 
				'defaultonly' => 1
			)
		));
	}

	private function isVAS($serv) {
		if ($serv["data2"]->dtvtype == 3) return true;
		else return false;
	}

	private function getServices( $vgroup, $needcalc ) {
		$result = array();
		foreach ($this->servicesApiRequest( $vgroup->vgroup->vgid, $needcalc ) as $item) {
			if (!$item->available) continue;
			$serv = array(
				"data1" => $item,
				"data2" => $this->getCategory($vgroup->vgroup->tarifid, $item->catidx)
			);
			if ($this->isVAS($serv)) $result[] = $serv;
		}
		return $result;
	}

	public function getCategory($tarid, $catidx) {
		$categories = $this->getCategories($tarid);
		$cat = $categories[$catidx];
		if (!$cat) throw new Exception(yii::t("DTVModule.additional","CategoryNotFound"));
		return $cat;
	}

	private function getCategories($id) {
		if (!isset($this->categories[$id])) {
			$this->categories[$id] = array();
			foreach( yii::app()->lanbilling->getRows("getTarCategories", array("id" => $id)) as $category ) $this->categories[$id][$category->catidx] = $category;
		}
		return $this->categories[$id];
	}

	public function getVGData($id) {
		if (!($result = yii::app()->lanbilling->getItem("getClientVgroups", array("flt" => array("vgid" => $id))))) throw new Exception(yii::t("DTVModule.additional","VgroupNotFound"));
		return $result;
	}

	public function getAssignedServices( $vgroup ) {
		return $this->getServices( $vgroup, 1 );
	}

	public function getAvailableServices( $vgroup ) {
		return $this->getServices( $vgroup, 0 );
	}

	private function processVgroup($vgroup) {
		if ($vgroup->vgroup->tariftype != 5) return;

		$assigned = $this->getAssignedServices($vgroup);
		$available = $this->getAvailableServices($vgroup);

		if ($assigned OR $available) {
			if (!isset($this->agreements[$vgroup->vgroup->agrmid])) $this->agreements[$vgroup->vgroup->agrmid] = array(
				"number" => yii::app()->lanbilling->agreements[$vgroup->vgroup->agrmid]->number,
				"vgroups" => array()
			);

			$this->agreements[$vgroup->vgroup->agrmid]["vgroups"][] = array( 
				"vgroup_data" => $vgroup,
				"services" => array(
					"assigned" => $assigned,
					"available" => $available
				)
			);
		}
	}

	public function getData() {
		if (!$this->agreements) foreach (yii::app()->lanbilling->getRows('getClientVgroups') as $vgroup) $this->processVgroup($vgroup);
		return $this->agreements;
	}
} ?>
