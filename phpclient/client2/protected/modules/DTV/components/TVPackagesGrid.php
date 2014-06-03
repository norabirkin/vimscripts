<?php class TVPackagesGrid extends BaseGrid{
	protected $messagesCategory = 'DTVModule.smartcards';
	protected $vgid;
	private $rawData = array();
	private $serviceFunctionsUUIDs = NULL;
    private static $usboxServices;
	
	protected function ServiceIsPackage($service) {
        return DTVServices::getInstance()->ServiceIsPackage($service);
	}
	protected function ServiceIsChannel($service) {
        return DTVServices::getInstance()->ServiceIsChannel($service);
	}
	public function SetVgid($vgid) {
		$this->ClearData();
		$this->vgid = (int) $vgid;
	}
	public function ClearData() {
		$this->data = NULL;
		$this->rawData = array();
	}
	public function GetRawData() {
		return $this->rawData;
	}
	protected function GetServices() {}
	protected function GetActionUrl($service) {}
	protected function ServiceIsNotMobility($service) {
		return $service->uuid != Yii::app()->controller->lanbilling->getOption("smartcard_usbox_tag");
	}
	protected function GetState($service) {
		if ($service->assigned) return yii::t('DTVModule.smartcards','Assigned');
		else return yii::t('DTVModule.smartcards','NotAssigned');
	}
	protected function ServiceIsNotBindedToServiceFunction($service) {
		$services_model = new Services;
		if ($this->serviceFunctionsUUIDs === NULL) {
        	$services_model->getServiceFunctions();
        	$this->serviceFunctionsUUIDs = $services_model->stored('service_functions_uuids');
		}
		return ($services_model->reg_match_in_array($service->uuid, $this->serviceFunctionsUUIDs) === false);
	}
	protected function ServiceIsProper($service) {
		return 	$this->ServiceIsPackage($service) AND
			$this->ServiceIsNotBindedToServiceFunction($service) AND
			$this->ServiceIsNotMobility($service);
	}
	protected function GetUnavailableMessage() {
		return "<em>".yii::t('DTVModule.smartcards','Unavailable')."</em>";
	}
	protected function GetActionColumn($service) {
		if (!$service->available) return $this->GetUnavailableMessage();
		else return $this->GetActionUrl($service);
	}
	protected function AddExtraColumns($row, $service) {
		return $row;
	}
	protected function AddBlockedMessage( $row, $service ) {
		if ( $service->turnedoff ) $row["Description"] = $row["Description"] . " <em class=\"red_fragment\">(" . yii::t( 'DTVModule.smartcards', "Blocked" ) . ")</em>";
		return $row;
	}
    private function GetRateOfAssignedService($service) {
        return $this->GetUsboxService($service->servid)->service->rate;
    }
    private function GetRateOfNotAssignedService($service) {
        return yii::app()->lanbilling->get('getTarCategoryRate', array(
            'flt' => array(
                'vgid' => $service->vgid,
                'tarid' => $service->tarid,
                'catid' => $service->catidx
            )
        ));
    }
    private function GetRate($service) {
        try {
            if ($service->servid) {
                return $this->GetRateOfAssignedService($service);
            }
            else {
                return $this->GetRateOfNotAssignedService($service);
            }
        } catch (Exception $e) {
            return 1;
        }
    }
    protected function GetDiscountedPrice($service) {
        return ceil($service->above * $this->GetRate($service) * 10) / 10;
    }
    private function GetUsboxService($servid) {
        if (!self::$usboxServices) {
            self::$usboxServices = array();
        }
        if (!isset(self::$usboxServices[$this->vgid])) {
            self::$usboxServices[$this->vgid] = yii::app()->lanbilling->getRows('getUsboxServices', array(
                'flt' => array(
                    "common" => 1,
                    'vgid' => $this->vgid
                )
            ));
        }
        foreach (self::$usboxServices[$this->vgid] as $service) {
            if ($servid == $service->service->servid) {
                return $service;
            }
        }
        throw new Exception;
    }
	protected function AddData() {
		foreach ($this->GetServices() as $service) {
            $service->above = $this->GetDiscountedPrice($service);
			$row = array(
				'ChannelName' => $service->catdescr.yii::app()->controller->widget('LinkToDescription',array('link' => $service->link),true),
				'Description' => $service->descrfull,
				'Above' => Yii::app()->NumberFormatter->formatCurrency($service->above, Yii::app()->params["currency"]),
				'&nbsp;' => $this->GetActionColumn($service)
			);
			$row = $this->AddExtraColumns($row, $service);
			if ($this->ServiceIsProper($service)) {
				$this->rawData[] = $service;
				$this->AddRow($row);
			}
		}
		return $services;
	}
} ?>
