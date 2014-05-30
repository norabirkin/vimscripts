<?php class EquipmentsBindedToVgrouprsGrid extends BaseGrid {
	protected $messagesCategory = 'DTVModule.equipment';
	private $equipments;
	public function __construct( $conf ) {
		$this->title = $conf["title"];
		$this->equipments = $conf["equipments"];
	}
	protected function AddData() {
		foreach ($this->equipments as $equipment) {
			$row = array(
				'Name' => $equipment['name'],
				'Description' => $equipment['description'],
				'Serial' => $equipment['serial'],
				'Agreement number' => $equipment['agrmnum'],
				'Model name' => $equipment['modelname'],
				'Mac' => $equipment['mac'],
				'Chip ID' => $equipment['chipid'],
				'Price' => $equipment['price']
			);
			if ( $equipment["action"] ) $row[""] = $equipment["action"];
			$this->AddRow( $row );
		}
	}
} ?>
