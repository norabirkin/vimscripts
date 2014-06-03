<?php class BlockStatistics extends BaseStatistics {
    
	public function getColumns() {
		return array(
            'timefrom' => yii::t('statistics','BlockTimeFrom'),
            'timeto' => yii::t('statistics','BlockTimeTo'),
            'block_type' => yii::t('statistics','BlockType')
        );
	}	
    
    public function getStatistics() {
        return $this->getClientStat(12, 'timefrom', 'BlockStatList');
    }
    
    public function getStatusByBlockId($blocked){
        $blocksStatus = array(
            0  => "<em style='color:green;'>".Yii::t('statistics', 'Active')."</em>",
            1  => Yii::t('statistics', 'LowBalance'),
            2  => Yii::t('statistics', 'BlockedByUser'),
            3  => Yii::t('statistics', 'BlockedByAdmin'),
            4  => Yii::t('statistics', 'LowBalance'),
            5  => Yii::t('statistics', 'TrafficOverLimit'),
            10 => Yii::t('statistics', 'VgroupBlocked'),
        );
		
        if ( $blocked < 0 ) return '';
        if (in_array($blocked,array_keys($blocksStatus)))
            return $blocksStatus[$blocked];
        else
            return '';
    }
    
	protected function sortByTimefrom($a, $b) {
		if ($a['timestamp'] > $b['timestamp']) return 1;
		if ($a['timestamp'] == $b['timestamp']) return 0;
		if ($a['timestamp'] < $b['timestamp']) return -1;
	}
	
    protected function BlockStatList($data) {
        $result = array();
        foreach ($data as $v) {
            $result[] = array(
				'timestamp' => ($v['timefrom'] == '0000-00-00 00:00:00') ? 0 : strtotime($v['timefrom']),
                'timefrom' => ($v['timefrom'] == '0000-00-00 00:00:00') ? '' : yii::app()->controller->formatDate(strtotime($v['timefrom'])),
                'timeto' => (Services::check_unlimited_timeto($v['timeto'])) ? '' : yii::app()->controller->formatDate(strtotime($v['timeto'])),
                'block_type' => $this->getStatusByBlockId($v['block_type'])
            );
        }
		usort($result,array($this,'sortByTimefrom'));
		$result = array_reverse($result);
        return $result;
    }
    
} ?>
