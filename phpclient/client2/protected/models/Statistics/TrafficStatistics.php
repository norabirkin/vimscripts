<?php class TrafficStatistics extends BaseStatistics {
	public $group;
	public $filter = array(
		array(
			'label' => 'GroupBy',
			'items' => array(
				array(
					'type' => 'radio',
					'name' => 'group',
					'default' => 1,
					'items' => array(
						array(
							'value' => 1,
							'title' => 'ByDays',
							'filter' => array(
								'repnum' => 1,
								'repdetail' => 1
							)
						),
						array(
							'value' => 2,
							'title' => 'ByHours',
							'filter' => array(
								'repnum' => 1,
								'repdetail' => 2
							)
						),
						array(
							'value' => 3,
							'title' => 'ByCategories',
							'filter' => array(
								'repnum' => 3,
								'repdetail' => 1
							)
						),
						array(
							'value' => 4,
							'title' => 'ByAddresses',
							'filter' => array(
								'repnum' => 3,
								'repdetail' => 2
							)
						)
					)
				)
			)
		)
	);
	public function getColumns() {
		$columns = array();
		if (in_array($this->group,array(1,2))) $columns['dt'] = yii::t('statistics','Date');
		if ($this->group == 3) $columns["zone_descr"] = yii::t('statistics','Categories');
		if ($this->group == 4) $columns['src_ip'] =  yii::t('statistics','Address');
		$columns["volume_in"] = Yii::t('statistics', 'IncomingTraffic');
		$columns["volume_out"] = Yii::t('statistics', 'OutcomingTraffic');
		$columns["volume"] = Yii::t('statistics', 'TrafficVolume');
		$columns["amount"] = Yii::t('statistics', 'TrafficAmount');
		return $columns;
	}
    public function getStatistics() {
        return $this->getClientStat(1, 'dt', 'getList', 0);
    }
	public function getDate($date) {
		if($this->group != 2) return yii::app()->controller->formatDate(strtotime($date));
		else return yii::app()->controller->formatDateWithTime($date);
	}

    public function getTotalRow( $data ) {
		$totalVolumeIn = 0;
		$totalVolumeOut = 0;
		$totalVolume = 0;
		$totalPrice = 0;
		foreach( $data as $item ) {
			$totalPrice += round( $item['rawprice'], 2 );	
			$totalVolumeIn += $item['rawvolumein'];
			$totalVolumeOut += $item['rawvolumeout'];
			$totalVolume += $item['rawvolume'];
		}
		$totalPrice = Yii::app()->NumberFormatter->formatCurrency($totalPrice, Yii::app()->params["currency"]);
		$totalVolumeIn = Yii::app()->controller->lanbilling->bytesToMb($totalVolumeIn);
		$totalVolumeOut = Yii::app()->controller->lanbilling->bytesToMb($totalVolumeOut);
		$totalVolume = Yii::app()->controller->lanbilling->bytesToMb($totalVolume);
		$row = array(
			'id' => '',
                	'dt' => '',
                	'volume_in' => $totalVolumeIn,
                	'volume_out' => $totalVolumeOut,
                	'volume' => $totalVolume,
                	'amount' => $totalPrice,
			'rawprice' => ''	
		);
		if ($this->group == 3) $item['zone_descr'] =  $v["zone_descr"];
		if ($this->group == 4) $item['src_ip'] =  $v["src_ip"];
		return $row;
    }

    public function getList($data) {
        $result = array();
        $i = 0;
        foreach ($data as $v) {
        	$item = array(
                'id' => $i,
                'dt' => $this->getDate($v['dt']),
                'volume_in' => Yii::app()->controller->lanbilling->bytesToMb($v['volume_in']),
                'volume_out' => Yii::app()->controller->lanbilling->bytesToMb($v['volume_out']),
                'volume' => Yii::app()->controller->lanbilling->bytesToMb($v['volume']),
                'amount' => Yii::app()->NumberFormatter->formatCurrency($v["amount"], yii::app()->params['currency']),
		'rawprice' => $v['amount'],
		'rawvolumein' => $v['volume_in'],
		'rawvolumeout' => $v['volume_out'],
		'rawvolume' => $v['volume'],
            );
			if ($this->group == 3) $item['zone_descr'] =  $v["zone_descr"];
			if ($this->group == 4) $item['src_ip'] =  $v["src_ip"];
			$result[] = $item;
            $i ++;
        }
        return $result;
    }
} ?>
