<?php class setCardEquipment extends LBModel {
	public $equipid;
	public $cardid = NULL;
	public $descr = NULL;
	public $equipment_data = NULL;
	public function rules() {
		return array(
			array('equipid, cardid','numerical'),
			array('equipid','required'),
			array('cardid','mobilityCheck', 'on' => 'joinEquipment'),
			array('cardid','required', 'on' => 'joinEquipment,detachEquipment'),
			array('equipid','notBinded', 'on' => 'joinEquipment,detachEquipment'),
			array('equipid','equipmentExists')
		);
	}
	static public function descEditWidget($equipid) {
		return yii::app()->controller->widget(
        	"ext.LB.widgets.Edit",
            array(
            	"id"=>"equipment-desc-".$equipid,
                "route"=>"editform/updateequipmentdescription",
                "data"=>array(
                	"id"=>$equipid
                )
            ),
            true
        );
	}
	public function mobilityCheck() {
		$model = new getEquipment;
		$model->cardid = $this->cardid;
		if (!$model->allowJoin()) $this->addError('cardid', 'Достигнуто предельное число подключенного к смарт-карте оборудования');
	}
	public function getEquipmentData() {
		if (!$this->equipment_data) {
			$model = new getEquipment;
			$model->equipid = $this->equipid;
			$this->equipment_data = $model->getItem('selectEquipment');
		}
		return $this->equipment_data;
	}
	public function equipmentExists() {
		$equipment = $this->getEquipmentData();
		if (!$equipment) $this->addError('equipid', 'Оборудование не найдено');
	}
	public function notBinded() {
		$equipment = $this->getEquipmentData();
		if ($equipment->cardid) $this->addError('equipid', 'Оборудование уже привязано к смарткарте');
	}
	protected function GetEquipmentArray() {
		$equipmentFull = $this->getEquipmentData();
		$equipmentArray = array();
		foreach ($equipmentFull->equipment as $k => $v) {
			$equipmentArray[$k] = $v;
		}
		return $equipmentArray;
	}
	protected function getParams($type = 'default') {
		$params = $this->GetEquipmentArray();
		if ($this->descr !== NULL) $params['descr'] = $this->descr;
		if ($this->cardid !== NULL) $params['cardid'] = $this->cardid;
		return $params;
	}
} ?>
