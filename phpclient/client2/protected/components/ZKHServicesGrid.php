<?php class ZKHServicesGrid extends BaseGrid {
	protected $messagesCategory = 'ZKH';
    protected $usePagination = false;
	protected $title = '';
	protected $services;
	
	public function setServices($services) {
		$this->services = $services;
	}
	protected function AddData() {
		foreach ($this->services as $service) {
			$this->AddRow(array(
				'ServiceDescription' => CHtml::link($service["descr"], array(
					'zkh/registration', 
					'vgid' => $service["vgid"], 
					"catidx" => $service["catidx"]
				)),
				'Above' => Yii::app()->NumberFormatter->formatCurrency($service["above"], Yii::app()->params["currency"])
			));
		}
	}
} ?>
