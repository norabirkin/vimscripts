<?php class Table {
    private $columns = array();
    private $data = array();
    private $title = "";
    private $localization = 'main';
    private $emptyMessage = 'Nothing found';
    private $rowPrintedHandler;
    private $rowClass;
    private $beforeRowPrintedHandler;
    private $top;
    private $pagingTotal;
    private $pagingPgnum;
    private $pagingPgsize;
    private $paging = false;
    private $pagingComponent;
    private $csv = false;
    private $displayPaging = true;
    private $hideOnEmpty = false;
    public function __construct($params) {
        $this->config($params);
    }
    public function getPagingTotal() {
        return $this->pagingComponent->getTotal();
    }
    private function config($params, $prefix = '') {
        if (!is_array($params)) {
            throw new Exception('Invalid config');
        }
        foreach ($params as $k => $v) {
            $setter = "set" . $prefix . ucfirst($k);
            if ( method_exists($this, $setter) ) $this->$setter($v);
            else throw new Exception( "No setter " . $setter );
        }
    }
    public function setDisplayPaging($value) {
        $this->displayPaging = (bool) $value;
    }
    public function setPaging($paging) {
        $this->paging = true;
        if (is_object($paging) AND $paging->isPaging()) {
            $this->pagingComponent = $paging;
        } else {
            $this->config($paging, 'Paging');
        }
    }
    public function setCsv($value) {
        $this->csv = (bool) $value;
    }
    public function setPagingTotal($value) {
        $this->pagingTotal = (int) $value;
    }
    public function setPagingPgnum($value) {
        $this->pagingPgnum = (int) $value;
    }
    public function setPagingPgsize($value) {
        $this->pagingPgsize = (int) $value;
    }
    public function setTop($value) {
        $this->top = (int) $value;
    }
    public function setRowClass($class) {
        $this->rowClass = $class;
    }
    private function setProcessor( $handler ) {
        $this->beforeRowPrintedHandler = $handler;
    }
    private function setRowPrintedHandler( $handler ) {
        $this->rowPrintedHandler = $handler;
    }
    private function rowPrinted( $row ) {
        if (!$this->rowPrintedHandler) return "";
        $object = $this->rowPrintedHandler[0];
        $method = $this->rowPrintedHandler[1];
        return $object->$method( $row );
    }
    private function beforeRowPrinted( $row ) {
        if (!$this->beforeRowPrintedHandler) return $row;
        $object = $this->beforeRowPrintedHandler[0];
        $method = $this->beforeRowPrintedHandler[1];
        return $object->$method( $row, $this );
    }
    public function setTitle( $title ) {
        $this->title = $title;
    }
    private function setColumns( $columns ) {
        $this->columns = $columns;
    }
    public function setData( $data ) {
        if (is_object($data) AND $data->isPagingRequest()) {
            $this->data = $data->result();
            $this->setPaging($data->paging());
        } else {
            if (!$data) {
                $data = array();
            }
            if (
                !is_array($data)
                AND
                !($data instanceof ArrayAccess)
            ) {
                $data = array($data);
            }
            $this->data = $data;
        }
    }
    private function getCsvData() {
        $data = array($this->getColumns());
        foreach ( $this->data as $item ) {
            $item = $this->beforeRowPrinted( $item );
            if (!$item) {
                continue;
            }
            $row = array();
            foreach (array_keys($this->columns) as $col) {
                $row[] = $item[$col];
            }
            $data[] = $row;
        }
        $csv = new LB_CSV;
        $csv->sendCSVHeaders('history.csv');
        echo $csv->arrayToCSV($data);
        die();
    }
    public function getRenderData() {
        if (
            !is_array($this->columns)
            OR
            (
                !is_array($this->data)
                AND
                !($this->data instanceof ArrayAccess)
            )
        ) throw new Exception("Invalid grid config");
        if ($this->csv) {
            return $this->getCsvData();
        }
        $head = $this->getHeaders();
        $body = $this->getBody();
        if(!$body) {
            if(!$this->displayPaging OR !$this->paging) { 
                return null;
            } else {
                return array(
                    "pager" => $this->getPager()
                );
            }
            
        }
        return array(
            "title" => $this->localize($this->title),
            "margin_top" => $this->top,
            "head" => $head,
            "body" => $body,
            "pager" => $this->getPager()
        );
    }
    public function render() {
        if (!$data = $this->getRenderData()) {
            return '';
        }
        if ($data['body']) {
            return yii::app()->controller->renderPartial("application.components.table.table", $data, true);
        } else {
            return yii::app()->controller->renderPartial("application.components.table.pagingOnly", $data, true);
        }
    }
    public function setEmptyMessage( $message ) {
        $this->emptyMessage = $message;
    }
    public function setLocalization( $file ) {
        $this->localization = $file;
    }
    private function localize( $str ) {
        if (!$this->localization OR !$str) {
            return $str;
        } else {
            if (is_array($str)) {
                return yii::t($this->localization, $str[0], $str[1]);
            } else {
                return yii::t($this->localization, $str);
            }
        }
    }
    private function getBody() {
        return $this->data ? $this->getRows() : $this->getEmpty();
    }
    private function getEmpty() {
        if ($this->hideOnEmpty) {
            return null;       
        }
        return yii::app()->controller->renderPartial( "application.components.table.empty", array(
            "count" => count( $this->columns ),
            "message" => $this->localize( $this->emptyMessage )
        ), true);
    }
    public function getColumns() {
        $columns = array();
        foreach ($this->columns as $column) {
            if (is_string($column)) {
                $column = array(
                    'title' => $column,
                    'width' => null
                );
            }
            $column['title'] = $this->localize($column['title']);
            $columns[] = $column;
        }
        return $columns;
    }
    private function getHeaders() {
        return yii::app()->controller->renderPartial( "application.components.table.headers", array(
            "columns" => $this->getColumns()
        ), true);
    }
    private function getRows() {
        $rows = "";
        $odd = true;
        $data = $this->data;
        foreach ( $data as $item ) {
            if (!$item = $this->beforeRowPrinted($item)) {
                continue;
            }
            $class = $odd ? "odd" : "even";
            if ($this->rowClass) $class .= " " . $this->rowClass;
            $row = yii::app()->controller->renderPartial( "application.components.table.row", array(
                "columns" => $this->getRow( $item ),
                "class" => $class
            ), true );
            $rows .= $row;
            $rows .= $this->rowPrinted( $item );
            $odd = !$odd;
        }
        if (!$rows) {
            return $this->getEmpty();
        }
        return $rows;
    }
    private function getRow( $item ) {
        $row = array();
        foreach( $this->columns as $k => $v ) {
            $row[] = is_array($item) ? $item[$k] : $item->$k;
        }
        return $row;
    }
    private function getPager() {
        if (!$this->paging) {
            return '';
        }
        if (!$this->pagingComponent) {
            $this->pagingComponent = $this->getPagingComponent(array(
                'total' => $this->pagingTotal,
                'page' => $this->pagingPgnum,
                'limit' => $this->pagingPgsize
            ));
        }
        if (!$this->displayPaging OR !($data = $this->pagingComponent->getData())) {
            return '';
        }
        return $this->renderPager($data);
    }
    private function renderPager($params) {
        return yii::app()->controller->renderPartial('application.components.agreements.pager', $params, true);
    }
    private function getPagingComponent($params) {
        yii::import('application.components.agreements.VGPager');
        return new VGPager($params);
    }
    public function setHideOnEmpty($value) {
        $this->hideOnEmpty = (bool) $value;
    }
} ?>
