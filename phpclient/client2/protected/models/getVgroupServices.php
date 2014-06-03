<?php class getVgroupServices extends LBModel {
	public $applied = 0;
	public $vgid;
	protected function getParams($type = 'default') {
		return array(
			'flt' => array(
				'vgid' => $this->vgid,
				'common' => -1,
                'unavail' => -1, 
				'needcalc' => $this->applied,
				'defaultonly' => 1
			)
		);
	}
	protected function selectMobility($item) {
		return $item->uuid != '' AND $item->uuid == Yii::app()->controller->lanbilling->getOption("smartcard_usbox_tag");
	}
} ?>
