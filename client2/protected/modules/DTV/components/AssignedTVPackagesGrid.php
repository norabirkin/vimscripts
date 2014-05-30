<?php class AssignedTVPackagesGrid extends TVPackagesGrid {
	protected $title = 'ActiveChannels';
	protected function AddExtraColumns( $row, $service ) {
		return $this->AddBlockedMessage( $row, $service );
	}
	protected function GetServices() {
		return yii::app()->ServicesDataReader->GetAssignedServices($this->vgid);
	}
	protected function GetActionUrl($service) {
		return CHtml::link(
			Yii::t('DTVModule.smartcards', 'Unsubscribe'),
			array(
				"/DTV/Smartcards/UnsubscribeTVPackage",
				"tab" => Yii::app()->request->getParam("tab", 0),
				"vgid"=> $service->vgid,
				"catidx"=>$service->catidx,
				"servid"=>$service->servid
			),
			array(
				'confirm' => yii::t('DTVModule.smartcards','UnsubscribeConfirm',array(
					'{catdescr}' => $data["catdescr"]
				)),
				'class' => 'red_fragment'
			)
		);
	}
} ?>
