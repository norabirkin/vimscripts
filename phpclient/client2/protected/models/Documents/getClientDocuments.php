<?php class getClientDocuments extends LBModel {
	public function rules() {
        return array();
    }
	protected function documentTypeLinks($data) {
		$result = array(
			array('name' => CHtml::link(yii::t('documents','AllTypes'),array(
				'documents/agreements',
				'docid' => 0
		))));
		foreach ($data as $item) {
			$result[] = array('name' => CHtml::link($item->name,array(
				'documents/agreements',
				'docid' => $item->docid
			)));
		}
		return $result;
	}
	protected function getParams($type = 'default') {
		$types =  array('default' => array('flt' => array())); 
		return $types[$type];
	}
} ?>