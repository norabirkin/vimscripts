<?php abstract class BaseTabs extends SoapListData {
	protected $tabContentTemplate;
	private $activeTab;
	private $data = array();
	protected function AddTab($tabOptions) {
		$this->data[] = $tabOptions;
	}
	abstract protected function AddData();
	private function __GetData() {
		$data = $this->data;
		$tabsConfig = array();
		$firstIteration = true;
		foreach ($data as $k => $v) {
			if ($firstIteration) $firstTab = $k;
			$firstIteration = false;
			$tabsConfig['tab_'.$k] = array(
            	'title' => '<span>'.$v['title'].'</span>',
            	'url' => yii::app()->createUrl(yii::app()->controller->getRoute(),array_merge($_GET,array('tab' => $k))),
            	'view' => $this->tabContentTemplate,
            	'data' => $v['params']
        	);
			if (isset($_GET['tab']) AND $_GET['tab'] == $k) $this->activeTab = 'tab_'.$k;
		}
		if (!$this->activeTab) $this->activeTab = $firstTab;
		return $tabsConfig;
	}
	protected function GetNoDataMessage() {
		return '';
	}
	public function Render() {
		$this->AddData();
		$data = $this->__GetData();
		if (!$data) return $this->GetNoDataMessage();
		return yii::app()->controller->widget('CTabView', array(
        	'activeTab' => $this->activeTab,
        	'tabs'=> $data
    	),true);
	}
} ?>
