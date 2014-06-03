<?php class UsageInfo extends CWidget {
	
	public function run() {
		if (!Yii::app()->params['showUsageInfo']) return;
		$this->render( "UsageInfo", array(
			'memory' => round(Yii::getLogger()->memoryUsage/1024/1024, 3),
			'time' => round(Yii::getLogger()->executionTime, 3)			
		));
	}	

} ?>
