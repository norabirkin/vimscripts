<?php class AvailableTVPackagesGrid extends TVPackagesGrid {
	protected $title = 'NotConnectedChannels';
	protected function GetServices() {
		return yii::app()->ServicesDataReader->GetAvailableServices($this->vgid);
	}
	protected function GetLowBalanceMessage() {
		return "<em>".yii::t('DTVModule.smartcards','LowBalance')."</em>";
	}
	protected function GetActionUrl($service) {
		if (!$service->checkbalance) return $this->GetLowBalanceMessage();
        return CHtml::link(
        	Yii::t('DTVModule.smartcards', 'Subscribe'), 
        	array(
        		"/DTV/Smartcards/AssignTVPackage",
            	"tab" => Yii::app()->request->getParam("tab",0),
            	"vgid" => $service->vgid,
            	"catidx" => $service->catidx,
            	"servid" => $service->servid
			),
			array(
                'confirm' => yii::t('DTVModule.smartcards', 'SubscribeConfirm', array(
                    '{above}' => Yii::app()->NumberFormatter->formatCurrency($service->above, "RUB"),
                    '{catdescr}' => $service->catdescr
				))
            )
        );
	}
} ?>
