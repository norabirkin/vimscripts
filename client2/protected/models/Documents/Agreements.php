<?php class Agreements extends LBModel {
	public function rules() { return array(); }
	public function getData($type = 'default') { return yii::app()->controller->lanbilling->agreements; }
	protected function statisticsAgreementsList($data) { return $this->agreementLinks($data, 'statisticsLink'); }
	protected function agreementLinks($data,$linkmethod) {
		$result = array();
		foreach ($data as $item) {
			$result[] = array(
				'number' => $this->$linkmethod($item),
				'balance' => Yii::app()->NumberFormatter->formatCurrency($item->balance, Yii::app()->params["currency"]),
			);
		}
		return $result;
	}
	protected function documentLink($item) {
		return CHtml::link($item->number,array(
					'documents/list',
					'docid' => yii::app()->request->getParam('docid',0),
					'agrmid' => $item->agrmid
		));
	}
	protected function statisticsLink($item) {
		return CHtml::link($item->number,array(
					'statistics/details',
					'type' => yii::app()->request->getParam('type',0),
					'agrmid' => $item->agrmid
		));
	}
	protected function agreementDocumentsLinks($data) { return $this->agreementLinks($data, 'documentLink'); }
	protected function getParams($type = 'default') {}
} ?>