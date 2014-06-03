<?php class ArrearsFrontpageMessage {
	
	public function setArrearsFlash() {
		if ( !yii::app()->params["showArrearsMessage"] ) return;
		if ($message = $this->getArrearsMessage()) yii::app()->user->setFlash('error', $message);
	}
	
	public function getArrearsMessage() {
		$arrears = 0;
		if(!yii::app()->controller->lanbilling->agreements) return false;
		foreach (yii::app()->controller->lanbilling->agreements as $item) {
			$arrears += $item->credit;
		} 
		if (!$arrears) return false;
		else return yii::t('main', 'Credit', array('{arrears}' => Yii::app()->NumberFormatter->formatCurrency($arrears, Yii::app()->params["currency"])));
	}
	
} ?>
