<?php class AvailableAntivirusServicesGrid extends BaseGrid {
	protected $services = array();
    private $blocked;

    public function setVGBlocked($blocked) {
        $this->blocked = $blocked;
    }
	protected function getMessagesCategory() {
		return Antivirus::getLocalizeFileName();
	}
	public function setServices($services) {
		$this->services = $services;
	}
	protected function AddData() {
		foreach ($this->services as $service) {
			$this->AddRow(array(
				'ServiceDescription' => $service->catdescr . yii::app()->controller->getModule()->Antivirus->getInfoLink( $service->link ),
                'Full description' => $service->descrfull,
				'Above' => Yii::app()->NumberFormatter->formatCurrency(
					$service->above, Yii::app()->params["currency"]
				),
				'Assign' => $this->blocked ? '<em class="unavailable">('.yii::t('tariffs_and_services','VGroup is blocked').')</em>' : CHtml::link( yii::t( $this->getMessagesCategory(),'Assign' ), array(
					'default/ConfirmAssign', 
					'vgid' => $service->vgid, 
					"catidx" => $service->catidx
				))
			));
		}
	}
} ?>
