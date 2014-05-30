<?php class StatisticsVgroups {
	public static $vgroup;
	
    public function get_vgroup_details($type,$vgid) {
		if (!self::$vgroup) self::$vgroup = Yii::app()->controller->lanbilling->get("getClientVgroups", array('flt' => array('vgid' => $vgid)));
		if (!self::$vgroup) return false;
		return self::$vgroup->vgroup;
    }
	
	public function get_telstaff($vgid) {
		if (!self::$vgroup) self::$vgroup = Yii::app()->controller->lanbilling->get("getClientVgroups", array('flt' => array('vgid' => $vgid)));
		if (!self::$vgroup) return false;
		return Arr::get_array(self::$vgroup->telstaff);
	}
    
    public function getAvailableMenu()
    {
    	$menu = array();
       	$vgroups = Arr::get_array(Yii::app()->controller->lanbilling->get("getClientVgroups", array()));
	   	foreach ($vgroups as $vgroup) {
	   		foreach (Statistics::$types as $k => $v) {
	   			if ($k == 'base') continue;
				if (in_array($vgroup->vgroup->tariftype, $v['tarif_types']) AND !isset($menu[$k])) {
					$menu[$k] = array(
						'class' => $v['class'], 
						'scope' => $v['scope']
					);
				}
	   		}
	   	}
		return $menu;
    }
    
    public function vgroup_list($type) {
    	$result = array();
		$vgroups = Arr::get_array(Yii::app()->controller->lanbilling->get("getClientVgroups", array()));
		foreach ($vgroups as $item) {
			if (in_array($item->vgroup->tariftype, Statistics::$types[$type]['tarif_types'])) {
        		$result[] = array(
        			'vgroup' => CHtml::link(
        				(!empty($item->vgroup->login)) ? $item->vgroup->login : '<em>' . Yii::t('Statistics', 'логин не назначен') . '</em>',
        				array( 'statistics/details', 'type' => $type, "vgid" => $item->vgroup->vgid )
        			),
        			'agrmid' => Yii::app()->controller->lanbilling->agreements[$item->vgroup->agrmid]->number,
        			'tarifdescr' => $item->vgroup->tarifdescr,
        			"servicerent" => Yii::app()->NumberFormatter->formatCurrency($item->vgroup->servicerent, Yii::app()->params["currency"]),
        			"servicevolume" => $item->vgroup->servicevolume,
        			"serviceusedin" => ($item->vgroup->serviceusedin >= 0) ? $item->vgroup->serviceusedin: "-",
        			"blocked" => Statistics::type('block')->getStatusByBlockId($item->vgroup->blocked)
        		);
			}
		}
        return $result;
    }

} ?>
