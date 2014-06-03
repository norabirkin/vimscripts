<?php

class LB_Paging_Request {
    protected $fn;
    protected $params = array();
    private $total;
    private $result;
    private $pgnum;
    private $pgsize;
    private $paging;
    private $pgparam = 'page';
    private $showLimitSelect = false;
    public function __construct($fn, $params = array()) {
        $this->setFunction($fn);
        $this->setParams($params);
    }
    public function all() {
        return yii::app()->lanbilling->getRows($this->fn, $this->params);
    }
    public function isPagingRequest() {
        return true;
    }
    public function showLimitSelect() {
        $this->showLimitSelect = true;
        return $this;
    }
    public function pgparam($pgparam = null) {
        if (!$pgparam) {
            return $this->pgparam;
        }
        $this->pgparam = (string) $pgparam;
        return $this;
    }
    public function pgnum($pgnum = null) {
        if (!$pgnum) {
            return $this->getPageNum();
        }
        if ($this->pgnum === null) {
            $this->pgnum = (int) $pgnum;
        }
        return $this;
    }
    public function pgsize($pgsize = null) {
        if (!$pgsize) {
            return $this->getPageSize();
        }
        if ($this->pgsize === null) {
            $this->pgsize = $pgsize;
        }
        return $this;
    }
    private function getPageParamValue() {
        return $_GET[$this->pgparam];
    }
    private function getPageNum() {
        if (!$this->pgnum) {
            $this->pgnum = $this->getPageParamValue();
        }
        if (!$this->pgnum) {
            $this->pgnum = 1;
        }
        return $this->pgnum;
    }
    private function getPageSize() {
        if (!$this->pgsize) {
            $this->pgsize = $this->defaultPageSize(); 
        }
        return $this->pgsize;
    }
    private function defaultPageSize() {
        if ($this->showLimitSelect) {
            ClientScriptRegistration::addScript('limitSelect');
            if ((int) $_COOKIE['pg-size']) {
                return (int) $_COOKIE['pg-size'];
            } else {
                return (int) yii::app()->params['paging']['limit_select'][0];
            }
        }
        return (int) yii::app()->params['paging']['default_limit'];
    }
    private function setParams($params) {
        $this->params = (array) $params;
        if (!$this->params["flt"]) {
            $this->params["flt"] = array();
        }
    }
    private function setFunction($fn) {
        $this->fn = (string) $fn;
    }
    protected function getTotal() {
        $params = $this->params;
        $params["procname"] = $this->fn;
        return yii::app()->lanbilling->get('Count', $params);
    }
    protected function addPagingParams() {
        $params = $this->params;
        $params["flt"]["pgnum"] = $this->getPageNum();
        $params["flt"]["pgsize"] = $this->getPageSize();
        return $params;
    }
    protected function getResult() {
        return yii::app()->lanbilling->getRows($this->fn, $this->addPagingParams());
    }
    private function get() {
        $this->total = $this->getTotal();
        if (!$this->total) {
            $this->result = array();
        } else {
            $this->result = $this->getResult();
        }
    }
    public function total() {
        if ($this->result === null) {
            $this->get();
        }
        return $this->total;
    }
    public function result() {
        if ($this->result === null) {
            $this->get();
        }
        return $this->result;
    }
    public function paging() {
        if (!$this->paging) {
            $this->paging = $this->getPagingComponent(array(
                'total' => $this->total(),
                'page' => $this->pgnum(),
                'limit' => $this->pgsize(),
                'param' => $this->pgparam(),
                'showLimitSelect' => $this->showLimitSelect
            ));
        }
        return $this->paging;
    }
    private function getPagingComponent($params) {
        yii::import('application.components.agreements.VGPager');
        return new VGPager($params);
    }
}

?>
