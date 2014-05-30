<?php class ServicesManager {
    private $params;
    private static $cache = array();
    public function __construct($params) {
        $this->params = $params;
    }
    public static function stop($params) {
        $me = new self($params);
        return $me->stopService();
    }
    public static function get($params) {
        $key = md5(serialize($params));
        if (self::$cache[$key]) {
            return self::$cache[$key];
        }
        $me = new self($params);
        $result = $me->getServices();
        self::$cache[$key] = $result;
        return $result;
    }
    private function stopService() {
        foreach(self::get(array(
            'vgid' => $this->params['vgid'],
            'needcalc' => 1
        )) as $service) {
            if ($service->servid == $this->params['id']) {
                if (!$service->state) {
                    return $this->delUsboxService();
                } else {
                    return $this->stopUsboxService();
                }
            }
        }
        throw new Exception('Service not found');
    }
    private function delUsboxService() {
        return yii::app()->controller->lanbilling->delete('delUsboxService', array(
            'id' => $this->params['id']
        ));
    }
    private function stopUsboxService() {
        return Yii::app()->controller->lanbilling->get('stopUsboxService', array(
            'id' => $this->params['id'],
            'timeto' => ''
        ));
    }
    private function getUsboxServices($state) {
        $result = array();
        $params = array(
            'state' => $state,
            'common' => isset($this->params['common']) ? $this->params['common'] : -1,
            'tarid' => 0,
            'category' => -1,
            'needcalc' => $this->params['needcalc'],
            'vgid' => $this->params['vgid']
        );
        $key = md5('getUsboxServices' . serialize($params));
        if (isset(self::$cache[$key])) {
            return self::$cache[$key];
        }
        $services = yii::app()->controller->lanbilling->getRows('getUsboxServices', array(
            'flt' => $params
        ));
        foreach ($services as $service) {
            $result[] = (object) array(
                'state' => $state,
                'servid' => $service->service->servid,
                'catidx' => $service->service->catidx,
                'tarid' => $service->service->tarid,
                'timeto' => $service->service->timeto,
                'common' => $service->common,
                'timefrom' => $service->service->timefrom,
                'tardescr' => $service->tardescr,
                'catdescr' => $service->catdescr
            );
        }
        self::$cache[$key] = $result;
        return $result;
    }
    private function assigned() {
        $services = $this->getUsboxServices(0);
        foreach ($this->getUsboxServices(1) as $service) {
            $services[] = $service;
        }
        return $services;
    }
    private function notAssigned() {
        $ids = array();
        $result = array();
        $services = $this->getVgroupServices();
        foreach (self::get(array_merge($this->params, array('needcalc' => 1))) as $service) {
            $ids[] = $service->catidx .'.'. $service->tarid;
        }
        foreach ($services as $service) {
            if (!in_array(($service->catidx .'.'. $service->tarid), $ids)) {
                $result[] = $service;
            }
        }
        return $result;
    }
    private function getVgroupServices() {
        $params = array(
            'vgid' => $this->params['vgid'], 
            'common' => isset($this->params['common']) ? $this->params['common'] : -1, 
            'unavail' => -1, 
            'state' => 0, 
            'needcalc' => $this->params['needcalc'], 
            'defaultonly' => 1 
        );
        $key = md5('getVgroupServices' . serialize($params));
        if (isset(self::$cache[$key])) {
            return self::$cache[$key];
        }
        $result = yii::app()->controller->lanbilling->getRows('getVgroupServices', array('flt' => $params )); 
        self::$cache[$key] = $result;
        return $result;
    }
    private function getServices() {
        if ($this->params['needcalc'] == 1) {
            return $this->assigned();
        } else {
            return $this->notAssigned();
        }
    }
} ?>
