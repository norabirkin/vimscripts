<?php
class Catalog {
    
    protected $type;
    private $id;
    private $csv;
    private static $catalog_classes = array(
        1 => "IPCatalog",
        2 => "ASCatalog",
        3 => "TelCatalog"
    );
    
    function __construct( $config = null ) {
        if ($id = (int) $config["id"]) {
            $this->id = $id;
        }
        $this->csv = new CSV;
    }
    
    public function getCatalogsTree() {
        $operators = array();
        $operators_indexes = array();
        $operator_index = 0;
        $tree = array();
        $params = array();
        if (yii::app()->controller->param("type")) {
            $params[ "type" ] = (int) yii::app()->controller->param("type");
        }
        if (yii::app()->controller->param("name")) {
            $params[ "name" ] = yii::app()->controller->param("name");
        }
        if (!$params) {
            $params = null;
        }
        foreach (yii::app()->japi->callAndSend( 'getCatalogs', $params ) as $catalog) {
            if ( !in_array($catalog["operator_id"], $operators) ) {
                $operators[ $operator_index ] = $catalog["operator_id"];
                $operators_indexes[ $catalog["operator_id"] ] = $operator_index;
                $tree[ $operators_indexes[$catalog["operator_id"]] ] = array(
                    "clickable" => false,
                    "text" => $catalog["operator_name"],
                    "operator_id" => $catalog["operator_id"],
                    "children" => array()
                );
                $operator_index ++;
            }
            $tree[ $operators_indexes[$catalog["operator_id"]] ]["children"][] = array(
                'leaf' => true,
                "clickable" => true,
                'id' => $catalog["catalog_id"],
                "operator_id" => $catalog["operator_id"],
                'text' => $catalog["name"],
                'type' =>$catalog["type"],
                'used' => $catalog["used"]
            );
        }
        return array( "root" => true, "text" => ".", "expanded" => true, "children" => $tree );
    }

    public function getZonePaginated() {
        return $this->getZones( true );
    }
    
    public function getPagingParams() {
        return array(
            "pg_num" => (int) yii::app()->controller->param("page", 0),
            "pg_size" => (int) yii::app()->controller->param("limit", 5)
        );
    }
    
    public function getZones( $paging = false ) {
        $params = array( "catalog_id" => $this->id );
        foreach ($this->attributes as $k => $v) {
            if ($v["filter"] AND ( $param = yii::app()->controller->param($k) )) {
                if ($v["type"] == "int") {
                    $param = (int) $param;
                }
                $params[ $k ] = $param;
            }
        };
        if (yii::app()->controller->param('fullsearch')) {
            $params['fullsearch'] = yii::app()->controller->param('fullsearch');
        }
        if ( $paging ) {
            $total = yii::app()->japi->call( $this->api["get"], array_merge( $params, array("count" => true) ) );
            $params = array_merge( $params, $this->getPagingParams() );
        }
        $zones = yii::app()->japi->call( $this->api["get"], $params );
        yii::app()->japi->send( true );
        $zones = $zones->getResult();
        foreach ($zones as $k => $v) {
            $zones[$k]["catalog_type"] = $this->type;
            $zones[$k] = $this->rowProcess( $zones[$k] );
        }
        $zones = $this->resultProcess( $zones );
        if ( $paging ) {
            return array(
                "items" => $zones,
                "total" => $total->getResult()
            );
        } else {
            return $zones;
        }
    }
    
    protected function rowProcess( $row ) {
        return $row;
    }
    
    protected function resultProcess( $result ) {
        return $result;
    }
    
    public function delZone( $id ) {
        return yii::app()->japi->callAndSend( $this->api["del"], array(
            "zone_id" => (int) $id
        ));
    }
    
    public function delZones( $ids ) {
        $ids = explode( ".", $ids );
        if (!$ids) {
            return;
        }
        foreach ($ids as $id) {
            yii::app()->japi->call( $this->api["del"], array(
                "zone_id" => (int) $id
            ));
        }
        yii::app()->japi->send( true );
        return true;
    }
    
    public function getZone( $id ) {
        foreach ($this->getZones() as $item) {
            if ($item["zone_id"] == $id) {
                return $item;
            }
        }
        return null;
    }
    
    public function setZone() {
        $params = array("catalog_id" => (int) yii::app()->controller->param("catalog_id"));
        if ($id = (int) yii::app()->controller->param("id", 0)) {
            $params["zone_id"] = $id;
        }
        foreach ($this->attributes as $k => $v) {
            if ($k == "zone_id") {
                continue;
            }
            $param = yii::app()->controller->param( $k );
            if ($v["type"] == "int") {
                $param = (int) $param;
            }
            $params[ $k ] = $param;
        }
        return yii::app()->japi->callAndSend( $this->api["set"], $this->beforeSave($params) );
    }

    public function tarCategoryZones() {
        $list = new OSSList(
            array('useSort' => false)
        );
        $result = array();
        $params = array(
            'cat_idx' => (int) yii::app()->controller->param('cat_idx'),
            'fullsearch' => (string) yii::app()->controller->param('fullsearch'),
            'tar_id' => (int) yii::app()->controller->param('tar_id')
        );
        foreach ($this->api['tarCategory']['params'] as $k => $v) {
            $params[$k] = $v == 'int' ? (int) yii::app()->controller->param($k) : yii::app()->controller->param($k);
        }
        $data = $list->getList($this->api['tarCategory']['method'], $params);
        $data['result'] = $data['result']->getResult();
        foreach ($data['result'] as $item) {
            $result[] = $this->rowProcess($item);
        }
        $data['total'] = $data['total']->getResult();
        $data['result'] = $result;
        return $data;
    }
    
    public function beforeSave( $params ) {
        return $params;
    }
    
    public function setZones( $zones ) {
        foreach ($zones as $params) {
            yii::app()->japi->call($this->api["set"], $params);
        }
        yii::app()->japi->send( true );
    }
    
    public function CSVImport() {
        $this->setZones( $this->readCSVFile() );
    }
    
    public function readCSVFile() {
        $rows = array();
        foreach ($this->csv->CSVFileToArray( $this->loadCSVFile() ) as $line) {
            if ($line) {
                $rows[] = $this->createSetZoneRequestParametersFromCSVLine($line);
            }
        }
        return $rows;
    }
    
    private function createSetZoneRequestParametersFromCSVLine( $line ) {
        $params["catalog_id"] = $this->id;
        $attributeNames = array_keys( $this->attributes );
        foreach ($line as $index => $value) {
            $name = $attributeNames[ $index ];
            if ($name == "zone_id") {
                continue;
            }
            $params[ $name ] = $this->processAttributeForImport($name, $value);
        }
        return $params;
    }
    
    public function loadCSVFile() {
        return Uploader::get('catalogue');
    }
    
    public function CSVExport() {
        $array = array();
        foreach ($this->getZones() as $zone) {
            $array[] = $this->getCSVline($zone);
        }
        return $this->csv->arrayToCSV( $array );
    }
    
    private function getCSVline( $zone ) {
        $line = array();
        foreach (array_keys($this->attributes) as $name) {
            $line[] = $this->processAttributeForExport($name, $zone[$name]);
        }
        return $line;
    }
    
    private function processAttributeForImport( $name, $value ) {
        return $this->processAttribute($name, $value, "import");
    }
    
    private function processAttributeForExport( $name, $value ) {
        return $this->processAttribute($name, $value, "export");
    }
    
    private function processAttribute( $name, $value, $action ) {
        if ($this->attributes[ $name ]["type"] == "int") {
            $value = (int) $value;
        }
        if ($preprocess = $this->attributes[ $name ][$action]) {
            $value = $this->$preprocess($value);
        }
        return $value;
    }
    
    public function sendCSVHeaders() {
        $this->csv->sendCSVHeaders("catalogue.csv");
    }
    
    public static function factory( $config ) {
        if (!($class = self::$catalog_classes[ (int)$config["type"] ])) {
            throw new CHttpException(500, "invalid type");
        }
        $catalog = new $class($config);
        return $catalog;
    }
    
} ?>
