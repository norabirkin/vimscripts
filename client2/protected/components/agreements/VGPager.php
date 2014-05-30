<?php class VGPager {
    private $total;
    private $page;
    private $route;
    private $params;
    private $limit;
    private $param = 'page';
    private $showLimitSelect = false;
    public function __construct( $params ) {
        $this->limit = $params["limit"];
        $this->total = $params["total"];
        $this->page = $params["page"];
        $this->setRoute($params["route"]);
        $this->setParams($params["params"]);
        if ($params['param']) {
            $this->setPageParam($params['param']);
        }
        if (isset($params['showLimitSelect'])) {
            $this->showLimitSelect = (bool) $params['showLimitSelect'];
        }
    }
    public function setRoute($route) {
        if (!$route) {
            $this->route = yii::app()->controller->route;
        } else {
            $this->route = (string) $route;
        }
    }
    public function setPageParam($param) {
        if (!$this->param) {
            return;
        }
        $this->param = $param;
    }
    public function setParams($params) {
        if ($params === null) {
            $params = $_GET;
            unset($params['r']);
        }
        if (!$params) {
            $params = array();
        }
        $this->params = $params;
    }
    public function isPaging() {
        return true;
    }
    public function getTotal() {
    	return $this->total;
    }
    private function getPageLimit() {
        if (!$this->limit) {
            $this->limit = yii::app()->params["PageLimit"];
        }
        return $this->limit;
    }
    private function getPages() {
        return ceil($this->total / $this->getPageLimit());
    }
    private function getPagesData() {
        $pages = array();
        for ( $i = 1; $i <= $this->getPages(); $i ++ ) {
            $pages[] = array(
                "page_selected" => $this->page == $i ? " selected" : "",
                "page_href" => $this->page == $i ? "" : $this->getUrl($i),
                "page_number" => $i
            );
        }
        return $pages;
    }
    private function getUrl($page) {
        return yii::app()->controller->createUrl( $this->route, array_merge($this->params, array($this->param => $page)) );
    }
    private function getPrevious() {
        return ($page = $this->page - 1) ? array(
            "previous_href" => $this->geturl($page),
            "previous_hidden" => ""
        ) : array(
            "previous_href" => "",
            "previous_hidden" => " hidden"
        );
    }
    private function getNext() {
        return (($page = $this->page + 1) <= $this->getPages()) ? array(
            "next_hidden" => "",
            "next_href" => $this->getUrl($page)
        ) : array(
            "next_hidden" => " hidden",
            "next_href" => ""
        );
    }
    private function getFirst() {
        return ($this->page == 1) ? array(
            "first_href" => "",
            "first_hidden" => " hidden",
        ) : array(
            "first_href" => $this->getUrl(1),
            "first_hidden" => "",
        );
    }
    private function getLast() {
        return ($this->page == $this->getPages()) ? array(
            "last_hidden" => " hidden",
            "last_href" => ""
        ) : array(
            "last_hidden" => "",
            "last_href" => $this->getUrl($this->getPages())
        );
    }
    private function getSummary() {
        return array(
            'first_element_on_page_index' => ($this->page == 1) ? 1 : ((($this->page - 1) * $this->limit) + 1),
            'last_element_on_page_index' => ($this->page == $this->getPages()) ? $this->total : $this->page * $this->limit
        );
    }
    public function getData() {
        if ($this->getPages() <= 1) {
            if ($this->showLimitSelect) {
                return array(
                    'limitSelectOnly' => true,
                    'limit' => $this->limit
                );
            } else {
                return null;
            }
        }
        $data = array( "pages" => $this->getPagesData() );
        $data = array_merge($data, $this->getPrevious());
        $data = array_merge($data, $this->getNext());
        $data = array_merge($data, $this->getFirst());
        $data = array_merge($data, $this->getLast());
        $data = array_merge($data, $this->getSummary());
        $data["total"] = $this->total;
        $data['limit'] = $this->limit;
        $data['showLimitSelect'] = $this->showLimitSelect;
        return $data;
    }
} ?>
