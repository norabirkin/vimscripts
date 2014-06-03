<?php
/**
 * Service data model
 */
class ServiceForm extends CFormModel {

	public function rules() {
		return array(
		);
	}

	public function attributeLabels() {
		return array(
			'sbss_class'  => Yii::t('support', 'Request class'),
		);
	}






	/**
	 * Get vgroups information about its tarif scheduling
	 */
	public function getVgroupScheduling()
	{
		//Dumper::dump(Yii::app()->controller->lanbilling->client);
		//if( false != ($result = Yii::app()->controller->lanbilling->get("getClientVgroups", array("id" => Yii::app()->controller->lanbilling->client))) )
		//{
		//	if(!empty($result))
		//	{
		//		if(!is_array($result)) {
		//			$result = array($result);
		//		}
		//
		//		foreach($result as $item) {
		//			if($item->vgroup->vgid == (integer)$_POST['getschedule']) {
		//				$_accVg = $item;
		//				break;
		//			}
		//		}
		//	}
		//}
		//
		//$_tmp = array();
		//if(isset($_accVg) && isset($_accVg->tarrasp)) {
		//	if(!is_array($_accVg->tarrasp)) {
		//		$_accVg->tarrasp = array($_accVg->tarrasp);
		//	}
		//
		//	array_walk($_accVg->tarrasp, create_function('&$val, $key, $_tmp', '$_tmp[0][] = array("changetime" => $val->changetime, "requestby" => ($val->requestby == "null") ? -1 : $val->requestby, "tarnewname" => $val->tarnewname, "recordid" => $val->recordid);'), array(&$_tmp));
		//}
		//
		//if(sizeof($_tmp) > 0) {
		//	echo '({ "results": ' . $lanbilling->JEncode($_tmp, $lanbilling) . '})';
		//}
		//else echo '({ "results": "" })';
	} // end getVgroupScheduling()









}
