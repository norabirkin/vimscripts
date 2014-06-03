<?php 

class BindedUsboxList {
	private $data = array();
	private $processed = array();
	protected function getLink($item,$item1) {
		$link_img = CHtml::image(Yii::app()->theme->baseUrl.'/i/b_info.gif','info');
		$link = (!$item['link']) ? '' :'&nbsp;&nbsp;'.CHtml::link($link_img,$link,array('class' => 'no_border'));
		if ($item['available']) {
		    return CHtml::link($item['catdescr'],array('/'.$item1['modulename'],
				    'usbox_uuid' => $item1['uuid']
		    )).$link;
		} else return $item['catdescr'].' <em class="unavailable">('.yii::t('tariffs_and_services','ServiceUnavailable').')</em>'.$link;
	}
	public function add($data,$data1,$index) {
		$item = array(
			'description' => $this->getLink($data,$data1),
			'full_description' => $data['full_description'],
			'price' => ''
		);
		if (!$this->processed[$data['agrmid']][$index]) {
			$this->data[$data['agrmid']][] = $item;
			$this->processed[$data['agrmid']][$index] = true;
		}
	}
	public function getData($agrmid) {
		$functions = $this->data[$agrmid];
		if (!$functions) return array();
		return $functions;
	}
}

class ServiceFunctionsList {
	private $data = NULL;
	private $uuids = NULL;
	private $binded_usbox = NULL;
	static function getRensoft($agrmid) {
		$model = new getClientServFuncs;
		if ($model->getItem('selectRensoft')) return array(
			'full_description' => '',
			'price' => '',
			'description' => CHtml::link('RentSoft',array('services/rentsoft','agrmid' => $agrmid))
		);
		return false;
	}
	public function processList($item,$modulename) {
		return array(
        	'uuid' => $item->uuid,
            'modulename' => $modulename,
            'descr' => $item->descr
        );
	}
	public function getLink($item) {
		return CHtml::link($item['descr'],array(
			'/'.$item['modulename'],
        	'usbox_uuid' => $item['uuid']
        ));
	}
	public function getNotBinded() {
		$result = array();
		if (!$this->data) return $result;
		foreach ($this->data as $item) {
			if (!$item['binded']) $result[] = array(
				'full_description' => '',
				'price' => '',
				'description' => $this->getLink($item)
			);
		}
		return $result;
	}
	private function regMatchInArray($needle,$haystack) {
        $i = 0;
        foreach ($haystack as $pattern) {
            if (@preg_match($pattern, $needle)) return $i;
            $i++;
        }
        return false;
    }
	private function getUuids() {
		if ($this->uuids === NULL) {
			$this->loadData();
		}
		return $this->uuids;
	} 
	public function getUuidMatch($item) {
		$match = $this->regMatchInArray($item['uuid'], $this->getUuids());
		if ($match === false) return false;
		$this->data[$match]['binded'] = true;
		if ($this->binded_usbox === NULL) $this->binded_usbox= new BindedUsboxList;
		$this->binded_usbox->add($item,$this->data[$match],$match);
	}
	public function getAgreementServiceFunctions($agrmid) {
		if ($this->binded_usbox === NULL) return array();
		return $this->binded_usbox->getData($agrmid);
	}
	public function loadData() {
		if ($this->data === NULL) {
			$model = new getClientServFuncs;
			$functions = $model->getList();
			$this->data = array();
			$this->uuids = array();
			foreach ($functions as $item) {
				$modulename = str_replace('action_', '', $item->savedfile);
				if (in_array($modulename, yii::app()->params['service_function_modules'])) {
					$this->data[] = $this->processList($item,$modulename);
					$this->uuids[] = $item->uuid;
				}
			}
		}
		return $this->data;
	}
}

class TarifList {
    private $categories;
	private $tarifid;
	private $agrmid;
	private $applied = array();
	private $not_applied = array();
    private $blocked;
	private static $service_functions = NULL;
	function __construct($agrmid, $tarifid, $blocked) {
		$this->agrmid = $agrmid;
		$this->tarifid = $tarifid;
        $this->blocked = $blocked;
	}
	public function getServiceFunctions() {
		return yii::app()->Services->getServiceFunctions();
	}
	public static function getAgreementServiceFunctions($agrmid) {
		$me = new self(0,0,0);
		return $me->getServiceFunctions()->getAgreementServiceFunctions($agrmid);
	}
    private function isNotAvailable( $item, $agrmid ) {
		if (!$item->available) return 'ServiceUnavailable';
        else return false;
    }
	private function getLink($item,$agrmid,$link) {
		$link = trim($link);
		$link_img = CHtml::image(Yii::app()->theme->baseUrl.'/i/b_info.gif','info');
		if ($link) $link = '&nbsp;	&nbsp;'.CHtml::link($link_img,$link,array('class' => 'no_border'));
        if ( $message = $this->isNotAvailable($item, $agrmid) ) return $item->catdescr.$link.' <em class="unavailable">('. yii::t('tariffs_and_services', $message) .')</em>';
		else {
			return CHtml::link($item->catdescr,array('services/choosevgroupforservice',
				'catidx' => $item->catidx,
				'tarifid' => $item->tarid,
				'common' => $item->common,
				'agrmid' => $agrmid
			)).$link;
	        } 
	}
	private function getCategory($id) {
        $categories = $this->getTarCategories();
        return $categories[$id];
	}
	private function processList($data,$agrmid) {
		$result = array();
		foreach ($data as $item) {
			$category = $this->getCategory($item->catidx);
			$service = array(
				'available' => $item->available,
				'catdescr' => $item->catdescr,
				'catidx' => $item->catidx,
				'link' => $category->link,
				'tarifid' => $item->tarid,
				'agrmid' => $agrmid,
				'uuid' => $item->uuid,
				'description' => $this->getLink($item,$agrmid,$category->link),
				'full_description' => $category->descrfull,
				'price' => Yii::app()->NumberFormatter->formatCurrency($item->above, Yii::app()->params["currency"])
			);
			if ($this->getServiceFunctions()->getUuidMatch($service) === false AND $this->shouldShow($item)) $result[] = $service;
		}
		return $result;
	}
	public function add($vgroup) {
		$model = new getVgroupServices;
		$model->vgid = $vgroup->vgid;
		$this->not_applied[] = $this->skipServices( $model->getList() );
		$model->applied = 1;
		$this->applied[] = $this->skipServices( $model->getList() );
	}
	private function skipServices( $services ) {
		$result = array();
		foreach( $services as $service ) {
            $service->dtvtype = $this->getCategory($service->catidx)->dtvtype;
			if (
                !yii::app()->getModule('Antivirus')->Antivirus->isAvailableAntivirusService( $service ) AND
                !DTVServices::getInstance()->ServiceIsPackage($service) AND
                !DTVServices::getInstance()->ServiceIsChannel($service)
            ) $result[] = $service;
		}
		return $result;
	}
	private function shouldShow($item) {
        if (yii::app()->getModule('turbo')) {
            if (preg_match(yii::app()->getModule('turbo')->categoryPrefix, $item->uuid)) {
                    return false;
            }
        }
		if ($item->available) return true;
		$applied = false;
		foreach ($this->applied as $vgroup) {
			if (!$vgroup) continue;
			foreach ($vgroup as $c) {
				if ($c->catidx == $item->catidx) $applied = true;
			}
		}
		return $applied;
	}
    private function getTarCategories() {
        if (!$this->categories) {
            foreach (yii::app()->lanbilling->getRows('getTarCategories', array('id' => $this->tarifid)) as $category) {
                $this->categories[$category->catidx] = $category;
            }
        }
        return $this->categories;
    }
	public function getData() {
		$result = array_merge($this->applied[0],$this->not_applied[0]);
		$result = $this->processList($result,$this->agrmid);
		return $result;
	}
}

class AgreementList {
	private $data;
	private $agrmid;
	function __construct($agrmid) {
		$this->agrmid = $agrmid;
	}
	public function add($vgroup) {
		if (!$this->data[$vgroup->tarifid]) $this->data[$vgroup->tarifid] = new TarifList( $vgroup->agrmid, $vgroup->tarifid, $vgroup->blocked );
		$this->data[$vgroup->tarifid]->add($vgroup);
	}
	public function getData() {
		$result = array();
		foreach ($this->data as $item) {
			$result = array_merge($result,$item->getData());
		}
		$rensoft = ServiceFunctionsList::getRensoft($this->agrmid);
		$result = array_merge($result,TarifList::getAgreementServiceFunctions($this->agrmid));
		return $result;
	}
}

class AgreementsList {
	private $data = array();
	public function add($vgroup) {
		if ($vgroup->tariftype != 5) return;
		if (!$this->data[$vgroup->agrmid]) $this->data[$vgroup->agrmid] = new AgreementList($vgroup->agrmid);
		$this->data[$vgroup->agrmid]->add($vgroup);
	}
	public function getData() {
		$agreements = array();
		foreach ($this->data as $k => $v) $agreements[$k] = $v->getData();
		$service_functions = yii::app()->Services->getServiceFunctions()->getNotBinded();
		return array(
			'agreements' => $agreements,
			'service_functions' => $service_functions
		);
	}
}

class ServicesList extends CApplicationComponent {
	private $service_functions = NULL;
	public function getServiceFunctions() {
		if ($this->service_functions === NULL) $this->service_functions = new ServiceFunctionsList;
		return $this->service_functions;
	}
	public function getList() {
		$vgroups = LBModel::get('getClientVgroups')->getList();
		$agreements = new AgreementsList;
		foreach ($vgroups as $vg) $agreements->add($vg->vgroup);
		return $agreements;
	}
} 

?>
