<?php class SelectedTVChannelsGrid extends TVPackagesGrid {
	protected $displayIfNoData = false;
	protected $catidxList = array();
	public function SetCatidxList($catidxList) {
		if (is_array($catidxList)) $this->catidxList = $catidxList;
	}
	public function SetParams($params) {
			$this->SetVgid($params['vgid']);
			$this->SetCatidxList($params['catidxList']);
	}
	private function GetSelectedChannelsRawData() {
		return array_merge(
			yii::app()->controller->getModule()->TVChannelsToAssignGrid->GetRawData(),
			yii::app()->controller->getModule()->TVChannelsToStopGrid->GetRawData()
		);
	}
	public function GetTVChannelsToUpdateHiddenFields() {
		return yii::app()->controller->getModule()->TVChannelsToUpdateHiddenFields->Output($this->GetSelectedChannelsRawData());
	}
	protected function AddExtraColumns($row, $data) {
		return array(
			'ChannelName' => $row['ChannelName'],
			'Description' => $row['Description'],
			'Above' => $row['Above'],
			'State' => $this->GetState($data)
		);
	}
	protected function ServiceIsChecked($service) {
		return (in_array($service->catidx, $this->catidxList));
	}
} ?>