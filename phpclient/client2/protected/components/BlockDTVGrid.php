<?php class BlockDTVGrid extends BaseGrid {
	protected $messagesCategory = 'tariffs_and_services';
	protected $services;
	protected $title = 'DTVServicesToStop';
	public function __construct( $conf ) {
		foreach( $conf as $k => $v ) {
			$method = 'set' . ucfirst( $k );
			if( method_exists( $this, $method ) ) $this->$method( $v );
		}
	}
	private function setServices($services) {
		$this->services = (array) $services;
	}
	protected function AddData() {
		foreach ($this->services as $service) {
			$this->AddRow(array(
				"ServiceName" => $service->catdescr,
				"Tariff" => $service->tardescr,
				"Assigned" => yii::app()->controller->formatDate(strtotime($service->timefrom)),
				"Price" =>Yii::app()->NumberFormatter->formatCurrency( $service->above, Yii::app()->params["currency"] ) 
			));
		}
	}
} ?>
