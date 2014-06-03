<?php class TVChannelsToAssignGrid extends SelectedTVChannelsGrid {
	protected $title = 'ChannelsToAddList';
	private $totalAmount;
	protected function GetServices() {
		return yii::app()->ServicesDataReader->GetAvailableServices($this->vgid);
	}
	protected function ServiceIsProper($service) {
		return 	$this->ServiceIsChannel($service) AND
			$this->ServiceIsNotBindedToServiceFunction($service) AND
			$this->ServiceIsNotMobility($service) AND
			$this->ServiceIsChecked($service);
	}
	protected function GetTotalAmount() {
		if (!$this->totalAmount) {
			$this->totalAmount = 0;
			foreach ($this->GetRawData() as $service) {
				$this->totalAmount += $service->above;
			}
		}
		return $this->totalAmount;
	}
	protected function GetTotalBalance() {
		return yii::app()->ServicesDataReader->GetTotalBalance(yii::app()->request->getParam('vgid',0));
	}
	public function CheckBalance() {
		return ($this->GetTotalAmount() <= $this->GetTotalBalance());
	}
	protected function GetFooter() {
		return array(
			'ChannelName' => yii::t('DTVModule.smartcards','Total') . ':',
			'Description' => '',
			'Above' => Yii::app()->NumberFormatter->formatCurrency($this->GetTotalAmount(),Yii::app()->params["currency"]),
			'State' => ''
		);
	}
} ?>
