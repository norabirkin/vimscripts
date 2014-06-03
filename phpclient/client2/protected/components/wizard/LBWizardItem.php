<?php class LBWizardItem {
    protected $wizard;
    private $vgroups;
    private $services = array();
    private static $tariffs = array();
    public function setWizard(LBWizard $wizard) {
        $this->wizard = $wizard;
    }
    public function init() {
        return;
    }
    public function gridGroup($items) {
        return new Grid_Group($items);
    }
    public function absUrl($route, $params = array()) {
        return (
            yii::app()->request->getIsSecureConnection()?
            'https'
            :
            'http'
        ).
        '://'.
        $_SERVER["HTTP_HOST"].
        yii::app()->controller->createUrl($route, $params);
    }
    public function option($name) {
        return $this->lb()->getOption($name);
    }
    public function cache() {
        if (!$this->cache) {
            $this->cache = new LB_Cache;
        }
        return $this->cache;
    }
    public function wizard() {
        return $this->wizard;
    }
    public function curl($params = array()) {
        return $this->wizard()->curl($params);
    }
    public function current() {
        return $this->wizard()->getCurrentStep();
    }
    public function subtitle() {
        $this->wizard()->subtitle();
    }
    protected function helper() {
        return $this->wizard()->helper();
    }
    public function prev() {
        return $this->wizard()->getPreviousStep();
    }
    public function tariff($id) {
        if (!self::$tariffs[$id]) {
            self::$tariffs[$id] = $this->g('getTarif', array(
                'id' => $id
            ));
        }
        if (!self::$tariffs[$id]) {
            throw new Exception('Tariff not found');
        }
        return self::$tariffs[$id];
    }
    protected function tarstaff($vgid = null) {
        if (!($tarstaff = $this->arr($this->vgroup($vgid)->tarstaff))) {
            throw new Exception('No tariffs available for change');
        }
        return $tarstaff;
    }
    protected function tarrasp($vgid = null) {
        return $this->arr($this->vgroup($vgid)->tarrasp);
    }
    protected function vgroups($agrmid = null) {
        if (!$this->vgroups) {
            $this->vgroups = new Vgroups_Data;
        }
        return $this->vgroups->vgroups($agrmid);
    }
    protected function vgroup($vgid = null) {
        if (!$this->vgroups) {
            $this->vgroups = new Vgroups_Data;
        }
        if (!$vgid) {
            $vgid = $this->param('vgid');
        }
        return $this->vgroups->vgroup($vgid);
    }
    protected function agreement($agrmid = null) {
        if (!$agrmid) {
            if (!($agrmid = $this->param('agrmid'))) {
                if ($this->param('vgid')) {
                    $agrmid = $this->vgroup()->vgroup->agrmid;
                }
            }
        }
        if (!($agreement = $this->lb()->agreements[$agrmid])) {
            throw new Exception('Agreement not found');
        }
        return $agreement;
    }
    public function form($config = array()) {
        yii::import('application.components.form.*');
        return new LB_Form($config);
    }
    public function fnext($config = array()) {
        return $this->wizard->createForm($config, true);
    }
    public function fcurr($config = array()) {
        return $this->wizard->createForm($config, false);
    }
    public function lnext($text, $params = array(), $options = array()) {
        return $this->wizard->getStepLink($text, $params, true, $options);
    }
    public function lcurr($text, $params = array(), $options = array()) {
        return $this->wizard->getStepLink($text, $params, false, $options);
    }
    public function link($text, $step, $params = array(), $remove = array(), $options = array()) {
        if (is_string($params)) {
            $url = $params;
        } else {
            $url = $this->wizard()->getStepUrl($step, $params, $remove);
            $url = array_merge(array( $url["route"] ), $url["params"]);
        }
        return CHtml::link(
            yii::t('main', $text),
            $url,
            $options
        );
    }
    public function url($step, $params = array(), $remove = array()) {
        $url = $this->wizard()->getStepUrl($step, $params, $remove);
        return yii::app()->controller->createUrl($url["route"], $url["params"]);
    }
    public function price($value, $currency = null) {
        return LB_Style::price($value, $currency);
    }
    public function t($str, $params = array()) {
        if (is_array($str)) {
            $params = $str[1];
            $str = $str[0];
        }
        $result = yii::t('main', $str, $params);
        return trim($result);
    }
    public function param($name, $default = null) {
        if (($param = $this->wizard->getParam($name)) !== null) {
            return $param;
        } else {
            return $default;
        }
    }
    public function logParams() {
        $this->wizard->logParams();
    }
    public function noDate($date) {
        return $date == '9999-12-31 23:59:59' OR $date == '9999-12-31' OR $date == '0000-00-00 00:00:00' OR $date == '0000-00-00' OR !$date;
    }
    public function date($date, $default = '----') {
        if ($this->noDate($date)) {
            return $default;
        }
        if (!is_numeric($date)) {
            $date = strtotime($date);
        }
        return yii::app()->controller->formatDate($date);
    }
    public function time($date, $default = '----') {
        if ($this->noDate($date)) {
            return $default;
        }
        return yii::app()->controller->formatDateWithTime($date);
    }
    public function lb() {
        return yii::app()->lanbilling;
    }
    public function grid($config) {
        return new Table($config);
    }
    public function g($fn, $params = array()) {
        return yii::app()->lanbilling->get($fn, $params);
    }
    public function a($fn, $params = array()) {
        return yii::app()->lanbilling->getRows($fn, $params);
    }
    public function s($fn, $val, $isInsert = false) {
        if (!yii::app()->lanbilling->save($fn, $val, $isInsert)) {
            return false;
        }
        if (yii::app()->lanbilling->saveReturns->ret) {
            return yii::app()->lanbilling->saveReturns->ret;
        } else {
            return true;
        }
    }
    public function p($fn, $params = array(), $options = array()) {
        yii::import('application.components.paging.*');
        if ($options['stat']) {
            return new LB_Paging_Request_Stat($fn, $params);
        } else {
            return new LB_Paging_Request($fn, $params);
        }
    }
    public function d($fn, $params) {
        return yii::app()->lanbilling->delete($fn, $params);
    }
    public function arr($val) {
        if (!$val) {
            return array();
        }
        if (!is_array($val)) {
            return array($val);
        }
        return $val;
    }
    public function flash($type, $message) {
        yii::app()->user->setFlash($type, $this->t($message));
    }
    public function bytesToMb($value) {
        return yii::app()->lanbilling->bytesToMb($value);
    }
    public function secondsToString($value) {
        return yii::app()->lanbilling->secondsToString($value);
    }
    private function getTarCategories($params) {
        $id = $params['id'];
        if (!$id) {
            throw new Exception('No tariff');
        }
        if (!isset($this->tarCategories[$id])) {
            $this->tarCategories[$id] = array();
            $result = $this->a('getTarCategories', array(
                'id' => $id
            ));
            foreach ($result as $item) {
                $this->tarCategories[$id][$item->catidx] = $item;
            }
        }
        return $this->tarCategories[$id];
    }
    private function tariffCategory($params) {
        $items = $this->getTarCategories(array('id' => $params['tarid']));
        $result = $items[(int) $params['catidx']];
        if (!$result) {
            throw new Exception('Category not found');
        }
        return $result;
    }
    private function getUsboxServices($params) {
        if ($params['vgid']) {
            $services = $this->a('getUsboxServices', array(
                'flt' => array(
                    'dtfrom' => date('Y-m-d H:i:s'),
                    'dtto' => '9999-12-31 23:59:59',
                    'needcalc' => $params['needcalc'],
                    'vgid' => $params['vgid']
                )
            ));
            foreach ($services as $service) {
                $service->uuid = $this->tariffCategory(array(
                    'tarid' => $service->service->tarid, 
                    'catidx' => $service->service->catidx
                ))->uuid;
            }
        } else {
            $services = array();
            foreach (array_keys($this->vgroups()) as $vgid) {
                foreach ($this->services(array_merge($params, array(
                    'vgid' => $vgid
                ))) as $service) {
                    $services[] = $service;
                }
            }
        }
        $this->services[$this->servicesKey($params)] = $services;
        return $services;
    }
    /*
    $this->services(107)->idle();
    $this->services(107)->active(true);
    $this->services(107)->scheduled();
    $this->services(107)->schedule(array(
        'dtfrom' => '2013-12-26',
        'dtto' => '2014-03-06',
        'catidx' => 4
    ));
    $this->services(107)->stop(array(
        'dtto' => '2014-03-06',
        'servid' => 5233
    ));
    */
    private function getVgroupServices($params) {
        return $this->a('getVgroupServices',array(
            'flt' => array(
                'vgid' => $params['vgid'],
                'servid' => $params['needcalc'] ? -1 : 0, 
                'unavail' => (isset($params['unavail']) ? $params['unavail'] : -1),
                //'defaultonly' => 1
            )
        ));
    }
    private function servicesKey($params) {
        $key = array();
        foreach (array('vgid', 'needcalc', 'distinct') as $item) {
            $key[] = $item.'='.((int) $params[$item]);
        }
        return implode('.',$key);
    }
    public function services($params) {
        if ($data = $this->services[$this->servicesKey($params)]) {
            return $data;
        }
        if ($params['distinct']) {
            return $this->getVgroupServices($params);
        } else {
            return $this->getUsboxServices($params);
        }
    }
    public function index($data, $pk) {
        $result = array();
        $pk = explode('.',$pk);
        foreach ($data as $item) {
            $v = $item;
            foreach ($pk as $p) {
                $v = $v->$p;
            }
            $result[$v] = $item;
        }
        return $result;
    }
    public function usbox($params = array()) {
        return new LB_Usbox($params);
    }
    public function assocIns($array, $index, $k, $v) {
        $i = 0;
        $data = array();
        foreach ($array as $key => $value) {
            if ($i == $index) {
                $data[$k] = $v;
            }
            $data[$key] = $value;
            $i ++;
        }
        return $data;
    }
    public function nextMonthFirstDay($time) {
        $month = date('n',$time);
        $year = date('Y',$time);
        if ($month == 12) {
            $month = 1;
            $year = $year + 1;
        } else {
            $month = $month + 1;
        }
        return mktime(0, 0, 0, $month, 1, $year);
    }
} ?>
