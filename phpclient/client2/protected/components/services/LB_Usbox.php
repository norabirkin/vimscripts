<?php

class LB_Usbox {
    protected $vgid;
    protected $unavail = -1;
    protected $uuid;
    protected $dtvtype = -1;
    protected $common = -1;
    protected $keepturnedon = -1;
    protected $tarifid = 0;
    protected $periodic = false;
    static protected $cache = array();
    private $vgroups;
    public function __construct($params = array()) {
        if ($params['vgid']) {
            $this->vgid = (int) $params['vgid'];
        }
        if ($params['periodic']) {
            $this->periodic = (bool) $params['periodic'];
        }
        if ($params['tarifid']) {
            $this->tarifid = (int) $params['tarifid'];
        }
        if (isset($params['unavail'])) {
            $this->unavail = (int) $params['unavail'];
        }
        if (isset($params['common'])) {
            $this->common = (int) $params['common'];
        }
        if (isset($params['dtvtype'])) {
            $this->dtvtype = (int) $params['dtvtype'];
        }
        if (isset($params['uuid'])) {
            $this->uuid = (string) $params['uuid'];
        }
    }
    private function processDate($date) {
        $date = (string) $date;
        if (!$date) {
            return '';
        }
        if ($date == date('Y-m-d')) {
            return '';
        }
        return $date . ' 00:00:00';
    }
    private function checkPeriod($timefrom, $timeto) {
        foreach (array($timefrom, $timeto) as $date) {
            $date = (string) $date;
            if ($date AND !preg_match('/[0-9]{4}-[0-9]{2}-[0-9]{2}/', $date)) {
                throw new Exception('Invalid date');
            }
        }
        if (!$timeto) {
            return true;
        }
        if (!$timefrom) {
            $timefrom = date('Y-m-d');
        }
        if (strtotime($timeto) <= strtotime($timefrom)) {
            throw new Exception('Invalid date');
        }
        return true;
    }
    public function schedule($params, $multiple = false) {
        if (!isset($params['catidx'])) {
            throw new Exception('Invalid params');
        }
        $vgid = $this->vgid ? $this->vgid : (int) $params['vgid'];
        if (!$vgid) {
            throw new Exception('No vgid');
        }
        $usbox = new self(array(
            'vgid' => $vgid,
            'unavail' => 0
        ));
        $category = $usbox->categories()->all()->get((int) $params['catidx']);
        if (
            !$category
            OR
            (
                !$multiple
                AND $category->common
                AND $category->state != 'idle'
            )
        ) {
            throw new Exception('Invalid category');
        }
        $this->checkPeriod($params['timefrom'], $params['timeto']);
        $timefrom = $this->processDate($params['timefrom']);
        $timeto = $this->processDate($params['timeto']);
        return $this->s('insupdClientUsboxService', array(
            'vgid' =>  $vgid,
            'tarid' =>  $this->vgroup($vgid)->vgroup->tarifid,
            'catidx' =>  (int) $params['catidx'],
            'mul' =>  ((int) $params['mul']) ? ((int) $params['mul']) : 1,
            'comment' => $params['comment'],
            'common' => $category->common,
            'timefrom' => $timefrom,
            'timeto' => $timeto,
            'externaldata' => (string) $params['externaldata']
        ), true);
    }
    public function cancel($id) {
        if (!((int) $id)) {
            throw new Exception('Invalid params');
        }
        $usbox = new self;
        if (!$usbox->scheduled()->get((int) $id))  {
            throw new Exception('Invalid service');
        } 
        return yii::app()->controller->lanbilling->delete('delUsboxService', array(
            'id' => $id
        ));
    }
    public function stop($params) {
        if (!$params['servid']) {
            throw new Exception('Invalid params');
        }
        $usbox = new self;
        if (!$usbox->active()->get((int) $params['servid']))  {
            throw new Exception('Invalid service');
        } 
        return $this->g('stopUsboxService', array(
            'id' => (int) $params['servid'],
            'unavail' => 0,
            'timeto' => ((string) $params['timeto']) ? ((string) $params['timeto']) : ''
        ));
    }
    protected function params() {
        return array(
            'vgid' => $this->vgid,
            'unavail' => $this->unavail,
            'common' => $this->common,
            'dtvtype' => $this->dtvtype,
            'periodic' => $this->periodic,
            'tarifid' => $this->tarifid,
            'keepturnedon' => $this->keepturnedon,
            'uuid' => $this->uuid
        );
    }
    public function categories($classname = null) {
        if (!$classname) {
            $classname = 'LB_Usbox_Categories';
        }
        return new $classname($this->params());
    }
    private function getUsboxServices($params = array()) {
        $cache = new LB_Cache;
        $data = array();
        if (!$this->periodic) {
            $result = $this->a('getUsboxServices', array(
                'flt' => array_merge(array(
                    'unavail' => $this->unavail,
                    'common' => $this->common,
                    'vgid' => $this->vgid
                ), $params)
            ));
        } else {
            $result = array_merge(
                $this->a('getUsboxServices', array(
                    'flt' => array_merge(array(
                        'unavail' => $this->unavail,
                        'common' => 1,
                        'vgid' => $this->vgid
                    ), $params)
                )),
                $this->a('getUsboxServices', array(
                    'flt' => array_merge(array(
                        'unavail' => $this->unavail,
                        'common' => 2,
                        'vgid' => $this->vgid
                    ), $params)
                )),
                $this->a('getUsboxServices', array(
                    'flt' => array_merge(array(
                        'unavail' => $this->unavail,
                        'common' => 3,
                        'vgid' => $this->vgid
                    ), $params)
                ))
            );
        }
        foreach ($result as $service) {
            if ($service = $this->addCategoryProperties($service)) {
                if ($params['needcalc'] AND $params['state']) {
                    $service->state = 'active';
                }
                if ($params['needcalc'] AND !$params['state']) {
                    $service->state = 'scheduled';
                }
                if (!$params['needcalc'] AND !$params['state']) {
                    $service->state = 'idle';
                }
                $data[] = $service;
            }
        }
        $data = new LB_Usbox_Array($cache->index('service.servid', $data));
        return $data;
    }
    protected function rate($service) {
        return $service->service->rate;
    }
    protected function discounted($service) {
        $service->above = ceil($service->above * $this->rate($service) * 10) / 10;
        return $service;
    }
    private function addCategoryProperties($service) {
        $category = $this->category(array(
            'tarid' => $service->service->tarid,
            'catidx' => $service->service->catidx
        ));
        if ($this->unavail != -1 AND ((bool) $this->unavail) == ((bool) $category->available)) {
            return null;
        }
        if ($this->dtvtype != -1 AND $category->dtvtype != $this->dtvtype) {
            return null;
        }
        if ($this->uuid AND $category->uuid != $this->uuid) {
            return null;
        }
        if ($this->keepturnedon != -1 AND $category->keepturnedon != $this->keepturnedon) {
            return null;
        }
        $service->available = $category->available;
        $service->autoassign = $category->autoassign;
        $service->dtvtype = $category->dtvtype;
        $service->keepturnedon = $category->keepturnedon;
        $service->uuid = $category->uuid;
        $service->above = $service->catabove;
        $service->descr = $service->catdescr;
        $service->catidx = $service->service->catidx;
        $service->descrfull = $category->descrfull;
        $service->tarifdescr = $service->tardescr;
        $service->tarid = $category->tarid;
        $service->link = $category->link;
        $service->error = $this->error($service);
        $service->vgid = $this->vgid;
        return $this->discounted($service);
    }
    private function category($params) {
        foreach ($this->tarCategories($params['tarid']) as $category) {
            if ($category->catidx == $params['catidx']) {
                return $category;
            }
        }
        return null;
    }
    protected function tarCategories($tarid) {
        return $this->a('getTarCategories', array(
            'id' => $tarid
        ));
    }
    public function active() {
        $cache = new LB_Cache;
        if ($cached = $cache->get('usbox.active', $this->params())) {
            return $cached;
        }
        $data = $this->getUsboxServices(array(
            'needcalc' => 1,
            'state' => 1
        ));
        $cache->set('usbox.active', $this->params(), $data);
        return $data;
    }
    public function idle() {
        $cache = new LB_Cache;
        if ($cached = $cache->get('usbox.idle', $this->params())) {
            return $cached;
        }
        $data = $this->getUsboxServices(array(
            'needcalc' => 0,
            'state' => 0
        ));
        $cache->set('usbox.idle', $this->params(), $data);
        return $data;
    }
    public function all($state = true) {
        $cache = new LB_Cache;
        if (!$state) {
            return $this->getUsboxServices();
        }
        if ($cached = $cache->get('usbox.all', $this->params())) {
            return $cached;
        }
        $data = array();
        foreach ($this->scheduled() as $service) {
            $data[] = $service;
        }
        foreach ($this->active() as $service) {
            $data[] = $service;
        }
        foreach ($this->idle() as $service) {
            $data[] = $service;
        }
        $data = new LB_Usbox_Array($data);
        $cache->set('usbox.all', $this->params(), $data);
        return $data;
    }
    public function scheduled() {
        $cache = new LB_Cache;
        if ($cached = $cache->get('usbox.scheduled', $this->params())) {
            return $cached;
        }
        $cache->set('usbox.scheduled', $this->params(), $data);
        $data = $this->getUsboxServices(array(
            'needcalc' => 1,
            'state' => 0
        ));
        return $data;
    }
    private function key($fn, $params) {
        $key = md5(serialize($params).$fn); 
    }
    protected function a($fn, $params = array()) {
        $key = md5(serialize($params).$fn); 
        if (self::$cache[$key]) {
            return self::$cache[$key];
        }
        self::$cache[$key] = yii::app()->lanbilling->getRows($fn, $params);
        return self::$cache[$key];
    }
    protected function g($fn, $params = array()) {
        $key = md5(serialize($params).$fn); 
        if (self::$cache[$key]) {
            return self::$cache[$key];
        }
        self::$cache[$key] = yii::app()->lanbilling->get($fn, $params);
        return self::$cache[$key];
    }
    protected function s($fn, $params = array(), $isInsert = false) {
        return yii::app()->lanbilling->save($fn, $params, $isInsert);
    }
    protected function vgroup($vgid) {
        if (!$this->vgroups) {
            $this->vgroups = new Vgroups_Data;
        }
        return $this->vgroups->vgroup($vgid);
    }
    protected function agreement($agrmid) {
        $result = yii::app()->lanbilling->agreements[$agrmid];
        if (!$result) {
            throw new Exception('No agreement');
        }
        return $result;
    }
    protected function errors() {
        return array('available');
    }
    protected function error($service) {
        foreach ($this->errors() as $method) {
            if ($message = LB_Usbox_Error::$method($service)) {
                return $message;
            }
        }
        return false;
    }
}

?>
