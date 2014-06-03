<?php class TVChannelsToStopGrid extends SelectedTVChannelsGrid {
	protected $title = 'ChannelsToUnsubscribeList';
	protected function GetServices() {
		return yii::app()->ServicesDataReader->GetAssignedServices($this->vgid);
	}
	protected function ServiceIsProper($service) {
		return 	$this->ServiceIsChannel($service) AND
			$this->ServiceIsNotBindedToServiceFunction($service) AND
			$this->ServiceIsNotMobility($service) AND
			!$this->ServiceIsChecked($service);
	}
} ?>
