<?php class ServicesDataReader extends CApplicationComponent {
	private $VGroupData = array();
	private $assignedServices = array();
	private $availableServices = array();
	private $agreementBalance = array();
	public $common = 1;
	public function GetTarifID($vgid) {
		return $this->GetVGroupData($vgid)->vgroup->tarifid;
	}
	public function GetVGroupData($vgid) {
		if (!$this->VGroupData[$vgid]) $this->VGroupData[$vgid] = yii::app()->controller->lanbilling->getItem('getClientVgroups',array('flt' => array('vgid' => $vgid)));
		return $this->VGroupData[$vgid];
	}
	public function GetAgreementByVGroupID($vgid) {
		$agreements = yii::app()->controller->lanbilling->agreements;
		$agreementID = $this->GetVGroupData($vgid)->vgroup->agrmid;
		return $agreements[$agreementID];
	}
	public function GetTotalBalance($vgid) {
		if(!$this->agreementBalance[$vgid]) {
			$agreement = $this->GetAgreementByVGroupID($vgid);
			$this->agreementBalance[$vgid] = $agreement->balance + $agreement->credit;
		}
		return $this->agreementBalance[$vgid];
	}
	private function CheckBalance($serviceData) {
		$totalBalance = $this->GetTotalBalance($serviceData->vgid);
		if ($serviceData->above > $totalBalance) return 0;
		else return 1;
	}
	public function GetAllServices($vgid) {
		return array_merge($this->GetAssignedServices($vgid),$this->GetAvailableServices($vgid));
	}
	public function GetService($vgid,$catidx) {
		return $this->FindServiceByCatidx($this->GetAllServices($vgid), $catidx);
	}
	private function FindServiceByCatidx($serviceData,$catidx) {
		foreach ($serviceData as $item) {
			if ($item->catidx == $catidx) return $item;
		}
		return false;
	}
	private function MergeServicesData($servicesData1,$servicesData2,$assigned) {
		foreach ($servicesData1 as $k => $servicesData1Item) {
			$servicesData2Item = $this->FindServiceByCatidx($servicesData2, $servicesData1Item->catidx);
			$servicesData1[$k]->descrfull = $servicesData2Item->descrfull;
			$servicesData1[$k]->link = $servicesData2Item->link;
			$servicesData1[$k]->dtvtype = $servicesData2Item->dtvtype;
			$servicesData1[$k]->checkbalance = $this->CheckBalance($servicesData1Item);
			$servicesData1[$k]->assigned = $assigned;
		}
		return $servicesData1;
	}
	private function GetServices($vgid,$needcalc = 0) {
		$servicesData1 = yii::app()->controller->lanbilling->getRows('getVgroupServices',array(
			'flt' => array(
            	'vgid' => $vgid,
            	'common' => $this->common,
            	'unavail' => -1,
            	'needcalc' => $needcalc, 
            	'defaultonly' => 1
        	)
		));
		if (!$servicesData1) return $servicesData1;
		$servicesData2 = yii::app()->controller->lanbilling->getRows("getTarCategories", array("id" => $this->GetTarifID($vgid)));
		$servicesData = $this->MergeServicesData($servicesData1,$servicesData2,$needcalc);
		return $servicesData;
	}
	public function GetAssignedService($vgid,$servid) {
		foreach ($this->GetAssignedServices($vgid) as $service) {
			if ($service->servid == $servid) return $service;
		}
		return false;
	}
	public function GetAvailableServices($vgid) {
		if (!$this->availableServices[$vgid]) $this->availableServices[$vgid] = $this->GetServices($vgid);
		return $this->availableServices[$vgid];
	}
	public function GetAssignedServices($vgid) {
		if (!$this->assignedServices[$vgid]) $this->assignedServices[$vgid] = $this->GetServices($vgid, 1);
		return $this->assignedServices[$vgid];
	}
} ?>
