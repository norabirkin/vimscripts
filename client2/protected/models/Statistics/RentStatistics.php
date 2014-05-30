<?php class RentStatistics extends BaseStatistics {
	
	public function getColumns() {
		return array(
            'dateofcharge' => Yii::t('statistics', 'Date'),
            'tarif' => Yii::t('statistics', 'Tariff'),
            'amount' => Yii::t('statistics', 'Sum')
        );
	}
    
    public function getStatistics() {
        return $this->getClientStat(4, 'period', 'getList');
    }
    
    private function getTarifHistory() {
        $_filter = array(
            "dtto"      => $this->date['dtto'],
            "vgid"      => $this->vgid
        );
        $tarifs = yii::app()->controller->lanbilling->get("getTarifsHistory", array("flt" => $_filter));
        if (!is_array($tarifs)) $tarifs = array($tarifs);
        $tarif_changes = array();
        if ($tarifs) {
            foreach ($tarifs as $t) {
                $tarif_changes[strtotime($t->changed)] = array('name' => $t->tarnewname, 'vgid' => $t->vgid, 'date' => yii::app()->controller->formatDate(strtotime($t->changed)));
            }
        }    
        ksort($tarif_changes);
        return $tarif_changes;
    }
    
    private function getTarif($tarifs,$date) {
        $prev = false;
        foreach ($tarifs as $k=>$v) {
            if (is_array($prev)) {
                if ($k > $date) {
                    return $prev['name'];
                }
            }
            $prev = $v;
        }
        if (  is_array($prev) ) return $prev['name'];
        else return 'not_array';
    }
    
    protected function getDescription($item) {
        return $item['vg_login'];
    }
    
    protected function getDate($item) {
        return $item['period'];
    }
	
	protected function getVolume($item) {
		return false;
	}
    
    public function getTotalRow( $data ) {
	$totalDuration = 0;
	$totalPrice = 0;
	foreach( $data as $item ) {
		$totalPrice += round( $item['rawprice'], 2 );	
		$totalVolume += (int) $this->getVolume( $item );
	}
	$totalPrice = Yii::app()->NumberFormatter->formatCurrency($totalPrice, Yii::app()->params["currency"]);
	return array(
		'id' => '',
        	'dateofcharge' => '',
        	'event' => '',
        	'volume' => $totalVolume ? $totalVolume  : '',
        	'amount' => $totalPrice,
        	'tarif' => '',
		'rawprice' => '' 
	);
    }
    protected function getList($data) {
        $result = array();
        $tarifs = $this->getTarifHistory();
        $i = 0;
        $date_processed = array();
        foreach ($data as $v) {
            $dateofcharge = strtotime($this->getDate($v));
		if ( $this->amountIsNotEmpty( $v["amount"] ) ) { $result[] = array(
                	'id' => $i,
                	'dateofcharge' => yii::app()->controller->formatDate($dateofcharge),
                	'event' => $this->getDescription($v),
                	'volume' => $this->getVolume($v),
                	'amount' => Yii::app()->NumberFormatter->formatCurrency($v['amount'], Yii::app()->params["currency"]),
                	'tarif' => $this->getTarif($tarifs, $dateofcharge),
			'rawprice' => $v['amount']
            	);}
            $i ++;
            $date_processed[] = $dateofcharge;
        }
        return $result;
    }
    
} ?>
