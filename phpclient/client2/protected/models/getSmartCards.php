<?php class getSmartCards extends LBModel {
	public $smartcard;
	protected function getParams($type = 'default') {
		return array();
	}
	static public function descEditWidget($cardid) {
		return yii::app()->controller->widget( "ext.LB.widgets.Edit", array(
        	"id"=>"smartcard-desc-".$cardid,
            "route"=>"editform/updatesmartcarddescription",
            "data"=>array("id"=>$cardid)
		),true);
	} 
	protected function smartcardInfo($data) {
		$result = array();
		foreach ($data as $item) {
			$result[] = array(
				'cardid' => $item->smartcard->cardid,
				'name' => $item->smartcard->name,
				'serial' => $item->smartcard->serial,
				'descr' => $item->smartcard->descr
			);
		}
		return $result;
	}
	protected function selectSmartcard($item) {
		return $item->smartcard->cardid == $this->smartcard;
	}
} ?>
