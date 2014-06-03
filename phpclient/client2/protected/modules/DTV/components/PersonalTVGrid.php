<?php class PersonalTVGrid extends TVPackagesGrid {
	protected $title = 'TV channels';
	protected function GetServices() {
		return yii::app()->ServicesDataReader->GetAllServices($this->vgid);
	}
	protected function AddExtraColumns($row, $data) {
		$row = $this->AddBlockedMessage( $row, $data );
		return array(
			'ChannelName' => $row['ChannelName'],
			'Description' => $row['Description'],
			'Above' => $row['Above'],
			'State' => $this->GetState($data),
			'&nbsp;' => $row['&nbsp;']
		);
	}
	protected function ServiceIsProper($service) {
		return  $this->ServiceIsChannel($service) AND
			$this->ServiceIsNotBindedToServiceFunction($service) AND
			$this->ServiceIsNotMobility($service);
	}
	protected function GetActionColumn($service) {
		$checked = $service->assigned;
        if (!$service->available) {
            if ($checked) $hidden = CHtml::hiddenField('catidx[]', $service->catidx);
            else $hidden = '';
            $checked_html = $checked ? ' checked="checked"' : '';
            return $html = '<input type="checkbox" disabled="disabled"'.$checked_html.' />'.$hidden;
        }        
        else return $html = CHtml::checkBox(
                'catidx[]', 
                $checked, 
                array('value' => $service->catidx)
       );
	}
} ?>
