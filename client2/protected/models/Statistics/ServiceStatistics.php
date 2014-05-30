<?php class ServiceStatistics extends RentStatistics {
    
	public function getColumns() {
		return array(
            'dateofcharge' => Yii::t('statistics', 'Date'),
            'event' => yii::t('statistics', 'Service'),
            'tarif' => Yii::t('statistics', 'Tariff'),
            'volume' => yii::t('statistics','Volume'),
            'amount' => Yii::t('statistics', 'Sum')
        );
	}
	
    public function getStatistics() {
        return $this->getClientStat(3, 'dt', 'getList');
    }
    
    protected function getDescription($item) {
        return $item['zone_descr'];
    }
	
	protected function getVolume($item) {
		return $item['volume'];
	}
    
    protected function getDate($item) {
        return $item['dt'];
    }
    
} ?>
