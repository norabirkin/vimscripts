<?php class PhoneStatistics extends BaseStatistics {
	public $direction;
	public $numfrom;
	public $hello;
	public $filter = array(
		array(
			'items' => array(
				array(
					'type' => 'dropdownlist',
					'name' => 'direction',
					'label' => 'Direction',
					'default' => 0,
					'items' => array(
						array(
							'value' => 0,
							'title' => 'All',
							'filter' => array()
						),
						array(
							'value' => 1,
							'title' => 'Outcoming',
							'filter' => array(
								'direction' => 2
							)
						),
						array(
							'value' => 2,
							'title' => 'Incoming',
							'filter' => array(
								'direction' => 1
							)
						)
					)
				),
				array(
					'type' => 'dropdownlist',
					'name' => 'numfrom',
					'label' => 'Number',
					'default' => 0,
					'items' => 'getNumfromList'
				)
			)
		)
	);
	public function getNumfromList() {
		yii::import('application.models.Statistics.helpers.StatisticsVgroups');
		$helper = new StatisticsVgroups;
		$telstaff = $helper->get_telstaff($this->vgid);
		$result = array(
			array(
				'value' => 0,
				'title' => 'All',
				'filter' => array()
			)
		);
		$i = 1;
		foreach ($telstaff as $v) {
			$result[] = array(
				'value' => $i,
				'title' => $v->phonenumber,
				'filter' => array(
					'numfrom' => $v->phonenumber
				)
			);
			$i ++;
		}
		return $result;
	}
	public function getColumns() {
		return array(
			'timefrom' => yii::t('statistics','Date'),
			'duration' => yii::t('statistics','Duration'),
			'direction' => yii::t('statistics','Direction'),
			'fromnumber' => yii::t('statistics','FromNumber'),
			'tonumber' => yii::t('statistics','ToNumber'),
			'cat_descr' => yii::t('statistics','Zone'),
			'c_date' => yii::t('statistics','Period'),
			'amount' => yii::t('statistics','Amount')
		);
	}
	public function getStatistics() {
        return $this->getClientStat(2, 'timefrom', 'getList', 0, array( "additional" => 1 ));
    }

	public function getTotalRow( $data ) {
		$totalDuration = 0;
		$totalPrice = 0;
		foreach( $data as $item ) {
			$totalPrice += round( $item['rawprice'], 2 );	
			$totalDuration += $item['rawduration'];
		}
		$totalPrice = Yii::app()->NumberFormatter->formatCurrency($totalPrice, Yii::app()->params["currency"]);
		$totalDuration = Yii::app()->controller->lanbilling->secondsToString($totalDuration);
		return array(
			'id' => '',
			'timefrom' => '',
			'duration' => $totalDuration,
			'direction' => '', 
			'fromnumber' => '',
			'tonumber' => '',
			'cat_descr' => '',
            'c_date' => '',
			'amount' => $totalPrice,
			'rawprice' => ''
		);
    	}

	protected function getList($data) {
        $result = array();
		$i = 0;
		foreach ($data as $item) {
			$result[] = array(
				'id' => $i,
				'timefrom' => $item['timefrom'],
				'duration' => Yii::app()->controller->lanbilling->secondsToString($item['duration']),
				'direction' => $item['direction'] ? yii::t('statistics','OutcomingCall') : yii::t('statistics','IncomingCall'), 
				'fromnumber' => $item['numfrom'],
				'tonumber' => $item['numto'],
				'cat_descr' => $item['cat_descr'],
				'c_date' => $item['c_date'] == '0000-00-00' ? '' : $item['c_date'],
				'amount' => Yii::app()->NumberFormatter->formatCurrency($item['amount'], Yii::app()->params["currency"]),
				'rawprice' => $item['amount'],
				'rawduration' => $item['duration']
			);
			$i ++;
		}
        return $result;
    }
} ?>
