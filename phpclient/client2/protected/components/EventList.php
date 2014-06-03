<?php class EventList extends CFormModel {
	public $filter = array();
	public function getGroupFilter() {
		$result = array();
		foreach($this->filter as $row) {
			$result_row = array();
			foreach ($row['items'] as $filter) {
				$attribute = $filter['name'];
				$type = $filter['type'];
				$items = array();
				$datalist = array();
				if (is_string($filter['items'])) {
					$methodname = $filter['items'];
					$filter['items'] = $this->$methodname();
				}
				foreach ($filter['items'] as $item) {
					$datalist[$item['value']] = yii::t('statistics',$item['title']);
				}
				if ($type == 'radio') $html = CHtml::radioButtonList($attribute, $this->$attribute, $datalist, array('separator' => ''));
				elseif ($type == 'dropdownlist') $html = CHtml::dropDownList($attribute, $this->$attribute, $datalist);
				$result_row['items'][] = array('html' => $html, 'label' => yii::t('statistics',$filter['label']));
			}
			$result_row['label'] = yii::t('statistics',$row['label']);
			$result[] = $result_row;
		} 
		return $result;
	}
    public function group($_filter) {
    	foreach ($this->filter as $row) {
    		foreach ($row['items'] as $filter) {
    			$attribute = $filter['name'];
				$this->$attribute = yii::app()->SessionStore->get($attribute,'traf_',$filter['default']);//Yii::app()->request->getParam($attribute,$filter['default']);
				if (is_string($filter['items'])) {
					$methodname = $filter['items'];
					$filter['items'] = $this->$methodname();
				}
				foreach ($filter['items'] as $item) {
					if ($item['value'] == $this->$attribute) {
						foreach ($item['filter'] as $k => $v) {
							$_filter[$k] = $v;
						}
					}
				}
    		}
    	}
		return $_filter;
	}
	public function defaultDate() {
		$this->date['dtto'] = date('Y-m-d',strtotime('+1 day'));
       	if (Yii::app()->params['statDatePeriod'] && in_array(Yii::app()->params['statDatePeriod'],array('d','w','m',))){
            switch (Yii::app()->params['statDatePeriod']){
            	case 'd':
            	$this->date['dtfrom'] = date('Y-m-d');
            	break;
            	case 'w':
            	$this->date['dtfrom'] = date('Y-m-d',strtotime('-1 week'));
            	break;
            	case 'm':
            	$this->date['dtfrom'] = date('Y-m-d',strtotime('last month'));
            	break;
         	}
		} else $this->date['dtfrom'] = date('Y-m-d',strtotime('-1 day'));
	} 
} ?>