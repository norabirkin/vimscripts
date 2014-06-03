<?php class DocumentsAgreements {
    public function agreements_list() {
    	$result = array();
		$i = 0;
		foreach (yii::app()->controller->lanbilling->agreements as $item) {
			$result[] = array(
				'id' => $i,
				'number' => CHtml::link($item->number,array('documents','agrmid' => $item->agrmid)),
				'balance' => Yii::app()->NumberFormatter->formatCurrency($item->balance, Yii::app()->params["currency"]),
			);
			$i ++;
		}
        return $result;
    }
} ?>