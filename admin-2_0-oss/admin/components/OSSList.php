<?php
class OSSList {

    private $useSort = true;
    private $sortProperties;
    private $defaultLimit = 100;
    private $fields;

    public function __construct( $conf = array() ) {
        foreach ($conf as $k => $v) {
            $this->$k = $v;
        }
    }

    protected function getFields() {
        return array(
            'pg_num' => 'pg_num',
            'pg_size' => 'pg_size'
        );
    }

    private function pagingParams() {
        if ($this->param("alldata")) {
            return array();
        }
        $params = array();
        $fields = $this->getFields();
        $params[ $fields['pg_num'] ] = (int) $this->param( "page", 1 );
        $params[ $fields['pg_size'] ] = (int) $this->param( "limit", $this->defaultLimit );
        return $params;
    }

    private function param( $paramName, $defaultValue = null ) {
        return yii::app()->controller->param(  $paramName, $defaultValue );
    }

    private function getSortPropertyName( $name ) {
        if (!$this->sortProperties) {
            return $name;
        }
        return $this->sortProperties[ $name ];
    }

    private function getSortItem( $sort ) {
        if (!($property = $this->getSortPropertyName( $sort["property"] ))) {
            return null;
        }
        return array(
            "ascdesc" => ($sort[ "direction" ] == "DESC" ? 1 : 0),
            "name" => $property
        );
    }

    private function sortParams() {
        if (!$this->useSort) {
            return null;
        }
        if (!$this->param("sort")) {
            return null;
        }
        $sortParams = array();
        $sort = CJSON::decode( $this->param("sort"), true );
        foreach ($sort as $item) {
            if ($item = $this->getSortItem($item)) {
                $sortParams[] = $item;
            }
        }
        return $sortParams;
    }

    private function success( $result, $total ) {
        if ($this->param("alldata")) {
            yii::app()->controller->success($this->process($result->getResult()));
        } else {
            yii::app()->controller->success($this->process($result->getResult()), $total->getResult());
        }
    }

    protected function totalRequest( $method, $params ) {
        return yii::app()->japi->call($method, array_merge($params, array(
            "count" => true,
            "nodata" => true
        )));
    }

    private function getTotal( $method, $params ) {
        if ($this->param("alldata")) {
            return null;
        }
        return $this->totalRequest( $method, $params );
    }

    public function fields($fields) {
        $this->fields = $fields;
        return $this;
    }

    private function process($data) {
        if (!$this->fields) {
            return $data;
        } else {
            $result = array();
            foreach ($data as $row) {
                $item = array();
                foreach ($this->fields as $name) {
                    $item[$name] = $row[$name];
                }
                $result[] = $item;
            }
            return $result;
        }
    }

    public function getList( $method, $params = array() ) {
        $total = $this->getTotal( $method, $params );
        $params = array_merge( $params, $this->pagingParams() );
        if ($sortParams = $this->sortParams()) {
            $params[ "sort" ] = $sortParams;
        }
        $result = yii::app()->japi->call( $method, $params );
        yii::app()->japi->send(true);
        return array( "result" => $result, "total" => $total );
    }
        
    public function get( $method, $params = array() ) {
        $list = $this->getList( $method, $params );
        $this->success( $list["result"], $list["total"] );
    }
} ?>
