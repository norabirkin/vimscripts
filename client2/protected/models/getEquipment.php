<?php class getEquipment extends LBModel {
	public $agrmid;
	public $equipid;
	public $cardid;
	protected function getMobility() {
		return yii::app()->controller->getModule()->equipment->getMobility( $this->cardid );
	}
	public function allowJoin() {
		return yii::app()->controller->getModule()->equipment->allowJoin( $this->cardid );
	}
	protected function getParams($type = 'default') {
		return array();
	}
	public function selectEquipment($item) {
		return $item->equipment->equipid == $this->equipid;
	}
	protected function processEquipmentItem($item) {
		return array(
			'equipid' => $item->equipment->equipid,
			'modelname' => $item->modelname,
			'serial' => $item->equipment->serial,
			'name' => $item->equipment->name,
			'agrmnum' => $item->agrmnum,
			'description' => trim($item->equipment->descr),
			"mac" => $item->equipment->mac,
			"chipid" => $item->equipment->chipid,
			'price' => $this->getPrice($item)
		);
	}
	protected function countEquipmentSmartCard($data) {
		$result = array();
		foreach ($data as $item) {
			if ($item->equipment->cardid == $this->cardid) {
				$result[] = true;
			}
		}
		return $result;
	}
	protected function getPrice($item) {
		$servicesDataReader = new ServicesDataReader;
		$servicesDataReader->common = -1;
		if ($service = $servicesDataReader->GetAssignedService($item->vgid,$item->equipment->servid)) {
			return Yii::app()->NumberFormatter->formatCurrency($service->above, Yii::app()->params["currency"]);
		} else return '';
	}
	protected function equipmentSmartCard($data) {
		$result = array();
		foreach ($data as $item) {
			if ($item->equipment->cardid == $this->cardid) {
				$processed = $this->processEquipmentItem($item);
				$processed['description'] = '<span id="editable-value-equipment-desc-'.$processed['equipid'].'">'.$processed['description'].'</span>'.setCardEquipment::descEditWidget($processed['equipid']);
				$processed['action'] = $this->getLink(yii::t('DTVModule.equipment','Detach'),'/DTV/Equipment/DetachEquipment',array(
					'equipid' => $processed['equipid']
				), 'get', array( 'confirm' => yii::t('DTVModule.equipment','DetachConfirm',array( '{equipment}' => $item->equipment->name )) ));
				$result[] = $processed;
			}
		}
		return $result;
	}
	protected function equipmentList($data) {
		$result = array();
		foreach ($data as $item) {
			if (!$item->equipment->cardid AND $item->equipment->agrmid == $this->agrmid) {
				$processed = $this->processEquipmentItem($item);
				$processed['connect'] = $this->getLink(yii::t('DTVModule.equipment','Attach'), '/DTV/Equipment/JoinRequest', array(
					'cardid' => yii::app()->request->getParam('smartcard'),
					'equipid' => $item->equipment->equipid
				));
				$result[] = $processed;
			}
		}
		return $result;
	}
} ?>
