<?php class TarifStatistics extends BaseStatistics{

	public function getColumns() {
		return array(
            'changed' => yii::t('statistics','Date'),
            'event' => yii::t('statistics','Event'),
            'requestby' => yii::t('statistics','RequestBy')
        );
	}
	
	public function sortByRasptime($a,$b) {
		$a = $a['unixtime'];
		$b = $b['unixtime'];
		if ($a > $b) return 1;
		if ($a < $b) return -1;
		if ($a == $b) return 0;
	}
	
	protected function sortByTimefrom($a, $b) {
		if ($a['timestamp'] > $b['timestamp']) return 1;
		if ($a['timestamp'] == $b['timestamp']) return 0;
		if ($a['timestamp'] < $b['timestamp']) return -1;
	}

    public function getStatistics() {
        $_filter = array(
            "dtfrom" => $this->date['dtfrom'],
            "dtto" => $this->date['dtto'],
            "vgid" => $this->vgid
        );
        $tarifs = yii::app()->controller->lanbilling->get("getTarifsHistory", array("flt" => $_filter));
		if (!$tarifs) $tarifs = array();
        if (!is_array($tarifs)) $tarifs = array($tarifs);
        $list = $this->getList($tarifs);
		usort($list,array($this,'sortByRasptime'));
		return array_reverse($list);
    }
    
    protected function getList($tarifs) {
        $result = array();
        foreach ($tarifs as $v) {
            $requestby = ($v->requestby == 'null') ? yii::t('statistics','ByUser') : yii::t('statistics','ByAdmin');
            if (!empty($v->taroldname)) $event = yii::t('statistics','FromTariffToTariff',array(
				'{taroldname}' => '<strong>'.$v->taroldname.'</strong>',
				'{tarnewname}' => '<strong>'.$v->tarnewname.'</strong>'
			));
            else $event = Yii::t('statistics', 'TariffChange') . ' <strong>' . $v->tarnewname . '</strong>';
			$rasptimeUnix = ($v->rasptime == '0000-00-00 00:00:00' ? null : strtotime($v->rasptime));
            $result[] = array(
            	'unixtime' => $rasptimeUnix,
                'changed' => $rasptimeUnix ? yii::app()->controller->formatDate($rasptimeUnix) : '----',
                'event' => $event,
                'requestby' => $requestby
            );
        }
        return $result;
    }
    
} ?>
