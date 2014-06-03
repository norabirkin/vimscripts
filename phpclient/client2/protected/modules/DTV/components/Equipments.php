<?php class Equipments extends CApplicationComponent {
    private $mobility = array();
    private $allow_join = array();
	private $categories = array();
	private $smartcards;
	private $vgroups;
	private $services;
	private $services1;
	private $equipment;
	private $equipmentBindedToSmartCard;
	private function getServices() {
		if ($this->services === null) { 
			$this->services = array();
			foreach ( $this->getVgroups() as $vg ) {
				$this->services = array_merge( $this->services, yii::app()->controller->lanbilling->getRows( 'getUsboxServices', array(
					"flt" => array(
						"dtfrom" => yii::app()->controller->lanbilling->subDate('now', 0, 'day', 'Y-m-d H:i:s'),
						"dtto" => "9999-12-31 23:59:59",
						"common" => 1,
						"tarid" => 0,
						"category" => -1,
						"needcalc" => 1,
						"vgid" => $vg->vgroup->vgid,
					)
				)));
			}
		}
		return $this->services;
	}
	private function getVgroups() {
		if ($this->vgroups === null) { 
			$this->vgroups = array();
			$vgroups = yii::app()->lanbilling->getRows( "getClientVgroups" );
			foreach( $vgroups as $vgroup ) $this->vgroups[ $vgroup->vgroup->vgid ] = $vgroup;
		}
		return $this->vgroups;
	}
	private function getVgroup( $vgid ) {
		$vgroups = $this->getVgroups();
		if (isset( $vgroups[$vgid] )) return $vgroups[$vgid];
		else return null;
	}
	public function getEquipment() {
		if ($this->equipment === null) $this->equipment = yii::app()->lanbilling->getRows( "getEquipment" );
		return $this->equipment;
	}
	private function processDataForEquipmentGrid( $item ) {
		$data = array(
			'vglogin' => $item->vglogin,
			'equipid' => $item->equipment->equipid,
			'modelname' => $item->modelname,
			'serial' => $item->equipment->serial,
			'name' => $item->equipment->name,
			'agrmnum' => $item->agrmnum,
			'description' => '<span id="editable-value-equipment-desc-'. $item->equipment->equipid .'">'. trim( $item->equipment->descr ) .'</span>'.setCardEquipment::descEditWidget( $item->equipment->equipid ),
			"mac" => $item->equipment->mac,
			"chipid" => $item->equipment->chipid,
			'price' => $this->getPrice($item)
		);
		return $data;
	}
	protected function getLink($name, $route, $params, $method = 'get', $extraOptions = array()) {
		if ($method == 'post') {
			$url = array($route);
			$options = array(
				'submit' => $url,
				'params' => $params
			);
		} elseif ($method == 'get') {
			$url = array_merge(array($route),$params);
			$options = array();
		}
		$options = array_merge( $options, $extraOptions );	
		return CHtml::link($name, $url, $options );
	}
	private function getSmartCards() {
		if ($this->smartcards === null) $this->smartcards = yii::app()->lanbilling->getRows("getSmartCards");
		return $this->smartcards;
	}
	private function getSmartCard( $id ) {
		foreach ($this->getSmartCards() as $item) {
			if ($item->smartcard->cardid == $id)  return array(
				'cardid' => $item->smartcard->cardid,
				'name' => $item->smartcard->name,
				'serial' => $item->smartcard->serial,
				'descr' => $item->smartcard->descr,
				"vgid" => $item->smartcard->vgid
			);
		}
	}
	private function addSmartcardStructure( $cardid ) {
		if (!isset($this->equipmentBindedToSmartCard[ $cardid ])) {
			$this->equipmentBindedToSmartCard[ $cardid ] = array(
				"card" => $this->getSmartCard( $cardid ), 
				"data" => array(),
				"count" => 0
			);
		}
	}
	private function getDetachLink( $equipment ) {
		return $this->getLink(
			yii::t('DTVModule.equipment','Detach'),
			'/DTV/Equipment/DetachEquipment',
			array( 'equipid' => $equipment->equipment->equipid ), 
			'get', 
			array( 'confirm' => yii::t(
				'DTVModule.equipment','DetachConfirm',
				array( '{equipment}' => $equipment->equipment->name )
			))
		);
	}
	private function addEquipmentBindedToSmartcards() {
		foreach ($this->getEquipment() as $item) {
			if (!$item->equipment->cardid) continue;
			$this->addSmartcardStructure( $item->equipment->cardid );
			$processed = $this->processDataForEquipmentGrid( $item );
			if ($item->equipment->cardid) $processed["action"] = $this->getDetachLink( $item );
			$this->equipmentBindedToSmartCard[ $item->equipment->cardid ]["data"][] = $processed;
			$this->equipmentBindedToSmartCard[ $item->equipment->cardid ]["count"] = count($this->equipmentBindedToSmartCard[ $item->equipment->cardid ]["data"]);
		}
	}
	public function addSmartcardsWithoutBindedEquipment() {
		foreach( $this->getSmartCards() as $card ) $this->addSmartcardStructure( $card->smartcard->cardid );
	}
	public function getEquipmentsBindedToSmartcards() {
		if ($this->equipmentBindedToSmartCard === null) {
			$this->equipmentBindedToSmartCard = array();
			$this->addEquipmentBindedToSmartcards();
			$this->addSmartcardsWithoutBindedEquipment();
		}
		return $this->equipmentBindedToSmartCard;
	}
	private function getAttachLink( $equipment ) {
		return $this->getLink(yii::t('DTVModule.equipment','Attach'), '/DTV/Equipment/JoinRequest', array(
			'cardid' => yii::app()->request->getParam('smartcard'),
			'equipid' => $equipment->equipment->equipid
		));
	}
	public function getNotBindedEquipment( $agrmid ) {
		$result = array();
		foreach ($this->getEquipment() as $item) {
			if ($item->vgid) continue;
			if ($item->equipment->cardid) continue;
			if ($item->equipment->agrmid != $agrmid) continue;
			$processed = $this->processDataForEquipmentGrid( $item );
			$processed['action'] = $this->getAttachLink( $item );
			$result[] = $processed;
		}
		return $result;
	}
	public function getEquipmentsBindedToVgroups() {
		$result = array();
		foreach ($this->getEquipment() as $item) {
			if (!$item->vgid) continue;
			if ( $this->getVgroup($item->vgid)->vgroup->usesmartcards ) continue;
			if (!isset($result[ $item->vgid ])) $result[ $item->vgid ] = array( "vglogin" => $item->vglogin, "data" => array() );
			$result[ $item->vgid ]["data"][] = $this->processDataForEquipmentGrid( $item );
		}
		return $result;
	}
	private function getPrice($item) {
		foreach( $this->getServices() as $service ) {
			if ( $service->service->servid == $item->equipment->servid ) { 
				return Yii::app()->NumberFormatter->formatCurrency($service->catabove, Yii::app()->params["currency"]);
			}
		}
		return '';
	}
	private function getTarCategories( $tarifid ) {
		if (!isset( $this->categories[$tarifid] )) $this->categories[$tarifid] = yii::app()->lanbilling->getRows("getTarCategories", array( "id" => $tarifid ));
		return $this->categories[$tarifid];
	}
    private function getAssignedServices( $vgid ) {
        return yii::app()->controller->lanbilling->getRows('getVgroupServices',array(
			'flt' => array(
            	'vgid' => $vgid,
            	'common' => -1,
            	'unavail' => -1,
            	'needcalc' => 1, 
            	'defaultonly' => 1
        	)
		));
    }
    protected function isMobililtyServiceAssigned( $cardid ) {
        if (!$this->mobility[$cardid]) {
            $card = $this->getSmartCard( $cardid );
            if (!$card) throw new Exception('Смарт-карта не найдена');
            $vgroups = $this->getVgroups();
            $services = $this->getAssignedServices( $vgroups[ $card["vgid"] ]->vgroup->vgid );
            $this->mobility[$cardid] = false;
            foreach ( $services as $service ) {
                if ($service->uuid == Yii::app()->lanbilling->getOption("smartcard_usbox_tag")) {
                    $this->mobility[$cardid] = true;
                    break;
                }
            }
        }
        return $this->mobility[$cardid];
    }
    protected function ifNotAllSmartCardOptionsAreSet() {
		if (!Yii::app()->lanbilling->getOption("usbox_eqip_min") AND !Yii::app()->lanbilling->getOption("smartcard_eqip_max")) return true;
		if (!Yii::app()->lanbilling->getOption("smartcard_usbox_tag")) {
            if (Yii::app()->lanbilling->getOption("usbox_eqip_min")) {
                yii::app()->user->setFlash('error',yii::t('DTVModule.equipment','Unable to link equipment. Please contact manager'));
                return 0;
            }
            return (int) Yii::app()->lanbilling->getOption("smartcard_eqip_max");
        }
        return null;
    }
    public function getEquipmentLinkUnavailableMessageIfNeccessary( $cardid ) {
        if ( $this->allowJoin($cardid) ) return '';
        if ( $this->getEquipmentCount($cardid) < Yii::app()->lanbilling->getOption("smartcard_eqip_max") ) return '<em class="unavailable">('.yii::t('DTVModule.equipment','Please contact to manager to link more equipment').')</em>';
        return '';
    }
	protected function getMobility( $cardid ) {
        if ( ($result = $this->ifNotAllSmartCardOptionsAreSet()) !== null ) return $result;
		if ( !$this->isMobililtyServiceAssigned($cardid) ) return (int) Yii::app()->lanbilling->getOption('usbox_eqip_min');
		else return (int) Yii::app()->lanbilling->getOption("smartcard_eqip_max");
	}
    protected function getEquipmentCount( $cardid ) {
        $cards = $this->getEquipmentsBindedToSmartcards();
        return $cards[$cardid]["count"];
    }
	public function allowJoin( $cardid ) {
        if (!$this->allow_join[$cardid]) {
            try {
                $mobility = $this->getMobility( $cardid );
            } catch ( Exception $e ) {
                $mobility = (int) Yii::app()->lanbilling->getOption('usbox_eqip_min');
            }
            if ( $mobility === true ) $this->allow_join[$cardid] = true;
            else $this->allow_join[$cardid] = ($this->getEquipmentCount($cardid) < $mobility);
        }
        return $this->allow_join[$cardid];
	}
} ?>
