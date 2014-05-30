<?php class AssignedAntivirusServicesGrid extends BaseGrid {
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
	private function isActivated( $service ) {
 		return strtotime( $service->service->activated  ) <= time();
	}
	protected function AddData() {
		foreach ($this->services as $service) {
			$this->AddRow(array(
				'ServiceDescription' => $service->catdescr . yii::app()->controller->getModule()->Antivirus->getInfoLink( $service->service->link ),
                'Full description' => $service->service->descrfull,
				'Key' => $service->service->externaldata ? CHtml::link($service->key, $service->url) : yii::t(
					$this->getMessagesCategory(),
					'WaitingForKey'
				), 
				'Above' => Yii::app()->NumberFormatter->formatCurrency($service->catabove, Yii::app()->params['currency']),
				'Stop' => $this->blocked ? '<em class="unavailable">('.yii::t('tariffs_and_services','VGroup is blocked').')</em>' : CHtml::link( yii::t( $this->getMessagesCategory(), 'Stop' ) , array(
					'default/ConfirmStop',
					'servid' => $service->service->servid,
					'vgid' => $service->service->vgid,
					'tarid' => $service->service->tarid,
					'catidx' => $service->service->catidx
				)),
				'Status' => $this->isActivated( $service ) ? yii::t(
					$this->getMessagesCategory(), 
					'Activated'
				) : yii::t(
					$this->getMessagesCategory(),
					'NotActivated'
				) 
			));
		}
	}
} ?>
