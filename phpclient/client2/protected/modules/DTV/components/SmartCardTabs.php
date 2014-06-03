<?php class SmartCardTabs extends BaseTabs {
    private $vgroups;
	private $smartcards;
	private $equipment;
	protected $tabContentTemplate = 'TVPackages';
	private function getEquipment() {
		if ( $this->equipment === null ) {
			$this->equipment = array();
			foreach( yii::app()->lanbilling->getRows("getEquipment") as $equipment ) {
				if ( !$equipment->vgid ) continue;
				$this->equipment[ $equipment->vgid ] = $equipment;
			}
		}
		return $this->equipment;
	}
	private function getSmartCards() {
		if ( $this->smartcards === null ) { 
			$this->smartcards = array();
			$cards = yii::app()->lanbilling->getRows("getSmartCards", array("flt" => array())); 
			foreach ( $cards as $card ) $this->smartcards[ $card->smartcard->vgid ] = $card;
		}
		return $this->smartcards;
	}
	private function getSmartCardByVgid( $vgid ) {
		$smartcards = $this->getSmartCards();
		if ($smartcards[ $vgid ]) return $smartcards[ $vgid ];
		return null;
	}
	private function getSmartCardName( $vgroup ) {
		$smartcard = $this->getSmartCardByVgid( $vgroup->vgroup->vgid );
		return $smartcard ? $smartcard->smartcard->name : "";
	}
	private function vgroupIsBindedToEquipment( $vgid ) {
		$equipment = $this->getEquipment();
		return isset( $equipment[$vgid] );
	}
	private function processVgroupData( $vgroup ) {
		if ( $vgroup->vgroup->tariftype != 5 ) return null;
		if (!$this->vgroupIsBindedToEquipment( $vgroup->vgroup->vgid )) return null;
		if ( $vgroup->vgroup->usesmartcards ) {
			if (!$this->getSmartCardByVgid( $vgroup->vgroup->vgid )) return null;
		}
		return array( 
			"id" => $vgroup->vgroup->vgid,
			"title" => $vgroup->vgroup->login,
			"smartcard" => $this->getSmartCardName( $vgroup )
		);
	}
	public function getVgroups() {
        if ($this->vgroups === null) {
            $this->vgroups = array();
            $vgroups = yii::app()->lanbilling->getRows("getClientVgroups");
            foreach( $vgroups as $vgroup ) {
                if ($vgdata = $this->processVgroupData($vgroup)) {
                    $this->vgroups[$vgroup->vgroup->vgid] = $vgdata;
                }
            }
        }
		return $this->vgroups;
	}
	protected function AddData() {
		$i = 0;
		$vgroups = $this->getVgroups();
		foreach ( $vgroups as $vgroup) {
			yii::app()->controller->getModule()->AvailableTVPackagesGrid->SetVgid($vgroup["id"]);
			yii::app()->controller->getModule()->AssignedTVPackagesGrid->SetVgid($vgroup["id"]);
			$this->AddTab(array(
				'title' => $vgroup["title"],
				'params' => array(
					'smartcard' => $vgroup["smartcard"],
					'personalTVLink' => CHtml::link(
						yii::t('DTVmodule.smartcards','PersonalTV'), 
						array(
							'smartcards/PersonalTV',
							'vgid' => $vgroup["id"], 
							'tab' => $i
						)
					),
					'availableTVPackages' => yii::app()->controller->getModule()->AvailableTVPackagesGrid->Render(),
					'assignedTVPackagesGrid' => yii::app()->controller->getModule()->AssignedTVPackagesGrid->Render()
				)
			));
			$i ++;
		}
	}
} ?>
